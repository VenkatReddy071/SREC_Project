import React, { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import axios from "axios";

const SkeletonLoader = ({ className = '' }) => (
    <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`}></div>
);

const StatCard = ({ title, value, icon: Icon, color, isLoading }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-lg flex items-center justify-between transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1">
            <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-500 mb-2">{title}</h3>
                {isLoading ? (
                    <SkeletonLoader className="h-8 w-3/4" />
                ) : (
                    <p className="text-3xl font-bold text-gray-800">{value}</p>
                )}
            </div>
            {Icon && (
                <div className={`p-3 rounded-full ${color}`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            )}
        </div>
    );
};

const SchoolCollegeOverview = () => {
    const [isLoadingStats, setIsLoadingStats] = useState(true);
    const [isLoadingRecentMessages, setIsLoadingRecentMessages] = useState(true);

    const [totalMessages, setTotalMessages] = useState(0);
    const [recentMessages, setRecentMessages] = useState([]);

    const API_BASE_URL = `${import.meta.env.VITE_SERVER_URL}/api/schools`; 

    useEffect(() => {
        const fetchDashboardData = async () => {
            const token = localStorage.getItem('dashboard');
            if (!token) {
                console.error('No authentication token found. Please log in.');
                return;
            }

            const config = {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            };

            try {
                setIsLoadingStats(true);
                const totalMessagesRes = await axios.get(`${API_BASE_URL}/school/total`, config);
                setTotalMessages(totalMessagesRes.data.totalMessages);
                setIsLoadingStats(false);

                setIsLoadingRecentMessages(true);
                const recentMessagesRes = await axios.get(`${API_BASE_URL}/school/recent`, config);
                setRecentMessages(recentMessagesRes.data);
                setIsLoadingRecentMessages(false);

            } catch (error) {
                console.error('Error fetching school/college dashboard data:', error);
                setIsLoadingStats(false);
                setIsLoadingRecentMessages(false);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-8 font-sans">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8">School/College Overview</h1>

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Messages"
                    value={totalMessages}
                    icon={MessageSquare}
                    color="bg-blue-600"
                    isLoading={isLoadingStats}
                />
            </section>

            <section className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Recent Contact Messages</h2>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    {isLoadingRecentMessages ? (
                        <div className="space-y-4">
                            <SkeletonLoader className="h-10 w-full" />
                            <SkeletonLoader className="h-10 w-full" />
                            <SkeletonLoader className="h-10 w-full" />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Message ID
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Sender Name
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Message Snippet
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Received At
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {recentMessages.length > 0 ? (
                                        recentMessages.map((message) => (
                                            <tr key={message._id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{message._id.slice(-6)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{message.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{message.email}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{message.message.substring(0, 50)}{message.message.length > 50 ? '...' : ''}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(message.createdAt).toLocaleString()}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-4 text-center text-gray-500">No recent messages found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default SchoolCollegeOverview;