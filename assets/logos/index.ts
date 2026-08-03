// assets/logos/index.ts
// Neumorphic & Modern SVG Branding Logos and Generators

export interface LogoPreset {
  id: string;
  name: string;
  description: string;
  svgContent: string;
}

export const LOGO_COLLECTION: LogoPreset[] = [
  {
    id: 'neu-cube',
    name: 'Neumorphic Prism',
    description: '3D Soft extruded geometric prism logo',
    svgContent: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <defs>
    <linearGradient id="prismGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3b82f6" />
      <stop offset="100%" stop-color="#8b5cf6" />
    </linearGradient>
    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="4" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  <rect x="20" y="20" width="60" height="60" rx="16" fill="currentColor" opacity="0.1" />
  <path d="M50 22 L78 38 L78 70 L50 86 L22 70 L22 38 Z" fill="url(#prismGrad)" filter="url(#softGlow)" />
  <path d="M50 22 L78 38 L50 54 L22 38 Z" fill="#ffffff" opacity="0.3" />
  <path d="M50 54 L50 86 L22 70 Z" fill="#000000" opacity="0.15" />
</svg>`
  },
  {
    id: 'neu-sphere',
    name: 'Soft Orb',
    description: 'Minimal tactile rounded sphere mark',
    svgContent: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <defs>
    <radialGradient id="orbGrad" cx="35%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9" />
      <stop offset="40%" stop-color="#60a5fa" />
      <stop offset="100%" stop-color="#1d4ed8" />
    </radialGradient>
  </defs>
  <circle cx="50" cy="50" r="36" fill="url(#orbGrad)" />
  <circle cx="50" cy="50" r="32" stroke="currentColor" stroke-width="2" stroke-opacity="0.15" />
</svg>`
  },
  {
    id: 'neu-layers',
    name: 'Tactile Stack',
    description: 'Stacked neumorphic layers branding icon',
    svgContent: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <path d="M50 20 L85 36 L50 52 L15 36 Z" fill="#3b82f6" opacity="0.9" />
  <path d="M15 48 L50 64 L85 48 L85 54 L50 70 L15 54 Z" fill="#2563eb" opacity="0.75" />
  <path d="M15 66 L50 82 L85 66 L85 72 L50 88 L15 72 Z" fill="#1d4ed8" opacity="0.6" />
</svg>`
  },
  {
    id: 'neu-monogram',
    name: 'Neumorphism Monogram',
    description: 'Interlocking N monogram logo mark',
    svgContent: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <rect x="15" y="15" width="70" height="70" rx="20" fill="currentColor" opacity="0.05" />
  <path d="M30 70 V30 L55 60 V30 M55 30 H70 V70 L45 40 V70" stroke="#3b82f6" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" />
</svg>`
  }
];

export function getLogoSvg(id: string): string {
  const logo = LOGO_COLLECTION.find((l) => l.id === id);
  return logo ? logo.svgContent : LOGO_COLLECTION[0].svgContent;
}
