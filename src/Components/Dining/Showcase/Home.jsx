import React, { useState, useEffect } from 'react';
import { Showcase } from "../../../Pages/Showcase/Showcase";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import {RestaurantOverview} from "./Overview"
import {MenuItems} from "./MenuItems"
import {toast} from "react-toastify"
import TableBooking from "./TableBooking"
export const Restaurant = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const typeUrl = urlParams.get('type');
  const IdParts = typeUrl?.split("/");
  const restaurantId = IdParts && IdParts.length > 2 ? IdParts[2] : null;
  const service3 = IdParts && IdParts.length > 3 ? IdParts[3] : null;

  const getInitialActiveNavLink = () => {
    if (IdParts && IdParts.length > 3) {
      const urlSegment = IdParts[3];
      return urlSegment;
    }
    return "Overview";
  };

  const [restaurant, setRestaurant] = useState(null);
  const [navLinks, setNavLinks] = useState([
    { label: 'Overview', id: 'Overview' },
    { label: 'MenuItems', id: 'menu' },
    { label: 'Reviews', id: 'reviews' },
    { label: 'Gallery', id: 'gallery' },
  ]);
  const [activeNavLink, setActiveNavLink] = useState(getInitialActiveNavLink);

  useEffect(() => {
    if (restaurantId) {
      const url = `${import.meta.env.VITE_SERVER_URL}/api/restaurant/${restaurantId}`;
      axios.get(url, { withCredentials: true })
        .then((response) => {
          setRestaurant(response.data?.data?.restaurant);
          console.log("Restaurant data fetched successfully:", response.data);
        })
        .catch((error) => {
          console.error("Error fetching Restaurant data:", error);
        });
    } else {
      console.log("Restaurant ID not found in URL, skipping restaurant data fetch.");
    }
  }, [restaurantId]);


  useEffect(()=>{
    const addView=async()=>{
      try{
      const response=await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/add/view`,{view:restaurantId,modelView:"Restaurant"},{withCredentials:true});
      if(response.status===200){
      }
      else{
        toast.error(response.data?.message);
      }
    }
    catch(error){
      console.log(error);
    } 
    }

    addView();
  },[restaurantId])
  useEffect(() => {
    if (restaurant) {
      setNavLinks(prevLinks => {
        const hasBookATable = prevLinks.some(link => link.id === 'book');
        const canBookTable = restaurant.seatingAvailability && restaurant.seatingAvailability.length > 0;

        if (canBookTable && !hasBookATable) {
          return [...prevLinks, { label: 'Book a Table', id: 'book' }];
        }
        return prevLinks;
      });
    }
  }, [restaurant]);

  useEffect(() => {
    if (service3) {
      const formattedService3 = service3.charAt(0).toUpperCase() + service3.slice(1);
      setActiveNavLink(formattedService3);
    } else {
      setActiveNavLink('Overview');
    }
  }, [service3]);

  const renderContent = () => {
    switch (activeNavLink) {
      case 'Overview':
        return <RestaurantOverview restaurant={restaurant} />;
      case 'MenuItems':
        return <MenuItems restaurant={restaurant} /> ;
      case 'Reviews':
        return <p className="p-8 text-center text-gray-700">Reviews Content for {restaurant?.name}</p>;
      case 'Gallery':
        return <p className="p-8 text-center text-gray-700">Gallery Content for {restaurant?.name}</p>;
      case 'Book a Table':
        return <TableBooking restaurantId={restaurantId}/>
      default:
        return <RestaurantOverview restaurant={restaurant} />;
    }
  };

  return (
    <div>
      <Showcase
        defaultNavLinks={navLinks}
        activeNavLink={activeNavLink}
        setActiveNavLink={setActiveNavLink}
        hospital={restaurant}
      />
      <div className="relative content-area min-h-[500px] md:flex md:items-center md:justify-center">
        {renderContent()}
      </div>
    </div>
  );
};
