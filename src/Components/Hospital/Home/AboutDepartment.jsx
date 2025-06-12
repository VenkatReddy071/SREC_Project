import React,{useEffect} from 'react';

// Placeholder images for the Learn About Departments page
const cardiologyImage = "https://placehold.co/800x400/FFCCCC/ffffff?text=Cardiology";
const orthopedicsImage = "https://placehold.co/800x400/CCFFCC/ffffff?text=Orthopedics";
const pediatricsImage = "https://placehold.co/800x400/CCE5FF/ffffff?text=Pediatrics";
const oncologyImage = "https://placehold.co/800x400/FFDDAA/ffffff?text=Oncology";
const neurologyImage = "https://placehold.co/800x400/E0BBE4/ffffff?text=Neurology";

const LearnAboutDepartmentsPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);
  return (
    <div className="bg-gray-50 py-12 md:py-20 font-inter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4 rounded-xl">
            Specialized Departments for Comprehensive Care
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Our hospital offers a wide array of specialized departments, each staffed by experts to provide focused, high-quality care tailored to your unique needs.
          </p>
        </div>

        {/* Cardiology Department Section */}
        <div className="grid md:grid-cols-2 gap-10 mb-16 bg-white p-8 rounded-xl shadow-md">
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-red-700 mb-4">
              Cardiology: Heart Health Excellence
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our Cardiology Department specializes in the diagnosis and treatment of heart and vascular diseases. Equipped with advanced cardiac imaging and intervention facilities, we provide comprehensive care from prevention to complex procedures.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Diagnostic Cardiology (ECG, Echocardiogram)</li>
              <li>Interventional Cardiology (Angioplasty, Stenting)</li>
              <li>Cardiac Electrophysiology</li>
              <li>Heart Failure Management</li>
            </ul>
          </div>
          <img
            src={cardiologyImage}
            alt="Cardiology Department"
            className="w-full h-auto object-cover rounded-lg shadow-inner"
            onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/800x400/cccccc/333333?text=Image+Error"; }}
          />
        </div>

        {/* Orthopedics Department Section */}
        <div className="grid md:grid-cols-2 gap-10 mb-16 bg-white p-8 rounded-xl shadow-md">
          <img
            src={orthopedicsImage}
            alt="Orthopedics Department"
            className="w-full h-auto object-cover rounded-lg shadow-inner"
            onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/800x400/cccccc/333333?text=Image+Error"; }}
          />
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-green-700 mb-4">
              Orthopedics: Mobility & Joint Health
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The Orthopedics Department provides expert care for conditions affecting bones, joints, ligaments, tendons, and muscles. From sports injuries to joint replacements, our specialists help restore your mobility and improve your quality of life.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Joint Replacement Surgery</li>
              <li>Spine Surgery</li>
              <li>Sports Medicine & Rehabilitation</li>
              <li>Fracture Care</li>
            </ul>
          </div>
        </div>

        {/* Pediatrics Department Section */}
        <div className="grid md:grid-cols-2 gap-10 mb-16 bg-white p-8 rounded-xl shadow-md">
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-blue-700 mb-4">
              Pediatrics: Specialized Care for Children
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our Pediatrics Department offers comprehensive medical care for infants, children, and adolescents. Our child-friendly environment and compassionate team ensure your child receives the best possible health outcomes.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>General Pediatric Check-ups</li>
              <li>Childhood Vaccinations</li>
              <li>Developmental Assessments</li>
              <li>Adolescent Health Services</li>
            </ul>
          </div>
          <img
            src={pediatricsImage}
            alt="Pediatrics Department"
            className="w-full h-auto object-cover rounded-lg shadow-inner"
            onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/800x400/cccccc/333333?text=Image+Error"; }}
          />
        </div>

        {/* Oncology Department Section */}
        <div className="grid md:grid-cols-2 gap-10 mb-16 bg-white p-8 rounded-xl shadow-md">
          <img
            src={oncologyImage}
            alt="Oncology Department"
            className="w-full h-auto object-cover rounded-lg shadow-inner"
            onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/800x400/cccccc/333333?text=Image+Error"; }}
          />
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-purple-700 mb-4">
              Oncology: Comprehensive Cancer Care
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The Oncology Department provides advanced and compassionate care for patients fighting cancer. Our multidisciplinary team develops personalized treatment plans, integrating the latest therapies and support services.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Chemotherapy & Radiation Therapy</li>
              <li>Surgical Oncology</li>
              <li>Palliative Care</li>
              <li>Cancer Support Services</li>
            </ul>
          </div>
        </div>

        {/* Neurology Department Section */}
        <div className="grid md:grid-cols-2 gap-10 mb-16 bg-white p-8 rounded-xl shadow-md">
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-indigo-700 mb-4">
              Neurology: Brain & Nervous System Health
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our Neurology Department specializes in the diagnosis and treatment of disorders affecting the brain, spinal cord, and nervous system. We offer advanced neuro-diagnostic tools and therapies for complex neurological conditions.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Stroke Treatment & Rehabilitation</li>
              <li>Epilepsy Management</li>
              <li>Movement Disorders Clinic</li>
              <li>Headache & Migraine Treatment</li>
            </ul>
          </div>
          <img
            src={neurologyImage}
            alt="Neurology Department"
            className="w-full h-auto object-cover rounded-lg shadow-inner"
            onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/800x400/cccccc/333333?text=Image+Error"; }}
          />
        </div>

        {/* Call to Action */}
        <div className="bg-blue-600 text-white p-10 rounded-xl shadow-lg text-center">
          <h2 className="text-3xl font-bold mb-4">
            Find the Right Department for Your Needs
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Contact us today to schedule a consultation with one of our specialized departments.
          </p>
          <button
            onClick={() => console.log('Navigating to contact page for departments')}
            className="bg-white text-blue-600 hover:bg-gray-200 font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-75"
          >
            Contact a Department
          </button>
        </div>

      </div>
    </div>
  );
};

export default LearnAboutDepartmentsPage;
