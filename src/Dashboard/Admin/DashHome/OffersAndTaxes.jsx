import React, { useState, useEffect } from 'react';
import { FaPlus, FaTag, FaPercentage, FaCalendarAlt, FaDollarSign, FaUtensils, FaTshirt, FaClipboardList, FaSpinner, FaEdit, FaTrashAlt, FaInfoCircle } from 'react-icons/fa';
import axios from 'axios';
import CustomModal from '../../../Pages/CustomModol';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
};

const formatTime = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
};

export const OfferAndTaxManagement = () => {
  const [activeTab, setActiveTab] = useState('offers'); // 'offers' or 'taxes'
  const [loading, setLoading] = useState(false);
  const [offers, setOffers] = useState([]);
  const [taxes, setTaxes] = useState([]);

  // State for New Offer Form
  const [offerName, setOfferName] = useState('');
  const [offerType, setOfferType] = useState('percentage'); // 'percentage' or 'fixed'
  const [offerValue, setOfferValue] = useState('');
  const [offerApplicableTo, setOfferApplicableTo] = useState('all'); // 'all', 'restaurant', 'fashion'
  const [offerStartDate, setOfferStartDate] = useState('');
  const [offerEndDate, setOfferEndDate] = useState('');

  // State for New Tax Form
  const [taxName, setTaxName] = useState('');
  const [taxType, setTaxType] = useState('percentage'); // 'percentage' or 'fixed'
  const [taxValue, setTaxValue] = useState('');
  const [taxApplicableTo, setTaxApplicableTo] = useState('all'); // 'all', 'restaurant', 'fashion', 'hospital'

  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState("");

  const SERVER_URL = `${import.meta.env.VITE_SERVER_URL}`;

  const fetchOffersAndTaxes = async () => {
    setLoading(true);
    try {
      const offersResponse = await axios.get(`${SERVER_URL}/api/offers`, { withCredentials: true });
      if (offersResponse.status === 200) {
        setOffers(offersResponse.data || []);
      }

      // Fetch Taxes
      const taxesResponse = await axios.get(`${SERVER_URL}/api/taxes`, { withCredentials: true });
      if (taxesResponse.status === 200) {
        setTaxes(taxesResponse.data || []);
      }
    } catch (error) {
      console.error("Error fetching offers or taxes:", error);
      setAlertMessage("Failed to fetch offers or taxes. Please check your network or API endpoints.");
      setIsAlertModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffersAndTaxes();
  }, []);

  const handleCreateOffer = async (e) => {
    e.preventDefault();
    if (!offerName || !offerValue || !offerStartDate || !offerEndDate) {
      setAlertMessage("Please fill all required offer fields.");
      setIsAlertModalOpen(true);
      return;
    }

    const newOffer = {
      name: offerName,
      type: offerType,
      value: parseFloat(offerValue),
      applicableTo: offerApplicableTo,
      startDate: offerStartDate,
      endDate: offerEndDate,
    };

    setConfirmMessage("Are you sure you want to create this offer?");
    setConfirmAction(async () => {
      try {
        const response = await axios.post(`${SERVER_URL}/api/offers`, newOffer, { withCredentials: true });
        if (response.status === 201) {
          setOffers([...offers, response.data]);
          setAlertMessage("Offer created successfully!");
          setOfferName('');
          setOfferType('percentage');
          setOfferValue('');
          setOfferApplicableTo('all');
          setOfferStartDate('');
          setOfferEndDate('');
        }
      } catch (error) {
        console.error("Error creating offer:", error);
        setAlertMessage("Failed to create offer. Please try again.");
      } finally {
        setIsAlertModalOpen(true);
        setIsConfirmModalOpen(false);
      }
    });
    setIsConfirmModalOpen(true);
  };

  const handleDeleteOffer = (offerId) => {
    setConfirmMessage("Are you sure you want to delete this offer? This action cannot be undone.");
    setConfirmAction(async () => {
      try {
        const response = await axios.delete(`${SERVER_URL}/api/offers/${offerId}`, { withCredentials: true });
        if (response.status === 200) {
          setOffers(offers.filter(offer => offer._id !== offerId));
          setAlertMessage("Offer deleted successfully!");
        }
      } catch (error) {
        console.error("Error deleting offer:", error);
        setAlertMessage("Failed to delete offer. Please try again.");
      } finally {
        setIsAlertModalOpen(true);
        setIsConfirmModalOpen(false);
      }
    });
    setIsConfirmModalOpen(true);
  };

  const handleCreateTax = async (e) => {
    e.preventDefault();
    if (!taxName || !taxValue) {
      setAlertMessage("Please fill all required tax fields.");
      setIsAlertModalOpen(true);
      return;
    }

    const newTax = {
      name: taxName,
      type: taxType,
      value: parseFloat(taxValue),
      applicableTo: taxApplicableTo,
    };

    setConfirmMessage("Are you sure you want to create this tax?");
    setConfirmAction(async () => {
      try {
        const response = await axios.post(`${SERVER_URL}/api/taxes`, newTax, { withCredentials: true });
        if (response.status === 201) {
          setTaxes([...taxes, response.data]);
          setAlertMessage("Tax created successfully!");
          setTaxName('');
          setTaxType('percentage');
          setTaxValue('');
          setTaxApplicableTo('all');
        }
      } catch (error) {
        console.error("Error creating tax:", error);
        setAlertMessage("Failed to create tax. Please try again.");
      } finally {
        setIsAlertModalOpen(true);
        setIsConfirmModalOpen(false);
      }
    });
    setIsConfirmModalOpen(true);
  };

  const handleDeleteTax = (taxId) => {
    setConfirmMessage("Are you sure you want to delete this tax? This action cannot be undone.");
    setConfirmAction(async () => {
      try {
        const response = await axios.delete(`${SERVER_URL}/api/taxes/${taxId}`, { withCredentials: true });
        if (response.status === 200) {
          setTaxes(taxes.filter(tax => tax._id !== taxId));
          setAlertMessage("Tax deleted successfully!");
        }
      } catch (error) {
        console.error("Error deleting tax:", error);
        setAlertMessage("Failed to delete tax. Please try again.");
      } finally {
        setIsAlertModalOpen(true);
        setIsConfirmModalOpen(false);
      }
    });
    setIsConfirmModalOpen(true);
  };

  const renderOffers = () => (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <FaTag className="mr-3 text-teal-600" /> Existing Offers
      </h2>
      {loading ? (
        <div className="flex justify-center items-center h-32 text-gray-600">
          <FaSpinner className="animate-spin mr-2" size={24} /> Loading offers...
        </div>
      ) : offers.length === 0 ? (
        <div className="text-center text-gray-500 p-4 border border-gray-200 rounded-md bg-gray-50">
          No offers created yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers?.map(offer => (
            <div key={offer._id} className="bg-white p-5 rounded-lg shadow-md border border-gray-200 flex flex-col">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{offer.name}</h3>
              <p className="text-gray-700 text-sm mb-1">
                <span className="font-semibold">Type:</span> {offer.type === 'percentage' ? 'Percentage Discount' : 'Fixed Amount Discount'}
              </p>
              <p className="text-gray-700 text-sm mb-1">
                <span className="font-semibold">Value:</span> {offer.type === 'percentage' ? `${offer.value}%` : `₹${offer.value.toFixed(2)}`}
              </p>
              <p className="text-gray-700 text-sm mb-1">
                <span className="font-semibold">Applies To:</span> {offer.applicable.charAt(0).toUpperCase() + offer.applicable.slice(1)}
              </p>
              <p className="text-gray-700 text-sm mb-1">
                <span className="font-semibold">Start Date:</span> {formatDate(offer.startDate)}
              </p>
              <p className="text-gray-700 text-sm mb-4">
                <span className="font-semibold">End Date:</span> {formatDate(offer.endDate)}
              </p>
              <div className="mt-auto flex justify-end space-x-2">
                {/* <button className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 transition-colors flex items-center">
                  <FaEdit className="mr-1" /> Edit
                </button> */}
                <button
                  onClick={() => handleDeleteOffer(offer._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition-colors flex items-center"
                >
                  <FaTrashAlt className="mr-1" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderTaxes = () => (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <FaPercentage className="mr-3 text-purple-600" /> Existing Taxes
      </h2>
      {loading ? (
        <div className="flex justify-center items-center h-32 text-gray-600">
          <FaSpinner className="animate-spin mr-2" size={24} /> Loading taxes...
        </div>
      ) : taxes.length === 0 ? (
        <div className="text-center text-gray-500 p-4 border border-gray-200 rounded-md bg-gray-50">
          No taxes configured yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {taxes.map(tax => (
            <div key={tax._id} className="bg-white p-5 rounded-lg shadow-md border border-gray-200 flex flex-col">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{tax.name}</h3>
              <p className="text-gray-700 text-sm mb-1">
                <span className="font-semibold">Type:</span> {tax.type === 'percentage' ? 'Percentage' : 'Fixed Amount'}
              </p>
              <p className="text-gray-700 text-sm mb-1">
                <span className="font-semibold">Value:</span> {tax.type === 'percentage' ? `${tax.value}%` : `₹${tax.value.toFixed(2)}`}
              </p>
              <p className="text-gray-700 text-sm mb-4">
                <span className="font-semibold">Applies To:</span> {tax.applicable.charAt(0).toUpperCase() + tax.applicable.slice(1)}
              </p>
              <div className="mt-auto flex justify-end space-x-2">
                {/* <button className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 transition-colors flex items-center">
                  <FaEdit className="mr-1" /> Edit
                </button> */}
                <button
                  onClick={() => handleDeleteTax(tax._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition-colors flex items-center"
                >
                  <FaTrashAlt className="mr-1" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans text-gray-800">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-gray-200 flex items-center">
        <FaClipboardList className="inline-block mr-3 text-blue-600" /> Offer & Tax Management
      </h1>

      <div className="bg-white rounded-lg shadow-xl p-6 mb-8">
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`flex-1 py-3 text-lg font-semibold transition-all duration-300 ${activeTab === 'offers' ? 'border-b-4 border-teal-600 text-teal-600' : 'text-gray-600 hover:text-teal-500'}`}
            onClick={() => setActiveTab('offers')}
          >
            <FaTag className="inline-block mr-2" /> Offers
          </button>
          <button
            className={`flex-1 py-3 text-lg font-semibold transition-all duration-300 ${activeTab === 'taxes' ? 'border-b-4 border-purple-600 text-purple-600' : 'text-gray-600 hover:text-purple-500'}`}
            onClick={() => setActiveTab('taxes')}
          >
            <FaPercentage className="inline-block mr-2" /> Taxes
          </button>
        </div>

        {activeTab === 'offers' && (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <FaPlus className="mr-3 text-blue-600" /> Create New Offer
            </h2>
            <form onSubmit={handleCreateOffer} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <label htmlFor="offerName" className="block text-sm font-medium text-gray-700 mb-1">Offer Name</label>
                <input
                  type="text"
                  id="offerName"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={offerName}
                  onChange={(e) => setOfferName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="offerType" className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
                <select
                  id="offerType"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={offerType}
                  onChange={(e) => setOfferType(e.target.value)}
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₹)</option>
                </select>
              </div>
              <div>
                <label htmlFor="offerValue" className="block text-sm font-medium text-gray-700 mb-1">Discount Value</label>
                <input
                  type="number"
                  id="offerValue"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={offerValue}
                  onChange={(e) => setOfferValue(e.target.value)}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label htmlFor="offerApplicableTo" className="block text-sm font-medium text-gray-700 mb-1">Applicable To</label>
                <select
                  id="offerApplicableTo"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={offerApplicableTo}
                  onChange={(e) => setOfferApplicableTo(e.target.value)}
                >
                  <option value="all">All Orders</option>
                  <option value="restaurant">Restaurant Orders</option>
                  <option value="fashion">Fashion Orders</option>
                </select>
              </div>
              <div>
                <label htmlFor="offerStartDate" className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  id="offerStartDate"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={offerStartDate}
                  onChange={(e) => setOfferStartDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="offerEndDate" className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  id="offerEndDate"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={offerEndDate}
                  onChange={(e) => setOfferEndDate(e.target.value)}
                  required
                />
              </div>
              <div className="md:col-span-2 text-right">
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center justify-center ml-auto"
                >
                  <FaPlus className="mr-2" /> Create Offer
                </button>
              </div>
            </form>
            {renderOffers()}
          </>
        )}

        {activeTab === 'taxes' && (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <FaPlus className="mr-3 text-blue-600" /> Add New Tax
            </h2>
            <form onSubmit={handleCreateTax} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <label htmlFor="taxName" className="block text-sm font-medium text-gray-700 mb-1">Tax Name</label>
                <input
                  type="text"
                  id="taxName"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={taxName}
                  onChange={(e) => setTaxName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="taxType" className="block text-sm font-medium text-gray-700 mb-1">Tax Type</label>
                <select
                  id="taxType"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={taxType}
                  onChange={(e) => setTaxType(e.target.value)}
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₹)</option>
                </select>
              </div>
              <div>
                <label htmlFor="taxValue" className="block text-sm font-medium text-gray-700 mb-1">Tax Value</label>
                <input
                  type="number"
                  id="taxValue"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={taxValue}
                  onChange={(e) => setTaxValue(e.target.value)}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label htmlFor="taxApplicableTo" className="block text-sm font-medium text-gray-700 mb-1">Applicable To</label>
                <select
                  id="taxApplicableTo"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={taxApplicableTo}
                  onChange={(e) => setTaxApplicableTo(e.target.value)}
                >
                  <option value="all">All Orders</option>
                  <option value="restaurant">Restaurant Orders</option>
                  <option value="fashion">Fashion Orders</option>
                  <option value="hospital">Hospital Bookings</option>
                </select>
              </div>
              <div className="md:col-span-2 text-right">
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center justify-center ml-auto"
                >
                  <FaPlus className="mr-2" /> Add Tax
                </button>
              </div>
            </form>
            {renderTaxes()}
          </>
        )}
      </div>

      <CustomModal isOpen={isAlertModalOpen} onClose={() => setIsAlertModalOpen(false)}>
        <div className="p-6 bg-white rounded-lg shadow-xl text-center">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">Information</h2>
          <p className="text-gray-700 mb-6">{alertMessage}</p>
          <button
            onClick={() => setIsAlertModalOpen(false)}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            OK
          </button>
        </div>
      </CustomModal>

      <CustomModal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)}>
        <div className="p-6 bg-white rounded-lg shadow-xl text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Confirm Action</h2>
          <p className="text-gray-700 mb-6">{confirmMessage}</p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setIsConfirmModalOpen(false)}
              className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmAction}
              className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Confirm
            </button>
          </div>
        </div>
      </CustomModal>
    </div>
  );
};
