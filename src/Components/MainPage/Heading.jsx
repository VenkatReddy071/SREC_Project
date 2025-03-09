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

        
        <div className=' flex items-center justify-center m-10 gap-10'>
        <button className=' h-10 border-2 border-black p-2 m-2 flex justify-center items-center'>
                        Learn more
                      </button>
                      <button className='flex gap-2  justify-center items-center'>
                        Sign{<IoIosArrowForward />}
        </button>
        </div>
        <div className='bg-black w-full text-white h-64 flex justify-center items-center'>
            <div>
            <h1 className='text-center font-bold text-4xl p-2 m-3'>Discover Local Services Today!</h1>
            <p className='text-center text-xl'>Explore a variety of local services tailored to your needs,all in one place</p>
            <div className='flex gap-10 ml-36 p-4'>
            <div className={`button w-24  h-10 border flex items-center justify-center bg-white text-black `}>
            <button>Explore</button>
            </div>
            <div className="button w-24 h-10 border-2  flex items-center justify-center hover:bg-black hover:text-white ">
            <button>Get Started</button>
            </div>
            </div>
            </div>
        </div>
        <div className="m-8 p-2 flex items-center justify-center">
        <div className="text-center w-[700px]">
            <h1 className="text-5xl font-bold mb-4">
            Empowering communities by connecting you to essential local services effortlessly
            </h1>
            <p className="mt-4 text-lg text-gray-600">
            Our platform is dedicated to simplifying your search for local services, from health to dining. 
            With a user-friendly interface and comprehensive information, we ensure you find exactly what you need, 
            when you need it.
            </p>
            <div className="flex items-center justify-center m-10 gap-10">
            <button className="h-10 border-2 border-black px-4 py-2 flex justify-center items-center">
                Learn More
            </button>
            <button className="flex gap-2 justify-center items-center px-4 py-2 text-blue-500 hover:underline">
                Sign Up
                {<IoIosArrowForward />}
            </button>
            </div>
        </div>
        </div>
        <div className='m-16 p-2 bg-black text-white flex justify-center items-center'>
            <div className='p-10 m-6'>
                <h1 className='text-3xl font-bold text-white text-center p-2'>Stay Update with Our Newsletter</h1>
                <p className='text-xl font-medium text-center p-2'>Subscribe new for the  latest updates and exclusive oftters from our platform</p>
                <div className='flex gap-10 justify-center p-2'>
                    <input type="email" name="email" id="email" placeholder='Your Email here' className='outline-none border-2 border-white bg-transparent w-96 p-2'/>
                    <button className='w-24 h-10 bg-white text-black'> Join us</button>
                </div>
                <p className='text-xs text-100 ml-24'>By clicking join us,you agree to our Terms and Conditions </p>
            </div>
        </div>
    </div>
  )
}
