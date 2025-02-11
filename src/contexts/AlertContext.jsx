// src/contexts/AlertContext.jsx
import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);
  const [activeAlert, setActiveAlert] = useState(null);
  const navigate = useNavigate();

  const addAlert = (alert) => {
    const newAlert = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...alert
    };
    setAlerts(prev => [newAlert, ...prev]);
    setActiveAlert(newAlert);
  };

  const closeAlert = () => {
    setActiveAlert(null);
  };

  const viewMap = () => {
    navigate('/');
    closeAlert();
  };

  return (
    <AlertContext.Provider value={{ alerts, addAlert, activeAlert, closeAlert, viewMap }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlerts = () => useContext(AlertContext);