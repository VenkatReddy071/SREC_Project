import React, { useState, useMemo } from 'react';
import HeroSection from '../../Pages/HeroSection';
import HeadingImg from '../../assets/Header.jpg'; // Assuming this is a generic header image
import Shopping from "../../assets/Shopping1.jpg"; // Main hero image for shopping
import { Tittle } from '../../Pages/Tittle';
import { SearchBar } from '../../Pages/SearchBar'; // Ensure SearchBar accepts an onSearch prop
import PopupFilter from '../../Pages/Filter'; // Ensure PopupFilter accepts an onApply prop
import { DisplayComponent } from '../../Pages/DisplayComponent'; // This component will display the filtered malls

// --- Data for Image Categories ---
const categories = [
  {
    id: 'men',
    name: "Men's Fashion",
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=2832&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Men's clothing
    subCategories: ['All', 'Formals', 'Casuals', 'Ethnic Wear', 'Sports Wear', 'Accessories'],
  },
  {
    id: 'women',
    name: "Women's Fashion",
    image: 'https://images.unsplash.com/photo-1596752766624-9169608246d6?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Women's clothing
    subCategories: ['All', 'Dresses', 'Western Wear', 'Ethnic Wear', 'Loungewear', 'Footwear'],
  },
  {
    id: 'kids',
    name: "Kids' Fashion",
    image: 'https://images.unsplash.com/photo-1579709282386-b4859cecced3?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Kids clothing
    subCategories: ['All', 'Boys Wear', 'Girls Wear', 'Toddler Clothing', 'Baby Essentials'],
  },
  {
    id: 'groceries',
    name: "Groceries",
    image: 'https://images.unsplash.com/photo-1542838132-92569c272993?q=80&w=2832&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Groceries
    subCategories: ['All', 'Fruits & Vegetables', 'Dairy & Bakery', 'Snacks & Beverages', 'Spices & Grains'],
  },
  {
    id: 'jewelry',
    name: "Jewelry & Accessories",
    image: 'https://images.unsplash.com/photo-1621609761921-6a9780517869?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Jewelry
    subCategories: ['All', 'Gold', 'Diamond', 'Silver', 'Fashion Accessories'],
  },
  {
    id: 'home_kitchen',
    name: "Home & Kitchen",
    image: 'https://images.unsplash.com/photo-1556912167-a066914589a1?q=80&w=2832&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Home & Kitchen
    subCategories: ['All', 'Cookware', 'Serveware', 'Decor', 'Appliances'],
  },
];

