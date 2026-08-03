import React, { useState } from 'react';
import { NeuConfig } from '../types';
import { NeuCard } from '../../assets/components/NeuCard';
import { NeuButton } from '../../assets/components/NeuButton';
import { NeuBadge } from '../../assets/components/NeuBadge';
import { isDarkColor } from '../../assets/neumorphic-theme';
import { Sparkles, ExternalLink, Maximize2, X, Music, LayoutDashboard, HeartPulse, Thermometer, Layers } from 'lucide-react';

// Import generated inspiration gallery images
import imgMusicPlayer from '../assets/images/neu_music_player_1785796032398.jpg';
import imgDashboard from '../assets/images/neu_dashboard_1785796102686.jpg';
import imgFitnessTracker from '../assets/images/neu_fitness_tracker_1785796139306.jpg';
import imgSmartThermostat from '../assets/images/neu_smart_thermostat_1785796151208.jpg';

export interface InspirationItem {
  id: string;
  title: string;
  category: 'audio' | 'dashboard' | 'health' | 'iot';
  categoryLabel: string;
  description: string;
  imageSrc: string;
  tags: string[];
  icon: React.ReactNode;
  highlights: string[];
}

const INSPIRATION_GALLERY: InspirationItem[] = [
  {
    id: 'neu-music-player',
    title: 'Tactile Audio Player',
    category: 'audio',
    categoryLabel: 'Audio & Media',
    description: 'A tactile mobile music interface with soft extruded play/pause buttons, circular volume dial, and smooth progress tracking.',
    imageSrc: imgMusicPlayer,
    tags: ['Soft UI', 'Music App', 'Circular Dials', 'Volume Sliders'],
    icon: <Music className="w-4 h-4 text-pink-500" />,
    highlights: ['Inset volume ring', 'Embossed play controls', 'Glow track progress']
  },
  {
    id: 'neu-dashboard',
    title: 'Telemetry Analytics Dashboard',
    category: 'dashboard',
    categoryLabel: 'Telemetry & IoT',
    description: 'Real-time telemetry and energy monitoring dashboard with extruded metric cards, tactile toggle switches, and soft shadow charts.',
    imageSrc: imgDashboard,
    tags: ['Dashboard', 'IoT', 'Metrics', 'Dual Shadows'],
    icon: <LayoutDashboard className="w-4 h-4 text-blue-500" />,
    highlights: ['Extruded chart cards', 'Tactile toggle switches', 'Glow indicators']
  },
  {
    id: 'neu-fitness',
    title: 'Biometric Activity Tracker',
    category: 'health',
    categoryLabel: 'Health & Fitness',
    description: 'Health monitor app featuring soft pill buttons, circular progress goal ring with dual inner/outer shadows, and clean pulse graphs.',
    imageSrc: imgFitnessTracker,
    tags: ['Fitness', 'Health UI', 'Activity Rings', 'Graphs'],
    icon: <HeartPulse className="w-4 h-4 text-red-500" />,
    highlights: ['Circular ring shadow', 'Pill status badges', 'Pulse rate display']
  },
  {
    id: 'neu-thermostat',
    title: 'Smart Climate Thermostat',
    category: 'iot',
    categoryLabel: 'Smart Home',
    description: 'Modern smart home temperature controller with a large central soft tactile dial, subtle glow accents, and minimalist mode toggles.',
    imageSrc: imgSmartThermostat,
    tags: ['Smart Home', 'Thermostat', 'Dial Control', 'Minimalist'],
    icon: <Thermometer className="w-4 h-4 text-amber-500" />,
    highlights: ['Tactile rotary dial', 'Mode toggle buttons', 'Ambient glow indicator']
  }
];

interface DesignInspirationProps {
  config: NeuConfig;
}

