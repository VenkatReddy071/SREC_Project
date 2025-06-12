// // src/components/BookingFilters.jsx
// import React from 'react';

// const BookingFilters = ({ filters, setFilters, doctors,specalization }) => {
//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters(prevFilters => ({
//       ...prevFilters,
//       [name]: value,
//     }));
//   };

//   return (
//     <div className="flex flex-wrap gap-4 mb-4">
//       <div className="flex-1 min-w-[150px]">
//         <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700">Date Range</label>
//         <select
//           id="dateRange"
//           name="dateRange"
//           className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
//           value={filters.dateRange}
//           onChange={handleFilterChange}
//         >
//           <option value="">All Dates</option>
//           <option value="today">Today</option>
//           {/* Add more options like "This Week", "This Month", "Custom" */}
//         </select>
//       </div>

//       <div className="flex-1 min-w-[150px]">
//         <label htmlFor="doctor" className="block text-sm font-medium text-gray-700">Doctor</label>
//         <select
//           id="doctor"
//           name="doctor"
//           className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
//           value={filters.doctor}
//           onChange={handleFilterChange}
//         >
//           <option value="">All Doctors</option>
//           {doctors.map(doctor => (
//             <option key={doctor._id} value={doctor._id}>{doctor.name}</option>
//           ))}
//         </select>
//       </div>

//       <div className="flex-1 min-w-[150px]">
//         <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
//         <select
//           id="status"
//           name="status"
//           className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
//           value={filters.status}
//           onChange={handleFilterChange}
//         >
//           <option value="">All Statuses</option>
//           <option value="Confirmed">Confirmed</option>
//           <option value="Pending">Pending</option>
//           <option value="Completed">Completed</option>
//           <option value="Cancelled">Cancelled</option>
//           <option value="No-Show">No-Show</option>
//         </select>
//       </div>

//       <div className="flex-1 min-w-[150px]">
//         <label htmlFor="service" className="block text-sm font-medium text-gray-700">Service</label>
//         <select
//           id="service"
//           name="service"
//           className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
//           value={filters.service}
//           onChange={handleFilterChange}
//         >
//           <option value="">All Services</option>
//           <option value="Cardiology">Cardiology</option>
//           <option value="Pediatrics">Pediatrics</option>
//           <option value="Dermatology">Dermatology</option>
//           <option value="Orthopedics">Orthopedics</option>
//           <option value="General Medicine">General Medicine</option>
//           {/* Add more service options based on your data */}
//         </select>
//       </div>
//     </div>
//   );
// };

// export default BookingFilters;

// src/components/BookingFilters.jsx
import React from 'react';

const BookingFilters = ({ filters, setFilters, doctors, specialization }) => { // Corrected prop name to 'specialization'
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  return (
    <div className="flex flex-wrap gap-4 mb-4">
      <div className="flex-1 min-w-[150px]">
        <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700">Date Range</label>
        <select
          id="dateRange"
          name="dateRange"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          value={filters.dateRange}
          onChange={handleFilterChange}
        >
          <option value="">All Dates</option>
          <option value="today">Today</option>
          {/* Add more options like "This Week", "This Month", "Custom" */}
        </select>
      </div>

      <div className="flex-1 min-w-[150px]">
        <label htmlFor="doctor" className="block text-sm font-medium text-gray-700">Doctor</label>
        <select
          id="doctor"
          name="doctor"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          value={filters.doctor}
          onChange={handleFilterChange}
        >
          <option value="">All Doctors</option>
          {doctors.map(doctor => (
            <option key={doctor._id} value={doctor._id}>{doctor.name}</option>
          ))}
        </select>
      </div>

      <div className="flex-1 min-w-[150px]">
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
        <select
          id="status"
          name="status"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          value={filters.status}
          onChange={handleFilterChange}
        >
          <option value="">All Statuses</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
          <option value="No-Show">No-Show</option>
        </select>
      </div>

      <div className="flex-1 min-w-[150px]">
        <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">Specialization</label> {/* Changed label to Specialization */}
        <select
          id="specialization" // Changed id to specialization
          name="specialization" // Changed name to specialization
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          value={filters.specialization} // Changed value to filters.specialization
          onChange={handleFilterChange}
        >
          <option value="">All Specializations</option> {/* Changed default option */}
          {specialization.map((spec, index) => ( // Loop through the specialization prop
            <option key={index} value={spec}>{spec}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default BookingFilters;