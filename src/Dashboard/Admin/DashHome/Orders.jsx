import React, { useState, useEffect } from 'react';
import { FaHospital, FaUtensils, FaTshirt, FaSearch, FaSpinner, FaCalendarAlt, FaClock, FaUser, FaMoneyBillWave, FaBoxOpen, FaMapMarkerAlt, FaCheckCircle, FaTimesCircle, FaInfoCircle, FaClipboardList, FaEdit, FaTrashAlt, FaPhone, FaEnvelope, FaTag, FaStore, FaPercentage, FaTruck, FaRegClock, FaShoppingBag } from 'react-icons/fa';
import { IoIosInformationCircleOutline } from 'react-icons/io';
import axios from "axios";
import CustomModal from "../../../Pages/CustomModol";

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
};

const formatTime = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
};

const calculateSubtotal = (items) => {
  if (!items || items.length === 0) return 0;
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
};

const calculateTotalTaxes = (taxes) => {
  if (!taxes || taxes.length === 0) return 0;
  return taxes.reduce((sum, tax) => sum + tax.amountApplied, 0);
};

const getStatusClass = (status) => {
  if (!status) return 'bg-gray-100 text-gray-700 border-gray-300';
  const lowerStatus = status.toLowerCase();
  if (lowerStatus === 'completed' || lowerStatus === 'delivered' || lowerStatus === 'approved') {
    return 'bg-green-100 text-green-700 border-green-300';
  } else if (lowerStatus === 'cancelled' || lowerStatus === 'returned') {
    return 'bg-red-100 text-red-700 border-red-300';
  } else if (lowerStatus === 'shipped' || lowerStatus === 'processing') {
    return 'bg-blue-100 text-blue-700 border-blue-300';
  } else if (lowerStatus === 'pending') {
    return 'bg-yellow-100 text-yellow-700 border-yellow-300';
  }
  return 'bg-gray-100 text-gray-700 border-gray-300';
};

