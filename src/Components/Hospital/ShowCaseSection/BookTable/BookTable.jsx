import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import axios from "axios";

const FormSkeletonLoader = () => (
  <div className="p-8 bg-gray-100 rounded-lg shadow-md animate-pulse space-y-6">
    <div className="h-8 bg-gray-200 rounded w-3/4 mb-4 mx-auto"></div>
    <div className="space-y-4">
      <div className="h-10 bg-gray-200 rounded w-full"></div>
      <div className="h-10 bg-gray-200 rounded w-full"></div>
      <div className="h-10 bg-gray-200 rounded w-full"></div>
      <div className="h-10 bg-gray-200 rounded w-full"></div>
      <div className="h-10 bg-gray-200 rounded w-full"></div>
      <div className="h-10 bg-gray-200 rounded w-full"></div>
      <div className="h-24 bg-gray-200 rounded w-full"></div>
      <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto"></div>
      <div className="h-14 bg-blue-200 rounded-full w-full"></div>
    </div>
  </div>
);

export const BookTable = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [doctorsData, setDoctorsData] = useState([]);
  const [specializationsData, setSpecializationsData] = useState([]);

  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userMobile, setUserMobile] = useState('');
  const [userGender, setUserGender] = useState('');
  const [userAge, setUserAge] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [userMessage, setUserMessage] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const urlParams = new URLSearchParams(location.search);
  const typeUrl = urlParams.get('type');
  const IdParts = typeUrl?.split("/");
  const HospitalId = IdParts && IdParts.length > 2 ? IdParts[2] : null;
  const doctorIdFromUrl = urlParams.get('book');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const url = `${import.meta.env.VITE_SERVER_URL}/api/hospitals/book/${HospitalId}`;
      const requestUrl = doctorIdFromUrl ? `${url}?doctorId=${doctorIdFromUrl}` : url;

      try {
        const response = await axios.get(requestUrl, { withCredentials: true });
        const fetchedDoctors = response.data.doctors || [];
        setDoctorsData(fetchedDoctors);

        const allSpecializations = fetchedDoctors.flatMap(doc => {
          return Array.isArray(doc.specialization) ? doc.specialization : [doc.specialization];
        }).filter(Boolean);

        const uniqueSpecializations = [...new Set(allSpecializations)];
        setSpecializationsData(uniqueSpecializations);

        if (doctorIdFromUrl) {
          const doctor = fetchedDoctors.find(doc => doc._id === doctorIdFromUrl);

          if (doctor && doctor.isAvaliable) {
            setSelectedDoctorId(doctorIdFromUrl);
            if (Array.isArray(doctor.specialization) && doctor.specialization.length > 0) {
              setSelectedSpecialization(doctor.specialization[0]);
            } else if (typeof doctor.specialization === 'string') {
              setSelectedSpecialization(doctor.specialization);
            }
          } else if (doctor && !doctor.isAvaliable) {
            alert(`The pre-selected doctor, ${doctor.name}, is currently not available for appointments.`);
            setSelectedDoctorId('');
            setSelectedSpecialization('');
          } else {
            alert('The pre-selected doctor specified in the URL was not found.');
            setSelectedDoctorId('');
            setSelectedSpecialization('');
          }
        }

      } catch (error) {
        console.error("Error fetching data:", error);
        alert('Failed to load doctor data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [HospitalId, doctorIdFromUrl]);

  const handleSpecializationChange = (e) => {
    setSelectedSpecialization(e.target.value);
    setSelectedDoctorId('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!userName || !userEmail || !userMobile || !userGender || !userAge || !appointmentDate || !appointmentTime || !selectedSpecialization || !selectedDoctorId) {
      alert('Please fill in all required fields.');
      return;
    }

    const selectedDoctor = doctorsData.find(doc => doc._id === selectedDoctorId);
    if (!selectedDoctor || !selectedDoctor.isAvaliable) {
      alert('Please select an available doctor.');
      return;
    }

    const bookingDetails = {
      name:userName,
      email:userEmail,
      mobilenumber:userMobile,
      gender:userGender,
      age:userAge,
      specialization:selectedSpecialization,
      doctorId: selectedDoctor._id,
      date:appointmentDate,
      slot:appointmentTime,
      message:userMessage,
      hospitalId: HospitalId,
      doctorId: selectedDoctorId,
    };

    console.log('Appointment Booking Details:', bookingDetails);
    const url=`${import.meta.env.VITE_SERVER_URL}/api/booking`;

    axios.post(url,bookingDetails,{withCredentials:true})
    .then((response)=>{
      console.log(response.data);
    setBookingConfirmed(true);
    setUserName('');
    setUserEmail('');
    setUserMobile('');
    setUserGender('');
    setUserAge('');
    setSelectedSpecialization('');
    setSelectedDoctorId('');
    setAppointmentDate('');
    setAppointmentTime('');
    setUserMessage('');
    })
    .catch((error)=>{
        setBookingConfirmed(false);
        console.log(error);
    })
  };

  const filteredDoctors = selectedSpecialization
    ? doctorsData.filter(doc => Array.isArray(doc.specialization)
        ? doc.specialization.includes(selectedSpecialization)
        : doc.specialization === selectedSpecialization
      )
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
      <div className="bg-white rounded-xl p-6 md:p-8 lg:p-10 flex flex-col space-y-8">

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
              <svg className="fill-current h-6 w-6 text-green-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 2.65a1.2 1.2 0 1 1-1.697-1.697L8.303 10l-2.651-2.651a1.2 1.2 0 1 1 1.697-1.697L10 8.303l2.651-2.651a1.2 1.2 0 1 1 1.697 1.697L11.697 10l2.651 2.651a1.2 1.2 0 0 1 0 1.698z" /></svg>
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
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
              pattern="[0-9]{10}"
              title="Please enter a 10-digit mobile number"
              required
            />
          </div>
          <div>
            <label htmlFor="userGender" className="block text-lg font-medium text-gray-700 mb-2">Gender:</label>
            <select
              id="userGender"
              value={userGender}
              onChange={(e) => setUserGender(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-lg rounded-md shadow-sm"
              required
            >
              <option value="">-- Select Gender --</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label htmlFor="userAge" className="block text-lg font-medium text-gray-700 mb-2">Age:</label>
            <input
              type="number"
              id="userAge"
              value={userAge}
              onChange={(e) => setUserAge(e.target.value)}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-lg"
              placeholder="e.g., 30"
              min="0"
              max="120"
              required
            />
          </div>

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
                <option key={doc._id} value={doc._id} disabled={!doc.isAvaliable}>
                  {doc.name} {doc.isAvaliable ? '' : '(Not Available)'}
                </option>
              ))}
            </select>
            {selectedDoctorId && !doctorsData.find(doc => doc._id === selectedDoctorId)?.isAvaliable && (
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
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div>
            <label htmlFor="appointmentTime" className="block text-lg font-medium text-gray-700 mb-2">Appointment Time:</label>
            <input
              type="time"
              id="appointmentTime"
              value={appointmentTime}
              onChange={(e) => setAppointmentTime(e.target.value)}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-lg"
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
};


// import React, { useState, useEffect } from 'react';
// import { useLocation } from "react-router-dom";
// import axios from "axios";

// const FormSkeletonLoader = () => (
//   <div className="p-8 bg-gray-100 rounded-lg shadow-md animate-pulse space-y-6">
//     <div className="h-8 bg-gray-200 rounded w-3/4 mb-4 mx-auto"></div> {/* Title */}
//     <div className="space-y-4">
//       <div className="h-10 bg-gray-200 rounded w-full"></div> {/* Input field */}
//       <div className="h-10 bg-gray-200 rounded w-full"></div> {/* Input field */}
//       <div className="h-10 bg-gray-200 rounded w-full"></div> {/* Input field */}
//       <div className="h-10 bg-gray-200 rounded w-full"></div> {/* Input field */}
//       <div className="h-10 bg-gray-200 rounded w-full"></div> {/* Dropdown */}
//       <div className="h-10 bg-gray-200 rounded w-full"></div> {/* Dropdown */}
//       <div className="h-24 bg-gray-200 rounded w-full"></div> {/* Textarea */}
//       <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto"></div> {/* Location */}
//       <div className="h-14 bg-blue-200 rounded-full w-full"></div> {/* Button */}
//     </div>
//   </div>
// );

// export const BookTable = () => {
//   const location = useLocation();
//   const [loading, setLoading] = useState(true);
//   const [doctorsData, setDoctorsData] = useState([]);
//   const [specializationsData, setSpecializationsData] = useState([]);

//   const [userName, setUserName] = useState('');
//   const [userEmail, setUserEmail] = useState('');
//   const [userMobile, setUserMobile] = useState('');
//   const [selectedSpecialization, setSelectedSpecialization] = useState('');
//   const [selectedDoctorId, setSelectedDoctorId] = useState('');
//   const [appointmentDate, setAppointmentDate] = useState('');
//   const [userMessage, setUserMessage] = useState('');
//   const [userLocation, setUserLocation] = useState(null);
//   const [locationLoading, setLocationLoading] = useState(false);
//   const [locationError, setLocationError] = useState('');
//   const [bookingConfirmed, setBookingConfirmed] = useState(false);

//   const urlParams = new URLSearchParams(location.search);
//   const typeUrl = urlParams.get('type');
//   const IdParts = typeUrl?.split("/");
//   const HospitalId = IdParts && IdParts.length > 2 ? IdParts[2] : null;
//   const doctorIdFromUrl = urlParams.get('book');
//   console.log(doctorIdFromUrl, HospitalId);

//   // useEffect(() => {
//   //   const fetchData = async () => {
//   //     setLoading(true); // Start loading

//   //     const url = `${import.meta.env.VITE_SERVER_URL}/api/hospitals/book/${HospitalId}`;
//   //     const requestUrl = doctorIdFromUrl ? `${url}?doctorId=${doctorIdFromUrl}` : url;

//   //     try {
//   //       const response = await axios.get(requestUrl, { withCredentials: true });
//   //       console.log("API Response:", response.data);

//   //       // Assuming your API response structure for doctors is directly in response.data.doctors
//   //       const fetchedDoctors = response.data.doctors || [];
//   //       setDoctorsData(fetchedDoctors);

//   //       const uniqueSpecializations = [...new Set(fetchedDoctors.map(doc => doc.specialization))];
//   //       setSpecializationsData(uniqueSpecializations);
//   //       if (doctorIdFromUrl) {
//   //         const doctor = fetchedDoctors.find(doc => doc._id === doctorIdFromUrl);
//   //         if (doctor && doctor.isAvaliable) {
//   //           setSelectedDoctorId(doctorIdFromUrl);
//   //           doctor?.specialization?.map((item)=>{
//   //             console.log(item);
//   //           setSelectedSpecialization(item);
//   //           })
//   //         } else if (doctor && !doctor.isAvaliable) {
//   //           alert(`The pre-selected doctor, ${doctor.name}, is currently not available for appointments.`);
//   //           setSelectedDoctorId('');
//   //           setSelectedSpecialization('');
//   //         }
//   //       }

//   //     } catch (error) {
//   //       console.error("Error fetching data:", error);
//   //       alert('Failed to load doctor data. Please try again later.');
//   //     } finally {
//   //       setLoading(false); // End loading regardless of success or failure
//   //     }
//   //   };

//   //   fetchData();
//   // }, [HospitalId, doctorIdFromUrl]);
//  useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       const url = `${import.meta.env.VITE_SERVER_URL}/api/hospitals/book/${HospitalId}`;
//       const requestUrl = doctorIdFromUrl ? `${url}?doctorId=${doctorIdFromUrl}` : url;
//       try {
//         const response = await axios.get(requestUrl, { withCredentials: true });
//         console.log("API Response:", response.data);

//         const fetchedDoctors = response.data.doctors || [];
//         setDoctorsData(fetchedDoctors);
//         const allSpecializations = fetchedDoctors.flatMap(doc => {
//             return Array.isArray(doc.specialization) ? doc.specialization : [doc.specialization];
//         }).filter(Boolean);

//         const uniqueSpecializations = [...new Set(allSpecializations)];
//         setSpecializationsData(uniqueSpecializations);
//         if (doctorIdFromUrl) {
//           const doctor = fetchedDoctors.find(doc => doc._id === doctorIdFromUrl);

//           // Corrected: Check `isAvailable` (lowercase 'a')
//           if (doctor && doctor.isAvaliable) { // Assuming 'isAvailable' is the correct property name
//             setSelectedDoctorId(doctorIdFromUrl);

//             // Corrected: Select the first specialization if it's an array
//             if (Array.isArray(doctor.specialization) && doctor.specialization.length > 0) {
//               setSelectedSpecialization(doctor.specialization[0]);
//             } else if (typeof doctor.specialization === 'string') {
//               // Handle case where specialization might still be a single string
//               setSelectedSpecialization(doctor.specialization);
//             }
//           } else if (doctor && !doctor.isAvaliable) {
//             // Corrected: Use `isAvailable` (lowercase 'a')
//             alert(`The pre-selected doctor, ${doctor.name}, is currently not available for appointments.`);
//             setSelectedDoctorId('');
//             setSelectedSpecialization('');
//           } else {
//             alert('The pre-selected doctor specified in the URL was not found.');
//             setSelectedDoctorId('');
//             setSelectedSpecialization('');
//           }
//         }

//       } catch (error) {
//         console.error("Error fetching data:", error);
//         alert('Failed to load doctor data. Please try again later.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [HospitalId, doctorIdFromUrl])
//   // Get user's geolocation
//   useEffect(() => {
//     if (navigator.geolocation) {
//       setLocationLoading(true);
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setUserLocation({
//             latitude: position.coords.latitude,
//             longitude: position.coords.longitude,
//           });
//           setLocationLoading(false);
//         },
//         (error) => {
//           console.error("Geolocation error:", error);
//           setLocationError("Unable to retrieve your location. Please enable location services or enter manually.");
//           setLocationLoading(false);
//         },
//         { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
//       );
//     } else {
//       setLocationError("Geolocation is not supported by your browser.");
//     }
//   }, []);

//   const handleSpecializationChange = (e) => {
//     console.log(e.target.value)
//     setSelectedSpecialization(e.target.value);
//     setSelectedDoctorId(''); // Reset doctor selection when specialization changes
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!userName || !userEmail || !userMobile || !appointmentDate || !selectedSpecialization || !selectedDoctorId) {
//       alert('Please fill in all required fields.'); // Replace with custom modal
//       return;
//     }

//     const selectedDoctor = doctorsData.find(doc => doc._id === selectedDoctorId);
//     if (!selectedDoctor || !selectedDoctor.isAvaliable) {
//       alert('Please select an available doctor.'); // Replace with custom modal
//       return;
//     }

//     const bookingDetails = {
//       userName,
//       userEmail,
//       userMobile,
//       selectedSpecialization,
//       selectedDoctor: selectedDoctor.name,
//       appointmentDate,
//       userMessage,
//       userLocation: userLocation ? `Lat: ${userLocation.latitude}, Lon: ${userLocation.longitude}` : 'Not provided',
//       hospitalId: HospitalId, // Include hospital ID in booking details
//       doctorId: selectedDoctorId, // Include selected doctor ID
//     };

//     console.log('Appointment Booking Details:', bookingDetails);
//     setBookingConfirmed(true);
//     // In a real application, you would send this data to your backend API
//     // e.g., axios.post('/api/book-appointment', bookingDetails, { withCredentials: true });

//     // Reset form fields after successful submission
//     setUserName('');
//     setUserEmail('');
//     setUserMobile('');
//     setSelectedSpecialization('');
//     setSelectedDoctorId('');
//     setAppointmentDate('');
//     setUserMessage('');
//     // Keep location as it is, or reset if desired
//   };

// const filteredDoctors = selectedSpecialization
//   ? doctorsData.filter(doc => doc.specialization.includes(selectedSpecialization))
//   : doctorsData;

//   if (loading) {
//     return (
//       <div className="container mx-auto px-4 py-8 md:py-12 w-full md:w-4/5 xl:w-4/5 font-inter">
//         <FormSkeletonLoader />
//       </div>
//     );
//   }

//   return (
//     <div className="container md:mx-10 md:px-4 py-4 md:py-4 w-full md:w-4/5 xl:w-4/5 font-inter">
//       <div className="bg-white rounded-xl  p-6 md:p-8 lg:p-10 flex flex-col space-y-8">

//         <div className="text-center space-y-4 pb-6 border-b border-blue-100">
//           <h1 className="text-4xl md:text-5xl font-extrabold text-blue-800 tracking-tight">Book Your Appointment</h1>
//           <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
//             Please fill out the form below to schedule your appointment with our expert doctors.
//           </p>
//         </div>

//         {bookingConfirmed && (
//           <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6" role="alert">
//             <strong className="font-bold">Success!</strong>
//             <span className="block sm:inline ml-2">Your appointment request has been submitted. We will contact you shortly.</span>
//             <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setBookingConfirmed(false)}>
//               <svg className="fill-current h-6 w-6 text-green-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 2.65a1.2 1.2 0 1 1-1.697-1.697L8.303 10l-2.651-2.651a1.2 1.2 0 1 1 1.697-1.697L10 8.303l2.651-2.651a1.2 1.2 0 1 1 1.697 1.697L11.697 10l2.651 2.651a1.2 1.2 0 0 1 0 1.698z" /></svg>
//             </span>
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* User Details */}
//           <div>
//             <label htmlFor="userName" className="block text-lg font-medium text-gray-700 mb-2">Your Name:</label>
//             <input
//               type="text"
//               id="userName"
//               value={userName}
//               onChange={(e) => setUserName(e.target.value)}
//               className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-lg"
//               placeholder="Full Name"
//               required
//             />
//           </div>
//           <div>
//             <label htmlFor="userEmail" className="block text-lg font-medium text-gray-700 mb-2">Email:</label>
//             <input
//               type="email"
//               id="userEmail"
//               value={userEmail}
//               onChange={(e) => setUserEmail(e.target.value)}
//               className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-lg"
//               placeholder="your.email@example.com"
//               required
//             />
//           </div>
//           <div>
//             <label htmlFor="userMobile" className="block text-lg font-medium text-gray-700 mb-2">Mobile Number:</label>
//             <input
//               type="tel"
//               id="userMobile"
//               value={userMobile}
//               onChange={(e) => setUserMobile(e.target.value)}
//               className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-lg"
//               placeholder="+91 XXXXXXXXXX"
//               pattern="[0-9]{10}" // Basic pattern for 10 digits
//               title="Please enter a 10-digit mobile number"
//               required
//             />
//           </div>

//           {/* Appointment Details */}
//           <div>
//             <label htmlFor="specialization" className="block text-lg font-medium text-gray-700 mb-2">Select Specialization:</label>
//             <select
//               id="specialization"
//               value={selectedSpecialization}
//               onChange={handleSpecializationChange}
//               className="mt-1 block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-lg rounded-md shadow-sm"
//               required
//             >
//               <option value="">-- Any Specialization --</option>
//               {specializationsData.map((spec, index) => (
//                 <option key={index} value={spec}>{spec}</option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label htmlFor="doctor" className="block text-lg font-medium text-gray-700 mb-2">Select Doctor:</label>
//             <select
//               id="doctor"
//               value={selectedDoctorId}
//               onChange={(e) => setSelectedDoctorId(e.target.value)}
//               className="mt-1 block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-lg rounded-md shadow-sm"
//               required
//             >
//               <option value="">
//                 {selectedSpecialization ? `-- Select a Doctor for ${selectedSpecialization} --` : '-- Select a Doctor --'}
//               </option>
//               {filteredDoctors.map((doc) => (
//                 <option key={doc._id} value={doc._id} disabled={!doc.isAvaliable}>
//                   {doc.name} {doc.isAvaliable ? '' : '(Not Available)'}
//                 </option>
//               ))}
//             </select>
//             {selectedDoctorId && !doctorsData.find(doc => doc._id === selectedDoctorId)?.isAvaliable && (
//               <p className="text-red-600 text-sm mt-2">This doctor is not available for appointments.</p>
//             )}
//           </div>

//           <div>
//             <label htmlFor="appointmentDate" className="block text-lg font-medium text-gray-700 mb-2">Appointment Date:</label>
//             <input
//               type="date"
//               id="appointmentDate"
//               value={appointmentDate}
//               onChange={(e) => setAppointmentDate(e.target.value)}
//               className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-lg"
//               min={new Date().toISOString().split('T')[0]} // Prevent selecting past dates
//               required
//             />
//           </div>

//           <div>
//             <label htmlFor="userMessage" className="block text-lg font-medium text-gray-700 mb-2">Your Message (Optional):</label>
//             <textarea
//               id="userMessage"
//               rows="4"
//               value={userMessage}
//               onChange={(e) => setUserMessage(e.target.value)}
//               className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-lg"
//               placeholder="e.g., Briefly describe your symptoms or reason for visit..."
//             ></textarea>
//           </div>


//           {/* <div className="mt-6">
//             <p className="block text-lg font-medium text-gray-700 mb-2">Your Location:</p>
//             {locationLoading ? (
//               <p className="text-blue-600">Getting your location...</p>
//             ) : userLocation ? (
//               <p className="text-gray-800 font-semibold">
//                 Latitude: {userLocation.latitude.toFixed(4)}, Longitude: {userLocation.longitude.toFixed(4)}
//                 <span className="ml-2 text-green-600 text-sm">(Location detected)</span>
//               </p>
//             ) : (
//               <p className="text-red-600">{locationError || "Location not available. Please allow location access."}</p>
//             )}
//           </div> */}

//           {/* Submit Button */}
//           <div className="text-center pt-4">
//             <button
//               type="submit"
//               className="inline-flex items-center px-10 py-4 border border-transparent text-xl font-semibold rounded-full shadow-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 transition duration-300 ease-in-out transform hover:-translate-y-1"
//             >
//               Confirm Booking
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }