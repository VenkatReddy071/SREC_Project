import React, { useState, useEffect, useRef, useCallback } from "react";
import Axios from "axios";
import { FaRegClock, FaEnvelope, FaUser, FaHospital, FaMapMarkerAlt, FaCalendarAlt, FaInfoCircle, FaTimesCircle, FaPhoneAlt, FaAt } from 'react-icons/fa';
import CustomModal from "../../../Pages/CustomModol"; // Adjust path as needed

const ITEMS_PER_LOAD = 15;

const HospitalContactSubmissions = () => {
    const [contacts, setContacts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);

    const SERVER_URL = `${import.meta.env.VITE_SERVER_URL}`;

    const observer = useRef();
    const lastContactElementRef = useCallback(
        (node) => {
            if (isLoading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setCurrentPage((prevPage) => prevPage + 1);
                }
            });
            if (node) observer.current.observe(node);
        },
        [isLoading, hasMore]
    );

    const fetchContacts = useCallback(async (page) => {
        setIsLoading(true);
        try {
            const response = await Axios.get(
                `${SERVER_URL}/api/contact?type=Hospital&page=${page}&limit=${ITEMS_PER_LOAD}`,
                {
                    withCredentials: true,
                }
            );

            const { contacts: fetchedContacts, hasMore: fetchedHasMore } = response.data;

            if (page === 1) {
                setContacts(fetchedContacts);
            } else {
                setContacts((prevContacts) => [...prevContacts, ...fetchedContacts]);
            }

            setHasMore(fetchedHasMore);
        } catch (error) {
            console.error("Error fetching hospital contacts:", error);
            setHasMore(false);
        } finally {
            setIsLoading(false);
            setInitialLoad(false);
        }
    }, [SERVER_URL]);

    useEffect(() => {
        fetchContacts(currentPage);
    }, [currentPage, fetchContacts]);

    const formatDate = (dateStr) => {
        if (!dateStr || isNaN(new Date(dateStr).getTime())) {
            return "N/A";
        }
        return new Date(dateStr).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const formatTime = (timeStr) => {
        if (!timeStr) {
            return "N/A";
        }
        try {
            const date = new Date(timeStr);
            if (isNaN(date.getTime())) {
                if (timeStr.includes(':')) {
                    const [hours, minutes] = timeStr.split(':');
                    const tempDate = new Date();
                    tempDate.setHours(parseInt(hours, 10));
                    tempDate.setMinutes(parseInt(minutes, 10));
                    tempDate.setSeconds(0);
                    return tempDate.toLocaleTimeString("en-GB", {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                    });
                }
                return "N/A";
            }
            return date.toLocaleTimeString("en-GB", {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        } catch (e) {
            console.error("Error formatting time:", e, "Input:", timeStr);
            return "N/A";
        }
    };

    const getStatusClass = (status) => {
        if (status?.toLowerCase() === "responded") {
            return "bg-green-100 text-green-800 border-green-200";
        } else if (status?.toLowerCase() === "rejected") {
            return "bg-red-100 text-red-800 border-red-200";
        }
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    };

    const openModal = (contact) => {
        setSelectedContact(contact);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedContact(null);
    };

    return (
        <div className="w-full mx-auto px-4 bg-gray-50 min-h-screen py-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center border-b pb-4">Hospital Contact Submissions</h1>

            {initialLoad && isLoading ? (
                <div className="text-center py-10 text-xl font-semibold text-gray-700 animate-pulse flex items-center justify-center">
                    <FaRegClock className="mr-2 animate-spin w-6 h-6" /> Fetching hospital submissions...
                </div>
            ) : contacts.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-6">
                        {contacts.map((contact, index) => {
                            const isLastContact = contacts.length === index + 1;
                            const hospitalName = contact.typeContact?.name || "N/A";
                            const hospitalImage = contact.typeContact?.image || "[https://placehold.co/150x150/f0f9ff/00796b?text=Hospital](https://placehold.co/150x150/f0f9ff/00796b?text=Hospital)";
                            const hospitalLocation = contact.typeContact?.locationName || contact.typeContact?.address || "N/A";
                            const contactStatus = contact.status || "Submitted";

                            return (
                                <div
                                    key={contact._id}
                                    ref={isLastContact ? lastContactElementRef : null}
                                    className={`bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer group
                                        ${selectedContact && selectedContact._id === contact._id ? "ring-2 ring-teal-500" : ""}`}
                                    onClick={() => openModal(contact)}
                                >
                                    <div className="p-4 flex flex-col items-center text-center">
                                        <div className="relative w-full mb-3">
                                            <img
                                                src={hospitalImage}
                                                alt={hospitalName}
                                                className="w-full h-40 object-cover rounded-lg shadow-inner"
                                                onError={(e) => { e.target.onerror = null; e.target.src = "[https://placehold.co/150x150/f0f9ff/00796b?text=Hospital](https://placehold.co/150x150/f0f9ff/00796b?text=Hospital)"; }}
                                            />
                                            <span
                                                className={`absolute top-2 left-2 px-3 py-1 text-xs font-semibold rounded-full capitalize border ${getStatusClass(contactStatus)}`}
                                            >
                                                <FaRegClock className="inline mr-1 w-3 h-3" />
                                                {contactStatus}
                                            </span>
                                            <span className="absolute top-2 right-2 text-xs font-medium text-gray-500 bg-white bg-opacity-80 rounded-full px-2 py-1 shadow-sm">
                                                #{contact._id.slice(-6)}
                                            </span>
                                        </div>

                                        <h3 className="text-xl font-bold text-gray-800 mb-1 leading-tight flex items-center">
                                            <FaHospital className="mr-2 text-red-500 w-5 h-5" />
                                            {hospitalName}
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-3 truncate w-full px-2 flex items-center justify-center">
                                            <FaUser className="mr-1 text-gray-500" /> Submitted by: {contact.name || "N/A"}
                                        </p>
                                        <p className="text-sm text-gray-600 mb-3 truncate w-full px-2 flex items-center justify-center">
                                            <FaMapMarkerAlt className="mr-1 text-green-500" /> Location: {hospitalLocation}
                                        </p>

                                        <div className="flex justify-between items-center w-full pt-3 border-t border-gray-100">
                                            <span className="text-sm font-semibold text-gray-800 flex items-center">
                                                <FaCalendarAlt className="mr-1 text-blue-500" /> {formatDate(contact.createdAt)} at {formatTime(contact.createdAt)}
                                            </span>
                                            <button className="px-4 py-2 bg-teal-500 text-white rounded-full text-sm font-semibold hover:bg-teal-600 transition-colors duration-200 shadow-md">
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {isLoading && (
                        <div className="text-center py-4 text-gray-500 flex items-center justify-center">
                            <FaRegClock className="mr-2 animate-spin w-5 h-5" /> Loading more submissions...
                        </div>
                    )}
                    {!hasMore && !isLoading && contacts.length > 0 && (
                        <div className="text-center py-4 text-gray-500">You've seen all your hospital contact submissions.</div>
                    )}
                </>
            ) : (
                <div className="py-10 text-center text-gray-600 text-lg">
                    No hospital contact submissions found.
                </div>
            )}

            <CustomModal
                isOpen={isModalOpen}
                onClose={closeModal}
            >
                {selectedContact && (
                    <div className="p-6 bg-white rounded-lg relative max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={closeModal}
                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-3xl transition-colors duration-200"
                            title="Close"
                        >
                            <FaTimesCircle className="w-8 h-8" />
                        </button>

                        <h2 className="text-2xl font-extrabold text-gray-900 mb-4 border-b pb-3 flex items-center">
                            <FaInfoCircle className="mr-2 text-teal-600 w-6 h-6" /> Submission Details
                            <span className="text-teal-600 ml-2">#{selectedContact._id.slice(-6)}</span>
                        </h2>

                        <div className="grid grid-cols-1 gap-4 text-gray-700 text-sm mb-6">
                            {/* User Info */}
                            <div>
                                <p className="font-semibold text-gray-600 flex items-center">
                                    <FaUser className="mr-2 text-blue-500 w-4 h-4" /> Submitted By:
                                </p>
                                <p className="ml-5"><b>Name:</b> {selectedContact.name || "N/A"}</p>
                                <p className="ml-5"><b>Email:</b> {selectedContact.email || "N/A"}</p>
                            </div>

                            {/* Hospital Info */}
                            <div className="border-t pt-4">
                                <p className="font-semibold text-gray-600 flex items-center">
                                    <FaHospital className="mr-2 text-red-500 w-4 h-4" /> Hospital Details:
                                </p>
                                <p className="ml-5"><b>Name:</b> {selectedContact.typeContact?.name || "N/A"}</p>
                                {selectedContact.typeContact?.address && (
                                    <p className="ml-5">
                                        <b>Address:</b> {selectedContact.typeContact.address}
                                    </p>
                                )}
                                {selectedContact.typeContact?.locationName && (
                                    <p className="ml-5">
                                        <b>Location:</b> {selectedContact.typeContact.locationName}
                                    </p>
                                )}
                                {selectedContact.typeContact?.phoneNumber && (
                                    <p className="ml-5 flex items-center"><FaPhoneAlt className="mr-2 text-gray-500" /><b>Phone:</b> {selectedContact.typeContact.phoneNumber}</p>
                                )}
                                {selectedContact.typeContact?.ownerEmail && (
                                    <p className="ml-5 flex items-center"><FaAt className="mr-2 text-gray-500" /><b>Owner Email:</b> {selectedContact.typeContact.ownerEmail}</p>
                                )}
                                {selectedContact.typeContact?.image && (
                                    <div className="ml-5 mt-3">
                                        <p className="font-medium text-gray-600">Image:</p>
                                        <img
                                            src={selectedContact.typeContact.image}
                                            alt={selectedContact.typeContact.name}
                                            className="w-full h-32 object-cover rounded-md mt-1"
                                            onError={(e) => { e.target.onerror = null; e.target.src = "[https://placehold.co/150x150/f0f9ff/00796b?text=Hospital](https://placehold.co/150x150/f0f9ff/00796b?text=Hospital)"; }}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Message */}
                            <div className="col-span-full bg-blue-50 p-3 rounded-md border border-blue-200">
                                <p className="font-semibold text-gray-600 flex items-center">
                                    <FaEnvelope className="mr-2 text-blue-500 w-4 h-4" /> Message:
                                </p>
                                <p className="italic ml-5">{selectedContact.message || "N/A"}</p>
                            </div>

                            {/* Submission Date/Time */}
                            <div>
                                <p className="font-semibold text-gray-600 flex items-center">
                                    <FaCalendarAlt className="mr-2 text-yellow-500 w-4 h-4" /> Submitted On:
                                </p>
                                <p className="ml-5">
                                    {formatDate(selectedContact.createdAt)} at {formatTime(selectedContact.createdAt)}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </CustomModal>
        </div>
    );
};

export default HospitalContactSubmissions;
