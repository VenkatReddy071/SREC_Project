// src/components/NotificationForm.jsx
import React, { useState, useEffect } from 'react';


const NotificationForm = ({ initialData, onSend, onSaveTemplate, onCancel, doctors, conditions, isEditingTemplate }) => {
  const [formData, setFormData] = useState({
    recipientType: 'All Users',
    selectedCondition: '',
    selectedDoctor: '',
    specificRecipients: '', // comma-separated emails/phones
    notificationType: 'Email',
    title: '',
    subject: '', // For Email/In-App
    content: '',
    ctaLink: '',
    scheduling: 'send_immediately', // or 'schedule_later'
    scheduledDate: '',
    scheduledTime: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        recipientType: initialData.recipientType || 'All Users',
        selectedCondition: initialData.selectedCondition || '',
        selectedDoctor: initialData.selectedDoctor || '',
        specificRecipients: initialData.specificRecipients || '',
        notificationType: initialData.notificationType || 'Email',
        title: initialData.title || '',
        subject: initialData.subject || '',
        content: initialData.content || '',
        ctaLink: initialData.ctaLink || '',
        scheduling: initialData.scheduling || 'send_immediately',
        scheduledDate: initialData.scheduledDate ? new Date(initialData.scheduledDate).toISOString().split('T')[0] : '',
        scheduledTime: initialData.scheduledTime || '',
      });
    } else {
      // Reset form when initialData is null (new notification)
      setFormData({
        recipientType: 'All Users',
        selectedCondition: '',
        selectedDoctor: '',
        specificRecipients: '',
        notificationType: 'Email',
        title: '',
        subject: '',
        content: '',
        ctaLink: '',
        scheduling: 'send_immediately',
        scheduledDate: '',
        scheduledTime: '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSend = () => {
    // Basic validation
    if (!formData.title && (formData.notificationType === 'Email' || formData.notificationType === 'In-App')) { // Title/Subject is "title" in form for email/in-app
        alert('Please fill in the message subject/title.');
        return;
    }
    if (!formData.content) {
      alert('Please fill in message content.');
      return;
    }

    if (formData.scheduling === 'schedule_later' && (!formData.scheduledDate || !formData.scheduledTime)) {
      alert('Please select a scheduled date and time.');
      return;
    }

    const payload = {
      ...formData,
      // Clean up fields not relevant to current recipient type if sending
      selectedCondition: formData.recipientType === 'Patients with X condition' ? formData.selectedCondition : null,
      selectedDoctor: formData.recipientType === 'Patients of Doctor Y' ? formData.selectedDoctor : null,
      specificRecipients: formData.recipientType === 'Specific Users' ? formData.specificRecipients.split(',').map(s => s.trim()) : null,
    };

    onSend(payload);
  };

  const handleSaveAsTemplate = () => {
    // Basic validation for template (might be less strict than sending)
    if (!formData.title && (formData.notificationType === 'Email' || formData.notificationType === 'In-App')) {
        alert('Template needs at least a subject/title.');
        return;
    }
    if (!formData.content) {
        alert('Template needs at least content.');
        return;
    }
    const templatePayload = {
      title: formData.title, // Using formData.title as it's the general input for subject/title
      subject: formData.subject, // Keeping subject as well for clarity if needed by initialData
      content: formData.content,
      ctaLink: formData.ctaLink,
      notificationType: formData.notificationType,
      // Templates typically don't store recipient/scheduling info
    };
    onSaveTemplate(templatePayload);
  };

  return (
    <div className="space-y-6">
      {/* Recipient Selection */}
      <div className="bg-blue-50 p-4 rounded-md">
        <label htmlFor="recipientType" className="block text-sm font-medium text-gray-700 mb-2">Recipient Selection</label>
        <select
          id="recipientType"
          name="recipientType"
          value={formData.recipientType}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="All Users">All Users</option>
          <option value="Patients with X condition">Patients with specific condition</option>
          <option value="Patients of Doctor Y">Patients of specific Doctor</option>
          <option value="Specific Users">Specific Users (Email/Phone)</option>
        </select>

        {formData.recipientType === 'Patients with X condition' && (
          <div className="mt-4">
            <label htmlFor="selectedCondition" className="block text-sm font-medium text-gray-700">Condition</label>
            <select
              id="selectedCondition"
              name="selectedCondition"
              value={formData.selectedCondition}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select Condition</option>
              {conditions.map(condition => (
                <option key={condition} value={condition}>{condition}</option>
              ))}
            </select>
          </div>
        )}

        {formData.recipientType === 'Patients of Doctor Y' && (
          <div className="mt-4">
            <label htmlFor="selectedDoctor" className="block text-sm font-medium text-gray-700">Doctor</label>
            <select
              id="selectedDoctor"
              name="selectedDoctor"
              value={formData.selectedDoctor}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select Doctor</option>
              {doctors.map(doc => (
                <option key={doc.id} value={doc.id}>{doc.name} ({doc.specialization})</option>
              ))}
            </select>
          </div>
        )}

        {formData.recipientType === 'Specific Users' && (
          <div className="mt-4">
            <label htmlFor="specificRecipients" className="block text-sm font-medium text-gray-700">Specific Users (comma-separated emails or phone numbers)</label>
            <textarea
              id="specificRecipients"
              name="specificRecipients"
              rows="2"
              value={formData.specificRecipients}
              onChange={handleChange}
              placeholder="e.g., user1@example.com, +1234567890"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm overflow-auto break-words" // Added overflow-auto and break-words
            ></textarea>
          </div>
        )}
      </div>

      {/* Notification Type */}
      <div>
        <label htmlFor="notificationType" className="block text-sm font-medium text-gray-700">Notification Type</label>
        <select
          id="notificationType"
          name="notificationType"
          value={formData.notificationType}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="Email">Email</option>
          <option value="SMS">SMS</option>
          <option value="In-App">In-App Notification</option>
        </select>
      </div>

      {/* Message Title/Subject */}
      {(formData.notificationType === 'Email' || formData.notificationType === 'In-App') && (
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject / Title</label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="e.g., Your Appointment Reminder"
          />
        </div>
      )}

      {/* Message Content */}
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">Message Content</label>
        <textarea
          id="content"
          name="content"
          rows="5"
          value={formData.content}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="Enter your notification message here..."
        ></textarea>
      </div>

      {/* Call to Action */}
      <div>
        <label htmlFor="ctaLink" className="block text-sm font-medium text-gray-700">Call to Action Link (Optional)</label>
        <input
          type="url"
          id="ctaLink"
          name="ctaLink"
          value={formData.ctaLink}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="e.g., https://yourhospital.com/offers"
        />
      </div>

      {/* Scheduling */}
      <div className="bg-blue-50 p-4 rounded-md">
        <label className="block text-sm font-medium text-gray-700 mb-2">Scheduling</label>
        <div className="flex items-center space-x-4 flex-wrap"> {/* Added flex-wrap */}
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="scheduling"
              value="send_immediately"
              checked={formData.scheduling === 'send_immediately'}
              onChange={handleChange}
              className="form-radio text-blue-600"
            />
            <span className="ml-2 text-gray-700">Send Immediately</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="scheduling"
              value="schedule_later"
              checked={formData.scheduling === 'schedule_later'}
              onChange={handleChange}
              className="form-radio text-blue-600"
            />
            <span className="ml-2 text-gray-700">Schedule for Later</span>
          </label>
        </div>

        {formData.scheduling === 'schedule_later' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label htmlFor="scheduledDate" className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                id="scheduledDate"
                name="scheduledDate"
                value={formData.scheduledDate}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="scheduledTime" className="block text-sm font-medium text-gray-700">Time</label>
              <input
                type="time"
                id="scheduledTime"
                name="scheduledTime"
                value={formData.scheduledTime}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 mt-6 flex-wrap"> {/* Added flex-wrap */}
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          Cancel
        </button>

        {!isEditingTemplate && ( // Only show "Save as Template" if not currently editing a template
          <button
            type="button"
            onClick={handleSaveAsTemplate}
            className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            Save as Template
          </button>
        )}

        <button
          type="button"
          onClick={isEditingTemplate ? () => onSaveTemplate(formData) : handleSend} // If editing template, 'send' button becomes 'update template'
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {isEditingTemplate ? 'Update Template' : 'Send Notification'}
        </button>
      </div>
    </div>
  );
};

export default NotificationForm;