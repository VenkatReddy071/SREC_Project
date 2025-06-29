
import { useState } from "react";
import { ConfirmationModal } from "./ConfirmationModal";
import { FaPlus, FaTrashAlt, FaSearch, FaFilter, FaTimes } from 'react-icons/fa'; // Updated icons for better fit

export const DoctorsListSidebar = ({
    doctors,
    searchTerm,
    setSearchTerm,
    availabilityFilter,
    setAvailabilityFilter,
    specialtyFilter,
    setSpecialtyFilter,
    onSelectDoctor,
    selectedDoctorId,
    onAddNewDoctor,
    onDeleteDoctor,
    allSpecialties
}) => {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [doctorToDelete, setDoctorToDelete] = useState(null);
    const [showFilters, setShowFilters] = useState(false);

    const handleDeleteClick = (e, doctor) => {
        e.stopPropagation();
        setDoctorToDelete(doctor);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        onDeleteDoctor(doctorToDelete?._id);
        setShowDeleteConfirm(false);
        setDoctorToDelete(null);
    };

    const cancelDelete = () => {
        setShowDeleteConfirm(false);
        setDoctorToDelete(null);
    };

    return (
        <div className="w-96 bg-white border-r border-gray-200 p-4 flex flex-col shadow-md rounded-lg m-4 h-screen">
            <h3 className="text-2xl font-bold text-blue-700 mb-6 border-b border-blue-100 pb-3">Doctors</h3>

            <div className="mb-4 flex items-center gap-2">
                <div className="relative flex-grow">
                    <input
                        type="text"
                        placeholder="Search by name or specialty..."
                        className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="p-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition duration-200"
                    aria-label="Toggle filters"
                >
                    {showFilters ? <FaTimes size={20} /> : <FaFilter size={20} />}
                </button>
            </div>

            {showFilters && (
                <div className="mb-6 pb-4 border-b border-gray-200 animate-fade-in transition-all duration-300 ease-in-out overflow-hidden">
                    <h4 className="text-lg font-semibold text-gray-700 mb-3">Filters</h4>
                    <div className="flex flex-col space-y-3">
                        <div>
                            <label htmlFor="availability-filter" className="block text-gray-600 text-sm font-medium mb-1">Availability:</label>
                            <select
                                id="availability-filter"
                                value={availabilityFilter}
                                onChange={(e) => setAvailabilityFilter(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                            >
                                <option value="all">All</option>
                                <option value="Available">Available</option>
                                <option value="On Leave">On Leave</option>
                                <option value="On Call">On Call</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="specialty-filter" className="block text-gray-600 text-sm font-medium mb-1">Specialty:</label>
                            <select
                                id="specialty-filter"
                                value={specialtyFilter}
                                onChange={(e) => setSpecialtyFilter(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                            >
                                <option value="all">All Specialties</option>
                                {allSpecialties.sort().map(specialty => (
                                    <option key={specialty} value={specialty}>{specialty}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex-grow overflow-y-auto pr-2 -mr-2">
                {doctors.length === 0 ? (
                    <p className="text-center text-gray-500 italic mt-8">No doctors found matching criteria.</p>
                ) : (
                    <ul className="space-y-3">
                        {doctors.map(doctor => (
                            <li
                                key={doctor._id}
                                className={`flex flex-col p-4 rounded-lg shadow-sm border ${selectedDoctorId === doctor._id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'} hover:bg-gray-50 cursor-pointer transition duration-200`}
                                onClick={() => onSelectDoctor(doctor)}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="text-lg font-semibold text-gray-800">{doctor.name}</h4>
                                    <button
                                        onClick={(e) => handleDeleteClick(e, doctor)}
                                        className="p-1 text-red-500 hover:bg-red-100 rounded-full transition duration-200"
                                        aria-label="Delete doctor"
                                    >
                                        <FaTrashAlt size={18} />
                                    </button>
                                </div>
                                <p className="text-sm text-gray-600 mb-1">
                                    <span className="font-medium">Specialty:</span> {doctor.specialization.join(', ')}
                                </p>
                                <p className="text-sm text-gray-600 mb-1 flex items-center">
                                    <span className="font-medium">Phone:</span> {doctor.phone}
                                </p>
                                <p className="text-sm text-gray-600 mb-2 flex items-center">
                                    <span className="font-medium">Email:</span> {doctor.email}
                                </p>
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full w-fit ${
                                    doctor.isAvaliable && !doctor.onleave ? 'bg-green-100 text-green-700' :
                                    doctor.onleave ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                    {doctor.isAvaliable && !doctor.onleave ? 'Available' : (doctor.onleave ? 'On Leave' : 'On Call')}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <button
                onClick={onAddNewDoctor}
                className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition duration-300 mt-6"
            >
                <FaPlus size={20} className="mr-2" /> Add New Doctor
            </button>

            <ConfirmationModal
                show={showDeleteConfirm}
                message={`Are you sure you want to delete Dr. ${doctorToDelete?.name}? This action cannot be undone.`}
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
            />
        </div>
    );
};