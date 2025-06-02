// // import React, { useState } from 'react';
// // import HeaderImg from '../../../assets/Header.jpg';
// // import { MapPinIcon, HeartIcon } from '@heroicons/react/24/outline';
// // import { FaStethoscope } from 'react-icons/fa';
// // import {Link} from "react-router-dom"
// // export const HospitalsSection = () => {
// //   const list = ['Hospitals', 'Articles', 'Patient Stories'];
// //   const hospitals = [
// //     {
// //       id: 1,
// //       name: 'Apollo Hospitals',
// //       location: 'Chennai, India',
// //       specialty: ['Cardiology', 'Neurology', 'Orthopedics'],
// //       info: 'Apollo Hospitals is a leading multi-specialty hospital known for advanced treatments and world-class healthcare.',
// //       image: 'https://source.unsplash.com/400x250/?hospital',
// //       offers: 'Free first consultation for new patients!',
// //       doctors: [
// //         { name: 'Dr. Rajesh Kumar', specialization: 'Cardiologist', experience: '15 years' },
// //         { name: 'Dr. Meena Gupta', specialization: 'Neurologist', experience: '12 years' },
// //         { name: 'Dr. Arvind Rao', specialization: 'Orthopedic Surgeon', experience: '10 years' },
// //       ],
// //     },
// //     {
// //       id: 2,
// //       name: 'Fortis Hospital',
// //       location: 'Delhi, India',
// //       specialty: ['Oncology', 'Gastroenterology', 'Pulmonology'],
// //       info: 'Fortis Hospital provides comprehensive medical care with state-of-the-art technology and expert doctors.',
// //       image: 'https://source.unsplash.com/400x250/?medical',
// //       offers: '10% discount on health check-ups',
// //       doctors: [
// //         { name: 'Dr. Sunita Sharma', specialization: 'Oncologist', experience: '18 years' },
// //         { name: 'Dr. Vikram Sinha', specialization: 'Gastroenterologist', experience: '14 years' },
// //         { name: 'Dr. Neha Kapoor', specialization: 'Pulmonologist', experience: '10 years' },
// //       ],
// //     },
// //     {
// //       id: 3,
// //       name: 'Medanta Hospital',
// //       location: 'Gurgaon, India',
// //       specialty: ['Cardiology', 'Nephrology', 'Urology'],
// //       info: 'Medanta Hospital specializes in heart, kidney, and urological treatments with advanced medical technology.',
// //       image: 'https://source.unsplash.com/400x250/?doctor',
// //       offers: 'Special discount on kidney transplant consultation',
// //       doctors: [
// //         { name: 'Dr. Anil Malhotra', specialization: 'Cardiologist', experience: '16 years' },
// //         { name: 'Dr. Ramesh Verma', specialization: 'Nephrologist', experience: '13 years' },
// //         { name: 'Dr. Sangeeta Patel', specialization: 'Urologist', experience: '10 years' },
// //       ],
// //     },
// //     {
// //       id: 4,
// //       name: 'Max Super Specialty Hospital',
// //       location: 'Mumbai, India',
// //       specialty: ['Dermatology', 'ENT', 'Pediatrics'],
// //       info: 'Max Super Specialty Hospital offers the best pediatric care and ENT treatments with specialized dermatologists.',
// //       image: 'https://source.unsplash.com/400x250/?clinic',
// //       offers: '20% off on skin treatment packages',
// //       doctors: [
// //         { name: 'Dr. Priya Kaur', specialization: 'Dermatologist', experience: '11 years' },
// //         { name: 'Dr. Rajeev Shah', specialization: 'ENT Specialist', experience: '14 years' },
// //         { name: 'Dr. Monica Ahuja', specialization: 'Pediatrician', experience: '9 years' },
// //       ],
// //     },
// //     {
// //       id: 5,
// //       name: 'Narayana Health',
// //       location: 'Bangalore, India',
// //       specialty: ['Cardiac Surgery', 'Neurology', 'Diabetology'],
// //       info: 'Narayana Health is a leader in heart surgeries and diabetes care with world-class neurology experts.',
// //       image: 'https://source.unsplash.com/400x250/?healthcare',
// //       offers: '50% off on diabetes screening',
// //       doctors: [
// //         { name: 'Dr. Sudhir Agarwal', specialization: 'Cardiac Surgeon', experience: '20 years' },
// //         { name: 'Dr. Ritu Sharma', specialization: 'Neurologist', experience: '15 years' },
// //         { name: 'Dr. Ashok Mehta', specialization: 'Diabetologist', experience: '12 years' },
// //       ],
// //     },
// //     {
// //       id: 6,
// //       name: 'AIIMS Delhi',
// //       location: 'Delhi, India',
// //       specialty: ['General Medicine', 'Pulmonology', 'Oncology'],
// //       info: 'AIIMS Delhi is the most prestigious hospital in India offering multi-disciplinary healthcare services.',
// //       image: 'https://source.unsplash.com/400x250/?surgery',
// //       offers: 'Government-supported free medical consultation',
// //       doctors: [
// //         { name: 'Dr. Rajan Singh', specialization: 'General Physician', experience: '18 years' },
// //         { name: 'Dr. Kavita Bansal', specialization: 'Pulmonologist', experience: '10 years' },
// //         { name: 'Dr. Manish Kapoor', specialization: 'Oncologist', experience: '16 years' },
// //       ],
// //     },
// //     {
// //       id: 7,
// //       name: 'Manipal Hospitals',
// //       location: 'Hyderabad, India',
// //       specialty: ['Neurosurgery', 'Cardiology', 'Gastroenterology'],
// //       info: 'Manipal Hospitals provide expert neurosurgical care and advanced cardiac treatments.',
// //       image: 'https://source.unsplash.com/400x250/?medicalcare',
// //       offers: 'Free cardiac check-up for first-time patients',
// //       doctors: [
// //         { name: 'Dr. Surya Narayan', specialization: 'Neurosurgeon', experience: '14 years' },
// //         { name: 'Dr. Ashwini Nair', specialization: 'Cardiologist', experience: '17 years' },
// //         { name: 'Dr. Ravi Kumar', specialization: 'Gastroenterologist', experience: '12 years' },
// //       ],
// //     },
// //     {
// //       id: 8,
// //       name: 'Kokilaben Dhirubhai Ambani Hospital',
// //       location: 'Mumbai, India',
// //       specialty: ['Plastic Surgery', 'Dermatology', 'Psychiatry'],
// //       info: 'A world-renowned hospital specializing in aesthetic surgeries, dermatological treatments, and mental health care.',
// //       image: 'https://source.unsplash.com/400x250/?surgeon',
// //       offers: '30% off on cosmetic surgery consultations',
// //       doctors: [
// //         { name: 'Dr. Sanjay Menon', specialization: 'Plastic Surgeon', experience: '22 years' },
// //         { name: 'Dr. Rachna Gupta', specialization: 'Dermatologist', experience: '11 years' },
// //         { name: 'Dr. Sameer Khan', specialization: 'Psychiatrist', experience: '14 years' },
// //       ],
// //     },
// //     {
// //       id: 9,
// //       name: 'Sri Ramachandra Medical Center',
// //       location: 'Chennai, India',
// //       specialty: ['Pulmonology', 'Neonatology', 'Endocrinology'],
// //       info: 'Sri Ramachandra Medical Center is a top-tier hospital offering pulmonology, neonatal, and endocrine care.',
// //       image: 'https://source.unsplash.com/400x250/?patient',
// //       offers: '10% off on senior citizen health check-ups',
// //       doctors: [
// //         { name: 'Dr. Lakshmi Narayan', specialization: 'Pulmonologist', experience: '19 years' },
// //         { name: 'Dr. Anita Rao', specialization: 'Neonatologist', experience: '12 years' },
// //         { name: 'Dr. Vishal Desai', specialization: 'Endocrinologist', experience: '15 years' },
// //       ],
// //     },
// //     {
// //       id: 10,
// //       name: 'Global Hospitals',
// //       location: 'Pune, India',
// //       specialty: ['Orthopedics', 'Nephrology', 'Rheumatology'],
// //       info: 'Global Hospitals specializes in joint replacements, kidney transplants, and autoimmune disease treatments.',
// //       image: 'https://source.unsplash.com/400x250/?doctorcare',
// //       offers: 'Discount on knee replacement surgery',
// //       doctors: [
// //         { name: 'Dr. Ajay Sharma', specialization: 'Orthopedic Surgeon', experience: '18 years' },
// //         { name: 'Dr. Smita Nair', specialization: 'Nephrologist', experience: '14 years' },
// //         { name: 'Dr. Rohan Mehta', specialization: 'Rheumatologist', experience: '10 years' },
// //       ],
// //     },
// //   ];

