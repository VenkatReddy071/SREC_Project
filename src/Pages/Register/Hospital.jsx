import React, { useState } from 'react';
import { FaUpload, FaUserMd, FaFileContract, FaCheckCircle, FaHospital, FaArrowRight, FaArrowLeft, FaInfoCircle, FaPlusCircle, FaImage, FaImages, FaIdCard } from 'react-icons/fa';
import axios from "axios"
const MultiStepHospitalForm = () => {
  const [currentStep, setCurrentStep] = useState(1);

  // State for Step 1: Hospital Details
  const [hospitalDetails, setHospitalDetails] = useState({
    hospitalName: '',
    hospitalLocation: '',
    hospitalMobileNumber: '',
    ownerEmail: '',
    hospitalInfo: '',
    specialization: [],
    hospitalFoundationDate: '',
    hospitalNearByLocation: '',
    hospitalImage: null,
    hospitalGallery: [],
  });

  // State for Step 2: Documents
  const [documents, setDocuments] = useState({
    hospitalLicense: null,
    verificationDocumentType: '',
    verificationDocument: null,
  });

  // State for Step 3: Doctor List
  const [doctorsList, setDoctorsList] = useState(
    [{ name: '', experience: '', specialization: '', image: null, operationSuccessRate: '' }]
  );

  const [termsAndConditions, setTermsAndConditions] = useState({
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [newSpecialty, setNewSpecialty] = useState('');

  const handleHospitalDetailsChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      setHospitalDetails({ ...hospitalDetails, [name]: files[0] });
    } else if (name === 'hospitalGallery') {
      setHospitalDetails({ ...hospitalDetails, hospitalGallery: Array.from(files) });
    } else {
      setHospitalDetails({ ...hospitalDetails, [name]: type === 'checkbox' ? checked : value });
    }
    setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
  };
  const handleDocumentsChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setDocuments({ ...documents, [name]: files[0] });
    } else {
      setDocuments({ ...documents, [name]: value });
      // If document type changes, clear the selected document file
      if (name === 'verificationDocumentType') {
        setDocuments(prev => ({ ...prev, verificationDocument: null }));
      }
    }
    setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
  };

  // Handler for Step 4 terms
  const handleTermsChange = (e) => {
    const { name, checked } = e.target;
    setTermsAndConditions({ ...termsAndConditions, [name]: checked });
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

  const handleDoctorChange = (index, e) => {
    const { name, value, type, files } = e.target;
    const newDoctors = doctorsList.map((doctor, i) => {
      if (i === index) {
        return {
          ...doctor,
          [name]: type === 'file' ? files[0] : value
        };
      }
      return doctor;
    });
    setDoctorsList(newDoctors);
  };

  const addDoctor = () => {
    setDoctorsList([...doctorsList, { name: '', experience: '', specialization: '', image: null, operationSuccessRate: '' }]);
  };

  const removeDoctor = (index) => {
    const newDoctors = doctorsList.filter((_, i) => i !== index);
    setDoctorsList(newDoctors);
  };

  const validateStep = () => {
    let newErrors = {};
    let isValid = true;

    if (currentStep === 1) {
      if (!hospitalDetails.hospitalName) newErrors.hospitalName = 'Hospital name is required.';
      if (!hospitalDetails.hospitalLocation) newErrors.hospitalLocation = 'Location is required.';
      if (!hospitalDetails.hospitalMobileNumber) {
        newErrors.hospitalMobileNumber = 'Mobile number is required.';
      } else if (!/^\d{10}$/.test(hospitalDetails.hospitalMobileNumber)) {
        newErrors.hospitalMobileNumber = 'Mobile number must be 10 digits.';
      }
      if (!hospitalDetails.ownerEmail) {
        newErrors.ownerEmail = 'Owner email is required.';
      } else if (!/\S+@\S+\.\S+/.test(hospitalDetails.ownerEmail)) {
        newErrors.ownerEmail = 'Email is invalid.';
      }
      if (!hospitalDetails.hospitalInfo) newErrors.hospitalInfo = 'Hospital information is required.';
      if (hospitalDetails.specialization.length === 0) newErrors.specialization = 'At least one specialty is required.';
      if (!hospitalDetails.hospitalFoundationDate) newErrors.hospitalFoundationDate = 'Foundation date is required.';
      else if (new Date(hospitalDetails.hospitalFoundationDate) > new Date()) newErrors.hospitalFoundationDate = 'Date cannot be in the future.';
      if (!hospitalDetails.hospitalNearByLocation) newErrors.hospitalNearByLocation = 'Nearby location is required.';
      if (!hospitalDetails.hospitalImage) newErrors.hospitalImage = 'Hospital main image is required.';
      if (hospitalDetails.hospitalGallery.length === 0) newErrors.hospitalGallery = 'At least one gallery image is required.';

    } else if (currentStep === 2) {
      if (!documents.hospitalLicense) newErrors.hospitalLicense = 'Hospital license document is required.';
      if (!documents.verificationDocumentType) newErrors.verificationDocumentType = 'Please select a document type.';
      if (!documents.verificationDocument) newErrors.verificationDocument = 'Verification document is required.';
    } else if (currentStep === 3) {
      if (doctorsList.length === 0) {
        newErrors.doctors = 'At least one doctor must be added.';
      } else {
        doctorsList.forEach((doctor, index) => {
          if (!doctor.name) newErrors[`doctorName${index}`] = `Doctor name for entry ${index + 1} is required.`;
          if (!doctor.experience) newErrors[`doctorExperience${index}`] = `Experience for entry ${index + 1} is required.` ;
          if (!doctor.specialization) newErrors[`doctorSpecialization${index}`] = `Specialization for entry ${index + 1} is required.`;
          if (!doctor.image) newErrors[`doctorImage${index}`] = `Image for entry ${index + 1} is required.`;
        });
      }
    } else if (currentStep === 4) {
      if (!termsAndConditions.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms and conditions.';
    }

    setErrors(newErrors);
    isValid = Object.keys(newErrors).length === 0;
    return isValid;
  };

//   const handleNext = () => {
//     if (validateStep()) {
//     let url=`${import.meta.env.VITE_SERVER_URL}`
//      if(currentStep===1){
//         url=url+"/api/addNew/Hospital"
//         console.log(hospitalDetails)
//         axios.post(url,{hospitalDetails},{withCredentials:true, 
//             headers:{
//               'Content-Type': 'multipart/form-data',
//             }
//             },)
//         .then((response)=>{
//             console.log(response.data)
//             setCurrentStep((prevStep) => prevStep + 1);
//         })
//         .catch((error)=>{
//             console.log(error)
//         })
//     }
//     else if(currentStep===2){

//     }
//     else if(currentStep===3){

//     }
//     else{

//     }
//     }
//   };

   const handleNext = async () => {
    if (validateStep()) {
      let url = `${import.meta.env.VITE_SERVER_URL}`;
      const formData = new FormData(); // Use FormData for file uploads

      if (currentStep === 1) {
        url += "/api/addNew/Hospital";
        for (const key in hospitalDetails) {
          if (key === 'specialization') {
            formData.append(key, JSON.stringify(hospitalDetails[key]));
          } else if (key === 'hospitalImage' && hospitalDetails[key]) {
            formData.append(key, hospitalDetails[key]);
          } else if (key === 'hospitalGallery' && hospitalDetails[key].length > 0) {
            hospitalDetails[key].forEach((file, index) => {
              formData.append(`hospitalGallery[${index}]`, file);
            });
          } else {
            formData.append(key, hospitalDetails[key]);
          }
        }
        try {
          const response = await axios.post(url, formData, {
            withCredentials: true,
            headers: {
              'Content-Type': 'multipart/form-data', // Important for file uploads
            },
          });
          console.log(response.data);
          setCurrentStep((prevStep) => prevStep + 1);
        } catch (error) {
          console.error("Error submitting hospital details:", error);
          alert("Failed to submit hospital details. Please try again.");
        }
      } else if (currentStep === 2) {
        url += "/api/uploadHospitalDocuments";
        if (documents.hospitalLicense) {
          formData.append('hospitalLicense', documents.hospitalLicense);
        }
        if (documents.verificationDocument) {
          formData.append('verificationDocument', documents.verificationDocument);
          formData.append('verificationDocumentType', documents.verificationDocumentType);
        }
        try {
          const response = await axios.post(url, formData, {
            withCredentials: true,
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          console.log(response.data);
          setCurrentStep((prevStep) => prevStep + 1);
        } catch (error) {
          console.error("Error uploading documents:", error);
          alert("Failed to upload documents. Please try again.");
        }
      } else if (currentStep === 3) {
        url += "/api/addDoctors";
        
        const doctorsDataToSend = doctorsList.map(doctor => {
          const { image, ...rest } = doctor;
          return rest; // Send doctor data without the file object
        });
        doctorsList.forEach((doctor, index) => {
          if (doctor.image) {
            formData.append(`doctorImage${index}`, doctor.image);
          }
          formData.append(`doctorData[${index}]`, JSON.stringify(doctor)); // Send doctor data as JSON string
        });

        try {
            const response = await axios.post(url, formData, { // Send as FormData if images are included
              withCredentials: true,
              headers: {
                'Content-Type': 'multipart/form-data', // Use multipart for files
              },
            });
            console.log(response.data);
            setCurrentStep((prevStep) => prevStep + 1);
          } catch (error) {
            console.error("Error adding doctors:", error);
            alert("Failed to add doctors. Please try again.");
          }
      }
    }
  };
  const handleBack = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep()) {
      // Combine all step data into a single object for submission
      const finalFormData = {
        ...hospitalDetails,
        ...documents,
        doctors: doctorsList,
        ...termsAndConditions,
      };
      alert('Form Submitted Successfully! Check console for data.');
      console.log('Final Form Data:', finalFormData);
      // In a real application, you would send this data to a server.
      // Remember to handle file uploads properly (e.g., to a storage service like S3/Cloudinary)
      // and send file URLs/metadata to your backend.
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Step 1: Hospital Details</h2>
            <div>
              <label htmlFor="hospitalName" className="block text-sm font-medium text-gray-700">
                Hospital Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="hospitalName"
                name="hospitalName"
                value={hospitalDetails.hospitalName}
                onChange={handleHospitalDetailsChange}
                className={`mt-1 block w-full border ${errors.hospitalName ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 focus:outline-none focus:border-blue-500`}
              />
              {errors.hospitalName && <p className="text-red-500 text-xs mt-1">{errors.hospitalName}</p>}
            </div>
            <div>
              <label htmlFor="hospitalLocation" className="block text-sm font-medium text-gray-700">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="hospitalLocation"
                name="hospitalLocation"
                value={hospitalDetails.hospitalLocation}
                onChange={handleHospitalDetailsChange}
                className={`mt-1 block w-full border ${errors.hospitalLocation ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 focus:outline-none focus:border-blue-500`}
              />
              {errors.hospitalLocation && <p className="text-red-500 text-xs mt-1">{errors.hospitalLocation}</p>}
            </div>
            <div>
              <label htmlFor="hospitalMobileNumber" className="block text-sm font-medium text-gray-700">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="hospitalMobileNumber"
                name="hospitalMobileNumber"
                value={hospitalDetails.hospitalMobileNumber}
                onChange={handleHospitalDetailsChange}
                className={`mt-1 block w-full border ${errors.hospitalMobileNumber ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 focus:outline-none focus:border-blue-500`}
              />
              {errors.hospitalMobileNumber && <p className="text-red-500 text-xs mt-1">{errors.hospitalMobileNumber}</p>}
            </div>
            <div>
              <label htmlFor="ownerEmail" className="block text-sm font-medium text-gray-700">
                Owner Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="ownerEmail"
                name="ownerEmail"
                value={hospitalDetails.ownerEmail}
                onChange={handleHospitalDetailsChange}
                className={`mt-1 block w-full border ${errors.ownerEmail ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 focus:outline-none focus:border-blue-500`}
              />
              {errors.ownerEmail && <p className="text-red-500 text-xs mt-1">{errors.ownerEmail}</p>}
            </div>
            <div>
              <label htmlFor="hospitalInfo" className="block text-sm font-medium text-gray-700">
                Hospital Info <span className="text-red-500">*</span>
              </label>
              <textarea
                id="hospitalInfo"
                name="hospitalInfo"
                value={hospitalDetails.hospitalInfo}
                onChange={handleHospitalDetailsChange}
                rows="3"
                className={`mt-1 block w-full border ${errors.hospitalInfo ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 focus:outline-none focus:border-blue-500`}
              ></textarea>
              {errors.hospitalInfo && <p className="text-red-500 text-xs mt-1">{errors.hospitalInfo}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Specializations <span className="text-red-500">*</span>
              </label>
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
              <label htmlFor="hospitalFoundationDate" className="block text-sm font-medium text-gray-700">
                Foundation Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="hospitalFoundationDate"
                name="hospitalFoundationDate"
                value={hospitalDetails.hospitalFoundationDate}
                onChange={handleHospitalDetailsChange}
                className={`mt-1 block w-full border ${errors.hospitalFoundationDate ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 focus:outline-none focus:border-blue-500`}
              />
              {errors.hospitalFoundationDate && <p className="text-red-500 text-xs mt-1">{errors.hospitalFoundationDate}</p>}
            </div>
            <div>
              <label htmlFor="hospitalNearByLocation" className="block text-sm font-medium text-gray-700">
                Nearby Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="hospitalNearByLocation"
                name="hospitalNearByLocation"
                value={hospitalDetails.hospitalNearByLocation}
                onChange={handleHospitalDetailsChange}
                className={`mt-1 block w-full border ${errors.hospitalNearByLocation ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 focus:outline-none focus:border-blue-500`}
              />
              {errors.hospitalNearByLocation && <p className="text-red-500 text-xs mt-1">{errors.hospitalNearByLocation}</p>}
            </div>
            {/* Hospital Main Image */}
            <div>
              <label htmlFor="hospitalImage" className="block text-sm font-medium text-gray-700">
                <FaImage className="inline-block mr-2 text-blue-600" /> Hospital Main Image <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                id="hospitalImage"
                name="hospitalImage"
                onChange={handleHospitalDetailsChange}
                className={`mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-gray-300 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 ${errors.hospitalImage ? 'border border-red-500' : ''}`}
              />
              {hospitalDetails.hospitalImage && <p className="text-gray-600 text-sm mt-1">Selected: {hospitalDetails.hospitalImage.name}</p>}
              {errors.hospitalImage && <p className="text-red-500 text-xs mt-1">{errors.hospitalImage}</p>}
            </div>
            {/* Hospital Gallery Images */}
            <div>
              <label htmlFor="hospitalGallery" className="block text-sm font-medium text-gray-700">
                <FaImages className="inline-block mr-2 text-blue-600" /> Hospital Gallery Images <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                id="hospitalGallery"
                name="hospitalGallery"
                onChange={handleHospitalDetailsChange}
                multiple // Allow multiple file selection
                className={`mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-gray-300 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 ${errors.hospitalGallery ? 'border border-red-500' : ''}`}
              />
              {hospitalDetails.hospitalGallery.length > 0 && (
                <p className="text-gray-600 text-sm mt-1">Selected: {hospitalDetails.hospitalGallery.map(f => f.name).join(', ')}</p>
              )}
              {errors.hospitalGallery && <p className="text-red-500 text-xs mt-1">{errors.hospitalGallery}</p>}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Step 2: Upload Documents</h2>
            <div>
              <label htmlFor="hospitalLicense" className="block text-sm font-medium text-gray-700">
                Hospital License <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                id="hospitalLicense"
                name="hospitalLicense"
                onChange={handleDocumentsChange}
                className={`mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-gray-300 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 ${errors.hospitalLicense ? 'border border-red-500' : ''}`}
              />
              {documents.hospitalLicense && <p className="text-gray-600 text-sm mt-1">Selected: {documents.hospitalLicense.name}</p>}
              {errors.hospitalLicense && <p className="text-red-500 text-xs mt-1">{errors.hospitalLicense}</p>}
            </div>
            {/* Verification Document Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaIdCard className="inline-block mr-2 text-blue-600" /> Upload ONE Verification Document <span className="text-red-500">*</span>
              </label>
              <div className="flex space-x-4 mb-3">
                {['aadhar', 'voterid', 'pancard'].map((type) => (
                  <label key={type} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="verificationDocumentType"
                      value={type}
                      checked={documents.verificationDocumentType === type}
                      onChange={handleDocumentsChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-900 capitalize">{type.replace('id', ' ID').replace('pan', 'PAN Card')}</span>
                  </label>
                ))}
              </div>
              {errors.verificationDocumentType && <p className="text-red-500 text-xs mt-1">{errors.verificationDocumentType}</p>}

              {documents.verificationDocumentType && (
                <div>
                  <label htmlFor="verificationDocument" className="block text-sm font-medium text-gray-700">
                    Upload {documents.verificationDocumentType.replace('id', ' ID').replace('pan', 'PAN Card')}
                  </label>
                  <input
                    type="file"
                    id="verificationDocument"
                    name="verificationDocument"
                    onChange={handleDocumentsChange}
                    className={`mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-gray-300 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 ${errors.verificationDocument ? 'border border-red-500' : ''}`}
                  />
                  {documents.verificationDocument && <p className="text-gray-600 text-sm mt-1">Selected: {documents.verificationDocument.name}</p>}
                  {errors.verificationDocument && <p className="text-red-500 text-xs mt-1">{errors.verificationDocument}</p>}
                </div>
              )}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Step 3: Doctor's List</h2>
            {errors.doctors && <p className="text-red-500 text-sm mb-2">{errors.doctors}</p>}
            {doctorsList.map((doctor, index) => (
              <div key={index} className="border border-gray-300 p-4 rounded-md space-y-3">
                <p className="text-md font-medium text-gray-800">Doctor {index + 1}</p>
                <div>
                  <label htmlFor={`doctorName-${index}`} className="block text-sm font-medium text-gray-700">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id={`doctorName-${index}`}
                    name="name"
                    value={doctor.name}
                    onChange={(e) => handleDoctorChange(index, e)}
                    className={`mt-1 block w-full border ${errors[`doctorName${index}`] ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 focus:outline-none focus:border-blue-500`}
                  />
                  {errors[`doctorName${index}`] && <p className="text-red-500 text-xs mt-1">{errors[`doctorName${index}`]}</p>}
                </div>
                <div>
                  <label htmlFor={`doctorExperience-${index}`} className="block text-sm font-medium text-gray-700">
                    Experience <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id={`doctorExperience-${index}`}
                    name="experience"
                    value={doctor.experience}
                    onChange={(e) => handleDoctorChange(index, e)}
                    className={`mt-1 block w-full border ${errors[`doctorExperience${index}`] ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 focus:outline-none focus:border-blue-500`}
                  />
                  {errors[`doctorExperience${index}`] && <p className="text-red-500 text-xs mt-1">{errors[`doctorExperience${index}`]}</p>}
                </div>
                <div>
                  <label htmlFor={`doctorSpecialization-${index}`} className="block text-sm font-medium text-gray-700">
                    Specialization <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id={`doctorSpecialization-${index}`}
                    name="specialization"
                    value={doctor.specialization}
                    onChange={(e) => handleDoctorChange(index, e)}
                    className={`mt-1 block w-full border ${errors[`doctorSpecialization${index}`] ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 focus:outline-none focus:border-blue-500`}
                  />
                  {errors[`doctorSpecialization${index}`] && <p className="text-red-500 text-xs mt-1">{errors[`doctorSpecialization${index}`]}</p>}
                </div>
                <div>
                  <label htmlFor={`doctorImage-${index}`} className="block text-sm font-medium text-gray-700">
                    Image <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    id={`doctorImage-${index}`}
                    name="image"
                    onChange={(e) => handleDoctorChange(index, e)}
                    className={`mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-gray-300 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 ${errors[`doctorImage${index}`] ? 'border border-red-500' : ''}`}
                  />
                  {doctor.image && <p className="text-gray-600 text-sm mt-1">Selected: {doctor.image.name}</p>}
                  {errors[`doctorImage${index}`] && <p className="text-red-500 text-xs mt-1">{errors[`doctorImage${index}`]}</p>}
                </div>
                <div>
                  <label htmlFor={`doctorOperationSuccessRate-${index}`} className="block text-sm font-medium text-gray-700">
                    Operation Success Rate
                  </label>
                  <input
                    type="text"
                    id={`doctorOperationSuccessRate-${index}`}
                    name="operationSuccessRate"
                    value={doctor.operationSuccessRate}
                    onChange={(e) => handleDoctorChange(index, e)}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
                {doctorsList.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDoctor(index)}
                    className="w-full mt-2 py-2 bg-red-500 text-white rounded-md text-sm"
                  >
                    Remove Doctor
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addDoctor}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md text-sm flex items-center"
            >
              <FaPlusCircle className="mr-2" /> Add New Doctor
            </button>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Step 4: Terms and Conditions</h2>
            <div className="border border-gray-300 p-4 rounded-md h-48 overflow-y-auto bg-gray-50 text-sm text-gray-700">
              <p className="font-medium mb-2">
                Please read and agree to the following terms and conditions:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>All information provided must be accurate and truthful. Any false information may lead to rejection of your application.</li>
                <li>You agree to provide access to your premises for verification purposes if required by the authorities.</li>
                <li>All uploaded documents must be legitimate and current. Submission of fraudulent documents is strictly prohibited.</li>
                <li>The hospital agrees to adhere to all local, state, and national healthcare regulations and standards.</li>
                <li>Data submitted will be processed and stored in accordance with our privacy policy. Your data will not be shared with third parties without your explicit consent, except as required by law.</li>
                <li>This registration does not guarantee any specific services or benefits unless explicitly stated otherwise.</li>
                <li>The organization reserves the right to modify these terms and conditions at any time. Continued use of the service after such modifications shall constitute your consent to such changes.</li>
                <li>By proceeding, you acknowledge that you have read, understood, and agreed to these terms and conditions in their entirety.</li>
              </ul>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="agreeToTerms"
                name="agreeToTerms"
                checked={termsAndConditions.agreeToTerms}
                onChange={handleTermsChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-900">
                I agree to the Terms and Conditions <span className="text-red-500">*</span>
              </label>
            </div>
            {errors.agreeToTerms && <p className="text-red-500 text-xs mt-1">{errors.agreeToTerms}</p>}
          </div>
        );
      default:
        return null;
    }
  };

  const getStepIcon = (step) => {
    switch (step) {
      case 1: return <FaHospital />;
      case 2: return <FaUpload />;
      case 3: return <FaUserMd />;
      case 4: return <FaFileContract />;
      default: return null;
    }
  };

  const getStepText = (step) => {
    switch (step) {
      case 1: return 'Hospital Details';
      case 2: return 'Documents';
      case 3: return 'Doctors List';
      case 4: return 'Terms';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-0 font-sans">
      <div className="flex w-full h-screen bg-white">
        {/* Left Panel: Step Indicators (Fixed Width) */}
        <div className="w-1/4 bg-gray-50 p-6 border-r border-gray-300 flex flex-col justify-start items-start">
          <h1 className="text-xl font-bold text-gray-900 mb-6">
            <FaInfoCircle className="inline-block mr-2 text-blue-600" /> Registration Steps
          </h1>
          <div className="flex flex-col space-y-6 w-full">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-full border-2 text-lg
                    ${currentStep === step ? 'bg-blue-600 border-blue-600 text-white' :
                      currentStep > step ? 'bg-green-500 border-green-500 text-white' :
                      'bg-gray-300 border-gray-400 text-gray-700'
                    }`}
                >
                  {currentStep > step ? <FaCheckCircle /> : getStepIcon(step)}
                </div>
                <p className={`ml-3 text-base font-medium ${currentStep >= step ? 'text-blue-700' : 'text-gray-700'}`}>
                  {getStepText(step)}
                </p>
              </div>
            ))}
          </div>
        </div>
        {/* Right Panel: Form Content (Takes remaining width, scrollable if content overflows) */}
        <div className="flex-1 p-8 bg-white overflow-y-auto relative">
          <form onSubmit={handleSubmit} className="space-y-6 flex flex-col h-full">
            <div className="flex-grow">
              {renderStep()}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-4 border-t border-gray-200  bg-white z-10">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center px-4 py-2 bg-gray-300 text-gray-800 rounded-md text-base font-medium"
                >
                  <FaArrowLeft className="mr-2" /> Back
                </button>
              )}

              {currentStep < 4 && (
                <button
                  type="button"
                  onClick={handleNext}
                  className={`relative bottom-0 flex items-center px-4 py-2 ${currentStep === 1 ? 'ml-auto' : ''} bg-blue-600 text-white rounded-md text-base font-medium`}
                >
                  Next <FaArrowRight className="ml-2" />
                </button>
              )}

              {currentStep === 4 && (
                <button
                  type="submit"
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md text-base font-medium"
                >
                  <FaCheckCircle className="mr-2" /> Submit
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MultiStepHospitalForm;