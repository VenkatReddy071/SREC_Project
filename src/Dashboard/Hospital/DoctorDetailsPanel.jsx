//  import {ConfirmationModal} from "./ConfirmationModal"
//  import {useState,useEffect}from "react"
//  import { FaPlus, FaTrashAlt, FaEdit, FaTimes, FaSave, FaCalendarAlt, FaClock, FaBookOpen, FaUser, FaPhone, FaEnvelope, FaGlobe, FaPercent } from 'react-icons/fa';
//  export const DoctorDetailsPanel = ({
//     doctor,
//     isAddingNewDoctor,
//     onEdit,
//     onDelete,
//     onCreate,
//     onCancel,
//     allSpecialties,
//     allServices
// }) => {
//     const [isEditing, setIsEditing] = useState(false);
//     const [editableDoctor, setEditableDoctor] = useState(null);

//     const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

//     useEffect(() => {
//         if (isAddingNewDoctor) {
//             setEditableDoctor({
//                 id: generateId(),
//                 name: '',
//                 experience: '',
//                 specialization: [],
//                 Hospital: '60d0fe4f9e1e9c0015b6d5e0',
//                 image: 'https://placehold.co/100x100/e0e0e0/888888?text=Photo',
//                 operationSuccessRate: '',
//                 isAvaliable: true,
//                 degree: '',
//                 department: '',
//                 bio: '',
//                 contact: { phone: '', email: '' },
//                 languagesSpoken: [],
//                 availabilityStatus: 'Available',
//                 regularHours: '',
//                 leaveDates: [],
//                 consultationDurationMinutes: 30,
//                 associatedServices: []
//             });
//             setIsEditing(true);
//         } else {
//             setEditableDoctor(doctor ? {
//                 ...doctor,
//                 specialization: Array.isArray(doctor.specialization) ? doctor.specialization : [doctor.specialization || ''],
//                 availabilityStatus: doctor.isAvaliable ? 'Available' : (doctor.availabilityStatus || 'On Leave')
//             } : null);
//             setIsEditing(false);
//         }
//     }, [doctor, isAddingNewDoctor]);

//     if (!doctor && !isAddingNewDoctor) {
//         return (
//             <div className="flex-grow flex items-center justify-center bg-gray-100 p-6 m-4 rounded-lg shadow-md">
//                 <p className="text-gray-500 text-xl font-medium">Select a doctor or add a new one to view details.</p>
//             </div>
//         );
//     }

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;

//         if (name.startsWith('contact.')) {
//             setEditableDoctor(prev => ({
//                 ...prev,
//                 contact: { ...prev.contact, [name.split('.')[1]]: value }
//             }));
//         } else if (name === 'languagesSpoken' || name === 'associatedServices' || name === 'specialization') {
//             setEditableDoctor(prev => ({
//                 ...prev,
//                 [name]: value.split(',').map(item => item.trim()).filter(item => item)
//             }));
//         } else if (name === 'availabilityStatus') {
//             const newIsAvailable = value === 'Available';
//             setEditableDoctor(prev => ({
//                 ...prev,
//                 availabilityStatus: value,
//                 isAvaliable: newIsAvailable
//             }));
//         }
//          else {
//             setEditableDoctor(prev => ({ ...prev, [name]: value }));
//         }
//     };

//     const handleLeaveDateChange = (index, field, value) => {
//         const newLeaveDates = [...editableDoctor.leaveDates];
//         if (!newLeaveDates[index]) {
//             newLeaveDates[index] = { startDate: '', endDate: '', reason: '' };
//         }
//         newLeaveDates[index][field] = value;
//         setEditableDoctor(prev => ({ ...prev, leaveDates: newLeaveDates }));
//     };

//     const addLeaveEntry = () => {
//         setEditableDoctor(prev => ({
//             ...prev,
//             leaveDates: [...prev.leaveDates, { startDate: '', endDate: '', reason: '' }]
//         }));
//     };

//     const removeLeaveEntry = (index) => {
//         setEditableDoctor(prev => ({
//             ...prev,
//             leaveDates: prev.leaveDates.filter((_, i) => i !== index)
//         }));
//     };

