

import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { Showcase } from "../../../Pages/Showcase/Showcase";
import { EducationalInstituteOverview} from "./Overview"
import Teacher from "./Teachers"
import {Contact} from "./Contact"
export const School = () => {
  useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const typeUrl = urlParams.get('type');
  const IdParts = typeUrl?.split("/");
  const schoolId= IdParts && IdParts.length > 2 ? IdParts[2] : null;
  const service3=IdParts && IdParts.length > 3 ? IdParts[3]:null;
  const getInitialActiveNavLink = () => {
    if (IdParts && IdParts.length > 3) {
      const urlSegment = IdParts[3];
      return urlSegment;
    }
    return "Overview";
  };
  const [school, setSchool] = useState(null);

  useEffect(()=>{
    const addView=async()=>{
      try{
      const response=await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/add/view`,{view:schoolId,modelView:"Education"},{withCredentials:true});
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
  },[schoolId])
  const [activeNavLink, setActiveNavLink] = useState(getInitialActiveNavLink);
  const defaultNavLinks = [
    { label: 'Overview', id: 'overview' },
    { label: 'Teachers', id: 'teachers' },
    { label: 'Reviews', id: 'reviews' },
    { label: 'Contact Us', id: 'contact_us' },
  ];
  const activityIconMap = {
        "Debate Club": "https://placehold.co/50x50/ADD8E6/000000?text=🗣️",
        "Science Fair": "https://placehold.co/50x50/90EE90/000000?text=🧪",
        "Sports Team": "https://placehold.co/50x50/FF6347/FFFFFF?text=🏀",
        "Music": "https://placehold.co/50x50/9370DB/FFFFFF?text=🎵",
        "Art": "https://placehold.co/50x50/FFD700/000000?text=🎨",
        "Coding Club": "https://placehold.co/50x50/007bff/FFFFFF?text=💻",
        "Robotics Society": "https://placehold.co/50x50/8A2BE2/FFFFFF?text=🤖",
        "Cultural Fest": "https://placehold.co/50x50/FF4500/FFFFFF?text=🎉",
        "Drama Society": "https://placehold.co/50x50/DDA0DD/FFFFFF?text=🎭",
        "default": "https://placehold.co/50x50/CCCCCC/666666?text=✨"
    };
  useEffect(() => {
    if (schoolId) {
      const url = `${import.meta.env.VITE_SERVER_URL}/api/school/${schoolId}`;
      axios.get(url, { withCredentials: true })
        .then((response) => {
          setSchool(response.data);
          console.log("School data fetched successfully:", response.data);
        })
        .catch((error) => {
          console.error("School fetching hospital data:", error);
        });
    } else {
      console.log("School ID not found in URL, skipping hospital data fetch.");
    }
  }, [schoolId]);
  useEffect(()=>{
    setActiveNavLink(service3);
  },[service3])
  const renderContent = () => {
    switch(activeNavLink){
      case "Overview":
        return <EducationalInstituteOverview institute={school} activityIconMap={activityIconMap}/>
      case "Teachers":
        return <Teacher school={school}/>
      case "Contact Us":
        return <Contact hospital={school}/>;
      default:
        return <EducationalInstituteOverview  institute={school} activityIconMap={activityIconMap}/>
    }
  };

  return (
    <div>
      <Showcase
        defaultNavLinks={defaultNavLinks}
        activeNavLink={activeNavLink}
        setActiveNavLink={setActiveNavLink}
        hospital={school}
      />
     
      <div className="relative content-area min-h-[500px] md:flex md:items-center md:justify-center">
        {renderContent()}
      </div>
    </div>
  );
};
