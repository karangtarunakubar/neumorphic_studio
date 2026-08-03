import React from 'react';
import { NeuConfig } from '../../src/types';
import { getNeuStyles, isDarkColor } from '../neumorphic-theme';

export interface NeuSegmentedOption {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

export interface NeuSegmentedProps {
  config: NeuConfig;
  options: NeuSegmentedOption[];
  value: string;
  onChange: (id: string) => void;
  size?: 'sm' | 'md' | 'lg';
}

export const NeuSegmented: React.FC<NeuSegmentedProps> = ({
  config,
  options,
  value,
  onChange,
  size = 'md'
}) => {
  const containerConfig: NeuConfig = {
    ...config,
    shape: 'pressed',
    radius: 16,
    elevation: Math.max(3, Math.round(config.elevation * 0.7)),
    blur: Math.max(6, Math.round(config.blur * 0.7))
  };

  const isDark = isDarkColor(config.bgColor);
  const containerStyles = getNeuStyles(containerConfig);

  const activeBtnConfig: NeuConfig = {
    ...config,
    shape: 'convex',
    radius: 12,
    elevation: Math.max(3, Math.round(config.elevation * 0.6)),
    blur: Math.max(6, Math.round(config.blur * 0.6))
  };

  const activeStyles = getNeuStyles(activeBtnConfig);

  const paddingClasses = {
    sm: 'p-1 gap-1 text-xs',
    md: 'p-1.5 gap-1.5 text-sm',
    lg: 'p-2 gap-2 text-base'
  }[size];

  return (
    <div
      style={{ ...containerStyles }}
      className={`inline-flex items-center rounded-2xl w-full sm:w-auto ${paddingClasses}`}
    >
      {options.map((opt) => {
        const isActive = opt.id === value;
        return (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            style={
              isActive
                ? {
                    ...activeStyles,
                    color: config.accentColor,
                    fontWeight: 700
                  }
                : {
                    color: isDark ? '#9ca3af' : '#6b7280',
                    fontWeight: 500
                  }
            }
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-200 cursor-pointer select-none"
          >
            {opt.icon && <span className="shrink-0">{opt.icon}</span>}
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
};
