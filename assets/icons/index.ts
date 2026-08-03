// assets/icons/index.ts
// Custom SVG Icons and Icon Preset Definitions

export interface CustomIcon {
  id: string;
  name: string;
  category: 'ui' | 'media' | 'neumorphic' | 'device' | 'status';
  svgPath: string;
  viewBox?: string;
}

export const ICON_COLLECTION: CustomIcon[] = [
  {
    id: 'neu-sun',
    name: 'Soft Sun',
    category: 'neumorphic',
    viewBox: '0 0 24 24',
    svgPath: '<circle cx="12" cy="12" r="5" fill="currentColor"/><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'
  },
  {
    id: 'neu-moon',
    name: 'Soft Moon',
    category: 'neumorphic',
    viewBox: '0 0 24 24',
    svgPath: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>'
  },
  {
    id: 'neu-sliders',
    name: 'Tactile Sliders',
    category: 'ui',
    viewBox: '0 0 24 24',
    svgPath: '<line x1="4" y1="21" x2="4" y2="14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="4" y1="10" x2="4" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="12" y1="21" x2="12" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="12" y1="8" x2="12" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="20" y1="21" x2="20" y2="16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="20" y1="12" x2="20" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="1" y1="14" x2="7" y2="14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="9" y1="8" x2="15" y2="8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="17" y1="16" x2="23" y2="16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'
  },
  {
    id: 'neu-palette',
    name: 'Color Studio',
    category: 'ui',
    viewBox: '0 0 24 24',
    svgPath: '<circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10c1.38 0 2.5-1.12 2.5-2.5 0-.61-.23-1.21-.64-1.67-.38-.45-.6-.97-.6-1.54 0-1.24 1.01-2.25 2.25-2.25H17c2.76 0 5-2.24 5-5 0-4.97-4.48-9-10-9z" fill="none" stroke="currentColor" stroke-width="2"/>'
  },
  {
    id: 'neu-layers',
    name: 'Surface Stack',
    category: 'ui',
    viewBox: '0 0 24 24',
    svgPath: '<polygon points="12 2 2 7 12 12 22 7 12 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/><polyline points="2 17 12 22 22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/><polyline points="2 12 12 17 22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'
  }
];

export function getIconById(id: string): CustomIcon | undefined {
  return ICON_COLLECTION.find((icon) => icon.id === id);
}
