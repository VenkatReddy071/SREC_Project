import React, { useState } from 'react';
import SchoolHeader from "../../../assets/SchoolHeader.jpg";
import School1 from "../../../assets/Shopping.jpg";
import School2 from "../../../assets/Shopping1.jpg";
import { Developers } from './Developers';
import ContactUs from '../Contactus';

export const About = () => {
  const [active, setActive] = useState("Trending Now");
  const Switch = (newService) => {
    setActive(newService);
  };

  const services = [
    { title: "Doctor Appointments", description: "Book appointments with top specialists near you." },
    { title: "Restaurant Reservations", description: "Reserve tables, order takeaways, or get food delivered." },
    { title: "School Information", description: "Detailed insights about schools and colleges in your city." },
    { title: "Online Shopping", description: "Find the best offers on clothing, electronics, and more." },
  ];

  const news = [
    { title: "Website Launched!", description: "We are excited to announce the launch of our new platform." },
    { title: "New Services Added", description: "Explore the latest features we’ve added to make your life easier." },
    { title: "Exclusive Offers", description: "Avail discounts on online shopping and fitness classes." },
  ];

  const offers = [
    {
      category: "Hospitals",
      title: "20% off on health check-ups",
      description: "Get comprehensive health check-ups at a discounted rate.",
      img: School1,
      day: "15-May"
    },
    {
      category: "Emails",
      title: "Free Email Campaign Analysis",
      description: "Analyze your email campaigns for free this month.",
      img: School1,
      day: "15-May"
    },
    {
      category: "Restaurants",
      title: "Buy 1 Get 1 Free",
      description: "Exclusive dining offers at top restaurants.",
      img: School2,
      day: "15-May"
    },
    {
      category: "Hospitals",
      title: "20% off on health check-ups",
      description: "Get comprehensive health check-ups at a discounted rate.",
      img: School1,
      day: "15-May"
    },
    {
      category: "Hospitals",
      title: "20% off on health check-ups",
      description: "Get comprehensive health check-ups at a discounted rate.",
      img: School1,
      day: "15-May"
    },
    {
      category: "Hospitals",
      title: "20% off on health check-ups",
      description: "Get comprehensive health check-ups at a discounted rate.",
      img: School1,
      day: "16-May"
    },
    {
      category: "Hospitals",
      title: "20% off on health check-ups",
      description: "Get comprehensive health check-ups at a discounted rate.",
      img: School1,
      day: "16-May"
    }, {
      category: "Hospitals",
      title: "20% off on health check-ups",
      description: "Get comprehensive health check-ups at a discounted rate.",
      img: School1,
      day: "16-May"
    },
    {
      category: "Hospitals",
      title: "20% off on health check-ups",
      description: "Get comprehensive health check-ups at a discounted rate.",
      img: School1,
      day: "16-May"
    },
  ];
  const [selectedService, setSelectedService] = useState(null);

  return (
    <>
      <div className="about-page py-8 px-4 bg-gray-100 flex flex-col lg:flex-row gap-6">
        <div className="lg:w-3/12 bg-white shadow-lg rounded-xl py-4 h-auto">
          <h3 className="text-2xl font-bold px-6 text-gray-900 border-b pb-3 mb-4">Our Services</h3>
          <ul className="px-4">
            {services.map((item, index) => (
              <li
                key={index}
                onClick={() => setSelectedService(selectedService === index ? null : index)}
                className={`py-3 px-2 rounded-lg cursor-pointer transition-all duration-300
                            ${selectedService === index
                    ? "bg-blue-100 text-blue-800 font-semibold shadow-inner"
                    : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                  }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-lg">{item.title}</span>
                  <svg
                    className={`w-5 h-5 transition-transform duration-300 ${selectedService === index ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
                {selectedService === index && (
                  <p className="text-gray-600 text-sm mt-2 pl-2 border-l-2 border-blue-300">{item.description}</p>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:w-6/12 bg-white shadow-lg rounded-xl p-6">
          <img
            src={SchoolHeader}
            alt="NANDYAL INFO - Connecting Lives"
            className="w-full h-auto rounded-lg mb-6 shadow-md"
            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/800x450/E0E0E0/000000?text=NANDYAL+INFO"; }}
          />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">About NANDYAL INFO</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            Welcome to NANDYAL INFO, your ultimate online hub designed to streamline your daily life. We are committed to providing a seamless experience by connecting you with essential services in healthcare, fashion, education, and dining. Our platform is built to make finding and accessing what you need incredibly easy and efficient.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed mt-4">
            From booking doctor appointments to reserving restaurant tables, exploring educational opportunities, and shopping for the latest fashion trends, NANDYAL INFO brings all your diverse needs onto a single, unified platform. We prioritize user-friendliness, secure transactions, and dedicated support to ensure an unparalleled online experience. Join us today and unlock a world of convenience and quality at your fingertips!
          </p>
        </div>

        <div className="lg:w-3/12 bg-white shadow-lg rounded-xl py-4 h-auto">
          <h3 className="text-2xl font-bold px-6 text-gray-900 border-b pb-3 mb-4">Top News</h3>
          <div className="px-4 mt-4 space-y-4">
            {news.map((item, index) => (
              <div key={index} className="bg-blue-50 p-4 rounded-lg shadow-sm hover:shadow-md border border-blue-100 transition-shadow">
                <h4 className="font-bold text-blue-800 text-lg mb-1">{item.title}</h4>
                <p className="text-gray-700 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className='bg-white px-4 py-6 shadow-inner'>
        <div className='flex gap-8 m-2 border-b-2 border-gray-200'>
          <h1
            onClick={() => Switch("Trending Now")}
            className={`text-xl font-semibold p-4 cursor-pointer transition-colors duration-300
                        ${active === "Trending Now" ? "border-blue-600 border-b-2 text-blue-600" : "text-gray-700 hover:text-blue-500"}`}
          >
            Trending Now
          </h1>
          <h1
            onClick={() => Switch("Meet Us")}
            className={`text-xl font-semibold p-4 cursor-pointer transition-colors duration-300
                        ${active !== "Trending Now" ? "border-blue-600 border-b-2 text-blue-600" : "text-gray-700 hover:text-blue-500"}`}
          >
            Meet Us
          </h1>
        </div>
      </div>

      {active === "Trending Now" ? (
        <div className="bg-gray-50 px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {offers.map((offer, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                <img
                  src={offer.img}
                  alt={offer.title}
                  className='w-full h-48 object-cover rounded-lg mb-4 shadow-sm'
                  onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x200/E0E0E0/000000?text=Offer+Image"; }}
                />
                <h4 className="font-bold text-gray-900 text-xl mb-2">{offer.category}: {offer.title}</h4>
                <p className="text-gray-700 text-base flex-grow mb-3">{offer.description}</p>
                <p className='text-sm text-gray-500 mt-auto'>{offer.day}</p>
              </div>
            ))}
          </div>
          
        </div>
        
      ) : (
        <div>{<Developers />}</div>
      )}
    
    </>
  );
};
