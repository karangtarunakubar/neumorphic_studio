import { CSSProperties } from 'react';
import { NeuConfig, LightAngle, ThemePreset, ComponentToken } from '../src/types';

// Helper to adjust color brightness (hex to hex)
export function adjustColor(hex: string, amount: number): string {
  let color = hex.replace('#', '');
  if (color.length === 3) {
    color = color.split('').map(c => c + c).join('');
  }
  const num = parseInt(color, 16);
  let r = (num >> 16) + amount;
  let g = ((num >> 8) & 0x00ff) + amount;
  let b = (num & 0x0000ff) + amount;

  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));

  return '#' + (g | (b << 8) | (r << 16)).toString(16).padStart(6, '0');
}

// Convert Hex to RGB object
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let color = hex.replace('#', '');
  if (color.length === 3) {
    color = color.split('').map(c => c + c).join('');
  }
  const num = parseInt(color, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

// Determine if a hex color is dark
export function isDarkColor(hex: string): boolean {
  const { r, g, b } = hexToRgb(hex);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.5;
}

// Get shadow coordinates based on angle & distance
export function getShadowOffsets(angle: LightAngle, distance: number): {
  lightX: number;
  lightY: number;
  darkX: number;
  darkY: number;
} {
  switch (angle) {
    case 'top-left':
      return { lightX: -distance, lightY: -distance, darkX: distance, darkY: distance };
    case 'top-right':
      return { lightX: distance, lightY: -distance, darkX: -distance, darkY: distance };
    case 'bottom-left':
      return { lightX: -distance, lightY: distance, darkX: distance, darkY: -distance };
    case 'bottom-right':
      return { lightX: distance, lightY: distance, darkX: -distance, darkY: -distance };
  }
}

// Generate light and dark shadow colors
export function getShadowColors(bgColor: string): { lightShadow: string; darkShadow: string } {
  const isDark = isDarkColor(bgColor);
  if (isDark) {
    // Dark mode neumorphic values
    return {
      lightShadow: adjustColor(bgColor, 18), // lighter top shadow
      darkShadow: adjustColor(bgColor, -18)   // deeper bottom shadow
    };
  } else {
    // Light mode neumorphic values
    return {
      lightShadow: adjustColor(bgColor, 35), // bright white-ish highlights
      darkShadow: adjustColor(bgColor, -28)   // soft dark gray shadow
    };
  }
}

// Generate inline React CSS properties for any Neumorphic Config
export function getNeuStyles(config: NeuConfig): CSSProperties {
  const { bgColor, elevation, blur, radius, shape, lightAngle, borderWidth, borderColor } = config;
  const { lightX, lightY, darkX, darkY } = getShadowOffsets(lightAngle, elevation);
  const { lightShadow, darkShadow } = getShadowColors(bgColor);

  let shadowCss = '';
  if (shape === 'pressed') {
    // Inset shadow for sunken/pressed effect
    shadowCss = `inset ${darkX}px ${darkY}px ${blur}px ${darkShadow}, inset ${lightX}px ${lightY}px ${blur}px ${lightShadow}`;
  } else {
    // Outset shadow for raised effect
    shadowCss = `${darkX}px ${darkY}px ${blur}px ${darkShadow}, ${lightX}px ${lightY}px ${blur}px ${lightShadow}`;
  }

  // Background style (flat, concave, convex)
  let backgroundStyle = bgColor;
  if (shape === 'concave') {
    const startCol = adjustColor(bgColor, -10);
    const endCol = adjustColor(bgColor, 12);
    backgroundStyle = `linear-gradient(145deg, ${startCol}, ${endCol})`;
  } else if (shape === 'convex') {
    const startCol = adjustColor(bgColor, 12);
    const endCol = adjustColor(bgColor, -10);
    backgroundStyle = `linear-gradient(145deg, ${startCol}, ${endCol})`;
  }

  const styles: CSSProperties = {
    background: backgroundStyle,
    boxShadow: shadowCss,
    borderRadius: `${radius}px`,
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
  };

  if (borderWidth > 0 && borderColor) {
    styles.border = `${borderWidth}px solid ${borderColor}`;
  }

  return styles;
}

// Generate raw CSS string for copy-pasting
export function getCssShadowString(config: NeuConfig): string {
  const { bgColor, elevation, blur, radius, shape, lightAngle } = config;
  const { lightX, lightY, darkX, darkY } = getShadowOffsets(lightAngle, elevation);
  const { lightShadow, darkShadow } = getShadowColors(bgColor);

  if (shape === 'pressed') {
    return `box-shadow: inset ${darkX}px ${darkY}px ${blur}px ${darkShadow}, inset ${lightX}px ${lightY}px ${blur}px ${lightShadow};\nbackground: ${bgColor};\nborder-radius: ${radius}px;`;
  }
  return `box-shadow: ${darkX}px ${darkY}px ${blur}px ${darkShadow}, ${lightX}px ${lightY}px ${blur}px ${lightShadow};\nbackground: ${bgColor};\nborder-radius: ${radius}px;`;
}

// Generate CSS Variables :root block for external design integration
export function getCssVariablesString(config: NeuConfig): string {
  const { bgColor, accentColor, elevation, blur, radius, shape, lightAngle } = config;
  const { lightX, lightY, darkX, darkY } = getShadowOffsets(lightAngle, elevation);
  const { lightShadow, darkShadow } = getShadowColors(bgColor);

  let shadowCss = '';
  if (shape === 'pressed') {
    shadowCss = `inset ${darkX}px ${darkY}px ${blur}px ${darkShadow}, inset ${lightX}px ${lightY}px ${blur}px ${lightShadow}`;
  } else {
    shadowCss = `${darkX}px ${darkY}px ${blur}px ${darkShadow}, ${lightX}px ${lightY}px ${blur}px ${lightShadow}`;
  }

  return `:root {
  --neu-bg: ${bgColor};
  --neu-accent: ${accentColor};
  --neu-elevation: ${elevation}px;
  --neu-blur: ${blur}px;
  --neu-radius: ${radius}px;
  --neu-light-angle: ${lightAngle};
  --neu-shadow-dark: ${darkX}px ${darkY}px ${blur}px ${darkShadow};
  --neu-shadow-light: ${lightX}px ${lightY}px ${blur}px ${lightShadow};
  --neu-box-shadow: ${shadowCss};
}`;
}

// Built-in Neumorphic Presets
export const NEUMORPHIC_PRESETS: ThemePreset[] = [
  {
    id: 'clay-light',
    name: 'Soft Clay Light',
    description: 'Classic crisp clay-like grey surface with soft depth',
    bgColor: '#e0e5ec',
    accentColor: '#3b82f6',
    elevation: 8,
    blur: 16,
    radius: 16,
    lightAngle: 'top-left',
    shape: 'flat',
    isDark: false
  },
  {
    id: 'warm-ivory',
    name: 'Warm Ivory Studio',
    description: 'Cozy warm neutral palette with serene tactile feels',
    bgColor: '#e8e5df',
    accentColor: '#f97316',
    elevation: 10,
    blur: 20,
    radius: 20,
    lightAngle: 'top-left',
    shape: 'flat',
    isDark: false
  },
  {
    id: 'slate-dark',
    name: 'Tactile Slate Dark',
    description: 'Deep midnight slate canvas with glowing accent glows',
    bgColor: '#232936',
    accentColor: '#10b981',
    elevation: 9,
    blur: 18,
    radius: 16,
    lightAngle: 'top-left',
    shape: 'flat',
    isDark: true
  },
  {
    id: 'cyber-dark',
    name: 'Obsidian Night',
    description: 'Ultra dark stealth mode with crisp contrast highlights',
    bgColor: '#181c24',
    accentColor: '#8b5cf6',
    elevation: 7,
    blur: 14,
    radius: 14,
    lightAngle: 'top-left',
    shape: 'flat',
    isDark: true
  },
  {
    id: 'pastel-sky',
    name: 'Pastel Blue Air',
    description: 'Soothing soft cyan tinted surface with gentle shadows',
    bgColor: '#e4ecf5',
    accentColor: '#0284c7',
    elevation: 8,
    blur: 16,
    radius: 18,
    lightAngle: 'top-left',
    shape: 'flat',
    isDark: false
  },
  {
    id: 'lavender-mist',
    name: 'Lavender Mist',
    description: 'Soft purple hue with elegant pastel depth and violet highlights',
    bgColor: '#e9e6f2',
    accentColor: '#8b5cf6',
    elevation: 8,
    blur: 16,
    radius: 18,
    lightAngle: 'top-left',
    shape: 'flat',
    isDark: false
  }
];

// Initial default config
export const DEFAULT_NEU_CONFIG: NeuConfig = {
  bgColor: '#e0e5ec',
  surfaceType: 'light',
  elevation: 8,
  blur: 16,
  radius: 16,
  shape: 'flat',
  lightAngle: 'top-left',
  accentColor: '#3b82f6',
  borderWidth: 0,
  borderColor: 'transparent'
};
