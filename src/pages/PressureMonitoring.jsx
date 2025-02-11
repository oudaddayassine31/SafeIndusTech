// src/pages/PressureMonitoring.jsx
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { AlertTriangle, Gauge } from 'lucide-react';
import { fetchZonesData } from '../api/sensorData';
import { alertService } from '../services/AlertService';

export const PressureMonitoring = () => {
  const [data, setData] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const zonesData = await fetchZonesData();
        zonesData.forEach(zone => {
          alertService.checkSensorValue(zone, 'pressure', zone.properties.current_pressure);
        });

        const pressureData = {};
        zonesData.forEach(zone => {
          const zoneKey = zone.name.replace(/\s+/g, '');
          pressureData[zoneKey] = {
            name: zone.name,
            value: zone.properties.current_pressure,
            isAlert: zone.properties.current_pressure > 2.0,
            risk_level: zone.risk_level
          };
        });
        
        setData(pressureData);
        setError(null);
      } catch (err) {
        setError('Failed to fetch pressure data');
        console.error('Error fetching pressure data:', err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const renderZoneCard = (zoneKey, zoneData) => {
    const isAlert = zoneData.value > 2.0;

    return (
      <Card key={zoneKey} className={`overflow-hidden ${isAlert ? 'border-red-500' : ''}`}>
        <CardHeader className="space-y-0 pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Gauge className={isAlert ? 'text-red-500' : 'text-blue-500'} />
              {zoneData.name}
            </CardTitle>
            {isAlert && (
              <AlertTriangle className="text-red-500 animate-pulse" />
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className={`text-2xl font-bold ${isAlert ? 'text-red-500' : 'text-gray-700'}`}>
              {zoneData.value.toFixed(2)} bar
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium
              ${zoneData.risk_level === 'HIGH' ? 'bg-red-100 text-red-800' :
                zoneData.risk_level === 'MEDIUM' ? 'bg-orange-100 text-orange-800' :
                'bg-green-100 text-green-800'}`}>
              {zoneData.risk_level}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  isAlert ? 'bg-red-500' : 'bg-blue-500'
                }`}
                style={{ width: `${Math.min(zoneData.value / 3 * 100, 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-500">
              <span>0 bar</span>
              <span>3 bar</span>
            </div>
          </div>
          {isAlert && (
            <div className="mt-2 p-2 bg-red-50 text-red-700 rounded-md text-sm">
              Pressure exceeds safe threshold (2.0 bar)
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (error) {
    return (
      <div className="p-4">
        <div className="text-red-500 bg-red-50 p-4 rounded-md">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Pressure Monitoring</h2>
        <div className="text-sm text-gray-500">
          Auto-updating every 5 seconds
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(data).map(([zoneKey, zoneData]) => 
          renderZoneCard(zoneKey, zoneData)
        )}
      </div>
    </div>
  );
};