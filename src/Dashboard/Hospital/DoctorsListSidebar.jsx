import {useState}from "react";
import {ConfirmationModal} from "./ConfirmationModal";
import { FaPlus, FaTrashAlt, FaEdit, FaTimes, FaSave, FaCalendarAlt, FaClock, FaBookOpen, FaUser, FaPhone, FaEnvelope, FaGlobe, FaPercent } from 'react-icons/fa';

// export const DoctorsListSidebar = ({
//     doctors,
//     searchTerm,
//     setSearchTerm,
//     availabilityFilter,
//     setAvailabilityFilter,
//     specialtyFilter,
//     setSpecialtyFilter,
//     onSelectDoctor,
//     selectedDoctorId,
//     onAddNewDoctor,
//     onDeleteDoctor,
//     allSpecialties
// }) => {
//     const currentUniqueSpecialties = [...new Set(doctors.flatMap(doc => doc.specialization))];

//     const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//     const [doctorToDelete, setDoctorToDelete] = useState(null);

//     const handleDeleteClick = (e, doctor) => {
//         e.stopPropagation();
//         setDoctorToDelete(doctor);
//         setShowDeleteConfirm(true);
//     };

//     const confirmDelete = () => {
//         onDeleteDoctor(doctorToDelete.id);
//         setShowDeleteConfirm(false);
//         setDoctorToDelete(null);
//     };

//     const cancelDelete = () => {
//         setShowDeleteConfirm(false);
//         setDoctorToDelete(null);
//     };

//     return (
//         <div className="w-96 bg-white border-r border-gray-200 p-4 flex flex-col shadow-md rounded-lg ">
//             <h3 className="text-2xl font-bold text-blue-700 mb-6  border-b border-blue-100">Doctors</h3>

//             <div className="mb-2">
//                 <input
//                     type="text"
//                     placeholder="Search by name or specialty..."
//                     className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//             </div>

//             <div className="mb-6 pb-4 border-b border-gray-200">
//                 <h4 className="text-lg font-semibold text-gray-700 mb-3">Filters</h4>
//                 <div className="flex flex-col space-y-3">
//                     <div className="flex items-center space-x-2">
//                         <label htmlFor="availability-filter" className="text-gray-600 text-sm w-24">Availability:</label>
//                         <select
//                             id="availability-filter"
//                             value={availabilityFilter}
//                             onChange={(e) => setAvailabilityFilter(e.target.value)}
//                             className="flex-grow p-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
//                         >
//                             <option value="all">All</option>
//                             <option value="Available">Available</option>
//                             <option value="On Leave">On Leave</option>
//                             <option value="On Call">On Call</option>
//                         </select>
//                     </div>

