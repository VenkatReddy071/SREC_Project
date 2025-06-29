import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusCircle, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

import TeacherCard from './TeacherCard';
import TeacherDetails from './TeacherDetilas';

const SkeletonList = () => (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow-md">
        {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center p-4 rounded-lg bg-gray-50 animate-pulse">
                <div className="w-12 h-12 rounded-full bg-gray-200 mr-4"></div>
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
            </div>
        ))}
    </div>
);

const TeacherDashboard = () => {
    const [teachers, setTeachers] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [error, setError] = useState(null);

    const API_BASE_URL = `${import.meta.env.VITE_SERVER_URL}/api/teacher`;

    useEffect(() => {
        fetchTeachers();
    }, []);

    const fetchTeachers = async () => {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem('dashboard');
        if (!token) {
            setError('Authentication token not found. Please log in.');
            setIsLoading(false);
            return;
        }

        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            };
            const response = await axios.get(`${API_BASE_URL}/email/teacher`, config);
            setTeachers(response.data);
            setIsLoading(false);
            if (response.data.length > 0 && !selectedTeacher) {
                setSelectedTeacher(response.data[0]);
            }
        } catch (err) {
            console.error('Error fetching teachers:', err);
            setError('Failed to load teachers. Please try again.');
            toast.error('Failed to load teachers.');
            setIsLoading(false);
        }
    };

    const handleSelectTeacher = (teacher) => {
        setSelectedTeacher(teacher);
        setIsAddingNew(false);
    };

    const handleAddTeacherClick = () => {
        setSelectedTeacher(null);
        setIsAddingNew(true);
        toast.info("Ready to add a new teacher!");
    };

    const handleSaveTeacher = async (teacherData, teacherId) => {
        const token = localStorage.getItem('dashboard');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        };

        try {
            let response;
            if (teacherId) {
                response = await axios.put(`${API_BASE_URL}/teachers/${teacherId}`, teacherData, config);
                setTeachers(teachers.map(t => (t._id === teacherId ? response.data : t)));
                setSelectedTeacher(response.data);
            } else {
                response = await axios.post(`${API_BASE_URL}`, teacherData, config);
                setTeachers([...teachers, response.data]);
                setSelectedTeacher(response.data);
            }
            setIsAddingNew(false);
            return true;
        } catch (err) {
            console.error('Error saving teacher:', err);
            throw err;
        }
    };

    const handleDeleteTeacher = async (teacherId) => {
        if (!window.confirm('Are you sure you want to delete this teacher? This action cannot be undone.')) {
            return;
        }

        const token = localStorage.getItem('dashboard');
        const config = {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
        };

        try {
            await axios.delete(`${API_BASE_URL}/${teacherId}`, config);
            setTeachers(teachers.filter(t => t._id !== teacherId));
            setSelectedTeacher(null);
            toast.success('Teacher deleted successfully!');
        } catch (err) {
            console.error('Error deleting teacher:', err);
            toast.error(`Failed to delete teacher: ${err.response?.data?.msg || err.message}`);
        }
    };

    const handleCancelAddNew = () => {
        setIsAddingNew(false);
        setSelectedTeacher(null);
        if (teachers.length > 0) {
            setSelectedTeacher(teachers[0]);
        }
        else {
            setSelectedTeacher(null);
        }
        toast.info("Add new teacher cancelled.");
    };

    return (
        <div className="h-full bg-gray-100  font-sans">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
                    <strong className="font-bold">Error:</strong>
                    <span className="block sm:inline ml-2">{error}</span>
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-6 h-full">
                <div className="w-full lg:w-1/3 bg-white p-4 rounded-lg shadow-lg flex flex-col overflow-hidden">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-3">Teachers List</h2>
                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        {isLoading ? (
                            <SkeletonList />
                        ) : teachers.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">No teachers found. Add a new one!</p>
                        ) : (
                            teachers.map(teacher => (
                                <TeacherCard
                                    key={teacher._id}
                                    teacher={teacher}
                                    isSelected={selectedTeacher?._id === teacher._id}
                                    onSelectTeacher={handleSelectTeacher}
                                />
                            ))
                        )}
                    </div>
                    <button
                        onClick={handleAddTeacherClick}
                        className="mt-4 w-full flex items-center justify-center px-4 py-3 bg-indigo-600 text-white rounded-md shadow-md hover:bg-indigo-700 transition-colors duration-200"
                    >
                        <PlusCircle className="w-5 h-5 mr-2" /> Add New Teacher
                    </button>
                </div>

                <div className="w-full lg:w-2/3">
                    <TeacherDetails
                        teacher={selectedTeacher}
                        onSave={handleSaveTeacher}
                        onDelete={handleDeleteTeacher}
                        isAddingNew={isAddingNew}
                        onCancelAdd={handleCancelAddNew}
                    />
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;