import React, { useState, useEffect } from 'react';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { Stethoscope, CalendarCheck, MessageSquare, UserPlus, HeartPulse, Clock, CalendarDays, CalendarCheck2, CalendarRange } from 'lucide-react';
import axios from "axios";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

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

const ChartCard = ({ title, isLoading, children, height = 300 }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
            {isLoading ? (
                <SkeletonLoader className={`h-[${height}px] w-full`} />
            ) : (
                <div style={{ width: '100%', height: height }}>
                    {children}
                </div>
            )}
        </div>
    );
};

const HospitalOverview = () => {
    const [isLoadingStats, setIsLoadingStats] = useState(true);
    const [isLoadingBookingTrend, setIsLoadingBookingTrend] = useState(true);
    const [isLoadingSpecializationPie, setIsLoadingSpecializationPie] = useState(true);
    const [isLoadingStatusPie, setIsLoadingStatusPie] = useState(true);
    const [isLoadingTimeSummaries, setIsLoadingTimeSummaries] = useState(true);
    const [isLoadingRecentBookings, setIsLoadingRecentBookings] = useState(true);
    const [isLoadingRecentMessages, setIsLoadingRecentMessages] = useState(true);

    const [totalBookings, setTotalBookings] = useState(0);
    const [newPatients, setNewPatients] = useState(0);
    const [totalMessages, setTotalMessages] = useState(0);
    const [pendingBookings, setPendingBookings] = useState(0);

    const [bookingTrendData, setBookingTrendData] = useState([]);
    const [specializationData, setSpecializationData] = useState([]);
    const [bookingStatusData, setBookingStatusData] = useState([]);

    const [dailySummary, setDailySummary] = useState({ totalBookings: 0, newPatients: 0 });
    const [weeklySummary, setWeeklySummary] = useState({ totalBookings: 0, newPatients: 0 });
    const [monthlySummary, setMonthlySummary] = useState({ totalBookings: 0, newPatients: 0 });

    const [recentBookings, setRecentBookings] = useState([]);
    const [recentMessages, setRecentMessages] = useState([]);

    const API_BASE_URL = `${import.meta.env.VITE_SERVER_URL}/api/hospital`;

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
                const statsRes = await axios.get(`${API_BASE_URL}/stats`, config);
                setTotalBookings(statsRes.data.totalBookings);
                setNewPatients(statsRes.data.newPatients);
                setTotalMessages(statsRes.data.totalMessages);
                setPendingBookings(statsRes.data.pendingBookings);
                setIsLoadingStats(false);

                setIsLoadingBookingTrend(true);
                const trendRes = await axios.get(`${API_BASE_URL}/daily-booking-trend`, config);
                console.log(trendRes.data);
                setBookingTrendData(trendRes.data);
                setIsLoadingBookingTrend(false);

                setIsLoadingSpecializationPie(true);
                const specializationRes = await axios.get(`${API_BASE_URL}/specialization-distribution`, config);
                setSpecializationData(specializationRes.data);
                setIsLoadingSpecializationPie(false);

                setIsLoadingStatusPie(true);
                const statusRes = await axios.get(`${API_BASE_URL}/booking-status-distribution`, config);
                setBookingStatusData(statusRes.data);
                setIsLoadingStatusPie(false);

                setIsLoadingTimeSummaries(true);
                const summariesRes = await axios.get(`${API_BASE_URL}/time-summaries`, config);
                setDailySummary(summariesRes.data.dailySummary);
                setWeeklySummary(summariesRes.data.weeklySummary);
                setMonthlySummary(summariesRes.data.monthlySummary);
                setIsLoadingTimeSummaries(false);

                setIsLoadingRecentBookings(true);
                const recentBookingsRes = await axios.get(`${API_BASE_URL}/recent-bookings`, config);
                setRecentBookings(recentBookingsRes.data);
                setIsLoadingRecentBookings(false);

                setIsLoadingRecentMessages(true);
                const recentMessagesRes = await axios.get(`${API_BASE_URL}/recent-messages`, config);
                setRecentMessages(recentMessagesRes.data);
                setIsLoadingRecentMessages(false);

            } catch (error) {
                console.error('Error fetching hospital dashboard data:', error);
                setIsLoadingStats(false);
                setIsLoadingBookingTrend(false);
                setIsLoadingCategoryPie(false);
                setIsLoadingPaymentPie(false);
                setIsLoadingTimeSummaries(false);
                setIsLoadingRecentBookings(false);
                setIsLoadingRecentMessages(false);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-8 font-sans">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Hospital Overview</h1>

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Bookings"
                    value={totalBookings}
                    icon={CalendarCheck}
                    color="bg-indigo-600"
                    isLoading={isLoadingStats}
                />
                <StatCard
                    title="New Patients"
                    value={newPatients}
                    icon={UserPlus}
                    color="bg-green-600"
                    isLoading={isLoadingStats}
                />
                <StatCard
                    title="Total Messages"
                    value={totalMessages}
                    icon={MessageSquare}
                    color="bg-blue-600"
                    isLoading={isLoadingStats}
                />
                <StatCard
                    title="Pending Bookings"
                    value={pendingBookings}
                    icon={Clock}
                    color="bg-orange-600"
                    isLoading={isLoadingStats}
                />
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <ChartCard title="Daily Bookings & New Patients Trend" isLoading={isLoadingBookingTrend}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={bookingTrendData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <XAxis dataKey="name" />
                            <YAxis yAxisId="left" orientation="left" stroke="#0088FE" />
                            <YAxis yAxisId="right" orientation="right" stroke="#00C49F" />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.9)', border: '1px solid #ccc' }}
                                labelStyle={{ color: '#333' }}
                            />
                            <Legend />
                            <Bar yAxisId="left" dataKey="bookings" fill="#0088FE" name="Bookings" radius={[5, 5, 0, 0]} />
                            <Bar yAxisId="right" dataKey="newPatients" fill="#00C49F" name="New Patients" radius={[5, 5, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Bookings by Specialization" isLoading={isLoadingSpecializationPie}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={specializationData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                                nameKey="name"
                            >
                                {specializationData.map((entry, index) => (
                                    <Cell key={`cell-specialization-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.9)', border: '1px solid #ccc' }}
                                labelStyle={{ color: '#333' }}
                            />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Booking Status Distribution" isLoading={isLoadingStatusPie}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={bookingStatusData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                                nameKey="name"
                            >
                                {bookingStatusData.map((entry, index) => (
                                    <Cell key={`cell-status-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.9)', border: '1px solid #ccc' }}
                                labelStyle={{ color: '#333' }}
                            />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartCard>
            </section>

            <section className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Booking Summaries</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <StatCard
                        title="Today's Bookings"
                        value={dailySummary.totalBookings}
                        icon={CalendarDays}
                        color="bg-purple-600"
                        isLoading={isLoadingTimeSummaries}
                    />
                    <StatCard
                        title="Today's New Patients"
                        value={dailySummary.newPatients}
                        icon={UserPlus}
                        color="bg-purple-600"
                        isLoading={isLoadingTimeSummaries}
                    />
                    <StatCard
                        title="This Week's Bookings"
                        value={weeklySummary.totalBookings}
                        icon={CalendarCheck2}
                        color="bg-red-500"
                        isLoading={isLoadingTimeSummaries}
                    />
                    <StatCard
                        title="This Week's New Patients"
                        value={weeklySummary.newPatients}
                        icon={UserPlus}
                        color="bg-red-500"
                        isLoading={isLoadingTimeSummaries}
                    />
                    <StatCard
                        title="This Month's Bookings"
                        value={monthlySummary.totalBookings}
                        icon={CalendarRange}
                        color="bg-teal-500"
                        isLoading={isLoadingTimeSummaries}
                    />
                    <StatCard
                        title="This Month's New Patients"
                        value={monthlySummary.newPatients}
                        icon={UserPlus}
                        color="bg-teal-500"
                        isLoading={isLoadingTimeSummaries}
                    />
                </div>
            </section>

            <section className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Recent Bookings</h2>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    {isLoadingRecentBookings ? (
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
                                            Booking ID
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Patient Name
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Specialization
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Doctor
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {recentBookings.length > 0 ? (
                                        recentBookings.map((booking) => (
                                            <tr key={booking._id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking._id.slice(-6)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.specialization.join(', ')}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.Doctor?.name || 'N/A'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(booking.date).toLocaleDateString()}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                                        ${booking.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                                            booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                                booking.status === 'Approved' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                                                        {booking.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-4 text-center text-gray-500">No recent bookings found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </section>

            <section className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Recent Patient Messages</h2>
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

export default HospitalOverview;