import React, { useState, useEffect } from 'react';
import { Bell, AlertTriangle, Thermometer, Wind, Flame } from 'lucide-react';
import { Card } from '../components/ui/card';

export const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Simulate initial notifications
    const mockNotifications = [
      {
        id: 1,
        type: 'temperature',
        message: 'High temperature detected in Zone 2',
        severity: 'warning',
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      },
      {
        id: 2,
        type: 'smoke',
        message: 'Smoke levels above threshold in Zone 1',
        severity: 'critical',
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      },
      {
        id: 3,
        type: 'fire',
        message: 'Fire detection system activated in Zone 3',
        severity: 'critical',
        timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
      },
    ];
    
    setNotifications(mockNotifications);
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'temperature':
        return Thermometer;
      case 'smoke':
        return Wind;
      case 'fire':
        return Flame;
      default:
        return Bell;
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">System Notifications</h2>
      <div className="space-y-4">
        {notifications.map((notification) => {
          const Icon = getIcon(notification.type);
          return (
            <Card key={notification.id} className="p-4">
              <div className="flex items-start space-x-4">
                <div className={`p-2 rounded-full ${
                  notification.severity === 'critical' ? 'bg-red-100' : 'bg-yellow-100'
                }`}>
                  <Icon className={`h-6 w-6 ${
                    notification.severity === 'critical' ? 'text-red-600' : 'text-yellow-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{notification.message}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(notification.timestamp).toLocaleString()}
                  </p>
                </div>
                {notification.severity === 'critical' && (
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};