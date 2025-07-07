// src/utils/orderUtils.js

export const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
};

export const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
};

export const calculateSubtotal = (items) => {
    if (!items || items.length === 0) return 0;
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
};

export const calculateTotalTaxes = (taxes) => {
    if (!taxes || taxes.length === 0) return 0;
    return taxes.reduce((sum, tax) => sum + tax.amountApplied, 0);
};

export const getStatusClass = (status) => {
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