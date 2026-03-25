// Weather API utilities
// Using OpenWeatherMap API (free tier)

export interface CurrentWeather {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust?: number;
  clouds: number;
  description: string;
  icon: string;
  sunrise: number;
  sunset: number;
  dt: number;
  uv_index?: number;
  aqi?: number;
  aqi_label?: string;
}

export interface DailyForecast {
  dt: number;
  temp_day: number;
  temp_min: number;
  temp_max: number;
  feels_like_day: number;
  pressure: number;
  humidity: number;
  wind_speed: number;
  wind_deg: number;
  clouds: number;
  pop: number; // Probability of precipitation
  rain?: number;
  snow?: number;
  description: string;
  icon: string;
}

export interface HourlyForecast {
  dt: number;
  temp: number;
  feels_like: number;
  pressure: number;
  humidity: number;
  clouds: number;
  wind_speed: number;
  wind_deg: number;
  pop: number; // Probability of precipitation
  rain?: number;
  snow?: number;
  description: string;
  icon: string;
}

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || 'demo';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export async function getCurrentWeather(
  lat: number,
  lon: number
): Promise<CurrentWeather | null> {
  try {
    // Fetch basic weather from OpenWeatherMap
    const weatherResponse = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`
    );
    
    if (!weatherResponse.ok) throw new Error('Weather fetch failed');
    
    const weatherData = await weatherResponse.json();
    
    // Fetch UV index and AQI from Open-Meteo (free, no key needed)
    const airQualityResponse = await fetch(
      `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,uv_index&timezone=auto`
    );
    
    let uvIndex = undefined;
    let aqi = undefined;
    let aqiLabel = undefined;
    
    if (airQualityResponse.ok) {
      const airQualityData = await airQualityResponse.json();
      uvIndex = airQualityData.current?.uv_index;
      aqi = airQualityData.current?.us_aqi;
      aqiLabel = getAQILabel(aqi);
    }
    
    return {
      temp: weatherData.main.temp,
      feels_like: weatherData.main.feels_like,
      temp_min: weatherData.main.temp_min,
      temp_max: weatherData.main.temp_max,
      pressure: weatherData.main.pressure,
      humidity: weatherData.main.humidity,
      visibility: weatherData.visibility,
      wind_speed: weatherData.wind.speed,
      wind_deg: weatherData.wind.deg,
      wind_gust: weatherData.wind.gust,
      clouds: weatherData.clouds.all,
      description: weatherData.weather[0].description,
      icon: weatherData.weather[0].icon,
      sunrise: weatherData.sys.sunrise,
      sunset: weatherData.sys.sunset,
      dt: weatherData.dt,
      uv_index: uvIndex,
      aqi: aqi,
      aqi_label: aqiLabel,
    };
  } catch (error) {
    console.error('Error fetching current weather:', error);
    return null;
  }
}

function getAQILabel(aqi: number | undefined): string | undefined {
  if (aqi === undefined) return undefined;
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
}

function getUVLabel(uv: number | undefined): string | undefined {
  if (uv === undefined) return undefined;
  if (uv < 3) return 'Low';
  if (uv < 6) return 'Moderate';
  if (uv < 8) return 'High';
  if (uv < 11) return 'Very High';
  return 'Extreme';
}

export { getUVLabel };

export async function getHourlyForecast(
  lat: number,
  lon: number
): Promise<HourlyForecast[] | null> {
  try {
    // Use Open-Meteo for true hourly data (free, no API key needed)
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,apparent_temperature,precipitation_probability,precipitation,weathercode,surface_pressure,relative_humidity_2m,windspeed_10m,winddirection_10m,cloudcover&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timezone=auto&forecast_days=2`
    );
    
    if (!response.ok) throw new Error('Hourly forecast fetch failed');
    
    const data = await response.json();
    
    // Get current hour index (to start from now)
    const now = new Date();
    const currentHour = now.getHours();
    
    // Take 48 hours starting from current hour
    const hourlyForecasts: HourlyForecast[] = [];
    for (let i = currentHour; i < Math.min(currentHour + 48, data.hourly.time.length); i++) {
      const weathercode = data.hourly.weathercode[i];
      hourlyForecasts.push({
        dt: new Date(data.hourly.time[i]).getTime() / 1000,
        temp: data.hourly.temperature_2m[i],
        feels_like: data.hourly.apparent_temperature[i],
        pressure: data.hourly.surface_pressure[i],
        humidity: data.hourly.relative_humidity_2m[i],
        clouds: data.hourly.cloudcover[i],
        wind_speed: data.hourly.windspeed_10m[i],
        wind_deg: data.hourly.winddirection_10m[i],
        pop: data.hourly.precipitation_probability[i] / 100, // Convert to 0-1 range
        rain: data.hourly.precipitation[i] > 0 ? data.hourly.precipitation[i] : undefined,
        description: weatherCodeToDescription(weathercode),
        icon: weatherCodeToIcon(weathercode),
      });
    }
    
    return hourlyForecasts;
  } catch (error) {
    console.error('Error fetching hourly forecast:', error);
    return null;
  }
}

