import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import ProductDetails from "./ProductDetails";

const ProductCardSkeleton = () => (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col h-full animate-pulse overflow-hidden">
        <div className="relative w-full" style={{ paddingBottom: '75%' }}>
            <div className="absolute inset-0 bg-gray-200 rounded-t-xl"></div>
        </div>
        <div className="p-4 flex flex-col flex-grow">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-1"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="flex items-center justify-between mt-auto pt-2">
                <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                <div className="h-10 bg-gray-200 rounded-lg w-2/5"></div>
            </div>
        </div>
    </div>
);

const ProductListings = ({ mallId,mall }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cartMessage, setCartMessage] = useState(null);

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const observerRef = useRef(null);
    const bottomReachedRef = useRef(false);

    const PRODUCTS_PER_PAGE = 8;

    const handleAddToCart = useCallback((productToAdd) => {
        console.log('Adding to cart:', productToAdd.name);
        setCartMessage(`"${productToAdd.name}" has been added to your cart.`);
        const timer = setTimeout(() => setCartMessage(null), 3000);
        return () => clearTimeout(timer);
    }, []);

    const fetchProducts = useCallback(async (pageNum) => {
        setLoading(true);
        setError(null);

        if (!mallId) {
            setError("No mall ID provided to fetch products.");
            setLoading(false);
            return;
        }

        try {
            const url = `${import.meta.env.VITE_SERVER_URL}/api/product/by-mall/${mallId}`;
            const response = await axios.get(url, {
                withCredentials: true,
                params: {
                    page: pageNum,
                    limit: PRODUCTS_PER_PAGE
                }
            });

            const newProducts = response.data?.products || [];
            console.log("Fetched page:", pageNum, "Products:", newProducts);

            if (pageNum === 1) {
                setProducts(newProducts);
            } else {
                setProducts(prevProducts => [...prevProducts, ...newProducts]);
            }

            setHasMore(newProducts.length === PRODUCTS_PER_PAGE);

        } catch (err) {
            console.error("Error while fetching products:", err);
            setError(err.response?.data?.message || "Failed to load products. Please try again later.");
            setHasMore(false);
        } finally {
            setLoading(false);
            bottomReachedRef.current = false;
        }
    }, [mallId, PRODUCTS_PER_PAGE]);

    useEffect(() => {
        setProducts([]);
        setPage(1);
        setHasMore(true);
        fetchProducts(1);
    }, [mallId, fetchProducts]);

    useEffect(() => {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            const [entry] = entries;
            if (entry.isIntersecting && !loading && hasMore && !bottomReachedRef.current) {
                console.log("Bottom reached, fetching next page...");
                bottomReachedRef.current = true;
                setPage(prevPage => prevPage + 1);
            }
        }, options);

        if (observerRef.current) {
            observer.observe(observerRef.current);
        }

        return () => {
            if (observerRef.current) {
                observer.unobserve(observerRef.current);
            }
        };
    }, [loading, hasMore]);

    useEffect(() => {
        if (page > 1) {
            fetchProducts(page);
        }
    }, [page, fetchProducts]);

    return (
        <div className="container mx-auto px-4 py-8 font-inter">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center leading-tight">
                Explore Our Curated Products
            </h1>

            {cartMessage && (
                <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-xl animate-fade-in-up z-50">
                    {cartMessage}
                </div>
            )}

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-8" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.length === 0 && loading ? (
                    [...Array(PRODUCTS_PER_PAGE)].map((_, index) => (
                        <ProductCardSkeleton key={index} />
                    ))
                ) : (
                    products.map((product) => (
                        <ProductDetails key={product._id} product={product} onAddToCart={handleAddToCart} mall={mall}/>
                    ))
                )}
            </div>

            {hasMore && !error && (
                <div ref={observerRef} className="text-center py-4">
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(PRODUCTS_PER_PAGE)].map((_, index) => (
                                <ProductCardSkeleton key={`loading-${index}`} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">Loading more products...</p>
                    )}
                </div>
            )}

            {!hasMore && !loading && products.length > 0 && !error && (
                <div className="text-center py-8 text-gray-600">
                    <p>You've reached the end of the product list!</p>
                </div>
            )}

            {!loading && products.length === 0 && !error && (
                <div className="text-center py-12">
                    <p className="text-gray-600 text-lg">No products found for this mall. Check back soon!</p>
                </div>
            )}
        </div>
    );
};

export default ProductListings;