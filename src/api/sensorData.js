// src/api/sensorData.js
import axios from 'axios';
const API_BASE_URL = '/api';
const TEMPERATURE_THRESHOLD = 70; // Celsius
const SMOKE_THRESHOLD = 0.3; // Adjusted threshold for smoke
const MAX_HISTORY_POINTS = 10;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  }
});

export const fetchZonesData = async () => {
  try {
    const response = await axiosInstance.get('/zones/status');
    return response.data;
  } catch (error) {
    console.error('Error fetching zones data:', error);
    throw error;
  }
};

export const transformTemperatureData = (zonesData, previousData = {}) => {
  const temperatureData = {};
  if (!Array.isArray(zonesData)) return temperatureData;
  
  zonesData.forEach((zone, index) => {
    const zoneId = index + 1;
    if (zone?.properties?.current_temp != null) {
      const newReading = {
        time: new Date().toLocaleTimeString(),
        value: zone.properties.current_temp,
        isAlert: zone.properties.current_temp > TEMPERATURE_THRESHOLD
      };
      
      // Get previous readings or initialize empty array
      const previousReadings = previousData[zoneId] || [];
      
      // Add new reading and keep last 10
      temperatureData[zoneId] = [...previousReadings, newReading]
        .slice(-MAX_HISTORY_POINTS);

      // Generate notification if threshold exceeded
      if (newReading.isAlert) {
        generateNotification({
          type: 'temperature',
          message: `High temperature (${newReading.value}°C) detected in ${zone.name}`,
          severity: 'critical',
          zoneId,
          value: newReading.value
        });
      }
    }
  });
  return temperatureData;
};

export const transformSmokeData = (zonesData, previousData = {}) => {
  const smokeData = {};
  if (!Array.isArray(zonesData)) return smokeData;
  
  zonesData.forEach((zone, index) => {
    const zoneId = index + 1;
    if (zone?.properties?.current_smoke != null) {
      const value = zone.properties.current_smoke * 1000; // Convert to ppm
      const newReading = {
        time: new Date().toLocaleTimeString(),
        value,
        isAlert: zone.properties.current_smoke > SMOKE_THRESHOLD
      };
      
      const previousReadings = previousData[zoneId] || [];
      smokeData[zoneId] = [...previousReadings, newReading]
        .slice(-MAX_HISTORY_POINTS);

      if (newReading.isAlert) {
        generateNotification({
          type: 'smoke',
          message: `High smoke level (${value.toFixed(1)} ppm) detected in ${zone.name}`,
          severity: 'critical',
          zoneId,
          value
        });
      }
    }
  });
  return smokeData;
};

export const transformFireData = (zonesData, previousData = {}) => {
  const fireData = {};
  if (!Array.isArray(zonesData)) return fireData;
  
  zonesData.forEach((zone, index) => {
    const zoneId = index + 1;
    if (zone?.properties?.spark_detected != null) {
      const newStatus = zone.properties.spark_detected ? 'Alert' : 'Normal';
      fireData[zoneId] = {
        status: newStatus,
        time: new Date().toLocaleTimeString()
      };

      if (newStatus === 'Alert') {
        generateNotification({
          type: 'fire',
          message: `Fire alert detected in ${zone.name}`,
          severity: 'critical',
          zoneId
        });
      }
    }
  });
  return fireData;
};

// Notification handling
let notificationCallback = () => {};

export const setNotificationHandler = (callback) => {
  notificationCallback = callback;
};

const generateNotification = (notification) => {
  notificationCallback({
    id: Date.now(),
    ...notification,
    timestamp: new Date().toISOString()
  });
};