// Convert Open-Meteo weather codes to descriptions
function weatherCodeToDescription(code: number): string {
  if (code === 0) return 'clear sky';
  if (code === 1) return 'mainly clear';
  if (code === 2) return 'partly cloudy';
  if (code === 3) return 'overcast';
  if (code >= 45 && code <= 48) return 'foggy';
  if (code >= 51 && code <= 55) return 'drizzle';
  if (code >= 61 && code <= 65) return 'rain';
  if (code >= 71 && code <= 77) return 'snow';
  if (code >= 80 && code <= 82) return 'rain showers';
  if (code >= 95) return 'thunderstorm';
  return 'unknown';
}

// Convert Open-Meteo weather codes to OpenWeatherMap icon codes
function weatherCodeToIcon(code: number): string {
  if (code === 0) return '01d'; // clear sky
  if (code === 1) return '02d'; // mainly clear
  if (code === 2) return '03d'; // partly cloudy
  if (code === 3) return '04d'; // overcast
  if (code >= 45 && code <= 48) return '50d'; // fog
  if (code >= 51 && code <= 55) return '09d'; // drizzle
  if (code >= 61 && code <= 65) return '10d'; // rain
  if (code >= 71 && code <= 77) return '13d'; // snow
  if (code >= 80 && code <= 82) return '09d'; // rain showers
  if (code >= 95) return '11d'; // thunderstorm
  return '01d';
}

export async function get10DayForecast(
  lat: number,
  lon: number
): Promise<DailyForecast[] | null> {
  try {
    // Use One Call API 3.0 for daily forecast
    const response = await fetch(
      `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`
    );
    
    if (!response.ok) throw new Error('Forecast fetch failed');
    
    const data = await response.json();
    
    // Group by day and get one forecast per day
    const dailyForecasts: DailyForecast[] = [];
    const processedDates = new Set<string>();
    
    data.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000).toDateString();
      
      if (!processedDates.has(date) && dailyForecasts.length < 10) {
        processedDates.add(date);
        dailyForecasts.push({
          dt: item.dt,
          temp_day: item.main.temp,
          temp_min: item.main.temp_min,
          temp_max: item.main.temp_max,
          feels_like_day: item.main.feels_like,
          pressure: item.main.pressure,
          humidity: item.main.humidity,
          wind_speed: item.wind.speed,
          wind_deg: item.wind.deg,
          clouds: item.clouds.all,
          pop: item.pop || 0,
          rain: item.rain?.['3h'],
          snow: item.snow?.['3h'],
          description: item.weather[0].description,
          icon: item.weather[0].icon,
        });
      }
    });
    
    return dailyForecasts;
  } catch (error) {
    console.error('Error fetching forecast:', error);
    return null;
  }
}

export function getWeatherIconUrl(icon: string): string {
  return `https://openweathermap.org/img/wn/${icon}@4x.png`;
}

export function formatTemp(temp: number): string {
  return `${Math.round(temp)}°F`;
}

export function formatWindDirection(deg: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(deg / 22.5) % 16;
  return directions[index];
}
