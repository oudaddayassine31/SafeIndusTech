// src/components/MapControls.jsx
import React from 'react';
import { 
  Layers, 
  Users, 
  Map as MapIcon, 
  Eye, 
  EyeOff,
  Settings
} from 'lucide-react';

export const MapControls = ({ 
  layerVisibility, 
  setLayerVisibility,
  mapStyle,
  setMapStyle,
  employeeTrailsVisible,
  setEmployeeTrailsVisible,
  opacityLevels,
  setOpacityLevels
}) => {
  const mapStyles = [
    { id: 'streets', name: 'Streets' },
    { id: 'satellite', name: 'Satellite' },
    { id: 'dark', name: 'Dark Mode' }
  ];

  return (
    <div className="absolute top-4 left-4 bg-white p-4 rounded-lg shadow-lg z-[1000] w-72">
      <div className="space-y-4">
        <div>
          <h3 className="font-bold flex items-center gap-2 mb-2">
            <Layers className="w-4 h-4" />
            Layer Controls
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={layerVisibility.zones}
                  onChange={() => setLayerVisibility(prev => ({
                    ...prev,
                    zones: !prev.zones
                  }))}
                  className="rounded"
                />
                Zones
              </label>
              {layerVisibility.zones && (
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={opacityLevels.zones}
                  onChange={(e) => setOpacityLevels(prev => ({
                    ...prev,
                    zones: parseInt(e.target.value)
                  }))}
                  className="w-24"
                />
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={layerVisibility.employees}
                  onChange={() => setLayerVisibility(prev => ({
                    ...prev,
                    employees: !prev.employees
                  }))}
                  className="rounded"
                />
                Employees
              </label>
              {layerVisibility.employees && (
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={opacityLevels.employees}
                  onChange={(e) => setOpacityLevels(prev => ({
                    ...prev,
                    employees: parseInt(e.target.value)
                  }))}
                  className="w-24"
                />
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={layerVisibility.routes}
                  onChange={() => setLayerVisibility(prev => ({
                    ...prev,
                    routes: !prev.routes
                  }))}
                  className="rounded"
                />
                Routes
              </label>
              {layerVisibility.routes && (
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={opacityLevels.routes}
                  onChange={(e) => setOpacityLevels(prev => ({
                    ...prev,
                    routes: parseInt(e.target.value)
                  }))}
                  className="w-24"
                />
              )}
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-bold flex items-center gap-2 mb-2">
            <MapIcon className="w-4 h-4" />
            Map Style
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {mapStyles.map(style => (
              <button
                key={style.id}
                onClick={() => setMapStyle(style.id)}
                className={`px-2 py-1 rounded text-sm ${
                  mapStyle === style.id 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {style.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-bold flex items-center gap-2 mb-2">
            <Users className="w-4 h-4" />
            Employee Tracking
          </h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={employeeTrailsVisible}
                onChange={() => setEmployeeTrailsVisible(!employeeTrailsVisible)}
                className="rounded"
              />
              Show Movement Trails
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};