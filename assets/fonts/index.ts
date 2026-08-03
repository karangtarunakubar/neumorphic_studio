// assets/fonts/index.ts
// Typography & Web Font System Definitions

export interface FontDefinition {
  id: string;
  name: string;
  family: string;
  category: 'sans-serif' | 'serif' | 'monospace' | 'display';
  googleFontUrl?: string;
  fallback: string;
  recommendedUsage: string;
}

export const SYSTEM_FONTS: FontDefinition[] = [
  {
    id: 'plus-jakarta',
    name: 'Plus Jakarta Sans',
    family: "'Plus Jakarta Sans', sans-serif",
    category: 'sans-serif',
    googleFontUrl: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap',
    fallback: 'system-ui, -apple-system, sans-serif',
    recommendedUsage: 'Primary UI typography, tactile buttons, headers'
  },
  {
    id: 'outfit',
    name: 'Outfit',
    family: "'Outfit', sans-serif",
    category: 'display',
    googleFontUrl: 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap',
    fallback: 'sans-serif',
    recommendedUsage: 'Modern geometric displays & soft neumorphic titles'
  },
  {
    id: 'inter',
    name: 'Inter',
    family: "'Inter', sans-serif",
    category: 'sans-serif',
    googleFontUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
    fallback: 'system-ui, sans-serif',
    recommendedUsage: 'Clean body text, code values, parameters'
  },
  {
    id: 'fira-code',
    name: 'Fira Code',
    family: "'Fira Code', monospace",
    category: 'monospace',
    googleFontUrl: 'https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&display=swap',
    fallback: 'monospace',
    recommendedUsage: 'JSX code snippets, CSS shadow strings, tokens'
  }
];

export function loadGoogleFont(fontUrl: string): void {
  if (typeof document === 'undefined') return;
  const existingLink = document.querySelector(`link[href="${fontUrl}"]`);
  if (!existingLink) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = fontUrl;
    document.head.appendChild(link);
  }
}

export function loadAllSystemFonts(): void {
  SYSTEM_FONTS.forEach((font) => {
    if (font.googleFontUrl) {
      loadGoogleFont(font.googleFontUrl);
    }
  });
}
