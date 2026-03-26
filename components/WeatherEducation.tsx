'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export default function WeatherEducation() {
  const [selectedTopic, setSelectedTopic] = useState('pineapple');

  const topics = {
    pineapple: {
      title: '🍍 Pineapple Express',
      content: 'A weather pattern where tropical moisture from near Hawaii creates heavy rain and warm temperatures in the Pacific Northwest. Can cause flooding and rapid snowmelt.',
      icon: '🌊',
    },
    convergence: {
      title: '🌀 Puget Sound Convergence Zone',
      content: 'When winds split around the Olympics and converge over Puget Sound, creating localized heavy precipitation. This is why Seattle can be sunny while Everett gets pounded with rain!',
      icon: '💨',
    },
    rainshadow: {
      title: '🏔️ Rain Shadow Effect',
      content: 'The Olympics block moisture from the ocean, creating a rain shadow in Sequim (15" annual rainfall) while nearby areas get 100"+. Eastern WA is also a rain shadow of the Cascades.',
      icon: '⛰️',
    },
    marine: {
      title: '🌫️ Marine Layer',
      content: 'Cool, moist air from the ocean creates fog and low clouds, especially in summer mornings. Usually burns off by afternoon but can persist for days.',
      icon: '☁️',
    },
    polar: {
      title: '❄️ Arctic Outbreaks',
      content: 'When cold air from Canada pushes south, bringing our rare but significant snow events. The Cascade Convergence Zone can enhance snowfall.',
      icon: '🥶',
    },
    micro: {
      title: '🏘️ Microclimates',
      content: 'Hills, water bodies, and urban heat islands create huge weather variations in small areas. Downtown Seattle is often 5-10°F warmer than suburbs.',
      icon: '🌡️',
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 backdrop-blur-sm rounded-3xl border border-white/20 p-6">
        <h2 className="text-3xl font-bold mb-2">📚 PNW Weather Education</h2>
        <p className="text-sm text-white/70 mb-6">Learn about Pacific Northwest weather patterns</p>

        {/* Topic Selector */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {Object.entries(topics).map(([key, topic]) => (
            <button
              key={key}
              onClick={() => setSelectedTopic(key)}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                selectedTopic === key
                  ? 'border-white bg-white/10 scale-105'
                  : 'border-white/20 hover:border-white/40 bg-white/5'
              }`}
            >
              <div className="text-3xl mb-2">{topic.icon}</div>
              <div className="text-sm font-semibold">{topic.title.split(' ').slice(1).join(' ')}</div>
            </button>
          ))}
        </div>

        {/* Selected Topic */}
        <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="text-6xl">{topics[selectedTopic as keyof typeof topics].icon}</div>
            <div>
              <h3 className="text-2xl font-bold mb-3">
                {topics[selectedTopic as keyof typeof topics].title}
              </h3>
              <p className="text-lg leading-relaxed">
                {topics[selectedTopic as keyof typeof topics].content}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Facts */}
        <div className="bg-black/20 rounded-xl p-4">
          <h3 className="font-semibold mb-3">⚡ Quick PNW Weather Facts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="bg-white/5 rounded-lg p-3">
              <div className="font-bold mb-1">🌧️ Record Rainfall</div>
              <div className="text-xs text-white/70">Quinault Rainforest: 180+ inches/year</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="font-bold mb-1">☀️ Driest Spot</div>
              <div className="text-xs text-white/70">Sequim: ~16 inches/year (rain shadow!)</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="font-bold mb-1">🌡️ Temp Record</div>
              <div className="text-xs text-white/70">Ice Harbor Dam: 118°F (Aug 1961)</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="font-bold mb-1">❄️ Cold Record</div>
              <div className="text-xs text-white/70">Winthrop: -48°F (Dec 1968)</div>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
          <p className="text-sm">
            <strong>🎓 Did You Know?</strong> Seattle isn't actually the rainiest major U.S. city - 
            that's Mobile, Alabama! We just have more drizzly days. Our summers are incredibly dry and sunny!
          </p>
        </div>
      </div>
    </motion.div>
  );
}
