import React,{useEffect} from 'react';

// Placeholder images for the Explore Technologies page
const diagnosticTechImage = "https://placehold.co/800x400/DDA0DD/ffffff?text=Diagnostic+Technology";
const surgicalRoboticsImage = "https://placehold.co/800x400/98FB98/ffffff?text=Surgical+Robotics";
const telehealthImage = "https://placehold.co/800x400/ADD8E6/ffffff?text=Telehealth";
const aiHealthcareImage = "https://placehold.co/800x400/FFD700/ffffff?text=AI+in+Healthcare";

const ExploreTechnologiesPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);
  return (
    <div className="bg-gray-50 py-12 md:py-20 font-inter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4 rounded-xl">
            Pioneering Medical Innovation
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Leveraging the latest technological advancements for precision diagnostics and effective treatments.
          </p>
        </div>

        {/* Diagnostic Technology Section */}
        <div className="grid md:grid-cols-2 gap-10 mb-16 bg-white p-8 rounded-xl shadow-md">
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-indigo-700 mb-4">
              Advanced Diagnostic Imaging
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our state-of-the-art diagnostic imaging technologies provide highly detailed and accurate insights into your health. This enables our specialists to detect conditions early and plan precise treatments.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>High-Resolution MRI Scans</li>
              <li>Multi-slice CT Scanners</li>
              <li>Digital X-ray and Mammography</li>
              <li>3D Ultrasound Imaging</li>
            </ul>
          </div>
          <img
            src={diagnosticTechImage}
            alt="Diagnostic Technology"
            className="w-full h-auto object-cover rounded-lg shadow-inner"
            onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/800x400/cccccc/333333?text=Image+Error"; }}
          />
        </div>

        {/* Surgical Robotics Section */}
        <div className="grid md:grid-cols-2 gap-10 mb-16 bg-white p-8 rounded-xl shadow-md">
          <img
            src={surgicalRoboticsImage}
            alt="Surgical Robotics"
            className="w-full h-auto object-cover rounded-lg shadow-inner"
            onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/800x400/cccccc/333333?text=Image+Error"; }}
          />
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-teal-700 mb-4">
              Precision Surgical Robotics
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We utilize advanced robotic surgical systems to enhance surgical precision, minimize invasiveness, and accelerate patient recovery times. These technologies allow for complex procedures with greater control and accuracy.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Minimally Invasive Surgery</li>
              <li>Faster Recovery</li>
              <li>Reduced Complications</li>
              <li>Enhanced Surgeon Dexterity</li>
            </ul>
          </div>
        </div>

        {/* Telehealth & Remote Monitoring Section */}
        <div className="grid md:grid-cols-2 gap-10 mb-16 bg-white p-8 rounded-xl shadow-md">
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-orange-700 mb-4">
              Connected Care: Telehealth & Remote Monitoring
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our telehealth and remote patient monitoring solutions bring healthcare closer to you, enabling virtual consultations and continuous health tracking from the comfort of your home.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Virtual Doctor Visits</li>
              <li>Remote Vital Sign Tracking</li>
              <li>Secure Patient Portals</li>
              <li>Convenient Follow-ups</li>
            </ul>
          </div>
          <img
            src={telehealthImage}
            alt="Telehealth"
            className="w-full h-auto object-cover rounded-lg shadow-inner"
            onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/800x400/cccccc/333333?text=Image+Error"; }}
          />
        </div>

        {/* AI in Healthcare Section */}
        <div className="grid md:grid-cols-2 gap-10 mb-16 bg-white p-8 rounded-xl shadow-md">
          <img
            src={aiHealthcareImage}
            alt="AI in Healthcare"
            className="w-full h-auto object-cover rounded-lg shadow-inner"
            onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/800x400/cccccc/333333?text=Image+Error"; }}
          />
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-red-700 mb-4">
              Artificial Intelligence in Patient Care
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We're integrating Artificial Intelligence to enhance diagnostic accuracy, personalize treatment plans, and streamline administrative processes, leading to more efficient and effective patient care.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>AI-powered Diagnostics</li>
              <li>Personalized Medicine</li>
              <li>Operational Efficiency</li>
              <li>Predictive Analytics</li>
            </ul>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-blue-600 text-white p-10 rounded-xl shadow-lg text-center">
          <h2 className="text-3xl font-bold mb-4">
            Committed to Continuous Technological Advancement
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Our commitment to integrating cutting-edge technology ensures you receive the best possible care.
          </p>
          <button
            onClick={() => console.log('Navigating back to main services')}
            className="bg-white text-blue-600 hover:bg-gray-200 font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-75"
          >
            Discover All Services
          </button>
        </div>

      </div>
    </div>
  );
};

export default ExploreTechnologiesPage;
