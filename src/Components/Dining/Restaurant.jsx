
// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import {ServiceOverview}from "./ServiceOverview"
// import {FeatureSection}from "./FeatureSection"
// import {CuisineSlider}from "./CuisineSlider"
// import {RestaurantSubTabs}from "./RestaurantSubTabs"
// import Food from "../../assets/food.avif"
// import Restaurant from "../../assets/restaurant.avif"
// import Tiffin from "../../assets/tiffin.avif"
// import Veg from "../../assets/veg.avif"
// const mockRestaurants = [
//   {
//     id: 'rest1',
//     name: "Gourmet Bites",
//     description: "Experience the finest culinary delights in a cozy ambiance.",
//     rating: 4.8,
//     reviews: 1250,
//     address: "123 Food Street, Culinary City",
//     hours: "Mon-Sun: 11:00 AM - 10:00 PM",
//     phone: "+1 (555) 123-4567",
//     headerImage: "https://placehold.co/1200x400/FFDDC1/800000?text=Gourmet+Bites",
//     cuisine: ["Italian", "American"],
//     priceLevel: "$$",
//     isTopPick: true,
//     isTakeaway: true,
//     servesTiffins: false,
//     isVegetarian: false,
//     smallImage: "https://placehold.co/400x300/B2D8D8/005F73?text=Gourmet+Bites",
//   },
//   {
//     id: 'rest2',
//     name: "Spice Route",
//     description: "Authentic Indian flavors, a journey for your taste buds.",
//     rating: 4.5,
//     reviews: 800,
//     address: "456 Curry Lane, Spice Town",
//     hours: "Mon-Sun: 12:00 PM - 10:30 PM",
//     phone: "+1 (555) 234-5678",
//     headerImage: "https://placehold.co/1200x400/ADD8E6/4682B4?text=Spice+Route",
//     cuisine: ["Indian", "Asian"],
//     priceLevel: "$",
//     isTopPick: true,
//     isTakeaway: true,
//     servesTiffins: true,
//     isVegetarian: true,
//     smallImage: "https://placehold.co/400x300/D4F1F4/145DA0?text=Spice+Route",
//   },
//   {
//     id: 'rest3',
//     name: "Sushi Heaven",
//     description: "Freshly prepared sushi and sashimi, a taste of Japan.",
//     rating: 4.9,
//     reviews: 2100,
//     address: "789 Sushi Blvd, Ocean City",
//     hours: "Tue-Sun: 11:30 AM - 9:30 PM",
//     phone: "+1 (555) 345-6789",
//     headerImage: "https://placehold.co/1200x400/E0FFFF/20B2AA?text=Sushi+Heaven",
//     cuisine: ["Japanese", "Asian"],
//     priceLevel: "$$$",
//     isTopPick: false,
//     isTakeaway: true,
//     servesTiffins: false,
//     isVegetarian: false,
//     smallImage: "https://placehold.co/400x300/E0FFFF/20B2AA?text=Sushi+Heaven",
//   },
//   {
//     id: 'rest4',
//     name: "Mexican Fiesta",
//     description: "Vibrant Mexican dishes and lively atmosphere.",
//     rating: 4.2,
//     reviews: 500,
//     address: "101 Taco Road, Fiesta Ville",
//     hours: "Mon-Sat: 10:00 AM - 11:00 PM",
//     phone: "+1 (555) 456-7890",
//     headerImage: "https://placehold.co/1200x400/F9DBBD/B15B17?text=Mexican+Fiesta",
//     cuisine: ["Mexican"],
//     priceLevel: "$$",
//     isTopPick: false,
//     isTakeaway: true,
//     servesTiffins: false,
//     isVegetarian: false,
//     smallImage: "https://placehold.co/400x300/F9DBBD/B15B17?text=Mexican+Fiesta",
//   },
//   {
//     id: 'rest5',
//     name: "Mediterranean Delights",
//     description: "Healthy and flavorful Mediterranean cuisine.",
//     rating: 4.7,
//     reviews: 950,
//     address: "202 Olive Grove, Oasis City",
//     hours: "Mon-Fri: 11:00 AM - 9:00 PM",
//     phone: "+1 (555) 567-8901",
//     headerImage: "https://placehold.co/1200x400/D8BFD8/4B0082?text=Mediterranean+Delights",
//     cuisine: ["Mediterranean", "Middle Eastern"],
//     priceLevel: "$$",
//     isTopPick: true,
//     isTakeaway: false,
//     servesTiffins: false,
//     isVegetarian: true,
//     smallImage: "https://placehold.co/400x300/D8BFD8/4B0082?text=Mediterranean+Delights",
//   },
//   {
//     id: 'rest6',
//     name: "Vegan Paradise",
//     description: "Plant-based dishes that are both delicious and nutritious.",
//     rating: 4.6,
//     reviews: 700,
//     address: "303 Green Street, Earthville",
//     hours: "Wed-Sun: 10:00 AM - 8:00 PM",
//     phone: "+1 (555) 678-9012",
//     headerImage: "https://placehold.co/1200x400/F0FFF0/228B22?text=Vegan+Paradise",
//     cuisine: ["Vegan", "Healthy"],
//     priceLevel: "$$",
//     isTopPick: false,
//     isTakeaway: true,
//     servesTiffins: false,
//     isVegetarian: true,
//     smallImage: "https://placehold.co/400x300/F0FFF0/228B22?text=Vegan+Paradise",
//   },
//   {
//     id: 'rest7',
//     name: "Burger Joint",
//     description: "Classic burgers and fries, done right.",
//     rating: 4.3,
//     reviews: 600,
//     address: "404 Patty Place, Burger Town",
//     hours: "Mon-Sun: 11:00 AM - 11:00 PM",
//     phone: "+1 (555) 789-0123",
//     headerImage: "https://placehold.co/1200x400/CCEEFF/36454F?text=Burger+Joint",
//     cuisine: ["American", "Fast Food"],
//     priceLevel: "$",
//     isTopPick: false,
//     isTakeaway: true,
//     servesTiffins: false,
//     isVegetarian: false,
//     smallImage: "https://placehold.co/400x300/CCEEFF/36454F?text=Burger+Joint",
//   },
//   {
//     id: 'rest8',
//     name: "Thai Taste",
//     description: "Spicy and aromatic Thai curries and noodles.",
//     rating: 4.7,
//     reviews: 1100,
//     address: "505 Pad Thai Way, Flavor City",
//     hours: "Mon-Sat: 12:00 PM - 10:00 PM",
//     phone: "+1 (555) 890-1234",
//     headerImage: "https://placehold.co/1200x400/FFFACD/DAA520?text=Thai+Taste",
//     cuisine: ["Thai", "Asian"],
//     priceLevel: "$$",
//     isTopPick: true,
//     isTakeaway: true,
//     servesTiffins: false,
//     isVegetarian: true,
//     smallImage: "https://placehold.co/400x300/FFFACD/DAA520?text=Thai+Taste",
//   },
//   {
//     id: 'rest9',
//     name: "French Bistro",
//     description: "Elegant French cuisine in a charming setting.",
//     rating: 4.9,
//     reviews: 1500,
//     address: "606 Eiffel Street, Parisienne",
//     hours: "Tue-Sun: 6:00 PM - 11:00 PM",
//     phone: "+1 (555) 901-2345",
//     headerImage: "https://placehold.co/1200x400/FFC0CB/C71585?text=French+Bistro",
//     cuisine: ["French"],
//     priceLevel: "$$$",
//     isTopPick: true,
//     isTakeaway: false,
//     servesTiffins: false,
//     isVegetarian: false,
//     smallImage: "https://placehold.co/400x300/FFC0CB/C71585?text=French+Bistro",
//   },
// ];

