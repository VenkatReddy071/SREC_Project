import React, { useState,useEffect } from 'react'
import {Showcase} from "../../../Pages/Showcase/Showcase"
import Overview from './Overview/Overview';
import ServicesPage from './Service/Service';
import  DoctorsContent  from './Doctors/DoctorsContent';
import { BookTable } from './BookTable/BookTable';
import { ReviewsContent } from './Reviews/ReviewsContent';
import {Contact} from "./Reviews/Contact"
import {useParams,useLocation} from "react-router-dom"
import axios from "axios"
export const Hospital = () => {
  const [hospital,setHospital]=useState('');
  const [activeNavLink, setActiveNavLink]=useState("overview")
  const defaultNavLinks = [
    { label: 'Overview', id: 'overview' },
    { label: 'Services', id: 'services' },
    { label: 'Doctors', id: 'doctors' },
    { label: 'Reviews', id: 'reviews' },
    { label: 'Book Appointment', id: 'book' },
    { label: 'Contact Us', id: 'contact_us' },
  ];
  const renderContent = () => {
    switch (activeNavLink) {
      case 'overview':
        return <Overview hospital={hospital}/>;
      case 'services':
        return <ServicesPage hospital={hospital}/>;
      case 'doctors':
        return <DoctorsContent />;
      case 'reviews':
        return <ReviewsContent />;
      case 'book':
        return <BookTable />;
      case 'contact_us':
        return <Contact />;
      default:
        return <Overview />; // Fallback
    }
  };
  const location=useLocation();
  const url=new URLSearchParams(location.search);
  const typeUrl=url.get('type');
  console.log(typeUrl?.split("/"))
  const Id=typeUrl?.split("/");
  const HospitalId=Id[2];
  console.log(HospitalId);
  useEffect(()=>{
    const url=`${import.meta.env.VITE_SERVER_URL}/api/hospitals/${HospitalId}`
    axios.get(url,{withCredentials:true})
    .then((response)=>{
      setHospital(response.data?.hospital)
      console.log(response.data);
    })
    .catch((error)=>{
      console.log(error);
    })
  },[HospitalId])

  return (
    <div >
        <Showcase defaultNavLinks={defaultNavLinks} activeNavLink={activeNavLink} setActiveNavLink={setActiveNavLink} hospital={hospital}/>
         <div className="content-area min-h-[500px] md:flex md:items-center md:justify-center"> {/* Added min-height for consistent layout */}
          {renderContent()}
        </div>
    </div>
  )
}
