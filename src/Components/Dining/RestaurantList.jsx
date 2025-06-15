// import {RestaurantCard}from "./RestaurantCard"
// export const RestaurantList = ({ restaurants }) => {
//   if (restaurants.length === 0) {
//     return <p className="text-center text-gray-600 text-xl font-['Inter'] py-10">No restaurants found matching your criteria.</p>;
//   }
//   return (
//     <section className="py-8">
//       <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center font-['Inter']">All Restaurants</h2>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4">
//         {restaurants.map(restaurant => (
//           <RestaurantCard key={restaurant.id} restaurant={restaurant} />
//         ))}
//       </div>
//     </section>
//   );
// };


// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import axios from 'axios';
// import { RestaurantCard } from './RestaurantCard';

// export const RestaurantList = ({ filters, activeRestaurantTab, sortBy }) => { // Added sortBy prop
//   const [restaurants, setRestaurants] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [hasMore, setHasMore] = useState(true);
//   const [page, setPage] = useState(1);
//   const [error, setError] = useState(null);

//   const observer = useRef();
//   const restaurantsPerPage = 8;

//   const lastRestaurantElementRef = useCallback(node => {
//     if (loading) return;
//     if (observer.current) observer.current.disconnect();

//     observer.current = new IntersectionObserver(entries => {
//       if (entries[0].isIntersecting && hasMore) {
//         setPage(prevPage => prevPage + 1);
//       }
//     });

//     if (node) observer.current.observe(node);
//   }, [loading, hasMore]);

//   // Effect to fetch restaurants when filters, active tab, page, or sortBy changes
//   useEffect(() => {
//     const fetchRestaurants = async () => {
//       setLoading(true);
//       setError(null);

//       try {
//         let apiUrl = `${import.meta.env.VITE_SERVER_URL}/api/restaurant?page=${page}&limit=${restaurantsPerPage}`;
//         if (activeRestaurantTab === 'takeaway') {
//           apiUrl += '&isTakeaway=true';
//         } else if (activeRestaurantTab === 'tiffins') {
//           apiUrl += '&servesTiffins=true';
//         } else if (activeRestaurantTab === 'dine-in') {
//           apiUrl += '&services[in]=Dine-in';
//         }
//         if (filters.searchTerm) {
//           // IMPORTANT: Your backend's APIFeatures.js needs to handle regex search for 'name' and 'description'
//           // For now, let's assume `q` parameter on backend performs a multi-field search.
//           // If not, you need to adjust APIFeatures.js to allow searching across 'name' and 'description' using regex for a single `searchTerm`.
//           apiUrl += `&name[regex]=${encodeURIComponent(filters.searchTerm)}&description[regex]=${encodeURIComponent(filters.searchTerm)}`;
//           // A more robust backend might have a dedicated search parameter like `?search=query`
//           // and the controller would build an OR query: {$or: [{name: /query/i}, {description: /query/i}]}
//         }
//         if (filters.minRating > 0) {
//           apiUrl += `&rating[gte]=${filters.minRating}`;
//         }
//         // Price Level mapping (example, adjust ranges as per your data)
//         if (filters.priceLevels && filters.priceLevels.length > 0 && filters.priceLevels.length < 3) {
//           const priceQueries = filters.priceLevels.map(level => {
//             if (level === '$') return 'averagePriceINR[lte]=300';
//             if (level === '$$') return 'averagePriceINR[gt]=300&averagePriceINR[lte]=800';
//             if (level === '$$$') return 'averagePriceINR[gt]=800';
//             return '';
//           }).filter(Boolean); // Remove empty strings

//           if (priceQueries.length > 0) {
//               // This is a simplification; for complex OR logic on price levels,
//               // your backend's APIFeatures or controller would need to handle $or for these ranges.
//               // For now, it will apply them as AND if multiple ranges are selected.
//               // A better frontend approach for multi-select price levels with backend $or
//               // is to send an array: &priceLevels=$,$$,$$$
//               // For simplicity now, let's apply the first valid one if multiple chosen for a direct match.
//               apiUrl += `&${priceQueries.join('&')}`; // Joins with AND, not OR. Backend needs to convert to OR.
//                                                    // For true OR, you might send `priceLevel[in]=$,$$`
//                                                    // or use a custom filter like `priceRange=low,medium`
//           }
//         }
//         if (filters.cuisines && filters.cuisines.length > 0 && filters.cuisines.length < filters.allCuisines.length) {
//             apiUrl += `&cuisine[in]=${filters.cuisines.join(',')}`;
//         }

