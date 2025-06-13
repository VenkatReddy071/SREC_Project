
import React, { useState, useEffect } from 'react';

const getServiceIcon = (serviceTitle) => {
    switch (serviceTitle.toLowerCase()) {
        case 'cardiology': return '❤️';
        case 'cardiac surgery': return '🔪';
        case 'vascular surgery': return '🩸';
        case 'electrophysiology': return '⚡';
        case 'emergency care': return '🚨';
        case 'orthopedics': return '🦴';
        case 'pediatrics': return '👶';
        case 'neurology': return '🧠';
        case 'advanced diagnostics': return '🔬';
        case 'oncology': return '♋';
        case 'dermatology': return '🧴';
        case 'dietetics & nutrition': return '🍎';
        case 'urology': return '🚽';
        case 'nephrology': return '💧';
        case 'ent': return '👂';
        case 'ophthalmology': return '👁️';
        case 'general surgery': return '🩺';
        case 'laparoscopic surgery': return '➕';
        case 'physiotherapy': return '🚶';
        case 'rehabilitation': return '🧘';
        case 'dentistry': return '🦷';
        case 'maxillofacial surgery': return '😷';
        case 'obstetrics & gynaecology': return '🤰';
        case 'pulmonology': return '💨';
        case 'hematology': return '💉';
        default: return '⚕️';
    }
};

const ServiceCard = ({ icon, title, description }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300 border border-gray-100">
        <span className="text-blue-600 text-5xl mb-4">{icon}</span>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
);

const SkeletonServiceCard = () => (
    <div className="bg-gray-100 p-6 rounded-lg flex flex-col items-center text-center h-48 animate-pulse">
        <div className="h-12 w-12 rounded-full bg-gray-200 mb-4"></div>
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
);

function ServicesPage({ hospital }) {
    const loading = !hospital;
    const servicesToDisplay = hospital?.services || [];
    const specializationsToDisplay = hospital?.specialization || [];

    return (
        <div className="container md:mx-10 md:px-4 py-8 md:py-2 w-full md:w-4/5 xl:w-4/5 font-inter">
            <div className="bg-white rounded-xl  p-6 md:p-8 lg:p-10 flex flex-col space-y-10">

                {/* Page Header */}
                <div className="text-center space-y-4 pb-6 border-b border-blue-100">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-blue-800 tracking-tight">
                        Our Comprehensive Services at {hospital?.name || "Our Hospital"}
                    </h1>
                    <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                        We are committed to providing a full spectrum of specialized medical services,
                        tailored to meet the diverse healthcare needs of our community.
                    </p>
                    <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
                        Explore our departments below to learn more about the expert care we offer.
                    </p>
                </div>

                {/* Specializations Section */}
                {specializationsToDisplay.length > 0 && (
                    <div className="text-center space-y-4 py-6 border-b border-blue-100">
                        <h2 className="text-3xl md:text-4xl font-bold text-blue-700">Our Primary Specializations</h2>
                        <div className="flex flex-wrap justify-center gap-4 mt-4">
                            {specializationsToDisplay.map((spec, index) => (
                                <span
                                    key={index}
                                    className="px-5 py-2 bg-blue-100 text-blue-800 rounded-full text-lg font-semibold shadow-sm"
                                >
                                    {spec}
                                </span>
                            ))}
                        </div>
                    </div>
                )}


                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        Array.from({ length: 6 }).map((_, index) => ( // Show a reasonable number of skeleton cards
                            <SkeletonServiceCard key={index} />
                        ))
                    ) : (
                        servicesToDisplay.length > 0 ? (
                            servicesToDisplay.map((serviceTitle, index) => (
                                <ServiceCard
                                    key={index}
                                    icon={getServiceIcon(serviceTitle)}
                                    title={serviceTitle}

                                    description={`Specialized care in ${serviceTitle.toLowerCase()}.`}
                                />
                            ))
                        ) : (
                            <p className="col-span-full text-center text-gray-500 text-lg py-10">No services found for this hospital.</p>
                        )
                    )}
                </div>

                {/* Call to Action */}
                <div className="text-center pt-6 border-t border-blue-100 space-y-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-blue-700">Need Specialized Care?</h2>
                    <p className="text-base md:text-lg text-gray-700 max-w-2xl mx-auto">
                        Our team of specialists is ready to provide you with the best possible care.
                        Book an appointment or contact us for any inquiries.
                    </p>
                    <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-6">
                        <a
                            href="/book-appointment"
                            className="w-full md:w-auto px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-full shadow-lg
                                       hover:bg-blue-700 transition duration-300 ease-in-out transform hover:-translate-y-1
                                       focus:outline-none focus:ring-4 focus:ring-blue-300 text-center"
                        >
                            Book an Appointment
                        </a>
                        <a
                            href="/contact"
                            className="w-full md:w-auto px-8 py-4 bg-gray-100 text-blue-700 text-lg font-semibold rounded-full shadow-lg
                                       hover:bg-gray-200 transition duration-300 ease-in-out transform hover:-translate-y-1
                                       focus:outline-none focus:ring-4 focus:ring-gray-300 text-center"
                        >
                            Contact Us
                        </a>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default ServicesPage;