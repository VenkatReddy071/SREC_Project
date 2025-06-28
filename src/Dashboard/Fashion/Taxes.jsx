import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Percent, DollarSign, PlusCircle, Edit, Trash2, XCircle,CheckCircle } from 'lucide-react';

const SkeletonLoader = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded-md ${className}`}></div>
);

const TaxesAndCharges = () => {
  const [taxes, setTaxes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTax, setCurrentTax] = useState(null);

  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState('percentage');
  const [formValue, setFormValue] = useState('');
  const [formIsApplicable, setFormIsApplicable] = useState(true);

  const API_BASE_URL = `${import.meta.env.VITE_SERVER_URL}/api`; 

  const fetchTaxes = async () => {
    setIsLoading(true);
    setError(null);
    const token = localStorage.getItem('dashboard');

    if (!token) {
      setError('Authentication token not found. Please log in.');
      setIsLoading(false);
      return;
    }

    try {
    

      const taxesRes = await axios.get(`${API_BASE_URL}/mall/my-restaurant/taxes`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setTaxes(taxesRes.data);
    } catch (err) {
      console.error('Error fetching taxes and charges:', err);
      setError('Failed to load taxes and charges. Please ensure your restaurant is set up and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddClick = () => {
    setCurrentTax(null);
    setFormName('');
    setFormType('percentage');
    setFormValue('');
    setFormIsApplicable(true);
    setIsModalOpen(true);
  };

  const handleEditClick = (tax) => {
    setCurrentTax(tax);
    setFormName(tax.name);
    setFormType(tax.type);
    setFormValue(tax.value.toString());
    setFormIsApplicable(tax.isApplicable);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const token = localStorage.getItem('dashboard');
    if (!token) {
      setError('Authentication token not found.');
      return;
    }

    const taxData = {
      name: formName,
      type: formType,
      value: parseFloat(formValue),
      isApplicable: formIsApplicable,
    };

    try {
      if (currentTax) {
        await axios.put(`${API_BASE_URL}/mall/my-restaurant/taxes/${currentTax._id}`, taxData, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
      } else {
        await axios.post(`${API_BASE_URL}/mall/my-restaurant/taxes`, taxData, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
      }
      setIsModalOpen(false);
      fetchTaxes();
    } catch (err) {
      console.error('Error saving tax/charge:', err.response?.data || err.message);
      setError(`Failed to save tax/charge: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleDelete = async (taxId) => {
    if (!window.confirm('Are you sure you want to delete this tax/charge?')) {
      return;
    }
    setError(null);
    const token = localStorage.getItem('dashboard');
    if (!token) {
      setError('Authentication token not found.');
      return;
    }

    try {
    

      await axios.delete(`${API_BASE_URL}/mall/taxes/${taxId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      fetchTaxes();
    } catch (err) {
      console.error('Error deleting tax/charge:', err.response?.data || err.message);
      setError(`Failed to delete tax/charge: ${err.response?.data?.message || err.message}`);
    }
  };

  useEffect(() => {
    fetchTaxes();
  }, []);

  return (
    <div className="flex flex-col h-full bg-white shadow-lg rounded-lg p-6 font-sans">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <Percent className="w-7 h-7 mr-3 text-emerald-600" />
          Taxes & Charges
        </h2>
        <button
          onClick={handleAddClick}
          className="flex items-center px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors duration-200 shadow-md"
        >
          <PlusCircle className="w-5 h-5 mr-2" /> Add New
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-4">
          <SkeletonLoader className="h-12 w-full" />
          <SkeletonLoader className="h-12 w-full" />
          <SkeletonLoader className="h-12 w-full" />
        </div>
      ) : taxes.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          <DollarSign className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg">No taxes or charges configured yet.</p>
          <p className="text-sm">Click "Add New" to get started.</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto pr-2 -mr-2">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicable</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {taxes.map((tax) => (
                <tr key={tax._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tax.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tax.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tax.type === 'percentage' ? `${tax.value}%` : `$${tax.value.toFixed(2)}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tax.isApplicable ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEditClick(tax)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                      title="Edit"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(tax._id)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              {currentTax ? 'Edit Tax/Charge' : 'Add New Tax/Charge'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  id="name"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-emerald-500 focus:border-emerald-500"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
                <select
                  id="type"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-emerald-500 focus:border-emerald-500"
                  value={formType}
                  onChange={(e) => setFormType(e.target.value)}
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount ($)</option>
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="value" className="block text-sm font-medium text-gray-700">Value</label>
                <input
                  type="number"
                  id="value"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-emerald-500 focus:border-emerald-500"
                  value={formValue}
                  onChange={(e) => setFormValue(e.target.value)}
                  step="0.01"
                  required
                />
              </div>
              <div className="mb-6 flex items-center">
                <input
                  type="checkbox"
                  id="isApplicable"
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                  checked={formIsApplicable}
                  onChange={(e) => setFormIsApplicable(e.target.checked)}
                />
                <label htmlFor="isApplicable" className="ml-2 block text-sm text-gray-900">Is Applicable</label>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  {currentTax ? 'Update' : 'Add'} Tax
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaxesAndCharges;
