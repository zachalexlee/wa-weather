'use client';

import { type CurrentWeather, formatTemp, formatWindDirection } from '@/lib/weather';

interface Props {
  weather: CurrentWeather;
  theme: 'light' | 'dark';
}

export default function WeatherWidgets({ weather, theme }: Props) {
  const bgClass = theme === 'dark' ? 'bg-white/10 border-white/20' : 'bg-white/90 border-blue-300';
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-blue-900';
  const textSecondary = theme === 'dark' ? 'text-blue-200' : 'text-blue-700';

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Today's High/Low */}
      <WidgetCard theme={theme}>
        <div className="text-center">
          <div className="text-3xl mb-2">🌡️</div>
          <div className={`text-sm font-medium ${textSecondary} mb-1`}>Today's High/Low</div>
          <div className={`text-2xl font-bold ${textPrimary}`}>
            {formatTemp(weather.temp_max)}
          </div>
          <div className={`text-lg ${textSecondary}`}>
            {formatTemp(weather.temp_min)}
          </div>
        </div>
      </WidgetCard>

      {/* Wind Speed */}
      <WidgetCard theme={theme}>
        <div className="text-center">
          <div className="text-3xl mb-2">💨</div>
          <div className={`text-sm font-medium ${textSecondary} mb-1`}>Wind Speed</div>
          <div className={`text-2xl font-bold ${textPrimary}`}>
            {Math.round(weather.wind_speed)} mph
          </div>
          <div className={`text-lg ${textSecondary}`}>
            {formatWindDirection(weather.wind_deg)}
          </div>
        </div>
      </WidgetCard>

      {/* Humidity */}
      <WidgetCard theme={theme}>
        <div className="text-center">
          <div className="text-3xl mb-2">💧</div>
          <div className={`text-sm font-medium ${textSecondary} mb-1`}>Humidity</div>
          <div className={`text-2xl font-bold ${textPrimary}`}>
            {weather.humidity}%
          </div>
          <div className={`text-sm ${textSecondary} mt-1`}>
            {getHumidityLabel(weather.humidity)}
          </div>
        </div>
      </WidgetCard>

      {/* Visibility */}
      <WidgetCard theme={theme}>
        <div className="text-center">
          <div className="text-3xl mb-2">👁️</div>
          <div className={`text-sm font-medium ${textSecondary} mb-1`}>Visibility</div>
          <div className={`text-2xl font-bold ${textPrimary}`}>
            {(weather.visibility / 1609).toFixed(1)} mi
          </div>
          <div className={`text-sm ${textSecondary} mt-1`}>
            {getVisibilityLabel(weather.visibility)}
          </div>
        </div>
      </WidgetCard>

      {/* UV Index (if available) */}
      {weather.uv_index !== undefined && (
        <WidgetCard theme={theme}>
          <div className="text-center">
            <div className="text-3xl mb-2">☀️</div>
            <div className={`text-sm font-medium ${textSecondary} mb-1`}>UV Index</div>
            <div className={`text-2xl font-bold ${textPrimary}`}>
              {weather.uv_index.toFixed(1)}
            </div>
            <div className={`text-sm ${textSecondary} mt-1`}>
              {getUVIndexLabel(weather.uv_index)}
            </div>
          </div>
        </WidgetCard>
      )}

      {/* Air Quality (if available) */}
      {weather.aqi !== undefined && (
        <WidgetCard theme={theme}>
          <div className="text-center">
            <div className="text-3xl mb-2">🌫️</div>
            <div className={`text-sm font-medium ${textSecondary} mb-1`}>Air Quality</div>
            <div className={`text-2xl font-bold ${textPrimary}`} style={{ color: getAQIColor(weather.aqi) }}>
              {weather.aqi}
            </div>
            <div className={`text-sm ${textSecondary} mt-1`}>
              {weather.aqi_label}
            </div>
          </div>
        </WidgetCard>
      )}

      {/* Cloud Cover */}
      <WidgetCard theme={theme}>
        <div className="text-center">
          <div className="text-3xl mb-2">☁️</div>
          <div className={`text-sm font-medium ${textSecondary} mb-1`}>Cloud Cover</div>
          <div className={`text-2xl font-bold ${textPrimary}`}>
            {weather.clouds}%
          </div>
          <div className={`text-sm ${textSecondary} mt-1`}>
            {getCloudLabel(weather.clouds)}
          </div>
        </div>
      </WidgetCard>

      {/* Pressure */}
      <WidgetCard theme={theme}>
        <div className="text-center">
          <div className="text-3xl mb-2">🎚️</div>
          <div className={`text-sm font-medium ${textSecondary} mb-1`}>Pressure</div>
          <div className={`text-2xl font-bold ${textPrimary}`}>
            {weather.pressure}
          </div>
          <div className={`text-sm ${textSecondary} mt-1`}>
            mb
          </div>
        </div>
      </WidgetCard>
    </div>
  );
}

function WidgetCard({ children, theme }: { children: React.ReactNode; theme: 'light' | 'dark' }) {
  const bgClass = theme === 'dark' ? 'bg-white/10 border-white/20 hover:bg-white/15' : 'bg-white/90 border-blue-300 hover:bg-white';
  
  return (
    <div className={`backdrop-blur-md rounded-xl border p-4 transition-all duration-200 hover:scale-105 shadow-md ${bgClass}`}>
      {children}
    </div>
  );
}

function getHumidityLabel(humidity: number): string {
  if (humidity < 30) return 'Dry';
  if (humidity < 60) return 'Comfortable';
  if (humidity < 80) return 'Humid';
  return 'Very Humid';
}

function getVisibilityLabel(visibility: number): string {
  const miles = visibility / 1609;
  if (miles >= 10) return 'Excellent';
  if (miles >= 6) return 'Good';
  if (miles >= 3) return 'Moderate';
  if (miles >= 1) return 'Poor';
  return 'Very Poor';
}

function getUVIndexLabel(uv: number): string {
  if (uv < 3) return 'Low';
  if (uv < 6) return 'Moderate';
  if (uv < 8) return 'High';
  if (uv < 11) return 'Very High';
  return 'Extreme';
}

function getAQIColor(aqi: number): string {
  if (aqi <= 50) return '#00e400'; // Good - Green
  if (aqi <= 100) return '#ffff00'; // Moderate - Yellow
  if (aqi <= 150) return '#ff7e00'; // Unhealthy for Sensitive - Orange
  if (aqi <= 200) return '#ff0000'; // Unhealthy - Red
  if (aqi <= 300) return '#8f3f97'; // Very Unhealthy - Purple
  return '#7e0023'; // Hazardous - Maroon
}

function getCloudLabel(clouds: number): string {
  if (clouds < 10) return 'Clear';
  if (clouds < 30) return 'Mostly Clear';
  if (clouds < 70) return 'Partly Cloudy';
  if (clouds < 90) return 'Mostly Cloudy';
  return 'Overcast';
}
