import React, { useState, useEffect } from 'react';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import {
    LayoutDashboard,
    ShoppingCart,
    UserPlus,
    Shirt,
    Stethoscope,
    MessageSquare,
    Users,
    Building,
    School,
    CalendarCheck,
    Clock,
    DollarSign,
    Package,
    HeartPulse,
    Mail,
    CalendarDays,
    CalendarCheck2,
    CalendarRange
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#d0ed57', '#a4de6c'];

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

export const Dashboard = () => {
    const [isLoadingOverview, setIsLoadingOverview] = useState(true);
    const [isLoadingCharts, setIsLoadingCharts] = useState(true);
    const [isLoadingRecentData, setIsLoadingRecentData] = useState(true);

    const [stats, setStats] = useState({
        totalRestaurantOrders: 0,
        totalFashionOrders: 0,
        totalHospitalBookings: 0,
        totalContacts: 0,
        restaurantsCount: 0,
        fashionStoresCount: 0,
        hospitalsCount: 0,
        schoolsCount: 0,
        newUsersCount: 0,
    });

    const [timeSummaries, setTimeSummaries] = useState({
        dailyRestaurantOrders: 0, dailyFashionOrders: 0, dailyHospitalBookings: 0, dailyContacts: 0,
        weeklyRestaurantOrders: 0, weeklyFashionOrders: 0, weeklyHospitalBookings: 0, weeklyContacts: 0,
        monthlyRestaurantOrders: 0, monthlyFashionOrders: 0, monthlyHospitalBookings: 0, monthlyContacts: 0,
    });

    const [restaurantOrderStatusData, setRestaurantOrderStatusData] = useState([]);
    const [fashionCategoryData, setFashionCategoryData] = useState([]);
    const [hospitalSpecializationData, setHospitalSpecializationData] = useState([]);
    const [contactTypeData, setContactTypeData] = useState([]);

    const [recentRestaurantOrders, setRecentRestaurantOrders] = useState([]);
    const [recentFashionOrders, setRecentFashionOrders] = useState([]);
    const [recentHospitalBookings, setRecentHospitalBookings] = useState([]);
    const [recentMessages, setRecentMessages] = useState([]);

    const API_BASE_URL = import.meta.env.VITE_SERVER_URL;

    useEffect(() => {
        const fetchAllDashboardData = async () => {
            const token = localStorage.getItem('dashboard');
            if (!token) {
                console.error('No authentication token found. Please log in as admin.');
                toast.error('Authentication required for admin dashboard.');
                setIsLoadingOverview(false);
                setIsLoadingCharts(false);
                setIsLoadingRecentData(false);
                return;
            }

            const config = {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            };

            setIsLoadingOverview(true);
            try {
                const overviewRes = await axios.get(`${API_BASE_URL}/api/admin-dashboard/overview`, config);
                setStats({
                    totalRestaurantOrders: overviewRes.data.totalRestaurantOrders,
                    totalFashionOrders: overviewRes.data.totalFashionOrders,
                    totalHospitalBookings: overviewRes.data.totalHospitalBookings,
                    totalContacts: overviewRes.data.totalContacts,
                    restaurantsCount: overviewRes.data.restaurantsCount,
                    fashionStoresCount: overviewRes.data.fashionStoresCount,
                    hospitalsCount: overviewRes.data.hospitalsCount,
                    schoolsCount: overviewRes.data.schoolsCount,
                    newUsersCount: overviewRes.data.newUsersCount,
                });
                setTimeSummaries({
                    dailyRestaurantOrders: overviewRes.data.dailyRestaurantOrders,
                    dailyFashionOrders: overviewRes.data.dailyFashionOrders,
                    dailyHospitalBookings: overviewRes.data.dailyHospitalBookings,
                    dailyContacts: overviewRes.data.dailyContacts,
                    weeklyRestaurantOrders: overviewRes.data.weeklyRestaurantOrders,
                    weeklyFashionOrders: overviewRes.data.weeklyFashionOrders,
                    weeklyHospitalBookings: overviewRes.data.weeklyHospitalBookings,
                    weeklyContacts: overviewRes.data.weeklyContacts,
                    monthlyRestaurantOrders: overviewRes.data.monthlyRestaurantOrders,
                    monthlyFashionOrders: overviewRes.data.monthlyFashionOrders,
                    monthlyHospitalBookings: overviewRes.data.monthlyHospitalBookings,
                    monthlyContacts: overviewRes.data.monthlyContacts,
                });
            } catch (error) {
                console.error('Error fetching overview data:', error);
                toast.error('Failed to load overview stats.');
            } finally {
                setIsLoadingOverview(false);
            }

            setIsLoadingCharts(true);
            try {
                const [
                    restaurantStatusRes,
                    fashionCategoryRes,
                    hospitalSpecializationRes,
                    contactTypeRes
                ] = await Promise.all([
                    axios.get(`${API_BASE_URL}/api/admin-dashboard/restaurant-order-status-distribution`, config),
                    axios.get(`${API_BASE_URL}/api/admin-dashboard/fashion-category-distribution`, config),
                    axios.get(`${API_BASE_URL}/api/admin-dashboard/hospital-specialization-distribution`, config),
                    axios.get(`${API_BASE_URL}/api/admin-dashboard/contact-type-distribution`, config)
                ]);
                setRestaurantOrderStatusData(restaurantStatusRes.data);
                setFashionCategoryData(fashionCategoryRes.data);
                setHospitalSpecializationData(hospitalSpecializationRes.data);
                setContactTypeData(contactTypeRes.data);
            } catch (error) {
                console.error('Error fetching chart data:', error);
                toast.error('Failed to load chart data.');
            } finally {
                setIsLoadingCharts(false);
            }

            setIsLoadingRecentData(true);
            try {
                const [
                    recentRestaurantOrdersRes,
                    recentFashionOrdersRes,
                    recentHospitalBookingsRes,
                    // recentMessagesRes
                ] = await Promise.all([
                    axios.get(`${API_BASE_URL}/api/admin-dashboard/recent-restaurant-orders`, config),
                    axios.get(`${API_BASE_URL}/api/admin-dashboard/recent-fashion-orders`, config),
                    axios.get(`${API_BASE_URL}/api/admin-dashboard/recent-hospital-bookings`, config),
                    // axios.get(`${API_BASE_URL}/api/admin-dashboard/recent-contacts`, config)
                ]);
                setRecentRestaurantOrders(recentRestaurantOrdersRes.data);
                setRecentFashionOrders(recentFashionOrdersRes.data);
                setRecentHospitalBookings(recentHospitalBookingsRes.data);
                // setRecentMessages(recentMessagesRes.data);
            } catch (error) {
                console.error('Error fetching recent data:', error);
                toast.error('Failed to load recent activity.');
            } finally {
                setIsLoadingRecentData(false);
            }
        };

        fetchAllDashboardData();
    }, [API_BASE_URL]);

    return (
        <div className="min-h-screen bg-gray-100 p-8 font-sans">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8 flex items-center">
                <LayoutDashboard className="w-10 h-10 mr-4 text-purple-600" /> Admin Dashboard Overview
            </h1>

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Restaurants"
                    value={stats.restaurantsCount}
                    icon={Building}
                    color="bg-purple-600"
                    isLoading={isLoadingOverview}
                />
                <StatCard
                    title="Total Fashion Stores"
                    value={stats.fashionStoresCount}
                    icon={Shirt}
                    color="bg-pink-600"
                    isLoading={isLoadingOverview}
                />
                <StatCard
                    title="Total Hospitals"
                    value={stats.hospitalsCount}
                    icon={HeartPulse}
                    color="bg-red-600"
                    isLoading={isLoadingOverview}
                />
                <StatCard
                    title="Total Schools/Colleges"
                    value={stats.schoolsCount}
                    icon={School}
                    color="bg-yellow-600"
                    isLoading={isLoadingOverview}
                />
                <StatCard
                    title="Total Restaurant Orders"
                    value={stats.totalRestaurantOrders}
                    icon={ShoppingCart}
                    color="bg-indigo-600"
                    isLoading={isLoadingOverview}
                />
                <StatCard
                    title="Total Fashion Orders"
                    value={stats.totalFashionOrders}
                    icon={Package}
                    color="bg-green-600"
                    isLoading={isLoadingOverview}
                />
                <StatCard
                    title="Total Hospital Bookings"
                    value={stats.totalHospitalBookings}
                    icon={CalendarCheck}
                    color="bg-blue-600"
                    isLoading={isLoadingOverview}
                />
                <StatCard
                    title="Total Contact Messages"
                    value={stats.totalContacts}
                    icon={MessageSquare}
                    color="bg-orange-600"
                    isLoading={isLoadingOverview}
                />
                <StatCard
                    title="New Users This Month"
                    value={stats.newUsersCount}
                    icon={UserPlus}
                    color="bg-teal-600"
                    isLoading={isLoadingOverview}
                />
            </section>

            <section className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Activity Summaries</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <StatCard title="Today's Food Orders" value={timeSummaries.dailyRestaurantOrders} icon={CalendarDays} color="bg-gray-700" isLoading={isLoadingOverview} />
                    <StatCard title="Today's Fashion Orders" value={timeSummaries.dailyFashionOrders} icon={CalendarDays} color="bg-gray-700" isLoading={isLoadingOverview} />
                    <StatCard title="Today's Hospital Bookings" value={timeSummaries.dailyHospitalBookings} icon={CalendarDays} color="bg-gray-700" isLoading={isLoadingOverview} />
                    <StatCard title="Today's New Contacts" value={timeSummaries.dailyContacts} icon={CalendarDays} color="bg-gray-700" isLoading={isLoadingOverview} />

                    <StatCard title="This Week's Food Orders" value={timeSummaries.weeklyRestaurantOrders} icon={CalendarCheck2} color="bg-yellow-700" isLoading={isLoadingOverview} />
                    <StatCard title="This Week's Fashion Orders" value={timeSummaries.weeklyFashionOrders} icon={CalendarCheck2} color="bg-yellow-700" isLoading={isLoadingOverview} />
                    <StatCard title="This Week's Hospital Bookings" value={timeSummaries.weeklyHospitalBookings} icon={CalendarCheck2} color="bg-yellow-700" isLoading={isLoadingOverview} />
                    <StatCard title="This Week's New Contacts" value={timeSummaries.weeklyContacts} icon={CalendarCheck2} color="bg-yellow-700" isLoading={isLoadingOverview} />

                    <StatCard title="This Month's Food Orders" value={timeSummaries.monthlyRestaurantOrders} icon={CalendarRange} color="bg-lime-700" isLoading={isLoadingOverview} />
                    <StatCard title="This Month's Fashion Orders" value={timeSummaries.monthlyFashionOrders} icon={CalendarRange} color="bg-lime-700" isLoading={isLoadingOverview} />
                    <StatCard title="This Month's Hospital Bookings" value={timeSummaries.monthlyHospitalBookings} icon={CalendarRange} color="bg-lime-700" isLoading={isLoadingOverview} />
                    <StatCard title="This Month's New Contacts" value={timeSummaries.monthlyContacts} icon={CalendarRange} color="bg-lime-700" isLoading={isLoadingOverview} />
                </div>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6 mb-8">
                <ChartCard title="Restaurant Order Status Distribution" isLoading={isLoadingCharts}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={restaurantOrderStatusData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                                nameKey="name"
                            >
                                {restaurantOrderStatusData.map((entry, index) => (
                                    <Cell key={`cell-restaurant-status-${index}`} fill={COLORS[index % COLORS.length]} />
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

                <ChartCard title="Fashion Order Category Distribution" isLoading={isLoadingCharts}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={fashionCategoryData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                                nameKey="name"
                            >
                                {fashionCategoryData.map((entry, index) => (
                                    <Cell key={`cell-fashion-category-${index}`} fill={COLORS[index % COLORS.length]} />
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

                <ChartCard title="Hospital Booking Specialization" isLoading={isLoadingCharts}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={hospitalSpecializationData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} interval={0} />
                            <YAxis />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.9)', border: '1px solid #ccc' }}
                                labelStyle={{ color: '#333' }}
                            />
                            <Legend />
                            <Bar dataKey="value" fill="#8884d8" name="Bookings">
                                {hospitalSpecializationData.map((entry, index) => (
                                    <Cell key={`bar-hospital-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Contact Message Type Distribution" isLoading={isLoadingCharts}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={contactTypeData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                                nameKey="name"
                            >
                                {contactTypeData.map((entry, index) => (
                                    <Cell key={`cell-contact-type-${index}`} fill={COLORS[index % COLORS.length]} />
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

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Restaurant Orders</h2>
                    {isLoadingRecentData ? (
                        <div className="space-y-4">
                            <SkeletonLoader className="h-10 w-full" /><SkeletonLoader className="h-10 w-full" />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {recentRestaurantOrders.length > 0 ? (
                                        recentRestaurantOrders.map((order) => (
                                            <tr key={order._id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order._id.slice(-6)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{order.totalAmount?.toFixed(2)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        order.orderStatus === 'Completed' || order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-800' :
                                                        order.orderStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                        {order.orderStatus}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="4" className="px-6 py-4 text-center text-gray-500">No recent restaurant orders.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Fashion Orders</h2>
                    {isLoadingRecentData ? (
                        <div className="space-y-4">
                            <SkeletonLoader className="h-10 w-full" /><SkeletonLoader className="h-10 w-full" />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {recentFashionOrders.length > 0 ? (
                                        recentFashionOrders.map((order) => (
                                            <tr key={order._id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order._id.slice(-6)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{order.totalAmount?.toFixed(2)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-800' :
                                                        order.orderStatus === 'Pending' || order.orderStatus === 'Shipped' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                        {order.orderStatus}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="4" className="px-6 py-4 text-center text-gray-500">No recent fashion orders.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="bg-white p-6 rounded-lg shadow-lg w-[900px]">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Hospital Bookings</h2>
                    {isLoadingRecentData ? (
                        <div className="space-y-4">
                            <SkeletonLoader className="h-10 w-full" /><SkeletonLoader className="h-10 w-full" />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {recentHospitalBookings.length > 0 ? (
                                        recentHospitalBookings.map((booking) => (
                                            <tr key={booking._id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking._id.slice(-6)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.specialization}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.Doctor?.name || 'N/A'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(booking.date).toLocaleDateString()}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        booking.status === 'Completed' || booking.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                                        booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                        {booking.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="5" className="px-6 py-4 text-center text-gray-500">No recent hospital bookings.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Patient/User Messages</h2>
                    {isLoadingRecentData ? (
                        <div className="space-y-4">
                            <SkeletonLoader className="h-10 w-full" /><SkeletonLoader className="h-10 w-full" />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sender</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {recentMessages.length > 0 ? (
                                        recentMessages.map((message) => (
                                            <tr key={message._id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{message.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{message.email}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {message.typeOf} {message.typeContact?.name ? `(${message.typeContact.name})` : ''}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{message.message.substring(0, 30)}{message.message.length > 30 ? '...' : ''}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(message.createdAt).toLocaleDateString()}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="5" className="px-6 py-4 text-center text-gray-500">No recent messages.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div> */}
            </section>
        </div>
    );
};

