// src/components/icons/FactoryIcons.jsx
import L from 'leaflet';

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