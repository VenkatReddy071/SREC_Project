import React from 'react';
import HeroSection from '../../Pages/HeroSection';
import HeadingImg from "../../assets/Header.jpg";
import ShoppingExperience from '../../Pages/ShoppingExprience';
import { Tittle } from '../../Pages/Tittle';
import { SearchBar } from '../../Pages/SearchBar';
import PopupFilter from '../../Pages/Filter';
import { DisplayComponent } from '../../Pages/DisplayComponent';

export const MailHome = () => {
  const mails=
    [
      {
        "name": "SPY Reddy Super Market",
        "category": ["Groceries", "Household Items", "Clothing"],
        "location": "Atmakur Road, Nandyal, Andhra Pradesh",
        "rating": 4.3,
        "contact": "9876543210",
        "image": "https://example.com/spy_reddy.jpg",
        "timing": "9:00 AM - 9:00 PM"
      },
      {
        "name": "CMR Shopping Mall",
        "category": ["Men's Clothing", "Women's Clothing", "Jewelry"],
        "location": "Atmakur Road, Nandyal, Andhra Pradesh",
        "rating": 4.5,
        "contact": "9876543211",
        "image": "https://example.com/cmr_mall.jpg",
        "timing": "10:00 AM - 10:00 PM"
      },
      {
        "name": "Unlimited Fashion Store",
        "category": ["Men's Clothing", "Women's Clothing", "Kids' Clothing"],
        "location": "Srinivasa Nagar, Nandyal, Andhra Pradesh",
        "rating": 4.2,
        "contact": "9876543212",
        "image": "https://example.com/unlimited_fashion.jpg",
        "timing": "10:00 AM - 9:00 PM"
      },
      {
        "name": "GV Mall",
        "category": ["Clothing", "Accessories"],
        "location": "Nandyal, Andhra Pradesh",
        "rating": 4.0,
        "contact": "9876543213",
        "image": "https://example.com/gv_mall.jpg",
        "timing": "10:00 AM - 9:30 PM"
      },
      {
        "name": "Vishal Mega Mart",
        "category": ["Men's Clothing", "Women's Clothing", "Home & Kitchen"],
        "location": "Atmakur Bus Stand Road, Nandyal, Andhra Pradesh",
        "rating": 4.1,
        "contact": "9876543214",
        "image": "https://example.com/vishal_mega_mart.jpg",
        "timing": "9:30 AM - 9:00 PM"
      },
      {
        "name": "Reliance Trends",
        "category": ["Men's Clothing", "Women's Clothing", "Kids' Fashion"],
        "location": "Bellary Chowrasta, Nandyal, Andhra Pradesh",
        "rating": 4.4,
        "contact": "9876543215",
        "image": "https://example.com/reliance_trends.jpg",
        "timing": "10:00 AM - 9:00 PM"
      },
      {
        "name": "Max Fashion",
        "category": ["Men's Clothing", "Women's Clothing", "Footwear"],
        "location": "SR Complex, Nandyal, Andhra Pradesh",
        "rating": 4.2,
        "contact": "9876543216",
        "image": "https://example.com/max_fashion.jpg",
        "timing": "10:00 AM - 10:00 PM"
      },
      {
        "name": "KLM Fashion Mall",
        "category": ["Ethnic Wear", "Casual Wear", "Jewelry"],
        "location": "Main Road, Nandyal, Andhra Pradesh",
        "rating": 4.5,
        "contact": "9876543217",
        "image": "https://example.com/klm_fashion.jpg",
        "timing": "10:30 AM - 9:30 PM"
      },
      {
        "name": "Jayalakshmi Shopping Mall",
        "category": ["Ethnic Wear", "Men's & Women's Clothing"],
        "location": "Opposite RTC Bus Stand, Nandyal, Andhra Pradesh",
        "rating": 4.6,
        "contact": "9876543218",
        "image": "https://example.com/jayalakshmi_mall.jpg",
        "timing": "10:00 AM - 10:00 PM"
      },
      {
        "name": "D Mart",
        "category": ["Groceries", "Clothing", "Home Essentials"],
        "location": "Bypass Road, Nandyal, Andhra Pradesh",
        "rating": 4.3,
        "contact": "9876543219",
        "image": "https://example.com/dmart.jpg",
        "timing": "9:00 AM - 9:30 PM"
      },
      {
        "name": "Metro Shoes",
        "category": ["Men's Footwear", "Women's Footwear"],
        "location": "Main Market, Nandyal, Andhra Pradesh",
        "rating": 4.2,
        "contact": "9876543220",
        "image": "https://example.com/metro_shoes.jpg",
        "timing": "10:00 AM - 9:00 PM"
      },
      {
        "name": "Tanishq Jewellery",
        "category": ["Gold Jewellery", "Diamond Jewellery"],
        "location": "Nandyal Main Road, Andhra Pradesh",
        "rating": 4.8,
        "contact": "9876543221",
        "image": "https://example.com/tanishq.jpg",
        "timing": "10:30 AM - 8:30 PM"
      }
    ]
    
  
  return (
    <div>
      <HeroSection
        title="Discover Your Favorite Stores at Our Mall"
        description="Explore a wide variety of shops, from fashion to electronics, all under one roof. 
        Find the perfect items and enjoy a delightful shopping experience today!"
        primaryBtnText="Explore"
        secondaryBtnText="Contact us"
        imageSrc={HeadingImg}
      />
      
      <ShoppingExperience
        title="Your Ultimate Shopping Experience Awaits"
        description="Explore a diverse selection of stores tailored to your needs. 
          From fashion to electronics, find everything you desire under one roof."
        images={[HeadingImg, HeadingImg, HeadingImg, HeadingImg, HeadingImg, HeadingImg]} // Replace with actual images
      />
      
      <Tittle title={"Explore the Shopping Scene"} subTitle={"Discover the latest trends and store openings"} />
      
      <div className="sticky top-0 bg-white z-10 shadow-md b-2 w-full flex flex-col items-center p-4 max-w-7rem">
        <SearchBar />
        <div className='md:hidden'>
        <PopupFilter onApply={(filters) => console.log("Filters applied:", filters)} className="md:hidden relative right-0"/>
        </div>
        <div className="hidden md:flex gap-2 mt-2 justify-center w-full -ml-24">
          <PopupFilter onApply={(filters) => console.log("Filters applied:", filters)} />
          <button className="border-2 border-black  px-4  rounded-lg">Popular Malls</button>
          <button className="border-2 border-black  px-4 py-2 rounded-lg">Shopping Shops</button>
          <button className="border-2 border-black px-4 py-2 rounded-lg">Men's</button>
          <button className="border-2 border-black  px-4 py-2 rounded-lg">Women's</button>
        </div>
      </div>
        <DisplayComponent mails={mails}/>
    </div>
  );
};
