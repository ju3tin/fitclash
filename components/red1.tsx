'use client';

import { useEffect, useState } from 'react';

type Game = {
  id: string;
  title: string;
  image: string;
};

export default function GameSelector({ onSelect }: { onSelect: (game: Game) => void }) {
  const [games, setGames] = useState<Game[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    // Replace with your actual GET endpoint
    fetch('/api/game')
      .then(res => res.json())
      .then(data => setGames(data))
      .catch(err => console.error('Failed to fetch games:', err));
  }, []);

  const handleSelect = (game: Game) => {
    setSelectedId(game.id);
    onSelect(game);
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {games.map((game) => (
        <div
          key={game.id}
          className={`border rounded p-2 cursor-pointer transition hover:shadow-md ${
            selectedId === game.id ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-300'
          }`}
          onClick={() => handleSelect(game)}
        >
          <img src={game.image} alt={game.title} className="w-full h-32 object-cover rounded" />
          <p className="text-center mt-2">{game.title}</p>
        </div>
      ))}
    </div>
  );
}
