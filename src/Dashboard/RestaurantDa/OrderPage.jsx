import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { FaEye, FaSearch, FaFilter } from "react-icons/fa";
import { OrderDetailsView } from './OrderDetailsModal';

const formatPrice = (price, currency = "INR") => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
};

const orderStatuses = [
  "pending",
  
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
  "completed"
];

export const RestaurantOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeView, setActiveView] = useState("initial");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [currentStatusForEdit, setCurrentStatusForEdit] = useState("");
  const [isStatusUpdating, setIsStatusUpdating] = useState(false);
  const [statusUpdateError, setStatusUpdateError] = useState(false);
  const [statusUpdateSuccess, setStatusUpdateSuccess] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("dashboard");
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/order/orders/restaurant`,
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      setOrders(response.data.orders || []);
      console.log(response.data.orders)
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

 const filteredOrders = useMemo(() => {
    let currentOrders = [...orders];

    if (searchTerm) {
      currentOrders = currentOrders.filter(order =>
        order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus) {
      currentOrders = currentOrders.filter(order => order.orderStatus === filterStatus);
    }

    return currentOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
  }, [orders, searchTerm, filterStatus]);

  const handleSelectOrder = (order) => {
    setSelectedOrder(order);
    setCurrentStatusForEdit(order.orderStatus);
    setActiveView("details");
  };

  const handleClearSelection = () => {
    setSelectedOrder(null);
    setActiveView("initial");
  };
  const handleUpdateOrderStatus = async () => {
    if (!selectedOrder || currentStatusForEdit === selectedOrder.status) return;

    setIsStatusUpdating(true);
    setStatusUpdateError(false);
    setStatusUpdateSuccess(false);

    try {
      const token = localStorage.getItem("dashboard");
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/order/orders/${selectedOrder._id}/status`,
        { status: currentStatusForEdit },
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      console.log(response.data);
      if (response.data.status) {
        setStatusUpdateSuccess(true);
        setOrders(prevOrders => prevOrders.map(order =>
          order._id === selectedOrder._id ? { ...order, orderStatus: currentStatusForEdit } : order
        ));
        setSelectedOrder(prev => ({ ...prev, orderStatus: currentStatusForEdit }));
      } else {
        setStatusUpdateError(true);
      }
    } catch (err) {
      console.error("Error updating order status:", err);
      setStatusUpdateError(true);
    } finally {
      setIsStatusUpdating(false);
      setTimeout(() => {
        setStatusUpdateSuccess(false);
        setStatusUpdateError(false);
      }, 3000);
    }
  };

  const SelectOrderMessage = () => (
    <div className="flex flex-col items-center justify-center h-full text-gray-500 p-6">
      <FaEye className="w-20 h-20 mb-4 text-blue-400" />
      <p className="text-2xl font-semibold mb-2 text-center">Order Details and Status Update</p>
      <p className="text-lg text-center px-4">Select an order from the left to view its details and update its status.</p>
    </div>
  );

  const renderRightPanelContent = () => {
    if (activeView === "details" && selectedOrder) {
      return (
        <OrderDetailsView
          selectedOrder={selectedOrder}
          handleClearSelection={handleClearSelection}
          formatPrice={formatPrice}
          orderStatuses={orderStatuses}
          currentStatusForEdit={currentStatusForEdit}
          setCurrentStatusForEdit={setCurrentStatusForEdit}
          isStatusUpdating={isStatusUpdating}
          statusUpdateError={statusUpdateError}
          statusUpdateSuccess={statusUpdateSuccess}
          handleUpdateOrderStatus={handleUpdateOrderStatus}
        />
      );
    } else {
      return <SelectOrderMessage />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-full bg-gray-100 p-2 space-y-6 md:space-y-0 md:space-x-6">
      <div className="w-full md:w-[38%] bg-white rounded-lg shadow-lg p-4 overflow-hidden flex flex-col relative">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Order List</h2>

        <div className="mb-2 space-y-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by Order ID, Customer Name/Email..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              {orderStatuses.map(status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center h-full min-h-[200px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {!loading && filteredOrders.length === 0 && (
          <p className="text-center text-gray-500 py-10">No orders found matching your criteria.</p>
        )}

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className={`flex items-center justify-between p-4 mb-3 border rounded-lg cursor-pointer transition-all duration-200
                ${
                  selectedOrder?._id === order._id
                    ? "bg-blue-100 border-blue-500 shadow-md"
                    : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                }`}
              onClick={() => handleSelectOrder(order)}
            >
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 truncate">Order #{order.orderId || order._id.substring(0, 8)}</h3>
                <p className="text-sm text-gray-600 truncate">Customer: {order.customerName}</p>
                <p className="text-xs text-gray-500">
                  Total: {formatPrice(order.totalAmount, order.currency)} | Status: <span className={`font-medium ${order.orderStatus === 'Completed' ? 'text-green-600' : order.orderStatus === 'Cancelled' ? 'text-red-600' : 'text-yellow-600'}`}>
                    {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1).replace(/_/g, " ")}
                  </span>
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectOrder(order);
                }}
                className="ml-4 p-2 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-100 transition-colors flex-shrink-0"
                title="View Details"
              >
                <FaEye />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full md:w-[60%] bg-white rounded-lg shadow-lg overflow-y-auto custom-scrollbar">
        {renderRightPanelContent()}
      </div>
    </div>
  );
};
