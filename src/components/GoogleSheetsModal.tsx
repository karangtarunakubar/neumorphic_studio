import React, { useState, useEffect } from 'react';
import { NeuConfig, AuthUser, GoogleSheetsSyncState, ComponentToken, SheetFile } from '../types';
import { NeuCard } from '../../assets/components/NeuCard';
import { NeuButton } from '../../assets/components/NeuButton';
import { NeuInput } from '../../assets/components/NeuInput';
import { isDarkColor } from '../../assets/neumorphic-theme';
import {
  FileSpreadsheet,
  X,
  ExternalLink,
  PlusCircle,
  Download,
  Upload,
  FolderOpen,
  CheckCircle2,
  AlertCircle,
  Loader2,
  UserCheck,
  RefreshCw
} from 'lucide-react';

interface GoogleSheetsModalProps {
  config: NeuConfig;
  user: AuthUser;
  syncState: GoogleSheetsSyncState;
  onClose: () => void;
  onConnectGoogle: () => void;
  onCreateSheet: () => Promise<void>;
  onExportToSheet: () => Promise<void>;
  onImportFromSheet: (sheetId: string) => Promise<void>;
}

export const GoogleSheetsModal: React.FC<GoogleSheetsModalProps> = ({
  config,
  user,
  syncState,
  onClose,
  onConnectGoogle,
  onCreateSheet,
  onExportToSheet,
  onImportFromSheet
}) => {
  const [importIdInput, setImportIdInput] = useState<string>('');
  const [driveFiles, setDriveFiles] = useState<SheetFile[]>([]);
  const [loadingDrive, setLoadingDrive] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const isDark = isDarkColor(config.bgColor);

  useEffect(() => {
    if (user.authenticated) {
      fetchDriveFiles();
    }
  }, [user.authenticated]);

  const fetchDriveFiles = async () => {
    setLoadingDrive(true);
    try {
      const res = await fetch('/api/drive/files');
      if (res.ok) {
        const data = await res.json();
        setDriveFiles(data.files || []);
      }
    } catch (err) {
      console.error('Error fetching drive files:', err);
    } finally {
      setLoadingDrive(false);
    }
  };

  const handleImportSubmit = async (sheetId?: string) => {
    const targetId = sheetId || importIdInput.trim();
    if (!targetId) return;
    setStatusMsg('Importing design tokens from Google Sheet...');
    try {
      await onImportFromSheet(targetId);
      setStatusMsg('Design tokens successfully imported!');
    } catch (err: any) {
      setStatusMsg(`Import failed: ${err.message}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl">
        <NeuCard config={config} className="flex flex-col gap-6 p-6 relative max-h-[90vh] overflow-y-auto">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full opacity-70 hover:opacity-100 transition-opacity"
            style={{ color: isDark ? '#ffffff' : '#111827' }}
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 pr-8">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight" style={{ color: isDark ? '#ffffff' : '#111827' }}>
                Google Sheets Integration Center
              </h2>
              <p className="text-xs font-medium opacity-70">
                Sync Neumorphic UI Design Tokens, Color Hexes, and Components directly with Google Sheets
              </p>
            </div>
          </div>

          {/* Authentication Banner */}
          {!user.authenticated ? (
            <div
              className="p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border"
              style={{
                background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
              }}
            >
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                <div className="text-xs">
                  <p className="font-bold text-sm">Google Workspace Account Required</p>
                  <p className="opacity-70">Connect your account to access Google Sheets & Drive API.</p>
                </div>
              </div>
              <NeuButton
                config={config}
                size="sm"
                variant="accent"
                onClick={onConnectGoogle}
              >
                Sign In with Google
              </NeuButton>
            </div>
          ) : (
            <div
              className="p-4 rounded-2xl flex items-center justify-between gap-4 border bg-emerald-500/5 border-emerald-500/20"
            >
              <div className="flex items-center gap-3">
                <UserCheck className="w-5 h-5 text-emerald-500" />
                <div className="text-xs">
                  <p className="font-bold text-sm text-emerald-600 dark:text-emerald-400">
                    Connected as {user.name || user.email}
                  </p>
                  <p className="opacity-70">Google Sheets & Drive access granted</p>
                </div>
              </div>

              {syncState.spreadsheetUrl && (
                <a
                  href={syncState.spreadsheetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  <span>Open Active Sheet</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          )}

          {/* Actions Section */}
          {user.authenticated && (
            <div className="flex flex-col gap-6">
              {/* Option 1: Create New Sheet */}
              <div className="flex flex-col gap-3">
                <span className="text-xs font-bold uppercase tracking-wider opacity-70">1. Export & Sync Options</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <NeuButton
                    config={config}
                    size="md"
                    variant="accent"
                    onClick={onCreateSheet}
                    disabled={syncState.isSyncing}
                    icon={syncState.isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
                  >
                    Create New Sheet in Drive
                  </NeuButton>

                  <NeuButton
                    config={config}
                    size="md"
                    onClick={onExportToSheet}
                    disabled={!syncState.spreadsheetId || syncState.isSyncing}
                    icon={syncState.isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  >
                    Sync Current Tokens
                  </NeuButton>
                </div>
              </div>

              {/* Option 2: Import Sheet */}
              <div className="flex flex-col gap-3 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider opacity-70">2. Import Tokens from Sheet</span>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="flex-1 w-full">
                    <NeuInput
                      config={config}
                      placeholder="Paste Google Sheet ID or URL..."
                      value={importIdInput}
                      onChange={(e) => setImportIdInput(e.target.value)}
                    />
                  </div>
                  <NeuButton
                    config={config}
                    size="md"
                    onClick={() => handleImportSubmit()}
                    disabled={!importIdInput.trim()}
                    icon={<Download className="w-4 h-4" />}
                  >
                    Import
                  </NeuButton>
                </div>
              </div>

              {/* Option 3: Recent Drive Files */}
              <div className="flex flex-col gap-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider opacity-70 flex items-center gap-1.5">
                    <FolderOpen className="w-3.5 h-3.5" />
                    Saved Neumorphic Sheets in Drive
                  </span>
                  <button onClick={fetchDriveFiles} className="text-xs font-semibold opacity-70 hover:opacity-100 flex items-center gap-1">
                    <RefreshCw className="w-3 h-3" />
                    Refresh
                  </button>
                </div>

                {loadingDrive ? (
                  <div className="p-4 text-center text-xs opacity-60">Loading Drive sheets...</div>
                ) : driveFiles.length === 0 ? (
                  <p className="text-xs opacity-60 italic p-2">No design sheets found in Google Drive yet.</p>
                ) : (
                  <div className="flex flex-col gap-2 max-h-40 overflow-y-auto pr-1">
                    {driveFiles.map((f) => (
                      <div
                        key={f.id}
                        className="flex items-center justify-between p-2.5 rounded-xl border border-black/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-xs"
                      >
                        <div className="flex items-center gap-2 truncate pr-2">
                          <FileSpreadsheet className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span className="font-semibold truncate">{f.name}</span>
                        </div>
                        <NeuButton
                          config={config}
                          size="sm"
                          onClick={() => handleImportSubmit(f.id)}
                        >
                          Load Sheet
                        </NeuButton>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {statusMsg && (
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500 text-xs font-semibold text-center">
              {statusMsg}
            </div>
          )}
        </NeuCard>
      </div>
    </div>
  );
};
