import React, { useState, useEffect, useCallback } from 'react';
import {
    Mail, Phone, Clock, Save, List, ShoppingBag, CheckSquare, Star,Globe
} from 'lucide-react';
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

const MallInfoPage = () => {
    const [mallData, setMallData] = useState({
        name: '',
        image: '',
        gallery: [],
        phoneNumber: '',
        email: '',
        website: '',
        area: '',
        locationName: '',
        address: '',
        pincode: '',
        coordinates: {
            latitude: null,
            longitude: null,
        },
        nearByLocations: [],
        rating: 4,
        mallType: [],
        info: '',
        description: '',
        amenities: [],
        shoppingDepartments: [],
        hasWeddingShopping: false,
        totalStores: 0,
        totalAreaSqFt: 0,
        establishedDate: '',
        offersAvailable: false,
        status: 'pending',
        operatingHours: getDefaultOperatingHours(),
        // 'closed' for the entire mall, if it's a mall-level property.
        // It's used in the UI, so adding it here.
        closed: false,
        availableMargins: 0,
    });

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);

    const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL;

    const AMENITIES = ["Parking", "Valet Parking", "Restrooms", "Wheelchair Accessible", "Wi-Fi", "ATM", "Concierge", "Lost & Found", "Changing Rooms"];
    const SHOPPING_DEPARTMENTS = ["Men", "Women", "Kids", "Books", "Footwear", "Accessories", "Gifts"];

    useEffect(() => {
        const fetchMallData = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem('dashboard');
                if (!token) {
                    throw new Error('Authentication token not found. Please log in.');
                }

                const response = await axios.get(`${VITE_SERVER_URL}/api/malls/outlet/email`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const fetchedData = response.data.mall;

                setMallData(prevData => ({
                    ...prevData,
                    ...fetchedData,
                    coordinates: {
                        latitude: fetchedData.coordinates?.latitude || null,
                        longitude: fetchedData.coordinates?.longitude || null,
                    },
                    gallery: Array.isArray(fetchedData.gallery) ? fetchedData.gallery : [],
                    nearByLocations: Array.isArray(fetchedData.nearByLocations) ? fetchedData.nearByLocations : [],
                    amenities: Array.isArray(fetchedData.amenities) ? fetchedData.amenities : [],
                    shoppingDepartments: Array.isArray(fetchedData.shoppingDepartments) ? fetchedData.shoppingDepartments : [],
                    mallType: Array.isArray(fetchedData.mallType) ? fetchedData.mallType : [],
                    establishedDate: fetchedData.establishedDate
                        ? new Date(fetchedData.establishedDate).toISOString().split('T')[0]
                        : '',
                    operatingHours: getDefaultOperatingHours().map(defaultHour => {
                        const fetchedHour = (fetchedData.operatingHours || []).find(fh => fh.day === defaultHour.day);
                        return {
                            day: defaultHour.day,
                            openTime: fetchedHour?.openTime || defaultHour.openTime,
                            closeTime: fetchedHour?.closeTime || defaultHour.closeTime,
                            isClosed: fetchedHour?.isClosed || defaultHour.isClosed,
                        };
                    }),
                }));

            } catch (err) {
                console.error('Error fetching mall data:', err);
                setError(err.response?.data?.message || 'Failed to load mall information. Please try again.');
                toast.error(err.response?.data?.message || 'Failed to load data.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchMallData();
    }, [VITE_SERVER_URL]);

    const handleGeneralChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        setMallData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    }, []);

    const handleNumberChange = useCallback((e) => {
        const { name, value } = e.target;
        setMallData(prev => ({
            ...prev,
            [name]: parseFloat(value) || 0
        }));
    }, []);

    const handleCoordinatesChange = useCallback((e) => {
        const { name, value } = e.target;
        setMallData(prev => ({
            ...prev,
            coordinates: {
                ...prev.coordinates,
                [name]: parseFloat(value) || null
            }
        }));
    }, []);

    const handleArrayChange = useCallback((e) => {
        const { name, value } = e.target;
        setMallData(prev => ({
            ...prev,
            [name]: value.split(',').map(item => item.trim()).filter(item => item !== '')
        }));
    }, []);

    const handleMultiSelectChange = useCallback((name, selectedOptions) => {
        setMallData(prev => ({
            ...prev,
            [name]: Array.from(selectedOptions).map(option => option.value)
        }));
    }, []);

    const handleCheckboxArrayChange = useCallback((name, itemValue, isChecked) => {
        setMallData(prev => {
            const currentArray = prev[name];
            if (isChecked) {
                return { ...prev, [name]: [...currentArray, itemValue] };
            } else {
                return { ...prev, [name]: currentArray.filter(item => item !== itemValue) };
            }
        });
    }, []);

    const handleOperatingHoursChange = useCallback((index, field, value) => {
        setMallData(prev => {
            const updatedHours = [...prev.operatingHours];
            updatedHours[index] = { ...updatedHours[index], [field]: value };
            return { ...prev, operatingHours: updatedHours };
        });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);

        if (!mallData.name || !mallData.email || !mallData.address || !mallData.area || !mallData.locationName || !mallData.phoneNumber || !mallData.info || mallData.mallType.length === 0) {
            setError('Please fill in all required general information fields (Name, Email, Address, Area, Location Name, Phone, Info, Mall Type).');
            toast.error('Validation Error: Missing required fields.');
            setIsSaving(false);
            return;
        }
        if (!/^\S+@\S+\.\S+$/.test(mallData.email)) {
            setError('Please use a valid email address.');
            toast.error('Validation Error: Invalid email address.');
            setIsSaving(false);
            return;
        }
        if (mallData.info.length > 250) {
            setError('Info field cannot exceed 250 characters.');
            toast.error('Validation Error: Info too long.');
            setIsSaving(false);
            return;
        }

        const payload = {
            name: mallData.name,
            image: mallData.image,
            gallery: mallData.gallery,
            phoneNumber: mallData.phoneNumber,
            email: mallData.email,
            website: mallData.website,
            area: mallData.area,
            locationName: mallData.locationName,
            address: mallData.address,
            pincode: mallData.pincode,
            coordinates: {
                latitude: parseFloat(mallData.coordinates.latitude) || null,
                longitude: parseFloat(mallData.coordinates.longitude) || null,
            },
            nearByLocations: mallData.nearByLocations,
            rating: parseFloat(mallData.rating),
            mallType: mallData.mallType,
            info: mallData.info,
            description: mallData.description,
            amenities: mallData.amenities,
            shoppingDepartments: mallData.shoppingDepartments,
            hasWeddingShopping: mallData.hasWeddingShopping,
            totalStores: parseInt(mallData.totalStores),
            totalAreaSqFt: parseFloat(mallData.totalAreaSqFt),
            establishedDate: mallData.establishedDate ? new Date(mallData.establishedDate) : null,
            offersAvailable: mallData.offersAvailable,
            status: mallData.status,
            operatingHours: mallData.operatingHours,
            closed: mallData.closed,
            availableMargins: parseFloat(mallData.availableMargins),
        };

        try {
            const token = localStorage.getItem('dashboard');
            if (!token) {
                throw new Error('Authentication token not found. Please log in before saving.');
            }

            const response = await axios.put(`${VITE_SERVER_URL}/api/malls/update-by-email`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true
            });

            toast.success('Mall information saved successfully!');
        } catch (err) {
            console.error('Error saving mall data:', err);
            setError(err.response?.data?.message || 'Failed to save mall information.');
            toast.error(err.response?.data?.message || 'Failed to save information.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center font-inter bg-gray-100">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
                <p className="mt-4 text-xl text-gray-700 font-semibold">Loading mall information...</p>
            </div>
        );
    }

    return (
        <div className="font-inter container mx-auto p-4 md:p-8 bg-gray-100 min-h-screen">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8 text-center">
                Manage Mall Information
            </h1>
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-xl relative mb-6" role="alert">
                    <strong className="font-bold text-xl">Error! </strong>
                    <span className="block sm:inline text-lg mt-2 sm:mt-0">{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                <section className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Mall Name <span className="text-red-500">*</span></label>
                            <input type="text" id="name" name="name" value={mallData.name} onChange={handleGeneralChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" required />
                        </div>
                        <div>
                            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center"><Phone className="h-5 w-5 text-gray-400" /></span>
                                <input type="tel" id="phoneNumber" name="phoneNumber" value={mallData.phoneNumber} onChange={handleGeneralChange} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" required />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center"><Mail className="h-5 w-5 text-gray-400" /></span>
                                <input type="email" id="email" name="email" value={mallData.email} onChange={handleGeneralChange} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" required />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center"><Globe className="h-5 w-5 text-gray-400" /></span>
                                <input type="url" id="website" name="website" value={mallData.website} onChange={handleGeneralChange} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="info" className="block text-sm font-medium text-gray-700 mb-1">Short Info <span className="text-red-500">*</span></label>
                            <textarea id="info" name="info" value={mallData.info} onChange={handleGeneralChange} rows="2" maxLength="250" className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-y" required />
                            <p className="mt-1 text-sm text-gray-500">{mallData.info.length}/250 characters</p>
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea id="description" name="description" value={mallData.description} onChange={handleGeneralChange} rows="4" className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-y" />
                        </div>
                    </div>
                </section>

                <section className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <label htmlFor="hasWeddingShopping" className="flex items-center space-x-2 cursor-pointer p-2 rounded-md hover:bg-gray-50">
                                <input type="checkbox" id="hasWeddingShopping" name="hasWeddingShopping" checked={mallData.hasWeddingShopping} onChange={handleGeneralChange} className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                                <CheckSquare className="w-5 h-5 text-pink-500" />
                                <span className="text-gray-800">Has Wedding Shopping</span>
                            </label>
                            <label htmlFor="offersAvailable" className="flex items-center space-x-2 cursor-pointer p-2 rounded-md hover:bg-gray-50">
                                <input type="checkbox" id="offersAvailable" name="offersAvailable" checked={mallData.offersAvailable} onChange={handleGeneralChange} className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                                <Star className="w-5 h-5 text-yellow-500" />
                                <span className="text-gray-800">Offers Available</span>
                            </label>
                        </div>
                    </div>
                </section>

                <section className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-3 border-gray-200 flex items-center">
                        <List className="w-6 h-6 mr-2 text-orange-500" /> Amenities
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {AMENITIES.map(amenity => (
                            <label key={amenity} className="flex items-center space-x-2 cursor-pointer p-2 rounded-md hover:bg-gray-50">
                                <input
                                    type="checkbox"
                                    checked={mallData.amenities.includes(amenity)}
                                    onChange={(e) => handleCheckboxArrayChange('amenities', amenity, e.target.checked)}
                                    className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                />
                                <span className="text-gray-800">{amenity}</span>
                            </label>
                        ))}
                    </div>
                </section>

                <section className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-3 border-gray-200 flex items-center">
                        <ShoppingBag className="w-6 h-6 mr-2 text-blue-500" /> Shopping Departments
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {SHOPPING_DEPARTMENTS.map(department => (
                            <label key={department} className="flex items-center space-x-2 cursor-pointer p-2 rounded-md hover:bg-gray-50">
                                <input
                                    type="checkbox"
                                    checked={mallData.shoppingDepartments.includes(department)}
                                    onChange={(e) => handleCheckboxArrayChange('shoppingDepartments', department, e.target.checked)}
                                    className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                />
                                <span className="text-gray-800">{department}</span>
                            </label>
                        ))}
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
                                checked={mallData.closed}
                                onChange={handleGeneralChange}
                                className="h-6 w-6 text-red-600 border-red-300 rounded focus:ring-red-500 mr-3"
                            />
                            <span>Mall Temporarily Closed</span>
                        </label>
                        {mallData.closed && (
                            <span className="text-red-700 text-sm italic">
                                (This will override daily operating hours)
                            </span>
                        )}
                    </div>

                    <div className={`space-y-4 ${mallData.closed ? 'opacity-50 pointer-events-none' : ''}`}>
                        {mallData.operatingHours.map((hour, index) => (
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

export default MallInfoPage;