// Major Washington State Mountain Passes with coordinates

export interface MountainPass {
  name: string;
  lat: number;
  lon: number;
  elevation: number; // feet
  highway: string;
  description: string;
}

export const waMountainPasses: MountainPass[] = [
  {
    name: 'Snoqualmie Pass',
    lat: 47.4244,
    lon: -121.4135,
    elevation: 3022,
    highway: 'I-90',
    description: 'Main route between Seattle and Eastern Washington'
  },
  {
    name: 'Stevens Pass',
    lat: 47.7453,
    lon: -121.0892,
    elevation: 4061,
    highway: 'US-2',
    description: 'Popular ski area, connects Puget Sound to Wenatchee'
  },
  {
    name: 'White Pass',
    lat: 46.6392,
    lon: -121.3906,
    elevation: 4500,
    highway: 'US-12',
    description: 'Southern Cascade crossing'
  },
  {
    name: 'Blewett Pass',
    lat: 47.3481,
    lon: -120.6144,
    elevation: 4102,
    highway: 'US-97',
    description: 'Alternate route to Wenatchee'
  },
  {
    name: 'Chinook Pass',
    lat: 46.8747,
    lon: -121.5181,
    elevation: 5432,
    highway: 'SR-410',
    description: 'Seasonal route through Mount Rainier area (closed in winter)'
  }
];

export function getPassCondition(temp: number, snowDepth: number): {
  status: 'open' | 'chains-required' | 'chains-advised' | 'difficult' | 'closed';
  statusText: string;
  icon: string;
  color: string;
} {
  // Estimate snow depth from temperature (rough approximation)
  const estimatedSnow = temp < 32 ? (32 - temp) * 2 : 0;
  const totalSnow = snowDepth + estimatedSnow;

  if (temp < 20 || totalSnow > 24) {
    return {
      status: 'closed',
      statusText: 'CLOSED',
      icon: '🚫',
      color: '#dc2626'
    };
  }

  if (temp < 28 || totalSnow > 12) {
    return {
      status: 'chains-required',
      statusText: 'Chains Required',
      icon: '⛓️',
      color: '#ea580c'
    };
  }

  if (temp < 35 || totalSnow > 4) {
    return {
      status: 'chains-advised',
      statusText: 'Chains Advised',
      icon: '⚠️',
      color: '#eab308'
    };
  }

  if (temp < 40) {
    return {
      status: 'difficult',
      statusText: 'Difficult Conditions',
      icon: '🌨️',
      color: '#3b82f6'
    };
  }

  return {
    status: 'open',
    statusText: 'Open - Good Conditions',
    icon: '✅',
    color: '#16a34a'
  };
}
