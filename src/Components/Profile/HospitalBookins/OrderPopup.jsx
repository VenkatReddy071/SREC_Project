import { FaRegClock, FaCheckCircle, FaTag, FaTruck, FaInfoCircle, FaTimesCircle } from 'react-icons/fa';
import React from 'react';

const OrderPopup = ({ order, onClose }) => {
  if (!order) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="p-6 bg-white rounded-lg relative max-w-lg w-11/12 max-h-[90vh] overflow-y-auto">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-3xl transition-colors duration-200"
        title="Close"
      >
        <FaTimesCircle className="w-8 h-8" />
      </button>

      <h2 className="text-2xl font-extrabold text-gray-900 mb-4 border-b pb-3 flex items-center">
        <FaInfoCircle className="mr-2 text-blue-600 w-6 h-6" /> Appointment Details
        <span className="text-blue-600 ml-2">#{order._id.slice(-6)}</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 text-sm mb-6">
        <div>
          <p className="font-semibold text-gray-600 flex items-center">
            <FaTruck className="mr-2 text-blue-500 w-4 h-4" /> Hospital:
          </p>
          <p className="ml-5">
            <b>Name: </b>
            {order.Hospital?.name || "N/A"}
          </p>
          <p className="ml-5">
            <b>Address: </b>
            {order.Hospital?.address || "N/A"}
          </p>
        </div>
        <div>
          <p className="font-semibold text-gray-600 flex items-center">
            <FaTag className="mr-2 text-purple-500 w-4 h-4" /> Specialization:
          </p>
          <p className="ml-5">{order.specialization?.join(", ") || "N/A"}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-600 flex items-center">
            <FaRegClock className="mr-2 text-yellow-500 w-4 h-4" /> Booked On:
          </p>
          <p className="ml-5">
            {formatDate(order.bookingDate)} at {formatTime(order.bookingDate)}
          </p>
        </div>
        <div>
          <p className="font-semibold text-gray-600 flex items-center">
            <FaRegClock className="mr-2 text-green-500 w-4 h-4" /> Scheduled Appointment:
          </p>
          <p className="ml-5">
            {order.date
              ? `${formatDate(order.date)} at ${order.slot}`
              : "N/A"}
          </p>
        </div>
        {order.message && (
          <div className="col-span-full bg-blue-50 p-3 rounded-md border border-blue-200">
            <p className="font-semibold text-gray-600 flex items-center">
              <FaInfoCircle className="mr-2 text-blue-500 w-4 h-4" /> Message:
            </p>
            <p className="italic ml-5">{order.message}</p>
          </div>
        )}
      </div>

      <div className="mb-6 border-t pt-4">
        <h4 className="font-bold text-gray-800 mb-3 text-lg">Patient Information:</h4>
        <div className="space-y-2">
          <div className="flex justify-between items-center bg-blue-50 p-3 rounded-md shadow-sm">
            <div className="flex-grow">
              <p className="font-medium text-gray-800">Name: {order.name}</p>
              <p className="text-xs text-gray-500">Email: {order.email}</p>
              <p className="text-xs text-gray-500">Mobile: {order.mobilenumber}</p>
              <p className="text-xs text-gray-500">Age: {order.age}</p>
              <p className="text-xs text-gray-500">Gender: {order.gender}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <h4 className="font-bold text-gray-800 mb-3 text-lg">Doctor Information:</h4>
        <div className="space-y-2">
          <div className="flex justify-between items-center bg-blue-50 p-3 rounded-md shadow-sm">
            <p className="font-medium text-gray-800">Dr. {order.Doctor?.name || "N/A"}</p>
          </div>
        </div>
      </div>

      {order.subStatus && order.subStatus.length > 0 && (
        <div className="mt-6 border-t pt-4">
          <h4 className="font-bold text-gray-800 mb-3 text-lg">Appointment Timeline:</h4>
          <ol className="relative border-l border-gray-200 ml-4">
            {order.subStatus
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .map((statusEntry, idx) => (
                <li key={statusEntry._id || idx} className="mb-4 ml-6">
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white">
                    {statusEntry.status?.toLowerCase() === "approved" || statusEntry.status?.toLowerCase() === "completed" ? (
                      <FaCheckCircle className="w-3 h-3 text-green-500" />
                    ) : (
                      <FaRegClock className="w-3 h-3 text-yellow-500" />
                    )}
                  </span>
                  <h3 className="flex items-center mb-1 text-md font-semibold text-gray-900 capitalize">
                    {statusEntry.status}
                    {idx === order.subStatus.length - 1 && (
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
  );
};

export default OrderPopup;