// src/components/layout/Sidebar.jsx
import React from 'react';
import { Map, Thermometer, Wind, Flame, Bell } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { 
      id: "map", 
      label: "Factory Map", 
      icon: Map, 
      path: "/",
      description: "Interactive facility layout and sensor locations"
    },
    { 
      id: "temperature", 
      label: "Temperature Monitoring", 
      icon: Thermometer, 
      path: "/temperature",
      description: "Temperature sensor readings by zone"
    },
    { 
      id: "smoke", 
      label: "Smoke Detection", 
      icon: Wind, 
      path: "/smoke",
      description: "Smoke sensor status and readings"
    },
    { 
      id: "fire", 
      label: "Fire Detection", 
      icon: Flame, 
      path: "/fire",
      description: "Fire detection system status"
    },
    { 
      id: "notifications", 
      label: "Notifications", 
      icon: Bell, 
      path: "/notifications",
      description: "System alerts and notifications"
    }
  ];

  return (
    <aside className="w-64 bg-white border-r">
      <nav className="p-4 space-y-1">
        {navigationItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={`
              w-full flex items-center px-3 py-2 rounded-lg transition-colors
              ${location.pathname === item.path 
                ? "bg-red-50 text-red-700" 
                : "text-gray-600 hover:bg-gray-50"
              }
            `}
          >
            <item.icon className={`h-5 w-5 mr-3 ${
              location.pathname === item.path ? "text-red-600" : "text-gray-400"
            }`} />
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          System Status
        </h2>
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-gray-600">All Sensors Active</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-gray-600">Network Connected</span>
          </div>
        </div>
      </div>
    </aside>
  );
};