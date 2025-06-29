import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Loader2, MessageSquareText, Search, Filter } from 'lucide-react';
import { toast } from 'react-toastify';

import ContactCard from './ContactCard';
import ContactDetails from './ContactDetails';

const SkeletonList = () => (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow-md">
        {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center p-4 rounded-lg bg-gray-50 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-gray-200 mr-4"></div>
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
            </div>
        ))}
    </div>
);

const ContactDashboard = () => {
    const [contacts, setContacts] = useState([]);
    const [filteredContacts, setFilteredContacts] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterType, setFilterType] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    const API_BASE_URL = import.meta.env.VITE_SERVER_URL;

    const fetchContacts = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        const token=await localStorage.getItem("dashboard");

        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            };
            const response = await axios.get(`${API_BASE_URL}/api/contact/hospital/contacts`, config);
            setContacts(response.data?.contact);
            setIsLoading(false);
        } catch (err) {
            console.error('Error fetching contacts:', err);
            setError(`Failed to load contacts: ${err.response?.data?.msg || err.message}`);
            toast.error('Failed to load contacts.');
            setIsLoading(false);
        }
    }, [API_BASE_URL]);

    useEffect(() => {
        fetchContacts();
    }, [fetchContacts]);

    useEffect(() => {
        let currentContacts = [...contacts];

        if (filterType !== 'All') {
            currentContacts = currentContacts.filter(contact => contact.typeOf === filterType);
        }

        if (searchTerm) {
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            currentContacts = currentContacts.filter(
                contact =>
                    contact.name.toLowerCase().includes(lowerCaseSearchTerm) ||
                    contact.email.toLowerCase().includes(lowerCaseSearchTerm) ||
                    contact.message.toLowerCase().includes(lowerCaseSearchTerm)
            );
        }

        setFilteredContacts(currentContacts);
        if (selectedContact && !currentContacts.some(c => c._id === selectedContact._id)) {
            setSelectedContact(null);
        } else if (!selectedContact && currentContacts.length > 0) {
            setSelectedContact(currentContacts[0]);
        }
    }, [contacts, filterType, searchTerm, selectedContact]);

    const handleSelectContact = (contact) => {
        setSelectedContact(contact);
    };

    const handleFilterChange = (e) => {
        setFilterType(e.target.value);
        setSearchTerm('');
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-100 p-8 flex justify-center items-center">
                <Loader2 className="animate-spin text-blue-500 w-12 h-12" />
                <p className="ml-4 text-lg text-gray-700">Loading contact messages...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 p-8 flex justify-center items-center">
                <p className="text-red-600 text-lg">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-2 font-sans">

            <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)]">
                <div className="w-full lg:w-1/3 bg-white p-4 rounded-lg shadow-lg flex flex-col overflow-hidden">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-3">Inbox</h2>

                    <div className="mb-4 space-y-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by name, email, or message..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        {/* <div className="relative">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <select
                                value={filterType}
                                onChange={handleFilterChange}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md appearance-none focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                            >
                                <option value="All">All Types</option>
                                <option value="Hospital">Hospital</option>
                                <option value="School">School</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                            </div>
                        </div> */}
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        {filteredContacts.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">No messages found matching your criteria.</p>
                        ) : (
                            filteredContacts.map(contact => (
                                <ContactCard
                                    key={contact._id}
                                    contact={contact}
                                    isSelected={selectedContact?._id === contact._id}
                                    onSelectContact={handleSelectContact}
                                />
                            ))
                        )}
                    </div>
                </div>

                <div className="w-full lg:w-2/3">
                    <ContactDetails contact={selectedContact} />
                </div>
            </div>
        </div>
    );
};

export default ContactDashboard;