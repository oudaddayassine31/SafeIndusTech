// src/utils/geoUtils.js
// Function to calculate new position based on bearing and distance
const moveAlongPath = (currentPosition, bearing, distanceInMeters) => {
  // Earth's radius in meters
  const R = 6371000;
  
  // Convert distance to radians
  const d = distanceInMeters / R;
  
  // Convert degrees to radians
  const lat1 = currentPosition[0] * Math.PI / 180;
  const lon1 = currentPosition[1] * Math.PI / 180;
  const brng = bearing * Math.PI / 180;

  // Calculate new position
  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(d) +
    Math.cos(lat1) * Math.sin(d) * Math.cos(brng)
  );
  
  const lon2 = lon1 + Math.atan2(
    Math.sin(brng) * Math.sin(d) * Math.cos(lat1),
    Math.cos(d) - Math.sin(lat1) * Math.sin(lat2)
  );

  // Convert back to degrees
  return [
    lat2 * 180 / Math.PI,
    lon2 * 180 / Math.PI
  ];
};

// Calculate bearing between two points
const calculateBearing = (start, end) => {
  const startLat = start[0] * Math.PI / 180;
  const startLng = start[1] * Math.PI / 180;
  const endLat = end[0] * Math.PI / 180;
  const endLng = end[1] * Math.PI / 180;

  const y = Math.sin(endLng - startLng) * Math.cos(endLat);
  const x = Math.cos(startLat) * Math.sin(endLat) -
           Math.sin(startLat) * Math.cos(endLat) * Math.cos(endLng - startLng);
  
  const bearing = Math.atan2(y, x) * 180 / Math.PI;
  return (bearing + 360) % 360;
};

export { moveAlongPath, calculateBearing };