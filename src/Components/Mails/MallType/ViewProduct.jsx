// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import { Link,useLocation } from 'react-router-dom';

// const ViewProduct = ({defaultProduct }) => {
//     const [product, setProduct] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [imageLoaded, setImageLoaded] = useState(false);
//     const [mainImage, setMainImage] = useState('');
//     const imgRef = useRef(null);
//     const location=useLocation();
//     const url=new URLSearchParams(location.search);
//     const product11=url.get('type')?.split("=");
//     const productId=product11[1];
//     console.log(productId,url);
//     const [selectedSize, setSelectedSize] = useState('');
//     const [selectedColor, setSelectedColor] = useState('');
//     const [quantity, setQuantity] = useState(1);

//     useEffect(() => {
//         const fetchProduct = async () => {
//             setLoading(true);
//             setError(null);

//             if (!productId) {
//                 setProduct(defaultProduct);
//                 setMainImage(defaultProduct.images && defaultProduct.images.length > 0 ? defaultProduct.images[0] : '');
    
//                 if (defaultProduct.availableSizes && defaultProduct.availableSizes.length > 0) {
//                     setSelectedSize(defaultProduct.availableSizes[0]);
//                 }
//                 if (defaultProduct.availableColors && defaultProduct.availableColors.length > 0) {
//                     setSelectedColor(defaultProduct.availableColors[0]);
//                 }
//                 setLoading(false);
//                 return;
//             }

//             try {
//                 const url = `${import.meta.env.VITE_SERVER_URL}/api/product/${productId}`;
//                 const response = await axios.get(url, { withCredentials: true });
//                 const fetchedProduct = response.data.product;
//                 setProduct(fetchedProduct);
//                 setMainImage(fetchedProduct.images && fetchedProduct.images.length > 0 ? fetchedProduct.images[0] : '');
//                 if (fetchedProduct.availableSizes && fetchedProduct.availableSizes.length > 0) {
//                     setSelectedSize(fetchedProduct.availableSizes[0]);
//                 } else {
//                     setSelectedSize('');
//                 }
//                 if (fetchedProduct.availableColors && fetchedProduct.availableColors.length > 0) {
//                     setSelectedColor(fetchedProduct.availableColors[0]);
//                 } else {
//                     setSelectedColor('');
//                 }
//             } catch (err) {
//                 console.error(`Error while fetching product with ID ${productId}:`, err);
//                 setError(err.response?.data?.message || `Failed to load product details for ID: ${productId}. Please try again.`);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchProduct();
//     }, [productId, defaultProduct]);

//     useEffect(() => {
//         if (!mainImage) return;

//         setImageLoaded(false);
//         const observer = new IntersectionObserver((entries, observer) => {
//             entries.forEach(entry => {
//                 if (entry.isIntersecting) {
//                     setImageLoaded(true);
//                     observer.disconnect();
//                 }
//             });
//         }, {
//             rootMargin: '0px',
//             threshold: 0.1
//         });

//         if (imgRef.current) {
//             observer.observe(imgRef.current);
//         }

//         return () => {
//             if (imgRef.current) {
//                 observer.unobserve(imgRef.current);
//             }
//         };
//     }, [mainImage]);

//     const handleThumbnailClick = (imageUrl) => {
//         setMainImage(imageUrl);
//         setImageLoaded(false);
//     };

//     const handleQuantityChange = (type) => {
//         if (type === 'increment') {
//             setQuantity(prevQuantity => Math.min(prevQuantity + 1, product.stockQuantity || 99)); // Limit to stock or 99
//         } else {
//             setQuantity(prevQuantity => Math.max(prevQuantity - 1, 1)); // Minimum quantity is 1
//         }
//     };

//     const renderRatingStars = (rating) => {
//         const validatedRating = typeof rating === 'number' && rating >= 0 && rating <= 5 ? rating : 0;
//         const fullStars = Math.floor(validatedRating);
//         const hasHalfStar = validatedRating % 1 !== 0;
//         const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
//         const starSize = 'w-5 h-5';

