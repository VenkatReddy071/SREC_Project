import React, { useState } from "react";
import { FaLinkedin, FaGithub, FaPhone } from "react-icons/fa";
import { AiFillCode } from "react-icons/ai";
import Venkat from "../../../assets/King.jpg";

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
      Name: "Jonnagiri Venkat Reddy",
      Title: "Full Stack Developer (MERN)",
      Date: "15 May 2003",
      Photo: Venkat,
      Linkedin: "https://www.linkedin.com/in/jonnagiri-venkat-reddy-48b610295/",
      Github: "https://github.com/VenkatReddy071/",
      Mbl: "6305604902",
    },
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
      Name: "Jonnagiri Venkat Reddy",
      Title: "Full Stack Developer (MERN)",
      Date: "15 May 2003",
      Photo: Venkat,
      Linkedin: "https://www.linkedin.com/in/jonnagiri-venkat-reddy-48b610295/",
      Github: "https://github.com/VenkatReddy071/",
      Mbl: "6305604902",
    },
    {
      Name: "Jonnagiri Venkat Reddy",
      Title: "Full Stack Developer (MERN)",
      Date: "15 May 2003",
      Photo: Venkat,
      Linkedin: "https://www.linkedin.com/in/jonnagiri-venkat-reddy-48b610295/",
      Github: "https://github.com/VenkatReddy071/",
      Mbl: "6305604902",
    },
  ];

  const [selectedMember, setSelectedMember] = useState(null);

  return (
    <div className="bg-white p-6 max-w-6xl mx-auto font-serif text-gray-900">
      <div className="flex flex-wrap gap-6 mb-10 ">
        {team.map((member, index) => (
          <div
            key={index}
            className="w-80 bg-white shadow-lg rounded overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
          >
            <img
              src={member.Photo}
              alt={member.Name}
              className="w-full h-60 object-cover "
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-2">{member.Title}</h2>
              <p className="text-sm text-gray-500">{member.Date}</p>
              <button
                className="mt-4 text-sm text-blue-600 hover:underline"
                onClick={() => setSelectedMember(member)}
              >
                Read more
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedMember && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setSelectedMember(null)}
        >
          <div
            className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside modal
          >
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-xl font-bold"
              onClick={() => setSelectedMember(null)}
            >
              &times;
            </button>

            <img
              src={selectedMember.Photo}
              alt={selectedMember.Name}
              className="w-full h-64 object-cover rounded"
            />
            <h2 className="text-2xl font-bold mt-4">{selectedMember.Name}</h2>
            <p className="text-gray-700 mt-2">{selectedMember.Title}</p>
            <p className="text-gray-500 mt-1">DOB: {selectedMember.Date}</p>

            <div className="flex space-x-6 mt-4 text-gray-700 text-xl">
              <a
                href={selectedMember.Linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-700"
                title="LinkedIn"
              >
                <FaLinkedin />
              </a>
              <a
                href={selectedMember.Github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-900"
                title="GitHub"
              >
                <FaGithub />
              </a>
              <a
                href={`tel:${selectedMember.Mbl}`}
                className="hover:text-green-600"
                title="Call"
              >
                <FaPhone />
              </a>
              <AiFillCode title="Alcode Icon" className="text-purple-600" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
