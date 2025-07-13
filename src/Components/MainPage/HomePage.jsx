// import React, { useState,useRef,useEffect } from 'react';
// import {Link} from "react-router-dom"
// import HeaderImage from '../../assets/Header.jpg';

// const SearchIcon = () => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     fill="none"
//     viewBox="0 0 24 24"
//     strokeWidth={2}
//     stroke="currentColor"
//     className="w-6 h-6 text-gray-500"
//   >
//     <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
//   </svg>
// );

// const getPlaceholderImage = (width = 100, height = 100) => `https://placehold.co/${width}x${height}/E0E0E0/333333?text=No+Image`;

// const HomePage = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [searchResults, setSearchResults] = useState({
//     restaurants: [],
//     malls: [],
//     hospitals: [],
//     schools: [],
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [showDropdown, setShowDropdown] = useState(false);

//   const searchContainerRef = useRef(null);

//   const handleSearchSubmit = async (e) => {
//     e.preventDefault(); 
//     if (!searchTerm.trim()) {
//       setSearchResults({ restaurants: [], malls: [], hospitals: [], schools: [] });
//       setShowDropdown(false);
//       return;
//     }

//     setIsLoading(true);
//     setError(null);
//     const baseURL =import.meta.env.VITE_SERVER_URL;

//     try {
//       const apiUrl = `${baseURL}/api/search/all?q=${encodeURIComponent(searchTerm)}`;
//       const response = await fetch(apiUrl, {
//         method: 'GET',
//         headers: { 'Content-Type': 'application/json' },
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       setSearchResults(data);
//       setShowDropdown(true); 
//     } catch (err) {
//       console.error('Error fetching search results:', err);
//       setError('Failed to fetch data. Please try again.');
//       setSearchResults({ restaurants: [], malls: [], hospitals: [], schools: [] });
//       setShowDropdown(false);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (!searchTerm.trim()) {
//       setSearchResults({ restaurants: [], malls: [], hospitals: [], schools: [] });
//       setShowDropdown(false);
//     }
//   }, [searchTerm]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
//         setShowDropdown(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [searchContainerRef]);

//   const renderItem = (item, type,link) => {
//     console.log(item);
//     let addressDisplay = '';
//     let renderType=item?._doc?.institutionType;
//     if(type==='School/College'){
//       link=link+renderType;
//     }
//     console.log(link);
//     const name=item?.name || item?._doc?.name;
//     const id=item?._id || item?._doc?._id;
//     switch(type) {
//       case 'Restaurant':
//         addressDisplay = `${item.address?.street ? item.address.street + ', ' : ''}${item.address?.city || ''}`;
//         break;
//       case 'Mall':
//         addressDisplay = item.address || '';
//         break;
//       case 'Hospital':
//         addressDisplay = `${item.address || item?._doc?.address}${item.locationName ? ', ' + item.locationName : ',' + item?._doc?.locationName}`;
//         break;
//       case 'School/College':
//         addressDisplay = item?._doc?.location || '';
//         break;
//       default:
//         addressDisplay = '';
//     }

//     return (
//       <Link to={`${link}/${name}/${id}/Overview`}>
//       <div key={item.id} className="bg-white md:p-2 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 flex items-center gap-2 md:gap-4 lg:p-4">
//         {(item.image || (item?.imageUrls && item?.imageUrls?.mainImage) || item?._doc?.image) ? (
//           <img
//             src={item?.image || item.imageUrls?.mainImage ||item?._doc?.image }
//             alt={item.name}
//             className=" w-12 h-12 md:w-24 md:h-24 object-cover rounded-md shadow-sm shadow-black/40 flex-shrink-0"
//             onError={(e) => { e.target.onerror = null; e.target.src = getPlaceholderImage(96, 96); }}
//           />
//         ) : (
//           <img src={getPlaceholderImage(96, 96)} alt="No image available" className="w-24 h-24 object-cover rounded-md shadow-sm shadow-black/40 flex-shrink-0" />
//         )}
        
//         <div className="flex-grow flex items-center justify-between">
//           <div>
//             <h4 className="text-base md:text-lg font-semibold text-black">{item.name? item.name : item?._doc?.name}</h4>
//             <p className="text-xs text-blue-600 mb-1">{type}</p>
//             <p className="text-gray-700 text-sm">{addressDisplay}</p>
//           </div>

//           <div className="flex-shrink-0 text-right">
//             <p className="text-sm md:text-lg font-bold text-blue-700">{item.rating ? item.rating :item?._doc?.rating} / 5</p>
//             <span className="text-yellow-500">★</span>
//           </div>
//         </div>
//       </div>
//       </Link>
//     );
//   };

