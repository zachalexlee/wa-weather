// Dynamic background gradients based on weather conditions and time of day

export interface WeatherBackground {
  gradient: string;
  description: string;
}

export function getWeatherBackground(
  condition: string,
  theme: 'light' | 'dark',
  isNight: boolean = false
): WeatherBackground {
  const normalizedCondition = condition.toLowerCase();

  // Night backgrounds
  if (isNight) {
    if (normalizedCondition.includes('clear')) {
      return {
        gradient: theme === 'dark'
          ? 'bg-gradient-to-br from-indigo-950 via-blue-950 to-slate-900'
          : 'bg-gradient-to-br from-indigo-200 via-blue-300 to-slate-400',
        description: 'Clear Night Sky'
      };
    }
    if (normalizedCondition.includes('rain') || normalizedCondition.includes('storm')) {
      return {
        gradient: theme === 'dark'
          ? 'bg-gradient-to-br from-slate-900 via-gray-900 to-blue-950'
          : 'bg-gradient-to-br from-slate-400 via-gray-400 to-blue-400',
        description: 'Rainy Night'
      };
    }
    // Default night
    return {
      gradient: theme === 'dark'
        ? 'bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950'
        : 'bg-gradient-to-br from-slate-300 via-blue-400 to-indigo-400',
      description: 'Night Sky'
    };
  }

  // Day backgrounds - Rain/Storm
  if (normalizedCondition.includes('rain') || normalizedCondition.includes('drizzle')) {
    return {
      gradient: theme === 'dark'
        ? 'bg-gradient-to-br from-slate-700 via-gray-700 to-blue-800'
        : 'bg-gradient-to-br from-slate-300 via-gray-300 to-blue-400',
      description: 'Rainy Day'
    };
  }

  if (normalizedCondition.includes('thunder') || normalizedCondition.includes('storm')) {
    return {
      gradient: theme === 'dark'
        ? 'bg-gradient-to-br from-slate-900 via-gray-800 to-purple-900'
        : 'bg-gradient-to-br from-slate-400 via-gray-400 to-purple-500',
      description: 'Stormy Weather'
    };
  }

  // Snow
  if (normalizedCondition.includes('snow')) {
    return {
      gradient: theme === 'dark'
        ? 'bg-gradient-to-br from-slate-600 via-blue-700 to-cyan-800'
        : 'bg-gradient-to-br from-slate-100 via-blue-100 to-cyan-100',
      description: 'Snowy Day'
    };
  }

  // Fog/Mist
  if (normalizedCondition.includes('fog') || normalizedCondition.includes('mist') || normalizedCondition.includes('haze')) {
    return {
      gradient: theme === 'dark'
        ? 'bg-gradient-to-br from-slate-700 via-gray-700 to-slate-800'
        : 'bg-gradient-to-br from-slate-200 via-gray-200 to-slate-300',
      description: 'Foggy Conditions'
    };
  }

  // Cloudy
  if (normalizedCondition.includes('cloud') || normalizedCondition.includes('overcast')) {
    return {
      gradient: theme === 'dark'
        ? 'bg-gradient-to-br from-slate-700 via-blue-800 to-gray-800'
        : 'bg-gradient-to-br from-slate-200 via-blue-200 to-gray-300',
      description: 'Cloudy Day'
    };
  }

  // Clear/Sunny (default)
  return {
    gradient: theme === 'dark'
      ? 'bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900'
      : 'bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300',
    description: 'Clear Sky'
  };
}

export function isNightTime(sunrise: number, sunset: number): boolean {
  const now = Date.now() / 1000;
  return now < sunrise || now > sunset;
}
