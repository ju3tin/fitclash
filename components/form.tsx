'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import GameSelector from './red1';

type Game = {
  id: string;
  title: string;
  image: string;
};

interface FormProps {
  setOverlayVisible: (visible: boolean) => void; // Define the prop type
  onSelect: (game: Game) => void; // Add onSelect to the props
}

const Form: React.FC<FormProps> = ({ setOverlayVisible, onSelect }) => {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle form submission logic here
    setOverlayVisible(false);
  };

  const [games, setGames] = useState<Game[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  // State for duration
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(30); // Default to 30 minutes
  const [seconds, setSeconds] = useState<number>(0);
  
  // State for bet amount
  const [betAmount, setBetAmount] = useState<number>(0); // Default bet amount

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
    <>
      <div id="overlay" onClick={handleSubmit}>
        <div className="grid grid-cols-1 gap-4">
          <div id="text">What Game Do You Want To Play</div>
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
        
        <div className="grid grid-cols-1 gap-4 mt-4">
          <div id="text">Select Duration:</div>
          <div className="flex space-x-2">
            <select
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              className="border rounded p-2"
            >
              {[...Array(24).keys()].map((h) => (
                <option key={h} value={h}>{h} hour{h !== 1 ? 's' : ''}</option>
              ))}
            </select>
            <select
              value={minutes}
              onChange={(e) => setMinutes(Number(e.target.value))}
              className="border rounded p-2"
            >
              {[...Array(60).keys()].map((m) => (
                <option key={m} value={m}>{m} minute{m !== 1 ? 's' : ''}</option>
              ))}
            </select>
            <select
              value={seconds}
              onChange={(e) => setSeconds(Number(e.target.value))}
              className="border rounded p-2"
            >
              {[...Array(60).keys()].map((s) => (
                <option key={s} value={s}>{s} second{ s !== 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 mt-4">
          <div id="text">Enter Bet Amount (in SOL):</div>
          <input
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(Number(e.target.value))}
            className="border rounded p-2"
            placeholder="Enter amount in SOL"
          />
        </div>
      </div>
    </>
  );
};

export default Form;
    