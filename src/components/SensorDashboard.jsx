import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from './ui/card';
import { Thermometer, Flame, Wind, AlertTriangle } from 'lucide-react';

const SensorDashboard = () => {
  const [sensorData, setSensorData] = useState({
    temperature: [],
    smoke: [],
    gas: [],
    flame: []
  });

  // Simulate real-time data updates
  useEffect(() => {
    const generateSensorData = () => {
      const now = new Date();
      const timestamp = now.toLocaleTimeString();

      return {
        temperature: {
          value: 25 + Math.random() * 30, // 25-55°C
          threshold: 50,
          unit: '°C'
        },
        smoke: {
          value: Math.random() * 100, // 0-100 ppm
          threshold: 50,
          unit: 'ppm'
        },
        gas: {
          value: Math.random() * 15, // 0-15 ppm
          threshold: 10,
          unit: 'ppm'
        },
        flame: {
          value: Math.random() * 100, // 0-100 intensity
          threshold: 70,
          unit: 'intensity'
        }
      };
    };

    const updateInterval = setInterval(() => {
      const newData = generateSensorData();
      
      setSensorData(prev => ({
        temperature: [...prev.temperature.slice(-20), { time: new Date().toLocaleTimeString(), value: newData.temperature.value }],
        smoke: [...prev.smoke.slice(-20), { time: new Date().toLocaleTimeString(), value: newData.smoke.value }],
        gas: [...prev.gas.slice(-20), { time: new Date().toLocaleTimeString(), value: newData.gas.value }],
        flame: [...prev.flame.slice(-20), { time: new Date().toLocaleTimeString(), value: newData.flame.value }]
      }));
    }, 2000);

    return () => clearInterval(updateInterval);
  }, []);

  const renderSensorCard = (title, data, icon, color, unit) => {
    const latestValue = data[data.length - 1]?.value || 0;
    const Icon = icon;

    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <Icon className={`h-6 w-6 text-${color}-500`} />
        </div>
        <div className="text-3xl font-bold">{latestValue.toFixed(1)}{unit}</div>
        <div className="h-32 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={`var(--${color}-500)`} 
                dot={false} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {renderSensorCard('Température', sensorData.temperature, Thermometer, 'red', '°C')}
      {renderSensorCard('Fumée', sensorData.smoke, Wind, 'gray', 'ppm')}
      {renderSensorCard('Gaz', sensorData.gas, AlertTriangle, 'yellow', 'ppm')}
      {renderSensorCard('Flamme', sensorData.flame, Flame, 'orange', '')}
    </div>
  );
};

export default SensorDashboard;