import React from 'react';
import { NeuConfig } from '../../src/types';
import { getNeuStyles, isDarkColor } from '../neumorphic-theme';

export interface NeuCardProps extends React.HTMLAttributes<HTMLDivElement> {
  config: NeuConfig;
  variant?: 'flat' | 'concave' | 'convex' | 'pressed';
  hoverEffect?: boolean;
  children: React.ReactNode;
}

export const NeuCard: React.FC<NeuCardProps> = ({
  config,
  variant,
  hoverEffect = false,
  children,
  className = '',
  style: customStyle,
  ...props
}) => {
  const cardConfig: NeuConfig = {
    ...config,
    shape: variant || config.shape
  };

  const isDark = isDarkColor(config.bgColor);
  const baseStyles = getNeuStyles(cardConfig);

  return (
    <div
      {...props}
      style={{
        ...baseStyles,
        color: isDark ? '#f3f4f6' : '#1f2937',
        ...customStyle
      }}
      className={`p-5 relative ${hoverEffect ? 'hover:-translate-y-1 hover:shadow-lg transition-all duration-300' : ''} ${className}`}
    >
      {children}
    </div>
  );
};
