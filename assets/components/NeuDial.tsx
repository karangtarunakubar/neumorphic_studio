import React, { useState, useRef } from 'react';
import { NeuConfig } from '../../src/types';
import { getNeuStyles, isDarkColor } from '../neumorphic-theme';

export interface NeuDialProps {
  config: NeuConfig;
  min?: number;
  max?: number;
  value: number;
  onChange: (value: number) => void;
  size?: number;
  label?: string;
  unit?: string;
}

export const NeuDial: React.FC<NeuDialProps> = ({
  config,
  min = 0,
  max = 100,
  value,
  onChange,
  size = 120,
  label,
  unit = ''
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const knobRef = useRef<HTMLDivElement>(null);

  // Angle from -135deg to +135deg (total 270 deg sweep)
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  const angle = -135 + (percentage / 100) * 270;

  const dialConfig: NeuConfig = {
    ...config,
    shape: 'convex',
    radius: 9999,
    elevation: Math.max(6, Math.round(config.elevation * 0.9)),
    blur: Math.max(12, Math.round(config.blur * 0.9))
  };

  const isDark = isDarkColor(config.bgColor);
  const dialStyles = getNeuStyles(dialConfig);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    updateAngleFromEvent(e);
  };

  const updateAngleFromEvent = (e: React.PointerEvent | PointerEvent) => {
    if (!knobRef.current) return;
    const rect = knobRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;

    let rad = Math.atan2(dy, dx);
    let deg = rad * (180 / Math.PI) + 90; // normalize 0 top

    if (deg < -135) deg += 360;
    if (deg > 225) deg -= 360;

    // Constrain -135 to 135
    deg = Math.max(-135, Math.min(135, deg));

    const newPct = ((deg + 135) / 270) * 100;
    const newValue = Math.round(min + (newPct / 100) * (max - min));
    onChange(newValue);
  };

  React.useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (isDragging) {
        updateAngleFromEvent(e);
      }
    };
    const handlePointerUp = () => {
      if (isDragging) setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    }
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging]);

  return (
    <div className="flex flex-col items-center gap-2 select-none">
      <div
        ref={knobRef}
        onPointerDown={handlePointerDown}
        style={{
          ...dialStyles,
          width: `${size}px`,
          height: `${size}px`
        }}
        className="rounded-full relative flex items-center justify-center cursor-grab active:cursor-grabbing shrink-0"
      >
        {/* Outer tick ring / guide */}
        <div className="absolute inset-2 rounded-full border border-dashed opacity-20" style={{ borderColor: isDark ? '#ffffff' : '#000000' }} />

        {/* Center Indicator Dot & Pointer */}
        <div
          style={{
            transform: `rotate(${angle}deg)`,
            transition: isDragging ? 'none' : 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}
          className="absolute w-full h-full rounded-full flex justify-center p-2.5 pointer-events-none"
        >
          <div
            style={{
              background: config.accentColor,
              boxShadow: `0 0 10px ${config.accentColor}`
            }}
            className="w-3 h-3 rounded-full"
          />
        </div>

        {/* Dial Center Value */}
        <div className="text-center z-10 flex flex-col items-center pointer-events-none">
          <span className="text-xl font-bold tracking-tight" style={{ color: isDark ? '#f9fafb' : '#111827' }}>
            {value}{unit}
          </span>
          {label && (
            <span className="text-[10px] uppercase font-semibold tracking-wider opacity-60" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
              {label}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
