// src/components/EmployeeTracker.jsx
import React, { useState, useEffect } from 'react';
import { Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';

const createEmployeeIcon = (name, opacity = 1) => {
  const colors = {
    oudadda: '#2196F3',  // Blue
    slimani: '#4CAF50',  // Green
    bouhda: '#FF9800',   // Orange
    salah: '#9C27B0'     // Purple
  };

  return L.divIcon({
    className: 'employee-marker',
    html: `
      <div class="relative group" style="opacity: ${opacity}">
        <div class="bg-white p-2 rounded-full shadow-lg border-2" 
             style="border-color: ${colors[name] || '#2196F3'}">
          <div class="w-6 h-6 flex items-center justify-center" 
               style="color: ${colors[name] || '#2196F3'}">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
        </div>
        <div class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 
                    rounded shadow-md text-sm font-medium opacity-0 group-hover:opacity-100 
                    transition-opacity whitespace-nowrap z-50"
             style="color: ${colors[name] || '#2196F3'}">
          ${name.toUpperCase()}
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

export const EmployeeTracker = ({ 
  route, 
  showTrail = true, 
  opacity = 1,
  speed = 1,
  isPlaying = true
}) => {
  const [currentPosition, setCurrentPosition] = useState(0);
  const [previousPositions, setPreviousPositions] = useState([]);
  const [trailLength, setTrailLength] = useState(10); // Number of positions to show in trail

  useEffect(() => {
    if (!isPlaying) return;

    const coordinates = route.geometry.coordinates[0];
    const interval = setInterval(() => {
      setCurrentPosition(prev => {
        const newPos = (prev + 1) % coordinates.length;
        
        // Update trail
        if (showTrail) {
          setPreviousPositions(prevTrail => {
            const newTrail = [...prevTrail, coordinates[prev]];
            return newTrail.slice(-trailLength);
          });
        }
        
        return newPos;
      });
    }, 5000 / speed); // Adjust speed based on multiplier

    return () => clearInterval(interval);
  }, [route, showTrail, trailLength, speed, isPlaying]);

  const coordinates = route.geometry.coordinates[0];
  const currentCoord = coordinates[currentPosition];

  // Trail style based on employee
  const getTrailStyle = () => {
    const colors = {
      oudadda: '#2196F3',
      slimani: '#4CAF50',
      bouhda: '#FF9800',
      salah: '#9C27B0'
    };

    return {
      color: colors[route.properties.employe] || '#2196F3',
      weight: 2,
      opacity: opacity * 0.5,
      dashArray: '5, 5'
    };
  };

  return (
    <>
      {showTrail && previousPositions.length > 1 && (
        <Polyline
          positions={previousPositions.map(pos => [pos[1], pos[0]])}
          pathOptions={getTrailStyle()}
        />
      )}

      <Marker
        position={[currentCoord[1], currentCoord[0]]}
        icon={createEmployeeIcon(route.properties.employe, opacity)}
      >
        <Popup>
          <div className="p-2">
            <h3 className="font-bold text-lg">{route.properties.employe.toUpperCase()}</h3>
            <p className="text-sm text-gray-600">Employee ID: {route.properties.id}</p>
            <div className="mt-2 text-sm">
              <p>Status: {isPlaying ? 'Moving' : 'Paused'}</p>
              <p>Speed: {speed}x</p>
            </div>
          </div>
        </Popup>
      </Marker>
    </>
  );
};