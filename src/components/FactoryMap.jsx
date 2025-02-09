// src/components/FactoryMap.jsx
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { EmployeeTracker } from './EmployeeTracker';
import 'leaflet/dist/leaflet.css';

export const FactoryMap = () => {
  const [zonesData, setZonesData] = useState(null);
  const [routesData, setRoutesData] = useState(null);
  const [factoryData, setFactoryData] = useState(null);

  useEffect(() => {
    const loadGeoData = async () => {
      try {
        const zonesResponse = await fetch('/safeindustech/zones.geojson');
        const zonesJson = await zonesResponse.json();
        setZonesData(zonesJson);

        const routesResponse = await fetch('/safeindustech/routes.geojson');
        const routesJson = await routesResponse.json();
        setRoutesData(routesJson);

        const factoryResponse = await fetch('/safeindustech/usine.geojson');
        const factoryJson = await factoryResponse.json();
        setFactoryData(factoryJson);
      } catch (error) {
        console.error('Error loading GeoJSON:', error);
      }
    };

    loadGeoData();
  }, []);

  const zoneStyle = (feature) => {
    // Mock sensor data - replace with real data
    const sensorData = {
      1: { temp: 25, smoke: false },
      2: { temp: 45, smoke: true },
      3: { temp: 30, smoke: false },
      4: { temp: 35, smoke: false }
    };

    const data = sensorData[feature.properties.zone];
    let color = '#4CAF50'; // Default green

    if (data) {
      if (data.smoke) {
        color = '#F44336'; // Red for smoke
      } else if (data.temp > 40) {
        color = '#FF9800'; // Orange for high temperature
      } else if (data.temp > 30) {
        color = '#FFC107'; // Yellow for elevated temperature
      }
    }

    return {
      fillColor: color,
      weight: 2,
      opacity: 1,
      color: '#333',
      fillOpacity: 0.5
    };
  };

  const routeStyle = {
    color: '#2196F3',
    weight: 2,
    opacity: 0.3,
    dashArray: '5, 5'
  };

  const factoryStyle = {
    fillColor: '#gray',
    weight: 1,
    opacity: 1,
    color: '#000',
    fillOpacity: 0.2
  };

  return (
    <div className="h-screen w-full relative">
      <MapContainer
        center={[30.97, -9.76]}
        zoom={15}
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        
        {factoryData && (
          <GeoJSON 
            data={factoryData}
            style={factoryStyle}
          />
        )}

        {zonesData && (
          <GeoJSON 
            data={zonesData}
            style={zoneStyle}
            onEachFeature={(feature, layer) => {
              layer.bindPopup(`Zone ${feature.properties.zone}`);
            }}
          />
        )}

        {routesData && (
          <>
            <GeoJSON 
              data={routesData}
              style={routeStyle}
            />
            {routesData.features.map(route => (
              <EmployeeTracker 
                key={route.properties.id} 
                route={route}
              />
            ))}
          </>
        )}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white p-4 rounded shadow-lg z-[1000]">
        <h3 className="font-bold mb-2">Zone Status</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-500 opacity-50"></div>
            <span>Normal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-yellow-500 opacity-50"></div>
            <span>Elevated Temperature</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-orange-500 opacity-50"></div>
            <span>High Temperature</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-500 opacity-50"></div>
            <span>Smoke Detected</span>
          </div>
        </div>
      </div>
    </div>
  );
};