//                     <div className="flex items-center space-x-2">
//                         <label htmlFor="specialty-filter" className="text-gray-600 text-sm w-24">Specialty:</label>
//                         <select
//                             id="specialty-filter"
//                             value={specialtyFilter}
//                             onChange={(e) => setSpecialtyFilter(e.target.value)}
//                             className="flex-grow p-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
//                         >
//                             <option value="all">All Specialties</option>
//                             {[...new Set([...allSpecialties, ...currentUniqueSpecialties])].sort().map(specialty => (
//                                 <option key={specialty} value={specialty}>{specialty}</option>
//                             ))}
//                         </select>
//                     </div>
//                 </div>
//             </div>
//             <div className="flex-grow overflow-y-auto pr-2 -mr-2">
//                 {doctors.length === 0 ? (
//                     <p className="text-center text-gray-500 italic mt-8">No doctors found matching criteria.</p>
//                 ) : (
//                     <ul className="space-y-3">
//                         {doctors.map(doctor => (
//                             <li
//                                 key={doctor.id}
//                                 className={`flex flex-col p-4 rounded-lg shadow-sm border ${selectedDoctorId === doctor.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'} hover:bg-gray-50 cursor-pointer transition duration-200`}
//                                 onClick={() => onSelectDoctor(doctor)}
//                             >
//                                 <div className="flex justify-between items-start mb-2">
//                                     <h4 className="text-lg font-semibold text-gray-800">{doctor.name}</h4>
//                                     <div className="flex gap-2">
//                                         <button
//                                             onClick={(e) => handleDeleteClick(e, doctor)}
//                                             className="p-1 text-red-500 hover:bg-red-100 rounded-full transition duration-200"
//                                             aria-label="Delete doctor"
//                                         >
//                                             <FaTrashAlt size={18} />
//                                         </button>
//                                     </div>
//                                 </div>
//                                 <p className="text-sm text-gray-600 mb-1">
//                                     <span className="font-medium">Specialty:</span> {doctor.specialization.join(', ')}
//                                 </p>
//                                 <p className="text-sm text-gray-600 mb-1 flex items-center">
//                                     <FaPhone size={14} className="mr-1 text-blue-500" /> {doctor.contact.phone}
//                                 </p>
//                                 <p className="text-sm text-gray-600 mb-2 flex items-center">
//                                     <FaEnvelope size={14} className="mr-1 text-blue-500" /> {doctor.contact.email}
//                                 </p>
//                                 <span className={`text-xs font-semibold px-2 py-1 rounded-full w-fit ${
//                                     doctor.isAvaliable ? 'bg-green-100 text-green-700' :
//                                     (doctor.availabilityStatus === 'On Leave' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700')
//                                 }`}>
//                                     {doctor.availabilityStatus}
//                                 </span>
//                             </li>
//                         ))}
//                     </ul>
//                 )}
//             </div>
//             <button
//                 onClick={onAddNewDoctor}
//                 className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition duration-300 mb-6"
//             >
//                 <FaPlus size={20} className="mr-2" /> Add New Doctor
//             </button>
//             <ConfirmationModal
//                 show={showDeleteConfirm}
//                 message={`Are you sure you want to delete Dr. ${doctorToDelete?.name}? This action cannot be undone.`}
//                 onConfirm={confirmDelete}
//                 onCancel={cancelDelete}
//             />
//         </div>
//     );
// };


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
    const currentUniqueSpecialties = [...new Set(doctors.flatMap(doc => doc.specialization))];

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [doctorToDelete, setDoctorToDelete] = useState(null);
    const [showFilters, setShowFilters] = useState(false); // State to toggle filter visibility

    const handleDeleteClick = (e, doctor) => {
        e.stopPropagation(); // Prevent selecting the doctor when clicking delete
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
        <div className="w-96 bg-white border-r border-gray-200 p-4 flex flex-col shadow-md rounded-lg m-4">
            <h3 className="text-2xl font-bold text-blue-700 mb-6 border-b border-blue-100">Doctors</h3>

            <div className="mb-2 flex items-center gap-2">
                <input
                    type="text"
                    placeholder="Search by name or specialty..."
                    className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="p-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition duration-200"
                    aria-label="Toggle filters"
                >
                    <FaBookOpen size={20} />
                </button>
            </div>

            {showFilters && (
                <div className="mb-6 pb-4 border-b border-gray-200 animate-fade-in">
                    <h4 className="text-lg font-semibold text-gray-700 mb-3">Filters</h4>
                    <div className="flex flex-col space-y-3">
                        <div className="flex items-center space-x-2">
                            <label htmlFor="availability-filter" className="text-gray-600 text-sm w-24">Availability:</label>
                            <select
                                id="availability-filter"
                                value={availabilityFilter}
                                onChange={(e) => setAvailabilityFilter(e.target.value)}
                                className="flex-grow p-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                            >
                                <option value="all">All</option>
                                <option value="Available">Available</option>
                                <option value="On Leave">On Leave</option>
                                <option value="On Call">On Call</option>
                            </select>
                        </div>

                        <div className="flex items-center space-x-2">
                            <label htmlFor="specialty-filter" className="text-gray-600 text-sm w-24">Specialty:</label>
                            <select
                                id="specialty-filter"
                                value={specialtyFilter}
                                onChange={(e) => setSpecialtyFilter(e.target.value)}
                                className="flex-grow p-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                            >
                                <option value="all">All Specialties</option>
                                {[...new Set([...allSpecialties, ...currentUniqueSpecialties])].sort().map(specialty => (
                                    <option key={specialty} value={specialty}>{specialty}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex-grow overflow-y-auto pr-2 -mr-2 max-h-[calc(100vh-80px)]">
                {doctors.length === 0 ? (
                    <p className="text-center text-gray-500 italic mt-8">No doctors found matching criteria.</p>
                ) : (
                    <ul className="space-y-3">
                        {doctors.map(doctor => (
                            <li
                                key={doctor?._id}
                                className={`flex flex-col p-4 rounded-lg shadow-sm border ${selectedDoctorId === doctor?._id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'} hover:bg-gray-50 cursor-pointer transition duration-200`}
                                onClick={() => onSelectDoctor(doctor)}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="text-lg font-semibold text-gray-800">{doctor?.name}</h4>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={(e) => handleDeleteClick(e, doctor)}
                                            className="p-1 text-red-500 hover:bg-red-100 rounded-full transition duration-200"
                                            aria-label="Delete doctor"
                                        >
                                            <FaTrashAlt size={18} />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 mb-1">
                                    <span className="font-medium">Specialty:</span> {doctor?.specialization.join(', ')}
                                </p>
                                <p className="text-sm text-gray-600 mb-1 flex items-center">
                                    <FaPhone size={14} className="mr-1 text-blue-500" /> {doctor?.phone}
                                </p>
                                <p className="text-sm text-gray-600 mb-2 flex items-center">
                                    <FaEnvelope size={14} className="mr-1 text-blue-500" /> {doctor?.email}
                                </p>
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full w-fit ${
                                    doctor.isAvaliable ? 'bg-green-100 text-green-700' :
                                    (doctor?.availabilityStatus === 'On Leave' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700')
                                }`}>
                                    {doctor?.availabilityStatus}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <button
                onClick={onAddNewDoctor}
                className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition duration-300 mb-6"
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
