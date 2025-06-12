// import React, { useState,useEffect } from 'react'
// import {Showcase} from "../../../Pages/Showcase/Showcase"
// import Overview from './Overview/Overview';
// import ServicesPage from './Service/Service';
// import  DoctorsContent  from './Doctors/DoctorsContent';
// import { BookTable } from './BookTable/BookTable';
// import { ReviewsContent } from './Reviews/ReviewsContent';
// import {Contact} from "./Reviews/Contact"
// import {useParams,useLocation} from "react-router-dom"
// import axios from "axios"
// export const Hospital = () => {
//   const [hospital,setHospital]=useState('');
//   const [activeNavLink, setActiveNavLink]=useState("Overview")
//   const defaultNavLinks = [
//     { label: 'Overview', id: 'overview' },
//     { label: 'Services', id: 'services' },
//     { label: 'Doctors', id: 'doctors' },
//     { label: 'Reviews', id: 'reviews' },
//     { label: 'Book Appointment', id: 'book' },
//     { label: 'Contact Us', id: 'contact_us' },
//   ];
//   const renderContent = () => {
//     switch (activeNavLink) {
//       case 'Overview':
//         return <Overview hospital={hospital}/>;
//       case 'Services':
//         return <ServicesPage hospital={hospital}/>;
//       case 'Doctors':
//         return <DoctorsContent />;
//       case 'Reviews':
//         return <ReviewsContent />;
//       case 'Book Appointment':
//         return <BookTable />;
//       case 'Contact Us':
//         return <Contact />;
//       default:
//         return <Overview />; // Fallback
//     }
//   };
//   const location=useLocation();
//   const url=new URLSearchParams(location.search);
//   const typeUrl=url.get('type');
//   console.log(typeUrl?.split("/"))
//   const Id=typeUrl?.split("/");
//   const HospitalId=Id[2];
//   useEffect(()=>{
//     const url=`${import.meta.env.VITE_SERVER_URL}/api/hospitals/${HospitalId}`
//     axios.get(url,{withCredentials:true})
//     .then((response)=>{
//       setHospital(response.data?.hospital)
//       console.log(response.data);
//     })
//     .catch((error)=>{
//       console.log(error);
//     })
//   },[HospitalId])

//   return (
//     <div >
//         <Showcase defaultNavLinks={defaultNavLinks} activeNavLink={activeNavLink} setActiveNavLink={setActiveNavLink} hospital={hospital}/>
//          <div className="content-area min-h-[500px] md:flex md:items-center md:justify-center"> {/* Added min-height for consistent layout */}
//           {renderContent()}
//         </div>
//     </div>
//   )
// }


import React, { useState, useEffect } from 'react';
import { Showcase } from "../../../Pages/Showcase/Showcase";
import Overview from './Overview/Overview';
import ServicesPage from './Service/Service';
import DoctorsContent from './Doctors/DoctorsContent';
import { BookTable } from './BookTable/BookTable';
import { ReviewsContent } from './Reviews/ReviewsContent';
import { Contact } from "./Reviews/Contact";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";

export const Hospital = () => {
  useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const typeUrl = urlParams.get('type');
  const IdParts = typeUrl?.split("/");
  const HospitalId = IdParts && IdParts.length > 2 ? IdParts[2] : null;
  const service3=IdParts && IdParts.length > 3 ? IdParts[3]:null;
  const getInitialActiveNavLink = () => {
    if (IdParts && IdParts.length > 3) {
      const urlSegment = IdParts[3];
      return urlSegment;
    }
    return "Overview";
  };
  const [hospital, setHospital] = useState(null);
  const [activeNavLink, setActiveNavLink] = useState(getInitialActiveNavLink);
  const defaultNavLinks = [
    { label: 'Overview', id: 'overview' },
    { label: 'Services', id: 'services' },
    { label: 'Doctors', id: 'doctors' },
    { label: 'Reviews', id: 'reviews' },
    { label: 'Book Appointment', id: 'book' },
    { label: 'Contact Us', id: 'contact_us' },
  ];
  useEffect(() => {
    if (HospitalId) {
      const url = `${import.meta.env.VITE_SERVER_URL}/api/hospitals/${HospitalId}`;
      axios.get(url, { withCredentials: true })
        .then((response) => {
          setHospital(response.data?.hospital);
          console.log("Hospital data fetched successfully:", response.data);
        })
        .catch((error) => {
          console.error("Error fetching hospital data:", error);
        });
    } else {
      console.log("Hospital ID not found in URL, skipping hospital data fetch.");
    }
  }, [HospitalId]);
  useEffect(()=>{
    setActiveNavLink(service3);
  },[service3])
  const renderContent = () => {
    switch (activeNavLink) {
      case 'Overview':
        return <Overview hospital={hospital} />;
      case 'Services':
        return <ServicesPage hospital={hospital} />;
      case 'Doctors':
        return <DoctorsContent hospitalId={HospitalId} />;
      case 'Reviews':
        return <ReviewsContent />;
      case 'Book Appointment':
        return <BookTable />;
      case 'Contact Us':
        return <Contact />;
      default:
        return <Overview hospital={hospital} />;
    }
  };

  return (
    <div>
      <Showcase
        defaultNavLinks={defaultNavLinks}
        activeNavLink={activeNavLink}
        setActiveNavLink={setActiveNavLink}
        hospital={hospital}
      />
      {/* Content area for displaying different sections (Overview, Doctors, etc.) */}
      <div className="relative content-area min-h-[500px] md:flex md:items-center md:justify-center">
        {renderContent()}
      </div>
    </div>
  );
};
