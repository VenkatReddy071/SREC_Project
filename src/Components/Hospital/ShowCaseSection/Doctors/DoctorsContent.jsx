import React, { useState, useEffect } from 'react';

// DoctorCard component for individual doctor display
const DoctorCard = ({ doctor, isSelected, onSelect }) => (
  <div
    className={`bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center cursor-pointer
      transform hover:scale-105 transition-transform duration-300 border-2
      ${isSelected ? 'border-blue-500 ring-4 ring-blue-200' : 'border-gray-100'}`}
    onClick={() => onSelect(doctor.id)} // Toggles selection for visual feedback
  >
    <img
      src={doctor.image}
      alt={doctor.name}
      className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-blue-100" // No shadow on image
      loading="lazy" // Lazy loading for doctor images
    />
    <h3 className="text-xl font-semibold text-gray-800 mb-1">{doctor.name}</h3>
    <p className="text-blue-600 font-medium mb-1">{doctor.specialization}</p>
    {/* Display Qualifications */}
    {doctor.qualifications && (
      <p className="text-gray-600 text-sm mb-1">{doctor.qualifications}</p>
    )}
    <p className="text-gray-600 text-sm">{doctor.experience} Years Experience</p>

    {/* Availability Status */}
    <div className={`mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
      doctor.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
    }`}>
      {doctor.isAvailable ? 'Available' : 'Not Available'}
    </div>

    {/* Book Appointment button - shown only if selected AND available */}
    {isSelected && doctor.isAvailable && (
      <a
        href={`/book-appointment?doctorId=${doctor.id}`}
        className="mt-4 px-6 py-2 bg-blue-600 text-white text-base font-semibold rounded-full shadow-lg
                   hover:bg-blue-700 transition duration-300 ease-in-out transform hover:-translate-y-0.5
                   focus:outline-none focus:ring-2 focus:ring-blue-300"
        onClick={(e) => e.stopPropagation()} // Prevent card deselection when clicking button
      >
        Book Appointment
      </a>
    )}
  </div>
);

// SkeletonDoctorCard for loading state
const SkeletonDoctorCard = () => (
  <div className="bg-gray-100 p-6 rounded-lg shadow-sm flex flex-col items-center text-center h-64 animate-pulse">
    <div className="w-32 h-32 rounded-full bg-gray-200 mb-4"></div>
    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2 mb-1"></div>
    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
  </div>
);

// DoctorsPage component (renamed from DoctorsContent for clarity as it's a full page)
function DoctorsContent() {
  const [loading, setLoading] = useState(true);
  const [doctorsData, setDoctorsData] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null); // Stores ID of the single selected doctor for the button

  useEffect(() => {
    const fetchDoctors = async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5 second delay

      // Mock doctors data with availability and qualifications
      const data = [
        { id: 'doc1', name: 'Dr. Preethi. P', specialization: 'ENT Head and Neck Surgery', qualifications: 'M.B.B.S., D.L.O., D.N.B (ENT)', experience: 15, image: 'https://placehold.co/128x128/a7c9f7/0056b3?text=PP', isAvailable: true },
        { id: 'doc2', name: 'Dr. Priya Philip', specialization: 'Radiation Oncology', qualifications: 'M.B.B.S., D.M.R.T., D.N.B (Radiation Oncology), CCEPC', experience: 10, image: 'https://placehold.co/128x128/a7c9f7/0056b3?text=PP', isAvailable: true },
        { id: 'doc3', name: 'Dr. Rupini. S', specialization: 'Radiology', qualifications: 'MDRD from BIR, MMC', experience: 8, image: 'https://placehold.co/128x128/a7c9f7/0056b3?text=RS', isAvailable: false }, // Not available
        { id: 'doc4', name: 'Dr. Anya Sharma', specialization: 'Cardiologist', qualifications: 'MD, DM (Cardiology)', experience: 20, image: 'https://placehold.co/128x128/a7c9f7/0056b3?text=AS', isAvailable: true },
        { id: 'doc5', name: 'Dr. Rohan Patel', specialization: 'Orthopedic Surgeon', qualifications: 'MS (Ortho), DNB (Ortho)', experience: 12, image: 'https://placehold.co/128x128/a7c9f7/0056b3?text=RP', isAvailable: true },
        { id: 'doc6', name: 'Dr. Sana Khan', specialization: 'Dermatologist', qualifications: 'MD (Derm), DNB (Derm)', experience: 18, image: 'https://placehold.co/128x128/a7c9f7/0056b3?text=SK', isAvailable: false }, // Not available
        { id: 'doc7', name: 'Dr. Arjun Mehta', specialization: 'General Surgeon', qualifications: 'MS (Gen. Surg), FMAS', experience: 14, image: 'https://placehold.co/128x128/a7c9f7/0056b3?text=AM', isAvailable: true },
        { id: 'doc8', name: 'Dr. Neha Gupta', specialization: 'Oncologist', qualifications: 'MD, DM (Oncology)', experience: 11, image: 'https://placehold.co/128x128/a7c9f7/0056b3?text=NG', isAvailable: true },
        { id: 'doc9', name: 'Dr. Sameer Verma', specialization: 'Urologist', qualifications: 'MS (Urology), MCh (Urology)', experience: 16, image: 'https://placehold.co/128x128/a7c9f7/0056b3?text=SV', isAvailable: true },
      ];
      setDoctorsData(data);
      setLoading(false);
    };

    fetchDoctors();
  }, []);

  const handleDoctorSelect = (id) => {
    // If the same doctor is clicked, deselect them. Otherwise, select the new doctor.
    setSelectedDoctorId(prevSelectedId => (prevSelectedId === id ? null : id));
  };

  return (
    <div className="container px-4  md:py-12 w-full md:w-4/5 xl:w-4/5 font-inter">
      <div className="bg-white rounded-xl  p-6 md:p-8 lg:p-10 flex flex-col space-y-10">
        <div className="text-center space-y-4 pb-6 border-b border-blue-100">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-800 tracking-tight">Meet Our Expert Doctors</h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Our team comprises highly skilled and compassionate medical professionals dedicated to providing you with the best care.
          </p>
          <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
            Click on a doctor's card to view their details and book an appointment.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 9 }).map((_, index) => (
              <SkeletonDoctorCard key={index} />
            ))
          ) : (
            doctorsData.map((doctor) => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                isSelected={selectedDoctorId === doctor.id} // Check against single selected ID
                onSelect={handleDoctorSelect}
              />
            ))
          )}
        </div>

        {/* Removed the global "Book Appointment" button */}
      </div>
    </div>
  );
}

export default DoctorsContent;
