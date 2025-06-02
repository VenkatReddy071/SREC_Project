


// import React, { useState } from 'react';
// import Header from "../../assets/HospitalHeader.jpg";
// import { useNavigate } from 'react-router-dom';
// const defaultImages = [
//   Header, // Main image and initial thumbnails
//   'https://images.unsplash.com/photo-1585435557343-3b0920377dc6?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Hospital interior 1 (will be thumbnail1)
//   'https://images.unsplash.com/photo-1538108422778-d446a3a41144?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Hospital interior 2 (will be thumbnail2)
//   'https://images.unsplash.com/photo-1579684385108-164936d532a2?q=80&w=2832&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Hospital equipment (for View Gallery)
//   'https://images.unsplash.com/photo-1586769931862-23f2f8450f61?q=80&w=2800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Hospital hallway (additional slider image)
//   'https://images.unsplash.com/photo-1519702206-ba9c1a592984?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Doctors' team (additional slider image)
// ];




// export const Showcase = ({
//   images = defaultImages,defaultNavLinks,
//   activeNavLink, setActiveNavLink,
//   hospital
// }) => {
//   console.log(hospital)
//   const navigate=useNavigate();
//   const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
//   const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
//   const navLinks=defaultNavLinks
//   const mainImage = hospital?.image;
//   const thumbnail1 =  hospital?.gallery[0];
//   const thumbnail2 =  hospital?.gallery.length>=2 ? hospital.gallery[1]:hospital?.image;
//   const viewGalleryImage = hospital.gallery.length>=3 ? hospital.gallery[2]:hospital?.image;
//   console.log(thumbnail2,thumbnail1)
//   const handleNavLinkClick = (id) => {
//     setActiveNavLink(id);
//   };

//   const openGalleryModal = () => {
//     setIsGalleryModalOpen(true);
//     setCurrentSlideIndex(0);
//   };

//   const closeGalleryModal = () => {
//     setIsGalleryModalOpen(false);
//   };

//   const goToNextSlide = () => {
//     setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % images.length);
//   };

//   const goToPrevSlide = () => {
//     setCurrentSlideIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
//   };

//   return (
//     <div className="font-sans bg-white rounded-xl overflow-hidden max-w-6xl mx-auto my-4 "> {/* Added shadow-lg for card effect */}
//       {/* Image Gallery Section */}
//       <div className="flex flex-col md:flex-row gap-2 p-2">
//         {/* Main Image - Takes 70% width on medium screens and up */}
//         <div className="md:w-[70%] flex-shrink-0">
//           <img
//             src={mainImage}
//             alt="Hospital Main View"
//             className="w-full h-full object-cover rounded-lg"
//             style={{ minHeight: '300px', maxHeight: '400px' }}
//             loading="lazy" // Lazy loading
//           />
//         </div>

//         {/* Smaller Images Grid - Takes 30% width on medium screens and up */}
//         <div className="md:w-[30%] grid grid-cols-1 gap-2 flex-grow-0 flex-shrink-0">
//           {/* Top-right image */}

//           {/* Middle-right image (from reference image) */}
//           <div>
//             <img
//               src={thumbnail2}
//               alt="Hospital Ambiance"
//               className="w-full h-auto object-cover rounded-lg"
//               style={{ minHeight: '145px', maxHeight: '195px' }}
//               loading="lazy" // Lazy loading
//             />
//           </div>
//           {/* "View Gallery" Image with Overlay - Bottom-right image */}
//           <div className="relative col-span-1">
//             <img
//               src={thumbnail1}
//               alt="View More Gallery"
//               className="w-full h-auto object-cover rounded-lg filter brightness-75"
//               style={{ minHeight: '145px', maxHeight: '195px' }}
//               loading="lazy" // Lazy loading
//             />
//             <button
//               onClick={openGalleryModal} // Call openGalleryModal
//               className="absolute inset-0 flex items-center justify-center text-white
//                          text-xl font-bold bg-black bg-opacity-40 rounded-lg
//                          hover:bg-opacity-60 transition-colors duration-200 cursor-pointer"
//             >
//               View Gallery
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Navigation Links */}
//       <nav className="border-t border-gray-200 mt-4 px-2 sm:px-4">
//         <ul className="flex flex-wrap justify-start -mb-px">
//           {navLinks.map((link) => (
//             <li key={link.id} className="mr-2 sm:mr-4 last:mr-0">
//               <button
//                 onClick={() => handleNavLinkClick(link.id)}
//                 className={`
//                   inline-flex items-center justify-center py-4 px-1
//                   text-sm font-medium leading-5 border-b-2
//                   focus:outline-none focus:ring-0
//                   transition-colors duration-200 ease-in-out
//                   ${activeNavLink === link.id
//                     ? 'border-blue-600 text-blue-600'
//                     : 'border-transparent text-gray-700 hover:text-gray-900 hover:border-gray-300'
//                   }
//                 `}
//               >
//                 {link.label}
//               </button>
//             </li>
//           ))}
//         </ul>
//       </nav>

