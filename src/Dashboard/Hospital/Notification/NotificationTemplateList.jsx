// src/components/NotificationTemplateList.jsx
import React from 'react';

const NotificationTemplateList = ({ templates, onEditTemplate, onDeleteTemplate, onApplyTemplate }) => {
  return (
    <div className="space-y-4">
      {templates.length === 0 ? (
        <p className="text-gray-500">No templates defined yet.</p>
      ) : (
        templates.map(template => (
          <div key={template.id} className="bg-blue-50 border border-blue-200 p-4 rounded-lg shadow-sm">
            {/* Added 'truncate' class to h3 and p for title and subject */}
            <h3 className="text-lg font-semibold text-blue-800 truncate">{template.title}</h3>
            <p className="text-gray-700 text-sm mt-1 mb-2 truncate">{template.subject}</p>
            <p className="text-gray-600 text-xs truncate">{template.content}</p> {/* Already had truncate */}
            <span className="inline-block bg-blue-200 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded-full mt-2">
              {template.notificationType}
            </span>
            <div className="flex space-x-2 mt-3">
              <button
                onClick={() => onApplyTemplate(template)}
                className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Apply
              </button>
              <button
                onClick={() => onEditTemplate(template)}
                className="px-3 py-1 bg-indigo-500 text-white text-sm rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                Edit
              </button>
              <button
                onClick={() => onDeleteTemplate(template.id)}
                className="px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default NotificationTemplateList;