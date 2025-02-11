// src/components/AlertPopup.jsx
import React, { useState, useEffect } from 'react';
import { Bell, X, VolumeX, Volume2 } from 'lucide-react';
import { alertService } from '../services/AlertService';

export const AlertPopup = () => {
  const [currentAlert, setCurrentAlert] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [alertAudio] = useState(new Audio('/alert-sound.mp3')); // Add an alert sound file to public folder

  useEffect(() => {
    const handleNewAlert = (alerts) => {
      const latestAlert = alerts[0];
      if (latestAlert && !latestAlert.acknowledged) {
        setCurrentAlert(latestAlert);
        if (soundEnabled) {
          alertAudio.play().catch(e => console.log('Audio play failed:', e));
        }
      }
    };

    return alertService.subscribe(handleNewAlert);
  }, [alertAudio, soundEnabled]);

  const handleClose = () => {
    if (currentAlert) {
      alertService.acknowledgeAlert(currentAlert.id);
      setCurrentAlert(null);
    }
  };

  if (!currentAlert) return null;

  return (
    <div className="fixed top-4 right-4 z-50 alert-slide-in">
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-lg max-w-md">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Bell className="h-6 w-6 text-red-500" />
          </div>
          <div className="ml-3 w-0 flex-1">
            <p className="text-sm font-medium text-red-800">
              Alert in {currentAlert.zoneName}
            </p>
            <p className="mt-1 text-sm text-red-700">
              {currentAlert.message} - {currentAlert.value}
            </p>
            <div className="mt-2 flex">
              <button
                onClick={handleClose}
                className="text-sm font-medium text-red-600 hover:text-red-500"
              >
                Acknowledge
              </button>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="ml-3 text-sm text-red-600 hover:text-red-500"
              >
                {soundEnabled ? (
                  <Volume2 className="h-4 w-4 alert-sound-icon" />
                ) : (
                  <VolumeX className="h-4 w-4 alert-sound-icon" />
                )}
              </button>
            </div>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className="rounded-md inline-flex text-red-400 hover:text-red-500 focus:outline-none"
              onClick={handleClose}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};