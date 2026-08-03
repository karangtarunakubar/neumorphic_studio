import React, { useState, useEffect } from 'react';
import { NeuConfig, AuthUser, GoogleSheetsSyncState, ComponentToken, ThemePreset } from './types';
import { DEFAULT_NEU_CONFIG, getCssShadowString, getCssVariablesString, NEUMORPHIC_PRESETS } from '../assets/neumorphic-theme';
import { Navbar } from './components/Navbar';
import { StyleGenerator } from './components/StyleGenerator';
import { ComponentLibrary } from './components/ComponentLibrary';
import { InteractivePlayground } from './components/InteractivePlayground';
import { DesignInspiration } from './components/DesignInspiration';
import { GoogleSheetsModal } from './components/GoogleSheetsModal';

export default function App() {
  // Main Neumorphic Configuration State
  const [neuConfig, setNeuConfig] = useState<NeuConfig>(DEFAULT_NEU_CONFIG);

  // Auth & Sync States
  const [user, setUser] = useState<AuthUser>({ authenticated: false });
  const [syncState, setSyncState] = useState<GoogleSheetsSyncState>({
    spreadsheetId: null,
    spreadsheetUrl: null,
    spreadsheetName: null,
    lastSyncedAt: null,
    isSyncing: false,
    error: null
  });

  const [showSheetsModal, setShowSheetsModal] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<'generator' | 'library' | 'playground'>('generator');

  // Check auth status on load
  useEffect(() => {
    checkAuthStatus();

    // Listen for OAuth postMessage from popup
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'GOOGLE_AUTH_SUCCESS') {
        checkAuthStatus();
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const checkAuthStatus = async () => {
    try {
      const res = await fetch('/api/auth/status');
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    } catch (err) {
      console.error('Auth check error:', err);
    }
  };

  // Google OAuth popup
  const handleConnectGoogle = async () => {
    try {
      const res = await fetch('/api/auth/google/url');
      if (!res.ok) {
        const data = await res.json();
        alert(`OAuth error: ${data.error || 'Failed to get auth URL'}`);
        return;
      }
      const data = await res.json();
      const width = 500;
      const height = 650;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      window.open(
        data.url,
        'GoogleWorkspaceAuth',
        `width=${width},height=${height},left=${left},top=${top}`
      );
    } catch (err: any) {
      alert(`Error initiating Google Auth: ${err.message}`);
    }
  };

  // Create Google Sheet in Drive
  const handleCreateSheet = async () => {
    setSyncState(prev => ({ ...prev, isSyncing: true, error: null }));
    try {
      const initialToken: ComponentToken = {
        id: 'tok-default',
        name: 'Primary Neumorphic Style',
        category: 'buttons',
        description: 'Main design token config',
        cssShadow: getCssShadowString(neuConfig),
        config: neuConfig,
        jsxSnippet: '<NeuButton config={config}>Button</NeuButton>',
        updatedAt: new Date().toISOString()
      };

      const res = await fetch('/api/sheets/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Neumorphic UI Studio - Tokens & Presets',
          tokens: [initialToken],
          presets: NEUMORPHIC_PRESETS
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to create Google Sheet');
      }

      const data = await res.json();
      setSyncState({
        spreadsheetId: data.spreadsheetId,
        spreadsheetUrl: data.spreadsheetUrl,
        spreadsheetName: data.title,
        lastSyncedAt: new Date().toISOString(),
        isSyncing: false,
        error: null
      });
    } catch (err: any) {
      setSyncState(prev => ({ ...prev, isSyncing: false, error: err.message }));
      alert(`Google Sheets error: ${err.message}`);
    }
  };

  // Export current config & tokens to Sheet
  const handleExportToSheet = async () => {
    if (!syncState.spreadsheetId) {
      alert('Please create or select a Google Sheet first.');
      return;
    }
    setSyncState(prev => ({ ...prev, isSyncing: true }));
    try {
      const token: ComponentToken = {
        id: `tok-${Date.now()}`,
        name: 'Custom Active Theme',
        category: 'presets',
        description: 'Active design configuration token',
        cssShadow: getCssShadowString(neuConfig),
        config: neuConfig,
        jsxSnippet: `<div style={neuStyles}>Content</div>`,
        updatedAt: new Date().toISOString()
      };

      const res = await fetch('/api/sheets/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spreadsheetId: syncState.spreadsheetId,
          tokens: [token],
          presets: NEUMORPHIC_PRESETS
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Export failed');
      }

      setSyncState(prev => ({
        ...prev,
        isSyncing: false,
        lastSyncedAt: new Date().toISOString()
      }));
      alert('Tokens synced to Google Sheets successfully!');
    } catch (err: any) {
      setSyncState(prev => ({ ...prev, isSyncing: false, error: err.message }));
      alert(`Export error: ${err.message}`);
    }
  };

  // Import tokens from Google Sheet
  const handleImportFromSheet = async (sheetId: string) => {
    setSyncState(prev => ({ ...prev, isSyncing: true }));
    try {
      const res = await fetch(`/api/sheets/import/${sheetId}`);
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Import failed');
      }

      const data = await res.json();
      if (data.tokens && data.tokens.length > 0) {
        const importedConfig = data.tokens[0].config;
        if (importedConfig && importedConfig.bgColor) {
          setNeuConfig({
            ...DEFAULT_NEU_CONFIG,
            ...importedConfig
          });
        }
      }

      setSyncState({
        spreadsheetId: data.spreadsheetId,
        spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${data.spreadsheetId}/edit`,
        spreadsheetName: data.title || 'Imported Design Sheet',
        lastSyncedAt: new Date().toISOString(),
        isSyncing: false,
        error: null
      });
    } catch (err: any) {
      setSyncState(prev => ({ ...prev, isSyncing: false, error: err.message }));
      throw err;
    }
  };

  // Apply preset theme
  const handleApplyPreset = (preset: ThemePreset) => {
    setNeuConfig({
      bgColor: preset.bgColor,
      surfaceType: preset.isDark ? 'dark' : 'light',
      elevation: preset.elevation,
      blur: preset.blur,
      radius: preset.radius,
      shape: preset.shape,
      lightAngle: preset.lightAngle,
      accentColor: preset.accentColor,
      borderWidth: 0,
      borderColor: 'transparent'
    });
  };

  const handleExportTokenSingle = async (token: ComponentToken) => {
    if (!user.authenticated) {
      setShowSheetsModal(true);
      return;
    }
    if (!syncState.spreadsheetId) {
      await handleCreateSheet();
    } else {
      await handleExportToSheet();
    }
  };

  return (
    <div
      className="min-h-screen w-full transition-all duration-500 ease-in-out flex flex-col font-sans"
      style={{
        background: neuConfig.bgColor,
        color: neuConfig.surfaceType === 'dark' ? '#f3f4f6' : '#1f2937'
      }}
    >
      {/* App Header */}
      <Navbar
        config={neuConfig}
        user={user}
        syncState={syncState}
        onOpenSheetsModal={() => setShowSheetsModal(true)}
        onOpenPresets={() => {}}
        onExportCss={() => navigator.clipboard.writeText(getCssShadowString(neuConfig))}
        onCopyCssVariables={() => navigator.clipboard.writeText(getCssVariablesString(neuConfig))}
      />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-10 lg:px-12 py-8 flex flex-col gap-10">
        {/* Style Generator Controls */}
        <StyleGenerator
          config={neuConfig}
          onChangeConfig={setNeuConfig}
          onApplyPreset={handleApplyPreset}
        />

        {/* Component Library Showcase */}
        <ComponentLibrary
          config={neuConfig}
          syncState={syncState}
          onExportTokenToSheet={handleExportTokenSingle}
        />

        {/* Interactive Prototypes */}
        <InteractivePlayground
          config={neuConfig}
          syncState={syncState}
        />

        {/* Real-World Design Inspiration Gallery */}
        <DesignInspiration
          config={neuConfig}
        />
      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-xs opacity-60 border-t border-black/5 dark:border-white/5">
        <p>Neumorphic UI Design System & Component Assets • Connected with Google Sheets & Drive API</p>
      </footer>

      {/* Google Sheets Integration Modal */}
      {showSheetsModal && (
        <GoogleSheetsModal
          config={neuConfig}
          user={user}
          syncState={syncState}
          onClose={() => setShowSheetsModal(false)}
          onConnectGoogle={handleConnectGoogle}
          onCreateSheet={handleCreateSheet}
          onExportToSheet={handleExportToSheet}
          onImportFromSheet={handleImportFromSheet}
        />
      )}
    </div>
  );
}
