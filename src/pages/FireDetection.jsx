import React, { useState, useEffect } from 'react';
import { FireSensor } from '../components/FireSensor';

export const FireDetection = () => {
  const [sensors, setSensors] = useState({});

  useEffect(() => {
    // Simulate data - replace with actual API calls
    const zones = [1, 2, 3];
    const mockSensors = {};
    
    zones.forEach(zone => {
      mockSensors[zone] = {
        status: Math.random() > 0.9 ? 'Alert' : 'Normal'
      };
    });
    
    setSensors(mockSensors);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setSensors(prev => {
        const newSensors = { ...prev };
        Object.keys(newSensors).forEach(zone => {
          if (Math.random() > 0.95) {
            newSensors[zone].status = newSensors[zone].status === 'Alert' ? 'Normal' : 'Alert';
          }
        });
        return newSensors;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Fire Detection</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(sensors).map(([zone, data]) => (
          <FireSensor key={zone} status={data.status} zone={zone} />
        ))}
      </div>
    </div>
  );
};