//         return (
//             <div className="flex items-center">
//                 {[...Array(fullStars)].map((_, i) => (
//                     <svg key={`full-${i}`} className={`${starSize} text-yellow-400 fill-current`} viewBox="0 0 24 24">
//                         <path d="M12 .587l3.668 7.423 8.216 1.192-5.952 5.805 1.403 8.188L12 18.896l-7.335 3.864 1.403-8.188-5.952-5.805 8.216-1.192L12 .587z"/>
//                     </svg>
//                 ))}
//                 {hasHalfStar && (
//                     <svg className={`${starSize} text-yellow-400 fill-current`} viewBox="0 0 24 24">
//                         <path d="M12 18.896l-7.335 3.864 1.403-8.188-5.952-5.805 8.216-1.192L12 .587v18.309z"/>
//                     </svg>
//                 )}
//                 {[...Array(emptyStars)].map((_, i) => (
//                     <svg key={`empty-${i}`} className={`${starSize} text-gray-300 fill-current`} viewBox="0 0 24 24">
//                         <path d="M12 .587l3.668 7.423 8.216 1.192-5.952 5.805 1.403 8.188L12 18.896l-7.335 3.864 1.403-8.188-5.952-5.805 8.216-1.192L12 .587z"/>
//                     </svg>
//                 ))}
//             </div>
//         );
//     };

//     if (loading) {
//         return (
//             <div className="flex justify-center items-center h-48">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
//                 <p className="ml-4 text-lg text-gray-700">Loading product...</p>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mx-auto max-w-xl" role="alert">
//                 <strong className="font-bold">Error! </strong>
//                 <span className="block sm:inline">{error}</span>
//             </div>
//         );
//     }

//     if (!product) {
//         return (
//             <div className="text-center py-8 text-gray-600">
//                 <p>Product not found.</p>
//                 <Link to="/" className="text-blue-600 hover:underline">Go back to home</Link>
//             </div>
//         );
//     }

//     const productImages = product.images || [];

//     // Determine rating to display (actual or dummy)
//     const displayRating = (product.averageRating !== undefined && product.averageRating !== null)
//         ? product.averageRating
//         : 4.2; // Dummy average rating
//     const displayTotalReviews = (product.totalReviews !== undefined && product.totalReviews !== null)
//         ? product.totalReviews
//         : 150; // Dummy total reviews

//     return (
//         <div className="container mx-auto p-4 bg-white  rounded-lg my-8 max-w-5xl">
//             <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">{product.name}</h2>

//             <div className="flex flex-col md:flex-row gap-8">
//                 <div className="md:w-1/2 flex flex-col items-center">
//                     <div className="relative w-full mb-4 rounded-lg overflow-hidden" style={{ paddingBottom: '75%' }}>
//                         {!imageLoaded && (
//                             <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-600 text-xl">
//                                 Loading Image...
//                             </div>
//                         )}
//                         {mainImage && (
//                             <img
//                                 ref={imgRef}
//                                 src={imageLoaded ? mainImage : ''}
//                                 alt={product.name}
//                                 className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
//                             />
//                         )}
//                     </div>

//                     {productImages.length > 0 && ( // Changed from > 1 to > 0 to show thumbnails even for a single image if desired
//                         <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
//                             {productImages.map((imgUrl, index) => (
//                                 <img
//                                     key={index}
//                                     src={imgUrl}
//                                     alt={`${product.name} thumbnail ${index + 1}`}
//                                     className={`w-20 h-20 object-cover rounded-md cursor-pointer border-2 ${mainImage === imgUrl ? 'border-blue-500' : 'border-transparent'} hover:border-blue-500 transition-colors duration-200`}
//                                     onClick={() => handleThumbnailClick(imgUrl)}
//                                 />
//                             ))}
//                         </div>
//                     )}
//                 </div>

//                 <div className="md:w-1/2 p-4">
//                     <p className="text-gray-700 text-3xl font-bold mb-4">
//                         {product.currency} {product.price?.toFixed(2)}
//                     </p>

//                     {/* Rating Showcase (with dummy data fallback) */}
//                     <div className="mb-4 flex items-center">
//                         <span className="font-semibold text-gray-700 mr-2">Rating:</span>
//                         {renderRatingStars(displayRating)}
//                         <span className="ml-2 text-gray-600">({displayRating.toFixed(1)} / 5)</span>
//                     </div>
//                     <p className="text-sm text-gray-500 mb-4">Based on {displayTotalReviews} reviews</p>

