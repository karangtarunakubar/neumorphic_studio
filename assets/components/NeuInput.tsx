import React from 'react';
import { NeuConfig } from '../../src/types';
import { getNeuStyles, isDarkColor } from '../neumorphic-theme';

export interface NeuInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  config: NeuConfig;
  label?: string;
  icon?: React.ReactNode;
  error?: string;
}

export const NeuInput: React.FC<NeuInputProps> = ({
  config,
  label,
  icon,
  error,
  className = '',
  style: customStyle,
  ...props
}) => {
  // Inputs in Neumorphism typically use an INSET (pressed) shadow to feel sunken
  const inputConfig: NeuConfig = {
    ...config,
    shape: 'pressed',
    elevation: Math.max(3, Math.round(config.elevation * 0.7)),
    blur: Math.max(6, Math.round(config.blur * 0.7))
  };

  const isDark = isDarkColor(config.bgColor);
  const insetStyles = getNeuStyles(inputConfig);

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-semibold tracking-wide uppercase opacity-80 pl-1" style={{ color: isDark ? '#9ca3af' : '#4b5563' }}>
          {label}
        </label>
      )}
      <div className="relative flex items-center w-full">
        {icon && (
          <span className="absolute left-3.5 z-10 shrink-0 pointer-events-none opacity-60" style={{ color: isDark ? '#d1d5db' : '#374151' }}>
            {icon}
          </span>
        )}
        <input
          {...props}
          style={{
            ...insetStyles,
            color: isDark ? '#f9fafb' : '#111827',
            paddingLeft: icon ? '2.5rem' : '1rem',
            ...customStyle
          }}
          className={`w-full py-2.5 pr-4 text-sm font-medium outline-none transition-all placeholder:text-gray-400 focus:ring-2 ${className}`}
        />
      </div>
      {error && <span className="text-xs text-red-500 pl-1">{error}</span>}
    </div>
  );
};
