// src/components/Alert.jsx
import React from 'react';
import { X } from 'lucide-react';

export const Alert = ({ message, onClose, onViewMap }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold text-red-600">Alert!</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
        <p className="text-gray-700 mb-4">{message}</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
          >
            Close
          </button>
          <button
            onClick={onViewMap}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            View on Map
          </button>
        </div>
      </div>
    </div>
  );
};