//                     <p className="text-gray-600 text-lg mb-6 leading-relaxed">{product.description}</p>

//                     {/* Size Selection */}
//                     {product.availableSizes && product.availableSizes.length > 0 && (
//                         <div className="mb-4">
//                             <span className="font-semibold text-gray-700 block mb-2">Select Size:</span>
//                             <div className="flex flex-wrap gap-2">
//                                 {product.availableSizes.map((size, index) => (
//                                     <button
//                                         key={index}
//                                         className={`px-4 py-2 rounded-lg border-2 ${selectedSize === size ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-100 text-gray-800 border-gray-300 hover:border-blue-400'
//                                             } transition-colors duration-200`}
//                                         onClick={() => setSelectedSize(size)}
//                                     >
//                                         {size}
//                                     </button>
//                                 ))}
//                             </div>
//                             {!selectedSize && (
//                                 <p className="text-red-500 text-sm mt-1">Please select a size.</p>
//                             )}
//                         </div>
//                     )}

//                     {/* Color Selection */}
//                     {product.availableColors && product.availableColors.length > 0 && (
//                         <div className="mb-6">
//                             <span className="font-semibold text-gray-700 block mb-2">Select Color:</span>
//                             <div className="flex flex-wrap gap-2">
//                                 {product.availableColors.map((color, index) => (
//                                     <button
//                                         key={index}
//                                         className={`w-10 h-10 rounded-full border-2 ${selectedColor === color ? 'ring-2 ring-blue-500 ring-offset-2' : 'border-gray-300'
//                                             } focus:outline-none transition-all duration-200 flex items-center justify-center`}
//                                         style={{ backgroundColor: color.toLowerCase() }} // Use actual color name for background
//                                         onClick={() => setSelectedColor(color)}
//                                         title={color}
//                                     >
//                                         {/* Optional: Add a checkmark or text for visibility on very dark colors */}
//                                         {selectedColor === color && (
//                                             <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                                             </svg>
//                                         )}
//                                     </button>
//                                 ))}
//                             </div>
//                             {!selectedColor && (
//                                 <p className="text-red-500 text-sm mt-1">Please select a color.</p>
//                             )}
//                         </div>
//                     )}

//                     {/* Quantity Selector */}
//                     <div className="mb-8">
//                         <span className="font-semibold text-gray-700 block mb-2">Quantity:</span>
//                         <div className="flex items-center space-x-2">
//                             <button
//                                 className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-lg font-semibold hover:bg-gray-300 transition-colors duration-200"
//                                 onClick={() => handleQuantityChange('decrement')}
//                                 disabled={quantity <= 1}
//                             >
//                                 -
//                             </button>
//                             <input
//                                 type="number"
//                                 value={quantity}
//                                 onChange={(e) => {
//                                     const val = parseInt(e.target.value);
//                                     if (!isNaN(val) && val >= 1) {
//                                         setQuantity(Math.min(val, product.stockQuantity || 99));
//                                     } else if (e.target.value === '') {
//                                         setQuantity(''); // Allow empty for typing
//                                     }
//                                 }}
//                                 onBlur={() => {
//                                     if (quantity === '' || quantity < 1) {
//                                         setQuantity(1); // Reset to 1 if empty or less than 1
//                                     }
//                                 }}
//                                 className="w-20 text-center border-gray-300 rounded-lg shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
//                                 min="1"
//                                 max={product.stockQuantity || 99}
//                             />
//                             <button
//                                 className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-lg font-semibold hover:bg-gray-300 transition-colors duration-200"
//                                 onClick={() => handleQuantityChange('increment')}
//                                 disabled={quantity >= (product.stockQuantity || 99)}
//                             >
//                                 +
//                             </button>
//                         </div>
//                         {product.stockQuantity !== undefined && product.stockQuantity < 10 && product.stockQuantity > 0 && (
//                             <p className="text-orange-500 text-sm mt-1">Only {product.stockQuantity} left in stock!</p>
//                         )}
//                         {product.stockQuantity === 0 && (
//                             <p className="text-red-500 text-sm mt-1">Currently Out of Stock.</p>
//                         )}
//                     </div>

