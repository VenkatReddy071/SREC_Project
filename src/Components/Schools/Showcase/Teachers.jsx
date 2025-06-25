import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaEnvelope, FaPhoneAlt, FaGraduationCap } from 'react-icons/fa';
import axios from "axios";

const TEACHERS_PER_PAGE = 20;

const fetchTeachers = async (page, limit, instituteId) => {
    if (!instituteId) {
        console.warn("Institute ID is missing. Cannot fetch teachers.");
        return { teachers: [], hasMore: false };
    }

    const url = `${import.meta.env.VITE_SERVER_URL}/api/teacher/by-institute/${instituteId}?page=${page}&limit=${limit}`;
    
    try {
        const response = await axios.get(url, { withCredentials: true });
        
        return response.data; 
    } catch (error) {
        throw error; 
    }
};

const Teacher = ({ school }) => {
    const [teachers, setTeachers] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState(null);

    const observer = useRef();

    const lastTeacherElementRef = useCallback(
        (node) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage((prevPage) => prevPage + 1);
                }
            });

            if (node) observer.current.observe(node);
        },
        [loading, hasMore]
    );

    useEffect(() => {
        setTeachers([]);
        setPage(1);
        setHasMore(true);
        setError(null);
    }, [school?._id]);

    useEffect(() => {
        const loadTeachers = async () => {
            if (!school?._id) {
                setLoading(false);
                setHasMore(false);
                setError("No institute information available to fetch teachers.");
                return;
            }
            if (!hasMore && page > 1) return;
            if (loading) return;

            setLoading(true);
            setError(null);

            try {
                const data = await fetchTeachers(page, TEACHERS_PER_PAGE, school._id);
                console.log("Fetched data:", data);
                
                if (data.teachers.length === 0 && page === 1) {
                    setError("No teachers found for this institute.");
                    setTeachers([]);
                    setHasMore(false);
                } else {
                    setTeachers((prevTeachers) => [...prevTeachers, ...data.teachers]);
                    setHasMore(data.hasMore);
                }
            } catch (error) {
                console.error('Failed to fetch teachers:', error);
                if (error.response && error.response.status === 404 && page === 1) {
                    setError("No teachers found for this institute.");
                } else {
                    setError('Failed to load teachers. Please try again later.');
                }
                setHasMore(false);
            } finally {
                setLoading(false);
            }
        };

        if (school?._id && hasMore) { 
            loadTeachers();
        }
    }, [page, hasMore, school?._id]);

    return (
        <div className="min-h-screen w-full p-4 font-inter">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold text-center text-gray-800 mb-10 rounded-lg p-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg">
                    Our Esteemed Teachers
                </h1>

                {error && (
                    <div className="text-center text-red-600 bg-red-100 border border-red-400 rounded-md p-4 mb-4">
                        <p className="font-medium">{error}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teachers.map((teacher, index) => {
                        const isLastElement = teachers.length === index + 1;
                        return (
                            <div
                                ref={isLastElement ? lastTeacherElementRef : null}
                                key={teacher._id}
                                className="bg-white rounded-xl shadow-lg flex flex-col transform transition duration-300 hover:scale-105 hover:shadow-xl border border-gray-200 overflow-hidden group"
                            >
                                <div className="relative w-full h-40 overflow-hidden">
                                    <img
                                        src={teacher.profileImage}
                                        alt={`Profile image of ${teacher.name}`}
                                        className="w-full h-full object-cover rounded-t-xl transition-all duration-300 group-hover:scale-110 group-hover:brightness-50"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-xl">
                                        <h2 className="text-xl font-bold text-white mb-2 text-center">{teacher.name}</h2>
                                        <p className="text-sm text-gray-200 mb-1 flex items-center">
                                            <FaEnvelope className="h-4 w-4 mr-2 text-indigo-200" />
                                            {teacher.email}
                                        </p>
                                        <p className="text-sm text-gray-200 mb-1 flex items-center">
                                            <FaPhoneAlt className="h-4 w-4 mr-2 text-indigo-200" />
                                            {teacher.mobileNumber}
                                        </p>
                                        <p className="text-sm text-gray-200 mb-1 flex items-center">
                                            <FaGraduationCap className="h-4 w-4 mr-2 text-indigo-200" />
                                            <span className="font-medium text-white">{teacher.specialization}</span>
                                        </p>
                                        <p className="text-xs text-gray-300 mb-1">
                                            Experience: {teacher.experienceYears} Years
                                        </p>
                                        <p className="text-xs text-gray-300">
                                            Joined: {new Date(teacher.dateOfJoining).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="p-4 flex flex-col items-center w-full">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-2 text-center">{teacher.name}</h2>
                                    <p className="text-sm text-gray-600">Specialization: {teacher.specialization}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {loading && (
                    <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                        <p className="ml-4 text-indigo-600 text-lg">Loading more teachers...</p>
                    </div>
                )}

                {!hasMore && !loading && !error && teachers.length > 0 && (
                    <div className="text-center text-gray-500 py-8">
                        You've reached the end of the list!
                    </div>
                )}

                {!loading && teachers.length === 0 && !error && (
                    <div className="text-center text-gray-500 py-8">
                        No teachers to display.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Teacher;