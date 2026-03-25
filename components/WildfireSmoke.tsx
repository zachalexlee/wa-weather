'use client';

import { useEffect, useState } from 'react';

interface Props {
  lat: number;
  lon: number;
  cityName: string;
  theme: 'light' | 'dark';
}

interface SmokeData {
  aqi: number;
  pm25: number;
  pm10: number;
  smokeForecast: 'none' | 'light' | 'moderate' | 'heavy' | 'hazardous';
  description: string;
}

export default function WildfireSmoke({ lat, lon, cityName, theme }: Props) {
  const [smokeData, setSmokeData] = useState<SmokeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSmokeData() {
      try {
        // Fetch air quality data from Open-Meteo
        const response = await fetch(
          `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm10,pm2_5&timezone=auto`
        );
        
        if (response.ok) {
          const data = await response.json();
          const aqi = data.current?.us_aqi || 0;
          const pm25 = data.current?.pm2_5 || 0;
          const pm10 = data.current?.pm10 || 0;
          
          // Determine smoke level based on PM2.5 and PM10
          let smokeForecast: SmokeData['smokeForecast'] = 'none';
          let description = 'No wildfire smoke detected. Air quality is good.';
          
          if (pm25 > 250 || pm10 > 350) {
            smokeForecast = 'hazardous';
            description = '⚠️ HAZARDOUS smoke levels! Avoid all outdoor activities. Wildfire smoke is creating dangerous air quality.';
          } else if (pm25 > 150 || pm10 > 250) {
            smokeForecast = 'heavy';
            description = '🔴 Heavy smoke present. Everyone should avoid prolonged outdoor activities. Wildfire smoke significantly impacting air quality.';
          } else if (pm25 > 55 || pm10 > 150) {
            smokeForecast = 'moderate';
            description = '🟠 Moderate smoke detected. Sensitive groups should limit outdoor exposure. Wildfire smoke may affect air quality.';
          } else if (pm25 > 35 || pm10 > 50) {
            smokeForecast = 'light';
            description = '🟡 Light smoke in the area. Air quality slightly reduced. Monitor conditions if sensitive to smoke.';
          }
          
          setSmokeData({
            aqi,
            pm25,
            pm10,
            smokeForecast,
            description
          });
        }
      } catch (error) {
        console.error('Failed to fetch smoke data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSmokeData();
    // Refresh every 30 minutes
    const interval = setInterval(fetchSmokeData, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [lat, lon]);

  if (loading) {
    return (
      <div className={`backdrop-blur-md rounded-2xl border p-6 ${
        theme === 'dark' ? 'bg-white/10 border-white/20' : 'bg-white/90 border-blue-300'
      }`}>
        <div className={`text-center ${theme === 'dark' ? 'text-blue-200' : 'text-blue-700'}`}>
          Loading wildfire smoke data...
        </div>
      </div>
    );
  }

  if (!smokeData) return null;

  // Only show if there's smoke or poor air quality
  if (smokeData.smokeForecast === 'none' && smokeData.aqi <= 50) {
    return null;
  }

  const bgColor = getSmokeBackgroundColor(smokeData.smokeForecast, theme);
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const textSecondary = theme === 'dark' ? 'text-gray-200' : 'text-gray-700';

  return (
    <div className={`backdrop-blur-md rounded-2xl border-2 p-6 ${bgColor}`}>
      <div className="flex items-start gap-4">
        <div className="text-5xl">
          {smokeData.smokeForecast === 'hazardous' && '🔥'}
          {smokeData.smokeForecast === 'heavy' && '🌫️'}
          {smokeData.smokeForecast === 'moderate' && '💨'}
          {smokeData.smokeForecast === 'light' && '🌤️'}
        </div>

        <div className="flex-1">
          <h3 className={`text-2xl font-bold mb-2 ${textPrimary}`}>
            🔥 Wildfire Smoke Tracker - {cityName}
          </h3>
          
          <p className={`text-lg mb-4 ${textPrimary}`}>
            {smokeData.description}
          </p>

          {/* Air Quality Metrics */}
          <div className="grid grid-cols-3 gap-4">
            <MetricCard
              label="US AQI"
              value={smokeData.aqi.toFixed(0)}
              unit=""
              theme={theme}
              color={getAQIColor(smokeData.aqi)}
            />
            <MetricCard
              label="PM2.5"
              value={smokeData.pm25.toFixed(1)}
              unit="µg/m³"
              theme={theme}
            />
            <MetricCard
              label="PM10"
              value={smokeData.pm10.toFixed(1)}
              unit="µg/m³"
              theme={theme}
            />
          </div>

          {/* Recommendations */}
          {smokeData.smokeForecast !== 'none' && (
            <div className={`mt-4 p-4 rounded-lg ${
              theme === 'dark' ? 'bg-black/30' : 'bg-white/70'
            }`}>
              <h4 className={`font-bold mb-2 ${textPrimary}`}>
                ℹ️ Recommendations:
              </h4>
              <ul className={`list-disc list-inside space-y-1 text-sm ${textSecondary}`}>
                {getSmokeRecommendations(smokeData.smokeForecast).map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, unit, theme, color }: { 
  label: string; 
  value: string; 
  unit: string; 
  theme: 'light' | 'dark';
  color?: string;
}) {
  const bgClass = theme === 'dark' ? 'bg-white/10' : 'bg-white/90';
  const textClass = theme === 'dark' ? 'text-white' : 'text-gray-900';
  
  return (
    <div className={`${bgClass} rounded-lg p-3 text-center`}>
      <div className={`text-xs font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
        {label}
      </div>
      <div className={`text-2xl font-bold ${textClass}`} style={color ? { color } : undefined}>
        {value}
      </div>
      {unit && (
        <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          {unit}
        </div>
      )}
    </div>
  );
}

function getSmokeBackgroundColor(level: SmokeData['smokeForecast'], theme: 'light' | 'dark'): string {
  if (theme === 'dark') {
    switch (level) {
      case 'hazardous': return 'bg-red-900/40 border-red-500/50';
      case 'heavy': return 'bg-orange-900/40 border-orange-500/50';
      case 'moderate': return 'bg-yellow-900/40 border-yellow-500/50';
      case 'light': return 'bg-blue-900/40 border-blue-500/50';
      default: return 'bg-white/10 border-white/20';
    }
  } else {
    switch (level) {
      case 'hazardous': return 'bg-red-100 border-red-400';
      case 'heavy': return 'bg-orange-100 border-orange-400';
      case 'moderate': return 'bg-yellow-100 border-yellow-400';
      case 'light': return 'bg-blue-100 border-blue-400';
      default: return 'bg-white/90 border-blue-300';
    }
  }
}

function getAQIColor(aqi: number): string {
  if (aqi <= 50) return '#00e400';
  if (aqi <= 100) return '#ffff00';
  if (aqi <= 150) return '#ff7e00';
  if (aqi <= 200) return '#ff0000';
  if (aqi <= 300) return '#8f3f97';
  return '#7e0023';
}

function getSmokeRecommendations(level: SmokeData['smokeForecast']): string[] {
  switch (level) {
    case 'hazardous':
      return [
        'Stay indoors with windows and doors closed',
        'Use HEPA air filters if available',
        'Avoid all outdoor physical activity',
        'Seek medical attention if experiencing symptoms',
        'Consider evacuating if possible'
      ];
    case 'heavy':
      return [
        'Limit outdoor activities',
        'Close windows and use air filtration',
        'Wear N95 masks if you must go outside',
        'Children, elderly, and those with respiratory conditions should stay indoors',
        'Monitor air quality regularly'
      ];
    case 'moderate':
      return [
        'Sensitive groups should reduce outdoor activities',
        'Close windows during high smoke periods',
        'Consider wearing a mask outdoors',
        'Monitor symptoms (coughing, difficulty breathing)',
        'Keep rescue medications accessible if you have asthma'
      ];
    case 'light':
      return [
        'Sensitive individuals may experience minor irritation',
        'Limit prolonged outdoor exertion',
        'Monitor air quality updates',
        'Close windows if smoke smell becomes noticeable'
      ];
    default:
      return [];
  }
}
