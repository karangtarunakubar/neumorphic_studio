import React, { useState } from 'react';
import { NeuConfig } from '../../src/types';
import { getNeuStyles, isDarkColor } from '../neumorphic-theme';
import { NeuButton } from './NeuButton';
import { NeuInput } from './NeuInput';
import { NeuBadge } from './NeuBadge';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import {
  MapPin,
  Navigation,
  ZoomIn,
  ZoomOut,
  Layers,
  Compass,
  Search,
  Key,
  Star,
  ExternalLink,
  Sliders,
  Maximize2,
  Check,
  Locate
} from 'lucide-react';

export interface NeuMapMarker {
  id: string;
  lat: number;
  lng: number;
  title: string;
  category: 'coffee' | 'ev' | 'iot' | 'hub';
  categoryLabel: string;
  address: string;
  rating?: number;
  status?: 'Active' | 'Occupied' | 'Online';
  description?: string;
  svgX?: number; // for SVG fallback map placement (%)
  svgY?: number;
}

export interface NeuMapProps {
  config: NeuConfig;
  height?: string | number;
  className?: string;
  defaultZoom?: number;
  markers?: NeuMapMarker[];
  onMarkerSelect?: (marker: NeuMapMarker) => void;
}

const DEFAULT_MARKERS: NeuMapMarker[] = [
  {
    id: 'm-1',
    lat: 37.7749,
    lng: -122.4194,
    svgX: 38,
    svgY: 42,
    title: 'Neumorphic Innovation Lab',
    category: 'hub',
    categoryLabel: 'Tech Hub',
    address: '742 Soft UI Way, San Francisco, CA',
    rating: 4.9,
    status: 'Online',
    description: 'Central design laboratory for soft shadows and tactile user interfaces.'
  },
  {
    id: 'm-2',
    lat: 37.7833,
    lng: -122.4167,
    svgX: 52,
    svgY: 30,
    title: 'Tactile Artisan Coffee',
    category: 'coffee',
    categoryLabel: 'Café & Roastery',
    address: '108 Embossed Street, San Francisco, CA',
    rating: 4.8,
    status: 'Active',
    description: 'Specialty espresso with warm neutral decor and quiet workspaces.'
  },
  {
    id: 'm-3',
    lat: 37.765,
    lng: -122.431,
    svgX: 25,
    svgY: 65,
    title: 'Supercharge EV Station',
    category: 'ev',
    categoryLabel: 'Charging Station',
    address: '350 Convex Park Ave, San Francisco, CA',
    rating: 4.7,
    status: 'Active',
    description: '250kW Ultra-fast DC charging with soft ambient glow indicators.'
  },
  {
    id: 'm-4',
    lat: 37.769,
    lng: -122.408,
    svgX: 68,
    svgY: 58,
    title: 'Smart Mesh Gateway #4',
    category: 'iot',
    categoryLabel: 'Telemetry Sensor',
    address: '55 Inset Grove, San Francisco, CA',
    rating: 5.0,
    status: 'Online',
    description: 'Real-time environmental sensor hub measuring humidity, noise & light levels.'
  }
];

