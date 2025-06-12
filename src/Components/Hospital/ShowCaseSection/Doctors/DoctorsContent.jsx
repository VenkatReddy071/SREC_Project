import React, { useState, useEffect } from 'react';
import axios from "axios"
import {useLocation,Link} from "react-router-dom"


// const DoctorCard = ({ doctor, isSelected, onSelect }) => (
//   <div
//     className={`bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center cursor-pointer
//       transform hover:scale-105 transition-transform duration-300 border-2
//       ${isSelected ? 'border-blue-500 ring-4 ring-blue-200' : 'border-gray-100'}`}
//     onClick={() => onSelect(doctor.id)}
//   >
//     <img
//       src={doctor.image}
//       alt={doctor.name}
//       className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-blue-100"
//       loading="lazy"
//     />
//     <h3 className="text-xl font-semibold text-gray-800 mb-1">{doctor.name}</h3>
//     <p className="text-blue-600 font-medium mb-1">{doctor.specialization}</p>
//     {doctor.qualifications && (
//       <p className="text-gray-600 text-sm mb-1">{doctor.qualifications}</p>
//     )}
//     <p className="text-gray-600 text-sm">{doctor.experience} Years Experience</p>
//     <div className={`mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
//       doctor.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
//     }`}>
//       {doctor.isAvailable ? 'Available' : 'Not Available'}
//     </div>
//     {isSelected && doctor.isAvailable && (
//       <a
//         href={`/book-appointment?doctorId=${doctor.id}`}
//         className="mt-4 px-6 py-2 bg-blue-600 text-white text-base font-semibold rounded-full shadow-lg
//                    hover:bg-blue-700 transition duration-300 ease-in-out transform hover:-translate-y-0.5
//                    focus:outline-none focus:ring-2 focus:ring-blue-300"
//         onClick={(e) => e.stopPropagation()}
//       >
//         Book Appointment
//       </a>
//     )}
//   </div>
// );
const DoctorCard = ({ doctor, isSelected, onSelect,Id }) => {

const imageUrl = doctor.image || `https://placehold.co/400x240/E0F2F7/000000?text=${doctor.name.split(' ').map(n => n[0]).join('')}`;
const service1=Id[1];
const service2=Id[2];
  return (
    <div
      className={`
        bg-white rounded-xl  overflow-hidden flex flex-col items-center text-center cursor-pointer
        transform hover:scale-105 transition-transform duration-300
        ${isSelected ? 'border-4 border-blue-500 ring-4 ring-blue-200' : 'border border-gray-200'}
        relative
      `}
      onClick={() => onSelect(doctor._id)}
    >
      <img
        src={imageUrl}
        alt={doctor.name}
        className="w-full h-40 object-cover  rounded-t-xl object-top"
        loading="lazy"
        onError={(e) => {
          e.target.onerror = null
          e.target.src = `https://placehold.co/400x240/E0F2F7/000000?text=${doctor.name.split(' ').map(n => n[0]).join('')}`;
        }}
      />
      <div className="p-4 w-full flex flex-col items-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-1 leading-tight">{doctor.name}</h3>
        <p className="text-blue-700 font-semibold text-lg mb-2">{doctor.specialization.join(', ')}</p> {/* Join specializations */}

        {doctor?.degree && (
          <p className="text-gray-600 text-sm mb-1">{doctor.degree}</p>
        )}
        <p className="text-gray-700 text-base font-medium">{doctor.experience} Years Experience</p>

        <div className={`mt-3 px-4 py-1.5 rounded-full text-sm font-bold tracking-wide
          ${doctor.isAvaliable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
        `}>
          {doctor.isAvaliable ? 'Available' : 'Not Available'}
        </div>

  
        {isSelected && doctor.isAvaliable && (
          <Link to={`?type=hospital/${service1}/${service2}/Book Appointment/doctor&book=${doctor?._id}`}>
          <button
            className="mt-6 px-8 py-3 bg-blue-600 text-white text-lg font-bold rounded-full shadow-xl
                       hover:bg-blue-700 transition duration-300 ease-in-out transform hover:-translate-y-1
                       focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-75"
            onClick={(e) => e.stopPropagation()} // Prevent card selection when clicking button
          >
            Book Appointment
          </button>
          </Link>
        )}
      </div>
    </div>
  );
};
const SkeletonDoctorCard = () => (
  <div className="bg-gray-100 p-6 rounded-lg shadow-sm flex flex-col items-center text-center h-64 animate-pulse">
    <div className="w-32 h-32 rounded-full bg-gray-200 mb-4"></div>
    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2 mb-1"></div>
    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
  </div>
);

function DoctorsContent() {
  const [loading, setLoading] = useState(true);
  const [doctorsData, setDoctorsData] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null); // Stores ID of the single selected doctor for the button

const location=useLocation();
  const url=new URLSearchParams(location.search);
  const typeUrl=url.get('type');
  console.log(typeUrl?.split("/"))
  const Id=typeUrl?.split("/");
  const HospitalId=Id[2];
  useEffect(() => {
    const fetchDoctors = async () => {
      const url=`${import.meta.env.VITE_SERVER_URL}/api/doctor/${HospitalId}`
      axios.get(url,{withCredentials:true})
      .then((response)=>{
          setDoctorsData(response.data);
          setLoading(false);
      })
      .catch((error)=>{
        alert("error fetching doctors..");
      })
    
    
    };

    fetchDoctors();
  }, []);

  const handleDoctorSelect = (id) => {
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
                key={doctor?._id}
                doctor={doctor}
                isSelected={selectedDoctorId === doctor?._id} // Check against single selected ID
                onSelect={()=>handleDoctorSelect(doctor?._id)}
                Id={Id}
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
