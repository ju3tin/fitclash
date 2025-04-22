'use client';

import React, { useEffect, useState } from 'react';

type Game = {
  id: string;
  title: string;
  image: string;
};

interface FormProps {
  setOverlayVisible: (visible: boolean) => void;
  onSelect: (game: Game, betAmount: number, duration: { hours: number; minutes: number; seconds: number }) => void;
}

const Form: React.FC<FormProps> = ({ setOverlayVisible, onSelect }) => {
  const [games, setGames] = useState<Game[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [betAmount, setBetAmount] = useState<number>(0);
  const [step, setStep] = useState<number>(0);

  useEffect(() => {
    fetch('/api/game')
      .then(res => res.json())
      .then(data => setGames(data))
      .catch(err => console.error('Failed to fetch games:', err));
  }, []);

  const handleSelect = (game: Game) => {
    setSelectedId(game.id);
  };

  const handleSubmit = (event?: React.FormEvent) => {
    if (event) event.preventDefault();
    const selectedGame = games.find(game => game.id === selectedId);
    if (!selectedGame || betAmount <= 0) return;

    onSelect(selectedGame, betAmount, { hours, minutes, seconds });
    setOverlayVisible(false);
  };

  const isLastStep = step === 2;

  return (
    <div id="overlay" className="p-4 space-y-6">
      {/* Step 0 - Select Game */}
      {step === 0 && (
        <div className="grid grid-cols-1 gap-4">
          <div className="text-lg font-semibold">What Game Do You Want To Play</div>
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
      )}

      {/* Step 1 - Duration */}
      {step === 1 && (
        <div className="grid grid-cols-1 gap-4">
          <div className="text-lg font-semibold">Select Duration:</div>
          <div className="flex space-x-2">
            <select value={hours} onChange={(e) => setHours(Number(e.target.value))} className="border rounded p-2">
              {[...Array(24).keys()].map(h => (
                <option key={h} value={h}>{h} hour{h !== 1 ? 's' : ''}</option>
              ))}
            </select>
            <select value={minutes} onChange={(e) => setMinutes(Number(e.target.value))} className="border rounded p-2">
              {[...Array(60).keys()].map(m => (
                <option key={m} value={m}>{m} minute{m !== 1 ? 's' : ''}</option>
              ))}
            </select>
            <select value={seconds} onChange={(e) => setSeconds(Number(e.target.value))} className="border rounded p-2">
              {[...Array(60).keys()].map(s => (
                <option key={s} value={s}>{s} second{s !== 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Step 2 - Bet Amount */}
      {step === 2 && (
        <div className="grid grid-cols-1 gap-4">
          <div className="text-lg font-semibold">Enter Bet Amount (in SOL):</div>
          <input
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(Number(e.target.value))}
            className="border rounded p-2"
            placeholder="Enter amount in SOL"
            min="0"
          />
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        {step > 0 && (
          <button
            type="button"
            className="px-4 py-2 border rounded hover:bg-gray-100"
            onClick={() => setStep(step - 1)}
          >
            Back
          </button>
        )}
        {!isLastStep && (
          <button
            type="button"
            className="ml-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => setStep(step + 1)}
            disabled={step === 0 && !selectedId}
          >
            Next
          </button>
        )}
        {isLastStep && (
          <button
            type="button"
            onClick={handleSubmit}
            className="ml-auto px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            disabled={betAmount <= 0}
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default Form;
