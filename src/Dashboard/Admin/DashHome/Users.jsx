import React, { useState, useEffect } from 'react';
import Axios from 'axios'; // Assuming Axios is installed and configured
import { UserPlus, Trash2, Ban, CheckCircle, XCircle, Search, Info } from 'lucide-react'; // Removed Edit icon

// Main App component to wrap the Users component and provide a complete runnable app
export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-4 font-inter">
      <Users />
    </div>
  );
}

export const Users = () => {
  const [users, setUsers] = useState([]);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    type: 'User', // Default role
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null); // New state for selected user

  // useEffect to fetch users from the backend API
  useEffect(() => {
    const url = `${import.meta.env.VITE_SERVER_URL}/api/users`;
    Axios.get(url, { withCredentials: true })
      .then((response) => {
        console.log("Users fetched successfully:", response.data);
        // Ensure each user object has an 'isBlocked' property, defaulting to false if not present
        const fetchedUsers = response.data.userDetails.map(user => ({ ...user, isBlocked: user.isBlocked || false }));
        setUsers(fetchedUsers);
        // Automatically select the first user if available
        if (fetchedUsers.length > 0) {
          setSelectedUser(fetchedUsers[0]);
        }
      })
      .catch((error) => console.error("Error fetching users:", error.message));
  }, []);

  // Function to format date strings
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const options = { year: 'numeric', month: 'short', day: '2-digit' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options).replace(',', '').replace(/ /g, '-');
  };

  // Handle input changes for the new user form
  const handleNewUserChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };

  // Handle adding a new user via API call
  const handleAddUserSubmit = (e) => {
    e.preventDefault();
    console.log("Attempting to add new user:", newUser);
    Axios.post(`${import.meta.env.VITE_SERVER_URL}/api/users/add`, newUser, { withCredentials: true })
      .then(response => {
        console.log("User added successfully:", response.data);
        const addedUser = { ...response.data.newUser, isBlocked: false };
        setUsers(prev => [...prev, addedUser]); // Add new user to state
        setIsAddUserModalOpen(false); // Close modal
        setNewUser({ username: '', email: '', password: '', type: 'User' }); // Reset form
        setSelectedUser(addedUser); // Select the newly added user
      })
      .catch(error => console.error("Error adding user:", error.message, error.response?.data));
  };

  // Toggle user block status via API call
  const toggleBlockStatus = (userId, currentBlockedStatus) => {
    console.log(`Attempting to toggle block status for user ${userId}. Current status: ${currentBlockedStatus}`);
    Axios.patch(`${import.meta.env.VITE_SERVER_URL}/api/users/${userId}/toggle-block`, { isBlocked: !currentBlockedStatus }, { withCredentials: true })
      .then(response => {
        console.log(`Block status toggled successfully for user ${userId}:`, response.data);
        // Update state based on successful API response
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user._id === userId ? { ...user, isBlocked: response.data.isBlocked } : user
          )
        );
        // Also update the selected user if it's the one being modified
        if (selectedUser && selectedUser._id === userId) {
          setSelectedUser(prev => ({ ...prev, isBlocked: response.data.isBlocked }));
        }
      })
      .catch(error => console.error(`Error toggling block status for user ${userId}:`, error.message, error.response?.data));
  };

  // Prepare for delete confirmation
  const confirmDeleteUser = (user) => {
    setUserToDelete(user);
    setIsDeleteConfirmModalOpen(true);
  };

  // Handle delete user via API call
  const handleDeleteUser = () => {
    if (!userToDelete) {
      console.warn("No user selected for deletion.");
      return; // Should not happen if modal is properly triggered
    }
    console.log(`Attempting to delete user: ${userToDelete._id}`);
    Axios.delete(`${import.meta.env.VITE_SERVER_URL}/api/users/${userToDelete._id}`, { withCredentials: true })
      .then(() => {
        console.log(`User ${userToDelete._id} deleted successfully.`);
        setUsers(prevUsers => prevUsers.filter(user => user._id !== userToDelete._id));
        setIsDeleteConfirmModalOpen(false); // Close modal
        setUserToDelete(null); // Clear user to delete
        // If the deleted user was the selected one, clear selection
        if (selectedUser && selectedUser._id === userToDelete._id) {
          setSelectedUser(null);
        }
      })
      .catch(error => {
        console.error(`Error deleting user ${userToDelete._id}:`, error.message, error.response?.data);
        setIsDeleteConfirmModalOpen(false); // Close modal even on error
        setUserToDelete(null);
      });
  };

  // Filtered users based on search term
  const filteredUsers = users.filter(user =>
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user._id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4 bg-white rounded-xl shadow-xl flex flex-col md:flex-row h-[calc(100vh-32px)]"> {/* Added h-[calc(100vh-32px)] for fixed height and scrolling */}
      {/* Left Pane: User List */}
      <div className="w-full md:w-1/3 border-r border-gray-200 p-4 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Users</h2>
          <button
            onClick={() => setIsAddUserModalOpen(true)}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-sm"
          >
            <UserPlus className="mr-2" size={18} /> Add
          </button>
        </div>
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search users..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
        <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar"> {/* Added custom-scrollbar for better aesthetics */}
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div
                key={user._id}
                onClick={() => setSelectedUser(user)}
                className={`flex items-center p-3 mb-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                  selectedUser && selectedUser._id === user._id
                    ? 'bg-blue-100 border-l-4 border-blue-600 shadow-sm'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="flex-shrink-0 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center text-lg font-semibold">
                  {user.username?.charAt(0).toUpperCase()}
                </div>
                <div className="ml-3 flex-grow">
                  <p className="font-semibold text-gray-900 truncate">{user.username?.substring(0,12)}</p>
                  <p className="text-sm text-gray-600 truncate">{user.email?.substring(0,12)}</p>
                </div>
                <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  user.isBlocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`}>
                  {user.isBlocked ? 'Blocked' : 'Active'}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-4">No users found.</div>
          )}
        </div>
      </div>

      {/* Right Pane: User Details */}
      <div className="w-full md:w-2/3 p-4 flex flex-col">
        {selectedUser ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">User Details</h2>
              <div className="flex space-x-2">
                {/* Removed Edit button as requested */}
                <button
                  onClick={() => confirmDeleteUser(selectedUser)}
                  className="flex items-center text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50 transition-colors"
                  title="Delete User"
                >
                  <Trash2 size={20} />
                  <span className="ml-1 hidden md:inline">Delete</span>
                </button>
                <button
                  onClick={() => toggleBlockStatus(selectedUser._id, selectedUser.isBlocked)}
                  className={`flex items-center p-2 rounded-full transition-colors ${
                    selectedUser.isBlocked
                      ? 'text-green-600 hover:text-green-900 hover:bg-green-50'
                      : 'text-yellow-600 hover:text-yellow-900 hover:bg-yellow-50'
                  }`}
                  title={selectedUser.isBlocked ? "Unblock User" : "Block User"}
                >
                  {selectedUser.isBlocked ? <CheckCircle size={20} /> : <Ban size={20} />}
                  <span className="ml-1 hidden md:inline">{selectedUser.isBlocked ? 'Unblock' : 'Block'}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <p className="text-sm font-medium text-gray-500">User ID</p>
                <p className="text-lg font-semibold text-gray-900 break-all">{selectedUser._id}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <p className="text-sm font-medium text-gray-500">Username</p>
                <p className="text-lg font-semibold text-gray-900">{selectedUser.username}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-lg font-semibold text-gray-900 break-all">{selectedUser.email}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <p className="text-sm font-medium text-gray-500">Role</p>
                <p className="text-lg font-semibold text-gray-900">
                  <span className={`px-3 py-1 rounded-full text-base ${
                    selectedUser.type === 'Admin' ? 'bg-purple-100 text-purple-800' :
                    selectedUser.type === 'Editor' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {selectedUser.type}
                  </span>
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <p className="text-sm font-medium text-gray-500">Status</p>
                <p className="text-lg font-semibold text-gray-900">
                  <span className={`px-3 py-1 rounded-full text-base ${
                    selectedUser.isBlocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {selectedUser.isBlocked ? 'Blocked' : 'Active'}
                  </span>
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <p className="text-sm font-medium text-gray-500">Last Login</p>
                <p className="text-lg font-semibold text-gray-900">{formatDate(selectedUser.lastLogin)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <p className="text-sm font-medium text-gray-500">Join Date</p>
                <p className="text-lg font-semibold text-gray-900">{formatDate(selectedUser.createdAt)}</p>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <Info size={48} className="mb-4" />
            <p className="text-lg">Select a user from the left to view details.</p>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md transform transition-all scale-100 opacity-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Add New User</h3>
              <button
                onClick={() => setIsAddUserModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <XCircle size={24} />
              </button>
            </div>
            <form onSubmit={handleAddUserSubmit} className="space-y-5">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={newUser.username}
                  onChange={handleNewUserChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleNewUserChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={newUser.password}
                  onChange={handleNewUserChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  id="type"
                  name="type"
                  value={newUser.type}
                  onChange={handleNewUserChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="User">User</option>
                  <option value="Editor">Editor</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmModalOpen && userToDelete && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-sm transform transition-all scale-100 opacity-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Confirm Deletion</h3>
              <button
                onClick={() => setIsDeleteConfirmModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <XCircle size={24} />
              </button>
            </div>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete user "<span className="font-semibold">{userToDelete.username}</span>"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteConfirmModalOpen(false)}
                className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-300 ease-in-out"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="px-5 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition duration-300 ease-in-out transform hover:scale-105"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
