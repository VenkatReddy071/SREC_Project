import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope,FaCalendarAlt, FaGlobe, FaStar, FaSearch, FaPlusCircle, FaSpinner, FaClock, FaEdit, FaTrashAlt, FaBuilding, FaStore, FaRulerCombined, FaShoppingCart, FaGift, FaChair } from 'react-icons/fa';
import { IoIosInformationCircleOutline } from 'react-icons/io';
import axios from "axios";
import CustomModal from "../../../Pages/CustomModol"; // Assuming CustomModal is available at this path

export const Mail = () => {
  const [malls, setMalls] = useState([]);
  const [selectedMall, setSelectedMall] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [mallToDelete, setMallToDelete] = useState(null);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const SERVER_URL = `${import.meta.env.VITE_SERVER_URL}`;

  const observer = useRef();
  const lastMallElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const fetchMalls = async (pageNum) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${SERVER_URL}/api/malls/all?page=${pageNum}&limit=10`,
        { withCredentials: true }
      );
      if (response.status === 200) {
        setMalls(prevMalls => {
          const newMalls = response.data?.malls.map(mall => ({
            _id: mall._id,
            name: mall.name,
            address: `${mall.address}, ${mall.locationName}, ${mall.area} - ${mall.pincode}`,
            rating: mall.rating,
            description: mall.description,
            info: mall.info, // Short info for list view
            phone: mall.phoneNumber,
            email: mall.email,
            website: mall.website || '#',
            establishedDate: mall.establishedDate,
            mainImage: mall.image || "https://placehold.co/400x250/E0E0E0/000000?text=Mall+Image",
            gallery: mall.gallery || [],
            mallType: mall.mallType || [],
            amenities: mall.amenities || [],
            shoppingDepartments: mall.shoppingDepartments || [],
            hasWeddingShopping: mall.hasWeddingShopping,
            openingHours: mall.openingHours,
            totalStores: mall.totalStores,
            totalAreaSqFt: mall.totalAreaSqFt,
            offersAvailable: mall.offersAvailable,
            nearByLocations: mall.nearByLocations || [],
            status: mall.status,
            offer: mall.offer || [],
            taxesAndCharges: mall.taxesAndCharges || [],
            operatingHours: mall.operatingHours || [],
          })).filter(
            newMall => !prevMalls.some(existingMall => existingMall._id === newMall._id)
          );
          return [...prevMalls, ...newMalls];
        });
        setHasMore(response.data?.malls.length > 0);
      }
    } catch (error) {
      console.error("Error fetching malls:", error);
      setAlertMessage("Failed to fetch malls. Please try again later.");
      setIsAlertModalOpen(true);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMalls(page);
  }, [page]);

  const handleEdit = (mallId) => {
    setAlertMessage(`Edit functionality for Mall ID: ${mallId} would be implemented here.`);
    setIsAlertModalOpen(true);
  };

  const handleDeleteClick = (mall) => {
    setMallToDelete(mall);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!mallToDelete) return;

    try {
      setMalls(malls.filter(m => m._id !== mallToDelete._id));
      if (selectedMall && selectedMall._id === mallToDelete._id) {
        setSelectedMall(null);
      }
      setAlertMessage(`Mall "${mallToDelete.name}" deleted successfully.`);
      setIsAlertModalOpen(true);
    } catch (error) {
      console.error("Error deleting mall:", error);
      setAlertMessage("Failed to delete mall. Please try again.");
      setIsAlertModalOpen(true);
    } finally {
      setIsDeleteModalOpen(false);
      setMallToDelete(null);
    }
  };

  const filteredMalls = malls.filter(mall =>
    mall.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mall.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mall.mallType.some(type => type.toLowerCase().includes(searchTerm.toLowerCase())) ||
    mall.shoppingDepartments.some(dept => dept.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-100 p-4 font-sans text-gray-800">
      <div className="w-full lg:w-1/3 bg-white p-4 flex flex-col rounded-lg shadow-lg mr-0 lg:mr-4 mb-4 lg:mb-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-purple-200 flex items-center">
          {/* <FaShoppingMall className="inline-block mr-3 text-purple-600" /> Malls */}
        </h1>

        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search malls by name, location, type, or department..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>

        <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
          {loading && page === 1 && (
            <div className="flex justify-center items-center py-4 text-purple-600">
              <FaSpinner className="animate-spin mr-2" size={24} /> Loading Malls...
            </div>
          )}
          {filteredMalls.length > 0 ? (
            filteredMalls.map((mall, index) => {
              const isLastElement = filteredMalls.length === index + 1;
              return (
                <div
                  key={mall._id}
                  ref={isLastElement ? lastMallElementRef : null}
                  onClick={(e) => {
                    if (!e.target.closest('button, svg')) {
                      setSelectedMall(mall);
                    }
                  }}
                  className={`p-4 mb-4 border border-gray-200 rounded-lg cursor-pointer flex flex-col transition-all duration-200 transform hover:scale-[1.02] hover:shadow-md
                    ${selectedMall && selectedMall._id === mall._id
                      ? 'bg-purple-50 border-purple-400 shadow-inner'
                      : 'bg-white'
                    }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h2 className={`text-xl font-bold ${selectedMall && selectedMall._id === mall._id ? 'text-purple-800' : 'text-gray-900'}`}>
                        {mall.name}
                      </h2>
                      <p className={`text-sm ${selectedMall && selectedMall._id === mall._id ? 'text-purple-700' : 'text-gray-600'}`}>
                        <FaMapMarkerAlt className="inline-block mr-1 text-gray-500" />{mall.address}
                      </p>
                      <p className={`text-sm flex items-center mt-1 ${selectedMall && selectedMall._id === mall._id ? 'text-purple-700' : 'text-gray-700'}`}>
                        <FaStar className="h-4 w-4 mr-1 text-yellow-500" />
                        <span className="font-semibold">{mall.rating}</span>
                      </p>
                      <p className={`text-xs flex items-center mt-1 text-gray-600`}>
                        <FaClock className="h-3 w-3 mr-1" />
                        <span className="font-semibold">{mall.openingHours}</span>
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleEdit(mall._id); }}
                        className="p-2 text-gray-500 hover:text-purple-600 transition-colors rounded-full hover:bg-gray-100"
                        title="Edit Mall"
                      >
                        <FaEdit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteClick(mall); }}
                        className="p-2 text-red-600 hover:text-red-800 transition-colors rounded-full hover:bg-red-50"
                        title="Delete Mall"
                      >
                        <FaTrashAlt className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {mall.mallType.slice(0, 3).map((type, idx) => (
                      <span key={idx} className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {type}
                      </span>
                    ))}
                    {mall.mallType.length > 3 && (
                      <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        +{mall.mallType.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center text-gray-500 mt-8 p-4 border border-gray-200 rounded-md bg-gray-50">
              No malls found matching your search.
            </div>
          )}
          {loading && page > 1 && hasMore && (
            <div className="flex justify-center items-center py-4 text-purple-600">
              <FaSpinner className="animate-spin mr-2" size={24} /> Loading more...
            </div>
          )}
          {!hasMore && !loading && filteredMalls.length > 0 && (
            <div className="text-center text-gray-500 py-4">You've reached the end of the list.</div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <button
            className="w-full bg-purple-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center hover:bg-purple-700 transition-colors shadow-md"
            onClick={() => {
              setAlertMessage('Add New Mall functionality goes here! A form would typically open.');
              setIsAlertModalOpen(true);
            }}
          >
            <FaPlusCircle className="mr-2" /> Add New Mall
          </button>
        </div>
      </div>

      <div className="flex-1 bg-white p-6 flex flex-col rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-purple-200 flex items-center">
          <IoIosInformationCircleOutline className="inline-block mr-3 text-purple-600" /> Mall Details
        </h1>
        {selectedMall ? (
          <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
              {selectedMall.name}
            </h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">{selectedMall.description}</p>

            {selectedMall.mainImage && (
              <div className="mb-8">
                <img
                  src={selectedMall.mainImage}
                  alt={selectedMall.name}
                  className="w-full h-64 object-cover rounded-lg shadow-md"
                  onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x400/E0E0E0/000000?text=Mall+Image"; }}
                />
              </div>
            )}

            {selectedMall.gallery && selectedMall.gallery.length > 0 && (
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Gallery:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedMall.gallery.map((imgSrc, index) => (
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
                <FaMapMarkerAlt className="h-5 w-5 mr-3 text-purple-600" />
                <span className="font-semibold">Address:</span> {selectedMall.address}
              </p>
              <p className="flex items-center">
                <FaPhone className="h-5 w-5 mr-3 text-purple-600" />
                <span className="font-semibold">Phone:</span> <a href={`tel:${selectedMall.phone}`} className="text-blue-700 hover:underline">{selectedMall.phone}</a>
              </p>
              <p className="flex items-center">
                <FaEnvelope className="h-5 w-5 mr-3 text-purple-600" />
                <span className="font-semibold">Email:</span> <a href={`mailto:${selectedMall.email}`} className="text-blue-700 hover:underline">{selectedMall.email}</a>
              </p>
              <p className="flex items-center">
                <FaGlobe className="h-5 w-5 mr-3 text-purple-600" />
                <span className="font-semibold">Website:</span> <a href={selectedMall.website} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">Visit Site</a>
              </p>
              <p className="flex items-center">
                <FaStar className="h-5 w-5 mr-3 text-yellow-500" />
                <span className="font-semibold">Rating:</span> {selectedMall.rating} / 5.0
              </p>
              <p className="flex items-center">
                <FaCalendarAlt className="h-5 w-5 mr-3 text-purple-600" />
                <span className="font-semibold">Established:</span> {new Date(selectedMall.establishedDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <p className="flex items-center">
                <FaBuilding className="h-5 w-5 mr-3 text-purple-600" />
                <span className="font-semibold">Total Stores:</span> {selectedMall.totalStores}
              </p>
              <p className="flex items-center">
                <FaRulerCombined className="h-5 w-5 mr-3 text-purple-600" />
                <span className="font-semibold">Area:</span> {selectedMall.totalAreaSqFt} sq. ft.
              </p>
              <p className="flex items-center md:col-span-2">
                <FaClock className="h-5 w-5 mr-3 text-purple-600" />
                <span className="font-semibold">Opening Hours:</span> {selectedMall.openingHours}
              </p>
            </div>

            {selectedMall.mallType && selectedMall.mallType.length > 0 && (
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Mall Types:</h3>
                <div className="flex flex-wrap gap-3">
                  {selectedMall.mallType.map((type, index) => (
                    <span key={index} className="bg-purple-600 text-white text-md font-semibold px-4 py-1.5 rounded-full shadow-md">
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedMall.amenities && selectedMall.amenities.length > 0 && (
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Amenities:</h3>
                <div className="flex flex-wrap gap-3">
                  {selectedMall.amenities.map((amenity, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 text-md font-semibold px-4 py-1.5 rounded-full shadow-md">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedMall.shoppingDepartments && selectedMall.shoppingDepartments.length > 0 && (
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Shopping Departments:</h3>
                <div className="flex flex-wrap gap-3">
                  {selectedMall.shoppingDepartments.map((department, index) => (
                    <span key={index} className="bg-green-100 text-green-800 text-md font-semibold px-4 py-1.5 rounded-full shadow-md">
                      {department}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Special Offerings:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                <p className="flex items-center">
                  <FaShoppingCart className={`h-5 w-5 mr-3 ${selectedMall.offersAvailable ? 'text-green-600' : 'text-gray-400'}`} />
                  <span className="font-semibold">Offers Available:</span> {selectedMall.offersAvailable ? 'Yes' : 'No'}
                </p>
                <p className="flex items-center">
                  <FaGift className={`h-5 w-5 mr-3 ${selectedMall.hasWeddingShopping ? 'text-green-600' : 'text-gray-400'}`} />
                  <span className="font-semibold">Wedding Shopping:</span> {selectedMall.hasWeddingShopping ? 'Available' : 'Not Available'}
                </p>
              </div>
            </div>

            {selectedMall.nearByLocations && selectedMall.nearByLocations.length > 0 && (
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Nearby Locations:</h3>
                <div className="flex flex-wrap gap-3">
                  {selectedMall.nearByLocations.map((location, index) => (
                    <span key={index} className="bg-yellow-100 text-yellow-800 text-md font-semibold px-4 py-1.5 rounded-full shadow-md">
                      {location}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedMall.offer && selectedMall.offer.length > 0 && (
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Current Offers:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedMall.offer.map((offer, index) => (
                    <div key={index} className="bg-green-50 p-4 rounded-lg border border-green-200 shadow-sm">
                      <p className="font-semibold text-green-900">{offer.name} ({offer.code})</p>
                      <p className="text-sm text-green-700">
                        {offer.percentage ? `${offer.value}% off` : `₹${offer.value} off`}
                        {offer.applicable === 'all' ? ' on all items' : ` on specific items`}
                      </p>
                      <p className="text-xs text-green-600">
                        Valid: {new Date(offer.startDate).toLocaleDateString()} - {new Date(offer.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedMall.taxesAndCharges && selectedMall.taxesAndCharges.length > 0 && (
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Taxes & Charges:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedMall.taxesAndCharges.map((tax, index) => (
                    <div key={index} className="bg-blue-50 p-4 rounded-lg border border-blue-200 shadow-sm">
                      <p className="font-semibold text-blue-900">{tax.name}</p>
                      <p className="text-sm text-blue-700">
                        {tax.type === 'percentage' ? `${tax.value}%` : `₹${tax.value}`}
                        {tax.isApplicable ? ' (Applicable)' : ' (Not Applicable)'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center text-gray-500 text-lg p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-inner">
            <IoIosInformationCircleOutline className="h-20 w-20 text-gray-400 mb-6" />
            <p className="text-center font-medium text-xl">Select a mall to view its details.</p>
            <p className="text-md text-gray-400 mt-2">Click on any mall card from the left panel.</p>
          </div>
        )}
      </div>

      <CustomModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <div className="p-6 bg-white rounded-lg shadow-xl text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Confirm Deletion</h2>
          <p className="text-gray-700 mb-6">
            Are you sure you want to delete <span className="font-semibold">{mallToDelete?.name}</span>? This action cannot be undone.
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
          background: #f3e5f5;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #ce93d8;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #ba68c8;
        }
      `}</style>
    </div>
  );
};