export const MailHome = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null); // ID of the selected main category
  const [selectedSubCategory, setSelectedSubCategory] = useState(null); // Name of the selected sub-category
  const [appliedFilters, setAppliedFilters] = useState({}); // For PopupFilter, could be extended later

  const malls = [
    {
      name: 'SPY Reddy Super Market',
      category: ['Groceries', 'Household Items', 'Daily Needs'],
      location: 'Atmakur Road, Nandyal, Andhra Pradesh',
      rating: 4.3,
      contact: '9876543210',
      image: 'https://via.placeholder.com/300/FFC107/000000?Text=SPY%20Reddy', // Placeholder
      timing: '9:00 AM - 9:00 PM',
    },
    {
      name: 'CMR Shopping Mall',
      category: ["Men's Clothing", "Women's Clothing", 'Jewelry'],
      location: 'Atmakur Road, Nandyal, Andhra Pradesh',
      rating: 4.5,
      contact: '9876543211',
      image: 'https://via.placeholder.com/300/2196F3/FFFFFF?Text=CMR%20Mall', // Placeholder
      timing: '10:00 AM - 10:00 PM',
    },
    {
      name: 'Unlimited Fashion Store',
      category: ["Men's Clothing", "Women's Clothing", "Kids' Clothing", 'Casuals'],
      location: 'Srinivasa Nagar, Nandyal, Andhra Pradesh',
      rating: 4.2,
      contact: '9876543212',
      image: 'https://via.placeholder.com/300/4CAF50/FFFFFF?Text=Unlimited', // Placeholder
      timing: '10:00 AM - 9:00 PM',
    },
    {
      name: 'GV Mall',
      category: ['Clothing', 'Accessories', "Men's Clothing"],
      location: 'Nandyal, Andhra Pradesh',
      rating: 4.0,
      contact: '9876543213',
      image: 'https://via.placeholder.com/300/F44336/FFFFFF?Text=GV%20Mall', // Placeholder
      timing: '10:00 AM - 9:30 PM',
    },
    {
      name: 'Vishal Mega Mart',
      category: ["Men's Clothing", "Women's Clothing", 'Home & Kitchen', 'Groceries'],
      location: 'Atmakur Bus Stand Road, Nandyal, Andhra Pradesh',
      rating: 4.1,
      contact: '9876543214',
      image: 'https://via.placeholder.com/300/9C27B0/FFFFFF?Text=Vishal%20Mega', // Placeholder
      timing: '9:30 AM - 9:00 PM',
    },
    {
      name: 'Reliance Trends',
      category: ["Men's Clothing", "Women's Clothing", "Kids' Fashion", 'Formal'],
      location: 'Bellary Chowrasta, Nandyal, Andhra Pradesh',
      rating: 4.4,
      contact: '9876543215',
      image: 'https://via.placeholder.com/300/00BCD4/FFFFFF?Text=Reliance', // Placeholder
      timing: '10:00 AM - 9:00 PM',
    },
    {
      name: 'Max Fashion',
      category: ["Men's Clothing", "Women's Clothing", 'Footwear', 'Casuals'],
      location: 'SR Complex, Nandyal, Andhra Pradesh',
      rating: 4.2,
      contact: '9876543216',
      image: 'https://via.placeholder.com/300/3F51B5/FFFFFF?Text=Max%20Fashion', // Placeholder
      timing: '10:00 AM - 10:00 PM',
    },
    {
      name: 'KLM Fashion Mall',
      category: ['Ethnic Wear', 'Casual Wear', 'Jewelry', "Women's Clothing"],
      location: 'Main Road, Nandyal, Andhra Pradesh',
      rating: 4.5,
      contact: '9876543217',
      image: 'https://via.placeholder.com/300/E91E63/FFFFFF?Text=KLM%20Fashion', // Placeholder
      timing: '10:30 AM - 9:30 PM',
    },
    {
      name: 'Jayalakshmi Shopping Mall',
      category: ['Ethnic Wear', "Men's & Women's Clothing"],
      location: 'Opposite RTC Bus Stand, Nandyal, Andhra Pradesh',
      rating: 4.6,
      contact: '9876543218',
      image: 'https://via.placeholder.com/300/9E9E9E/FFFFFF?Text=Jayalakshmi', // Placeholder
      timing: '10:00 AM - 10:00 PM',
    },
    {
      name: 'D Mart',
      category: ['Groceries', 'Clothing', 'Home Essentials', 'Daily Needs'],
      location: 'Bypass Road, Nandyal, Andhra Pradesh',
      rating: 4.3,
      contact: '9876543219',
      image: 'https://via.placeholder.com/300/673AB7/FFFFFF?Text=D%20Mart', // Placeholder
      timing: '9:00 AM - 9:30 PM',
    },
    {
      name: 'Metro Shoes',
      category: ["Men's Footwear", "Women's Footwear"],
      location: 'Main Market, Nandyal, Andhra Pradesh',
      rating: 4.2,
      contact: '9876543220',
      image: 'https://via.placeholder.com/300/009688/FFFFFF?Text=Metro%20Shoes', // Placeholder
      timing: '10:00 AM - 9:00 PM',
    },
    {
      name: 'Tanishq Jewellery',
      category: ['Gold Jewellery', 'Diamond Jewellery', 'Jewelry'],
      location: 'Nandyal Main Road, Andhra Pradesh',
      rating: 4.8,
      contact: '9876543221',
      image: 'https://via.placeholder.com/300/FF5722/FFFFFF?Text=Tanishq', // Placeholder
      timing: '10:30 AM - 8:30 PM',
    },
  ];

  const handleSearch = (term) => {
    setSearchTerm(term);
    setSelectedCategory(null); // Clear category/sub-category on search
    setSelectedSubCategory(null);
  };

  const handleCategorySelect = (categoryId) => {
    if (selectedCategory === categoryId) {
      // If same category clicked again, deselect it
      setSelectedCategory(null);
      setSelectedSubCategory(null);
    } else {
      setSelectedCategory(categoryId);
      setSelectedSubCategory(null); // Reset sub-category when main category changes
    }
  };

  const handleSubCategorySelect = (subCategoryName) => {
    if (selectedSubCategory === subCategoryName || subCategoryName === 'All') {
      setSelectedSubCategory(null); // Deselect if same sub-category or 'All' clicked
    } else {
      setSelectedSubCategory(subCategoryName);
    }
  };

  const handleClearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory(null);
    setSelectedSubCategory(null);
    setAppliedFilters({});
  };

  const currentSubCategories = useMemo(() => {
    const categoryObj = categories.find(cat => cat.id === selectedCategory);
    return categoryObj ? categoryObj.subCategories : [];
  }, [selectedCategory]);

  const filteredMails = useMemo(() => {
    return malls.filter(mail => {
      const matchesSearch = searchTerm
        ? mail.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mail.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mail.category.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()))
        : true;

      const matchesCategory = selectedCategory
        ? mail.category.some(mailCat => {
            const categoryObj = categories.find(c => c.id === selectedCategory);
            if (!categoryObj) return false;

            // Normalize category names for better matching (e.g., "Men's Clothing" vs "Men's Fashion")
            const normalizedMailCat = mailCat.toLowerCase().replace(/['& ]/g, ''); // Removes ', &, spaces
            const normalizedSelectedCatName = categoryObj.name.toLowerCase().replace(/['& ]/g, '');

            return normalizedMailCat.includes(normalizedSelectedCatName) ||
                   normalizedSelectedCatName.includes(normalizedMailCat);
          })
        : true;
        
      const matchesSubCategory = selectedSubCategory
        ? mail.category.some(mailCat => mailCat.toLowerCase().includes(selectedSubCategory.toLowerCase()))
        : true;

      // Extend this logic to include `appliedFilters` if you integrate it fully
      // For now, these are the primary filters.

      return matchesSearch && matchesCategory && matchesSubCategory;
    });
  }, [malls, searchTerm, selectedCategory, selectedSubCategory, appliedFilters]);

  // Determine active filters for display
  const activeFiltersDisplay = useMemo(() => {
    const filters = [];
    if (searchTerm) filters.push(`Search: "${searchTerm}"`);
    if (selectedCategory) {
      const catName = categories.find(cat => cat.id === selectedCategory)?.name;
      if (catName) filters.push(catName);
    }
    if (selectedSubCategory) filters.push(selectedSubCategory);

    // You can also add filters from `appliedFilters` here if they are generic (e.g., ratings)

    return filters;
  }, [searchTerm, selectedCategory, selectedSubCategory, appliedFilters]);


  return (
    <div className="bg-gray-50 min-h-screen font-sans"> {/* Added font-sans */}
      {/* Hero Section */}
      <HeroSection
        title="Discover Your Favorite Stores"
        description="Explore a wide variety of shops, from fashion to electronics, all under one roof. Find the perfect items and enjoy a delightful shopping experience today!"
        primaryBtnText="Explore Now"
        secondaryBtnText="Contact Us"
        imageSrc={Shopping}
      />

      {/* Shop by Category Section - Myntra/Flipkart Style */}
      <section className="py-16 bg-white shadow-inner"> {/* Added shadow-inner for depth */}
        <Tittle title={'Shop by Category'} subTitle={'Explore our curated collections'} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10"> {/* Increased mt */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"> {/* Increased gap */}
            {categories.map((cat) => (
              <div
                key={cat.id}
                className={`relative group cursor-pointer rounded-xl overflow-hidden border border-gray-200
                            transform transition-all duration-300 ease-in-out
                            ${selectedCategory === cat.id 
                               ? 'ring-4 ring-blue-500 ring-offset-2 scale-105 shadow-xl' 
                               : 'shadow-md hover:shadow-lg hover:-translate-y-1'
                            }`}
                onClick={() => handleCategorySelect(cat.id)}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-40 object-cover object-center transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex items-end justify-center p-3"> {/* Gradient overlay */}
                  <span className="text-white text-lg font-semibold text-center leading-tight drop-shadow-lg">
                    {cat.name}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Sub-Category Filters */}
          {selectedCategory && currentSubCategories.length > 0 && (
            <div className="mt-12 flex flex-wrap justify-center gap-3 animate-fade-in"> {/* Added animation */}
              {currentSubCategories.map((subCat) => (
                <button
                  key={subCat}
                  onClick={() => handleSubCategorySelect(subCat)}
                  className={`
                    px-5 py-2 rounded-full text-base font-medium
                    transition-all duration-200 ease-in-out
                    border-2
                    ${selectedSubCategory === subCat || (selectedSubCategory === null && subCat === 'All')
                      ? 'bg-blue-600 text-white border-blue-600 shadow-lg'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-700'
                    }
                  `}
                >
                  {subCat}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Explore Section Title */}
      <section className="py-12 bg-gray-50">
        <Tittle title={'Explore the Shopping Scene'} subTitle={'Discover the latest trends and store openings'} />
      </section>

      {/* Search and Filter Bar */}
      <div className="sticky top-0 bg-white z-20 shadow-lg border-b border-gray-200 py-4 px-4"> {/* Increased padding, shadow, z-index */}
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-4"> {/* Centered and improved layout */}
          <div className="flex-grow w-full">
            <SearchBar placeholder="Search for stores, categories..." onSearch={handleSearch} />
          </div>
          <div className="flex items-center gap-3">
            <PopupFilter onApply={(filters) => setAppliedFilters(filters)} />
            {/* Example static buttons - consider making these dynamic if they are truly filters */}
            <button className="hidden sm:inline-flex bg-white border border-gray-300 hover:border-blue-500 text-gray-700 px-4 py-2 rounded-lg focus:outline-none transition-colors duration-200 text-sm">
              Popular Malls
            </button>
            <button className="hidden sm:inline-flex bg-white border border-gray-300 hover:border-blue-500 text-gray-700 px-4 py-2 rounded-lg focus:outline-none transition-colors duration-200 text-sm">
              Top Shops
            </button>
          </div>
        </div>

        {/* Display Active Filters and Clear All */}
        {activeFiltersDisplay.length > 0 && (
          <div className="max-w-4xl mx-auto mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center gap-2 text-sm text-gray-700">
            <span className="font-semibold text-gray-800 mr-1">Active Filters:</span>
            {activeFiltersDisplay.map((filter, index) => (
              <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-1">
                {filter}
                {/* Could add individual clear buttons here if desired */}
              </span>
            ))}
            <button
              onClick={handleClearAllFilters}
              className="ml-auto px-3 py-1 bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors duration-200 text-xs font-medium"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Display Stores */}
      <section className="py-16 bg-gray-50"> {/* Increased padding */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredMails.length > 0 ? (
            <DisplayComponent mails={filteredMails} />
          ) : (
            <div className="py-20 text-center text-gray-600">
              <p className="text-3xl font-bold mb-4">No results found.</p>
              <p className="text-lg">Try adjusting your search or filters.</p>
              <button
                onClick={handleClearAllFilters}
                className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Basic Tailwind custom animation for fade-in (add to your CSS file if not already present) */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};