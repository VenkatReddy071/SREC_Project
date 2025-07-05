import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaHospital, FaMapMarkerAlt, FaPhone, FaEnvelope, FaGlobe, FaStar, FaCalendarAlt, FaEdit, FaTrashAlt, FaPlusCircle, FaSearch, FaSpinner, FaClock } from 'react-icons/fa';
import { IoIosInformationCircleOutline } from 'react-icons/io';
import axios from "axios";
import CustomModal from "../../../Pages/CustomModol";

export const Hospital = () => {
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [hospitalToDelete, setHospitalToDelete] = useState(null);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [loadingDoctors, setLoadingDoctors] = useState(false);

  const SERVER_URL = `${import.meta.env.VITE_SERVER_URL}`;

  const observer = useRef();
  const lastHospitalElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const fetchHospitals = async (pageNum) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${SERVER_URL}/api/hospitals/all?page=${pageNum}&limit=10`,
        { withCredentials: true }
      );
      if (response.status === 200) {
        setHospitals(prevHospitals => {
          const newHospitals = response.data?.hospitals.map(hospital => ({
            _id: hospital._id,
            name: hospital.name,
            address: hospital.address,
            rating: hospital.rating,
            reviews: hospital.patientSatisfaction || 0,
            description: hospital.info,
            phone: hospital.phoneNumber,
            email: hospital.ownerEmail,
            website: hospital.website || '#',
            establishmentDate: hospital.foundation,
            specialties: hospital.specialization || [],
            doctors: hospital.doctors || [],
            gallery: hospital.gallery || [],
            glimpseInside: hospital.glimpseInside || [],
            operatingHours: hospital.operatingHours || [],
          })).filter(
            newHospital => !prevHospitals.some(existingHospital => existingHospital._id === newHospital._id)
          );
          return [...prevHospitals, ...newHospitals];
        });
        setHasMore(response.data?.hospitals.length > 0);
      }
    } catch (error) {
      console.error("Error fetching hospitals:", error);
      setAlertMessage("Failed to fetch hospitals. Please try again later.");
      setIsAlertModalOpen(true);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitals(page);
  }, [page]);

  useEffect(() => {
    const fetchDoctorsForSelectedHospital = async () => {
      if (selectedHospital?._id) {
        setLoadingDoctors(true);
        try {
          const response = await axios.get(`${SERVER_URL}/api/doctor/${selectedHospital._id}`, { withCredentials: true });
          if (response.status === 200) {
            setSelectedHospital(prev => ({ ...prev, doctors: response.data || [] }));
          }
        } catch (error) {
          console.error("Error fetching doctors:", error);
          setAlertMessage("Failed to fetch doctors for the selected hospital.");
          setIsAlertModalOpen(true);
        } finally {
          setLoadingDoctors(false);
        }
      }
    };
    fetchDoctorsForSelectedHospital();
  }, [selectedHospital?._id, SERVER_URL]);

  const handleEdit = (hospitalId) => {
    setAlertMessage(`Edit functionality for Hospital ID: ${hospitalId} would be implemented here.`);
    setIsAlertModalOpen(true);
  };

  const handleDeleteClick = (hospital) => {
    setHospitalToDelete(hospital);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!hospitalToDelete) return;

    try {
      setHospitals(hospitals.filter(h => h._id !== hospitalToDelete._id));
      if (selectedHospital && selectedHospital._id === hospitalToDelete._id) {
        setSelectedHospital(null);
      }
      setAlertMessage(`Hospital "${hospitalToDelete.name}" deleted successfully.`);
      setIsAlertModalOpen(true);
    } catch (error) {
      console.error("Error deleting hospital:", error);
      setAlertMessage("Failed to delete hospital. Please try again.");
      setIsAlertModalOpen(true);
    } finally {
      setIsDeleteModalOpen(false);
      setHospitalToDelete(null);
    }
  };

  const filteredHospitals = hospitals.filter(hospital =>
    hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hospital.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hospital.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getOperatingStatus = (operatingHours) => {
    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const todayHours = operatingHours.find(h => h.day === currentDay);

    if (!todayHours || todayHours.isClosed) {
      return { status: 'Closed', details: 'Currently Closed' };
    }

    const [openHour, openMinute] = todayHours.openTime.split(':').map(Number);
    const [closeHour, closeMinute] = todayHours.closeTime.split(':').map(Number);

    const openTimeInMinutes = openHour * 60 + openMinute;
    const closeTimeInMinutes = closeHour * 60 + closeMinute;

    if (currentTime >= openTimeInMinutes && currentTime <= closeTimeInMinutes) {
      return { status: 'Open', details: `${todayHours.openTime} - ${todayHours.closeTime}` };
    } else {
      return { status: 'Closed', details: 'Currently Closed' };
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-100 p-4 font-sans text-gray-800">
      <div className="w-full lg:w-1/3 bg-white p-4 flex flex-col rounded-lg shadow-lg mr-0 lg:mr-4 mb-4 lg:mb-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-blue-200 flex items-center">
          <FaHospital className="inline-block mr-3 text-blue-600" /> Hospitals
        </h1>

        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search hospitals by name, address, or specialty..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>

        <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
          {loading && page === 1 && (
            <div className="flex justify-center items-center py-4 text-blue-600">
              <FaSpinner className="animate-spin mr-2" size={24} /> Loading Hospitals...
            </div>
          )}
          {filteredHospitals.length > 0 ? (
            filteredHospitals.map((hospital, index) => {
              const isLastElement = filteredHospitals.length === index + 1;
              const operatingStatus = getOperatingStatus(hospital.operatingHours);
              return (
                <div
                  key={hospital._id}
                  ref={isLastElement ? lastHospitalElementRef : null}
                  onClick={(e) => {
                    if (!e.target.closest('button, svg')) {
                      setSelectedHospital(hospital);
                    }
                  }}
                  className={`p-4 mb-4 border border-gray-200 rounded-lg cursor-pointer flex flex-col transition-all duration-200 transform hover:scale-[1.02] hover:shadow-md
                    ${selectedHospital && selectedHospital._id === hospital._id
                      ? 'bg-blue-50 border-blue-400 shadow-inner'
                      : 'bg-white'
                    }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h2 className={`text-xl font-bold ${selectedHospital && selectedHospital._id === hospital._id ? 'text-blue-800' : 'text-gray-900'}`}>
                        {hospital.name}
                      </h2>
                      <p className={`text-sm ${selectedHospital && selectedHospital._id === hospital._id ? 'text-blue-700' : 'text-gray-600'}`}>
                        <FaMapMarkerAlt className="inline-block mr-1 text-gray-500" />{hospital.address}
                      </p>
                      <p className={`text-sm flex items-center mt-1 ${selectedHospital && selectedHospital._id === hospital._id ? 'text-blue-700' : 'text-gray-700'}`}>
                        <FaStar className="h-4 w-4 mr-1 text-yellow-500" />
                        <span className="font-semibold">{hospital.rating}</span> ({hospital.reviews || 0} reviews)
                      </p>
                      <p className={`text-xs flex items-center mt-1 ${operatingStatus.status === 'Open' ? 'text-green-600' : 'text-red-600'}`}>
                        <FaClock className="h-3 w-3 mr-1" />
                        <span className="font-semibold">{operatingStatus.status}</span> ({operatingStatus.details})
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleEdit(hospital._id); }}
                        className="p-2 text-gray-500 hover:text-blue-600 transition-colors rounded-full hover:bg-gray-100"
                        title="Edit Hospital"
                      >
                        <FaEdit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteClick(hospital); }}
                        className="p-2 text-red-600 hover:text-red-800 transition-colors rounded-full hover:bg-red-50"
                        title="Delete Hospital"
                      >
                        <FaTrashAlt className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {hospital.specialties.slice(0, 3).map((specialty, idx) => (
                      <span key={idx} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {specialty}
                      </span>
                    ))}
                    {hospital.specialties.length > 3 && (
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        +{hospital.specialties.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center text-gray-500 mt-8 p-4 border border-gray-200 rounded-md bg-gray-50">
              No hospitals found matching your search.
            </div>
          )}
          {loading && page > 1 && hasMore && (
            <div className="flex justify-center items-center py-4 text-blue-600">
              <FaSpinner className="animate-spin mr-2" size={24} /> Loading more...
            </div>
          )}
          {!hasMore && !loading && filteredHospitals.length > 0 && (
            <div className="text-center text-gray-500 py-4">You've reached the end of the list.</div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <button
            className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors shadow-md"
            onClick={() => {
              setAlertMessage('Add New Hospital functionality goes here! A form would typically open.');
              setIsAlertModalOpen(true);
            }}
          >
            <FaPlusCircle className="mr-2" /> Add New Hospital
          </button>
        </div>
      </div>

      <div className="flex-1 bg-white p-6 flex flex-col rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-blue-200 flex items-center">
          <IoIosInformationCircleOutline className="inline-block mr-3 text-blue-600" /> Hospital Details
        </h1>
        {selectedHospital ? (
          <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
              {selectedHospital.name}
            </h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">{selectedHospital.description}</p>

            {selectedHospital.gallery && selectedHospital.gallery.length > 0 && (
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Gallery:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedHospital.gallery.map((imgSrc, index) => (
                    <img
                      key={index}
                      src={imgSrc}
                      alt={`Gallery image ${index + 1}`}
                      className="w-full h-40 object-cover rounded-lg shadow-sm"
                      onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/200x150/E0E0E0/000000?text=Image"; }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 text-gray-700 text-base mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="flex items-center">
                <FaMapMarkerAlt className="h-5 w-5 mr-3 text-blue-600" />
                <span className="font-semibold">Address:</span> {selectedHospital.address}
              </p>
              <p className="flex items-center">
                <FaPhone className="h-5 w-5 mr-3 text-blue-600" />
                <span className="font-semibold">Phone:</span> <a href={`tel:${selectedHospital.phone}`} className="text-blue-700 hover:underline">{selectedHospital.phone}</a>
              </p>
              <p className="flex items-center">
                <FaEnvelope className="h-5 w-5 mr-3 text-blue-600" />
                <span className="font-semibold">Email:</span> <a href={`mailto:${selectedHospital.email}`} className="text-blue-700 hover:underline">{selectedHospital.email}</a>
              </p>
              <p className="flex items-center">
                <FaGlobe className="h-5 w-5 mr-3 text-blue-600" />
                <span className="font-semibold">Website:</span> <a href={selectedHospital.website} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">Visit Site</a>
              </p>
              <p className="flex items-center">
                <FaStar className="h-5 w-5 mr-3 text-yellow-500" />
                <span className="font-semibold">Rating:</span> {selectedHospital.rating} / 5.0
              </p>
              <p className="flex items-center">
                <FaCalendarAlt className="h-5 w-5 mr-3 text-blue-600" />
                <span className="font-semibold">Established:</span> {new Date(selectedHospital.establishmentDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <p className="flex items-center md:col-span-2">
                <FaClock className="h-5 w-5 mr-3 text-blue-600" />
                <span className="font-semibold">Current Status:</span>
                <span className={`ml-2 font-bold ${getOperatingStatus(selectedHospital.operatingHours).status === 'Open' ? 'text-green-600' : 'text-red-600'}`}>
                  {getOperatingStatus(selectedHospital.operatingHours).status}
                </span>
                <span className="ml-1 text-sm text-gray-600">({getOperatingStatus(selectedHospital.operatingHours).details})</span>
              </p>
            </div>

            {selectedHospital.glimpseInside && selectedHospital.glimpseInside.length > 0 && (
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Glimpse Inside:</h3>
                <div className="flex flex-wrap gap-3">
                  {selectedHospital.glimpseInside.map((item, index) => (
                    <span key={index} className="bg-purple-100 text-purple-800 text-md font-semibold px-4 py-1.5 rounded-full shadow-md">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <h3 className="text-2xl font-bold text-gray-900 mb-4">Specialties:</h3>
            <div className="flex flex-wrap gap-3 mb-6">
              {selectedHospital.specialties.map((specialty, index) => (
                <span key={index} className="bg-blue-600 text-white text-md font-semibold px-4 py-1.5 rounded-full shadow-md">
                  {specialty}
                </span>
              ))}
            </div>

            {loadingDoctors ? (
              <div className="flex justify-center items-center py-4 text-blue-600">
                <FaSpinner className="animate-spin mr-2" size={20} /> Loading Doctors...
              </div>
            ) : selectedHospital.doctors && selectedHospital.doctors.length > 0 ? (
              <>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Associated Doctors:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedHospital.doctors.map((doctor, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
                      <p className="font-semibold text-gray-900">{doctor.name}</p>
                      <p className="text-sm text-gray-600">{doctor.specialization}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-gray-500 text-center py-4">No associated doctors found.</div>
            )}

          </div>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center text-gray-500 text-lg p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-inner">
            <IoIosInformationCircleOutline className="h-20 w-20 text-gray-400 mb-6" />
            <p className="text-center font-medium text-xl">Select a hospital to view its details.</p>
            <p className="text-md text-gray-400 mt-2">Click on any hospital card from the left panel.</p>
          </div>
        )}
      </div>

      <CustomModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <div className="p-6 bg-white rounded-lg shadow-xl text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Confirm Deletion</h2>
          <p className="text-gray-700 mb-6">
            Are you sure you want to delete <span className="font-semibold">{hospitalToDelete?.name}</span>? This action cannot be undone.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </CustomModal>

      <CustomModal isOpen={isAlertModalOpen} onClose={() => setIsAlertModalOpen(false)}>
        <div className="p-6 bg-white rounded-lg shadow-xl text-center">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">Information</h2>
          <p className="text-gray-700 mb-6">{alertMessage}</p>
          <button
            onClick={() => setIsAlertModalOpen(false)}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            OK
          </button>
        </div>
      </CustomModal>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #e0e7ff;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #93c5fd;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #60a5fa;
        }
      `}</style>
    </div>
  );
};
