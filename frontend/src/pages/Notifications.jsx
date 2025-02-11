// src/pages/Notifications.jsx
import React from 'react';
import { Thermometer, Wind, Gauge, Zap, Trash2, AlertTriangle } from 'lucide-react';
import { useAlert } from '../contexts/AlertContext';
import { useNavigate } from 'react-router-dom';

export const Notifications = () => {
  const { alertHistory, acknowledgeAlert, deleteAlert } = useAlert();
  const navigate = useNavigate();

  const getAlertIcon = (type) => {
    switch (type) {
      case 'temperature': return Thermometer;
      case 'pressure': return Gauge;
      case 'smoke': return Wind;
      case 'spark': return Zap;
      default: return AlertTriangle;
    }
  };

  const getAlertStyles = (type) => {
    const styles = {
      temperature: {
        bg: 'bg-red-100',
        text: 'text-red-600',
        border: 'border-red-500'
      },
      pressure: {
        bg: 'bg-blue-100',
        text: 'text-blue-600',
        border: 'border-blue-500'
      },
      smoke: {
        bg: 'bg-gray-100',
        text: 'text-gray-600',
        border: 'border-gray-500'
      },
      spark: {
        bg: 'bg-amber-100',
        text: 'text-amber-600',
        border: 'border-amber-500'
      }
    };
    return styles[type] || styles.temperature;
  };

  const navigateToSensor = (type) => {
    const routes = {
      temperature: '/temperature',
      pressure: '/pressure',
      smoke: '/smoke',
      spark: '/spark'
    };
    navigate(routes[type] || '/');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Alert History</h2>
      <div className="space-y-4">
        {alertHistory.map((alert) => {
          const Icon = getAlertIcon(alert.type);
          const styles = getAlertStyles(alert.type);
          return (
            <div
              key={alert.id}
              className={`bg-white rounded-lg shadow-lg p-4 border-l-4 ${
                alert.acknowledged ? 'border-gray-300' : styles.border
              } hover:shadow-xl transition-shadow duration-200`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full ${
                    alert.acknowledged ? 'bg-gray-100' : styles.bg
                  }`}>
                    <Icon className={`h-5 w-5 ${
                      alert.acknowledged ? 'text-gray-600' : styles.text
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
                <div className="flex flex-col gap-2">
                  {!alert.acknowledged && (
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      className={`px-3 py-1 text-sm font-medium ${styles.text} 
                                hover:${styles.bg} rounded-md transition-colors`}
                    >
                      Acknowledge
                    </button>
                  )}
                  <button
                    onClick={() => navigateToSensor(alert.type)}
                    className="px-3 py-1 text-sm font-medium text-gray-600 
                             hover:bg-gray-100 rounded-md transition-colors"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => deleteAlert(alert.id)}
                    className="p-1 text-gray-400 hover:text-red-500 
                             hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {alertHistory.length === 0 && (
          <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg">No alerts to display</p>
            <p className="text-sm">All systems are operating normally</p>
          </div>
        )}
      </div>
    </div>
  );
};