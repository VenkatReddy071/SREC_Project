import React, { useState } from 'react';

export const MallAboutContent = ({ hospital }) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [submitStatus, setSubmitStatus] = useState(''); // To show success/error message

    if (!hospital) {
        return (
            <div className="p-4 sm:p-8 text-center text-gray-600">
                Loading About Us details...
            </div>
        );
    }

    const formatAreaSqFt = (sqft) => {
        if (!sqft) return 'N/A';
        if (sqft >= 1000000) {
            return `${(sqft / 1000000).toFixed(1)} million sq ft`;
        }
        if (sqft >= 1000) {
            return `${(sqft / 1000).toFixed(1)}k sq ft`;
        }
        return `${sqft} sq ft`;
    };

    const getEstablishedYear = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.getFullYear();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitStatus('Sending...');

        console.log('Sending email:', { email, message });

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));

            setSubmitStatus('Message sent successfully!');
            setEmail('');
            setMessage('');

        } catch (error) {
            console.error('Error sending message:', error);
            setSubmitStatus('Failed to send message. Please try again.');
        }
    };

    // Mapping for shopping department icons (using inline SVGs for simplicity)
    const departmentIcons = {
        "Men": (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="7" r="4" />
                <path d="M12 11v9" />
                <path d="M9 16l3 4" />
                <path d="M15 16l-3 4" />
            </svg>
        ),
        "Women": (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="5" r="3" />
                <path d="M18 21a6 6 0 0 0-12 0" />
                <path d="M12 8v4" />
                <path d="M10 12l2 3" />
                <path d="M14 12l-2 3" />
            </svg>
        ),
        "Kids": (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20a4 4 0 0 1-4-4V7a4 4 0 0 1 8 0v9a4 4 0 0 1-4 4z" />
                <path d="M9 6h.01" />
                <path d="M15 6h.01" />
                <path d="M10 12v3" />
                <path d="M14 12v3" />
            </svg>
        ),
        "Books": (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V6.5A2.5 2.5 0 0 0 17.5 4h-11A2.5 2.5 0 0 0 4 6.5v13z" />
            </svg>
        ),
        "Footwear": (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 16H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2z" />
                <path d="M18 13.7L22 10l-4-3.7V13.7z" />
            </svg>
        ),
        "Accessories": (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6V18" />
                <path d="M6 12H18" />
            </svg>
        ),
        "Gifts": (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s-8-4-8-10V5l8-3 8 3v7c0 6-8 10-8 10z" />
            </svg>
        ),
        "Various Retailers": (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="18" rx="2" ry="2" />
                <line x1="8" y1="21" x2="8" y2="3" />
                <line x1="16" y1="21" x2="16" y2="3" />
                <line x1="2" y1="9" x2="22" y2="9" />
                <line x1="2" y1="15" x2="22" y2="15" />
            </svg>
        ),
    };


    return (
        <div className="p-4 sm:p-8 bg-white text-gray-800">
            <section className="mb-8">
                <h2 className="text-4xl font-extrabold text-blue-700 mb-2">About {hospital.name}</h2>
                <p className="text-xl text-blue-500 mb-4">Discover Our Story and Commitment</p>
            </section>

            <section className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-2xl font-bold text-blue-700 mb-4">1. Our Story & History</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                    {hospital.description || hospital.info || `Welcome to ${hospital.name}! Our journey began with a vision to create a vibrant hub for the community. We've grown from humble beginnings to become a landmark destination, constantly evolving to meet the needs of our visitors.`}
                </p>
                {hospital.establishedDate && (
                    <p className="text-gray-600 mb-2">
                        <span className="font-semibold">Established:</span> {getEstablishedYear(hospital.establishedDate)}
                    </p>
                )}
                <p className="text-gray-600 leading-relaxed">
                    Over the years, we have embraced innovation and community spirit, expanding our offerings and enhancing the overall experience for every visitor. Our growth is a testament to the loyalty of our patrons and the dedication of our team.
                </p>
            </section>

            <section className="mb-8 p-6 bg-white rounded-lg border border-blue-200">
                <h3 className="text-2xl font-bold text-blue-700 mb-4">2. Our Mission & Philosophy</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                    At {hospital.name}, our core values revolve around creating an unparalleled customer experience, fostering strong community engagement, and committing to sustainable practices. We believe in providing more than just a shopping destination; we aim to be a space where memories are made and connections thrive.
                </p>
                <p className="text-gray-600 leading-relaxed">
                    We offer a dynamic environment filled with diverse retail options, culinary delights, and engaging entertainment. Our philosophy is rooted in continuous improvement, ensuring that every visit is a delightful and fulfilling experience for all.
                </p>
            </section>

            <section className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-2xl font-bold text-blue-700 mb-4">3. Mall Statistics & Quick Facts</h3>
                <ul className="list-none text-gray-700 space-y-2">
                    <li className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
                            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                        </svg>
                        <span className="font-semibold">Total Stores:</span> {hospital.totalStores || 'N/A'}
                    </li>
                    <li className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                            <line x1="10" y1="9" x2="10" y2="9" />
                        </svg>
                        <span className="font-semibold">Total Area:</span> {formatAreaSqFt(hospital.totalAreaSqFt)}
                    </li>
                    <li className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6l9 5l9-5" />
                            <path d="M3 18l9 5l9-5" />
                            <path d="M3 12l9 5l9-5" />
                        </svg>
                        <span className="font-semibold">Shopping Departments:</span>
                        <div className="flex flex-wrap items-center ml-2">
                            {hospital.shoppingDepartments?.length > 0 ? (
                                hospital.shoppingDepartments.map((department, index) => (
                                    <span key={index} className="flex items-center bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full mr-2 mb-1">
                                        {departmentIcons[department] || departmentIcons["Various Retailers"]}
                                        <span className="ml-1">{department}</span>
                                    </span>
                                ))
                            ) : (
                                <span className="text-gray-600">Various Retailers</span>
                            )}
                        </div>
                    </li>
                    {hospital.hasWeddingShopping && (
                        <li className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 21.35l-1.45-1.32C5.4 14.23 2 11.28 2 7.5A4.5 4.5 0 0 1 6.5 3C8 3 9.5 4 10.5 5.5L12 7l1.5-1.5C14.5 4 16 3 17.5 3A4.5 4.5 0 0 1 22 7.5c0 3.78-3.4 6.73-8.55 12.53L12 21.35z" />
                            </svg>
                            <span className="font-semibold">Special Feature:</span> Dedicated Wedding Shopping available
                        </li>
                    )}
                </ul>
            </section>

            <section className="mb-8 p-6 bg-white rounded-lg border border-blue-200">
                <h3 className="text-2xl font-bold text-blue-700 mb-4">4. Amenities & Services</h3>
                {hospital.amenities?.length > 0 ? (
                    <ul className="list-none text-gray-700 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {hospital.amenities.map((amenity, index) => (
                            <li key={index} className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12.5L10 17.5L19 8.5" />
                                </svg>
                                {amenity}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-600">No specific amenities listed at this time.</p>
                )}
            </section>

            <section className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-2xl font-bold text-blue-700 mb-4">5. Contact Us</h3>
                <div className="text-gray-700 space-y-2 mb-6">
                    <p className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2L15.68 20.37A19.5 19.5 0 0 1 8 13.68L3.02 8.32A2 2 0 0 1 5 6h3.08a2 2 0 0 1 2 1.74l1.37 4.57a2 2 0 0 1-.58 2.22l-2.69 2.69a1 1 0 0 0-.21 1.09l.34.61a1 1 0 0 0 1.05.51l3.62-1.35a1 1 0 0 1 .74-.01l4.42 1.66a2 2 0 0 1 1.74 2z" />
                        </svg>
                        <span className="font-semibold">Phone:</span> <a href={`tel:${hospital.phoneNumber}`} className="text-blue-600 hover:underline">{hospital.phoneNumber}</a>
                    </p>
                    <p className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                            <polyline points="22,6 12,13 2,6" />
                        </svg>
                        <span className="font-semibold">Email:</span> <a href={`mailto:${hospital.email}`} className="text-blue-600 hover:underline">{hospital.email}</a>
                    </p>
                    {hospital.website && (
                        <p className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="2" y1="12" x2="22" y2="12" />
                                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                            </svg>
                            <span className="font-semibold">Website:</span> <a href={hospital.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{hospital.website}</a>
                        </p>
                    )}
                    <p className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                        </svg>
                        <span className="font-semibold">Address:</span> {hospital.address}, {hospital.locationName}, {hospital.area}
                        {hospital.pincode && `, ${hospital.pincode}`}
                    </p>
                </div>

                <h4 className="text-xl font-bold text-blue-700 mb-3">Send Us a Message</h4>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-1">Your Email</label>
                        <input
                            type="email"
                            id="email"
                            className="w-full p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="your_email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-gray-700 text-sm font-semibold mb-1">Message</label>
                        <textarea
                            id="message"
                            rows="4"
                            className="w-full p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your message here..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                    >
                        Submit
                    </button>
                    {submitStatus && (
                        <p className={`mt-2 text-center text-sm ${submitStatus.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
                            {submitStatus}
                        </p>
                    )}
                </form>
            </section>

            {hospital.nearByLocations?.length > 0 && (
                <section className="mb-8 p-6 bg-white rounded-lg border border-blue-200">
                    <h3 className="text-2xl font-bold text-blue-700 mb-4">6. Nearby Attractions & Surroundings</h3>
                    <p className="text-gray-700 leading-relaxed">
                        Explore the vibrant surroundings of {hospital.name} with these nearby attractions: {hospital.nearByLocations.join(', ')}.
                    </p>
                </section>
            )}

            <section className="p-6 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-2xl font-bold text-blue-700 mb-4">7. Our Commitment</h3>
                <p className="text-gray-700 leading-relaxed">
                    We are deeply committed to fostering a positive impact on our community and the environment. Through various initiatives, we strive to operate responsibly, support local businesses, and provide a welcoming and inclusive space for everyone. Our dedication extends to ensuring customer satisfaction through continuous improvements and a focus on quality service.
                </p>
            </section>
        </div>
    );
};
