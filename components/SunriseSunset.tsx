'use client';

import { useEffect, useState } from 'react';

interface Props {
  lat: number;
  lon: number;
  sunrise: number; // Unix timestamp
  sunset: number; // Unix timestamp
  theme: 'light' | 'dark';
}

interface SunTimes {
  sunrise: string;
  sunset: string;
  goldenHourMorning: string;
  goldenHourEvening: string;
  blueHourMorning: string;
  blueHourEvening: string;
  dayLength: string;
  civilTwilight: { dawn: string; dusk: string };
  sunPosition: number; // 0-100 percentage through the day
}

export default function SunriseSunset({ lat, lon, sunrise, sunset, theme }: Props) {
  const [sunTimes, setSunTimes] = useState<SunTimes | null>(null);

  useEffect(() => {
    calculateSunTimes();
  }, [sunrise, sunset]);

  const calculateSunTimes = () => {
    const sunriseDate = new Date(sunrise * 1000);
    const sunsetDate = new Date(sunset * 1000);
    const now = new Date();

    // Golden hour: ~1 hour after sunrise and ~1 hour before sunset
    const goldenHourMorningStart = new Date(sunriseDate.getTime());
    const goldenHourMorningEnd = new Date(sunriseDate.getTime() + 60 * 60 * 1000);
    const goldenHourEveningStart = new Date(sunsetDate.getTime() - 60 * 60 * 1000);
    const goldenHourEveningEnd = new Date(sunsetDate.getTime());

    // Blue hour: ~30 min before sunrise and ~30 min after sunset
    const blueHourMorningStart = new Date(sunriseDate.getTime() - 30 * 60 * 1000);
    const blueHourMorningEnd = new Date(sunriseDate.getTime());
    const blueHourEveningStart = new Date(sunsetDate.getTime());
    const blueHourEveningEnd = new Date(sunsetDate.getTime() + 30 * 60 * 1000);

    // Civil twilight: ~30 min before/after sunrise/sunset
    const civilDawn = new Date(sunriseDate.getTime() - 30 * 60 * 1000);
    const civilDusk = new Date(sunsetDate.getTime() + 30 * 60 * 1000);

    // Day length
    const dayLengthMs = sunsetDate.getTime() - sunriseDate.getTime();
    const hours = Math.floor(dayLengthMs / (60 * 60 * 1000));
    const minutes = Math.floor((dayLengthMs % (60 * 60 * 1000)) / (60 * 1000));

    // Sun position (0-100%)
    const dayProgress = (now.getTime() - sunriseDate.getTime()) / dayLengthMs;
    const sunPosition = Math.max(0, Math.min(100, dayProgress * 100));

    setSunTimes({
      sunrise: formatTime(sunriseDate),
      sunset: formatTime(sunsetDate),
      goldenHourMorning: `${formatTime(goldenHourMorningStart)} - ${formatTime(goldenHourMorningEnd)}`,
      goldenHourEvening: `${formatTime(goldenHourEveningStart)} - ${formatTime(goldenHourEveningEnd)}`,
      blueHourMorning: `${formatTime(blueHourMorningStart)} - ${formatTime(blueHourMorningEnd)}`,
      blueHourEvening: `${formatTime(blueHourEveningStart)} - ${formatTime(blueHourEveningEnd)}`,
      dayLength: `${hours}h ${minutes}m`,
      civilTwilight: {
        dawn: formatTime(civilDawn),
        dusk: formatTime(civilDusk)
      },
      sunPosition
    });
  };

  if (!sunTimes) return null;

  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const textSecondary = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
  const bgClass = theme === 'dark' ? 'bg-white/10 border-white/20' : 'bg-white/90 border-blue-300';

  const isDay = sunTimes.sunPosition >= 0 && sunTimes.sunPosition <= 100;

  return (
    <div className={`backdrop-blur-md rounded-2xl border p-6 ${bgClass}`}>
      <h3 className={`text-2xl font-bold mb-4 ${textPrimary}`}>
        ☀️ Sunrise & Sunset
      </h3>

      {/* Sun Arc Visualization */}
      <div className="relative h-32 mb-6">
        {/* Arc Path */}
        <svg viewBox="0 0 200 60" className="w-full h-full">
          {/* Sky gradient */}
          <defs>
            <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={isDay ? '#60a5fa' : '#1e3a8a'} />
              <stop offset="100%" stopColor={isDay ? '#93c5fd' : '#3b82f6'} />
            </linearGradient>
          </defs>
          
          {/* Arc line */}
          <path
            d="M 10 50 Q 100 10 190 50"
            stroke={theme === 'dark' ? '#fbbf24' : '#f59e0b'}
            strokeWidth="2"
            fill="none"
          />

          {/* Ground line */}
          <line x1="10" y1="50" x2="190" y2="50" stroke={theme === 'dark' ? '#6b7280' : '#9ca3af'} strokeWidth="1" />

          {/* Sun position */}
          {isDay && (
            <circle
              cx={10 + (sunTimes.sunPosition / 100) * 180}
              cy={50 - Math.sin((sunTimes.sunPosition / 100) * Math.PI) * 40}
              r="6"
              fill="#fbbf24"
              stroke="#f59e0b"
              strokeWidth="2"
            />
          )}

          {/* Sunrise marker */}
          <text x="10" y="58" fontSize="8" fill={textSecondary} textAnchor="middle">↑</text>
          
          {/* Sunset marker */}
          <text x="190" y="58" fontSize="8" fill={textSecondary} textAnchor="middle">↓</text>
        </svg>
      </div>

      {/* Times Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <TimeCard
          icon="🌅"
          label="Sunrise"
          time={sunTimes.sunrise}
          theme={theme}
        />
        <TimeCard
          icon="🌇"
          label="Sunset"
          time={sunTimes.sunset}
          theme={theme}
        />
        <TimeCard
          icon="⏱️"
          label="Day Length"
          time={sunTimes.dayLength}
          theme={theme}
        />
        <TimeCard
          icon="🌗"
          label="Civil Twilight"
          time={`${sunTimes.civilTwilight.dawn} / ${sunTimes.civilTwilight.dusk}`}
          theme={theme}
          small
        />
      </div>

      {/* Golden & Blue Hours */}
      <div className={`p-4 rounded-lg ${
        theme === 'dark' ? 'bg-gradient-to-r from-amber-900/30 to-blue-900/30' : 'bg-gradient-to-r from-amber-100 to-blue-100'
      }`}>
        <h4 className={`font-bold mb-3 ${textPrimary}`}>
          📸 Best Times for Photography:
        </h4>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <span className="text-lg">🌄</span>
            <div className="flex-1">
              <div className={`font-medium ${textPrimary}`}>Morning Golden Hour</div>
              <div className={textSecondary}>{sunTimes.goldenHourMorning}</div>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <span className="text-lg">🌆</span>
            <div className="flex-1">
              <div className={`font-medium ${textPrimary}`}>Evening Golden Hour</div>
              <div className={textSecondary}>{sunTimes.goldenHourEvening}</div>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <span className="text-lg">🌌</span>
            <div className="flex-1">
              <div className={`font-medium ${textPrimary}`}>Blue Hour (Morning/Evening)</div>
              <div className={textSecondary}>{sunTimes.blueHourMorning} / {sunTimes.blueHourEvening}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TimeCard({ 
  icon, 
  label, 
  time, 
  theme,
  small = false
}: { 
  icon: string; 
  label: string; 
  time: string;
  theme: 'light' | 'dark';
  small?: boolean;
}) {
  const bgClass = theme === 'dark' ? 'bg-black/20' : 'bg-white/70';
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const textSecondary = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';

  return (
    <div className={`${bgClass} rounded-lg p-3 text-center`}>
      <div className="text-2xl mb-1">{icon}</div>
      <div className={`text-xs font-medium mb-1 ${textSecondary}`}>
        {label}
      </div>
      <div className={`${small ? 'text-xs' : 'text-lg'} font-bold ${textPrimary}`}>
        {time}
      </div>
    </div>
  );
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
}