export const NeuMap: React.FC<NeuMapProps> = ({
  config,
  height = '420px',
  className = '',
  defaultZoom = 13,
  markers = DEFAULT_MARKERS,
  onMarkerSelect
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(defaultZoom);
  const [selectedMarker, setSelectedMarker] = useState<NeuMapMarker | null>(markers[0]);
  const [mapMode, setMapMode] = useState<'vector' | 'satellite' | 'dark'>('vector');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);

  const isDark = isDarkColor(config.bgColor);

  const apiKey =
    process.env.GOOGLE_MAPS_PLATFORM_KEY ||
    (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
    '';
  const hasValidKey = Boolean(apiKey) && apiKey !== 'YOUR_API_KEY';

  const filteredMarkers = markers.filter((m) => {
    const matchesCategory = filterCategory === 'all' || m.category === filterCategory;
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const baseStyles = getNeuStyles(config);

  return (
    <div
      className={`w-full rounded-2xl flex flex-col gap-4 p-4 sm:p-6 overflow-hidden relative ${className}`}
      style={{
        ...baseStyles,
        color: isDark ? '#ffffff' : '#111827'
      }}
    >
      {/* Map Header & Controls */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md shrink-0">
            <Navigation className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base tracking-tight flex items-center gap-2">
              <span>Neumorphic Map & Navigation Controls</span>
              <NeuBadge config={config} variant="glow">
                {hasValidKey ? 'Google Maps API' : 'Interactive Soft UI Canvas'}
              </NeuBadge>
            </h3>
            <p className="text-xs opacity-70">
              Tactile map navigation, location telemetry, and POI discovery
            </p>
          </div>
        </div>

        {/* Top Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Layer Selector */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-black/5 dark:bg-white/5">
            <button
              onClick={() => setMapMode('vector')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                mapMode === 'vector' ? 'bg-blue-500 text-white shadow-sm' : 'opacity-70 hover:opacity-100'
              }`}
            >
              Stylized
            </button>
            <button
              onClick={() => setMapMode('dark')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                mapMode === 'dark' ? 'bg-indigo-600 text-white shadow-sm' : 'opacity-70 hover:opacity-100'
              }`}
            >
              Dark Map
            </button>
            <button
              onClick={() => setMapMode('satellite')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                mapMode === 'satellite' ? 'bg-emerald-600 text-white shadow-sm' : 'opacity-70 hover:opacity-100'
              }`}
            >
              Satellite
            </button>
          </div>

          {!hasValidKey && (
            <NeuButton
              config={config}
              size="sm"
              icon={<Key className="w-3.5 h-3.5 text-amber-500" />}
              onClick={() => setShowKeyModal(true)}
            >
              API Key Setup
            </NeuButton>
          )}
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 z-10">
        <div className="md:col-span-7 lg:col-span-8">
          <NeuInput
            config={config}
            placeholder="Search places, addresses, tech hubs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>
        <div className="md:col-span-5 lg:col-span-4 flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['all', 'hub', 'coffee', 'ev', 'iot'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all border ${
                filterCategory === cat
                  ? 'bg-blue-500/20 border-blue-500 text-blue-600 dark:text-blue-400 font-bold'
                  : 'bg-black/5 dark:bg-white/5 border-transparent opacity-75 hover:opacity-100'
              }`}
            >
              {cat === 'all' ? 'All Places' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map Rendering Box */}
      <div
        className="w-full rounded-xl overflow-hidden relative border border-black/10 dark:border-white/10 shadow-inner group transition-all"
        style={{ height }}
      >
        {/* Real Google Map if Key is Available */}
        {hasValidKey ? (
          <APIProvider apiKey={apiKey} version="weekly">
            <Map
              defaultCenter={{ lat: 37.7749, lng: -122.4194 }}
              defaultZoom={zoomLevel}
              mapId="DEMO_MAP_ID"
              internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
              style={{ width: '100%', height: '100%' }}
              colorScheme={mapMode === 'dark' ? 'DARK' : 'LIGHT'}
            >
              {filteredMarkers.map((m) => (
                <AdvancedMarker
                  key={m.id}
                  position={{ lat: m.lat, lng: m.lng }}
                  onClick={() => {
                    setSelectedMarker(m);
                    if (onMarkerSelect) onMarkerSelect(m);
                  }}
                >
                  <Pin
                    background={
                      m.category === 'hub' ? '#3b82f6' : m.category === 'coffee' ? '#f59e0b' : m.category === 'ev' ? '#10b981' : '#8b5cf6'
                    }
                    glyphColor="#ffffff"
                  />
                </AdvancedMarker>
              ))}

              {selectedMarker && (
                <InfoWindow
                  position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
                  onCloseClick={() => setSelectedMarker(null)}
                >
                  <div className="p-2 text-gray-900 max-w-xs">
                    <h4 className="font-bold text-sm">{selectedMarker.title}</h4>
                    <p className="text-xs text-gray-600 mb-1">{selectedMarker.address}</p>
                    <p className="text-xs opacity-80">{selectedMarker.description}</p>
                  </div>
                </InfoWindow>
              )}
            </Map>
          </APIProvider>
        ) : (
          /* Interactive Tactile Soft UI SVG Canvas Map Fallback */
          <div
            className={`w-full h-full relative flex items-center justify-center select-none transition-colors duration-500 ${
              mapMode === 'dark'
                ? 'bg-slate-900 text-slate-100'
                : mapMode === 'satellite'
                ? 'bg-emerald-950 text-emerald-100'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100'
            }`}
          >
            {/* SVG Roads & Topo Background Pattern */}
            <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              {/* Stylized River Path */}
              <path
                d="M -20 150 Q 150 80, 300 200 T 600 120 T 1000 280"
                fill="none"
                stroke={mapMode === 'dark' ? '#1e3a8a' : '#93c5fd'}
                strokeWidth="24"
                strokeLinecap="round"
                opacity="0.6"
              />
              {/* Major Roads */}
              <path
                d="M 50 -10 L 400 500 M 0 250 L 800 250 M 600 0 L 200 600"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                opacity="0.25"
              />
            </svg>

            {/* Render Map Markers */}
            <div className="absolute inset-0 p-8">
              {filteredMarkers.map((m) => {
                const isSelected = selectedMarker?.id === m.id;
                return (
                  <div
                    key={m.id}
                    className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 z-20 group"
                    style={{
                      left: `${m.svgX || 50}%`,
                      top: `${m.svgY || 50}%`
                    }}
                    onClick={() => {
                      setSelectedMarker(m);
                      if (onMarkerSelect) onMarkerSelect(m);
                    }}
                  >
                    {/* Marker Pin */}
                    <div className="relative flex flex-col items-center">
                      {/* Pulse Ring */}
                      <span className="absolute -inset-2 rounded-full bg-blue-500/20 animate-ping" />

                      <div
                        className={`p-2.5 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
                          isSelected
                            ? 'bg-blue-600 text-white scale-125 ring-4 ring-blue-400/40 z-30'
                            : 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 hover:scale-110'
                        }`}
                      >
                        <MapPin className="w-5 h-5" />
                      </div>

                      {/* Label Tag */}
                      <div
                        className={`mt-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold shadow-md whitespace-nowrap backdrop-blur-md transition-all ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-white/90 dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 opacity-90 group-hover:opacity-100'
                        }`}
                      >
                        {m.title}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Tactile Neumorphic Floating Map Controls Overlay (Bottom-Right) */}
            <div className="absolute bottom-4 right-4 z-30 flex flex-col gap-2">
              <NeuButton
                config={config}
                size="sm"
                onClick={() => setZoomLevel((z) => Math.min(z + 1, 18))}
                icon={<ZoomIn className="w-4 h-4" />}
              />
              <NeuButton
                config={config}
                size="sm"
                onClick={() => setZoomLevel((z) => Math.max(z - 1, 8))}
                icon={<ZoomOut className="w-4 h-4" />}
              />
              <NeuButton
                config={config}
                size="sm"
                onClick={() => {
                  if (markers.length > 0) setSelectedMarker(markers[0]);
                }}
                icon={<Locate className="w-4 h-4 text-blue-500" />}
              />
            </div>

            {/* Map Telemetry Watermark Overlay (Bottom-Left) */}
            <div className="absolute bottom-4 left-4 z-30 px-3 py-1.5 rounded-xl bg-black/40 text-white backdrop-blur-md text-[11px] font-mono flex items-center gap-2">
              <Compass className="w-3.5 h-3.5 text-blue-400 animate-spin-slow" />
              <span>37.7749° N, 122.4194° W</span>
              <span className="opacity-50">|</span>
              <span>Zoom: {zoomLevel}x</span>
            </div>
          </div>
        )}
      </div>

      {/* Selected Location Details Panel */}
      {selectedMarker && (
        <div
          className="p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 animate-in fade-in slide-in-from-bottom-2 duration-200 z-10"
        >
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500 shrink-0 mt-0.5">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm tracking-tight">{selectedMarker.title}</h4>
                <NeuBadge config={config} statusColor="#10b981">
                  {selectedMarker.status || 'Active'}
                </NeuBadge>
              </div>
              <p className="text-xs opacity-75">{selectedMarker.address}</p>
              {selectedMarker.description && (
                <p className="text-xs opacity-60 mt-1">{selectedMarker.description}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            {selectedMarker.rating && (
              <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-lg">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{selectedMarker.rating}</span>
              </div>
            )}
            <NeuButton
              config={config}
              size="sm"
              variant="accent"
              icon={<Navigation className="w-3.5 h-3.5" />}
              onClick={() => {
                alert(`Starting route turn-by-turn guidance to ${selectedMarker.title}`);
              }}
            >
              Get Directions
            </NeuButton>
          </div>
        </div>
      )}

      {/* Google Maps API Key Setup Modal */}
      {showKeyModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setShowKeyModal(false)}
        >
          <div
            className="max-w-md w-full rounded-2xl p-6 flex flex-col gap-4 shadow-2xl relative"
            style={{
              background: config.bgColor,
              color: isDark ? '#ffffff' : '#111827'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-base">Google Maps Platform Key</h3>
              </div>
              <button
                onClick={() => setShowKeyModal(false)}
                className="text-xs font-bold px-2 py-1 rounded bg-black/10 dark:bg-white/10"
              >
                ✕
              </button>
            </div>

            <p className="text-xs opacity-80 leading-relaxed">
              To render live Google Maps vectors, satellite tiles, and places search in AI Studio:
            </p>

            <ol className="text-xs opacity-85 list-decimal list-inside space-y-2 font-mono">
              <li>Open <strong>Settings</strong> (⚙️ gear icon, top-right)</li>
              <li>Select <strong>Secrets</strong></li>
              <li>Add secret: <code>GOOGLE_MAPS_PLATFORM_KEY</code></li>
              <li>Paste your Google Maps API Key and press Enter</li>
            </ol>

            <div className="pt-2 flex justify-end">
              <NeuButton
                config={config}
                size="sm"
                onClick={() => setShowKeyModal(false)}
              >
                Got It
              </NeuButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
