// src/components/FactoryMap.jsx
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, ZoomControl } from 'react-leaflet';
import { createSensorIcon, createExtinguisherIcon, createExitIcon } from './icons/FactoryIcons';
import 'leaflet/dist/leaflet.css';

export const FactoryMap = () => {
 const [factoryData, setFactoryData] = useState(null);
 const [zonesData, setZonesData] = useState(null);
 const [sensorsData, setSensorsData] = useState(null);
 const [extinguishersData, setExtinguishersData] = useState(null);
 const [exitsData, setExitsData] = useState(null);

// Fix the useEffect:
useEffect(() => {
  const loadGeoData = async () => {
    try {
      const responses = await Promise.all([
        fetch('./public/manufactory.geojson'),
        fetch('./public/zones.geojson'),
        fetch('./public/sensors.geojson'),
        fetch('./public/extincteur.geojson'),
        fetch('./public/exit.geojson')
      ]);
      
      const [factory, zones, sensors, extinguishers, exits] = await Promise.all(
        responses.map(r => r.json())
      );

      setFactoryData(factory);
      setZonesData(zones);
      setSensorsData(sensors);
      setExtinguishersData(extinguishers);
      setExitsData(exits);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  loadGeoData();
}, []);

 const getZoneStyle = (feature) => {
   const riskColors = {
     'high': '#ef4444',
     'medium': '#f97316',
     'low': '#22c55e'
   };

   return {
     fillColor: riskColors[feature.properties.risk] || '#64748b',
     weight: 2,
     opacity: 1,
     color: '#1f2937',
     fillOpacity: 1
   };
 };

 const renderZonePopup = (feature) => {
   return `
     <div class="p-3">
       <h3 class="font-bold text-lg">${feature.properties.nom}</h3>
       <p class="text-sm text-gray-600 mt-1">${feature.properties.descriptio}</p>
       <div class="mt-2">
         <span class="text-xs font-medium px-2 py-1 rounded bg-gray-100">
           Niveau de risque: ${feature.properties.risk.toUpperCase()}
         </span>
       </div>
     </div>
   `;
 };

 return (
   <div className="h-screen w-full relative">
     <MapContainer
       center={[30.995,-4.995]}
       zoom={16}
       className="h-full w-full"
       zoomControl={false}
     >
       <ZoomControl position="bottomright" />
       
       <TileLayer
         url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
         attribution='&copy; OpenStreetMap contributors'
         opacity={0.3}
       />

       {zonesData && (
         <GeoJSON
           data={zonesData}
           style={getZoneStyle}
           onEachFeature={(feature, layer) => {
             layer.bindPopup(renderZonePopup(feature));
           }}
         />
       )}
       {factoryData && (
          <GeoJSON
            data={factoryData}
            style={{
              fillColor: '#f8fafc',
              weight: 3,
              opacity: 1,
              color: '#334155',
              fillOpacity: 0
            }}
          />
        )}

       {sensorsData?.features?.map(sensor => {
         if (!sensor?.geometry?.coordinates) return null;
         return (
           <Marker
             key={`sensor-${sensor.properties.id}`}
             position={[
               sensor.geometry.coordinates[1],
               sensor.geometry.coordinates[0]
             ]}
             icon={createSensorIcon(sensor.properties.sensing)}
           >
             <Popup>
               <div className="p-2">
                 <h3 className="font-bold">Capteur {sensor.properties.sensing}</h3>
                 <p className="text-sm text-gray-600">Zone: {sensor.properties.zone}</p>
               </div>
             </Popup>
           </Marker>
         );
       })}

       {extinguishersData?.features?.map(extinguisher => {
         if (!extinguisher?.geometry?.coordinates) return null;
         return (
           <Marker
             key={`extinguisher-${extinguisher.properties.id}`}
             position={[
               extinguisher.geometry.coordinates[1],
               extinguisher.geometry.coordinates[0]
             ]}
             icon={createExtinguisherIcon()}
           >
             <Popup>
               <div className="p-2">
                 <h3 className="font-bold">Extincteur</h3>
                 <p className="text-sm text-gray-600">Zone: {extinguisher.properties.name}</p>
               </div>
             </Popup>
           </Marker>
         );
       })}

       {exitsData?.features?.map(exit => {
         if (!exit?.geometry?.coordinates?.[0]?.[0]) return null;
         return (
           <Marker
             key={`exit-${exit.properties.id}`}
             position={[
               exit.geometry.coordinates[0][0][1],
               exit.geometry.coordinates[0][0][0]
             ]}
             icon={createExitIcon()}
           >
             <Popup>
               <div className="p-2">
                 <h3 className="font-bold">Sortie de Secours</h3>
                 <p className="text-sm text-gray-600">
                   {exit.properties.zone ? `Zone: ${exit.properties.zone}` : 'Sortie principale'}
                 </p>
               </div>
             </Popup>
           </Marker>
         );
       })}
     </MapContainer>

     {/* Legend */}
     <div className="absolute bottom-4 right-4 bg-white p-4 rounded shadow-lg z-[1000]">
       <h3 className="font-bold mb-2">Légende</h3>
       <div className="space-y-3">
         <div>
           <h4 className="text-sm font-medium mb-1">Niveau de Risque</h4>
           <div className="space-y-1">
             <div className="flex items-center gap-2">
               <div className="w-4 h-4 rounded bg-red-500 opacity-50"></div>
               <span className="text-sm">Élevé</span>
             </div>
             <div className="flex items-center gap-2">
               <div className="w-4 h-4 rounded bg-orange-500 opacity-50"></div>
               <span className="text-sm">Moyen</span>
             </div>
             <div className="flex items-center gap-2">
               <div className="w-4 h-4 rounded bg-green-500 opacity-50"></div>
               <span className="text-sm">Faible</span>
             </div>
           </div>
         </div>

         <div>
           <h4 className="text-sm font-medium mb-1">Types de Capteurs</h4>
           <div className="grid grid-cols-2 gap-1">
             <div className="flex items-center gap-2">
               <div className="w-3 h-3 rounded-full bg-red-500"></div>
               <span className="text-sm">Température</span>
             </div>
             <div className="flex items-center gap-2">
               <div className="w-3 h-3 rounded-full bg-gray-500"></div>
               <span className="text-sm">Fumée</span>
             </div>
             <div className="flex items-center gap-2">
               <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
               <span className="text-sm">Étincelle</span>
             </div>
             <div className="flex items-center gap-2">
               <div className="w-3 h-3 rounded-full bg-blue-500"></div>
               <span className="text-sm">Pression</span>
             </div>
           </div>
         </div>
       </div>
     </div>
   </div>
 );
};