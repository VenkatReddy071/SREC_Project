
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaSpinner } from 'react-icons/fa';
import OrderCard from './OrderCard';
import { useDashboardSocket } from '../../../Context/Socket/DashboardContext';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const FashionOrdersList = ({ searchTerm, onViewDetails, setAlertMessage, setIsAlertModalOpen }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { socket } = useDashboardSocket();

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${SERVER_URL}/api/order/orders?Mall`, { withCredentials: true });
            setOrders(response.data?.data || []);
        } catch (error) {
            console.error("Error fetching fashion orders:", error);
            setAlertMessage("Failed to fetch fashion orders. Please check your network or API endpoint.");
            setIsAlertModalOpen(true);
        } finally {
            setLoading(false);
        }
    }, [setAlertMessage, setIsAlertModalOpen]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    // Socket listeners for real-time updates
    useEffect(() => {
        if (!socket) {
            console.warn("Socket connection not established for FashionOrdersList.");
            return;
        }

        const handleNewFashionOrder = (data) => {
            const newOrder = data.order;
            if (!newOrder || !newOrder._id) {
                console.warn("Received new fashion order without _id or invalid data:", data);
                return;
            }
            setOrders((prev) => {
                if (prev.some(order => order._id === newOrder._id)) {
                    return prev;
                }
                return [newOrder, ...prev];
            });
            toast.info(`New Fashion Order received from ${newOrder.customerName || 'a customer'}.`);
        };

        socket.on("newOrder_Mall", handleNewFashionOrder);

        return () => {
            socket.off("newOrder_Mall", handleNewFashionOrder);
        };
    }, [socket]);

    const filteredOrders = orders.filter(order => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return (
            (order._id && String(order._id).toLowerCase().includes(lowerCaseSearchTerm)) ||
            (order.customerName && order.customerName.toLowerCase().includes(lowerCaseSearchTerm)) ||
            (order.sourceId && String(order.sourceId).toLowerCase().includes(lowerCaseSearchTerm))
        );
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center h-48 text-gray-600">
                <FaSpinner className="animate-spin mr-2" size={30} /> Loading fashion orders...
            </div>
        );
    }

    if (filteredOrders.length === 0) {
        return (
            <div className="text-center text-gray-500 mt-8 p-4 border border-gray-200 rounded-md bg-gray-50">
                No fashion orders found or matching your search.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-6">
            {filteredOrders.map(order => (
                <OrderCard
                    key={order._id}
                    order={order}
                    activeTab="fashion"
                    onViewDetails={onViewDetails}
                />
            ))}
        </div>
    );
};

export default FashionOrdersList;