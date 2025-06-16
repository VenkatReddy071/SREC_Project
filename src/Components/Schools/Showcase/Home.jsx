

import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { Showcase } from "../../../Pages/Showcase/Showcase";
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
  const [activeNavLink, setActiveNavLink] = useState(getInitialActiveNavLink);
  const defaultNavLinks = [
    { label: 'Overview', id: 'overview' },
    { label: 'Teachers', id: 'teachers' },
    { label: 'Reviews', id: 'reviews' },
    { label: 'Book Slot', id: 'book' },
    { label: 'Contact Us', id: 'contact_us' },
  ];
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
    // switch (activeNavLink) {
    //   case 'Overview':
    //     return <Overview hospital={hospital} />;
    //   case 'Services':
    //     return <ServicesPage hospital={hospital} />;
    //   case 'Doctors':
    //     return <DoctorsContent hospitalId={HospitalId} />;
    //   case 'Reviews':
    //     return <ReviewsContent />;
    //   case 'Book Appointment':
    //     return <BookTable />;
    //   case 'Contact Us':
    //     return <Contact />;
    //   default:
    //     return <Overview hospital={hospital} />;
    // }
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
