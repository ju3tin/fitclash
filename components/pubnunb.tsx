'use client';

import React, { useEffect, useRef, useState } from 'react';
import PubNub from 'pubnub';

const generateRandomUUID = () => {
  return 'user-' + Math.random().toString(36).substring(2, 10);
};

const MessageSender = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ text: string; sender: string }[]>([]);
  const [channel] = useState('my-channel');
  const [pubnub, setPubnub] = useState<PubNub | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const uuid = generateRandomUUID();

    const pn = new PubNub({
      publishKey: 'pub-c-69da0173-9e37-484b-9136-1c6fd880cfcd',
      subscribeKey: 'sub-c-2a6e471a-96d9-11e9-ab0f-d62d90a110cf',
      uuid,
    });

    pn.addListener({
      message: (event) => {
        const message = event.message as { text: string; sender: string };
        setMessages((prev) => [...prev, message]);
      },
    });

    pn.subscribe({ channels: [channel] });
    setPubnub(pn);

    return () => {
      pn.unsubscribeAll();
    };
  }, [channel]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!message || !pubnub) return;

    pubnub.publish(
      {
        channel,
        message: { text: message, sender: pubnub.getUUID() },
      },
      (status) => {
        if (status.error) {
          console.error('PubNub Publish Error:', status);
        } else {
          setMessage('');
        }
      }
    );
  };

  return (
    <div className="p-4 border rounded space-y-4 max-w-md w-full">
      <div className="h-64 overflow-y-auto border rounded p-2 bg-gray-50">
        {messages.map((msg, idx) => (
          <div key={idx} className="mb-2">
            <span className="font-semibold">{msg.sender}: </span>
            <span>{msg.text}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        className="w-full border rounded p-2"
      />
      <button
        onClick={sendMessage}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Send Message
      </button>
    </div>
  );
};

export default MessageSender;
