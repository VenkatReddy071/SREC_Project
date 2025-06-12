import React from "react";
import { Header } from "./Header";
import { Button } from "./Button";
import {useEffect} from "react"
import HeaderImg1 from "../../../assets/hospitalheader2.jpg"
import Family from "../../../assets/Family.jpg"
import HealthcareSection from "./HealthCareSection";
import { HospitalsSection } from "./HospitalsSection";
import { Appointments } from "./Appointments";
export const Home = () => {
  useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
  return (
    <div>
      {/* Header */}
      <Header />

      {/* Content Section */}
      <div className="md:flex md:items-center md:gap-10 md:px-8 md:py-6 p-6">
        {/* Left Section */}
        <div className="md:w-1/2 p-2 w-full">
          <h1 className="md:text-3xl text-2xl font-bold">
            Discover Top Hospitals and Expert Doctors Right At Your Fingertips
          </h1>
        </div>

        {/* Right Section */}
        <div className="md:w-1/2 w-full md:p-4 p-2" >
          <p className="text-lg leading-relaxed">
            Our Hospitals section connects you with qualified medical
            professionals tailored to your needs. Easily search for doctors by
            specialization and location, ensuring you find the right care.
            Ready to take the next step? <span className="font-semibold">Explore more</span> to book your
            appointment today!
          </p>
        </div>
        
      </div>
      <div className="md:w-full md:h-96  w-full p-4   ">
            <img
                src={HeaderImg1}
                alt="Background"
                className="w-full h-full object-cover"
            />
      
      </div>
        <HealthcareSection/>
    {/*Join Community*/}
        <div className="md:flex  md:gap-10 p-4 md:m-0 -mt-8">
        <div className="md:w-1/2  w-full md:p-10 md:m-6 ">
            <h1 className="p-2 font-bold text-3xl">Join our Healthcare Community Today</h1>
            <p className="p-2 text-sm">Discover a top doctors and book appointments easily for all your healthcare needs</p>
            <div className="flex gap-1 items-center border border-gray-400 rounded">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-3/4 p-2 text-sm focus:outline-none"
            />
            <button className="bg-black text-white px-2 py-2 w-60">Subscribe</button>
          </div>
          <p className="p-2 text-sm">By clicking Get started,you agree to our Terms and Conditions</p>
        </div>
        <div className="md:w-1/2 w-full md:p-2 m-1">
            <img src={Family} alt=""  className="w-full h-80"/>
        </div>
        <div>
            
        </div>
        </div>
        <HospitalsSection/>
        <Appointments/>
    </div>
  );
};
