// src/components/FactoryMap.jsx
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, ZoomControl, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// MovingEmployee Component
const MovingEmployee = ({ route, speed = 0.3 }) => {
  const [position, setPosition] = useState([0, 0]);
  const [routeIndex, setRouteIndex] = useState(0);
  const [segmentProgress, setSegmentProgress] = useState(0);
  const map = useMap();

  useEffect(() => {
    if (!route || !route.geometry || !route.geometry.coordinates[0]) return;
  
    const coordinates = route.geometry.coordinates[0];
    if (!coordinates[routeIndex + 1]) {
      setRouteIndex(0);
      setSegmentProgress(0);
      return;
    }
  
    const currentSegment = [coordinates[routeIndex], coordinates[routeIndex + 1]];
    const distance = map.distance(
      [currentSegment[0][1], currentSegment[0][0]],
      [currentSegment[1][1], currentSegment[1][0]]
    );
    const timeToComplete = (distance / speed) * 1000;
  
    let animationFrame;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / timeToComplete, 1);
      setSegmentProgress(progress);
  
      const lat = currentSegment[0][1] + (currentSegment[1][1] - currentSegment[0][1]) * progress;
      const lng = currentSegment[0][0] + (currentSegment[1][0] - currentSegment[0][0]) * progress;
      setPosition([lat, lng]);
  
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setRouteIndex(prev => prev + 1);
        setSegmentProgress(0);
      }
    };
  
    animationFrame = requestAnimationFrame(animate);
  
    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [routeIndex]);

