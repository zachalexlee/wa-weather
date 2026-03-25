'use client';

import { type CurrentWeather, type HourlyForecast, formatTemp } from '@/lib/weather';

interface Props {
  current: CurrentWeather;
  hourly: HourlyForecast[];
  cityName: string;
  theme: 'light' | 'dark';
}

export default function WeatherSummary({ current, hourly, cityName, theme }: Props) {
  const summary = generateSummary(current, hourly);
  const feelsLikeDiff = Math.round(current.feels_like - current.temp);

  return (
    <div className={`backdrop-blur-md rounded-2xl border p-6 ${
      theme === 'dark' 
        ? 'bg-gradient-to-r from-blue-600/40 to-indigo-600/40 border-white/20' 
        : 'bg-gradient-to-r from-blue-400/60 to-indigo-400/60 border-blue-300'
    }`}>
      <div className="flex items-start justify-between gap-6">
        {/* Summary Text */}
        <div className="flex-1">
          <h2 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-blue-900'}`}>
            {cityName} Weather Summary
          </h2>
          <p className={`text-xl ${theme === 'dark' ? 'text-blue-100' : 'text-blue-900'} mb-3`}>
            {summary}
          </p>
          
          {/* Feels Like Prominent */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
            theme === 'dark' ? 'bg-white/20' : 'bg-white/60'
          }`}>
            <span className="text-2xl">🌡️</span>
            <div>
              <span className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-blue-900'}`}>
                Feels like {formatTemp(current.feels_like)}
              </span>
              {feelsLikeDiff !== 0 && (
                <span className={`ml-2 text-sm ${theme === 'dark' ? 'text-blue-200' : 'text-blue-700'}`}>
                  ({feelsLikeDiff > 0 ? '+' : ''}{feelsLikeDiff}° from actual)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Current Temp - Large Display */}
        <div className="text-center">
          <div className={`text-7xl font-bold ${theme === 'dark' ? 'text-white' : 'text-blue-900'}`}>
            {formatTemp(current.temp)}
          </div>
          <p className={`text-lg capitalize mt-2 ${theme === 'dark' ? 'text-blue-200' : 'text-blue-700'}`}>
            {current.description}
          </p>
        </div>
      </div>
    </div>
  );
}

function generateSummary(current: CurrentWeather, hourly: HourlyForecast[]): string {
  const now = Date.now() / 1000;
  const next6Hours = hourly.slice(0, 6);
  const next12Hours = hourly.slice(0, 12);
  
  // Check for rain/snow in next few hours
  const rainSoon = next6Hours.some(h => h.pop > 0.4);
  const heavyRainSoon = next6Hours.some(h => h.pop > 0.7);
  const rainLater = next12Hours.slice(6).some(h => h.pop > 0.4);
  
  // Temperature trend
  const tempTrend = next6Hours.length > 0 
    ? next6Hours[next6Hours.length - 1].temp - current.temp 
    : 0;
  
  // Build summary
  const parts: string[] = [];
  
  // Current condition
  if (current.description.includes('clear')) {
    parts.push('Clear skies');
  } else if (current.description.includes('cloud')) {
    parts.push(current.description.includes('partly') ? 'Partly cloudy' : 'Cloudy');
  } else if (current.description.includes('rain')) {
    parts.push('Rainy conditions');
  } else if (current.description.includes('snow')) {
    parts.push('Snowy conditions');
  } else {
    parts.push(current.description.charAt(0).toUpperCase() + current.description.slice(1));
  }
  
  // Add precipitation forecast
  if (heavyRainSoon) {
    parts.push('heavy rain expected soon');
  } else if (rainSoon) {
    parts.push('rain expected within the next few hours');
  } else if (rainLater) {
    parts.push('rain expected later today');
  } else {
    parts.push('no rain expected');
  }
  
  // Add temperature trend
  if (Math.abs(tempTrend) > 5) {
    if (tempTrend > 0) {
      parts.push(`warming to ${formatTemp(current.temp + tempTrend)}`);
    } else {
      parts.push(`cooling to ${formatTemp(current.temp + tempTrend)}`);
    }
  }
  
  // Add air quality if poor
  if (current.aqi && current.aqi > 100) {
    parts.push(`⚠️ ${current.aqi_label?.toLowerCase()} air quality`);
  }
  
  return parts.join(', ') + '.';
}
