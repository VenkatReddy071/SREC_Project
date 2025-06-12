import React,{useEffect} from 'react';

export const Appointments = () => {
  useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
  return (
    <div className="text-center flex flex-col items-center justify-center min-h-screen bg-white text-black">
      <h1 className="text-3xl font-bold mb-4">Schedule Your Appointment Today</h1>
      <p className="text-lg text-gray-600 mb-6">
        Contact us now to find the right doctor and book your appointment with ease.
      </p>
      <div className="flex space-x-4">
        <button className="bg-black text-white px-6 py-2 rounded-md">Book</button>
        <button className="border border-black text-black px-6 py-2 rounded-md">Contact</button>
      </div>
    </div>
  );
};
