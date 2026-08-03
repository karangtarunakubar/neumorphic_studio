import React from 'react';
import { NeuConfig } from '../../src/types';
import { getNeuStyles, isDarkColor, adjustColor } from '../neumorphic-theme';

export interface NeuSwitchProps {
  config: NeuConfig;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export const NeuSwitch: React.FC<NeuSwitchProps> = ({
  config,
  checked,
  onChange,
  label,
  disabled = false
}) => {
  // Switch track uses inset shadow
  const trackConfig: NeuConfig = {
    ...config,
    shape: 'pressed',
    radius: 9999,
    elevation: Math.max(3, Math.round(config.elevation * 0.75)),
    blur: Math.max(6, Math.round(config.blur * 0.75))
  };

  // Knob uses raised outset shadow
  const knobConfig: NeuConfig = {
    ...config,
    shape: 'flat',
    radius: 9999,
    elevation: Math.max(3, Math.round(config.elevation * 0.6)),
    blur: Math.max(5, Math.round(config.blur * 0.6))
  };

  const isDark = isDarkColor(config.bgColor);
  const trackStyles = getNeuStyles(trackConfig);
  const knobStyles = getNeuStyles(knobConfig);

  return (
    <label className={`inline-flex items-center gap-3 cursor-pointer select-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <div
        onClick={() => !disabled && onChange(!checked)}
        style={{
          ...trackStyles,
          width: '56px',
          height: '30px',
          padding: '3px',
          background: checked ? adjustColor(config.accentColor, isDark ? -10 : 20) : trackStyles.background
        }}
        className="relative flex items-center transition-all duration-300 rounded-full"
      >
        <div
          style={{
            ...knobStyles,
            width: '24px',
            height: '24px',
            transform: checked ? 'translateX(26px)' : 'translateX(0px)',
            background: checked ? config.accentColor : knobStyles.background
          }}
          className="rounded-full shadow-md transition-transform duration-300 ease-out flex items-center justify-center shrink-0"
        >
          {checked && (
            <div className="w-1.5 h-1.5 rounded-full bg-white shadow-inner" />
          )}
        </div>
      </div>
      {label && (
        <span className="text-sm font-semibold" style={{ color: isDark ? '#e5e7eb' : '#374151' }}>
          {label}
        </span>
      )}
    </label>
  );
};
