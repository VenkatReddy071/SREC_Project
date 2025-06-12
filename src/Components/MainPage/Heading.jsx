import React from 'react';
import { Buttons } from '../UseButtons.jsx/Buttons';
import Doctor from "../../assets/Doctor.avif"
import Restaurant from "../../assets/Restaurant.avif"
import Shopping from "../../assets/Shopping.jpg"
import Schools from "../../assets/Schools.jpg"
import { Content } from './Content';
import { RiBox2Line } from 'react-icons/ri';
import { IoIosArrowForward } from 'react-icons/io';
import { Link } from 'react-router-dom';
import HomePage from "./HomePage"
export const Heading = () => {
  const content = [
    {
      Sub: '',
      Heading: 'Explore Our Comprehensive Schools & Colleges Section for Informed Decisions',
      Info: 'Discover detailed information about the local schools and colleges. From curriculum to admission Process, we provide everything you need to make informed choices.',
      divBox: [
        {
          Icon: <RiBox2Line />,
          Heading: 'Detailed Insights',
          Info: 'Access essential details like fees, seat Availability, and contact information.',
        },
        {
          Icon: <RiBox2Line />,
          Heading: 'Get Started',
          Info: 'Visit our schools & Colleges section to learn more and explore options.',
        },
      ],
      Button: 'Learn More',
      link:"/schools",
      Img: Schools,
      Reverse: false,
    },
    {
      Sub: 'Health',
      Heading: 'Explore Top Hospitals in Your Area',
      Info: 'Discover a range of hospitals with specialization services tailored to your needs. Easily find doctors, book appointments, and access essential healthcare information.',
      divBox: [
        {
          Icon: <RiBox2Line />,
          Heading: 'Find Doctors',
          Info: 'Search for quality doctors by specialization and location effortlessly.',
        },
        {
          Icon: <RiBox2Line />,
          Heading: 'Book Appointments',
          Info: 'Schedule your appointments with just a few clicks.',
        },
      ],
      Button: 'Learn More',
      Img: Doctor,
      link:"/Hospitals",
      Reverse: true,
    },
    {
      Sub: '',
      Heading: 'Discover Local Dining: Explore the Best Restaurants in Your Area ',
      Info: 'Indulge in a culinary adventure with our curated list of local restaurants. From cozy cafes to fine dining, find the perfect spot to satisfy your cravings.',
      divBox: '',
      Button: '',
      SubButton: '',
      Img: Restaurant,
      Reverse: false,
    },
    {
      Sub: '',
      Heading: 'Discover the best shopping malls near you with exclusive offers and promotions. ',
      Info: 'Explore a wide range of stores from fashion to electronics in our shopping malls section. Find the latest deals and plan your visit today!',
      divBox: '',
      Button: '',
      SubButton: '',
      Img: Shopping,
      Reverse: true,
    },
    
  ];

  const divBox = [
    {
      Icon: <RiBox2Line />,
      Heading: 'Comprehensive Information at Your Disposal',
      Info: 'Access detailed insights about schools, doctors and more.',
    },
    {
      Icon: <RiBox2Line />,
      Heading: 'Quick and Easy Booking Options Available',
      Info: 'Schedule appointments and make reservations effortlessly.',
    },
    {
      Icon: <RiBox2Line />,
      Heading: 'User-Friendly Design for All Devices',
      Info: 'Enjoy a responsive layout that adapts to your needs.',
    },
  ];

  return (
    <div className="bg-gray-50  ">
      <div className="w-full  px-4 sm:px-6 lg:px-0">
        {/* Hero Section */}
        <HomePage/>

        {/* Content Sections */}
        <div className="mb-12 md:mb-20">
          {content.map((item, index) => (
            <Content key={index} item={item} reverse={item.Reverse} />
          ))}
        </div>

        {/* Features Section */}
        <div className="py-12 md:py-16  rounded-lg  mb-12 md:mb-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h4 className="text-xl font-semibold text-blue-600 mb-2">Explore</h4>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Discover Local Services at Your Fingertips
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              Our platform offers seamless navigation to connect you with essential
              local services. From hospitals to restaurants, find everything you
              need in one place.
            </p>
            <div className="md:flex justify-center gap-6">
              {divBox.map((box, index) => (
                <div
                  key={index}
                  className="w-full md:w-1/3 p-8 bg-gray-50 rounded-lg shadow-sm"
                >
                  <div className="text-3xl text-blue-500 flex justify-center items-center mb-4">
                    {box.Icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{box.Heading}</h3>
                  <p className="text-gray-600 leading-relaxed">{box.Info}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action Section */}
        {/* <div className="py-12 md:py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to Explore Local Services?
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <button className="h-12 border-2 border-blue-600 text-blue-600 px-6 py-3 font-semibold rounded-full hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50">
              Learn More
            </button>
            <button className="flex gap-2 justify-center items-center bg-blue-600 text-white px-6 py-3 font-semibold rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50">
              Sign Up <IoIosArrowForward />
            </button>
          </div>
        </div> */}
      </div>

      {/* Dark Section */}
      <div className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-bold text-3xl md:text-4xl mb-6">
            Discover Local Services Today!
          </h2>
          <p className="text-lg md:text-xl leading-relaxed mb-8">
            Explore a variety of local services tailored to your needs, all in one
            place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/About-us">
            <button className="w-full sm:w-auto bg-white text-gray-900 font-semibold py-3 px-6 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50">
              Explore
            </button>
            </Link>
            <button className="w-full sm:w-auto border-2 border-white font-semibold py-3 px-6 rounded-full hover:bg-white hover:text-gray-900 transition focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50">
              Get Started
            </button>
          </div>
        </div>
      </div>

      {/* Empowering Communities Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Empowering communities by connecting you to essential local services
            effortlessly
          </h2>
          <p className="mt-4 text-lg text-gray-700 leading-relaxed mb-8">
            Our platform simplifies your search for local services, from health to
            dining. With a user-friendly interface and comprehensive information,
            we ensure you find exactly what you need, when you need it.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button className="h-12 border-2 border-blue-600 text-blue-600 px-6 py-3 font-semibold rounded-full hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50">
              Learn More
            </button>
            <button className="flex gap-2 justify-center items-center bg-blue-600 text-white px-6 py-3 font-semibold rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50">
              Sign Up <IoIosArrowForward />
            </button>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-gray-800 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
            Stay Updated with Our Newsletter
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed mb-6">
            Subscribe now for the latest updates and exclusive offers from our
            platform.
          </p>
          <div className="mt-4 flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              name="email"
              placeholder="Your Email here"
              className="w-full sm:w-auto px-4 py-3 rounded-full text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 placeholder-gray-400"
            />
            <button className="w-full sm:w-auto bg-blue-600 text-white font-semibold py-3 px-6 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50">
              Join Us
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            By clicking Join Us, you agree to our Terms and Conditions.
          </p>
        </div>
      </div>
    </div>
  );
};