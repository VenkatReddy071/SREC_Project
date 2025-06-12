// src/components/ServiceForm.jsx
import { useEffect, useState } from 'react';

// This component expects initialService (string) and initialIndex (number) for editing
const ServiceForm = ({ initialService, initialIndex, onSave, onCancel }) => {
  const [serviceName, setServiceName] = useState('');

  // Populate form when initialService/initialIndex changes (for editing) or clear for new
  useEffect(() => {
    if (initialService !== null && initialService !== undefined) {
      setServiceName(initialService);
    } else {
      // Reset for new service
      setServiceName('');
    }
  }, [initialService, initialIndex]); // Depend on both to correctly detect changes

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!serviceName.trim()) { // Basic validation: ensure name is not empty
      alert('Service name cannot be empty.');
      return;
    }
    // Pass the new service name and the original index (if editing)
    onSave(serviceName.trim(), initialIndex);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        {initialService !== null && initialService !== undefined ? 'Edit Service' : 'Add New Service'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="serviceName" className="block text-sm font-medium text-gray-700">Service Name</label>
          <input
            type="text"
            id="serviceName"
            name="serviceName"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="e.g., Dental Checkup"
            required
          />
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {initialService !== null && initialService !== undefined ? 'Update Service' : 'Add Service'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ServiceForm;