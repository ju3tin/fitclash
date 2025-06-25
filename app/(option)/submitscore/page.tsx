'use client';

import { useEffect, useState, useCallback } from 'react';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import * as anchor from '@project-serum/anchor';

interface Player {
  wallet: string;
  score: number;
}

export default function HomePage() {
  const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
  const wallet = useWallet();

  const [leaderboard, setLeaderboard] = useState<Player[]>([]);
  const [gameType, setGameType] = useState('');
  const [loading, setLoading] = useState(true);
  const [scoreInput, setScoreInput] = useState('');

  const programId = new PublicKey('9g7ioyGnNn3yNEJ3BBt76qiuzhadaANgFH6oWLxm7EhJ'); // Replace
  const leaderboardPublicKey = new PublicKey('6oMKESixo7KsAd32dYVmxgkUf6cRaGe1w6We9pzDSVhx'); // Replace

  // Anchor provider
  const provider = new anchor.AnchorProvider(connection, wallet as any, { preflightCommitment: 'processed' });
  const idl = require('../../../idl/idl.json'); // Adjust path to your IDL file
  const program = new anchor.Program(idl, programId, provider);

  const fetchLeaderboard = useCallback(async () => {
    try {
      const accountInfo = await connection.getAccountInfo(leaderboardPublicKey);
      if (!accountInfo) {
        console.error('Leaderboard account not found.');
        setLoading(false);
        return;
      }

      const data = accountInfo.data;
      let offset = 8;

      const gameTypeLength = new DataView(data.buffer, offset, 4).getUint32(0, true);
      offset += 4;

      const gameTypeBytes = data.slice(offset, offset + gameTypeLength);
      const gameTypeDecoded = new TextDecoder().decode(gameTypeBytes);
      setGameType(gameTypeDecoded);
      offset += gameTypeLength;

      const playerCount = new DataView(data.buffer, offset, 4).getUint32(0, true);
      offset += 4;

      const players: Player[] = [];

      for (let i = 0; i < playerCount; i++) {
        const walletBytes = data.slice(offset, offset + 32);
        const wallet = new PublicKey(walletBytes).toBase58();
        offset += 32;

        const score = new DataView(data.buffer, offset, 8).getBigUint64(0, true);
        offset += 8;

        players.push({ wallet, score: Number(score) });
      }

      setLeaderboard(players);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  }, [connection, leaderboardPublicKey]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const submitScore = async () => {
    if (!wallet.connected) {
      alert('Please connect your wallet first.');
      return;
    }

    try {
      const score = parseInt(scoreInput);
      if (isNaN(score)) {
        alert('Please enter a valid score.');
        return;
      }

      await program.methods
        .submitScore(new anchor.BN(score))
        .accounts({
          leaderboard: leaderboardPublicKey,
          user: wallet.publicKey!,
        })
        .rpc();

      alert('Score submitted successfully!');
      fetchLeaderboard();
    } catch (error) {
      console.error('Error submitting score:', error);
      alert('Failed to submit score.');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 space-y-6">
      <h1 className="text-4xl font-bold">Solana Leaderboard</h1>
      <h2 className="text-2xl">Game: {gameType}</h2>
      <WalletMultiButton />
      {loading ? (
        <p>Loading...</p>
      ) : leaderboard.length === 0 ? (
        <p>No scores found.</p>
      ) : (
        <ul className="space-y-2">
          {leaderboard.map((player, index) => (
            <li key={index} className="rounded p-4 w-80">
              <p className="font-mono text-sm truncate">{player.wallet}</p>
              <p className="text-lg font-semibold">Score: {player.score}</p>
            </li>
          ))}
        </ul>
      )}
      <div className="flex flex-col items-center space-y-4">
        <input
          type="number"
          placeholder="Enter your score"
          value={scoreInput}
          onChange={(e) => setScoreInput(e.target.value)}
          className="border p-2 rounded"
        />
        <button onClick={submitScore} className="bg-blue-500 text-white px-4 py-2 rounded">
          Submit Score
        </button>
      </div>
    </main>
  );
}
