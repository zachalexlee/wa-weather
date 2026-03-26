'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface AstronomyProps {
  lat: number;
  lon: number;
  cityName: string;
}

export default function Astronomy({ lat, lon, cityName }: AstronomyProps) {
  const [moonPhase, setMoonPhase] = useState<{
    phase: string;
    illumination: number;
    emoji: string;
  }>({ phase: 'Loading...', illumination: 0, emoji: '🌑' });
  
  const [stargazingScore, setStargazingScore] = useState<number>(0);
  const [auroraChance, setAuroraChance] = useState<'Low' | 'Moderate' | 'High'>('Low');

  useEffect(() => {
    calculateMoonPhase();
    calculateStargazing();
  }, []);

  const calculateMoonPhase = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    
    // Simple moon phase calculation
    const c = (year - 1900) * 12 + month - 0.5;
    const phase = (c - Math.floor(c)) * 29.53;
    
    let phaseName = '';
    let emoji = '🌑';
    const illumination = Math.abs(Math.cos((phase / 29.53) * 2 * Math.PI)) * 100;
    
    if (phase < 1.84566) {
      phaseName = 'New Moon';
      emoji = '🌑';
    } else if (phase < 5.53699) {
      phaseName = 'Waxing Crescent';
      emoji = '🌒';
    } else if (phase < 9.22831) {
      phaseName = 'First Quarter';
      emoji = '🌓';
    } else if (phase < 12.91963) {
      phaseName = 'Waxing Gibbous';
      emoji = '🌔';
    } else if (phase < 16.61096) {
      phaseName = 'Full Moon';
      emoji = '🌕';
    } else if (phase < 20.30228) {
      phaseName = 'Waning Gibbous';
      emoji = '🌖';
    } else if (phase < 23.99361) {
      phaseName = 'Last Quarter';
      emoji = '🌗';
    } else {
      phaseName = 'Waning Crescent';
      emoji = '🌘';
    }
    
    setMoonPhase({ phase: phaseName, illumination: Math.round(illumination), emoji });
  };

  const calculateStargazing = () => {
    // Simple scoring: better in northern WA, worse near cities
    const northernBonus = lat > 47.5 ? 2 : 0;
    const baseScore = 7 + northernBonus;
    setStargazingScore(baseScore);
    
    // Aurora more likely in northern Washington
    if (lat > 48.5) {
      setAuroraChance('Moderate');
    } else if (lat > 49) {
      setAuroraChance('High');
    } else {
      setAuroraChance('Low');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 backdrop-blur-sm rounded-3xl border border-white/20 p-6">
        <h2 className="text-3xl font-bold mb-2">🌌 Astronomy & Stargazing</h2>
        <p className="text-sm text-white/70 mb-6">Night sky conditions for {cityName}</p>

        {/* Moon Phase */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-2xl p-6 text-center">
            <div className="text-8xl mb-4">{moonPhase.emoji}</div>
            <div className="text-2xl font-bold mb-2">{moonPhase.phase}</div>
            <div className="text-sm text-white/70">
              {moonPhase.illumination}% illuminated
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-6">
            <h3 className="font-bold text-lg mb-4">🌟 Stargazing Score</h3>
            <div className="text-5xl font-bold mb-2">{stargazingScore}/10</div>
            <div className="text-sm text-white/70 mb-4">
              {stargazingScore >= 8 ? 'Excellent' : stargazingScore >= 6 ? 'Good' : 'Fair'} conditions
            </div>
            <div className="text-xs space-y-1">
              <div>• Moon: {moonPhase.illumination < 50 ? '✓ Low light' : '○ Bright'}</div>
              <div>• Location: {lat > 47.5 ? '✓ Northern advantage' : '○ Southern WA'}</div>
            </div>
          </div>
        </div>

        {/* Aurora Forecast */}
        <div className={`mb-6 p-6 rounded-2xl border-2 ${
          auroraChance === 'High' 
            ? 'bg-green-500/20 border-green-500/50' 
            : auroraChance === 'Moderate'
            ? 'bg-yellow-500/20 border-yellow-500/50'
            : 'bg-gray-500/20 border-gray-500/50'
        }`}>
          <div className="flex items-center gap-4">
            <div className="text-5xl">🌠</div>
            <div>
              <div className="text-xl font-bold">Aurora Borealis Chance</div>
              <div className="text-3xl font-bold">{auroraChance}</div>
              <div className="text-sm text-white/70">
                {auroraChance === 'High' && 'Great viewing potential in northern WA!'}
                {auroraChance === 'Moderate' && 'Possible during strong solar activity'}
                {auroraChance === 'Low' && 'Rare sightings, check space weather alerts'}
              </div>
            </div>
          </div>
        </div>

        {/* Best Viewing Times */}
        <div className="bg-black/20 rounded-xl p-4 mb-6">
          <h3 className="font-semibold mb-3">⏰ Best Viewing Times (Tonight)</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span>Astronomical Twilight Ends</span>
              <span className="font-bold">~9:30 PM</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Peak Darkness</span>
              <span className="font-bold">12:00 AM - 4:00 AM</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Astronomical Twilight Begins</span>
              <span className="font-bold">~5:00 AM</span>
            </div>
          </div>
        </div>

        {/* Visible Planets */}
        <div className="bg-black/20 rounded-xl p-4">
          <h3 className="font-semibold mb-3">🪐 Visible Planets (Approximate)</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            <div className="bg-white/5 rounded-lg p-3">
              <div className="font-bold">Venus ⭐</div>
              <div className="text-xs text-white/70">Evening star - West after sunset</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="font-bold">Jupiter 🟡</div>
              <div className="text-xs text-white/70">Bright - South/Southeast</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="font-bold">Mars 🔴</div>
              <div className="text-xs text-white/70">Reddish - East before dawn</div>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
          <p className="text-sm">
            <strong>💡 Stargazing Tips:</strong> Best viewing during new moon phases. 
            Drive away from city lights. Let your eyes adjust for 20-30 minutes. 
            Check spaceweather.gov for aurora alerts!
          </p>
        </div>
      </div>
    </motion.div>
  );
}
