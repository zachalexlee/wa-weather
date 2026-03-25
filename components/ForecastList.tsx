import { type DailyForecast, getWeatherIconUrl, formatTemp } from '@/lib/weather';

interface Props {
  forecast: DailyForecast[];
  theme?: 'light' | 'dark';
}

export default function ForecastList({ forecast, theme = 'dark' }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {forecast.map((day, index) => (
        <ForecastCard key={day.dt} day={day} isToday={index === 0} theme={theme} />
      ))}
    </div>
  );
}

function ForecastCard({ day, isToday, theme }: { day: DailyForecast; isToday: boolean; theme: 'light' | 'dark' }) {
  const date = new Date(day.dt * 1000);
  const dayName = isToday
    ? 'Today'
    : date.toLocaleDateString('en-US', { weekday: 'short' });
  const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  // Theme-aware colors
  const cardBg = theme === 'dark' 
    ? 'bg-white/10 border-white/20 hover:bg-white/15' 
    : 'bg-white/90 border-blue-300 hover:bg-white shadow-md';
  const dayColor = theme === 'dark' ? 'text-white' : 'text-blue-900';
  const dateColor = theme === 'dark' ? 'text-blue-200' : 'text-blue-600';
  const descColor = theme === 'dark' ? 'text-blue-100' : 'text-blue-800';
  const tempHighColor = theme === 'dark' ? 'text-white' : 'text-blue-900';
  const tempLowColor = theme === 'dark' ? 'text-blue-300' : 'text-blue-700';
  const infoColor = theme === 'dark' ? 'text-blue-200' : 'text-blue-700';

  return (
    <div className={`backdrop-blur-sm rounded-xl border p-4 transition-all duration-200 ${cardBg}`}>
      <div className="text-center">
        {/* Date */}
        <div className="mb-2">
          <div className={`font-bold text-lg ${dayColor}`}>{dayName}</div>
          <div className={`text-sm ${dateColor}`}>{dateStr}</div>
        </div>

        {/* Weather Icon */}
        <img
          src={getWeatherIconUrl(day.icon)}
          alt={day.description}
          className="w-20 h-20 mx-auto"
        />

        {/* Description */}
        <p className={`text-sm capitalize mb-3 font-medium ${descColor}`}>
          {day.description}
        </p>

        {/* Temperature */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className={`font-bold text-xl ${tempHighColor}`}>
            {formatTemp(day.temp_max)}
          </span>
          <span className={tempLowColor}>/</span>
          <span className={`text-lg ${tempLowColor}`}>
            {formatTemp(day.temp_min)}
          </span>
        </div>

        {/* Additional Info */}
        <div className={`space-y-1 text-sm ${infoColor}`}>
          {day.pop > 0 && (
            <div className="flex items-center justify-between">
              <span>💧 Rain</span>
              <span className="font-bold">{Math.round(day.pop * 100)}%</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span>💨 Wind</span>
            <span className="font-bold">{Math.round(day.wind_speed)} mph</span>
          </div>
          <div className="flex items-center justify-between">
            <span>💧 Humidity</span>
            <span className="font-bold">{day.humidity}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
