'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface SkiOptimizerProps {
  currentTemp: number;
}

const WA_SKI_RESORTS = [
  { name: 'Crystal Mountain', elevation: 6872, distance: 85, lat: 46.94, season: 'Nov-Apr' },
  { name: 'Stevens Pass', elevation: 5845, distance: 78, lat: 47.74, season: 'Nov-Apr' },
  { name: 'Mt. Baker', elevation: 5089, distance: 118, lat: 48.86, season: 'Nov-May' },
  { name: 'Snoqualmie Pass', elevation: 3022, distance: 52, lat: 47.42, season: 'Nov-Apr' },
  { name: 'Mission Ridge', elevation: 6820, distance: 135, lat: 47.29, season: 'Dec-Apr' },
  { name: 'White Pass', elevation: 6500, distance: 123, lat: 46.64, season: 'Nov-Apr' },
];

export default function SkiOptimizer({ currentTemp }: SkiOptimizerProps) {
  const [selectedResort, setSelectedResort] = useState(WA_SKI_RESORTS[0]);

  // Estimate snow conditions based on elevation and temp
  const estimateConditions = (resort: typeof WA_SKI_RESORTS[0]) => {
    const tempAtElevation = currentTemp - (resort.elevation / 1000) * 3.5; // ~3.5°F per 1000ft
    
    let snowQuality = '';
    let score = 0;
    
    if (tempAtElevation < 20) {
      snowQuality = 'Powder';
      score = 10;
    } else if (tempAtElevation < 28) {
      snowQuality = 'Packed Powder';
      score = 8;
    } else if (tempAtElevation < 32) {
      snowQuality = 'Good';
      score = 7;
    } else if (tempAtElevation < 35) {
      snowQuality = 'Softening';
      score = 5;
    } else {
      snowQuality = 'Slushy/Melting';
      score = 3;
    }
    
    return { snowQuality, score, tempAtElevation };
  };

  const conditions = estimateConditions(selectedResort);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-sm rounded-3xl border border-white/20 p-6">
        <h2 className="text-3xl font-bold mb-2">⛷️ Ski Conditions</h2>
        <p className="text-sm text-white/70 mb-6">Washington ski resort conditions</p>

        {/* Resort Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Select Resort</label>
          <select
            value={selectedResort.name}
            onChange={(e) => {
              const resort = WA_SKI_RESORTS.find(r => r.name === e.target.value);
              if (resort) setSelectedResort(resort);
            }}
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:border-white/40 focus:outline-none"
          >
            {WA_SKI_RESORTS.map(resort => (
              <option key={resort.name} value={resort.name}>
                {resort.name}
              </option>
            ))}
          </select>
        </div>

        {/* Conditions Score */}
        <div className={`mb-6 p-6 rounded-2xl border-2 ${
          conditions.score >= 8 
            ? 'bg-green-500/20 border-green-500/50' 
            : conditions.score >= 6
            ? 'bg-yellow-500/20 border-yellow-500/50'
            : 'bg-orange-500/20 border-orange-500/50'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold mb-2">{selectedResort.name}</div>
              <div className="text-xl mb-1">Snow Quality: {conditions.snowQuality}</div>
              <div className="text-sm text-white/70">
                Est. temp at summit: {Math.round(conditions.tempAtElevation)}°F
              </div>
            </div>
            <div className="text-center">
              <div className="text-6xl font-bold">{conditions.score}</div>
              <div className="text-sm text-white/70">/10</div>
            </div>
          </div>
        </div>

        {/* Resort Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <div className="text-sm text-white/70 mb-1">Elevation</div>
            <div className="font-bold">{selectedResort.elevation.toLocaleString()}'</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <div className="text-sm text-white/70 mb-1">Distance</div>
            <div className="font-bold">{selectedResort.distance} mi</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <div className="text-sm text-white/70 mb-1">Season</div>
            <div className="font-bold text-sm">{selectedResort.season}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <div className="text-sm text-white/70 mb-1">Drive Time</div>
            <div className="font-bold">{Math.round(selectedResort.distance / 55)}h {Math.round((selectedResort.distance % 55) / 55 * 60)}m</div>
          </div>
        </div>

        {/* All Resorts Comparison */}
        <div className="bg-black/20 rounded-xl p-4 mb-6">
          <h3 className="font-semibold mb-3">⛷️ Resort Comparison</h3>
          <div className="space-y-2">
            {WA_SKI_RESORTS.map(resort => {
              const cond = estimateConditions(resort);
              return (
                <div
                  key={resort.name}
                  className={`flex items-center justify-between bg-white/5 rounded-lg p-3 cursor-pointer hover:bg-white/10 transition-all ${
                    selectedResort.name === resort.name ? 'border-2 border-white/30' : ''
                  }`}
                  onClick={() => setSelectedResort(resort)}
                >
                  <div>
                    <div className="font-bold">{resort.name}</div>
                    <div className="text-xs text-white/70">{cond.snowQuality} • {resort.distance}mi away</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{cond.score}/10</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tips */}
        <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
          <p className="text-sm">
            <strong>⛷️ Ski Tips:</strong> Best powder: Mt. Baker (most snow). Closest: Snoqualmie Pass. 
            Advanced terrain: Crystal Mountain. Check resort websites for real-time conditions and avalanche reports!
          </p>
        </div>
      </div>
    </motion.div>
  );
}
