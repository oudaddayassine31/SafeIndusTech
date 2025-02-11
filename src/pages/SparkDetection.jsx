// src/pages/SparkDetection.jsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { AlertTriangle, Zap } from 'lucide-react';
import { fetchZonesData } from '../api/sensorData';
import { alertService } from '../services/AlertService';
import { useAlert } from '../contexts/AlertContext';

export const SparkDetection = () => {
  const [data, setData] = useState({});
  const [error, setError] = useState(null);
  const { triggerAlert } = useAlert();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const zonesData = await fetchZonesData();
        zonesData.forEach(zone => {
          alertService.checkSensorValue(zone, 'spark', zone.properties.spark_detected);
        });

        const sparkData = {};
        zonesData.forEach(zone => {
          const zoneKey = zone.name.replace(/\s+/g, '');
          sparkData[zoneKey] = {
            name: zone.name,
            sparkDetected: zone.properties.spark_detected,
            risk_level: zone.risk_level,
            temperature: zone.properties.current_temp,
            smoke: zone.properties.current_smoke
          };
        });
        
        setData(sparkData);
        setError(null);
      } catch (err) {
        setError('Failed to fetch spark detection data');
        console.error('Error fetching spark data:', err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const renderZoneCard = (zoneKey, zoneData) => (
    <Card key={zoneKey} className={`overflow-hidden ${zoneData.sparkDetected ? 'border-red-500' : ''}`}>
      <CardHeader className="space-y-0 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className={zoneData.sparkDetected ? 'text-red-500' : 'text-gray-500'} />
            {zoneData.name}
          </CardTitle>
          {zoneData.sparkDetected && (
            <AlertTriangle className="text-red-500 animate-pulse" />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className={`p-4 rounded-lg ${
          zoneData.sparkDetected 
            ? 'bg-red-100 border-2 border-red-500 animate-pulse' 
            : 'bg-gray-100'
        }`}>
          <div className="flex items-center justify-center">
            <div className="text-center">
              <span className={`text-xl font-bold ${
                zoneData.sparkDetected ? 'text-red-600' : 'text-gray-600'
              }`}>
                {zoneData.sparkDetected ? 'SPARK DETECTED' : 'No Sparks Detected'}
              </span>
              <div className="mt-2 text-sm text-gray-600">
                <div>Temperature: {zoneData.temperature.toFixed(1)}°C</div>
                <div>Smoke Level: {(zoneData.smoke * 1000).toFixed(1)} ppm</div>
              </div>
            </div>
          </div>
        </div>
        {zoneData.sparkDetected && (
          <div className="mt-4 p-2 bg-red-50 text-red-700 rounded-md text-sm">
            WARNING: Spark detected in this zone! Check immediately.
          </div>
        )}
      </CardContent>
    </Card>
  );

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
        <h2 className="text-2xl font-bold">Spark Detection</h2>
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