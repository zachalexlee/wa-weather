import { type CurrentWeather, getWeatherIconUrl, formatTemp, formatWindDirection, getUVLabel } from '@/lib/weather';

interface Props {
  weather: CurrentWeather;
  cityName: string;
  region: string;
}

export default function CurrentWeatherCard({ weather, cityName, region }: Props) {
  const sunrise = new Date(weather.sunrise * 1000).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const sunset = new Date(weather.sunset * 1000).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="bg-gradient-to-br from-blue-600/40 to-indigo-700/40 backdrop-blur-md rounded-2xl border border-white/20 p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-4xl font-bold text-white">{cityName}</h2>
          <p className="text-blue-200 text-lg">{region}</p>
        </div>
        <div className="text-right">
          <p className="text-blue-200 text-sm">
            {new Date(weather.dt * 1000).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          <p className="text-blue-300 text-sm">
            {new Date(weather.dt * 1000).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Main Weather Display */}
        <div className="flex items-center gap-6">
          <img
            src={getWeatherIconUrl(weather.icon)}
            alt={weather.description}
            className="w-32 h-32"
          />
          <div>
            <div className="text-7xl font-bold text-white mb-2">
              {formatTemp(weather.temp)}
            </div>
            <p className="text-2xl text-blue-100 capitalize">
              {weather.description}
            </p>
            <p className="text-blue-200 mt-2">
              Feels like {formatTemp(weather.feels_like)}
            </p>
          </div>
        </div>

        {/* Weather Details Grid */}
        <div className="grid grid-cols-2 gap-4">
          <WeatherDetail
            icon="🌡️"
            label="High / Low"
            value={`${formatTemp(weather.temp_max)} / ${formatTemp(weather.temp_min)}`}
          />
          <WeatherDetail
            icon="💧"
            label="Humidity"
            value={`${weather.humidity}%`}
          />
          <WeatherDetail
            icon="💨"
            label="Wind"
            value={`${Math.round(weather.wind_speed)} mph ${formatWindDirection(weather.wind_deg)}`}
          />
          <WeatherDetail
            icon="☁️"
            label="Cloud Cover"
            value={`${weather.clouds}%`}
          />
          {weather.uv_index !== undefined && (
            <WeatherDetail
              icon="☀️"
              label="UV Index"
              value={`${weather.uv_index.toFixed(1)} (${getUVLabel(weather.uv_index)})`}
            />
          )}
          {weather.aqi !== undefined && (
            <WeatherDetail
              icon="🌫️"
              label="Air Quality"
              value={`${weather.aqi} (${weather.aqi_label})`}
              color={getAQIColor(weather.aqi)}
            />
          )}
          <WeatherDetail
            icon="👁️"
            label="Visibility"
            value={`${(weather.visibility / 1609).toFixed(1)} mi`}
          />
          <WeatherDetail
            icon="🎚️"
            label="Pressure"
            value={`${weather.pressure} mb`}
          />
          <WeatherDetail
            icon="🌅"
            label="Sunrise"
            value={sunrise}
          />
          <WeatherDetail
            icon="🌇"
            label="Sunset"
            value={sunset}
          />
        </div>
      </div>
    </div>
  );
}

function WeatherDetail({ icon, label, value, color }: { icon: string; label: string; value: string; color?: string }) {
  return (
    <div className="bg-white/10 rounded-lg p-4 border border-white/10">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-2xl">{icon}</span>
        <span className="text-blue-200 text-sm font-medium">{label}</span>
      </div>
      <div className="text-white text-lg font-semibold" style={color ? { color } : undefined}>{value}</div>
    </div>
  );
}

function getAQIColor(aqi: number): string {
  if (aqi <= 50) return '#00e400'; // Good - Green
  if (aqi <= 100) return '#ffff00'; // Moderate - Yellow
  if (aqi <= 150) return '#ff7e00'; // Unhealthy for Sensitive - Orange
  if (aqi <= 200) return '#ff0000'; // Unhealthy - Red
  if (aqi <= 300) return '#8f3f97'; // Very Unhealthy - Purple
  return '#7e0023'; // Hazardous - Maroon
}
