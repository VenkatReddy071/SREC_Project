
// import React, { useState } from 'react';
// import Header from "../../assets/HospitalHeader.jpg";
// import { useNavigate,Link,useLocation } from 'react-router-dom';
// export const Showcase = ({
//     defaultNavLinks,
//     activeNavLink,
//     setActiveNavLink,
//     hospital
// }) => {
//     const navigate = useNavigate();
//     const location=useLocation();
//     const [mainImageLoaded, setMainImageLoaded] = useState(false);
//     const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
//     const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
//     const navLinks = defaultNavLinks;
//     const mainImage = hospital?.image;
//     const thumbnail1 = hospital?.gallery?.[0];
//     const thumbnail2 = hospital?.gallery?.[1];
//     const viewGalleryImage = hospital?.gallery?.[1];
//     const galleryModalImages = hospital?.gallery?.length > 0 && hospital.gallery;
//     console.log(mainImage,thumbnail1,thumbnail2);
//     useEffect(()=>{
//         setMainImageLoaded(true);
//     },[hospital])
//     const handleNavLinkClick = (id) => {
//         setActiveNavLink(id);
//     };

//     const openGalleryModal = () => {
//         setIsGalleryModalOpen(true);
//         setCurrentSlideIndex(0);
//     };

//     const closeGalleryModal = () => {
//         setIsGalleryModalOpen(false);
//     };

//     const goToNextSlide = () => {
//         setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % galleryModalImages.length);
//     };

//     const goToPrevSlide = () => {
//         setCurrentSlideIndex((prevIndex) => (prevIndex - 1 + galleryModalImages.length) % galleryModalImages.length);
//     };
//     const url=new URLSearchParams(location.search);
//     const path=url.get('type');
//     const type=path.split("/");
//     const searchType1=type[0];
//     const searchType2=type[1];
//     const searchType3=type[2];
//     return (
//         <div className="font-sans bg-white rounded-xl overflow-hidden max-w-6xl mx-auto my-4 ">
//             <div className="flex flex-col md:flex-row gap-2 p-2">
//                 <div className="md:w-[70%] flex-shrink-0">
//                     <img
//                         src={mainImage}
//                         alt="Hospital Main View"
//                         className="w-full h-full object-cover rounded-lg"
//                         style={{ minHeight: '300px', maxHeight: '400px' }}
//                         loading="lazy"
//                     />
//                 </div>
//                 <div className="md:w-[30%] grid grid-cols-1 gap-2 flex-grow-0 flex-shrink-0">
//                     <div>
//                         <img
//                             src={thumbnail1}
//                             alt="Hospital Interior 1"
//                             className="w-full h-auto object-cover rounded-lg"
//                             style={{ minHeight: '145px', maxHeight: '195px' }}
//                             loading="lazy"
//                         />
//                     </div>
//                     <div className="relative col-span-1">
//                         <img
//                             src={viewGalleryImage}
//                             alt="View More Gallery"
//                             className="w-full h-auto object-cover rounded-lg filter brightness-75"
//                             style={{ minHeight: '145px', maxHeight: '195px' }}
//                             loading="lazy"
//                         />
//                         <button
//                             onClick={openGalleryModal}
//                             className="absolute inset-0 flex items-center justify-center text-white
//                                       text-xl font-bold bg-black bg-opacity-40 rounded-lg
//                                       hover:bg-opacity-60 transition-colors duration-200 cursor-pointer"
//                         >
//                             View Gallery
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             <nav className="sticky top-0  border-t border-gray-200 mt-4 px-2 sm:px-4 z-10">
//                 <ul className="flex flex-wrap justify-start -mb-px">
//                     {navLinks.map((link) => (
//                         <li key={link.id} className="mr-2 sm:mr-4 last:mr-0">
//                             <Link to={`?type=${searchType1}/${searchType2}/${searchType3}/${link?.label}`}>
//                             <button
//                                 onClick={() => handleNavLinkClick(link.label)}
//                                 className={`
//                                     inline-flex items-center justify-center py-4 px-1
//                                     text-sm font-bold leading-5 border-b-2
//                                     focus:outline-none focus:ring-0
//                                     transition-colors duration-200 ease-in-out
//                                     ${activeNavLink === link.label
//                                         ? 'border-blue-600 text-blue-600'
//                                         : 'border-transparent text-gray-700 hover:text-gray-900 hover:border-gray-300'
//                                     }
//                                 `}
//                             >
//                                 {link.label}
//                             </button>
//                             </Link>
//                         </li>
//                     ))}
//                 </ul>
//             </nav>
//             {isGalleryModalOpen && (
//                 <div
//                     className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-[1000]"
//                     onClick={closeGalleryModal}
//                 >
//                     <div
//                         className="bg-white rounded-lg p-4 relative max-w-4xl w-full mx-4 shadow-2xl flex flex-col items-center"
//                         onClick={(e) => e.stopPropagation()}
//                     >
//                         <button
//                             className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-3xl font-bold focus:outline-none"
//                             onClick={closeGalleryModal}
//                         >
//                             &times;
//                         </button>

