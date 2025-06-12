
import React, { useState, useEffect } from 'react';
import {Link,useLocation}from "react-router-dom"
function Overview({ hospital }) {
    const loading = !hospital;
    const location=useLocation();
    const url=new URLSearchParams(location.search);
    const type1=url.get('type');
    const type=type1.split("/");
    const service1=type[1];
    const service2=type[2];
    console.log(service1,service2)
    const formatNumber = (num) => {
        if (typeof num === 'number') {
            return num.toLocaleString('en-IN');
        }
        return num;
    };


    const SkeletonLoader = () => (
        <div className="bg-white rounded-xl p-6 md:p-8 lg:p-10 flex flex-col space-y-10 animate-pulse">
            <div className="flex flex-col md:flex-row items-center justify-between pb-6 border-b border-blue-100 space-y-4 md:space-y-0">
                <div className="flex items-center space-x-4">
                    <div className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-gray-200"></div>
                    <div className="h-10 bg-gray-200 rounded w-64 md:w-80"></div>
                </div>
                <div className="h-12 bg-gray-200 rounded w-48 md:w-64"></div>
            </div>
            <div className="text-center space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
                <div className="h-6 bg-gray-200 rounded w-full max-w-3xl mx-auto"></div>
                <div className="h-6 bg-gray-200 rounded w-full max-w-3xl mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-y border-blue-100">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-gray-100 p-6 rounded-lg text-center h-32">
                        <div className="h-12 bg-gray-200 rounded w-24 mx-auto mb-2"></div>
                        <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
                    </div>
                ))}
            </div>
            <div className="text-center space-y-6">
                <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto"></div>
                <div className="h-6 bg-gray-200 rounded w-full max-w-3xl mx-auto"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-gray-100 p-6 rounded-lg h-40">
                            <div className="h-12 w-12 rounded-full bg-gray-200 mx-auto mb-4"></div>
                            <div className="h-6 bg-gray-200 rounded w-full mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="text-center space-y-6">
                <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto"></div>
                <div className="h-6 bg-gray-200 rounded w-full max-w-3xl mx-auto"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="rounded-lg overflow-hidden h-48 bg-gray-100"></div>
                    ))}
                </div>
            </div>
            <div className="h-16 bg-gray-200 rounded-lg"></div>
            <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-6 pt-4">
                <div className="h-14 bg-gray-200 rounded-full w-full md:w-64"></div>
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
                    <div className="h-12 bg-gray-200 rounded-full w-full sm:w-32"></div>
                    <div className="h-12 bg-gray-200 rounded-full w-full sm:w-32"></div>
                    <div className="h-12 bg-gray-200 rounded-full w-full sm:w-32"></div>
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 md:py-12 w-full md:w-4/5 xl:w-4/5 font-inter">
                <SkeletonLoader />
            </div>
        );
    }
    return (
        <div className="container md:mx-10 md:px-4 py-8 md:py-2 w-full md:w-4/5 xl:w-4/5 font-inter">
            <div className="bg-white rounded-xl p-6 md:p-8 lg:p-10 flex flex-col space-y-10 ">
                <div className="flex flex-col md:flex-row items-center justify-between pb-6 border-b border-blue-100 space-y-4 md:space-y-0">
                    <div className="flex items-center space-x-4">
                        <img
                            src={hospital.image || "https://placehold.co/70x70/0056b3/ffffff?text=LOGO"} // Use hospital.image or a placeholder
                            alt={`${hospital.name || 'Hospital'} Logo`}
                            className="h-16 w-16 md:h-20 md:w-20 rounded-full shadow-md border-2 border-blue-200 object-cover"
                        />
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-blue-800 tracking-tight">
                            {hospital.name || "Hospital Name"}
                        </h1>
                    </div>
                    <div className="text-right text-sm md:text-base text-gray-600 ml-6">
                        <p className="font-semibold">Email: <a href={`mailto:${hospital.ownerEmail}`} className="text-blue-600 hover:underline">{hospital.ownerEmail || "N/A"}</a></p>
                        <p className="font-semibold">Helpline: <a href={`tel:${hospital.phoneNumber}`} className="text-blue-600 hover:underline">{hospital.phoneNumber || "N/A"}</a></p>
                    </div>
                </div>
                <div className="text-center space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-blue-700">About {hospital.name || "Our Hospital"}</h2>
                    <p className="text-base md:text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
                        {hospital.info || "Discover more about our commitment to patient care and excellence in healthcare."}
                    </p>
                    
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-y border-blue-100">
                    <div className="bg-blue-50 p-6 rounded-lg text-center shadow-md transform hover:scale-105 transition-transform duration-300">
                        <p className="text-5xl font-bold text-blue-700 mb-2">{hospital.patientSatisfaction}%</p>
                        <p className="text-lg font-semibold text-gray-600">Patient Satisfaction</p>
                    </div>
                    
                    <div className="bg-blue-50 p-6 rounded-lg text-center shadow-md transform hover:scale-105 transition-transform duration-300">
                        <p className="text-5xl font-bold text-blue-700 mb-2">{hospital.successRate}%</p>
                        <p className="text-lg font-semibold text-gray-600">Success Rate</p>
                    </div>
                    <div className="bg-blue-50 p-6 rounded-lg text-center shadow-md transform hover:scale-105 transition-transform duration-300">
                        <p className="text-5xl font-bold text-blue-700 mb-2">{formatNumber(hospital.ProceduresAnnually)}+</p>
                        <p className="text-lg font-semibold text-gray-600">Procedures Annually</p>
                    </div>
                </div>

                {/* Services Highlight Section */}
                <div className="text-center space-y-6">
                    <h2 className="text-3xl md:text-4xl font-bold text-blue-700">Our Core Services</h2>
                    <p className="text-base md:text-lg text-gray-700 max-w-3xl mx-auto">
                        We offer a comprehensive range of medical specialties and services designed to meet all your healthcare needs.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {hospital.services && hospital.services.length > 0 ? (
                            hospital.services.map((service, index) => (
                                <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-sm flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300">
                                    {/* You'll need to map icons based on service names or add an icon field to your service data */}
                                    <span className="text-blue-600 text-5xl mb-4">
                                        {/* Simple icon mapping for demonstration */}
                                        {service.includes('Cardiology') ? '❤️' :
                                         service.includes('Surgery') ? '🔪' :
                                         service.includes('Emergency') ? '🚨' :
                                         service.includes('Pediatrics') ? '👶' :
                                         service.includes('Neurology') ? '🧠' :
                                         '⚕️'}
                                    </span>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{service}</h3>
                                    {/* Your current backend `services` array only contains strings, not objects with description.
                                        You might need to adjust your backend data structure or hardcode descriptions. */}
                                    <p className="text-gray-600 text-sm">Comprehensive {service.toLowerCase()} care.</p>
                                </div>
                            ))
                        ) : (
                            <p className="col-span-full text-gray-500">No services listed yet.</p>
                        )}
                    </div>
                    <Link to={`?type=hospital/${service1}/${service2}/Services`}>
                    <p className="inline-block mt-6 px-8 py-3 bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:bg-blue-700 transition duration-300 ease-in-out">
                        View All Services
                    </p>
                    </Link>
                </div>

                {/* Visual Tour / Glimpse Inside Section */}
                <div className="text-center space-y-6">
                    <h2 className="text-3xl md:text-4xl font-bold text-blue-700">A Glimpse Inside Our Hospital</h2>
                    <p className="text-base md:text-lg text-gray-700 max-w-3xl mx-auto">
                        Explore our modern facilities and comforting environment designed for your healing and well-being.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {hospital.gallery && hospital.gallery.length > 0 ? (
                            hospital.gallery.map((src, index) => (
                                <div key={index} className="rounded-lg overflow-hidden shadow-md transform hover:scale-105 transition-transform duration-300">
                                    <img
                                        src={src}
                                        alt={`Hospital Gallery Image ${index + 1}`}
                                        className="w-full h-48 object-cover"
                                        loading="lazy"
                                    />
                                    {/* Your current backend `gallery` array only contains URLs, not objects with captions.
                                        You might need to adjust your backend data structure or provide generic captions. */}
                                    <p className="p-3 bg-gray-50 text-gray-700 font-medium">{hospital.glimpseInside?.[index] || `Area ${index + 1}`}</p>
                                </div>
                            ))
                        ) : (
                            <p className="col-span-full text-gray-500">No gallery images available yet.</p>
                        )}
                    </div>
                </div>

                {/* Ambulance Service Status */}
                <div className="text-center py-4 bg-green-50 rounded-lg shadow-md">
                    <p className="text-lg md:text-xl font-bold text-green-700">
                        <span className="text-green-500 mr-2">&#10003;</span> {hospital.ambulance ? '24/7 Emergency Ambulance Service Available' : 'Ambulance Service Not Available'}
                    </p>
                </div>

                {/* Call to Action Buttons */}
                <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-6 pt-4">
                    <Link to={`?type=hospital/${service1}/${service2}/Book Appointment`}>
                    <p
                        className="w-full md:w-auto px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-full shadow-lg
                                   hover:bg-blue-700 transition duration-300 ease-in-out transform hover:-translate-y-1
                                   focus:outline-none focus:ring-4 focus:ring-blue-300 text-center"
                    >
                        Book an Appointment
                    </p>
                    </Link>
                    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
                        <Link to={`?type=hospital/${service1}/${service2}/Doctors`}>
                        <p
                            className="w-full sm:w-auto px-6 py-3 bg-gray-100 text-blue-700 text-base font-medium rounded-full shadow-md
                                       hover:bg-gray-200 transition duration-300 ease-in-out transform hover:-translate-y-0.5
                                       focus:outline-none focus:ring-2 focus:ring-gray-300 text-center"
                        >
                            Visit Doctors
                        </p>
                        </Link>
                        <Link to={`?type=hospital/${service1}/${service2}/Services`}>
                        <p
                            className="w-full sm:w-auto px-6 py-3 bg-gray-100 text-blue-700 text-base font-medium rounded-full shadow-md
                                       hover:bg-gray-200 transition duration-300 ease-in-out transform hover:-translate-y-0.5
                                       focus:outline-none focus:ring-2 focus:ring-gray-300 text-center"
                        >
                            Explore Services
                        </p>
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Overview;