export const DesignInspiration: React.FC<DesignInspirationProps> = ({ config }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeModalItem, setActiveModalItem] = useState<InspirationItem | null>(null);

  const isDark = isDarkColor(config.bgColor);

  const filteredGallery = selectedCategory === 'all'
    ? INSPIRATION_GALLERY
    : INSPIRATION_GALLERY.filter((item) => item.category === selectedCategory);

  return (
    <section id="design-inspiration-section" className="w-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight" style={{ color: isDark ? '#ffffff' : '#111827' }}>
              Design Inspiration & Real-World UI Examples
            </h2>
            <p className="text-xs opacity-70">
              High-resolution real-world Neumorphic application mockups and interfaces
            </p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <NeuButton
            config={config}
            size="sm"
            active={selectedCategory === 'all'}
            onClick={() => setSelectedCategory('all')}
          >
            All Showcase
          </NeuButton>
          <NeuButton
            config={config}
            size="sm"
            active={selectedCategory === 'audio'}
            onClick={() => setSelectedCategory('audio')}
          >
            Audio & Media
          </NeuButton>
          <NeuButton
            config={config}
            size="sm"
            active={selectedCategory === 'dashboard'}
            onClick={() => setSelectedCategory('dashboard')}
          >
            Dashboards
          </NeuButton>
          <NeuButton
            config={config}
            size="sm"
            active={selectedCategory === 'health'}
            onClick={() => setSelectedCategory('health')}
          >
            Fitness & Health
          </NeuButton>
          <NeuButton
            config={config}
            size="sm"
            active={selectedCategory === 'iot'}
            onClick={() => setSelectedCategory('iot')}
          >
            Smart Home
          </NeuButton>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredGallery.map((item) => (
          <NeuCard
            key={item.id}
            config={config}
            className="flex flex-col overflow-hidden group transition-all duration-300 hover:-translate-y-1"
          >
            {/* Image Container with Zoom Overlay */}
            <div
              className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-black/5 cursor-pointer group"
              onClick={() => setActiveModalItem(item)}
            >
              <img
                src={item.imageSrc}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 text-white">
                <span className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold flex items-center gap-1.5 shadow-lg">
                  <Maximize2 className="w-3.5 h-3.5" /> Inspect Full Image
                </span>
              </div>
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 rounded-full bg-black/60 text-white backdrop-blur-md text-[11px] font-semibold flex items-center gap-1.5">
                  {item.icon}
                  {item.categoryLabel}
                </span>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-4 flex flex-col gap-3 flex-1 justify-between">
              <div className="flex flex-col gap-1.5">
                <h3 className="text-base font-bold tracking-tight" style={{ color: isDark ? '#ffffff' : '#111827' }}>
                  {item.title}
                </h3>
                <p className="text-xs opacity-75 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Highlights */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {item.highlights.map((hl, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-2 py-0.5 rounded-md font-mono bg-black/5 dark:bg-white/10 opacity-80"
                  >
                    • {hl}
                  </span>
                ))}
              </div>

              {/* Tags & Action */}
              <div className="flex items-center justify-between pt-2 border-t border-black/5 dark:border-white/5">
                <div className="flex flex-wrap gap-1">
                  {item.tags.map((tag) => (
                    <NeuBadge key={tag} config={config} variant="accent">
                      {tag}
                    </NeuBadge>
                  ))}
                </div>
                <NeuButton
                  config={config}
                  size="sm"
                  onClick={() => setActiveModalItem(item)}
                  icon={<ExternalLink className="w-3.5 h-3.5" />}
                >
                  View
                </NeuButton>
              </div>
            </div>
          </NeuCard>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeModalItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setActiveModalItem(null)}
        >
          <div
            className="max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl p-6 flex flex-col gap-4 shadow-2xl relative"
            style={{
              background: config.bgColor,
              color: isDark ? '#ffffff' : '#111827'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-4">
              <div className="flex items-center gap-2">
                {activeModalItem.icon}
                <h3 className="text-lg font-bold">{activeModalItem.title}</h3>
                <span className="text-xs opacity-60 font-mono">({activeModalItem.categoryLabel})</span>
              </div>
              <NeuButton
                config={config}
                size="sm"
                onClick={() => setActiveModalItem(null)}
                icon={<X className="w-4 h-4" />}
              >
                Close
              </NeuButton>
            </div>

            {/* Modal Image */}
            <div className="w-full rounded-xl overflow-hidden bg-black/10 border border-black/5 dark:border-white/5 shadow-inner">
              <img
                src={activeModalItem.imageSrc}
                alt={activeModalItem.title}
                referrerPolicy="no-referrer"
                className="w-full h-auto max-h-[60vh] object-contain mx-auto"
              />
            </div>

            {/* Modal Footer Description */}
            <div className="flex flex-col gap-2 pt-2">
              <p className="text-sm opacity-85 leading-relaxed">
                {activeModalItem.description}
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {activeModalItem.tags.map((tag) => (
                  <NeuBadge key={tag} config={config} variant="glow">
                    #{tag}
                  </NeuBadge>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
