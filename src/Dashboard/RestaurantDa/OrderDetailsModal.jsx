import React, { useState } from "react";
import { FaTimes, FaSpinner, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

export const OrderDetailsView = ({
  selectedOrder,
  handleClearSelection,
  formatPrice,
  orderStatuses,
  currentStatusForEdit,
  setCurrentStatusForEdit,
  isStatusUpdating,
  statusUpdateError,
  statusUpdateSuccess,
  handleUpdateOrderStatus,
}) => {
  const [showAllItems, setShowAllItems] = useState(false);

  if (!selectedOrder) return null;

  const itemsToShow = showAllItems ? selectedOrder.items : selectedOrder?.items?.slice(0, 2);
  const hasMoreItems = selectedOrder.items.length > 2;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900">Order Details: #{selectedOrder?._id.substring(0, 8)}</h3>
        <button
          onClick={handleClearSelection}
          className="text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Close details"
        >
          <FaTimes className="w-6 h-6" />
        </button>
      </div>

      <p className="text-sm text-gray-600 mb-4">Placed on: {new Date(selectedOrder.orderDate).toLocaleString()}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 border-b border-gray-200 pb-4 mb-4">
        <div>
          <p><strong>Customer:</strong> {selectedOrder.customerName}</p>
          <p><strong>Email:</strong> {selectedOrder.customerEmail}</p>
          <p><strong>Phone:</strong> {selectedOrder.customerPhoneNumber || 'N/A'}</p>
          <p><strong>Offers Discount:</strong> {selectedOrder.discountValue}</p>
          <p><strong>Offers Id:</strong> {selectedOrder.offerId}</p>
        </div>
        <div>
          <p><strong>Tax && Charges:</strong><div>{selectedOrder?.appliedTaxes?.map((item,index)=>(
            <div className="flex gap-6">
              <p><b>{item?.name} :</b></p>
              <p>{item?.amountApplied}</p>
            </div>
          ))}</div></p>
          <p><strong>Total Amount:</strong> {formatPrice(selectedOrder.totalAmount, selectedOrder.currency)}</p>
          <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</p>
          
          <p><strong>Order Status:</strong> <span className={`font-semibold ${selectedOrder.orderStatus === 'Completed' ? 'text-green-600' : selectedOrder.orderStatus === 'Cancelled' ? 'text-red-600' : 'text-yellow-600'}`}>

            {selectedOrder.orderStatus.replace(/\b\w/g, char => char.toUpperCase())}
          </span></p>
          <p className="col-span-2"><strong>Notes:</strong> {selectedOrder.notes || 'N/A'}</p>
        </div>
      </div>

      <div className="p-6 border-b border-gray-200">
        <h4 className="text-xl font-semibold text-gray-800 mb-3">Items:</h4>
        {selectedOrder.items && selectedOrder.items?.length > 0 ? (
          <ul className="space-y-3">
            {itemsToShow.map((item, index) => (
              <li key={item.product?._id || index} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-md border border-gray-100">
                <img
                  src={item.product?.images?.[0] ||item.product?.imageUrl}
                  alt={item.product?.name || "Product"}
                  className="w-12 h-12 object-cover rounded-md flex-shrink-0"
                  onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/50x50/E0E0E0/000000?text=Item"; }}
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.product?.name || 'Unknown Product'}</p>
                  <p className="text-sm text-gray-600">
                      {item.quantity} x {formatPrice(item.price, selectedOrder.currency)}
                      {item.selectedSize && ` (Size: ${item.selectedSize})`}
                      {item.selectedColor && ` (Color: ${item.selectedColor})`}
                  </p>
                </div>
                <span className="font-semibold text-gray-800">{formatPrice(item.quantity * item.price, selectedOrder.currency)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No items found for this order.</p>
        )}
        {hasMoreItems && (
          <button
            onClick={() => setShowAllItems(!showAllItems)}
            className="mt-4 w-full text-blue-600 hover:text-blue-800 font-semibold py-2 rounded-md transition-colors border border-blue-200 hover:bg-blue-50"
          >
            {showAllItems ? "Show Less" : "Show More"} ({selectedOrder?.items?.length - itemsToShow.length} more)
          </button>
        )}
      </div>

      <div className="p-6">
        <h4 className="text-xl font-semibold text-gray-800 mb-3">Update Status:</h4>
        <div className="flex items-center space-x-4 mb-4">
          <select
            value={currentStatusForEdit}
            onChange={(e) => setCurrentStatusForEdit(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            disabled={isStatusUpdating}
          >
            {orderStatuses.map(status => (
              <option key={status} value={status}>
                {status?.charAt(0).toUpperCase() + status?.slice(1).replace(/_/g, " ")}
              </option>
            ))}
          </select>
          <button
            onClick={handleUpdateOrderStatus}
            className={`flex items-center px-5 py-2 rounded-md transition-colors font-semibold ${
              isStatusUpdating
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
            disabled={isStatusUpdating || currentStatusForEdit === selectedOrder.orderStatus}
          >
            {isStatusUpdating ? (
              <>
                <FaSpinner className="animate-spin mr-2" /> Updating...
              </>
            ) : (
              "Update Status"
            )}
          </button>
        </div>
        {statusUpdateSuccess && (
          <p className="text-green-600 flex items-center">
            <FaCheckCircle className="mr-2" /> Status updated successfully!
          </p>
        )}
        {statusUpdateError && (
          <p className="text-red-600 flex items-center">
            <FaExclamationCircle className="mr-2" /> Failed to update status.
          </p>
        )}
      </div>
    </div>
  );
};
