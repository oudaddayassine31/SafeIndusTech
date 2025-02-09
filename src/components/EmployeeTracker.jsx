// src/components/EmployeeTracker.jsx
import React, { useState, useEffect } from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { User } from 'lucide-react';

// Create custom icon for employee markers
const createEmployeeIcon = (name) => {
  const colors = {
    oudadda: '#2196F3',  // Blue
    slimani: '#4CAF50',  // Green
    bouhda: '#FF9800',   // Orange
    salah: '#9C27B0'     // Purple
  };

  return L.divIcon({
    className: 'employee-marker',
    html: `
      <div class="relative group">
        <div class="bg-white p-2 rounded-full shadow-lg border-2" style="border-color: ${colors[name] || '#2196F3'}">
          <div class="w-6 h-6 flex items-center justify-center" style="color: ${colors[name] || '#2196F3'}">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
        </div>
        <div class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-md 
                    text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
             style="color: ${colors[name] || '#2196F3'}">
          ${name.toUpperCase()}
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

// Function to interpolate position between two points
const interpolatePosition = (start, end, progress) => {
  return [
    start[1] + (end[1] - start[1]) * progress,
    start[0] + (end[0] - start[0]) * progress
  ];
};

export const EmployeeTracker = ({ route }) => {
  const [currentPosition, setCurrentPosition] = useState(0);
  const [interpolatedPosition, setInterpolatedPosition] = useState(null);
  const map = useMap();

  useEffect(() => {
    const coordinates = route.geometry.coordinates[0];
    const startPosition = [coordinates[0][1], coordinates[0][0]];
    setInterpolatedPosition(startPosition);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 0.1; // Update progress every 100ms
      
      if (progress >= 1) {
        progress = 0;
        setCurrentPosition(prev => (prev + 1) % (coordinates.length - 1));
      }

      const start = coordinates[currentPosition];
      const end = coordinates[(currentPosition + 1) % coordinates.length];
      const newPos = interpolatePosition(start, end, progress);
      setInterpolatedPosition(newPos);
    }, 100);

    return () => clearInterval(interval);
  }, [route, currentPosition]);

  if (!interpolatedPosition) return null;

  return (
    <Marker
      position={interpolatedPosition}
      icon={createEmployeeIcon(route.properties.employe)}
    >
      <Popup>
        <div className="text-center">
          <h3 className="font-bold text-lg">{route.properties.employe.toUpperCase()}</h3>
          <p className="text-sm text-gray-600">Employee ID: {route.properties.id}</p>
        </div>
      </Popup>
    </Marker>
  );
};