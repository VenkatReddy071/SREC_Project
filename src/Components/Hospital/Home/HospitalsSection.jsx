

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const HeaderImg = "https://placehold.co/600x400/add8e6/ffffff?text=Hospital+Image";


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
  const [expandedSpecialties, setExpandedSpecialties] = useState(new Set());

  // State for filter sidebar visibility
  const [showFilterSidebar, setShowFilterSidebar] = useState(false);

  // States for filter criteria
  // Renamed from locationFilter to searchTerm for combined name/location search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialties, setSelectedSpecialties] = useState(new Set());
  const [minRatingFilter, setMinRatingFilter] = useState(0); // 0 to 5
  const [ambulanceFilter, setAmbulanceFilter] = useState(false);

  // Common specializations for filter options
  const allSpecializations = [
    'Cardiology', 'Orthopedics', 'Pediatrics', 'Oncology', 'Neurology',
    'General Surgery', 'Dermatology', 'Gastroenterology', 'Urology', 'Ophthalmology',
    'ENT', 'Pulmonology', 'Nephrology', 'Endocrinology', 'Psychiatry'
  ];

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

  // Function to fetch hospitals with applied filters
  const fetchHospitals = async (reset = false) => {
    if (isLoading && !reset) {
      return;
    }

    setIsLoading(true);
    // If resetting, clear hospitals array and set page to 1
    if (reset) {
      setHospitals([]);
      setPage(1);
      setHasMore(true);
      setIsInitialLoading(true); // Indicate initial loading for new filter set
      setExpandedSpecialties(new Set()); // Reset expanded state
    }

    // Determine the current page for the API call
    const currentPage = reset ? 1 : page;

    // Prepare filter parameters
    const filterParams = {
      page: currentPage,
      limit: 15,
      // Pass searchTerm for combined name/location search
      ...(searchTerm && { searchTerm: searchTerm }),
      ...(selectedSpecialties.size > 0 && { specialization: Array.from(selectedSpecialties).join(',') }), // Convert Set to comma-separated string
      ...(minRatingFilter > 0 && { minRating: minRatingFilter }),
      ...(ambulanceFilter && { ambulance: true }),
    };
    console.log(filterParams);
    try {
      const url = `${import.meta.env.VITE_SERVER_URL}`;
      const response = await axios.get(`${url}/api/hospitals/all`, {
        params: filterParams,
      });

      const data = response.data;
      console.log(data);
      if (data.hospitals && Array.isArray(data.hospitals) && data.hospitals.length > 0) {
        setHospitals(prevHospitals => (reset ? data.hospitals : [...prevHospitals, ...data.hospitals]));
        setPage(prevPage => prevPage + 1);
      } else {
        setHasMore(false);
      }

      if (typeof data.hasMore === 'boolean') {
        setHasMore(data.hasMore);
      } else {
        setHasMore(data.hospitals && data.hospitals.length === filterParams.limit);
      }

    } catch (error) {
      console.error("Error fetching hospitals:", error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
      setIsInitialLoading(false);
    }
  };

  useEffect(() => {
    if (activeIndex === 0) {
      fetchHospitals(true);
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
  }, [isLoading, hasMore, activeIndex, page, searchTerm, selectedSpecialties, minRatingFilter, ambulanceFilter]);

  const handleSpecialtyChange = (specialty) => {
    setSelectedSpecialties(prev => {
      const newSet = new Set(prev);
      if (newSet.has(specialty)) {
        newSet.delete(specialty);
      } else {
        newSet.add(specialty);
      }
      return newSet;
    });
  };

  const handleApplyFilters = () => {
    fetchHospitals(true);
    setShowFilterSidebar(false);
  };

  const handleClearFilters = () => {
    setSearchTerm(''); // Reset searchTerm
    setSelectedSpecialties(new Set());
    setMinRatingFilter(0);
    setAmbulanceFilter(false);
    fetchHospitals(true);
    setShowFilterSidebar(false);
  };

  const renderContent = () => {
    switch (activeIndex) {
      case 0:
        return (
          <>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {isInitialLoading || isLoading ? (
                Array.from({ length: 9 }).map((_, index) => <SkeletonCard key={index} />)
              ) : (
                hospitals.map((item) => {
                  const hospitalId = item._id || item.id;
                  const isExpanded = expandedSpecialties.has(hospitalId);
                  const specialtiesToDisplay = isExpanded ? item.specialization : item.specialization?.slice(0, 2);
                  const hasMoreSpecialties = item?.specialization?.length > 2;

                  return (
                    <div
                      key={hospitalId}
                      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer"
                      onClick={() => window.open(`/showcase/page?type=hospital/${item.name}/${hospitalId}/Overview`, '_blank')}
                    >
                      <img
                        src={item.image || HeaderImg}
                        alt={item.name}
                        className="w-full h-48 object-cover"
                        loading="lazy"
                        onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/600x400/cccccc/333333?text=Image+Error"; }}
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
                                e.stopPropagation();
                                toggleSpecialties(hospitalId);
                              }}
                              className=" text-blue-600 text-sm font-semibold flex items-center px-2 py-1 rounded-full hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                            >
                              {isExpanded ? (
                                <>
                                  
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
                            onClick={(e) => e.stopPropagation()}
                          >
                            {/* HeartIcon SVG */}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.815 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                            </svg>
                          </button>
                        </div>
                        {item.offers && (
                          <div className="mt-3 text-sm text-green-600 font-semibold flex items-center">
                            {/* FaStethoscope SVG */}
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" className="mr-2 h-4 w-4">
                              <path d="M439.4 0H72.6C32.4 0 0 32.4 0 72.6V439.4C0 479.6 32.4 512 72.6 512H439.4C479.6 512 512 479.6 512 439.4V72.6C512 32.4 479.6 0 439.4 0zM192 192C192 183.2 189.6 174.4 184.9 167.3L159.2 125.7C154.5 118.6 148.9 113 141.8 108.3C134.7 103.6 125.9 101.2 117.1 101.2C98.1 101.2 78.4 117.2 78.4 136.2C78.4 145 80.8 153.8 85.5 160.9L111.2 202.5C115.9 209.6 121.5 215.2 128.6 219.9C135.7 224.6 144.5 227 153.3 227C172.3 227 192 211 192 192zM433.6 256H78.4C69 256 64 261.2 64 270.6V384C64 393.4 69 398.6 78.4 398.6H433.6C443 398.6 448 393.4 448 384V270.6C448 261.2 443 256 433.6 256zM320 288C320 280.9 317.1 274.6 311.4 268.9C305.7 263.2 299.1 260 291.5 260C283.9 260 277.3 263.2 271.6 268.9C265.9 274.6 263 280.9 263 288C263 295.1 265.9 301.4 271.6 307.1C277.3 312.8 283.9 316 291.5 316C299.1 316 305.7 312.8 311.4 307.1C317.1 301.4 320 295.1 320 288zM416 288C416 280.9 413.1 274.6 407.4 268.9C401.7 263.2 395.1 260 387.5 260C379.9 260 373.3 263.2 367.6 268.9C361.9 274.6 359 280.9 359 288C359 295.1 361.9 301.4 367.6 307.1C373.3 312.8 379.9 316 387.5 316C395.1 316 401.7 312.8 407.4 307.1C413.1 301.4 416 295.1 416 288z"/>
                            </svg>
                            🎉 {item.offers}
                          </div>
                        )}
                      </div>
                    </div>
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
              <p className="text-center py-4 text-gray-500">No hospitals found matching your criteria.</p>
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
    <div className="bg-gray-50 py-10 font-inter">
      <div className="container mx-auto px-4">
        <h2 className="text-base font-semibold text-blue-500 text-center mb-2">View list of Hospitals</h2>
        <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl text-center text-gray-900 mb-4">
          Explore Our Hospital Services
        </h1>
        <h2 className="text-lg text-gray-600 text-center mb-8">Stay updated with our expert health articles</h2>

        <div className="sticky top-0  z-10 bg-white shadow-md rounded-md px-10">
          <div className="flex  gap-4 py-3">
            {list.map((item, index) => (
              <button
                key={index}
                className={`md:px-4 md:py-2 text-center cursor-pointer font-semibold text-gray-700 hover:text-blue-600 focus:outline-none ${
                  activeIndex === index ? 'border-b-2 border-blue-500 text-blue-600' : ''
                }`}
                onClick={() => setActiveIndex(index)}
              >
                {item}
              </button>
            ))}
            {activeIndex === 0 && (
              <button
                className="hidden  md:ml-auto md:flex items-center md:px-4 py-2 text-blue-600 font-semibold rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
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

        <div
          ref={scrollContainerRef}
          style={{
            maxHeight: '900px',
            overflowY: 'auto',
            marginTop: '2rem',
            paddingRight: '15px',
            marginLeft:'0.2rem'
          }}
          className="relative"
        >
          {renderContent()}
        </div>
      </div>

      {/* Filter Sidebar */}
      {showFilterSidebar && activeIndex === 0 && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-40 flex justify-end" onClick={() => setShowFilterSidebar(false)}>
          <div
            className="bg-white w-full max-w-sm h-full overflow-y-auto shadow-xl transform transition-transform duration-300 ease-in-out translate-x-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Filter Hospitals</h3>
              <button onClick={() => setShowFilterSidebar(false)} className="text-gray-500 hover:text-gray-700">
                {/* Close Icon SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Search by Name/Location Filter */}
              <div>
                <label htmlFor="searchTerm" className="block text-sm font-semibold text-gray-700 mb-2">Search by Name or Location</label>
                <input
                  type="text"
                  id="searchTerm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="e.g., Apollo, Delhi"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              {/* Specialization Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Specialization & Services</label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border border-gray-200 rounded-md">
                  {allSpecializations.map(specialty => (
                    <div key={specialty} className="flex items-center">
                      <input
                        type="checkbox"
                        id={specialty}
                        checked={selectedSpecialties.has(specialty)}
                        onChange={() => handleSpecialtyChange(specialty)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor={specialty} className="ml-2 text-sm text-gray-700">{specialty}</label>
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
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-thumb-blue-500"
                  style={{'--range-thumb-bg': '#3b82f6'}}
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

              {/* Ambulance Filter */}
              <div>
                <label htmlFor="ambulance" className="flex items-center text-sm font-semibold text-gray-700">
                  <input
                    type="checkbox"
                    id="ambulance"
                    checked={ambulanceFilter}
                    onChange={(e) => setAmbulanceFilter(e.target.checked)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2">Ambulance Service Available</span>
                </label>
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
