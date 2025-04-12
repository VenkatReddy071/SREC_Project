// import React from 'react';
// import HeroSection from '../../Pages/HeroSection';
// import HeadingImg from "../../assets/Header.jpg";
// import ShoppingExperience from '../../Pages/ShoppingExprience';
// import { Tittle } from '../../Pages/Tittle';
// import { SearchBar } from '../../Pages/SearchBar';
// import PopupFilter from '../../Pages/Filter';
// import { DisplayComponent } from '../../Pages/DisplayComponent';

// export const MailHome = () => {
//   const mails=
//     [
//       {
//         "name": "SPY Reddy Super Market",
//         "category": ["Groceries", "Household Items", "Clothing"],
//         "location": "Atmakur Road, Nandyal, Andhra Pradesh",
//         "rating": 4.3,
//         "contact": "9876543210",
//         "image": "https://example.com/spy_reddy.jpg",
//         "timing": "9:00 AM - 9:00 PM"
//       },
//       {
//         "name": "CMR Shopping Mall",
//         "category": ["Men's Clothing", "Women's Clothing", "Jewelry"],
//         "location": "Atmakur Road, Nandyal, Andhra Pradesh",
//         "rating": 4.5,
//         "contact": "9876543211",
//         "image": "https://example.com/cmr_mall.jpg",
//         "timing": "10:00 AM - 10:00 PM"
//       },
//       {
//         "name": "Unlimited Fashion Store",
//         "category": ["Men's Clothing", "Women's Clothing", "Kids' Clothing"],
//         "location": "Srinivasa Nagar, Nandyal, Andhra Pradesh",
//         "rating": 4.2,
//         "contact": "9876543212",
//         "image": "https://example.com/unlimited_fashion.jpg",
//         "timing": "10:00 AM - 9:00 PM"
//       },
//       {
//         "name": "GV Mall",
//         "category": ["Clothing", "Accessories"],
//         "location": "Nandyal, Andhra Pradesh",
//         "rating": 4.0,
//         "contact": "9876543213",
//         "image": "https://example.com/gv_mall.jpg",
//         "timing": "10:00 AM - 9:30 PM"
//       },
//       {
//         "name": "Vishal Mega Mart",
//         "category": ["Men's Clothing", "Women's Clothing", "Home & Kitchen"],
//         "location": "Atmakur Bus Stand Road, Nandyal, Andhra Pradesh",
//         "rating": 4.1,
//         "contact": "9876543214",
//         "image": "https://example.com/vishal_mega_mart.jpg",
//         "timing": "9:30 AM - 9:00 PM"
//       },
//       {
//         "name": "Reliance Trends",
//         "category": ["Men's Clothing", "Women's Clothing", "Kids' Fashion"],
//         "location": "Bellary Chowrasta, Nandyal, Andhra Pradesh",
//         "rating": 4.4,
//         "contact": "9876543215",
//         "image": "https://example.com/reliance_trends.jpg",
//         "timing": "10:00 AM - 9:00 PM"
//       },
//       {
//         "name": "Max Fashion",
//         "category": ["Men's Clothing", "Women's Clothing", "Footwear"],
//         "location": "SR Complex, Nandyal, Andhra Pradesh",
//         "rating": 4.2,
//         "contact": "9876543216",
//         "image": "https://example.com/max_fashion.jpg",
//         "timing": "10:00 AM - 10:00 PM"
//       },
//       {
//         "name": "KLM Fashion Mall",
//         "category": ["Ethnic Wear", "Casual Wear", "Jewelry"],
//         "location": "Main Road, Nandyal, Andhra Pradesh",
//         "rating": 4.5,
//         "contact": "9876543217",
//         "image": "https://example.com/klm_fashion.jpg",
//         "timing": "10:30 AM - 9:30 PM"
//       },
//       {
//         "name": "Jayalakshmi Shopping Mall",
//         "category": ["Ethnic Wear", "Men's & Women's Clothing"],
//         "location": "Opposite RTC Bus Stand, Nandyal, Andhra Pradesh",
//         "rating": 4.6,
//         "contact": "9876543218",
//         "image": "https://example.com/jayalakshmi_mall.jpg",
//         "timing": "10:00 AM - 10:00 PM"
//       },
//       {
//         "name": "D Mart",
//         "category": ["Groceries", "Clothing", "Home Essentials"],
//         "location": "Bypass Road, Nandyal, Andhra Pradesh",
//         "rating": 4.3,
//         "contact": "9876543219",
//         "image": "https://example.com/dmart.jpg",
//         "timing": "9:00 AM - 9:30 PM"
//       },
//       {
//         "name": "Metro Shoes",
//         "category": ["Men's Footwear", "Women's Footwear"],
//         "location": "Main Market, Nandyal, Andhra Pradesh",
//         "rating": 4.2,
//         "contact": "9876543220",
//         "image": "https://example.com/metro_shoes.jpg",
//         "timing": "10:00 AM - 9:00 PM"
//       },
//       {
//         "name": "Tanishq Jewellery",
//         "category": ["Gold Jewellery", "Diamond Jewellery"],
//         "location": "Nandyal Main Road, Andhra Pradesh",
//         "rating": 4.8,
//         "contact": "9876543221",
//         "image": "https://example.com/tanishq.jpg",
//         "timing": "10:30 AM - 8:30 PM"
//       }
//     ]
    
  
//   return (
//     <div>
//       <HeroSection
//         title="Discover Your Favorite Stores at Our Mall"
//         description="Explore a wide variety of shops, from fashion to electronics, all under one roof. 
//         Find the perfect items and enjoy a delightful shopping experience today!"
//         primaryBtnText="Explore"
//         secondaryBtnText="Contact us"
//         imageSrc={HeadingImg}
//       />
      
