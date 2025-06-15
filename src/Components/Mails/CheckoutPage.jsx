// import React, { useState, useEffect } from 'react';
// import { useCart } from '../../Context/CartContext.jsx';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const CheckoutPage = () => {
//     const { cartItems, cartTotals, loading: cartLoading, error: cartError, clearCart } = useCart();
//     const navigate = useNavigate();

//     const [customerInfo, setCustomerInfo] = useState({
//         customerName: '',
//         customerEmail: '',
//         customerPhoneNumber: '',
//     });
//     const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
//     const [isProcessingOrder, setIsProcessingOrder] = useState(false);
//     const [orderConfirmation, setOrderConfirmation] = useState(null);
//     const [checkoutError, setCheckoutError] = useState(null);

//     const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL;

//     useEffect(() => {


//         const fetchUserProfile = async () => {
//             try {
//                 const response = await axios.get(`${VITE_SERVER_URL}/api/user/profile`, { withCredentials: true });
//                 const userProfile = response.data.user;
//                 setCustomerInfo({
//                     customerName: userProfile.name || '',
//                     customerEmail: userProfile.email || '',
//                     customerPhoneNumber: userProfile.phoneNumber || '',
//                 });
//             } catch (err) {
//                 console.error("Failed to fetch user profile for checkout:", err);
//             }
//         };
//         fetchUserProfile();
//     }, [cartLoading, cartItems, navigate, VITE_SERVER_URL]);

//     const handleCustomerInfoChange = (e) => {
//         const { name, value } = e.target;
//         setCustomerInfo(prevInfo => ({
//             ...prevInfo,
//             [name]: value
//         }));
//     };

//     const handlePlaceOrder = async (e) => {
//         e.preventDefault();
//         setIsProcessingOrder(true);
//         setCheckoutError(null);
//         setOrderConfirmation(null);

//         if (!selectedPaymentMethod) {
//             setCheckoutError('Please select a payment method.');
//             setIsProcessingOrder(false);
//             return;
//         }

//         if (!customerInfo.customerName || !customerInfo.customerEmail) {
//             setCheckoutError('Customer name and email are required.');
//             setIsProcessingOrder(false);
//             return;
//         }

//         try {
//             const orderPayload = {
//                 customerName: customerInfo.customerName,
//                 customerEmail: customerInfo.customerEmail,
//                 customerPhoneNumber: customerInfo.customerPhoneNumber,
//                 paymentMethod: selectedPaymentMethod,
                
//             };

//             const response = await axios.post(`${VITE_SERVER_URL}/api/order`, orderPayload, { withCredentials: true });

//             setOrderConfirmation(response.data.order);
//             await clearCart();
//             showCartMessage('Order placed successfully!', 'success');
//         } catch (err) {
//             console.error('Error placing order:', err);
//             setCheckoutError(err.response?.data?.message || 'Failed to place order. Please try again.');
//         } finally {
//             setIsProcessingOrder(false);
//         }
//     };

//     if (cartLoading || !cartItems) {
//         return (
//             <div className="min-h-screen flex justify-center items-center">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
//                 <p className="ml-4 text-lg text-gray-700">Loading cart for checkout...</p>
//             </div>
//         );
//     }

//     if (cartError) {
//         return (
//             <div className="min-h-screen flex justify-center items-center">
//                 <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
//                     <strong className="font-bold">Cart Error! </strong>
//                     <span className="block sm:inline">{cartError}</span>
//                 </div>
//             </div>
//         );
//     }

//     if (orderConfirmation) {
//         return (
//             <div className="min-h-screen flex flex-col justify-center items-center bg-green-50 p-8 rounded-lg shadow-lg max-w-2xl mx-auto my-12">
//                 <h2 className="text-4xl font-bold text-green-700 mb-6 text-center">Order Placed Successfully!</h2>
//                 <p className="text-xl text-gray-800 mb-4 text-center">Your Order ID: <span className="font-mono bg-green-200 px-3 py-1 rounded-md">{orderConfirmation._id}</span></p>
//                 <p className="text-lg text-gray-700 mb-2">Total Amount: {orderConfirmation.currency} {orderConfirmation.totalAmount?.toFixed(2)}</p>
//                 <p className="text-lg text-gray-700 mb-6">Payment Method: {orderConfirmation.paymentMethod}</p>
//                 <button
//                     onClick={() => navigate('/')}
//                     className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition duration-300 shadow-lg"
//                 >
//                     Continue Shopping
//                 </button>
//             </div>
//         );
//     }

