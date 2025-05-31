import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrashAlt, FaPlus, FaUpload, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'; // Importing icons
const HospitalAdminForm = ({
    selectedHospital,
    onSave,          
    onCancel,
    isEditing
}) => {
    const [formData, setFormData] = useState({
        name: '',
        info: '',
        location: '',
        nearByLocation: '',
        mobilenumber: '',
        ownerEmail: '',
        rating: 4, // Default rating as per schema
        specialization: '', // Comma-separated string for frontend input
        foundation: '', // Date string for input type="date"
        status: 'pending', // Default status for admin to choose
        image: null, // Holds the File object for the main image
        gallery: [], // Holds an array of File objects for gallery images
        acceptTerms: false, // Checkbox for terms and conditions
    });

    // State to manage form validation errors
    const [formErrors, setFormErrors] = useState({});
    // State to manage the submission status (e.g., 'submitting', 'success', 'error')
    const [submitStatus, setSubmitStatus] = useState(null);

    // useEffect to populate form data when editing an existing hospital
    // or to reset the form when switching to add mode.
    useEffect(() => {
        if (isEditing && selectedHospital) {
            // Populate form data from the selected hospital object
            setFormData({
                name: selectedHospital.name || '',
                info: selectedHospital.info || '',
                location: selectedHospital.location || '',
                nearByLocation: selectedHospital.nearByLocation || '',
                mobilenumber: selectedHospital.mobilenumber || '',
                ownerEmail: selectedHospital.ownerEmail || '',
                rating: selectedHospital.rating || 4,
                // Convert specialization array back to a comma-separated string for the input field
                specialization: Array.isArray(selectedHospital.specialization) ? selectedHospital.specialization.join(', ') : '',
                // Format foundation date to 'YYYY-MM-DD' for input type="date"
                foundation: selectedHospital.foundation ? new Date(selectedHospital.foundation).toISOString().split('T')[0] : '',
                status: selectedHospital.status || 'pending',
                image: null, // File inputs are not pre-filled for security/browser reasons
                gallery: [], // File inputs are not pre-filled
                acceptTerms: false, // Terms acceptance should be re-checked for each submission
            });
        } else {
            // Reset form for adding a new hospital
            setFormData({
                name: '', info: '', location: '', nearByLocation: '', mobilenumber: '', ownerEmail: '',
                rating: 4, specialization: '', foundation: '', status: 'pending',
                image: null, gallery: [], acceptTerms: false,
            });
        }
        setFormErrors({}); // Clear any previous errors
        setSubmitStatus(null); // Clear submission status
    }, [isEditing, selectedHospital]); // Dependencies: re-run if these props change

    // Handler for all input changes (text, number, email, date, select)
    const handleInputChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else if (type === 'file') {
            // For file inputs, store the File object(s)
            setFormData(prev => ({ ...prev, [name]: name === 'gallery' ? Array.from(files) : files[0] }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
        // Clear error for the field being changed
        setFormErrors(prev => ({ ...prev, [name]: undefined }));
    };

    // Client-side form validation logic
    const validateForm = () => {
        const errors = {};
        if (!formData.name) errors.name = 'Hospital Name is required.';
        if (!formData.info) errors.info = 'Description (info) is required.';
        if (!formData.location) errors.location = 'Location is required.';
        if (!formData.nearByLocation) errors.nearByLocation = 'Nearby Location is required.';
        if (!formData.mobilenumber) errors.mobilenumber = 'Mobile Number is required.';
        // Basic 10-digit phone number validation for India
        if (!/^\d{10}$/.test(formData.mobilenumber)) errors.mobilenumber = 'Mobile Number must be 10 digits.';
        if (!formData.ownerEmail) errors.ownerEmail = 'Owner Email is required.';
        // Basic email format validation
        if (!/\S+@\S+\.\S+/.test(formData.ownerEmail)) errors.ownerEmail = 'Invalid email format.';
        if (!formData.acceptTerms) errors.acceptTerms = 'You must accept the terms and conditions.';

        // Main image is required only when adding a new hospital
        if (!isEditing && !formData.image) errors.image = 'Main Hospital Image is required.';

        setFormErrors(errors); // Update the form errors state
        return Object.keys(errors).length === 0; // Return true if no errors
    };

    // Simulate an API call for demonstration purposes
    // In a real application, you would replace this with actual fetch or Axios calls
    // to your backend API endpoints (e.g., /api/hospitals).
    const simulateApiCall = (data, isEdit = false, hospitalId = null) => {
        return new Promise(resolve => {
            setTimeout(() => {
                console.log(isEdit ? `Simulating Update for hospital ${hospitalId}:` : 'Simulating Add new hospital:', data);
                // Simulate success and return a mock hospital object
                resolve({
                    success: true,
                    message: isEdit ? 'Hospital updated!' : 'Hospital added!',
                    data: {
                        id: hospitalId || Date.now(), // Assign a unique ID for new hospitals
                        name: data.get('name'),
                        info: data.get('info'),
                        location: data.get('location'),
                        nearByLocation: data.get('nearByLocation'),
                        mobilenumber: data.get('mobilenumber'),
                        ownerEmail: data.get('ownerEmail'),
                        rating: parseFloat(data.get('rating')),
                        specialization: data.get('specialization').split(',').map(s => s.trim()).filter(s => s),
                        foundation: data.get('foundation'),
                        status: data.get('status'),
                        // For images, we'll just use a placeholder URL in simulation
                        image: data.get('image') ? 'https://placehold.co/150x150/FF0000/FFFFFF?text=Uploaded' : (selectedHospital?.image || ''),
                        gallery: data.getAll('gallery').length > 0 ? data.getAll('gallery').map((_, i) => `https://placehold.co/100x100/0000FF/FFFFFF?text=Gallery${i+1}`) : (selectedHospital?.gallery || []),
                    }
                });
            }, 1000); // Simulate network delay
        });
    };

    // Handler for form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default browser form submission
        setSubmitStatus('submitting'); // Set status to indicate submission is in progress

        // Perform client-side validation
        if (!validateForm()) {
            setSubmitStatus('error'); // Set status to error if validation fails
            return;
        }

        // Create FormData object to handle file uploads
        // FormData is essential for sending files along with other form data to the backend
        const submitData = new FormData();
        submitData.append('name', formData.name);
        submitData.append('info', formData.info);
        submitData.append('location', formData.location);
        submitData.append('nearByLocation', formData.nearByLocation);
        submitData.append('mobilenumber', formData.mobilenumber);
        submitData.append('ownerEmail', formData.ownerEmail);
        submitData.append('rating', formData.rating);
        // Send specialization as a comma-separated string; backend will split it into an array
        submitData.append('specialization', formData.specialization);
        submitData.append('foundation', formData.foundation);
        submitData.append('status', formData.status);

        // Append file objects to FormData
        if (formData.image) {
            submitData.append('image', formData.image); // 'image' should match the field name Multer expects
        }
        formData.gallery.forEach((file, index) => {
            // Append each gallery file. 'gallery' should match the field name Multer expects for an array of files.
            submitData.append('gallery', file);
        });

        try {
            // Call the simulated API (replace with your actual API call)
            const result = await simulateApiCall(submitData, isEditing, selectedHospital ? selectedHospital.id : null);
            if (result.success) {
                setSubmitStatus('success'); // Set status to success
                onSave(result.data); // Call the onSave callback with the new/updated hospital data
            } else {
                setSubmitStatus('error'); // Set status to error if API call fails
            }
        } catch (err) {
            console.error('Submission error:', err);
            setSubmitStatus('error'); // Set status to error for network/unhandled errors
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md h-full overflow-y-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">
                {isEditing ? 'Edit Hospital Details' : 'Add New Hospital'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Section 1: Basic Hospital Details */}
                <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">General Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Hospital Name <span className="text-red-500">*</span></label>
                            <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 rounded-md" required />
                            {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                        </div>
                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location <span className="text-red-500">*</span></label>
                            <input type="text" id="location" name="location" value={formData.location} onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 rounded-md" required />
                            {formErrors.location && <p className="text-red-500 text-xs mt-1">{formErrors.location}</p>}
                        </div>
                        <div>
                            <label htmlFor="nearByLocation" className="block text-sm font-medium text-gray-700">Nearby Landmark <span className="text-red-500">*</span></label>
                            <input type="text" id="nearByLocation" name="nearByLocation" value={formData.nearByLocation} onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 rounded-md" required />
                            {formErrors.nearByLocation && <p className="text-red-500 text-xs mt-1">{formErrors.nearByLocation}</p>}
                        </div>
                        <div>
                            <label htmlFor="mobilenumber" className="block text-sm font-medium text-gray-700">Mobile Number <span className="text-red-500">*</span></label>
                            <input type="tel" id="mobilenumber" name="mobilenumber" value={formData.mobilenumber} onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 rounded-md" required />
                            {formErrors.mobilenumber && <p className="text-red-500 text-xs mt-1">{formErrors.mobilenumber}</p>}
                        </div>
                        <div>
                            <label htmlFor="ownerEmail" className="block text-sm font-medium text-gray-700">Owner/Contact Email <span className="text-red-500">*</span></label>
                            <input type="email" id="ownerEmail" name="ownerEmail" value={formData.ownerEmail} onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 rounded-md" required />
                            {formErrors.ownerEmail && <p className="text-red-500 text-xs mt-1">{formErrors.ownerEmail}</p>}
                        </div>
                        <div>
                            <label htmlFor="rating" className="block text-sm font-medium text-gray-700">Rating (0-5)</label>
                            <input type="number" id="rating" name="rating" value={formData.rating} onChange={handleInputChange}
                                min="0" max="5" step="0.1" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 rounded-md" />
                        </div>
                        <div>
                            <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">Specializations (comma-separated)</label>
                            <input type="text" id="specialization" name="specialization" value={formData.specialization} onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 rounded-md"
                                placeholder="e.g., Cardiology, Orthopedics" />
                        </div>
                        <div>
                            <label htmlFor="foundation" className="block text-sm font-medium text-gray-700">Foundation Date</label>
                            <input type="date" id="foundation" name="foundation" value={formData.foundation} onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 rounded-md" />
                        </div>
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                            <select id="status" name="status" value={formData.status} onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 rounded-md">
                                <option value="pending">Pending</option>
                                <option value="accept">Accept</option>
                            </select>
                        </div>
                    </div>
                    <div className="mt-4">
                        <label htmlFor="info" className="block text-sm font-medium text-gray-700">Hospital Description <span className="text-red-500">*</span></label>
                        <textarea id="info" name="info" value={formData.info} onChange={handleInputChange} rows="4"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 rounded-md" required></textarea>
                        {formErrors.info && <p className="text-red-500 text-xs mt-1">{formErrors.info}</p>}
                    </div>
                </div>

                {/* Section 2: Document/Image Uploads */}
                <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Images & Gallery</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="image" className="block text-sm font-medium text-gray-700">Main Hospital Image { !isEditing && <span className="text-red-500">*</span>}</label>
                            <input type="file" id="image" name="image" onChange={handleInputChange}
                                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                            {formData.image && <p className="text-gray-600 text-xs mt-1">Selected: {formData.image.name}</p>}
                            {formErrors.image && <p className="text-red-500 text-xs mt-1">{formErrors.image}</p>}
                        </div>
                        <div>
                            <label htmlFor="gallery" className="block text-sm font-medium text-gray-700">Hospital Gallery (Multiple Images)</label>
                            <input type="file" id="gallery" name="gallery" multiple onChange={handleInputChange}
                                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                            {formData.gallery.length > 0 && <p className="text-gray-600 text-xs mt-1">Selected: {formData.gallery.length} file(s)</p>}
                            {formErrors.gallery && <p className="text-red-500 text-xs mt-1">{formErrors.gallery}</p>}
                        </div>
                    </div>
                </div>

                {/* Section 3: Doctor Details Upload (Conceptual) */}
                {/* As discussed, doctor management is typically separate. This is a placeholder. */}
                <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Doctor Management (Conceptual)</h3>
                    <p className="text-gray-600">
                        Doctor details are usually managed in a separate section or linked via a dedicated Doctor model.
                        This form focuses solely on hospital information.
                    </p>
                </div>

                {/* Section 4: Terms and Conditions */}
                <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Terms and Conditions</h3>
                    <div className="flex items-center">
                        <input type="checkbox" id="acceptTerms" name="acceptTerms" checked={formData.acceptTerms} onChange={handleInputChange}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" required />
                        <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-900">
                            I accept the <a href="#" className="text-blue-600 hover:underline">Terms and Conditions</a> for listing this hospital. <span className="text-red-500">*</span>
                        </label>
                    </div>
                    {formErrors.acceptTerms && <p className="text-red-500 text-xs mt-1">{formErrors.acceptTerms}</p>}
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-3 mt-6">
                    <button type="button" onClick={onCancel}
                        className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition duration-200 rounded-md">
                        Cancel
                    </button>
                    <button type="submit"
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 rounded-md"
                        disabled={submitStatus === 'submitting'} // Disable button during submission
                    >
                        {submitStatus === 'submitting' ? (
                            'Saving...'
                        ) : isEditing ? (
                            'Update Hospital'
                        ) : (
                            'Add Hospital'
                        )}
                    </button>
                </div>

                {/* Submission Status Messages */}
                {submitStatus === 'success' && (
                    <p className="text-green-600 flex items-center gap-2 mt-4"><FaCheckCircle /> Hospital successfully saved!</p>
                )}
                {submitStatus === 'error' && (
                    <p className="text-red-600 flex items-center gap-2 mt-4"><FaTimesCircle /> Error saving hospital. Please check your inputs and try again.</p>
                )}
            </form>
        </div>
    );
};



export default HospitalAdminForm