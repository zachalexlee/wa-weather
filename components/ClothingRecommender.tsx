'use client';

import { motion } from 'framer-motion';
import { CurrentWeather, HourlyForecast } from '@/lib/weather';

interface ClothingRecommenderProps {
  currentWeather: CurrentWeather;
  hourlyForecast: HourlyForecast[];
}

interface ClothingItem {
  item: string;
  icon: string;
  reason: string;
  category: 'essential' | 'recommended' | 'optional';
}

export default function ClothingRecommender({ currentWeather, hourlyForecast }: ClothingRecommenderProps) {
  
  const getClothingRecommendations = (): ClothingItem[] => {
    const recommendations: ClothingItem[] = [];
    const temp = currentWeather.temp;
    const feelsLike = currentWeather.feels_like;
    const windSpeed = currentWeather.wind_speed;
    const humidity = currentWeather.humidity;
    
    // Check if rain is expected in next 12 hours
    const rainLikely = hourlyForecast.slice(0, 12).some(h => h.pop > 0.5);
    const precipitation = rainLikely ? 1 : 0; // Simple check for rain likelihood
    
    // Temperature-based recommendations
    if (feelsLike < 32) {
      recommendations.push({
        item: 'Heavy Winter Coat',
        icon: '🧥',
        reason: `Feels like ${Math.round(feelsLike)}° - very cold`,
        category: 'essential'
      });
      recommendations.push({
        item: 'Insulated Gloves',
        icon: '🧤',
        reason: 'Protect hands from freezing temps',
        category: 'essential'
      });
      recommendations.push({
        item: 'Winter Hat/Beanie',
        icon: '🎩',
        reason: 'Most body heat escapes through head',
        category: 'essential'
      });
      recommendations.push({
        item: 'Scarf',
        icon: '🧣',
        reason: 'Keep neck and face warm',
        category: 'recommended'
      });
    } else if (feelsLike < 45) {
      recommendations.push({
        item: 'Warm Jacket',
        icon: '🧥',
        reason: `${Math.round(feelsLike)}° - chilly conditions`,
        category: 'essential'
      });
      recommendations.push({
        item: 'Long Sleeves',
        icon: '👕',
        reason: 'Base layer for warmth',
        category: 'recommended'
      });
      recommendations.push({
        item: 'Light Gloves',
        icon: '🧤',
        reason: 'Optional for sensitive hands',
        category: 'optional'
      });
    } else if (feelsLike < 60) {
      recommendations.push({
        item: 'Light Jacket/Hoodie',
        icon: '🧥',
        reason: `${Math.round(feelsLike)}° - cool but comfortable`,
        category: 'recommended'
      });
      recommendations.push({
        item: 'Long Sleeves',
        icon: '👕',
        reason: 'Comfortable for most activities',
        category: 'recommended'
      });
    } else if (feelsLike < 75) {
      recommendations.push({
        item: 'T-Shirt',
        icon: '👕',
        reason: `${Math.round(feelsLike)}° - pleasant temperature`,
        category: 'recommended'
      });
      recommendations.push({
        item: 'Light Layer',
        icon: '🧥',
        reason: 'Optional for evening cooldown',
        category: 'optional'
      });
    } else if (feelsLike < 85) {
      recommendations.push({
        item: 'Light T-Shirt',
        icon: '👕',
        reason: `${Math.round(feelsLike)}° - warm weather`,
        category: 'essential'
      });
      recommendations.push({
        item: 'Shorts',
        icon: '🩳',
        reason: 'Stay cool and comfortable',
        category: 'recommended'
      });
      recommendations.push({
        item: 'Hat/Cap',
        icon: '🧢',
        reason: 'Sun protection',
        category: 'recommended'
      });
    } else {
      recommendations.push({
        item: 'Breathable T-Shirt',
        icon: '👕',
        reason: `${Math.round(feelsLike)}° - very hot`,
        category: 'essential'
      });
      recommendations.push({
        item: 'Shorts',
        icon: '🩳',
        reason: 'Maximum cooling',
        category: 'essential'
      });
      recommendations.push({
        item: 'Sun Hat',
        icon: '🧢',
        reason: 'Protect from heat',
        category: 'essential'
      });
      recommendations.push({
        item: 'Sunscreen',
        icon: '🧴',
        reason: 'Prevent sunburn',
        category: 'essential'
      });
    }
    
    // Rain-based recommendations
    if (precipitation > 0 || rainLikely) {
      recommendations.push({
        item: 'Umbrella',
        icon: '☔',
        reason: precipitation > 0 ? 'Currently raining' : 'Rain expected today',
        category: 'essential'
      });
      recommendations.push({
        item: 'Waterproof Jacket',
        icon: '🧥',
        reason: 'Stay dry in wet conditions',
        category: 'recommended'
      });
      recommendations.push({
        item: 'Waterproof Shoes',
        icon: '👢',
        reason: 'Avoid wet feet',
        category: 'recommended'
      });
    }
    
    // Wind-based recommendations
    if (windSpeed > 15) {
      recommendations.push({
        item: 'Windbreaker',
        icon: '🧥',
        reason: `${Math.round(windSpeed)} mph winds`,
        category: 'recommended'
      });
      if (feelsLike < 60) {
        recommendations.push({
          item: 'Hat with Strap',
          icon: '🎩',
          reason: 'Prevent hat from blowing away',
          category: 'optional'
        });
      }
    }
    
    // Humidity-based recommendations
    if (humidity > 80 && temp > 70) {
      recommendations.push({
        item: 'Moisture-Wicking Shirt',
        icon: '👕',
        reason: `${humidity}% humidity - stay dry`,
        category: 'recommended'
      });
    }
    
    // Sun protection
    if (temp > 70 && currentWeather.clouds < 50) {
      recommendations.push({
        item: 'Sunglasses',
        icon: '🕶️',
        reason: 'Bright and sunny conditions',
        category: 'recommended'
      });
      if (!recommendations.some(r => r.item.includes('Sunscreen'))) {
        recommendations.push({
          item: 'Sunscreen',
          icon: '🧴',
          reason: 'UV protection',
          category: 'recommended'
        });
      }
    }
    
    // Dedup and prioritize
    const seen = new Set();
    return recommendations.filter(r => {
      if (seen.has(r.item)) return false;
      seen.add(r.item);
      return true;
    });
  };

  const recommendations = getClothingRecommendations();
  const essential = recommendations.filter(r => r.category === 'essential');
  const recommended = recommendations.filter(r => r.category === 'recommended');
  const optional = recommendations.filter(r => r.category === 'optional');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1.0 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 backdrop-blur-sm rounded-3xl border border-white/20 p-6 shadow-xl">
        <h2 className="text-3xl font-bold mb-2">👔 What Should I Wear?</h2>
        <p className="text-sm text-white/70 mb-6">
          Clothing recommendations based on current & forecasted weather
        </p>

        {/* Current Conditions Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">{Math.round(currentWeather.temp)}°</div>
            <div className="text-xs text-white/70">Temperature</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">{Math.round(currentWeather.feels_like)}°</div>
            <div className="text-xs text-white/70">Feels Like</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">{Math.round(currentWeather.wind_speed)}</div>
            <div className="text-xs text-white/70">Wind (mph)</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">{currentWeather.humidity}%</div>
            <div className="text-xs text-white/70">Humidity</div>
          </div>
        </div>

        {/* Essential Items */}
        {essential.length > 0 && (
          <div className="mb-6">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <span className="text-red-400">🔴</span> Essential
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {essential.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-r from-red-500/20 to-orange-500/20 backdrop-blur-sm rounded-xl border border-red-500/30 p-4"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{item.icon}</span>
                    <div className="flex-1">
                      <div className="font-semibold">{item.item}</div>
                      <div className="text-sm text-white/70">{item.reason}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommended Items */}
        {recommended.length > 0 && (
          <div className="mb-6">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <span className="text-yellow-400">🟡</span> Recommended
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {recommended.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 backdrop-blur-sm rounded-xl border border-yellow-500/30 p-4"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div className="flex-1">
                      <div className="font-semibold text-sm">{item.item}</div>
                      <div className="text-xs text-white/70">{item.reason}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Optional Items */}
        {optional.length > 0 && (
          <div className="mb-6">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <span className="text-green-400">🟢</span> Optional
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {optional.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-r from-green-500/20 to-teal-500/20 backdrop-blur-sm rounded-xl border border-green-500/30 p-4"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div className="flex-1">
                      <div className="font-semibold text-sm">{item.item}</div>
                      <div className="text-xs text-white/70">{item.reason}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Summary */}
        <div className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-white/20">
          <h3 className="font-semibold mb-2">📝 Quick Summary</h3>
          <p className="text-sm">
            {currentWeather.feels_like < 45 && "Bundle up! It's cold out there. "}
            {currentWeather.feels_like >= 45 && currentWeather.feels_like < 60 && "Dress in layers - it's cool but comfortable. "}
            {currentWeather.feels_like >= 60 && currentWeather.feels_like < 75 && "Pleasant conditions - light clothing is perfect. "}
            {currentWeather.feels_like >= 75 && currentWeather.feels_like < 85 && "Warm day - dress light and stay cool. "}
            {currentWeather.feels_like >= 85 && "Very hot - wear breathable fabrics and protect from sun. "}
            {hourlyForecast.slice(0, 12).some(h => h.pop > 0.5) && "Don't forget your umbrella! "}
            {currentWeather.wind_speed > 15 && "Windy conditions - secure loose items. "}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
