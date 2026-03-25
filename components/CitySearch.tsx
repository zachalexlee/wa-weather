'use client';

import { useState, useRef, useEffect } from 'react';
import { washingtonCities, type City } from '@/lib/cities';

interface Props {
  selectedCity: City;
  onCitySelect: (city: City) => void;
  theme: 'light' | 'dark';
}

export default function CitySearch({ selectedCity, onCitySelect, theme }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load recent searches:', e);
      }
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCitySelect = (city: City) => {
    onCitySelect(city);
    setIsOpen(false);
    setSearchQuery('');
    
    // Save to recent searches
    const newRecent = [city.name, ...recentSearches.filter(c => c !== city.name)].slice(0, 5);
    setRecentSearches(newRecent);
    localStorage.setItem('recentSearches', JSON.stringify(newRecent));
  };

  const filteredCities = searchQuery
    ? washingtonCities.filter(city =>
        city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.region.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : washingtonCities;

  const recentCities = washingtonCities.filter(city => recentSearches.includes(city.name));

  return (
    <div className="relative" ref={searchRef}>
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={isOpen ? searchQuery : selectedCity.name}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search cities..."
          className={`w-full px-4 py-2 pl-10 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 ${
            theme === 'dark'
              ? 'bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-blue-300'
              : 'bg-white border border-blue-300 text-blue-900 placeholder-blue-500'
          }`}
        />
        <span className="absolute left-3 top-2.5 text-xl">🔍</span>
      </div>

      {/* Dropdown Results */}
      {isOpen && (
        <div className={`absolute z-50 mt-2 w-full max-h-96 overflow-y-auto rounded-lg shadow-2xl border ${
          theme === 'dark'
            ? 'bg-blue-900/95 backdrop-blur-md border-white/20'
            : 'bg-white border-blue-300'
        }`}>
          {/* Recent Searches */}
          {!searchQuery && recentCities.length > 0 && (
            <div className="border-b border-white/10 pb-2">
              <div className={`px-4 py-2 text-sm font-semibold ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}>
                Recent Searches
              </div>
              {recentCities.map((city) => (
                <button
                  key={`recent-${city.name}`}
                  onClick={() => handleCitySelect(city)}
                  className={`w-full text-left px-4 py-2 transition-colors ${
                    theme === 'dark'
                      ? 'hover:bg-white/10 text-white'
                      : 'hover:bg-blue-50 text-blue-900'
                  } ${city.name === selectedCity.name ? (theme === 'dark' ? 'bg-blue-700' : 'bg-blue-100') : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{city.name}</span>
                    <span className={`text-sm ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}>
                      {city.region}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* All Cities */}
          <div className={`${!searchQuery && recentCities.length > 0 ? 'pt-2' : ''}`}>
            {!searchQuery && (
              <div className={`px-4 py-2 text-sm font-semibold ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}>
                All Cities
              </div>
            )}
            {filteredCities.length > 0 ? (
              filteredCities.map((city) => (
                <button
                  key={city.name}
                  onClick={() => handleCitySelect(city)}
                  className={`w-full text-left px-4 py-2 transition-colors ${
                    theme === 'dark'
                      ? 'hover:bg-white/10 text-white'
                      : 'hover:bg-blue-50 text-blue-900'
                  } ${city.name === selectedCity.name ? (theme === 'dark' ? 'bg-blue-700' : 'bg-blue-100') : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{city.name}</span>
                    <span className={`text-sm ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}>
                      {city.region}
                    </span>
                  </div>
                </button>
              ))
            ) : (
              <div className={`px-4 py-3 text-center ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}>
                No cities found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
