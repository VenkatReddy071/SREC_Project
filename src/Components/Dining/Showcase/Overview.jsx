import React, { useState } from 'react'; // Import useState
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

import {
    Utensils, Wifi, ParkingCircle, Sun, Music, DoorClosed, Coffee, Bike, MapPin, CalendarDays, CheckCircle, XCircle, X // Import X for close button
} from 'lucide-react';

L.Marker.prototype.options.icon = L.icon({
    iconRetinaUrl,
    iconUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const serviceIcons = {
    'Dine-in': <Utensils className="w-5 h-5 text-indigo-600 mr-2" />,
    'WiFi': <Wifi className="w-5 h-5 text-indigo-600 mr-2" />,
    'Parking': <ParkingCircle className="w-5 h-5 text-indigo-600 mr-2" />,
    'Outdoor Seating': <Sun className="w-5 h-5 text-indigo-600 mr-2" />,
    'Live Music': <Music className="w-5 h-5 text-indigo-600 mr-2" />,
    'Private Dining': <DoorClosed className="w-5 h-5 text-indigo-600 mr-2" />,
    'Takeaway': <Coffee className="w-5 h-5 text-indigo-600 mr-2" />,
    'Delivery': <Bike className="w-5 h-5 text-indigo-600 mr-2" />,
};

export const RestaurantOverview = ({ restaurant }) => {
    // State for the image popup/modal
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState('');

    const openImageModal = (imageUrl) => {
        setCurrentImage(imageUrl);
        setIsImageModalOpen(true);
    };

    const closeImageModal = () => {
        setIsImageModalOpen(false);
        setCurrentImage('');
    };

    if (!restaurant) {
        return (
            <div className="text-center text-gray-600 p-8">
                <p>No restaurant data available.</p>
            </div>
        );
    }

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        return (
            <div className="flex items-center">
                {Array(fullStars).fill().map((_, i) => (
                    <svg key={`full-${i}`} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                ))}
                {hasHalfStar && (
                    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 15.27l-3.24 1.71.62-3.61L4.32 9.27l3.62-.52L10 5.27l2.06 3.48 3.62.52-2.67 2.5.62 3.61zM10 18.37l-5.69 3 1.09-6.26-4.54-4.43 6.27-.91L10 0l2.87 5.77 6.27.91-4.54 4.43 1.09 6.26z" />
                    </svg>
                )}
                {Array(emptyStars).fill().map((_, i) => (
                    <svg key={`empty-${i}`} className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                ))}
                <span className="ml-2 text-gray-600 text-sm">({restaurant.reviews} reviews)</span>
            </div>
        );
    };

    return (
        <div className="container mx-auto bg-white shadow-lg rounded-xl overflow-hidden my-8 p-4 sm:p-6 lg:p-8">
            {/* Removed the mainImage section as requested */}

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">{restaurant.name}</h1>
                    <div className="flex items-center mb-4">
                        {renderStars(restaurant.rating)}
                        {restaurant.isTopPick && (
                            <span className="ml-4 bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                                Top Pick
                            </span>
                        )}
                        {restaurant.closed && (
                            <span className="ml-4 bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                                Closed
                            </span>
                        )}
                    </div>
                    <p className="text-gray-700 text-lg mb-4 leading-relaxed">{restaurant.description}</p>
                </div>
            </div>
            <div className="flex flex-wrap gap-4 mb-8">
                {/* Check if there's any seating capacity before showing the button */}
                {restaurant.seatingAvailability && restaurant.seatingAvailability.length > 0 &&
                 restaurant.seatingAvailability.some(seat => seat.capacity > 0) && (
                    <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                        <CalendarDays className="w-5 h-5 mr-2" />
                        Book a Table
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gray-50 p-6 rounded-lg shadow-sm flex flex-col">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact & Location</h2>
                    <div className="space-y-2 text-gray-700 mb-4">
                        <p className="flex items-start">
                            <MapPin className="w-5 h-5 text-gray-600 mr-2 mt-1 flex-shrink-0" />
                            <span>
                                {restaurant.address.street}, {restaurant.address.city}, {restaurant.address.state}{' '}
                                {restaurant.address.zipCode}
                            </span>
                        </p>
                        {restaurant.phone && <p><strong>Phone:</strong> {restaurant.phone}</p>}
                        {restaurant.email && <p><strong>Email:</strong> {restaurant.email}</p>}
                    </div>

                    {(restaurant.latitude !== undefined && restaurant.latitude !== null && restaurant.longitude !== undefined && restaurant.longitude !== null) ? (
                        <div>
                            <h3 className="text-2xl font-bold text-blue-700 mb-4">Location Map</h3>
                            <div className="w-full h-64 rounded-lg overflow-hidden border border-blue-100 z-10">
                                <MapContainer
                                    center={[restaurant.latitude, restaurant.longitude]}
                                    zoom={15}
                                    scrollWheelZoom={false}
                                    className="w-full h-full z-10"
                                    
                                    key={`${restaurant.latitude}-${restaurant.longitude}`}
                                >
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    <Marker position={[restaurant.latitude, restaurant.longitude]}>
                                        <Popup>
                                            <strong>{restaurant.name}</strong> <br />
                                            {restaurant.address.street}, {restaurant.address.city}
                                        </Popup>
                                    </Marker>
                                </MapContainer>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-center">
                            Map coordinates not available.
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-8">
                    {restaurant.imageUrls?.menuImages && restaurant.imageUrls.menuImages.length > 0 && (
                        <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Our Menu</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {restaurant.imageUrls.menuImages.map((imageUrl, index) => (
                                    <div
                                        key={index}
                                        className="rounded-lg overflow-hidden shadow-md cursor-pointer hover:shadow-lg transition-shadow"
                                        onClick={() => openImageModal(imageUrl)} // Open modal on click
                                    >
                                        <img
                                            src={imageUrl}
                                            alt={`Menu Image ${index + 1}`}
                                            className="w-full h-40 object-cover"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = `https://placehold.co/400x300/E0E0E0/333333?text=Menu+Image`;
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}


                    <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Cuisine</h2>
                        <div className="space-y-2 text-gray-700">
                            {restaurant.cuisine && restaurant.cuisine.length > 0 ? (
                                <p>{restaurant.cuisine.join(', ')}</p>
                            ) : (
                                <p>Cuisine information not available.</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Services & Features</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                            <p className="flex items-center">
                                {restaurant.offersDelivery ? <CheckCircle className="w-5 h-5 text-green-500 mr-2" /> : <XCircle className="w-5 h-5 text-red-500 mr-2" />}
                                Offers Delivery
                            </p>
                            <p className="flex items-center">
                                {restaurant.isTakeaway ? <CheckCircle className="w-5 h-5 text-green-500 mr-2" /> : <XCircle className="w-5 h-5 text-red-500 mr-2" />}
                                Takeaway Available
                            </p>
                            <p className="flex items-center">
                                {restaurant.servesTiffins ? <CheckCircle className="w-5 h-5 text-green-500 mr-2" /> : <XCircle className="w-5 h-5 text-red-500 mr-2" />}
                                Serves Tiffins
                            </p>
                            <p className="flex items-center">
                                {restaurant.isTiffinOnly ? <CheckCircle className="w-5 h-5 text-green-500 mr-2" /> : <XCircle className="w-5 h-5 text-red-500 mr-2" />}
                                Tiffin Only
                            </p>
                            <p className="flex items-center">
                                {restaurant.isVegetarian ? <CheckCircle className="w-5 h-5 text-green-500 mr-2" /> : <XCircle className="w-5 h-5 text-red-500 mr-2" />}
                                Pure Vegetarian
                            </p>
                        </div>
                        {restaurant.services && restaurant.services.length > 0 && (
                            <div className="mt-6">
                                <h3 className="font-medium text-gray-700 mb-3">Other Services:</h3>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-gray-600">
                                    {restaurant.services.map((service) => (
                                    
                                        <li key={service} className="flex items-center">
                                            {serviceIcons[service] || <span className="mr-2 text-gray-500">&#8226;</span> /* Fallback icon */}
                                            {service}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {isImageModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="relative bg-white rounded-lg p-2 max-w-full max-h-full overflow-auto">
                        <button
                            onClick={closeImageModal}
                            className="absolute top-2 right-2 p-1 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-800"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <img
                            src={currentImage}
                            alt="Full Screen Menu"
                            className="max-w-[90vw] max-h-[90vh] object-contain z-50" // Use object-contain to fit image within bounds
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `https://placehold.co/800x600/E0E0E0/333333?text=Image+Load+Failed`;
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};