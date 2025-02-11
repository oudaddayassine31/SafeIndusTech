// src/pages/SensorStatus.jsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { fetchZonesData } from '../api/sensorData';

export const SensorStatus = () => {
  const [sensorStatus, setSensorStatus] = useState({});
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    const checkSensors = async () => {
      try {
        const zonesData = await fetchZonesData();
        const status = {};

        zonesData.forEach(zone => {
          status[zone.name] = {
            temperature: zone.properties.current_temp !== null,
            pressure: zone.properties.current_pressure !== null,
            smoke: zone.properties.current_smoke !== null,
            spark: zone.properties.spark_detected !== undefined,
            lastUpdate: new Date().toISOString()
          };
        });

        setSensorStatus(status);
        setLastUpdate(new Date().toISOString());
      } catch (error) {
        console.error('Error checking sensors:', error);
      }
    };

    checkSensors();
    const interval = setInterval(checkSensors, 10000);
    return () => clearInterval(interval);
  }, []);

  const renderSensorCard = (zoneName, status) => (
    <Card key={zoneName} className="overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg">{zoneName}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {Object.entries(status).map(([sensor, working]) => {
            if (sensor === 'lastUpdate') return null;
            return (
              <div key={sensor} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="capitalize">{sensor} Sensor</span>
                {working ? (
                  <CheckCircle className="text-green-500 h-5 w-5" />
                ) : (
                  <XCircle className="text-red-500 h-5 w-5" />
                )}
              </div>
            );
          })}
          <div className="text-xs text-gray-500 mt-2">
            Last checked: {new Date(status.lastUpdate).toLocaleString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Sensor Status</h2>
        <div className="text-sm text-gray-500">
          Auto-checking every 10 seconds
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(sensorStatus).map(([zoneName, status]) =>
          renderSensorCard(zoneName, status)
        )}
      </div>
    </div>
  );
};