// src/components/sensors/FireSensor.jsx
import React from 'react';
import { Card } from './ui/card';
import { Flame } from 'lucide-react';

export const FireSensor = ({ status, zone }) => {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-2">Fire Detection - Zone {zone}</h3>
      <div className="flex items-center justify-center h-32">
        <Flame className={`h-16 w-16 ${
          status === 'Alert' ? 'text-red-600 animate-pulse' :
          'text-gray-400'
        }`} />
      </div>
      <div className="mt-4 text-center">
        <span className={`font-medium ${
          status === 'Alert' ? 'text-red-600' : 'text-green-600'
        }`}>
          Status: {status}
        </span>
      </div>
    </Card>
  );
};