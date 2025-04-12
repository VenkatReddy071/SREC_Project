import React from 'react';

const Loading = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-[3px] overflow-hidden z-50">
      <div className="w-0 h-full bg-blue-400 animate-google-line"></div>
    </div>
  );
};

export default Loading;