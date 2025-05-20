import React, { useState } from 'react';
import SchoolHeader from "../../../assets/SchoolHeader.jpg"
export const About = () => {
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

  const [selectedService, setSelectedService] = useState(null);

  return (
    <div className="about-page py-8 px-4 bg-gray-50 flex flex-col lg:flex-row gap-6">
      {/* Sidebar */}
      <div className="lg:w-3/12 bg-white shadow-md rounded-lg py-4">
        <h3 className="text-xl font-semibold px-4 text-gray-800 border-b pb-2">Services</h3>
        <ul className="mt-4 px-4">
          {services.map((item, index) => (
            <div>

            <li
              key={index}
              onClick={() => setSelectedService(index)}
              className="py-2 text-black font-semibold text-lg hover:text-blue-600 cursor-pointer border-b"
            >
              {item.title}
                    {selectedService ===index && (
              <div>

                <p className="text-gray-700 text-base mt-4 font-light">{item.description}</p>
              </div>
          )}
            </li>
                
            </div>
          ))}
        
        </ul>
        
      </div>

      {/* Middle Section */}
      <div className="lg:w-6/12 bg-white shadow-md rounded-lg p-6">
        <img
          src={SchoolHeader}
          alt="About Us"
          className="w-full h-auto rounded-lg mb-6"
        />
         
          <p className="text-gray-700 text-lg">
            Welcome to NC Info, where we aim to provide a seamless experience for all your daily needs.
            From booking doctor appointments to reserving restaurant tables, we’ve got you covered.
            Stay connected with us for more updates and exclusive features.
          </p>
        
      </div>

      {/* Top News */}
      <div className="lg:w-3/12 bg-white shadow-md rounded-lg py-4">
        <h3 className="text-xl font-semibold px-4 text-gray-800 border-b pb-2">Top News</h3>
        <div className="px-4 mt-4 space-y-4">
          {news.map((item, index) => (
            <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-sm hover:shadow-md">
              <h4 className="font-bold text-blue-600">{item.title}</h4>
              <p className="text-gray-600 mt-2">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
