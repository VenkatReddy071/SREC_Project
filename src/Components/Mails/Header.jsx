import React, { useState } from 'react';
import { Header } from '../../Pages/Header'; // Assuming Header component is well-defined
import heroImage from '../../assets/Shopping1.jpg';
import mallImage1 from '../../assets/Shopping1.jpg'; // Placeholder images
import mallImage2 from '../../assets/Shopping1.jpg';
import mallImage3 from '../../assets/Shopping1.jpg';
import offerImage1 from '../../assets/Shopping1.jpg';
import partnerImage from '../../assets/Shopping1.jpg'; // New image for partner section
import topPickImage from '../../assets/Shopping1.jpg'; // New image for top picks

function Header1() {
  const [currentCollectionIndex, setCurrentCollectionIndex] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleLearnMoreClick = () => {
    alert('Learn More clicked!');
  };

  const handleContactUsClick = () => {
    alert('Contact Us clicked!');
  };

  const headerButtons = [
    {
      text: 'Learn More',
      onClick: handleLearnMoreClick,
      bgColor: '#3b82f6', // blue-500
      textColor: 'white',
    },
    {
      text: 'Contact Us',
      onClick: handleContactUsClick,
      bgColor: 'white',
      textColor: '#3b82f6', // blue-500
      border: '2px solid #3b82f6',
    },
  ];

  const collections = [
    {
      title: 'Top Malls',
      description: 'Discover the most popular and high-rated shopping destinations.',
      image: mallImage1,
      link: '#top-malls',
    },
    {
      title: 'Trending Malls',
      description: 'Stay updated with the latest and most buzz-worthy shopping centers.',
      image: mallImage2,
      link: '#trending-malls',
    },
    {
      title: 'Budget-Friendly Malls',
      description: 'Find great deals and affordable shopping experiences.',
      image: mallImage3,
      link: '#cheap-malls',
    },
    {
      title: 'Exclusive Offers',
      description: 'Unlock special discounts and promotions at your favorite stores.',
      image: offerImage1,
      link: '#offers',
    },
    {
      title: 'New Arrivals',
      description: 'Be the first to explore the freshest additions to our mall network.',
      image: mallImage1, // Reusing for example
      link: '#new-arrivals',
    },
    {
      title: 'Luxury Boutiques',
      description: 'Indulge in high-end fashion and exclusive brands.',
      image: mallImage2, // Reusing for example
      link: '#luxury-boutiques',
    },
  ];

  // Logic for collection slider
  const itemsPerPage = 3; // Adjust how many items show at once in the slider view
  const totalPages = Math.ceil(collections.length / itemsPerPage);

  const goToNextCollection = () => {
    setCurrentCollectionIndex((prevIndex) => (prevIndex + 1) % totalPages);
  };

  const goToPrevCollection = () => {
    setCurrentCollectionIndex((prevIndex) => (prevIndex - 1 + totalPages) % totalPages);
  };

  const startIndex = currentCollectionIndex * itemsPerPage;
  const visibleCollections = collections.slice(startIndex, startIndex + itemsPerPage);

  // Content for alternating image/text sections
  const mallHighlights = [
    {
      title: 'Top Picks: The Galleria Grand',
      description: 'Experience an unparalleled shopping journey at The Galleria Grand, featuring a curated selection of luxury brands, gourmet dining, and immersive entertainment zones. It\'s more than a mall; it\'s a destination.',
      image: topPickImage,
      alignRight: false, // Content Left, Image Right
    },
    {
      title: 'Hidden Gems: Urban Market Hub',
      description: 'Discover unique local boutiques and artisanal products at Urban Market Hub. This vibrant space supports small businesses and offers a truly authentic shopping experience away from the mainstream.',
      image: mallImage3,
      alignRight: true, // Content Right, Image Left
    },
    {
      title: 'Family Fun: Adventure Plaza Mall',
      description: 'Adventure Plaza Mall is designed for the whole family, with a dedicated kids\' play area, a cinema complex, and diverse food options to satisfy every palate. Shop, play, and create memories!',
      image: mallImage2,
      alignRight: false, // Content Left, Image Right
    },
  ];

  return (
    <div className=" -mr-4">
      {/* Header Section */}
      <Header
        imageUrl={heroImage}
        headingText="Discover Your Favorite Stores at Our Shopping Section"
        paraText="Explore a wide variety of shops, from fashion to electronics, all under one roof. Find perfect items and enjoy a delightful shopping experience today!"
        buttons={headerButtons}
      />


      {/* Filter Sidebar (opens from right) */}
      <div
        className={`fixed inset-y-0 right-0 w-64 bg-white shadow-lg p-6 transform transition-transform duration-300 ease-in-out z-50
          ${isFilterOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">Filters</h3>
          <button onClick={() => setIsFilterOpen(false)} className="text-gray-500 hover:text-gray-700">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        {/* Filter options go here */}
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Category</h4>
            <label className="block">
              <input type="checkbox" className="mr-2" /> Fashion
            </label>
            <label className="block">
              <input type="checkbox" className="mr-2" /> Electronics
            </label>
            <label className="block">
              <input type="checkbox" className="mr-2" /> Home & Living
            </label>
            {/* More categories */}
          </div>
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Price Range</h4>
            <input type="range" className="w-full" />
            <div className="flex justify-between text-sm text-gray-600">
              <span>$0</span>
              <span>$1000+</span>
            </div>
          </div>
          <button className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300">
            Apply Filters
          </button>
        </div>
      </div>
      {/* Overlay when filter is open */}
      {isFilterOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsFilterOpen(false)}
        ></div>
      )}


      {/* Main Content Introduction */}
      <section className="py-16 px-4 md:px-8 bg-gray-50" id="main-intro">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
            Your Ultimate Shopping Experience Awaits
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
            Explore a diverse selection of stores tailored to your needs. From fashion to home decor,
            find everything you desire under one website, making your shopping journey effortless and enjoyable.
          </p>
        </div>
      </section>

      {/* Collections Section with Slider */}
      <section className="py-16 px-4 md:px-8 bg-white" id="collections">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10 text-center">
            Our Curated Collections
          </h2>
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 overflow-hidden">
              {visibleCollections.map((collection, index) => (
                <div
                  key={index}
                  className="bg-gray-100 rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl"
                >
                  <img
                    src={collection.image}
                    alt={collection.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {collection.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {collection.description}
                    </p>
                    <a
                      href={collection.link}
                      className="inline-block text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View Collection &rarr;
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Slider Navigation Buttons */}
            {collections.length > itemsPerPage && (
              <>
                <button
                  onClick={goToPrevCollection}
                  className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 z-10 ml-2"
                >
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                </button>
                <button
                  onClick={goToNextCollection}
                  className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 z-10 mr-2"
                >
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                </button>
              </>
            )}
          </div>
          {/* "More" button for collections */}
          <div className="text-center mt-12">
            <button className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition duration-300">
              View All Collections
            </button>
          </div>
        </div>
      </section>

      {/* Alternating Image/Content Sections (Top Picks, Hidden Gems etc.) */}
      <section className="py-16 bg-gray-100" id="top-picks">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            Handpicked Selections & Experiences
          </h2>
          {mallHighlights.map((highlight, index) => (
            <div
              key={index}
              className={`flex flex-col md:flex-row items-center justify-between gap-12 mb-20 last:mb-0
                ${highlight.alignRight ? 'md:flex-row-reverse' : ''}`}
            >
              <div className="md:w-1/2">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">{highlight.title}</h3>
                <p className="text-lg text-gray-700 mb-6">
                  {highlight.description}
                </p>
                <button className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition duration-300">
                  Explore Now
                </button>
              </div>
              <div className="md:w-1/2">
                <img
                  src={highlight.image}
                  alt={highlight.title}
                  className="w-full h-72 object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      

    </div>
  );
}

export default Header1;