// //   const [activeIndex, setActiveIndex] = useState(0);

// //   return (
// //     <div className="bg-gray-50 py-10">
// //       <div className="container mx-auto px-4">
// //         <h2 className="text-base font-semibold text-blue-500 text-center mb-2">View list of Hospitals</h2>
// //         <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl text-center text-gray-900 mb-4">
// //           Explore Our Hospital Services
// //         </h1>
// //         <h2 className="text-lg text-gray-600 text-center mb-8">Stay updated with our expert health articles</h2>

// //         {/* Sticky Navigation */}
// //         <div className="sticky top-0 bg-white z-10 shadow-md rounded-md">
// //           <div className="flex justify-center gap-4 py-3">
// //             {list.map((item, index) => (
// //               <button
// //                 key={index}
// //                 className={`px-4 py-2 text-center cursor-pointer font-semibold text-gray-700 hover:text-blue-600 focus:outline-none ${
// //                   activeIndex === index ? 'border-b-2 border-blue-500 text-blue-600' : ''
// //                 }`}
// //                 onClick={() => setActiveIndex(index)}
// //               >
// //                 {item}
// //               </button>
// //             ))}
// //           </div>
// //         </div>

// //         {/* Content Below */}
// //         <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
// //           {hospitals.map((item, index) => (
// //             <Link to={`/showcase/page?type=hospital/${item.name}`}>
// //             <div
// //               className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
// //               key={index}
// //             >
// //               <img
// //                 src={item.image || HeaderImg}
// //                 alt={item.name}
// //                 className="w-full h-48 object-cover"
// //               />
// //               <div className="p-4">
// //                 <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.name}</h3>
// //                 <p className="text-gray-600 text-sm flex items-center mb-2">
// //                   <MapPinIcon className="h-4 w-4 mr-1 text-gray-500" />
// //                   {item.location}
// //                 </p>
// //                 <div className="flex flex-wrap gap-2 mb-2">
// //                   {item.specialty.map((specialty, idx) => (
// //                     <span
// //                       key={idx}
// //                       className="inline-block bg-blue-100 text-blue-600 py-1 px-2 rounded-full text-xs font-semibold"
// //                     >
// //                       {specialty}
// //                     </span>
// //                   ))}
// //                 </div>
// //                 <p className="text-gray-700 text-sm mb-3 line-clamp-2">{item.info}</p>
// //                 <div className="flex items-center justify-between mt-2">
// //                   <button className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline">
// //                     View Details
// //                   </button>
// //                   <button className="text-gray-500 hover:text-red-500 focus:outline-none">
// //                     <HeartIcon className="h-6 w-6" />
// //                   </button>
// //                 </div>
// //                 {item.offers && (
// //                   <div className="mt-3 text-sm text-green-600 font-semibold flex items-center">
// //                     <FaStethoscope className="mr-2" /> 🎉 {item.offers}
// //                   </div>
// //                 )}
// //               </div>
// //             </div>
// //             </Link>
// //           ))}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import HeaderImg from '../../../assets/Header.jpg';
// import { MapPinIcon, HeartIcon } from '@heroicons/react/24/outline';
// import { FaStethoscope } from 'react-icons/fa';
// import { Link } from "react-router-dom";