//       <ShoppingExperience
//         title="Your Ultimate Shopping Experience Awaits"
//         description="Explore a diverse selection of stores tailored to your needs. 
//           From fashion to electronics, find everything you desire under one roof."
//         images={[HeadingImg, HeadingImg, HeadingImg, HeadingImg, HeadingImg, HeadingImg]} // Replace with actual images
//       />
      
//       <Tittle title={"Explore the Shopping Scene"} subTitle={"Discover the latest trends and store openings"} />
      
//       <div className="sticky top-0 bg-white z-10 shadow-md b-2 w-full flex flex-col items-center p-4 max-w-7rem">
//         <SearchBar />
//         <div className='md:hidden'>
//         <PopupFilter onApply={(filters) => console.log("Filters applied:", filters)} className="md:hidden relative right-0"/>
//         </div>
//         <div className="hidden md:flex gap-2 mt-2 justify-center w-full -ml-24">
//           <PopupFilter onApply={(filters) => console.log("Filters applied:", filters)} />
//           <button className="border-2 border-black  px-4  rounded-lg">Popular Malls</button>
//           <button className="border-2 border-black  px-4 py-2 rounded-lg">Shopping Shops</button>
//           <button className="border-2 border-black px-4 py-2 rounded-lg">Men's</button>
//           <button className="border-2 border-black  px-4 py-2 rounded-lg">Women's</button>
//         </div>
//       </div>
//         <DisplayComponent mails={mails}/>
//     </div>
//   );
// };

