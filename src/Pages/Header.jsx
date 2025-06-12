import React from 'react';

export function Header({ imageUrl, headingText, paraText, buttons }) {
  return (
    <header
      className="relative bg-cover bg-center h-screen flex items-center justify-center text-white"
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div> {/* Overlay */}
      <div className="relative z-10 text-center px-4">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">
          {headingText}
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
          {paraText}
        </p>
        <div className="flex justify-center space-x-4">
          {buttons.map((button, index) => (
            <button
              key={index}
              onClick={button.onClick}
              className={`px-6 py-3 rounded-full font-semibold transition duration-300
                ${button.bgColor ? `bg-[${button.bgColor}]` : 'bg-transparent'}
                ${button.textColor ? `text-[${button.textColor}]` : 'text-current'}
                ${button.border ? `border ${button.border}` : ''}
                hover:opacity-80
              `}
              style={{
                backgroundColor: button.bgColor,
                color: button.textColor,
                border: button.border
              }}
            >
              {button.text}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}