'use client';

import { useState, useEffect, useRef } from 'react';
import { ResponsiveGridLayout, LayoutItem, verticalCompactor } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { motion } from 'framer-motion';

type Layout = LayoutItem[];

interface WeatherData {
  temperature: number;
  feelsLike: number;
  description: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
}

interface CustomDashboardProps {
  weatherData: WeatherData;
  forecast: any[];
  alerts: any[];
}

// Widget components
const TempWidget = ({ data }: { data: WeatherData }) => (
  <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-xl border border-white/30 p-4">
    <div className="text-5xl font-bold">{Math.round(data.temperature)}°</div>
    <div className="text-sm text-white/70 mt-2">Feels like {Math.round(data.feelsLike)}°</div>
  </div>
);

const ConditionsWidget = ({ data }: { data: WeatherData }) => (
  <div className="h-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-xl border border-white/30 p-4">
    <h3 className="text-lg font-semibold mb-3">Conditions</h3>
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-white/70">Condition</span>
        <span className="font-medium">{data.description}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-white/70">Humidity</span>
        <span className="font-medium">{data.humidity}%</span>
      </div>
      <div className="flex justify-between">
        <span className="text-white/70">Wind</span>
        <span className="font-medium">{Math.round(data.windSpeed)} mph</span>
      </div>
      <div className="flex justify-between">
        <span className="text-white/70">Pressure</span>
        <span className="font-medium">{data.pressure} mb</span>
      </div>
    </div>
  </div>
);

const ForecastWidget = ({ forecast }: { forecast: any[] }) => (
  <div className="h-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-xl border border-white/30 p-4 overflow-auto">
    <h3 className="text-lg font-semibold mb-3">5-Day Forecast</h3>
    <div className="space-y-2">
      {forecast.slice(0, 5).map((day, idx) => (
        <div key={idx} className="flex items-center justify-between text-sm">
          <span className="text-white/70 w-16">{new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}</span>
          <span className="text-2xl mx-2">{day.weather?.[0]?.icon ? `http://openweathermap.org/img/wn/${day.weather[0].icon}.png` : '☀️'}</span>
          <span className="font-medium">{Math.round(day.temp?.max)}° / {Math.round(day.temp?.min)}°</span>
        </div>
      ))}
    </div>
  </div>
);

const AlertsWidget = ({ alerts }: { alerts: any[] }) => (
  <div className="h-full bg-gradient-to-br from-red-500/20 to-orange-500/20 backdrop-blur-sm rounded-xl border border-white/30 p-4 overflow-auto">
    <h3 className="text-lg font-semibold mb-3">🚨 Alerts</h3>
    {alerts.length === 0 ? (
      <div className="text-sm text-white/70">No active alerts</div>
    ) : (
      <div className="space-y-2">
        {alerts.slice(0, 3).map((alert, idx) => (
          <div key={idx} className="text-sm">
            <div className="font-medium">{alert.event}</div>
            <div className="text-white/70 text-xs">{alert.headline}</div>
          </div>
        ))}
      </div>
    )}
  </div>
);

const QuickStatsWidget = ({ data }: { data: WeatherData }) => (
  <div className="h-full bg-gradient-to-br from-green-500/20 to-teal-500/20 backdrop-blur-sm rounded-xl border border-white/30 p-4">
    <h3 className="text-lg font-semibold mb-3">Quick Stats</h3>
    <div className="grid grid-cols-2 gap-3">
      <div className="text-center">
        <div className="text-2xl font-bold">{Math.round(data.temperature)}°</div>
        <div className="text-xs text-white/70">Current</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold">{data.humidity}%</div>
        <div className="text-xs text-white/70">Humidity</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold">{Math.round(data.windSpeed)}</div>
        <div className="text-xs text-white/70">Wind mph</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold">{data.pressure}</div>
        <div className="text-xs text-white/70">Pressure</div>
      </div>
    </div>
  </div>
);

