import React from 'react';
document.getElementById('modal-root')
const CustomModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="relative bg-white rounded-lg shadow-xl transform transition-all sm:max-w-lg sm:w-full max-h-[90vh] overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export default CustomModal;