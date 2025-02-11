// src/App.jsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { AlertOverlay } from './components/AlertOverlay';

// src/App.jsx
import { AlertProvider, useAlert } from './contexts/AlertContext';
// Import layout components
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';

// Import pages
import { MapView } from './pages/MapView';
import { TemperatureMonitoring } from './pages/TemperatureMonitoring';
import { SmokeDetection } from './pages/SmokeDetection';
import { SparkDetection } from './pages/SparkDetection';
import { PressureMonitoring } from './pages/PressureMonitoring';
import { Notifications } from './pages/Notifications';

// Alert Sound component
const AlertSound = () => {
  const { activeAlert } = useAlert();
  const [audio] = React.useState(new Audio('/alert-sound.mp3')); // Add an alert sound file

  useEffect(() => {
    if (activeAlert) {
      audio.play().catch(err => console.log('Audio play failed:', err));
    }
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [activeAlert, audio]);

  return null;
};

// Main App Component
const AppContent = () => {
  const { activeAlert } = useAlert();

  return (
    <div className={`flex flex-col min-h-screen bg-gray-50 ${
      activeAlert ? 'alert-active' : ''
    }`}>
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<MapView />} />
            <Route path="/temperature" element={<TemperatureMonitoring />} />
            <Route path="/smoke" element={<SmokeDetection />} />
            <Route path="/pressure" element={<PressureMonitoring />} />
            <Route path="/spark" element={<SparkDetection />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
      <AlertOverlay />
      <AlertSound />
    </div>
  );
};

export default function App() {
  return (
    <Router basename="/safeindustech">
      <AlertProvider>
        <AppContent />
      </AlertProvider>
    </Router>
  );
}