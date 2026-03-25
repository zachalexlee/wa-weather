'use client';

import { useState, useEffect } from 'react';

interface Props {
  lat: number;
  lon: number;
  theme: 'light' | 'dark';
}

export default function RadarReplay({ lat, lon, theme }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [speed, setSpeed] = useState(1); // 1x, 2x, 4x
  const [radarFrames, setRadarFrames] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRadarFrames() {
      try {
        // Fetch available radar timestamps from RainViewer
        const response = await fetch('https://api.rainviewer.com/public/weather-maps.json');
        
        if (response.ok) {
          const data = await response.json();
          
          // Get last 12 frames (2 hours at 10-minute intervals)
          const timestamps = data.radar.past.slice(-12).map((item: any) => item.path);
          setRadarFrames(timestamps);
        }
      } catch (error) {
        console.error('Failed to fetch radar data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchRadarFrames();
  }, []);

  useEffect(() => {
    if (!isPlaying || radarFrames.length === 0) return;

    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % radarFrames.length);
    }, 500 / speed); // Adjust speed

    return () => clearInterval(interval);
  }, [isPlaying, radarFrames.length, speed]);

  const textPrimary = theme === 'dark' ? 'text-white' : 'text-blue-900';
  const textSecondary = theme === 'dark' ? 'text-blue-200' : 'text-blue-700';

  if (loading) {
    return (
      <div className={`backdrop-blur-md rounded-2xl border p-6 ${
        theme === 'dark' ? 'bg-white/10 border-white/20' : 'bg-white/90 border-blue-300'
      }`}>
        <div className={`text-center ${textSecondary}`}>
          Loading radar replay...
        </div>
      </div>
    );
  }

  if (radarFrames.length === 0) {
    return null;
  }

  // RainViewer tile URL format
  const tileUrl = `https://tilecache.rainviewer.com${radarFrames[currentFrame]}/256/{z}/{x}/{y}/2/1_1.png`;
  
  // Calculate tile coordinates for the center point
  const zoom = 8;
  const scale = Math.pow(2, zoom);
  const worldCoordX = ((lon + 180) / 360) * scale;
  const worldCoordY = ((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2) * scale;
  const tileX = Math.floor(worldCoordX);
  const tileY = Math.floor(worldCoordY);

  return (
    <div className={`backdrop-blur-md rounded-2xl border p-6 ${
      theme === 'dark' ? 'bg-white/10 border-white/20' : 'bg-white/90 border-blue-300'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-2xl font-bold ${textPrimary}`}>
          🌧️ Radar Replay (Last 2 Hours)
        </h3>
        
        <div className="flex items-center gap-2">
          {/* Speed Control */}
          <select
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className={`px-3 py-1 rounded-lg text-sm ${
              theme === 'dark' 
                ? 'bg-white/10 text-white border border-white/20' 
                : 'bg-white text-gray-900 border border-blue-300'
            }`}
          >
            <option value={1}>1x</option>
            <option value={2}>2x</option>
            <option value={4}>4x</option>
          </select>

          {/* Play/Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              theme === 'dark'
                ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isPlaying ? '⏸️ Pause' : '▶️ Play'}
          </button>
        </div>
      </div>

      {/* Radar Display */}
      <div className="relative w-full h-96 bg-gray-800 rounded-xl overflow-hidden">
        {/* Base Map Layer */}
        <div className="absolute inset-0">
          <iframe
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${lon-0.5},${lat-0.5},${lon+0.5},${lat+0.5}&layer=mapnik`}
            className="w-full h-full"
            style={{ border: 0 }}
          />
        </div>

        {/* Radar Overlay */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `url(${tileUrl.replace('{z}', String(zoom)).replace('{x}', String(tileX)).replace('{y}', String(tileY))})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.7
          }}
        />

        {/* Frame Counter */}
        <div className={`absolute bottom-4 left-4 px-3 py-2 rounded-lg ${
          theme === 'dark' ? 'bg-black/70 text-white' : 'bg-white/90 text-gray-900'
        }`}>
          Frame {currentFrame + 1} / {radarFrames.length}
        </div>

        {/* Timestamp */}
        <div className={`absolute bottom-4 right-4 px-3 py-2 rounded-lg ${
          theme === 'dark' ? 'bg-black/70 text-white' : 'bg-white/90 text-gray-900'
        }`}>
          {getTimeAgo(radarFrames.length - currentFrame - 1)}
        </div>
      </div>

      {/* Timeline Scrubber */}
      <div className="mt-4">
        <input
          type="range"
          min={0}
          max={radarFrames.length - 1}
          value={currentFrame}
          onChange={(e) => {
            setCurrentFrame(Number(e.target.value));
            setIsPlaying(false);
          }}
          className="w-full"
        />
        <div className="flex justify-between mt-2">
          <span className={`text-sm ${textSecondary}`}>2 hours ago</span>
          <span className={`text-sm ${textSecondary}`}>Now</span>
        </div>
      </div>

      {/* Legend */}
      <div className={`mt-4 p-3 rounded-lg ${
        theme === 'dark' ? 'bg-black/30' : 'bg-blue-50'
      }`}>
        <div className="flex items-center justify-between text-sm">
          <span className={textSecondary}>Precipitation Intensity:</span>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-300 rounded"></div>
            <span className={textSecondary}>Light</span>
            <div className="w-4 h-4 bg-blue-500 rounded ml-2"></div>
            <span className={textSecondary}>Moderate</span>
            <div className="w-4 h-4 bg-red-500 rounded ml-2"></div>
            <span className={textSecondary}>Heavy</span>
          </div>
        </div>
      </div>

      <p className={`mt-3 text-sm ${textSecondary}`}>
        Watch storm movement over the last 2 hours. Use the timeline to see specific moments.
      </p>
    </div>
  );
}

function getTimeAgo(framesAgo: number): string {
  const minutesAgo = framesAgo * 10; // 10-minute intervals
  if (minutesAgo === 0) return 'Now';
  if (minutesAgo < 60) return `${minutesAgo} min ago`;
  const hours = Math.floor(minutesAgo / 60);
  const mins = minutesAgo % 60;
  return mins > 0 ? `${hours}h ${mins}m ago` : `${hours}h ago`;
}
