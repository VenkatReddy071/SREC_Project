// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { useLocation } from "react-router-dom";
// import axios from "axios";
// import FilterSidebar from "./FilterSidebar";
// import ProductCard from "./Product";

// export const MallType = () => {
//     const location = useLocation();
//     const queryParams = new URLSearchParams(location.search);

//     const [mallIdentifier] = queryParams.get('id')?.split("/"); // Renamed for clarity - this is either mallId or mallEmail
//     console.log(mallIdentifier)
//     const [products, setProducts] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [page, setPage] = useState(1);
//     const [hasMore, setHasMore] = useState(true); // Initial state should be true to allow first fetch
//     const productsPerPage = 30; // Matches your backend's default limit, but you can override via `limit` param

//     const [filters, setFilters] = useState({
//         category: '',
//         brand: '',
//         minPrice: '',
//         maxPrice: '',
//         gender: '', // Assuming gender is also a filterable field
//         searchTerm: '', // Added searchTerm filter for your backend
//         status: '' // Added status filter for your backend
//     });

//     const observer = useRef();

//     const lastProductElementRef = useCallback(node => {
//         if (loading) return; // Don't observe if already loading
//         if (observer.current) observer.current.disconnect(); // Disconnect previous observer if exists

//         observer.current = new IntersectionObserver(entries => {
//             if (entries[0].isIntersecting && hasMore) {
//                 setPage(prevPage => prevPage + 1); // Increment page to fetch next batch
//             }
//         }, {
//             threshold: 0.1 // Trigger when 10% of the target is visible
//         });

//         if (node) observer.current.observe(node); // Start observing the last product element
//     }, [loading, hasMore]); // Dependencies: only re-create if loading state or hasMore changes

//     const fetchProducts = async (pageNumber, currentFilters) => {
//         if (!mallIdentifier) {
//             setError("Mall Identifier (ID or Email) not found in URL.");
//             setLoading(false);
//             return;
//         }

//         setLoading(true);
//         setError(null);

//         try {
//             // Adjust API_URL to match your backend's `getProductsByMallEmail` endpoint
//             // Assuming `mallIdentifier` now contains the email.
//             // If your backend used ID, it would be `.../by-mall/:mallId`
//             const API_URL = `${import.meta.env.VITE_SERVER_URL}/api/product/by-mall/${mallIdentifier}`;

//             const response = await axios.get(API_URL, {
//                 params: {
//                     page: pageNumber,
//                     limit: productsPerPage,
//                     category: currentFilters.category,
//                     brand: currentFilters.brand,
//                     minPrice: currentFilters.minPrice,
//                     maxPrice: currentFilters.maxPrice,
//                     gender: currentFilters.gender, // Pass gender filter
//                     searchTerm: currentFilters.searchTerm, // Pass search term filter
//                     status: currentFilters.status // Pass status filter
//                 }
//             });

//             // Crucially, use the `products` array and `hasMore` boolean directly from the backend response
//             const newProducts = response.data?.products || [];
//             const backendHasMore = response.data?.hasMore || false; // Get `hasMore` from backend

//             if (pageNumber === 1) {
//                 setProducts(newProducts); // Replace for first page or filter change
//             } else {
//                 setProducts(prevProducts => [...prevProducts, ...newProducts]); // Append for infinite scroll
//             }

//             setHasMore(backendHasMore); // Use the hasMore value provided by the backend

//         } catch (err) {
//             console.error("Error fetching products:", err);
//             setError("Failed to load products. Please try again.");
//             setHasMore(false); // Stop trying to load more on error
//         } finally {
//             setLoading(false); // Set loading false after fetch completes
//         }
//     };

//     useEffect(() => {
//         setProducts([]);
//         setPage(1);
//         setHasMore(true); // Reset hasMore to true when filters/mallIdentifier change
//         fetchProducts(1, filters);
//     }, [mallIdentifier, filters]); // Re-run when mallIdentifier or filters change

//     const handleFilterChange = (newFilters) => {
//         setFilters(newFilters);
//     };

//     const clearFilters = () => {
//         setFilters({
//             category: '',
//             brand: '',
//             minPrice: '',
//             maxPrice: '',
//             gender: '',
//             searchTerm: '',
//             status: ''
//         });
//     };

//     if (error && !loading) {
//         return (
//             <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
//                 <div className="text-center p-8 text-red-600 bg-red-100 rounded-lg shadow-md max-w-lg">
//                     Error: {error}
//                 </div>
//             </div>
//         );
//     }

//     // Derive unique filter options from currently loaded products for dropdowns
//     // (Ensure you filter by product properties that are relevant)
//     const uniqueCategories = [...new Set(products?.map(p => p.category).filter(Boolean))];
//     const uniqueBrands = [...new Set(products?.map(p => p.brand).filter(Boolean))];
//     const uniqueGenders = [...new Set(products?.map(p => p.gender).filter(Boolean))]; // Assuming 'gender' exists in your product schema
//     const uniqueStatuses = ['active', 'inactive', 'out_of_stock']; // Assuming these are fixed options

//     return (
//         <div className="min-h-screen bg-gray-100 p-8">
//             <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
//                 <FilterSidebar
//                     filters={filters}
//                     onFilterChange={handleFilterChange}
//                     onClearFilters={clearFilters}
//                     uniqueCategories={uniqueCategories}
//                     uniqueBrands={uniqueBrands}
//                     uniqueGenders={uniqueGenders}
//                     uniqueStatuses={uniqueStatuses} // Pass unique statuses if you add a filter for it
//                 />

//                 <main className="flex-1 min-h-[500px]">
//                     {products.length === 0 && !loading && !error && (
//                         <div className="text-center p-8 text-purple-700 bg-purple-100 rounded-lg shadow-md">
//                             No products found matching your criteria.
//                         </div>
//                     )}
//                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//                         {products.map((product, index) => {
//                             // Attach the ref to the last product element only if `hasMore` is true.
//                             if (products.length === index + 1 && hasMore) {
//                                 return (
//                                     <div ref={lastProductElementRef} key={product._id}>
//                                         <ProductCard product={product} />
//                                     </div>
//                                 );
//                             } else {
//                                 return <ProductCard key={product._id} product={product} />;
//                             }
//                         })}
//                     </div>
//                     {loading && (
//                         <div className="text-center p-8 text-blue-600 bg-blue-100 rounded-lg shadow-md my-8 mx-auto max-w-lg">
//                             Loading more products...
//                         </div>
//                     )}
//                     {!hasMore && !loading && products.length > 0 && (
//                         <div className="text-center p-8 text-green-600 bg-green-100 rounded-lg shadow-md my-8 mx-auto max-w-lg">
//                             You've reached the end of the product list.
//                         </div>
//                     )}
//                 </main>
//             </div>
//         </div>
//     );
// };



import React,{useState,useEffect}from "react"
import { useLocation } from "react-router-dom"
import axios from "axios"
import {Showcase} from "../../../Pages/Showcase/Showcase"
import Overview from "./Overview"
const MallType=()=>{
    const [product,setProduct]=useState('');
    const location=useLocation();
    const url=new URLSearchParams(location.search);
    const type=url.get("type");
    console.log(type?.split("/"));
    const mail=type?.split("/");
    const mailId=mail.length >=2 ?mail[2]:null;
    const [mall,setMall]=useState('');
    const service3=mail.length >=3 ?mail[3]:null;
    useEffect(()=>{
        const url=`${import.meta.env.VITE_SERVER_URL}/api/malls/${mailId}`
        axios.get(url,{withCredentails:true})
        .then((response)=>{
            console.log(response.data);
            setMall(response.data?.mall);
        })
        .catch((error)=>{
            console.log(error);
            alert("error while fetching");
        })
        fetch();
    },[mailId])
    const fetch=()=>{
        const url=`${import.meta.env.VITE_SERVER_URL}/api/product/popular/:${mailId}`
        axios.get(url,{withCredentials:true})
        .then((response)=>{
            setProduct(response.data.product);
        })
        .catch((error)=>{
            console.log(response);
        })
    }
    const getInitialActiveNavLink = () => {
    if (mail && mail.length > 3) {
      const urlSegment = mail[3];
      return urlSegment;
    }
    return "Overview";
  };
  const [activeNavLink, setActiveNavLink] = useState(getInitialActiveNavLink);
  const defaultNavLinks = [
    { label: 'Overview', id: 'overview' },
    { label: 'Products', id: 'products' },
    { label: 'Reviews', id: 'reviews' },
    { label: 'Contact Us', id: 'contact_us' },
  ];
  useEffect(()=>{
    setActiveNavLink(service3);
  },[service3])

  const renderContent = () => {
      switch (activeNavLink) {
        case 'Overview':
          return <Overview mallData={mall} product={product}/>;
        default:
          return <Overview hospital={hospital} />;
      }
    };
    return(
          <div>
              <Showcase
                defaultNavLinks={defaultNavLinks}
                activeNavLink={activeNavLink}
                setActiveNavLink={setActiveNavLink}
                hospital={mall}
              />
              {/* Content area for displaying different sections (Overview, Doctors, etc.) */}
              <div className="relative content-area min-h-[500px] md:flex md:items-center md:justify-center">
                {renderContent()}
              </div>
            </div>
    )
}

export default MallType