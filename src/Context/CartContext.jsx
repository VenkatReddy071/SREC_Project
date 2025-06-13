import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const useCart = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [cartTotals, setCartTotals] = useState({ subtotal: 0, estimatedTaxes: 0, grandTotal: 0 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [cartMessage, setCartMessage] = useState(null);

    const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL;

    const showCartMessage = (message, type = 'success') => {
        setCartMessage({ message, type });
        const timer = setTimeout(() => setCartMessage(null), 3000);
        return () => clearTimeout(timer);
    };

    const fetchCart = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${VITE_SERVER_URL}/api/cart`, { withCredentials: true });
            setCart(response.data.cart);
            setCartItems(response.data.cart.items);
            setCartTotals({
                subtotal: response.data.subtotal,
                estimatedTaxes: response.data.estimatedTaxes,
                grandTotal: response.data.grandTotal,
            });
            showCartMessage('Cart loaded successfully.', 'success');
        } catch (err) {
            console.error("Error fetching cart:", err);
            setError(err.response?.data?.message || "Failed to load cart. Please try again.");
            setCart(null);
            setCartItems([]);
            setCartTotals({ subtotal: 0, estimatedTaxes: 0, grandTotal: 0 });
            showCartMessage(err.response?.data?.message || "Failed to load cart.", 'error');
        } finally {
            setLoading(false);
        }
    }, [VITE_SERVER_URL]);

    const addToCart = useCallback(async (productData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${VITE_SERVER_URL}/api/cart/add`, productData, { withCredentials: true });
            setCart(response.data.cart);
            setCartItems(response.data.cart.items);
            await fetchCart();
            showCartMessage(`"${productData.name || 'Item'}" added to cart!`, 'success');
        } catch (err) {
            console.error("Error adding to cart:", err);
            setError(err.response?.data?.message || "Failed to add item to cart.");
            showCartMessage(err.response?.data?.message || "Failed to add item to cart.", 'error');
        } finally {
            setLoading(false);
        }
    }, [VITE_SERVER_URL, fetchCart]);

    const updateCartQuantity = useCallback(async (productId, selectedSize, selectedColor, quantity) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.put(`${VITE_SERVER_URL}/api/cart/update-quantity`, {
                productId,
                selectedSize,
                selectedColor,
                quantity
            }, { withCredentials: true });
            setCart(response.data.cart);
            setCartItems(response.data.cart.items);
            await fetchCart();
            showCartMessage('Cart quantity updated.', 'success');
        } catch (err) {
            console.error("Error updating cart quantity:", err);
            setError(err.response?.data?.message || "Failed to update quantity.");
            showCartMessage(err.response?.data?.message || "Failed to update quantity.", 'error');
        } finally {
            setLoading(false);
        }
    }, [VITE_SERVER_URL, fetchCart]);

    const removeFromCart = useCallback(async (productId, selectedSize, selectedColor) => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (selectedSize) params.append('selectedSize', selectedSize);
            if (selectedColor) params.append('selectedColor', selectedColor);

            const url = `${VITE_SERVER_URL}/api/cart/remove/${productId}${params.toString() ? '?' + params.toString() : ''}`;

            const response = await axios.delete(url, { withCredentials: true });
            setCart(response.data.cart);
            setCartItems(response.data.cart.items);
            await fetchCart();
            showCartMessage('Item removed from cart.', 'success');
        } catch (err) {
            console.error("Error removing from cart:", err);
            setError(err.response?.data?.message || "Failed to remove item.");
            showCartMessage(err.response?.data?.message || "Failed to remove item.", 'error');
        } finally {
            setLoading(false);
        }
    }, [VITE_SERVER_URL, fetchCart]);

    const clearCart = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.delete(`${VITE_SERVER_URL}/api/cart/clear`, { withCredentials: true });
            setCart(response.data.cart);
            setCartItems(response.data.cart.items);
            await fetchCart();
            showCartMessage('Cart cleared.', 'success');
        } catch (err) {
            console.error("Error clearing cart:", err);
            setError(err.response?.data?.message || "Failed to clear cart.");
            showCartMessage(err.response?.data?.message || "Failed to clear cart.", 'error');
        } finally {
            setLoading(false);
        }
    }, [VITE_SERVER_URL, fetchCart]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const contextValue = {
        cart,
        cartItems,
        cartTotals,
        loading,
        error,
        cartMessage,
        fetchCart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        showCartMessage
    };

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );
};