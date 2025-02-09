// src/components/FactoryMap.jsx
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const factoryGeoJSON = {
  "type": "FeatureCollection",
  "name": "usine1",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "Layer": "FURNI",
        "SubClasses": "AcDbEntity:AcDbLine",
        "Linetype": "Continuous"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [31.6295, -7.9811],
          [31.6296, -7.9811],
          [31.6296, -7.9812],
          [31.6295, -7.9812],
          [31.6295, -7.9811]
        ]]
      }
    }
  ]
};

export const FactoryMap = () => {
  const mapStyle = {
    fillColor: '#ff7800',
    weight: 2,
    opacity: 1,
    color: '#333',
    fillOpacity: 0.7
  };

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={[31.6295, -7.9811]}
        zoom={18}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoJSON
          data={factoryGeoJSON}
          style={mapStyle}
          onEachFeature={(feature, layer) => {
            if (feature.properties && feature.properties.Layer) {
              layer.bindPopup(feature.properties.Layer);
            }
          }}
        />
      </MapContainer>
    </div>
  );
};