import React, { useState } from "react";
import { FaLinkedin, FaGithub, FaPhone, FaTimes } from "react-icons/fa"; // Added FaTimes for modal close
import { AiFillCode } from "react-icons/ai";
import Venkat from "../../../assets/King.jpg"; // Assuming this path is correct

export const Developers = () => {
  const team = [
    {
      Name: "Jonnagiri Venkat Reddy",
      Title: "Full Stack Developer (MERN)",
      Date: "15 May 2003",
      Photo: Venkat,
      Linkedin: "https://www.linkedin.com/in/jonnagiri-venkat-reddy-48b610295/",
      Github: "https://github.com/VenkatReddy071/",
      Mbl: "6305604902",
    },
    {
      Name: "Sai Prasad",
      Title: "Frontend Developer (React)",
      Date: "20 Jan 2002",
      Photo: "https://placehold.co/300x300/ADD8E6/000000?text=Sai+Prasad", // Placeholder for other members
      Linkedin: "https://www.linkedin.com/in/sai-prasad-example/",
      Github: "https://github.com/saiprasad-example/",
      Mbl: "9876543210",
    },
    {
      Name: "Praveen Elaheed",
      Title: "Backend Developer (Node.js)",
      Date: "10 Mar 2001",
      Photo: "https://placehold.co/300x300/90EE90/000000?text=Praveen", // Placeholder
      Linkedin: "https://www.linkedin.com/in/praveen-elaheed-example/",
      Github: "https://github.com/praveen-example/",
      Mbl: "8765432109",
    },
    {
      Name: "Gangadhara Sai",
      Title: "UI/UX Designer",
      Date: "05 Sep 2000",
      Photo: "https://placehold.co/300x300/FFD700/000000?text=Gangadhara", // Placeholder
      Linkedin: "https://www.linkedin.com/in/gangadhara-sai-example/",
      Github: "https://github.com/gangadhara-example/",
      Mbl: "7654321098",
    },
    {
      Name: "Another Developer",
      Title: "Mobile Developer (React Native)",
      Date: "01 Jan 2000",
      Photo: "https://placehold.co/300x300/DDA0DD/000000?text=Developer+5", // Placeholder
      Linkedin: "https://www.linkedin.com/in/another-developer/",
      Github: "https://github.com/another-dev/",
      Mbl: "9988776655",
    },
  ];

  const [selectedMember, setSelectedMember] = useState(null);

  return (
    <div className="bg-gray-50 p-8 min-h-screen font-sans">
      <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-12">Meet Our Development Team</h1>
      <div className="flex flex-wrap justify-center gap-8 max-w-7xl mx-auto">
        {team.map((member, index) => (
          <div
            key={index}
            className="w-full sm:w-72 bg-white shadow-xl rounded-xl overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-300 border border-blue-100"
            onClick={() => setSelectedMember(member)}
          >
            <img
              src={member.Photo}
              alt={member.Name}
              className="w-full h-64 object-cover object-center"
              onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/300x300/E0E0E0/000000?text=Profile"; }}
            />
            <div className="p-5 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{member.Name}</h2>
              <p className="text-blue-700 font-semibold mb-2">{member.Title}</p>
              <p className="text-sm text-gray-500">DOB: {member.Date}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedMember && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedMember(null)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 relative transform scale-95 opacity-0 animate-modal-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 text-3xl transition-colors"
              onClick={() => setSelectedMember(null)}
              aria-label="Close"
            >
              <FaTimes />
            </button>

            <div className="flex flex-col items-center text-center">
              <img
                src={selectedMember.Photo}
                alt={selectedMember.Name}
                className="w-32 h-32 object-cover rounded-full border-4 border-blue-400 shadow-md mb-4"
                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/128x128/E0E0E0/000000?text=Profile"; }}
              />
              <h2 className="text-3xl font-bold text-gray-900 mb-1">{selectedMember.Name}</h2>
              <p className="text-blue-700 text-lg font-semibold mb-2">{selectedMember.Title}</p>
              <p className="text-gray-600 text-sm">DOB: {selectedMember.Date}</p>

              <div className="flex space-x-6 mt-6 text-gray-700 text-3xl">
                <a
                  href={selectedMember.Linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 transition-colors"
                  title="LinkedIn"
                >
                  <FaLinkedin />
                </a>
                <a
                  href={selectedMember.Github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-900 transition-colors"
                  title="GitHub"
                >
                  <FaGithub />
                </a>
                <a
                  href={`tel:${selectedMember.Mbl}`}
                  className="hover:text-green-600 transition-colors"
                  title="Call"
                >
                  <FaPhone />
                </a>
                <AiFillCode title="Code Portfolio" className="text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
