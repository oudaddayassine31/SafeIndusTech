import React, { useState, useEffect } from 'react';
import { TemperatureSensor } from '../components/TemperatureSensor';

export const TemperatureMonitoring = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    // Simulate data - replace with actual API calls
    const zones = [1, 2, 3];
    const mockData = {};
    
    zones.forEach(zone => {
      mockData[zone] = Array.from({ length: 24 }, (_, i) => ({
        time: `${i}:00`,
        value: Math.round(20 + Math.random() * 40)
      }));
    });
    
    setData(mockData);
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Temperature Monitoring</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(data).map(([zone, readings]) => (
          <TemperatureSensor key={zone} data={readings} zone={zone} />
        ))}
      </div>
    </div>
  );
};