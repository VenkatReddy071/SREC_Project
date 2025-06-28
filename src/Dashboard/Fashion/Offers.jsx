import React, { useState, useEffect, useCallback } from 'react';
import { PlusCircle, Edit, Trash2, ToggleRight, ToggleLeft, Save, XCircle, Filter } from 'lucide-react';
import {toast} from 'react-toastify';
import axios from 'axios';

const RestaurantOffersDashboard = () => {
    
    const MOCK_JWT_TOKEN = localStorage.getItem('dashboard');
    const [offers, setOffers] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [editingOffer, setEditingOffer] = useState(null);
    const [offerForm, setOfferForm] = useState({
        name: '',
        code: '',
        percentage: false,
        value: '',
        applicable: 'all',
        active: true,
        startDate: '',
        endDate: ''
    });
    const [filterStatus, setFilterStatus] = useState('all');

    const VITE_SERVER_URL = `${import.meta.env.VITE_SERVER_URL}`;

    const fetchDashboardData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const offersResponse = await axios.get(`${VITE_SERVER_URL}/api/mall/offers/my-restaurant`, {
                headers: { 'Authorization': `Bearer ${MOCK_JWT_TOKEN}` }
            });
            console.log(offersResponse);
            setOffers(offersResponse.data.offers || []);

            const menuItemsResponse = await axios.get(`${VITE_SERVER_URL}/api/mall/menu-items/my-restaurant`, {
                headers: { 'Authorization': `Bearer ${MOCK_JWT_TOKEN}` }
            });
            console.log(menuItemsResponse.data);
            setMenuItems(menuItemsResponse.data.menuItems || []);

        } catch (err) {
            console.error("Failed to fetch dashboard data:", err);
            setError(err.response?.data?.message || 'Failed to load offers or menu items.');
            toast.error(err.response?.data?.message || 'Failed to load dashboard data.');
        } finally {
            setLoading(false);
        }
    }, [VITE_SERVER_URL]);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setOfferForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const resetForm = useCallback(() => {
        setEditingOffer(null);
        setOfferForm({
            name: '',
            code: '',
            percentage: false,
            value: '',
            applicable: '',
            active: true,
            startDate: '',
            endDate: ''
        });
    }, []);

    const addOffer = async (e) => {
        e.preventDefault();
        if (!offerForm.name || !offerForm.code || offerForm.value === '' || !offerForm.startDate || !offerForm.endDate) {
            toast.error('Please fill all required offer fields.');
            return;
        }

        try {
            const response = await axios.post(`${VITE_SERVER_URL}/api/mall/offers/my-restaurant`, offerForm, {
                headers: { 'Authorization': `Bearer ${MOCK_JWT_TOKEN}` }
            });
            toast.success('Offer added successfully!');
            fetchDashboardData();
            resetForm();
        } catch (err) {
            console.error('Error adding offer:', err);
            toast.error(err.response?.data?.message || 'Failed to add offer.');
        }
    };

    const startEditOffer = useCallback((offer) => {
        console.log(offer);
        setEditingOffer(offer);
        setOfferForm({
            name: offer.name,
            code: offer.code,
            percentage: offer.percentage,
            value: offer.value,
            applicable: offer.applicable,
            active: offer.active,
            startDate: new Date(offer.startDate).toISOString().split('T')[0],
            endDate: new Date(offer.endDate).toISOString().split('T')[0]
        });
    }, []);

    const updateOffer = async (e) => {
        e.preventDefault();
        if (!editingOffer) return;
        if (!offerForm.name || !offerForm.code || offerForm.value === '' || !offerForm.startDate || !offerForm.endDate) {
            toast.error('Please fill all required offer fields.');
            return;
        }

        try {
            await axios.put(`${VITE_SERVER_URL}/api/mall/offers/my-restaurant/${editingOffer._id}`, offerForm, {
                headers: { 'Authorization': `Bearer ${MOCK_JWT_TOKEN}` }
            });
            toast.success('Offer updated successfully!');
            fetchDashboardData();
            resetForm();
        } catch (err) {
            console.error('Error updating offer:', err);
            toast.error(err.response?.data?.message || 'Failed to update offer.');
        }
    };

    const deleteOffer = async (id) => {
        if (window.confirm('Are you sure you want to delete this offer?')) {
            try {
                await axios.delete(`${VITE_SERVER_URL}/api/mall/offers/my-restaurant/${id}`, {
                    headers: { 'Authorization': `Bearer ${MOCK_JWT_TOKEN}` }
                });
                toast.success('Offer deleted!');
                fetchDashboardData();
                if (editingOffer && editingOffer._id === id) {
                    resetForm();
                }
            } catch (err) {
                console.error('Error deleting offer:', err);
                toast.error(err.response?.data?.message || 'Failed to delete offer.');
            }
        }
    };

    const toggleOfferStatus = async (id, currentStatus) => {
        try {
            await axios.put(`${VITE_SERVER_URL}/api/mall/offers/my-restaurant/${id}/toggle-status`, { active: !currentStatus }, {
                headers: { 'Authorization': `Bearer ${MOCK_JWT_TOKEN}` }
            });
            toast.success('Offer status updated!');
            fetchDashboardData();
        } catch (err) {
            console.error('Error toggling offer status:', err);
            toast.error(err.response?.data?.message || 'Failed to update offer status.');
        }
    };

    const filteredOffers = offers.filter(offer => {
        if (filterStatus === 'active') return offer.active;
        if (filterStatus === 'inactive') return !offer.active;
        return true;
    });

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center font-inter">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                <p className="ml-4 text-lg text-gray-700">Loading restaurant offers...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex justify-center items-center p-4 font-inter">
                <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-xl relative" role="alert">
                    <strong className="font-bold text-xl">Error! </strong>
                    <span className="block sm:inline text-lg mt-2 sm:mt-0">{error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="font-inter container mx-auto p-4 md:p-8 bg-gray-100 min-h-screen">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center pb-4 border-b-4 border-orange-600">Restaurant Offers Dashboard</h1>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg h-full ">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-3 border-gray-200 flex items-center">
                        <Filter className="w-6 h-6 mr-2 text-indigo-500" /> Manage Offers
                    </h2>

                    <div className="mb-4 flex space-x-2">
                        <button
                            onClick={() => setFilterStatus('all')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filterStatus === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        >
                            All Offers ({offers.length})
                        </button>
                        <button
                            onClick={() => setFilterStatus('active')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filterStatus === 'active' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        >
                            Active ({offers.filter(o => o.active).length})
                        </button>
                        <button
                            onClick={() => setFilterStatus('inactive')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filterStatus === 'inactive' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        >
                            Inactive ({offers.filter(o => !o.active).length})
                        </button>
                    </div>

                    {filteredOffers.length === 0 ? (
                        <p className="text-gray-500 italic py-4 text-center">No {filterStatus === 'all' ? '' : filterStatus} offers to display.</p>
                    ) : (
                        <div className="space-y-4">
                            {filteredOffers.map(offer => (
                                <div key={offer._id} className={`p-4 rounded-lg border flex justify-between items-center transition-all duration-200 ${
                                    offer.active ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200 opacity-80'
                                }`}>
                                    <div>
                                        <h3 className={`font-semibold text-lg ${offer.active ? 'text-green-800' : 'text-gray-700'}`}>
                                            {offer.name} {offer.active ? '' : '(Inactive)'}
                                        </h3>
                                        <p className={`text-sm ${offer.active ? 'text-green-700' : 'text-gray-600'}`}>
                                            Code: <span className="font-mono">{offer.code}</span> | {offer.description}
                                        </p>
                                        <p className={`text-xs mt-1 ${offer.active ? 'text-green-600' : 'text-gray-500'}`}>
                                            Discount: {offer.percentage ? `${offer.value}%` : `$${offer.value}`}
                                            {offer.applicable && offer.applicable !== 'all' ? ` | Applies to: ${menuItems.find(item => item._id === offer.applicable)?.name || 'Specific Item'}` : ' | Applies to: All Products'}
                                            {offer.startDate && offer.endDate && ` | ${new Date(offer.startDate).toLocaleDateString()} to ${new Date(offer.endDate).toLocaleDateString()}`}
                                        </p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button onClick={() => startEditOffer(offer)} className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors" title="Edit Offer"><Edit className="w-5 h-5" /></button>
                                        <button onClick={() => toggleOfferStatus(offer._id, offer.active)} className={`p-2 rounded-full transition-colors ${offer.active ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-green-100 text-green-600 hover:bg-green-200'}`} title={offer.active ? 'Deactivate Offer' : 'Activate Offer'}>
                                            {offer.active ? <ToggleLeft className="w-5 h-5" /> : <ToggleRight className="w-5 h-5" />}
                                        </button>
                                        <button onClick={() => deleteOffer(offer._id)} className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors" title="Delete Offer"><Trash2 className="w-5 h-5" /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg h-fit sticky top-4">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-3 border-gray-200 flex items-center">
                        {editingOffer ? <><Edit className="w-6 h-6 mr-2 text-purple-500" /> Edit Offer</> : <><PlusCircle className="w-6 h-6 mr-2 text-green-500" /> Add New Offer</>}
                    </h2>
                    <form onSubmit={editingOffer ? updateOffer : addOffer} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Offer Name</label>
                            <input type="text" name="name" id="name" value={offerForm.name} onChange={handleFormChange} required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>
                        <div>
                            <label htmlFor="code" className="block text-sm font-medium text-gray-700">Offer Code</label>
                            <input type="text" name="code" id="code" value={offerForm.code} onChange={handleFormChange} required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea name="description" id="description" value={offerForm.description} onChange={handleFormChange} required
                                rows="3" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"></textarea>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" name="percentage" id="percentage" checked={offerForm.percentage} onChange={handleFormChange}
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                                <label htmlFor="percentage" className="block text-sm text-gray-900">Is Percentage Discount?</label>
                            </div>
                            <div>
                                <label htmlFor="value" className="block text-sm font-medium text-gray-700">Discount Value ({offerForm.percentage ? '%' : '$'})</label>
                                <input type="number" name="value" id="value" value={offerForm.value} onChange={handleFormChange} required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
                                <input type="date" name="startDate" id="startDate" value={offerForm.startDate} onChange={handleFormChange} required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                            </div>
                            <div>
                                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
                                <input type="date" name="endDate" id="endDate" value={offerForm.endDate} onChange={handleFormChange} required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="applicable" className="block text-sm font-medium text-gray-700">Applies To</label>
                            <select name="applicable" id="applicable" value={offerForm.applicable} onChange={handleFormChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                                <option value="all">All Products</option>
                                {menuItems?.map(item => (
                                    <option key={item._id} value={item._id}>{item.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-center">
                            <input type="checkbox" name="active" id="active" checked={offerForm.active} onChange={handleFormChange}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                            <label htmlFor="active" className="ml-2 block text-sm text-gray-900">Offer is Active</label>
                        </div>
                        <div className="flex justify-end space-x-3">
                            {editingOffer && (
                                <button type="button" onClick={resetForm}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                    <XCircle className="w-5 h-5 mr-2" /> Cancel
                                </button>
                            )}
                            <button type="submit"
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                <Save className="w-5 h-5 mr-2" /> {editingOffer ? 'Update Offer' : 'Add Offer'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RestaurantOffersDashboard;
