'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { washingtonCities, type City } from '@/lib/cities';
import { getCurrentWeather, type CurrentWeather } from '@/lib/weather';

interface CityWeatherData {
  city: City;
  weather: CurrentWeather | null;
  loading: boolean;
}

interface MultiCityComparisonProps {
  currentCity: City;
}

export default function MultiCityComparison({ currentCity }: MultiCityComparisonProps) {
  const [selectedCities, setSelectedCities] = useState<City[]>([currentCity]);
  const [cityWeatherData, setCityWeatherData] = useState<CityWeatherData[]>([]);
  const [availableCities, setAvailableCities] = useState<City[]>([]);

  useEffect(() => {
    // Filter out already selected cities
    setAvailableCities(
      washingtonCities.filter(city => 
        !selectedCities.find(sc => sc.name === city.name)
      )
    );
  }, [selectedCities]);

  useEffect(() => {
    fetchCityWeather();
  }, [selectedCities]);

  const fetchCityWeather = async () => {
    const weatherData: CityWeatherData[] = selectedCities.map(city => ({
      city,
      weather: null,
      loading: true,
    }));
    
    setCityWeatherData(weatherData);
    
    // Fetch weather for each city
    for (let i = 0; i < selectedCities.length; i++) {
      const city = selectedCities[i];
      try {
        const weather = await getCurrentWeather(city.lat, city.lon);
        setCityWeatherData(prev => 
          prev.map((cwd, idx) => 
            idx === i ? { ...cwd, weather, loading: false } : cwd
          )
        );
      } catch (error) {
        console.error(`Failed to fetch weather for ${city.name}:`, error);
        setCityWeatherData(prev =>
          prev.map((cwd, idx) =>
            idx === i ? { ...cwd, loading: false } : cwd
          )
        );
      }
    }
  };

  const addCity = (city: City) => {
    if (selectedCities.length < 5) {
      setSelectedCities([...selectedCities, city]);
    }
  };

  const removeCity = (cityName: string) => {
    if (selectedCities.length > 1) {
      setSelectedCities(selectedCities.filter(c => c.name !== cityName));
    }
  };

  const getBestCity = () => {
    const completedData = cityWeatherData.filter(cwd => cwd.weather && !cwd.loading);
    if (completedData.length === 0) return null;
    
    // Score based on: higher temp, lower clouds, lower wind
    const scored = completedData.map(cwd => {
      const weather = cwd.weather!;
      const tempScore = weather.temp; // Higher is better
      const windScore = -weather.wind_speed; // Lower is better
      const cloudScore = -(weather.clouds / 10); // Lower is better
      
      const totalScore = tempScore + windScore + cloudScore;
      
      return { city: cwd.city, score: totalScore };
    });
    
    scored.sort((a, b) => b.score - a.score);
    return scored[0]?.city;
  };

  const bestCity = getBestCity();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="w-full max-w-6xl mx-auto"
    >
      <div className="bg-gradient-to-br from-blue-500/10 to-teal-500/10 backdrop-blur-sm rounded-3xl border border-white/20 p-6 shadow-xl">
        <h2 className="text-3xl font-bold mb-2">🏙️ Multi-City Comparison</h2>
        <p className="text-sm text-white/70 mb-6">Compare weather across Washington cities</p>

        {/* Best City Banner */}
        {bestCity && (
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-xl border border-green-500/30 p-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🏆</span>
              <div>
                <div className="font-semibold text-green-400">Best Weather Right Now</div>
                <div className="text-lg">{bestCity.name}</div>
              </div>
            </div>
          </div>
        )}

        {/* City Selector */}
        {availableCities.length > 0 && selectedCities.length < 5 && (
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Add City to Compare ({selectedCities.length}/5)
            </label>
            <select
              onChange={(e) => {
                const city = washingtonCities.find(c => c.name === e.target.value);
                if (city) {
                  addCity(city);
                  e.target.value = '';
                }
              }}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:border-white/40 focus:outline-none"
              defaultValue=""
            >
              <option value="" disabled>Select a city...</option>
              {availableCities.map(city => (
                <option key={city.name} value={city.name}>
                  {city.name} - {city.region}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* City Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cityWeatherData.map((cwd, idx) => (
            <motion.div
              key={cwd.city.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className={`bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl border p-4 relative ${
                bestCity?.name === cwd.city.name
                  ? 'border-green-500/50 shadow-lg shadow-green-500/20'
                  : 'border-white/30'
              }`}
            >
              {/* Remove Button */}
              {selectedCities.length > 1 && (
                <button
                  onClick={() => removeCity(cwd.city.name)}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500/20 hover:bg-red-500/40 transition-all text-xs flex items-center justify-center"
                >
                  ✕
                </button>
              )}

              {/* Best Badge */}
              {bestCity?.name === cwd.city.name && (
                <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  BEST
                </div>
              )}

              <div className="mb-3">
                <h3 className="text-lg font-bold">{cwd.city.name}</h3>
                <p className="text-xs text-white/70">{cwd.city.region}</p>
              </div>

              {cwd.loading ? (
                <div className="py-8 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-400"></div>
                </div>
              ) : cwd.weather ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-4xl font-bold">{Math.round(cwd.weather.temp)}°</div>
                      <div className="text-sm text-white/70">Feels {Math.round(cwd.weather.feels_like)}°</div>
                    </div>
                    <img 
                      src={`http://openweathermap.org/img/wn/${cwd.weather.icon}@2x.png`}
                      alt={cwd.weather.description}
                      className="w-16 h-16"
                    />
                  </div>

                  <div className="text-sm capitalize mb-3">{cwd.weather.description}</div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/70">High / Low</span>
                      <span className="font-medium">
                        {Math.round(cwd.weather.temp_max)}° / {Math.round(cwd.weather.temp_min)}°
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Humidity</span>
                      <span className="font-medium">{cwd.weather.humidity}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Wind</span>
                      <span className="font-medium">{Math.round(cwd.weather.wind_speed)} mph</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Clouds</span>
                      <span className="font-medium">{cwd.weather.clouds}%</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center text-white/50 py-4">
                  Failed to load weather
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Comparison Table */}
        {cityWeatherData.length > 1 && !cityWeatherData.some(cwd => cwd.loading) && (
          <div className="mt-6 overflow-x-auto">
            <h3 className="font-semibold mb-3">📊 Quick Comparison</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-2 px-3">City</th>
                  <th className="text-center py-2 px-3">Temp</th>
                  <th className="text-center py-2 px-3">Feels Like</th>
                  <th className="text-center py-2 px-3">Humidity</th>
                  <th className="text-center py-2 px-3">Wind</th>
                  <th className="text-center py-2 px-3">Conditions</th>
                </tr>
              </thead>
              <tbody>
                {cityWeatherData
                  .filter(cwd => cwd.weather)
                  .sort((a, b) => (b.weather?.temp || 0) - (a.weather?.temp || 0))
                  .map((cwd, idx) => (
                    <tr 
                      key={cwd.city.name}
                      className={`border-b border-white/10 ${
                        idx === 0 ? 'bg-green-500/10' : ''
                      }`}
                    >
                      <td className="py-2 px-3 font-medium">
                        {cwd.city.name}
                        {idx === 0 && <span className="ml-2 text-xs">🏆</span>}
                      </td>
                      <td className="text-center py-2 px-3 font-bold">
                        {Math.round(cwd.weather!.temp)}°
                      </td>
                      <td className="text-center py-2 px-3 text-white/70">
                        {Math.round(cwd.weather!.feels_like)}°
                      </td>
                      <td className="text-center py-2 px-3 text-white/70">
                        {cwd.weather!.humidity}%
                      </td>
                      <td className="text-center py-2 px-3 text-white/70">
                        {Math.round(cwd.weather!.wind_speed)} mph
                      </td>
                      <td className="text-center py-2 px-3 text-white/70 capitalize">
                        {cwd.weather!.description}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tips */}
        <div className="mt-6 p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
          <p className="text-sm">
            <strong>💡 Trip Planning:</strong> Comparing cities helps you decide where to visit this weekend! 
            The "best" city is scored by temperature, low precipitation, and calm winds.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
