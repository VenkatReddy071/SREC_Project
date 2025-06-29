import React, { useState, useEffect } from 'react';
import axios from "axios"
import {toast} from "react-toastify";
const ContactFormSkeletonLoader = () => (
  <div className="bg-gray-100 p-8 rounded-lg shadow-md animate-pulse space-y-6">
    <div className="h-8 bg-gray-200 rounded w-3/4 mb-4 mx-auto"></div>
    <div className="space-y-4">
      <div className="h-10 bg-gray-200 rounded w-full"></div>
      <div className="h-10 bg-gray-200 rounded w-full"></div>
      <div className="h-24 bg-gray-200 rounded w-full"></div>
      <div className="h-14 bg-blue-200 rounded-full w-1/2 mx-auto"></div>
    </div>
  </div>
);

export const Contact = ({hospital}) => {
  const [loading, setLoading] = useState(true);
  const [contentLoading,setContentLoading]=useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userIssue, setUserIssue] = useState('');
  const [submissionConfirmed, setSubmissionConfirmed] = useState(false);

  useEffect(() => {
    const simulateLoad = async () => {
      await new Promise(resolve => setTimeout(resolve, 800));
      setLoading(false);
    };
    simulateLoad();
  }, []);

  const handleSubmit =async (e) => {
    e.preventDefault();
    setContentLoading(true);
    if (!userName || !userEmail || !userIssue) {
      toast.error('Please fill in all required fields.'); 
    }

    const contactDetails = {
      name:userName,
      email:userEmail,
      message:userIssue,
      typeContact:hospital?._id,
      typeOf:"School",

    };
    console.log(contactDetails);
    try{
    const response=await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/contact`,{contactDetails},{withCredentials:true});
    if(response.status===200){
      toast.success("Your message has been sent. We will get back to you shortly.");
        setSubmissionConfirmed(true);
    
    setUserName('');
    setUserEmail('');
    setUserIssue('');
    }
    else{
      toast.error(response?.data?.message);
    }
    }
    catch(error){
      console.log(error);
      toast.error("Some error is occure !")
    }
    finally{
      setContentLoading(false);
    }
  };

  return (
    <div className="container md:mx-4 md:px-4  md:py-2 w-full md:w-4/5 xl:w-4/5 font-inter">
      <div className="bg-white p-6 md:p-2 lg:p-10 flex flex-col space-y-8 min-h-screen">

        <div className="text-center space-y-4 pb-2 border-b border-blue-100">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-800 tracking-tight">Contact Us</h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            We are here to help you. Please reach out to us with any questions or concerns.
          </p>
        </div>

        {submissionConfirmed && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6" role="alert">
            <strong className="font-bold">Thank You!</strong>
            <span className="block sm:inline ml-2">Your message has been sent. We will get back to you shortly.</span>
            <span className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer" onClick={() => setSubmissionConfirmed(false)}>
              <svg className="fill-current h-6 w-6 text-green-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 2.65a1.2 1.2 0 1 1-1.697-1.697L8.303 10l-2.651-2.651a1.2 1.2 0 1 1 1.697-1.697L10 8.303l2.651-2.651a1.2 1.2 0 1 1 1.697 1.697L11.697 10l2.651 2.651a1.2 1.2 0 0 1 0 1.698z"/></svg>
            </span>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center"> {/* Centering the skeleton loader */}
            <ContactFormSkeletonLoader />
          </div>
        ) : (
          <div className="flex justify-center"> {/* Centering the form */}
            {/* Contact Form Section */}
            <div className="p-6 md:p-4 bg-blue-50 rounded-lg w-full md:w-full lg:w-full xl:w-full "> {/* Adjusted width for single column */}
              <h2 className="text-2xl md:text-3xl font-bold text-blue-700 mb-6 text-center">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="contactName" className="block text-lg font-medium text-gray-700 mb-2">Your Name:</label>
                  <input
                    type="text"
                    id="contactName"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-lg"
                    placeholder="Full Name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="contactEmail" className="block text-lg font-medium text-gray-700 mb-2">Email:</label>
                  <input
                    type="email"
                    id="contactEmail"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-lg"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="userIssue" className="block text-lg font-medium text-gray-700 mb-2">Your Message :</label>
                  <textarea
                    id="userIssue"
                    rows="6"
                    value={userIssue}
                    onChange={(e) => setUserIssue(e.target.value)}
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-lg h-20"
                    placeholder="Describe your query or feedback..."
                    required
                  ></textarea>
                </div>
                <div className="text-center">
                  <button
                    type="submit"
                    className="inline-flex items-center px-6 py-4 border border-transparent text-xl font-semibold rounded-full shadow-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-300 ease-in-out transform hover:-translate-y-1"
                  >
                    {contentLoading ?<div className="flex items-center">
                        <svg
                          className="animate-spin h-5 w-5 mr-3 text-white"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Sending..
                      </div>:
              "Send Message"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}