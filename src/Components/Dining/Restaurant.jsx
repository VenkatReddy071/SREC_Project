
import React, { useState, useEffect } from 'react';
import { ServiceOverview } from "./ServiceOverview";
import { FeatureSection } from "./FeatureSection";
import { CuisineSlider } from "./CuisineSlider";
import { RestaurantSubTabs } from "./RestaurantSubTabs";
import { RestaurantList } from './RestaurantList';
import { FilterSidebar } from './RestaurantFiltersSidebar'; 
import Food from "../../assets/food.avif";
import Restaurant from "../../assets/Restaurant.avif";
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
      <div className='h-full"'>

      
        <RestaurantList
          filters={filters}
          activeRestaurantTab={activeRestaurantTab}
          sortBy={sortBy}
          allCuisines={allCuisines}
        />
        </div>
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