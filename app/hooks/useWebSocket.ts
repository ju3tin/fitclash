import { useEffect, useState } from 'react';

const useWebSocket = (url: string) => {
    const [messages, setMessages] = useState<string[]>([]);
    const [ws, setWs] = useState<WebSocket | null>(null);

    useEffect(() => {
        const socket = new WebSocket(url);
        setWs(socket);

        socket.onmessage = (event) => {
            setMessages((prevMessages) => [...prevMessages, event.data]);
        };

        return () => {
            socket.close();
        };
    }, [url]);

    const sendMessage = (message: string) => {
        if (ws) {
            ws.send(message);
        }
    };

    return { messages, sendMessage };
};

export default useWebSocket; 