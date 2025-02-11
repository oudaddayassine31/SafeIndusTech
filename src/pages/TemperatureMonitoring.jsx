// src/pages/TemperatureMonitoring.jsx
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { fetchZonesData, transformTemperatureData } from '../api/sensorData';

export const TemperatureMonitoring = () => {
  const [data, setData] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const zonesData = await fetchZonesData();
        setData(prev => transformTemperatureData(zonesData, prev));
        setError(null);
      } catch (err) {
        setError('Failed to fetch temperature data');
        console.error('Error fetching temperature data:', err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, []);

  const renderZoneChart = (zoneId, readings) => (
    <Card key={zoneId} className="overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg">Zone {zoneId}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={readings}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="time"
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={['auto', 'auto']}
                tick={{ fontSize: 12 }}
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke={readings.some(r => r.isAlert) ? '#ef4444' : '#3b82f6'}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );

  if (error) {
    return (
      <div className="p-4">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Temperature Monitoring</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(data).map(([zoneId, readings]) => 
          renderZoneChart(zoneId, readings)
        )}
      </div>
    </div>
  );
};