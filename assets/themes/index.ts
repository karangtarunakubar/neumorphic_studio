// assets/themes/index.ts
// Neumorphic Theme Catalog, Palette Presets, and Theme Styles Exports

export {
  NEUMORPHIC_PRESETS,
  DEFAULT_NEU_CONFIG,
  getNeuStyles,
  getCssShadowString,
  getCssVariablesString,
  getShadowColors,
  getShadowOffsets,
  adjustColor,
  hexToRgb,
  isDarkColor
} from '../neumorphic-theme';

export interface ThemePalette {
  id: string;
  name: string;
  category: 'light' | 'dark' | 'clay' | 'vibrant';
  bgColor: string;
  accentColor: string;
  secondaryColor: string;
  textColor: string;
}

export const EXTRA_PALETTES: ThemePalette[] = [
  {
    id: 'rose-gold',
    name: 'Rose Gold Clay',
    category: 'clay',
    bgColor: '#f4e8e8',
    accentColor: '#f43f5e',
    secondaryColor: '#fb7185',
    textColor: '#4c0519'
  },
  {
    id: 'emerald-soft',
    name: 'Mint Emerald',
    category: 'light',
    bgColor: '#e3f2ed',
    accentColor: '#059669',
    secondaryColor: '#34d399',
    textColor: '#064e3b'
  },
  {
    id: 'nordic-snow',
    name: 'Nordic Snow',
    category: 'light',
    bgColor: '#f0f4f8',
    accentColor: '#2563eb',
    secondaryColor: '#60a5fa',
    textColor: '#0f172a'
  },
  {
    id: 'oled-pure',
    name: 'OLED Pure Black',
    category: 'dark',
    bgColor: '#121214',
    accentColor: '#38bdf8',
    secondaryColor: '#818cf8',
    textColor: '#f8fafc'
  }
];
