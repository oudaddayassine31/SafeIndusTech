import React from 'react';
import FactoryMap from '../components/FactoryMap';
import SensorDashboard from '../components/SensorDashboard';
import { Card } from '../components/ui/card';
import { AlertTriangle } from 'lucide-react';

const Dashboard = () => {
  // Simulated active alerts
  const activeAlerts = [
    { id: 1, type: 'Température', zone: 'Zone A', value: '52°C', severity: 'high' },
    { id: 2, type: 'Fumée', zone: 'Zone B', value: 'Détectée', severity: 'medium' }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Map Section */}
      <section>
        <h2 className="text-xl font-bold mb-4">Plan de l'Installation</h2>
        <FactoryMap />
      </section>

      {/* Sensor Dashboard */}
      <section className="mt-6">
        <h2 className="text-xl font-bold mb-4">Surveillance des Capteurs</h2>
        <SensorDashboard />
      </section>

      {/* Active Alerts */}
      <section className="mt-6">
        <h2 className="text-xl font-bold mb-4">Alertes Actives</h2>
        <Card className="p-6">
          <div className="space-y-4">
            {activeAlerts.map(alert => (
              <div 
                key={alert.id}
                className={`flex items-center justify-between p-4 rounded-lg
                  ${alert.severity === 'high' ? 'bg-red-50' : 'bg-yellow-50'}`}
              >
                <div className="flex items-center gap-4">
                  <AlertTriangle className={
                    alert.severity === 'high' ? 'text-red-500' : 'text-yellow-500'
                  } />
                  <div>
                    <p className="font-medium">{alert.type}</p>
                    <p className="text-sm text-gray-500">{alert.zone}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium
                  ${alert.severity === 'high' 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-yellow-100 text-yellow-800'}`}>
                  {alert.value}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
};

export default Dashboard;