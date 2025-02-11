// src/pages/Notifications.jsx
import React, { useState, useEffect } from 'react';
import { Thermometer, Wind, Gauge, Zap } from 'lucide-react';
import { alertService } from '../services/AlertService';

export const Notifications = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    setAlerts(alertService.getAlerts());
    return alertService.subscribe(setAlerts);
  }, []);

  const getAlertIcon = (type) => {
    switch (type) {
      case 'temperature': return Thermometer;
      case 'pressure': return Gauge;
      case 'smoke': return Wind;
      case 'spark': return Zap;
      default: return Thermometer;
    }
  };

  const handleAcknowledge = (alertId) => {
    alertService.acknowledgeAlert(alertId);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Alert History</h2>
      <div className="space-y-4">
        {alerts.map((alert) => {
          const Icon = getAlertIcon(alert.type);
          return (
            <div
              key={alert.id}
              className={`bg-white rounded-lg shadow p-4 border-l-4 ${
                alert.acknowledged ? 'border-gray-300' : 'border-red-500'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full ${
                    alert.acknowledged ? 'bg-gray-100' : 'bg-red-100'
                  }`}>
                    <Icon className={`h-5 w-5 ${
                      alert.acknowledged ? 'text-gray-600' : 'text-red-600'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {alert.message}
                    </h3>
                    <div className="mt-1 text-sm text-gray-600">
                      <p>Zone: {alert.zoneName}</p>
                      <p>Value: {alert.value}</p>
                      <p>Threshold: {alert.threshold}</p>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      {new Date(alert.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                {!alert.acknowledged && (
                  <button
                    onClick={() => handleAcknowledge(alert.id)}
                    className="px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md"
                  >
                    Acknowledge
                  </button>
                )}
              </div>
            </div>
          );
        })}
        {alerts.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No alerts to display
          </div>
        )}
      </div>
    </div>
  );
};