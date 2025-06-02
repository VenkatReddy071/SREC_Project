import React, { useState, useMemo } from 'react';
import { FiSearch, FiStar } from 'react-icons/fi'; // Icons for search and star (outline)
import { FaStar } from 'react-icons/fa'; // Solid star for ratings
import { MapPinIcon, ClockIcon, CurrencyDollarIcon, TagIcon } from '@heroicons/react/24/outline'; // Heroicons

// --- Dummy Data for Restaurants ---
const allRestaurants = [
  {
    id: 'r1',
    name: 'The Grand Diner',
    cuisine: ['American', 'Fast Food'],
    rating: 4.5,
    deliveryTime: '25-35 min',
    priceRange: '$$',
    location: 'Main Street, Nandyal',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    isFeatured: true,
  },
  {
    id: 'r2',
    name: 'Spice Route Indian',
    cuisine: ['Indian', 'Curry'],
    rating: 4.8,
    deliveryTime: '40-50 min',
    priceRange: '$$$',
    location: 'Railway Road, Nandyal',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0429f?q=80&w=2814&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    isFeatured: false,
  },
  {
    id: 'r3',
    name: 'Pizza Palace',
    cuisine: ['Italian', 'Pizza'],
    rating: 4.2,
    deliveryTime: '20-30 min',
    priceRange: '$$',
    location: 'City Center, Nandyal',
    image: 'https://images.unsplash.com/photo-1604382164749-002ad7d2d568?q=80&w=2865&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    isFeatured: true,
  },
  {
    id: 'r4',
    name: 'Green Leaf Cafe',
    cuisine: ['Healthy', 'Cafe', 'Vegetarian'],
    rating: 4.6,
    deliveryTime: '30-40 min',
    priceRange: '$',
    location: 'Park Avenue, Nandyal',
    image: 'https://images.unsplash.com/photo-1498654896293-37aadd65f76c?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    isFeatured: false,
  },
  {
    id: 'r5',
    name: 'Sushi Zen',
    cuisine: ['Japanese', 'Sushi'],
    rating: 4.7,
    deliveryTime: '35-45 min',
    priceRange: '$$$',
    location: 'Riverfront Plaza, Nandyal',
    image: 'https://images.unsplash.com/photo-1559868725-50289f668ef1?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    isFeatured: true,
  },
  {
    id: 'r6',
    name: 'Taste of Thailand',
    cuisine: ['Thai'],
    rating: 4.3,
    deliveryTime: '40-60 min',
    priceRange: '$$',
    location: 'Old Town Road, Nandyal',
    image: 'https://images.unsplash.com/photo-1582236688172-132d91986422?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    isFeatured: false,
  },
];

