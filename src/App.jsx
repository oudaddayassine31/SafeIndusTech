// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AlertProvider } from './contexts/AlertContext';
import { AlertOverlay } from './components/AlertOverlay';

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

export default function App() {
  return (
    <Router basename="/safeindustech">
      <AlertProvider>
        <div className="flex flex-col min-h-screen bg-gray-50">
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
          {/* Global alert overlay */}
          <AlertOverlay />
        </div>
      </AlertProvider>
    </Router>
  );
}