//   const hasResults = Object.values(searchResults).some(arr => arr.length > 0);

//   return (
//     <div className="min-h-screen bg-gradient-to-br  font-sans text-gray-900">
//       <div className="relative w-full h-[500px] md:h-[550px] overflow-hidden flex items-center justify-center">
//         <div className="absolute inset-0 bg-black opacity-40 z-0"></div> 
//         <img src={HeaderImage} alt="Nandyal Cityscape" className="absolute inset-0 w-full h-full object-cover z-0" />

//         <div className="relative z-10 flex flex-col justify-center items-center text-white p-4 sm:p-6 md:p-8 text-shadow-lg">
//           <h1 className="text-5xl md:text-7xl font-extrabold text-center mb-8 drop-shadow-lg font-serif tracking-tight">
//             NANDYAL INFO
//           </h1>

//           <form onSubmit={handleSearchSubmit} className="relative w-full max-w-4xl md:max-w-2xl mb-12 px-4" ref={searchContainerRef}>
//             <input
//               type="text"
//               placeholder="Search for restaurants, schools, hospitals, malls..."
//               className="w-full p-4 pl-14 pr-6 bg-white border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 text-lg shadow-sm
//                         transition-all duration-300 ease-in-out hover:border-blue-400 transform hover:scale-102 placeholder-gray-500"
//               value={searchTerm}
//               onChange={(e) => {
//                 setSearchTerm(e.target.value);
//                 if (e.target.value.trim()) setShowDropdown(true); 
//               }}
//               onFocus={() => { if (searchTerm.trim() && hasResults) setShowDropdown(true); }} 
//             />
//             <button
//               type="submit"
//               aria-label="Submit search"
//               className="absolute left-6 top-1/2 -translate-y-1/2 cursor-pointer text-blue-600 hover:text-blue-800 transition-colors duration-200"
//             >
//               <SearchIcon />
//             </button>

//             {showDropdown && (isLoading || hasResults || (searchTerm.trim() && !isLoading && !hasResults)) && (
//               <div className="absolute left-0 right-0 mt-1 bg-white rounded-xl shadow-md max-h-60 overflow-y-auto z-50 border border-gray-200 animate-fade-in-down">
//                 {isLoading && (
//                   <div className="p-4 text-center text-blue-600 flex items-center justify-center">
//                     <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                     </svg>
//                     Loading results...
//                   </div>
//                 )}
//                 {error && (
//                   <div className="p-4 text-center text-red-500 border-b border-gray-100">{error}</div>
//                 )}
//                 {!isLoading && !error && hasResults && (
//                   <>
//                     {searchResults.restaurants.length > 0 && (
//                       <div className="p-4 border-b border-gray-100 last:border-b-0">
//                         <h3 className="text-xl font-bold text-blue-700 mb-3 border-b-2 border-blue-100 pb-2">Restaurants ({searchResults.restaurants.length})</h3>
//                         <div className="grid grid-cols-1 gap-4">
//                           {searchResults.restaurants.map(item => renderItem(item, 'Restaurant','/showcase/page?type=restaurant'))}
//                         </div>
//                       </div>
//                     )}
//                     {searchResults.malls.length > 0 && (
//                       <div className="p-4 border-b border-gray-100 last:border-b-0">
//                         <h3 className="text-xl font-bold text-blue-700 mb-3 border-b-2 border-blue-100 pb-2">Malls ({searchResults.malls.length})</h3>
//                         <div className="grid grid-cols-1 gap-4">
//                           {searchResults.malls.map(item => renderItem(item, 'Mall','/showcase/page?type=mall'))}
//                         </div>
//                       </div>
//                     )}
//                     {searchResults.hospitals.length > 0 && (
//                       <div className="p-4 border-b border-gray-100 last:border-b-0">
//                         <h3 className="text-xl font-bold text-blue-700 mb-3 border-b-2 border-blue-100 pb-2">Hospitals ({searchResults.hospitals.length})</h3>
//                         <div className="grid grid-cols-1 gap-4">
//                           {searchResults.hospitals.map(item => renderItem(item, 'Hospital','/showcase/page?type=hospital'))}
//                         </div>
//                       </div>
//                     )}
//                     {searchResults.schools.length > 0 && (
//                       <div className="p-4 last:border-b-0">
//                         <h3 className="text-xl font-bold text-blue-700 mb-3 border-b-2 border-blue-100 pb-2">Schools & Colleges ({searchResults.schools.length})</h3>
//                         <div className="grid grid-cols-1 gap-4">
//                           {searchResults.schools.map(item => renderItem(item, 'School/College','/showcase/page?type='))}
//                         </div>
//                       </div>
//                     )}
//                   </>
//                 )}
//                 {!isLoading && !error && !hasResults && searchTerm.trim() && (
//                   <div className="p-4 text-center text-gray-600">No results found for "{searchTerm}".</div>
//                 )}
//                 {!isLoading && !error && !hasResults && !searchTerm.trim() && (
//                   <div className="p-4 text-center text-gray-600">Start typing to see results...</div>
//                 )}
//               </div>
//             )}
//           </form>

