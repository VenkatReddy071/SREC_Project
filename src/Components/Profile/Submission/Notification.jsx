import React, { useState, useEffect, useRef, useCallback } from "react";
import Axios from "axios";
import {
    FaRegBell, FaBell, FaCheckCircle, FaTrash, FaRegClock,
    FaEnvelope, FaShoppingCart, FaBullhorn, FaReply, FaInfoCircle, FaTimesCircle, FaLink
} from 'react-icons/fa';
import CustomModal from "../../../Pages/CustomModol";

const ITEMS_PER_LOAD = 10;

const UserNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState(null);

    const SERVER_URL = `${import.meta.env.VITE_SERVER_URL}`;

    const observer = useRef();
    const lastNotificationElementRef = useCallback(
        (node) => {
            if (isLoading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setCurrentPage((prevPage) => prevPage + 1);
                }
            });
            if (node) observer.current.observe(node);
        },
        [isLoading, hasMore]
    );

    const fetchNotifications = useCallback(async (page) => {
        setIsLoading(true);
        try {
            const response = await Axios.get(
                `${SERVER_URL}/api/notifications?page=${page}&limit=${ITEMS_PER_LOAD}`,
                {
                    withCredentials: true,
                }
            );

            const { notifications: fetchedNotifications, hasMore: fetchedHasMore } = response.data;

            if (page === 1) {
                setNotifications(fetchedNotifications);
            } else {
                setNotifications((prevNotifications) => [...prevNotifications, ...fetchedNotifications]);
            }

            setHasMore(fetchedHasMore);
        } catch (error) {
            console.error("Error fetching notifications:", error);
            setHasMore(false);
        } finally {
            setIsLoading(false);
            setInitialLoad(false);
        }
    }, [SERVER_URL]);

    useEffect(() => {
        fetchNotifications(currentPage);
    }, [currentPage, fetchNotifications]);

    const formatDateTime = (dateStr) => {
        if (!dateStr || isNaN(new Date(dateStr).getTime())) {
            return "N/A";
        }
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case "order_update": return <FaShoppingCart className="text-blue-500" />;
            case "new_message": return <FaEnvelope className="text-purple-500" />;
            case "promotion": return <FaBullhorn className="text-green-500" />;
            case "contact_response": return <FaReply className="text-orange-500" />;
            case "system_alert": return <FaInfoCircle className="text-red-500" />;
            default: return <FaRegBell className="text-gray-500" />;
        }
    };

    const markAsRead = async (id) => {
        try {
            await Axios.put(`${SERVER_URL}/api/notifications/${id}/read`, {}, { withCredentials: true });
            setNotifications((prev) =>
                prev.map((notif) => (notif._id === id ? { ...notif, isRead: true } : notif))
            );
            if (selectedNotification && selectedNotification._id === id) {
                setSelectedNotification((prev) => ({ ...prev, isRead: true }));
            }
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await Axios.put(`${SERVER_URL}/api/notifications/mark-all-read`, {}, { withCredentials: true });
            setNotifications((prev) =>
                prev.map((notif) => ({ ...notif, isRead: true }))
            );
        } catch (error) {
            console.error("Error marking all notifications as read:", error);
        }
    };

    const deleteNotification = async (id) => {
        try {
            await Axios.delete(`${SERVER_URL}/api/notifications/${id}`, { withCredentials: true });
            setNotifications((prev) => prev.filter((notif) => notif._id !== id));
            if (isModalOpen && selectedNotification?._id === id) {
                closeModal();
            }
        } catch (error) {
            console.error("Error deleting notification:", error);
        }
    };

    const openModal = (notification) => {
        setSelectedNotification(notification);
        setIsModalOpen(true);
        if (!notification.isRead) {
            markAsRead(notification._id);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedNotification(null);
    };

    return (
        <div className="w-full mx-auto px-4 bg-gray-50 min-h-screen py-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center border-b pb-4">Your Notifications</h1>

            <div className="flex justify-end mb-6">
                <button
                    onClick={markAllAsRead}
                    className="px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-semibold hover:bg-blue-600 transition-colors duration-200 shadow-md flex items-center"
                >
                    <FaCheckCircle className="mr-2" /> Mark All as Read
                </button>
            </div>

            {initialLoad && isLoading ? (
                <div className="text-center py-10 text-xl font-semibold text-gray-700 animate-pulse flex items-center justify-center">
                    <FaRegClock className="mr-2 animate-spin w-6 h-6" /> Loading your notifications...
                </div>
            ) : notifications.length > 0 ? (
                <>
                    <div className="space-y-4">
                        {notifications.map((notification, index) => {
                            const isLastNotification = notifications.length === index + 1;
                            const isUnread = !notification.isRead;

                            return (
                                <div
                                    key={notification._id}
                                    ref={isLastNotification ? lastNotificationElementRef : null}
                                    className={`bg-white border rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-4 flex items-center space-x-4
                                        ${isUnread ? 'border-blue-300 bg-blue-50' : 'border-gray-200'}
                                        cursor-pointer`}
                                    onClick={() => openModal(notification)}
                                >
                                    <div className="flex-shrink-0 text-2xl">
                                        {getNotificationIcon(notification.type)}
                                    </div>
                                    <div className="flex-grow">
                                        <div className="flex justify-between items-center">
                                            <h3 className={`font-semibold text-lg ${isUnread ? 'text-blue-800' : 'text-gray-800'}`}>
                                                {notification.title}
                                            </h3>
                                            {isUnread && (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    New
                                                </span>
                                            )}
                                        </div>
                                        <p className={`text-sm mt-1 ${isUnread ? 'text-blue-700' : 'text-gray-600'}`}>
                                            {notification.message.length > 100
                                                ? notification.message.substring(0, 100) + "..."
                                                : notification.message}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-2 flex items-center">
                                            <FaRegClock className="mr-1" /> {formatDateTime(notification.createdAt)}
                                        </p>
                                    </div>
                                    <div className="flex-shrink-0 flex flex-col space-y-2">
                                        {!notification.isRead && (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); markAsRead(notification._id); }}
                                                className="p-2 rounded-full bg-green-100 text-green-700 hover:bg-green-200 transition-colors duration-200"
                                                title="Mark as Read"
                                            >
                                                <FaCheckCircle />
                                            </button>
                                        )}
                                        <button
                                            onClick={(e) => { e.stopPropagation(); deleteNotification(notification._id); }}
                                            className="p-2 rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition-colors duration-200"
                                            title="Delete"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {isLoading && (
                        <div className="text-center py-4 text-gray-500 flex items-center justify-center">
                            <FaRegClock className="mr-2 animate-spin w-5 h-5" /> Loading more notifications...
                        </div>
                    )}
                    {!hasMore && !isLoading && notifications.length > 0 && (
                        <div className="text-center py-4 text-gray-500">You've seen all your notifications.</div>
                    )}
                </>
            ) : (
                <div className="py-10 text-center text-gray-600 text-lg">
                    No notifications found.
                </div>
            )}

            <CustomModal
                isOpen={isModalOpen}
                onClose={closeModal}
            >
                {selectedNotification && (
                    <div className="p-6 bg-white rounded-lg relative max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={closeModal}
                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-3xl transition-colors duration-200"
                            title="Close"
                        >
                            <FaTimesCircle className="w-8 h-8" />
                        </button>

                        <h2 className="text-2xl font-extrabold text-gray-900 mb-4 border-b pb-3 flex items-center">
                            {getNotificationIcon(selectedNotification.type)}
                            <span className="ml-3">{selectedNotification.title}</span>
                        </h2>

                        <div className="space-y-4 text-gray-700 text-sm">
                            <div>
                                <p className="font-semibold text-gray-600 flex items-center mb-1">
                                    <FaInfoCircle className="mr-2 text-teal-600 w-4 h-4" /> Message:
                                </p>
                                <p className="ml-5 leading-relaxed">{selectedNotification.message}</p>
                            </div>

                            {selectedNotification.link && (
                                <div>
                                    <p className="font-semibold text-gray-600 flex items-center mb-1">
                                        <FaLink className="mr-2 text-blue-500 w-4 h-4" /> Related Link:
                                    </p>
                                    <a
                                        href={selectedNotification.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="ml-5 text-blue-600 hover:underline break-all"
                                    >
                                        {selectedNotification.link}
                                    </a>
                                </div>
                            )}

                            <div>
                                <p className="font-semibold text-gray-600 flex items-center mb-1">
                                    <FaCalendarAlt className="mr-2 text-yellow-500 w-4 h-4" /> Received On:
                                </p>
                                <p className="ml-5">{formatDateTime(selectedNotification.createdAt)}</p>
                            </div>

                            <div className="flex justify-end space-x-3 mt-6 border-t pt-4">
                                {!selectedNotification.isRead && (
                                    <button
                                        onClick={() => markAsRead(selectedNotification._id)}
                                        className="px-4 py-2 bg-green-500 text-white rounded-full text-sm font-semibold hover:bg-green-600 transition-colors duration-200 shadow-md flex items-center"
                                    >
                                        <FaCheckCircle className="mr-2" /> Mark as Read
                                    </button>
                                )}
                                <button
                                    onClick={() => deleteNotification(selectedNotification._id)}
                                    className="px-4 py-2 bg-red-500 text-white rounded-full text-sm font-semibold hover:bg-red-600 transition-colors duration-200 shadow-md flex items-center"
                                >
                                    <FaTrash className="mr-2" /> Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </CustomModal>
        </div>
    );
};

export default UserNotifications;
