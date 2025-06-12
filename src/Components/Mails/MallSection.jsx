import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// Placeholder images for malls
const defaultMallImage = "https://placehold.co/600x400/87CEEB/ffffff?text=Mall+Image";
const heroMallImage = "https://placehold.co/1200x500/A2D2FF/000000?text=Explore+Malls";

// Skeleton Card for Malls
const SkeletonMallCard = () => (
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

export const MallsSection = () => {
    const list = ['Malls', 'Offers & Deals', 'Events', 'Partner With Us'];
    const [activeIndex, setActiveIndex] = useState(0);

    const [malls, setMalls] = useState([]);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const scrollContainerRef = useRef(null);

    const [expandedFeatures, setExpandedFeatures] = useState(new Set());
    const [showFilterSidebar, setShowFilterSidebar] = useState(false);

    // --- Filter States aligned with MallSchema ---
    const [searchTerm, setSearchTerm] = useState(''); // name, locationName, address
    const [selectedMallTypes, setSelectedMallTypes] = useState(new Set()); // matches `mallType` enum
    const [selectedAmenities, setSelectedAmenities] = useState(new Set()); // matches `amenities` enum
    const [minRatingFilter, setMinRatingFilter] = useState(0); // rating
    const [minStoresFilter, setMinStoresFilter] = useState(''); // totalStores
    const [maxStoresFilter, setMaxStoresFilter] = useState(''); // totalStores
    const [minAreaFilter, setMinAreaFilter] = useState(''); // totalAreaSqFt
    const [maxAreaFilter, setMaxAreaFilter] = useState(''); // totalAreaSqFt
    const [offersAvailableFilter, setOffersAvailableFilter] = useState(false); // offersAvailable


    // --- MallSchema Enum Values for Filters ---
    // IMPORTANT: These should match the exact enum values defined in your Mongoose Schema
    const allMallTypes = ["Shopping Complex", "Department Store", "Strip Mall", "High Street Plaza"];
    const allMallAmenities = ["Parking", "Valet Parking", "Restrooms", "Wheelchair Accessible", "Wi-Fi", "ATM", "Concierge", "Lost & Found", "Changing Rooms"];


    const toggleFeatures = (mallId) => {
        setExpandedFeatures(prev => {
            const newSet = new Set(prev);
            if (newSet.has(mallId)) {
                newSet.delete(mallId);
            } else {
                newSet.add(mallId);
            }
            return newSet;
        });
    };

    const fetchMalls = async (reset = false) => {
        if (isLoading && !reset) {
            return;
        }

        setIsLoading(true);
        if (reset) {
            setMalls([]);
            setPage(1);
            setHasMore(true);
            setIsInitialLoading(true);
            setExpandedFeatures(new Set());
        }

        const currentPage = reset ? 1 : page;

        // --- Filter Parameters sent to backend ---
        const filterParams = {
            page: currentPage,
            limit: 15, // Number of malls to fetch per page
            ...(searchTerm && { searchTerm: searchTerm }), // Backend should handle searching across name, locationName, address
            ...(selectedMallTypes.size > 0 && { mallType: Array.from(selectedMallTypes).join(',') }),
            ...(selectedAmenities.size > 0 && { amenities: Array.from(selectedAmenities).join(',') }),
            ...(minRatingFilter > 0 && { minRating: minRatingFilter }),
            ...(minStoresFilter && { minStores: minStoresFilter }),
            ...(maxStoresFilter && { maxStores: maxStoresFilter }),
            ...(minAreaFilter && { minArea: minAreaFilter }),
            ...(maxAreaFilter && { maxArea: maxAreaFilter }),
            ...(offersAvailableFilter && { offersAvailable: offersAvailableFilter }), // Only send if true
        };

        console.log("Fetching malls with filters:", filterParams);

        try {
            const url = `${import.meta.env.VITE_SERVER_URL}/api/malls/all`;
            const response = await axios.get(url, {
                params: filterParams,
            });

            const data = response.data;
            console.log(data);
            if (data.malls && Array.isArray(data.malls) && data.malls.length > 0) {
                setMalls(prevMalls => (reset ? data.malls : [...prevMalls, ...data.malls]));
                setPage(prevPage => prevPage + 1);
            } else {
                setHasMore(false); // No malls returned or empty array
            }

            // Always use the hasMore from the backend response if available
            if (typeof data.hasMore === 'boolean') {
                setHasMore(data.hasMore);
            } else {
                // Fallback if backend doesn't explicitly send hasMore (less ideal)
                setHasMore(data.malls && data.malls.length === filterParams.limit);
            }

        } catch (error) {
            console.error("Error fetching malls:", error);
            // Optionally, set an error state to display to the user
            setHasMore(false); // Assume no more data on error
        } finally {
            setIsLoading(false);
            setIsInitialLoading(false);
        }
    };


    useEffect(() => {
        if (activeIndex === 0) { // Fetch malls only when the 'Malls' tab is active
            fetchMalls(true); // Always trigger a fresh fetch when activeIndex changes to Malls
        }
    }, [activeIndex]);

    useEffect(() => {
        const handleScroll = () => {
            if (scrollContainerRef.current) {
                const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;

                // Trigger fetch when user scrolls near the bottom of the content area
                if (scrollTop + clientHeight >= scrollHeight - 200 && hasMore && !isLoading && activeIndex === 0) {
                    fetchMalls();
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
    }, [isLoading, hasMore, activeIndex, page, searchTerm, selectedMallTypes, selectedAmenities, minRatingFilter, minStoresFilter, maxStoresFilter, minAreaFilter, maxAreaFilter, offersAvailableFilter]);

    const handleMallTypeChange = (type) => {
        setSelectedMallTypes(prev => {
            const newSet = new Set(prev);
            if (newSet.has(type)) {
                newSet.delete(type);
            } else {
                newSet.add(type);
            }
            return newSet;
        });
    };

    const handleAmenityChange = (amenity) => {
        setSelectedAmenities(prev => {
            const newSet = new Set(prev);
            if (newSet.has(amenity)) {
                newSet.delete(amenity);
            } else {
                newSet.add(amenity);
            }
            return newSet;
        });
    };

    const handleApplyFilters = () => {
        fetchMalls(true); // Reset and refetch with new filters
        setShowFilterSidebar(false);
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setSelectedMallTypes(new Set());
        setSelectedAmenities(new Set());
        setMinRatingFilter(0);
        setMinStoresFilter('');
        setMaxStoresFilter('');
        setMinAreaFilter('');
        setMaxAreaFilter('');
        setOffersAvailableFilter(false);
        fetchMalls(true); // Reset and refetch
        setShowFilterSidebar(false);
    };

    const renderContent = () => {
        switch (activeIndex) {
            case 0:
                return (
                    <>
                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {isInitialLoading ? (
                                Array.from({ length: 9 }).map((_, index) => <SkeletonMallCard key={index} />)
                            ) : (
                                malls.map((item) => {
                                    const mallId = item._id || item.id;
                                    const isExpanded = expandedFeatures.has(mallId);
                                    // Combine mallType and amenities for display, show only first 2 when collapsed
                                    const featuresToDisplay = isExpanded
                                        ? (item.mallType || []).concat(item.amenities || [])
                                        : (item.mallType || []).slice(0, 2); // Assuming mallType is an array in your DB
                                    const hasMoreFeatures = ((item.mallType?.length || 0) + (item.amenities?.length || 0)) > 2;


                                    return (
                                        <div
                                            key={mallId}
                                            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer"
                                            // Example: navigate to a mall details page
                                            onClick={() => window.open(`/showcase/page?type=mall/${item.name}/${mallId}/Overview`, '_blank')}
                                        >
                                            <img
                                                src={item.image || defaultMallImage}
                                                alt={item.name}
                                                className="w-full h-48 object-cover"
                                                loading="lazy"
                                                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x400/cccccc/333333?text=Image+Error"; }}
                                            />
                                            <div className="p-4">
                                                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.name}</h3>
                                                <p className="text-gray-600 text-sm flex items-center mb-2">
                                                    {/* MapPinIcon SVG */}
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-4 w-4 mr-1 text-gray-500">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                                    </svg>
                                                    {item.locationName}
                                                </p>
                                                <div className="flex flex-wrap gap-2 mb-2">
                                                    {featuresToDisplay.map((feature, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="inline-block bg-purple-100 text-purple-600 py-1 px-2 rounded-full text-xs font-semibold"
                                                        >
                                                            {feature}
                                                        </span>
                                                    ))}
                                                    {hasMoreFeatures && (
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation(); // Prevent card click when clicking this button
                                                                toggleFeatures(mallId);
                                                            }}
                                                            className="inline-block text-blue-600 text-sm font-semibold flex items-center px-2 py-1 rounded-full hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                                        >
                                                            {isExpanded ? (
                                                                <>
                                                                    {/* MinusCircleIcon SVG */}
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-4 w-4 mr-1">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                    </svg>
                                                                    Show Less
                                                                </>
                                                            ) : (
                                                                <>
                                                                    {/* PlusCircleIcon SVG */}
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-4 w-4 mr-1">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                    </svg>
                                                                    Show More
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
                                                    <button
                                                        className="text-gray-500 hover:text-red-500 focus:outline-none"
                                                        onClick={(e) => e.stopPropagation()} // Prevent card click
                                                    >
                                                        {/* HeartIcon SVG */}
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.815 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                                        </svg>
                                                    </button>
                                                </div>
                                                {item.offersAvailable && item.offers && ( // Display offers if offersAvailable is true and offers string exists
                                                    <div className="mt-3 text-sm text-green-600 font-semibold flex items-center">
                                                        {/* Tag Icon SVG (representing offers/deals) */}
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="mr-2 h-4 w-4">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.716 0L1 20.312v-.22A3 3 0 013.75 18h4.5c.35 0 .69.091 1 .252M21.75 16.122a3 3 0 00-5.716 0L19 20.312v-.22A3 3 0 0121.75 18h-4.5c.35 0 .69.091 1 .252M12 4.5c1.488 0 2.903.064 4.256.192C17.65 4.805 19 6.162 19 7.82V9h.75a2.25 2.25 0 012.25 2.25v2.5a2.25 2.25 0 01-2.25 2.25H12c-.75 0-1.5-.166-2.25-.47V7.82c0-1.658 1.35-3.015 2.903-3.128A18.8 18.8 0 0112 4.5z" />
                                                        </svg>
                                                        🎉 {item.offers}
                                                    </div>
                                                )}
                                                <div className="mt-2 text-sm text-yellow-500 font-semibold flex items-center">
                                                    {/* Star Icon SVG */}
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1">
                                                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.564 1.25 5.234c.23.958-.79 1.688-1.636 1.173L12 18.354l-4.606 2.766c-.846.515-1.866-.215-1.636-1.173l1.25-5.234-4.117-3.564c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.007z" clipRule="evenodd" />
                                                    </svg>
                                                    {item.rating}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {isLoading && !isInitialLoading && (
                            <p className="text-center py-4 text-blue-600">Loading more malls...</p>
                        )}
                        {!hasMore && malls.length > 0 && (
                            <p className="text-center py-4 text-gray-500">You've reached the end of the mall list.</p>
                        )}
                        {!isLoading && !isInitialLoading && malls.length === 0 && !hasMore && page === 1 && (
                            <p className="text-center py-4 text-gray-500">No malls found matching your criteria.</p>
                        )}
                    </>
                );
            case 1:
                return (
                    <div className="mt-8 text-center text-gray-700 p-8 bg-white rounded-lg shadow-md">
                        <h3 className="text-2xl font-bold mb-4">Exciting Offers & Deals Awaiting!</h3>
                        <p className="mb-4">Explore a wide range of discounts, exclusive vouchers, and seasonal sales from your favorite mall brands. Don't miss out on incredible savings!</p>
                        <button className="px-6 py-3 bg-red-500 text-white rounded-md font-semibold hover:bg-red-600 transition duration-300">
                            View All Deals
                        </button>
                        <div className="mt-8 text-sm text-gray-500">
                            (Content for specific offers, featured deals, etc., would be dynamically loaded here)
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="mt-8 text-center text-gray-700 p-8 bg-white rounded-lg shadow-md">
                        <h3 className="text-2xl font-bold mb-4">Upcoming Events at Malls Near You</h3>
                        <p className="mb-4">From festive celebrations and live music to workshops and product launches, discover all the exciting events happening in our partner malls.</p>
                        <button className="px-6 py-3 bg-green-500 text-white rounded-md font-semibold hover:bg-green-600 transition duration-300">
                            Browse Events Calendar
                        </button>
                        <div className="mt-8 text-sm text-gray-500">
                            (Content for event listings, dates, venues, etc., would be dynamically loaded here)
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="mt-8 p-8 bg-blue-100 rounded-lg shadow-md flex flex-col md:flex-row items-center gap-8">
                        <div className="md:w-1/2 text-center md:text-left">
                            <h3 className="text-2xl font-bold text-blue-800 mb-4">Become a Partner Mall!</h3>
                            <p className="text-blue-700 mb-6">
                                Are you a mall owner or a business looking to connect with a wider audience? Partner with us to showcase your mall, promote your stores, and highlight your unique offerings.
                                Reach thousands of potential visitors and elevate your online presence.
                            </p>
                            <button className="px-6 py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition duration-300">
                                Contact Our Partnership Team
                            </button>
                        </div>
                        <div className="md:w-1/2 flex justify-center">
                            <img src="https://placehold.co/400x250/90EE90/000000?text=Partnership+Image" alt="Partnership" className="rounded-lg shadow-lg w-full max-w-md object-cover" />
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="bg-gray-50 py-10 font-inter">
            <div className="container mx-auto px-4 mt-8">
                {/* Sticky Tabs and Filter Bar */}
                <div className="sticky top-0 z-30 bg-white shadow-md rounded-md px-4 md:px-10">
                    <div className="flex justify-between items-center py-3">
                        <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                            {list.map((item, index) => (
                                <button
                                    key={index}
                                    className={`flex-shrink-0 px-4 py-2 text-center cursor-pointer font-semibold text-gray-700 hover:text-blue-600 focus:outline-none ${
                                        activeIndex === index ? 'border-b-2 border-blue-500 text-blue-600' : ''
                                    }`}
                                    onClick={() => setActiveIndex(index)}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                        {activeIndex === 0 && (
                            <button
                                className="ml-auto flex items-center px-4 py-2 text-blue-600 font-semibold rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                onClick={() => setShowFilterSidebar(true)}
                            >
                                {/* Filter Icon SVG */}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mr-2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.757 0 5.257 1.116 7.071 2.929a8.974 8.974 0 010 12.126l-2.122 2.121-7.07-7.071-2.122-2.121a8.974 8.974 0 010-12.126C6.743 4.116 9.243 3 12 3zM12 7.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
                                </svg>
                                Filter
                            </button>
                        )}
                    </div>
                </div>

                {/* Scrollable Content Area */}
                <div
                    ref={scrollContainerRef}
                    style={{
                        maxHeight: '800px', // Adjust max height based on header/sticky bar
                        overflowY: 'auto',
                        paddingRight: '15px', // For scrollbar visibility
                    }}
                    className="relative px-4 md:px-0" // Add horizontal padding for smaller screens
                >
                    {renderContent()}
                </div>
            </div>
            {showFilterSidebar && activeIndex === 0 && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-40 flex justify-end" onClick={() => setShowFilterSidebar(false)}>
                    <div
                        className="bg-white w-full max-w-sm h-full overflow-y-auto shadow-xl transform transition-transform duration-300 ease-in-out translate-x-0"
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside sidebar
                    >
                        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-gray-900">Filter Malls</h3>
                            <button onClick={() => setShowFilterSidebar(false)} className="text-gray-500 hover:text-gray-700">
                                {/* Close Icon SVG */}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Search by Name/Location/Address Filter */}
                            <div>
                                <label htmlFor="searchTerm" className="block text-sm font-semibold text-gray-700 mb-2">Search by Name, Location, or Address</label>
                                <input
                                    type="text"
                                    id="searchTerm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="e.g., Phoenix, Delhi, Connaught Place"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>

                            {/* Mall Type Filter (formerly Category) */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Mall Type</label>
                                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border border-gray-200 rounded-md">
                                    {allMallTypes.map(type => (
                                        <div key={type} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id={type}
                                                checked={selectedMallTypes.has(type)}
                                                onChange={() => handleMallTypeChange(type)}
                                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            <label htmlFor={type} className="ml-2 text-sm text-gray-700">{type}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Amenities Filter */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Amenities & Services</label>
                                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border border-gray-200 rounded-md">
                                    {allMallAmenities.map(amenity => (
                                        <div key={amenity} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id={amenity}
                                                checked={selectedAmenities.has(amenity)}
                                                onChange={() => handleAmenityChange(amenity)}
                                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            <label htmlFor={amenity} className="ml-2 text-sm text-gray-700">{amenity}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Minimum Rating Filter */}
                            <div>
                                <label htmlFor="minRating" className="block text-sm font-semibold text-gray-700 mb-2">Minimum Rating: {minRatingFilter} Stars</label>
                                <input
                                    type="range"
                                    id="minRating"
                                    min="0"
                                    max="5"
                                    step="1"
                                    value={minRatingFilter}
                                    onChange={(e) => setMinRatingFilter(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:bg-blue-500 [&::-moz-range-thumb]:bg-blue-500"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>0</span>
                                    <span>1</span>
                                    <span>2</span>
                                    <span>3</span>
                                    <span>4</span>
                                    <span>5</span>
                                </div>
                            </div>

                            {/* Total Stores Filter */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Total Stores</label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        value={minStoresFilter}
                                        onChange={(e) => setMinStoresFilter(e.target.value)}
                                        className="w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        value={maxStoresFilter}
                                        onChange={(e) => setMaxStoresFilter(e.target.value)}
                                        className="w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                </div>
                            </div>

                            {/* Total Area Filter */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Total Area (Sq Ft)</label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        value={minAreaFilter}
                                        onChange={(e) => setMinAreaFilter(e.target.value)}
                                        className="w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        value={maxAreaFilter}
                                        onChange={(e) => setMaxAreaFilter(e.target.value)}
                                        className="w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                </div>
                            </div>

                            {/* Offers Available Filter */}
                            <div>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="offersAvailable"
                                        checked={offersAvailableFilter}
                                        onChange={(e) => setOffersAvailableFilter(e.target.checked)}
                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <label htmlFor="offersAvailable" className="ml-2 text-sm font-semibold text-gray-700">Show Malls with Offers</label>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-between mt-8 pt-4 border-t border-gray-200">
                                <button
                                    onClick={handleClearFilters}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-semibold text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-75"
                                >
                                    Clear Filters
                                </button>
                                <button
                                    onClick={handleApplyFilters}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
                                >
                                    Apply Filters
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};