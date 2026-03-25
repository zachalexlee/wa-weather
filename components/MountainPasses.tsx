'use client';

import { useEffect, useState } from 'react';
import { waMountainPasses, getPassCondition, type MountainPass } from '@/lib/wa-mountain-passes';

interface Props {
  theme: 'light' | 'dark';
}

interface PassWeather {
  pass: MountainPass;
  temp: number;
  condition: string;
  windSpeed: number;
  snowDepth: number;
}

export default function MountainPasses({ theme }: Props) {
  const [passData, setPassData] = useState<PassWeather[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    async function fetchPassWeather() {
      try {
        const weatherPromises = waMountainPasses.map(async (pass) => {
          const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${pass.lat}&longitude=${pass.lon}&current=temperature_2m,weather_code,wind_speed_10m&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto`
          );
          
          if (response.ok) {
            const data = await response.json();
            return {
              pass,
              temp: data.current?.temperature_2m || 40,
              condition: weatherCodeToCondition(data.current?.weather_code || 0),
              windSpeed: data.current?.wind_speed_10m || 0,
              snowDepth: 0 // Would need specialized API for actual snow depth
            };
          }
          
          return null;
        });

        const results = await Promise.all(weatherPromises);
        setPassData(results.filter((r): r is PassWeather => r !== null));
      } catch (error) {
        console.error('Failed to fetch pass weather:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPassWeather();
    // Refresh every hour
    const interval = setInterval(fetchPassWeather, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className={`backdrop-blur-md rounded-2xl border p-6 ${
        theme === 'dark' ? 'bg-white/10 border-white/20' : 'bg-white/90 border-blue-300'
      }`}>
        <div className={`text-center ${theme === 'dark' ? 'text-blue-200' : 'text-blue-700'}`}>
          Loading mountain pass conditions...
        </div>
      </div>
    );
  }

  const textPrimary = theme === 'dark' ? 'text-white' : 'text-blue-900';
  const textSecondary = theme === 'dark' ? 'text-blue-200' : 'text-blue-700';

  return (
    <div className={`backdrop-blur-md rounded-2xl border p-6 ${
      theme === 'dark' ? 'bg-white/10 border-white/20' : 'bg-white/90 border-blue-300'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-2xl font-bold ${textPrimary}`}>
          🏔️ Mountain Pass Conditions
        </h3>
        <button
          onClick={() => setExpanded(!expanded)}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            theme === 'dark'
              ? 'bg-white/10 hover:bg-white/20 text-white'
              : 'bg-blue-100 hover:bg-blue-200 text-blue-900'
          }`}
        >
          {expanded ? 'Show Less' : 'Show All'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {passData.slice(0, expanded ? passData.length : 3).map((data) => {
          const condition = getPassCondition(data.temp, data.snowDepth);
          
          return (
            <PassCard
              key={data.pass.name}
              data={data}
              condition={condition}
              theme={theme}
            />
          );
        })}
      </div>

      <div className={`mt-4 text-sm ${textSecondary}`}>
        <p className="mb-2">
          <strong>Note:</strong> Conditions shown are estimates based on current weather. 
          Always check official WSDOT reports before traveling.
        </p>
        <a
          href="https://wsdot.wa.gov/travel/real-time/mountainpasses"
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-1 font-medium hover:underline ${
            theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
          }`}
        >
          → Official WSDOT Mountain Pass Reports
        </a>
      </div>
    </div>
  );
}

function PassCard({ data, condition, theme }: {
  data: PassWeather;
  condition: ReturnType<typeof getPassCondition>;
  theme: 'light' | 'dark';
}) {
  const bgClass = theme === 'dark' ? 'bg-white/5 hover:bg-white/10' : 'bg-white/70 hover:bg-white';
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const textSecondary = theme === 'dark' ? 'text-blue-200' : 'text-gray-600';

  return (
    <div className={`${bgClass} rounded-xl p-4 border ${
      theme === 'dark' ? 'border-white/10' : 'border-blue-200'
    } transition-all duration-200 hover:scale-[1.02]`}>
      {/* Pass Name & Highway */}
      <div className="mb-3">
        <h4 className={`text-lg font-bold ${textPrimary}`}>
          {data.pass.name}
        </h4>
        <p className={`text-sm ${textSecondary}`}>
          {data.pass.highway} • {data.pass.elevation.toLocaleString()}' elevation
        </p>
      </div>

      {/* Status Badge */}
      <div
        className="inline-flex items-center gap-2 px-3 py-1 rounded-lg font-bold text-white text-sm mb-3"
        style={{ backgroundColor: condition.color }}
      >
        <span>{condition.icon}</span>
        <span>{condition.statusText}</span>
      </div>

      {/* Weather Details */}
      <div className={`space-y-1 text-sm ${textSecondary}`}>
        <div className="flex items-center justify-between">
          <span>🌡️ Temperature</span>
          <span className="font-bold">{Math.round(data.temp)}°F</span>
        </div>
        <div className="flex items-center justify-between">
          <span>🌤️ Conditions</span>
          <span className="font-bold">{data.condition}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>💨 Wind</span>
          <span className="font-bold">{Math.round(data.windSpeed)} mph</span>
        </div>
      </div>

      {/* Tips */}
      {condition.status !== 'open' && (
        <div className={`mt-3 p-2 rounded text-xs ${
          theme === 'dark' ? 'bg-black/30 text-yellow-200' : 'bg-yellow-50 text-yellow-900'
        }`}>
          {condition.status === 'closed' && '❌ Pass currently closed to travel'}
          {condition.status === 'chains-required' && '⛓️ Chains required - carry chains'}
          {condition.status === 'chains-advised' && '⚠️ Chains advised - be prepared'}
          {condition.status === 'difficult' && '🌨️ Drive with caution'}
        </div>
      )}
    </div>
  );
}

function weatherCodeToCondition(code: number): string {
  if (code === 0) return 'Clear';
  if (code <= 3) return 'Cloudy';
  if (code >= 45 && code <= 48) return 'Fog';
  if (code >= 51 && code <= 67) return 'Rain/Sleet';
  if (code >= 71 && code <= 77) return 'Snow';
  if (code >= 80 && code <= 82) return 'Rain Showers';
  if (code >= 85 && code <= 86) return 'Snow Showers';
  if (code >= 95) return 'Thunderstorm';
  return 'Variable';
}
