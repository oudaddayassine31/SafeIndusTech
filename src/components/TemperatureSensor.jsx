// src/components/sensors/TemperatureSensor.jsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from './ui/card';

export const TemperatureSensor = ({ data, zone }) => {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-2">Temperature - Zone {zone}</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#ef4444" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex justify-between text-sm">
        <span>Current: {data[data.length - 1]?.value}°C</span>
        <span className={`font-medium ${
          data[data.length - 1]?.value > 50 ? 'text-red-600' : 'text-green-600'
        }`}>
          Status: {data[data.length - 1]?.value > 50 ? 'Warning' : 'Normal'}
        </span>
      </div>
    </Card>
  );
};
