'use client';

import { useEffect, useState } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';

interface UserScore {
  wallet: string;
  score: number;
}

export default function HomePage() {
  const [leaderboard, setLeaderboard] = useState<UserScore[]>([]);
  const [loading, setLoading] = useState(true);

  // Solana config
  const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
  const leaderboardPublicKey = new PublicKey('6oMKESixo7KsAd32dYVmxgkUf6cRaGe1w6We9pzDSVhx'); // Replace with your account

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
        let offset = 8; // Skip Anchor discriminator (8 bytes)

        // Example assumes:
        // - game_type: fixed 20 bytes string
        // - user_count: u32 (4 bytes)
        // - each user: 32 bytes wallet + 4 bytes score

        // Read game_type (skip it if not needed)
        const gameTypeBytes = data.slice(offset, offset + 20);
        const gameType = new TextDecoder().decode(gameTypeBytes).replace(/\0/g, '');
        offset += 20;

        // Read user count
        const userCount = new DataView(data.buffer).getUint32(offset, true);
        offset += 4;

        const users: UserScore[] = [];

        for (let i = 0; i < userCount; i++) {
          const walletBytes = data.slice(offset, offset + 32);
          const wallet = new PublicKey(walletBytes).toBase58();
          offset += 32;

          const score = new DataView(data.buffer).getUint32(offset, true);
          offset += 4;

          users.push({ wallet, score });
        }

        setLeaderboard(users);
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
      {loading ? (
        <p>Loading...</p>
      ) : leaderboard.length === 0 ? (
        <p>No scores found.</p>
      ) : (
        <ul className="space-y-2">
          {leaderboard.map((user, index) => (
            <li key={index} className="bg-gray-200 rounded p-4 w-80">
              <p className="font-mono text-sm truncate">{user.wallet}</p>
              <p className="text-lg font-semibold">Score: {user.score}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
