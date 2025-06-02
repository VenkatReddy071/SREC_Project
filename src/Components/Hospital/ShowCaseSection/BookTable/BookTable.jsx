import React, { useState, useEffect } from 'react';

// Skeleton Loader for form fields
const FormSkeletonLoader = () => (
  <div className="p-8 bg-gray-100 rounded-lg shadow-md animate-pulse space-y-6">
    <div className="h-8 bg-gray-200 rounded w-3/4 mb-4 mx-auto"></div> {/* Title */}
    <div className="space-y-4">
      <div className="h-10 bg-gray-200 rounded w-full"></div> {/* Input field */}
      <div className="h-10 bg-gray-200 rounded w-full"></div> {/* Input field */}
      <div className="h-10 bg-gray-200 rounded w-full"></div> {/* Input field */}
      <div className="h-10 bg-gray-200 rounded w-full"></div> {/* Input field */}
      <div className="h-10 bg-gray-200 rounded w-full"></div> {/* Dropdown */}
      <div className="h-10 bg-gray-200 rounded w-full"></div> {/* Dropdown */}
      <div className="h-24 bg-gray-200 rounded w-full"></div> {/* Textarea */}
      <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto"></div> {/* Location */}
      <div className="h-14 bg-blue-200 rounded-full w-full"></div> {/* Button */}
    </div>
  </div>
);