//     const handleSave = () => {
//         const doctorToSave = {
//             id: editableDoctor.id,
//             name: editableDoctor.name,
//             experience: editableDoctor.experience,
//             specialization: editableDoctor.specialization,
//             Hospital: editableDoctor.Hospital,
//             image: editableDoctor.image,
//             operationSuccessRate: editableDoctor.operationSuccessRate,
//             isAvaliable: editableDoctor.isAvaliable,
//             degree: editableDoctor.degree,
//             department: editableDoctor.department,
//             bio: editableDoctor.bio,
//             contact: editableDoctor.contact,
//             languagesSpoken: editableDoctor.languagesSpoken,
//             availabilityStatus: editableDoctor.availabilityStatus,
//             regularHours: editableDoctor.regularHours,
//             leaveDates: editableDoctor.leaveDates,
//             consultationDurationMinutes: editableDoctor.consultationDurationMinutes,
//             associatedServices: editableDoctor.associatedServices,
//         };

//         if (isAddingNewDoctor) {
//             onCreate(doctorToSave);
//         } else {
//             onEdit(doctorToSave);
//         }
//         setIsEditing(false);
//         onCancel();
//     };

//     const handleCancelEdit = () => {
//         if (isAddingNewDoctor) {
//             onCancel();
//         } else {
//             setEditableDoctor({
//                 ...doctor,
//                 specialization: Array.isArray(doctor.specialization) ? doctor.specialization : [doctor.specialization || ''],
//                 availabilityStatus: doctor.isAvaliable ? 'Available' : (doctor.availabilityStatus || 'On Leave')
//             });
//             setIsEditing(false);
//         }
//     };

//     const handleDeleteClick = () => {
//         setShowDeleteConfirm(true);
//     };

//     const confirmDelete = () => {
//         onDelete(doctor.id);
//         setShowDeleteConfirm(false);
//     };

//     const cancelDelete = () => {
//         setShowDeleteConfirm(false);
//     };

//     const renderDisplayField = (label, value, Icon = null) => (
//         <p className="mb-2 text-gray-700 flex items-center">
//             {Icon && <Icon size={18} className="mr-2 text-blue-600" />}
//             <strong className="text-blue-700 min-w-[120px] inline-block">{label}:</strong>
//             <span>{value}</span>
//         </p>
//     );

//     const renderInputField = (label, name, value, type = 'text', placeholder = '', isTextArea = false, options = []) => (
//         <div className="mb-4">
//             <label htmlFor={name} className="block text-gray-700 text-sm font-semibold mb-2">{label}</label>
//             {isTextArea ? (
//                 <textarea
//                     id={name}
//                     name={name}
//                     value={value}
//                     onChange={handleInputChange}
//                     placeholder={placeholder}
//                     rows="4"
//                     className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 resize-y"
//                 ></textarea>
//             ) : type === 'select' ? (
//                 <select
//                     id={name}
//                     name={name}
//                     value={value}
//                     onChange={handleInputChange}
//                     className="w-full p-3 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
//                 >
//                     <option value="">Select {label.toLowerCase()}</option>
//                     {options.map(opt => (
//                         <option key={opt} value={opt}>{opt}</option>
//                     ))}
//                 </select>
//             ) : (
//                 <input
//                     id={name}
//                     type={type}
//                     name={name}
//                     value={value}
//                     onChange={handleInputChange}
//                     placeholder={placeholder}
//                     className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
//                 />
//             )}
//         </div>
//     );

//     return (
//         <div className="flex-grow bg-white p-8 shadow-md rounded-lg m-4 overflow-y-auto">
//             <h3 className="text-2xl font-bold text-blue-700 mb-6 pb-3 border-b border-blue-100">
//                 {isAddingNewDoctor ? 'Create New Doctor Profile' : 'Doctor Profile Details'}
//             </h3>

//             {isEditing ? (
//                 <div className="space-y-6">
//                     <div className="flex items-center space-x-6 mb-8">
//                         <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0">
//                             <img
//                                 src={editableDoctor?.image || 'https://placehold.co/100x100/e0e0e0/888888?text=No+Photo'}
//                                 alt="Doctor"
//                                 className="w-full h-full object-cover"
//                                 onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100x100/e0e0e0/888888?text=No+Photo'; }}
//                             />
//                         </div>
//                         <div className="flex-grow">
//                             {renderInputField("Photo URL", "image", editableDoctor.image || '', 'text', 'Enter image URL')}
//                         </div>
//                     </div>

