// src/components/AlertOverlay.jsx
import React from 'react';
import { X, AlertTriangle, ArrowRight } from 'lucide-react';
import { useAlert } from '../contexts/AlertContext';

export const AlertOverlay = () => {
    const { activeAlert, acknowledgeAlert, goToMap } = useAlert();

    if (!activeAlert) return null;

    return (
        <div className="fixed inset-0 bg-red-500/20 backdrop-blur-sm  flex items-center justify-center" style={{ zIndex: 1000 }}>
        {/*  ^^^ Set z-index inline here.  Higher value than Leaflet's panes. */}
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 relative overflow-hidden">
                {/* Alert header */}
                <div className="bg-red-500 p-4 text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="h-6 w-6" />
                        <h2 className="text-xl font-bold">Critical Alert</h2>
                    </div>
                    <button
                        onClick={() => acknowledgeAlert(activeAlert.id)}
                        className="hover:bg-red-600 p-1 rounded-full transition-colors"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Alert content */}
                <div className="p-6 space-y-4">
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-gray-900">{activeAlert.message}</h3>
                        <div className="text-sm text-gray-600">
                            <p>Zone: {activeAlert.zoneName}</p>
                            <p>Value: {activeAlert.value}</p>
                            <p>Threshold: {activeAlert.threshold}</p>
                            <p className="text-xs mt-1">
                                {new Date(activeAlert.timestamp).toLocaleString()}
                            </p>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-4 mt-6">
                        <button
                            onClick={() => acknowledgeAlert(activeAlert.id)}
                            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg 
                                        hover:bg-red-600 transition-colors"
                        >
                            Acknowledge
                        </button>
                        <button
                            onClick={goToMap}
                            className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg 
                                        hover:bg-gray-900 transition-colors flex items-center 
                                        justify-center gap-2"
                        >
                            View on Map
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Animated border */}
                <div className="absolute inset-0 border-4 border-red-500 animate-pulse pointer-events-none" />
            </div>
        </div>
    );
};