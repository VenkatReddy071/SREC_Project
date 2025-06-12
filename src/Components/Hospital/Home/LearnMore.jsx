import React,{useEffect} from 'react';
import mission from "../../../assets/mission.jpg";
import care from "../../../assets/care.jpg";
import hos from "../../../assets/hos.jpg";
import contact from "../../../assets/contact.jpg"
import {Link} from "react-router-dom"
const missionVisionImage =mission
const facilitiesImage =care
const patientCareImage =hos
const contactImage =contact

const LearnMorePage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);
  return (
    <div className="bg-gray-100 py-12 md:py-20 font-inter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4 rounded-xl">
            Your Journey to Better Health Starts Here
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Committed to excellence, compassion, and innovation in every aspect of healthcare.
          </p>
          <Link to='/Hospitals'>
          <button
            onClick={() => console.log('Navigating to Appointment Booking')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
          >
            Book an Appointment
          </button>
          </Link>
        </div>
        <div className="grid md:grid-cols-2 gap-10 mb-16 bg-white p-8 rounded-xl shadow-md">
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-blue-700 mb-4">
              Our Guiding Principles: Mission and Vision
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our **mission** is to provide comprehensive, compassionate, and cutting-edge healthcare services that prioritize patient well-being and foster a healthier community. We are dedicated to delivering personalized care with integrity and respect.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Our **vision** is to be the leading healthcare provider, recognized for our innovative medical practices, state-of-the-art facilities, and a patient-centric approach that sets new standards in health and wellness. We strive for continuous improvement and excellence.
            </p>
          </div>
          <img
            src={missionVisionImage}
            alt="Mission and Vision"
            className="w-full h-auto object-cover rounded-lg shadow-inner"
            onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/800x400/cccccc/333333?text=Image+Error"; }}
          />
        </div>
        <div className="grid md:grid-cols-2 gap-10 mb-16 bg-white p-8 rounded-xl shadow-md">
          <img
            src={facilitiesImage}
            alt="Modern Facilities"
            className="w-full h-auto object-cover rounded-lg shadow-inner"
            onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/800x400/cccccc/333333?text=Image+Error"; }}
          />
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-green-700 mb-4">
              Cutting-Edge Facilities for Superior Care
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our hospital is equipped with the latest medical technology and infrastructure designed to support advanced diagnostic and treatment procedures. From modern operating theaters to comfortable patient rooms, every detail is crafted for your safety and comfort.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Advanced Imaging (MRI, CT Scans)</li>
              <li>Robotic Surgery Suites</li>
              <li>Dedicated Intensive Care Units (ICU)</li>
              <li>Comfortable and Private Patient Rooms</li>
              <li>On-site Pharmacy and Laboratory</li>
            </ul>
          </div>
        </div>

        {/* Section 3: Patient-Centric Approach */}
        <div className="grid md:grid-cols-2 gap-10 mb-16 bg-white p-8 rounded-xl shadow-md">
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-yellow-700 mb-4">
              Patient-Centric Care: Our Promise to You
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              At the heart of our healthcare philosophy is a deep commitment to patient-centric care. We believe in empowering our patients through education, involving them in decision-making, and providing a supportive environment for recovery and healing.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Our compassionate medical team ensures that each patient receives personalized attention and care plans tailored to their unique health needs and preferences.
            </p>
          </div>
          <img
            src={patientCareImage}
            alt="Patient-Centric Care"
            className="w-full h-auto object-cover rounded-lg shadow-inner"
            onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/800x400/cccccc/333333?text=Image+Error"; }}
          />
        </div>

        {/* Call to Action / Contact Section */}
        <div className="bg-blue-800 text-white p-10 rounded-xl shadow-lg text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Experience Exceptional Healthcare?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Contact us today to learn more about our services, schedule a consultation, or address any health concerns you may have. We're here to help.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => window.open('tel:+1234567890', '_self')} // Simulate direct call
              className="bg-white text-blue-800 hover:bg-gray-200 font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-75"
            >
              Call Us: +1 (234) 567-890
            </button>
            <button
              onClick={() => window.open('mailto:info@example.com', '_self')} // Simulate email
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-800 font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-75"
            >
              Email Us
            </button>
          </div>
          <img
            src={contactImage}
            alt="Contact Us"
            className="w-full h-48 object-cover rounded-lg mt-8 shadow-inner"
            onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/800x400/cccccc/333333?text=Image+Error"; }}
          />
        </div>

      </div>
    </div>
  );
};

export default LearnMorePage;
