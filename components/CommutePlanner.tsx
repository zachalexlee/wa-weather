'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HourlyForecast } from '@/lib/weather';

interface CommutePlannerProps {
  hourlyForecast: HourlyForecast[];
  cityName: string;
}

interface CommuteTime {
  id: string;
  name: string;
  time: string;
  enabled: boolean;
}

const DEFAULT_COMMUTES: CommuteTime[] = [
  { id: 'morning', name: 'Morning Commute', time: '08:00', enabled: true },
  { id: 'evening', name: 'Evening Commute', time: '17:00', enabled: true },
];

export default function CommutePlanner({ hourlyForecast, cityName }: CommutePlannerProps) {
  const [commutes, setCommutes] = useState<CommuteTime[]>(DEFAULT_COMMUTES);
  const [customTime, setCustomTime] = useState('');
  const [customName, setCustomName] = useState('');

  // Load saved commutes from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('commute-times');
    if (saved) {
      try {
        setCommutes(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load commute times:', e);
      }
    }
  }, []);

  const saveCommutes = (newCommutes: CommuteTime[]) => {
    setCommutes(newCommutes);
    localStorage.setItem('commute-times', JSON.stringify(newCommutes));
  };

  const addCommute = () => {
    if (!customTime || !customName) return;
    
    const newCommute: CommuteTime = {
      id: `custom-${Date.now()}`,
      name: customName,
      time: customTime,
      enabled: true,
    };
    
    saveCommutes([...commutes, newCommute]);
    setCustomTime('');
    setCustomName('');
  };

  const removeCommute = (id: string) => {
    saveCommutes(commutes.filter(c => c.id !== id));
  };

  const toggleCommute = (id: string) => {
    saveCommutes(commutes.map(c => 
      c.id === id ? { ...c, enabled: !c.enabled } : c
    ));
  };

  const getWeatherForTime = (time: string): HourlyForecast | null => {
    const [hours, minutes] = time.split(':').map(Number);
    const targetTime = new Date();
    targetTime.setHours(hours, minutes, 0, 0);
    
    // Find closest hourly forecast
    const closest = hourlyForecast.reduce((prev, curr) => {
      const currTime = new Date(curr.dt * 1000);
      const prevTime = new Date(prev.dt * 1000);
      
      const currDiff = Math.abs(currTime.getTime() - targetTime.getTime());
      const prevDiff = Math.abs(prevTime.getTime() - targetTime.getTime());
      
      return currDiff < prevDiff ? curr : prev;
    });
    
    return closest;
  };

  const getCommuteAdvice = (weather: HourlyForecast | null): string => {
    if (!weather) return 'No data available';
    
    const temp = Math.round(weather.temp);
    const pop = Math.round(weather.pop * 100);
    const windSpeed = Math.round(weather.wind_speed);
    
    const advice: string[] = [];
    
    if (pop > 70) {
      advice.push('🌧️ High chance of rain - bring umbrella');
    } else if (pop > 40) {
      advice.push('☔ May rain - keep umbrella handy');
    }
    
    if (temp < 32) {
      advice.push('🧊 Freezing temps - watch for ice');
    } else if (temp < 40) {
      advice.push('🥶 Cold - dress warmly');
    } else if (temp > 85) {
      advice.push('🥵 Hot - stay hydrated');
    }
    
    if (windSpeed > 20) {
      advice.push('💨 Very windy - secure loose items');
    } else if (windSpeed > 15) {
      advice.push('🌬️ Windy conditions');
    }
    
    if (advice.length === 0) {
      advice.push('✅ Good commute conditions');
    }
    
    return advice.join(' • ');
  };

  const getConditionColor = (weather: HourlyForecast | null): string => {
    if (!weather) return 'from-gray-500/20 to-gray-600/20';
    
    const pop = weather.pop * 100;
    const temp = weather.temp;
    
    if (pop > 70 || temp < 32) return 'from-red-500/20 to-orange-500/20';
    if (pop > 40 || temp < 40) return 'from-yellow-500/20 to-orange-500/20';
    return 'from-green-500/20 to-teal-500/20';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-sm rounded-3xl border border-white/20 p-6 shadow-xl">
        <h2 className="text-3xl font-bold mb-2">🚗 Commute Planner</h2>
        <p className="text-sm text-white/70 mb-6">Plan your trips with weather forecasts</p>

        {/* Active Commutes */}
        <div className="space-y-3 mb-6">
          {commutes.filter(c => c.enabled).map((commute, idx) => {
            const weather = getWeatherForTime(commute.time);
            const advice = getCommuteAdvice(weather);
            const colorClass = getConditionColor(weather);
            
            return (
              <motion.div
                key={commute.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`bg-gradient-to-br ${colorClass} backdrop-blur-sm rounded-xl border border-white/30 p-4`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{commute.name}</h3>
                      <span className="text-sm text-white/70">{commute.time}</span>
                    </div>
                    
                    {weather && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <img src={`http://openweathermap.org/img/wn/${weather.icon}.png`} alt={weather.description} className="w-10 h-10" />
                          <span className="text-sm">{weather.description}</span>
                        </div>
                        <div>
                          <div className="text-xs text-white/70">Temperature</div>
                          <div className="text-lg font-bold">{Math.round(weather.temp)}°</div>
                        </div>
                        <div>
                          <div className="text-xs text-white/70">Rain Chance</div>
                          <div className="text-lg font-bold">{Math.round(weather.pop * 100)}%</div>
                        </div>
                        <div>
                          <div className="text-xs text-white/70">Wind</div>
                          <div className="text-lg font-bold">{Math.round(weather.wind_speed)} mph</div>
                        </div>
                      </div>
                    )}
                    
                    <div className="text-sm bg-black/20 rounded-lg p-2">
                      {advice}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => toggleCommute(commute.id)}
                      className="px-3 py-1 text-xs rounded-lg bg-white/10 hover:bg-white/20 transition-all"
                    >
                      Hide
                    </button>
                    {!['morning', 'evening'].includes(commute.id) && (
                      <button
                        onClick={() => removeCommute(commute.id)}
                        className="px-3 py-1 text-xs rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-all"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Hidden Commutes */}
        {commutes.some(c => !c.enabled) && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-white/70 mb-2">Hidden Commutes</h4>
            <div className="flex flex-wrap gap-2">
              {commutes.filter(c => !c.enabled).map(commute => (
                <button
                  key={commute.id}
                  onClick={() => toggleCommute(commute.id)}
                  className="px-3 py-1 text-sm rounded-lg bg-white/10 hover:bg-white/20 transition-all"
                >
                  {commute.name} ({commute.time})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Add Custom Commute */}
        <div className="border-t border-white/20 pt-6">
          <h4 className="text-lg font-semibold mb-3">➕ Add Custom Commute</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Commute name (e.g., 'School Drop-off')"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:border-white/40 focus:outline-none"
            />
            <input
              type="time"
              value={customTime}
              onChange={(e) => setCustomTime(e.target.value)}
              className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:border-white/40 focus:outline-none"
            />
            <button
              onClick={addCommute}
              disabled={!customName || !customTime}
              className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:bg-white/10 disabled:cursor-not-allowed transition-all font-medium"
            >
              Add Commute
            </button>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
          <p className="text-sm">
            <strong>💡 Tips:</strong> Set up your regular commute times and get weather forecasts specifically for when you'll be traveling. 
            Weather conditions are automatically updated every hour.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
