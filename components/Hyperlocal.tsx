'use client';

import { motion } from 'framer-motion';
import { CurrentWeather } from '@/lib/weather';

interface HyperlocalProps {
  currentWeather: CurrentWeather;
  cityName: string;
}

export default function Hyperlocal({ currentWeather, cityName }: HyperlocalProps) {
  // Simulate neighborhood variations (in reality would use multiple weather stations)
  const neighborhoods = [
    { name: 'Downtown', tempOffset: +3, reason: 'Urban heat island' },
    { name: 'Waterfront', tempOffset: -2, reason: 'Marine influence' },
    { name: 'Hill Areas', tempOffset: -1, reason: 'Higher elevation' },
    { name: 'Industrial District', tempOffset: +2, reason: 'Pavement/buildings' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="bg-gradient-to-br from-rose-500/10 to-pink-500/10 backdrop-blur-sm rounded-3xl border border-white/20 p-6">
        <h2 className="text-3xl font-bold mb-2">📍 Hyperlocal Forecast</h2>
        <p className="text-sm text-white/70 mb-6">Neighborhood-level conditions in {cityName}</p>

        {/* Main City Temp */}
        <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl p-6 mb-6 text-center">
          <div className="text-sm text-white/70 mb-2">City Center</div>
          <div className="text-6xl font-bold mb-2">{Math.round(currentWeather.temp)}°</div>
          <div className="text-lg text-white/70">Base temperature</div>
        </div>

        {/* Neighborhood Variations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {neighborhoods.map((hood, idx) => {
            const localTemp = currentWeather.temp + hood.tempOffset;
            return (
              <div
                key={idx}
                className={`bg-gradient-to-br rounded-xl p-4 ${
                  hood.tempOffset > 0 
                    ? 'from-red-500/20 to-orange-500/20' 
                    : 'from-blue-500/20 to-cyan-500/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="font-bold text-lg">{hood.name}</div>
                    <div className="text-xs text-white/70">{hood.reason}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">{Math.round(localTemp)}°</div>
                    <div className="text-xs text-white/70">
                      {hood.tempOffset > 0 ? '+' : ''}{hood.tempOffset}°
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Microclimate Info */}
        <div className="bg-black/20 rounded-xl p-4 mb-6">
          <h3 className="font-semibold mb-3">🌡️ Why Temperatures Vary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <span>🏙️</span>
              <span><strong>Urban Heat Island:</strong> Buildings and pavement absorb heat, raising temps 2-5°F downtown</span>
            </div>
            <div className="flex items-start gap-2">
              <span>🌊</span>
              <span><strong>Water Bodies:</strong> Lakes and Puget Sound moderate temps, keeping waterfront areas cooler in summer</span>
            </div>
            <div className="flex items-start gap-2">
              <span>⛰️</span>
              <span><strong>Elevation:</strong> Temperature drops ~3.5°F per 1,000 feet of elevation gain</span>
            </div>
            <div className="flex items-start gap-2">
              <span>🌳</span>
              <span><strong>Tree Cover:</strong> Shaded neighborhoods stay 2-4°F cooler on sunny days</span>
            </div>
          </div>
        </div>

        {/* Community Reports */}
        <div className="bg-black/20 rounded-xl p-4">
          <h3 className="font-semibold mb-3">👥 Community Weather Reports</h3>
          <div className="text-center text-white/50 py-8">
            <div className="text-4xl mb-3">🔜</div>
            <div className="text-sm">Community reporting coming soon!</div>
            <div className="text-xs mt-2">Users will be able to share real-time conditions from their neighborhood</div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
          <p className="text-sm">
            <strong>💡 Local Tip:</strong> Temperature can vary 10°F+ across a city! 
            Waterfront and hilltop areas are usually cooler, while downtown valleys trap heat.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