//     const paymentMethods = ["Cash", "Card", "UPI", "Other"];

//     return (
//         <div className="container mx-auto p-4 md:p-8 bg-white shadow-lg rounded-lg my-8 max-w-4xl">
//             <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Proceed to Checkout</h1>

//             {checkoutError && (
//                 <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
//                     <strong className="font-bold">Error! </strong>
//                     <span className="block sm:inline">{checkoutError}</span>
//                 </div>
//             )}

//             <form onSubmit={handlePlaceOrder}>
//                 {/* Order Summary */}
//                 <section className="mb-8 border p-6 rounded-lg shadow-sm">
//                     <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Summary</h2>
//                     <div className="max-h-60 overflow-y-auto pr-2 mb-4">
//                         {cartItems.map(item => (
//                             <div key={item.product._id + (item.selectedSize || '') + (item.selectedColor || '')} className="flex items-center justify-between py-2 border-b last:border-b-0">
//                                 <div className="flex items-center space-x-3">
//                                     <img src={item.image || `https://placehold.co/50x50`} alt={item.name} className="w-12 h-12 object-cover rounded-md" />
//                                     <div>
//                                         <p className="font-semibold text-gray-900">{item.name}</p>
//                                         <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
//                                         {(item.selectedSize || item.selectedColor) && (
//                                             <p className="text-xs text-gray-500">
//                                                 {item.selectedSize && `Size: ${item.selectedSize}`}
//                                                 {item.selectedSize && item.selectedColor && ` | `}
//                                                 {item.selectedColor && `Color: ${item.selectedColor}`}
//                                             </p>
//                                         )}
//                                     </div>
//                                 </div>
//                                 <span className="font-bold text-gray-800">{item.currency} {(item.price * item.quantity)?.toFixed(2)}</span>
//                             </div>
//                         ))}
//                     </div>
//                     <div className="border-t pt-4 mt-4">
//                         <div className="flex justify-between text-gray-700 mb-2">
//                             <span>Subtotal:</span>
//                             <span>{cartItems[0]?.currency || 'INR'} {cartTotals.subtotal?.toFixed(2)}</span>
//                         </div>
//                         <div className="flex justify-between text-gray-700 mb-2">
//                             <span>Estimated Tax:</span>
//                             <span>{cartItems[0]?.currency || 'INR'} {cartTotals.estimatedTaxes?.toFixed(2)}</span>
//                         </div>
//                         <div className="flex justify-between font-bold text-xl text-gray-900">
//                             <span>Grand Total:</span>
//                             <span>{cartItems[0]?.currency || 'INR'} {cartTotals.grandTotal?.toFixed(2)}</span>
//                         </div>
//                     </div>
//                 </section>

//                 {/* Customer Information */}
//                 <section className="mb-8 border p-6 rounded-lg shadow-sm">
//                     <h2 className="text-2xl font-bold text-gray-800 mb-4">Customer Information</h2>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div>
//                             <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
//                             <input
//                                 type="text"
//                                 id="customerName"
//                                 name="customerName"
//                                 value={customerInfo.customerName}
//                                 onChange={handleCustomerInfoChange}
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                                 required
//                             />
//                         </div>
//                         <div>
//                             <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
//                             <input
//                                 type="email"
//                                 id="customerEmail"
//                                 name="customerEmail"
//                                 value={customerInfo.customerEmail}
//                                 onChange={handleCustomerInfoChange}
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                                 required
//                             />
//                         </div>
//                         <div className="md:col-span-2">
//                             <label htmlFor="customerPhoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number (Optional)</label>
//                             <input
//                                 type="tel"
//                                 id="customerPhoneNumber"
//                                 name="customerPhoneNumber"
//                                 value={customerInfo.customerPhoneNumber}
//                                 onChange={handleCustomerInfoChange}
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                             />
//                         </div>
//                     </div>
//                 </section>

