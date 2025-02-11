// src/components/FactoryMap.jsx
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export const FactoryMap = () => {
  const [mapData, setMapData] = useState({
    usine: null,
    zones: null,
    sensors: null,
    equipement: null,
    doors: null,
    wall: null
  });

  // Create SVG icons for different sensor types
  const createSensorIcon = (type) => {
    const iconUrl = `/safeindustech/svg/${type}-Detection.svg`;
    return L.icon({
      iconUrl,
      iconSize: [12, 12],
      iconAnchor: [10, 10],
      popupAnchor: [0, -12],
      className: 'sensor-icon'
    });
  };

  // Create equipment icons
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
      iconSize: [18, 18],
      iconAnchor: [14, 14],
      popupAnchor: [0, -12],
      className: 'equipment-icon'
    });
  };

  // Zone styling based on risk level
  const getZoneStyle = (feature) => {
    const riskColors = {
      'High': '#ef444480',
      'Medium': '#f9731680',
      'Low': '#22c55e80'
    };

    return {
      fillColor: riskColors[feature.properties.risk_lvl] || '#64748b',
      weight: 0, // No border
      fillOpacity: 0.5
    };
  };

  // Wall styling based on type
  const getWallStyle = (feature) => {
    const wallStyles = {
      'N': {
        color: '#334155',
        weight: 3,
        opacity: 1,
        dashArray: '4'
      },
      'Cadre': {
        color: '#475569',
        weight: 5,
        opacity: 1,
        dashArray: null
      }
    };
    
    return wallStyles[feature.properties.Type] || wallStyles['N'];
  };

  // Factory outline styling
  const getFactoryStyle = () => ({
    fillColor: '#f8fafc',
    weight: 0, // No border
    fillOpacity: 0.1
  });

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
        console.log('Loaded map data:', loadedData);
      } catch (error) {
        console.error('Error loading map data:', error);
      }
    };

    loadGeoData();
  }, []);
    // Create unique keys for markers
  const createUniqueKey = (prefix, properties) => {
      return `${prefix}-${properties.id}-${properties.name || ''}-${Date.now()}`;
    };

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={[30.994, -4.995]}
        zoom={16}
        className="h-full w-full"
        zoomControl={false}
      >
        <ZoomControl position="bottomright" />
        
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />

        {mapData.usine && (
          <GeoJSON
            data={mapData.usine}
            style={getFactoryStyle}
          />
        )}

        {mapData.zones && (
          <GeoJSON
            data={mapData.zones}
            style={getZoneStyle}
            onEachFeature={(feature, layer) => {
              layer.bindPopup(`
                <div class="p-2">
                  <h3 class="font-bold">${feature.properties.name}</h3>
                  <p>Risk Level: ${feature.properties.risk_lvl}</p>
                </div>
              `);
            }}
          />
        )}

        {mapData.wall && (
          <GeoJSON
            data={mapData.wall}
            style={getWallStyle}
          />
        )}

        {mapData.sensors?.features?.map((sensor) => (
          <Marker
            key={`sensor-${sensor.properties.id}`}
            position={[
              sensor.geometry.coordinates[1],
              sensor.geometry.coordinates[0]
            ]}
            icon={createSensorIcon(sensor.properties.Descrip)}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold">Sensor: {sensor.properties.Descrip}</h3>
                <p>Zone: {sensor.properties.name}</p>
              </div>
            </Popup>
          </Marker>
        ))}

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
                <h3 className="font-bold">{equip.properties.type}</h3>
                <p>Zone ID: {equip.properties.zone_id}</p>
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
                    <div class="w-8 h-8 bg-green-500 rounded flex items-center justify-center border-2 border-white">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                        <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5a2 2 0 00-2 2v4h2V5h14v14H5v-4H3v4a2 2 0 002 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
                      </svg>
                    </div>
                    <div class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 
                                rounded shadow-md text-xs font-medium opacity-0 group-hover:opacity-100 
                                transition-opacity whitespace-nowrap z-50">
                      Sortie de Secours
                    </div>
                  </div>
                `,
                iconSize: [16, 16],
                iconAnchor: [12, 12],
              })}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold">Emergency Exit</h3>
                <p>Door ID: {door.properties.id}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white p-4 rounded shadow-lg z-[1000]">
        <h3 className="font-bold mb-2">Legend</h3>
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium mb-1">Risk Levels</h4>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-red-500 opacity-50"></div>
                <span className="text-sm">High</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-orange-500 opacity-50"></div>
                <span className="text-sm">Medium</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-500 opacity-50"></div>
                <span className="text-sm">Low</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-1">Sensors</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <img src="/safeindustech/svg/Heat-Detection.svg" className="w-4 h-4" alt="Temperature" />
                <span className="text-sm">Heat</span>
              </div>
              <div className="flex items-center gap-2">
                <img src="/safeindustech/svg/Pression-Detection.svg" className="w-4 h-4" alt="Pressure" />
                <span className="text-sm">Pressure</span>
              </div>
              <div className="flex items-center gap-2">
                <img src="/safeindustech/svg/Smoke-Detection.svg" className="w-4 h-4" alt="Smoke" />
                <span className="text-sm">Smoke</span>
              </div>
              <div className="flex items-center gap-2">
                <img src="/safeindustech/svg/Spark-Detection.svg" className="w-4 h-4" alt="Spark" />
                <span className="text-sm">Spark</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-1">Equipment</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <img src="/safeindustech/svg/fire-extinguisher.svg" className="w-4 h-4" alt="Extinguisher" />
                <span className="text-sm">Extinguisher</span>
              </div>
              <div className="flex items-center gap-2">
                <img src="/safeindustech/svg/fire-alarm.svg" className="w-4 h-4" alt="Alarm" />
                <span className="text-sm">Alarm</span>
              </div>
              <div className="flex items-center gap-2">
                <img src="/safeindustech/svg/gas-mask.svg" className="w-4 h-4" alt="Safety Gear" />
                <span className="text-sm">Safety Gear</span>
              </div>
              <div className="relative group flex items-center gap-2">
                <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center border-2 border-white">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5a2 2 0 00-2 2v4h2V5h14v14H5v-4H3v4a2 2 0 002 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
                  </svg>
                </div>
                <span className="text-sm">Exit</span>
                {/* Tooltip */}
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 
                            rounded shadow-md text-xs font-medium opacity-0 group-hover:opacity-100 
                            transition-opacity whitespace-nowrap z-50">
                  Sortie de Secours
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};