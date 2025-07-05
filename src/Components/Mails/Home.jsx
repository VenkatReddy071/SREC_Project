import React from 'react'
import Header from "./Header"
import Partner from "../../assets/part.avif"
import {MallsSection} from "./MallSection"
export const MailHome = () => {
  return (
    <div className="">
      <Header/>
      <MallsSection/>
      {/* Partner With Us Section */}
            <section className="py-16 bg-blue-600 -mr-1 text-white" id="partner-with-us">
              <div className="max-w-6xl mx-auto px-4 md:px-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                  <div className="md:w-1/2 text-center md:text-left">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                      Partner With Us: Grow Your Business
                    </h2>
                    <p className="text-lg md:text-xl mb-8">
                      Are you a mall owner, a brand, or a business looking to expand your reach?
                      Collaborate with us to showcase your offerings to a diverse and engaged audience.
                      We provide a platform for malls with online shopping capabilities, exclusive offers,
                      and enhanced visibility.
                    </p>
                    <button className="px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-lg shadow-lg hover:bg-blue-100 transition duration-300">
                      Join Our Network Today!
                    </button>
                  </div>
                  <div className="md:w-1/2">
                    <img
                      src={Partner}
                      alt="Partner with Us"
                      className="w-full h-72 object-cover rounded-lg shadow-lg"
                    />
                  </div>
                </div>
              </div>
            </section>
    </div>
  )
}
