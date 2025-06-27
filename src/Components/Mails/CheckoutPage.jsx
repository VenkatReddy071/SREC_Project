
import React, { useState, useEffect, useMemo } from 'react';
import { useCart } from '../../Context/CartContext.jsx';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const CheckoutPage = () => {
    const { cart, isLoading: cartLoading, error: cartError, clearCart, cartTotals } = useCart();
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

    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('CashOnPickup');
    const [isProcessingOrder, setIsProcessingOrder] = useState(false);
    const [orderConfirmation, setOrderConfirmation] = useState(null);
    const [checkoutError, setCheckoutError] = useState(null);

    const isTakeawayOnly = useMemo(() => {
        return cart?.items && cart.items.length > 0 && cart.items.every(item => item?.itemModelType === 'Menu');
    }, [cart?.items]);

    const isProductOnly = useMemo(() => {
        return cart?.items && cart.items.length > 0 && cart.items.every(item => item?.itemModelType === 'Product');
    }, [cart?.items]);

    const sourceId = cart?.items?.[0]?.sourceId;

    const [availableOffers, setAvailableOffers] = useState([]);
    const [selectedOffer, setSelectedOffer] = useState(null);

    const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL;
    const [adjustedGrandTotal, setAdjustedGrandTotal] = useState(cartTotals.grandTotal);

    useEffect(() => {
        let newGrandTotal = cartTotals.grandTotal;

        if (selectedOffer) {
            if (selectedOffer.percentage) {
                const discountAmount = (cartTotals.grandTotal * selectedOffer.value) / 100;
                newGrandTotal = cartTotals.grandTotal - discountAmount;
            } else {
                newGrandTotal = cartTotals.grandTotal - selectedOffer.value;
            }
            newGrandTotal = Math.max(0, newGrandTotal);
        }
        setAdjustedGrandTotal(newGrandTotal);
    }, [selectedOffer, cartTotals.grandTotal]);

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
            }
        };

        const fetchOffers = async () => {
            try {
                let allFetchedOffers = [];

                if (isTakeawayOnly && sourceId) {
                    const restaurantOffersResponse = await axios.get(`${VITE_SERVER_URL}/api/restaurant/offer/${sourceId}`, { withCredentials: true });
                    allFetchedOffers = restaurantOffersResponse.data.offers || [];
                } else if (isProductOnly && sourceId) {
                    allFetchedOffers = [];
                }

                const filteredOffers = allFetchedOffers.filter(offer => {
                    if (!offer.active) {
                        return false;
                    }

                    const offerStartDate = new Date(offer.startDate);
                    const offerEndDate = new Date(offer.endDate);
                    const now = new Date();

                    if (now < offerStartDate || now > offerEndDate) {
                        return false;
                    }

                    if (offer.applicable === 'all') {
                        return true;
                    }

                    if (typeof offer.applicable === 'string' && offer.applicable !== 'all') {
                        return cart.items.some(cartItem => cartItem.product === offer.applicable);
                    }

                    return false;
                });

                setAvailableOffers(filteredOffers);

            } catch (err) {
                console.error("Failed to fetch offers:", err);
                toast.error("Failed to load offers.");
                setAvailableOffers([]);
            }
        };

        fetchUserProfile();
        if (cart?.items?.length > 0 && sourceId) {
            fetchOffers();
        } else {
            setAvailableOffers([]);
        }
    }, [VITE_SERVER_URL, isTakeawayOnly, isProductOnly, sourceId, cart?.items?.length, cart?.items]);

    const handleSelectedOffer = (offerId) => {
        if (!offerId) {
            setSelectedOffer(null);
            return;
        }
        const foundOffer = availableOffers.find((offer) => offer._id?.toString() === offerId);
        setSelectedOffer(foundOffer || null);
    };

    const handleCustomerInfoChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith("shippingAddress.")) {
            const addressField = name?.split('.')[1];
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

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setIsProcessingOrder(true);
        setCheckoutError(null);
        setOrderConfirmation(null);

        if (cartItems.length === 0) {
            setCheckoutError('Your cart is empty. Please add items before checking out.');
            setIsProcessingOrder(false);
            return;
        }

        if (!customerInfo.customerName || !customerInfo.customerEmail) {
            setCheckoutError('Please fill in your name and email.');
            setIsProcessingOrder(false);
            return;
        }

        if (!isTakeawayOnly && (!customerInfo.shippingAddress.street || !customerInfo.shippingAddress.city ||
            !customerInfo.shippingAddress.state || !customerInfo.shippingAddress.zip ||
            !customerInfo.shippingAddress.country)) {
            setCheckoutError('Please fill in all required shipping information.');
            setIsProcessingOrder(false);
            return;
        }

        let discount = 0;
        if (selectedOffer) {
            if (selectedOffer.percentage) {
                discount = (cartTotals.grandTotal * selectedOffer.value) / 100;
            } else {
                discount = selectedOffer.value;
            }
            discount = Math.min(discount, cartTotals.grandTotal);
        }

        const orderPayload = {
            customerName: customerInfo.customerName,
            customerEmail: customerInfo.customerEmail,
            customerPhoneNumber: customerInfo.customerPhoneNumber,
            ...(isTakeawayOnly ? {} : { shippingAddress: customerInfo.shippingAddress }),
            paymentMethod: isTakeawayOnly ? 'Takeaway' : selectedPaymentMethod,
            selectedOfferId: selectedOffer?._id,
            discountOfferValue: discount,
            items: cart.items.map(item => ({
                productId: item.product._id,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                selectedSize: item.selectedSize,
                selectedColor: item.selectedColor,
                itemModelType: item.itemModelType,
                sourceId: item.sourceId
            })),
            cartTotals: {
                subtotal: cartTotals.subtotal,
                estimatedTaxes: cartTotals.estimatedTaxes,
                grandTotal: cartTotals.grandTotal,
                totalItems: cartTotals.totalItems,
                appliedCharges:cartTotals.appliedCharges,
            },
            finalTotalAmount: adjustedGrandTotal
        };
        console.log(orderPayload);
        try {
            const response = await axios.post(`${VITE_SERVER_URL}/api/order`, orderPayload, { withCredentials: true });

            setOrderConfirmation(response.data.order);
            await clearCart();
            toast.success('Order placed successfully!');
        } catch (err) {
            console.error('Error placing order:', err);
            setCheckoutError(err.response?.data?.message || 'Failed to place order. Please try again.');
            toast.error(err.response?.data?.message || 'Failed to place order.');
        } finally {
            setIsProcessingOrder(false);
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

    if (!cartLoading && (!cart || cart.items.length === 0)) {
        toast.info("Your cart is empty. Redirecting to home.");
        navigate('/');
        return null;
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

    const cartItems = cart?.items || [];

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
                                                <img src={item.image || `https://placehold.co/60x60/e0e0e0/ffffff?text=${item.name.substring(0, 1)}`} alt={item.name} className="w-16 h-16 object-cover rounded-md border border-gray-100"
                                                    onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/60x60/e0e0e0/ffffff?text=${item.name.substring(0, 1)}`; }}
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
                                {cartTotals?.appliedCharges && (
                                            cartTotals?.appliedCharges?.map((item,index)=>(
                                            <div className="flex justify-between text-gray-700 mb-4" key={index}>
                                            <span className="text-base">{item?.name}:</span>
                                            <span className="font-medium text-lg">{item?.amountApplied.toFixed(2)}</span>
                                            </div>
                                            ))
                                        )}

                                {availableOffers.length > 0 && (
                                    <div className="mb-4">
                                        <label htmlFor="offer-select" className="block text-sm font-medium text-gray-700 mb-2">
                                            Apply an Offer:
                                        </label>
                                        <select
                                            id="offer-select"
                                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                            value={selectedOffer ? selectedOffer._id : ''}
                                            onChange={(e) => handleSelectedOffer(e.target.value)}
                                        >
                                            <option value="">No Offer Selected</option>
                                            {availableOffers.map((offer) => (
                                                <option key={offer._id} value={offer._id}>
                                                    {offer.name} ({offer.percentage ? `${offer.value}% OFF` : `₹${offer.value} OFF`})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {selectedOffer && (
                                    <div className="flex justify-between font-bold text-xl text-green-600 pt-2 border-t border-gray-100">
                                        <span>Selected Offer ({selectedOffer.name}):</span>
                                        <span>
                                            {selectedOffer.percentage
                                                ? `-${selectedOffer.value}%`
                                                : `-₹${selectedOffer.value?.toFixed(2)}`}
                                        </span>
                                    </div>
                                )}

                                <div className="flex justify-between font-bold text-xl text-gray-900 pt-2 border-t border-gray-100">
                                    <span>Grand Total:</span>
                                    <span className="text-indigo-600">₹{adjustedGrandTotal?.toFixed(2)}</span>
                                </div>
                            </div>
                        </section>

                        <section className="mb-8 border border-gray-200 p-6 rounded-xl bg-gray-50">
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

                    <div>
                        {!isTakeawayOnly && (
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
                                            required={!isTakeawayOnly}
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
                                                required={!isTakeawayOnly}
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
                                                required={!isTakeawayOnly}
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
                                                required={!isTakeawayOnly}
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
                                                required={!isTakeawayOnly}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}

                        <section className="border border-gray-200 p-6 rounded-xl bg-gray-50">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-3 border-gray-200">Payment Details</h2>
                            {isTakeawayOnly ? (
                                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                                    <p className="text-lg font-semibold text-yellow-800">
                                        For takeaway orders, payment will be made at the time of pickup.
                                    </p>
                                    <p className="text-md text-yellow-700 mt-2">
                                        Please be ready to pay when you collect your order.
                                    </p>
                                    <input type="hidden" name="paymentMethod" value="CashOnPickup" />
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        {["CashOnDelivery", "Card", "UPI"].map(method => (
                                            <label key={method} className={`flex flex-col items-center p-4 border rounded-xl cursor-pointer transition-all duration-200 ${selectedPaymentMethod === method ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-500' : 'border-gray-300 hover:bg-gray-100'}`}>
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value={method}
                                                    checked={selectedPaymentMethod === method}
                                                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                                                    className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                                    required={!isTakeawayOnly}
                                                />
                                                <span className="mt-2 text-gray-700 font-medium text-lg">{method === 'CashOnDelivery' ? 'Cash on Delivery' : method}</span>
                                            </label>
                                        ))}
                                    </div>
                                </>
                            )}
                        </section>
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        type="submit"
                        className="w-full md:w-auto bg-indigo-600 text-white px-8 py-3 rounded-lg text-xl font-semibold hover:bg-indigo-700 transition duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isProcessingOrder || cartItems.length === 0}
                    >
                        {isProcessingOrder ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing Order...
                            </>
                        ) : (
                            'Place Order'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CheckoutPage;