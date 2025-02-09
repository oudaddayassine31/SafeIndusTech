import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../components/ui/card';
import { 
  Thermometer,
  Flame,
  Bell,
  Users,
  AlertTriangle
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";

// Sample data - replace with your actual data
const temperatureData = [
  { time: '08:00', value: 45 },
  { time: '09:00', value: 48 },
  { time: '10:00', value: 52 },
  { time: '11:00', value: 55 },
  { time: '12:00', value: 49 }
];

const alertsData = [
  { id: 1, type: 'Température', zone: 'Zone A', value: '75°C', status: 'Critique' },
  { id: 2, type: 'Fumée', zone: 'Zone B', value: 'Détectée', status: 'Warning' }
];

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Température</h3>
            <Thermometer className="h-6 w-6 text-red-500" />
          </div>
          <div className="text-3xl font-bold">52°C</div>
          <div className="text-sm text-gray-500">Moyenne des zones</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Risque Incendie</h3>
            <Flame className="h-6 w-6 text-orange-500" />
          </div>
          <div className="text-3xl font-bold">Faible</div>
          <div className="text-sm text-gray-500">Niveau actuel</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Alertes Actives</h3>
            <Bell className="h-6 w-6 text-yellow-500" />
          </div>
          <div className="text-3xl font-bold">2</div>
          <div className="text-sm text-gray-500">Dernière heure</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Personnel</h3>
            <Users className="h-6 w-6 text-blue-500" />
          </div>
          <div className="text-3xl font-bold">45</div>
          <div className="text-sm text-gray-500">Sur site</div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Température (24h)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={temperatureData}>
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#ef4444" 
                  name="Température °C"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Alertes Actives</h3>
          <div className="space-y-4">
            {alertsData.map((alert) => (
              <div 
                key={alert.id}
                className={`p-4 rounded-lg flex items-center justify-between
                  ${alert.status === 'Critique' ? 'bg-red-50' : 'bg-yellow-50'}`}
              >
                <div className="flex items-center space-x-4">
                  <AlertTriangle className={`h-5 w-5 
                    ${alert.status === 'Critique' ? 'text-red-500' : 'text-yellow-500'}`} 
                  />
                  <div>
                    <p className="font-medium">{alert.type}</p>
                    <p className="text-sm text-gray-500">{alert.zone}</p>
                  </div>
                </div>
                <div>
                  <span className={`px-2 py-1 rounded-full text-sm
                    ${alert.status === 'Critique' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {alert.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}