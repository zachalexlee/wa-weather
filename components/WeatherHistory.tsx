'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface HistoricalData {
  date: string;
  temp_max: number;
  temp_min: number;
  precipitation: number;
  description: string;
}

interface WeatherHistoryProps {
  cityName: string;
  lat: number;
  lon: number;
  currentTemp: number;
}

export default function WeatherHistory({ cityName, lat, lon, currentTemp }: WeatherHistoryProps) {
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d'>('7d');
  const [recordData, setRecordData] = useState<{
    recordHigh: number;
    recordLow: number;
    recordHighDate: string;
    recordLowDate: string;
  } | null>(null);

  useEffect(() => {
    fetchHistoricalData();
  }, [lat, lon, timeRange]);

  const fetchHistoricalData = async () => {
    setLoading(true);
    
    try {
      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - (timeRange === '7d' ? 7 : 30));
      
      const formatDate = (date: Date) => {
        return date.toISOString().split('T')[0];
      };
      
      // Fetch from Open-Meteo historical API
      const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${formatDate(startDate)}&end_date=${formatDate(endDate)}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&temperature_unit=fahrenheit&timezone=America/Los_Angeles`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.daily) {
        const historical: HistoricalData[] = data.daily.time.map((date: string, idx: number) => ({
          date,
          temp_max: data.daily.temperature_2m_max[idx],
          temp_min: data.daily.temperature_2m_min[idx],
          precipitation: data.daily.precipitation_sum[idx] || 0,
          description: getWeatherDescription(data.daily.weathercode[idx]),
        }));
        
        setHistoricalData(historical);
        
        // Calculate records
        const recordHigh = Math.max(...data.daily.temperature_2m_max);
        const recordLow = Math.min(...data.daily.temperature_2m_min);
        const recordHighIdx = data.daily.temperature_2m_max.indexOf(recordHigh);
        const recordLowIdx = data.daily.temperature_2m_min.indexOf(recordLow);
        
        setRecordData({
          recordHigh,
          recordLow,
          recordHighDate: data.daily.time[recordHighIdx],
          recordLowDate: data.daily.time[recordLowIdx],
        });
      }
    } catch (error) {
      console.error('Failed to fetch historical data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherDescription = (code: number): string => {
    if (code === 0) return 'Clear';
    if (code <= 3) return 'Partly Cloudy';
    if (code <= 48) return 'Foggy';
    if (code <= 67) return 'Rainy';
    if (code <= 77) return 'Snowy';
    if (code <= 82) return 'Showers';
    return 'Thunderstorms';
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const calculateAverage = (values: number[]) => {
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  };

  const avgHigh = historicalData.length > 0 
    ? calculateAverage(historicalData.map(d => d.temp_max))
    : 0;
  const avgLow = historicalData.length > 0
    ? calculateAverage(historicalData.map(d => d.temp_min))
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-3xl border border-white/20 p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">📊 Weather History</h2>
            <p className="text-sm text-white/70">Historical trends for {cityName}</p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                timeRange === '7d'
                  ? 'bg-purple-500 text-white'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                timeRange === '30d'
                  ? 'bg-purple-500 text-white'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              30 Days
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-400 mb-4"></div>
            <p className="text-white/70">Loading historical data...</p>
          </div>
        ) : (
          <>
            {/* Record Stats */}
            {recordData && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 backdrop-blur-sm rounded-xl border border-white/30 p-4">
                  <div className="text-xs text-white/70 mb-1">Record High</div>
                  <div className="text-3xl font-bold text-red-400">{Math.round(recordData.recordHigh)}°</div>
                  <div className="text-xs text-white/70 mt-1">{formatDate(recordData.recordHighDate)}</div>
                </div>
                
                <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-xl border border-white/30 p-4">
                  <div className="text-xs text-white/70 mb-1">Record Low</div>
                  <div className="text-3xl font-bold text-blue-400">{Math.round(recordData.recordLow)}°</div>
                  <div className="text-xs text-white/70 mt-1">{formatDate(recordData.recordLowDate)}</div>
                </div>
                
                <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-xl border border-white/30 p-4">
                  <div className="text-xs text-white/70 mb-1">Avg High</div>
                  <div className="text-3xl font-bold text-yellow-400">{Math.round(avgHigh)}°</div>
                  <div className="text-xs text-white/70 mt-1">Past {timeRange === '7d' ? '7' : '30'} days</div>
                </div>
                
                <div className="bg-gradient-to-br from-teal-500/20 to-green-500/20 backdrop-blur-sm rounded-xl border border-white/30 p-4">
                  <div className="text-xs text-white/70 mb-1">Avg Low</div>
                  <div className="text-3xl font-bold text-teal-400">{Math.round(avgLow)}°</div>
                  <div className="text-xs text-white/70 mt-1">Past {timeRange === '7d' ? '7' : '30'} days</div>
                </div>
              </div>
            )}

            {/* Comparison to Current */}
            <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-sm rounded-xl border border-white/30 p-4 mb-6">
              <h3 className="font-semibold mb-2">📈 Today vs Historical Average</h3>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">Current Temp</span>
                    <span className="font-bold text-lg">{Math.round(currentTemp)}°</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/70">Avg for period</span>
                    <span className="text-sm text-white/70">{Math.round((avgHigh + avgLow) / 2)}°</span>
                  </div>
                </div>
                <div className="text-2xl">
                  {currentTemp > (avgHigh + avgLow) / 2 ? '🔺' : currentTemp < (avgHigh + avgLow) / 2 ? '🔻' : '➡️'}
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${
                    currentTemp > (avgHigh + avgLow) / 2 ? 'text-red-400' : 
                    currentTemp < (avgHigh + avgLow) / 2 ? 'text-blue-400' : 
                    'text-white/70'
                  }`}>
                    {Math.abs(Math.round(currentTemp - (avgHigh + avgLow) / 2))}° {
                      currentTemp > (avgHigh + avgLow) / 2 ? 'warmer' :
                      currentTemp < (avgHigh + avgLow) / 2 ? 'cooler' :
                      'same'
                    }
                  </div>
                  <div className="text-xs text-white/70">than average</div>
                </div>
              </div>
            </div>

            {/* Historical Timeline */}
            <div className="bg-black/20 rounded-xl p-4 max-h-64 overflow-y-auto">
              <h3 className="font-semibold mb-3">📅 Daily History</h3>
              <div className="space-y-2">
                {historicalData.slice().reverse().map((day, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-sm bg-white/5 rounded-lg p-2 hover:bg-white/10 transition-all"
                  >
                    <div className="w-20">
                      <div className="font-medium">{formatDate(day.date)}</div>
                    </div>
                    <div className="flex-1 flex items-center gap-2 text-xs">
                      <span className="text-white/70">{day.description}</span>
                      {day.precipitation > 0 && (
                        <span className="text-blue-400">💧 {day.precipitation.toFixed(1)}"</span>
                      )}
                    </div>
                    <div className="flex gap-4 items-center">
                      <div className="text-right">
                        <span className="text-red-400 font-medium">{Math.round(day.temp_max)}°</span>
                        <span className="text-white/50 mx-1">/</span>
                        <span className="text-blue-400 font-medium">{Math.round(day.temp_min)}°</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
