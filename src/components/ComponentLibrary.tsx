import React, { useState } from 'react';
import { NeuConfig, ComponentToken, GoogleSheetsSyncState } from '../types';
import { NeuCard } from '../../assets/components/NeuCard';
import { NeuButton } from '../../assets/components/NeuButton';
import { NeuInput } from '../../assets/components/NeuInput';
import { NeuSwitch } from '../../assets/components/NeuSwitch';
import { NeuSlider } from '../../assets/components/NeuSlider';
import { NeuBadge } from '../../assets/components/NeuBadge';
import { NeuProgress } from '../../assets/components/NeuProgress';
import { NeuDial } from '../../assets/components/NeuDial';
import { NeuSegmented } from '../../assets/components/NeuSegmented';
import { NeuMap } from '../../assets/components/NeuMap';
import { isDarkColor, getCssShadowString } from '../../assets/neumorphic-theme';
import {
  Grid,
  Search,
  Check,
  Copy,
  FileUp,
  Heart,
  Bell,
  Sliders,
  Volume2,
  Lock,
  Zap,
  Sparkles,
  Layers,
  ChevronRight,
  MapPin,
  Navigation
} from 'lucide-react';

interface ComponentLibraryProps {
  config: NeuConfig;
  syncState: GoogleSheetsSyncState;
  onExportTokenToSheet: (token: ComponentToken) => void;
}

