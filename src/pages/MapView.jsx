// src/pages/MapView.jsx
import React from 'react';
import { FactoryMap } from '../components/FactoryMap';

export const MapView = () => {
  return (
    <div className="h-full p-4">
      <div className="bg-white rounded-lg shadow-sm p-4 h-[calc(100vh-6rem)]">
        <h2 className="text-lg font-semibold mb-4">Factory Layout</h2>
        <div className="h-[calc(100%-3rem)]">
          <FactoryMap />
        </div>
      </div>
    </div>
  );
};