//       {isGalleryModalOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-[1000]"
//           onClick={closeGalleryModal} // Close modal when clicking outside content
//         >
//           <div
//             className="bg-white rounded-lg p-4 relative max-w-4xl w-full mx-4 shadow-2xl flex flex-col items-center"
//             onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside content
//           >
//             <button
//               className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-3xl font-bold focus:outline-none"
//               onClick={closeGalleryModal}
//             >
//               &times;
//             </button>

//             <div className="relative w-full h-96 flex items-center justify-center mt-4">
//               <img
//                 src={hospital.gallery[currentSlideIndex]}
//                 alt={`Gallery slide ${currentSlideIndex + 1}`}
//                 className="max-w-full max-h-full object-contain rounded-lg"
//                 loading="lazy" // Lazy loading for slider images too
//               />
//               <button
//                 className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full opacity-70 hover:opacity-100 transition-opacity"
//                 onClick={goToPrevSlide}
//               >
//                 &#10094; {/* Left arrow */}
//               </button>
//               <button
//                 className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full opacity-70 hover:opacity-100 transition-opacity"
//                 onClick={goToNextSlide}
//               >
//                 &#10095; {/* Right arrow */}
//               </button>
//             </div>

//             {/* Slider Dots */}
//             <div className="flex gap-2 mt-4 justify-center">
//               {images.map((_, index) => (
//                 <span
//                   key={index}
//                   className={`block w-3 h-3 rounded-full cursor-pointer transition-colors duration-200
//                               ${index === currentSlideIndex ? 'bg-blue-600' : 'bg-gray-400 hover:bg-gray-500'}`}
//                   onClick={() => setCurrentSlideIndex(index)}
//                 ></span>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

import React, { useState } from 'react';
import Header from "../../assets/HospitalHeader.jpg";
import { useNavigate } from 'react-router-dom';

const defaultImages = [
    Header, // Main image and initial thumbnails
    'https://images.unsplash.com/photo-1585435557343-3b0920377dc6?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Hospital interior 1 (will be thumbnail1)
    'https://images.unsplash.com/photo-1538108422778-d446a3a41144?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Hospital interior 2 (will be thumbnail2)
    'https://images.unsplash.com/photo-1579684385108-164936d532a2?q=80&w=2832&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Hospital equipment (for View Gallery)
    'https://images.unsplash.com/photo-1586769931862-23f2f8450f61?q=80&w=2800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Hospital hallway (additional slider image)
    'https://images.unsplash.com/photo-1519702206-ba9c1a592984?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Doctors' team (additional slider image)
];

