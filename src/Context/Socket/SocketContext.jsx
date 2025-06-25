import { useEffect, useState, createContext, useContext, useRef } from "react"
import io from 'socket.io-client'
import axios from "axios"

const SocketContext = createContext();

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (context === undefined) {
        throw new Error("useSocket must be used within a SocketContextProvider");
    }
    return context;
}

export const SocketContextProvider = ({ children }) => {
    const socket = useRef(null);

    useEffect(() => {
        if (!import.meta.env.VITE_SERVER_URL) {
            console.error("VITE_SERVER_URL is not defined in your environment variables.");
            return;
        }

        if (!socket.current) {
            socket.current = io(`${import.meta.env.VITE_SERVER_URL}`);

            socket.current.on('connect', () => {
                console.log('socket has been connected..');
            });

            socket.current.on('connect_error', (err) => {
                console.log('socket connection error:', err.message);
            });
        }

        return () => {
            if (socket.current) {
                console.log('Disconnecting socket...');
                socket.current.disconnect();
                socket.current = null;
            }
        };
    }, []);

    const data = {
        socket: socket.current,
    };

    return (
        <>
            <SocketContext.Provider value={data}>
                {children}
            </SocketContext.Provider>
        </>
    )
}