//           <p className="text-lg md:text-xl text-center max-w-2xl px-4 leading-relaxed font-light mt-4">
//             Discover local services at your fingertips. Explore a wide range of businesses and services tailored to your needs in Nandyal. Find everything you need in one place.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HomePage;
import React, { useState, useRef, useEffect } from 'react';
import { Link } from "react-router-dom";
import HeaderImage from '../../assets/Header.jpg';

const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="w-6 h-6 text-gray-500"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
);

const getPlaceholderImage = (width = 100, height = 100) => `https://placehold.co/${width}x${height}/E0E0E0/333333?text=No+Image`;

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState({
    restaurants: [],
    malls: [],
    hospitals: [],
    schools: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const searchContainerRef = useRef(null);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();

    if (!searchTerm.trim()) {
      setSearchResults({ restaurants: [], malls: [], hospitals: [], schools: [] });
      setShowDropdown(false);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    const baseURL = import.meta.env.VITE_SERVER_URL;

    try {
      const apiUrl = `${baseURL}/api/search/all?q=${encodeURIComponent(searchTerm)}`;
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSearchResults(data);
      setShowDropdown(true);
    } catch (err) {
      console.error('Error fetching search results:', err);
      setError('Failed to fetch data. Please try again.');
      setSearchResults({ restaurants: [], malls: [], hospitals: [], schools: [] });
      setShowDropdown(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults({ restaurants: [], malls: [], hospitals: [], schools: [] });
      setShowDropdown(false);
      setHasSearched(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const renderItem = (item, type, link) => {
    let addressDisplay = '';
    let renderType = item?._doc?.institutionType;
    let finalLink = link;

    if (type === 'School/College') {
      finalLink = `${link}${renderType}`;
    }

    const name = item?.name || item?._doc?.name;
    const id = item?._id || item?._doc?._id;

    switch (type) {
      case 'Restaurant':
        addressDisplay = `${item.address?.street ? item.address.street + ', ' : ''}${item.address?.city || ''}`;
        break;
      case 'Mall':
        addressDisplay = item.address || '';
        break;
      case 'Hospital':
        addressDisplay = `${item.address || item?._doc?.address}${item.locationName ? ', ' + item.locationName : (item?._doc?.locationName ? ',' + item?._doc?.locationName : '')}`;
        break;
      case 'School/College':
        addressDisplay = item?._doc?.location || '';
        break;
      default:
        addressDisplay = '';
    }

    return (
      <Link to={`${finalLink}/${encodeURIComponent(name)}/${id}/Overview`} key={id}>
        <div className="bg-white md:p-2 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 flex items-center gap-2 md:gap-4 lg:p-4">
          {(item.image || (item?.imageUrls && item?.imageUrls?.mainImage) || item?._doc?.image) ? (
            <img
              src={item?.image || item.imageUrls?.mainImage || item?._doc?.image}
              alt={name}
              className="w-12 h-12 md:w-24 md:h-24 object-cover rounded-md shadow-sm shadow-black/40 flex-shrink-0"
              onError={(e) => { e.target.onerror = null; e.target.src = getPlaceholderImage(96, 96); }}
            />
          ) : (
            <img src={getPlaceholderImage(96, 96)} alt="No image available" className="w-24 h-24 object-cover rounded-md shadow-sm shadow-black/40 flex-shrink-0" />
          )}

          <div className="flex-grow flex items-center justify-between">
            <div>
              <h4 className="text-base md:text-lg font-semibold text-black">{name}</h4>
              <p className="text-xs text-blue-600 mb-1">{type}</p>
              <p className="text-gray-700 text-sm">{addressDisplay}</p>
            </div>

            <div className="flex-shrink-0 text-right">
              <p className="text-sm md:text-lg font-bold text-blue-700">{item.rating ? item.rating : item?._doc?.rating} / 5</p>
              <span className="text-yellow-500">★</span>
            </div>
          </div>
        </div>
      </Link>
    );
  };

  const hasResults = Object.values(searchResults).some(arr => arr.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br font-sans text-gray-900">
      <div className="relative w-full h-[500px] md:h-[550px] overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-black opacity-40 z-0"></div>
        <img src={HeaderImage} alt="Nandyal Cityscape" className="absolute inset-0 w-full h-full object-cover z-0" />

        <div className="relative z-10 flex flex-col justify-center items-center text-white p-4 sm:p-6 md:p-8 text-shadow-lg">
          <h1 className="text-5xl md:text-7xl font-extrabold text-center mb-8 drop-shadow-lg font-serif tracking-tight">
            NANDYAL INFO
          </h1>

          <form onSubmit={handleSearchSubmit} className="relative w-full max-w-4xl md:max-w-2xl mb-12 px-4" ref={searchContainerRef}>
            <input
              type="text"
              placeholder="Search for restaurants, schools, hospitals, malls..."
              className="w-full p-4 pl-14 pr-6 bg-white border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 text-lg shadow-sm
                         transition-all duration-300 ease-in-out hover:border-blue-400 transform hover:scale-102 placeholder-gray-500"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (e.target.value.trim()) {
                  setShowDropdown(true);
                } else {
                  setShowDropdown(false);
                  setHasSearched(false);
                }
              }}
              onFocus={() => {
                if (searchTerm.trim() || hasSearched) {
                  setShowDropdown(true);
                }
              }}
            />
            <button
              type="submit"
              aria-label="Submit search"
              className="absolute left-6 top-1/2 -translate-y-1/2 cursor-pointer text-blue-600 hover:text-blue-800 transition-colors duration-200"
            >
              <SearchIcon />
            </button>

            {showDropdown && (
              <div className="absolute left-0 right-0 mt-1 bg-white rounded-xl shadow-md max-h-60 overflow-y-auto z-50 border border-gray-200 animate-fade-in-down">
                {isLoading && (
                  <div className="p-4 text-center text-blue-600 flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading results...
                  </div>
                )}
                {error && (
                  <div className="p-4 text-center text-red-500 border-b border-gray-100">{error}</div>
                )}

                {!isLoading && !error && hasResults && (
                  <>
                    {searchResults.restaurants.length > 0 && (
                      <div className="p-4 border-b border-gray-100 last:border-b-0">
                        <h3 className="text-xl font-bold text-blue-700 mb-3 border-b-2 border-blue-100 pb-2">Restaurants ({searchResults.restaurants.length})</h3>
                        <div className="grid grid-cols-1 gap-4">
                          {searchResults.restaurants.map(item => renderItem(item, 'Restaurant', '/showcase/page?type=restaurant'))}
                        </div>
                      </div>
                    )}
                    {searchResults.malls.length > 0 && (
                      <div className="p-4 border-b border-gray-100 last:border-b-0">
                        <h3 className="text-xl font-bold text-blue-700 mb-3 border-b-2 border-blue-100 pb-2">Malls ({searchResults.malls.length})</h3>
                        <div className="grid grid-cols-1 gap-4">
                          {searchResults.malls.map(item => renderItem(item, 'Mall', '/showcase/page?type=mall'))}
                        </div>
                      </div>
                    )}
                    {searchResults.hospitals.length > 0 && (
                      <div className="p-4 border-b border-gray-100 last:border-b-0">
                        <h3 className="text-xl font-bold text-blue-700 mb-3 border-b-2 border-blue-100 pb-2">Hospitals ({searchResults.hospitals.length})</h3>
                        <div className="grid grid-cols-1 gap-4">
                          {searchResults.hospitals.map(item => renderItem(item, 'Hospital', '/showcase/page?type=hospital'))}
                        </div>
                      </div>
                    )}
                    {searchResults.schools.length > 0 && (
                      <div className="p-4 last:border-b-0">
                        <h3 className="text-xl font-bold text-blue-700 mb-3 border-b-2 border-blue-100 pb-2">Schools & Colleges ({searchResults.schools.length})</h3>
                        <div className="grid grid-cols-1 gap-4">
                          {searchResults.schools.map(item => renderItem(item, 'School/College', '/showcase/page?type='))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {!isLoading && !error && !hasResults && searchTerm.trim() && hasSearched && (
                  <div className="p-4 text-center text-gray-600">No results found for "{searchTerm}".</div>
                )}
                {!isLoading && !error && !searchTerm.trim() && !hasSearched && (
                  <div className="p-4 text-center text-gray-600">Start typing to see results...</div>
                )}
              </div>
            )}
          </form>

          <p className="text-lg md:text-xl text-center max-w-2xl px-4 leading-relaxed font-light mt-4">
            Discover local services at your fingertips. Explore a wide range of businesses and services tailored to your needs in Nandyal. Find everything you need in one place.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;