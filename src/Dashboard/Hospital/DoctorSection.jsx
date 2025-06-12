import React, { useState, useEffect } from 'react';

import {ConfirmationModal} from "./ConfirmationModal"
import {DoctorsListSidebar} from "./DoctorsListSidebar";
import {DoctorDetailsPanel} from "./DoctorDetailsPanel"
import Axios from "axios";

const allSpecialties = ['Cardiology', 'Pediatrics', 'Neurology', 'Orthopedics', 'General Medicine', 'Dermatology', 'Oncology'];
const allServices = ['Heart Check-up', 'ECG', 'Stress Test', 'Angiography', 'Child Vaccinations', 'Growth Monitoring', 'Fever Consultation', 'EEG', 'EMG', 'Stroke Rehabilitation', 'Fracture Treatment', 'Joint Replacement', 'Arthroscopy', 'Diabetes Management', 'Skin Biopsy', 'Chemotherapy'];

const DoctorsSection = () => {
    const [doctors, setDoctors] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [availabilityFilter, setAvailabilityFilter] = useState('all');
    const [specialtyFilter, setSpecialtyFilter] = useState('all');
    const [isAddingNewDoctor, setIsAddingNewDoctor] = useState(false);
    const [specalization,setSpecalization]=useState([]);
    useEffect(() => {
        let tempDoctors = doctors;

        if (searchTerm) {
            tempDoctors = tempDoctors.filter(doctor =>
                doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                doctor.specialization.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        if (availabilityFilter !== 'all') {
            const isAvailableBool = availabilityFilter === 'Available';
            tempDoctors = tempDoctors.filter(doctor => doctor.isAvaliable === isAvailableBool);
        }

        if (specialtyFilter !== 'all') {
            tempDoctors = tempDoctors.filter(doctor => doctor.specialization.includes(specialtyFilter));
        }

        setFilteredDoctors(tempDoctors);
    }, [searchTerm, availabilityFilter, specialtyFilter, doctors]);
    useEffect(()=>{
        const fetchDoctors=()=>{

            const token=localStorage.getItem("dashboard");
            const url=`${import.meta.env.VITE_SERVER_URL}/api/hospitals/hospital/email`
            Axios.get(url,{headers:{'Authorization': `Bearer ${token}`},withCredentials:true})
            .then((response)=>{
                console.log(response.data);
                setDoctors(response.data.doctors);
                setSpecalization(response.data.hospital);
            })
            .catch((error)=>{
                console.log(error);
            })
        }
        fetchDoctors();
    },[])
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
            doc._id === updatedDoctor?._id ? updatedDoctor : doc
        );
        setDoctors(updatedDoctors);
        if (selectedDoctor && selectedDoctor?._id === updatedDoctor?._id) {
            setSelectedDoctor(updatedDoctor);
        }
    };

    const handleDeleteDoctor = (doctorId) => {
        const remainingDoctors = doctors.filter(doc => doc?._id !== doctorId);
        setDoctors(remainingDoctors);
        if (selectedDoctor && selectedDoctor?._id === doctorId) {
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
                selectedDoctorId={selectedDoctor ? selectedDoctor.id : null}
                onAddNewDoctor={handleAddNewDoctor}
                onDeleteDoctor={handleDeleteDoctor}
                allSpecialties={allSpecialties}
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
                allSpecialties={specalization}
                allServices={allServices}
            />
            </div>
            
        </div>
    );
};

export default DoctorsSection;
