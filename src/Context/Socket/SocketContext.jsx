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
    const [socket, setSocket] = useState(null);
    const socketRef = useRef(null);

    useEffect(() => {
        if (!import.meta.env.VITE_SERVER_URL) {
            console.error("VITE_SERVER_URL is not defined in your environment variables.");
            return;
        }

        if (!socketRef.current) {
            const newSocket = io(`${import.meta.env.VITE_SERVER_URL}`);

            newSocket.on('connect', () => {
                console.log('socket has been connected..');
            });

            newSocket.on('connect_error', (err) => {
                console.log('socket connection error:', err.message);
            });

            socketRef.current = newSocket;
            setSocket(newSocket);
        }

        return () => {
            if (socketRef.current) {
                console.log('Disconnecting socket...');
                socketRef.current.disconnect();
                socketRef.current = null;
                setSocket(null);
            }
        };
    }, []);

    const data = {
        socket: socket,
    };

    console.log(data);

    return (
        <SocketContext.Provider value={data}>
            {children}
        </SocketContext.Provider>
    );
}