// --- Dummy Data for Top Food Picks ---
const topFoodPicks = [
  {
    id: 'f1',
    name: 'Classic Margherita Pizza',
    restaurant: 'Pizza Palace',
    price: '$12.99',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1593560704563-f17e97926210?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 'f2',
    name: 'Butter Chicken',
    restaurant: 'Spice Route Indian',
    price: '$18.50',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1631379761569-80a221f7c784?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 'f3',
    name: 'California Roll',
    restaurant: 'Sushi Zen',
    price: '$9.99',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1579584425345-d41f02c61141?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 'f4',
    name: 'Grilled Salmon Salad',
    restaurant: 'Green Leaf Cafe',
    price: '$15.00',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
];

// Reusable Section Title Component
const SectionTitle = ({ title, subtitle }) => (
  <div className="text-center mb-12">
    <h2 className="text-4xl font-extrabold text-gray-900 leading-tight mb-3">{title}</h2>
    <p className="text-xl text-gray-600">{subtitle}</p>
  </div>
);

// Restaurant Card Component
const RestaurantCard = ({ restaurant }) => (
  <div className="bg-white rounded-2xl shadow-xl overflow-hidden
                   transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl flex flex-col cursor-pointer">
    <div className="relative overflow-hidden h-56">
      <img
        src={restaurant.image}
        alt={restaurant.name}
        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        loading="lazy"
      />
      {restaurant.isFeatured && (
        <span className="absolute top-3 right-3 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
          Featured
        </span>
      )}
    </div>
    <div className="p-6 flex flex-col flex-grow">
      <h3 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">{restaurant.name}</h3>
      <div className="flex flex-wrap gap-2 mb-3">
        {restaurant.cuisine.map((c, idx) => (
          <span key={idx} className="bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full">
            {c}
          </span>
        ))}
      </div>
      <div className="flex items-center text-yellow-500 mb-3">
        <FaStar className="h-5 w-5 mr-1" />
        <span className="font-bold text-lg">{restaurant.rating}</span>
        <span className="text-gray-500 text-sm">/5</span>
      </div>
      <p className="text-gray-600 text-sm flex items-center mb-2">
        <MapPinIcon className="h-4 w-4 mr-2 text-gray-500" />
        {restaurant.location}
      </p>
      <p className="text-gray-600 text-sm flex items-center mb-4">
        <ClockIcon className="h-4 w-4 mr-2 text-gray-500" />
        Delivery: {restaurant.deliveryTime}
      </p>
      <div className="mt-auto pt-4 border-t border-gray-100">
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          Order Now
        </button>
      </div>
    </div>
  </div>
);

// Food Item Card Component
const FoodItemCard = ({ item }) => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden
                   transform transition-all duration-300 hover:scale-[1.03] hover:shadow-xl flex flex-col cursor-pointer">
    <div className="relative h-48 overflow-hidden">
      <img
        src={item.image}
        alt={item.name}
        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        loading="lazy"
      />
    </div>
    <div className="p-4 flex flex-col flex-grow">
      <h4 className="text-lg font-semibold text-gray-900 mb-1 leading-tight">{item.name}</h4>
      <p className="text-gray-600 text-sm mb-2">{item.restaurant}</p>
      <div className="flex justify-between items-center mt-auto">
        <span className="text-green-600 text-xl font-bold">{item.price}</span>
        <div className="flex items-center text-yellow-500">
          <FaStar className="h-4 w-4 mr-1" />
          <span className="text-sm font-semibold">{item.rating}</span>
        </div>
      </div>
    </div>
  </div>
);


