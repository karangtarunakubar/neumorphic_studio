import React from 'react';
import { NeuConfig } from '../../src/types';
import { getNeuStyles, isDarkColor } from '../neumorphic-theme';

export interface NeuBadgeProps {
  config: NeuConfig;
  label: string;
  statusColor?: string;
  pulse?: boolean;
}

export const NeuBadge: React.FC<NeuBadgeProps> = ({
  config,
  label,
  statusColor,
  pulse = false
}) => {
  const badgeConfig: NeuConfig = {
    ...config,
    shape: 'convex',
    radius: 9999,
    elevation: Math.max(2, Math.round(config.elevation * 0.5)),
    blur: Math.max(4, Math.round(config.blur * 0.5))
  };

  const isDark = isDarkColor(config.bgColor);
  const badgeStyles = getNeuStyles(badgeConfig);

  return (
    <div
      style={{
        ...badgeStyles,
        color: isDark ? '#e5e7eb' : '#374151'
      }}
      className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-wide select-none"
    >
      {statusColor && (
        <span className="relative flex h-2 w-2">
          {pulse && (
            <span
              style={{ background: statusColor }}
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
            />
          )}
          <span
            style={{ background: statusColor }}
            className="relative inline-flex rounded-full h-2 w-2"
          />
        </span>
      )}
      <span>{label}</span>
    </div>
  );
};
