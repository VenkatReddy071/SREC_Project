import React, { useState } from "react";
import { FaLinkedin, FaGithub, FaPhone, FaTimes } from "react-icons/fa"; // Added FaTimes for modal close
import { AiFillCode } from "react-icons/ai";
import Venkat from "../../../assets/King.jpg"; // Assuming this path is correct
import SaiPrasad from "../../../assets/SaiPrasad.jpg"
import Ganga from "../../../assets/Ganga.jpg"
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
      Name: "Sai Prasad Reddy",
      Title: "Frontend Developer ",
      Date: "08 May 2004",
      Photo:SaiPrasad,
      Linkedin: "https://www.linkedin.com/in/sai-prasad-example/",
      Github: "https://github.com/saiprasad-example/",
      Mbl: "9876543210",
    },
    {
      Name: "Alavakonda Praveen Kumar",
      Title: "Full Stack Developer(MERN)",
      Date: "10 Mar 2001",
      Photo: "https://placehold.co/300x300/90EE90/000000?text=Praveen", // Placeholder
      Linkedin: "https://www.linkedin.com/in/praveen-elaheed-example/",
      Github: "https://github.com/praveen-example/",
      Mbl: "8765432109",
    },
    {
      Name: "D.Gangadhara Sai",
      Title: "UI/UX Designer",
      Date: "16 July 2003",
      Photo:Ganga,
      Linkedin: "https://www.linkedin.com/in/gangadhara-sai-example/",
      Github: "https://github.com/gangadhara-example/",
      Mbl: "7654321098",
    },
    {
      Name: "G.MD.Elaheed",
      Title: "Frontend Developer",
      Date: "20 April 2004",
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
      <div className="flex flex-wrap justify-center gap-8 w-full">
        {team.map((member, index) => (
          <div
            key={index}
            className="w-80  bg-white shadow-xl rounded-xl overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-300 border border-blue-100"
            onClick={() => setSelectedMember(member)}
          >
            <img
              src={member.Photo}
              alt={member.Name}
              className="w-full h-64 object-cover object-center"
              onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/300x300/E0E0E0/000000?text=Profile"; }}
            />
            <div className="px-5 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{member.Name}</h2>
              <p className="text-blue-700 font-semibold mb-2">{member.Title}</p>
              <p className="text-sm text-gray-500">DOB: {member.Date}</p>
              <div className="flex space-x-6 mt-2 text-gray-700 text-2xl items-center justify-center">
                <a
                  href={member.Linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 transition-colors"
                  title="LinkedIn"
                >
                  <FaLinkedin />
                </a>
                <a
                  href={member.Github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-900 transition-colors"
                  title="GitHub"
                >
                  <FaGithub />
                </a>
            
              </div>
            </div>
            
          </div>
        ))}
      </div>

      
    </div>
  );
};
