// assets/images/index.ts
// Background Mesh Gradients, Noise Textures, & Procedural Image Assets

export interface ImageAsset {
  id: string;
  name: string;
  type: 'pattern' | 'mesh' | 'avatar' | 'noise';
  dataUrl: string;
}

// Generate subtle noise overlay SVG as data URL
export function generateNoiseTexture(opacity = 0.05): string {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'>
    <filter id='noise'>
      <feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/>
      <feColorMatrix type='saturate' values='0'/>
    </filter>
    <rect width='100%' height='100%' filter='url(#noise)' opacity='${opacity}'/>
  </svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

// Procedural SVG Mesh Gradient background
export function generateMeshGradient(color1 = '#3b82f6', color2 = '#8b5cf6', color3 = '#ec4899'): string {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600' width='100%' height='100%'>
    <defs>
      <radialGradient id='g1' cx='20%' cy='20%' r='60%'>
        <stop offset='0%' stop-color='${color1}' stop-opacity='0.6'/>
        <stop offset='100%' stop-color='${color1}' stop-opacity='0'/>
      </radialGradient>
      <radialGradient id='g2' cx='80%' cy='30%' r='60%'>
        <stop offset='0%' stop-color='${color2}' stop-opacity='0.6'/>
        <stop offset='100%' stop-color='${color2}' stop-opacity='0'/>
      </radialGradient>
      <radialGradient id='g3' cx='50%' cy='80%' r='70%'>
        <stop offset='0%' stop-color='${color3}' stop-opacity='0.5'/>
        <stop offset='100%' stop-color='${color3}' stop-opacity='0'/>
      </radialGradient>
    </defs>
    <rect width='100%' height='100%' fill='#e0e5ec'/>
    <rect width='100%' height='100%' fill='url(#g1)'/>
    <rect width='100%' height='100%' fill='url(#g2)'/>
    <rect width='100%' height='100%' fill='url(#g3)'/>
  </svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

// Generate Neumorphic SVG User Avatar
export function generateNeumorphicAvatar(seed = 'user', bgColor = '#e0e5ec', accentColor = '#3b82f6'): string {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'>
    <defs>
      <filter id='dropShadow' x='-20%' y='-20%' width='140%' height='140%'>
        <feDropShadow dx='2' dy='3' stdDeviation='2' flood-color='#000000' flood-opacity='0.15'/>
      </filter>
    </defs>
    <rect width='100' height='100' rx='50' fill='${bgColor}'/>
    <circle cx='50' cy='40' r='18' fill='${accentColor}' filter='url(#dropShadow)'/>
    <path d='M25 82 C25 65, 35 55, 50 55 C65 55, 75 65, 75 82 Z' fill='${accentColor}' opacity='0.85' filter='url(#dropShadow)'/>
  </svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

export const NOISE_TEXTURE_URL = generateNoiseTexture(0.04);
export const DEFAULT_MESH_GRADIENT = generateMeshGradient('#3b82f6', '#8b5cf6', '#38bdf8');
