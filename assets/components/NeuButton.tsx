import React, { useState } from 'react';
import { NeuConfig } from '../../src/types';
import { getNeuStyles, adjustColor, isDarkColor } from '../neumorphic-theme';

export interface NeuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  config: NeuConfig;
  variant?: 'flat' | 'concave' | 'convex' | 'pressed' | 'accent' | 'glow';
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const NeuButton: React.FC<NeuButtonProps> = ({
  config,
  variant,
  size = 'md',
  active = false,
  children,
  icon,
  className = '',
  onClick,
  disabled,
  style: customStyle,
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const currentShape = active || isPressed ? 'pressed' : (variant === 'accent' || variant === 'glow' ? 'convex' : (variant || config.shape));
  
  const buttonConfig: NeuConfig = {
    ...config,
    shape: currentShape
  };

  const isDark = isDarkColor(config.bgColor);
  const baseStyles = getNeuStyles(buttonConfig);

  // Size sizing
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs font-medium gap-1.5',
    md: 'px-4 py-2.5 text-sm font-semibold gap-2',
    lg: 'px-6 py-3.5 text-base font-bold gap-3'
  }[size];

  let textStyle: React.CSSProperties = {
    color: isDark ? '#f3f4f6' : '#374151'
  };

  if (variant === 'accent') {
    textStyle = {
      color: '#ffffff',
      background: `linear-gradient(135deg, ${config.accentColor}, ${adjustColor(config.accentColor, -30)})`,
      boxShadow: active 
        ? `inset 2px 2px 5px rgba(0,0,0,0.4)` 
        : `0 4px 12px ${config.accentColor}40`
    };
  } else if (variant === 'glow') {
    textStyle = {
      color: config.accentColor,
      textShadow: `0 0 8px ${config.accentColor}80`
    };
  }

  if (active) {
    textStyle.color = config.accentColor;
  }

  return (
    <button
      {...props}
      disabled={disabled}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onClick={onClick}
      style={{
        ...baseStyles,
        ...textStyle,
        ...customStyle,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        outline: 'none'
      }}
      className={`inline-flex items-center justify-center select-none active:scale-[0.98] transition-transform duration-150 ${sizeClasses} ${className}`}
    >
      {icon && <span className="inline-flex shrink-0 items-center justify-center">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