//                 {/* Payment Method */}
//                 <section className="mb-8 border p-6 rounded-lg shadow-sm">
//                     <h2 className="text-2xl font-bold text-gray-800 mb-4">Payment Method</h2>
//                     <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
//                         {paymentMethods.map(method => (
//                             <label key={method} className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200">
//                                 <input
//                                     type="radio"
//                                     name="paymentMethod"
//                                     value={method}
//                                     checked={selectedPaymentMethod === method}
//                                     onChange={(e) => setSelectedPaymentMethod(e.target.value)}
//                                     className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
//                                     required
//                                 />
//                                 <span className="ml-3 text-gray-700 font-medium">{method}</span>
//                             </label>
//                         ))}
//                     </div>
//                 </section>

//                 {/* Place Order Button */}
//                 <div className="text-center">
//                     <button
//                         type="submit"
//                         className="w-full md:w-auto bg-indigo-600 text-white px-10 py-4 rounded-xl text-2xl font-semibold hover:bg-indigo-700 transition duration-300 shadow-lg transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed"
//                         disabled={isProcessingOrder || !selectedPaymentMethod || !customerInfo.customerName || !customerInfo.customerEmail || cartItems.length === 0}
//                     >
//                         {isProcessingOrder ? 'Processing Order...' : 'Place Order'}
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// };

// export default CheckoutPage;



