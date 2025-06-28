import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const PopularProductCard = ({ product, onAddToCart, mall }) => {
    const location = useLocation();
    const [imageLoaded, setImageLoaded] = useState(false);
    const url = new URLSearchParams(location.search);
    const type = url.get("type");
    const mail = type?.split("/");
    const fst = mail[0];
    const sec = mail[1];
    const mailId = mail.length >= 2 ? mail[2] : null;
    const service3 = mail.length >= 3 ? mail[3] : null;

    useEffect(() => {
        setImageLoaded(false);
        if (product && product.images && product.images[0]) {
            const img = new Image();
            img.src = product.images[0];
            img.onload = () => setImageLoaded(true);
            img.onerror = () => setImageLoaded(true);
        } else {
            setImageLoaded(true);
        }
    }, [product]);

    const handleAddToCartClick = () => {
        if (onAddToCart && product) {
            onAddToCart(product);
        }
    };

    const handleOffer = (id) => {
        const offers = mall.offer;
        const check = offers.find((item) => item.applicable === id && item.active === true);
        return check;
    }

    const generateStatusBadge = (status) => {
        let bgColorClass = 'bg-gray-400';
        let textColorClass = 'text-white';

        switch (status) {
            case 'active':
                bgColorClass = 'bg-green-600';
                break;
            case 'out_of_stock':
                bgColorClass = 'bg-red-600';
                break;
            case 'inactive':
                bgColorClass = 'bg-orange-500';
                break;
            default:
                bgColorClass = 'bg-gray-500';
                break;
        }
        return (
            <span
                className={`inline-flex items-center justify-center px-2 rounded-full text-sm font-semibold ${bgColorClass} ${textColorClass} transition-colors duration-200`}
            >
                {status.replace(/_/g, ' ')}
            </span>
        );
    }

    const activeOffer = handleOffer(product?._id);

    return (
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200 flex flex-col h-full">
            <Link to={`/showcase/page?type=${fst}/${sec}/${mailId}/viewProduct/product?=${product?._id}`}>
                <div className="relative w-full" style={{ paddingBottom: '75%' }}>
                    {activeOffer && (
                        <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full z-6 shadow-sm font-['Inter'] z-10">
                            Offer Available
                        </span>
                    )}
                    {!imageLoaded && (
                        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-t-xl"></div>
                    )}
                    <img
                        src={product?.images[0] || "https://placehold.co/400x300/e0e0e0/5a5a5a?text=No+Image"}
                        alt={product?.name || "Product image"}
                        className={`absolute inset-0 w-full h-full object-cover rounded-t-xl ${imageLoaded ? '' : 'hidden'}`}
                        loading="lazy"
                        onLoad={() => setImageLoaded(true)}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://placehold.co/400x300/e0e0e0/5a5a5a?text=Image+Error";
                            setImageLoaded(true);
                        }}
                    />
                </div>

                <div className="p-4 flex flex-col flex-grow">
                    {product?.brand && (
                        <p className="text-xs text-gray-500 font-medium mb-1 uppercase">{product.brand}</p>
                    )}
                    <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight truncate" title={product?.name}>
                        {product?.name || "Unknown Product"}
                    </h3>
                    {product?.description && (
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                            {product.description}
                        </p>
                    )}
                    {product?.status && (
                        <p className="flex items-center">
                            <span className="font-semibold text-gray-700 mr-2">Status:</span>
                            {generateStatusBadge(product.status)}
                        </p>
                    )}

                    <div className="flex items-center justify-between mt-auto pt-2">
                        <p className="text-xl font-bold text-blue-600">
                            {product?.currency} {product?.price ? product.price.toFixed(2) : 'N/A'}
                        </p>

                        <button
                            onClick={handleAddToCartClick}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200 flex items-center justify-center space-x-2"
                            disabled={product?.stockQuantity === 0 || product?.status === 'out_of_stock'}
                        >
                            {product?.stockQuantity === 0 || product?.status === 'out_of_stock' ? (
                                <span>Out of Stock</span>
                            ) : (
                                <>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.378 5.513a.998.998 0 00.858.75L15 12V6a1 1 0 00-1-1h-1.22l-.305-1.222A.997.997 0 0012.44 2H8.56a.997.997 0 00-.97.778L7.28 5H6a1 1 0 00-1 1v6a1 1 0 001 1h7a1 1 0 001-1v-1.22l.305-1.222a.997.997 0 00.01-.042l1.378-5.513a.998.998 0 00.858-.75L19 1a1 1 0 00-1-1H2zM7 16a2 2 0 11-4 0 2 2 0 014 0zM17 16a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <span>Add to Cart</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default PopularProductCard;