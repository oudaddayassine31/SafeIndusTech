// src/pages/Notifications.jsx
import React, { useState, useEffect } from 'react';
import { Bell, AlertTriangle, Thermometer, Wind, Flame } from 'lucide-react';
import { Card } from '../components/ui/card';
import { setNotificationHandler } from '../api/sensorData';

export const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Set up notification handler
    setNotificationHandler((newNotification) => {
      setNotifications(prev => {
        // Add new notification and keep only last 50 notifications
        const updated = [newNotification, ...prev].slice(0, 50);
        // Store in localStorage
        localStorage.setItem('safeIndusTechNotifications', JSON.stringify(updated));
        return updated;
      });
    });

    // Load previous notifications from localStorage
    const storedNotifications = localStorage.getItem('safeIndusTechNotifications');
    if (storedNotifications) {
      setNotifications(JSON.parse(storedNotifications));
    }
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

  const formatNotificationMessage = (notification) => {
    const baseMessage = notification.message;
    const time = new Date(notification.timestamp).toLocaleString();
    return { baseMessage, time };
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">System Notifications</h2>
      <div className="space-y-4">
        {notifications.map((notification) => {
          const Icon = getIcon(notification.type);
          const { baseMessage, time } = formatNotificationMessage(notification);
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
                  <p className="font-medium text-gray-900">{baseMessage}</p>
                  <p className="text-sm text-gray-500">{time}</p>
                </div>
                {notification.severity === 'critical' && (
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                )}
              </div>
            </Card>
          );
        })}
        {notifications.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No notifications yet
          </div>
        )}
      </div>
    </div>
  );
};