import React from 'react'
import { Buttons } from '../UseButtons.jsx/Buttons'
import Header from "../../assets/Header.jpg"
import { Content } from './Content'
import { RiBox2Line } from "react-icons/ri";

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
            <div className=' flex gap-10 p-3 m-2'>
                <div className="div w-1/2 p-2 ">
                    <h1 className='text-5xl font-bold'>Discover Local Services at Your Fingertips</h1>
                </div>
                <div className="div w-1/2 p-2 ">
                    <div className="text">
                        <p>Explore a wide range of local services tailored to your needs.From schools to restaurants,find everything you need in one place</p>
                    </div>
                    <div className='mt-10'>
                    <Buttons label1={"Explore"} label2={"Learn More"} reverse={true}/>
                    </div>
                    
                </div>
            </div>
        </div>
        <div className="div m-[20px] p-8">
            <img src={Header} alt="" className="w-full h-auto" />
        </div>
        {
            content.map((item,index)=>(
                <Content key={index} item={item} reverse={false}/>
            ))
        }
        <div className="flex items-center justify-center ">
            <div className="text-center w-[700px]">
                <h4 className="text-xl font-semibold">Explore</h4>
                <h1 className="text-5xl font-bold mb-4">Discover Local Services at Your Fingertips</h1>
                <p className="text-lg">
                    Our platform offers seamless navigation to connect you with essential local
                    services. From hospitals to restaurants, find everything you need in one place.
                </p>
            </div>
        </div>
        <div className="p-4 rounded-md flex  gap-4 ">
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

        

    </div>
  )
}
