import React, { useEffect, useState, createContext, useContext } from 'react';
import axios from 'axios';
import {useSocket} from "./Socket/SocketContext.jsx";
import {toast} from "react-toastify"

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [userError, setUserError] = useState(null);
  const { socket } = useSocket();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoadingUser(true);
        setUserError(null);

        const url = `${import.meta.env.VITE_SERVER_URL}/api/check-session`;

        const response = await axios.get(url, { withCredentials: true });

        if (response.data && response.data.user) {
          setUserProfile(response.data.user);
          console.log("User profile fetched:", response.data.user);
        } else {
          setUserProfile(null);
          console.log("No active user session found.");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setUserProfile(null);
        setUserError(error);
      } finally {
        setIsLoadingUser(false);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    console.log("Socket in UserProvider useEffect:", socket);
    console.log("UserProfile in UserProvider useEffect:", userProfile);

    if (socket && userProfile?.id) {
        socket.emit("joinUser", userProfile.id);
        console.log(`Emitting 'joinUser' for ID: ${userProfile.id}`);

        const handleBooking = (message) => {
            console.log("Booking status update received:", message);
            toast.info("Your Hospital Booking Status is updated, check it please!");
        };

        socket.on("bookingStatus", handleBooking);

        return () => {
            console.log("Cleaning up socket listeners in UserProvider.");
            socket.off("bookingStatus", handleBooking);
        };
    }
  }, [socket, userProfile?.id]);

  const contextValue = {
    userProfile,
    userId: userProfile ? userProfile.id : null,
    userRole: userProfile ? userProfile.role : null,
    isLoadingUser,
    userError,
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};