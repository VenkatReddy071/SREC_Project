import React, { useState } from 'react';
import { FaUpload, FaFileContract, FaCheckCircle, FaHospital, FaArrowRight, FaArrowLeft, FaInfoCircle, FaPlusCircle, FaImage, FaImages, FaIdCard, FaBuilding } from 'react-icons/fa';
import axios from "axios";

const MultiStepHospitalForm = () => {
    const [currentStep, setCurrentStep] = useState(1);

    const [hospitalDetails, setHospitalDetails] = useState({
        // Step 1 Fields
        name: '',
        locationName: '',
        address: '',
        phoneNumber: '',
        ownerEmail: '',
        info: '',
        specialization: [],
        foundation: '',
        nearByLocation: '',
        image: null, // Main hospital image File object
        gallery: [], // Array of gallery File objects
        hospitalLicense: null, // Hospital license document File object
        verificationDocumentType: '', // Type of verification document
        verificationDocument: null, // Verification document File object

        // Step 2 Fields
        patientSatisfaction: '', // Will be parsed as number
        successRate: '',         // Will be parsed as number
        ProceduresAnnually: '',  // Will be parsed as number
        ambulance: false,        // Boolean
        glimpseInside: [],       // Array of glimpse inside File objects
        agreeToTerms: false,     // From terms and conditions
    });

    const [errors, setErrors] = useState({});
    const [newSpecialty, setNewSpecialty] = useState('');

    const handleHospitalDetailsChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === 'file') {
            if (name === 'image') {
                setHospitalDetails({ ...hospitalDetails, [name]: files[0] });
            } else if (name === 'gallery') {
                setHospitalDetails({ ...hospitalDetails, gallery: Array.from(files) });
            } else if (name === 'glimpseInside') {
                setHospitalDetails({ ...hospitalDetails, glimpseInside: Array.from(files) });
            } else if (name === 'hospitalLicense') {
                setHospitalDetails({ ...hospitalDetails, [name]: files[0] });
            } else if (name === 'verificationDocument') {
                setHospitalDetails({ ...hospitalDetails, [name]: files[0] });
            }
        } else {
            let parsedValue = value;
            if (name === 'patientSatisfaction' || name === 'successRate' || name === 'ProceduresAnnually') {
                parsedValue = value === '' ? '' : Number(value);
            } else if (name === 'ambulance' || name === 'agreeToTerms') {
                parsedValue = checked;
            }

            setHospitalDetails({ ...hospitalDetails, [name]: parsedValue });
        }
        setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
    };

    const handleSpecialtyChange = (e) => {
        setNewSpecialty(e.target.value);
    };

    const addSpecialty = () => {
        if (newSpecialty.trim() && !hospitalDetails.specialization.includes(newSpecialty.trim())) {
            setHospitalDetails(prev => ({
                ...prev,
                specialization: [...prev.specialization, newSpecialty.trim()]
            }));
            setNewSpecialty('');
            setErrors(prevErrors => ({ ...prevErrors, specialization: '' }));
        }
    };

    const removeSpecialty = (specToRemove) => {
        setHospitalDetails(prev => ({
            ...prev,
            specialization: prev.specialization.filter(spec => spec !== specToRemove)
        }));
    };

    const validateStep = () => {
        let newErrors = {};
        let isValid = true;

        if (currentStep === 1) {
            if (!hospitalDetails.name) newErrors.name = 'Hospital name is required.';
            if (!hospitalDetails.locationName) newErrors.locationName = 'Location name is required.';
            if (!hospitalDetails.address) newErrors.address = 'Address is required.';
            if (!hospitalDetails.phoneNumber) {
                newErrors.phoneNumber = 'Phone number is required.';
            } else if (!/^\d{10}$/.test(hospitalDetails.phoneNumber)) {
                newErrors.phoneNumber = 'Phone number must be 10 digits.';
            }
            if (!hospitalDetails.ownerEmail) {
                newErrors.ownerEmail = 'Owner email is required.';
            } else if (!/\S+@\S+\.\S+/.test(hospitalDetails.ownerEmail)) {
                newErrors.ownerEmail = 'Email is invalid.';
            }
            if (!hospitalDetails.info) newErrors.info = 'Hospital information is required.';
            if (hospitalDetails.specialization.length === 0) newErrors.specialization = 'At least one specialty is required.';
            if (!hospitalDetails.foundation) newErrors.foundation = 'Foundation date is required.';
            else if (new Date(hospitalDetails.foundation) > new Date()) newErrors.foundation = 'Date cannot be in the future.';
            if (!hospitalDetails.nearByLocation) newErrors.nearByLocation = 'Nearby location is required.';
            if (!hospitalDetails.image) newErrors.image = 'Hospital main image is required.';
            if (hospitalDetails.gallery.length === 0) newErrors.gallery = 'At least one gallery image is required.';
            if (!hospitalDetails.hospitalLicense) newErrors.hospitalLicense = 'Hospital license document is required.';
            if (!hospitalDetails.verificationDocumentType) newErrors.verificationDocumentType = 'Please select a document type.';
            if (!hospitalDetails.verificationDocument) newErrors.verificationDocument = 'Verification document is required.';

        } else if (currentStep === 2) {
            if (hospitalDetails.patientSatisfaction === '' || isNaN(hospitalDetails.patientSatisfaction) || hospitalDetails.patientSatisfaction < 0 || hospitalDetails.patientSatisfaction > 100) {
                newErrors.patientSatisfaction = 'Patient Satisfaction Rate (0-100) is required.';
            }
            if (hospitalDetails.successRate === '' || isNaN(hospitalDetails.successRate) || hospitalDetails.successRate < 0 || hospitalDetails.successRate > 100) {
                newErrors.successRate = 'Success Rate (0-100) is required.';
            }
            if (hospitalDetails.ProceduresAnnually === '' || isNaN(hospitalDetails.ProceduresAnnually) || hospitalDetails.ProceduresAnnually < 0) {
                newErrors.ProceduresAnnually = 'Procedures Annually must be a non-negative number.';
            }
            if (hospitalDetails.glimpseInside.length === 0) newErrors.glimpseInside = 'At least one "glimpse inside" image is required.';
            if (!hospitalDetails.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms and conditions.';
        }

        setErrors(newErrors);
        isValid = Object.keys(newErrors).length === 0;
        return isValid;
    };

    const handleSubmitAllData = async () => {
        const url = `${import.meta.env.VITE_SERVER_URL}/api/hospitals/addNew/Hospital`;
        const formData = new FormData();

        // Append all text fields (from both steps)
        for (const key in hospitalDetails) {
            if (hospitalDetails.hasOwnProperty(key) && hospitalDetails[key] !== null && hospitalDetails[key] !== undefined) {
                if (key === 'specialization') {
                    formData.append(key, JSON.stringify(hospitalDetails[key]));
                } else if (
                    key !== 'image' &&
                    key !== 'gallery' &&
                    key !== 'glimpseInside' &&
                    key !== 'hospitalLicense' &&
                    key !== 'verificationDocument'
                ) {
                    formData.append(key, hospitalDetails[key]);
                }
            }
        }

        // Append all file fields
        if (hospitalDetails.image) {
            formData.append('hospitalImage', hospitalDetails.image);
        }
        hospitalDetails.gallery.forEach((file) => {
            formData.append('hospitalGallery', file);
        });
        hospitalDetails.glimpseInside.forEach((file) => {
            formData.append('glimpseInside', file);
        });
        if (hospitalDetails.hospitalLicense) {
            formData.append('hospitalLicense', hospitalDetails.hospitalLicense);
        }
        if (hospitalDetails.verificationDocument) {
            formData.append('verificationDocument', hospitalDetails.verificationDocument);
        }

        // Log FormData entries for debugging
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }

        try {
            const response = await axios.post(url, formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(response.data);
            alert('Hospital Registration Completed Successfully!');
            // Optionally redirect or show success message
        } catch (error) {
            console.error("Error submitting hospital data:", error);
            alert(`Failed to submit hospital data: ${error.response?.data?.message || error.message}. Please try again.`);
        }
    };

    const handleNext = async () => {
        if (validateStep()) {
            if (currentStep === 1) {
                setCurrentStep((prevStep) => prevStep + 1);
            } else if (currentStep === 2) {
                // This is the final step, submit all data
                await handleSubmitAllData();
            }
        }
    };

    const handleBack = () => {
        setCurrentStep((prevStep) => prevStep - 1);
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-800">Step 1: Hospital General Details & Documents</h2>
                        {/* Hospital Basic Details */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Hospital Name <span className="text-red-500">*</span></label>
                            <input type="text" id="name" name="name" value={hospitalDetails.name} onChange={handleHospitalDetailsChange} className={`mt-1 block w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 focus:outline-none focus:border-blue-500`} />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>
                        <div>
                            <label htmlFor="locationName" className="block text-sm font-medium text-gray-700">Location Name <span className="text-red-500">*</span></label>
                            <input type="text" id="locationName" name="locationName" value={hospitalDetails.locationName} onChange={handleHospitalDetailsChange} className={`mt-1 block w-full border ${errors.locationName ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 focus:outline-none focus:border-blue-500`} />
                            {errors.locationName && <p className="text-red-500 text-xs mt-1">{errors.locationName}</p>}
                        </div>
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address <span className="text-red-500">*</span></label>
                            <input type="text" id="address" name="address" value={hospitalDetails.address} onChange={handleHospitalDetailsChange} className={`mt-1 block w-full border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 focus:outline-none focus:border-blue-500`} />
                            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                        </div>
                        <div>
                            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number <span className="text-red-500">*</span></label>
                            <input type="tel" id="phoneNumber" name="phoneNumber" value={hospitalDetails.phoneNumber} onChange={handleHospitalDetailsChange} className={`mt-1 block w-full border ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 focus:outline-none focus:border-blue-500`} />
                            {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
                        </div>
                        <div>
                            <label htmlFor="ownerEmail" className="block text-sm font-medium text-gray-700">Owner Email <span className="text-red-500">*</span></label>
                            <input type="email" id="ownerEmail" name="ownerEmail" value={hospitalDetails.ownerEmail} onChange={handleHospitalDetailsChange} className={`mt-1 block w-full border ${errors.ownerEmail ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 focus:outline-none focus:border-blue-500`} />
                            {errors.ownerEmail && <p className="text-red-500 text-xs mt-1">{errors.ownerEmail}</p>}
                        </div>
                        <div>
                            <label htmlFor="info" className="block text-sm font-medium text-gray-700">Hospital Info <span className="text-red-500">*</span></label>
                            <textarea id="info" name="info" value={hospitalDetails.info} onChange={handleHospitalDetailsChange} rows="3" className={`mt-1 block w-full border ${errors.info ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 focus:outline-none focus:border-blue-500`} />
                            {errors.info && <p className="text-red-500 text-xs mt-1">{errors.info}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Specializations <span className="text-red-500">*</span></label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {hospitalDetails.specialization.map((spec, index) => (
                                    <span key={index} className="flex items-center bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                                        {spec}
                                        <button type="button" onClick={() => removeSpecialty(spec)} className="ml-2 text-blue-600">x</button>
                                    </span>
                                ))}
                            </div>
                            <div className="flex">
                                <input
                                    type="text"
                                    value={newSpecialty}
                                    onChange={handleSpecialtyChange}
                                    placeholder="Add a specialty"
                                    className={`mt-1 flex-1 border ${errors.specialization ? 'border-red-500' : 'border-gray-300'} rounded-l-md p-2 focus:outline-none focus:border-blue-500`}
                                />
                                <button
                                    type="button"
                                    onClick={addSpecialty}
                                    className="mt-1 px-4 py-2 bg-blue-600 text-white rounded-r-md text-sm"
                                >
                                    Add
                                </button>
                            </div>
                            {errors.specialization && <p className="text-red-500 text-xs mt-1">{errors.specialization}</p>}
                        </div>
                        <div>
                            <label htmlFor="foundation" className="block text-sm font-medium text-gray-700">Foundation Date <span className="text-red-500">*</span></label>
                            <input type="date" id="foundation" name="foundation" value={hospitalDetails.foundation} onChange={handleHospitalDetailsChange} className={`mt-1 block w-full border ${errors.foundation ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 focus:outline-none focus:border-blue-500`} />
                            {errors.foundation && <p className="text-red-500 text-xs mt-1">{errors.foundation}</p>}
                        </div>
                        <div>
                            <label htmlFor="nearByLocation" className="block text-sm font-medium text-gray-700">Nearby Location <span className="text-red-500">*</span></label>
                            <input type="text" id="nearByLocation" name="nearByLocation" value={hospitalDetails.nearByLocation} onChange={handleHospitalDetailsChange} className={`mt-1 block w-full border ${errors.nearByLocation ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 focus:outline-none focus:border-blue-500`} />
                            {errors.nearByLocation && <p className="text-red-500 text-xs mt-1">{errors.nearByLocation}</p>}
                        </div>

                        {/* Hospital Images */}
                        <div className="border p-4 rounded-md">
                            <h3 className="text-lg font-medium text-gray-800 mb-2 flex items-center">
                                <FaImage className="mr-2 text-blue-500" /> Hospital Images
                            </h3>
                            <div>
                                <label htmlFor="image" className="block text-sm font-medium text-gray-700">Main Hospital Image <span className="text-red-500">*</span></label>
                                <input type="file" id="image" name="image" onChange={handleHospitalDetailsChange} accept="image/*" className={`mt-1 block w-full border ${errors.image ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 focus:outline-none focus:border-blue-500`} />
                                {hospitalDetails.image && <p className="text-gray-500 text-xs mt-1">Selected: {hospitalDetails.image.name}</p>}
                                {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
                            </div>
                            <div className="mt-4">
                                <label htmlFor="gallery" className="block text-sm font-medium text-gray-700">Hospital Gallery Images (Max 5) <span className="text-red-500">*</span></label>
                                <input type="file" id="gallery" name="gallery" multiple onChange={handleHospitalDetailsChange} accept="image/*" className={`mt-1 block w-full border ${errors.gallery ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 focus:outline-none focus:border-blue-500`} />
                                {hospitalDetails.gallery.length > 0 && (
                                    <p className="text-gray-500 text-xs mt-1">Selected: {hospitalDetails.gallery.map(f => f.name).join(', ')}</p>
                                )}
                                {errors.gallery && <p className="text-red-500 text-xs mt-1">{errors.gallery}</p>}
                            </div>
                        </div>

                        {/* Documents Section */}
                        <div className="border p-4 rounded-md">
                            <h3 className="text-lg font-medium text-gray-800 mb-2 flex items-center">
                                <FaFileContract className="mr-2 text-green-500" /> Documents
                            </h3>
                            <div>
                                <label htmlFor="hospitalLicense" className="block text-sm font-medium text-gray-700">Hospital License Document <span className="text-red-500">*</span></label>
                                <input type="file" id="hospitalLicense" name="hospitalLicense" onChange={handleHospitalDetailsChange} accept=".pdf,image/*" className={`mt-1 block w-full border ${errors.hospitalLicense ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 focus:outline-none focus:border-blue-500`} />
                                {hospitalDetails.hospitalLicense && <p className="text-gray-500 text-xs mt-1">Selected: {hospitalDetails.hospitalLicense.name}</p>}
                                {errors.hospitalLicense && <p className="text-red-500 text-xs mt-1">{errors.hospitalLicense}</p>}
                            </div>
                            <div className="mt-4">
                                <label htmlFor="verificationDocumentType" className="block text-sm font-medium text-gray-700">Verification Document Type <span className="text-red-500">*</span></label>
                                <select
                                    id="verificationDocumentType"
                                    name="verificationDocumentType"
                                    value={hospitalDetails.verificationDocumentType}
                                    onChange={handleHospitalDetailsChange}
                                    className={`mt-1 block w-full border ${errors.verificationDocumentType ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 focus:outline-none focus:border-blue-500`}
                                >
                                    <option value="">Select Type</option>
                                    <option value="AadharCard">Aadhar Card</option>
                                    <option value="PanCard">PAN Card</option>
                                    <option value="Passport">Passport</option>
                                    <option value="Other">Other</option>
                                </select>
                                {errors.verificationDocumentType && <p className="text-red-500 text-xs mt-1">{errors.verificationDocumentType}</p>}
                            </div>
                            {hospitalDetails.verificationDocumentType && (
                                <div className="mt-4">
                                    <label htmlFor="verificationDocument" className="block text-sm font-medium text-gray-700">Upload Verification Document <span className="text-red-500">*</span></label>
                                    <input type="file" id="verificationDocument" name="verificationDocument" onChange={handleHospitalDetailsChange} accept=".pdf,image/*" className={`mt-1 block w-full border ${errors.verificationDocument ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 focus:outline-none focus:border-blue-500`} />
                                    {hospitalDetails.verificationDocument && <p className="text-gray-500 text-xs mt-1">Selected: {hospitalDetails.verificationDocument.name}</p>}
                                    {errors.verificationDocument && <p className="text-red-500 text-xs mt-1">{errors.verificationDocument}</p>}
                                </div>
                            )}
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-800">Step 2: Hospital Operational Details & Confirmation</h2>
                        {/* Statistics */}
                        <div>
                            <label htmlFor="patientSatisfaction" className="block text-sm font-medium text-gray-700">Patient Satisfaction Rate (%) <span className="text-red-500">*</span></label>
                            <input type="number" id="patientSatisfaction" name="patientSatisfaction" value={hospitalDetails.patientSatisfaction} onChange={handleHospitalDetailsChange} min="0" max="100" className={`mt-1 block w-full border ${errors.patientSatisfaction ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 focus:outline-none focus:border-blue-500`} />
                            {errors.patientSatisfaction && <p className="text-red-500 text-xs mt-1">{errors.patientSatisfaction}</p>}
                        </div>
                        <div>
                            <label htmlFor="successRate" className="block text-sm font-medium text-gray-700">Overall Success Rate (%) <span className="text-red-500">*</span></label>
                            <input type="number" id="successRate" name="successRate" value={hospitalDetails.successRate} onChange={handleHospitalDetailsChange} min="0" max="100" className={`mt-1 block w-full border ${errors.successRate ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 focus:outline-none focus:border-blue-500`} />
                            {errors.successRate && <p className="text-red-500 text-xs mt-1">{errors.successRate}</p>}
                        </div>
                        <div>
                            <label htmlFor="ProceduresAnnually" className="block text-sm font-medium text-gray-700">Procedures Annually <span className="text-red-500">*</span></label>
                            <input type="number" id="ProceduresAnnually" name="ProceduresAnnually" value={hospitalDetails.ProceduresAnnually} onChange={handleHospitalDetailsChange} min="0" className={`mt-1 block w-full border ${errors.ProceduresAnnually ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 focus:outline-none focus:border-blue-500`} />
                            {errors.ProceduresAnnually && <p className="text-red-500 text-xs mt-1">{errors.ProceduresAnnually}</p>}
                        </div>
                        <div className="flex items-center">
                            <input type="checkbox" id="ambulance" name="ambulance" checked={hospitalDetails.ambulance} onChange={handleHospitalDetailsChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                            <label htmlFor="ambulance" className="ml-2 block text-sm font-medium text-gray-700">24/7 Ambulance Available</label>
                        </div>

                        {/* Glimpse Inside Images */}
                        <div className="border p-4 rounded-md">
                            <h3 className="text-lg font-medium text-gray-800 mb-2 flex items-center">
                                <FaImages className="mr-2 text-purple-500" /> Glimpse Inside (Max 5) <span className="text-red-500">*</span>
                            </h3>
                            <div>
                                <label htmlFor="glimpseInside" className="block text-sm font-medium text-gray-700">Upload Images Showing Glimpse Inside Hospital</label>
                                <input type="file" id="glimpseInside" name="glimpseInside" multiple onChange={handleHospitalDetailsChange} accept="image/*" className={`mt-1 block w-full border ${errors.glimpseInside ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 focus:outline-none focus:border-blue-500`} />
                                {hospitalDetails.glimpseInside.length > 0 && (
                                    <p className="text-gray-500 text-xs mt-1">Selected: {hospitalDetails.glimpseInside.map(f => f.name).join(', ')}</p>
                                )}
                                {errors.glimpseInside && <p className="text-red-500 text-xs mt-1">{errors.glimpseInside}</p>}
                            </div>
                        </div>

                        {/* Terms & Conditions */}
                        <div className="border p-4 rounded-md">
                            <h3 className="text-lg font-medium text-gray-800 mb-2 flex items-center">
                                <FaFileContract className="mr-2 text-blue-500" /> Terms & Conditions
                            </h3>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="agreeToTerms"
                                    name="agreeToTerms"
                                    checked={hospitalDetails.agreeToTerms}
                                    onChange={handleHospitalDetailsChange}
                                    className={`h-4 w-4 text-blue-600 border ${errors.agreeToTerms ? 'border-red-500' : 'border-gray-300'} rounded`}
                                />
                                <label htmlFor="agreeToTerms" className="ml-2 block text-sm font-medium text-gray-700">
                                    I agree to the <a href="#" className="text-blue-600 hover:underline">Terms and Conditions</a> <span className="text-red-500">*</span>
                                </label>
                            </div>
                            {errors.agreeToTerms && <p className="text-red-500 text-xs mt-1">{errors.agreeToTerms}</p>}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg my-8">
            <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">Register New Hospital</h1>

            <div className="flex justify-between mb-6">
                <div className={`flex flex-col items-center ${currentStep === 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                    <FaHospital className="text-3xl mb-2" />
                    <span className="text-sm font-medium">Details & Docs</span>
                </div>
                <div className="flex-1 border-t-2 border-gray-300 mt-4 mx-2"></div>
                <div className={`flex flex-col items-center ${currentStep === 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                    <FaCheckCircle className="text-3xl mb-2" />
                    <span className="text-sm font-medium">Operational & Confirm</span>
                </div>
            </div>

            {/* Changed form onSubmit to directly call handleNext, which now handles submission on final step */}
            <form onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
                {renderStep()}

                <div className="mt-8 flex justify-between">
                    {currentStep > 1 && (
                        <button
                            type="button"
                            onClick={handleBack}
                            className="flex items-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <FaArrowLeft className="mr-2" /> Back
                        </button>
                    )}

                    <button
                        type="submit" // Always type="submit" for the form button
                        className="ml-auto flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        {currentStep < 2 ? (
                            <>Next <FaArrowRight className="ml-2" /></>
                        ) : (
                            <>Register Hospital <FaCheckCircle className="ml-2" /></>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default MultiStepHospitalForm;