// export const HospitalsSection = () => {
//   const list = ['Hospitals', 'Articles', 'Patient Stories'];
//   const [activeIndex, setActiveIndex] = useState(0);

//   const [hospitals, setHospitals] = useState([]);
//   const [page, setPage] = useState(1);
//   const [isLoading, setIsLoading] = useState(false);
//   const [hasMore, setHasMore] = useState(true);
//   const scrollContainerRef = useRef(null);

//   const fetchHospitals = async () => {
//     if (isLoading || !hasMore) {
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const url=`${import.meta.env.VITE_SERVER_URL}`
//       const response = await axios.get(`${url}/api/hospitals/all`, {
//         params: {
//           page: page,
//           limit: 15
//         },
//       },
//       {withCredentials:true});
//       const data = response.data;

//       if (data.hospitals && Array.isArray(data.hospitals) && data.hospitals.length > 0) {
//         setHospitals(prevHospitals => [...prevHospitals, ...data.hospitals]);
//         setPage(prevPage => prevPage + 1);
//       } else {
//         setHasMore(false);
//       }
//       if (typeof data.hasMore === 'boolean') {
//         setHasMore(data.hasMore);
//       }

//     } catch (error) {
//       console.error("Error fetching hospitals:", error);
//       setHasMore(false);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (activeIndex === 0) {
//       setHospitals([]);
//       setPage(1);
//       setHasMore(true);
//       fetchHospitals();
//     }
//   }, [activeIndex]);

