// src/utils/thresholds.js
export const THRESHOLDS = {
  Heat: { value: 70, unit: '°C', color: '#ef4444' },  // red
  Smoke: { value: 0.3, unit: 'ppm', color: '#6b7280' },  // gray
  Pressure: { value: 2.0, unit: 'bar', color: '#3b82f6' },  // blue
  Spark: { value: true, unit: '', color: '#f59e0b' }  // amber
};

export const checkThreshold = (type, value) => {
  const threshold = THRESHOLDS[type];
  if (!threshold) return false;
  
  if (type === 'Spark') {
    return value === true;
  }
  return value > threshold.value;
};