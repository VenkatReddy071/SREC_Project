import React,{useEffect} from 'react';

// Placeholder images for the Our Services page
const generalMedicineImage = "https://placehold.co/800x400/ADD8E6/ffffff?text=General+Medicine";
const specializedCareImage = "https://placehold.co/800x400/90EE90/ffffff?text=Specialized+Care";
const emergencyCareImage = "https://placehold.co/800x400/FFB6C1/ffffff?text=Emergency+Care";
const wellnessProgramsImage = "https://placehold.co/800x400/FFFACD/ffffff?text=Wellness+Programs";

const OurServicesPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);
  return (
    <div className="bg-gray-50 py-12 md:py-20 font-inter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4 rounded-xl">
            Comprehensive Healthcare Services
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Providing a full spectrum of medical services to meet all your health needs with care and expertise.
          </p>
        </div>

        {/* General Medicine Section */}
        <div className="grid md:grid-cols-2 gap-10 mb-16 bg-white p-8 rounded-xl shadow-md">
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-blue-700 mb-4">
              General Medicine & Primary Care
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our general medicine department is your first point of contact for routine check-ups, preventative care, and management of common illnesses. We focus on building long-term relationships for continuous health.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Annual Health Check-ups</li>
              <li>Vaccinations and Immunizations</li>
              <li>Chronic Disease Management</li>
              <li>Minor Injury and Illness Treatment</li>
            </ul>
          </div>
          <img
            src={generalMedicineImage}
            alt="General Medicine"
            className="w-full h-auto object-cover rounded-lg shadow-inner"
            onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/800x400/cccccc/333333?text=Image+Error"; }}
          />
        </div>

        {/* Specialized Care Section */}
        <div className="grid md:grid-cols-2 gap-10 mb-16 bg-white p-8 rounded-xl shadow-md">
          <img
            src={specializedCareImage}
            alt="Specialized Care"
            className="w-full h-auto object-cover rounded-lg shadow-inner"
            onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/800x400/cccccc/333333?text=Image+Error"; }}
          />
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-purple-700 mb-4">
              Expert Specialized Medical Care
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We offer a wide range of specialized medical services, with expert physicians dedicated to specific fields of medicine. From cardiology to orthopedics, you'll receive focused, high-quality care.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Cardiology and Heart Health</li>
              <li>Orthopedics and Sports Medicine</li>
              <li>Neurology and Neurosurgery</li>
              <li>Oncology and Cancer Treatment</li>
              <li>Pediatrics and Child Health</li>
            </ul>
          </div>
        </div>

        {/* Emergency & Urgent Care Section */}
        <div className="grid md:grid-cols-2 gap-10 mb-16 bg-white p-8 rounded-xl shadow-md">
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-red-700 mb-4">
              24/7 Emergency & Urgent Care
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our emergency department is fully equipped to handle medical emergencies 24 hours a day, 7 days a week. For less severe but urgent conditions, our urgent care center provides immediate attention without an appointment.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Round-the-Clock Emergency Services</li>
              <li>Walk-in Urgent Care Clinic</li>
              <li>Trauma and Critical Care</li>
              <li>Emergency Surgery</li>
            </ul>
          </div>
          <img
            src={emergencyCareImage}
            alt="Emergency Care"
            className="w-full h-auto object-cover rounded-lg shadow-inner"
            onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/800x400/cccccc/333333?text=Image+Error"; }}
          />
        </div>

        {/* Wellness Programs Section */}
        <div className="grid md:grid-cols-2 gap-10 mb-16 bg-white p-8 rounded-xl shadow-md">
          <img
            src={wellnessProgramsImage}
            alt="Wellness Programs"
            className="w-full h-auto object-cover rounded-lg shadow-inner"
            onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/800x400/cccccc/333333?text=Image+Error"; }}
          />
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-green-700 mb-4">
              Holistic Wellness Programs
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Beyond treating illness, we are dedicated to promoting overall health and well-being. Our wellness programs focus on preventative health, healthy living, and chronic disease prevention.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Nutrition Counseling</li>
              <li>Physical Therapy & Rehabilitation</li>
              <li>Mental Health Support</li>
              <li>Health Education Workshops</li>
            </ul>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-teal-600 text-white p-10 rounded-xl shadow-lg text-center">
          <h2 className="text-3xl font-bold mb-4">
            Find the Right Care for You
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Explore our comprehensive range of services and let us partner with you on your journey to optimal health.
          </p>
          <button
            onClick={() => console.log('Navigating to Contact Us')}
            className="bg-white text-teal-600 hover:bg-gray-200 font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-75"
          >
            Contact Our Team
          </button>
        </div>

      </div>
    </div>
  );
};

export default OurServicesPage;
