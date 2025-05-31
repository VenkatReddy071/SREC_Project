import React, { useState } from 'react';
import { FaHospital, FaMapMarkerAlt, FaPhone, FaEnvelope, FaGlobe, FaStar, FaCalendarAlt, FaEdit, FaTrashAlt, FaPlusCircle, FaSearch } from 'react-icons/fa';
import { IoIosInformationCircleOutline } from 'react-icons/io';

export const Hospital = () => {
  const [hospitals, setHospitals] = useState([
    {
      id: 1,
      name: 'City General Hospital',
      address: '123 Health Ave, Metropolis',
      phone: '+91-123-4567890',
      specialties: ['Cardiology', 'Neurology', 'Pediatrics'],
      description: 'A leading multi-specialty hospital with state-of-the-art facilities and a dedicated research wing. It focuses on patient-centric care and advanced medical research, striving for excellence in healthcare delivery.',
      rating: 4.5,
      email: 'info@citygeneral.com',
      website: 'https://www.citygeneral.com',
      establishmentDate: '2005-01-15'
    },
    {
      id: 2,
      name: 'District Hospital "St. George"',
      address: '456 Care Blvd, Townsville',
      phone: '+91-987-6543210',
      specialties: ['Orthopedics', 'Dermatology', 'Oncology', 'Gastroenterology', 'Pulmonology'],
      description: 'Known for its excellent orthopedic and cancer treatment departments, offering advanced therapies and compassionate care. They have a strong community outreach program.',
      rating: 4.2,
      email: 'contact@sainthospital.org',
      website: 'https://www.sainthospital.org',
      establishmentDate: '1998-07-20'
    },
    {
      id: 3,
      name: 'Wellspring Clinic',
      address: '789 Wellness Rd, Villageton',
      phone: '+91-555-1122334',
      specialties: ['General Practice', 'Physiotherapy', 'Nutrition'],
      description: 'A community-focused clinic offering primary care and rehabilitation services for all ages, emphasizing holistic wellness and preventive medicine. Very friendly staff.',
      rating: 3.9,
      email: 'admin@wellspring.co.in',
      website: 'https://www.wellspringclinic.com',
      establishmentDate: '2010-03-01'
    },
    {
      id: 4,
      name: 'Apex Medical Center',
      address: '101 Summit Street, Hilltop',
      phone: '+91-111-2223333',
      specialties: ['Nephrology', 'Urology', 'Cardiology'],
      description: 'Specializing in kidney and urinary tract conditions, Apex Medical Center offers advanced diagnostic and treatment options. Their cardiology department is also top-notch.',
      rating: 4.6,
      email: 'info@apexmed.com',
      website: 'https://www.apexmed.com',
      establishmentDate: '2015-09-10'
    },
    {
      id: 5,
      name: 'Sunrise Childrens Hospital',
      address: '200 Dawn Avenue, Kidville',
      phone: '+91-444-5556666',
      specialties: ['Pediatrics', 'Child Psychology', 'Neonatology'],
      description: 'Dedicated to the health and well-being of children, Sunrise Hospital provides specialized pediatric care in a child-friendly environment. They have excellent support for parents.',
      rating: 4.8,
      email: 'kids@sunrisehospital.in',
      website: 'https://www.sunrisechildrens.org',
      establishmentDate: '2008-04-22'
    }
  ]);

  const [selectedHospital, setSelectedHospital] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleEdit = (hospitalId) => {
    alert(`Edit functionality for Hospital ID: ${hospitalId}`);
  };

  const handleDelete = (hospitalId) => {
    if (window.confirm(`Are you sure you want to delete Hospital ID: ${hospitalId}?`)) {
      setHospitals(hospitals.filter(h => h.id !== hospitalId));
      if (selectedHospital && selectedHospital.id === hospitalId) {
        setSelectedHospital(null);
      }
    }
  };

  const filteredHospitals = hospitals.filter(hospital =>
    hospital.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-white p-4 font-sans text-gray-800">
      {/* Left Panel: Hospital List */}
      <div className="w-1/3 bg-white p-4 flex flex-col mr-4 border border-gray-300">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-300">
          <FaHospital className="inline-block mr-2 text-gray-700" /> Hospitals
        </h1>

        {/* Search Functionality */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search hospitals..."
            className="w-full pl-10 pr-3 py-2 border border-gray-400 rounded-md text-gray-700 focus:outline-none focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>

        <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
          {filteredHospitals.length > 0 ? (
            filteredHospitals.map((hospital) => (
              <div
                key={hospital.id}
                onClick={(e) => {
                  if (!e.target.closest('button, svg')) {
                    setSelectedHospital(hospital);
                  }
                }}
                className={`p-3 mb-3 border border-gray-300 rounded-md cursor-pointer flex flex-col
                  ${selectedHospital && selectedHospital.id === hospital.id
                    ? 'bg-gray-200' // Simple selected state
                    : 'bg-white'
                  }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h2 className={`text-lg font-semibold ${selectedHospital && selectedHospital.id === hospital.id ? 'text-gray-900' : 'text-gray-800'}`}>
                      {hospital.name}
                    </h2>
                    <p className={`text-sm ${selectedHospital && selectedHospital.id === hospital.id ? 'text-gray-700' : 'text-gray-600'}`}>
                      {hospital.address}
                    </p>
                    <p className={`text-sm flex items-center mt-1 ${selectedHospital && selectedHospital.id === hospital.id ? 'text-gray-800' : 'text-gray-700'}`}>
                      <FaStar className="h-4 w-4 mr-1 text-yellow-500" />
                      <span className="font-medium">{hospital.rating}</span>
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleEdit(hospital.id); }}
                      className="p-1 text-gray-500"
                      title="Edit Hospital"
                    >
                      <FaEdit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(hospital.id); }}
                      className="p-1 text-red-600"
                      title="Delete Hospital"
                    >
                      <FaTrashAlt className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 mt-8 p-4 border border-gray-200 rounded-md">
              No hospitals found matching your search.
            </div>
          )}
        </div>
        {/* Add Hospital Button */}
        <div className="mt-4 pt-4 border-t border-gray-300">
          <button
            className="w-full bg-gray-700 text-white font-bold py-2 px-4 rounded-md flex items-center justify-center"
            onClick={() => alert('Add New Hospital functionality goes here!')}
          >
            <FaPlusCircle className="mr-2" /> Add New Hospital
          </button>
        </div>
      </div>

      {/* Right Panel: Hospital Details */}
      <div className="flex-1 bg-white p-6 flex flex-col border border-gray-300">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-300">
          <IoIosInformationCircleOutline className="inline-block mr-2 text-gray-700" /> Hospital Details
        </h1>
        {selectedHospital ? (
          <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              {selectedHospital.name}
            </h2>
            <p className="text-md text-gray-700 mb-4">{selectedHospital.description}</p>

            <div className="grid grid-cols-1 gap-y-3 text-gray-700 text-base mb-6 border-t border-b border-gray-200 py-4">
              <p className="flex items-center">
                <FaMapMarkerAlt className="h-5 w-5 mr-2 text-gray-600" />
                <span className="font-semibold">Address:</span> {selectedHospital.address}
              </p>
              <p className="flex items-center">
                <FaPhone className="h-5 w-5 mr-2 text-gray-600" />
                <span className="font-semibold">Phone:</span> {selectedHospital.phone}
              </p>
              <p className="flex items-center">
                <FaEnvelope className="h-5 w-5 mr-2 text-gray-600" />
                <span className="font-semibold">Email:</span> {selectedHospital.email}
              </p>
              <p className="flex items-center">
                <FaGlobe className="h-5 w-5 mr-2 text-gray-600" />
                <span className="font-semibold">Website:</span> <a href={selectedHospital.website} target="_blank" rel="noopener noreferrer" className="text-blue-700">Visit Site</a>
              </p>
              <p className="flex items-center">
                <FaStar className="h-5 w-5 mr-2 text-yellow-500" />
                <span className="font-semibold">Rating:</span> {selectedHospital.rating}
              </p>
              <p className="flex items-center">
                <FaCalendarAlt className="h-5 w-5 mr-2 text-gray-600" />
                <span className="font-semibold">Established:</span> {new Date(selectedHospital.establishmentDate).toLocaleDateString('en-IN')}
              </p>
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-3">Specialties:</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedHospital.specialties.map((specialty, index) => (
                <span key={index} className="bg-gray-200 text-gray-800 text-sm font-semibold px-3 py-1 rounded-full">
                  {specialty}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center text-gray-500 text-lg p-4 border border-gray-200 rounded-md">
            <IoIosInformationCircleOutline className="h-16 w-16 text-gray-400 mb-4" />
            <p className="text-center font-medium">Please select a hospital from the left to view its detailed information.</p>
            <p className="text-sm text-gray-400 mt-2">Click on any hospital card to see more.</p>
          </div>
        )}
      </div>

      {/* Custom Scrollbar Styling */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f8f8f8; /* Very light gray */
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cccccc; /* Medium gray */
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #aaaaaa; /* Darker gray (though hovers are minimal elsewhere) */
        }
      `}</style>
    </div>
  );
};