// Update the employeeIcon in MovingEmployee component
const employeeIcon = L.divIcon({
  className: 'employee-marker',
  html: `
    <div class="relative group">
      <!-- Main pulse animation -->
      <div class="absolute -top-1.5 -left-1.5 w-9 h-9 rounded-full bg-blue-500/20 
                  animate-ping"></div>
      <!-- Secondary glow -->
      <div class="absolute -top-1 -left-1 w-8 h-8 rounded-full bg-blue-400/30"></div>
      <!-- Main icon container -->
      <div class="relative w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 
                  rounded-full border-2 border-white shadow-lg flex items-center 
                  justify-center transform hover:scale-110 transition-all duration-200">
        <!-- Person icon -->
        <svg class="w-4 h-4 text-white drop-shadow-md" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2a7.2 7.2 0 01-6-3.22c.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08a7.2 7.2 0 01-6 3.22z"/>
        </svg>
      </div>
      <!-- Enhanced tooltip -->
      <div class="absolute -top-12 left-1/2 transform -translate-x-1/2 
                  bg-gradient-to-r from-blue-700 to-blue-600 text-white 
                  px-3 py-1.5 rounded-full text-sm font-medium shadow-lg
                  opacity-0 group-hover:opacity-100 transition-all duration-300
                  whitespace-nowrap backdrop-blur-sm">
        <div class="flex items-center gap-2">
          <span>${route.properties.employee}</span>
          <div class="w-1.5 h-1.5 rounded-full bg-blue-300 animate-pulse"></div>
        </div>
        <!-- Tooltip arrow -->
        <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 
                    w-2 h-2 bg-blue-600 rotate-45"></div>
      </div>
    </div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12]
});

  return position[0] !== 0 ? (
    <Marker position={position} icon={employeeIcon}>
      <Popup>
        <div className="p-2">
          <h3 className="font-bold">{route.properties.employee}</h3>
          <p className="text-sm text-gray-600">On patrol</p>
        </div>
      </Popup>
    </Marker>
  ) : null;
};

// ZoneLabel component to handle zone labels properly
const ZoneLabel = ({ position, name }) => {
  const map = useMap();

  useEffect(() => {
    const label = L.marker(position, {
      icon: L.divIcon({
        className: 'zone-label',
        html: `<div class="px-2 py-1 bg-white/80 backdrop-blur-sm rounded shadow-sm 
                text-sm font-medium text-gray-800 whitespace-nowrap">
                ${name}
              </div>`
      })
    });

    label.addTo(map);
    return () => {
      map.removeLayer(label);
    };
  }, [map, position, name]);

  return null;
};

export const FactoryMap = () => {
  const [mapData, setMapData] = useState({
    usine: null,
    zones: null,
    sensors: null,
    equipement: null,
    doors: null,
    wall: null
  });
  const [employeeRoutes, setEmployeeRoutes] = useState(null);
  useEffect(() => {
    const loadData = async () => {
      try {
        const files = {
          usine: 'usine.geojson',
          zones: 'zones.geojson',
          sensors: 'sensors.geojson',
          equipement: 'equipement.geojson',
          doors: 'doors.geojson',
          wall: 'wall.geojson',
          routes: 'routes.geojson'
        };

        const loadedData = {};
        for (const [key, filename] of Object.entries(files)) {
          try {
            const response = await fetch(`/safeindustech/${filename}`);
            if (!response.ok) throw new Error(`Failed to load ${filename}`);
            const data = await response.json();
            if (key === 'routes') {
              setEmployeeRoutes(data);
            } else {
              loadedData[key] = data;
            }
          } catch (error) {
            console.error(`Error loading ${filename}:`, error);
          }
        }
        setMapData(loadedData);
      } catch (error) {
        console.error('Error loading map data:', error);
      }
    };

    loadData();
  }, []);

  // Create sensor icons with different colors and symbols
  const createSensorIcon = (type) => {
    const sensorStyles = {
      'Heat': {
        color: '#ef4444',
        icon: '🌡️',
        pulseColor: '#fecaca'
      },
      'Pressure': {
        color: '#3b82f6',
        icon: '⭕',
        pulseColor: '#bfdbfe'
      },
      'Smoke': {
        color: '#6b7280',
        icon: '💨',
        pulseColor: '#e5e7eb'
      },
      'Spark': {
        color: '#f59e0b',
        icon: '⚡',
        pulseColor: '#fde68a'
      }
    };
  
    const style = sensorStyles[type] || sensorStyles['Heat'];
  
    return L.divIcon({
      className: 'custom-sensor-icon',
      html: `
        <div class="relative group">
          <div class="absolute -top-1 -left-1 w-6 h-6 rounded-full animate-ping opacity-75"
               style="background-color: ${style.pulseColor}">
          </div>
          <div class="relative w-4 h-4 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-xs font-bold"
               style="background-color: ${style.color}">
            <span class="text-white">${style.icon}</span>
          </div>
          <div class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm px-2 py-1 
                      rounded shadow-md text-xs font-medium opacity-0 group-hover:opacity-100 
                      transition-opacity duration-200 whitespace-nowrap z-50">
            ${type} Sensor
          </div>
        </div>
      `,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
      popupAnchor: [0, -8]
    });
  };

  // Equipment icons
  const createEquipmentIcon = (type) => {
    let iconUrl;
    switch (type.toLowerCase()) {
      case 'production':
        iconUrl = '/safeindustech/svg/Machine-1.svg';
        break;
      case 'stock':
        iconUrl = '/safeindustech/svg/Machine-2.svg';
        break;
      case 'reception':
        iconUrl = '/safeindustech/svg/Machine-3.svg';
        break;
      case 'mask':
        iconUrl = '/safeindustech/svg/gas-mask.svg';
        break;
      case 'alarme':
        iconUrl = '/safeindustech/svg/fire-alarm.svg';
        break;
      case 'extincteur':
        iconUrl = '/safeindustech/svg/fire-extinguisher.svg';
        break;
      default:
        iconUrl = '/safeindustech/svg/Machine-4.svg';
    }
    return L.icon({
      iconUrl,
      iconSize: [22, 22],
      iconAnchor: [11, 11],
      popupAnchor: [0, -10],
      className: 'equipment-icon transition-transform hover:scale-110 duration-200'
    });
  };

  const getZoneStyle = (feature) => {
    // Get the zone data from API response that matches this feature
    const zoneData = Object.values(mapData.sensors?.features || []).filter(
      sensor => sensor.properties.name === feature.properties.name
    );
  
    // Check for threshold violations
    const hasTemperatureAlert = zoneData.some(sensor => 
      sensor.properties.Descrip === 'Heat' && sensor.properties.current_temp > 70
    );
    const hasSmokeAlert = zoneData.some(sensor => 
      sensor.properties.Descrip === 'Smoke' && sensor.properties.current_smoke > 0.3
    );
    const hasSparkAlert = zoneData.some(sensor => 
      sensor.properties.Descrip === 'Spark' && sensor.properties.spark_detected
    );
    const hasPressureAlert = zoneData.some(sensor => 
      sensor.properties.Descrip === 'Pressure' && sensor.properties.current_pressure > 2.0
    );
  
    // If any threshold is exceeded, show danger style
    if (hasTemperatureAlert || hasSmokeAlert || hasSparkAlert || hasPressureAlert) {
      return {
        fillColor: '#ef4444',
        fillOpacity: 0.6,
        weight: 2,
        color: '#dc2626',
        className: 'danger-zone'
      };
    }
  
    // Default zone styling based on risk level
    const riskColors = {
      'HIGH': '#ef4444',
      'MEDIUM': '#f97316',
      'LOW': '#22c55e'
    };
  
    return {
      fillColor: riskColors[feature.properties.risk_level] || '#64748b',
      weight: 0,
      fillOpacity: 0.25
    };
  };

  // Wall styling
  const getWallStyle = (feature) => {
    const wallStyles = {
      'N': {
        color: '#334155',
        weight: 2.5,
        opacity: 0.8,
        dashArray: '4',
        lineCap: 'round',
        lineJoin: 'round',
        className: 'wall-shadow'
      },
      'Cadre': {
        color: '#475569',
        weight: 4,
        opacity: 0.9,
        dashArray: null,
        lineCap: 'round',
        lineJoin: 'round',
        className: 'wall-border'
      }
    };
    
    return wallStyles[feature.properties.Type] || wallStyles['N'];
  };

  // Factory style
  const getFactoryStyle = () => ({
    fillColor: '#f8fafc',
    weight: 0,
    fillOpacity: 0.05
  });

  // Load GeoJSON data
  useEffect(() => {
    const loadGeoData = async () => {
      try {
        const files = {
          usine: 'usine.geojson',
          zones: 'zones.geojson',
          sensors: 'sensors.geojson',
          equipement: 'equipement.geojson',
          doors: 'doors.geojson',
          wall: 'wall.geojson'
        };

        const loadedData = {};
        
        for (const [key, filename] of Object.entries(files)) {
          const response = await fetch(`/safeindustech/${filename}`);
          if (!response.ok) {
            console.error(`Failed to load ${filename}`);
            continue;
          }
          loadedData[key] = await response.json();
        }

        setMapData(loadedData);
      } catch (error) {
        console.error('Error loading map data:', error);
      }
    };

    loadGeoData();
  }, []);

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={[30.994, -4.995]}
        zoom={17}
        className="h-full w-full"
        zoomControl={false}
        minZoom={16}
        maxZoom={19}
      >
        <ZoomControl position="bottomright" />
        
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; OpenStreetMap contributors'
          opacity={0.3}
        />
  
        {mapData.usine && (
          <GeoJSON
            data={mapData.usine}
            style={getFactoryStyle}
          />
        )}
  
        {mapData.zones && (
          <>
            <GeoJSON
              data={mapData.zones}
              style={getZoneStyle}
              onEachFeature={(feature, layer) => {
                layer.bindPopup(`
                  <div class="p-3">
                    <h3 class="font-bold text-lg">${feature.properties.name}</h3>
                    <p class="text-sm text-gray-600 mt-1">Risk Level: ${feature.properties.risk_lvl}</p>
                  </div>
                `);
              }}
            />
            {mapData.zones.features.map((zone, index) => {
              const bounds = L.geoJSON(zone).getBounds();
              return (
                <ZoneLabel
                  key={`zone-label-${index}`}
                  position={bounds.getCenter()}
                  name={zone.properties.name}
                />
              );
            })}
          </>
        )}
  
        {mapData.wall && (
          <GeoJSON
            data={mapData.wall}
            style={getWallStyle}
          />
        )}

  
        {mapData.sensors?.features?.map((sensor) => {
        const uniqueKey = `sensor-${sensor.properties.id}-${sensor.properties.name}-${sensor.properties.Descrip}`;
        return (
          <Marker
            key={uniqueKey}
            position={[
              sensor.geometry.coordinates[1],
              sensor.geometry.coordinates[0]
            ]}
            icon={createSensorIcon(sensor.properties.Descrip)}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-gray-800">{sensor.properties.Descrip} Sensor</h3>
                <p className="text-sm text-gray-600">Zone: {sensor.properties.name}</p>
              </div>
            </Popup>
          </Marker>
        );
      })}
  
        {mapData.equipement?.features?.map((equip) => (
          <Marker
            key={`equip-${equip.properties.id}`}
            position={[
              equip.geometry.coordinates[1],
              equip.geometry.coordinates[0]
            ]}
            icon={createEquipmentIcon(equip.properties.type)}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-gray-800">{equip.properties.type}</h3>
                <p className="text-sm text-gray-600">Zone ID: {equip.properties.zone_id}</p>
              </div>
            </Popup>
          </Marker>
        ))}
  
        {mapData.doors?.features?.map((door) => (
          <Marker
            key={`door-${door.properties.id}`}
            position={[
              door.geometry.coordinates[1],
              door.geometry.coordinates[0]
            ]}
            icon={L.divIcon({
              className: 'custom-exit-icon',
              html: `
                <div class="relative group">
                  <div class="w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center border-2 border-white 
                            shadow-md transform hover:scale-110 transition-all duration-200">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                      <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5a2 2 0 00-2 2v4h2V5h14v14H5v-4H3v4a2 2 0 002 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
                    </svg>
                  </div>
                  <div class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm px-2 py-1 
                            rounded shadow-md text-xs font-medium opacity-0 group-hover:opacity-100 
                            transition-opacity duration-200 whitespace-nowrap z-50">
                    Sortie de Secours
                  </div>
                </div>
              `,
              iconSize: [24, 24],
              iconAnchor: [12, 12],
            })}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-gray-800">Emergency Exit</h3>
                <p className="text-sm text-gray-600">Door ID: {door.properties.id}</p>
              </div>
            </Popup>
          </Marker>
        ))}
  
        {employeeRoutes?.features.map((route, index) => (
          <MovingEmployee 
            key={`employee-${index}`} 
            route={route}
            speed={5}
          />
        ))}
      </MapContainer>
  
      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg z-[1000]">
        <h3 className="font-bold mb-3 text-gray-800">Map Legend</h3>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2 text-gray-700">Risk Levels</h4>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-red-500 opacity-50"></div>
                <span className="text-sm text-gray-600">High Risk</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-orange-500 opacity-50"></div>
                <span className="text-sm text-gray-600">Medium Risk</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-500 opacity-50"></div>
                <span className="text-sm text-gray-600">Low Risk</span>
              </div>
            </div>
          </div>
  
          <div>
            <h4 className="text-sm font-medium mb-2 text-gray-700">Sensors</h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-500 border border-white flex items-center justify-center">
                  <span className="text-[10px] text-white">🌡️</span>
                </div>
                <span className="text-sm text-gray-600">Heat</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-500 border border-white flex items-center justify-center">
                  <span className="text-[10px] text-white">⭕</span>
                </div>
                <span className="text-sm text-gray-600">Pressure</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-gray-500 border border-white flex items-center justify-center">
                  <span className="text-[10px] text-white">💨</span>
                </div>
                <span className="text-sm text-gray-600">Smoke</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-amber-500 border border-white flex items-center justify-center">
                  <span className="text-[10px] text-white">⚡</span>
                </div>
                <span className="text-sm text-gray-600">Spark</span>
              </div>
            </div>
          </div>
  
          <div>
            <h4 className="text-sm font-medium mb-2 text-gray-700">Equipment</h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <div className="flex items-center gap-2">
                <img src="/safeindustech/svg/fire-extinguisher.svg" className="w-4 h-4" alt="Extinguisher" />
                <span className="text-sm text-gray-600">Extinguisher</span>
              </div>
              <div className="flex items-center gap-2">
                <img src="/safeindustech/svg/fire-alarm.svg" className="w-4 h-4" alt="Alarm" />
                <span className="text-sm text-gray-600">Alarm</span>
              </div>
              <div className="flex items-center gap-2">
                <img src="/safeindustech/svg/gas-mask.svg" className="w-4 h-4" alt="Safety Gear" />
                <span className="text-sm text-gray-600">Safety Gear</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded-lg flex items-center justify-center">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                    <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59z"/>
                  </svg>
                </div>
                <span className="text-sm text-gray-600">Exit</span>
              </div>
            </div>
          </div>
  
          <div>
            <h4 className="text-sm font-medium mb-2 text-gray-700">Personnel</h4>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
              <span className="text-sm text-gray-600">Employee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
  