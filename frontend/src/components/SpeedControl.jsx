// src/components/SpeedControl.jsx
import React from 'react';
import { FastForward, Pause, Play } from 'lucide-react';

export const SpeedControl = ({ 
  speed, 
  setSpeed,
  isPlaying,
  setIsPlaying
}) => {
  const speeds = [1, 2, 4]; // Speed multipliers

  return (
    <div className="absolute bottom-24 left-4 bg-white p-2 rounded-lg shadow-lg z-[1000] flex items-center gap-2">
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="p-2 hover:bg-gray-100 rounded-full"
        title={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? (
          <Pause className="w-5 h-5" />
        ) : (
          <Play className="w-5 h-5" />
        )}
      </button>

      <div className="h-6 w-px bg-gray-200" /> {/* Divider */}

      {speeds.map((s) => (
        <button
          key={s}
          onClick={() => setSpeed(s)}
          className={`p-2 rounded-full ${
            speed === s 
              ? 'bg-blue-100 text-blue-600' 
              : 'hover:bg-gray-100'
          }`}
          title={`${s}x Speed`}
        >
          <FastForward 
            className={`w-4 h-4 ${s > 1 ? 'scale-x-125' : ''}`} 
            style={{ transform: s > 2 ? 'scaleX(1.5)' : undefined }}
          />
          {s > 2 && <span className="ml-1 text-sm">{s}x</span>}
        </button>
      ))}
    </div>
  );
};