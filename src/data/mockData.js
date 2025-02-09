export const sensorData = {
  temperature: [
    { id: 'temp1', zone: 'Zone A', value: 65, status: 'critical' },
    { id: 'temp2', zone: 'Zone B', value: 45, status: 'normal' },
    { id: 'temp3', zone: 'Zone C', value: 52, status: 'warning' }
  ],
  smoke: [
    { id: 'smoke1', zone: 'Zone A', value: 'Detected', status: 'warning' },
    { id: 'smoke2', zone: 'Zone B', value: 'Clear', status: 'normal' }
  ],
  gas: [
    { id: 'gas1', zone: 'Zone A', value: '15 ppm', status: 'warning' },
    { id: 'gas2', zone: 'Zone B', value: '5 ppm', status: 'normal' }
  ]
};

export const fireSuppressionSystems = [
  {
    id: 1,
    zone: 'Zone A',
    type: 'Foam',
    status: 'Ready',
    lastMaintenance: '2024-01-15'
  },
  {
    id: 2,
    zone: 'Zone B',
    type: 'CO2',
    status: 'Ready',
    lastMaintenance: '2024-01-20'
  }
];

export const evacuationRoutes = [
  {
    id: 1,
    name: 'Route A',
    from: 'Zone A',
    to: 'Emergency Exit 1',
    status: 'Clear'
  },
  {
    id: 2,
    name: 'Route B',
    from: 'Zone B',
    to: 'Emergency Exit 2',
    status: 'Clear'
  }
];

export const alerts = [
  {
    id: 1,
    type: 'Temperature',
    severity: 'High',
    location: 'Zone A',
    timestamp: '2024-02-09T10:15:00',
    description: 'Temperature exceeds threshold (75°C)',
    status: 'Active'
  },
  {
    id: 2,
    type: 'Smoke',
    severity: 'Medium',
    location: 'Zone B',
    timestamp: '2024-02-09T10:14:30',
    description: 'Smoke detected',
    status: 'Active'
  }
];