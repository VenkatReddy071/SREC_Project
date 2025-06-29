import React, { useState, useEffect } from 'react';
import { Pencil, Save, XCircle, Loader2, Trash2, Plus, Minus } from 'lucide-react';
import { toast } from 'react-toastify';

const SkeletonDetails = () => (
    <div className="space-y-4 p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-gray-200 animate-pulse"></div>
        </div>
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4 animate-pulse"></div>
        <div className="grid grid-cols-2 gap-4">
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
        </div>
        <div className="h-24 bg-gray-200 rounded w-full mt-4 animate-pulse"></div>
    </div>
);

const TeacherDetails = ({ teacher, onSave, onDelete, onCancelAdd, isAddingNew }) => {
    const [isEditing, setIsEditing] = useState(isAddingNew);
    const [formData, setFormData] = useState(() => {
        if (isAddingNew) {
            return {
                name: '', email: '', mobileNumber: '', gender: '', dateOfBirth: '',
                address: { street: '', city: '', state: '', zipCode: '', country: '' },
                experienceYears: 0, specialization: '', subjectsTaught: '',
                educationalQualifications: [], certifications: [],
                employeeId: '', dateOfJoining: '', profileImage: '',
            };
        } else if (teacher) {
            return {
                ...teacher,
                dateOfBirth: teacher.dateOfBirth ? new Date(teacher.dateOfBirth).toISOString().split('T')[0] : '',
                dateOfJoining: teacher.dateOfJoining ? new Date(teacher.dateOfJoining).toISOString().split('T')[0] : '',
                subjectsTaught: Array.isArray(teacher.subjectsTaught) ? teacher.subjectsTaught.join(', ') : '',
                educationalQualifications: teacher.educationalQualifications || [],
                certifications: teacher.certifications || [],
                address: teacher.address || { street: '', city: '', state: '', zipCode: '', country: '' },
            };
        }
        return {};
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isAddingNew) {
            setFormData({
                name: '', email: '', mobileNumber: '', gender: '', dateOfBirth: '',
                address: { street: '', city: '', state: '', zipCode: '', country: '' },
                experienceYears: 0, specialization: '', subjectsTaught: '',
                educationalQualifications: [], certifications: [],
                employeeId: '', dateOfJoining: '', profileImage: '',
            });
        } else if (teacher) {
            setFormData({
                ...teacher,
                dateOfBirth: teacher.dateOfBirth ? new Date(teacher.dateOfBirth).toISOString().split('T')[0] : '',
                dateOfJoining: teacher.dateOfJoining ? new Date(teacher.dateOfJoining).toISOString().split('T')[0] : '',
                subjectsTaught: Array.isArray(teacher.subjectsTaught) ? teacher.subjectsTaught.join(', ') : '',
                educationalQualifications: teacher.educationalQualifications || [],
                certifications: teacher.certifications || [],
                address: teacher.address || { street: '', city: '', state: '', zipCode: '', country: '' },
            });
        } else {
            setFormData({});
        }
        setIsEditing(isAddingNew);
    }, [teacher, isAddingNew]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.startsWith('address.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                address: {
                    ...(prev.address || { street: '', city: '', state: '', zipCode: '', country: '' }),
                    [field]: value,
                },
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleArrayItemChange = (arrayName, index, field, value) => {
        setFormData(prev => {
            const updatedArray = [...(prev[arrayName] || [])];
            updatedArray[index] = { ...updatedArray[index], [field]: value };
            return { ...prev, [arrayName]: updatedArray };
        });
    };

    const addArrayItem = (arrayName, newItemTemplate) => {
        setFormData(prev => ({
            ...prev,
            [arrayName]: [...(prev[arrayName] || []), newItemTemplate],
        }));
    };

    const removeArrayItem = (arrayName, index) => {
        setFormData(prev => ({
            ...prev,
            [arrayName]: prev[arrayName].filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        const dataToSave = { ...formData };

        dataToSave.subjectsTaught = dataToSave.subjectsTaught
            ? dataToSave.subjectsTaught.split(',').map(s => s.trim()).filter(s => s)
            : [];

        dataToSave.dateOfBirth = dataToSave.dateOfBirth || null;
        dataToSave.dateOfJoining = dataToSave.dateOfJoining || null;

        dataToSave.educationalQualifications = (dataToSave.educationalQualifications || []).map(eq => ({
            ...eq,
            year: eq.year ? parseInt(eq.year) : null,
        }));
        dataToSave.certifications = (dataToSave.certifications || []).map(cert => ({
            ...cert,
            issueDate: cert.issueDate || null,
        }));

        try {
            await onSave(dataToSave, isAddingNew ? null : teacher._id);
            setIsEditing(false);
        } catch (error) {
            toast.error(`Failed to save teacher: ${error.response?.data?.msg || error.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    if (!teacher && !isAddingNew) {
        return (
            <div className="flex-1 p-6 flex items-center justify-center bg-gray-50 rounded-lg shadow-inner">
                <p className="text-gray-500 text-xl">Select a teacher from the list or click "Add New Teacher" to begin.</p>
            </div>
        );
    }

    const currentTeacher = teacher || {};

    return (
        <div className="flex-1 bg-white p-6 rounded-lg shadow-lg relative overflow-y-auto h-full">
            {isSaving && (
                <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg z-10">
                    <Loader2 className="animate-spin w-10 h-10 text-blue-500" />
                    <span className="ml-3 text-lg font-semibold text-blue-600">Saving...</span>
                </div>
            )}

            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                    {isAddingNew ? 'Add New Teacher' : (isEditing ? 'Edit Teacher Details' : 'Teacher Details')}
                </h2>
                {!isAddingNew && (
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className={`px-4 py-2 rounded-md transition-colors duration-200 flex items-center
                            ${isEditing ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                            disabled={isSaving}
                        >
                            {isEditing ? <><XCircle className="w-5 h-5 mr-2" /> Cancel</> : <><Pencil className="w-5 h-5 mr-2" /> Edit</>}
                        </button>
                        <button
                            onClick={() => onDelete(currentTeacher._id)}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 flex items-center"
                            disabled={isEditing || isSaving}
                        >
                            <Trash2 className="w-5 h-5 mr-2" /> Delete
                        </button>
                    </div>
                )}
                {isAddingNew && (
                    <button
                        onClick={onCancelAdd}
                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors duration-200 flex items-center"
                        disabled={isSaving}
                    >
                        <XCircle className="w-5 h-5 mr-2" /> Cancel
                    </button>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex justify-center mb-6">
                    {formData.profileImage ? (
                        <img
                            src={formData.profileImage}
                            alt={formData.name || 'Teacher'}
                            className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 shadow-md"
                        />
                    ) : (
                        <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-5xl font-bold border-4 border-gray-200 shadow-md">
                            {formData.name ? formData.name.charAt(0).toUpperCase() : '?'}
                        </div>
                    )}
                </div>

                {isEditing ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name <span className="text-red-500">*</span></label>
                            <input type="text" name="name" value={formData?.name || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email <span className="text-red-500">*</span></label>
                            <input type="email" name="email" value={formData?.email || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Mobile Number <span className="text-red-500">*</span></label>
                            <input type="text" name="mobileNumber" value={formData?.mobileNumber || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Gender</label>
                            <select name="gender" value={formData?.gender || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                            <input type="date" name="dateOfBirth" value={formData?.dateOfBirth || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Experience Years <span className="text-red-500">*</span></label>
                            <input type="number" name="experienceYears" value={formData?.experienceYears || 0} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" min="0" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Specialization <span className="text-red-500">*</span></label>
                            <input type="text" name="specialization" value={formData?.specialization || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Subjects Taught (comma-separated)</label>
                            <input type="text" name="subjectsTaught" value={formData?.subjectsTaught || ''} onChange={handleChange} placeholder="Math, Science, English" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Employee ID</label>
                            <input type="text" name="employeeId" value={formData?.employeeId || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Date of Joining <span className="text-red-500">*</span></label>
                            <input type="date" name="dateOfJoining" value={formData?.dateOfJoining || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" required />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Profile Image URL</label>
                            <input type="text" name="profileImage" value={formData?.profileImage || ''} onChange={handleChange} placeholder="http://example.com/image.jpg" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" />
                        </div>

                        <div className="md:col-span-2 border-t pt-4 mt-4">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Address</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Street</label>
                                    <input type="text" name="address.street" value={formData?.address?.street || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">City</label>
                                    <input type="text" name="address.city" value={formData?.address?.city || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">State</label>
                                    <input type="text" name="address.state" value={formData?.address?.state || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Zip Code</label>
                                    <input type="text" name="address.zipCode" value={formData?.address?.zipCode || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Country</label>
                                    <input type="text" name="address.country" value={formData?.address?.country || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-2 border-t pt-4 mt-4">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2 flex justify-between items-center">
                                Educational Qualifications
                                <button type="button" onClick={() => addArrayItem('educationalQualifications', { degree: '', university: '', year: '' })} className="px-3 py-1 bg-green-500 text-white rounded-md text-sm hover:bg-green-600 flex items-center">
                                    <Plus className="w-4 h-4 mr-1" /> Add
                                </button>
                            </h3>
                            {(formData?.educationalQualifications || []).map((eq, index) => (
                                <div key={index} className="flex flex-wrap items-end space-x-2 mb-2 p-3 border border-gray-200 rounded-md bg-gray-50">
                                    <div className="flex-1 min-w-[120px]">
                                        <label className="block text-sm font-medium text-gray-700">Degree</label>
                                        <input type="text" value={eq.degree || ''} onChange={(e) => handleArrayItemChange('educationalQualifications', index, 'degree', e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-1" required />
                                    </div>
                                    <div className="flex-1 min-w-[120px]">
                                        <label className="block text-sm font-medium text-gray-700">University</label>
                                        <input type="text" value={eq.university || ''} onChange={(e) => handleArrayItemChange('educationalQualifications', index, 'university', e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-1" required />
                                    </div>
                                    <div className="w-24">
                                        <label className="block text-sm font-medium text-gray-700">Year</label>
                                        <input type="number" value={eq.year || ''} onChange={(e) => handleArrayItemChange('educationalQualifications', index, 'year', e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-1" min="1900" max={new Date().getFullYear() + 5} />
                                    </div>
                                    <button type="button" onClick={() => removeArrayItem('educationalQualifications', index)} className="p-1 text-red-500 hover:text-red-700 ml-2">
                                        <Minus className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                            {(formData?.educationalQualifications || []).length === 0 && (
                                <p className="text-sm text-gray-500 italic">No qualifications added yet.</p>
                            )}
                        </div>

                        <div className="md:col-span-2 border-t pt-4 mt-4">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2 flex justify-between items-center">
                                Certifications
                                <button type="button" onClick={() => addArrayItem('certifications', { name: '', issuingBody: '', issueDate: '' })} className="px-3 py-1 bg-green-500 text-white rounded-md text-sm hover:bg-green-600 flex items-center">
                                    <Plus className="w-4 h-4 mr-1" /> Add
                                </button>
                            </h3>
                            {(formData?.certifications || []).map((cert, index) => (
                                <div key={index} className="flex flex-wrap items-end space-x-2 mb-2 p-3 border border-gray-200 rounded-md bg-gray-50">
                                    <div className="flex-1 min-w-[120px]">
                                        <label className="block text-sm font-medium text-gray-700">Name</label>
                                        <input type="text" value={cert.name || ''} onChange={(e) => handleArrayItemChange('certifications', index, 'name', e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-1" required />
                                    </div>
                                    <div className="flex-1 min-w-[120px]">
                                        <label className="block text-sm font-medium text-gray-700">Issuing Body</label>
                                        <input type="text" value={cert.issuingBody || ''} onChange={(e) => handleArrayItemChange('certifications', index, 'issuingBody', e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-1" />
                                    </div>
                                    <div className="w-32">
                                        <label className="block text-sm font-medium text-gray-700">Issue Date</label>
                                        <input type="date" value={cert.issueDate ? new Date(cert.issueDate).toISOString().split('T')[0] : ''} onChange={(e) => handleArrayItemChange('certifications', index, 'issueDate', e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-1" />
                                    </div>
                                    <button type="button" onClick={() => removeArrayItem('certifications', index)} className="p-1 text-red-500 hover:text-red-700 ml-2">
                                        <Minus className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                            {(formData?.certifications || []).length === 0 && (
                                <p className="text-sm text-gray-500 italic">No certifications added yet.</p>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium text-gray-700">Name:</p>
                            <p className="text-lg text-gray-900 font-semibold">{currentTeacher.name}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700">Email:</p>
                            <p className="text-lg text-gray-900">{currentTeacher.email}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700">Mobile Number:</p>
                            <p className="text-lg text-gray-900">{currentTeacher.mobileNumber}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700">Gender:</p>
                            <p className="text-lg text-gray-900">{currentTeacher.gender || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700">Date of Birth:</p>
                            <p className="text-lg text-gray-900">{currentTeacher.dateOfBirth ? new Date(currentTeacher.dateOfBirth).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700">Experience Years:</p>
                            <p className="text-lg text-gray-900">{currentTeacher.experienceYears} years</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700">Specialization:</p>
                            <p className="text-lg text-gray-900">{currentTeacher.specialization}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700">Subjects Taught:</p>
                            <p className="text-lg text-gray-900">{currentTeacher.subjectsTaught?.length > 0 ? currentTeacher.subjectsTaught.join(', ') : 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700">Employee ID:</p>
                            <p className="text-lg text-gray-900">{currentTeacher.employeeId || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700">Date of Joining:</p>
                            <p className="text-lg text-gray-900">{currentTeacher.dateOfJoining ? new Date(currentTeacher.dateOfJoining).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</p>
                        </div>
                        <div className="md:col-span-2 border-t pt-4 mt-4">
                            <p className="text-lg font-semibold text-gray-800 mb-2">Address:</p>
                            <p className="text-lg text-gray-900">
                                {`${currentTeacher.address?.street ? currentTeacher.address.street + ', ' : ''}${currentTeacher.address?.city ? currentTeacher.address.city + ', ' : ''}${currentTeacher.address?.state ? currentTeacher.address.state + ', ' : ''}${currentTeacher.address?.zipCode || ''}${currentTeacher.address?.country ? ', ' + currentTeacher.address.country : ''}`}
                                {(!currentTeacher.address?.street && !currentTeacher.address?.city && !currentTeacher.address?.state && !currentTeacher.address?.zipCode && !currentTeacher.address?.country) && 'N/A'}
                            </p>
                        </div>
                        <div className="md:col-span-2 border-t pt-4 mt-4">
                            <p className="text-lg font-semibold text-gray-800 mb-2">Educational Qualifications:</p>
                            {currentTeacher.educationalQualifications && currentTeacher.educationalQualifications.length > 0 ? (
                                <ul className="list-disc list-inside text-gray-900 ml-4">
                                    {currentTeacher.educationalQualifications.map((eq, idx) => (
                                        <li key={idx}>{eq.degree} from {eq.university} ({eq.year || 'N/A'})</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-700">N/A</p>
                            )}
                        </div>
                        <div className="md:col-span-2 border-t pt-4 mt-4">
                            <p className="text-lg font-semibold text-gray-800 mb-2">Certifications:</p>
                            {currentTeacher.certifications && currentTeacher.certifications.length > 0 ? (
                                <ul className="list-disc list-inside text-gray-900 ml-4">
                                    {currentTeacher.certifications.map((cert, idx) => (
                                        <li key={idx}>{cert.name} (Issued by {cert.issuingBody || 'N/A'}) on {cert.issueDate ? new Date(cert.issueDate).toLocaleDateString() : 'N/A'}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-700">N/A</p>
                            )}
                        </div>
                    </div>
                )}

                {isEditing && (
                    <div className="mt-6 flex justify-end">
                        <button
                            type="submit"
                            className="px-6 py-3 bg-green-600 text-white rounded-md shadow-md hover:bg-green-700 transition-colors duration-200 flex items-center"
                            disabled={isSaving}
                        >
                            {isSaving ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : <Save className="w-5 h-5 mr-2" />}
                            {isSaving ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default TeacherDetails;