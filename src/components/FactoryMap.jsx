import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

const FactoryMap = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapInstanceRef.current && mapRef.current) {
      // Initialize map
      mapInstanceRef.current = L.map(mapRef.current).setView([31.6258, -7.9891], 18);

      // Add OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 22,
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current);

      // Load and add GeoJSON data
      fetch('/src/data/usine1.geojson')
        .then(response => response.json())
        .then(data => {
          const geoJsonLayer = L.geoJSON(data, {
            style: (feature) => {
              // Style based on feature properties
              return {
                fillColor: getZoneColor(feature.properties.type),
                weight: 2,
                opacity: 1,
                color: 'white',
                fillOpacity: 0.7
              };
            },
            onEachFeature: (feature, layer) => {
              // Popup content for each feature
              const popupContent = `
                <div class="p-2">
                  <h3 class="font-bold">${feature.properties.name || 'Zone'}</h3>
                  <p>Type: ${feature.properties.type || 'N/A'}</p>
                  ${feature.properties.risk_level ? 
                    `<p>Niveau de risque: ${feature.properties.risk_level}</p>` : ''}
                </div>
              `;
              layer.bindPopup(popupContent);

              // Hover effects
              layer.on({
                mouseover: (e) => {
                  const layer = e.target;
                  layer.setStyle({
                    weight: 3,
                    fillOpacity: 0.9
                  });
                },
                mouseout: (e) => {
                  geoJsonLayer.resetStyle(e.target);
                }
              });
            }
          }).addTo(mapInstanceRef.current);

          // Fit map bounds to GeoJSON
          mapInstanceRef.current.fitBounds(geoJsonLayer.getBounds());
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

  // Function to determine zone colors based on type
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
    <div className="relative h-[600px] w-full rounded-lg overflow-hidden shadow-lg">
      <div ref={mapRef} className="h-full w-full" />
      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg shadow-md">
        <h4 className="font-semibold mb-2">Légende</h4>
        {[
          { type: 'production', label: 'Zone de Production' },
          { type: 'storage', label: 'Stockage' },
          { type: 'office', label: 'Bureaux' },
          { type: 'high_risk', label: 'Risque Élevé' }
        ].map(item => (
          <div key={item.type} className="flex items-center gap-2 text-sm">
            <div 
              className="w-4 h-4 rounded" 
              style={{ backgroundColor: getZoneColor(item.type) }}
            />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FactoryMap;