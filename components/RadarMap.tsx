'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { fixLeafletIcons } from '@/lib/leaflet-icon-fix';

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

interface Props {
  lat: number;
  lon: number;
  cityName: string;
}

interface RadarFrame {
  path: string;
  time: number;
}

export default function RadarMap({ lat, lon, cityName }: Props) {
  const [radarLayer, setRadarLayer] = useState<'precipitation' | 'clouds' | 'temperature'>('precipitation');
  const [radarFrames, setRadarFrames] = useState<RadarFrame[]>([]);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [mounted, setMounted] = useState(false);
  const position: LatLngExpression = [lat, lon];

  useEffect(() => {
    setMounted(true);
    fixLeafletIcons(); // Fix marker icons
    fetchRadarData();
    
    // Update radar data every 10 minutes
    const interval = setInterval(fetchRadarData, 600000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isAnimating || radarFrames.length === 0) return;

    const animationInterval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % radarFrames.length);
    }, 500); // Change frame every 500ms

    return () => clearInterval(animationInterval);
  }, [isAnimating, radarFrames]);

  const fetchRadarData = async () => {
    try {
      const response = await fetch('https://api.rainviewer.com/public/weather-maps.json');
      const data = await response.json();
      
      if (data.radar && data.radar.past) {
        setRadarFrames(data.radar.past);
        setCurrentFrame(data.radar.past.length - 1); // Use latest frame by default
      }
    } catch (error) {
      console.error('Error fetching radar data:', error);
    }
  };

  const toggleAnimation = () => {
    setIsAnimating(!isAnimating);
    if (isAnimating) {
      // When stopping, go back to latest frame
      setCurrentFrame(radarFrames.length - 1);
    }
  };

  if (!mounted) {
    return (
      <div className="w-full h-[600px] bg-blue-900/20 rounded-xl flex items-center justify-center">
        <p className="text-white">Loading map...</p>
      </div>
    );
  }

  const radarTileUrl = radarFrames[currentFrame]
    ? `https://tilecache.rainviewer.com${radarFrames[currentFrame].path}/256/{z}/{x}/{y}/4/1_1.png`
    : '';

  return (
    <div className="space-y-4">
      {/* Layer Controls */}
      <div className="flex gap-2 flex-wrap items-center">
        <button
          onClick={() => setRadarLayer('precipitation')}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            radarLayer === 'precipitation'
              ? 'bg-blue-500 text-white shadow-lg'
              : 'bg-white/10 text-blue-200 hover:bg-white/20'
          }`}
        >
          ☔ Live Radar
        </button>
        <button
          onClick={() => setRadarLayer('clouds')}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            radarLayer === 'clouds'
              ? 'bg-blue-500 text-white shadow-lg'
              : 'bg-white/10 text-blue-200 hover:bg-white/20'
          }`}
        >
          ☁️ Clouds
        </button>
        <button
          onClick={() => setRadarLayer('temperature')}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            radarLayer === 'temperature'
              ? 'bg-blue-500 text-white shadow-lg'
              : 'bg-white/10 text-blue-200 hover:bg-white/20'
          }`}
        >
          🌡️ Temp
        </button>
        
        {radarLayer === 'precipitation' && radarFrames.length > 0 && (
          <button
            onClick={toggleAnimation}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              isAnimating
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-purple-500 hover:bg-purple-600 text-white'
            }`}
          >
            {isAnimating ? '⏸️ Pause' : '▶️ Animate (2h)'}
          </button>
        )}
        
        <button
          onClick={fetchRadarData}
          className="px-4 py-2 rounded-lg font-medium bg-green-500 hover:bg-green-600 text-white transition-all duration-200 shadow-lg"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Animation Info */}
      {radarLayer === 'precipitation' && radarFrames.length > 0 && (
        <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
          <div className="flex items-center justify-between text-sm">
            <span className="text-blue-200">
              {isAnimating ? '🎬 Playing radar animation' : '📸 Showing latest radar frame'}
            </span>
            <span className="text-blue-300">
              Frame {currentFrame + 1} of {radarFrames.length} • 
              {new Date(radarFrames[currentFrame].time * 1000).toLocaleTimeString()}
            </span>
          </div>
        </div>
      )}

      {/* Map */}
      <div className="w-full h-[600px] rounded-xl overflow-hidden border-2 border-white/20 shadow-2xl">
        <MapContainer
          center={position}
          zoom={8}
          minZoom={6}
          maxZoom={12}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
          zoomControl={true}
        >
          {/* Base Map Layer - Classic OpenStreetMap Style */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={12}
          />

          {/* Weather Overlay Layer */}
          {radarLayer === 'precipitation' && radarTileUrl ? (
            <TileLayer
              url={radarTileUrl}
              attribution='&copy; <a href="https://www.rainviewer.com">RainViewer</a>'
              opacity={0.75}
              zIndex={10}
              maxZoom={12}
            />
          ) : (
            <TileLayer
              url={getOpenWeatherLayerUrl(radarLayer)}
              attribution='Weather data &copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>'
              opacity={0.65}
              zIndex={10}
              maxZoom={12}
            />
          )}

          {/* City Marker */}
          <Marker position={position}>
            <Popup>
              <strong>{cityName}</strong>
              <br />
              Current Location
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* Enhanced Legend */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
        <h3 className="text-white font-semibold mb-3">
          {radarLayer === 'precipitation' ? '🌧️ Precipitation Intensity' : '📊 Layer Information'}
        </h3>
        {radarLayer === 'precipitation' ? (
          <>
            <div className="flex items-center gap-4 text-sm text-blue-200 flex-wrap mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-4 rounded" style={{ background: 'rgba(100, 200, 255, 0.9)' }}></div>
                <span className="font-medium">Light</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-4 rounded" style={{ background: 'rgba(0, 150, 255, 1)' }}></div>
                <span className="font-medium">Moderate</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-4 rounded" style={{ background: 'rgba(255, 200, 0, 1)' }}></div>
                <span className="font-medium">Heavy</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-4 rounded" style={{ background: 'rgba(255, 100, 0, 1)' }}></div>
                <span className="font-medium">Very Heavy</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-4 rounded" style={{ background: 'rgba(255, 0, 0, 1)' }}></div>
                <span className="font-medium">Extreme</span>
              </div>
            </div>
            <p className="text-blue-300 text-xs">
              ℹ️ Live NOAA/NWS doppler radar data via RainViewer • Updates every 10 minutes
            </p>
          </>
        ) : (
          <p className="text-blue-200 text-sm">
            Showing {radarLayer} overlay for {cityName} area • Scroll to zoom, drag to pan
          </p>
        )}
      </div>
    </div>
  );
}

function getOpenWeatherLayerUrl(layer: 'precipitation' | 'clouds' | 'temperature'): string {
  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || '2da56c3b5f37ea8efa1783a594ef791f';
  const layerMap = {
    precipitation: 'precipitation_new',
    clouds: 'clouds_new',
    temperature: 'temp_new',
  };
  
  return `https://tile.openweathermap.org/map/${layerMap[layer]}/{z}/{x}/{y}.png?appid=${apiKey}`;
}
