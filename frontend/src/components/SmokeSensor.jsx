// src/components/sensors/SmokeSensor.jsx
import React from 'react';
import { Card } from './ui/card';

export const SmokeSensor = ({ data, zone }) => {
  const lastReading = data[data.length - 1]?.value || 0;
  const status = lastReading > 100 ? 'Critical' : lastReading > 50 ? 'Warning' : 'Normal';
  
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-2">Smoke Detection - Zone {zone}</h3>
      <div className="flex items-center justify-center h-32">
        <div className={`text-4xl font-bold ${
          status === 'Critical' ? 'text-red-600' :
          status === 'Warning' ? 'text-yellow-600' :
          'text-green-600'
        }`}>
          {lastReading} ppm
        </div>
      </div>
      <div className="mt-4 text-center">
        <span className={`font-medium ${
          status === 'Critical' ? 'text-red-600' :
          status === 'Warning' ? 'text-yellow-600' :
          'text-green-600'
        }`}>
          Status: {status}
        </span>
      </div>
    </Card>
  );
};