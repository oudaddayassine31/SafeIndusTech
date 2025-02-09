import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { 
  Home, 
  Thermometer, 
  Radio, 
  AlertTriangle,
  Settings as SettingsIcon,
  Factory,
  Users,
  Map,
  Wind
} from 'lucide-react';

// Import pages
import Dashboard from './pages/Dashboard';
import SensorMonitoring from './pages/SensorMonitoring';
import FireSystems from './pages/FireSystems';
import EvacuationPlan from './pages/EvacuationPlan';
import Alerts from './pages/Alerts';
import MapPage from './pages/MapPage';
import SmokeExtraction from './pages/SmokeExtraction';
import SettingsPage from './pages/SettingsPage';


export default function App() {
  const [activePage, setActivePage] = useState("dashboard");

  const navigationItems = [
    { id: "dashboard", label: "Tableau de Bord", icon: Home, path: "/" },
    { id: "monitoring", label: "Surveillance Capteurs", icon: Thermometer, path: "/sensors" },
    { id: "fire-systems", label: "Systèmes Anti-incendie", icon: Radio, path: "/fire-systems" },
    { id: "evacuation", label: "Plan d'Évacuation", icon: Users, path: "/evacuation" },
    { id: "alerts", label: "Alertes & Incidents", icon: AlertTriangle, path: "/alerts" },
    { id: "map", label: "Plan d'Installation", icon: Map, path: "/map" },
    { id: "smoke-extract", label: "Extraction Fumée", icon: Wind, path: "/smoke" },
    { id: "settings", label: "Paramètres", icon: SettingsIcon, path: "/settings" }
  ];

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white border-b z-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="h-20 flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-red-600 p-2 rounded-lg">
                  <Factory className="h-8 w-8 text-white" />
                </div>
                <div className="ml-3">
                  <h1 className="text-2xl font-bold text-red-600">SafeIndusTech</h1>
                  <p className="text-sm text-gray-500">
                    Système de Gestion de la Sécurité Incendie Industrielle
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                  Système Actif
                </div>
                <a href="/documentation" 
                   className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                  <span className="font-medium">Documentation</span>
                </a>
              </div>
            </div>
          </div>
        </header>

        <div className="flex flex-1 relative">
          {/* Sidebar */}
          <aside className="w-72 bg-white border-r shadow-sm z-40">
            <div className="p-6 flex-1">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                Navigation
              </h2>
              <nav className="space-y-2">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActivePage(item.id)}
                    className={`
                      w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200
                      ${activePage === item.id 
                        ? "bg-red-50 text-red-700 font-medium shadow-sm" 
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }
                    `}
                  >
                    <item.icon className={`h-5 w-5 mr-3 ${
                      activePage === item.id ? "text-red-600" : "text-gray-400"
                    }`} />
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* System Status */}
            <div className="p-6 border-t">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                État des Systèmes
              </h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-green-50">
                  <div className="flex-shrink-0">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-green-700">Capteurs Actifs</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-green-50">
                  <div className="flex-shrink-0">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-green-700">Systèmes Anti-incendie</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-green-50">
                  <div className="flex-shrink-0">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-green-700">Réseau Wi-Fi</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 relative overflow-y-auto">
          <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/sensors" element={<SensorMonitoring />} />
              <Route path="/fire-systems" element={<FireSystems />} />
              <Route path="/evacuation" element={<EvacuationPlan />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/smoke" element={<SmokeExtraction />} />
              <Route path="/settings" element={<SettingsPage />} />
          </Routes>
          </main>
        </div>

        {/* Footer */}
        <footer className="bg-white border-t py-6 z-40">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex flex-col items-center gap-4">
              <p className="text-gray-500 text-sm font-medium">
                SafeIndusTech - Système de Surveillance de Sécurité Incendie © 2024
              </p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}