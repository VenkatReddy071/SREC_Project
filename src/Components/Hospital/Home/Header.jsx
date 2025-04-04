import React from 'react'

export const Header = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden m-auto p-2">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full md:h-72 h-40 object-cover p-6 m-2"
      >
        <source src="/path-to-your-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center items-start h-full text-white px-10">
        <h1 className="md:text-5xl text-4xl font-bold mb-4">Your Health, Our Commitment to Care</h1>
        <p className="text-lg max-w-lg">
          At our facility, we prioritize your health and well-being. Discover a
          range of specialized services tailored to meet your unique needs.
        </p>
        <div className="mt-6 flex gap-4">
          <button className="bg-white text-black px-6 py-2 font-semibold rounded-md shadow-md">
            Learn More
          </button>
          <button className="border border-white px-6 py-2 font-semibold rounded-md">
            Sign Up
          </button>
        </div>
      </div>
    </div>
  )
}
