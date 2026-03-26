'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { washingtonCities, type City } from '@/lib/cities';
import { getCurrentWeather, get10DayForecast, getHourlyForecast, type CurrentWeather, type DailyForecast, type HourlyForecast } from '@/lib/weather';
import { useTheme } from '@/lib/theme-context';
import CurrentWeatherCard from '@/components/CurrentWeatherCard';
import ForecastList from '@/components/ForecastList';
import HourlyForecastComponent from '@/components/HourlyForecast';
import RadarMap from '@/components/RadarMap';
import WeatherAlerts from '@/components/WeatherAlerts';
import CitySearch from '@/components/CitySearch';
import WeatherSummary from '@/components/WeatherSummary';
import WeatherWidgets from '@/components/WeatherWidgets';
import WeatherGraphs from '@/components/WeatherGraphs';
import { getWeatherBackground, isNightTime } from '@/lib/weather-backgrounds';
import WildfireSmoke from '@/components/WildfireSmoke';
import MountainPasses from '@/components/MountainPasses';
import PugetSoundMarine from '@/components/PugetSoundMarine';
import NotificationSettings from '@/components/NotificationSettings';
import YesterdayComparison from '@/components/YesterdayComparison';
import RadarReplay from '@/components/RadarReplay';
import ImprovedHourlyForecast from '@/components/ImprovedHourlyForecast';
import PollenForecast from '@/components/PollenForecast';
import ActivityRecommendations from '@/components/ActivityRecommendations';
import SunriseSunset from '@/components/SunriseSunset';
import CustomDashboard from '@/components/CustomDashboard';
import CommutePlanner from '@/components/CommutePlanner';
import WeatherHistory from '@/components/WeatherHistory';
import MultiCityComparison from '@/components/MultiCityComparison';
import CalendarExport from '@/components/CalendarExport';
import ClothingRecommender from '@/components/ClothingRecommender';
import VoiceControl from '@/components/VoiceControl';
import WeatherCardGenerator from '@/components/WeatherCardGenerator';
import OfflineMode from '@/components/OfflineMode';
import Astronomy from '@/components/Astronomy';
import GardenHelper from '@/components/GardenHelper';
import PetSafety from '@/components/PetSafety';
import SkiOptimizer from '@/components/SkiOptimizer';
import WeatherEducation from '@/components/WeatherEducation';
import Hyperlocal from '@/components/Hyperlocal';

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const [selectedCity, setSelectedCity] = useState<City>(washingtonCities[0]); // Default to Seattle
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(null);
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecast[] | null>(null);
  const [forecast, setForecast] = useState<DailyForecast[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [favoriteCities, setFavoriteCities] = useState<string[]>([]);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);

  // Load favorites from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('favoriteCities');
    if (saved) {
      try {
        setFavoriteCities(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load favorites:', e);
      }
    }
  }, []);

  // Save favorites to localStorage
  const toggleFavorite = (cityName: string) => {
    const newFavorites = favoriteCities.includes(cityName)
      ? favoriteCities.filter(c => c !== cityName)
      : [...favoriteCities, cityName];
    setFavoriteCities(newFavorites);
    localStorage.setItem('favoriteCities', JSON.stringify(newFavorites));
  };

  // Detect user location
  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // Find closest Washington city
        let closestCity: City = washingtonCities[0];
        let minDistance = Infinity;
        
        washingtonCities.forEach((city) => {
          const distance = Math.sqrt(
            Math.pow(city.lat - latitude, 2) + Math.pow(city.lon - longitude, 2)
          );
          if (distance < minDistance) {
            minDistance = distance;
            closestCity = city as City;
          }
        });
        
        setSelectedCity(closestCity);
        setDetectingLocation(false);
      },
      (error) => {
        console.error('Location detection failed:', error);
        alert('Could not detect your location. Please select a city manually.');
        setDetectingLocation(false);
      }
    );
  };

  useEffect(() => {
    async function fetchWeather() {
      setLoading(true);
      
      const [current, hourly, daily] = await Promise.all([
        getCurrentWeather(selectedCity.lat, selectedCity.lon),
        getHourlyForecast(selectedCity.lat, selectedCity.lon),
        get10DayForecast(selectedCity.lat, selectedCity.lon),
      ]);
      
      setCurrentWeather(current);
      setHourlyForecast(hourly);
      setForecast(daily);
      setLoading(false);
    }
    
    fetchWeather();
  }, [selectedCity]);

  // Dynamic background based on weather
  const weatherBg = currentWeather 
    ? getWeatherBackground(
        currentWeather.description,
        theme,
        isNightTime(currentWeather.sunrise, currentWeather.sunset)
      )
    : {
        gradient: theme === 'dark'
          ? 'bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900'
          : 'bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300',
        description: ''
      };

  const bgClass = weatherBg.gradient;
  const headerBg = theme === 'dark' ? 'bg-black/20' : 'bg-white/90';
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-blue-900';
  const textSecondary = theme === 'dark' ? 'text-blue-200' : 'text-blue-700';

  return (
    <div className={`min-h-screen ${bgClass}`}>
      {/* Header */}
      <header className={`${headerBg} backdrop-blur-md border-b ${theme === 'dark' ? 'border-white/10' : 'border-blue-300'}`}>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className={`text-4xl font-bold ${textPrimary} mb-2`}>
                ☀️ Washington Weather Hub
              </h1>
              <p className={textSecondary}>
                Real-time weather, radar, and forecasts for Washington State
              </p>
            </div>
            
            {/* Controls */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  theme === 'dark'
                    ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
                title="Toggle dark/light mode"
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>

              {/* Notifications Button */}
              <button
                onClick={() => setShowNotificationSettings(true)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  theme === 'dark'
                    ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
                title="Notification settings"
              >
                🔔
              </button>

              {/* Geolocation Button */}
              <button
                onClick={detectLocation}
                disabled={detectingLocation}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  theme === 'dark'
                    ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                title="Detect my location"
              >
                {detectingLocation ? '🔄' : '📍'}
              </button>

              {/* Favorite Toggle */}
              <button
                onClick={() => toggleFavorite(selectedCity.name)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  favoriteCities.includes(selectedCity.name)
                    ? theme === 'dark'
                      ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/50'
                      : 'bg-yellow-400 text-yellow-900 border border-yellow-600'
                    : theme === 'dark'
                      ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
                title={favoriteCities.includes(selectedCity.name) ? 'Remove from favorites' : 'Add to favorites'}
              >
                {favoriteCities.includes(selectedCity.name) ? '⭐' : '☆'}
              </button>

              {/* City Search */}
              <div className="w-64">
                <CitySearch 
                  selectedCity={selectedCity}
                  onCitySelect={setSelectedCity}
                  theme={theme}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-400 mb-4"></div>
              <p className={`${textPrimary} text-xl`}>Loading weather data...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Weather Alerts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <WeatherAlerts 
                lat={selectedCity.lat} 
                lon={selectedCity.lon}
                cityName={selectedCity.name}
              />
            </motion.div>

            {/* Weather Summary Card */}
            {currentWeather && hourlyForecast && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05 }}
              >
                <WeatherSummary 
                  current={currentWeather}
                  hourly={hourlyForecast}
                  cityName={selectedCity.name}
                  theme={theme}
                />
              </motion.div>
            )}

            {/* Yesterday vs Today Comparison */}
            {currentWeather && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.07 }}
              >
                <YesterdayComparison
                  currentTemp={currentWeather.temp}
                  currentHigh={currentWeather.temp_max}
                  currentLow={currentWeather.temp_min}
                  lat={selectedCity.lat}
                  lon={selectedCity.lon}
                  theme={theme}
                />
              </motion.div>
            )}

            {/* Weather Widgets/Mini Cards */}
            {currentWeather && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.08 }}
              >
                <WeatherWidgets weather={currentWeather} theme={theme} />
              </motion.div>
            )}

            {/* Current Weather */}
            {currentWeather && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <CurrentWeatherCard 
                  weather={currentWeather} 
                  cityName={selectedCity.name}
                  region={selectedCity.region}
                />
              </motion.div>
            )}

            {/* Improved Hourly Forecast */}
            {hourlyForecast && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <ImprovedHourlyForecast forecast={hourlyForecast} theme={theme} />
              </motion.div>
            )}

            {/* Sunrise & Sunset with Golden Hour */}
            {currentWeather && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.11 }}
              >
                <SunriseSunset
                  lat={selectedCity.lat}
                  lon={selectedCity.lon}
                  sunrise={currentWeather.sunrise}
                  sunset={currentWeather.sunset}
                  theme={theme}
                />
              </motion.div>
            )}

            {/* Activity Recommendations */}
            {currentWeather && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.12 }}
              >
                <ActivityRecommendations weather={currentWeather} theme={theme} />
              </motion.div>
            )}

            {/* Pollen Forecast */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.13 }}
            >
              <PollenForecast 
                lat={selectedCity.lat}
                lon={selectedCity.lon}
                theme={theme}
              />
            </motion.div>

            {/* Radar Replay */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.14 }}
            >
              <RadarReplay 
                lat={selectedCity.lat}
                lon={selectedCity.lon}
                theme={theme}
              />
            </motion.div>

            {/* Custom Dashboard */}
            {currentWeather && forecast && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
              >
                <CustomDashboard
                  weatherData={{
                    temperature: currentWeather.temp,
                    feelsLike: currentWeather.feels_like,
                    description: currentWeather.description,
                    humidity: currentWeather.humidity,
                    windSpeed: currentWeather.wind_speed,
                    pressure: currentWeather.pressure,
                  }}
                  forecast={forecast}
                  alerts={[]}
                />
              </motion.div>
            )}

            {/* Commute Planner */}
            {hourlyForecast && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.16 }}
              >
                <CommutePlanner
                  hourlyForecast={hourlyForecast}
                  cityName={selectedCity.name}
                />
              </motion.div>
            )}

            {/* Weather History */}
            {currentWeather && (
              <WeatherHistory
                cityName={selectedCity.name}
                lat={selectedCity.lat}
                lon={selectedCity.lon}
                currentTemp={currentWeather.temp}
              />
            )}

            {/* Multi-City Comparison */}
            <MultiCityComparison currentCity={selectedCity} />

            {/* Calendar Export */}
            {forecast && (
              <CalendarExport
                forecast={forecast}
                cityName={selectedCity.name}
              />
            )}

            {/* Clothing Recommender */}
            {currentWeather && hourlyForecast && (
              <ClothingRecommender
                currentWeather={currentWeather}
                hourlyForecast={hourlyForecast}
              />
            )}

            {/* Voice Control */}
            <VoiceControl onVoiceCommand={(cmd) => console.log('Voice command:', cmd)} />

            {/* Weather Card Generator */}
            {currentWeather && (
              <WeatherCardGenerator
                currentWeather={currentWeather}
                cityName={selectedCity.name}
              />
            )}

            {/* Offline Mode */}
            <OfflineMode />

            {/* Astronomy */}
            <Astronomy
              lat={selectedCity.lat}
              lon={selectedCity.lon}
              cityName={selectedCity.name}
            />

            {/* Garden Helper */}
            {currentWeather && hourlyForecast && (
              <GardenHelper
                currentWeather={currentWeather}
                hourlyForecast={hourlyForecast}
                cityName={selectedCity.name}
              />
            )}

            {/* Pet Safety */}
            {currentWeather && hourlyForecast && (
              <PetSafety
                currentWeather={currentWeather}
                hourlyForecast={hourlyForecast}
              />
            )}

            {/* Ski Optimizer */}
            {currentWeather && (
              <SkiOptimizer currentTemp={currentWeather.temp} />
            )}

            {/* Weather Education */}
            <WeatherEducation />

            {/* Hyperlocal */}
            {currentWeather && (
              <Hyperlocal
                currentWeather={currentWeather}
                cityName={selectedCity.name}
              />
            )}

            {/* Radar Map */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className={`backdrop-blur-md rounded-2xl border p-6 ${
                theme === 'dark' 
                  ? 'bg-white/10 border-white/20' 
                  : 'bg-white/80 border-blue-300'
              }`}>
                <h2 className={`text-2xl font-bold ${textPrimary} mb-4`}>
                  🗺️ Live Doppler Radar
                </h2>
                <RadarMap 
                  lat={selectedCity.lat} 
                  lon={selectedCity.lon} 
                  cityName={selectedCity.name}
                />
              </div>
            </motion.div>

            {/* 10-Day Forecast */}
            {forecast && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className={`backdrop-blur-md rounded-2xl border p-6 ${
                  theme === 'dark' 
                    ? 'bg-white/10 border-white/20' 
                    : 'bg-white/80 border-blue-300'
                }`}>
                  <h2 className={`text-2xl font-bold ${textPrimary} mb-4`}>
                    📅 10-Day Forecast
                  </h2>
                  <ForecastList forecast={forecast} theme={theme} />
                </div>
              </motion.div>
            )}

            {/* Weather Graphs */}
            {(hourlyForecast || forecast) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <WeatherGraphs 
                  hourly={hourlyForecast || undefined}
                  daily={forecast || undefined}
                  theme={theme}
                />
              </motion.div>
            )}

            {/* Phase 4: Washington-Specific Features */}
            
            {/* Wildfire Smoke Tracker */}
            {currentWeather && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <WildfireSmoke 
                  lat={selectedCity.lat}
                  lon={selectedCity.lon}
                  cityName={selectedCity.name}
                  theme={theme}
                />
              </motion.div>
            )}

            {/* Mountain Pass Conditions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <MountainPasses theme={theme} />
            </motion.div>

            {/* Puget Sound Marine & Ferry Conditions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <PugetSoundMarine theme={theme} />
            </motion.div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className={`${headerBg} backdrop-blur-md border-t ${theme === 'dark' ? 'border-white/10' : 'border-blue-300'} mt-12`}>
        <div className="max-w-7xl mx-auto px-4 py-6 text-center">
          <p className={textSecondary}>
            Washington Weather Hub • Real-time weather data for the Evergreen State
          </p>
          <p className={`${textSecondary} text-sm mt-2`}>
            Data powered by OpenWeatherMap, Open-Meteo & RainViewer
          </p>
        </div>
      </footer>

      {/* Notification Settings Modal */}
      {showNotificationSettings && (
        <NotificationSettings
          theme={theme}
          onClose={() => setShowNotificationSettings(false)}
        />
      )}
    </div>
  );
}