//   useEffect(() => {
//     const handleScroll = () => {
//       if (scrollContainerRef.current) {
//         const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;

//         if (scrollTop + clientHeight >= scrollHeight - 200 && hasMore && !isLoading && activeIndex === 0) {
//           fetchHospitals();
//         }
//       }
//     };

//     const currentContainer = scrollContainerRef.current;
//     if (currentContainer) {
//       currentContainer.addEventListener('scroll', handleScroll);
//     }

//     return () => {
//       if (currentContainer) {
//         currentContainer.removeEventListener('scroll', handleScroll);
//       }
//     };
//   }, [isLoading, hasMore, activeIndex]);

//   const renderContent = () => {
//     switch (activeIndex) {
//       case 0:
//         return (
//           <>
//             <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//               {hospitals.map((item) => (
//                 <Link to={`/showcase/page?type=hospital/${item.name}/${item._id}`} key={item._id || item.id}>
//                   <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
//                     <img
//                       src={item.image || HeaderImg}
//                       alt={item.name}
//                       className="w-full h-48 object-cover"
//                       loading="lazy"
//                     />
//                     <div className="p-4">
//                       <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.name}</h3>
//                       <p className="text-gray-600 text-sm flex items-center mb-2">
//                         <MapPinIcon className="h-4 w-4 mr-1 text-gray-500" />
//                         {item.location}
//                       </p>
//                       <div className="flex flex-wrap gap-2 mb-2">
//                         {item.specialty && item.specialty.map((specialty, idx) => (
//                           <span
//                             key={idx}
//                             className="inline-block bg-blue-100 text-blue-600 py-1 px-2 rounded-full text-xs font-semibold"
//                           >
//                             {specialty}
//                           </span>
//                         ))}
//                       </div>
//                       <p className="text-gray-700 text-sm mb-3 line-clamp-2">{item.info}</p>
//                       <div className="flex items-center justify-between mt-2">
//                         <button className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline">
//                           View Details
//                         </button>
//                         <button className="text-gray-500 hover:text-red-500 focus:outline-none">
//                           <HeartIcon className="h-6 w-6" />
//                         </button>
//                       </div>
//                       {item.offers && (
//                         <div className="mt-3 text-sm text-green-600 font-semibold flex items-center">
//                           <FaStethoscope className="mr-2" /> 🎉 {item.offers}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </Link>
//               ))}
//             </div>

//             {isLoading && (
//               <p className="text-center py-4 text-blue-600">Loading more hospitals...</p>
//             )}
//             {!hasMore && hospitals.length > 0 && (
//               <p className="text-center py-4 text-gray-500">You've reached the end of the hospital list.</p>
//             )}
//             {!isLoading && hospitals.length === 0 && !hasMore && page === 1 && (
//               <p className="text-center py-4 text-gray-500">No hospitals found.</p>
//             )}
//           </>
//         );
//       case 1:
//         return <div className="mt-8 text-center text-gray-600">Articles content will go here.</div>;
//       case 2:
//         return <div className="mt-8 text-center text-gray-600">Patient Stories content will go here.</div>;
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="bg-gray-50 py-10">
//       <div className="container mx-auto px-4">
//         <h2 className="text-base font-semibold text-blue-500 text-center mb-2">View list of Hospitals</h2>
//         <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl text-center text-gray-900 mb-4">
//           Explore Our Hospital Services
//         </h1>
//         <h2 className="text-lg text-gray-600 text-center mb-8">Stay updated with our expert health articles</h2>

