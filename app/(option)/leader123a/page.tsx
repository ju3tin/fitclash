'use client';

import { useEffect, useState } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';

interface Player {
  wallet: string;
  score: number;
}

export default function HomePage() {
  const [leaderboard, setLeaderboard] = useState<Player[]>([]);
  const [gameType, setGameType] = useState('');
  const [loading, setLoading] = useState(true);

  const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
  const leaderboardPublicKey = new PublicKey('6oMKESixo7KsAd32dYVmxgkUf6cRaGe1w6We9pzDSVhx'); // Replace with your deployed account

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const accountInfo = await connection.getAccountInfo(leaderboardPublicKey);
        if (!accountInfo) {
          console.error('Leaderboard account not found.');
          setLoading(false);
          return;
        }

        const data = accountInfo.data;
        let offset = 8; // Anchor discriminator

        // Read game_type String
        const gameTypeLength = new DataView(data.buffer, offset, 4).getUint32(0, true);
        offset += 4;

        const gameTypeBytes = data.slice(offset, offset + gameTypeLength);
        const gameTypeDecoded = new TextDecoder().decode(gameTypeBytes);
        setGameType(gameTypeDecoded);
        offset += gameTypeLength;

        // Read players Vec<Player>
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
    };

    fetchLeaderboard();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-6">Solana Leaderboard</h1>
      <h2 className="text-2xl mb-4">Game: {gameType}</h2>
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
    </main>
  );
}
