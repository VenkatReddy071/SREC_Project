import React, { useState, useEffect } from "react";
import { FaSearch, FaPlus, FaMinus } from "react-icons/fa";
import axios from "axios";

export const Logs = () => {
  const [searchEmail, setSearchEmail] = useState("");
  const [entityType, setEntityType] = useState("");
  const [role, setRole] = useState("");
  const [action, setAction] = useState("");
  const [logs, setLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);
  const [loading, setLoading] = useState(false); // State to manage loading status
  const [error, setError] = useState(null); // State to manage errors

  const entityTypes = ["Notification", "Hospital", "School", "College", "Fashion", "AdminDashboard"];
  const roles = ["Admin", "User", "Manager"];
  const actions = ["CREATE", "READ", "UPDATE", "DELETE", "LOGIN", "LOGOUT", "OTHER"];

  // Function to fetch logs based on filters
  const fetchLogs = async (filters = {}) => {
    setLoading(true); // Set loading to true when fetching starts
    setError(null);    // Clear any previous errors
    try {
      const url = `${import.meta.env.VITE_SERVER_URL}/api/history`;
      const response = await axios.get(url, {
        params: filters, // Pass filters as query parameters
        withCredentials: true,
      });
      setLogs(response.data);
    } catch (err) {
      console.error("Error while getting logs:", err);
      setError("Error fetching logs. Please try again.");
      setLogs([]); // Clear logs on error
    } finally {
      setLoading(false); // Set loading to false when fetching is complete (success or error)
    }
  };

  // useEffect to trigger data fetching whenever filter states change
  useEffect(() => {
    const filters = {
      email: searchEmail,
      entityType: entityType || undefined,
      role: role || undefined,
      action: action || undefined,
    };
    // Remove undefined values to avoid sending empty query parameters
    Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]);
    
    console.log("Fetching logs with filters:", filters);
    fetchLogs(filters); // Call fetchLogs with the current filters
  }, [searchEmail, entityType, role, action]); // Dependencies: re-run effect when these states change

  const handleClearFilters = () => {
    // Reset all filter states, which will automatically trigger the useEffect
    setSearchEmail("");
    setEntityType("");
    setRole("");
    setAction("");
    // No need to call fetchLogs here, as the useEffect will handle it
  };

  const getBgColorForAction = (action) => {
    const colors = {
      CREATE: "bg-green-100",
      DELETE: "bg-red-100",
      UPDATE: "bg-yellow-100",
      LOGIN: "bg-blue-100",
      LOGOUT: "bg-gray-100",
      READ: "bg-red-200"
    };
    return colors[action] || "bg-white";
  };

  const getBgColorForMethod = (method) => {
    const colors = {
      POST: "bg-green-100",
      DELETE: "bg-red-100",
      GET: "bg-blue-100",
      PUT: "bg-yellow-100",
    };
    return colors[method] || "bg-white";
  };

  // --- Skeleton Row Component for loading state ---
  const SkeletonRow = () => (
    <tr className="animate-pulse">
      <td className="border border-gray-300 p-2">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </td>
      <td className="border border-gray-300 p-2">
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </td>
      <td className="border border-gray-300 p-2">
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </td>
      <td className="border border-gray-300 p-2">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
      </td>
      <td className="border border-gray-300 p-2">
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      </td>
      <td className="border border-gray-300 p-2">
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </td>
      <td className="border border-gray-300 p-2">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </td>
    </tr>
  );

  return (
    <div className="p-4 m-2 bg-white">
      <div className="bg-gray-100 px-4 py-2 rounded-lg shadow">
        <div className="flex flex-wrap gap-6 items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by user email"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)} // State update triggers useEffect
              className="border p-2 pl-10 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-2 top-2.5 text-gray-500" />
          </div>
          <select
            value={entityType}
            onChange={(e) => setEntityType(e.target.value)} // State update triggers useEffect
            className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Entity Type</option>
            {entityTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)} // State update triggers useEffect
            className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Role</option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          <select
            value={action}
            onChange={(e) => setAction(e.target.value)} // State update triggers useEffect
            className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Action</option>
            {actions.map((act) => (
              <option key={act} value={act}>
                {act}
              </option>
            ))}
          </select>
          {/* Removed the Search button */}
          <button
            onClick={handleClearFilters}
            className="bg-red-600 text-white px-4 py-2 rounded-md transition"
            disabled={loading} // Disable button while loading
          >
            Clear Filters
          </button>
        </div>
      </div>
      <div className="mt-6">
        <table className="w-full border-collapse border border-gray-300 text-left">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">User Email</th>
              <th className="border border-gray-300 p-2">Entity</th>
              <th className="border border-gray-300 p-2">Action</th>
              <th className="border border-gray-300 p-2">Timestamp</th>
              <th className="border border-gray-300 p-2">Method</th>
              <th className="border border-gray-300 p-2">Description</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? ( // Conditionally render skeleton rows when loading is true
              // Render 5 skeleton rows as an example
              Array.from({ length: 5 }).map((_, index) => (
                <SkeletonRow key={index} />
              ))
            ) : error ? ( // Show error message if there's an error
              <tr>
                <td colSpan="7" className="text-center p-4 text-red-500">
                  {error}
                </td>
              </tr>
            ) : logs.length > 0 ? ( // Render actual logs if not loading and data exists
              logs.map((log, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="border border-gray-300 p-2">{log.email || "N/A"}</td>
                  <td className="border border-gray-300 p-2">{log.entityType || "N/A"}</td>
                  <td className={`border border-gray-300 p-2 ${getBgColorForAction(log.action)}`}>
                    {log.action || "N/A"}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {new Date(log.timestamp).toLocaleString() || "N/A"}
                  </td>
                  <td className={`border border-gray-300 p-2 ${getBgColorForMethod(log.method)}`}>
                    {log.method || "N/A"}
                  </td>
                  <td className="border border-gray-300 p-2">{log.description || "N/A"}</td>
                  <td className="border border-gray-300 p-2 flex gap-2">
                    {selectedLog === log ? (
                      <button
                        onClick={() => setSelectedLog(null)}
                        className="text-red-600"
                      >
                        <FaMinus />
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="text-green-600"
                      >
                        <FaPlus />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : ( // Show "No logs found" if not loading, no error, and no logs
              <tr>
                <td colSpan="7" className="text-center p-4">
                  No logs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {selectedLog && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Log Details</h2>
            <p><strong>User Email:</strong> {selectedLog.email || "N/A"}</p>
            <p><strong>Entity:</strong> {selectedLog.entityType || "N/A"}</p>
            <p><strong>Action:</strong> {selectedLog.action || "N/A"}</p>
            <p><strong>Timestamp:</strong> {new Date(selectedLog.timestamp).toLocaleString() || "N/A"}</p>
            <p><strong>Method:</strong> {selectedLog.method || "N/A"}</p>
            <p><strong>Description:</strong> {selectedLog.description || "N/A"}</p>
            <button
              onClick={() => setSelectedLog(null)}
              className="bg-red-600 text-white px-4 py-2 rounded-md mt-4 hover:bg-red-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};