// const getUniqueCuisines = (restaurants) => {
//   const cuisines = new Set();
//   restaurants.forEach(rest => {
//     rest.cuisine.forEach(c => cuisines.add(c));
//   });
//   return Array.from(cuisines).sort();
// };

// const GlobalHeader = () => (
//   <header className="relative w-full h-96 overflow-hidden shadow-lg flex items-center justify-center">
//     <img
//       src={Food}
//       alt="Food Services Header"
//       className="absolute inset-0 w-full h-full object-cover"
//       onError={(e) => e.target.src = "https://placehold.co/1600x600/E0E0E0/333333?text=Food+Services+Header"}
//     />
//     <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-95"></div>
//     <div className="relative z-10 flex flex-col items-center justify-center h-full p-8 text-white text-center">
//       <h1 className="text-6xl font-extrabold mb-4 drop-shadow-lg font-['Inter']">Explore Our Food Services</h1>
//       <p className="text-2xl italic font-light drop-shadow-md font-['Inter']">Your culinary journey begins here.</p>
//     </div>
//   </header>
// );

// const WebsiteContent = () => (
//   <section className="bg-white rounded-xl shadow-xl p-8 mx-auto -mt-20 relative z-20 max-w-6xl text-center mb-12">
//     <h2 className="text-4xl font-bold text-gray-800 mb-4 font-['Inter']">Discover Your Next Favorite Meal</h2>
//     <p className="text-lg text-gray-700 font-['Inter']">
//       From authentic local delicacies to international cuisines, our platform connects you with the best restaurants and food services. Whether you're looking for a quick takeaway, a hearty tiffin, or just browsing for inspiration, we've got you covered.
//     </p>
//   </section>
// );

