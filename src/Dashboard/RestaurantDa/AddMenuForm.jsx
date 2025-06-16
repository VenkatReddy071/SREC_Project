import React, { useState, useEffect } from 'react';
import { FaSave, FaBan, FaUpload } from 'react-icons/fa';

const AddEditMenuForm = ({ onSubmit, initialData, isNew, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    priceINR: 0,
    category: '',
    productType: '',
    imageUrl: '',
    isVegetarian: false,
    isVegan: false,
    isAvailable: true,
    isTopSeller: false,
    rating: 3,
    isNewArrival: false,
    ...initialData
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    setFormData({
      name: '',
      description: '',
      priceINR: 0,
      category: '',
      productType: '',
      imageUrl: '',
      isVegetarian: false,
      isVegan: false,
      isAvailable: true,
      isTopSeller: false,
      rating: 3,
      isNewArrival: false,
      ...initialData
    });
    setFormErrors({});
  }, [initialData, isNew]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseFloat(value) : value)
    }));
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Menu item name is required.';
    if (formData.priceINR <= 0) errors.priceINR = 'Price must be greater than 0.';
    if (!formData.category.trim()) errors.category = 'Category is required.';
    if (!formData.productType.trim()) errors.productType = 'Product type is required.';
    if (formData.imageUrl && !/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(formData.imageUrl)) {
      errors.imageUrl = 'Please use a valid URL for the product image.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData, isNew);
    }
  };

  const productTypes = ['menu_item', 'mandi_item', 'tiffin_item'];

  return (
    <div className="flex flex-col h-full overflow-y-auto pr-4">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        {isNew ? 'Add New Menu Item' : `Edit: ${formData.name}`}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`mt-1 block w-full border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500`}
            required
          />
          {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="priceINR" className="block text-sm font-medium text-gray-700">Price (INR) <span className="text-red-500">*</span></label>
            <input
              type="number"
              id="priceINR"
              name="priceINR"
              value={formData.priceINR}
              onChange={handleChange}
              min="0"
              step="0.01"
              className={`mt-1 block w-full border ${formErrors.priceINR ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500`}
              required
            />
            {formErrors.priceINR && <p className="text-red-500 text-xs mt-1">{formErrors.priceINR}</p>}
          </div>
          <div>
            <label htmlFor="rating" className="block text-sm font-medium text-gray-700">Rating (1-5)</label>
            <input
              type="number"
              id="rating"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              min="1"
              max="5"
              step="0.1"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`mt-1 block w-full border ${formErrors.category ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500`}
              required
            />
            {formErrors.category && <p className="text-red-500 text-xs mt-1">{formErrors.category}</p>}
          </div>
          <div>
            <label htmlFor="productType" className="block text-sm font-medium text-gray-700">Product Type <span className="text-red-500">*</span></label>
            <select
              id="productType"
              name="productType"
              value={formData.productType}
              onChange={handleChange}
              className={`mt-1 block w-full border ${formErrors.productType ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 bg-white`}
              required
            >
              <option value="">Select Type</option>
              {productTypes.map(type => (
                <option key={type} value={type}>{type.replace('_', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</option>
              ))}
            </select>
            {formErrors.productType && <p className="text-red-500 text-xs mt-1">{formErrors.productType}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Image URL</label>
          <input
            type="url"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            className={`mt-1 block w-full border ${formErrors.imageUrl ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500`}
          />
          {formErrors.imageUrl && <p className="text-red-500 text-xs mt-1">{formErrors.imageUrl}</p>}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm mt-4">
          <label className="flex items-center text-gray-700">
            <input
              type="checkbox"
              name="isVegetarian"
              checked={formData.isVegetarian}
              onChange={handleChange}
              className="form-checkbox h-5 w-5 text-green-600 transition duration-150 ease-in-out rounded-sm"
            />
            <span className="ml-2">Vegetarian</span>
          </label>
          <label className="flex items-center text-gray-700">
            <input
              type="checkbox"
              name="isVegan"
              checked={formData.isVegan}
              onChange={handleChange}
              className="form-checkbox h-5 w-5 text-teal-600 transition duration-150 ease-in-out rounded-sm"
            />
            <span className="ml-2">Vegan</span>
          </label>
          <label className="flex items-center text-gray-700">
            <input
              type="checkbox"
              name="isAvailable"
              checked={formData.isAvailable}
              onChange={handleChange}
              className="form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out rounded-sm"
            />
            <span className="ml-2">Available</span>
          </label>
          <label className="flex items-center text-gray-700">
            <input
              type="checkbox"
              name="isTopSeller"
              checked={formData.isTopSeller}
              onChange={handleChange}
              className="form-checkbox h-5 w-5 text-purple-600 transition duration-150 ease-in-out rounded-sm"
            />
            <span className="ml-2">Top Seller</span>
          </label>
          <label className="flex items-center text-gray-700">
            <input
              type="checkbox"
              name="isNewArrival"
              checked={formData.isNewArrival}
              onChange={handleChange}
              className="form-checkbox h-5 w-5 text-red-600 transition duration-150 ease-in-out rounded-sm"
            />
            <span className="ml-2">New Arrival</span>
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg flex items-center gap-2 hover:bg-gray-400 transition duration-300"
          >
            <FaBan /> Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2 hover:bg-green-700 transition duration-300"
          >
            <FaSave /> {isNew ? 'Add Item' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditMenuForm;