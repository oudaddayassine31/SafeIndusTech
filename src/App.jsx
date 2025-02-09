// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import layout components
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';

// Import pages
import { MapView } from './pages/MapView';
import { TemperatureMonitoring } from './pages/TemperatureMonitoring';
import { SmokeDetection } from './pages/SmokeDetection';
import { FireDetection } from './pages/FireDetection';
import { Notifications } from './pages/Notifications';

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<MapView />} />
              <Route path="/temperature" element={<TemperatureMonitoring />} />
              <Route path="/smoke" element={<SmokeDetection />} />
              <Route path="/fire" element={<FireDetection />} />
              <Route path="/notifications" element={<Notifications />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}