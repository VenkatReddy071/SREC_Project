import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import mission from "../../../assets/mission.jpg";
import care from "../../../assets/care.jpg";
import hos from "../../../assets/hos.jpg";
import contact from "../../../assets/contact.jpg";

const LearnMorePage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-gray-50 font-sans text-gray-800 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-800 to-indigo-900 text-white py-20 md:py-32 overflow-hidden">
        <div className="container mx-auto px-6 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 animate-fade-in-down">
            Empowering Your Health Journey
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-10 opacity-90 animate-fade-in-up">
            Dedicated to delivering exceptional care, innovative solutions, and unwavering support for a healthier you.
          </p>
          <Link to='/Hospitals'>
            <button
              className="bg-white text-blue-800 hover:bg-gray-200 font-bold py-3 px-10 rounded-full shadow-xl transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-75 text-lg"
            >
              Find a Hospital
            </button>
          </Link>
        </div>
        {/* Subtle background overlay/texture for depth */}
        <div className="absolute inset-0 bg-blue-900 opacity-20"></div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 md:py-24 bg-white shadow-lg z-20 relative -mt-12 mx-auto max-w-7xl rounded-3xl p-6 md:p-12">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="flex flex-col justify-center">
            <h2 className="text-4xl md:text-5xl font-bold text-blue-800 mb-6 leading-tight">
              Our Compass: Mission & Vision
            </h2>
            <p className="text-lg leading-relaxed mb-4 text-gray-700">
              Our **mission** is to provide comprehensive, compassionate, and cutting-edge healthcare services that prioritize patient well-being and foster a healthier community. We are dedicated to delivering personalized care with integrity and respect.
            </p>
            <p className="text-lg leading-relaxed text-gray-700">
              Our **vision** is to be the leading healthcare provider, recognized for our innovative medical practices, state-of-the-art facilities, and a patient-centric approach that sets new standards in health and wellness. We strive for continuous improvement and excellence.
            </p>
          </div>
          <div className="relative overflow-hidden rounded-2xl shadow-xl transform transition duration-300 hover:scale-102">
            <img
              src="https://www.freepik.com/free-photo/business-strategy-success-target-goals_1211528.htm#fromView=keyword&page=1&position=2&uuid=c3f824d0-f9e8-4337-99c3-c793f391816a&query=Vision+Mission"
              alt="Mission and Vision"
              className="w-full h-80 object-cover"
              onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/800x400/eeeeee/333333?text=Mission+Image"; }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
              <p className="text-white text-xl font-semibold">Purpose & Future</p>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
          <div className="relative overflow-hidden rounded-2xl shadow-xl transform transition duration-300 hover:scale-102 md:order-2">
            <img
              src={care}
              alt="Modern Facilities"
              className="w-full h-80 object-cover"
              onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/800x400/dddddd/444444?text=Facilities+Image"; }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
              <p className="text-white text-xl font-semibold">Cutting-Edge Technology</p>
            </div>
          </div>
          <div className="flex flex-col justify-center md:order-1">
            <h2 className="text-4xl md:text-5xl font-bold text-teal-700 mb-6 leading-tight">
              State-of-the-Art Facilities
            </h2>
            <p className="text-lg leading-relaxed mb-6 text-gray-700">
              Our hospital is equipped with the latest medical technology and infrastructure designed to support advanced diagnostic and treatment procedures. From modern operating theaters to comfortable patient rooms, every detail is crafted for your safety and comfort.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-3 text-lg">
              <li>Advanced Imaging (MRI, CT Scans)</li>
              <li>Robotic Surgery Suites</li>
              <li>Dedicated Intensive Care Units (ICU)</li>
              <li>Comfortable and Private Patient Rooms</li>
              <li>On-site Pharmacy and Laboratory</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Patient-Centric Care Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
          <div className="flex flex-col justify-center">
            <h2 className="text-4xl md:text-5xl font-bold text-purple-700 mb-6 leading-tight">
              Patient-Centric Care
            </h2>
            <p className="text-lg leading-relaxed mb-6 text-gray-700">
              At the heart of our healthcare philosophy is a deep commitment to patient-centric care. We believe in empowering our patients through education, involving them in decision-making, and providing a supportive environment for recovery and healing.
            </p>
            <p className="text-lg leading-relaxed text-gray-700">
              Our compassionate medical team ensures that each patient receives personalized attention and care plans tailored to their unique health needs and preferences.
            </p>
          </div>
          <div className="relative overflow-hidden rounded-2xl shadow-xl transform transition duration-300 hover:scale-102">
            <img
              src={hos}
              alt="Patient-Centric Care"
              className="w-full h-80 object-cover"
              onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/800x400/cccccc/333333?text=Patient+Care+Image"; }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
              <p className="text-white text-xl font-semibold">Your Well-being, Our Priority</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action / Contact Section */}
      <section className="relative bg-blue-800 text-white py-16 md:py-24 text-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={contact}
            alt="Contact Us Background"
            className="w-full h-full object-cover opacity-20"
            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/1200x600/2a4365/ffffff?text=Contact+Background"; }}
          />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight animate-fade-in">
            Ready to Experience Exceptional Healthcare?
          </h2>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto opacity-90 animate-fade-in-up">
            Contact us today to learn more about our services, schedule a consultation, or address any health concerns you may have. We're here to help.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <button
              onClick={() => window.open('tel:+1234567890', '_self')}
              className="bg-white text-blue-800 hover:bg-gray-200 font-bold py-3 px-8 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-75 text-lg shadow-lg"
            >
              Call Us: +1 (234) 567-890
            </button>
            <button
              onClick={() => window.open('mailto:info@example.com', '_self')}
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-800 font-bold py-3 px-8 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-75 text-lg shadow-lg"
            >
              Email Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LearnMorePage;
