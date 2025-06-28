import React, { useState, useEffect } from 'react';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { DollarSign, Package, TrendingUp, CheckCircle, Clock, CalendarDays, CalendarCheck, CalendarRange } from 'lucide-react';
import axios from "axios"; // Ensure axios is imported

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00C49F', '#FFBB28', '#FF8042'];

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

const ResOverview = () => {
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingOrderChart, setIsLoadingOrderChart] = useState(true);
  const [isLoadingCategoryPie, setIsLoadingCategoryPie] = useState(true);
  const [isLoadingPaymentPie, setIsLoadingPaymentPie] = useState(true);
  const [isLoadingTimeSummaries, setIsLoadingTimeSummaries] = useState(true);
  const [isLoadingRecentOrders, setIsLoadingRecentOrders] = useState(true);

  const [totalOrders, setTotalOrders] = useState(0);
  const [newOrders, setNewOrders] = useState(0);
  const [completedOrders, setCompletedOrders] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);

  const [orderTrendData, setOrderTrendData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [paymentMethodData, setPaymentMethodData] = useState([]);

  const [dailySummary, setDailySummary] = useState({ totalOrders: 0, totalRevenue: 0 });
  const [weeklySummary, setWeeklySummary] = useState({ totalOrders: 0, totalRevenue: 0 });
  const [monthlySummary, setMonthlySummary] = useState({ totalOrders: 0, totalRevenue: 0 });

  const [recentOrders, setRecentOrders] = useState([]);

  const API_BASE_URL =`${import.meta.env.VITE_SERVER_URL}/api`;

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('dashboard');
      console.log(token);
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
        const statsRes = await axios.get(`${API_BASE_URL}/mall/stats`, config);
        console.log(statsRes);
        setTotalOrders(statsRes.data.totalOrders);
        setNewOrders(statsRes.data.newOrders);
        setCompletedOrders(statsRes.data.completedOrders);
        setPendingOrders(statsRes.data.pendingOrders);
        setIsLoadingStats(false);

        // Fetch Daily Trend
        setIsLoadingOrderChart(true);
        const trendRes = await axios.get(`${API_BASE_URL}/mall/daily-trend`, config);
        setOrderTrendData(trendRes.data);
        setIsLoadingOrderChart(false);

        // Fetch Category Distribution
        setIsLoadingCategoryPie(true);
        const categoryRes = await axios.get(`${API_BASE_URL}/mall/category-distribution`, config);
        setCategoryData(categoryRes.data);
        setIsLoadingCategoryPie(false);

        // Fetch Payment Distribution
        setIsLoadingPaymentPie(true);
        const paymentRes = await axios.get(`${API_BASE_URL}/mall/payment-distribution`, config);
        setPaymentMethodData(paymentRes.data);
        setIsLoadingPaymentPie(false);

        // Fetch Time Summaries
        setIsLoadingTimeSummaries(true);
        const summariesRes = await axios.get(`${API_BASE_URL}/mall/time-summaries`, config);
        setDailySummary(summariesRes.data.dailySummary);
        setWeeklySummary(summariesRes.data.weeklySummary);
        setMonthlySummary(summariesRes.data.monthlySummary);
        setIsLoadingTimeSummaries(false);

        // Fetch Recent Orders
        setIsLoadingRecentOrders(true);
        const recentOrdersRes = await axios.get(`${API_BASE_URL}/mall/recent-orders`, config);
        setRecentOrders(recentOrdersRes.data);
        setIsLoadingRecentOrders(false);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // It's good practice to set loading states to false even on error
        setIsLoadingStats(false);
        setIsLoadingOrderChart(false);
        setIsLoadingCategoryPie(false);
        setIsLoadingPaymentPie(false);
        setIsLoadingTimeSummaries(false);
        setIsLoadingRecentOrders(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">


      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Orders"
          value={totalOrders}
          icon={Package}
          color="bg-indigo-500"
          isLoading={isLoadingStats}
        />
        <StatCard
          title="New Orders"
          value={newOrders}
          icon={TrendingUp}
          color="bg-green-500"
          isLoading={isLoadingStats}
        />
        <StatCard
          title="Completed Orders"
          value={completedOrders}
          icon={CheckCircle}
          color="bg-blue-500"
          isLoading={isLoadingStats}
        />
        <StatCard
          title="Pending Orders"
          value={pendingOrders}
          icon={Clock}
          color="bg-orange-500"
          isLoading={isLoadingStats}
        />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ChartCard title="Daily Order & Revenue Trend" isLoading={isLoadingOrderChart}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={orderTrendData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip
                contentStyle={{ borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.9)', border: '1px solid #ccc' }}
                labelStyle={{ color: '#333' }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="orders" fill="#8884d8" name="Orders" radius={[5, 5, 0, 0]} />
              <Bar yAxisId="right" dataKey="revenue" fill="#82ca9d" name="Revenue ($)" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Order Distribution by Category" isLoading={isLoadingCategoryPie}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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

        <ChartCard title="Order Distribution by Payment Method" isLoading={isLoadingPaymentPie}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={paymentMethodData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
              >
                {paymentMethodData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Order Summaries</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Today's Orders"
            value={dailySummary.totalOrders}
            icon={CalendarDays}
            color="bg-purple-600"
            isLoading={isLoadingTimeSummaries}
          />
          <StatCard
            title="Today's Revenue ($)"
            value={dailySummary.totalRevenue}
            icon={DollarSign}
            color="bg-purple-600"
            isLoading={isLoadingTimeSummaries}
          />
          <StatCard
            title="This Week's Orders"
            value={weeklySummary.totalOrders}
            icon={CalendarCheck}
            color="bg-red-500"
            isLoading={isLoadingTimeSummaries}
          />
          <StatCard
            title="This Week's Revenue ($)"
            value={weeklySummary.totalRevenue}
            icon={DollarSign}
            color="bg-red-500"
            isLoading={isLoadingTimeSummaries}
          />
          <StatCard
            title="This Month's Orders"
            value={monthlySummary.totalOrders}
            icon={CalendarRange}
            color="bg-teal-500"
            isLoading={isLoadingTimeSummaries}
          />
          <StatCard
            title="This Month's Revenue ($)"
            value={monthlySummary.totalRevenue?.toFixed(2)}
            icon={DollarSign}
            color="bg-teal-500"
            isLoading={isLoadingTimeSummaries}
          />
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Recent  Orders</h2>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          {isLoadingRecentOrders ? (
            <div className="space-y-4">
              <SkeletonLoader className="h-10 w-full" />
              <SkeletonLoader className="h-10 w-full" />
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
                      Order ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentOrders.length > 0 ? (
                    recentOrders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id.slice(-6)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.item}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${order.amount.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                            ${order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                              order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                              order.status === 'New' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.time}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-gray-500">No recent orders found.</td>
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

export default ResOverview;