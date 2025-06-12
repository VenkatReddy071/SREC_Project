// src/components/ConfirmationModal.jsx
import React from 'react';

const ConfirmationModal = ({ message, onConfirm, onCancel, showCancelButton = true }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-[1000]"> {/* Increased z-index */}
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full m-4">
        <p className="text-lg text-gray-800 mb-6 text-center">{message}</p>
        <div className="flex justify-end space-x-4">
          {showCancelButton && (
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Cancel
            </button>
          )}
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {showCancelButton ? 'Confirm' : 'OK'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;