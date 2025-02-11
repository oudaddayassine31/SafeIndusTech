
import React, { useState, useEffect } from 'react';
import { SmokeSensor } from '../components/SmokeSensor';
import { fetchZonesData, transformSmokeData } from '../api/sensorData';

export const SmokeDetection = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const zonesData = await fetchZonesData();
        setData(transformSmokeData(zonesData));
      } catch (error) {
        console.error('Error fetching smoke data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Smoke Detection</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(data).map(([zone, readings]) => (
          <SmokeSensor key={zone} data={readings} zone={zone} />
        ))}
      </div>
    </div>
  );
};