//                     {renderInputField("Full Name", "name", editableDoctor.name || '', 'text', 'Dr. John Doe')}
//                     {renderInputField("Specialization (comma-separated)", "specialization", editableDoctor.specialization?.join(', ') || '', 'text', 'e.g., Cardiology, Surgery')}
//                     {renderInputField("Degree", "degree", editableDoctor.degree || '', 'text', 'e.g., MD, PhD')}
//                     {renderInputField("Experience", "experience", editableDoctor.experience || '', 'text', 'e.g., 10 Years')}
//                     {renderInputField("Department", "department", editableDoctor.department || '', 'text', 'e.g., Cardiology')}
//                     {renderInputField("Bio / About Section", "bio", editableDoctor.bio || '', 'text', 'A brief description...', true)}
//                     {renderInputField("Phone", "contact.phone", editableDoctor.contact?.phone || '', 'text', 'e.g., +91 98765 43210')}
//                     {renderInputField("Email", "contact.email", editableDoctor.contact?.email || '', 'email', 'e.g., doctor@hospital.com')}
//                     {renderInputField("Operation Success Rate", "operationSuccessRate", editableDoctor.operationSuccessRate || '', 'text', 'e.g., 95%')}
//                     {renderInputField("Languages Spoken (comma-separated)", "languagesSpoken", editableDoctor.languagesSpoken?.join(', ') || '', 'text', 'e.g., English, Hindi, German')}
//                     {renderInputField("Default Consultation Duration (minutes)", "consultationDurationMinutes", editableDoctor.consultationDurationMinutes || 0, 'number', 'e.g., 30')}
//                     {renderInputField("Regular Working Hours", "regularHours", editableDoctor.regularHours || '', 'text', 'e.g., Mon-Fri, 9 AM - 5 PM')}

//                     <div className="mb-4">
//                         <label htmlFor="availabilityStatus" className="block text-gray-700 text-sm font-semibold mb-2">Availability Status</label>
//                         <select
//                             id="availabilityStatus"
//                             name="availabilityStatus"
//                             value={editableDoctor.availabilityStatus}
//                             onChange={handleInputChange}
//                             className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
//                         >
//                             <option value="Available">Available</option>
//                             <option value="On Leave">On Leave</option>
//                             <option value="On Call">On Call</option>
//                         </select>
//                     </div>

//                     <div className="mb-4">
//                         <label htmlFor="associatedServices" className="block text-gray-700 text-sm font-semibold mb-2">Associated Services (comma-separated)</label>
//                         <input
//                             id="associatedServices"
//                             name="associatedServices"
//                             value={editableDoctor.associatedServices?.join(', ') || ''}
//                             onChange={handleInputChange}
//                             placeholder="e.g., Heart Check-up, ECG"
//                             className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
//                         />
//                         <p className="text-xs text-gray-500 mt-1">Available services: {allServices.join(', ')}</p>
//                     </div>

