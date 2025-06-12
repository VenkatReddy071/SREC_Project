// src/components/OfferFormModal.jsx
import React, { useState, useEffect } from 'react';

const OfferFormModal = ({ isOpen, onClose, onSubmit, initialData, doctors, departments, services }) => {
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    description: '',
    category: '',
    originalPrice: '',
    discountedPrice: '',
    percentageDiscount: '',
    validityStartDate: '',
    validityEndDate: '',
    termsAndConditions: '',
    targetAudience: [],
    applicableDoctors: [],
    applicableDepartments: [],
    applicableServices: [],
    imageUrl: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        shortDescription: initialData.shortDescription || '',
        description: initialData.description || '',
        category: initialData.category || '',
        originalPrice: initialData.originalPrice || '',
        discountedPrice: initialData.discountedPrice || '',
        percentageDiscount: initialData.percentageDiscount || '',
        validityStartDate: initialData.validityStartDate ? new Date(initialData.validityStartDate).toISOString().split('T')[0] : '',
        validityEndDate: initialData.validityEndDate ? new Date(initialData.validityEndDate).toISOString().split('T')[0] : '',
        termsAndConditions: initialData.termsAndConditions || '',
        targetAudience: initialData.targetAudience || [],
        applicableDoctors: initialData.applicableDoctors || [],
        applicableDepartments: initialData.applicableDepartments || [],
        applicableServices: initialData.applicableServices || [],
        imageUrl: initialData.imageUrl || '',
      });
    } else {
      // Reset form for new offer
      setFormData({
        title: '',
        shortDescription: '',
        description: '',
        category: '',
        originalPrice: '',
        discountedPrice: '',
        percentageDiscount: '',
        validityStartDate: '',
        validityEndDate: '',
        termsAndConditions: '',
        targetAudience: [],
        applicableDoctors: [],
        applicableDepartments: [],
        applicableServices: [],
        imageUrl: '',
      });
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMultiSelectChange = (e, fieldName) => {
    const { options } = e.target;
    const selectedValues = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedValues.push(options[i].value);
      }
    }
    setFormData(prev => ({ ...prev, [fieldName]: selectedValues }));
  };

  const handleSubmit = (saveAsDraft = false) => {
    // Basic validation
    if (!formData.title || !formData.category || !formData.validityStartDate || !formData.validityEndDate) {
      alert('Please fill in required fields: Title, Category, Start Date, End Date.');
      return;
    }

    // Convert price/discount to numbers if they exist
    const submitData = {
      ...formData,
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
      discountedPrice: formData.discountedPrice ? parseFloat(formData.discountedPrice) : null,
      percentageDiscount: formData.percentageDiscount ? parseFloat(formData.percentageDiscount) : null,
      // Ensure Date objects for validity period
      validityStartDate: new Date(formData.validityStartDate),
      validityEndDate: new Date(formData.validityEndDate + 'T23:59:59Z'), // End of day for end date
    };

    onSubmit(submitData, saveAsDraft);
  };

  const targetAudiences = [
    "New Patients", "Existing Patients", "Senior Citizens", "Children",
    "Diabetic Patients", "Cardiac Patients", "General Public"
  ];

  const offerCategories = [
    "Health Checkup", "Consultation Discount", "Surgical Package",
    "Wellness Program", "Dental Package", "Vaccination Drive", "Other"
  ];

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{initialData ? 'Edit Offer' : 'Create New Offer'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl font-bold">
            &times;
          </button>
        </div>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Basic Info */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Offer Title <span className="text-red-500">*</span></label>
            <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required
                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category/Type <span className="text-red-500">*</span></label>
            <select id="category" name="category" value={formData.category} onChange={handleChange} required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
              <option value="">Select Category</option>
              {offerCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700">Short Description (for table preview)</label>
            <input type="text" id="shortDescription" name="shortDescription" value={formData.shortDescription} onChange={handleChange}
                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Detailed Description</label>
            <textarea id="description" name="description" rows="3" value={formData.description} onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"></textarea>
          </div>

          {/* Pricing */}
          <div>
            <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700">Original Price (Optional)</label>
            <input type="number" id="originalPrice" name="originalPrice" value={formData.originalPrice} onChange={handleChange}
                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="discountedPrice" className="block text-sm font-medium text-gray-700">Discounted Price</label>
            <input type="number" id="discountedPrice" name="discountedPrice" value={formData.discountedPrice} onChange={handleChange}
                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="percentageDiscount" className="block text-sm font-medium text-gray-700">Percentage Discount (%)</label>
            <input type="number" id="percentageDiscount" name="percentageDiscount" value={formData.percentageDiscount} onChange={handleChange}
                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
          </div>
          {/* Validity Period */}
          <div>
            <label htmlFor="validityStartDate" className="block text-sm font-medium text-gray-700">Validity Start Date <span className="text-red-500">*</span></label>
            <input type="date" id="validityStartDate" name="validityStartDate" value={formData.validityStartDate} onChange={handleChange} required
                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="validityEndDate" className="block text-sm font-medium text-gray-700">Validity End Date <span className="text-red-500">*</span></label>
            <input type="date" id="validityEndDate" name="validityEndDate" value={formData.validityEndDate} onChange={handleChange} required
                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
          </div>

          {/* Terms & Conditions */}
          <div className="md:col-span-2">
            <label htmlFor="termsAndConditions" className="block text-sm font-medium text-gray-700">Terms & Conditions</label>
            <textarea id="termsAndConditions" name="termsAndConditions" rows="3" value={formData.termsAndConditions} onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"></textarea>
          </div>

          {/* Target Audience */}
          <div className="md:col-span-2">
            <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-700">Target Audience (Select multiple)</label>
            <select multiple id="targetAudience" name="targetAudience" value={formData.targetAudience} onChange={(e) => handleMultiSelectChange(e, 'targetAudience')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-24">
              {targetAudiences.map(audience => (
                <option key={audience} value={audience}>{audience}</option>
              ))}
            </select>
          </div>

          {/* Applicable Doctors/Departments/Services */}
          <div>
            <label htmlFor="applicableDoctors" className="block text-sm font-medium text-gray-700">Applicable Doctors (Select multiple)</label>
            <select multiple id="applicableDoctors" name="applicableDoctors" value={formData.applicableDoctors} onChange={(e) => handleMultiSelectChange(e, 'applicableDoctors')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-24">
              {doctors.map(doc => (
                <option key={doc._id} value={doc._id}>{doc.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="applicableDepartments" className="block text-sm font-medium text-gray-700">Applicable Departments (Select multiple)</label>
            <select multiple id="applicableDepartments" name="applicableDepartments" value={formData.applicableDepartments} onChange={(e) => handleMultiSelectChange(e, 'applicableDepartments')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-24">
              {departments.map(dept => (
                <option key={dept._id} value={dept._id}>{dept.name}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label htmlFor="applicableServices" className="block text-sm font-medium text-gray-700">Applicable Services (Select multiple)</label>
            <select multiple id="applicableServices" name="applicableServices" value={formData.applicableServices} onChange={(e) => handleMultiSelectChange(e, 'applicableServices')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-24">
              {services.map(service => (
                <option key={service._id} value={service._id}>{service.name}</option>
              ))}
            </select>
          </div>

          {/* Image Upload */}
          <div className="md:col-span-2">
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Image URL (for promotional banner)</label>
            <input type="text" id="imageUrl" name="imageUrl" value={formData.imageUrl} onChange={handleChange}
                   placeholder="e.g., https://example.com/banner.jpg"
                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
            {formData.imageUrl && (
                <div className="mt-2">
                    <img src={formData.imageUrl} alt="Offer Banner Preview" className="max-w-xs h-auto rounded-md" />
                </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="md:col-span-2 flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleSubmit(true)} // Save as Draft
              className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              Save as Draft
            </button>
            <button
              type="button"
              onClick={() => handleSubmit(false)} // Publish (Active)
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {initialData ? 'Update Offer' : 'Publish Offer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OfferFormModal;