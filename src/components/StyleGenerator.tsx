import React, { useState } from 'react';
import { NeuConfig, LightAngle, NeuShape, ThemePreset } from '../types';
import { NeuCard } from '../../assets/components/NeuCard';
import { NeuButton } from '../../assets/components/NeuButton';
import { NeuSlider } from '../../assets/components/NeuSlider';
import { NeuSegmented } from '../../assets/components/NeuSegmented';
import { NeuBadge } from '../../assets/components/NeuBadge';
import {
  getCssShadowString,
  getCssVariablesString,
  getNeuStyles,
  getShadowColors,
  getShadowOffsets,
  isDarkColor,
  NEUMORPHIC_PRESETS
} from '../../assets/neumorphic-theme';
import {
  Sun,
  Palette,
  Sliders,
  Copy,
  Check,
  Code2,
  Compass,
  Zap,
  RotateCcw,
  Sparkles,
  Layers,
  Maximize2
} from 'lucide-react';

interface StyleGeneratorProps {
  config: NeuConfig;
  onChangeConfig: (newConfig: NeuConfig) => void;
  onApplyPreset: (preset: ThemePreset) => void;
}

export const StyleGenerator: React.FC<StyleGeneratorProps> = ({
  config,
  onChangeConfig,
  onApplyPreset
}) => {
  const [copiedCss, setCopiedCss] = useState(false);
  const [copiedJsx, setCopiedJsx] = useState(false);
  const [copiedVars, setCopiedVars] = useState(false);
  const [presetFilter, setPresetFilter] = useState<'all' | 'light' | 'dark'>('all');
  const [appliedPresetId, setAppliedPresetId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'controls' | 'code' | 'presets'>('controls');

  const handlePresetSelect = (preset: ThemePreset) => {
    setAppliedPresetId(preset.id);
    onApplyPreset(preset);
    setTimeout(() => setAppliedPresetId(null), 1800);
  };

  const isDark = isDarkColor(config.bgColor);

  const updateField = <K extends keyof NeuConfig>(field: K, value: NeuConfig[K]) => {
    onChangeConfig({
      ...config,
      [field]: value
    });
  };

  const cssString = getCssShadowString(config);
  const varsString = getCssVariablesString(config);

  const jsxString = `<div style={{
  background: '${config.bgColor}',
  borderRadius: '${config.radius}px',
  ${cssString.replace(/\n/g, '\n  ')}
}}>
  Neumorphic Element
</div>`;

  const copyToClipboard = (text: string, type: 'css' | 'jsx' | 'vars') => {
    navigator.clipboard.writeText(text);
    if (type === 'css') {
      setCopiedCss(true);
      setTimeout(() => setCopiedCss(false), 2000);
    } else if (type === 'jsx') {
      setCopiedJsx(true);
      setTimeout(() => setCopiedJsx(false), 2000);
    } else {
      setCopiedVars(true);
      setTimeout(() => setCopiedVars(false), 2000);
    }
  };

  // Light angle options
  const angleOptions: { id: LightAngle; label: string; icon: string }[] = [
    { id: 'top-left', label: 'Top-Left', icon: '↖' },
    { id: 'top-right', label: 'Top-Right', icon: '↗' },
    { id: 'bottom-left', label: 'Bottom-Left', icon: '↙' },
    { id: 'bottom-right', label: 'Bottom-Right', icon: '↘' }
  ];

  // Quick surface swatches
  const quickSwatches = [
    { name: 'Clay Light', hex: '#e0e5ec' },
    { name: 'Warm Ivory', hex: '#e8e5df' },
    { name: 'Soft Sky', hex: '#e4ecf5' },
    { name: 'Slate Dark', hex: '#232936' },
    { name: 'Obsidian', hex: '#181c24' },
    { name: 'Lavender', hex: '#e9e6f2' }
  ];

  const shapeOptions: { id: NeuShape; label: string }[] = [
    { id: 'flat', label: 'Flat' },
    { id: 'concave', label: 'Concave' },
    { id: 'convex', label: 'Convex' },
    { id: 'pressed', label: 'Inset' }
  ];

  // Quick depth intensity presets
  const shadowDepthPresets = [
    { label: 'Subtle', elevation: 4, blur: 10 },
    { label: 'Balanced', elevation: 12, blur: 24 },
    { label: 'Deep', elevation: 20, blur: 40 },
    { label: 'Extruded', elevation: 28, blur: 55 }
  ];

  const shadowOffsets = getShadowOffsets(config.lightAngle, config.elevation);
  const shadowColors = getShadowColors(config.bgColor);

  return (
    <NeuCard id="style-generator-card" config={config} className="w-full flex flex-col gap-6">
      {/* Header Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-opacity-10" style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-blue-500" />
          <h2 className="text-lg font-bold tracking-tight" style={{ color: isDark ? '#ffffff' : '#111827' }}>
            Neumorphic Visual Shadow Studio
          </h2>
        </div>

        <NeuSegmented
          config={config}
          size="sm"
          value={activeTab}
          onChange={(v) => setActiveTab(v as any)}
          options={[
            { id: 'controls', label: 'Customizer', icon: <Palette className="w-3.5 h-3.5" /> },
            { id: 'presets', label: 'Preset Library', icon: <Zap className="w-3.5 h-3.5 text-amber-500" /> },
            { id: 'code', label: 'CSS / Code', icon: <Code2 className="w-3.5 h-3.5" /> }
          ]}
        />
      </div>

      {activeTab === 'controls' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Column 1: Color, Relief Shape & Light Source */}
          <div className="flex flex-col gap-5">
            {/* Background Color Picker & Swatches */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider opacity-70" style={{ color: isDark ? '#9ca3af' : '#4b5563' }}>
                Surface Background Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={config.bgColor}
                  onChange={(e) => updateField('bgColor', e.target.value)}
                  className="w-10 h-10 rounded-xl cursor-pointer border-2 border-white shadow-md bg-transparent shrink-0"
                />
                <input
                  type="text"
                  value={config.bgColor}
                  onChange={(e) => updateField('bgColor', e.target.value)}
                  className="px-3 py-1.5 text-sm font-mono font-semibold rounded-lg uppercase w-28 border border-gray-300 dark:border-gray-700 bg-transparent"
                  style={{ color: isDark ? '#f3f4f6' : '#111827' }}
                />
              </div>

              {/* Quick Swatches */}
              <div className="flex flex-wrap gap-2 mt-1">
                {quickSwatches.map((swatch) => (
                  <button
                    key={swatch.hex}
                    onClick={() => updateField('bgColor', swatch.hex)}
                    style={{ background: swatch.hex }}
                    className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 shadow-sm ${config.bgColor.toLowerCase() === swatch.hex ? 'border-blue-500 scale-110 ring-2 ring-blue-400' : 'border-white/50'}`}
                    title={swatch.name}
                  />
                ))}
              </div>
            </div>

            {/* Accent Color */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider opacity-70" style={{ color: isDark ? '#9ca3af' : '#4b5563' }}>
                Accent Tint Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={config.accentColor}
                  onChange={(e) => updateField('accentColor', e.target.value)}
                  className="w-10 h-10 rounded-xl cursor-pointer border-2 border-white shadow-md bg-transparent shrink-0"
                />
                <span className="text-xs font-semibold opacity-80" style={{ color: isDark ? '#d1d5db' : '#374151' }}>
                  Highlight Active State Tint
                </span>
              </div>
            </div>

            {/* Shape Selector - Button Selection Group */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider opacity-70 flex items-center justify-between" style={{ color: isDark ? '#9ca3af' : '#4b5563' }}>
                <span>Surface Relief Shape</span>
                <span className="text-[10px] font-mono capitalize opacity-70">Selected: {config.shape}</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {shapeOptions.map((shapeItem) => (
                  <NeuButton
                    key={shapeItem.id}
                    id={`btn-shape-${shapeItem.id}`}
                    config={config}
                    size="sm"
                    active={config.shape === shapeItem.id}
                    onClick={() => updateField('shape', shapeItem.id as NeuShape)}
                  >
                    {shapeItem.label}
                  </NeuButton>
                ))}
              </div>
            </div>

            {/* Light Source Direction */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider opacity-70 flex items-center gap-1.5" style={{ color: isDark ? '#9ca3af' : '#4b5563' }}>
                <Compass className="w-3.5 h-3.5 text-blue-500" />
                Light Source Direction
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {angleOptions.map((angle) => (
                  <NeuButton
                    key={angle.id}
                    config={config}
                    size="sm"
                    active={config.lightAngle === angle.id}
                    onClick={() => updateField('lightAngle', angle.id)}
                  >
                    <span className="text-base mr-1">{angle.icon}</span>
                    {angle.label}
                  </NeuButton>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: Visual Shadow Editor & Sliders */}
          <div className="flex flex-col gap-6 justify-between">
            {/* Visual Real-Time Shadow Preview Box */}
            <div
              className="p-6 rounded-2xl flex flex-col items-center justify-center gap-4 relative overflow-hidden transition-all duration-300 border border-black/5 dark:border-white/5"
              style={{
                background: config.bgColor
              }}
            >
              {/* Simulated Light Source Badge */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-black/5 dark:bg-white/10 backdrop-blur-sm">
                <Sun className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                <span>Angle: {config.lightAngle}</span>
              </div>

              {/* Interactive Neumorphic Shadow Element */}
              <div
                className="w-32 h-32 flex flex-col items-center justify-center p-3 text-center transition-all duration-200"
                style={getNeuStyles(config)}
              >
                <Layers className="w-8 h-8 mb-1" style={{ color: config.accentColor }} />
                <span className="text-xs font-black tracking-wider uppercase opacity-80">
                  {config.shape}
                </span>
                <span className="text-[10px] font-mono opacity-60">
                  {config.elevation}px / {config.blur}px
                </span>
              </div>

              {/* Real-time Shadow Metrics Readout */}
              <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-mono opacity-75">
                <span className="px-2 py-0.5 rounded bg-black/5 dark:bg-white/10">
                  Dark: {shadowOffsets.darkX}px, {shadowOffsets.darkY}px
                </span>
                <span className="px-2 py-0.5 rounded bg-black/5 dark:bg-white/10">
                  Light: {shadowOffsets.lightX}px, {shadowOffsets.lightY}px
                </span>
                <span className="px-2 py-0.5 rounded bg-black/5 dark:bg-white/10">
                  Blur: {config.blur}px
                </span>
              </div>
            </div>

            {/* Quick Depth Presets */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider opacity-70 flex items-center justify-between" style={{ color: isDark ? '#9ca3af' : '#4b5563' }}>
                <span>Light Intensity & Depth Presets</span>
                <span className="text-[10px] font-normal normal-case opacity-70">Instant Shadow Scale</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {shadowDepthPresets.map((dp) => (
                  <NeuButton
                    key={dp.label}
                    config={config}
                    size="sm"
                    active={config.elevation === dp.elevation && config.blur === dp.blur}
                    onClick={() => {
                      onChangeConfig({
                        ...config,
                        elevation: dp.elevation,
                        blur: dp.blur
                      });
                    }}
                  >
                    {dp.label}
                  </NeuButton>
                ))}
              </div>
            </div>

            {/* Elevation Depth / Distance Slider */}
            <div className="flex flex-col gap-1">
              <NeuSlider
                config={config}
                label="Light Intensity / Elevation Depth"
                unit="px"
                min={2}
                max={35}
                value={config.elevation}
                onChange={(val) => updateField('elevation', val)}
              />
              <span className="text-[11px] font-mono opacity-60 self-end">
                Offset: {config.elevation}px
              </span>
            </div>

            {/* Soft Shadow Blur Slider */}
            <div className="flex flex-col gap-1">
              <NeuSlider
                config={config}
                label="Soft Shadow Blur Radius"
                unit="px"
                min={4}
                max={65}
                value={config.blur}
                onChange={(val) => updateField('blur', val)}
              />
              <span className="text-[11px] font-mono opacity-60 self-end">
                Blur: {config.blur}px
              </span>
            </div>

            {/* Corner Border Radius Slider */}
            <NeuSlider
              config={config}
              label="Corner Border Radius"
              unit="px"
              min={0}
              max={50}
              value={config.radius}
              onChange={(val) => updateField('radius', val)}
            />

            {/* Reset Button */}
            <div className="flex justify-end pt-1">
              <NeuButton
                config={config}
                size="sm"
                onClick={() => onChangeConfig(NEUMORPHIC_PRESETS[0] as any)}
                icon={<RotateCcw className="w-3.5 h-3.5" />}
              >
                Reset Default
              </NeuButton>
            </div>
          </div>
        </div>
      )}

      {/* Preset Library Tab */}
      {activeTab === 'presets' && (
        <div className="flex flex-col gap-6">
          {/* Header & Category Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold tracking-tight uppercase opacity-80" style={{ color: isDark ? '#d1d5db' : '#374151' }}>
                Pre-configured Neumorphic Theme Sets
              </h3>
              <p className="text-xs opacity-60">
                Click any preset to instantly apply theme parameters with smooth CSS transitions
              </p>
            </div>

            <div className="flex items-center gap-2">
              <NeuButton
                config={config}
                size="sm"
                active={presetFilter === 'all'}
                onClick={() => setPresetFilter('all')}
              >
                All ({NEUMORPHIC_PRESETS.length})
              </NeuButton>
              <NeuButton
                config={config}
                size="sm"
                active={presetFilter === 'light'}
                onClick={() => setPresetFilter('light')}
              >
                Light ({NEUMORPHIC_PRESETS.filter(p => !p.isDark).length})
              </NeuButton>
              <NeuButton
                config={config}
                size="sm"
                active={presetFilter === 'dark'}
                onClick={() => setPresetFilter('dark')}
              >
                Dark ({NEUMORPHIC_PRESETS.filter(p => p.isDark).length})
              </NeuButton>
            </div>
          </div>

          {/* Preset Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {NEUMORPHIC_PRESETS
              .filter(preset => {
                if (presetFilter === 'light') return !preset.isDark;
                if (presetFilter === 'dark') return preset.isDark;
                return true;
              })
              .map((preset) => {
                const presetConfig: NeuConfig = {
                  bgColor: preset.bgColor,
                  surfaceType: preset.isDark ? 'dark' : 'light',
                  elevation: preset.elevation,
                  blur: preset.blur,
                  radius: preset.radius,
                  shape: preset.shape,
                  lightAngle: preset.lightAngle,
                  accentColor: preset.accentColor,
                  borderWidth: 0,
                  borderColor: 'transparent'
                };

                const isActive = config.bgColor.toLowerCase() === preset.bgColor.toLowerCase();
                const isJustApplied = appliedPresetId === preset.id;

                return (
                  <NeuCard
                    key={preset.id}
                    config={presetConfig}
                    hoverEffect
                    className={`cursor-pointer flex flex-col gap-4 justify-between transition-all duration-300 relative border ${
                      isActive
                        ? 'ring-2 ring-blue-500/80 shadow-lg scale-[1.01]'
                        : 'border-black/5 dark:border-white/5 hover:-translate-y-0.5'
                    }`}
                    onClick={() => handlePresetSelect(preset)}
                  >
                    {/* Active Checkmark Badge */}
                    {isActive && (
                      <div className="absolute top-3 right-3 flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white shadow-md z-10 animate-in fade-in zoom-in duration-200">
                        <Check className="w-3 h-3" />
                        <span>Active Theme</span>
                      </div>
                    )}

                    <div className="flex flex-col gap-3">
                      {/* Name and Accent Dot */}
                      <div className="flex items-center justify-between gap-2 pr-16">
                        <h4 className="font-bold text-sm tracking-tight" style={{ color: preset.isDark ? '#ffffff' : '#111827' }}>
                          {preset.name}
                        </h4>
                        <span
                          className="w-3.5 h-3.5 rounded-full ring-2 ring-black/10 dark:ring-white/20 shrink-0"
                          style={{ background: preset.accentColor }}
                          title={`Accent: ${preset.accentColor}`}
                        />
                      </div>

                      <p className="text-xs opacity-75 line-clamp-2 leading-relaxed" style={{ color: preset.isDark ? '#9ca3af' : '#4b5563' }}>
                        {preset.description}
                      </p>

                      {/* Live Miniature Neumorphic Preview Box */}
                      <div
                        className="w-full h-24 rounded-xl flex items-center justify-center p-3 relative overflow-hidden transition-all duration-300 border border-black/5 dark:border-white/5"
                        style={{ background: preset.bgColor }}
                      >
                        <div
                          className="px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all duration-200"
                          style={getNeuStyles(presetConfig)}
                        >
                          <span className="w-2.5 h-2.5 rounded-full" style={{ background: preset.accentColor }} />
                          <span style={{ color: preset.isDark ? '#e5e7eb' : '#1f2937' }}>
                            {preset.shape.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      {/* Technical Specs Readout */}
                      <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono opacity-80 pt-1">
                        <span className="px-2 py-0.5 rounded bg-black/5 dark:bg-white/10">
                          {preset.bgColor}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-black/5 dark:bg-white/10">
                          {preset.elevation}px / {preset.blur}px
                        </span>
                        <span className="px-2 py-0.5 rounded bg-black/5 dark:bg-white/10 uppercase">
                          {preset.isDark ? 'Dark Mode' : 'Light Mode'}
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <NeuButton
                      config={presetConfig}
                      size="sm"
                      variant={isActive ? 'accent' : 'glow'}
                      className="w-full justify-center font-bold"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePresetSelect(preset);
                      }}
                      icon={isJustApplied ? <Check className="w-4 h-4 text-emerald-500" /> : <Zap className="w-4 h-4 text-amber-500" />}
                    >
                      {isJustApplied ? 'Theme Applied!' : isActive ? 'Currently Active' : 'Apply Preset'}
                    </NeuButton>
                  </NeuCard>
                );
              })}
          </div>
        </div>
      )}

      {/* Code Inspector Tab */}
      {activeTab === 'code' && (
        <div className="flex flex-col gap-5">
          {/* CSS Variables (:root Block) */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider opacity-70" style={{ color: isDark ? '#9ca3af' : '#4b5563' }}>
                Standard CSS Variables (:root Block)
              </span>
              <NeuButton
                config={config}
                size="sm"
                onClick={() => copyToClipboard(varsString, 'vars')}
                icon={copiedVars ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              >
                {copiedVars ? 'Copied Variables!' : 'Copy CSS Variables'}
              </NeuButton>
            </div>
            <pre
              className="p-4 rounded-xl text-xs font-mono overflow-x-auto select-all shadow-inner border border-black/10 dark:border-white/10"
              style={{
                background: isDark ? '#111827' : '#f8fafc',
                color: isDark ? '#f472b6' : '#db2777'
              }}
            >
              {varsString}
            </pre>
          </div>

          {/* CSS Box Shadow Code */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider opacity-70" style={{ color: isDark ? '#9ca3af' : '#4b5563' }}>
                Generated CSS Box Shadow
              </span>
              <NeuButton
                config={config}
                size="sm"
                onClick={() => copyToClipboard(cssString, 'css')}
                icon={copiedCss ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              >
                {copiedCss ? 'Copied CSS!' : 'Copy CSS'}
              </NeuButton>
            </div>
            <pre
              className="p-4 rounded-xl text-xs font-mono overflow-x-auto select-all shadow-inner border border-black/10 dark:border-white/10"
              style={{
                background: isDark ? '#111827' : '#f8fafc',
                color: isDark ? '#38bdf8' : '#0284c7'
              }}
            >
              {cssString}
            </pre>
          </div>

          {/* React JSX Snippet */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider opacity-70" style={{ color: isDark ? '#9ca3af' : '#4b5563' }}>
                React JSX Inline Style
              </span>
              <NeuButton
                config={config}
                size="sm"
                onClick={() => copyToClipboard(jsxString, 'jsx')}
                icon={copiedJsx ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              >
                {copiedJsx ? 'Copied JSX!' : 'Copy JSX'}
              </NeuButton>
            </div>
            <pre
              className="p-4 rounded-xl text-xs font-mono overflow-x-auto select-all shadow-inner border border-black/10 dark:border-white/10"
              style={{
                background: isDark ? '#111827' : '#f8fafc',
                color: isDark ? '#a7f3d0' : '#059669'
              }}
            >
              {jsxString}
            </pre>
          </div>
        </div>
      )}
    </NeuCard>
  );
};