import React, { useState, useEffect } from 'react';
import { useCart } from '../../Context/CartContext.jsx'; // Ensure correct path with .js extension
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const CheckoutPage = () => {
    const { cart, isLoading: cartLoading, error: cartError, clearCart,cartTotals } = useCart();
    const navigate = useNavigate();

    const [customerInfo, setCustomerInfo] = useState({
        customerName: '',
        customerEmail: '',
        customerPhoneNumber: '',
        shippingAddress: {
            street: '',
            city: '',
            state: '',
            zip: '',
            country: ''
        }
    });

    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const [cardDetails, setCardDetails] = useState({ cardNumber: '', expiryDate: '', cvv: '' });
    const [upiId, setUpiId] = useState('');

    const [isProcessingOrder, setIsProcessingOrder] = useState(false);
    const [orderConfirmation, setOrderConfirmation] = useState(null);

    const [checkoutError, setCheckoutError] = useState(null);

    const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                
                const response = await axios.get(`${VITE_SERVER_URL}/api/user/profile`, { withCredentials: true });
                const userProfile = response.data.user;
                setCustomerInfo({
                    customerName: userProfile.name || '',
                    customerEmail: userProfile.email || '',
                    customerPhoneNumber: userProfile.phoneNumber || '',
                    shippingAddress: {
                        street: userProfile.address?.street || '',
                        city: userProfile.address?.city || '',
                        state: userProfile.address?.state || '',
                        zip: userProfile.address?.zip || '',
                        country: userProfile.address?.country || ''
                    }
                });
            } catch (err) {
                console.error("Failed to fetch user profile for checkout:", err);
                toast.error("Failed to load user profile. Please enter your details manually.");
            }
        };
        fetchUserProfile();
    }, [VITE_SERVER_URL]); 

    const handleCustomerInfoChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith("shippingAddress.")) {
            const addressField = name.split('.')[1];
            setCustomerInfo(prevInfo => ({
                ...prevInfo,
                shippingAddress: {
                    ...prevInfo.shippingAddress,
                    [addressField]: value
                }
            }));
        } else {
            setCustomerInfo(prevInfo => ({
                ...prevInfo,
                [name]: value
            }));
        }
    };

    const handleCardDetailsChange = (e) => {
        const { name, value } = e.target;
        setCardDetails(prevDetails => ({
            ...prevDetails,
            [name]: value
        }));
    };

    const handleUpiIdChange = (e) => {
        setUpiId(e.target.value);
    };
    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setIsProcessingOrder(true);
        setCheckoutError(null);
        setOrderConfirmation(null);

        if (!selectedPaymentMethod) {
            setCheckoutError('Please select a payment method.');
            setIsProcessingOrder(false);
            return;
        }

        if (!customerInfo.customerName || !customerInfo.customerEmail ||
            !customerInfo.shippingAddress.street || !customerInfo.shippingAddress.city ||
            !customerInfo.shippingAddress.state || !customerInfo.shippingAddress.zip ||
            !customerInfo.shippingAddress.country) {
            setCheckoutError('Please fill in all required customer and shipping information.');
            setIsProcessingOrder(false);
            return;
        }

        const orderPayload = {
            customerName: customerInfo.customerName,
            customerEmail: customerInfo.customerEmail,
            customerPhoneNumber: customerInfo.customerPhoneNumber,
            shippingAddress: customerInfo.shippingAddress,
            paymentMethod: selectedPaymentMethod,
            
        };
        if (selectedPaymentMethod !== 'Cash') {
        
            console.log(`Simulating payment via ${selectedPaymentMethod}...`);
            
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay
            if (selectedPaymentMethod === 'Card' && (!cardDetails.cardNumber || !cardDetails.expiryDate || !cardDetails.cvv)) {
                setCheckoutError('Please enter complete card details.');
                setIsProcessingOrder(false);
                return;
            }
            if (selectedPaymentMethod === 'UPI' && !upiId) {
                setCheckoutError('Please enter UPI ID.');
                setIsProcessingOrder(false);
                return;
            }
            toast.success(`Payment simulation successful for ${selectedPaymentMethod}!`);
        }

        try {
            const response = await axios.post(`${VITE_SERVER_URL}/api/order`, orderPayload, { withCredentials: true });

            setOrderConfirmation(response.data.order);
            await clearCart();
            toast.success('Order placed successfully!');
        } catch (err) {
            console.error('Error placing order:', err);
            setCheckoutError(err.response?.data?.message || 'Failed to place order. Please try again.');
            toast.error(err.response?.data?.message || 'Failed to place order.'); // Show error notification
        } finally {
            setIsProcessingOrder(false); // Reset processing state
        }
    };

    if (cartLoading) {
        return (
            <div className="min-h-screen flex justify-center items-center font-inter">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                <p className="ml-4 text-lg text-gray-700">Loading cart for checkout...</p>
            </div>
        );
    }

    if (cartError) {
        return (
            <div className="min-h-screen flex justify-center items-center p-4 font-inter">
                <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-xl relative" role="alert">
                    <strong className="font-bold text-xl">Cart Error! </strong>
                    <span className="block sm:inline text-lg mt-2 sm:mt-0">{cartError}</span>
                </div>
            </div>
        );
    }

    if (orderConfirmation) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl max-w-2xl mx-auto my-12 border border-green-300">
                <h2 className="text-4xl font-extrabold text-green-800 mb-6 text-center">Order Placed Successfully!</h2>
                <svg className="w-24 h-24 text-green-500 mb-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                <p className="text-xl text-gray-800 mb-4 text-center">Your Order ID: <span className="font-mono bg-green-200 text-green-800 px-3 py-1 rounded-md text-lg">{orderConfirmation._id}</span></p>
                <p className="text-lg text-gray-700 mb-2">Total Amount: <span className="font-semibold">{orderConfirmation.currency || 'INR'} {orderConfirmation.totalAmount?.toFixed(2)}</span></p>
                <p className="text-lg text-gray-700 mb-6">Payment Method: <span className="font-semibold">{orderConfirmation.paymentMethod}</span></p>
                <button
                    onClick={() => navigate('/')}
                    className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition duration-300 transform hover:scale-105"
                >
                    Continue Shopping
                </button>
            </div>
        );
    }


    const paymentMethods = ["Cash", "Card", "UPI"];

    const cartItems = cart.items || [];

    return (
        <div className="container mx-auto p-4 md:p-8 bg-white border border-gray-200 rounded-xl my-8 max-w-6xl">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Proceed to Checkout</h1>


            {checkoutError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative mb-6" role="alert">
                    <strong className="font-bold">Error! </strong>
                    <span className="block sm:inline">{checkoutError}</span>
                </div>
            )}

            <form onSubmit={handlePlaceOrder}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    <div>
                        <section className="mb-8 border border-gray-200 p-6 rounded-xl bg-gray-50">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-3 border-gray-200">Order Summary</h2>
                            <div className="max-h-80 overflow-y-auto pr-2 mb-4">
                                {cartItems.length === 0 ? (
                                    <p className="text-gray-600 text-center py-4">Your cart is empty. Please add items before checking out.</p>
                                ) : (
                                    cartItems.map(item => (
                                        <div key={item.product._id + (item.selectedSize || '') + (item.selectedColor || '')} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                                            <div className="flex items-center space-x-4">
                                                <img src={item.image || `https://placehold.co/60x60/e0e0e0/ffffff?text=${item.name.substring(0,1)}`} alt={item.name} className="w-16 h-16 object-cover rounded-md border border-gray-100"
                                                    onError={(e) => { e.target.onerror = null; e.target.src=`https://placehold.co/60x60/e0e0e0/ffffff?text=${item.name.substring(0,1)}`; }}
                                                />
                                                <div>
                                                    <p className="font-semibold text-gray-900">{item.name}</p>
                                                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                                    {(item.selectedSize || item.selectedColor) && (
                                                        <p className="text-xs text-gray-500">
                                                            {item.selectedSize && `Size: ${item.selectedSize}`}
                                                            {item.selectedSize && item.selectedColor && ` | `}
                                                            {item.selectedColor && `Color: ${item.selectedColor}`}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <span className="font-bold text-gray-800">${(item.price * item.quantity)?.toFixed(2)}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                            <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
                                <div className="flex justify-between text-gray-700">
                                    <span>Subtotal:</span>
                                    <span className="font-semibold">${cartTotals.subtotal?.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-700">
                                    <span>Estimated Tax:</span>
                                    <span className="font-semibold">${cartTotals.estimatedTaxes?.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between font-bold text-xl text-gray-900 pt-2 border-t border-gray-100">
                                    <span>Grand Total:</span>
                                    <span className="text-indigo-600">${cartTotals.grandTotal?.toFixed(2)}</span>
                                </div>
                            </div>
                        </section>

                        {/* Customer Information */}
                        <section className="border border-gray-200 p-6 rounded-xl bg-gray-50">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-3 border-gray-200">Customer Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        id="customerName"
                                        name="customerName"
                                        value={customerInfo.customerName}
                                        onChange={handleCustomerInfoChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        id="customerEmail"
                                        name="customerEmail"
                                        value={customerInfo.customerEmail}
                                        onChange={handleCustomerInfoChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        required
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label htmlFor="customerPhoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number (Optional)</label>
                                    <input
                                        type="tel"
                                        id="customerPhoneNumber"
                                        name="customerPhoneNumber"
                                        value={customerInfo.customerPhoneNumber}
                                        onChange={handleCustomerInfoChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Shipping Address & Payment Method */}
                    <div>
                        {/* Shipping Address */}
                        <section className="mb-8 border border-gray-200 p-6 rounded-xl bg-gray-50">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-3 border-gray-200">Shipping Address</h2>
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label htmlFor="shippingAddress.street" className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                                    <input
                                        type="text"
                                        id="shippingAddress.street"
                                        name="shippingAddress.street"
                                        value={customerInfo.shippingAddress.street}
                                        onChange={handleCustomerInfoChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="shippingAddress.city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                        <input
                                            type="text"
                                            id="shippingAddress.city"
                                            name="shippingAddress.city"
                                            value={customerInfo.shippingAddress.city}
                                            onChange={handleCustomerInfoChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="shippingAddress.state" className="block text-sm font-medium text-gray-700 mb-1">State/Province</label>
                                        <input
                                            type="text"
                                            id="shippingAddress.state"
                                            name="shippingAddress.state"
                                            value={customerInfo.shippingAddress.state}
                                            onChange={handleCustomerInfoChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="shippingAddress.zip" className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                                        <input
                                            type="text"
                                            id="shippingAddress.zip"
                                            name="shippingAddress.zip"
                                            value={customerInfo.shippingAddress.zip}
                                            onChange={handleCustomerInfoChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="shippingAddress.country" className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                        <input
                                            type="text"
                                            id="shippingAddress.country"
                                            name="shippingAddress.country"
                                            value={customerInfo.shippingAddress.country}
                                            onChange={handleCustomerInfoChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Payment Method */}
                        <section className="border border-gray-200 p-6 rounded-xl bg-gray-50">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-3 border-gray-200">Payment Method</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {paymentMethods.map(method => (
                                    <label key={method} className={`flex flex-col items-center p-4 border rounded-xl cursor-pointer transition-all duration-200 ${selectedPaymentMethod === method ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-500' : 'border-gray-300 hover:bg-gray-100'}`}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value={method}
                                            checked={selectedPaymentMethod === method}
                                            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                                            className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                            required
                                        />
                                        <span className="mt-2 text-gray-700 font-medium text-lg">{method}</span>
                                    </label>
                                ))}
                            </div>

                            {/* Simulated Payment Gateway Integration */}
                            {selectedPaymentMethod === 'Card' && (
                                <div className="mt-6 p-4 border border-blue-200 bg-blue-50 rounded-lg">
                                    <h3 className="text-lg font-semibold text-blue-800 mb-3">Card Details (Simulated)</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                                            <input
                                                type="text"
                                                id="cardNumber"
                                                name="cardNumber"
                                                value={cardDetails.cardNumber}
                                                onChange={handleCardDetailsChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="XXXX XXXX XXXX XXXX"
                                                maxLength="19" // Including spaces
                                                required={selectedPaymentMethod === 'Card'}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">Expiry Date (MM/YY)</label>
                                                <input
                                                    type="text"
                                                    id="expiryDate"
                                                    name="expiryDate"
                                                    value={cardDetails.expiryDate}
                                                    onChange={handleCardDetailsChange}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="MM/YY"
                                                    maxLength="5"
                                                    required={selectedPaymentMethod === 'Card'}
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                                                <input
                                                    type="text"
                                                    id="cvv"
                                                    name="cvv"
                                                    value={cardDetails.cvv}
                                                    onChange={handleCardDetailsChange}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="XXX"
                                                    maxLength="4"
                                                    required={selectedPaymentMethod === 'Card'}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {selectedPaymentMethod === 'UPI' && (
                                <div className="mt-6 p-4 border border-purple-200 bg-purple-50 rounded-lg">
                                    <h3 className="text-lg font-semibold text-purple-800 mb-3">UPI Details (Simulated)</h3>
                                    <div>
                                        <label htmlFor="upiId" className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
                                        <input
                                            type="text"
                                            id="upiId"
                                            name="upiId"
                                            value={upiId}
                                            onChange={handleUpiIdChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                            placeholder="yourname@bankupi"
                                            required={selectedPaymentMethod === 'UPI'}
                                        />
                                    </div>
                                </div>
                            )}

                             {selectedPaymentMethod === 'Other' && (
                                <div className="mt-6 p-4 border border-orange-200 bg-orange-50 rounded-lg">
                                    <h3 className="text-lg font-semibold text-orange-800 mb-3">Other Payment Method Details (Simulated)</h3>
                                    <p className="text-sm text-gray-700">
                                        This section would integrate with a third-party payment provider like PayPal, Stripe, etc.
                                        For this demo, we're just acknowledging its selection.
                                    </p>
                                </div>
                            )}
                        </section>
                    </div>
                </div>

                {/* Place Order Button */}
                <div className="text-center mt-10">
                    <button
                        type="submit"
                        className="w-full md:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-12 py-5 rounded-xl text-2xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed border border-transparent"
                        disabled={
                            isProcessingOrder ||
                            !selectedPaymentMethod ||
                            !customerInfo.customerName ||
                            !customerInfo.customerEmail ||
                            !customerInfo.shippingAddress.street ||
                            !customerInfo.shippingAddress.city ||
                            !customerInfo.shippingAddress.state ||
                            !customerInfo.shippingAddress.zip ||
                            !customerInfo.shippingAddress.country ||
                            cartItems.length === 0 ||
                            // Additional validation for non-cash payments
                            (selectedPaymentMethod === 'Card' && (!cardDetails.cardNumber || !cardDetails.expiryDate || !cardDetails.cvv)) ||
                            (selectedPaymentMethod === 'UPI' && !upiId)
                        }
                    >
                        {isProcessingOrder ? 'Processing Order...' : 'Place Order'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CheckoutPage;
