import React from 'react';

export function Card({ className, children, ...props }) {
  return (
    <div
      className={`bg-white rounded-lg shadow ${className || ''}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div
      className={`p-6 border-b border-gray-200 ${className || ''}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }) {
  return (
    <h3
      className={`text-lg font-semibold text-gray-900 ${className || ''}`}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardContent({ className, children, ...props }) {
  return (
    <div
      className={`p-6 ${className || ''}`}
      {...props}
    >
      {children}
    </div>
  );
}