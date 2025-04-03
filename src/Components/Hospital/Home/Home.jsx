import React from "react";
import { Header } from "./Header";
import { Button } from "./Button";
import HeaderImg from "../../../assets/Header.jpg"
import HealthcareSection from "./HealthCareSection";
import { HospitalsSection } from "./HospitalsSection";
import { Appointments } from "./Appointments";
export const Home = () => {
  return (
    <div>
      {/* Header */}
      <Header />

      {/* Content Section */}
      <div className="flex items-center gap-10 px-8 py-6">
        {/* Left Section */}
        <div className="w-1/2 p-4">
          <h1 className="text-3xl font-bold">
            Discover Top Hospitals and Expert Doctors Right At Your Fingertips
          </h1>
        </div>

        {/* Right Section */}
        <div className="w-1/2 p-4">
          <p className="text-lg leading-relaxed">
            Our Hospitals section connects you with qualified medical
            professionals tailored to your needs. Easily search for doctors by
            specialization and location, ensuring you find the right care.
            Ready to take the next step? <span className="font-semibold">Explore more</span> to book your
            appointment today!
          </p>
        </div>
        
      </div>
      <div className="w-full h-96 p-4 relative">
            <img
                src="/path-to-your-image.jpg"
                alt="Background"
                className="w-full h-full object-cover"
            />
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>
        <HealthcareSection/>
    {/*Join Community*/}
        <div className="flex gap-10 p-4 ">
        <div className="w-1/2 p-10 m-6 ">
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
        <div className="w-1/2 p-2 m-1">
            <img src={HeaderImg} alt=""  className="w-full h-80"/>
        </div>
        <div>
            
        </div>
        </div>
        <HospitalsSection/>
        <Appointments/>
    </div>
  );
};
