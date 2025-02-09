import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapPage = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapInstanceRef.current && mapRef.current) {
      // Initialize the map
      mapInstanceRef.current = L.map(mapRef.current).setView([31.6258, -7.9891], 18);

      // Add the base map layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 22,
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current);

      // Load and display the GeoJSON data
      fetch('/src/data/usine1.geojson')
        .then(response => response.json())
        .then(data => {
          // Add GeoJSON layer
          const geoJsonLayer = L.geoJSON(data, {
            style: (feature) => ({
              fillColor: getZoneColor(feature.properties.type),
              weight: 2,
              opacity: 1,
              color: 'white',
              dashArray: '3',
              fillOpacity: 0.7
            }),
            onEachFeature: (feature, layer) => {
              // Add popups
              const popupContent = `
                <div class="p-3">
                  <h3 class="font-bold text-lg mb-2">${feature.properties.name || 'Zone'}</h3>
                  <div class="space-y-1">
                    <p><strong>Type:</strong> ${feature.properties.type || 'N/A'}</p>
                    ${feature.properties.risk_level ? 
                      `<p><strong>Niveau de risque:</strong> ${feature.properties.risk_level}</p>` : ''}
                  </div>
                </div>
              `;
              layer.bindPopup(popupContent);

              // Add hover effects
              layer.on({
                mouseover: (e) => {
                  const layer = e.target;
                  layer.setStyle({
                    weight: 5,
                    color: '#666',
                    dashArray: '',
                    fillOpacity: 0.9
                  });
                },
                mouseout: (e) => {
                  geoJsonLayer.resetStyle(e.target);
                },
                click: (e) => {
                  mapInstanceRef.current.fitBounds(e.target.getBounds());
                }
              });
            }
          }).addTo(mapInstanceRef.current);

          // Fit map to GeoJSON bounds
          mapInstanceRef.current.fitBounds(geoJsonLayer.getBounds());

          // Add legend
          const legend = L.control({ position: 'bottomright' });
          legend.onAdd = () => {
            const div = L.DomUtil.create('div', 'bg-white p-3 rounded-lg shadow-lg');
            div.innerHTML = `
              <h4 class="font-bold mb-2">Légende</h4>
              <div class="space-y-2">
                ${Object.entries(zoneTypes).map(([type, label]) => `
                  <div class="flex items-center gap-2">
                    <div class="w-4 h-4 rounded" style="background: ${getZoneColor(type)}"></div>
                    <span>${label}</span>
                  </div>
                `).join('')}
              </div>
            `;
            return div;
          };
          legend.addTo(mapInstanceRef.current);
        })
        .catch(error => console.error('Error loading GeoJSON:', error));
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Zone types and colors
  const zoneTypes = {
    'production': 'Zone de Production',
    'storage': 'Zone de Stockage',
    'office': 'Bureaux',
    'high_risk': 'Zone à Haut Risque',
    'medium_risk': 'Zone à Risque Moyen',
    'low_risk': 'Zone à Faible Risque'
  };

  const getZoneColor = (type) => {
    const colors = {
      'production': '#ff4444',
      'storage': '#ffbb33',
      'office': '#00C851',
      'high_risk': '#CC0000',
      'medium_risk': '#FF8800',
      'low_risk': '#007E33'
    };
    return colors[type] || '#666666';
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-lg p-4">
        <h1 className="text-2xl font-bold mb-4">Plan de l'Installation</h1>
        <div className="relative h-[calc(100vh-12rem)] w-full rounded-lg overflow-hidden">
          <div ref={mapRef} className="h-full w-full" />
        </div>
      </div>
    </div>
  );
};

export default MapPage;