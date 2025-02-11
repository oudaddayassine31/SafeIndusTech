// src/components/layout/Sidebar.jsx
import React from 'react';
import { MapPin, Thermometer, Wind, Gauge, Zap, Bell } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { 
      id: "map", 
      label: "Factory Map", 
      icon: MapPin, 
      path: "/",
      description: "Interactive facility layout and alerts"
    },
    { 
      id: "temperature", 
      label: "Temperature", 
      icon: Thermometer, 
      path: "/temperature",
      description: "Temperature monitoring",
      threshold: "70°C"
    },
    { 
      id: "pressure", 
      label: "Pressure", 
      icon: Gauge, 
      path: "/pressure",
      description: "Pressure monitoring",
      threshold: "2.0 bar"
    },
    { 
      id: "smoke", 
      label: "Smoke", 
      icon: Wind, 
      path: "/smoke",
      description: "Smoke detection",
      threshold: "0.3 ppm"
    },
    { 
      id: "spark", 
      label: "Spark", 
      icon: Zap, 
      path: "/spark",
      description: "Spark detection",
      threshold: "Any detection"
    },
    { 
      id: "notifications", 
      label: "Alerts History", 
      icon: Bell, 
      path: "/notifications",
      description: "Alert history and acknowledgments"
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
              w-full flex items-center px-3 py-2 rounded-lg transition-colors relative group
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
            
            {/* Info tooltip */}
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded 
                          opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
              {item.description}
              {item.threshold && (
                <div className="mt-1 text-gray-300">
                  Threshold: {item.threshold}
                </div>
              )}
            </div>
          </button>
        ))}
      </nav>
    </aside>
  );
};