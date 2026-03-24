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

export default function RadarMap({ lat, lon, cityName }: Props) {
  const [weatherLayer, setWeatherLayer] = useState<'radar' | 'clouds' | 'temperature'>('radar');
  const [mounted, setMounted] = useState(false);
  const [timestamp, setTimestamp] = useState(Date.now());
  const position: LatLngExpression = [lat, lon];

  useEffect(() => {
    setMounted(true);
    fixLeafletIcons();
  }, []);

  const refreshData = () => {
    setTimestamp(Date.now());
  };

  if (!mounted) {
    return (
      <div className="w-full h-[600px] bg-blue-100 rounded-xl flex items-center justify-center border-2 border-blue-300">
        <p className="text-blue-900">Loading map...</p>
      </div>
    );
  }

  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || '2da56c3b5f37ea8efa1783a594ef791f';

  return (
    <div className="space-y-4">
      {/* Layer Controls */}
      <div className="flex gap-2 flex-wrap items-center">
        <button
          onClick={() => setWeatherLayer('radar')}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            weatherLayer === 'radar'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-white text-blue-600 border-2 border-blue-300 hover:bg-blue-50'
          }`}
        >
          ☔ Precipitation
        </button>
        <button
          onClick={() => setWeatherLayer('clouds')}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            weatherLayer === 'clouds'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-white text-blue-600 border-2 border-blue-300 hover:bg-blue-50'
          }`}
        >
          ☁️ Cloud Cover
        </button>
        <button
          onClick={() => setWeatherLayer('temperature')}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            weatherLayer === 'temperature'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-white text-blue-600 border-2 border-blue-300 hover:bg-blue-50'
          }`}
        >
          🌡️ Temperature
        </button>
        
        <button
          onClick={refreshData}
          className="px-4 py-2 rounded-lg font-medium bg-green-500 hover:bg-green-600 text-white transition-all duration-200 shadow-lg"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border-2 border-blue-300 rounded-lg px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">ℹ️</span>
          <div>
            <p className="text-blue-900 font-medium">
              Showing {weatherLayer === 'radar' ? 'precipitation radar' : weatherLayer === 'clouds' ? 'cloud coverage' : 'temperature'} for {cityName}
            </p>
            <p className="text-blue-700 text-sm">
              Zoom in/out and drag to explore • Weather data updates in real-time
            </p>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="w-full h-[600px] rounded-xl overflow-hidden border-4 border-blue-300 shadow-2xl bg-white">
        <MapContainer
          center={position}
          zoom={8}
          minZoom={6}
          maxZoom={12}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
          zoomControl={true}
        >
          {/* Classic OpenStreetMap Base - Bright Style */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />

          {/* Weather Overlay from OpenWeatherMap */}
          <TileLayer
            url={getWeatherLayerUrl(weatherLayer, apiKey, timestamp)}
            attribution='Weather &copy; <a href="https://openweathermap.org">OpenWeatherMap</a>'
            opacity={0.7}
            zIndex={10}
            maxZoom={12}
          />

          {/* City Marker */}
          <Marker position={position}>
            <Popup>
              <div className="text-center">
                <strong className="text-lg">{cityName}</strong>
                <br />
                <span className="text-sm text-gray-600">Current Location</span>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="bg-white border-2 border-blue-300 rounded-lg p-4 shadow-lg">
        <h3 className="text-blue-900 font-bold mb-3 text-lg">
          {weatherLayer === 'radar' ? '🌧️ Precipitation Intensity' : 
           weatherLayer === 'clouds' ? '☁️ Cloud Coverage' : 
           '🌡️ Temperature Range'}
        </h3>
        
        {weatherLayer === 'radar' && (
          <>
            <div className="flex items-center gap-4 flex-wrap mb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-6 rounded border border-gray-300" style={{ background: 'rgba(100, 200, 255, 0.8)' }}></div>
                <span className="text-blue-900 font-medium">Light Rain</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-6 rounded border border-gray-300" style={{ background: 'rgba(0, 150, 255, 1)' }}></div>
                <span className="text-blue-900 font-medium">Moderate</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-6 rounded border border-gray-300" style={{ background: 'rgba(255, 200, 0, 1)' }}></div>
                <span className="text-blue-900 font-medium">Heavy</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-6 rounded border border-gray-300" style={{ background: 'rgba(255, 0, 0, 1)' }}></div>
                <span className="text-blue-900 font-medium">Extreme</span>
              </div>
            </div>
            <p className="text-blue-700 text-sm">
              💡 Real-time precipitation radar from OpenWeatherMap • No precipitation visible = clear weather
            </p>
          </>
        )}
        
        {weatherLayer === 'clouds' && (
          <p className="text-blue-700">
            White/light areas indicate cloud coverage. Darker areas are clear skies.
          </p>
        )}
        
        {weatherLayer === 'temperature' && (
          <>
            <div className="flex items-center gap-3 flex-wrap mb-2">
              <div className="flex items-center gap-2">
                <div className="w-10 h-6 rounded border border-gray-300" style={{ background: '#0000FF' }}></div>
                <span className="text-blue-900">Cold</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-6 rounded border border-gray-300" style={{ background: '#00FF00' }}></div>
                <span className="text-blue-900">Mild</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-6 rounded border border-gray-300" style={{ background: '#FFFF00' }}></div>
                <span className="text-blue-900">Warm</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-6 rounded border border-gray-300" style={{ background: '#FF0000' }}></div>
                <span className="text-blue-900">Hot</span>
              </div>
            </div>
            <p className="text-blue-700 text-sm">Temperature gradient overlay</p>
          </>
        )}
      </div>
    </div>
  );
}

function getWeatherLayerUrl(layer: 'radar' | 'clouds' | 'temperature', apiKey: string, timestamp: number): string {
  const layerMap = {
    radar: 'precipitation_new',
    clouds: 'clouds_new',
    temperature: 'temp_new',
  };
  
  // Add timestamp to prevent caching
  return `https://tile.openweathermap.org/map/${layerMap[layer]}/{z}/{x}/{y}.png?appid=${apiKey}&t=${timestamp}`;
}
