import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaGraduationCap, FaMapMarkerAlt, FaPhone, FaEnvelope, FaStar, FaSearch, FaPlusCircle, FaSpinner, FaEdit, FaTrashAlt, FaBook, FaBus, FaAward,FaCalendarAlt } from 'react-icons/fa';
import { IoIosInformationCircleOutline } from 'react-icons/io';
import axios from "axios";
import CustomModal from "../../../Pages/CustomModol";

export const Schools = () => {
  const [institutions, setInstitutions] = useState([]);
  const [selectedInstitution, setSelectedInstitution] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [institutionToDelete, setInstitutionToDelete] = useState(null);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const SERVER_URL = `${import.meta.env.VITE_SERVER_URL}`;

  const observer = useRef();
  const lastInstitutionElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const fetchInstitutions = async (pageNum) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${SERVER_URL}/api/school?page=${pageNum}&limit=10`,
        { withCredentials: true }
      );
      if (response.status === 200) {
        setInstitutions(prevInstitutions => {
          const newInstitutions = response.data?.data.map(inst => ({
            _id: inst._id,
            name: inst.name,
            address: inst.location,
            rating: inst.rating,
            description: inst.info,
            phone: inst.mobileNumber,
            email: inst.email || 'N/A',
            establishmentYear: inst.foundationYear,
            mainImage: inst.image || "https://placehold.co/400x250/E0E0E0/000000?text=Institution",
            gallery: inst.gallery || [],
            institutionType: inst.institutionType,
            board: inst.schoolDetails?.board,
            specialTraining: inst.schoolDetails?.specialTraining,
            extraCurricularActivitiesSchool: inst.schoolDetails?.extraCurricularActivities || [],
            transportation: inst.schoolDetails?.transportation,
            specializationsCollege: inst.collegeDetails?.specializations || [],
            courseTypesCollege: inst.collegeDetails?.courseTypes || [],
            extraCurricularActivitiesCollege: inst.collegeDetails?.extraCurricularActivities || [],
            hostel: inst.hostel,
            awards: inst.awards || [],
          })).filter(
            newInst => !prevInstitutions.some(existingInst => existingInst._id === newInst._id)
          );
          return [...prevInstitutions, ...newInstitutions];
        });
        setHasMore(response.data?.data.length > 0);
      }
    } catch (error) {
      console.error("Error fetching institutions:", error);
      setAlertMessage("Failed to fetch institutions. Please try again later.");
      setIsAlertModalOpen(true);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstitutions(page);
  }, [page]);

  const handleEdit = (institutionId) => {
    setAlertMessage(`Edit functionality for Institution ID: ${institutionId} would be implemented here.`);
    setIsAlertModalOpen(true);
  };

  const handleDeleteClick = (institution) => {
    setInstitutionToDelete(institution);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!institutionToDelete) return;

    try {
      setInstitutions(institutions.filter(inst => inst._id !== institutionToDelete._id));
      if (selectedInstitution && selectedInstitution._id === institutionToDelete._id) {
        setSelectedInstitution(null);
      }
      setAlertMessage(`Institution "${institutionToDelete.name}" deleted successfully.`);
      setIsAlertModalOpen(true);
    } catch (error) {
      console.error("Error deleting institution:", error);
      setAlertMessage("Failed to delete institution. Please try again.");
      setIsAlertModalOpen(true);
    } finally {
      setIsDeleteModalOpen(false);
      setInstitutionToDelete(null);
    }
  };

  const filteredInstitutions = institutions.filter(institution =>
    institution.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    institution.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (institution.institutionType === 'School' && institution.board?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (institution.institutionType === 'College' && institution.specializationsCollege?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-100 p-4 font-sans text-gray-800">
      <div className="w-full lg:w-1/3 bg-white p-4 flex flex-col rounded-lg shadow-lg mr-0 lg:mr-4 mb-4 lg:mb-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-green-200 flex items-center">
          <FaGraduationCap className="inline-block mr-3 text-green-600" /> Institutions
        </h1>

        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search institutions by name, location, board, or specialization..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>

        <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
          {loading && page === 1 && (
            <div className="flex justify-center items-center py-4 text-green-600">
              <FaSpinner className="animate-spin mr-2" size={24} /> Loading Institutions...
            </div>
          )}
          {filteredInstitutions.length > 0 ? (
            filteredInstitutions.map((institution, index) => {
              const isLastElement = filteredInstitutions.length === index + 1;
              return (
                <div
                  key={institution._id}
                  ref={isLastElement ? lastInstitutionElementRef : null}
                  onClick={(e) => {
                    if (!e.target.closest('button, svg')) {
                      setSelectedInstitution(institution);
                    }
                  }}
                  className={`p-4 mb-4 border border-gray-200 rounded-lg cursor-pointer flex flex-col transition-all duration-200 transform hover:scale-[1.02] hover:shadow-md
                    ${selectedInstitution && selectedInstitution._id === institution._id
                      ? 'bg-green-50 border-green-400 shadow-inner'
                      : 'bg-white'
                    }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h2 className={`text-xl font-bold ${selectedInstitution && selectedInstitution._id === institution._id ? 'text-green-800' : 'text-gray-900'}`}>
                        {institution.name}
                      </h2>
                      <p className={`text-sm ${selectedInstitution && selectedInstitution._id === institution._id ? 'text-green-700' : 'text-gray-600'}`}>
                        <FaMapMarkerAlt className="inline-block mr-1 text-gray-500" />{institution.address}
                      </p>
                      <p className={`text-sm flex items-center mt-1 ${selectedInstitution && selectedInstitution._id === institution._id ? 'text-green-700' : 'text-gray-700'}`}>
                        <FaStar className="h-4 w-4 mr-1 text-yellow-500" />
                        <span className="font-semibold">{institution.rating}</span>
                      </p>
                      <p className={`text-xs flex items-center mt-1 text-gray-600`}>
                        <FaGraduationCap className="h-3 w-3 mr-1" />
                        <span className="font-semibold">{institution.institutionType}</span>
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleEdit(institution._id); }}
                        className="p-2 text-gray-500 hover:text-green-600 transition-colors rounded-full hover:bg-gray-100"
                        title="Edit Institution"
                      >
                        <FaEdit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteClick(institution); }}
                        className="p-2 text-red-600 hover:text-red-800 transition-colors rounded-full hover:bg-red-50"
                        title="Delete Institution"
                      >
                        <FaTrashAlt className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {institution.institutionType === 'School' && institution.board && (
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        Board: {institution.board}
                      </span>
                    )}
                    {institution.institutionType === 'College' && institution.specializationsCollege.slice(0, 2).map((spec, idx) => (
                      <span key={idx} className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {spec}
                      </span>
                    ))}
                    {institution.institutionType === 'College' && institution.specializationsCollege.length > 2 && (
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        +{institution.specializationsCollege.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center text-gray-500 mt-8 p-4 border border-gray-200 rounded-md bg-gray-50">
              No institutions found matching your search.
            </div>
          )}
          {loading && page > 1 && hasMore && (
            <div className="flex justify-center items-center py-4 text-green-600">
              <FaSpinner className="animate-spin mr-2" size={24} /> Loading more...
            </div>
          )}
          {!hasMore && !loading && filteredInstitutions.length > 0 && (
            <div className="text-center text-gray-500 py-4">You've reached the end of the list.</div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <button
            className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center hover:bg-green-700 transition-colors shadow-md"
            onClick={() => {
              setAlertMessage('Add New Institution functionality goes here! A form would typically open.');
              setIsAlertModalOpen(true);
            }}
          >
            <FaPlusCircle className="mr-2" /> Add New Institution
          </button>
        </div>
      </div>

      <div className="flex-1 bg-white p-6 flex flex-col rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-green-200 flex items-center">
          <IoIosInformationCircleOutline className="inline-block mr-3 text-green-600" /> Institution Details
        </h1>
        {selectedInstitution ? (
          <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
              {selectedInstitution.name}
            </h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">{selectedInstitution.description}</p>

            {selectedInstitution.mainImage && (
              <div className="mb-8">
                <img
                  src={selectedInstitution.mainImage}
                  alt={selectedInstitution.name}
                  className="w-full h-64 object-cover rounded-lg shadow-md"
                  onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x400/E0E0E0/000000?text=Institution+Image"; }}
                />
              </div>
            )}

            {selectedInstitution.gallery && selectedInstitution.gallery.length > 0 && (
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Gallery:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedInstitution.gallery.map((imgSrc, index) => (
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
                <FaMapMarkerAlt className="h-5 w-5 mr-3 text-green-600" />
                <span className="font-semibold">Address:</span> {selectedInstitution.address}
              </p>
              <p className="flex items-center">
                <FaPhone className="h-5 w-5 mr-3 text-green-600" />
                <span className="font-semibold">Phone:</span> <a href={`tel:${selectedInstitution.phone}`} className="text-blue-700 hover:underline">{selectedInstitution.phone}</a>
              </p>
              <p className="flex items-center">
                <FaEnvelope className="h-5 w-5 mr-3 text-green-600" />
                <span className="font-semibold">Email:</span> <a href={`mailto:${selectedInstitution.email}`} className="text-blue-700 hover:underline">{selectedInstitution.email}</a>
              </p>
              <p className="flex items-center">
                <FaStar className="h-5 w-5 mr-3 text-yellow-500" />
                <span className="font-semibold">Rating:</span> {selectedInstitution.rating} / 5.0
              </p>
              <p className="flex items-center">
                <FaBook className="h-5 w-5 mr-3 text-green-600" />
                <span className="font-semibold">Type:</span> {selectedInstitution.institutionType}
              </p>
              <p className="flex items-center">
                <FaCalendarAlt className="h-5 w-5 mr-3 text-green-600" />
                <span className="font-semibold">Established:</span> {selectedInstitution.establishmentYear}
              </p>
              <p className="flex items-center">
                <FaAward className="h-5 w-5 mr-3 text-yellow-600" />
                <span className="font-semibold">Hostel:</span> {selectedInstitution.hostel ? 'Available' : 'Not Available'}
              </p>
            </div>

            {selectedInstitution.institutionType === 'School' && (
              <>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">School Details:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="flex items-center">
                    <FaBook className="h-5 w-5 mr-3 text-green-600" />
                    <span className="font-semibold">Board:</span> {selectedInstitution.board}
                  </p>
                  <p className="flex items-center">
                    <FaBus className="h-5 w-5 mr-3 text-green-600" />
                    <span className="font-semibold">Transportation:</span> {selectedInstitution.transportation}
                  </p>
                  <p className="flex items-center col-span-full">
                    <FaAward className="h-5 w-5 mr-3 text-green-600" />
                    <span className="font-semibold">Special Training:</span> {selectedInstitution.specialTraining}
                  </p>
                  {selectedInstitution.extraCurricularActivitiesSchool.length > 0 && (
                    <div className="col-span-full">
                      <p className="font-semibold mb-2">Extra-curricular Activities:</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedInstitution.extraCurricularActivitiesSchool.map((activity, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                            {activity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {selectedInstitution.institutionType === 'College' && (
              <>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">College Details:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  {selectedInstitution.specializationsCollege.length > 0 && (
                    <div>
                      <p className="font-semibold mb-2">Specializations:</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedInstitution.specializationsCollege.map((spec, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedInstitution.courseTypesCollege.length > 0 && (
                    <div>
                      <p className="font-semibold mb-2">Course Types:</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedInstitution.courseTypesCollege.map((type, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedInstitution.extraCurricularActivitiesCollege.length > 0 && (
                    <div className="col-span-full">
                      <p className="font-semibold mb-2">Extra-curricular Activities:</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedInstitution.extraCurricularActivitiesCollege.map((activity, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                            {activity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {selectedInstitution.awards && selectedInstitution.awards.length > 0 && (
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Awards:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedInstitution.awards.map((award, index) => (
                    <div key={index} className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 shadow-sm">
                      <p className="font-semibold text-yellow-900">{award.name} ({award.year})</p>
                      <p className="text-sm text-yellow-700">{award.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center text-gray-500 text-lg p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-inner">
            <IoIosInformationCircleOutline className="h-20 w-20 text-gray-400 mb-6" />
            <p className="text-center font-medium text-xl">Select an institution to view its details.</p>
            <p className="text-md text-gray-400 mt-2">Click on any institution card from the left panel.</p>
          </div>
        )}
      </div>

      <CustomModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <div className="p-6 bg-white rounded-lg shadow-xl text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Confirm Deletion</h2>
          <p className="text-gray-700 mb-6">
            Are you sure you want to delete <span className="font-semibold">{institutionToDelete?.name}</span>? This action cannot be undone.
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
          background: #e6ffe6;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #a8e6a8;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #79d279;
        }
      `}</style>
    </div>
  );
};
