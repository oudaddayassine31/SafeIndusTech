// src/contexts/AlertContext.jsx
import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AlertContext = createContext();

// This is the hook that was missing
export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

export const AlertProvider = ({ children }) => {
  const [activeAlert, setActiveAlert] = useState(null);
  const [alertHistory, setAlertHistory] = useState([]);
  const navigate = useNavigate();

  const triggerAlert = (alert) => {
    const newAlert = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      acknowledged: false,
      ...alert
    };
    setActiveAlert(newAlert);
    setAlertHistory(prev => [newAlert, ...prev]);
  };

  const acknowledgeAlert = (alertId) => {
    setAlertHistory(prev => 
      prev.map(alert => 
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    );
    if (activeAlert?.id === alertId) {
      setActiveAlert(null);
    }
  };

  const deleteAlert = (alertId) => {
    setAlertHistory(prev => prev.filter(alert => alert.id !== alertId));
    if (activeAlert?.id === alertId) {
      setActiveAlert(null);
    }
  };

  const goToMap = () => {
    navigate('/');
  };

  return (
    <AlertContext.Provider value={{
      activeAlert,
      alertHistory,
      triggerAlert,
      acknowledgeAlert,
      deleteAlert,
      goToMap
    }}>
      {children}
    </AlertContext.Provider>
  );
};