export const Showcase = ({
    images = defaultImages,
    defaultNavLinks,
    activeNavLink,
    setActiveNavLink,
    hospital
}) => {
    const navigate = useNavigate();
    const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const navLinks = defaultNavLinks;

    // Prioritize images from hospital prop, otherwise use defaultImages or Header
    const mainImage = hospital?.image || images[0] || Header;
    const thumbnail1 = hospital?.gallery?.[0] || images[1] || Header;
    const thumbnail2 = hospital?.gallery?.[1] || images[2] || Header;
    const viewGalleryImage = hospital?.gallery?.[2] || images[3] || Header;

    // The full set of images for the gallery modal
    const galleryModalImages = hospital?.gallery?.length > 0 ? hospital.gallery : images;

    const handleNavLinkClick = (id) => {
        setActiveNavLink(id);
        // Add logic here to scroll to a section or navigate if needed
    };

    const openGalleryModal = () => {
        setIsGalleryModalOpen(true);
        setCurrentSlideIndex(0); // Start from the first image when opening
    };

    const closeGalleryModal = () => {
        setIsGalleryModalOpen(false);
    };

    const goToNextSlide = () => {
        setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % galleryModalImages.length);
    };

    const goToPrevSlide = () => {
        setCurrentSlideIndex((prevIndex) => (prevIndex - 1 + galleryModalImages.length) % galleryModalImages.length);
    };

    return (
        <div className="font-sans bg-white rounded-xl overflow-hidden max-w-6xl mx-auto my-4 shadow-lg">
            {/* Image Gallery Section */}
            <div className="flex flex-col md:flex-row gap-2 p-2">
                {/* Main Image - Takes 70% width on medium screens and up */}
                <div className="md:w-[70%] flex-shrink-0">
                    <img
                        src={mainImage}
                        alt="Hospital Main View"
                        className="w-full h-full object-cover rounded-lg"
                        style={{ minHeight: '300px', maxHeight: '400px' }}
                        loading="lazy"
                    />
                </div>

                {/* Smaller Images Grid - Takes 30% width on medium screens and up */}
                <div className="md:w-[30%] grid grid-cols-1 gap-2 flex-grow-0 flex-shrink-0">
                    {/* Top-right image (Thumbnail 1) */}
                    <div>
                        <img
                            src={thumbnail1}
                            alt="Hospital Interior 1"
                            className="w-full h-auto object-cover rounded-lg"
                            style={{ minHeight: '145px', maxHeight: '195px' }}
                            loading="lazy"
                        />
                    </div>
                    {/* Middle-right image (Thumbnail 2) */}
                    {/* <div>
                        <img
                            src={thumbnail2}
                            alt="Hospital Interior 2"
                            className="w-full h-auto object-cover rounded-lg"
                            style={{ minHeight: '145px', maxHeight: '195px' }}
                            loading="lazy"
                        />
                    </div> */}
                    {/* "View Gallery" Image with Overlay - Bottom-right image */}
                    <div className="relative col-span-1">
                        <img
                            src={viewGalleryImage}
                            alt="View More Gallery"
                            className="w-full h-auto object-cover rounded-lg filter brightness-75"
                            style={{ minHeight: '145px', maxHeight: '195px' }}
                            loading="lazy"
                        />
                        <button
                            onClick={openGalleryModal}
                            className="absolute inset-0 flex items-center justify-center text-white
                                      text-xl font-bold bg-black bg-opacity-40 rounded-lg
                                      hover:bg-opacity-60 transition-colors duration-200 cursor-pointer"
                        >
                            View Gallery
                        </button>
                    </div>
                </div>
            </div>

            {/* Navigation Links */}
            <nav className="border-t border-gray-200 mt-4 px-2 sm:px-4">
                <ul className="flex flex-wrap justify-start -mb-px">
                    {navLinks.map((link) => (
                        <li key={link.id} className="mr-2 sm:mr-4 last:mr-0">
                            <button
                                onClick={() => handleNavLinkClick(link.id)}
                                className={`
                                    inline-flex items-center justify-center py-4 px-1
                                    text-sm font-medium leading-5 border-b-2
                                    focus:outline-none focus:ring-0
                                    transition-colors duration-200 ease-in-out
                                    ${activeNavLink === link.id
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-gray-700 hover:text-gray-900 hover:border-gray-300'
                                    }
                                `}
                            >
                                {link.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Gallery Modal */}
            {isGalleryModalOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-[1000]"
                    onClick={closeGalleryModal}
                >
                    <div
                        className="bg-white rounded-lg p-4 relative max-w-4xl w-full mx-4 shadow-2xl flex flex-col items-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-3xl font-bold focus:outline-none"
                            onClick={closeGalleryModal}
                        >
                            &times;
                        </button>

                        <div className="relative w-full h-96 flex items-center justify-center mt-4">
                            {galleryModalImages && galleryModalImages.length > 0 ? (
                                <img
                                    src={galleryModalImages[currentSlideIndex]}
                                    alt={`Gallery slide ${currentSlideIndex + 1}`}
                                    className="max-w-full max-h-full object-contain rounded-lg"
                                    loading="lazy"
                                />
                            ) : (
                                <p>No images available in the gallery.</p>
                            )}

                            {galleryModalImages && galleryModalImages.length > 1 && (
                                <>
                                    <button
                                        className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full opacity-70 hover:opacity-100 transition-opacity"
                                        onClick={goToPrevSlide}
                                    >
                                        &#10094;
                                    </button>
                                    <button
                                        className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full opacity-70 hover:opacity-100 transition-opacity"
                                        onClick={goToNextSlide}
                                    >
                                        &#10095;
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Slider Dots */}
                        {galleryModalImages && galleryModalImages.length > 1 && (
                            <div className="flex gap-2 mt-4 justify-center">
                                {galleryModalImages.map((_, index) => (
                                    <span
                                        key={index}
                                        className={`block w-3 h-3 rounded-full cursor-pointer transition-colors duration-200
                                                    ${index === currentSlideIndex ? 'bg-blue-600' : 'bg-gray-400 hover:bg-gray-500'}`}
                                        onClick={() => setCurrentSlideIndex(index)}
                                    ></span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};