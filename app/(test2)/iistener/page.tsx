// app/page.tsx (Next.js 13+ App Router with TypeScript)
'use client';

import { useEffect, useState } from 'react';
import PubNub from 'pubnub';

export default function HomePage() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [uuid] = useState(`user-${Math.random().toString(16).slice(2)}`);
  const [channel] = useState('test-channel');

  useEffect(() => {
    const pubnub = new PubNub({
      publishKey: process.env.PUBNUB_PUBLISH_KEY as string,
      subscribeKey: process.env.PUBNUB_SUBSCRIBE_KEY as string,
      uuid: uuid,
    });

    // Subscribe to the channel
    pubnub.subscribe({ channels: [channel] });

    // Add a listener
    const listener = {
      message: (event: any) => {
        console.log('New Message:', event.message);
        setMessages((prev) => [...prev, event.message]);
      },
    };

    pubnub.addListener(listener);

    // Cleanup on unmount
    return () => {
      pubnub.removeListener(listener);
      pubnub.unsubscribeAll();
    };
  }, [channel, uuid]);

  // Send a message using the Next.js API
  const sendMessage = async () => {
    if (!input.trim()) return;

    await fetch(`/api/pubnub?channel=${channel}&uuid=${uuid}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input }),
    });

    setInput('');
  };

  return (
    <div className="p-8 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">PubNub Real-Time Chat</h1>
      <h2 className="text-lg">Channel: {channel}</h2>
      <h2 className="text-lg">UUID: {uuid}</h2>

      <div className="space-y-2 max-h-60 overflow-y-auto border p-4 rounded">
        {messages.map((msg, idx) => (
          <div key={idx} className="p-2 bg-gray-100 rounded">
            {typeof msg === 'object' ? JSON.stringify(msg) : msg}
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