//         <div className="sticky top-0 bg-white z-10 shadow-md rounded-md">
//           <div className="flex justify-center gap-4 py-3">
//             {list.map((item, index) => (
//               <button
//                 key={index}
//                 className={`px-4 py-2 text-center cursor-pointer font-semibold text-gray-700 hover:text-blue-600 focus:outline-none ${
//                   activeIndex === index ? 'border-b-2 border-blue-500 text-blue-600' : ''
//                 }`}
//                 onClick={() => setActiveIndex(index)}
//               >
//                 {item}
//               </button>
//             ))}
//           </div>
//         </div>

//         <div
//           ref={scrollContainerRef}
//           style={{
//             maxHeight: '800px',
//             overflowY: 'auto',
//             marginTop: '2rem',
//             paddingRight: '15px'
//           }}
//           className="relative"
//         >
//           {renderContent()}
//         </div>
//       </div>
//     </div>
//   );
// };

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import HeaderImg from '../../../assets/Header.jpg';
import { MapPinIcon, HeartIcon, PlusCircleIcon, MinusCircleIcon } from '@heroicons/react/24/outline'; // Import PlusCircleIcon and MinusCircleIcon
import { FaStethoscope } from 'react-icons/fa';
import { Link } from "react-router-dom";

// SkeletonCard component remains the same
const SkeletonCard = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
    <div className="w-full h-48 bg-gray-300"></div>
    <div className="p-4">
      <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
      <div className="flex flex-wrap gap-2 mb-2">
        <div className="h-6 bg-gray-300 rounded-full w-20"></div>
        <div className="h-6 bg-gray-300 rounded-full w-24"></div>
      </div>
      <div className="h-4 bg-gray-300 rounded w-full mb-3"></div>
      <div className="h-4 bg-gray-300 rounded w-5/6 mb-3"></div>
      <div className="flex items-center justify-between mt-2">
        <div className="h-10 bg-blue-300 rounded-full w-28"></div>
        <div className="h-8 bg-gray-300 rounded-full w-8"></div>
      </div>
      <div className="mt-3 h-4 bg-green-300 rounded w-1/3"></div>
    </div>
  </div>
);

