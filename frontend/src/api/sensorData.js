// src/api/sensorData.js
import axios from 'axios';

const API_BASE_URL = '/api';
const MAX_HISTORY_POINTS = 100;

export const THRESHOLDS = {
  temperature: { value: 70, unit: '°C' },
  pressure: { value: 2.0, unit: 'bar' },
  smoke: { value: 0.3, unit: 'ppm' },
  spark: { value: true, unit: '' }
};

export const fetchZonesData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/zones/status`);
    return response.data;
  } catch (error) {
    console.error('Error fetching zones data:', error);
    throw error;
  }
};

export const transformTemperatureData = (zonesData, previousData = {}) => {
  const temperatureData = {};
  const timestamp = new Date().toLocaleTimeString();

  zonesData.forEach((zone) => {
    const isAlert = zone.properties.current_temp > THRESHOLDS.temperature.value;
    const newReading = {
      time: timestamp,
      value: zone.properties.current_temp,
      isAlert,
      name: zone.name,
      risk_level: zone.risk_level,
      threshold: THRESHOLDS.temperature.value,
      unit: THRESHOLDS.temperature.unit
    };

    const zoneKey = zone.name.replace(/\s+/g, '');
    const prevReadings = previousData[zoneKey] || [];
    temperatureData[zoneKey] = [...prevReadings, newReading].slice(-MAX_HISTORY_POINTS);
  });

  return temperatureData;
};

export const transformSmokeData = (zonesData, previousData = {}) => {
  const smokeData = {};
  const timestamp = new Date().toLocaleTimeString();

  zonesData.forEach((zone) => {
    const value = zone.properties.current_smoke * 1000;
    const isAlert = zone.properties.current_smoke > THRESHOLDS.smoke.value;
    const newReading = {
      time: timestamp,
      value,
      isAlert,
      name: zone.name,
      risk_level: zone.risk_level,
      threshold: THRESHOLDS.smoke.value * 1000,
      unit: THRESHOLDS.smoke.unit
    };

    const zoneKey = zone.name.replace(/\s+/g, '');
    const prevReadings = previousData[zoneKey] || [];
    smokeData[zoneKey] = [...prevReadings, newReading].slice(-MAX_HISTORY_POINTS);
  });

  return smokeData;
};

export const transformPressureData = (zonesData, previousData = {}) => {
  const pressureData = {};
  const timestamp = new Date().toLocaleTimeString();

  zonesData.forEach((zone) => {
    const isAlert = zone.properties.current_pressure > THRESHOLDS.pressure.value;
    const newReading = {
      time: timestamp,
      value: zone.properties.current_pressure,
      isAlert,
      name: zone.name,
      risk_level: zone.risk_level,
      threshold: THRESHOLDS.pressure.value,
      unit: THRESHOLDS.pressure.unit
    };

    const zoneKey = zone.name.replace(/\s+/g, '');
    const prevReadings = previousData[zoneKey] || [];
    pressureData[zoneKey] = [...prevReadings, newReading].slice(-MAX_HISTORY_POINTS);
  });

  return pressureData;
};

export const transformSparkData = (zonesData, previousData = {}) => {
  const sparkData = {};
  const timestamp = new Date().toLocaleTimeString();

  zonesData.forEach((zone) => {
    const isAlert = zone.properties.spark_detected === THRESHOLDS.spark.value;
    const newReading = {
      time: timestamp,
      sparkDetected: zone.properties.spark_detected,
      name: zone.name,
      risk_level: zone.risk_level,
      isAlert
    };

    const zoneKey = zone.name.replace(/\s+/g, '');
    const prevReadings = previousData[zoneKey] || [];
    sparkData[zoneKey] = [...prevReadings, newReading].slice(-MAX_HISTORY_POINTS);
  });

  return sparkData;
};