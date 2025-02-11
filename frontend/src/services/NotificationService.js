// src/services/NotificationService.js
class NotificationService {
  constructor() {
    this.notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    this.maxNotifications = 100;
  }

  addNotification(notification) {
    const newNotification = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...notification
    };

    this.notifications = [newNotification, ...this.notifications]
      .slice(0, this.maxNotifications);
    
    localStorage.setItem('notifications', JSON.stringify(this.notifications));
    this.notifySubscribers(newNotification);
  }

  getNotifications() {
    return this.notifications;
  }

  // Threshold checking methods
  checkTemperature(zone, value) {
    if (value > 70) {
      this.addNotification({
        type: 'temperature',
        severity: 'critical',
        zoneName: zone.name,
        message: `High temperature (${value.toFixed(1)}°C) detected in ${zone.name}`,
        sensorType: 'temperature'
      });
      return true;
    }
    return false;
  }

  checkSmoke(zone, value) {
    if (value > 300) { // ppm
      this.addNotification({
        type: 'smoke',
        severity: 'critical',
        zoneName: zone.name,
        message: `High smoke level (${value.toFixed(1)} ppm) detected in ${zone.name}`,
        sensorType: 'smoke'
      });
      return true;
    }
    return false;
  }

  checkSpark(zone, detected) {
    if (detected) {
      this.addNotification({
        type: 'fire',
        severity: 'critical',
        zoneName: zone.name,
        message: `Spark detected in ${zone.name}`,
        sensorType: 'spark'
      });
      return true;
    }
    return false;
  }

  // Subscription for real-time updates
  subscribers = new Set();

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notifySubscribers(notification) {
    this.subscribers.forEach(callback => callback(notification));
  }
}

export const notificationService = new NotificationService();