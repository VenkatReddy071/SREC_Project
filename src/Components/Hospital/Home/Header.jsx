import React, { useRef } from 'react';
import Hospital from "../../../assets/Hospital.mp4";

export const Header = () => {
  const videoRef = useRef(null);

  return (
    <div className="relative w-full md:h-screen h-60 overflow-hidden m-auto p-2">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full md:h-full object-cover p-6 "
      >
        <source src={Hospital} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};
