import React, { useState } from 'react';
import axios from 'axios';
import TermsAndConditionsPopup from '../TermsAndComditionsPopup'; // Re-use the popup component

function Restaurant() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    description: '',
    rating: 0,
    reviews: 0,
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
    },
    phone: '',
    imageUrls: {
      mainImage: '',
      galleryImages: [],
      menuImages: [],
    },
    cuisine: [],
    averagePriceINR: 0,
    longitude: '',
    latitude: '',
    isTopPick: false,
    offersDelivery: false,
    isTakeaway: false,
    servesTiffins: false,
    isTiffinOnly: false,
    isVegetarian: false,
    services: [],
    seatingAvailability: [],
    closed: false,
    // operatingHours: [], // Removed for brevity in this example
    // offer: [], // Removed for brevity
    // taxesAndCharges: [], // Removed for brevity
    documents: {
      hospitalLicense: '',
      verificationDocumentType: '',
      verificationDocument: '',
    },
    acceptTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const serviceOptions = ['Dine-in', 'WiFi', 'Parking', 'Outdoor Seating', 'Live Music', 'Private Dining', 'Takeaway', 'Delivery'];
  const documentTypes = ['Aadhar', 'PAN', 'Passport', 'Driving License'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked,
      }));
    } else if (name === 'cuisine' || name === 'imageUrls.galleryImages' || name === 'imageUrls.menuImages') {
      const cleanedValue = value.split(',').map(item => item.trim()).filter(item => item !== '');
      if (name === 'cuisine') {
        setFormData(prev => ({ ...prev, cuisine: cleanedValue }));
      } else if (name === 'imageUrls.galleryImages') {
        setFormData(prev => ({ ...prev, imageUrls: { ...prev.imageUrls, galleryImages: cleanedValue } }));
      } else if (name === 'imageUrls.menuImages') {
        setFormData(prev => ({ ...prev, imageUrls: { ...prev.imageUrls, menuImages: cleanedValue } }));
      }
    } else if (name === 'services') {
      const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
      setFormData(prev => ({ ...prev, services: selectedOptions }));
    } else if (name === 'seatingCapacity') {
      const capacity = parseInt(value, 10);
      setFormData(prev => ({
        ...prev,
        seatingAvailability: isNaN(capacity) || capacity <= 0 ? [] : [{ type: 'table', capacity: capacity }],
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Restaurant name is required.';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please use a valid email address.';
    }
    if (!formData.address.street.trim()) newErrors['address.street'] = 'Street is required.';
    if (!formData.address.city.trim()) newErrors['address.city'] = 'City is required.';
    if (!formData.address.state.trim()) newErrors['address.state'] = 'State is required.';
    if (isNaN(parseFloat(formData.longitude)) || formData.longitude === '') newErrors.longitude = 'Longitude is required and must be a number.';
    if (isNaN(parseFloat(formData.latitude)) || formData.latitude === '') newErrors.latitude = 'Latitude is required and must be a number.';
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the Terms and Conditions.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      try {
        const dataToSubmit = { ...formData };

        dataToSubmit.longitude = parseFloat(dataToSubmit.longitude);
        dataToSubmit.latitude = parseFloat(dataToSubmit.latitude);
        dataToSubmit.averagePriceINR = parseFloat(dataToSubmit.averagePriceINR);
        if (isNaN(dataToSubmit.averagePriceINR)) dataToSubmit.averagePriceINR = 0;

        dataToSubmit.imageUrls.galleryImages = dataToSubmit.imageUrls.galleryImages || [];
        dataToSubmit.imageUrls.menuImages = dataToSubmit.imageUrls.menuImages || [];

        delete dataToSubmit.acceptTerms;

        console.log('Submitting data:', dataToSubmit);

        const response = await axios.post('http://localhost:3000/api/register-restaurant', dataToSubmit);

        console.log('Registration successful:', response.data);
        alert('Restaurant registered successfully! Status: ' + response.data.status);
        setFormData({
            name: '', email: '', description: '', rating: 0, reviews: 0,
            address: { street: '', city: '', state: '', zipCode: '' },
            phone: '', imageUrls: { mainImage: '', galleryImages: [], menuImages: [] },
            cuisine: [], averagePriceINR: 0, longitude: '', latitude: '',
            isTopPick: false, offersDelivery: false, isTakeaway: false, servesTiffins: false,
            isTiffinOnly: false, isVegetarian: false, services: [], seatingAvailability: [], closed: false,
            documents: { hospitalLicense: '', verificationDocumentType: '', verificationDocument: '' },
            acceptTerms: false,
        });
        setErrors({});
      } catch (error) {
        console.error('Registration failed:', error.response ? error.response.data : error.message);
        alert('Registration failed: ' + (error.response?.data?.message || 'Please try again.'));
        if (error.response?.data?.errors) {
            setErrors(error.response.data.errors);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Restaurant Registration</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-bold text-gray-700">Restaurant Name <span className="text-red-500">*</span></label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.name ? 'border-red-500' : ''}`} required />
                {errors.name && <p className="text-red-500 text-xs italic mt-1">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-gray-700">Email <span className="text-red-500">*</span></label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.email ? 'border-red-500' : ''}`} required />
                {errors.email && <p className="text-red-500 text-xs italic mt-1">{errors.email}</p>}
              </div>
            </div>
            <div className="mt-4">
              <label htmlFor="phone" className="block text-sm font-bold text-gray-700">Phone</label>
              <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
            </div>
            <div className="mt-4">
              <label htmlFor="description" className="block text-sm font-bold text-gray-700">Description</label>
              <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows="3" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"></textarea>
            </div>

            <h3 className="text-xl font-semibold mt-6 mb-4 text-gray-700">Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="street" className="block text-sm font-bold text-gray-700">Street <span className="text-red-500">*</span></label>
                <input type="text" id="street" name="address.street" value={formData.address.street} onChange={handleChange} className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors['address.street'] ? 'border-red-500' : ''}`} required />
                {errors['address.street'] && <p className="text-red-500 text-xs italic mt-1">{errors['address.street']}</p>}
              </div>
              <div>
                <label htmlFor="city" className="block text-sm font-bold text-gray-700">City <span className="text-red-500">*</span></label>
                <input type="text" id="city" name="address.city" value={formData.address.city} onChange={handleChange} className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors['address.city'] ? 'border-red-500' : ''}`} required />
                {errors['address.city'] && <p className="text-red-500 text-xs italic mt-1">{errors['address.city']}</p>}
              </div>
              <div>
                <label htmlFor="state" className="block text-sm font-bold text-gray-700">State <span className="text-red-500">*</span></label>
                <input type="text" id="state" name="address.state" value={formData.address.state} onChange={handleChange} className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors['address.state'] ? 'border-red-500' : ''}`} required />
                {errors['address.state'] && <p className="text-red-500 text-xs italic mt-1">{errors['address.state']}</p>}
              </div>
              <div>
                <label htmlFor="zipCode" className="block text-sm font-bold text-gray-700">Zip Code</label>
                <input type="text" id="zipCode" name="address.zipCode" value={formData.address.zipCode} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label htmlFor="longitude" className="block text-sm font-bold text-gray-700">Longitude <span className="text-red-500">*</span></label>
                <input type="number" step="any" id="longitude" name="longitude" value={formData.longitude} onChange={handleChange} className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.longitude ? 'border-red-500' : ''}`} required />
                {errors.longitude && <p className="text-red-500 text-xs italic mt-1">{errors.longitude}</p>}
              </div>
              <div>
                <label htmlFor="latitude" className="block text-sm font-bold text-gray-700">Latitude <span className="text-red-500">*</span></label>
                <input type="number" step="any" id="latitude" name="latitude" value={formData.latitude} onChange={handleChange} className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.latitude ? 'border-red-500' : ''}`} required />
                {errors.latitude && <p className="text-red-500 text-xs italic mt-1">{errors.latitude}</p>}
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="cuisine" className="block text-sm font-bold text-gray-700">Cuisine (comma-separated)</label>
              <input type="text" id="cuisine" name="cuisine" value={formData.cuisine.join(', ')} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" placeholder="e.g., Indian, Chinese, Italian" />
            </div>

            <div className="mt-4">
              <label htmlFor="averagePriceINR" className="block text-sm font-bold text-gray-700">Average Price (INR)</label>
              <input type="number" id="averagePriceINR" name="averagePriceINR" value={formData.averagePriceINR} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" min="0" />
            </div>

            <h3 className="text-xl font-semibold mt-6 mb-4 text-gray-700">Image URLs</h3>
            <div className="mt-4">
              <label htmlFor="mainImage" className="block text-sm font-bold text-gray-700">Main Image URL</label>
              <input type="url" id="mainImage" name="imageUrls.mainImage" value={formData.imageUrls.mainImage} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" placeholder="https://example.com/main.jpg" />
            </div>
            <div className="mt-4">
              <label htmlFor="galleryImages" className="block text-sm font-bold text-gray-700">Gallery Images (comma-separated URLs)</label>
              <input type="text" id="galleryImages" name="imageUrls.galleryImages" value={formData.imageUrls.galleryImages.join(', ')} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg" />
            </div>
            <div className="mt-4">
              <label htmlFor="menuImages" className="block text-sm font-bold text-gray-700">Menu Images (comma-separated URLs)</label>
              <input type="text" id="menuImages" name="imageUrls.menuImages" value={formData.imageUrls.menuImages.join(', ')} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" placeholder="https://example.com/menu1.jpg, https://example.com/menu2.jpg" />
            </div>
          </div>

          {/* Restaurant Features (Booleans) */}
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Restaurant Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center">
                <input type="checkbox" id="offersDelivery" name="offersDelivery" checked={formData.offersDelivery} onChange={handleChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                <label htmlFor="offersDelivery" className="ml-2 block text-sm text-gray-900">Offers Delivery</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="isTakeaway" name="isTakeaway" checked={formData.isTakeaway} onChange={handleChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                <label htmlFor="isTakeaway" className="ml-2 block text-sm text-gray-900">Is Takeaway</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="servesTiffins" name="servesTiffins" checked={formData.servesTiffins} onChange={handleChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                <label htmlFor="servesTiffins" className="ml-2 block text-sm text-gray-900">Serves Tiffins</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="isTiffinOnly" name="isTiffinOnly" checked={formData.isTiffinOnly} onChange={handleChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                <label htmlFor="isTiffinOnly" className="ml-2 block text-sm text-gray-900">Is Tiffin Only</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="isVegetarian" name="isVegetarian" checked={formData.isVegetarian} onChange={handleChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                <label htmlFor="isVegetarian" className="ml-2 block text-sm text-gray-900">Is Vegetarian</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="isTopPick" name="isTopPick" checked={formData.isTopPick} onChange={handleChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                <label htmlFor="isTopPick" className="ml-2 block text-sm text-gray-900">Is Top Pick</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="closed" name="closed" checked={formData.closed} onChange={handleChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                <label htmlFor="closed" className="ml-2 block text-sm text-gray-900">Currently Closed</label>
              </div>
            </div>
          </div>

          {/* Services Offered (Multi-select) */}
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Services Offered</h2>
            <label htmlFor="services" className="block text-sm font-bold text-gray-700 mb-2">Select all that apply</label>
            <select
              multiple
              id="services"
              name="services"
              value={formData.services}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-48"
            >
              {serviceOptions.map(service => (
                <option key={service} value={service}>{service}</option>
              ))}
            </select>
          </div>

          {/* Seating Availability (Simplified) */}
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Seating Availability</h2>
            <p className="text-gray-600 text-sm mb-4">
                Please enter the total table seating capacity.
            </p>
            <div>
              <label htmlFor="seatingCapacity" className="block text-sm font-bold text-gray-700">Total Table Seating Capacity</label>
              <input
                type="number"
                id="seatingCapacity"
                name="seatingCapacity"
                value={formData.seatingAvailability.find(s => s.type === 'table')?.capacity || ''}
                onChange={handleChange}
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="e.g., 50"
              />
            </div>
          </div>

          {/* Documents */}
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Documents</h2>
            <p className="text-gray-600 text-sm mb-4">
              Please provide URLs for your license and verification documents.
            </p>
            <div>
              <label htmlFor="hospitalLicense" className="block text-sm font-bold text-gray-700">Hospital/Restaurant License (URL)</label>
              <input type="url" id="hospitalLicense" name="documents.hospitalLicense" value={formData.documents.hospitalLicense} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" placeholder="https://example.com/license.pdf" />
              {errors['documents.hospitalLicense'] && <p className="text-red-500 text-xs italic mt-1">{errors['documents.hospitalLicense']}</p>}
            </div>
            <div className="mt-4">
              <label htmlFor="verificationDocumentType" className="block text-sm font-bold text-gray-700">Verification Document Type</label>
              <select id="verificationDocumentType" name="documents.verificationDocumentType" value={formData.documents.verificationDocumentType} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                <option value="">Select Document Type</option>
                {documentTypes.map(type => (
                  <option key={type} value={type}>{type} Card</option>
                ))}
              </select>
              {errors['documents.verificationDocumentType'] && <p className="text-red-500 text-xs italic mt-1">{errors['documents.verificationDocumentType']}</p>}
            </div>
            <div className="mt-4">
              <label htmlFor="verificationDocument" className="block text-sm font-bold text-gray-700">Verification Document (URL)</label>
              <input type="url" id="verificationDocument" name="documents.verificationDocument" value={formData.documents.verificationDocument} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" placeholder="https://example.com/id.jpg" />
              {errors['documents.verificationDocument'] && <p className="text-red-500 text-xs italic mt-1">{errors['documents.verificationDocument']}</p>}
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Terms and Conditions</h2>
            <div className="flex items-center">
              <input type="checkbox" id="acceptTerms" name="acceptTerms" checked={formData.acceptTerms} onChange={handleChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" required />
              <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-900">
                I accept the{' '}
                <button type="button" onClick={() => setIsPopupOpen(true)} className="text-blue-600 hover:text-blue-800 underline focus:outline-none">
                  Terms and Conditions
                </button>
              </label>
            </div>
            {errors.acceptTerms && <p className="text-red-500 text-xs italic mt-1">{errors.acceptTerms}</p>}
          </div>

          {/* Submit Button */}
          <div className="mt-8 text-center">
            <button
              type="submit"
              className="px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register Restaurant'}
            </button>
          </div>
        </form>
      </div>

      <TermsAndConditionsPopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
    </div>
  );
}

export default Restaurant;