import React, { useState, useEffect } from 'react';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { DollarSign, Package, TrendingUp, CheckCircle, Clock, CalendarDays, CalendarCheck, CalendarRange } from 'lucide-react';

const dummyOrderData = [
  { name: 'Mon', orders: 120, revenue: 1200 },
  { name: 'Tue', orders: 150, revenue: 1550 },
  { name: 'Wed', orders: 100, revenue: 980 },
  { name: 'Thu', orders: 180, revenue: 1900 },
  { name: 'Fri', orders: 250, revenue: 2800 },
  { name: 'Sat', orders: 300, revenue: 3200 },
  { name: 'Sun', orders: 200, revenue: 2100 },
];

const dummyCategoryData = [
  { name: 'Appetizers', value: 300 },
  { name: 'Main Courses', value: 500 },
  { name: 'Drinks', value: 200 },
  { name: 'Desserts', value: 150 },
];

const dummyPaymentMethodData = [
  { name: 'Cash', value: 400 },
  { name: 'Credit Card', value: 600 },
  { name: 'Online Payment', value: 350 },
];

const dummyDailySummary = { totalOrders: 250, totalRevenue: 2500 };
const dummyWeeklySummary = { totalOrders: 1500, totalRevenue: 15000 };
const dummyMonthlySummary = { totalOrders: 6000, totalRevenue: 60000 };

const dummyRecentOrders = [
  { id: 'ORD001', item: 'Pepperoni Pizza', amount: 25.00, status: 'Completed', time: '10:30 AM' },
  { id: 'ORD002', item: 'Chicken Burger', amount: 15.50, status: 'Pending', time: '11:15 AM' },
  { id: 'ORD003', item: 'Veggie Wrap', amount: 12.00, status: 'Completed', time: '11:45 AM' },
  { id: 'ORD004', item: 'Fries & Coke', amount: 8.75, status: 'New', time: '12:05 PM' },
  { id: 'ORD005', item: 'Pasta Carbonara', amount: 22.00, status: 'Completed', time: '12:30 PM' },
];

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

  const [dailySummary, setDailySummary] = useState({ totalOrders: 0, totalRevenue: 0 });
  const [weeklySummary, setWeeklySummary] = useState({ totalOrders: 0, totalRevenue: 0 });
  const [monthlySummary, setMonthlySummary] = useState({ totalOrders: 0, totalRevenue: 0 });

  useEffect(() => {
    const loadStats = setTimeout(() => {
      setTotalOrders(dummyOrderData.reduce((acc, curr) => acc + curr.orders, 0));
      setNewOrders(55);
      setCompletedOrders(dummyOrderData.reduce((acc, curr) => acc + curr.orders, 0) - 150);
      setPendingOrders(150);
      setIsLoadingStats(false);
    }, 1000);

    const loadOrderChart = setTimeout(() => {
      setIsLoadingOrderChart(false);
    }, 1500);

    const loadCategoryPie = setTimeout(() => {
      setIsLoadingCategoryPie(false);
    }, 2000);

    const loadPaymentPie = setTimeout(() => {
      setIsLoadingPaymentPie(false);
    }, 2500);

    const loadTimeSummaries = setTimeout(() => {
      setDailySummary(dummyDailySummary);
      setWeeklySummary(dummyWeeklySummary);
      setMonthlySummary(dummyMonthlySummary);
      setIsLoadingTimeSummaries(false);
    }, 3000);

    const loadRecentOrders = setTimeout(() => {
      setIsLoadingRecentOrders(false);
    }, 3500);

    return () => {
      clearTimeout(loadStats);
      clearTimeout(loadOrderChart);
      clearTimeout(loadCategoryPie);
      clearTimeout(loadPaymentPie);
      clearTimeout(loadTimeSummaries);
      clearTimeout(loadRecentOrders);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Takeaway Order Dashboard</h1>
        <p className="text-lg text-gray-600">Key insights into your daily, weekly, and monthly takeaway orders</p>
      </header>

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
              data={dummyOrderData}
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
                data={dummyCategoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
              >
                {dummyCategoryData.map((entry, index) => (
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
                data={dummyPaymentMethodData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
              >
                {dummyPaymentMethodData.map((entry, index) => (
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
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Takeaway Summaries</h2>
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
            value={monthlySummary.totalRevenue}
            icon={DollarSign}
            color="bg-teal-500"
            isLoading={isLoadingTimeSummaries}
          />
        </div>
      </section>

    </div>
  );
};

export default ResOverview;
