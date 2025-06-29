import { ConfirmationModal } from "./ConfirmationModal";
import { useState, useEffect } from "react";
import { FaPlus, FaTrashAlt, FaEdit, FaTimes, FaSave, FaCalendarAlt, FaClock, FaBookOpen, FaUser, FaPhone, FaEnvelope, FaGlobe, FaPercent, FaStar } from 'react-icons/fa'; // Added FaStar for potential future use or rating
import axios from "axios";

export const DoctorDetailsPanel = ({
    doctor,
    isAddingNewDoctor,
    onEdit,
    onDelete,
    onCreate,
    onCancel,
    allSpecialties,
    allServices
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editableDoctor, setEditableDoctor] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Helper to generate a unique ID for new doctors (client-side, for temporary use before saving)
    const generateId = () => `new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    useEffect(() => {
        if (isAddingNewDoctor) {
            setEditableDoctor({
                id: generateId(), // Client-side generated ID for new entry
                name: '',
                experience: '',
                phone: '',
                email: '',
                bio: '',
                operatingHours: '',
                regularHours: '',
                languages: [],
                specialization: [],
                Hospital: '60d0fe4f9e1e9c0015b6d5e0', // Assuming a default hospital ID
                image: 'https://placehold.co/100x100/e0e0e0/888888?text=Photo',
                operationSuccessRate: '',
                isAvaliable: true,
                degree: '',
                onleave: false,
                reason: '',
            });
            setIsEditing(true);
        } else {
            setEditableDoctor(doctor ? {
                ...doctor,
                specialization: Array.isArray(doctor.specialization) ? doctor.specialization : [doctor.specialization || ''],
                languages: Array.isArray(doctor.languages) ? doctor.languages : [doctor.languages || ''],
                availabilityStatus: doctor.isAvaliable ? 'Available' : (doctor.onleave ? 'On Leave' : 'On Call'),
                phone: doctor.phone || '',
                email: doctor.email || '',
                bio: doctor.bio || '',
                operatingHours: doctor.operatingHours || '',
                regularHours: doctor.regularHours || '',
                onleave: doctor.onleave || false,
                reason: doctor.reason || '',
            } : null);
            setIsEditing(false);
        }
    }, [doctor, isAddingNewDoctor]);

    if (!doctor && !isAddingNewDoctor) {
        return (
            <div className="flex-grow flex items-center justify-center bg-gray-100 p-6 m-4 rounded-lg shadow-md min-h-[400px]">
                <p className="text-gray-500 text-xl font-medium">Select a doctor or add a new one to view details.</p>
            </div>
        );
    }

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === 'languages' || name === 'specialization') {
            setEditableDoctor(prev => ({
                ...prev,
                [name]: value.split(',').map(item => item.trim()).filter(item => item)
            }));
        } else if (name === 'availabilityStatus') {
            const newIsAvailable = value === 'Available';
            const newOnLeave = value === 'On Leave';

            setEditableDoctor(prev => ({
                ...prev,
                availabilityStatus: value,
                isAvaliable: newIsAvailable,
                onleave: newOnLeave,
                reason: newOnLeave ? (prev.reason || 'Not specified') : '',
            }));
        } else if (type === 'checkbox') {
            setEditableDoctor(prev => ({ ...prev, [name]: checked }));
        } else {
            setEditableDoctor(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSave = () => {
        const doctorToSave = {
            id: editableDoctor._id,
            name: editableDoctor.name,
            experience: editableDoctor.experience,
            phone: editableDoctor.phone,
            email: editableDoctor.email,
            bio: editableDoctor.bio,
            operatingHours: editableDoctor.operatingHours,
            regularHours: editableDoctor.regularHours,
            languages: editableDoctor.languages,
            specialization: editableDoctor.specialization,
            Hospital: editableDoctor.Hospital,
            image: editableDoctor.image,
            operationSuccessRate: editableDoctor.operationSuccessRate,
            isAvaliable: editableDoctor.isAvaliable,
            degree: editableDoctor.degree,
            onleave: editableDoctor.onleave,
            reason: editableDoctor.reason,
        };

        const url = `${import.meta.env.VITE_SERVER_URL}/api/doctor/doctor/${editableDoctor._id}`;
        axios.put(url, doctorToSave, { withCredentials: true })
            .then((response) => {
                console.log(response.data);
                if (isAddingNewDoctor) {
                    onCreate(response.data); // Pass the newly created doctor data
                } else {
                    onEdit(response.data); // Pass the updated doctor data
                }
                setIsEditing(false);
                onCancel(); // Call onCancel to potentially close the panel or reset state in parent
            })
            .catch((error) => {
                console.log(error);
                // Handle error (e.g., show an error message to the user)
            });
    };

    const handleCancelEdit = () => {
        if (isAddingNewDoctor) {
            onCancel();
        } else {
            setEditableDoctor({
                ...doctor,
                specialization: Array.isArray(doctor.specialization) ? doctor.specialization : [doctor.specialization || ''],
                languages: Array.isArray(doctor.languages) ? doctor.languages : [doctor.languages || ''],
                availabilityStatus: doctor.isAvaliable ? 'Available' : (doctor.onleave ? 'On Leave' : 'On Call'),
                phone: doctor.phone || '',
                email: doctor.email || '',
                bio: doctor.bio || '',
                operatingHours: doctor.operatingHours || '',
                regularHours: doctor.regularHours || '',
                onleave: doctor.onleave || false,
                reason: doctor.reason || '',
            });
            setIsEditing(false);
        }
    };

    const handleDeleteClick = () => {
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        onDelete(doctor._id); // Assuming _id is used for deletion
        setShowDeleteConfirm(false);
    };

    const cancelDelete = () => {
        setShowDeleteConfirm(false);
    };

    const renderDisplayField = (label, value, Icon = null) => (
        <p className="mb-2 text-gray-700 flex items-center">
            {Icon && <Icon size={18} className="mr-2 text-blue-600" />}
            <strong className="text-blue-700 min-w-[120px] inline-block">{label}:</strong>
            <span>{value || 'N/A'}</span>
        </p>
    );

    const renderInputField = (label, name, value, type = 'text', placeholder = '', isTextArea = false, options = []) => (
        <div className="mb-4">
            <label htmlFor={name} className="block text-gray-700 text-sm font-semibold mb-2">{label}</label>
            {isTextArea ? (
                <textarea
                    id={name}
                    name={name}
                    value={value}
                    onChange={handleInputChange}
                    placeholder={placeholder}
                    rows="4"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 resize-y"
                ></textarea>
            ) : type === 'select' ? (
                <select
                    id={name}
                    name={name}
                    value={value}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                >
                    <option value="">Select {label.toLowerCase()}</option>
                    {options.map(opt => (
                        <option key={opt.value || opt} value={opt.value || opt}>{opt.label || opt}</option>
                    ))}
                </select>
            ) : type === 'checkbox' ? (
                <input
                    id={name}
                    type="checkbox"
                    name={name}
                    checked={value}
                    onChange={handleInputChange}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
            ) : (
                <input
                    id={name}
                    type={type}
                    name={name}
                    value={value}
                    onChange={handleInputChange}
                    placeholder={placeholder}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                />
            )}
        </div>
    );

    return (
        <div className="flex-grow bg-white p-6 shadow-xl rounded-lg m-4 flex flex-col h-screen">
            <h3 className="text-3xl font-extrabold text-blue-800 mb-6 pb-4 border-b-2 border-blue-200 sticky top-0 bg-white z-10">
                {isAddingNewDoctor ? 'Create New Doctor Profile' : 'Doctor Profile Details'}
            </h3>

            <div className="flex-grow overflow-y-auto pr-4 -mr-4 custom-scrollbar"> {/* Added custom-scrollbar class for styling */}
                {isEditing ? (
                    <div className="space-y-6">
                        <div className="flex items-center space-x-6 mb-8 p-4 bg-blue-50 rounded-lg shadow-inner">
                            <div className="w-32 h-32 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 border-4 border-blue-300 shadow-md">
                                <img
                                    src={editableDoctor?.image || 'https://placehold.co/100x100/e0e0e0/888888?text=No+Photo'}
                                    alt="Doctor"
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100x100/e0e0e0/888888?text=No+Photo'; }}
                                />
                            </div>
                            <div className="flex-grow">
                                {renderInputField("Photo URL", "image", editableDoctor.image || '', 'text', 'Enter image URL')}
                            </div>
                        </div>

                        {renderInputField("Full Name", "name", editableDoctor.name || '', 'text', 'Dr. John Doe')}
                        {renderInputField("Specialization (comma-separated)", "specialization", editableDoctor.specialization?.join(', ') || '', 'text', 'e.g., Cardiology, Surgery')}
                        {renderInputField("Degree", "degree", editableDoctor.degree || '', 'text', 'e.g., MD, PhD')}
                        {renderInputField("Experience", "experience", editableDoctor.experience || '', 'text', 'e.g., 10 Years')}
                        {renderInputField("Phone", "phone", editableDoctor.phone || '', 'tel', 'e.g., +91 98765 43210')}
                        {renderInputField("Email", "email", editableDoctor.email || '', 'email', 'e.g., doctor@hospital.com')}
                        {renderInputField("Bio / About Section", "bio", editableDoctor.bio || '', 'text', 'A brief description...', true)}
                        {renderInputField("Operating Hours", "operatingHours", editableDoctor.operatingHours || '', 'text', 'e.g., 9:00 AM - 5:00 PM')}
                        {renderInputField("Regular Hours", "regularHours", editableDoctor.regularHours || '', 'text', 'e.g., Mon-Fri, 9 AM - 5 PM')}
                        {renderInputField("Languages Spoken (comma-separated)", "languages", editableDoctor.languages?.join(', ') || '', 'text', 'e.g., English, Hindi, German')}
                        {renderInputField("Operation Success Rate", "operationSuccessRate", editableDoctor.operationSuccessRate || '', 'text', 'e.g., 95%')}

                        <div className="mb-4">
                            <label htmlFor="availabilityStatus" className="block text-gray-700 text-sm font-semibold mb-2">Availability Status</label>
                            {renderInputField("Availability Status", "availabilityStatus", editableDoctor.availabilityStatus, 'select', '', [
                                { value: 'Available', label: 'Available' },
                                { value: 'On Leave', label: 'On Leave' },
                                { value: 'On Call', label: 'On Call' }
                            ])}
                        </div>

                        {editableDoctor.availabilityStatus === 'On Leave' && (
                            <div className="mb-4">
                                {renderInputField("Reason for Leave", "reason", editableDoctor.reason || '', 'text', 'e.g., Vacation, Conference')}
                            </div>
                        )}

                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="flex items-start space-x-6 mb-8 p-4 bg-blue-50 rounded-lg shadow-inner">
                            <div className="w-32 h-32 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 shadow-lg border-4 border-blue-400">
                                <img
                                    src={doctor?.image || 'https://placehold.co/100x100/e0e0e0/888888?text=No+Photo'}
                                    alt="Doctor"
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100x100/e0e0e0/888888?text=No+Photo'; }}
                                />
                            </div>
                            <div>
                                <h4 className="text-4xl font-extrabold text-blue-900 mb-1">{doctor.name}</h4>
                                <p className="text-xl text-gray-700 font-medium mb-2">{doctor.specialization?.join(', ') || 'N/A'}</p>
                                <span className={`text-sm font-bold px-4 py-1 rounded-full mt-2 inline-block shadow-sm ${
                                    doctor.isAvaliable ? 'bg-green-100 text-green-700' :
                                    (doctor.onleave ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700')
                                }`}>
                                    {doctor.isAvaliable ? 'Available' : (doctor.onleave ? 'On Leave' : 'On Call')}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 text-base p-4 border border-blue-100 rounded-lg bg-white shadow-sm">
                            {renderDisplayField("Degree", doctor.degree, FaBookOpen)}
                            {renderDisplayField("Experience", doctor.experience, FaClock)}
                            {renderDisplayField("Phone", doctor.phone, FaPhone)}
                            {renderDisplayField("Email", doctor.email, FaEnvelope)}
                            {renderDisplayField("Operation Success Rate", doctor.operationSuccessRate, FaPercent)}
                            {renderDisplayField("Languages", doctor.languages?.join(', ') || 'N/A', FaGlobe)}
                            {renderDisplayField("Operating Hours", doctor.operatingHours, FaClock)}
                            {renderDisplayField("Regular Hours", doctor.regularHours, FaClock)}
                        </div>

                        <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm">
                            <h5 className="text-xl font-bold text-blue-700 mb-3 flex items-center"><FaUser size={20} className="mr-2" /> About Dr. {doctor.name.split(' ')[0]}</h5>
                            <p className="text-gray-800 leading-relaxed">{doctor.bio || 'No bio provided.'}</p>
                        </div>

                        <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm">
                            <h5 className="text-xl font-bold text-blue-700 mb-3 flex items-center"><FaStar size={20} className="mr-2" /> Specializations</h5>
                            <div className="flex flex-wrap gap-3">
                                {doctor.specialization?.length > 0 ? doctor.specialization.map(spec => (
                                    <span key={spec} className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold shadow-sm hover:bg-blue-200 transition duration-200">
                                        {spec}
                                    </span>
                                )) : <p className="text-gray-600 italic text-sm">No specializations listed.</p>}
                            </div>
                        </div>

                        {doctor.onleave && (
                            <div className="mt-6 p-4 border border-red-200 rounded-lg bg-red-50 shadow-sm">
                                <h5 className="text-xl font-bold text-red-700 mb-3 flex items-center"><FaCalendarAlt size={20} className="mr-2" /> Current Unavailability</h5>
                                <p className="text-red-800 italic">Reason: {doctor.reason || 'Not specified'}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="flex justify-end space-x-3 mt-8 pt-4 border-t-2 border-gray-100 sticky bottom-0 bg-white z-10 -mx-8 px-8"> {/* Sticky footer */}
                {isEditing ? (
                    <>
                        <button
                            onClick={handleSave}
                            className="flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300 transform hover:scale-105"
                        >
                            <FaSave size={20} className="mr-2" /> {isAddingNewDoctor ? 'Create Profile' : 'Save Changes'}
                        </button>
                        <button
                            onClick={handleCancelEdit}
                            className="flex items-center px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition duration-300 transform hover:scale-105"
                        >
                            <FaTimes size={20} className="mr-2" /> Cancel
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300 transform hover:scale-105"
                        >
                            <FaEdit size={20} className="mr-2" /> Edit Profile
                        </button>
                        <button
                            onClick={handleDeleteClick}
                            className="flex items-center px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition duration-300 transform hover:scale-105"
                        >
                            <FaTrashAlt size={20} className="mr-2" /> Delete Profile
                        </button>
                    </>
                )}
            </div>

            <ConfirmationModal
                show={showDeleteConfirm}
                message={`Are you sure you want to delete Dr. ${doctor?.name}'s profile? This action cannot be undone.`}
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
            />
        </div>
    );
};