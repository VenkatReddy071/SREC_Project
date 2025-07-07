import { useEffect, useState, createContext, useContext, useRef } from "react";
import io from 'socket.io-client';

const DashboardSocketContext = createContext();

export const useDashboardSocket = () => {
    const context = useContext(DashboardSocketContext);
    if (context === undefined) {
        throw new Error("useDashboardSocket must be used within a DashboardSocketContextProvider");
    }
    return context;
};

export const DashboardSocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const socketRef = useRef(null);

    useEffect(() => {
        if (!import.meta.env.VITE_SERVER_URL) {
            console.error("VITE_SERVER_URL is not defined in your environment variables.");
            return;
        }

        const dashboardAuthToken = localStorage.getItem('dashboard');
        if (!dashboardAuthToken) {
            console.error("Dashboard authentication token is missing. Cannot connect Socket.IO for dashboard.");
            return;
        }

        if (!socketRef.current) {
            const newSocket = io(`${import.meta.env.VITE_SERVER_URL}`, {
                auth: {
                    token: dashboardAuthToken
                }
            });

            newSocket.on('connect', () => {
                console.log('Dashboard socket has been connected and authenticated.');
            });

            newSocket.on('connect_error', (err) => {
                console.error('Dashboard socket connection error:', err.message);
                if (err.message.includes('Authentication failed')) {
                    console.error('Please re-authenticate for dashboard access.');
                }
            });

            newSocket.on('dashboardConnected', (message) => {
                console.log('Backend confirmed dashboard connection:', message);
            });

            socketRef.current = newSocket;
            setSocket(newSocket);
        }

        return () => {
            if (socketRef.current) {
                console.log('Disconnecting dashboard socket...');
                socketRef.current.disconnect();
                socketRef.current = null;
                setSocket(null);
            }
        };
    }, [import.meta.env.VITE_SERVER_URL, localStorage.getItem('dashboardAuthToken')]);

    const data = {
        socket: socket,
    };

    return (
        <DashboardSocketContext.Provider value={data}>
            {children}
        </DashboardSocketContext.Provider>
    );
};