//         // Apply sorting
//         if (sortBy) {
//             let sortParam = '';
//             switch (sortBy) {
//                 case 'rating-desc': sortParam = '-rating'; break; // Highest rating first
//                 case 'rating-asc': sortParam = 'rating'; break;   // Lowest rating first
//                 case 'cuisine-asc': sortParam = 'cuisine'; break;  // Alphabetical by first cuisine
//                 case 'cuisine-desc': sortParam = '-cuisine'; break; // Reverse alphabetical by first cuisine
//                 case 'takeaway-first': sortParam = '-isTakeaway'; break; // Takeaway true first
//                 case 'dine-in-first': sortParam = '-services'; break; // Dine-in service true first (assuming services can be sorted implicitly or you sort by a boolean flag)
//                 case 'name-asc': sortParam = 'name'; break;
//                 case 'name-desc': sortParam = '-name'; break;
//                 // Add more cases as needed (e.g., price, reviews)
//                 default: sortParam = '-createdAt'; // Default sort
//             }
//             if (sortParam) {
//                 apiUrl += `&sort=${sortParam}`;
//             }
//         } else {
//             apiUrl += `&sort=-createdAt`;
//         }


//         console.log("Fetching URL:", apiUrl);
//         const response = await axios.get(apiUrl,{withCredentials:true});
//         const { data, total } = response.data;

//         if (page === 1) {
//           setRestaurants(data.restaurants);
//         } else {
//           setRestaurants(prevRestaurants => [...prevRestaurants, ...data.restaurants]);
//         }

//         setHasMore(restaurants.length + data.restaurants.length < total);

//       } catch (err) {
//         console.error("Failed to fetch restaurants:", err.response ? err.response.data : err.message);
//         setError("Failed to load restaurants. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     // Trigger fetch when page, filters, active tab, or sortBy changes
//     if (page === 1) { // Only fetch if page is 1 (initial load or filter/sort change) or if page increments
//         fetchRestaurants();
//     } else if (page > 1) { // Fetch if page increments for infinite scroll
//         fetchRestaurants();
//     }
//   }, [filters, activeRestaurantTab, page, sortBy]);


//   // Effect to reset page when filters or active tab or sortby change
//   useEffect(() => {
//     setPage(1);
//     setRestaurants([]); // Clear restaurants to show loading state correctly
//     setHasMore(true); // Assume there's more until proven otherwise
//   }, [filters, activeRestaurantTab, sortBy]); // Added sortBy to dependencies


//   if (error) {
//     return <div className="text-red-500 text-center text-lg mt-8">{error}</div>;
//   }

//   return (
//     <div className="mt-12">
//       <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Our Restaurants</h2>
//       {restaurants.length === 0 && !loading && (
//         <p className="text-center text-gray-600">No restaurants found matching your criteria.</p>
//       )}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//         {restaurants.map((restaurant, index) => {
//           if (restaurants.length === index + 1) {
//             return (
//               <div ref={lastRestaurantElementRef} key={restaurant._id || restaurant.id}>
//                 <RestaurantCard restaurant={restaurant} />
//               </div>
//             );
//           } else {
//             return <RestaurantCard key={restaurant._id || restaurant.id} restaurant={restaurant} />;
//           }
//         })}
//       </div>
//       {loading && (
//         <div className="text-center mt-8">
//           <p className="text-lg text-gray-600">Loading more restaurants...</p>

//         </div>
//       )}
//       {!hasMore && restaurants.length > 0 && (
//         <div className="text-center mt-8 text-gray-600">
//           <p>You've reached the end of the list!</p>
//         </div>
//       )}
//     </div>
//   );
// };
import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { RestaurantCard } from './RestaurantCard';