//                         <div className="relative w-full h-96 flex items-center justify-center mt-4">
//                             {galleryModalImages && galleryModalImages.length > 0 ? (
//                                 <img
//                                     src={galleryModalImages[currentSlideIndex]}
//                                     alt={`Gallery slide ${currentSlideIndex + 1}`}
//                                     className="max-w-full max-h-full object-contain rounded-lg"
//                                     loading="lazy"
//                                 />
//                             ) : (
//                                 <p>No images available in the gallery.</p>
//                             )}

//                             {galleryModalImages && galleryModalImages.length > 1 && (
//                                 <>
//                                     <button
//                                         className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full opacity-70 hover:opacity-100 transition-opacity"
//                                         onClick={goToPrevSlide}
//                                     >
//                                         &#10094;
//                                     </button>
//                                     <button
//                                         className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full opacity-70 hover:opacity-100 transition-opacity"
//                                         onClick={goToNextSlide}
//                                     >
//                                         &#10095;
//                                     </button>
//                                 </>
//                             )}
//                         </div>

//                         {galleryModalImages && galleryModalImages.length > 1 && (
//                             <div className="flex gap-2 mt-4 justify-center">
//                                 {galleryModalImages.map((_, index) => (
//                                     <span
//                                         key={index}
//                                         className={`block w-3 h-3 rounded-full cursor-pointer transition-colors duration-200
//                                                     ${index === currentSlideIndex ? 'bg-blue-600' : 'bg-gray-400 hover:bg-gray-500'}`}
//                                         onClick={() => setCurrentSlideIndex(index)}
//                                     ></span>
//                                 ))}
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             )}
//         </div>

//     );
// };

import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

