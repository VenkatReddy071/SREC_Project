import React, { useState, useEffect, useCallback } from 'react';
import { Mail, Phone, MapPin, Clock, Save, Building2, Star, Truck, ShoppingBag } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';

const getDefaultOperatingHours = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return days.map(day => ({
        day,
        openTime: '09:00',
        closeTime: '17:00',
        isClosed: false,
    }));
};

const OutletInfoPage = () => {
    const [outletData, setOutletData] = useState({
        name: '',
        email: '',
        address: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
        },
        phone: '',
        isTopPick: false,
        offersDelivery: false,
        isTakeaway: false,
        closed: false,
        operatingHours: getDefaultOperatingHours(),
    });

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);

    const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL;

    useEffect(() => {
        const fetchOutletData = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem('dashboard');
                if (!token) {
                    throw new Error('Authentication token not found. Please log in.');
                }

                const response = await axios.get(`${VITE_SERVER_URL}/api/restaurant/email/email`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const fetchedData = response.data.data.restaurant;
                console.log(fetchedData);
                setOutletData(prevData => ({
                    ...prevData,
                    ...fetchedData,
                    address: {
                        ...prevData.address,
                        ...fetchedData.address
                    },
                    operatingHours: fetchedData.operatingHours && fetchedData.operatingHours.length > 0
                        ? fetchedData.operatingHours.map(hour => ({
                            day: hour.day,
                            openTime: hour.openTime || '09:00',
                            closeTime: hour.closeTime || '17:00',
                            isClosed: hour.isClosed || false,
                        }))
                        : getDefaultOperatingHours()
                }));

            } catch (err) {
                console.error('Error fetching outlet data:', err);
                setError(err.response?.data?.message || 'Failed to load outlet information. Please try again.');
                toast.error(err.response?.data?.message || 'Failed to load data.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchOutletData();
    }, [VITE_SERVER_URL]);


    const handleGeneralChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setOutletData(prev => ({ ...prev, [name]: checked }));
        } else {
            setOutletData(prev => ({ ...prev, [name]: value }));
        }
    }, []);

    const handleAddressChange = useCallback((e) => {
        const { name, value } = e.target;
        setOutletData(prev => ({
            ...prev,
            address: {
                ...prev.address,
                [name]: value
            }
        }));
    }, []);

    const handleOperatingHoursChange = useCallback((index, field, value) => {
        setOutletData(prev => {
            const updatedHours = [...prev.operatingHours];
            updatedHours[index] = { ...updatedHours[index], [field]: value };
            return { ...prev, operatingHours: updatedHours };
        });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);

        if (!outletData.name || !outletData.email || !outletData.address.street || !outletData.address.city || !outletData.address.state) {
            setError('Please fill in all required fields: Name, Owner Email, Street, City, and State.');
            toast.error('Validation Error: Missing required fields.');
            setIsSaving(false);
            return;
        }
        if (!/^\S+@\S+\.\S+$/.test(outletData.email)) {
            setError('Please use a valid email address.');
            toast.error('Validation Error: Invalid email address.');
            setIsSaving(false);
            return;
        }

        const payload = {
            name: outletData.name,
            email: outletData.email,
            address: {
                street: outletData.address.street,
                city: outletData.address.city,
                state: outletData.address.state,
                zipCode: outletData.address.zipCode,
            },
            phone: outletData.phone,
            isTopPick: outletData.isTopPick,
            offersDelivery: outletData.offersDelivery,
            isTakeaway: outletData.isTakeaway,
            closed: outletData.closed,
            operatingHours: outletData.operatingHours,
        };

        try {
            const token = localStorage.getItem('dashboard');
            if (!token) {
                 throw new Error('Authentication token not found. Please log in before saving.');
            }
            const response=await axios.put(`${import.meta.env.VITE_SERVER_URL}/api/restaurant/update-by-email`,payload,{headers:{Authorization:`Bearer ${token}`},withCredentials:true})
            console.log(response.data);
            console.log('Simulating save with payload:', payload);
            toast.success('Outlet information saved successfully!');
            setIsSaving(false);
        } catch (err) {
            console.error('Error saving outlet data:', err);
            setError(err.response?.data?.message || 'Failed to save outlet information.');
            toast.error(err.response?.data?.message || 'Failed to save information.');
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex justify-center items-center font-inter">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                <p className="ml-4 text-lg text-gray-700">Loading outlet information...</p>
            </div>
        );
    }

    return (
        <div className="font-inter container mx-auto p-4 md:p-8 bg-gray-100 min-h-screen">
    
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-xl relative mb-6" role="alert">
                    <strong className="font-bold text-xl">Error! </strong>
                    <span className="block sm:inline text-lg mt-2 sm:mt-0">{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                <section className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-3 border-gray-200 flex items-center">
                        <Building2 className="w-6 h-6 mr-2 text-blue-500" /> General Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Outlet Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={outletData.name}
                                onChange={handleGeneralChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Owner Email</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center"><Mail className="h-5 w-5 text-gray-400" /></span>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={outletData.email}
                                    onChange={handleGeneralChange}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center"><Phone className="h-5 w-5 text-gray-400" /></span>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={outletData.phone}
                                    onChange={handleGeneralChange}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-3 border-gray-200 flex items-center">
                        <MapPin className="w-6 h-6 mr-2 text-green-500" /> Address Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label htmlFor="address.street" className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                            <input
                                type="text"
                                id="address.street"
                                name="street"
                                value={outletData.address.street}
                                onChange={handleAddressChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="address.city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                            <input
                                type="text"
                                id="address.city"
                                name="city"
                                value={outletData.address.city}
                                onChange={handleAddressChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="address.state" className="block text-sm font-medium text-gray-700 mb-1">State/Province</label>
                            <input
                                type="text"
                                id="address.state"
                                name="state"
                                value={outletData.address.state}
                                onChange={handleAddressChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="address.zipCode" className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                            <input
                                type="text"
                                id="address.zipCode"
                                name="zipCode"
                                value={outletData.address.zipCode}
                                onChange={handleAddressChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                    </div>
                </section>

                <section className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-3 border-gray-200 flex items-center">
                        Services & Features
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <label htmlFor="isTopPick" className="flex items-center space-x-2 cursor-pointer p-2 rounded-md hover:bg-gray-50">
                            <input
                                type="checkbox"
                                id="isTopPick"
                                name="isTopPick"
                                checked={outletData.isTopPick}
                                onChange={handleGeneralChange}
                                className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            />
                            <Star className="w-5 h-5 text-yellow-500" />
                            <span className="text-gray-800">Is Top Pick</span>
                        </label>
                        <label htmlFor="offersDelivery" className="flex items-center space-x-2 cursor-pointer p-2 rounded-md hover:bg-gray-50">
                            <input
                                type="checkbox"
                                id="offersDelivery"
                                name="offersDelivery"
                                checked={outletData.offersDelivery}
                                onChange={handleGeneralChange}
                                className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            />
                            <Truck className="w-5 h-5 text-green-500" />
                            <span className="text-gray-800">Offers Delivery</span>
                        </label>
                        <label htmlFor="isTakeaway" className="flex items-center space-x-2 cursor-pointer p-2 rounded-md hover:bg-gray-50">
                            <input
                                type="checkbox"
                                id="isTakeaway"
                                name="isTakeaway"
                                checked={outletData.isTakeaway}
                                onChange={handleGeneralChange}
                                className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            />
                            <ShoppingBag className="w-5 h-5 text-blue-500" />
                            <span className="text-gray-800">Is Takeaway</span>
                        </label>
                    </div>
                </section>

                <section className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-3 border-gray-200 flex items-center">
                        <Clock className="w-6 h-6 mr-2 text-purple-500" /> Operating Hours
                    </h2>

                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
                        <label htmlFor="closed" className="flex items-center cursor-pointer text-lg font-semibold text-gray-800">
                            <input
                                type="checkbox"
                                id="closed"
                                name="closed"
                                checked={outletData.closed}
                                onChange={handleGeneralChange}
                                className="h-6 w-6 text-red-600 border-red-300 rounded focus:ring-red-500 mr-3"
                            />
                            <span>Outlet Temporarily Closed</span>
                        </label>
                        {outletData.closed && (
                            <span className="text-red-700 text-sm italic">
                                (This will override daily operating hours)
                            </span>
                        )}
                    </div>

                    <div className={`space-y-4 ${outletData.closed ? 'opacity-50 pointer-events-none' : ''}`}>
                        {outletData.operatingHours.map((hour, index) => (
                            <div key={hour.day} className="flex flex-col sm:flex-row items-start sm:items-center p-3 border border-gray-200 rounded-md bg-gray-50">
                                <span className="font-semibold text-gray-700 w-full sm:w-32 mb-2 sm:mb-0">{hour.day}:</span>
                                <div className="flex-grow grid grid-cols-2 gap-4 items-center w-full">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id={`closed-${hour.day}`}
                                            checked={hour.isClosed}
                                            onChange={(e) => handleOperatingHoursChange(index, 'isClosed', e.target.checked)}
                                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                        />
                                        <label htmlFor={`closed-${hour.day}`} className="ml-2 block text-sm text-gray-900">Closed for Day</label>
                                    </div>
                                    {!hour.isClosed && (
                                        <>
                                            <div>
                                                <label htmlFor={`open-${hour.day}`} className="block text-xs font-medium text-gray-600">Open</label>
                                                <input
                                                    type="time"
                                                    id={`open-${hour.day}`}
                                                    value={hour.openTime}
                                                    onChange={(e) => handleOperatingHoursChange(index, 'openTime', e.target.value)}
                                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor={`close-${hour.day}`} className="block text-xs font-medium text-gray-600">Close</label>
                                                <input
                                                    type="time"
                                                    id={`close-${hour.day}`}
                                                    value={hour.closeTime}
                                                    onChange={(e) => handleOperatingHoursChange(index, 'closeTime', e.target.value)}
                                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className={`inline-flex items-center px-8 py-3 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white transition-all duration-300
                            ${isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'}
                        `}
                    >
                        {isSaving ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5 mr-2" /> Save Changes
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default OutletInfoPage;
