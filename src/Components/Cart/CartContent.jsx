import React from 'react';
import { useCart } from '../../Context/CartContext.jsx';
import {useNavigate}from "react-router-dom"
const CartContent = ({ onClose }) => {
    const { cartItems, cartTotals, loading, error, updateCartQuantity, removeFromCart, clearCart, showCartMessage } = useCart();
    console.log(cartTotals);
    const navigate=useNavigate();
    const handleQuantityChange = async (item, delta) => {
        const newQuantity = item.quantity + delta;
        if (newQuantity < 1) return;                                                                 
        await updateCartQuantity({ itemId: item.product,quantity:newQuantity,itemModelType:item?.itemModelType,sourceType:item?.sourceType,sourceId:item?.sourceId,selectedSize:item.selectedSize || null,  selectedColor:item.selectedColor || null});
    };

    const handleRemoveItem = async (item) => {
        await removeFromCart({ itemId: item.product,itemModelType:item?.itemModelType,sourceType:item?.sourceType,sourceId:item?.sourceId,selectedSize:item.selectedSize || null,  selectedColor:item.selectedColor || null});
    };

    const handleClearCart = async () => {
        if (window.confirm("Are you sure you want to clear your cart?")) {
            await clearCart();
            onClose();
        }
    };

    if (loading) {
        return (
            <div className="p-8 text-center text-gray-700">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
                <p className="text-lg font-medium">Loading your cart...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 text-center bg-red-50 border border-red-200 rounded-lg shadow-sm">
                <p className="text-xl font-semibold text-red-700 mb-2">Oops! Something went wrong.</p>
                <p className="text-red-600">{error}</p>
                <button
                    onClick={onClose}
                    className="mt-6 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition duration-200 shadow"
                >
                    Close Cart
                </button>
            </div>
        );
    }

    if (!cartItems || cartItems.length === 0) {
        return (
            <div className="p-8 text-center text-gray-600">
                <p className="text-2xl font-semibold mb-4">Your cart is empty!</p>
                <p className="mb-6">Start adding some amazing products!</p>
                <button
                    onClick={onClose}
                    className="bg-indigo-600 text-white px-7 py-3 rounded-xl shadow-md hover:bg-indigo-700 transition duration-300 transform hover:scale-105"
                >
                    Continue Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="h-64 overflow-y-auto px-6 py-4 ">
                {cartItems.map((item) => (
                    <div
                        key={item.product._id + (item.selectedSize || '') + (item.selectedColor || '')}
                        className="flex items-start space-x-4 py-4 border-b border-gray-200 last:border-b-0"
                    >
                        <img
                            src={item.image || `https://placehold.co/100x100/E0E0E0/787878?text=No+Image`}
                            alt={item.name}
                            className="w-24 h-24 object-cover rounded-lg shadow-sm flex-shrink-0"
                        />
                        <div className="flex-grow flex flex-col justify-between">
                            <div>
                                <div className='flex justify-between'>
                                    <h3 className="font-bold text-lg text-gray-900 mb-1">{item.name}</h3>
                                    {(item.selectedSize || item.selectedColor) && (
                                    <p className="text-sm text-gray-600 mb-1">
                                        {item.selectedSize && `Size: ${item.selectedSize}`}
                                        {item.selectedSize && item.selectedColor && ` | `}
                                        {item.selectedColor && `Color: ${item.selectedColor}`}
                                    </p>
                                )}
                                <p className="font-semibold text-base text-indigo-700">
                                    {item.currency} {item.price?.toFixed(2)}
                                </p>
                                        <div className="flex items-center justify-between mt-3">
                                <div className="flex items-center border border-gray-300 rounded-md">
                                    <button
                                        onClick={() => handleQuantityChange(item, -1)}
                                        className="text-gray-700 px-3 py-1 rounded-l-md hover:bg-gray-100 transition duration-150"
                                        disabled={item.quantity <= 1}
                                    >
                                        -
                                    </button>
                                    <span className="w-8 text-center text-gray-800 font-medium">{item.quantity}</span>
                                    <button
                                        onClick={() => handleQuantityChange(item, 1)}
                                        className="text-gray-700 px-3 py-1 rounded-r-md hover:bg-gray-100 transition duration-150"
                                    >
                                        +
                                    </button>
                                </div>
                                <button
                                    onClick={() => handleRemoveItem(item)}
                                    className="text-red-500 hover:text-red-700 transition duration-200 flex items-center gap-1 text-sm font-medium"
                                    
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm3 3a1 1 0 00-1 1v4a1 1 0 002 0v-4a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    Remove
                                </button>
                            </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {showCartMessage && (
                    <p className="mt-4 p-3 bg-yellow-100 text-yellow-800 rounded-lg text-sm animate-pulse">
                        {showCartMessage}
                    </p>
                )}
            </div>

            <div className="px-6 py-6 border-t border-gray-200 bg-gray-50">
                <div className="flex justify-between text-gray-700 mb-2">
                    <span className="text-base">Subtotal:</span>
                    <span className="font-medium text-lg">{cartItems[0]?.currency || 'INR'} {cartTotals.subtotal?.toFixed(2)}</span>
                </div>
                {cartTotals?.appliedCharges && (
                    cartTotals?.appliedCharges?.map((item,index)=>(
                    <div className="flex justify-between text-gray-700 mb-4" key={index}>
                    <span className="text-base">{item?.name}:</span>
                    <span className="font-medium text-lg">{item?.amountApplied.toFixed(2)}</span>
                    </div>
                    ))
                )}
                <div className="flex justify-between font-bold text-xl text-gray-900 mb-6">
                    <span>Grand Total:</span>
                    <span>{cartItems[0]?.currency || 'INR'} {cartTotals.grandTotal?.toFixed(2)}</span>
                </div>

                <div className='flex flex-col sm:flex-row gap-4'>
                    <button
                        onClick={handleClearCart}
                        className="w-full bg-red-600 text-white py-3 rounded-xl text-lg font-semibold hover:bg-red-700 transition duration-300 shadow-md transform hover:scale-105"
                    >
                        Clear Cart
                    </button>
                    <button
                        onClick={() => navigate("/checkout")}
                        className="w-full bg-blue-400 text-white py-3 rounded-xl text-lg font-semibold hover:bg-indigo-500 transition duration-300 shadow-md transform hover:scale-105"
                    >
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartContent;