// src/pages/SmokeDetection.jsx
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { AlertTriangle, Wind } from 'lucide-react';
import { fetchZonesData, transformSmokeData } from '../api/sensorData';

export const SmokeDetection = () => {
  const [data, setData] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const zonesData = await fetchZonesData();
        setData(prev => transformSmokeData(zonesData, prev));
        setError(null);
      } catch (err) {
        setError('Failed to fetch smoke data');
        console.error('Error fetching smoke data:', err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const renderZoneCard = (zoneKey, readings) => {
    const currentReading = readings[readings.length - 1];
    const isAlert = currentReading?.isAlert;

    return (
      <Card key={zoneKey} className={`overflow-hidden ${isAlert ? 'border-red-500' : ''}`}>
        <CardHeader className="space-y-0 pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Wind className={isAlert ? 'text-red-500' : 'text-gray-500'} />
              {currentReading.name}
            </CardTitle>
            {isAlert && (
              <AlertTriangle className="text-red-500 animate-pulse" />
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className={`text-2xl font-bold ${isAlert ? 'text-red-500' : 'text-gray-700'}`}>
              {currentReading.value.toFixed(1)} ppm
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium
              ${currentReading.risk_level === 'HIGH' ? 'bg-red-100 text-red-800' :
                currentReading.risk_level === 'MEDIUM' ? 'bg-orange-100 text-orange-800' :
                'bg-green-100 text-green-800'}`}>
              {currentReading.risk_level}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={readings}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  domain={['auto', 'auto']}
                  tick={{ fontSize: 12 }}
                  label={{ value: 'Smoke Level (ppm)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '0.5rem',
                    border: 'none',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={isAlert ? '#ef4444' : '#6b7280'}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey={() => 300} // Smoke threshold
                  stroke="#ef4444"
                  strokeDasharray="5 5"
                  strokeWidth={1}
                  dot={false}
                  name="Threshold"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          {isAlert && (
            <div className="mt-2 p-2 bg-red-50 text-red-700 rounded-md text-sm">
              Smoke level exceeds safety threshold
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
        <h2 className="text-2xl font-bold">Smoke Detection</h2>
        <div className="text-sm text-gray-500">
          Auto-updating every 5 seconds
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(data).map(([zoneKey, readings]) => 
          renderZoneCard(zoneKey, readings)
        )}
      </div>
    </div>
  );
};