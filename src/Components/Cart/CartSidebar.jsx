import React, { useEffect, useRef } from 'react';
import CartContent from './CartContent';
import { useCart } from '../../Context/CartContext.jsx';

const CartSidebar = ({ isOpen, onClose }) => {
    const sidebarRef = useRef(null);
    const { cartMessage } = useCart();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    return (
        <>
            <div
                className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300 ${
                    isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
                onClick={onClose}
            ></div>

            <div
                ref={sidebarRef}
                className={`fixed top-0 right-0 w-full md:w-1/2 bg-white h-full shadow-2xl transform transition-transform duration-300 ease-in-out z-50
                    ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-2xl font-bold">Shopping Cart</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-3xl">
                        &times;
                    </button>
                </div>
                <CartContent onClose={onClose} />
            </div>

            {cartMessage && (
                <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-xl text-white z-[60]
                    ${cartMessage.type === 'success' ? 'bg-green-500' : 'bg-red-500'}
                    animate-fade-in-up transition-opacity duration-300`}
                >
                    {cartMessage.message}
                </div>
            )}
        </>
    );
};

export default CartSidebar;