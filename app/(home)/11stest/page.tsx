'use client'

import { useState } from 'react';
import useWebSocket from '../../hooks/useWebSocket';

const Home = () => {
    const { messages, sendMessage } = useWebSocket('ws://localhost:4000');
    const [input, setInput] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        sendMessage(input);
        setInput('');
    };

    return (
        <div>
            <h1>Real-time Chat</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button type="submit">Send</button>
            </form>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>{msg}</div>
                ))}
            </div>
        </div>
    );
};

export default Home;