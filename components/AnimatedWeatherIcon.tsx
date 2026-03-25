'use client';

import { useEffect, useState } from 'react';

interface Props {
  condition: string; // rain, snow, clear, clouds, etc.
  size?: 'sm' | 'md' | 'lg';
}

export default function AnimatedWeatherIcon({ condition, size = 'md' }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  const normalizedCondition = condition.toLowerCase();

  // Determine which animation to show
  if (normalizedCondition.includes('rain') || normalizedCondition.includes('drizzle')) {
    return <RainAnimation size={sizeClasses[size]} />;
  }
  
  if (normalizedCondition.includes('snow')) {
    return <SnowAnimation size={sizeClasses[size]} />;
  }
  
  if (normalizedCondition.includes('thunder') || normalizedCondition.includes('storm')) {
    return <ThunderstormAnimation size={sizeClasses[size]} />;
  }
  
  if (normalizedCondition.includes('clear')) {
    return <SunAnimation size={sizeClasses[size]} />;
  }
  
  if (normalizedCondition.includes('cloud')) {
    return <CloudAnimation size={sizeClasses[size]} />;
  }

  // Default: static cloud
  return <CloudAnimation size={sizeClasses[size]} />;
}

function RainAnimation({ size }: { size: string }) {
  return (
    <div className={`relative ${size} flex items-center justify-center`}>
      {/* Cloud */}
      <div className="absolute top-0">
        <svg viewBox="0 0 100 60" className="w-full">
          <circle cx="30" cy="30" r="20" fill="#94a3b8" />
          <circle cx="50" cy="25" r="22" fill="#94a3b8" />
          <circle cx="70" cy="30" r="18" fill="#94a3b8" />
        </svg>
      </div>
      
      {/* Rain drops */}
      <div className="absolute top-12 left-0 right-0">
        <div className="animate-rain-drop-1 absolute left-[20%] w-0.5 h-3 bg-blue-400 rounded-full opacity-70"></div>
        <div className="animate-rain-drop-2 absolute left-[40%] w-0.5 h-3 bg-blue-400 rounded-full opacity-70"></div>
        <div className="animate-rain-drop-3 absolute left-[60%] w-0.5 h-3 bg-blue-400 rounded-full opacity-70"></div>
        <div className="animate-rain-drop-1 absolute left-[80%] w-0.5 h-3 bg-blue-400 rounded-full opacity-70" style={{ animationDelay: '0.3s' }}></div>
      </div>

      <style jsx>{`
        @keyframes rainDrop {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 0.7; }
          90% { opacity: 0.7; }
          100% { transform: translateY(20px); opacity: 0; }
        }
        .animate-rain-drop-1 { animation: rainDrop 0.8s infinite; }
        .animate-rain-drop-2 { animation: rainDrop 0.8s infinite 0.2s; }
        .animate-rain-drop-3 { animation: rainDrop 0.8s infinite 0.4s; }
      `}</style>
    </div>
  );
}

function SnowAnimation({ size }: { size: string }) {
  return (
    <div className={`relative ${size} flex items-center justify-center`}>
      {/* Cloud */}
      <div className="absolute top-0">
        <svg viewBox="0 0 100 60" className="w-full">
          <circle cx="30" cy="30" r="20" fill="#cbd5e1" />
          <circle cx="50" cy="25" r="22" fill="#cbd5e1" />
          <circle cx="70" cy="30" r="18" fill="#cbd5e1" />
        </svg>
      </div>
      
      {/* Snowflakes */}
      <div className="absolute top-12 left-0 right-0">
        <div className="animate-snow-fall-1 absolute left-[20%] text-white text-lg">❅</div>
        <div className="animate-snow-fall-2 absolute left-[45%] text-white text-lg">❅</div>
        <div className="animate-snow-fall-3 absolute left-[70%] text-white text-lg">❅</div>
      </div>

      <style jsx>{`
        @keyframes snowFall {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(25px) rotate(360deg); opacity: 0; }
        }
        .animate-snow-fall-1 { animation: snowFall 2s infinite; }
        .animate-snow-fall-2 { animation: snowFall 2s infinite 0.5s; }
        .animate-snow-fall-3 { animation: snowFall 2s infinite 1s; }
      `}</style>
    </div>
  );
}

function ThunderstormAnimation({ size }: { size: string }) {
  return (
    <div className={`relative ${size} flex items-center justify-center`}>
      {/* Dark cloud */}
      <div className="absolute top-0">
        <svg viewBox="0 0 100 60" className="w-full">
          <circle cx="30" cy="30" r="20" fill="#475569" />
          <circle cx="50" cy="25" r="22" fill="#475569" />
          <circle cx="70" cy="30" r="18" fill="#475569" />
        </svg>
      </div>
      
      {/* Lightning bolt */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2">
        <div className="animate-lightning text-yellow-300 text-2xl font-bold">⚡</div>
      </div>

      <style jsx>{`
        @keyframes lightning {
          0%, 45%, 55%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        .animate-lightning { animation: lightning 2s infinite; }
      `}</style>
    </div>
  );
}

function SunAnimation({ size }: { size: string }) {
  return (
    <div className={`relative ${size} flex items-center justify-center`}>
      <div className="animate-spin-slow">
        <svg viewBox="0 0 100 100" className="w-full">
          {/* Sun rays */}
          <line x1="50" y1="10" x2="50" y2="20" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
          <line x1="50" y1="80" x2="50" y2="90" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
          <line x1="10" y1="50" x2="20" y2="50" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
          <line x1="80" y1="50" x2="90" y2="50" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
          <line x1="20" y1="20" x2="27" y2="27" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
          <line x1="73" y1="73" x2="80" y2="80" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
          <line x1="80" y1="20" x2="73" y2="27" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
          <line x1="27" y1="73" x2="20" y2="80" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
          
          {/* Sun circle */}
          <circle cx="50" cy="50" r="20" fill="#fbbf24" />
        </svg>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
      `}</style>
    </div>
  );
}

function CloudAnimation({ size }: { size: string }) {
  return (
    <div className={`relative ${size} flex items-center justify-center`}>
      <div className="animate-float">
        <svg viewBox="0 0 100 60" className="w-full">
          <circle cx="30" cy="30" r="20" fill="#94a3b8" />
          <circle cx="50" cy="25" r="22" fill="#94a3b8" />
          <circle cx="70" cy="30" r="18" fill="#94a3b8" />
        </svg>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
