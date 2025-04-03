import React from 'react'
import { Buttons } from '../UseButtons.jsx/Buttons'
import Header from "../../assets/Header.jpg"
import { Content } from './Content'
import { RiBox2Line } from "react-icons/ri";
import { IoIosArrowForward } from "react-icons/io";
export const Heading = () => {
    const content=[
        {   
            Sub:"",
            Heading:"Explore Our Comprehensive Schools & Colleges Section for Informed Decisions",
            Info:"discover detailed information about the local schools and colleges.From curriculum to admission Process,we provide everything you need to make informed choices",
            divBox:[
                {
                    Icon:<RiBox2Line />,
                    Heading:"Detailed Insights",
                    Info:"Access essential details likes fees,seat Availability,and contact information",

                },
                {
                    Icon:<RiBox2Line />,
                    Heading:"Get Started",
                    Info:"Visit our schools & Colleges section to learn more and explore options",
                    
                }

            ],
            Button:"Learn More",
            SubButton:`Visit `,
            Img:"",
            Reverse:false
        },
        {   
            Sub:"Health",
            Heading:"Explore Top Hospitals in Your Area",
            Info:"discover a range of hospitals with specialization services tailored to your needs.Easily find doctors,book appointments,and access essential healthcare information",
            divBox:[
                {
                    Icon:<RiBox2Line />,
                    Heading:"Find Doctors",
                    Info:"Search for quality doctors by specialization and location effortlessly",

                },
                {
                    Icon:<RiBox2Line />,
                    Heading:"Book Appointments",
                    Info:"Schedule your appointments with just a few clicks",
                    
                }

            ],
            Button:"Learn More",
            SubButton:`Visit`,
            Img:"",
            Reverse:false
        },
        {   
            Sub:"",
            Heading:"Discover local Dining:Explore the Best Restaurants in Your Area ",
            Info:"indulge in a culinary adventure with our curated list of local restaurants.From cozy cafes to fine dining.find the perfect to satisfy your cravings.",
            divBox:"",
            Button:"",
            SubButton:"",
            Img:"",
            Reverse:true
        },
        {   
            Sub:"",
            Heading:"Discover the best shopping malls near you with exclusive offers and promotions. ",
            Info:" explore a wide range of stores from fashion to electronics in our shopping malls section.Find the latest deals and plan your visit today!",
            divBox:"",
            Button:"",
            SubButton:"",
            Img:"",
            Reverse:false
        },
        {   
            Sub:"Travel",
            Heading:"Explore Local Travelling Facilities With Ease.",
            Info:"Discover a verify of transportation options available at your fingerprints.From buses to rental services,we make your travel planning effortless. ",
            divBox:"",
            Button:"Learn More",
            SubButton:"Sign up",
            Img:"",
            Reverse:false
        },
          
        
        
    

    ]
    
    const divBox=[
            {
                Icon:<RiBox2Line />,
                Heading:"Comprehensive Information at Your Disposal",
                Info:"Access detailed insights about schools,doctors and more.",

            },
            {
                Icon:<RiBox2Line />,
                Heading:"Quick and Easy Booking Options Available",
                Info:"Schedule appointments and make reservations effortlessly",
                
            },
            {
                Icon:<RiBox2Line />,
                Heading:"User-Friendly Design for All Devices",
                Info:"Enjoy a responsive layout that adapts in your needs",
                
            }

        ]
    
  return (
    <div>
        <div className="content">
            <div className=' md:flex md:gap-10 md:p-3 m-4'>
                <div className="div md:w-1/2 p-2 w-full">
                    <h1 className='md:text-5xl text-4xl font-bold'>Discover Local Services at Your Fingertips</h1>
                </div>
                <div className="div md:w-1/2 p-2 w-full ">
                    <div className="text">
                        <p>Explore a wide range of local services tailored to your needs.From schools to restaurants,find everything you need in one place</p>
                    </div>
                    <div className='md:mt-10'>
                    <Buttons label1={"Explore"} label2={"Learn More"} reverse={true}/>
                    </div>
                    
                </div>
            </div>
        </div>
        <div className="div md:m-[20px] md:p-8 m-auto">
            <img src={Header} alt="" className="w-full h-auto" />
        </div>
        {
            content.map((item,index)=>(
                <Content key={index} item={item} reverse={false}/>
            ))
        }
        <div className="md:flex md:items-center md:justify-center w-full">
            <div className="text-center md:w-[700px] w-full">
                <h4 className="text-xl font-semibold">Explore</h4>
                <h1 className="md:text-5xl text-3xl font-bold mb-4">Discover Local Services at Your Fingertips</h1>
                <p className="text-lg">
                    Our platform offers seamless navigation to connect you with essential local
                    services. From hospitals to restaurants, find everything you need in one place.
                </p>
            </div>
        </div>
        <div className="p-4 rounded-md md:flex  gap-4 ">
        {divBox.map((box, index) => (
            <div
            key={index}
            className="w-full md:w-1/2 lg:w-1/3 p-6  shadow-lg "
            >
            {/* Icon */}
            <div className="text-3xl text-blue-500 flex justify-center items-center mb-6">
                {box.Icon}
            </div>

            {/* Content */}
            <div className="text-center">
                <h3 className="text-xl font-bold mb-2">{box.Heading}</h3>
                <p className="text-gray-500">{box.Info}</p>
            </div>
            </div>
        ))}
        
        </div>

        
        <div className="flex flex-col md:flex-row items-center justify-center m-10 gap-6">
        <button className="h-10 border-2 border-black px-4 py-2 flex justify-center items-center">
          Learn More
        </button>
        <button className="flex gap-2 justify-center items-center text-blue-500 hover:underline">
          Sign Up <IoIosArrowForward />
        </button>
      </div>

      {/* Dark Section */}
      <div className="bg-black text-white h-auto py-12 px-6 md:flex md:justify-center md:items-center">
        <div className="text-center md:w-2/3">
          <h1 className="font-bold text-3xl md:text-4xl p-2 m-3">
            Discover Local Services Today!
          </h1>
          <p className="text-lg md:text-xl">
            Explore a variety of local services tailored to your needs, all in one place.
          </p>
          <div className="flex  sm:flex-row gap-6 justify-center mt-6">
            <button className="w-32 h-10 border bg-white text-black flex items-center justify-center">
              Explore
            </button>
            <button className="w-32 h-10 border-2 flex items-center justify-center hover:bg-white hover:text-black transition">
              Get Started
            </button>
          </div>
        </div>
      </div>

      {/* Empowering Communities Section */}
      <div className="md:m-8 m-4 md:p-4 flex items-center justify-center">
        <div className="text-center w-full max-w-3xl">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Empowering communities by connecting you to essential local services effortlessly
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Our platform simplifies your search for local services, from health to dining.
            With a user-friendly interface and comprehensive information, we ensure you find
            exactly what you need, when you need it.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center mt-8 gap-6">
            <button className="h-10 border-2 border-black px-6 py-2 flex justify-center items-center">
              Learn More
            </button>
            <button className="flex gap-2 justify-center items-center px-6 py-2 text-blue-500 hover:underline">
              Sign Up <IoIosArrowForward />
            </button>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="m-2 md:m-16 p-4 bg-black text-white flex justify-center items-center">
        <div className="p-2 text-center w-full ">
          <h1 className="text-xl md:text-3xl font-bold ">
            Stay Updated with Our Newsletter
          </h1>
          <p className="text-lg md:text-xl p-2">
            Subscribe now for the latest updates and exclusive offers from our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center p-2">
            <input
              type="email"
              name="email"
              placeholder="Your Email here"
              className="outline-none border-2 border-white bg-transparent w-full sm:w-96 p-2 text-white placeholder-gray-400"
            />
            <button className="w-24 h-10 bg-white text-black">Join Us</button>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            By clicking Join Us, you agree to our Terms and Conditions.
          </p>
        </div>
      </div>
    </div>
  )
}