const WIDGETS = {
  temp: { component: TempWidget, title: 'Temperature', minW: 2, minH: 2 },
  conditions: { component: ConditionsWidget, title: 'Conditions', minW: 2, minH: 2 },
  forecast: { component: ForecastWidget, title: 'Forecast', minW: 2, minH: 3 },
  alerts: { component: AlertsWidget, title: 'Alerts', minW: 2, minH: 2 },
  quickstats: { component: QuickStatsWidget, title: 'Quick Stats', minW: 2, minH: 2 },
};

const DEFAULT_LAYOUT: Layout = [
  { i: 'temp', x: 0, y: 0, w: 3, h: 2 },
  { i: 'conditions', x: 3, y: 0, w: 3, h: 2 },
  { i: 'forecast', x: 0, y: 2, w: 4, h: 3 },
  { i: 'alerts', x: 4, y: 2, w: 2, h: 3 },
  { i: 'quickstats', x: 6, y: 0, w: 2, h: 2 },
];

export default function CustomDashboard({ weatherData, forecast, alerts }: CustomDashboardProps) {
  const [layouts, setLayouts] = useState<{ lg: Layout }>({ lg: DEFAULT_LAYOUT });
  const [isEditing, setIsEditing] = useState(false);
  const [width, setWidth] = useState(1200);
  const containerRef = useRef<HTMLDivElement>(null);

  // Measure container width
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setWidth(containerRef.current.offsetWidth);
      }
    };
    
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Load saved layout from localStorage
  useEffect(() => {
    const savedLayout = localStorage.getItem('dashboard-layout');
    if (savedLayout) {
      try {
        setLayouts(JSON.parse(savedLayout));
      } catch (e) {
        console.error('Failed to load layout:', e);
      }
    }
  }, []);

  const handleLayoutChange = (layout: readonly LayoutItem[], allLayouts: any) => {
    if (isEditing) {
      setLayouts(allLayouts);
      localStorage.setItem('dashboard-layout', JSON.stringify(allLayouts));
    }
  };

  const resetLayout = () => {
    setLayouts({ lg: DEFAULT_LAYOUT });
    localStorage.setItem('dashboard-layout', JSON.stringify({ lg: DEFAULT_LAYOUT }));
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-7xl mx-auto"
    >
      {/* Header Controls */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold">📊 Custom Dashboard</h2>
          <p className="text-sm text-white/70 mt-1">
            {isEditing ? 'Drag widgets to rearrange' : 'Your personalized weather view'}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              isEditing
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            {isEditing ? '✅ Done Editing' : '✏️ Edit Layout'}
          </button>
          {isEditing && (
            <button
              onClick={resetLayout}
              className="px-4 py-2 rounded-lg font-medium bg-white/10 hover:bg-white/20 transition-all"
            >
              🔄 Reset
            </button>
          )}
        </div>
      </div>

      {/* Grid Layout */}
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 8, md: 6, sm: 4, xs: 2, xxs: 2 }}
        rowHeight={80}
        width={width}
        onLayoutChange={handleLayoutChange}
        dragConfig={{ enabled: isEditing }}
        resizeConfig={{ enabled: isEditing }}
        compactor={verticalCompactor}
      >
        {Object.entries(WIDGETS).map(([key]) => {
          return (
            <div
              key={key}
              className={`${
                isEditing ? 'cursor-move border-2 border-dashed border-white/50' : ''
              }`}
            >
              {key === 'temp' && <TempWidget data={weatherData} />}
              {key === 'conditions' && <ConditionsWidget data={weatherData} />}
              {key === 'forecast' && <ForecastWidget forecast={forecast} />}
              {key === 'alerts' && <AlertsWidget alerts={alerts} />}
              {key === 'quickstats' && <QuickStatsWidget data={weatherData} />}
            </div>
          );
        })}
      </ResponsiveGridLayout>

      {/* Instructions */}
      {isEditing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 p-4 bg-blue-500/20 backdrop-blur-sm rounded-xl border border-white/30"
        >
          <p className="text-sm">
            💡 <strong>Tip:</strong> Drag widgets to rearrange them. Resize by dragging corners.
            Your layout is saved automatically!
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