//                     <div className="mb-6 border border-gray-200 p-4 rounded-md bg-blue-50">
//                         <h5 className="text-md font-semibold text-blue-700 mb-3 flex items-center"><FaCalendarAlt size={18} className="mr-2" /> Leave/Unavailability</h5>
//                         {editableDoctor.leaveDates.length === 0 && (
//                             <p className="text-gray-600 italic text-sm mb-3">No leave periods added yet.</p>
//                         )}
//                         {editableDoctor.leaveDates.map((leave, index) => (
//                             <div key={index} className="flex flex-wrap items-center gap-3 mb-3 p-3 border border-blue-200 rounded-md bg-white shadow-sm">
//                                 <div className="flex-1 min-w-[120px]">
//                                     <label htmlFor={`leave-start-${index}`} className="block text-gray-600 text-xs mb-1">Start Date</label>
//                                     <input
//                                         id={`leave-start-${index}`}
//                                         type="date"
//                                         value={leave.startDate}
//                                         onChange={(e) => handleLeaveDateChange(index, 'startDate', e.target.value)}
//                                         className="w-full p-2 border border-gray-300 rounded-md text-sm"
//                                     />
//                                 </div>
//                                 <div className="flex-1 min-w-[120px]">
//                                     <label htmlFor={`leave-end-${index}`} className="block text-gray-600 text-xs mb-1">End Date</label>
//                                     <input
//                                         id={`leave-end-${index}`}
//                                         type="date"
//                                         value={leave.endDate}
//                                         onChange={(e) => handleLeaveDateChange(index, 'endDate', e.target.value)}
//                                         className="w-full p-2 border border-gray-300 rounded-md text-sm"
//                                     />
//                                 </div>
//                                 <div className="flex-1 min-w-[150px]">
//                                     <label htmlFor={`leave-reason-${index}`} className="block text-gray-600 text-xs mb-1">Reason</label>
//                                     <input
//                                         id={`leave-reason-${index}`}
//                                         type="text"
//                                         value={leave.reason}
//                                         onChange={(e) => handleLeaveDateChange(index, 'reason', e.target.value)}
//                                         placeholder="e.g., Vacation"
//                                         className="w-full p-2 border border-gray-300 rounded-md text-sm"
//                                     />
//                                 </div>
//                                 <button
//                                     onClick={() => removeLeaveEntry(index)}
//                                     className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200"
//                                     aria-label="Remove leave entry"
//                                 >
//                                     <FaTimes size={16} />
//                                 </button>
//                             </div>
//                         ))}
//                         <button
//                             onClick={addLeaveEntry}
//                             className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200 mt-4 text-sm"
//                         >
//                             <FaPlus size={16} className="mr-2" /> Add Leave Period
//                         </button>
//                     </div>

//                     <div className="flex justify-end space-x-3 mt-8">
//                         <button
//                             onClick={handleSave}
//                             className="flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition duration-300"
//                         >
//                             <FaSave size={20} className="mr-2" /> {isAddingNewDoctor ? 'Create Profile' : 'Save Changes'}
//                         </button>
//                         <button
//                             onClick={handleCancelEdit}
//                             className="flex items-center px-6 py-3 bg-gray-500 text-white font-semibold rounded-md shadow-md hover:bg-gray-600 transition duration-300"
//                         >
//                             <FaTimes size={20} className="mr-2" /> Cancel
//                         </button>
//                     </div>
//                 </div>
//             ) : (
//                 <div className="space-y-4">
//                     <div className="flex items-center space-x-6 mb-8">
//                         <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 shadow-lg">
//                             <img
//                                 src={doctor?.image || 'https://placehold.co/100x100/e0e0e0/888888?text=No+Photo'}
//                                 alt="Doctor"
//                                 className="w-full h-full object-cover"
//                                 onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100x100/e0e0e0/888888?text=No+Photo'; }}
//                             />
//                         </div>
//                         <div>
//                             <h4 className="text-3xl font-bold text-blue-800">{doctor.name}</h4>
//                             <p className="text-xl text-gray-600">{doctor.specialization?.join(', ') || 'N/A'}</p>
//                             <span className={`text-sm font-semibold px-3 py-1 rounded-full mt-2 inline-block ${
//                                 doctor.isAvaliable ? 'bg-green-100 text-green-700' :
//                                 (doctor.availabilityStatus === 'On Leave' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700')
//                             }`}>
//                                 {doctor.availabilityStatus}
//                             </span>
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 text-sm">
//                         {renderDisplayField("Degree", doctor.degree, FaBookOpen)}
//                         {renderDisplayField("Experience", doctor.experience, FaClock)}
//                         {renderDisplayField("Phone", doctor.contact?.phone, FaPhone)}
//                         {renderDisplayField("Email", doctor.contact?.email, FaEnvelope)}
//                         {renderDisplayField("Operation Success Rate", doctor.operationSuccessRate, FaPercent)}
//                         {renderDisplayField("Languages", doctor.languagesSpoken?.join(', ') || 'N/A', FaGlobe)}
//                         {renderDisplayField("Cons. Duration", `${doctor.consultationDurationMinutes} mins`)}
//                         {renderDisplayField("Regular Hours", doctor?.regularHours)}
//                     </div>

