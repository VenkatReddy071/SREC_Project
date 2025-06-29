
import React, { useState, useEffect } from 'react';
import { ConfirmationModal } from "./ConfirmationModal";
import { DoctorsListSidebar } from "./DoctorsListSidebar";
import { DoctorDetailsPanel } from "./DoctorDetailsPanel";
import Axios from "axios";

const DoctorsSection = () => {
    const [doctors, setDoctors] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [availabilityFilter, setAvailabilityFilter] = useState('all');
    const [specialtyFilter, setSpecialtyFilter] = useState('all');
    const [isAddingNewDoctor, setIsAddingNewDoctor] = useState(false);
    const [hospitalSpecializations, setHospitalSpecializations] = useState([]);
    const API_BASE_URL = import.meta.env.VITE_SERVER_URL;

    useEffect(() => {
        const fetchDoctorsAndHospital = async () => {
            const token = localStorage.getItem("dashboard");
            if (!token) {
                console.error("No authentication token found.");
                return;
            }

            try {
                // Fetch hospital details including specializations
                const hospitalResponse = await Axios.get(`${API_BASE_URL}/api/hospitals/hospital/email`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                    withCredentials: true
                });
                setHospitalSpecializations(hospitalResponse.data.hospital.specialization || []);
                setDoctors(hospitalResponse.data.doctors || []);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchDoctorsAndHospital();
    }, []);

    useEffect(() => {
        let tempDoctors = [...doctors];

        if (searchTerm) {
            tempDoctors = tempDoctors.filter(doctor =>
                doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                doctor.specialization.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        if (availabilityFilter !== 'all') {
            if (availabilityFilter === 'Available') {
                tempDoctors = tempDoctors.filter(doctor => doctor.isAvaliable && !doctor.onleave);
            } else if (availabilityFilter === 'On Leave') {
                tempDoctors = tempDoctors.filter(doctor => doctor.onleave);
            } else if (availabilityFilter === 'On Call') {
                tempDoctors = tempDoctors.filter(doctor => !doctor.isAvaliable && !doctor.onleave);
            }
        }

        if (specialtyFilter !== 'all') {
            tempDoctors = tempDoctors.filter(doctor => doctor.specialization.includes(specialtyFilter));
        }

        setFilteredDoctors(tempDoctors);
    }, [searchTerm, availabilityFilter, specialtyFilter, doctors]);

    const handleSelectDoctor = (doctor) => {
        setSelectedDoctor(doctor);
        setIsAddingNewDoctor(false);
    };

    const handleCreateDoctor = (newDoctor) => {
        setDoctors(prev => [...prev, newDoctor]);
        setSelectedDoctor(newDoctor);
        setIsAddingNewDoctor(false);
    };

    const handleEditDoctor = (updatedDoctor) => {
        const updatedDoctors = doctors.map(doc =>
            doc._id === updatedDoctor._id ? updatedDoctor : doc
        );
        setDoctors(updatedDoctors);
        if (selectedDoctor && selectedDoctor._id === updatedDoctor._id) {
            setSelectedDoctor(updatedDoctor);
        }
    };

    const handleDeleteDoctor = (doctorId) => {
        const remainingDoctors = doctors.filter(doc => doc._id !== doctorId);
        setDoctors(remainingDoctors);
        if (selectedDoctor && selectedDoctor._id === doctorId) {
            setSelectedDoctor(null);
        }
    };

    const handleAddNewDoctor = () => {
        setSelectedDoctor(null);
        setIsAddingNewDoctor(true);
    };

    const handleCancelAddEdit = () => {
        setIsAddingNewDoctor(false);
        setSelectedDoctor(null);
    };

    return (
        <div className="flex h-screen bg-gray-50 font-inter">
            <div className="w-[35%]">
                <DoctorsListSidebar
                    doctors={filteredDoctors}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    availabilityFilter={availabilityFilter}
                    setAvailabilityFilter={setAvailabilityFilter}
                    specialtyFilter={specialtyFilter}
                    setSpecialtyFilter={setSpecialtyFilter}
                    onSelectDoctor={handleSelectDoctor}
                    selectedDoctorId={selectedDoctor ? selectedDoctor._id : null}
                    onAddNewDoctor={handleAddNewDoctor}
                    onDeleteDoctor={handleDeleteDoctor}
                    allSpecialties={hospitalSpecializations}
                />
            </div>
            <div className="w-full h-screen overflow-y-scroll">
                <DoctorDetailsPanel
                    doctor={selectedDoctor}
                    isAddingNewDoctor={isAddingNewDoctor}
                    onEdit={handleEditDoctor}
                    onDelete={handleDeleteDoctor}
                    onCreate={handleCreateDoctor}
                    onCancel={handleCancelAddEdit}
                    allSpecialties={hospitalSpecializations}
                />
            </div>
        </div>
    );
};

export default DoctorsSection;