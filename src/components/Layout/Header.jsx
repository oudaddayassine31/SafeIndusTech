import React from 'react';
import { Factory } from 'lucide-react';

export const Header = () => {
  return (
    <header className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Factory className="h-8 w-8 text-red-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">SafeIndusTech</h1>
              <p className="text-sm text-gray-500">Industrial Fire Safety Management</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
              System Active
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};