export const Showcase = ({
    defaultNavLinks,
    activeNavLink,
    setActiveNavLink,
    hospital
}) => {
    console.log(hospital)
    const navigate = useNavigate();
    const location = useLocation();

    const [mainImageLoaded, setMainImageLoaded] = useState(false);
    const [thumb1Loaded, setThumb1Loaded] = useState(false);
    const [viewGalleryImageLoaded, setViewGalleryImageLoaded] = useState(false);
    const [modalImageLoaded, setModalImageLoaded] = useState(false);
    const [data,setData]=useState(hospital);
    const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

    const navLinks = defaultNavLinks;
    const mainImage = hospital?.image || hospital?.imageUrls?.mainImage;
    const thumbnail1 = hospital?.gallery?.[0] ||hospital?.imageUrls?.galleryImages[0];
    const viewGalleryImage = hospital?.gallery?.[1] || hospital?.imageUrls?.galleryImages?.length>=1 ? hospital?.imageUrls?.galleryImages[1]:hospital?.imageUrls?.galleryImages[0];

    const galleryModalImages = hospital?.gallery?.length > 0 ? hospital.gallery :hospital?.imageUrls?.galleryImages?.length>0 ? hospital?.imageUrls?.galleryImages:[];

    useState(()=>{
        if(hospital){
            setData(hospital);
            
        }
    },[hospital])
    useEffect(() => {
        setMainImageLoaded(true);
        setThumb1Loaded(true);
        setViewGalleryImageLoaded(true);
    }, [data]);


    const handleNavLinkClick = (id) => {
        setActiveNavLink(id);
    };

    const openGalleryModal = () => {
        setIsGalleryModalOpen(true);
        setCurrentSlideIndex(0);
    };

    const closeGalleryModal = () => {
        setIsGalleryModalOpen(false);
    };

    const goToNextSlide = () => {
        if (galleryModalImages.length === 0) return;
        setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % galleryModalImages.length);
    };

    const goToPrevSlide = () => {
        if (galleryModalImages.length === 0) return;
        setCurrentSlideIndex((prevIndex) => (prevIndex - 1 + galleryModalImages.length) % galleryModalImages.length);
    };

    const url = new URLSearchParams(location.search);
    const path = url.get('type');
    const type = path ? path.split("/") : [];
    const searchType1 = type[0] || '';
    const searchType2 = type[1] || '';
    const searchType3 = type[2] || '';

    return (
        <div className="font-sans bg-white rounded-xl overflow-hidden max-w-6xl mx-auto my-4 ">
            <div className="flex flex-col md:flex-row gap-2 p-2">
                <div className="md:w-[70%] flex-shrink-0 relative overflow-hidden rounded-lg" style={{ minHeight: '300px', maxHeight: '400px' }}>
                    {!mainImageLoaded && <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg"></div>}
                    <img
                        src={mainImage}
                        alt="Main View"
                        className={`w-full h-full object-cover rounded-lg ${mainImageLoaded ? '' : 'hidden'}`}
                        style={{ minHeight: '300px', maxHeight: '400px' }}
                        loading="lazy"
                        onLoad={() => setMainImageLoaded(true)}
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/740x480/d3d3d3/424242?text=Image+Not+Found"; setMainImageLoaded(true); }}
                    />
                </div>
                <div className="md:w-[30%] grid grid-cols-1 gap-2 flex-grow-0 flex-shrink-0">
                    <div className="relative overflow-hidden rounded-lg" style={{ minHeight: '145px', maxHeight: '195px' }}>
                        {!thumb1Loaded && <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg"></div>}
                        <img
                            src={thumbnail1}
                            alt="Thumbnail 1"
                            className={`w-full h-auto object-cover rounded-lg ${thumb1Loaded ? '' : 'hidden'}`}
                            style={{ minHeight: '145px', maxHeight: '195px' }}
                            loading="lazy"
                            onLoad={() => setThumb1Loaded(true)}
                            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/300x200/d3d3d3/424242?text=Thumb+Error+1"; setThumb1Loaded(true); }}
                        />
                    </div>
                    <div className="relative col-span-1 overflow-hidden rounded-lg" style={{ minHeight: '145px', maxHeight: '195px' }}>
                        {!viewGalleryImageLoaded && <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg"></div>}
                        <img
                            src={viewGalleryImage}
                            alt="View More Gallery"
                            className={`w-full h-auto object-cover rounded-lg filter brightness-75 ${viewGalleryImageLoaded ? '' : 'hidden'}`}
                            style={{ minHeight: '145px', maxHeight: '195px' }}
                            loading="lazy"
                            onLoad={() => setViewGalleryImageLoaded(true)}
                            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/300x200/d3d3d3/424242?text=View+Gallery+Error"; setViewGalleryImageLoaded(true); }}
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

            <nav className="sticky bg-white top-0 border-t border-gray-200 mt-4 px-2 sm:px-4 z-0">
                <ul className=" sticky top-0 flex flex-wrap justify-start -mb-px">
                    {navLinks.map((link) => (
                        <li key={link.id} className="mr-2 sm:mr-4 last:mr-0">
                            <Link to={`?type=${searchType1}/${searchType2}/${searchType3}/${link?.label}`}>
                                <button
                                    onClick={() => handleNavLinkClick(link.label)}
                                    className={`
                                        inline-flex items-center justify-center py-4 px-1
                                        text-sm font-bold leading-5 border-b-2
                                        focus:outline-none focus:ring-0
                                        transition-colors duration-200 ease-in-out
                                        ${activeNavLink === link.label
                                            ? 'border-blue-600 text-blue-600'
                                            : 'border-transparent text-gray-700 hover:text-gray-900 hover:border-gray-300'
                                        }
                                    `}
                                >
                                    {link.label}
                                </button>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

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
                                <div className="relative w-full h-full flex items-center justify-center">
                                    {!modalImageLoaded && <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg"></div>}
                                    <img
                                        src={galleryModalImages[currentSlideIndex]}
                                        alt={`Gallery slide ${currentSlideIndex + 1}`}
                                        className={`max-w-full max-h-full object-contain rounded-lg ${modalImageLoaded ? '' : 'hidden'}`}
                                        loading="lazy"
                                        onLoad={() => setModalImageLoaded(true)}
                                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/740x480/d3d3d3/424242?text=Image+Error"; setModalImageLoaded(true); }}
                                    />
                                </div>
                            ) : (
                                <p className="text-gray-600">No images available in the gallery.</p>
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