export const  BookTable=()=>{
  const [loading, setLoading] = useState(true);
  const [doctorsData, setDoctorsData] = useState([]);
  const [specializationsData, setSpecializationsData] = useState([]);

  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userMobile, setUserMobile] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [userMessage, setUserMessage] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // Fetch doctors and specializations data
  useEffect(() => {
    const fetchData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call delay

      const mockDoctors = [
        { id: 'doc1', name: 'Dr. Preethi. P', specialization: 'ENT Head and Neck Surgery', isAvailable: true },
        { id: 'doc2', name: 'Dr. Priya Philip', specialization: 'Radiation Oncology', isAvailable: true },
        { id: 'doc3', name: 'Dr. Rupini. S', specialization: 'Radiology', isAvailable: false },
        { id: 'doc4', name: 'Dr. Anya Sharma', specialization: 'Cardiology', isAvailable: true },
        { id: 'doc5', name: 'Dr. Rohan Patel', specialization: 'Orthopedic Surgery', isAvailable: true },
        { id: 'doc6', name: 'Dr. Sana Khan', specialization: 'Dermatology', isAvailable: false },
        { id: 'doc7', name: 'Dr. Arjun Mehta', specialization: 'General Surgery', isAvailable: true },
        { id: 'doc8', name: 'Dr. Neha Gupta', specialization: 'Oncology', isAvailable: true },
        { id: 'doc9', name: 'Dr. Kavita Rao', specialization: 'Gynecology', isAvailable: true },
      ];

      const uniqueSpecializations = [...new Set(mockDoctors.map(doc => doc.specialization))];

      setDoctorsData(mockDoctors);
      setSpecializationsData(uniqueSpecializations);
      setLoading(false);

      // Check for pre-selected doctor from URL
      const params = new URLSearchParams(window.location.search);
      const preSelectedDocId = params.get('doctorId');
      if (preSelectedDocId) {
        const doctor = mockDoctors.find(doc => doc.id === preSelectedDocId);
        if (doctor && doctor.isAvailable) {
          setSelectedDoctorId(preSelectedDocId);
          setSelectedSpecialization(doctor.specialization);
        }
      }
    };

    fetchData();
  }, []);

  // Get user's geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      setLocationLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocationLoading(false);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLocationError("Unable to retrieve your location. Please enable location services or enter manually.");
          setLocationLoading(false);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser.");
    }
  }, []);

  const handleSpecializationChange = (e) => {
    setSelectedSpecialization(e.target.value);
    setSelectedDoctorId(''); // Reset doctor selection when specialization changes
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!userName || !userEmail || !userMobile || !appointmentDate || !selectedSpecialization || !selectedDoctorId) {
      alert('Please fill in all required fields.'); // Replace with custom modal
      return;
    }

    const selectedDoctor = doctorsData.find(doc => doc.id === selectedDoctorId);
    if (!selectedDoctor || !selectedDoctor.isAvailable) {
      alert('Please select an available doctor.'); // Replace with custom modal
      return;
    }

    const bookingDetails = {
      userName,
      userEmail,
      userMobile,
      selectedSpecialization,
      selectedDoctor: selectedDoctor.name,
      appointmentDate,
      userMessage,
      userLocation: userLocation ? `Lat: ${userLocation.latitude}, Lon: ${userLocation.longitude}` : 'Not provided',
    };

    console.log('Appointment Booking Details:', bookingDetails);
    setBookingConfirmed(true);
    // In a real application, you would send this data to your backend API
    // e.g., fetch('/api/book-appointment', { method: 'POST', body: JSON.stringify(bookingDetails) });

    // Reset form fields after successful submission
    setUserName('');
    setUserEmail('');
    setUserMobile('');
    setSelectedSpecialization('');
    setSelectedDoctorId('');
    setAppointmentDate('');
    setUserMessage('');
    // Keep location as it is, or reset if desired
  };

  const filteredDoctors = selectedSpecialization
    ? doctorsData.filter(doc => doc.specialization === selectedSpecialization)
    : doctorsData;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12 w-full md:w-4/5 xl:w-4/5 font-inter">
        <FormSkeletonLoader />
      </div>
    );
  }

  return (
    <div className="container md:mx-10 md:px-4 py-4 md:py-4 w-full md:w-4/5 xl:w-4/5 font-inter">
      <div className="bg-white rounded-xl  p-6 md:p-8 lg:p-10 flex flex-col space-y-8">

        <div className="text-center space-y-4 pb-6 border-b border-blue-100">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-800 tracking-tight">Book Your Appointment</h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Please fill out the form below to schedule your appointment with our expert doctors.
          </p>
        </div>

        {bookingConfirmed && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6" role="alert">
            <strong className="font-bold">Success!</strong>
            <span className="block sm:inline ml-2">Your appointment request has been submitted. We will contact you shortly.</span>
            <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setBookingConfirmed(false)}>
              <svg className="fill-current h-6 w-6 text-green-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 2.65a1.2 1.2 0 1 1-1.697-1.697L8.303 10l-2.651-2.651a1.2 1.2 0 1 1 1.697-1.697L10 8.303l2.651-2.651a1.2 1.2 0 1 1 1.697 1.697L11.697 10l2.651 2.651a1.2 1.2 0 0 1 0 1.698z"/></svg>
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User Details */}
          <div>
            <label htmlFor="userName" className="block text-lg font-medium text-gray-700 mb-2">Your Name:</label>
            <input
              type="text"
              id="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-lg"
              placeholder="Full Name"
              required
            />
          </div>
          <div>
            <label htmlFor="userEmail" className="block text-lg font-medium text-gray-700 mb-2">Email:</label>
            <input
              type="email"
              id="userEmail"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-lg"
              placeholder="your.email@example.com"
              required
            />
          </div>
          <div>
            <label htmlFor="userMobile" className="block text-lg font-medium text-gray-700 mb-2">Mobile Number:</label>
            <input
              type="tel"
              id="userMobile"
              value={userMobile}
              onChange={(e) => setUserMobile(e.target.value)}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-lg"
              placeholder="+91 XXXXXXXXXX"
              pattern="[0-9]{10}" // Basic pattern for 10 digits
              title="Please enter a 10-digit mobile number"
              required
            />
          </div>

          {/* Appointment Details */}
          <div>
            <label htmlFor="specialization" className="block text-lg font-medium text-gray-700 mb-2">Select Specialization:</label>
            <select
              id="specialization"
              value={selectedSpecialization}
              onChange={handleSpecializationChange}
              className="mt-1 block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-lg rounded-md shadow-sm"
              required
            >
              <option value="">-- Any Specialization --</option>
              {specializationsData.map((spec, index) => (
                <option key={index} value={spec}>{spec}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="doctor" className="block text-lg font-medium text-gray-700 mb-2">Select Doctor:</label>
            <select
              id="doctor"
              value={selectedDoctorId}
              onChange={(e) => setSelectedDoctorId(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-lg rounded-md shadow-sm"
              required
            >
              <option value="">
                {selectedSpecialization ? `-- Select a Doctor for ${selectedSpecialization} --` : '-- Select a Doctor --'}
              </option>
              {filteredDoctors.map((doc) => (
                <option key={doc.id} value={doc.id} disabled={!doc.isAvailable}>
                  {doc.name} {doc.isAvailable ? '' : '(Not Available)'}
                </option>
              ))}
            </select>
            {selectedDoctorId && !doctorsData.find(doc => doc.id === selectedDoctorId)?.isAvailable && (
              <p className="text-red-600 text-sm mt-2">This doctor is not available for appointments.</p>
            )}
          </div>

          <div>
            <label htmlFor="appointmentDate" className="block text-lg font-medium text-gray-700 mb-2">Appointment Date:</label>
            <input
              type="date"
              id="appointmentDate"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-lg"
              min={new Date().toISOString().split('T')[0]} // Prevent selecting past dates
              required
            />
          </div>

          <div>
            <label htmlFor="userMessage" className="block text-lg font-medium text-gray-700 mb-2">Your Message (Optional):</label>
            <textarea
              id="userMessage"
              rows="4"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-lg"
              placeholder="e.g., Briefly describe your symptoms or reason for visit..."
            ></textarea>
          </div>

         
          {/* <div className="mt-6">
            <p className="block text-lg font-medium text-gray-700 mb-2">Your Location:</p>
            {locationLoading ? (
              <p className="text-blue-600">Getting your location...</p>
            ) : userLocation ? (
              <p className="text-gray-800 font-semibold">
                Latitude: {userLocation.latitude.toFixed(4)}, Longitude: {userLocation.longitude.toFixed(4)}
                <span className="ml-2 text-green-600 text-sm">(Location detected)</span>
              </p>
            ) : (
              <p className="text-red-600">{locationError || "Location not available. Please allow location access."}</p>
            )}
          </div> */}

          {/* Submit Button */}
          <div className="text-center pt-4">
            <button
              type="submit"
              className="inline-flex items-center px-10 py-4 border border-transparent text-xl font-semibold rounded-full shadow-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 transition duration-300 ease-in-out transform hover:-translate-y-1"
            >
              Confirm Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