export const Orders = () => {
  const [activeTab, setActiveTab] = useState('hospital');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState("");

  const [hospitalBookings, setHospitalBookings] = useState([]);
  const [restaurantOrders, setRestaurantOrders] = useState([]);
  const [fashionOrders, setFashionOrders] = useState([]);

  const SERVER_URL = `${import.meta.env.VITE_SERVER_URL}`;

  const fetchOrders = async () => {
    setLoading(true);
    setSearchTerm('');
    setSelectedOrder(null);
    try {
      if (activeTab === 'hospital') {
        const response = await axios.get(`${SERVER_URL}/api/booking/admin/all`, { withCredentials: true });
        if (response.status === 200) {
          setHospitalBookings(Array.isArray(response.data) ? response.data : [response.data]);
        }
      } else if (activeTab === 'restaurant') {
        const response = await axios.get(`${SERVER_URL}/api/order/orders?Restaurant`, { withCredentials: true });
        if (response.status === 200) {
          setRestaurantOrders(response.data?.data || []);
        }
      } else if (activeTab === 'fashion') {
        const response = await axios.get(`${SERVER_URL}/api/order/orders?Mall`, { withCredentials: true });
        if (response.status === 200) {
          setFashionOrders(response.data?.data || []);
        }
      }
    } catch (error) {
      console.error(`Error fetching ${activeTab} orders:`, error);
      setAlertMessage(`Failed to fetch ${activeTab} orders. Please check your network or API endpoint.`);
      setIsAlertModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [activeTab]);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const getStatusOptions = (currentTab) => {
    switch (currentTab) {
      case 'hospital':
        return ['Pending', 'Approved', 'Completed', 'Cancelled'];
      case 'restaurant':
      case 'fashion':
        return ['pending', 'processing', 'shipped', 'delivered', 'completed', 'cancelled', 'returned'];
      default:
        return [];
    }
  };

  const handleUpdateStatus = (orderId, newStatus) => {
    setConfirmMessage(`Are you sure you want to change the status of order ID: ${orderId} to "${newStatus}"?`);
    setConfirmAction(() => async () => {
      try {
        let updatedOrders;
        if (activeTab === 'hospital') {
          updatedOrders = hospitalBookings.map(order =>
            order._id === orderId ? { ...order, status: newStatus } : order
          );
          setHospitalBookings(updatedOrders);
        } else if (activeTab === 'restaurant') {
          updatedOrders = restaurantOrders.map(order =>
            order._id === orderId ? { ...order, orderStatus: newStatus } : order
          );
          setRestaurantOrders(updatedOrders);
        } else if (activeTab === 'fashion') {
          updatedOrders = fashionOrders.map(order =>
            order._id === orderId ? { ...order, orderStatus: newStatus } : order
          );
          setFashionOrders(updatedOrders);
        }
        setAlertMessage(`Status for order ID: ${orderId} updated to "${newStatus}" successfully!`);
        setIsAlertModalOpen(true);
      } catch (error) {
        console.error(`Error updating ${activeTab} order status:`, error);
        setAlertMessage(`Failed to update status for order ID: ${orderId}.`);
        setIsAlertModalOpen(true);
      } finally {
        setIsConfirmModalOpen(false);
      }
    });
    setIsConfirmModalOpen(true);
  };

  const handleDeleteOrder = (orderId) => {
    setConfirmMessage(`Are you sure you want to delete order ID: ${orderId}? This action cannot be undone.`);
    setConfirmAction(() => async () => {
      try {
        let updatedOrders;
        if (activeTab === 'hospital') {
          updatedOrders = hospitalBookings.filter(order => order._id !== orderId);
          setHospitalBookings(updatedOrders);
        } else if (activeTab === 'restaurant') {
          updatedOrders = restaurantOrders.filter(order => order._id !== orderId);
          setRestaurantOrders(updatedOrders);
        } else if (activeTab === 'fashion') {
          updatedOrders = fashionOrders.filter(order => order._id !== orderId);
          setFashionOrders(updatedOrders);
        }
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder(null);
        }
        setAlertMessage(`Order ID: ${orderId} deleted successfully!`);
        setIsAlertModalOpen(true);
      } catch (error) {
        console.error(`Error deleting ${activeTab} order:`, error);
        setAlertMessage(`Failed to delete order ID: ${orderId}.`);
        setIsAlertModalOpen(true);
      } finally {
        setIsConfirmModalOpen(false);
      }
    });
    setIsConfirmModalOpen(true);
  };

  const getFilteredOrders = () => {
    const orders = activeTab === 'hospital' ? hospitalBookings : activeTab === 'restaurant' ? restaurantOrders : fashionOrders;

    const filtered = orders.filter(order => {
      if (activeTab === 'hospital') {
        return (
          order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.Hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.Doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order._id.toLowerCase().includes(searchTerm.toLowerCase())
        );
      } else if (activeTab === 'restaurant') {
        return (
          order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (order.sourceId && order.sourceId.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      } else if (activeTab === 'fashion') {
        return (
          order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (order.sourceId && order.sourceId.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }
      return false;
    });
    return filtered;
  };

  const renderOrderList = (orders) => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-48 text-gray-600">
          <FaSpinner className="animate-spin mr-2" size={30} /> Loading orders...
        </div>
      );
    }

    if (orders.length === 0) {
      return (
        <div className="text-center text-gray-500 mt-8 p-4 border border-gray-200 rounded-md bg-gray-50">
          No orders found for this category or matching your search.
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-6">
        {orders.map((order, index) => {
          const orderItemImage = activeTab === 'hospital' ? "https://placehold.co/150x150/f0f9ff/00796b?text=Hospital+Booking" : order.items?.[0]?.image || "https://placehold.co/150x150/f0f9ff/00796b?text=Order+Image";
          const currentStatus = activeTab === 'hospital' ? order.status : order.orderStatus;

          let mainHeading = "N/A";
          let description = "N/A";
          let dateDisplay = "N/A";

          if (activeTab === 'hospital') {
            mainHeading = order.Hospital?.name || "Hospital Booking";
            description = `Patient: ${order.name || "N/A"}`;
            dateDisplay = `${formatDate(order.ScheduleDate)} at ${order.slot}`;
          } else if (activeTab === 'restaurant') {
            mainHeading = `Order ID: ${order._id.slice(-6)}`;
            description = `Customer: ${order.customerName || "N/A"}`;
            dateDisplay = `${formatDate(order.orderDate)} at ${formatTime(order.orderDate)}`;
          } else if (activeTab === 'fashion') {
            mainHeading = `Order ID: ${order._id.slice(-6)}`;
            description = `Customer: ${order.customerName || "N/A"}`;
            dateDisplay = `${formatDate(order.orderDate)} at ${formatTime(order.orderDate)}`;
          }

          return (
            <div
              key={order._id}
              className={`bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer group
                ${selectedOrder && selectedOrder._id === order._id ? "ring-2 ring-teal-500" : ""}`}
              onClick={() => handleViewDetails(order)}
            >
              <div className="p-4 flex flex-col items-center text-center">
                <div className="relative w-full mb-3">
                  <img
                    src={orderItemImage}
                    alt={mainHeading}
                    className="w-full h-40 object-cover rounded-lg shadow-inner"
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/150x150/f0f9ff/00796b?text=Order+Image"; }}
                  />
                  <span
                    className={`absolute top-2 left-2 px-3 py-1 text-xs font-semibold rounded-full capitalize border ${getStatusClass(currentStatus)}`}
                  >
                    {currentStatus?.toLowerCase() === "completed" || currentStatus?.toLowerCase() === "delivered" || currentStatus?.toLowerCase() === "approved" ? (
                      <FaCheckCircle className="inline mr-1 w-3 h-3" />
                    ) : currentStatus?.toLowerCase() === "cancelled" || currentStatus?.toLowerCase() === "returned" ? (
                      <FaTimesCircle className="inline mr-1 w-3 h-3" />
                    ) : (
                      <FaRegClock className="inline mr-1 w-3 h-3" />
                    )}
                    {currentStatus}
                  </span>
                  <span className="absolute top-2 right-2 text-xs font-medium text-gray-500 bg-white bg-opacity-80 rounded-full px-2 py-1 shadow-sm">
                    #{order._id.slice(-6)}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-1 leading-tight">{mainHeading}</h3>
                <p className="text-sm text-gray-600 mb-3 truncate w-full px-2">
                  {description}
                </p>

                <div className="flex justify-between items-center w-full pt-3 border-t border-gray-100">
                  <span className="text-sm font-semibold text-gray-800 flex items-center">
                    <FaCalendarAlt className="mr-1 text-blue-500" /> {dateDisplay}
                  </span>
                  <button onClick={(e) => { e.stopPropagation(); handleViewDetails(order); }} className="px-4 py-2 bg-teal-500 text-white rounded-full text-sm font-semibold hover:bg-teal-600 transition-colors duration-200 shadow-md">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans text-gray-800">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-gray-200 flex items-center">
        <FaClipboardList className="inline-block mr-3 text-blue-600" /> Order Management Dashboard
      </h1>

      <div className="bg-white rounded-lg shadow-xl p-6 mb-8">
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`flex-1 py-3 text-lg font-semibold transition-all duration-300 ${activeTab === 'hospital' ? 'border-b-4 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-blue-500'}`}
            onClick={() => setActiveTab('hospital')}
          >
            <FaHospital className="inline-block mr-2" /> Hospital Bookings
          </button>
          <button
            className={`flex-1 py-3 text-lg font-semibold transition-all duration-300 ${activeTab === 'restaurant' ? 'border-b-4 border-orange-600 text-orange-600' : 'text-gray-600 hover:text-orange-500'}`}
            onClick={() => setActiveTab('restaurant')}
          >
            <FaUtensils className="inline-block mr-2" /> Restaurant Orders
          </button>
          <button
            className={`flex-1 py-3 text-lg font-semibold transition-all duration-300 ${activeTab === 'fashion' ? 'border-b-4 border-purple-600 text-purple-600' : 'text-gray-600 hover:text-purple-500'}`}
            onClick={() => setActiveTab('fashion')}
          >
            <FaTshirt className="inline-block mr-2" /> Fashion Orders
          </button>
        </div>

        <div className="relative mb-6">
          <input
            type="text"
            placeholder={`Search ${activeTab} orders...`}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>

        {renderOrderList(getFilteredOrders())}
      </div>

      <CustomModal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)}>
        {selectedOrder && (
          <div className="p-6 bg-white rounded-lg relative max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsDetailModalOpen(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-3xl transition-colors duration-200"
              title="Close"
            >
              <FaTimesCircle className="w-8 h-8" />
            </button>

            <h2 className="text-2xl font-extrabold text-gray-900 mb-4 border-b pb-3 flex items-center">
              <FaInfoCircle className="mr-2 text-teal-600 w-6 h-6" /> Order Details
              <span className="text-teal-600 ml-2">#{selectedOrder._id.slice(-6)}</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 text-sm mb-6">
              {activeTab === 'hospital' && (
                <>
                  <div>
                    <p className="font-semibold text-gray-600 flex items-center">
                      <FaUser className="mr-2 text-blue-500 w-4 h-4" /> Patient:
                    </p>
                    <p className="ml-5"><b>Name:</b> {selectedOrder.name || "N/A"}</p>
                    <p className="ml-5"><b>Email:</b> {selectedOrder.email || "N/A"}</p>
                    <p className="ml-5"><b>Phone:</b> {selectedOrder.mobilenumber || "N/A"}</p>
                    <p className="ml-5"><b>Age:</b> {selectedOrder.age || "N/A"}</p>
                    <p className="ml-5"><b>Gender:</b> {selectedOrder.gender || "N/A"}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-600 flex items-center">
                      <FaHospital className="mr-2 text-blue-500 w-4 h-4" /> Hospital:
                    </p>
                    <p className="ml-5"><b>Name:</b> {selectedOrder.Hospital?.name || "N/A"}</p>
                    <p className="ml-5"><b>Address:</b> {selectedOrder.Hospital?.address || "N/A"}</p>
                    <p className="font-semibold text-gray-600 flex items-center mt-3">
                      <FaUser className="mr-2 text-blue-500 w-4 h-4" /> Doctor:
                    </p>
                    <p className="ml-5"><b>Name:</b> {selectedOrder.Doctor?.name || "N/A"}</p>
                    <p className="ml-5"><b>Specialization:</b> {selectedOrder.Doctor?.specialization?.join(', ') || "N/A"}</p>
                  </div>
                  <div className="col-span-full">
                    <p className="font-semibold text-gray-600 flex items-center">
                      <FaCalendarAlt className="mr-2 text-yellow-500 w-4 h-4" /> Appointment Details:
                    </p>
                    <p className="ml-5"><b>Scheduled:</b> {formatDate(selectedOrder.ScheduleDate)} at {selectedOrder.slot}</p>
                    <p className="ml-5"><b>Booked On:</b> {formatDate(selectedOrder.bookingDate)} at {formatTime(selectedOrder.bookingDate)}</p>
                    <p className="ml-5"><b>Status:</b> {selectedOrder.status || "N/A"}</p>
                    <p className="ml-5"><b>Reason:</b> {selectedOrder.message || 'N/A'}</p>
                  </div>
                </>
              )}
              {(activeTab === 'restaurant' || activeTab === 'fashion') && (
                <>
                  <div>
                    <p className="font-semibold text-gray-600 flex items-center">
                      <FaUser className="mr-2 text-blue-500 w-4 h-4" /> Customer:
                    </p>
                    <p className="ml-5"><b>Name:</b> {selectedOrder.customerName || "N/A"}</p>
                    <p className="ml-5"><b>Email:</b> {selectedOrder.customerEmail || "N/A"}</p>
                    <p className="ml-5"><b>Phone:</b> {selectedOrder.customerPhoneNumber || "N/A"}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-600 flex items-center">
                      {activeTab === 'restaurant' ? <FaStore className="mr-2 text-blue-500 w-4 h-4" /> : <FaShoppingBag className="mr-2 text-blue-500 w-4 h-4" />} Source:
                    </p>
                    <p className="ml-5"><b>Type:</b> {selectedOrder.sourceType || "N/A"}</p>
                    <p className="ml-5"><b>ID:</b> {selectedOrder.sourceId || "N/A"}</p>
                    <p className="font-semibold text-gray-600 flex items-center mt-3">
                      <FaCalendarAlt className="mr-2 text-yellow-500 w-4 h-4" /> Ordered On:
                    </p>
                    <p className="ml-5">
                      {formatDate(selectedOrder.orderDate)} at {formatTime(selectedOrder.orderDate)}
                    </p>
                  </div>
                  <div className="col-span-full">
                    <p className="font-semibold text-gray-600 flex items-center">
                      <FaMapMarkerAlt className="mr-2 text-blue-500 w-4 h-4" /> Shipping Address:
                    </p>
                    <p className="ml-5">
                      {selectedOrder.shippingAddress?.street ? `${selectedOrder.shippingAddress.street}, ` : ''}
                      {selectedOrder.shippingAddress?.city ? `${selectedOrder.shippingAddress.city}, ` : ''}
                      {selectedOrder.shippingAddress?.state ? `${selectedOrder.shippingAddress.state}, ` : ''}
                      {selectedOrder.shippingAddress?.zipCode ? `${selectedOrder.shippingAddress.zipCode}, ` : ''}
                      {selectedOrder.shippingAddress?.country || 'N/A'}
                    </p>
                    <p className="font-semibold text-gray-600 flex items-center mt-3">
                      <FaMoneyBillWave className="mr-2 text-green-500 w-4 h-4" /> Payment Method:
                    </p>
                    <p className="ml-5">
                      {selectedOrder.paymentMethod || "N/A"}
                    </p>
                    <p className="font-semibold text-gray-600 flex items-center mt-3">
                      <FaCheckCircle className="inline mr-2 text-blue-500" /> Order Status:
                    </p>
                    <p className="ml-5 capitalize">{selectedOrder.orderStatus || "N/A"}</p>
                  </div>
                  {selectedOrder.notes && (
                    <div className="col-span-full bg-blue-50 p-3 rounded-md border border-blue-200">
                      <p className="font-semibold text-gray-600 flex items-center">
                        <FaInfoCircle className="mr-2 text-blue-500 w-4 h-4" /> Order Notes:
                      </p>
                      <p className="italic ml-5">{selectedOrder.notes}</p>
                    </div>
                  )}
                </>
              )}
            </div>

            {(activeTab === 'restaurant' || activeTab === 'fashion') && (
              <div className="mb-6 border-t pt-4">
                <h4 className="font-bold text-gray-800 mb-3 text-lg flex items-center">
                  <FaUtensils className="mr-2 text-purple-500 w-5 h-5" /> Ordered Items:
                </h4>
                <div className="space-y-4 text-gray-700 text-sm">
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    selectedOrder.items.map((item, idx) => (
                      <div key={item._id || idx} className="flex flex-col sm:flex-row items-center bg-gray-50 p-3 rounded-md shadow-sm">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-md mr-4 mb-2 sm:mb-0"
                            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/80x80/f0f9ff/00796b?text=Item"; }}
                          />
                        )}
                        <div className="flex-grow text-center sm:text-left">
                          <p className="font-medium text-base text-gray-900">{item.quantity} x {item.name}</p>
                          {item.product?.description && (
                            <p className="text-xs text-gray-500 italic mt-1">{item.product.description}</p>
                          )}
                          {item.productName && (
                            <p className="text-xs text-gray-500 italic mt-1">
                              {item.size && `Size: ${item.size}`} {item.color && `Color: ${item.color}`}
                            </p>
                          )}
                        </div>
                        <span className="font-semibold text-gray-800 mt-2 sm:mt-0 sm:ml-auto">
                          ₹{(item.price * item.quantity).toFixed(2)} {item.currency || "INR"}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600">No items found.</p>
                  )}
                </div>
              </div>
            )}

            {(activeTab === 'restaurant' || activeTab === 'fashion') && (
              <div className="mb-6 border-t pt-4">
                <h4 className="font-bold text-gray-800 mb-3 text-lg">Cost Breakdown:</h4>
                <div className="space-y-2 text-gray-700 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Subtotal:</span>
                    <span>₹{calculateSubtotal(selectedOrder.items).toFixed(2)} {selectedOrder.items?.[0]?.currency || "INR"}</span>
                  </div>
                  {selectedOrder.appliedTaxes && selectedOrder.appliedTaxes.length > 0 && (
                    <>
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-medium flex items-center">
                          <FaPercentage className="mr-1 text-orange-500 w-3 h-3" /> Taxes:
                        </span>
                        <span>₹{calculateTotalTaxes(selectedOrder.appliedTaxes).toFixed(2)} {selectedOrder.items?.[0]?.currency || "INR"}</span>
                      </div>
                      <ul className="ml-5 text-xs text-gray-600 list-disc list-inside">
                        {selectedOrder.appliedTaxes.map((tax, idx) => (
                          <li key={idx}>
                            {tax.name}: ₹{tax.amountApplied.toFixed(2)} {selectedOrder.items?.[0]?.currency || "INR"}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                  {selectedOrder.discountValue > 0 && (
                    <div className="flex justify-between items-center text-red-600">
                      <span className="font-medium flex items-center">
                        <FaTag className="mr-1 w-3 h-3" /> Discount:
                      </span>
                      <span>- ₹{selectedOrder.discountValue.toFixed(2)} {selectedOrder.items?.[0]?.currency || "INR"}</span>
                    </div>
                  )}
                  {selectedOrder.offerId && (
                    <div className="flex justify-between items-center text-teal-700 text-xs">
                      <span className="font-medium flex items-center">
                        <FaTag className="mr-1 w-3 h-3" /> Offer ID:
                      </span>
                      <span className="ml-1">{selectedOrder.offerId}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200 mt-2 font-bold text-gray-900 text-base">
                    <span>Total Amount:</span>
                    <span>₹{selectedOrder?.totalAmount?.toFixed(2)} {selectedOrder.items?.[0]?.currency || "INR"}</span>
                  </div>
                </div>
              </div>
            )}

            {selectedOrder.subStatus && selectedOrder.subStatus.length > 0 && (
              <div className="mt-6 border-t pt-4">
                <h4 className="font-bold text-gray-800 mb-3 text-lg">Order Timeline:</h4>
                <ol className="relative border-l border-gray-200 ml-4">
                  {selectedOrder.subStatus
                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                    .map((statusEntry, idx) => (
                      <li key={statusEntry._id || idx} className="mb-4 ml-6">
                        <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white">
                          {statusEntry.status?.toLowerCase() === "completed" || statusEntry.status?.toLowerCase() === "delivered" || statusEntry.status?.toLowerCase() === "approved" ? (
                            <FaCheckCircle className="w-3 h-3 text-green-500" />
                          ) : statusEntry.status?.toLowerCase() === "shipped" || statusEntry.status?.toLowerCase() === "processing" ? (
                            <FaTruck className="w-3 h-3 text-blue-500" />
                          ) : statusEntry.status?.toLowerCase() === "cancelled" ? (
                            <FaTimesCircle className="w-3 h-3 text-red-500" />
                          ) : (
                            <FaRegClock className="w-3 h-3 text-yellow-500" />
                          )}
                        </span>
                        <h3 className="flex items-center mb-1 text-md font-semibold text-gray-900 capitalize">
                          {statusEntry.status}
                          {idx === selectedOrder.subStatus.length - 1 && (
                            <span className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded ml-3">Latest</span>
                          )}
                        </h3>
                        <time className="block mb-2 text-xs font-normal leading-none text-gray-400">
                          On {formatDate(statusEntry.date)} at {formatTime(statusEntry.date)}
                        </time>
                      </li>
                    ))}
                </ol>
              </div>
            )}
          </div>
        )}
      </CustomModal>

      <CustomModal isOpen={isAlertModalOpen} onClose={() => setIsAlertModalOpen(false)}>
        <div className="p-6 bg-white rounded-lg shadow-xl text-center">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">Information</h2>
          <p className="text-gray-700 mb-6">{alertMessage}</p>
          <button
            onClick={() => setIsAlertModalOpen(false)}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            OK
          </button>
        </div>
      </CustomModal>

      <CustomModal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)}>
        <div className="p-6 bg-white rounded-lg shadow-xl text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Confirm Action</h2>
          <p className="text-gray-700 mb-6">{confirmMessage}</p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setIsConfirmModalOpen(false)}
              className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmAction}
              className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Confirm
            </button>
          </div>
        </div>
      </CustomModal>
    </div>
  );
};
