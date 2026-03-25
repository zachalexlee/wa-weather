import { type HourlyForecast, getWeatherIconUrl, formatTemp } from '@/lib/weather';

interface Props {
  forecast: HourlyForecast[];
  theme?: 'light' | 'dark';
}

export default function HourlyForecastComponent({ forecast, theme = 'dark' }: Props) {
  const bgClass = theme === 'dark' ? 'bg-white/10 border-white/20' : 'bg-white/80 border-blue-300';
  const titleClass = theme === 'dark' ? 'text-white' : 'text-blue-900';
  const hintClass = theme === 'dark' ? 'text-blue-200' : 'text-blue-700';

  return (
    <div className={`backdrop-blur-md rounded-2xl border p-6 ${bgClass}`}>
      <h2 className={`text-2xl font-bold mb-4 flex items-center gap-2 ${titleClass}`}>
        ⏰ Hourly Forecast (Next 48 Hours)
      </h2>
      
      {/* Horizontal scroll container */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {forecast.map((hour, index) => (
            <HourCard key={hour.dt} hour={hour} isNow={index === 0} theme={theme} />
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <div className={`text-center text-sm mt-2 ${hintClass}`}>
        ← Scroll to see more hours →
      </div>
    </div>
  );
}

function HourCard({ hour, isNow, theme }: { hour: HourlyForecast; isNow: boolean; theme: 'light' | 'dark' }) {
  const time = new Date(hour.dt * 1000);
  const timeStr = isNow 
    ? 'Now' 
    : time.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
  
  const dateStr = time.toLocaleDateString('en-US', { 
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  // Theme-aware colors
  const cardBg = isNow 
    ? theme === 'dark' 
      ? 'bg-blue-500/40 border-blue-400' 
      : 'bg-blue-400/60 border-blue-600'
    : theme === 'dark'
      ? 'bg-white/10 border-white/20 hover:bg-white/15'
      : 'bg-white/90 border-blue-300 hover:bg-white';

  const timeColor = isNow 
    ? theme === 'dark' ? 'text-blue-100' : 'text-blue-900'
    : theme === 'dark' ? 'text-white' : 'text-blue-900';

  const dateColor = theme === 'dark' ? 'text-blue-200' : 'text-blue-600';
  const tempColor = theme === 'dark' ? 'text-white' : 'text-blue-900';
  const feelsColor = theme === 'dark' ? 'text-blue-200' : 'text-blue-700';
  const precipColor = theme === 'dark' ? 'text-blue-300' : 'text-blue-600';
  const windColor = theme === 'dark' ? 'text-blue-200' : 'text-blue-700';
  const descColor = theme === 'dark' ? 'text-blue-100' : 'text-blue-800';

  return (
    <div className={`flex-shrink-0 w-32 rounded-xl p-4 border-2 transition-all duration-200 hover:scale-105 shadow-md ${cardBg}`}>
      {/* Time */}
      <div className="text-center mb-2">
        <div className={`font-bold ${isNow ? 'text-lg' : 'text-base'} ${timeColor}`}>
          {timeStr}
        </div>
        {!isNow && (
          <div className={`text-xs ${dateColor}`}>
            {dateStr}
          </div>
        )}
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
        <div className={`text-xs ${feelsColor}`}>
          Feels {formatTemp(hour.feels_like)}
        </div>
      </div>

      {/* Precipitation */}
      {hour.pop > 0 && (
        <div className="text-center mb-2">
          <div className={`flex items-center justify-center gap-1 text-sm ${precipColor}`}>
            <span>💧</span>
            <span>{Math.round(hour.pop * 100)}%</span>
          </div>
        </div>
      )}

      {/* Wind */}
      <div className="text-center">
        <div className={`flex items-center justify-center gap-1 text-xs ${windColor}`}>
          <span>💨</span>
          <span>{Math.round(hour.wind_speed)} mph</span>
        </div>
      </div>

      {/* Description */}
      <div className="text-center mt-2">
        <div className={`text-xs capitalize ${descColor}`}>
          {hour.description}
        </div>
      </div>
    </div>
  );
}
