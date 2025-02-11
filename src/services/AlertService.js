// src/services/AlertService.js
class AlertService {
  constructor() {
    this.alerts = JSON.parse(localStorage.getItem('alerts') || '[]');
    this.subscribers = new Set();
  }

  addAlert(alert) {
    const newAlert = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      acknowledged: false,
      ...alert
    };
    
    this.alerts = [newAlert, ...this.alerts];
    localStorage.setItem('alerts', JSON.stringify(this.alerts));
    this.notifySubscribers();
  }

  acknowledgeAlert(alertId) {
    this.alerts = this.alerts.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    );
    localStorage.setItem('alerts', JSON.stringify(this.alerts));
    this.notifySubscribers();
  }

  getAlerts() {
    return this.alerts;
  }

  // Threshold checks
  checkSensorValue(zone, type, value) {
    const thresholds = {
      temperature: { value: 70, unit: '°C' },
      pressure: { value: 2.0, unit: 'bar' },
      smoke: { value: 0.3, unit: 'ppm' },
      spark: { value: true, unit: '' }
    };

    const threshold = thresholds[type];
    let isAlert = false;
    
    if (type === 'spark') {
      isAlert = value === true;
    } else {
      isAlert = value > threshold.value;
    }

    if (isAlert) {
      this.addAlert({
        type,
        zoneName: zone.name,
        value: type === 'spark' ? 'Detected' : `${value.toFixed(2)} ${threshold.unit}`,
        threshold: type === 'spark' ? 'Any' : `${threshold.value} ${threshold.unit}`,
        message: `High ${type} in ${zone.name}`,
        severity: 'critical'
      });
    }

    return isAlert;
  }

  // Subscription handling
  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notifySubscribers() {
    this.subscribers.forEach(callback => callback(this.alerts));
  }
}

export const alertService = new AlertService();