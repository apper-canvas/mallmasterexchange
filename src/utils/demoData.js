// Mock data for visitor analytics

// Visitor metrics
export const visitorMetrics = {
  totalVisitors: 5246,
  averageDwellTime: 45,
  peakHourVisitors: 728,
  conversionRate: 32.5
};

// Visitor demographics data
export const demographicData = {
  age: [
    { range: '18-24', percentage: 22.5 },
    { range: '25-34', percentage: 35.8 },
    { range: '35-44', percentage: 21.2 },
    { range: '45-54', percentage: 12.3 },
    { range: '55+', percentage: 8.2 }
  ],
  gender: [
    { type: 'Female', percentage: 56.2 },
    { type: 'Male', percentage: 42.6 },
    { type: 'Other', percentage: 1.2 }
  ],
  location: [
    { area: 'Local (< 5 miles)', percentage: 42.5 },
    { area: 'Nearby (5-15 miles)', percentage: 28.3 },
    { area: 'Regional (16-30 miles)', percentage: 18.7 },
    { area: 'Distant (> 30 miles)', percentage: 10.5 }
  ]
};

// Heatmap data points
export const heatmapData = [
  // Floor 1 data points
  { x: 100, y: 100, intensity: 85, floor: '1' },
  { x: 150, y: 120, intensity: 92, floor: '1' },
  { x: 200, y: 150, intensity: 75, floor: '1' },
  { x: 250, y: 180, intensity: 65, floor: '1' },
  { x: 300, y: 200, intensity: 60, floor: '1' },
  { x: 350, y: 220, intensity: 72, floor: '1' },
  { x: 400, y: 250, intensity: 95, floor: '1' },
  { x: 450, y: 280, intensity: 88, floor: '1' },
  { x: 500, y: 300, intensity: 45, floor: '1' },
  { x: 550, y: 320, intensity: 55, floor: '1' },
  { x: 600, y: 350, intensity: 62, floor: '1' },
  { x: 650, y: 380, intensity: 70, floor: '1' },
  { x: 700, y: 400, intensity: 58, floor: '1' },
  { x: 120, y: 180, intensity: 80, floor: '1' },
  { x: 170, y: 210, intensity: 68, floor: '1' },
  { x: 220, y: 240, intensity: 75, floor: '1' },
  { x: 270, y: 270, intensity: 82, floor: '1' },
  { x: 320, y: 300, intensity: 90, floor: '1' },
  { x: 370, y: 330, intensity: 95, floor: '1' },
  { x: 420, y: 360, intensity: 85, floor: '1' },
  
  // Floor 2 data points
  { x: 100, y: 100, intensity: 70, floor: '2' },
  { x: 150, y: 120, intensity: 78, floor: '2' },
  { x: 200, y: 150, intensity: 65, floor: '2' },
  { x: 250, y: 180, intensity: 55, floor: '2' },
  { x: 300, y: 200, intensity: 50, floor: '2' },
  { x: 350, y: 220, intensity: 62, floor: '2' },
  { x: 400, y: 250, intensity: 85, floor: '2' },
  { x: 450, y: 280, intensity: 75, floor: '2' },
  { x: 500, y: 300, intensity: 40, floor: '2' },
  { x: 550, y: 320, intensity: 45, floor: '2' },
  { x: 600, y: 350, intensity: 52, floor: '2' },
  { x: 650, y: 380, intensity: 58, floor: '2' },
  { x: 700, y: 400, intensity: 48, floor: '2' },
  { x: 120, y: 180, intensity: 70, floor: '2' },
  { x: 170, y: 210, intensity: 58, floor: '2' },
  
  // Floor 3 data points
  { x: 100, y: 100, intensity: 55, floor: '3' },
  { x: 150, y: 120, intensity: 62, floor: '3' },
  { x: 200, y: 150, intensity: 50, floor: '3' },
  { x: 250, y: 180, intensity: 42, floor: '3' },
  { x: 300, y: 200, intensity: 38, floor: '3' },
  { x: 350, y: 220, intensity: 45, floor: '3' },
  { x: 400, y: 250, intensity: 65, floor: '3' },
  { x: 450, y: 280, intensity: 58, floor: '3' },
  { x: 500, y: 300, intensity: 32, floor: '3' },
  { x: 550, y: 320, intensity: 35, floor: '3' }
];

// Dwell time data
export const dwellTimeData = {
  areas: [
    'Food Court', 
    'Fashion Wing', 
    'Electronics', 
    'Home Goods', 
    'Anchor Store', 
    'Kids Zone', 
    'Entertainment', 
    'Luxury Retail'
  ],
  values: [
    68,  // Food Court
    41,  // Fashion Wing
    35,  // Electronics
    28,  // Home Goods
    52,  // Anchor Store
    45,  // Kids Zone
    72,  // Entertainment
    38   // Luxury Retail
  ]
};