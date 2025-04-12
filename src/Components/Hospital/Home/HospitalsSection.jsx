import React, { useState } from 'react';
import HeaderImg from '../../../assets/Header.jpg';
import { MapPinIcon, HeartIcon } from '@heroicons/react/24/outline';
import { FaStethoscope } from 'react-icons/fa';

export const HospitalsSection = () => {
  const list = ['Hospitals', 'Articles', 'Patient Stories'];
  const hospitals = [
    {
      id: 1,
      name: 'Apollo Hospitals',
      location: 'Chennai, India',
      specialty: ['Cardiology', 'Neurology', 'Orthopedics'],
      info: 'Apollo Hospitals is a leading multi-specialty hospital known for advanced treatments and world-class healthcare.',
      image: 'https://source.unsplash.com/400x250/?hospital',
      offers: 'Free first consultation for new patients!',
      doctors: [
        { name: 'Dr. Rajesh Kumar', specialization: 'Cardiologist', experience: '15 years' },
        { name: 'Dr. Meena Gupta', specialization: 'Neurologist', experience: '12 years' },
        { name: 'Dr. Arvind Rao', specialization: 'Orthopedic Surgeon', experience: '10 years' },
      ],
    },
    {
      id: 2,
      name: 'Fortis Hospital',
      location: 'Delhi, India',
      specialty: ['Oncology', 'Gastroenterology', 'Pulmonology'],
      info: 'Fortis Hospital provides comprehensive medical care with state-of-the-art technology and expert doctors.',
      image: 'https://source.unsplash.com/400x250/?medical',
      offers: '10% discount on health check-ups',
      doctors: [
        { name: 'Dr. Sunita Sharma', specialization: 'Oncologist', experience: '18 years' },
        { name: 'Dr. Vikram Sinha', specialization: 'Gastroenterologist', experience: '14 years' },
        { name: 'Dr. Neha Kapoor', specialization: 'Pulmonologist', experience: '10 years' },
      ],
    },
    {
      id: 3,
      name: 'Medanta Hospital',
      location: 'Gurgaon, India',
      specialty: ['Cardiology', 'Nephrology', 'Urology'],
      info: 'Medanta Hospital specializes in heart, kidney, and urological treatments with advanced medical technology.',
      image: 'https://source.unsplash.com/400x250/?doctor',
      offers: 'Special discount on kidney transplant consultation',
      doctors: [
        { name: 'Dr. Anil Malhotra', specialization: 'Cardiologist', experience: '16 years' },
        { name: 'Dr. Ramesh Verma', specialization: 'Nephrologist', experience: '13 years' },
        { name: 'Dr. Sangeeta Patel', specialization: 'Urologist', experience: '10 years' },
      ],
    },
    {
      id: 4,
      name: 'Max Super Specialty Hospital',
      location: 'Mumbai, India',
      specialty: ['Dermatology', 'ENT', 'Pediatrics'],
      info: 'Max Super Specialty Hospital offers the best pediatric care and ENT treatments with specialized dermatologists.',
      image: 'https://source.unsplash.com/400x250/?clinic',
      offers: '20% off on skin treatment packages',
      doctors: [
        { name: 'Dr. Priya Kaur', specialization: 'Dermatologist', experience: '11 years' },
        { name: 'Dr. Rajeev Shah', specialization: 'ENT Specialist', experience: '14 years' },
        { name: 'Dr. Monica Ahuja', specialization: 'Pediatrician', experience: '9 years' },
      ],
    },
    {
      id: 5,
      name: 'Narayana Health',
      location: 'Bangalore, India',
      specialty: ['Cardiac Surgery', 'Neurology', 'Diabetology'],
      info: 'Narayana Health is a leader in heart surgeries and diabetes care with world-class neurology experts.',
      image: 'https://source.unsplash.com/400x250/?healthcare',
      offers: '50% off on diabetes screening',
      doctors: [
        { name: 'Dr. Sudhir Agarwal', specialization: 'Cardiac Surgeon', experience: '20 years' },
        { name: 'Dr. Ritu Sharma', specialization: 'Neurologist', experience: '15 years' },
        { name: 'Dr. Ashok Mehta', specialization: 'Diabetologist', experience: '12 years' },
      ],
    },
    {
      id: 6,
      name: 'AIIMS Delhi',
      location: 'Delhi, India',
      specialty: ['General Medicine', 'Pulmonology', 'Oncology'],
      info: 'AIIMS Delhi is the most prestigious hospital in India offering multi-disciplinary healthcare services.',
      image: 'https://source.unsplash.com/400x250/?surgery',
      offers: 'Government-supported free medical consultation',
      doctors: [
        { name: 'Dr. Rajan Singh', specialization: 'General Physician', experience: '18 years' },
        { name: 'Dr. Kavita Bansal', specialization: 'Pulmonologist', experience: '10 years' },
        { name: 'Dr. Manish Kapoor', specialization: 'Oncologist', experience: '16 years' },
      ],
    },
    {
      id: 7,
      name: 'Manipal Hospitals',
      location: 'Hyderabad, India',
      specialty: ['Neurosurgery', 'Cardiology', 'Gastroenterology'],
      info: 'Manipal Hospitals provide expert neurosurgical care and advanced cardiac treatments.',
      image: 'https://source.unsplash.com/400x250/?medicalcare',
      offers: 'Free cardiac check-up for first-time patients',
      doctors: [
        { name: 'Dr. Surya Narayan', specialization: 'Neurosurgeon', experience: '14 years' },
        { name: 'Dr. Ashwini Nair', specialization: 'Cardiologist', experience: '17 years' },
        { name: 'Dr. Ravi Kumar', specialization: 'Gastroenterologist', experience: '12 years' },
      ],
    },
    {
      id: 8,
      name: 'Kokilaben Dhirubhai Ambani Hospital',
      location: 'Mumbai, India',
      specialty: ['Plastic Surgery', 'Dermatology', 'Psychiatry'],
      info: 'A world-renowned hospital specializing in aesthetic surgeries, dermatological treatments, and mental health care.',
      image: 'https://source.unsplash.com/400x250/?surgeon',
      offers: '30% off on cosmetic surgery consultations',
      doctors: [
        { name: 'Dr. Sanjay Menon', specialization: 'Plastic Surgeon', experience: '22 years' },
        { name: 'Dr. Rachna Gupta', specialization: 'Dermatologist', experience: '11 years' },
        { name: 'Dr. Sameer Khan', specialization: 'Psychiatrist', experience: '14 years' },
      ],
    },
    {
      id: 9,
      name: 'Sri Ramachandra Medical Center',
      location: 'Chennai, India',
      specialty: ['Pulmonology', 'Neonatology', 'Endocrinology'],
      info: 'Sri Ramachandra Medical Center is a top-tier hospital offering pulmonology, neonatal, and endocrine care.',
      image: 'https://source.unsplash.com/400x250/?patient',
      offers: '10% off on senior citizen health check-ups',
      doctors: [
        { name: 'Dr. Lakshmi Narayan', specialization: 'Pulmonologist', experience: '19 years' },
        { name: 'Dr. Anita Rao', specialization: 'Neonatologist', experience: '12 years' },
        { name: 'Dr. Vishal Desai', specialization: 'Endocrinologist', experience: '15 years' },
      ],
    },
    {
      id: 10,
      name: 'Global Hospitals',
      location: 'Pune, India',
      specialty: ['Orthopedics', 'Nephrology', 'Rheumatology'],
      info: 'Global Hospitals specializes in joint replacements, kidney transplants, and autoimmune disease treatments.',
      image: 'https://source.unsplash.com/400x250/?doctorcare',
      offers: 'Discount on knee replacement surgery',
      doctors: [
        { name: 'Dr. Ajay Sharma', specialization: 'Orthopedic Surgeon', experience: '18 years' },
        { name: 'Dr. Smita Nair', specialization: 'Nephrologist', experience: '14 years' },
        { name: 'Dr. Rohan Mehta', specialization: 'Rheumatologist', experience: '10 years' },
      ],
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="bg-gray-50 py-10">
      <div className="container mx-auto px-4">
        <h2 className="text-base font-semibold text-blue-500 text-center mb-2">View list of Hospitals</h2>
        <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl text-center text-gray-900 mb-4">
          Explore Our Hospital Services
        </h1>
        <h2 className="text-lg text-gray-600 text-center mb-8">Stay updated with our expert health articles</h2>

        {/* Sticky Navigation */}
        <div className="sticky top-0 bg-white z-10 shadow-md rounded-md">
          <div className="flex justify-center gap-4 py-3">
            {list.map((item, index) => (
              <button
                key={index}
                className={`px-4 py-2 text-center cursor-pointer font-semibold text-gray-700 hover:text-blue-600 focus:outline-none ${
                  activeIndex === index ? 'border-b-2 border-blue-500 text-blue-600' : ''
                }`}
                onClick={() => setActiveIndex(index)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Content Below */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {hospitals.map((item, index) => (
            <div
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
              key={index}
            >
              <img
                src={item.image || HeaderImg}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.name}</h3>
                <p className="text-gray-600 text-sm flex items-center mb-2">
                  <MapPinIcon className="h-4 w-4 mr-1 text-gray-500" />
                  {item.location}
                </p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {item.specialty.map((specialty, idx) => (
                    <span
                      key={idx}
                      className="inline-block bg-blue-100 text-blue-600 py-1 px-2 rounded-full text-xs font-semibold"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
                <p className="text-gray-700 text-sm mb-3 line-clamp-2">{item.info}</p>
                <div className="flex items-center justify-between mt-2">
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline">
                    View Details
                  </button>
                  <button className="text-gray-500 hover:text-red-500 focus:outline-none">
                    <HeartIcon className="h-6 w-6" />
                  </button>
                </div>
                {item.offers && (
                  <div className="mt-3 text-sm text-green-600 font-semibold flex items-center">
                    <FaStethoscope className="mr-2" /> 🎉 {item.offers}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};