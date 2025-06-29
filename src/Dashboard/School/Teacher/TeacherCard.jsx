import React from 'react';
import { User, Mail, Phone } from 'lucide-react';

const TeacherCard = ({ teacher, isSelected, onSelectTeacher }) => {
    return (
        <div
            className={`flex items-center p-4 mb-2 rounded-lg cursor-pointer transition-all duration-200
            ${isSelected ? 'bg-blue-100 border-blue-500 border-l-4 shadow-md' : 'bg-white hover:bg-gray-50 shadow-sm'}`}
            onClick={() => onSelectTeacher(teacher)}
        >
            {teacher.profileImage ? (
                <img
                    src={teacher.profileImage}
                    alt={teacher.name}
                    className="w-12 h-12 rounded-full object-cover mr-4 border border-gray-300"
                />
            ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-4 text-gray-500 text-xl font-bold">
                    {teacher.name ? teacher.name.charAt(0).toUpperCase() : '?'}
                </div>
            )}
            <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">{teacher.name}</h3>
                <p className="text-sm text-gray-600 flex items-center">
                    <Mail className="w-4 h-4 mr-1" /> {teacher.email}
                </p>
                <p className="text-sm text-gray-600 flex items-center">
                    <Phone className="w-4 h-4 mr-1" /> {teacher.mobileNumber}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                    {teacher.specialization}
                </p>
            </div>
        </div>
    );
};

export default TeacherCard;