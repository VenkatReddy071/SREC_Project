import React from 'react';
import { Mail, User, MessageSquareText, Building, GraduationCap, CalendarDays } from 'lucide-react';
import { toast } from 'react-toastify';

const ContactDetails = ({ contact }) => {
    if (!contact) {
        return (
            <div className="flex-1 p-6 flex items-center justify-center bg-gray-50 rounded-lg shadow-inner">
                <p className="text-gray-500 text-xl">Select a message from the inbox to view its details.</p>
            </div>
        );
    }

    const TypeIcon = contact.typeOf === 'Hospital' ? Building : GraduationCap;

    return (
        <div className="flex-1 bg-white p-6 rounded-lg shadow-lg relative overflow-y-auto h-full">
            <div className="flex items-center mb-6 border-b pb-4">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <MessageSquareText className="w-7 h-7 mr-3 text-indigo-600" /> Contact Details
                </h2>
            </div>

            <div className="space-y-5">
                <div>
                    <p className="text-sm font-medium text-gray-700 flex items-center">
                        <User className="w-4 h-4 mr-2 text-gray-500" /> From:
                    </p>
                    <p className="text-lg text-gray-900 font-semibold ml-6">{contact.name}</p>
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-700 flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-gray-500" /> Email:
                    </p>
                    <p className="text-lg text-gray-900 ml-6">{contact.email}</p>
                </div>

                <div>
                    <p className="text-sm font-medium text-gray-700 flex items-center">
                        <TypeIcon className="w-4 h-4 mr-2 text-gray-500" /> Regarding:
                    </p>
                    <p className="text-lg text-gray-900 ml-6">
                        {contact.typeOf || 'General'}
                        {contact.typeContact && contact.typeContact.name && (
                            <span className="ml-2 font-medium">({contact.typeContact.name})</span>
                        )}
                        {contact.typeContact && !contact.typeContact.name && (
                            <span className="ml-2 text-gray-600 text-sm"> (ID: {contact.typeContact._id})</span>
                        )}
                    </p>
                </div>

                <div>
                    <p className="text-sm font-medium text-gray-700 flex items-center">
                        <MessageSquareText className="w-4 h-4 mr-2 text-gray-500" /> Message:
                    </p>
                    <div className="p-4 bg-gray-50 rounded-md border border-gray-200 mt-2 ml-6 whitespace-pre-wrap text-gray-800">
                        {contact.message}
                    </div>
                </div>

                <div>
                    <p className="text-sm font-medium text-gray-700 flex items-center">
                        <CalendarDays className="w-4 h-4 mr-2 text-gray-500" /> Received On:
                    </p>
                    <p className="text-lg text-gray-900 ml-6">{new Date(contact.createdAt).toLocaleString()}</p>
                </div>

                {contact.updatedAt && contact.createdAt !== contact.updatedAt && (
                    <div>
                        <p className="text-sm font-medium text-gray-700 flex items-center">
                            <CalendarDays className="w-4 h-4 mr-2 text-gray-500" /> Last Updated:
                        </p>
                        <p className="text-lg text-gray-900 ml-6">{new Date(contact.updatedAt).toLocaleString()}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContactDetails;