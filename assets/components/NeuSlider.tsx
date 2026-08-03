import React from 'react';
import { NeuConfig } from '../../src/types';
import { getNeuStyles, isDarkColor } from '../neumorphic-theme';

export interface NeuSliderProps {
  config: NeuConfig;
  min?: number;
  max?: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  label?: string;
  unit?: string;
}

export const NeuSlider: React.FC<NeuSliderProps> = ({
  config,
  min = 0,
  max = 100,
  step = 1,
  value,
  onChange,
  label,
  unit = ''
}) => {
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  const trackConfig: NeuConfig = {
    ...config,
    shape: 'pressed',
    radius: 9999,
    elevation: Math.max(2, Math.round(config.elevation * 0.6)),
    blur: Math.max(4, Math.round(config.blur * 0.6))
  };

  const thumbConfig: NeuConfig = {
    ...config,
    shape: 'convex',
    radius: 9999,
    elevation: Math.max(4, Math.round(config.elevation * 0.7)),
    blur: Math.max(8, Math.round(config.blur * 0.7))
  };

  const isDark = isDarkColor(config.bgColor);
  const trackStyles = getNeuStyles(trackConfig);
  const thumbStyles = getNeuStyles(thumbConfig);

  return (
    <div className="w-full flex flex-col gap-2">
      {(label || value !== undefined) && (
        <div className="flex justify-between items-center text-xs font-semibold px-1" style={{ color: isDark ? '#d1d5db' : '#4b5563' }}>
          {label && <span>{label}</span>}
          <span>{value}{unit}</span>
        </div>
      )}
      <div className="relative w-full h-4 flex items-center">
        {/* Sunken track */}
        <div
          style={{ ...trackStyles }}
          className="w-full h-3 rounded-full relative overflow-hidden"
        >
          {/* Accent filled bar */}
          <div
            style={{
              width: `${percentage}%`,
              background: `linear-gradient(90deg, ${config.accentColor}90, ${config.accentColor})`
            }}
            className="h-full rounded-full transition-all duration-75"
          />
        </div>

        {/* Native range input overlay for accessibility and drag interaction */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute w-full h-full opacity-0 cursor-pointer z-20"
        />

        {/* Visual Raised Tactile Thumb */}
        <div
          style={{
            ...thumbStyles,
            left: `calc(${percentage}% - 12px)`,
            borderColor: config.accentColor,
            borderWidth: '2px'
          }}
          className="absolute w-6 h-6 rounded-full pointer-events-none z-10 top-1/2 -translate-y-1/2 flex items-center justify-center shadow-lg transition-all"
        >
          <div className="w-2 h-2 rounded-full" style={{ background: config.accentColor }} />
        </div>
      </div>
    </div>
  );
};
