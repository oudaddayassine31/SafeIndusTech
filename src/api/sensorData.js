// src/api/sensorData.js
import axios from 'axios';

const API_BASE_URL = '/api';
const MAX_HISTORY_POINTS = 100; // Store last 10 readings

export const fetchZonesData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/zones/status`);
    return response.data;
  } catch (error) {
    console.error('Error fetching zones data:', error);
    throw error;
  }
};

// Transform temperature data with thresholds and alerts
export const transformTemperatureData = (zonesData, previousData = {}) => {
  const temperatureData = {};
  const timestamp = new Date().toLocaleTimeString();

  zonesData.forEach((zone) => {
    const newReading = {
      time: timestamp,
      value: zone.properties.current_temp,
      isAlert: zone.properties.current_temp > 70,
      name: zone.name,
      risk_level: zone.risk_level
    };

    const zoneKey = zone.name.replace(/\s+/g, '');
    const prevReadings = previousData[zoneKey] || [];
    temperatureData[zoneKey] = [...prevReadings, newReading].slice(-MAX_HISTORY_POINTS);
  });

  return temperatureData;
};

// Transform smoke data with thresholds
export const transformSmokeData = (zonesData, previousData = {}) => {
  const smokeData = {};
  const timestamp = new Date().toLocaleTimeString();

  zonesData.forEach((zone) => {
    const value = zone.properties.current_smoke * 1000; // Convert to ppm
    const newReading = {
      time: timestamp,
      value,
      isAlert: zone.properties.current_smoke > 0.3,
      name: zone.name,
      risk_level: zone.risk_level
    };

    const zoneKey = zone.name.replace(/\s+/g, '');
    const prevReadings = previousData[zoneKey] || [];
    smokeData[zoneKey] = [...prevReadings, newReading].slice(-MAX_HISTORY_POINTS);
  });

  return smokeData;
};

// Transform spark/fire detection data
export const transformFireData = (zonesData, previousData = {}) => {
  const fireData = {};
  const timestamp = new Date().toLocaleTimeString();

  zonesData.forEach((zone) => {
    const newReading = {
      time: timestamp,
      sparkDetected: zone.properties.spark_detected,
      temperature: zone.properties.current_temp,
      smoke: zone.properties.current_smoke,
      name: zone.name,
      risk_level: zone.risk_level,
      isAlert: zone.properties.spark_detected || 
               zone.properties.current_temp > 70 ||
               zone.properties.current_smoke > 0.3
    };

    const zoneKey = zone.name.replace(/\s+/g, '');
    const prevReadings = previousData[zoneKey] || [];
    fireData[zoneKey] = [...prevReadings, newReading].slice(-MAX_HISTORY_POINTS);
  });

  return fireData;
};