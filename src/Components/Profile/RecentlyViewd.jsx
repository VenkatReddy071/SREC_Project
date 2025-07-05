import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { FaRegClock, FaStar, FaMapMarkerAlt, FaLink } from 'react-icons/fa';

const ITEMS_PER_LOAD = 10;

const RecentlyViewed = () => {
    const navigate = useNavigate();
    const [viewedItems, setViewedItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);

    const SERVER_URL = import.meta.env.VITE_SERVER_URL;

    const observer = useRef();
    const lastItemElementRef = useCallback(
        (node) => {
            if (isLoading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setCurrentPage((prevPage) => prevPage + 1);
                }
            });
            if (node) observer.current.observe(node);
        },
        [isLoading, hasMore]
    );

    const fetchViewedItems = useCallback(async (page) => {
        setIsLoading(true);
        try {
            const response = await Axios.get(
                `${SERVER_URL}/api/view/details?page=${page}&limit=${ITEMS_PER_LOAD}`,
                {
                    withCredentials: true,
                }
            );

            const { data: fetchedItems, hasMore: fetchedHasMore } = response.data;

            if (page === 1) {
                setViewedItems(fetchedItems);
            } else {
                setViewedItems((prevItems) => [...prevItems, ...fetchedItems]);
            }

            setHasMore(fetchedHasMore);
        } catch (error) {
            console.error("Error fetching recently viewed items:", error);
            if (error.response && error.response.status === 401) {
                navigate('/login');
            }
            setHasMore(false);
        } finally {
            setIsLoading(false);
            setInitialLoad(false);
        }
    }, [SERVER_URL, navigate]);

    useEffect(() => {
        fetchViewedItems(currentPage);
    }, [currentPage, fetchViewedItems]);

    const formatViewedAt = (dateStr) => {
        if (!dateStr || isNaN(new Date(dateStr).getTime())) {
            return "N/A";
        }
        return new Date(dateStr).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const getDetailsLink = (item) => {
        let nameSlug;
        let typeSlug;
        let id = item._id;

        if (item.modelView === "Hospital") {
            nameSlug = item.name || 'hospital';
            typeSlug = 'hospital';
            return `/showcase/page?type=${typeSlug}/${nameSlug}/${id}/Overview`;
        } else if (item.modelView === "Restaurant") {
            nameSlug = item.name
            typeSlug = 'restaurant';
            return `/showcase/page?type=${typeSlug}/${nameSlug}/${id}/Overview`;
        } else if (item.modelView === "Mall") {
            nameSlug = item.name
            typeSlug = 'mall';
            return `/showcase/page?type=${typeSlug}/${nameSlug}/${id}/Overview`;
        } else if (item.modelView === "Education") {
            nameSlug = item.name
            typeSlug = item.institutionType
            return `/showcase/page?type=${typeSlug}/${nameSlug}/${id}/Overview`;
        }
        return '#';
    };

    return (
        <div className="w-full mx-auto px-4 bg-gray-50 min-h-screen py-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center border-b pb-4">Your Recently Viewed</h1>

            {initialLoad && isLoading ? (
                <div className="text-center py-10 text-xl font-semibold text-gray-700 animate-pulse flex items-center justify-center">
                    <FaRegClock className="mr-2 animate-spin w-6 h-6" /> Fetching your recently viewed items...
                </div>
            ) : viewedItems.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                        {viewedItems.map((item, index) => {
                            const isLastItem = viewedItems.length === index + 1;
                            const mainImageUrl = item.image || item.mainImage || "https://placehold.co/400x250/f0f9ff/00796b?text=No+Image";

                            let locationDisplay = "N/A";
                            if (item.modelView === "Hospital" || item.modelView === "Restaurant" || item.modelView === "Mall") {
                                if (item.address) {
                                    if (typeof item.address === 'object') {
                                        locationDisplay = `${item.address.street || ''}, ${item.address.city || ''}, ${item.address.state || ''} - ${item.address.zipCode || ''}`.replace(/,\s*-\s*$/, '');
                                    } else {
                                        locationDisplay = item.address;
                                    }
                                }
                            } else if (item.modelView === "Education") {
                                locationDisplay = item.location || "N/A";
                            }


                            return (
                                <div
                                    key={`${item._id}-${item.viewedAt}`}
                                    ref={isLastItem ? lastItemElementRef : null}
                                    className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group"
                                >
                                    <div className="relative">
                                        <img
                                            src={mainImageUrl}
                                            alt={item.name || item.modelView}
                                            className="w-full h-48 object-cover rounded-t-xl group-hover:scale-105 transition-transform duration-300"
                                            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x250/f0f9ff/00796b?text=No+Image"; }}
                                        />
                                        <span className="absolute top-2 left-2 bg-teal-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-md">
                                            {item.modelView}
                                        </span>
                                        {item.rating && (
                                            <span className="absolute bottom-2 right-2 bg-yellow-400 text-gray-900 text-sm font-bold px-2 py-1 rounded-full flex items-center shadow-md">
                                                <FaStar className="w-3 h-3 mr-1" /> {item.rating.toFixed(1)}
                                            </span>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-xl font-bold text-gray-800 mb-2 leading-tight">
                                            {item.name || "N/A"}
                                        </h3>
                                        {locationDisplay !== "N/A" && (
                                            <p className="text-sm text-gray-600 mb-2 flex items-center">
                                                <FaMapMarkerAlt className="mr-2 text-red-500" />
                                                {locationDisplay}
                                            </p>
                                        )}
                                        <p className="text-xs text-gray-500 mb-4 flex items-center">
                                            <FaRegClock className="mr-2" /> Viewed: {formatViewedAt(item.viewedAt)}
                                        </p>
                                        <div className="flex justify-end mt-4">
                                            <a
                                                href={getDetailsLink(item)}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(getDetailsLink(item));
                                                }}
                                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-md"
                                            >
                                                <FaLink className="mr-2" /> View Details
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {isLoading && (
                        <div className="text-center py-4 text-gray-500 flex items-center justify-center">
                            <FaRegClock className="mr-2 animate-spin w-5 h-5" /> Loading more items...
                        </div>
                    )}
                    {!hasMore && !isLoading && viewedItems.length > 0 && (
                        <div className="text-center py-4 text-gray-500">You've seen all your recently viewed items.</div>
                    )}
                </>
            ) : (
                <div className="py-10 text-center text-gray-600 text-lg">
                    No recently viewed items found. Start exploring!
                </div>
            )}
        </div>
    );
};

RecentlyViewed.propTypes = {

};

export default RecentlyViewed;