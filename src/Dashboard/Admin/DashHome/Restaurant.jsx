import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaUtensils, FaMapMarkerAlt, FaPhone, FaEnvelope, FaGlobe, FaStar, FaSearch, FaPlusCircle, FaSpinner, FaClock, FaEdit, FaTrashAlt, FaDollarSign, FaMotorcycle, FaShoppingBag, FaLeaf, FaTable,FaCalendarAlt } from 'react-icons/fa';
import { IoIosInformationCircleOutline } from 'react-icons/io';
import axios from "axios";
import CustomModal from "../../../Pages/CustomModol";

export const Restaurant = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [restaurantToDelete, setRestaurantToDelete] = useState(null);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const SERVER_URL = `${import.meta.env.VITE_SERVER_URL}`;

  const observer = useRef();
  const lastRestaurantElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const fetchRestaurants = async (pageNum) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${SERVER_URL}/api/restaurant?page=${pageNum}&limit=10`,
        { withCredentials: true }
      );
      if (response.status === 200) {
        setRestaurants(prevRestaurants => {
          const newRestaurants = response.data?.data?.restaurants?.map(restaurant => ({
            _id: restaurant._id,
            name: restaurant.name,
            address: `${restaurant.address.street}, ${restaurant.address.city}, ${restaurant.address.state} - ${restaurant.address.zipCode}`,
            rating: restaurant.rating,
            reviews: restaurant.reviews || 0,
            description: restaurant.description,
            phone: restaurant.phone,
            email: restaurant.email,
            website: restaurant.website || '#',
            establishmentDate: restaurant.createdAt,
            cuisine: restaurant.cuisine || [],
            mainImage: restaurant.imageUrls?.mainImage || "https://placehold.co/400x250/E0E0E0/000000?text=Restaurant",
            gallery: restaurant.imageUrls?.galleryImages || [],
            menuImages: restaurant.imageUrls?.menuImages || [],
            services: restaurant.services || [],
            operatingHours: restaurant.operatingHours || [],
            averagePriceINR: restaurant.averagePriceINR,
            isTopPick: restaurant.isTopPick,
            offersDelivery: restaurant.offersDelivery,
            isTakeaway: restaurant.isTakeaway,
            servesTiffins: restaurant.servesTiffins,
            isTiffinOnly: restaurant.isTiffinOnly,
            isVegetarian: restaurant.isVegetarian,
            seatingAvailability: restaurant.seatingAvailability || [],
            taxesAndCharges: restaurant.taxesAndCharges || [],
            offer: restaurant.offer || [],
          })).filter(
            newRestaurant => !prevRestaurants.some(existingRestaurant => existingRestaurant._id === newRestaurant._id)
          );
          return [...prevRestaurants, ...newRestaurants];
        });
        setHasMore(response.data?.data?.restaurants?.length > 0);
      }
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      setAlertMessage("Failed to fetch restaurants. Please try again later.");
      setIsAlertModalOpen(true);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants(page);
  }, [page]);

  const handleEdit = (restaurantId) => {
    setAlertMessage(`Edit functionality for Restaurant ID: ${restaurantId} would be implemented here.`);
    setIsAlertModalOpen(true);
  };

  const handleDeleteClick = (restaurant) => {
    setRestaurantToDelete(restaurant);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!restaurantToDelete) return;

    try {
      setRestaurants(restaurants.filter(r => r._id !== restaurantToDelete._id));
      if (selectedRestaurant && selectedRestaurant._id === restaurantToDelete._id) {
        setSelectedRestaurant(null);
      }
      setAlertMessage(`Restaurant "${restaurantToDelete.name}" deleted successfully.`);
      setIsAlertModalOpen(true);
    } catch (error) {
      console.error("Error deleting restaurant:", error);
      setAlertMessage("Failed to delete restaurant. Please try again.");
      setIsAlertModalOpen(true);
    } finally {
      setIsDeleteModalOpen(false);
      setRestaurantToDelete(null);
    }
  };

  const filteredRestaurants = restaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    restaurant.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    restaurant.cuisine.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()))
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
        <h1 className="text-3xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-orange-200 flex items-center">
          <FaUtensils className="inline-block mr-3 text-orange-600" /> Restaurants
        </h1>

        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search restaurants by name, address, or cuisine..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>

        <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
          {loading && page === 1 && (
            <div className="flex justify-center items-center py-4 text-orange-600">
              <FaSpinner className="animate-spin mr-2" size={24} /> Loading Restaurants...
            </div>
          )}
          {filteredRestaurants.length > 0 ? (
            filteredRestaurants.map((restaurant, index) => {
              const isLastElement = filteredRestaurants.length === index + 1;
              const operatingStatus = getOperatingStatus(restaurant.operatingHours);
              return (
                <div
                  key={restaurant._id}
                  ref={isLastElement ? lastRestaurantElementRef : null}
                  onClick={(e) => {
                    if (!e.target.closest('button, svg')) {
                      setSelectedRestaurant(restaurant);
                    }
                  }}
                  className={`p-4 mb-4 border border-gray-200 rounded-lg cursor-pointer flex flex-col transition-all duration-200 transform hover:scale-[1.02] hover:shadow-md
                    ${selectedRestaurant && selectedRestaurant._id === restaurant._id
                      ? 'bg-orange-50 border-orange-400 shadow-inner'
                      : 'bg-white'
                    }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h2 className={`text-xl font-bold ${selectedRestaurant && selectedRestaurant._id === restaurant._id ? 'text-orange-800' : 'text-gray-900'}`}>
                        {restaurant.name}
                      </h2>
                      <p className={`text-sm ${selectedRestaurant && selectedRestaurant._id === restaurant._id ? 'text-orange-700' : 'text-gray-600'}`}>
                        <FaMapMarkerAlt className="inline-block mr-1 text-gray-500" />{restaurant.address}
                      </p>
                      <p className={`text-sm flex items-center mt-1 ${selectedRestaurant && selectedRestaurant._id === restaurant._id ? 'text-orange-700' : 'text-gray-700'}`}>
                        <FaStar className="h-4 w-4 mr-1 text-yellow-500" />
                        <span className="font-semibold">{restaurant.rating}</span> ({restaurant.reviews || 0} reviews)
                      </p>
                      <p className={`text-xs flex items-center mt-1 ${operatingStatus.status === 'Open' ? 'text-green-600' : 'text-red-600'}`}>
                        <FaClock className="h-3 w-3 mr-1" />
                        <span className="font-semibold">{operatingStatus.status}</span> ({operatingStatus.details})
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleEdit(restaurant._id); }}
                        className="p-2 text-gray-500 hover:text-orange-600 transition-colors rounded-full hover:bg-gray-100"
                        title="Edit Restaurant"
                      >
                        <FaEdit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteClick(restaurant); }}
                        className="p-2 text-red-600 hover:text-red-800 transition-colors rounded-full hover:bg-red-50"
                        title="Delete Restaurant"
                      >
                        <FaTrashAlt className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {restaurant.cuisine.slice(0, 3).map((cuisine, idx) => (
                      <span key={idx} className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {cuisine}
                      </span>
                    ))}
                    {restaurant.cuisine.length > 3 && (
                      <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        +{restaurant.cuisine.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center text-gray-500 mt-8 p-4 border border-gray-200 rounded-md bg-gray-50">
              No restaurants found matching your search.
            </div>
          )}
          {loading && page > 1 && hasMore && (
            <div className="flex justify-center items-center py-4 text-orange-600">
              <FaSpinner className="animate-spin mr-2" size={24} /> Loading more...
            </div>
          )}
          {!hasMore && !loading && filteredRestaurants.length > 0 && (
            <div className="text-center text-gray-500 py-4">You've reached the end of the list.</div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <button
            className="w-full bg-orange-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center hover:bg-orange-700 transition-colors shadow-md"
            onClick={() => {
              setAlertMessage('Add New Restaurant functionality goes here! A form would typically open.');
              setIsAlertModalOpen(true);
            }}
          >
            <FaPlusCircle className="mr-2" /> Add New Restaurant
          </button>
        </div>
      </div>

      <div className="flex-1 bg-white p-6 flex flex-col rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-orange-200 flex items-center">
          <IoIosInformationCircleOutline className="inline-block mr-3 text-orange-600" /> Restaurant Details
        </h1>
        {selectedRestaurant ? (
          <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
              {selectedRestaurant.name}
            </h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">{selectedRestaurant.description}</p>

            {selectedRestaurant.mainImage && (
              <div className="mb-8">
                <img
                  src={selectedRestaurant.mainImage}
                  alt={selectedRestaurant.name}
                  className="w-full h-64 object-cover rounded-lg shadow-md"
                  onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x400/E0E0E0/000000?text=Restaurant+Image"; }}
                />
              </div>
            )}

            {selectedRestaurant.gallery && selectedRestaurant.gallery.length > 0 && (
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Gallery:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedRestaurant.gallery.map((imgSrc, index) => (
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

            {selectedRestaurant.menuImages && selectedRestaurant.menuImages.length > 0 && (
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Menu:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedRestaurant.menuImages.map((imgSrc, index) => (
                    <img
                      key={index}
                      src={imgSrc}
                      alt={`Menu image ${index + 1}`}
                      className="w-full h-40 object-cover rounded-lg shadow-sm"
                      onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/200x150/E0E0E0/000000?text=Menu+Image"; }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 text-gray-700 text-base mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="flex items-center">
                <FaMapMarkerAlt className="h-5 w-5 mr-3 text-orange-600" />
                <span className="font-semibold">Address:</span> {selectedRestaurant.address}
              </p>
              <p className="flex items-center">
                <FaPhone className="h-5 w-5 mr-3 text-orange-600" />
                <span className="font-semibold">Phone:</span> <a href={`tel:${selectedRestaurant.phone}`} className="text-blue-700 hover:underline">{selectedRestaurant.phone}</a>
              </p>
              <p className="flex items-center">
                <FaEnvelope className="h-5 w-5 mr-3 text-orange-600" />
                <span className="font-semibold">Email:</span> <a href={`mailto:${selectedRestaurant.email}`} className="text-blue-700 hover:underline">{selectedRestaurant.email}</a>
              </p>
              <p className="flex items-center">
                <FaStar className="h-5 w-5 mr-3 text-yellow-500" />
                <span className="font-semibold">Rating:</span> {selectedRestaurant.rating} / 5.0
              </p>
              <p className="flex items-center">
                <FaDollarSign className="h-5 w-5 mr-3 text-green-600" />
                <span className="font-semibold">Avg. Price:</span> ₹{selectedRestaurant.averagePriceINR}
              </p>
              <p className="flex items-center">
                <FaCalendarAlt className="h-5 w-5 mr-3 text-orange-600" />
                <span className="font-semibold">Established:</span> {new Date(selectedRestaurant.establishmentDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <p className="flex items-center md:col-span-2">
                <FaClock className="h-5 w-5 mr-3 text-orange-600" />
                <span className="font-semibold">Current Status:</span>
                <span className={`ml-2 font-bold ${getOperatingStatus(selectedRestaurant.operatingHours).status === 'Open' ? 'text-green-600' : 'text-red-600'}`}>
                  {getOperatingStatus(selectedRestaurant.operatingHours).status}
                </span>
                <span className="ml-1 text-sm text-gray-600">({getOperatingStatus(selectedRestaurant.operatingHours).details})</span>
              </p>
            </div>

            {selectedRestaurant.services && selectedRestaurant.services.length > 0 && (
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Services & Features:</h3>
                <div className="flex flex-wrap gap-3">
                  {selectedRestaurant.services.map((service, index) => (
                    <span key={index} className="bg-purple-100 text-purple-800 text-md font-semibold px-4 py-1.5 rounded-full shadow-md">
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <h3 className="text-2xl font-bold text-gray-900 mb-4">Cuisine:</h3>
            <div className="flex flex-wrap gap-3 mb-6">
              {selectedRestaurant.cuisine.map((cuisine, index) => (
                <span key={index} className="bg-orange-600 text-white text-md font-semibold px-4 py-1.5 rounded-full shadow-md">
                  {cuisine}
                </span>
              ))}
            </div>

            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Offerings:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                <p className="flex items-center">
                  <FaMotorcycle className={`h-5 w-5 mr-3 ${selectedRestaurant.offersDelivery ? 'text-green-600' : 'text-gray-400'}`} />
                  <span className="font-semibold">Delivery:</span> {selectedRestaurant.offersDelivery ? 'Available' : 'Not Available'}
                </p>
                <p className="flex items-center">
                  <FaShoppingBag className={`h-5 w-5 mr-3 ${selectedRestaurant.isTakeaway ? 'text-green-600' : 'text-gray-400'}`} />
                  <span className="font-semibold">Takeaway:</span> {selectedRestaurant.isTakeaway ? 'Available' : 'Not Available'}
                </p>
                <p className="flex items-center">
                  <FaUtensils className={`h-5 w-5 mr-3 ${selectedRestaurant.servesTiffins ? 'text-green-600' : 'text-gray-400'}`} />
                  <span className="font-semibold">Serves Tiffins:</span> {selectedRestaurant.servesTiffins ? 'Yes' : 'No'}
                </p>
                <p className="flex items-center">
                  <FaLeaf className={`h-5 w-5 mr-3 ${selectedRestaurant.isVegetarian ? 'text-green-600' : 'text-gray-400'}`} />
                  <span className="font-semibold">Vegetarian:</span> {selectedRestaurant.isVegetarian ? 'Yes' : 'No'}
                </p>
                {selectedRestaurant.isTiffinOnly && (
                  <p className="flex items-center col-span-full">
                    <FaClock className="h-5 w-5 mr-3 text-orange-600" />
                    <span className="font-semibold">Tiffin Only:</span> Yes
                  </p>
                )}
              </div>
            </div>

            {selectedRestaurant.seatingAvailability && selectedRestaurant.seatingAvailability.length > 0 && (
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Seating Availability:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedRestaurant.seatingAvailability.map((seat, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm flex items-center">
                      <FaTable className="mr-3 text-blue-600" />
                      <p className="font-semibold text-gray-900">
                        {seat.type.charAt(0).toUpperCase() + seat.type.slice(1)}: {seat.capacity} capacity
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedRestaurant.offer && selectedRestaurant.offer.length > 0 && (
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Current Offers:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedRestaurant.offer.map((offer, index) => (
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

            {selectedRestaurant.taxesAndCharges && selectedRestaurant.taxesAndCharges.length > 0 && (
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Taxes & Charges:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedRestaurant.taxesAndCharges.map((tax, index) => (
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
            <p className="text-center font-medium text-xl">Select a restaurant to view its details.</p>
            <p className="text-md text-gray-400 mt-2">Click on any restaurant card from the left panel.</p>
          </div>
        )}
      </div>

      <CustomModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <div className="p-6 bg-white rounded-lg shadow-xl text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Confirm Deletion</h2>
          <p className="text-gray-700 mb-6">
            Are you sure you want to delete <span className="font-semibold">{restaurantToDelete?.name}</span>? This action cannot be undone.
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
          background: #ffe0b2;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #ffb74d;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #ffa726;
        }
      `}</style>
    </div>
  );
};
