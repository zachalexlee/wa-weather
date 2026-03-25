import { type HourlyForecast, getWeatherIconUrl, formatTemp } from '@/lib/weather';

interface Props {
  forecast: HourlyForecast[];
}

export default function HourlyForecastComponent({ forecast }: Props) {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6">
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
        ⏰ Hourly Forecast (Next 48 Hours)
      </h2>
      
      {/* Horizontal scroll container */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {forecast.map((hour, index) => (
            <HourCard key={hour.dt} hour={hour} isNow={index === 0} />
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <div className="text-center text-blue-200 text-sm mt-2">
        ← Scroll to see more hours →
      </div>
    </div>
  );
}

function HourCard({ hour, isNow }: { hour: HourlyForecast; isNow: boolean }) {
  const time = new Date(hour.dt * 1000);
  const timeStr = isNow 
    ? 'Now' 
    : time.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
  
  const dateStr = time.toLocaleDateString('en-US', { 
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className={`flex-shrink-0 w-32 rounded-xl p-4 border-2 transition-all duration-200 hover:scale-105 ${
      isNow 
        ? 'bg-blue-500/40 border-blue-400 shadow-lg' 
        : 'bg-white/10 border-white/20 hover:bg-white/15'
    }`}>
      {/* Time */}
      <div className="text-center mb-2">
        <div className={`font-bold ${isNow ? 'text-blue-100 text-lg' : 'text-white text-base'}`}>
          {timeStr}
        </div>
        {!isNow && (
          <div className="text-blue-200 text-xs">
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
        <div className="text-white font-bold text-2xl">
          {formatTemp(hour.temp)}
        </div>
        <div className="text-blue-200 text-xs">
          Feels {formatTemp(hour.feels_like)}
        </div>
      </div>

      {/* Precipitation */}
      {hour.pop > 0 && (
        <div className="text-center mb-2">
          <div className="flex items-center justify-center gap-1 text-blue-300 text-sm">
            <span>💧</span>
            <span>{Math.round(hour.pop * 100)}%</span>
          </div>
        </div>
      )}

      {/* Wind */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-1 text-blue-200 text-xs">
          <span>💨</span>
          <span>{Math.round(hour.wind_speed)} mph</span>
        </div>
      </div>

      {/* Description */}
      <div className="text-center mt-2">
        <div className="text-blue-100 text-xs capitalize">
          {hour.description}
        </div>
      </div>
    </div>
  );
}
