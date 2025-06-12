// src/pages/NotificationsPage.jsx
import React, { useState } from 'react';
import NotificationForm from '../Dashboard/Hospital/Notification/NotificationForm';
import NotificationTemplateList from '../Dashboard/Hospital/Notification/NotificationTemplateList';
import ConfirmationModal from '../Dashboard/Hospital/Notification/ConfirmationModal';
import { dummyTemplates, dummyDoctors, dummyConditions } from '../data/dummyNotificationData';

const NotificationsPage = () => {
  const [templates, setTemplates] = useState(dummyTemplates);
  const [currentNotification, setCurrentNotification] = useState(null); // Data for the form
  const [editingTemplateId, setEditingTemplateId] = useState(null); // ID of template being edited
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalAction, setModalAction] = useState(null); // Function to call on confirmation

  // Function to simulate sending a notification
  const sendNotification = (notificationData) => {
    console.log('Sending Notification:', notificationData);
    // In a real app, you'd send this data to your backend API
    setModalMessage(`Notification "${notificationData.title}" sent successfully!`);
    setModalAction(null); // No action after just an info message
    setIsConfirmationModalOpen(true);
    setCurrentNotification(null); // Clear form after sending
  };

  // Template CRUD operations
  const handleSaveTemplate = (templateData) => {
    if (editingTemplateId) {
      setTemplates(prevTemplates =>
        prevTemplates.map(t =>
          t.id === editingTemplateId ? { ...templateData, id: editingTemplateId } : t
        )
      );
      setEditingTemplateId(null);
      setModalMessage("Template updated successfully!");
    } else {
      const newTemplate = { ...templateData, id: `temp${Date.now()}` };
      setTemplates(prevTemplates => [...prevTemplates, newTemplate]);
      setModalMessage("Template created successfully!");
    }
    setModalAction(null);
    setIsConfirmationModalOpen(true);
    // After saving a template, usually clear the form or set it to default state
    setCurrentNotification(null);
  };

  const handleEditTemplate = (template) => {
    setCurrentNotification(template);
    setEditingTemplateId(template.id);
  };

  const handleDeleteTemplate = (templateId) => {
    setModalMessage("Are you sure you want to delete this template?");
    setModalAction(() => () => { // Function to be executed on confirm
      setTemplates(prevTemplates => prevTemplates.filter(t => t.id !== templateId));
      setModalMessage("Template deleted successfully!");
      setModalAction(null); // Clear action after success
      setIsConfirmationModalOpen(true); // Re-open modal for success message
    });
    setIsConfirmationModalOpen(true);
  };

  const handleApplyTemplate = (template) => {
    setCurrentNotification(template); // Load template data into the form
    setEditingTemplateId(null); // Not editing the template itself, just using its data
  };

  const handleClearForm = () => {
    setCurrentNotification(null);
    setEditingTemplateId(null);
  }

  return (
    <div className=" px-2 bg-gray-100 min-h-screen font-inter">
      <h1 className="text-3xl font-bold text-gray-800 ">Custom Notifications</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Panel: Templates List */}
        <div className="lg:w-[30%] bg-white p-6 rounded-lg shadow-md max-h-[80vh] overflow-y-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Notification Templates</h2>
          <button
            onClick={handleClearForm}
            className="w-full px-4 py-2 mb-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Create New Notification
          </button>
          <NotificationTemplateList
            templates={templates}
            onEditTemplate={handleEditTemplate}
            onDeleteTemplate={handleDeleteTemplate}
            onApplyTemplate={handleApplyTemplate}
          />
        </div>

        {/* Right Panel: Notification Form */}
        <div className="lg:w-2/3 bg-white p-6 rounded-lg shadow-md max-h-[80vh] overflow-y-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            {editingTemplateId ? 'Edit Template' : (currentNotification ? 'Edit Notification' : 'New Notification')}
          </h2>
          <NotificationForm
            initialData={currentNotification}
            onSend={sendNotification}
            onSaveTemplate={handleSaveTemplate}
            onCancel={handleClearForm}
            doctors={dummyDoctors}
            conditions={dummyConditions}
            isEditingTemplate={!!editingTemplateId}
          />
        </div>
      </div>

      {isConfirmationModalOpen && (
        <ConfirmationModal
          message={modalMessage}
          onConfirm={() => {
            if (modalAction) modalAction();
            setIsConfirmationModalOpen(false);
          }}
          onCancel={() => setIsConfirmationModalOpen(false)}
          showCancelButton={!!modalAction} // Show cancel only if there's an action
        />
      )}
    </div>
  );
};

export default NotificationsPage;
