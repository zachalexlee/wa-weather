'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { CurrentWeather } from '@/lib/weather';

interface WeatherCardGeneratorProps {
  currentWeather: CurrentWeather;
  cityName: string;
}

export default function WeatherCardGenerator({ currentWeather, cityName }: WeatherCardGeneratorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<'modern' | 'minimal' | 'gradient'>('modern');
  const cardRef = useRef<HTMLDivElement>(null);

  const templates = {
    modern: 'bg-gradient-to-br from-blue-500 to-purple-600',
    minimal: 'bg-white text-gray-900',
    gradient: 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500',
  };

  const downloadCard = async () => {
    if (!cardRef.current) return;

    try {
      // Use html2canvas library (would need to install)
      // For now, we'll use a simple approach
      alert('Card download feature would use html2canvas library. This is a demo implementation.');
      
      // In production, you'd do:
      // const canvas = await html2canvas(cardRef.current);
      // const dataUrl = canvas.toDataURL('image/png');
      // const link = document.createElement('a');
      // link.download = `weather-${cityName}-${Date.now()}.png`;
      // link.href = dataUrl;
      // link.click();
    } catch (error) {
      console.error('Failed to download card:', error);
    }
  };

  const shareToTwitter = () => {
    const text = encodeURIComponent(
      `Weather in ${cityName}: ${Math.round(currentWeather.temp)}°F - ${currentWeather.description}\n\nCheck the forecast at https://waweather.netlify.app`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  const shareToFacebook = () => {
    const url = encodeURIComponent('https://waweather.netlify.app');
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  const copyToClipboard = () => {
    const text = `Weather in ${cityName}: ${Math.round(currentWeather.temp)}°F - ${currentWeather.description}\nFeels like: ${Math.round(currentWeather.feels_like)}°F\nHumidity: ${currentWeather.humidity}%\nWind: ${Math.round(currentWeather.wind_speed)} mph`;
    navigator.clipboard.writeText(text);
    alert('Weather info copied to clipboard!');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-sm rounded-3xl border border-white/20 p-6">
        <h2 className="text-3xl font-bold mb-2">📸 Weather Card Generator</h2>
        <p className="text-sm text-white/70 mb-6">Create beautiful shareable weather cards</p>

        {/* Template Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-3">Choose Template</label>
          <div className="grid grid-cols-3 gap-3">
            {Object.entries(templates).map(([key, className]) => (
              <button
                key={key}
                onClick={() => setSelectedTemplate(key as any)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedTemplate === key
                    ? 'border-white scale-105'
                    : 'border-white/20 hover:border-white/40'
                }`}
              >
                <div className={`h-20 rounded-lg ${className} flex items-center justify-center text-white`}>
                  <span className="text-2xl font-bold capitalize">{key}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Preview Card */}
        <div className="mb-6 flex justify-center">
          <div
            ref={cardRef}
            className={`w-full max-w-md rounded-2xl p-8 ${templates[selectedTemplate]} shadow-2xl`}
          >
            <div className={`${selectedTemplate === 'minimal' ? 'text-gray-900' : 'text-white'}`}>
              <div className="text-center mb-6">
                <h3 className="text-3xl font-bold mb-2">{cityName}, WA</h3>
                <p className="text-sm opacity-80">Washington Weather Hub</p>
              </div>

              <div className="flex items-center justify-center gap-6 mb-6">
                <img 
                  src={`http://openweathermap.org/img/wn/${currentWeather.icon}@4x.png`}
                  alt={currentWeather.description}
                  className="w-32 h-32"
                />
                <div>
                  <div className="text-7xl font-bold">{Math.round(currentWeather.temp)}°</div>
                  <div className="text-xl opacity-80">Feels {Math.round(currentWeather.feels_like)}°</div>
                </div>
              </div>

              <div className="text-center mb-6">
                <p className="text-2xl capitalize font-medium">{currentWeather.description}</p>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-sm opacity-70">Humidity</div>
                  <div className="text-xl font-bold">{currentWeather.humidity}%</div>
                </div>
                <div>
                  <div className="text-sm opacity-70">Wind</div>
                  <div className="text-xl font-bold">{Math.round(currentWeather.wind_speed)} mph</div>
                </div>
                <div>
                  <div className="text-sm opacity-70">Clouds</div>
                  <div className="text-xl font-bold">{currentWeather.clouds}%</div>
                </div>
              </div>

              <div className="mt-6 text-center text-xs opacity-60">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={downloadCard}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl p-4 transition-all"
          >
            <div className="text-3xl mb-2">📥</div>
            <div className="text-sm font-medium">Download</div>
          </button>

          <button
            onClick={shareToTwitter}
            className="bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 rounded-xl p-4 transition-all"
          >
            <div className="text-3xl mb-2">🐦</div>
            <div className="text-sm font-medium">Twitter</div>
          </button>

          <button
            onClick={shareToFacebook}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl p-4 transition-all"
          >
            <div className="text-3xl mb-2">📘</div>
            <div className="text-sm font-medium">Facebook</div>
          </button>

          <button
            onClick={copyToClipboard}
            className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-xl p-4 transition-all"
          >
            <div className="text-3xl mb-2">📋</div>
            <div className="text-sm font-medium">Copy Text</div>
          </button>
        </div>

        {/* Tips */}
        <div className="mt-6 p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
          <p className="text-sm">
            <strong>💡 Pro Tip:</strong> Download the card to share on Instagram, or use the social buttons 
            to share directly to Twitter/Facebook. Perfect for sharing local weather updates!
          </p>
        </div>
      </div>
    </motion.div>
  );
}
