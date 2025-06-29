import React from 'react';
import { Mail, User, Building, GraduationCap, MessageSquare } from 'lucide-react';

const ContactCard = ({ contact, isSelected, onSelectContact }) => {
    const TypeIcon = contact.typeOf === 'Hospital' ? Building : GraduationCap;

    return (
        <div
            className={`flex items-start p-4 mb-2 rounded-lg cursor-pointer transition-all duration-200
            ${isSelected ? 'bg-blue-100 border-blue-500 border-l-4 shadow-md' : 'bg-white hover:bg-gray-50 shadow-sm'}`}
            onClick={() => onSelectContact(contact)}
        >
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-4 text-gray-600">
                <MessageSquare className="w-5 h-5" />
            </div>
            <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <User className="w-4 h-4 mr-1 text-gray-500" /> {contact.name}
                </h3>
                <p className="text-sm text-gray-600 flex items-center mt-1">
                    <Mail className="w-4 h-4 mr-1 text-gray-500" /> {contact.email}
                </p>
                <p className="text-sm text-gray-500 flex items-center mt-1">
                    <TypeIcon className="w-4 h-4 mr-1 text-gray-500" /> {contact.typeOf || 'General'}
                    {contact.typeContact?.name && (
                        <span className="ml-1 text-gray-700 font-medium"> ({contact.typeContact.name})</span>
                    )}
                </p>
                <p className="text-sm text-gray-700 line-clamp-2 mt-2">
                    {contact.message}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                    Received: {new Date(contact.createdAt).toLocaleString()}
                </p>
            </div>
        </div>
    );
};

export default ContactCard;