import React from 'react';
import { NeuConfig } from '../../src/types';
import { getNeuStyles, isDarkColor } from '../neumorphic-theme';

export interface NeuProgressProps {
  config: NeuConfig;
  value: number; // 0 to 100
  label?: string;
  showPercentage?: boolean;
  variant?: 'linear' | 'radial';
  size?: number;
}

export const NeuProgress: React.FC<NeuProgressProps> = ({
  config,
  value = 0,
  label,
  showPercentage = true,
  variant = 'linear',
  size = 120
}) => {
  const percentage = Math.min(100, Math.max(0, value));

  const progressConfig: NeuConfig = {
    ...config,
    shape: 'pressed',
    radius: 9999,
    elevation: Math.max(3, Math.round(config.elevation * 0.7)),
    blur: Math.max(6, Math.round(config.blur * 0.7))
  };

  const isDark = isDarkColor(config.bgColor);
  const trackStyles = getNeuStyles(progressConfig);

  if (variant === 'radial') {
    const strokeWidth = 10;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="flex flex-col items-center gap-2">
        <div
          style={{ ...trackStyles, width: `${size}px`, height: `${size}px` }}
          className="rounded-full relative flex items-center justify-center p-2"
        >
          <svg width={size} height={size} className="transform -rotate-90">
            {/* Background Circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Animated Progress Circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={config.accentColor}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-500 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {showPercentage && (
              <span className="text-lg font-bold" style={{ color: isDark ? '#f9fafb' : '#111827' }}>
                {Math.round(percentage)}%
              </span>
            )}
            {label && (
              <span className="text-[10px] uppercase font-semibold opacity-60" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                {label}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-1.5">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center text-xs font-semibold px-1" style={{ color: isDark ? '#d1d5db' : '#4b5563' }}>
          {label && <span>{label}</span>}
          {showPercentage && <span>{Math.round(percentage)}%</span>}
        </div>
      )}
      <div
        style={{ ...trackStyles }}
        className="w-full h-4 rounded-full overflow-hidden relative"
      >
        <div
          style={{
            width: `${percentage}%`,
            background: `linear-gradient(90deg, ${config.accentColor}aa, ${config.accentColor})`
          }}
          className="h-full rounded-full transition-all duration-300 ease-out"
        />
      </div>
    </div>
  );
};