// const ScrollbarHideCss = () => (
//   <style>{`
//     .scrollbar-hide::-webkit-scrollbar {
//       display: none;
//     }
//     .scrollbar-hide {
//       -ms-overflow-style: none;  /* IE and Edge */
//       scrollbar-width: none;  /* Firefox */
//     }
//   `}</style>
// );

// export const  RestaurantHomePage=()=> {
//   const allCuisines = getUniqueCuisines(mockRestaurants);
//   const [activeRestaurantTab, setActiveRestaurantTab] = useState('all');
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [filters, setFilters] = useState({
//     searchTerm: '',
//     minRating: 0,
//     priceLevels: ["$", "$$", "$$$"],
//     cuisines: allCuisines,
//   });

//   const [displayedRestaurantsCount, setDisplayedRestaurantsCount] = useState(8); // Initially show 8 restaurants
//   const restaurantsPerPage = 4; // Load 4 more restaurants at a time

//   const handleFilterChange = (filterName, value) => {
//     setFilters(prev => ({
//       ...prev,
//       [filterName]: value,
//     }));
//     // Reset displayed count when filters change to ensure all filtered results are considered
//     setDisplayedRestaurantsCount(restaurantsPerPage);
//   };

//   const handleCuisineSelect = (cuisine) => {
//     setFilters(prev => {
//       // Toggle cuisine selection
//       const newCuisines = prev.cuisines.includes(cuisine)
//         ? prev.cuisines.filter(c => c !== cuisine)
//         : [...prev.cuisines, cuisine];
//       return { ...prev, cuisines: newCuisines };
//     });
//     setDisplayedRestaurantsCount(restaurantsPerPage); // Reset count
//   };

//   const filteredRestaurants = mockRestaurants.filter(restaurant => {
//     const matchesFilterSearch = restaurant.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
//                                 restaurant.description.toLowerCase().includes(filters.searchTerm.toLowerCase());

//     const matchesRestaurantTab = activeRestaurantTab === 'all' ||
//                                  (activeRestaurantTab === 'takeaway' && restaurant.isTakeaway) ||
//                                  (activeRestaurantTab === 'tiffins' && restaurant.servesTiffins);

//     const matchesRating = restaurant.rating >= filters.minRating;
//     const matchesPriceLevel = filters.priceLevels.length === 0 || filters.priceLevels.includes(restaurant.priceLevel);
//     const matchesCuisine = filters.cuisines.length === 0 || filters.cuisines.some(c => restaurant.cuisine.includes(c));

//     return matchesFilterSearch && matchesRestaurantTab && matchesRating && matchesPriceLevel && matchesCuisine;
//   });

//   // Infinite scrolling logic
//   const observer = useRef();
//   const lastRestaurantElementRef = useCallback(node => {
//     if (observer.current) observer.current.disconnect();
//     observer.current = new IntersectionObserver(entries => {
//       if (entries[0].isIntersecting && displayedRestaurantsCount < filteredRestaurants.length) {
//         setDisplayedRestaurantsCount(prevCount => prevCount + restaurantsPerPage);
//       }
//     });
//     if (node) observer.current.observe(node);
//   }, [displayedRestaurantsCount, filteredRestaurants.length]);


//   return (
//     <div className="min-h-screen bg-gray-50 font-['Inter']">
//       <script src="https://cdn.tailwindcss.com"></script>
//       <ScrollbarHideCss />

//       <GlobalHeader />
//       <main className="container mx-auto px-4 py-8">
//         <WebsiteContent />
//         <FeatureSection
//           title="Find Your Perfect Restaurant"
//           content="Browse through a vast collection of restaurants, each with unique ambiance and culinary styles. From casual cafes to elegant fine dining, we have options to suit every mood and occasion. Discover new dining experiences today."
//           imageUrl={Restaurant}
//           imageAlt="Diverse Restaurants"
//           imageRight={true}
//           button="Explore"
//         />
//         <FeatureSection
//           title="Healthy & Delicious Vegetarian Options"
//           content="For our vegetarian friends, explore a dedicated selection of restaurants and dishes that are purely plant-based and incredibly flavorful. Enjoy guilt-free dining with a focus on fresh, seasonal ingredients."
//           imageUrl={Veg}
//           imageAlt="Vegetarian Food"
//           imageRight={false}
//           button="Explore"
//         />
//          <FeatureSection
//           title="Convenient Tiffin Services"
//           content="Looking for home-style meals delivered daily? Our tiffin services provide nutritious and delicious options, perfect for busy professionals or anyone seeking convenient, wholesome food. Subscribe for a hassle-free meal experience."
//           imageUrl={Tiffin}
//           imageAlt="Tiffin Service"
//           imageRight={true}
//           button="Explore"
//         />

//         <CuisineSlider cuisines={allCuisines} onCuisineSelect={handleCuisineSelect} />
//         <RestaurantSubTabs
//           activeTab={activeRestaurantTab}
//           onTabChange={setActiveRestaurantTab}
//         />
//         <RestaurantList/>
//           <ServiceOverview />
//       </main>

//     </div>
//   );
// }


import React, { useState, useEffect } from 'react';
import { ServiceOverview } from "./ServiceOverview";
import { FeatureSection } from "./FeatureSection";
import { CuisineSlider } from "./CuisineSlider";
import { RestaurantSubTabs } from "./RestaurantSubTabs";
import { RestaurantList } from './RestaurantList';
import { FilterSidebar } from './RestaurantFiltersSidebar'; 
import Food from "../../assets/food.avif";
import Restaurant from "../../assets/restaurant.avif";
import Tiffin from "../../assets/tiffin.avif";
import Veg from "../../assets/veg.avif";
import axios from 'axios';

const GlobalHeader = () => (
  <header className="relative w-full h-96 overflow-hidden shadow-lg flex items-center justify-center">
    <img
      src={Food}
      alt="Food Services Header"
      className="absolute inset-0 w-full h-full object-cover"
      onError={(e) => e.target.src = "https://placehold.co/1600x600/E0E0E0/333333?text=Food+Services+Header"}
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-95"></div>
    <div className="relative z-10 flex flex-col items-center justify-center h-full p-8 text-white text-center">
      <h1 className="text-6xl font-extrabold mb-4 drop-shadow-lg font-['Inter']">Explore Our Food Services</h1>
      <p className="text-2xl italic font-light drop-shadow-md font-['Inter']">Your culinary journey begins here.</p>
    </div>
  </header>
);

const WebsiteContent = () => (
  <section className="bg-white rounded-xl shadow-xl p-8 mx-auto -mt-20 relative z-20 max-w-6xl text-center mb-12">
    <h2 className="text-4xl font-bold text-gray-800 mb-4 font-['Inter']">Discover Your Next Favorite Meal</h2>
    <p className="text-lg text-gray-700 font-['Inter']">
      From authentic local delicacies to international cuisines, our platform connects you with the best restaurants and food services. Whether you're looking for a quick takeaway, a hearty tiffin, or just Browse for inspiration, we've got you covered.
    </p>
  </section>
);

const ScrollbarHideCss = () => (
  <style>{`
    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
    .scrollbar-hide {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `}</style>
);

export const RestaurantHomePage = () => {
  const [allCuisines, setAllCuisines] = useState([]);
  const [activeRestaurantTab, setActiveRestaurantTab] = useState('all');
  const [sortBy, setSortBy] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // New state for sidebar

  const [filters, setFilters] = useState({
    searchTerm: '',
    minRating: 0,
    priceLevels: [],
    cuisines: [],
    isVegetarian: false,
    services: [],
  });

  useEffect(() => {
    const fetchCuisines = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/restaurant/restaurant/unique-cuisines`,{withCredentials:true});
        setAllCuisines(response.data?.data?.cuisines);
      } catch (err) {
        
      }
    };
    fetchCuisines();
  }, []);

  useEffect(() => {
  }, [allCuisines]);

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const handleCuisineSelect = (cuisine) => {
    setFilters(prev => {
      const newCuisines = prev.cuisines.includes(cuisine)
        ? prev.cuisines.filter(c => c !== cuisine)
        : [...prev.cuisines, cuisine];
      return { ...prev, cuisines: newCuisines };
    });
  };

  const handleSortChange = (value) => {
    setSortBy(value);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter']">
      <script src="https://cdn.tailwindcss.com"></script>
      <ScrollbarHideCss />

      <GlobalHeader />
      <main className="container mx-auto px-2 py-8">
        <WebsiteContent />
        <FeatureSection
          title="Find Your Perfect Restaurant"
          content="Browse through a vast collection of restaurants, each with unique ambiance and culinary styles. From casual cafes to elegant fine dining, we have options to suit every mood and occasion. Discover new dining experiences today."
          imageUrl={Restaurant}
          imageAlt="Diverse Restaurants"
          imageRight={true}
          button="Explore"
        />
        <FeatureSection
          title="Healthy & Delicious Vegetarian Options"
          content="For our vegetarian friends, explore a dedicated selection of restaurants and dishes that are purely plant-based and incredibly flavorful. Enjoy guilt-free dining with a focus on fresh, seasonal ingredients."
          imageUrl={Veg}
          imageAlt="Vegetarian Food"
          imageRight={false}
          button="Explore"
        />
        <FeatureSection
          title="Convenient Tiffin Services"
          content="Looking for home-style meals delivered daily? Our tiffin services provide nutritious and delicious options, perfect for busy professionals or anyone seeking convenient, wholesome food. Subscribe for a hassle-free meal experience."
          imageUrl={Tiffin}
          imageAlt="Tiffin Service"
          imageRight={true}
          button="Explore"
        />

        
            
        <CuisineSlider
          cuisines={allCuisines}
          onCuisineSelect={handleCuisineSelect}
          selectedCuisines={filters.cuisines}
        />

        <RestaurantSubTabs
          activeTab={activeRestaurantTab}
          onTabChange={setActiveRestaurantTab}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <RestaurantList
          filters={filters}
          activeRestaurantTab={activeRestaurantTab}
          sortBy={sortBy}
          allCuisines={allCuisines} // Pass allCuisines to RestaurantList for filter logic
        />

        <ServiceOverview />
      </main>

      {/* Filter Sidebar Component */}
      <FilterSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        allCuisines={allCuisines}
        onCuisineSelect={handleCuisineSelect}
        selectedCuisines={filters.cuisines}
      />
    </div>
  );
}