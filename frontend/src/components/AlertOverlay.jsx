// src/components/AlertOverlay.jsx
import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useAlert } from '../contexts/AlertContext';

export const AlertOverlay = () => {
  const { activeAlert, acknowledgeAlert, goToMap } = useAlert();

  if (!activeAlert) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
        <div className="bg-red-500 p-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6" />
            <h2 className="text-xl font-bold">Critical Alert</h2>
          </div>
          <button 
            onClick={() => acknowledgeAlert(activeAlert.id)}
            className="hover:bg-red-600 p-1 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="space-y-2">
            <p className="text-lg font-semibold">{activeAlert.message}</p>
            <div className="text-sm space-y-1 text-gray-600">
              <p>Zone: {activeAlert.zoneName}</p>
              <p>Value: {activeAlert.value}</p>
              <p>Threshold: {activeAlert.threshold}</p>
              <p className="text-xs mt-2">
                {new Date(activeAlert.timestamp).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={() => acknowledgeAlert(activeAlert.id)}
              className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 
                       rounded-lg transition-colors text-gray-700"
            >
              Dismiss
            </button>
            <button
              onClick={goToMap}
              className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg 
                       hover:bg-red-600 transition-colors font-medium"
            >
              View on Map
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};