export const HospitalsSection = () => {
  const list = ['Hospitals', 'Articles', 'Patient Stories'];
  const [activeIndex, setActiveIndex] = useState(0);

  const [hospitals, setHospitals] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const scrollContainerRef = useRef(null);

  // State to manage which hospital's specialties are expanded
  // Use a Set for efficient lookups of IDs
  const [expandedSpecialties, setExpandedSpecialties] = useState(new Set());

  const toggleSpecialties = (hospitalId) => {
    setExpandedSpecialties(prev => {
      const newSet = new Set(prev);
      if (newSet.has(hospitalId)) {
        newSet.delete(hospitalId);
      } else {
        newSet.add(hospitalId);
      }
      return newSet;
    });
  };

  const fetchHospitals = async () => {
    if (isLoading || !hasMore) {
      return;
    }

    setIsLoading(true);
    try {
      const url = `${import.meta.env.VITE_SERVER_URL}`;
      const response = await axios.get(`${url}/api/hospitals/all`, {
        params: {
          page: page,
          limit: 15
        },
      });

      const data = response.data;

      if (data.hospitals && Array.isArray(data.hospitals) && data.hospitals.length > 0) {
        setHospitals(prevHospitals => [...prevHospitals, ...data.hospitals]);
        setPage(prevPage => prevPage + 1);
      } else {
        setHasMore(false);
      }
      if (typeof data.hasMore === 'boolean') {
        setHasMore(data.hasMore);
      }

    } catch (error) {
      console.error("Error fetching hospitals:", error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
      if (isInitialLoading) {
        setIsInitialLoading(false);
      }
    }
  };

  useEffect(() => {
    if (activeIndex === 0) {
      setHospitals([]);
      setPage(1);
      setHasMore(true);
      setIsInitialLoading(true);
      setExpandedSpecialties(new Set()); // Reset expanded state when tab changes
      fetchHospitals();
    }
  }, [activeIndex]);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;

        if (scrollTop + clientHeight >= scrollHeight - 200 && hasMore && !isLoading && activeIndex === 0) {
          fetchHospitals();
        }
      }
    };

    const currentContainer = scrollContainerRef.current;
    if (currentContainer) {
      currentContainer.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (currentContainer) {
        currentContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, [isLoading, hasMore, activeIndex]);

  const renderContent = () => {
    switch (activeIndex) {
      case 0:
        return (
          <>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {isInitialLoading ? (
                Array.from({ length: 9 }).map((_, index) => <SkeletonCard key={index} />)
              ) : (
                hospitals.map((item) => {
                  const hospitalId = item._id || item.id; // Use MongoDB _id or fallback to id
                  const isExpanded = expandedSpecialties?.has(hospitalId);
                  const specialtiesToDisplay = isExpanded ? item.specialization: item.specialization?.slice(0, 2);
                  const hasMoreSpecialties = item?.specialization?.length > 2;

                  return (
                    <Link to={`/showcase/page?type=hospital/${item.name}/${hospitalId}`} key={hospitalId}>
                      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                        <img
                          src={item.image || HeaderImg}
                          alt={item.name}
                          className="w-full h-48 object-cover"
                          loading="lazy"
                        />
                        <div className="p-4">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.name}</h3>
                          <p className="text-gray-600 text-sm flex items-center mb-2">
                            <MapPinIcon className="h-4 w-4 mr-1 text-gray-500" />
                            {item.locationName}
                          </p>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {item.specialization && specialtiesToDisplay.map((specialty, idx) => (
                              <span
                                key={idx}
                                className="inline-block bg-blue-100 text-blue-600 py-1 px-2 rounded-full text-xs font-semibold"
                              >
                                {specialty}
                              </span>
                            ))}
                            {hasMoreSpecialties && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault(); // Prevent Link navigation
                                  toggleSpecialties(hospitalId);
                                }}
                                className="inline-block text-blue-600 text-sm font-semibold flex items-center px-2 py-1 rounded-full hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                              >
                                {isExpanded ? (
                                  <>
                                    <MinusCircleIcon className="h-4 w-4 mr-1" /> Show Less
                                  </>
                                ) : (
                                  <>
                                    <PlusCircleIcon className="h-4 w-4 mr-1" /> Show More
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                          <p className="text-gray-700 text-sm mb-3 line-clamp-2">{item.info}</p>
                          <div className="flex items-center justify-between mt-2">
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline">
                              View Details
                            </button>
                            <button className="text-gray-500 hover:text-red-500 focus:outline-none">
                              <HeartIcon className="h-6 w-6" />
                            </button>
                          </div>
                          {item.offers && (
                            <div className="mt-3 text-sm text-green-600 font-semibold flex items-center">
                              <FaStethoscope className="mr-2" /> 🎉 {item.offers}
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>

            {isLoading && !isInitialLoading && (
              <p className="text-center py-4 text-blue-600">Loading more hospitals...</p>
            )}
            {!hasMore && hospitals.length > 0 && (
              <p className="text-center py-4 text-gray-500">You've reached the end of the hospital list.</p>
            )}
            {!isLoading && !isInitialLoading && hospitals.length === 0 && !hasMore && page === 1 && (
              <p className="text-center py-4 text-gray-500">No hospitals found.</p>
            )}
          </>
        );
      case 1:
        return <div className="mt-8 text-center text-gray-600">Articles content will go here.</div>;
      case 2:
        return <div className="mt-8 text-center text-gray-600">Patient Stories content will go here.</div>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 py-10">
      <div className="container mx-auto px-4">
        <h2 className="text-base font-semibold text-blue-500 text-center mb-2">View list of Hospitals</h2>
        <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl text-center text-gray-900 mb-4">
          Explore Our Hospital Services
        </h1>
        <h2 className="text-lg text-gray-600 text-center mb-8">Stay updated with our expert health articles</h2>

        <div className="sticky top-0 bg-white z-10 shadow-md rounded-md">
          <div className="flex justify-center gap-4 py-3">
            {list.map((item, index) => (
              <button
                key={index}
                className={`px-4 py-2 text-center cursor-pointer font-semibold text-gray-700 hover:text-blue-600 focus:outline-none ${
                  activeIndex === index ? 'border-b-2 border-blue-500 text-blue-600' : ''
                }`}
                onClick={() => setActiveIndex(index)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          style={{
            maxHeight: '800px',
            overflowY: 'auto',
            marginTop: '2rem',
            paddingRight: '15px'
          }}
          className="relative"
        >
          {renderContent()}
        </div>
      </div>
    </div>
  );
};
