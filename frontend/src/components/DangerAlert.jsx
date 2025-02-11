// src/components/DangerAlert.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, X } from 'lucide-react';

export const DangerAlert = ({ sensor, onClose }) => {
  const navigate = useNavigate();
  const threshold = THRESHOLDS[sensor.properties.Descrip];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="bg-red-500 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <AlertTriangle size={24} />
            <h2 className="text-xl font-bold">DANGER - Critical Value Detected</h2>
          </div>
          <button onClick={onClose} className="text-white hover:bg-red-600 rounded-full p-1">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <p className="text-lg font-semibold">
              {sensor.properties.Descrip} sensor in {sensor.properties.name}
            </p>
            <p className="text-red-600 font-bold text-2xl">
              Current Value: {sensor.properties.current_value} {threshold.unit}
            </p>
            <p className="text-gray-600">
              Threshold: {threshold.value} {threshold.unit}
            </p>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Acknowledge
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              View on Map
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};