//                     <div className="mt-6">
//                         <h5 className="text-lg font-semibold text-blue-700 mb-2">Bio</h5>
//                         <p className="text-gray-700 leading-relaxed bg-blue-50 p-4 rounded-md shadow-inner">{doctor.bio || 'No bio provided.'}</p>
//                     </div>

//                     <div className="mt-6">
//                         <h5 className="text-lg font-semibold text-blue-700 mb-2">Associated Services</h5>
//                         <div className="flex flex-wrap gap-2">
//                             {doctor.specialization?.length > 0 ? doctor.specialization.map(service => (
//                                 <span key={service} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
//                                     {service}
//                                 </span>
//                             )) : <p className="text-gray-600 italic text-sm">No services listed.</p>}
//                         </div>
//                     </div>

//                     <div className="mt-6">
//                         <h5 className="text-lg font-semibold text-blue-700 mb-2 flex items-center"><FaCalendarAlt size={18} className="mr-2" /> Current Leave Periods</h5>
//                         {doctor.leaveDates?.length > 0 ? doctor.leaveDates.map((leave, index) => (
//                             <div key={index} className="bg-gray-50 p-3 rounded-md border border-gray-200 mb-2 text-sm">
//                                 <p><strong className="text-gray-800">From:</strong> {leave.startDate} <strong className="text-gray-800">To:</strong> {leave.endDate}</p>
//                                 <p className="text-gray-600 italic">Reason: {leave.reason || 'Not specified'}</p>
//                             </div>
//                         )) : <p className="text-gray-600 italic text-sm">No active leave periods.</p>}
//                     </div>

//                     <div className="flex justify-end space-x-3 mt-8">
//                         <button
//                             onClick={() => setIsEditing(true)}
//                             className="flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition duration-300"
//                         >
//                             <FaEdit size={20} className="mr-2" /> Edit Profile
//                         </button>
//                         <button
//                             onClick={handleDeleteClick}
//                             className="flex items-center px-6 py-3 bg-red-600 text-white font-semibold rounded-md shadow-md hover:bg-red-700 transition duration-300"
//                         >
//                             <FaTrashAlt size={20} className="mr-2" /> Delete Profile
//                         </button>
//                     </div>
//                 </div>
//             )}
//             <ConfirmationModal
//                 show={showDeleteConfirm}
//                 message={`Are you sure you want to delete Dr. ${doctor.name}'s profile? This action cannot be undone.`}
//                 onConfirm={confirmDelete}
//                 onCancel={cancelDelete}
//             />
//         </div>
//     );
// };