export const RestaurantList = ({ filters, activeRestaurantTab, sortBy }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);

  const observer = useRef();
  const initialLoadLimit = 30;
  const subsequentLoadLimit = 10;

  const lastRestaurantElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        setPage(prevPage => prevPage + 1);
      }
    }, { threshold: 1.0 });

    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      setError(null);

      try {
        const currentLimit = page === 1 ? initialLoadLimit : subsequentLoadLimit;
        let apiUrl = `${import.meta.env.VITE_SERVER_URL}/api/restaurant?page=${page}&limit=${currentLimit}`;

        if (activeRestaurantTab === 'takeaway') {
          apiUrl += '&isTakeaway=true';
        } else if (activeRestaurantTab === 'tiffins') {
          apiUrl += '&servesTiffins=true';
        } else if (activeRestaurantTab === 'dine-in') {
          apiUrl += '&services[in]=Dine-in';
        }

        if (filters.searchTerm) {
          apiUrl += `&searchTerm=${encodeURIComponent(filters.searchTerm)}`;
        }
        if (filters.minRating > 0) {
          apiUrl += `&rating=${filters.minRating}`;
        }
        if (filters.priceLevels && filters.priceLevels.length > 0) {
          apiUrl += `&priceLevels=${filters.priceLevels.join(',')}`;
        }
        if (filters.cuisines && filters.cuisines.length > 0) {
          apiUrl += `&cuisines=${filters.cuisines.join(',')}`;
        }
      
        if (filters.isVegetarian) {
          apiUrl += '&isVegetarian=true';
        }
      
        if (filters.services && filters.services.length > 0) {
          apiUrl += `&services=${filters.services.join(',')}`;
        }

        if (sortBy) {
          let sortParam = '';
          switch (sortBy) {
            case 'rating-desc': sortParam = '-rating'; break;
            case 'rating-asc': sortParam = 'rating'; break;
            case 'cuisine-asc': sortParam = 'cuisine'; break;
            case 'cuisine-desc': sortParam = '-cuisine'; break;
            case 'takeaway-first': sortParam = '-isTakeaway'; break;
            case 'dine-in-first': sortParam = 'services';
            case 'name-asc': sortParam = 'name'; break;
            case 'name-desc': sortParam = '-name'; break;
            default: sortParam = '-createdAt';
          }
          if (sortParam) {
            apiUrl += `&sort=${sortParam}`;
          }
        } else {
            apiUrl += `&sort=-createdAt`;
        }

        console.log("Fetching URL:", apiUrl);

        const response = await axios.get(apiUrl, { withCredentials: true });
        const { data, total } = response.data;

        if (page === 1) {
          setRestaurants(data.restaurants);
        } else {
          setRestaurants(prevRestaurants => [...prevRestaurants, ...data.restaurants]);
        }

        setHasMore( (page * currentLimit) < total);

      } catch (err) {
        console.error("Error fetching restaurants:", err);
        setError(err.response?.data?.message || "Failed to load restaurants. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [filters, activeRestaurantTab, page, sortBy]);

  useEffect(() => {
    setPage(1);
    setRestaurants([]);
    setHasMore(true);
    setError(null);
  }, [filters, activeRestaurantTab, sortBy]);

  if (error) {
    return <div className="text-red-500 text-center text-lg mt-8">{error}</div>;
  }

  return (
    <div className="mt-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Our Restaurants</h2>
      {restaurants.length === 0 && !loading && !error && (
        <p className="text-center text-gray-600">No restaurants found matching your criteria.</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {restaurants.map((restaurant, index) => {
          if (restaurants.length === index + 1) {
            return (
              <div ref={lastRestaurantElementRef} key={restaurant._id || restaurant.id}>
                <RestaurantCard restaurant={restaurant} />
              </div>
            );
          } else {
            return <RestaurantCard key={restaurant._id || restaurant.id} restaurant={restaurant} />;
          }
        })}
      </div>
      {loading && (
        <div className="text-center mt-8">
          <p className="text-lg text-gray-600">Loading more restaurants...</p>
        </div>
      )}
      {!hasMore && restaurants.length > 0 && (
        <div className="text-center mt-8 text-gray-600">
          <p>You've reached the end of the list!</p>
        </div>
      )}
    </div>
  );
};