'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { washingtonCities, type City } from '@/lib/cities';
import { getCurrentWeather, get10DayForecast, type CurrentWeather, type DailyForecast } from '@/lib/weather';
import CurrentWeatherCard from '@/components/CurrentWeatherCard';
import ForecastList from '@/components/ForecastList';
import RadarMap from '@/components/RadarMap';
import WeatherAlerts from '@/components/WeatherAlerts';

export default function Home() {
  const [selectedCity, setSelectedCity] = useState<City>(washingtonCities[0]); // Default to Seattle
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(null);
  const [forecast, setForecast] = useState<DailyForecast[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWeather() {
      setLoading(true);
      
      const [current, daily] = await Promise.all([
        getCurrentWeather(selectedCity.lat, selectedCity.lon),
        get10DayForecast(selectedCity.lat, selectedCity.lon),
      ]);
      
      setCurrentWeather(current);
      setForecast(daily);
      setLoading(false);
    }
    
    fetchWeather();
  }, [selectedCity]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                ☀️ Washington Weather Hub
              </h1>
              <p className="text-blue-200">
                Real-time weather, radar, and forecasts for Washington State
              </p>
            </div>
            
            {/* City Selector */}
            <div className="flex items-center gap-3">
              <label htmlFor="city-select" className="text-white font-medium">
                📍 Location:
              </label>
              <select
                id="city-select"
                value={selectedCity.name}
                onChange={(e) => {
                  const city = washingtonCities.find(c => c.name === e.target.value);
                  if (city) setSelectedCity(city);
                }}
                className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
              >
                {washingtonCities.map((city) => (
                  <option key={city.name} value={city.name} className="bg-blue-900">
                    {city.name} ({city.region})
                  </option>
                ))}
              </select>
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
              <p className="text-white text-xl">Loading weather data...</p>
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

            {/* Radar Map */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6">
                <h2 className="text-2xl font-bold text-white mb-4">
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
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6">
                  <h2 className="text-2xl font-bold text-white mb-4">
                    📅 10-Day Forecast
                  </h2>
                  <ForecastList forecast={forecast} />
                </div>
              </motion.div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-black/20 backdrop-blur-md border-t border-white/10 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center">
          <p className="text-blue-200">
            Washington Weather Hub • Real-time weather data for the Evergreen State
          </p>
          <p className="text-blue-300 text-sm mt-2">
            Data powered by OpenWeatherMap & RainViewer
          </p>
        </div>
      </footer>
    </div>
  );
}
