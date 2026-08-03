import React, { useState } from 'react';
import { NeuConfig, AuthUser, GoogleSheetsSyncState } from '../types';
import { NeuButton } from '../../assets/components/NeuButton';
import { NeuBadge } from '../../assets/components/NeuBadge';
import { isDarkColor, getCssVariablesString } from '../../assets/neumorphic-theme';
import { Layers, FileSpreadsheet, Sparkles, CheckCircle2, User, Copy, Check, Code } from 'lucide-react';

interface NavbarProps {
  config: NeuConfig;
  user: AuthUser;
  syncState: GoogleSheetsSyncState;
  onOpenSheetsModal: () => void;
  onOpenPresets: () => void;
  onExportCss: () => void;
  onCopyCssVariables?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  config,
  user,
  syncState,
  onOpenSheetsModal,
  onOpenPresets,
  onExportCss,
  onCopyCssVariables
}) => {
  const [copiedVars, setCopiedVars] = useState(false);
  const isDark = isDarkColor(config.bgColor);

  const handleCopyCssVariables = () => {
    const varsString = getCssVariablesString(config);
    navigator.clipboard.writeText(varsString);
    setCopiedVars(true);
    setTimeout(() => setCopiedVars(false), 2000);
    if (onCopyCssVariables) {
      onCopyCssVariables();
    }
  };

  return (
    <header
      id="app-header"
      className="w-full py-4 px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-opacity-10 transition-colors"
      style={{
        borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'
      }}
    >
      {/* Brand Title */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{
            background: config.accentColor,
            boxShadow: `0 4px 12px ${config.accentColor}50`
          }}
        >
          <Layers className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black tracking-tight" style={{ color: isDark ? '#ffffff' : '#111827' }}>
              Neumorphic UI Studio
            </h1>
            <NeuBadge
              config={config}
              label="v2.0"
              statusColor={config.accentColor}
            />
          </div>
          <p className="text-xs font-medium opacity-70" style={{ color: isDark ? '#9ca3af' : '#4b5563' }}>
            Tactile Soft UI Design System & Reusable Components
          </p>
        </div>
      </div>

      {/* Action Controls & Google Sheets Connection Status */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {/* Preset Selector Button */}
        <NeuButton
          id="btn-presets"
          config={config}
          size="sm"
          onClick={onOpenPresets}
          icon={<Sparkles className="w-4 h-4 text-amber-500" />}
        >
          Theme Presets
        </NeuButton>

        {/* Export CSS Button */}
        <NeuButton
          id="btn-export-css"
          config={config}
          size="sm"
          onClick={onExportCss}
        >
          Copy CSS
        </NeuButton>

        {/* Copy as CSS Variables Button */}
        <NeuButton
          id="btn-copy-css-vars"
          config={config}
          size="sm"
          variant="glow"
          onClick={handleCopyCssVariables}
          icon={copiedVars ? <Check className="w-4 h-4 text-emerald-500" /> : <Code className="w-4 h-4 text-blue-500" />}
        >
          {copiedVars ? 'Copied Variables!' : 'Copy as CSS Variables'}
        </NeuButton>

        {/* Google Sheets Sync Button */}
        <NeuButton
          id="btn-sheets-sync"
          config={config}
          size="sm"
          variant={syncState.spreadsheetId ? 'glow' : 'flat'}
          onClick={onOpenSheetsModal}
          icon={
            <FileSpreadsheet
              className={`w-4 h-4 ${syncState.spreadsheetId ? 'text-emerald-500' : 'text-emerald-600'}`}
            />
          }
        >
          {syncState.spreadsheetId ? (
            <span className="flex items-center gap-1.5">
              <span>Sheets Synced</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            </span>
          ) : (
            <span>Google Sheets</span>
          )}
        </NeuButton>

        {/* User Account Pill */}
        {user.authenticated ? (
          <div
            id="user-account-pill"
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{
              background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
              color: isDark ? '#f3f4f6' : '#1f2937'
            }}
          >
            {user.picture ? (
              <img src={user.picture} alt={user.name || 'User'} className="w-5 h-5 rounded-full object-cover" />
            ) : (
              <User className="w-4 h-4 opacity-70" />
            )}
            <span className="max-w-[120px] truncate">{user.name || user.email}</span>
          </div>
        ) : (
          <NeuButton
            id="btn-connect-google"
            config={config}
            size="sm"
            variant="accent"
            onClick={onOpenSheetsModal}
          >
            Connect Workspace
          </NeuButton>
        )}
      </div>
    </header>
  );
};
