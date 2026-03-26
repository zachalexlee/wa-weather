'use client';

import { motion } from 'framer-motion';
import { CurrentWeather, HourlyForecast } from '@/lib/weather';

interface GardenHelperProps {
  currentWeather: CurrentWeather;
  hourlyForecast: HourlyForecast[];
  cityName: string;
}

export default function GardenHelper({ currentWeather, hourlyForecast, cityName }: GardenHelperProps) {
  const temp = currentWeather.temp;
  const feelsLike = currentWeather.feels_like;
  
  // Check for frost risk
  const frostRisk = hourlyForecast.slice(0, 24).some(h => h.temp < 32);
  const lowestTemp = Math.min(...hourlyForecast.slice(0, 24).map(h => h.temp));
  
  // Watering recommendation
  const rainToday = hourlyForecast.slice(0, 12).some(h => h.pop > 0.5);
  const wateringScore = rainToday ? 'Skip Today' : temp > 80 ? 'Water Twice' : 'Water Once';
  
  // Best planting season (Pacific NW)
  const month = new Date().getMonth();
  let plantingSeason = '';
  if (month >= 2 && month <= 4) plantingSeason = 'Spring Planting Season';
  else if (month >= 5 && month <= 8) plantingSeason = 'Growing Season';
  else if (month >= 9 && month <= 10) plantingSeason = 'Fall Planting Season';
  else plantingSeason = 'Winter - Indoor Only';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="bg-gradient-to-br from-green-500/10 to-lime-500/10 backdrop-blur-sm rounded-3xl border border-white/20 p-6">
        <h2 className="text-3xl font-bold mb-2">🌱 Garden Helper</h2>
        <p className="text-sm text-white/70 mb-6">PNW gardening guidance for {cityName}</p>

        {/* Frost Alert */}
        {frostRisk && (
          <div className="mb-6 p-6 rounded-2xl border-2 bg-blue-500/20 border-blue-500/50">
            <div className="flex items-center gap-4">
              <div className="text-5xl">❄️</div>
              <div>
                <div className="text-2xl font-bold">Frost Warning!</div>
                <div className="text-lg">Low: {Math.round(lowestTemp)}°F tonight</div>
                <div className="text-sm text-white/70 mt-2">
                  Cover tender plants or bring them indoors
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">💧</div>
            <div className="text-sm text-white/70">Watering</div>
            <div className="font-bold">{wateringScore}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">🌡️</div>
            <div className="text-sm text-white/70">Temp</div>
            <div className="font-bold">{Math.round(temp)}°F</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">💦</div>
            <div className="text-sm text-white/70">Humidity</div>
            <div className="font-bold">{currentWeather.humidity}%</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">🌤️</div>
            <div className="text-sm text-white/70">Season</div>
            <div className="font-bold text-xs">{plantingSeason.split(' ')[0]}</div>
          </div>
        </div>

        {/* Today's Tasks */}
        <div className="bg-black/20 rounded-xl p-4 mb-6">
          <h3 className="font-semibold mb-3">📋 Today's Garden Tasks</h3>
          <div className="space-y-2">
            {!rainToday && temp > 70 && (
              <div className="flex items-start gap-3 bg-blue-500/10 rounded-lg p-3">
                <span className="text-xl">💧</span>
                <div>
                  <div className="font-medium">Water Plants</div>
                  <div className="text-sm text-white/70">
                    {temp > 85 ? 'Hot day - water deeply in morning & evening' : 'Water in morning or evening'}
                  </div>
                </div>
              </div>
            )}
            
            {rainToday && (
              <div className="flex items-start gap-3 bg-green-500/10 rounded-lg p-3">
                <span className="text-xl">☔</span>
                <div>
                  <div className="font-medium">Skip Watering</div>
                  <div className="text-sm text-white/70">Rain expected - let nature do the work!</div>
                </div>
              </div>
            )}
            
            {temp > 60 && temp < 75 && (
              <div className="flex items-start gap-3 bg-yellow-500/10 rounded-lg p-3">
                <span className="text-xl">🌿</span>
                <div>
                  <div className="font-medium">Perfect for Planting</div>
                  <div className="text-sm text-white/70">Ideal temp for transplanting seedlings</div>
                </div>
              </div>
            )}
            
            {currentWeather.wind_speed > 20 && (
              <div className="flex items-start gap-3 bg-orange-500/10 rounded-lg p-3">
                <span className="text-xl">💨</span>
                <div>
                  <div className="font-medium">Secure Plants</div>
                  <div className="text-sm text-white/70">High winds - stake tall plants</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* PNW Planting Calendar */}
        <div className="bg-black/20 rounded-xl p-4">
          <h3 className="font-semibold mb-3">📅 PNW Planting Guide</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="bg-white/5 rounded-lg p-3">
              <div className="font-bold mb-1">🌱 Early Spring (Mar-Apr)</div>
              <div className="text-xs text-white/70">Peas, lettuce, kale, onions, potatoes</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="font-bold mb-1">☀️ Late Spring (May-Jun)</div>
              <div className="text-xs text-white/70">Tomatoes, peppers, beans, squash</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="font-bold mb-1">🍂 Fall (Sep-Oct)</div>
              <div className="text-xs text-white/70">Garlic, cover crops, winter greens</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="font-bold mb-1">❄️ Winter (Nov-Feb)</div>
              <div className="text-xs text-white/70">Plan next season, maintain tools</div>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 p-4 bg-green-500/10 rounded-xl border border-green-500/20">
          <p className="text-sm">
            <strong>🌿 PNW Garden Tips:</strong> Our mild winters allow year-round growing! 
            Watch for late frosts in May. Mulch heavily to retain moisture. 
            Embrace the rain but ensure good drainage.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
