
import React, { useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-5 right-5 z-50 px-4 py-2 rounded shadow text-white ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    }`}>
      {message}
    </div>
  );
};

export default Toast;
