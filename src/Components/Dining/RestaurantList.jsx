
import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { RestaurantCard } from './RestaurantCard';
import {MenuItemSkeleton} from "./Showcase/MenuSkeleton"
export const RestaurantList = ({ filters, activeRestaurantTab, sortBy }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);

  const observer = useRef();
  const initialLoadLimit = 30;
  const subsequentLoadLimit = 20;

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
  
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
        {loading && (
                Array.from({ length: 5 }).map((_, index) => <MenuItemSkeleton key={`skeleton-${index}`} />)
          )}

      </div>


      {!hasMore && restaurants.length > 0 && (
        <div className="text-center mt-8 text-gray-600">
          <p>You've reached the end of the list!</p>
        </div>
      )}
    </div>
  );
};