
import React from 'react';
import {Link}from "react-router-dom";
export const RestaurantCard = ({ restaurant }) => {
  if (!restaurant) {
    return null;
  }

  const defaultImage = "https://placehold.co/400x300/EEEEEE/555555?text=Restaurant";
  const imageUrl = restaurant?.imageUrls?.mainImage || defaultImage;

  const cuisineDisplay = restaurant.cuisine?.join(', ') || 'Various Cuisines';
  const addressDisplay = restaurant.address
    ? `${restaurant.address.street}, ${restaurant.address.city}, ${restaurant.address.state}, ${restaurant.address.zipCode}`
    : 'Address not available';
  const ratingDisplay = restaurant.rating ? `${restaurant.rating.toFixed(1)}` : 'N/A';
  const reviewsDisplay = restaurant.reviews ? `(${restaurant.reviews} Reviews)` : '(No Reviews)';

  return (
    <Link to={`/showcase/page?type=restaurant/${restaurant?.name}/${restaurant?._id}/Overview`}>
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl relative cursor-pointer flex-none w-72 md:w-80 lg:w-96">
      {restaurant.isTopPick && (
        <span className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full z-6 shadow-sm font-['Inter']">
          Top Pick
        </span>
      )}
      {restaurant.closed && (
        <span className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full z-6 shadow-sm font-['Inter']">
          Closed
        </span>
      )}
      <img
        src={imageUrl}
        alt={restaurant.name}
        className="w-full h-48 object-cover"
        onError={(e) => { e.target.onerror = null; e.target.src = defaultImage; }}
      />
      <div className="p-4 flex flex-col justify-between h-full">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-1 font-['Inter']">{restaurant.name}</h3>
          <p className="text-sm text-gray-600 mb-2 font-['Inter'] line-clamp-2">{restaurant.description}</p>

          <div className="flex items-center text-yellow-500 text-lg font-semibold mb-2">
            <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.929 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69L9.049 2.927z"></path>
            </svg>
            <span className="font-['Inter']">{ratingDisplay}</span>
            <span className="text-gray-500 text-sm ml-2 font-['Inter']">{reviewsDisplay}</span>
          </div>

          <p className="text-gray-700 text-sm mb-1 font-['Inter']">
            **Cuisine:** {cuisineDisplay}
          </p>

          <p className="text-gray-700 text-sm mb-2 font-['Inter']">
            **Address:** {addressDisplay}
          </p>

          <div className="flex flex-wrap gap-2 text-xs mt-2">
            {restaurant.offersDelivery && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Delivery</span>
            )}
            {restaurant.isTakeaway && (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">Takeaway</span>
            )}
            {restaurant.servesTiffins && (
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full">Tiffin Service</span>
            )}
            {restaurant.isVegetarian && (
              <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">Vegetarian</span>
            )}
            {restaurant.closed && (
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full">Closed</span>
            )}
          </div>
        </div>
      </div>
    </div>
    </Link>
  );
};