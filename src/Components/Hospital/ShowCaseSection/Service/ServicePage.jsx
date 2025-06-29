import React, { useState, useEffect } from 'react';
import HospitalHeader from "../../../../assets/HospitalHeader.jpg"
import Restaurant from "../../../../assets/resaturant.avif"
import School from "../../../../assets/student.avif"
import Shopping from "../../../../assets/Shopping.jpg"
const ServicePage = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

      useEffect(() => {
          window.scrollTo(0, 0);
        }, []);
    useEffect(() => {
        const handleLinkClick = () => {
            setIsMobileMenuOpen(false);
        };

        const mobileLinks = document.querySelectorAll('#mobile-menu a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', handleLinkClick);
        });

        return () => {
            mobileLinks.forEach(link => {
                link.removeEventListener('click', handleLinkClick);
            });
        };
    }, []);

    return (
        <div className="antialiased bg-gray-50 min-h-screen">
            
            <main className="container mx-auto px-4 py-8 pt-24 md:pt-28">

                {/* Hero Section */}
                <section className="text-center mb-16 px-4">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-blue-400 leading-tight mb-6 animate-fade-in-down">
                        Welcome to <span className="text-blue-600">NANDYAL INFO</span>: Your Ultimate Online Hub
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto mb-10 animate-fade-in-up">
                        Streamlining your life with easy access to **healthcare, fashion, education, and dining experiences**. Our platform is designed to connect you with essential services seamlessly and efficiently.
                    </p>
                    <a
                        href="#why-choose-us"
                        className="inline-block bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 animate-bounce-in"
                    >
                        Discover Our Services
                    </a>
                </section>

                <section id="why-choose-us" className="mb-16 bg-gradient-to-br from-indigo-50 to-blue-100 p-8 md:p-12 rounded-xl shadow-xl border border-blue-200">
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-800 mb-10">
                        Why Choose <span className="text-blue-600">NANDYAL INFO</span>?
                    </h2>
                    <p className="text-center text-lg text-gray-700 max-w-3xl mx-auto mb-12">
                        At NDLINFO, we are committed to providing you with an unparalleled online experience. Here's why we stand out:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center border-b-4 border-indigo-500 transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                            <img src="https://placehold.co/100x100/e0e7ff/4338ca?text=Easy+UI" alt="User-Friendly Interface Icon" className="w-24 h-24 mb-4 rounded-full border-2 border-indigo-200 p-2 object-contain" />
                            <h3 className="text-xl font-semibold text-indigo-700 mb-2">User-Friendly Interface</h3>
                            <p className="text-gray-600 text-sm">
                                Our website is intuitively designed for easy navigation, ensuring a smooth and pleasant experience from the moment you land on our page. Finding what you need is just a click away.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center border-b-4 border-purple-500 transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                            <img src="https://placehold.co/100x100/ede9fe/7c3aed?text=One+Stop" alt="One-Stop Solution Icon" className="w-24 h-24 mb-4 rounded-full border-2 border-purple-200 p-2 object-contain" />
                            <h3 className="text-xl font-semibold text-purple-700 mb-2">One-Stop Solution</h3>
                            <p className="text-gray-600 text-sm">
                                Say goodbye to juggling multiple apps. From booking doctor appointments to ordering food and shopping for fashion, we cater to all your diverse needs on a single, unified platform.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center border-b-4 border-green-500 transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                            <img src="https://placehold.co/100x100/d1fae5/059669?text=Secure+Tx" alt="Secure Transactions Icon" className="w-24 h-24 mb-4 rounded-full border-2 border-green-200 p-2 object-contain" />
                            <h3 className="text-xl font-semibold text-green-700 mb-2">Secure Transactions</h3>
                            <p className="text-gray-600 text-sm">
                                Your safety is our utmost priority. We utilize advanced encryption and robust security protocols to ensure all your personal data and financial transactions are protected.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center border-b-4 border-yellow-500 transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                            <img src="https://placehold.co/100x100/fffbeb/d97706?text=24/7+Support" alt="Dedicated Support Icon" className="w-24 h-24 mb-4 rounded-full border-2 border-yellow-200 p-2 object-contain" />
                            <h3 className="text-xl font-semibold text-yellow-700 mb-2">Dedicated Support</h3>
                            <p className="text-gray-600 text-sm">
                                Our friendly and knowledgeable customer service team is available 24/7 to assist you with any queries or issues, ensuring a smooth and hassle-free experience.
                            </p>
                        </div>
                    </div>

                    <p className="mt-12 text-center text-xl text-gray-800 font-medium">
                        Join NANDYAL INFO today and discover a world of convenience, efficiency, and quality at your fingertips!
                    </p>
                </section>

                {/* Healthcare Section */}
                <section id="healthcare" className="mb-16 bg-white p-8 md:p-12 rounded-xl shadow-lg transform transition-transform duration-300 hover:scale-[1.01]">
                    <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                        <div className="md:w-1/2">
                            <img src={HospitalHeader} alt="Hospital and Doctor Appointments" className="w-full h-auto object-cover rounded-lg shadow-xl border-2 border-indigo-100" />
                        </div>
                        <div className="md:w-1/2">
                            <h2 className="text-3xl md:text-4xl font-bold text-indigo-700 mb-4">
                                Hospital and Doctor Appointments
                            </h2>
                            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                                We provide a seamless online platform for booking appointments with hospitals and doctors. Managing your health appointments has never been easier, allowing you to focus on your well-being.
                            </p>
                            <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
                                <li>Browse through a wide range of **hospitals and specialists** across various medical fields.</li>
                                <li>**Schedule appointments** at your convenience with real-time availability updates.</li>
                                <li>Receive timely **reminders and updates** about your bookings via SMS and email.</li>
                                <li>Access **telemedicine consultations** for quick medical advice from the comfort of your home.</li>
                                <li>Maintain a **digital record** of your medical history securely for easy access.</li>
                            </ul>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <a href="/Hospitals" className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-full text-lg font-semibold shadow-md hover:bg-indigo-700 transition-colors duration-300 transform hover:scale-105 text-center">
                                    Visit Healthcare Page
                                </a>
                                <a href="/partner-healthcare" className="inline-block bg-transparent border-2 border-indigo-600 text-indigo-600 px-6 py-3 rounded-full text-lg font-semibold shadow-md hover:bg-indigo-600 hover:text-white transition-all duration-300 transform hover:scale-105 text-center">
                                    Partner with Us
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="fashion" className="mb-16 bg-white p-8 md:p-12 rounded-xl shadow-lg transform transition-transform duration-300 hover:scale-[1.01]">
                    <div className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-12">
                        <div className="md:w-1/2">
                            <img src={Shopping} alt="Fashion Clothing Shopping" className="w-full h-auto object-cover rounded-lg shadow-xl border-2 border-purple-100" />
                        </div>
                        <div className="md:w-1/2">
                            <h2 className="text-3xl md:text-4xl font-bold text-purple-700 mb-4">
                                Fashion Clothing Shopping
                            </h2>
                            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                                Our platform features an extensive collection of fashionable clothing for all. Discover your unique style with ease and confidence.
                            </p>
                            <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
                                <li>Explore diverse **categories for men, women, and kids**, ensuring something for everyone.</li>
                                <li>Stay updated with the **latest trends in fashion**, accompanied by detailed product descriptions and high-quality images.</li>
                                <li>Unlock **exclusive deals, discounts, and festive offers** to make your shopping more rewarding.</li>
                                <li>Receive **personalized recommendations** based on your Browse history and style preferences.</li>
                                <li>Enjoy **easy navigation** and a **secure checkout process** with multiple payment options.</li>
                            </ul>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <a href="/malls" className="inline-block bg-purple-600 text-white px-6 py-3 rounded-full text-lg font-semibold shadow-md hover:bg-purple-700 transition-colors duration-300 transform hover:scale-105 text-center">
                                    Shop Fashion Now
                                </a>
                                <a href="/partner-fashion" className="inline-block bg-transparent border-2 border-purple-600 text-purple-600 px-6 py-3 rounded-full text-lg font-semibold shadow-md hover:bg-purple-600 hover:text-white transition-all duration-300 transform hover:scale-105 text-center">
                                    Partner with Us
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Education Section */}
                <section id="education" className="mb-16 bg-white p-8 md:p-12 rounded-xl shadow-lg transform transition-transform duration-300 hover:scale-[1.01]">
                    <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                        <div className="md:w-1/2">
                            <img src={School} alt="Schools and Colleges Information" className="w-full h-auto object-cover rounded-lg shadow-xl border-2 border-green-100" />
                        </div>
                        <div className="md:w-1/2">
                            <h2 className="text-3xl md:text-4xl font-bold text-green-700 mb-4">
                                Schools and Colleges Information
                            </h2>
                            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                                We offer a comprehensive guide to schools and colleges, empowering you to make informed decisions about your academic future.
                            </p>
                            <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
                                <li>Access **detailed information** about institutions, including courses, fees, facilities, and faculty profiles.</li>
                                <li>**Directly fill out application forms online**, streamlining your admission process.</li>
                                <li>**Contact institutions** through our platform for queries, guidance, and personalized assistance.</li>
                                <li>Explore **reviews and ratings** by alumni and current students to gain insights into campus life and academics.</li>
                                <li>Stay **updated on admission deadlines** and upcoming educational events.</li>
                            </ul>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <a href="/schools" className="inline-block bg-green-600 text-white px-6 py-3 rounded-full text-lg font-semibold shadow-md hover:bg-green-700 transition-colors duration-300 transform hover:scale-105 text-center">
                                    Explore Education
                                </a>
                                <a href="/partner-education" className="inline-block bg-transparent border-2 border-green-600 text-green-600 px-6 py-3 rounded-full text-lg font-semibold shadow-md hover:bg-green-600 hover:text-white transition-all duration-300 transform hover:scale-105 text-center">
                                    Partner with Us
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Restaurants Section */}
                <section id="restaurants" className="mb-16 bg-white p-8 md:p-12 rounded-xl shadow-lg transform transition-transform duration-300 hover:scale-[1.01]">
                    <div className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-12">
                        <div className="md:w-1/2">
                            <img src={Restaurant} className="w-full h-auto object-cover rounded-lg shadow-xl border-2 border-yellow-100" />
                        </div>
                        <div className="md:w-1/2">
                            <h2 className="text-3xl md:text-4xl font-bold text-yellow-700 mb-4">
                                Restaurants and Food Ordering
                            </h2>
                            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                                Our restaurant section enables users to easily order food from a diverse range of eateries, bringing your favorite meals right to your doorstep.
                            </p>
                            <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
                                <li>Browse **menus from a variety of restaurants**, offering diverse cuisines to satisfy every craving.</li>
                                <li>**Place food orders with ease** through our intuitive and user-friendly interface.</li>
                                <li>**Track orders** in real-time and get **timely delivery updates** directly to your device.</li>
                                <li>**Discover trending cuisines** and **exclusive chef specials** from top-rated restaurants.</li>
                                <li>**Avail discounts and cashback offers** on selected restaurants and orders.</li>
                            </ul>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <a href="/restaurants" className="inline-block bg-yellow-600 text-white px-6 py-3 rounded-full text-lg font-semibold shadow-md hover:bg-yellow-700 transition-colors duration-300 transform hover:scale-105 text-center">
                                    Order Food Now
                                </a>
                                <a href="/partner-restaurants" className="inline-block bg-transparent border-2 border-yellow-600 text-yellow-600 px-6 py-3 rounded-full text-lg font-semibold shadow-md hover:bg-yellow-600 hover:text-white transition-all duration-300 transform hover:scale-105 text-center">
                                    Partner with Us
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Call to Action at the end */}
                <section className="text-center mb-16 px-4 py-12 bg-blue-400 text-white rounded-xl shadow-xl">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Experience the NDLINFO Difference?</h2>
                    <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8">
                        Join thousands of satisfied users who are simplifying their daily lives with NDLINFO. Explore our services today and unlock a world of convenience.
                    </p>
                    <a
                        href="/signup"
                        className="inline-block bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-bold shadow-xl hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
                    >
                        Sign Up for Free!
                    </a>
                </section>

            </main>
        </div>
    );
};

export default ServicePage;