import React, { useState, useEffect } from 'react';
import { FireSensor } from '../components/FireSensor';
import { fetchZonesData, transformFireData } from '../api/sensorData';

export const FireDetection = () => {
  const [sensors, setSensors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const zonesData = await fetchZonesData();
        setSensors(transformFireData(zonesData));
      } catch (error) {
        console.error('Error fetching fire detection data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);

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