export const RestaurantHomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [minRating, setMinRating] = useState(0); // 0, 3, 4, 4.5
  const [priceRange, setPriceRange] = useState('All'); // $, $$, $$$

  const cuisineOptions = useMemo(() => [
    'All',
    ...new Set(allRestaurants.flatMap(r => r.cuisine)),
  ], []);
  const priceRangeOptions = ['All', '$', '$$', '$$$'];
  const ratingOptions = [
    { label: 'All Ratings', value: 0 },
    { label: '4.5+ Stars', value: 4.5 },
    { label: '4+ Stars', value: 4 },
    { label: '3+ Stars', value: 3 },
  ];

  const filteredRestaurants = useMemo(() => {
    return allRestaurants.filter(restaurant => {
      const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            restaurant.cuisine.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCuisine = selectedCuisine === 'All' || restaurant.cuisine.includes(selectedCuisine);
      const matchesRating = restaurant.rating >= minRating;
      const matchesPrice = priceRange === 'All' || restaurant.priceRange === priceRange;

      return matchesSearch && matchesCuisine && matchesRating && matchesPrice;
    });
  }, [searchTerm, selectedCuisine, minRating, priceRange]);

  return (
    <div className="bg-gray-50 min-h-screen font-sans antialiased">
      {/* Hero Section */}
      <div className="relative h-[500px] overflow-hidden rounded-b-3xl shadow-2xl mx-2 md:mx-4 lg:mx-6 mb-16">
        <img
          src="https://images.unsplash.com/photo-1552504933-28b939c323f4?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Restaurant Hero"
          className="w-full h-full object-cover brightness-[0.8]"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4 bg-gradient-to-t from-black/60 to-transparent">
          <h1 className="text-white text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 animate-fade-in-up">
            Craving Something Delicious?
          </h1>
          <p className="text-white text-xl sm:text-2xl max-w-3xl animate-fade-in-up animation-delay-300">
            Discover the best local restaurants and order your favorite food for delivery or pickup.
          </p>
          <div className="mt-10 flex justify-center gap-4 animate-fade-in-up animation-delay-500">
            <button className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold px-8 py-4 rounded-full shadow-lg transform hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              Order Now
            </button>
            <button className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-sm border border-white text-white text-lg font-semibold px-8 py-4 rounded-full shadow-lg transform hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2">
              Explore Cuisines
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filter Section (Sticky) */}
      <div className="sticky top-0 bg-white shadow-lg py-6 px-4 z-20 border-b border-gray-100 mb-12">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Search Bar */}
          <div className="flex-grow w-full lg:w-auto flex items-center border border-gray-300 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all duration-200 shadow-sm">
            <FiSearch className="text-gray-500 text-xl mr-3" />
            <input
              type="text"
              placeholder="Search restaurants or dishes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-0 text-gray-800 placeholder-gray-400 focus:outline-none text-lg"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center justify-center gap-4 w-full lg:w-auto">
            {/* Cuisine Filter */}
            <select
              value={selectedCuisine}
              onChange={(e) => setSelectedCuisine(e.target.value)}
              className="px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-700 shadow-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base min-w-[120px]"
            >
              <option value="All">All Cuisines</option>
              {cuisineOptions.map(cuisine => cuisine !== 'All' && (
                <option key={cuisine} value={cuisine}>{cuisine}</option>
              ))}
            </select>

            {/* Rating Filter */}
            <select
              value={minRating}
              onChange={(e) => setMinRating(parseFloat(e.target.value))}
              className="px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-700 shadow-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base min-w-[120px]"
            >
              {ratingOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>

            {/* Price Range Filter */}
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-700 shadow-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base min-w-[120px]"
            >
              {priceRangeOptions.map(option => (
                <option key={option} value={option}>{option === 'All' ? 'All Prices' : option}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Featured Restaurants / Popular Picks Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <SectionTitle title="Our Top Picks for You" subtitle="Handpicked restaurants with exceptional taste and service." />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {allRestaurants.filter(r => r.isFeatured).map(restaurant => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      </section>

      {/* All Restaurants Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <SectionTitle title="All Restaurants" subtitle="Explore a world of flavors near you." />
        {filteredRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredRestaurants.map(restaurant => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center text-xl py-12">
            No restaurants found matching your criteria. Try adjusting your filters.
          </p>
        )}
      </section>

      {/* Top Food Items Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <SectionTitle title="Top Food Picks" subtitle="Popular dishes loved by our community." />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {topFoodPicks.map(item => (
            <FoodItemCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* Promotional Banner (Extra Section) */}
      <section className="bg-gradient-to-r from-red-600 to-orange-500 text-white py-16 px-4 sm:px-6 lg:px-8 my-16 rounded-3xl mx-2 md:mx-4 lg:mx-6 shadow-xl text-center">
        <div className="max-w-4xl mx-auto">
          <TagIcon className="h-16 w-16 mx-auto mb-6 text-white" />
          <h2 className="text-4xl font-extrabold mb-4">Get 20% Off Your First Order!</h2>
          <p className="text-xl opacity-90 mb-8">
            Use code <span className="font-mono bg-white bg-opacity-20 px-3 py-1 rounded-md">FOODIE20</span> at checkout. Limited time offer!
          </p>
          <button className="bg-white text-red-600 hover:bg-gray-100 text-lg font-bold px-10 py-4 rounded-full shadow-lg transform hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2">
            Claim Your Discount
          </button>
        </div>
      </section>

      {/* How It Works Section (Extra Section) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <SectionTitle title="How It Works" subtitle="Your delicious meal is just a few steps away." />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-8 bg-white rounded-xl shadow-lg flex flex-col items-center">
            <span className="text-blue-600 text-5xl font-bold mb-4">1</span>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Explore Restaurants</h3>
            <p className="text-gray-600">Browse a wide selection of restaurants by cuisine, rating, or price.</p>
          </div>
          <div className="p-8 bg-white rounded-xl shadow-lg flex flex-col items-center">
            <span className="text-blue-600 text-5xl font-bold mb-4">2</span>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Order Your Favorites</h3>
            <p className="text-gray-600">Add dishes to your cart and customize your order with ease.</p>
          </div>
          <div className="p-8 bg-white rounded-xl shadow-lg flex flex-col items-center">
            <span className="text-blue-600 text-5xl font-bold mb-4">3</span>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Enjoy Delicious Food</h3>
            <p className="text-gray-600">Sit back and relax while your meal is delivered right to your door.</p>
          </div>
        </div>
      </section>

      {/* Custom CSS for Animations (if not in your global CSS) */}
      <style jsx>{`
        @keyframes fadeInScaleUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInScaleUp 0.7s ease-out forwards;
        }
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
      `}</style>
    </div>
  );
};