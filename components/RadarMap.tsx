'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

export default function RadarMap({ lat, lon, cityName }: Props) {
  const [radarLayer, setRadarLayer] = useState<'precipitation' | 'clouds' | 'temperature'>('precipitation');
  const [mounted, setMounted] = useState(false);
  const position: LatLngExpression = [lat, lon];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-[500px] bg-blue-900/20 rounded-xl flex items-center justify-center">
        <p className="text-white">Loading map...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Layer Controls */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setRadarLayer('precipitation')}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            radarLayer === 'precipitation'
              ? 'bg-blue-500 text-white'
              : 'bg-white/10 text-blue-200 hover:bg-white/20'
          }`}
        >
          ☔ Precipitation
        </button>
        <button
          onClick={() => setRadarLayer('clouds')}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            radarLayer === 'clouds'
              ? 'bg-blue-500 text-white'
              : 'bg-white/10 text-blue-200 hover:bg-white/20'
          }`}
        >
          ☁️ Cloud Cover
        </button>
        <button
          onClick={() => setRadarLayer('temperature')}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            radarLayer === 'temperature'
              ? 'bg-blue-500 text-white'
              : 'bg-white/10 text-blue-200 hover:bg-white/20'
          }`}
        >
          🌡️ Temperature
        </button>
      </div>

      {/* Map */}
      <div className="w-full h-[500px] rounded-xl overflow-hidden border-2 border-white/20">
        <MapContainer
          center={position}
          zoom={9}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          {/* Base Map Layer */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Weather Overlay Layer */}
          <TileLayer
            url={getWeatherLayerUrl(radarLayer)}
            attribution='Weather data &copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>'
            opacity={0.6}
          />

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

      {/* Legend */}
      <div className="flex items-center gap-6 text-sm text-blue-200 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-300 rounded"></div>
          <span>Light</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span>Moderate</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-700 rounded"></div>
          <span>Heavy</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-600 rounded"></div>
          <span>Severe</span>
        </div>
      </div>
    </div>
  );
}

function getWeatherLayerUrl(layer: 'precipitation' | 'clouds' | 'temperature'): string {
  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || 'demo';
  const layerMap = {
    precipitation: 'precipitation_new',
    clouds: 'clouds_new',
    temperature: 'temp_new',
  };
  
  return `https://tile.openweathermap.org/map/${layerMap[layer]}/{z}/{x}/{y}.png?appid=${apiKey}`;
}
