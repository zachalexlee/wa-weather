import { type DailyForecast, getWeatherIconUrl, formatTemp } from '@/lib/weather';

interface Props {
  forecast: DailyForecast[];
}

export default function ForecastList({ forecast }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {forecast.map((day, index) => (
        <ForecastCard key={day.dt} day={day} isToday={index === 0} />
      ))}
    </div>
  );
}

function ForecastCard({ day, isToday }: { day: DailyForecast; isToday: boolean }) {
  const date = new Date(day.dt * 1000);
  const dayName = isToday
    ? 'Today'
    : date.toLocaleDateString('en-US', { weekday: 'short' });
  const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-4 hover:bg-white/15 transition-all duration-200">
      <div className="text-center">
        {/* Date */}
        <div className="mb-2">
          <div className="text-white font-bold text-lg">{dayName}</div>
          <div className="text-blue-200 text-sm">{dateStr}</div>
        </div>

        {/* Weather Icon */}
        <img
          src={getWeatherIconUrl(day.icon)}
          alt={day.description}
          className="w-20 h-20 mx-auto"
        />

        {/* Description */}
        <p className="text-blue-100 text-sm capitalize mb-3">
          {day.description}
        </p>

        {/* Temperature */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-white font-bold text-xl">
            {formatTemp(day.temp_max)}
          </span>
          <span className="text-blue-300">/</span>
          <span className="text-blue-300 text-lg">
            {formatTemp(day.temp_min)}
          </span>
        </div>

        {/* Additional Info */}
        <div className="space-y-1 text-sm">
          {day.pop > 0 && (
            <div className="flex items-center justify-between text-blue-200">
              <span>💧 Rain</span>
              <span className="font-medium">{Math.round(day.pop * 100)}%</span>
            </div>
          )}
          <div className="flex items-center justify-between text-blue-200">
            <span>💨 Wind</span>
            <span className="font-medium">{Math.round(day.wind_speed)} mph</span>
          </div>
          <div className="flex items-center justify-between text-blue-200">
            <span>💧 Humidity</span>
            <span className="font-medium">{day.humidity}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
