export type NeuShape = 'flat' | 'concave' | 'convex' | 'pressed';

export type LightAngle = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export interface NeuConfig {
  bgColor: string;       // e.g. '#e0e5ec'
  surfaceType: 'light' | 'dark' | 'clay' | 'pastel';
  elevation: number;     // e.g. 8 (px)
  blur: number;          // e.g. 16 (px)
  radius: number;        // e.g. 16 (px)
  shape: NeuShape;
  lightAngle: LightAngle;
  accentColor: string;   // e.g. '#3b82f6'
  borderWidth: number;   // e.g. 0 or 1
  borderColor: string;   // subtle border option
}

export interface ComponentToken {
  id: string;
  name: string;
  category: 'buttons' | 'cards' | 'inputs' | 'indicators' | 'interactive' | 'presets';
  description: string;
  cssShadow: string;
  config: NeuConfig;
  jsxSnippet: string;
  updatedAt: string;
}

export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  bgColor: string;
  accentColor: string;
  elevation: number;
  blur: number;
  radius: number;
  lightAngle: LightAngle;
  shape: NeuShape;
  isDark: boolean;
}

export interface AuthUser {
  authenticated: boolean;
  email?: string;
  name?: string;
  picture?: string;
}

export interface SheetFile {
  id: string;
  name: string;
  webViewLink?: string;
  createdTime?: string;
  modifiedTime?: string;
}

export interface GoogleSheetsSyncState {
  spreadsheetId: string | null;
  spreadsheetUrl: string | null;
  spreadsheetName: string | null;
  lastSyncedAt: string | null;
  isSyncing: boolean;
  error: string | null;
}
