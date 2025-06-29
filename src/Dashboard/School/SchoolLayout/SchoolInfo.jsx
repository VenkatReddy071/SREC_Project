import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pencil, Save, XCircle, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

const SkeletonLoader = ({ className = '' }) => (
    <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`}></div>
);

const SchoolInfo = () => {
    const [schoolData, setSchoolData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);

    const API_BASE_URL = `${import.meta.env.VITE_SERVER_URL}/api/school`;

    useEffect(() => {
        fetchSchoolData();
    }, []);

    const fetchSchoolData = async () => {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem('dashboard');
        if (!token) {
            setError('Authentication token not found. Please log in.');
            setIsLoading(false);
            return;
        }

        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            };
            const response = await axios.get(`${API_BASE_URL}/by-email/profile`, config);
            setSchoolData(response.data?.institution);
            setFormData(response.data?.institution);
            setIsLoading(false);
        } catch (err) {
            console.error('Error fetching school data:', err);
            setError('Failed to fetch school data. Please try again.');
            toast.error('Failed to fetch school data.');
            setIsLoading(false);
        }
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        if (isEditing) {
            setFormData(schoolData);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: type === 'number' ? parseFloat(value) : value,
                },
            }));
        } else if (name === 'gallery' || name === 'schoolDetails.extraCurricularActivities') {
            setFormData(prev => ({
                ...prev,
                [name]: value.split(',').map(item => item.trim()).filter(item => item !== '')
            }));
        }
        else if (name === 'awards') {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
        else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : (type === 'number' ? parseFloat(value) : value),
            }));
        }
    };

    const handleAwardChange = (index, field, value) => {
        const updatedAwards = [...formData.awards];
        updatedAwards[index] = { ...updatedAwards[index], [field]: value };
        setFormData(prev => ({
            ...prev,
            awards: updatedAwards
        }));
    };

    const addAward = () => {
        setFormData(prev => ({
            ...prev,
            awards: [...(prev.awards || []), { name: '', year: new Date().getFullYear(), description: '' }]
        }));
    };

    const removeAward = (index) => {
        setFormData(prev => ({
            ...prev,
            awards: prev.awards.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);
        const token = localStorage.getItem('dashboard');

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            };

            const dataToSend = { ...formData };
            
            if (!dataToSend.schoolDetails) {
                dataToSend.schoolDetails = {};
            }

            if (typeof dataToSend.schoolDetails.extraCurricularActivities === 'string') {
                dataToSend.schoolDetails.extraCurricularActivities = dataToSend.schoolDetails.extraCurricularActivities.split(',').map(item => item.trim()).filter(item => item !== '');
            }

            if (typeof dataToSend.gallery === 'string') {
                dataToSend.gallery = dataToSend.gallery.split(',').map(item => item.trim()).filter(item => item !== '');
            }
            
            await axios.put(`${import.meta.env.VITE_SERVER_URL}/api/schools/school/details`, dataToSend, config);
            setSchoolData(formData);
            setIsEditing(false);
            toast.success('School details updated successfully!');
        } catch (err) {
            console.error('Error saving school data:', err);
            setError('Failed to save school data. Please try again.');
            toast.error('Failed to save school data.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-100 p-8 flex justify-center items-center">
                <Loader2 className="animate-spin text-blue-500 w-12 h-12" />
                <p className="ml-4 text-lg text-gray-700">Loading school information...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 p-8 flex justify-center items-center">
                <p className="text-red-600 text-lg">{error}</p>
            </div>
        );
    }

    if (!schoolData) {
        return (
            <div className="min-h-screen bg-gray-100 p-8 flex justify-center items-center">
                <p className="text-gray-600 text-lg">No school data found for this user.</p>
            </div>
        );
    }

    const renderArrayField = (arr) => {
        return arr && arr.length > 0 ? arr.join(', ') : 'N/A';
    };

    return (
        <div className="min-h-screen bg-gray-100 p-2 font-sans">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">School Information</h1>
                    <button
                        onClick={handleEditToggle}
                        className={`px-4 py-2 rounded-md transition-colors duration-200
                        ${isEditing ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                        disabled={isSaving}
                    >
                        {isEditing ? <><XCircle className="inline-block w-5 h-5 mr-2" /> Cancel</> : <><Pencil className="inline-block w-5 h-5 mr-2" /> Edit</>}
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name:</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name || ''}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            ) : (
                                <p className="mt-1 text-lg text-gray-900">{schoolData.name}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email:</label>
                            <p className="mt-1 text-lg text-gray-900">{schoolData.email}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Institution Type:</label>
                            <p className="mt-1 text-lg text-gray-900">{schoolData.institutionType}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Location:</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location || ''}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            ) : (
                                <p className="mt-1 text-lg text-gray-900">{schoolData.location}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Mobile Number:</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="mobileNumber"
                                    value={formData.mobileNumber || ''}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            ) : (
                                <p className="mt-1 text-lg text-gray-900">{schoolData.mobileNumber}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Foundation Year:</label>
                            {isEditing ? (
                                <input
                                    type="number"
                                    name="foundationYear"
                                    value={formData.foundationYear || ''}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            ) : (
                                <p className="mt-1 text-lg text-gray-900">{schoolData.foundationYear}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Rating:</label>
                            {isEditing ? (
                                <input
                                    type="number"
                                    name="rating"
                                    value={formData.rating || ''}
                                    onChange={handleChange}
                                    min="0"
                                    max="5"
                                    step="0.1"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            ) : (
                                <p className="mt-1 text-lg text-gray-900">{schoolData.rating}</p>
                            )}
                        </div>
                        <div className="flex items-center">
                            <label htmlFor="hostel" className="block text-sm font-medium text-gray-700 mr-2">Hostel Available:</label>
                            {isEditing ? (
                                <input
                                    type="checkbox"
                                    id="hostel"
                                    name="hostel"
                                    checked={formData.hostel || false}
                                    onChange={handleChange}
                                    className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                            ) : (
                                <p className="mt-1 text-lg text-gray-900">{schoolData.hostel ? 'Yes' : 'No'}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">About (Info):</label>
                        {isEditing ? (
                            <textarea
                                name="info"
                                value={formData.info || ''}
                                onChange={handleChange}
                                rows="4"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                            ></textarea>
                        ) : (
                            <p className="mt-1 text-lg text-gray-900 whitespace-pre-wrap">{schoolData.info}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Main Image URL:</label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="image"
                                value={formData.image || ''}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        ) : (
                            <div className="mt-2">
                                <img src={schoolData.image} alt="School Main" className="max-h-48 w-auto rounded-md shadow" />
                                <p className="text-sm text-gray-500 mt-2 break-all">{schoolData.image}</p>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Gallery Image URLs (comma-separated):</label>
                        {isEditing ? (
                            <textarea
                                name="gallery"
                                value={Array.isArray(formData.gallery) ? formData.gallery.join(', ') : ''}
                                onChange={handleChange}
                                rows="3"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                            ></textarea>
                        ) : (
                            <div className="mt-2 flex flex-wrap gap-2">
                                {schoolData.gallery && schoolData.gallery.length > 0 ? (
                                    schoolData.gallery.map((imgUrl, index) => (
                                        <img key={index} src={imgUrl} alt={`Gallery ${index + 1}`} className="h-24 w-auto rounded-md shadow" />
                                    ))
                                ) : (
                                    <p className="text-gray-500">No gallery images.</p>
                                )}
                            </div>
                        )}
                    </div>

                    <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">School Specific Details</h2>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Board:</label>
                        {isEditing ? (
                            <select
                                name="schoolDetails.board"
                                value={formData.schoolDetails?.board || ''}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Select Board</option>
                                <option value="CBSE">CBSE</option>
                                <option value="ICSE">ICSE</option>
                                <option value="BSEAP">BSEAP</option>
                                <option value="Other State Board">Other State Board</option>
                                <option value="International">International</option>
                            </select>
                        ) : (
                            <p className="mt-1 text-lg text-gray-900">{schoolData.schoolDetails?.board || 'N/A'}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Special Training:</label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="schoolDetails.specialTraining"
                                value={formData.schoolDetails?.specialTraining || ''}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        ) : (
                            <p className="mt-1 text-lg text-gray-900">{schoolData.schoolDetails?.specialTraining || 'N/A'}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Extra Curricular Activities (comma-separated):</label>
                        {isEditing ? (
                            <textarea
                                name="schoolDetails.extraCurricularActivities"
                                value={Array.isArray(formData.schoolDetails?.extraCurricularActivities) ? formData.schoolDetails.extraCurricularActivities.join(', ') : ''}
                                onChange={handleChange}
                                rows="3"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                            ></textarea>
                        ) : (
                            <p className="mt-1 text-lg text-gray-900">{renderArrayField(schoolData.schoolDetails?.extraCurricularActivities)}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Transportation:</label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="schoolDetails.transportation"
                                value={formData.schoolDetails?.transportation || ''}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        ) : (
                            <p className="mt-1 text-lg text-gray-900">{schoolData.schoolDetails?.transportation || 'N/A'}</p>
                        )}
                    </div>

                    <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Coordinates</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Latitude:</label>
                            {isEditing ? (
                                <input
                                    type="number"
                                    name="coordinates.latitude"
                                    value={formData.coordinates?.latitude || ''}
                                    onChange={handleChange}
                                    min="-90"
                                    max="90"
                                    step="any"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            ) : (
                                <p className="mt-1 text-lg text-gray-900">{schoolData.coordinates?.latitude || 'N/A'}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Longitude:</label>
                            {isEditing ? (
                                <input
                                    type="number"
                                    name="coordinates.longitude"
                                    value={formData.coordinates?.longitude || ''}
                                    onChange={handleChange}
                                    min="-180"
                                    max="180"
                                    step="any"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            ) : (
                                <p className="mt-1 text-lg text-gray-900">{schoolData.coordinates?.longitude || 'N/A'}</p>
                            )}
                        </div>
                    </div>

                    <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Awards</h2>
                    {isEditing ? (
                        <div className="space-y-4">
                            {(formData.awards || []).map((award, index) => (
                                <div key={index} className="border border-gray-200 p-4 rounded-md relative">
                                    <button
                                        type="button"
                                        onClick={() => removeAward(index)}
                                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                    >
                                        <XCircle className="w-5 h-5" />
                                    </button>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Award Name:</label>
                                            <input
                                                type="text"
                                                value={award.name || ''}
                                                onChange={(e) => handleAwardChange(index, 'name', e.target.value)}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Year:</label>
                                            <input
                                                type="number"
                                                value={award.year || ''}
                                                onChange={(e) => handleAwardChange(index, 'year', parseFloat(e.target.value))}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                            />
                                        </div>
                                        <div className="md:col-span-3">
                                            <label className="block text-sm font-medium text-gray-700">Description:</label>
                                            <textarea
                                                value={award.description || ''}
                                                onChange={(e) => handleAwardChange(index, 'description', e.target.value)}
                                                rows="2"
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addAward}
                                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200"
                            >
                                Add Award
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {schoolData.awards && schoolData.awards.length > 0 ? (
                                schoolData.awards.map((award, index) => (
                                    <div key={index} className="border-b pb-2 last:border-b-0">
                                        <p className="font-semibold text-gray-900">{award.name} ({award.year})</p>
                                        <p className="text-gray-700 text-sm">{award.description}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">No awards listed.</p>
                            )}
                        </div>
                    )}


                    {isEditing && (
                        <div className="flex justify-end gap-4 mt-8">
                            <button
                                type="submit"
                                className="px-6 py-3 bg-green-600 text-white rounded-md shadow-md hover:bg-green-700 transition-colors duration-200 flex items-center"
                                disabled={isSaving}
                            >
                                {isSaving ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : <Save className="w-5 h-5 mr-2" />}
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default SchoolInfo;