import { ConfirmationModal } from "./ConfirmationModal";
import { useState, useEffect } from "react";
import { FaPlus, FaTrashAlt, FaEdit, FaTimes, FaSave, FaCalendarAlt, FaClock, FaBookOpen, FaUser, FaPhone, FaEnvelope, FaGlobe, FaPercent } from 'react-icons/fa';
import axios from "axios"
export const DoctorDetailsPanel = ({
    doctor,
    isAddingNewDoctor,
    onEdit,
    onDelete,
    onCreate,
    onCancel,
    allSpecialties, // Though not directly used for dropdowns in this version, kept for context
    allServices // Though not directly used for dropdowns in this version, kept for context
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
                phone: '', // Changed from contact.phone
                email: '', // Changed from contact.email
                bio: '',
                operatingHours: '', // New field
                regularHours: '',
                languages: [], // Changed from languagesSpoken
                specialization: [],
                Hospital: '60d0fe4f9e1e9c0015b6d5e0', // Assuming a default hospital ID for new doctors
                image: 'https://placehold.co/100x100/e0e0e0/888888?text=Photo',
                operationSuccessRate: '',
                isAvaliable: true,
                degree: '',
                onleave: false, // New field
                reason: '', // New field, dependent on onleave
            });
            setIsEditing(true);
        } else {
            setEditableDoctor(doctor ? {
                ...doctor,
                // Ensure arrays are arrays, even if single string from backend
                specialization: Array.isArray(doctor.specialization) ? doctor.specialization : [doctor.specialization || ''],
                languages: Array.isArray(doctor.languages) ? doctor.languages : [doctor.languages || ''],
                // Map backend onleave/reason to frontend availabilityStatus for consistent display logic
                availabilityStatus: doctor.isAvaliable ? 'Available' : (doctor.onleave ? 'On Leave' : 'On Call'),
                // Set default values for new schema fields if they don't exist in existing doctor object
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
            <div className="flex-grow flex items-center justify-center bg-gray-100 p-6 m-4 rounded-lg shadow-md">
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
        } else if (name === 'isAvaliable') {
            setEditableDoctor(prev => ({
                ...prev,
                isAvaliable: checked,
                // If becomes unavailable, set onleave to true and clear reason (or set default)
                onleave: !checked ? true : prev.onleave, // Keep existing onleave if becoming available
                reason: !checked ? (prev.reason || 'Not specified') : '', // If becoming unavailable, set reason or default
                availabilityStatus: checked ? 'Available' : 'On Leave' // Update display status
            }));
        } else if (name === 'availabilityStatus') {
            const newIsAvailable = value === 'Available';
            const newOnLeave = value === 'On Leave';

            setEditableDoctor(prev => ({
                ...prev,
                availabilityStatus: value,
                isAvaliable: newIsAvailable,
                onleave: newOnLeave,
                reason: newOnLeave ? (prev.reason || 'Not specified') : '', // Set reason if On Leave
            }));
        }
        else if (type === 'checkbox') {
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
        const url=`${import.meta.env.VITE_SERVER_URL}/api/doctor/doctor/${editableDoctor._id}`
        axios.put(url,doctorToSave,{withCredentials:true})
        .then((response)=>{
            console.log(response.data);
        })
        .catch((error)=>{
            console.log(error)
        })
        if (isAddingNewDoctor) {
            onCreate(doctorToSave);
        } else {
            onEdit(doctorToSave);
        }
        setIsEditing(false);
        onCancel(); // Call onCancel to potentially close the panel or reset state in parent
    };

    const handleCancelEdit = () => {
        if (isAddingNewDoctor) {
            onCancel();
        } else {
            // Revert to original doctor data
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
        onDelete(doctor.id);
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
        <div className="flex-grow bg-white p-8 shadow-md rounded-lg m-4 overflow-y-auto">
            <h3 className="text-2xl font-bold text-blue-700 mb-6 pb-3 border-b border-blue-100">
                {isAddingNewDoctor ? 'Create New Doctor Profile' : 'Doctor Profile Details'}
            </h3>

            {isEditing ? (
                <div className="space-y-6">
                    <div className="flex items-center space-x-6 mb-8">
                        <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0">
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
                    {renderInputField("Phone", "phone", editableDoctor.phone || '', 'text', 'e.g., +91 98765 43210')} {/* Updated */}
                    {renderInputField("Email", "email", editableDoctor.email || '', 'email', 'e.g., doctor@hospital.com')} {/* Updated */}
                    {renderInputField("Bio / About Section", "bio", editableDoctor.bio || '', 'text', 'A brief description...', true)}
                    {renderInputField("Operating Hours", "operatingHours", editableDoctor.operatingHours || '', 'text', 'e.g., 9:00 AM - 5:00 PM')} {/* New field */}
                    {renderInputField("Regular Hours", "regularHours", editableDoctor.regularHours || '', 'text', 'e.g., Mon-Fri, 9 AM - 5 PM')}
                    {renderInputField("Languages Spoken (comma-separated)", "languages", editableDoctor.languages?.join(', ') || '', 'text', 'e.g., English, Hindi, German')} {/* Updated */}
                    {renderInputField("Operation Success Rate", "operationSuccessRate", editableDoctor.operationSuccessRate || '', 'text', 'e.g., 95%')}

                    <div className="mb-4">
                        <label htmlFor="isAvaliable" className="block text-gray-700 text-sm font-semibold mb-2">Is Available?</label>
                        {renderInputField("Is Available", "isAvaliable", editableDoctor.isAvaliable, 'checkbox')}
                    </div>

                    {editableDoctor.isAvaliable === false && (
                        <div className="mb-4">
                            {renderInputField("Reason for Unavailability", "reason", editableDoctor.reason || '', 'text', 'e.g., On Vacation, Conference')} {/* New field */}
                        </div>
                    )}

                    <div className="flex justify-end space-x-3 mt-8">
                        <button
                            onClick={handleSave}
                            className="flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition duration-300"
                        >
                            <FaSave size={20} className="mr-2" /> {isAddingNewDoctor ? 'Create Profile' : 'Save Changes'}
                        </button>
                        <button
                            onClick={handleCancelEdit}
                            className="flex items-center px-6 py-3 bg-gray-500 text-white font-semibold rounded-md shadow-md hover:bg-gray-600 transition duration-300"
                        >
                            <FaTimes size={20} className="mr-2" /> Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="flex items-center space-x-6 mb-8">
                        <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 shadow-lg">
                            <img
                                src={doctor?.image || 'https://placehold.co/100x100/e0e0e0/888888?text=No+Photo'}
                                alt="Doctor"
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100x100/e0e0e0/888888?text=No+Photo'; }}
                            />
                        </div>
                        <div>
                            <h4 className="text-3xl font-bold text-blue-800">{doctor.name}</h4>
                            <p className="text-xl text-gray-600">{doctor.specialization?.join(', ') || 'N/A'}</p>
                            <span className={`text-sm font-semibold px-3 py-1 rounded-full mt-2 inline-block ${
                                doctor.isAvaliable ? 'bg-green-100 text-green-700' :
                                (doctor.onleave ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700') // Updated
                            }`}>
                                {doctor.isAvaliable ? 'Available' : (doctor.onleave ? 'On Leave' : 'On Call')} {/* Updated */}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 text-sm">
                        {renderDisplayField("Degree", doctor.degree, FaBookOpen)}
                        {renderDisplayField("Experience", doctor.experience, FaClock)}
                        {renderDisplayField("Phone", doctor.phone, FaPhone)} {/* Updated */}
                        {renderDisplayField("Email", doctor.email, FaEnvelope)} {/* Updated */}
                        {renderDisplayField("Operation Success Rate", doctor.operationSuccessRate, FaPercent)}
                        {renderDisplayField("Languages", doctor.languages?.join(', ') || 'N/A', FaGlobe)} {/* Updated */}
                        {renderDisplayField("Operating Hours", doctor.operatingHours, FaClock)} {/* New field */}
                        {renderDisplayField("Regular Hours", doctor.regularHours, FaClock)}
                    </div>

                    <div className="mt-6">
                        <h5 className="text-lg font-semibold text-blue-700 mb-2">Bio</h5>
                        <p className="text-gray-700 leading-relaxed bg-blue-50 p-4 rounded-md shadow-inner">{doctor.bio || 'No bio provided.'}</p>
                    </div>

                    <div className="mt-6">
                        <h5 className="text-lg font-semibold text-blue-700 mb-2">Specializations</h5>
                        <div className="flex flex-wrap gap-2">
                            {doctor.specialization?.length > 0 ? doctor.specialization.map(spec => (
                                <span key={spec} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                    {spec}
                                </span>
                            )) : <p className="text-gray-600 italic text-sm">No specializations listed.</p>}
                        </div>
                    </div>

                    {doctor.onleave && ( // Display leave reason only if on leave
                        <div className="mt-6">
                            <h5 className="text-lg font-semibold text-blue-700 mb-2 flex items-center"><FaCalendarAlt size={18} className="mr-2" /> Current Unavailability</h5>
                            <div className="bg-gray-50 p-3 rounded-md border border-gray-200 mb-2 text-sm">
                                <p className="text-gray-600 italic">Reason: {doctor.reason || 'Not specified'}</p>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end space-x-3 mt-8">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition duration-300"
                        >
                            <FaEdit size={20} className="mr-2" /> Edit Profile
                        </button>
                        <button
                            onClick={handleDeleteClick}
                            className="flex items-center px-6 py-3 bg-red-600 text-white font-semibold rounded-md shadow-md hover:bg-red-700 transition duration-300"
                        >
                            <FaTrashAlt size={20} className="mr-2" /> Delete Profile
                        </button>
                    </div>
                </div>
            )}
            <ConfirmationModal
                show={showDeleteConfirm}
                message={`Are you sure you want to delete Dr. ${doctor?.name}'s profile? This action cannot be undone.`}
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
            />
        </div>
    );
};