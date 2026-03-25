'use client';

import { useEffect, useState } from 'react';
import { formatTemp } from '@/lib/weather';

interface Props {
  currentTemp: number;
  currentHigh: number;
  currentLow: number;
  lat: number;
  lon: number;
  theme: 'light' | 'dark';
}

interface YesterdayData {
  temp: number;
  high: number;
  low: number;
}

export default function YesterdayComparison({ currentTemp, currentHigh, currentLow, lat, lon, theme }: Props) {
  const [yesterday, setYesterday] = useState<YesterdayData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchYesterdayWeather() {
      try {
        // Calculate yesterday's date
        const yesterdayDate = new Date();
        yesterdayDate.setDate(yesterdayDate.getDate() - 1);
        const dateStr = yesterdayDate.toISOString().split('T')[0];

        // Fetch yesterday's weather from Open-Meteo
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&start_date=${dateStr}&end_date=${dateStr}&daily=temperature_2m_max,temperature_2m_min,temperature_2m_mean&temperature_unit=fahrenheit&timezone=auto`
        );

        if (response.ok) {
          const data = await response.json();
          if (data.daily) {
            setYesterday({
              temp: data.daily.temperature_2m_mean?.[0] || currentTemp,
              high: data.daily.temperature_2m_max?.[0] || currentHigh,
              low: data.daily.temperature_2m_min?.[0] || currentLow
            });
          }
        }
      } catch (error) {
        console.error('Failed to fetch yesterday weather:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchYesterdayWeather();
  }, [lat, lon, currentTemp, currentHigh, currentLow]);

  if (loading || !yesterday) return null;

  const tempDiff = Math.round(currentTemp - yesterday.temp);
  const highDiff = Math.round(currentHigh - yesterday.high);
  const lowDiff = Math.round(currentLow - yesterday.low);

  // Don't show if differences are negligible
  if (Math.abs(tempDiff) < 2 && Math.abs(highDiff) < 2 && Math.abs(lowDiff) < 2) {
    return null;
  }

  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const textSecondary = theme === 'dark' ? 'text-blue-200' : 'text-blue-700';
  const bgClass = theme === 'dark' ? 'bg-white/10' : 'bg-white/90';

  return (
    <div className={`${bgClass} backdrop-blur-md rounded-xl border ${
      theme === 'dark' ? 'border-white/20' : 'border-blue-300'
    } p-4`}>
      <h3 className={`text-lg font-bold mb-3 ${textPrimary} flex items-center gap-2`}>
        📊 Yesterday vs Today
      </h3>

      <div className="grid grid-cols-3 gap-4">
        <ComparisonCard
          label="Current"
          today={currentTemp}
          yesterday={yesterday.temp}
          diff={tempDiff}
          theme={theme}
        />
        <ComparisonCard
          label="High"
          today={currentHigh}
          yesterday={yesterday.high}
          diff={highDiff}
          theme={theme}
        />
        <ComparisonCard
          label="Low"
          today={currentLow}
          yesterday={yesterday.low}
          diff={lowDiff}
          theme={theme}
        />
      </div>

      {/* Summary */}
      <div className={`mt-3 text-center text-sm ${textSecondary}`}>
        {Math.abs(tempDiff) >= 5 ? (
          <span className="font-bold">
            {tempDiff > 0 ? `🔥 ${Math.abs(tempDiff)}° warmer` : `❄️ ${Math.abs(tempDiff)}° colder`} than yesterday
          </span>
        ) : (
          <span>Similar to yesterday</span>
        )}
      </div>
    </div>
  );
}

function ComparisonCard({ 
  label, 
  today, 
  yesterday, 
  diff, 
  theme 
}: { 
  label: string; 
  today: number; 
  yesterday: number; 
  diff: number;
  theme: 'light' | 'dark';
}) {
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const textSecondary = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';

  const getDiffColor = () => {
    if (diff === 0) return textSecondary;
    if (diff > 0) return 'text-red-500';
    return 'text-blue-500';
  };

  const getDiffIcon = () => {
    if (diff > 2) return '🔺';
    if (diff < -2) return '🔻';
    return '➡️';
  };

  return (
    <div className={`text-center p-3 rounded-lg ${
      theme === 'dark' ? 'bg-black/20' : 'bg-white/70'
    }`}>
      <div className={`text-xs font-medium mb-1 ${textSecondary}`}>
        {label}
      </div>
      <div className={`text-2xl font-bold ${textPrimary}`}>
        {formatTemp(today)}
      </div>
      <div className={`text-xs ${textSecondary} mt-1`}>
        was {formatTemp(yesterday)}
      </div>
      {diff !== 0 && (
        <div className={`text-sm font-bold mt-1 ${getDiffColor()}`}>
          {getDiffIcon()} {Math.abs(diff)}°
        </div>
      )}
    </div>
  );
}
