"use client"
import React, { createContext, useContext, useMemo } from 'react'
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => {
    const socket = useContext(SocketContext);
    return socket;
}

const SocketProvider = (props) => {
    const socket = useMemo(() => {
        if (typeof window !== 'undefined') {
            return io("webrtcsocket.onrender.com/");
        }
        return null;
    }, []);
    
    return (
        <SocketContext.Provider value={socket}>
            {props.children}
        </SocketContext.Provider>
    )
}

export default SocketProvider