export const ComponentLibrary: React.FC<ComponentLibraryProps> = ({
  config,
  syncState,
  onExportTokenToSheet
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Interactive component states inside showcase
  const [btnActive, setBtnActive] = useState<boolean>(false);
  const [switchState, setSwitchState] = useState<boolean>(true);
  const [sliderVal, setSliderVal] = useState<number>(65);
  const [dialVal, setDialVal] = useState<number>(24);
  const [progressVal, setProgressVal] = useState<number>(75);
  const [segmentedVal, setSegmentedVal] = useState<string>('day');
  const [textInputVal, setTextInputVal] = useState<string>('');

  const isDark = isDarkColor(config.bgColor);

  const copyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const categories = [
    { id: 'all', label: 'All Components' },
    { id: 'buttons', label: 'Buttons & Toggles' },
    { id: 'cards', label: 'Containers & Cards' },
    { id: 'inputs', label: 'Inputs & Form Controls' },
    { id: 'indicators', label: 'Status & Meters' },
    { id: 'interactive', label: 'Tactile Controls' },
    { id: 'maps', label: 'Maps & Navigation' }
  ];

  // Helper to generate a token object for exporting to sheet
  const makeToken = (id: string, name: string, category: any, snippet: string): ComponentToken => ({
    id,
    name,
    category,
    description: `Neumorphic ${name} component token`,
    cssShadow: getCssShadowString(config),
    config: { ...config },
    jsxSnippet: snippet,
    updatedAt: new Date().toISOString()
  });

  return (
    <div id="component-library-section" className="w-full flex flex-col gap-6">
      {/* Category Navigation & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Grid className="w-5 h-5 text-indigo-500" />
          <h2 className="text-xl font-bold tracking-tight" style={{ color: isDark ? '#ffffff' : '#111827' }}>
            Reusable UI Component Assets
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="w-full sm:w-64">
            <NeuInput
              config={config}
              placeholder="Filter components..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>

          <NeuSegmented
            config={config}
            size="sm"
            value={activeCategory}
            onChange={setActiveCategory}
            options={categories.map((c) => ({ id: c.id, label: c.label }))}
          />
        </div>
      </div>

      {/* Grid of Components */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 1. Standard Flat & Raised Buttons */}
        {(activeCategory === 'all' || activeCategory === 'buttons') && (
          <NeuCard config={config} hoverEffect className="flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-500">Buttons</span>
                <span className="text-[10px] font-mono opacity-60">assets/components/NeuButton.tsx</span>
              </div>
              <h3 className="font-bold text-base mb-1">Neumorphic Action Buttons</h3>
              <p className="text-xs opacity-70 mb-4">Outset, Inset, Accent, and Soft Glow button states</p>

              <div className="flex flex-wrap gap-3 items-center">
                <NeuButton config={config} size="md">
                  Default Button
                </NeuButton>

                <NeuButton
                  config={config}
                  size="md"
                  active={btnActive}
                  onClick={() => setBtnActive(!btnActive)}
                >
                  {btnActive ? 'Pressed Inset' : 'Click Me'}
                </NeuButton>

                <NeuButton config={config} size="md" variant="accent">
                  Accent Primary
                </NeuButton>

                <NeuButton
                  config={config}
                  size="sm"
                  variant="glow"
                  icon={<Sparkles className="w-4 h-4" />}
                >
                  Soft Glow
                </NeuButton>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-opacity-10" style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
              <button
                onClick={() => copyCode('btn-code', `<NeuButton config={config} variant="accent">Click Me</NeuButton>`)}
                className="text-xs font-semibold flex items-center gap-1.5 opacity-80 hover:opacity-100"
              >
                {copiedId === 'btn-code' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === 'btn-code' ? 'Copied' : 'Copy Code'}</span>
              </button>

              <button
                onClick={() => onExportTokenToSheet(makeToken('tok-button', 'Action Button', 'buttons', `<NeuButton config={config}>Button</NeuButton>`))}
                className="text-xs font-semibold flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                <FileUp className="w-3.5 h-3.5" />
                <span>Sync to Sheet</span>
              </button>
            </div>
          </NeuCard>
        )}

        {/* 2. Tactile Toggle Switches */}
        {(activeCategory === 'all' || activeCategory === 'buttons') && (
          <NeuCard config={config} hoverEffect className="flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-500">Toggles</span>
                <span className="text-[10px] font-mono opacity-60">assets/components/NeuSwitch.tsx</span>
              </div>
              <h3 className="font-bold text-base mb-1">Tactile Soft Switch</h3>
              <p className="text-xs opacity-70 mb-4">Sunken track groove with raised physical sliding knob</p>

              <div className="flex flex-col gap-4 py-2">
                <NeuSwitch
                  config={config}
                  checked={switchState}
                  onChange={setSwitchState}
                  label={switchState ? 'Power Enabled (ON)' : 'Power Off (STANDBY)'}
                />

                <NeuSwitch
                  config={config}
                  checked={!switchState}
                  onChange={() => {}}
                  disabled
                  label="Disabled Lock State"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-opacity-10" style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
              <button
                onClick={() => copyCode('switch-code', `<NeuSwitch config={config} checked={checked} onChange={setChecked} />`)}
                className="text-xs font-semibold flex items-center gap-1.5 opacity-80 hover:opacity-100"
              >
                {copiedId === 'switch-code' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === 'switch-code' ? 'Copied' : 'Copy Code'}</span>
              </button>

              <button
                onClick={() => onExportTokenToSheet(makeToken('tok-switch', 'Tactile Switch', 'buttons', `<NeuSwitch config={config} checked={true} />`))}
                className="text-xs font-semibold flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                <FileUp className="w-3.5 h-3.5" />
                <span>Sync to Sheet</span>
              </button>
            </div>
          </NeuCard>
        )}

        {/* 3. Inset Inputs & Textfields */}
        {(activeCategory === 'all' || activeCategory === 'inputs') && (
          <NeuCard config={config} hoverEffect className="flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-500">Inputs</span>
                <span className="text-[10px] font-mono opacity-60">assets/components/NeuInput.tsx</span>
              </div>
              <h3 className="font-bold text-base mb-1">Sunken Text Fields</h3>
              <p className="text-xs opacity-70 mb-4">Depth inset relief shadow with icon prefixes</p>

              <div className="flex flex-col gap-3">
                <NeuInput
                  config={config}
                  label="Search Database"
                  placeholder="Type to search..."
                  value={textInputVal}
                  onChange={(e) => setTextInputVal(e.target.value)}
                  icon={<Search className="w-4 h-4" />}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-opacity-10" style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
              <button
                onClick={() => copyCode('input-code', `<NeuInput config={config} label="Username" placeholder="Enter name" />`)}
                className="text-xs font-semibold flex items-center gap-1.5 opacity-80 hover:opacity-100"
              >
                {copiedId === 'input-code' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === 'input-code' ? 'Copied' : 'Copy Code'}</span>
              </button>

              <button
                onClick={() => onExportTokenToSheet(makeToken('tok-input', 'Inset Input', 'inputs', `<NeuInput config={config} placeholder="Search" />`))}
                className="text-xs font-semibold flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                <FileUp className="w-3.5 h-3.5" />
                <span>Sync to Sheet</span>
              </button>
            </div>
          </NeuCard>
        )}

        {/* 4. Range Sliders */}
        {(activeCategory === 'all' || activeCategory === 'interactive') && (
          <NeuCard config={config} hoverEffect className="flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-500">Sliders</span>
                <span className="text-[10px] font-mono opacity-60">assets/components/NeuSlider.tsx</span>
              </div>
              <h3 className="font-bold text-base mb-1">Tactile Range Slider</h3>
              <p className="text-xs opacity-70 mb-4">Sunken track with accent bar fill and raised thumb knob</p>

              <div className="py-2">
                <NeuSlider
                  config={config}
                  label="Volume Level"
                  unit="%"
                  value={sliderVal}
                  onChange={setSliderVal}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-opacity-10" style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
              <button
                onClick={() => copyCode('slider-code', `<NeuSlider config={config} label="Volume" value={val} onChange={setVal} />`)}
                className="text-xs font-semibold flex items-center gap-1.5 opacity-80 hover:opacity-100"
              >
                {copiedId === 'slider-code' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === 'slider-code' ? 'Copied' : 'Copy Code'}</span>
              </button>

              <button
                onClick={() => onExportTokenToSheet(makeToken('tok-slider', 'Tactile Slider', 'interactive', `<NeuSlider config={config} value={65} />`))}
                className="text-xs font-semibold flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                <FileUp className="w-3.5 h-3.5" />
                <span>Sync to Sheet</span>
              </button>
            </div>
          </NeuCard>
        )}

        {/* 5. Rotary Knob Dial */}
        {(activeCategory === 'all' || activeCategory === 'interactive') && (
          <NeuCard config={config} hoverEffect className="flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-500">Rotary Dial</span>
                <span className="text-[10px] font-mono opacity-60">assets/components/NeuDial.tsx</span>
              </div>
              <h3 className="font-bold text-base mb-1">Rotary Control Knob</h3>
              <p className="text-xs opacity-70 mb-4">Interactive 270° rotary knob dial with drag controls</p>

              <div className="flex justify-center py-2">
                <NeuDial
                  config={config}
                  min={16}
                  max={32}
                  value={dialVal}
                  onChange={setDialVal}
                  label="Target Temp"
                  unit="°C"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-opacity-10" style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
              <button
                onClick={() => copyCode('dial-code', `<NeuDial config={config} value={val} onChange={setVal} label="Temp" unit="°C" />`)}
                className="text-xs font-semibold flex items-center gap-1.5 opacity-80 hover:opacity-100"
              >
                {copiedId === 'dial-code' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === 'dial-code' ? 'Copied' : 'Copy Code'}</span>
              </button>

              <button
                onClick={() => onExportTokenToSheet(makeToken('tok-dial', 'Rotary Knob Dial', 'interactive', `<NeuDial config={config} value={24} />`))}
                className="text-xs font-semibold flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                <FileUp className="w-3.5 h-3.5" />
                <span>Sync to Sheet</span>
              </button>
            </div>
          </NeuCard>
        )}

        {/* 6. Linear & Radial Meters */}
        {(activeCategory === 'all' || activeCategory === 'indicators') && (
          <NeuCard config={config} hoverEffect className="flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-500">Meters</span>
                <span className="text-[10px] font-mono opacity-60">assets/components/NeuProgress.tsx</span>
              </div>
              <h3 className="font-bold text-base mb-1">Progress Indicators</h3>
              <p className="text-xs opacity-70 mb-4">Linear inset channel & radial circular progress ring</p>

              <div className="flex flex-col gap-4">
                <NeuProgress
                  config={config}
                  value={progressVal}
                  label="System Capacity"
                />

                <div className="flex justify-center">
                  <NeuProgress
                    config={config}
                    variant="radial"
                    value={progressVal}
                    label="CPU Load"
                    size={100}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-opacity-10" style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
              <button
                onClick={() => copyCode('meter-code', `<NeuProgress config={config} variant="radial" value={75} />`)}
                className="text-xs font-semibold flex items-center gap-1.5 opacity-80 hover:opacity-100"
              >
                {copiedId === 'meter-code' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === 'meter-code' ? 'Copied' : 'Copy Code'}</span>
              </button>

              <button
                onClick={() => onExportTokenToSheet(makeToken('tok-progress', 'Progress Indicator', 'indicators', `<NeuProgress config={config} value={75} />`))}
                className="text-xs font-semibold flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                <FileUp className="w-3.5 h-3.5" />
                <span>Sync to Sheet</span>
              </button>
            </div>
          </NeuCard>
        )}

        {/* 7. Segmented Tab Bar */}
        {(activeCategory === 'all' || activeCategory === 'buttons') && (
          <NeuCard config={config} hoverEffect className="flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-500">Segmented</span>
                <span className="text-[10px] font-mono opacity-60">assets/components/NeuSegmented.tsx</span>
              </div>
              <h3 className="font-bold text-base mb-1">Segmented Options Bar</h3>
              <p className="text-xs opacity-70 mb-4">Multi-option selector with inset track and raised active tab</p>

              <div className="py-2 flex justify-center">
                <NeuSegmented
                  config={config}
                  size="sm"
                  value={segmentedVal}
                  onChange={setSegmentedVal}
                  options={[
                    { id: 'day', label: 'Day' },
                    { id: 'week', label: 'Week' },
                    { id: 'month', label: 'Month' }
                  ]}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-opacity-10" style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
              <button
                onClick={() => copyCode('segmented-code', `<NeuSegmented config={config} options={opts} value={val} onChange={setVal} />`)}
                className="text-xs font-semibold flex items-center gap-1.5 opacity-80 hover:opacity-100"
              >
                {copiedId === 'segmented-code' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === 'segmented-code' ? 'Copied' : 'Copy Code'}</span>
              </button>

              <button
                onClick={() => onExportTokenToSheet(makeToken('tok-segmented', 'Segmented Tab', 'buttons', `<NeuSegmented config={config} value="day" />`))}
                className="text-xs font-semibold flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                <FileUp className="w-3.5 h-3.5" />
                <span>Sync to Sheet</span>
              </button>
            </div>
          </NeuCard>
        )}

        {/* 8. Status Badges & LED Indicators */}
        {(activeCategory === 'all' || activeCategory === 'indicators') && (
          <NeuCard config={config} hoverEffect className="flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-500">Badges</span>
                <span className="text-[10px] font-mono opacity-60">assets/components/NeuBadge.tsx</span>
              </div>
              <h3 className="font-bold text-base mb-1">Status Pills & Badges</h3>
              <p className="text-xs opacity-70 mb-4">Soft convex pill badges with animated status LED lights</p>

              <div className="flex flex-wrap gap-2.5 items-center py-2">
                <NeuBadge config={config} label="Live Online" statusColor="#10b981" pulse />
                <NeuBadge config={config} label="Pending Sync" statusColor="#f59e0b" />
                <NeuBadge config={config} label="System Error" statusColor="#ef4444" />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-opacity-10" style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
              <button
                onClick={() => copyCode('badge-code', `<NeuBadge config={config} label="Online" statusColor="#10b981" pulse />`)}
                className="text-xs font-semibold flex items-center gap-1.5 opacity-80 hover:opacity-100"
              >
                {copiedId === 'badge-code' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === 'badge-code' ? 'Copied' : 'Copy Code'}</span>
              </button>

              <button
                onClick={() => onExportTokenToSheet(makeToken('tok-badge', 'Status Badge', 'indicators', `<NeuBadge config={config} label="Online" />`))}
                className="text-xs font-semibold flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                <FileUp className="w-3.5 h-3.5" />
                <span>Sync to Sheet</span>
              </button>
            </div>
          </NeuCard>
        )}

        {/* 9. Interactive Neumorphic Map & Telemetry Control */}
        {(activeCategory === 'all' || activeCategory === 'maps') && (
          <NeuCard config={config} hoverEffect className="md:col-span-2 lg:col-span-3 flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-500 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  Maps & Navigation
                </span>
                <span className="text-[10px] font-mono opacity-60">assets/components/NeuMap.tsx</span>
              </div>
              <h3 className="font-bold text-base mb-1">Neumorphic Interactive Map Component</h3>
              <p className="text-xs opacity-70 mb-4">
                Tactile map navigation widget with live markers, place discovery search, layer modes (Vector / Dark / Satellite), zoom controls, and Google Maps integration support.
              </p>

              <div className="py-2">
                <NeuMap config={config} height="360px" />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-opacity-10" style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
              <button
                onClick={() => copyCode('map-code', `<NeuMap config={config} defaultZoom={13} height="400px" />`)}
                className="text-xs font-semibold flex items-center gap-1.5 opacity-80 hover:opacity-100"
              >
                {copiedId === 'map-code' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === 'map-code' ? 'Copied' : 'Copy Code'}</span>
              </button>

              <button
                onClick={() => onExportTokenToSheet(makeToken('tok-map', 'Interactive Map', 'maps', `<NeuMap config={config} defaultZoom={13} />`))}
                className="text-xs font-semibold flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                <FileUp className="w-3.5 h-3.5" />
                <span>Sync to Sheet</span>
              </button>
            </div>
          </NeuCard>
        )}
      </div>
    </div>
  );
};