//                     <div className="mt-8 flex justify-center">
//                         <button
//                             onClick={() => console.log('Added to cart:', { product: product.name, selectedSize, selectedColor, quantity })}
//                             className="bg-blue-600 text-white px-8 py-4 rounded-lg text-xl font-semibold hover:bg-blue-700 transition duration-300 ease-in-out shadow-lg transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
//                             disabled={product.status==='out_of_stock' || product.stockQuantity === 0 || (product.availableSizes?.length > 0 && !selectedSize) || (product.availableColors?.length > 0 && !selectedColor)}
//                         >
//                             {product.status!=='out_of_stock' && product.stockQuantity > 0 ? 'Add to Cart' : 'Out of Stock'}
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ViewProduct;


import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../../Context/CartContext.jsx';

const ViewProduct = ({ defaultProduct }) => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [mainImage, setMainImage] = useState('');
    const imgRef = useRef(null);
    const location = useLocation();
    const urlParams = new URLSearchParams(location.search);
    const productParam = urlParams.get('type');
    const productId = productParam ? productParam.split("=")[1] : null;

    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [quantity, setQuantity] = useState(1);

    const { addToCart, loading: cartLoading } = useCart();

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            setError(null);

            if (!productId && defaultProduct) {
                setProduct(defaultProduct);
                setMainImage(defaultProduct.images && defaultProduct.images.length > 0 ? defaultProduct.images[0] : '');

                if (defaultProduct.availableSizes && defaultProduct.availableSizes.length > 0) {
                    setSelectedSize(defaultProduct.availableSizes[0]);
                }
                if (defaultProduct.availableColors && defaultProduct.availableColors.length > 0) {
                    setSelectedColor(defaultProduct.availableColors[0]);
                }
                setLoading(false);
                return;
            }

            if (!productId) {
                setError("No product ID or default product data provided.");
                setLoading(false);
                return;
            }

            try {
                const url = `${import.meta.env.VITE_SERVER_URL}/api/product/${productId}`;
                const response = await axios.get(url, { withCredentials: true });
                const fetchedProduct = response.data.product;
                setProduct(fetchedProduct);
                setMainImage(fetchedProduct.images && fetchedProduct.images.length > 0 ? fetchedProduct.images[0] : '');
                if (fetchedProduct.availableSizes && fetchedProduct.availableSizes.length > 0) {
                    setSelectedSize(fetchedProduct.availableSizes[0]);
                } else {
                    setSelectedSize('');
                }
                if (fetchedProduct.availableColors && fetchedProduct.availableColors.length > 0) {
                    setSelectedColor(fetchedProduct.availableColors[0]);
                } else {
                    setSelectedColor('');
                }
            } catch (err) {
                console.error(`Error while fetching product with ID ${productId}:`, err);
                setError(err.response?.data?.message || `Failed to load product details for ID: ${productId}. Please try again.`);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId, defaultProduct]);

    useEffect(() => {
        if (!mainImage) return;

        setImageLoaded(false);
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setImageLoaded(true);
                    observer.disconnect();
                }
            });
        }, {
            rootMargin: '0px',
            threshold: 0.1
        });

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => {
            if (imgRef.current) {
                observer.unobserve(imgRef.current);
            }
        };
    }, [mainImage]);

    const handleThumbnailClick = (imageUrl) => {
        setMainImage(imageUrl);
        setImageLoaded(false);
    };

    const handleQuantityChange = (type) => {
        if (type === 'increment') {
            setQuantity(prevQuantity => Math.min(prevQuantity + 1, product.stockQuantity || 99));
        } else {
            setQuantity(prevQuantity => Math.max(prevQuantity - 1, 1));
        }
    };

    const handleAddToCartClick = async () => {
        if (product.availableSizes && product.availableSizes.length > 0 && !selectedSize) {
            alert('Please select a size.');
            return;
        }
        if (product.availableColors && product.availableColors.length > 0 && !selectedColor) {
            alert('Please select a color.');
            return;
        }

        const itemToAdd = {
            itemId: product._id,
            name: product.name,
            price: product.price,
            currency: product.currency,
            quantity,
            selectedSize,
            selectedColor,
            image: product.images[0] || null,
            sourceId: product.mall,
            itemModelType: 'Product',
            sourceType: 'Mall',
            storeName: product.storeName,
        };
        console.log(itemToAdd);
        await addToCart(itemToAdd);
    };

    const renderRatingStars = (rating) => {
        const validatedRating = typeof rating === 'number' && rating >= 0 && rating <= 5 ? rating : 0;
        const fullStars = Math.floor(validatedRating);
        const hasHalfStar = validatedRating % 1 !== 0;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        const starSize = 'w-5 h-5';

        return (
            <div className="flex items-center">
                {[...Array(fullStars)].map((_, i) => (
                    <svg key={`full-${i}`} className={`${starSize} text-yellow-400 fill-current`} viewBox="0 0 24 24">
                        <path d="M12 .587l3.668 7.423 8.216 1.192-5.952 5.805 1.403 8.188L12 18.896l-7.335 3.864 1.403-8.188-5.952-5.805 8.216-1.192L12 .587z"/>
                    </svg>
                ))}
                {hasHalfStar && (
                    <svg className={`${starSize} text-yellow-400 fill-current`} viewBox="0 0 24 24">
                        <path d="M12 18.896l-7.335 3.864 1.403-8.188-5.952-5.805 8.216-1.192L12 .587v18.309z"/>
                    </svg>
                )}
                {[...Array(emptyStars)].map((_, i) => (
                    <svg key={`empty-${i}`} className={`${starSize} text-gray-300 fill-current`} viewBox="0 0 24 24">
                        <path d="M12 .587l3.668 7.423 8.216 1.192-5.952 5.805 1.403 8.188L12 18.896l-7.335 3.864 1.403-8.188-5.952-5.805 8.216-1.192L12 .587z"/>
                    </svg>
                ))}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                <p className="ml-4 text-lg text-gray-700">Loading product...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mx-auto max-w-xl" role="alert">
                <strong className="font-bold">Error! </strong>
                <span className="block sm:inline">{error}</span>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="text-center py-8 text-gray-600">
                <p>Product not found.</p>
                <Link to="/" className="text-blue-600 hover:underline">Go back to home</Link>
            </div>
        );
    }

    const productImages = product.images || [];

    const displayRating = (product.averageRating !== undefined && product.averageRating !== null)
        ? product.averageRating
        : 4.2;
    const displayTotalReviews = (product.totalReviews !== undefined && product.totalReviews !== null)
        ? product.totalReviews
        : 150;

    return (
        <div className="container mx-auto p-4 bg-white rounded-lg my-8 max-w-5xl">
            <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">{product.name}</h2>

            <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/2 flex flex-col items-center">
                    <div className="relative w-full mb-4 rounded-lg overflow-hidden" style={{ paddingBottom: '75%' }}>
                        {!imageLoaded && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-600 text-xl">
                                Loading Image...
                            </div>
                        )}
                        {mainImage && (
                            <img
                                ref={imgRef}
                                src={imageLoaded ? mainImage : ''}
                                alt={product.name}
                                className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                            />
                        )}
                    </div>

                    {productImages.length > 0 && (
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            {productImages.map((imgUrl, index) => (
                                <img
                                    key={index}
                                    src={imgUrl}
                                    alt={`${product.name} thumbnail ${index + 1}`}
                                    className={`w-20 h-20 object-cover rounded-md cursor-pointer border-2 ${mainImage === imgUrl ? 'border-blue-500' : 'border-transparent'} hover:border-blue-500 transition-colors duration-200`}
                                    onClick={() => handleThumbnailClick(imgUrl)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className="md:w-1/2 p-4">
                    <p className="text-gray-700 text-3xl font-bold mb-4">
                        {product.currency} {product.price?.toFixed(2)}
                    </p>

                    <div className="mb-4 flex items-center">
                        <span className="font-semibold text-gray-700 mr-2">Rating:</span>
                        {renderRatingStars(displayRating)}
                        <span className="ml-2 text-gray-600">({displayRating.toFixed(1)} / 5)</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">Based on {displayTotalReviews} reviews</p>

                    <p className="text-gray-600 text-lg mb-6 leading-relaxed">{product.description}</p>

                    {product.availableSizes && product.availableSizes.length > 0 && (
                        <div className="mb-4">
                            <span className="font-semibold text-gray-700 block mb-2">Select Size:</span>
                            <div className="flex flex-wrap gap-2">
                                {product.availableSizes.map((size, index) => (
                                    <button
                                        key={index}
                                        className={`px-4 py-2 rounded-lg border-2 ${selectedSize === size ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-100 text-gray-800 border-gray-300 hover:border-blue-400'
                                            } transition-colors duration-200`}
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                            {!selectedSize && (
                                <p className="text-red-500 text-sm mt-1">Please select a size.</p>
                            )}
                        </div>
                    )}

                    {product.availableColors && product.availableColors.length > 0 && (
                        <div className="mb-6">
                            <span className="font-semibold text-gray-700 block mb-2">Select Color:</span>
                            <div className="flex flex-wrap gap-2">
                                {product.availableColors.map((color, index) => (
                                    <button
                                        key={index}
                                        className={`w-10 h-10 rounded-full border-2 ${selectedColor === color ? 'ring-2 ring-blue-500 ring-offset-2' : 'border-gray-300'
                                            } focus:outline-none transition-all duration-200 flex items-center justify-center`}
                                        style={{ backgroundColor: color.toLowerCase() }}
                                        onClick={() => setSelectedColor(color)}
                                        title={color}
                                    >
                                        {selectedColor === color && (
                                            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </button>
                                ))}
                            </div>
                            {!selectedColor && (
                                <p className="text-red-500 text-sm mt-1">Please select a color.</p>
                            )}
                        </div>
                    )}

                    <div className="mb-8">
                        <span className="font-semibold text-gray-700 block mb-2">Quantity:</span>
                        <div className="flex items-center space-x-2">
                            <button
                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-lg font-semibold hover:bg-gray-300 transition-colors duration-200"
                                onClick={() => handleQuantityChange('decrement')}
                                disabled={quantity <= 1}
                            >
                                -
                            </button>
                            <input
                                type="number"
                                value={quantity}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value);
                                    if (!isNaN(val) && val >= 1) {
                                        setQuantity(Math.min(val, product.stockQuantity || 99));
                                    } else if (e.target.value === '') {
                                        setQuantity('');
                                    }
                                }}
                                onBlur={() => {
                                    if (quantity === '' || quantity < 1) {
                                        setQuantity(1);
                                    }
                                }}
                                className="w-20 text-center border-gray-300 rounded-lg shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                min="1"
                                max={product.stockQuantity || 99}
                            />
                            <button
                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-lg font-semibold hover:bg-gray-300 transition-colors duration-200"
                                onClick={() => handleQuantityChange('increment')}
                                disabled={quantity >= (product.stockQuantity || 99)}
                            >
                                +
                            </button>
                        </div>
                        {product.stockQuantity !== undefined && product.stockQuantity < 10 && product.stockQuantity > 0 && (
                            <p className="text-orange-500 text-sm mt-1">Only {product.stockQuantity} left in stock!</p>
                        )}
                        {product.stockQuantity === 0 && (
                            <p className="text-red-500 text-sm mt-1">Currently Out of Stock.</p>
                        )}
                    </div>

                    <div className="mt-8 flex justify-center">
                        <button
                            onClick={handleAddToCartClick}
                            className="bg-blue-600 text-white px-8 py-4 rounded-lg text-xl font-semibold hover:bg-blue-700 transition duration-300 ease-in-out shadow-lg transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
                            disabled={
                                (cartLoading ||
                                product.status === 'out_of_stock' ||
                                product.stockQuantity === 0 ||
                                (product.availableSizes?.length > 0 && !selectedSize) ||
                                (product.availableColors?.length > 0 && !selectedColor))
                            }
                        >
                            {cartLoading ? 'Adding...' : (product.status !== 'out_of_stock' && product.stockQuantity > 0 ? 'Add to Cart' : 'Out of Stock')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewProduct;