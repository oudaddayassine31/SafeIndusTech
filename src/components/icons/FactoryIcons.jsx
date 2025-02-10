// src/components/icons/FactoryIcons.jsx
import L from 'leaflet';

// Sensor Icons
export const createSensorIcon = (type) => {
  const colors = {
    'Temperature': '#FF5252',
    'Fumer': '#757575',
    'Etincelle': '#FFC107',
    'Pression': '#2196F3'
  };

  return L.divIcon({
    className: 'custom-sensor-icon',
    html: `
      <div class="relative group">
        <div class="w-4 h-4 rounded-full border-2 border-white" 
             style="background-color: ${colors[type] || '#757575'}">
          <div class="absolute w-2 h-2 bg-white rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-ping"></div>
        </div>
        <div class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 
                    rounded shadow-md text-xs font-medium opacity-0 group-hover:opacity-100 
                    transition-opacity whitespace-nowrap z-50">
          Capteur ${type}
        </div>
      </div>
    `,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
};

// Fire Extinguisher Icon
export const createExtinguisherIcon = () => {
  return L.divIcon({
    className: 'custom-extinguisher-icon',
    html: `
      <div class="relative group">
        <div class="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center border-2 border-white">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M17.66 11.2c-.23-.3-.51-.56-.77-.82-.67-.6-1.43-1.03-2.07-1.66C13.33 7.26 13 4.85 13.95 3c-.95.23-1.78.75-2.49 1.32-2.59 2.08-3.61 5.75-2.39 8.9.04.1.08.2.08.33 0 .22-.15.42-.35.5-.23.1-.47.04-.66-.12a.58.58 0 0 1-.14-.17c-1.13-1.43-1.31-3.48-.55-5.12C5.78 10 4.87 12.3 5 14.47c.06.5.12 1 .29 1.5.14.6.41 1.2.71 1.73 1.08 1.73 2.95 2.97 4.96 3.22 2.14.27 4.43-.12 6.07-1.6 1.83-1.66 2.47-4.32 1.53-6.6l-.13-.26c-.21-.46-.77-1.26-.77-1.26m-3.16 6.3c-.28.24-.74.5-1.1.6-1.12.4-2.24-.16-2.9-.82 1.19-.28 1.9-1.16 2.11-2.05.17-.8-.15-1.46-.28-2.23-.12-.74-.1-1.37.17-2.06.19.38.39.76.63 1.06.77 1 1.98 1.44 2.24 2.8.04.14.06.28.06.43.03.82-.33 1.72-.93 2.27z"/>
          </svg>
        </div>
        <div class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 
                    rounded shadow-md text-xs font-medium opacity-0 group-hover:opacity-100 
                    transition-opacity whitespace-nowrap z-50">
          Extincteur
        </div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

// Exit Icon
export const createExitIcon = () => {
  return L.divIcon({
    className: 'custom-exit-icon',
    html: `
      <div class="relative group">
        <div class="w-8 h-8 bg-green-500 rounded flex items-center justify-center border-2 border-white">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5a2 2 0 00-2 2v4h2V5h14v14H5v-4H3v4a2 2 0 002 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
          </svg>
        </div>
        <div class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 
                    rounded shadow-md text-xs font-medium opacity-0 group-hover:opacity-100 
                    transition-opacity whitespace-nowrap z-50">
          Sortie de Secours
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};