'use client';

import { useState } from 'react';
import { type HourlyForecast, getWeatherIconUrl, formatTemp } from '@/lib/weather';

interface Props {
  forecast: HourlyForecast[];
  theme: 'light' | 'dark';
}

export default function ImprovedHourlyForecast({ forecast, theme }: Props) {
  const [selectedPeriod, setSelectedPeriod] = useState<'next3' | 'morning' | 'afternoon' | 'evening' | 'night' | 'all'>('next3');

  const now = new Date();
  const currentHour = now.getHours();

  // Categorize hours
  const next3Hours = forecast.slice(0, 3);
  const morning = forecast.filter((h, i) => {
    const hour = new Date(h.dt * 1000).getHours();
    return hour >= 6 && hour < 12;
  });
  const afternoon = forecast.filter((h, i) => {
    const hour = new Date(h.dt * 1000).getHours();
    return hour >= 12 && hour < 17;
  });
  const evening = forecast.filter((h, i) => {
    const hour = new Date(h.dt * 1000).getHours();
    return hour >= 17 && hour < 21;
  });
  const night = forecast.filter((h, i) => {
    const hour = new Date(h.dt * 1000).getHours();
    return hour >= 21 || hour < 6;
  });

  const getPeriodData = () => {
    switch (selectedPeriod) {
      case 'next3': return next3Hours;
      case 'morning': return morning;
      case 'afternoon': return afternoon;
      case 'evening': return evening;
      case 'night': return night;
      case 'all': return forecast;
      default: return next3Hours;
    }
  };

  // Find when it will rain
  const rainHour = forecast.find(h => h.pop > 0.3);
  const rainTime = rainHour ? new Date(rainHour.dt * 1000).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }) : null;

  const bgClass = theme === 'dark' ? 'bg-white/10 border-white/20' : 'bg-white/90 border-blue-300';
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-blue-900';
  const textSecondary = theme === 'dark' ? 'text-blue-200' : 'text-blue-700';

  const periodData = getPeriodData();

  return (
    <div className={`backdrop-blur-md rounded-2xl border p-6 ${bgClass}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-2xl font-bold ${textPrimary} flex items-center gap-2`}>
          ⏰ Hourly Forecast
        </h2>
        
        {rainTime && (
          <div className={`px-3 py-1 rounded-lg ${
            theme === 'dark' ? 'bg-blue-600/30 text-blue-200' : 'bg-blue-100 text-blue-900'
          }`}>
            💧 Rain at {rainTime}
          </div>
        )}
      </div>

      {/* Period Selector */}
      <div className="flex flex-wrap gap-2 mb-4">
        <PeriodButton
          label="Next 3 Hours"
          icon="⏱️"
          active={selectedPeriod === 'next3'}
          onClick={() => setSelectedPeriod('next3')}
          theme={theme}
        />
        <PeriodButton
          label="Morning"
          icon="🌅"
          active={selectedPeriod === 'morning'}
          onClick={() => setSelectedPeriod('morning')}
          theme={theme}
          disabled={morning.length === 0}
        />
        <PeriodButton
          label="Afternoon"
          icon="☀️"
          active={selectedPeriod === 'afternoon'}
          onClick={() => setSelectedPeriod('afternoon')}
          theme={theme}
          disabled={afternoon.length === 0}
        />
        <PeriodButton
          label="Evening"
          icon="🌆"
          active={selectedPeriod === 'evening'}
          onClick={() => setSelectedPeriod('evening')}
          theme={theme}
          disabled={evening.length === 0}
        />
        <PeriodButton
          label="Night"
          icon="🌙"
          active={selectedPeriod === 'night'}
          onClick={() => setSelectedPeriod('night')}
          theme={theme}
          disabled={night.length === 0}
        />
        <PeriodButton
          label="All 48 Hours"
          icon="📅"
          active={selectedPeriod === 'all'}
          onClick={() => setSelectedPeriod('all')}
          theme={theme}
        />
      </div>

      {/* Hour Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {periodData.map((hour, index) => (
          <HourCardImproved
            key={hour.dt}
            hour={hour}
            isNow={index === 0 && selectedPeriod === 'next3'}
            theme={theme}
          />
        ))}
      </div>

      {periodData.length === 0 && (
        <div className={`text-center py-8 ${textSecondary}`}>
          No forecast data for this time period
        </div>
      )}
    </div>
  );
}

function PeriodButton({ 
  label, 
  icon, 
  active, 
  onClick, 
  theme,
  disabled = false
}: { 
  label: string; 
  icon: string; 
  active: boolean; 
  onClick: () => void;
  theme: 'light' | 'dark';
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-lg font-medium transition-all ${
        disabled
          ? 'opacity-30 cursor-not-allowed'
          : active
            ? theme === 'dark'
              ? 'bg-blue-600 text-white'
              : 'bg-blue-600 text-white'
            : theme === 'dark'
              ? 'bg-white/10 hover:bg-white/20 text-white'
              : 'bg-blue-100 hover:bg-blue-200 text-blue-900'
      }`}
    >
      {icon} {label}
    </button>
  );
}

function HourCardImproved({ 
  hour, 
  isNow, 
  theme 
}: { 
  hour: HourlyForecast; 
  isNow: boolean; 
  theme: 'light' | 'dark';
}) {
  const time = new Date(hour.dt * 1000);
  const timeStr = isNow 
    ? 'Now' 
    : time.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });

  const cardBg = isNow 
    ? theme === 'dark' 
      ? 'bg-blue-500/40 border-blue-400' 
      : 'bg-blue-400/60 border-blue-600'
    : theme === 'dark'
      ? 'bg-white/5 border-white/10 hover:bg-white/10'
      : 'bg-white/70 border-blue-200 hover:bg-white';

  const timeColor = theme === 'dark' ? 'text-white' : 'text-blue-900';
  const tempColor = theme === 'dark' ? 'text-white' : 'text-blue-900';
  const detailColor = theme === 'dark' ? 'text-blue-200' : 'text-blue-700';

  return (
    <div className={`rounded-xl p-4 border-2 transition-all duration-200 hover:scale-105 shadow-md ${cardBg}`}>
      {/* Time */}
      <div className={`text-center font-bold mb-2 ${timeColor}`}>
        {timeStr}
      </div>

      {/* Weather Icon */}
      <img
        src={getWeatherIconUrl(hour.icon)}
        alt={hour.description}
        className="w-16 h-16 mx-auto"
      />

      {/* Temperature */}
      <div className="text-center mb-2">
        <div className={`font-bold text-2xl ${tempColor}`}>
          {formatTemp(hour.temp)}
        </div>
        <div className={`text-xs ${detailColor}`}>
          Feels {formatTemp(hour.feels_like)}
        </div>
      </div>

      {/* Precipitation */}
      {hour.pop > 0.1 && (
        <div className="text-center mb-1">
          <div className={`flex items-center justify-center gap-1 text-sm font-medium ${detailColor}`}>
            <span>💧</span>
            <span>{Math.round(hour.pop * 100)}%</span>
          </div>
        </div>
      )}

      {/* Wind */}
      <div className="text-center">
        <div className={`flex items-center justify-center gap-1 text-xs ${detailColor}`}>
          <span>💨</span>
          <span>{Math.round(hour.wind_speed)} mph</span>
        </div>
      </div>
    </div>
  );
}
