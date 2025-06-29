// app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import PubNub from 'pubnub';
import { Suspense } from "react";
import HomeContent from "../../../components/test123b";

export default function GameRoomPage() {
  const searchParams = useSearchParams();
  const [digits] = useState(() => Math.floor(Math.random() * 9000000000) + 1000000000);
  const room = searchParams?.get('room') || `${digits}`;
  const uuid = searchParams?.get('uuid') || `player-${Math.floor(Math.random() * 10000)}`;

  const [messages, setMessages] = useState<string[]>([]);
  const [players, setPlayers] = useState<Set<string>>(new Set());
  const [input, setInput] = useState('');

  useEffect(() => {
    const pubnub = new PubNub({
      publishKey: 'pub-c-561a7378-fa06-4c50-a331-5c0056d0163c',
      subscribeKey: 'sub-c-17b7db8a-3915-11e4-9868-02ee2ddab7fe',
      uuid: uuid,
    });

    pubnub.subscribe({ channels: [room], withPresence: true });

    const listener = {
      message: (event: any) => {
        if (event.message && event.message.text) {
          const msg = `${event.publisher}: ${event.message.text}`;
          setMessages((prev) => [...prev, msg]);
        }
      },
      presence: (event: any) => {
        setPlayers((prev) => {
          const updated = new Set(prev);
          if (event.action === 'join') {
            updated.add(event.uuid);
          } else if (event.action === 'leave' || event.action === 'timeout') {
            updated.delete(event.uuid);
          }

          if (updated.size > 2) {
            alert('Room is full!');
            pubnub.unsubscribe({ channels: [room] });
          }

          return updated;
        });
      },
    };

    pubnub.addListener(listener);

    return () => {
      pubnub.removeListener(listener);
      pubnub.unsubscribeAll();
    };
  }, [room, uuid]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const pubnub = new PubNub({
      publishKey: 'pub-c-561a7378-fa06-4c50-a331-5c0056d0163c',
      subscribeKey: 'sub-c-17b7db8a-3915-11e4-9868-02ee2ddab7fe',
      uuid: uuid,
    });

    await pubnub.publish({
      channel: room,
      message: { text: input },
    });

    setInput('');
  };

  return (
    <div className="">
      <h1 className="text-2xl font-bold">Game Room: {room}</h1>
      <h2 className="text-lg">Your ID: {uuid}</h2>
      <h3 className="text-lg">Players in room: {players.size}</h3>
     
        <HomeContent digits={digits} room={room} />
     
      <div className="max-h-64 overflow-y-auto border p-4 rounded space-y-2">
        {messages.map((msg, idx) => (
          <div key={idx} className="p-2 bg-gray-100 rounded">
            {msg}
          </div>
        ))}
      </div>

      <div className="flex space-x-2">
        <input
          type="text"
          className="flex-1 p-2 border rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} className="p-2 bg-blue-500 text-white rounded">
          Send
        </button>
      </div>
    </div>

  );
}