import React from 'react';
import HeroSection from '../../Pages/HeroSection';
import HeadingImg from '../../assets/Header.jpg';
import ShoppingExperience from '../../Pages/ShoppingExprience';
import { Tittle } from '../../Pages/Tittle';
import { SearchBar } from '../../Pages/SearchBar';
import PopupFilter from '../../Pages/Filter';
import { DisplayComponent } from '../../Pages/DisplayComponent';
import Shopping from "../../assets/Shopping1.jpg"
export const MailHome = () => {
  const mails = [
    {
      name: 'SPY Reddy Super Market',
      category: ['Groceries', 'Household Items', 'Clothing'],
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
      category: ["Men's Clothing", "Women's Clothing", "Kids' Clothing"],
      location: 'Srinivasa Nagar, Nandyal, Andhra Pradesh',
      rating: 4.2,
      contact: '9876543212',
      image: 'https://via.placeholder.com/300/4CAF50/FFFFFF?Text=Unlimited', // Placeholder
      timing: '10:00 AM - 9:00 PM',
    },
    {
      name: 'GV Mall',
      category: ['Clothing', 'Accessories'],
      location: 'Nandyal, Andhra Pradesh',
      rating: 4.0,
      contact: '9876543213',
      image: 'https://via.placeholder.com/300/F44336/FFFFFF?Text=GV%20Mall', // Placeholder
      timing: '10:00 AM - 9:30 PM',
    },
    {
      name: 'Vishal Mega Mart',
      category: ["Men's Clothing", "Women's Clothing", 'Home & Kitchen'],
      location: 'Atmakur Bus Stand Road, Nandyal, Andhra Pradesh',
      rating: 4.1,
      contact: '9876543214',
      image: 'https://via.placeholder.com/300/9C27B0/FFFFFF?Text=Vishal%20Mega', // Placeholder
      timing: '9:30 AM - 9:00 PM',
    },
    {
      name: 'Reliance Trends',
      category: ["Men's Clothing", "Women's Clothing", "Kids' Fashion"],
      location: 'Bellary Chowrasta, Nandyal, Andhra Pradesh',
      rating: 4.4,
      contact: '9876543215',
      image: 'https://via.placeholder.com/300/00BCD4/FFFFFF?Text=Reliance', // Placeholder
      timing: '10:00 AM - 9:00 PM',
    },
    {
      name: 'Max Fashion',
      category: ["Men's Clothing", "Women's Clothing", 'Footwear'],
      location: 'SR Complex, Nandyal, Andhra Pradesh',
      rating: 4.2,
      contact: '9876543216',
      image: 'https://via.placeholder.com/300/3F51B5/FFFFFF?Text=Max%20Fashion', // Placeholder
      timing: '10:00 AM - 10:00 PM',
    },
    {
      name: 'KLM Fashion Mall',
      category: ['Ethnic Wear', 'Casual Wear', 'Jewelry'],
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
      category: ['Groceries', 'Clothing', 'Home Essentials'],
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
      category: ['Gold Jewellery', 'Diamond Jewellery'],
      location: 'Nandyal Main Road, Andhra Pradesh',
      rating: 4.8,
      contact: '9876543221',
      image: 'https://via.placeholder.com/300/FF5722/FFFFFF?Text=Tanishq', // Placeholder
      timing: '10:30 AM - 8:30 PM',
    },
  ];

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <HeroSection
        title="Discover Your Favorite Stores at Our Shopping"
        description="Explore a wide variety of shops, from fashion to electronics, all under one roof. Find the perfect items and enjoy a delightful shopping experience today!"
        primaryBtnText="Explore Now"
        secondaryBtnText="Contact Us"
        imageSrc={Shopping}
      />

      {/* Shopping Experience Section */}
      <div className="py-16 bg-white">
        <ShoppingExperience
          title="Your Ultimate Shopping Experience Awaits"
          description="Explore a diverse selection of stores tailored to your needs. From fashion to electronics, find everything you desire under one roof."
          images={[HeadingImg, HeadingImg, HeadingImg, HeadingImg, HeadingImg, HeadingImg]} // Replace with actual images
        />
      </div>

      {/* Explore Section Title */}
      <div className="py-12 bg-gray-50">
        <Tittle title={'Explore the Shopping Scene'} subTitle={'Discover the latest trends and store openings'} />
      </div>

      {/* Search and Filter Bar */}
      <div className="sticky top-0 bg-white z-10 shadow-md border-b border-gray-200 w-full flex flex-col items-center p-4">
        <div className="max-w-3xl w-full mb-2">
          <SearchBar placeholder="Search for stores, categories..." />
        </div>
        <div className="flex items-center justify-center gap-3 mt-2">
          <div className="md:hidden">
            <PopupFilter onApply={(filters) => console.log('Filters applied:', filters)} />
          </div>
          <div className="hidden md:flex gap-2">
            <PopupFilter onApply={(filters) => console.log('Filters applied:', filters)} />
            <button className="bg-white border border-gray-300 hover:border-blue-500 text-gray-700 px-4 py-2 rounded-lg focus:outline-none">
              Popular Malls
            </button>
            <button className="bg-white border border-gray-300 hover:border-blue-500 text-gray-700 px-4 py-2 rounded-lg focus:outline-none">
              Top Shops
            </button>
            <button className="bg-white border border-gray-300 hover:border-blue-500 text-gray-700 px-4 py-2 rounded-lg focus:outline-none">
              Men's Fashion
            </button>
            <button className="bg-white border border-gray-300 hover:border-blue-500 text-gray-700 px-4 py-2 rounded-lg focus:outline-none">
              Women's Fashion
            </button>
          </div>
        </div>
      </div>

      {/* Display Stores */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <DisplayComponent mails={mails} />
        </div>
      </div>

      {/* Call to Action Section (Optional - Add if needed) */}
      {/* <div className="bg-white py-16">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Explore?</h2>
          <p className="text-lg text-gray-700 mb-8">Find your favorite stores and discover new ones today!</p>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:shadow-outline">
            Explore Now
          </button>
        </div>
      </div> */}
    </div>
  );
};