'use client';

import { type HourlyForecast, type DailyForecast, formatTemp } from '@/lib/weather';

interface Props {
  hourly?: HourlyForecast[];
  daily?: DailyForecast[];
  theme: 'light' | 'dark';
}

export default function WeatherGraphs({ hourly, daily, theme }: Props) {
  return (
    <div className="space-y-6">
      {/* 24-Hour Temperature Graph */}
      {hourly && hourly.length > 0 && (
        <div className={`backdrop-blur-md rounded-2xl border p-6 ${
          theme === 'dark' ? 'bg-white/10 border-white/20' : 'bg-white/90 border-blue-300'
        }`}>
          <h3 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-blue-900'}`}>
            📈 24-Hour Temperature Trend
          </h3>
          <TemperatureGraph data={hourly.slice(0, 24)} theme={theme} />
        </div>
      )}

      {/* 10-Day Temperature Range Graph */}
      {daily && daily.length > 0 && (
        <div className={`backdrop-blur-md rounded-2xl border p-6 ${
          theme === 'dark' ? 'bg-white/10 border-white/20' : 'bg-white/90 border-blue-300'
        }`}>
          <h3 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-blue-900'}`}>
            📊 10-Day Temperature Range
          </h3>
          <DailyTempGraph data={daily} theme={theme} />
        </div>
      )}

      {/* Precipitation Probability */}
      {hourly && hourly.length > 0 && (
        <div className={`backdrop-blur-md rounded-2xl border p-6 ${
          theme === 'dark' ? 'bg-white/10 border-white/20' : 'bg-white/90 border-blue-300'
        }`}>
          <h3 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-blue-900'}`}>
            💧 24-Hour Precipitation Probability
          </h3>
          <PrecipitationGraph data={hourly.slice(0, 24)} theme={theme} />
        </div>
      )}
    </div>
  );
}

function TemperatureGraph({ data, theme }: { data: HourlyForecast[]; theme: 'light' | 'dark' }) {
  const temps = data.map(h => h.temp);
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);
  const tempRange = maxTemp - minTemp || 1;

  const textColor = theme === 'dark' ? 'text-blue-200' : 'text-blue-700';
  const lineColor = theme === 'dark' ? '#60a5fa' : '#2563eb';
  const fillColor = theme === 'dark' ? 'rgba(96, 165, 250, 0.1)' : 'rgba(37, 99, 235, 0.1)';

  return (
    <div className="relative h-64">
      {/* Y-axis labels */}
      <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs pr-2">
        <span className={textColor}>{Math.round(maxTemp)}°</span>
        <span className={textColor}>{Math.round(minTemp)}°</span>
      </div>

      {/* Graph area */}
      <div className="ml-8 h-full overflow-x-auto">
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox={`0 0 ${data.length * 40} 100`}>
          {/* Area fill */}
          <path
            d={generateAreaPath(data, minTemp, tempRange)}
            fill={fillColor}
            stroke="none"
          />
          
          {/* Line */}
          <path
            d={generateLinePath(data, minTemp, tempRange)}
            fill="none"
            stroke={lineColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {data.map((hour, i) => {
            const x = i * 40 + 20;
            const y = 100 - ((hour.temp - minTemp) / tempRange) * 80 - 10;
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="3"
                fill={lineColor}
              />
            );
          })}
        </svg>
      </div>

      {/* X-axis labels */}
      <div className="ml-8 flex overflow-x-auto">
        {data.map((hour, i) => {
          if (i % 3 !== 0) return null; // Show every 3rd label
          const time = new Date(hour.dt * 1000);
          const timeStr = time.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
          return (
            <div key={i} className={`flex-shrink-0 w-[120px] text-center text-xs ${textColor}`}>
              {timeStr}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DailyTempGraph({ data, theme }: { data: DailyForecast[]; theme: 'light' | 'dark' }) {
  const allTemps = data.flatMap(d => [d.temp_max, d.temp_min]);
  const minTemp = Math.min(...allTemps);
  const maxTemp = Math.max(...allTemps);
  const tempRange = maxTemp - minTemp || 1;

  const textColor = theme === 'dark' ? 'text-blue-200' : 'text-blue-700';
  const highColor = theme === 'dark' ? '#f97316' : '#ea580c';
  const lowColor = theme === 'dark' ? '#3b82f6' : '#2563eb';

  return (
    <div className="space-y-2">
      {data.map((day, i) => {
        const date = new Date(day.dt * 1000);
        const dayName = i === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' });
        
        const highPercent = ((day.temp_max - minTemp) / tempRange) * 100;
        const lowPercent = ((day.temp_min - minTemp) / tempRange) * 100;

        return (
          <div key={i} className="flex items-center gap-3">
            {/* Day label */}
            <div className={`w-16 text-sm font-medium ${textColor}`}>
              {dayName}
            </div>

            {/* Low temp */}
            <div className={`w-12 text-right text-sm font-bold ${textColor}`}>
              {formatTemp(day.temp_min)}
            </div>

            {/* Bar */}
            <div className="flex-1 relative h-6 bg-white/10 rounded-full overflow-hidden">
              <div
                className="absolute h-full rounded-full transition-all duration-300"
                style={{
                  left: `${lowPercent}%`,
                  width: `${highPercent - lowPercent}%`,
                  background: `linear-gradient(to right, ${lowColor}, ${highColor})`
                }}
              />
            </div>

            {/* High temp */}
            <div className={`w-12 text-left text-sm font-bold ${textColor}`}>
              {formatTemp(day.temp_max)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PrecipitationGraph({ data, theme }: { data: HourlyForecast[]; theme: 'light' | 'dark' }) {
  const maxPrecip = Math.max(...data.map(h => h.pop));
  const textColor = theme === 'dark' ? 'text-blue-200' : 'text-blue-700';
  const barColor = theme === 'dark' ? '#3b82f6' : '#2563eb';

  return (
    <div className="space-y-2">
      <div className="h-48 flex items-end gap-1">
        {data.map((hour, i) => {
          if (i % 2 !== 0) return null; // Show every 2nd bar to save space
          const height = (hour.pop / (maxPrecip || 1)) * 100;
          const time = new Date(hour.dt * 1000);
          const timeStr = time.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });

          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full rounded-t transition-all duration-300 hover:opacity-80"
                style={{
                  height: `${height}%`,
                  backgroundColor: barColor,
                  minHeight: hour.pop > 0 ? '4px' : '0'
                }}
                title={`${Math.round(hour.pop * 100)}% at ${timeStr}`}
              />
              {i % 6 === 0 && (
                <span className={`text-xs ${textColor}`}>
                  {timeStr}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className={`text-center text-sm ${textColor}`}>
        Probability of precipitation (%)
      </div>
    </div>
  );
}

function generateLinePath(data: HourlyForecast[], minTemp: number, tempRange: number): string {
  return data
    .map((hour, i) => {
      const x = i * 40 + 20;
      const y = 100 - ((hour.temp - minTemp) / tempRange) * 80 - 10;
      return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    })
    .join(' ');
}

function generateAreaPath(data: HourlyForecast[], minTemp: number, tempRange: number): string {
  const linePath = data
    .map((hour, i) => {
      const x = i * 40 + 20;
      const y = 100 - ((hour.temp - minTemp) / tempRange) * 80 - 10;
      return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    })
    .join(' ');

  const lastX = (data.length - 1) * 40 + 20;
  return `${linePath} L ${lastX} 100 L 20 100 Z`;
}
