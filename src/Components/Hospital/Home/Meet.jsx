import React,{useEffect,useState} from 'react';

// Placeholder images for the Meet Our Team page
const doctorsImage = "https://placehold.co/800x400/A2D2FF/ffffff?text=Experienced+Doctors";
const nursesImage = "https://placehold.co/800x400/FFB6C1/ffffff?text=Compassionate+Nurses";
const supportStaffImage = "https://placehold.co/800x400/D9F7D8/ffffff?text=Dedicated+Staff";
const researchersImage = "https://placehold.co/800x400/FFE7A4/ffffff?text=Innovating+Researchers";

const MeetOurTeamPage = () => {
    useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="bg-gray-50 py-12 md:py-20 font-inter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4 rounded-xl">
            Meet Our Dedicated Healthcare Professionals
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Our team of compassionate and highly skilled individuals is committed to providing you with the best possible care and support.
          </p>
        </div>

        {/* Section 1: Our Physicians & Specialists */}
        <div className="grid md:grid-cols-2 gap-10 mb-16 bg-white p-8 rounded-xl shadow-md">
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-blue-700 mb-4">
              Expert Physicians and Specialists
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our medical staff comprises board-certified physicians and specialists across various disciplines, bringing years of experience and a commitment to clinical excellence. They are at the forefront of medical advancements.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Leaders in their respective fields</li>
              <li>Dedicated to continuous learning</li>
              <li>Patient-focused approach</li>
              <li>Collaborative team players</li>
            </ul>
          </div>
          <img
            src={doctorsImage}
            alt="Experienced Doctors"
            className="w-full h-auto object-cover rounded-lg shadow-inner"
            onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/800x400/cccccc/333333?text=Image+Error"; }}
          />
        </div>

        {/* Section 2: Compassionate Nursing Staff */}
        <div className="grid md:grid-cols-2 gap-10 mb-16 bg-white p-8 rounded-xl shadow-md">
          <img
            src={nursesImage}
            alt="Compassionate Nurses"
            className="w-full h-auto object-cover rounded-lg shadow-inner"
            onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/800x400/cccccc/333333?text=Image+Error"; }}
          />
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-pink-700 mb-4">
              Caring and Skilled Nursing Professionals
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our nursing team is the backbone of our patient care. With exceptional skills and empathy, they provide round-the-clock care, ensuring patient comfort, safety, and speedy recovery.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Highly trained and certified</li>
              <li>Patient advocacy and support</li>
              <li>Expert wound care and medication management</li>
              <li>Compassionate bedside manner</li>
            </ul>
          </div>
        </div>

        {/* Section 3: Dedicated Support Staff */}
        <div className="grid md:grid-cols-2 gap-10 mb-16 bg-white p-8 rounded-xl shadow-md">
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-green-700 mb-4">
              Essential Support Staff
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Behind every successful treatment is a team of dedicated support staff – from administrative personnel to technicians and therapists. They work tirelessly to ensure a smooth and efficient healthcare experience for everyone.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Efficient administrative support</li>
              <li>Skilled laboratory and radiology technicians</li>
              <li>Compassionate physical and occupational therapists</li>
              <li>Dietitians and nutritionists</li>
            </ul>
          </div>
          <img
            src={supportStaffImage}
            alt="Dedicated Support Staff"
            className="w-full h-auto object-cover rounded-lg shadow-inner"
            onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/800x400/cccccc/333333?text=Image+Error"; }}
          />
        </div>

        {/* Section 4: Research and Innovation Team */}
        <div className="grid md:grid-cols-2 gap-10 mb-16 bg-white p-8 rounded-xl shadow-md">
          <img
            src={researchersImage}
            alt="Innovating Researchers"
            className="w-full h-auto object-cover rounded-lg shadow-inner"
            onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/800x400/cccccc/333333?text=Image+Error"; }}
          />
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-orange-700 mb-4">
              Innovation & Research Team
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our commitment to advancing healthcare extends to our robust research and innovation department. Our researchers are constantly exploring new treatments, technologies, and medical breakthroughs to improve patient outcomes.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Clinical trial participation</li>
              <li>Development of new therapies</li>
              <li>Contribution to medical knowledge</li>
              <li>Collaborations with leading institutions</li>
            </ul>
          </div>
        </div>


        {/* Call to Action */}
        <div className="bg-purple-600 text-white p-10 rounded-xl shadow-lg text-center">
          <h2 className="text-3xl font-bold mb-4">
            Your Health, Our Passion
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Experience the difference that dedicated and compassionate professionals make in your healthcare journey.
          </p>
          <button
            onClick={() => console.log('Navigating to careers page')}
            className="bg-white text-purple-600 hover:bg-gray-200 font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-75"
          >
            Join Our Team
          </button>
        </div>

      </div>
    </div>
  );
};

export default MeetOurTeamPage;
