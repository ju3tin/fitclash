import React from 'react';

type Player = {
  id: number;
  name: string;
  score: number; 
};

const mockLeaderboard: Player[] = [
  { id: 1, name: 'Alice', score: 1200 },
  { id: 2, name: 'Bob', score: 1100 },
  { id: 3, name: 'Charlie', score: 1050 },
  { id: 4, name: 'Diana', score: 990 },
  { id: 5, name: 'Eve', score: 875 },
];

export default function LeaderboardPage() {
  return (
    <main style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>🏆 Leaderboard</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f0f0f0' }}>
            <th style={thStyle}>#</th>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Score</th>
          </tr>
        </thead>
        <tbody>
          {mockLeaderboard.map((player, index) => (
            <tr key={player.id} style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>
              <td style={tdStyle}>{index + 1}</td>
              <td style={tdStyle}>{player.name}</td>
              <td style={tdStyle}>{player.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

const thStyle: React.CSSProperties = {
  padding: '0.5rem',
  textAlign: 'left',
  fontWeight: 600,
};

const tdStyle: React.CSSProperties = {
  padding: '0.5rem',
};
