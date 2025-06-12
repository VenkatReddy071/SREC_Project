import React, { useEffect, useRef } from 'react';
import Heading from "../../../assets/header3.jpg"
import {
    Clock, Phone, Mail, Globe, MapPin, Store, Ruler, ShoppingBag,
    Book, Shirt, Gift, Baby, CreditCard, Car, Info, Star, Accessibility,
    Armchair, Bell, Search, HandHelping, Landmark,
    Footprints
} from 'lucide-react';

const OverviewPage = ({ mallData }) => {

    const currentMallData = { ...mallData };
    const popularProducts = [
        {
            id: 1,
            name: "Trendy T-Shirt",
            description: "Comfortable and stylish, perfect for any occasion.",
            price: 1299,
            image: "https://images.unsplash.com/photo-1571434919131-04283c713b77?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
            id: 2,
            name: "Smartwatch Pro",
            description: "Stay connected and track your fitness with ease.",
            price: 9999,
            image: "https://images.unsplash.com/photo-1546868871-705a639b7d8d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
            id: 3,
            name: "Designer Handbag",
            description: "Elegance meets functionality in this exquisite piece.",
            price: 4500,
            image: "https://images.unsplash.com/photo-1596700540455-d3527787f0b8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
            id: 4,
            name: "Noise-Cancelling Headphones",
            description: "Immerse yourself in pure audio bliss.",
            price: 7500,
            image: "https://images.unsplash.com/photo-1620025340639-66c2306231e3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
    ];

    // Ref to hold the image elements for IntersectionObserver
    const imgRefs = useRef([]);

    // Map for amenities to their respective Lucide icons
    const amenityIcons = {
        "Wheelchair Accessible": Accessibility,
        "ATM": CreditCard,
        "Changing Rooms": Shirt,
        "Lost & Found": Search,
        "Parking": Car,
        "Concierge": Bell,
    };
    const departmentIcons = {
        "Books": Book,
        "Footwear": Footprints,
        "Accessories": HandHelping,
        "Gifts": Gift,
        "Kids": Baby,
    };

    // Effect hook for lazy loading images
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            },
            {
                rootMargin: '0px 0px 50px 0px',
            }
        );

        imgRefs.current.forEach((img) => {
            if (img) {
                observer.observe(img);
            }
        });

        return () => {
            if (imgRefs.current) {
                imgRefs.current.forEach((img) => {
                    if (img) {
                        observer.unobserve(img);
                    }
                });
            }
            observer.disconnect();
        };
    }, [popularProducts]);

    // Function to handle image loading errors
    const handleImageError = (e) => {
        e.target.onerror = null;
        e.target.src = `https://placehold.co/400x300/ADD8E6/000000?text=Image+Error`; // Updated fallback placeholder
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8  min-h-screen"> {/* Changed main background to light blue */}
            {/* Main container with responsive padding and max-width */}
            <div className="max-w-6xl mx-auto  rounded-2xl overflow-hidden transform transition-all duration-300 hover:shadow-3xl">
                {/* Mall Header Section */}
                <header className="relative bg-gradient-to-br from-blue-700 to-blue-900 text-white p-8 md:p-12 rounded-t-2xl"> {/* Stronger blue gradient */}
                    {/* Background image for header */}
                    <img
                        src={Heading}
                        alt={`${currentMallData.name} Main Entrance`}
                        className="absolute inset-0 w-full h-full object-cover opacity-30 rounded-t-2xl"
                        onError={handleImageError}
                    />
                    <div className="relative z-10 text-center">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-3 leading-tight drop-shadow-lg">
                            {currentMallData.name}
                        </h1>
                        <p className="text-xl sm:text-2xl font-light opacity-90 mb-4">
                            Your Premier Shopping Destination in {currentMallData.locationName}
                        </p>
                        {/* Mall Rating */}
                        <div className="flex items-center justify-center mt-4">
                            {/* Render stars based on rating */}
                            {[...Array(5)]?.map((_, i) => (
                                <Star
                                    key={i}
                                    className={`text-3xl ${i < Math.floor(currentMallData.rating) ? 'text-yellow-300 fill-current' : 'text-gray-400 opacity-60'}`}
                                    fill={i < Math.floor(currentMallData.rating) ? 'currentColor' : 'none'}
                                />
                            ))}
                            <span className="ml-3 text-2xl font-semibold drop-shadow-md">{currentMallData?.rating?.toFixed(2)}/5</span>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="p-6 md:p-10 lg:p-12">
                    {/* Mall Information Section */}
                    <section className="mb-10 p-7 bg-white rounded-xl shadow-md border border-blue-100"> {/* Changed background to white */}
                        <h2 className="text-3xl sm:text-4xl font-bold text-blue-800 mb-6 text-center">About {currentMallData.name}</h2> {/* Changed heading color */}
                        <p className="text-gray-700 leading-relaxed text-lg mb-6 text-center">
                            {currentMallData.description}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 text-gray-700">
                            <div className="space-y-3">
                                <p className="flex items-center gap-2">
                                    <MapPin className="text-blue-600 size-5" /> {/* Changed icon color */}
                                    <strong className="font-semibold text-gray-900">Address:</strong> {currentMallData.address}, {currentMallData.locationName}, {currentMallData.area}, {currentMallData.pincode}
                                </p>
                                <p className="flex items-center gap-2">
                                    <Phone className="text-blue-600 size-5" /> {/* Changed icon color */}
                                    <strong className="font-semibold text-gray-900">Contact:</strong> {currentMallData.phoneNumber}
                                </p>
                                <p className="flex items-center gap-2">
                                    <Mail className="text-blue-600 size-5" /> {/* Changed icon color */}
                                    <strong className="font-semibold text-gray-900">Email:</strong> {currentMallData.email}
                                </p>
                                <p className="flex items-center gap-2">
                                    <Globe className="text-blue-600 size-5" /> {/* Changed icon color */}
                                    <strong className="font-semibold text-gray-900">Website:</strong> <a href={currentMallData.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline transition duration-200">{currentMallData.website}</a>
                                </p>
                            </div>
                            <div className="space-y-3">
                                <p className="flex items-center gap-2">
                                    <Clock className="text-blue-600 size-5" /> {/* Changed icon color */}
                                    <strong className="font-semibold text-gray-900">Opening Hours:</strong> {currentMallData.openingHours}
                                </p>
                                <p className="flex items-center gap-2">
                                    <Store className="text-blue-600 size-5" /> {/* Changed icon color */}
                                    <strong className="font-semibold text-gray-900">Mall Type:</strong> {currentMallData.mallType?.join(', ')}
                                </p>
                                <p className="flex items-center gap-2">
                                    <ShoppingBag className="text-blue-600 size-5" /> {/* Changed icon color */}
                                    <strong className="font-semibold text-gray-900">Total Stores:</strong> {currentMallData.totalStores}
                                </p>
                                <p className="flex items-center gap-2">
                                    <Ruler className="text-blue-600 size-5" /> {/* Changed icon color */}
                                    <strong className="font-semibold text-gray-900">Total Area:</strong> {currentMallData?.totalAreaSqFt?.toLocaleString()} sq ft
                                </p>
                            </div>
                        </div>

                        <h3 className="text-2xl font-semibold text-blue-800 mt-8 mb-4 border-b-2 pb-2 border-blue-200">Amenities</h3> {/* Changed heading color */}
                        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-gray-700">
                            {currentMallData.amenities?.map((amenity, index) => {
                                const Icon = amenityIcons[amenity] || Info;
                                return (
                                    <li key={index} className="flex items-center gap-2">
                                        <Icon className="text-blue-500 size-5" /> {/* Changed icon color */}
                                        <span>{amenity}</span>
                                    </li>
                                );
                            })}
                        </ul>

                        <h3 className="text-2xl font-semibold text-blue-800 mt-8 mb-4 border-b-2 pb-2 border-blue-200">Shopping Departments</h3> {/* Changed heading color */}
                        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-gray-700">
                            {currentMallData.shoppingDepartments?.map((department, index) => {
                                const Icon = departmentIcons[department] || Landmark;
                                return (
                                    <li key={index} className="flex items-center gap-2">
                                        <Icon className="text-blue-500 size-5" /> {/* Changed icon color */}
                                        <span>{department}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    </section>

                    <hr className="my-10 border-blue-300 border-dashed" /> {/* Changed divider color */}

                    {/* Popular Products Section - Moved to top */}
                    <section className="mb-10">
                        <h2 className="text-3xl sm:text-4xl font-bold text-blue-800 mb-8 text-center">Popular Products</h2> {/* Changed heading color */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
                            {popularProducts.map((product, index) => (
                                <div key={product.id} className="bg-white rounded-xl shadow-xl overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl border border-blue-200"> {/* Changed border color */}
                                    <img
                                        ref={(el) => (imgRefs.current[index] = el)}
                                        className="w-full h-48 object-cover lazy-img"
                                        src="https://placehold.co/400x300/ADD8E6/000000?text=Loading..."
                                        data-src={product.image}
                                        alt={product.name}
                                        onError={handleImageError}
                                    />
                                    <div className="p-6">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h3>
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                                        <div className="flex justify-between items-center mt-3">
                                            <span className="text-2xl font-bold text-blue-700">₹{product.price.toLocaleString()}</span> {/* Changed price color */}
                                            <button className="bg-blue-500 hover:bg-blue-600 text-white text-base font-medium py-2.5 px-6 rounded-full shadow-md hover:shadow-lg transition duration-200 ease-in-out">Add to Cart</button> {/* Changed button colors */}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <hr className="my-10 border-blue-300 border-dashed" /> {/* Changed divider color */}

                    {/* Show All Products Button - Remains at bottom of main content area */}
                    <section className="text-center">
                        <h2 className="text-3xl sm:text-4xl font-bold text-blue-800 mb-5">Discover More</h2> {/* Changed heading color */}
                        <p className="text-gray-700 text-lg mb-8">Ready to see everything we have to offer?</p>
                        <a href="#" className="inline-block bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold py-3 px-10 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-300"> {/* Changed button colors and text */}
                            Show All Products
                        </a>
                    </section>
                </main>
                {/* Footer section removed as requested */}
            </div>
        </div>
    );
};

export default OverviewPage;
