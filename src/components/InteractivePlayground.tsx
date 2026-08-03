import React, { useState } from 'react';
import { NeuConfig, ComponentToken, GoogleSheetsSyncState } from '../types';
import { NeuCard } from '../../assets/components/NeuCard';
import { NeuButton } from '../../assets/components/NeuButton';
import { NeuSwitch } from '../../assets/components/NeuSwitch';
import { NeuSlider } from '../../assets/components/NeuSlider';
import { NeuDial } from '../../assets/components/NeuDial';
import { NeuProgress } from '../../assets/components/NeuProgress';
import { NeuBadge } from '../../assets/components/NeuBadge';
import { NeuSegmented } from '../../assets/components/NeuSegmented';
import { isDarkColor } from '../../assets/neumorphic-theme';
import {
  Gamepad2,
  Home,
  Music,
  Calculator,
  Table,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Tv,
  Thermometer,
  Lightbulb,
  Wifi,
  Fan,
  Delete
} from 'lucide-react';

interface InteractivePlaygroundProps {
  config: NeuConfig;
  syncState: GoogleSheetsSyncState;
}

export const InteractivePlayground: React.FC<InteractivePlaygroundProps> = ({
  config,
  syncState
}) => {
  const [activeTab, setActiveTab] = useState<'smarthome' | 'music' | 'calculator' | 'tokens'>('smarthome');

  // Smart home states
  const [livingLight, setLivingLight] = useState(true);
  const [tvPower, setTvPower] = useState(false);
  const [acPower, setAcPower] = useState(true);
  const [temp, setTemp] = useState(22);
  const [fanSpeed, setFanSpeed] = useState(3);

  // Music player states
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(68);
  const [trackProgress, setTrackProgress] = useState(42);

  // Calculator state
  const [calcDisplay, setCalcDisplay] = useState('0');
  const [calcMemory, setCalcMemory] = useState<number | null>(null);
  const [calcOp, setCalcOp] = useState<string | null>(null);
  const [newNumber, setNewNumber] = useState(true);

  const isDark = isDarkColor(config.bgColor);

  // Calculator logic
  const handleNum = (num: string) => {
    if (newNumber || calcDisplay === '0') {
      setCalcDisplay(num);
      setNewNumber(false);
    } else {
      setCalcDisplay(calcDisplay + num);
    }
  };

  const handleOp = (op: string) => {
    const current = parseFloat(calcDisplay);
    if (calcMemory === null) {
      setCalcMemory(current);
    } else if (calcOp) {
      let res = current;
      if (calcOp === '+') res = calcMemory + current;
      if (calcOp === '-') res = calcMemory - current;
      if (calcOp === '×') res = calcMemory * current;
      if (calcOp === '÷') res = current !== 0 ? calcMemory / current : 0;
      setCalcMemory(res);
      setCalcDisplay(String(res));
    }
    setCalcOp(op);
    setNewNumber(true);
  };

  const handleEquals = () => {
    if (calcMemory !== null && calcOp) {
      const current = parseFloat(calcDisplay);
      let res = current;
      if (calcOp === '+') res = calcMemory + current;
      if (calcOp === '-') res = calcMemory - current;
      if (calcOp === '×') res = calcMemory * current;
      if (calcOp === '÷') res = current !== 0 ? calcMemory / current : 0;
      setCalcDisplay(String(parseFloat(res.toFixed(6))));
      setCalcMemory(null);
      setCalcOp(null);
      setNewNumber(true);
    }
  };

  const handleClear = () => {
    setCalcDisplay('0');
    setCalcMemory(null);
    setCalcOp(null);
    setNewNumber(true);
  };

  return (
    <NeuCard id="interactive-playground" config={config} className="w-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-opacity-10" style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
        <div className="flex items-center gap-2">
          <Gamepad2 className="w-5 h-5 text-emerald-500" />
          <h2 className="text-lg font-bold tracking-tight" style={{ color: isDark ? '#ffffff' : '#111827' }}>
            Neumorphic Interactive Prototypes
          </h2>
        </div>

        <NeuSegmented
          config={config}
          size="sm"
          value={activeTab}
          onChange={(v) => setActiveTab(v as any)}
          options={[
            { id: 'smarthome', label: 'Smart Home', icon: <Home className="w-3.5 h-3.5" /> },
            { id: 'music', label: 'Music Player', icon: <Music className="w-3.5 h-3.5" /> },
            { id: 'calculator', label: 'Calculator', icon: <Calculator className="w-3.5 h-3.5" /> },
            { id: 'tokens', label: 'Tokens Sheet', icon: <Table className="w-3.5 h-3.5" /> }
          ]}
        />
      </div>

      {/* Tab 1: Smart Home Controller */}
      {activeTab === 'smarthome' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Climate Thermostat */}
          <NeuCard config={config} className="flex flex-col items-center justify-between gap-4 p-6">
            <div className="flex items-center justify-between w-full">
              <span className="text-xs font-bold uppercase tracking-wider opacity-70">Climate Control</span>
              <NeuBadge config={config} label={acPower ? 'Active AC' : 'Off'} statusColor={acPower ? '#10b981' : '#ef4444'} />
            </div>

            <NeuDial
              config={config}
              min={16}
              max={30}
              value={temp}
              onChange={setTemp}
              label="Thermostat"
              unit="°C"
              size={130}
            />

            <div className="w-full flex items-center justify-between pt-2">
              <span className="text-xs font-semibold opacity-70">AC Power</span>
              <NeuSwitch config={config} checked={acPower} onChange={setAcPower} />
            </div>
          </NeuCard>

          {/* Card 2: Lighting & Media Controls */}
          <NeuCard config={config} className="flex flex-col justify-between gap-5 p-6">
            <span className="text-xs font-bold uppercase tracking-wider opacity-70">Room Appliances</span>

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between p-2 rounded-xl">
                <div className="flex items-center gap-3">
                  <Lightbulb className={`w-5 h-5 ${livingLight ? 'text-amber-500' : 'opacity-40'}`} />
                  <span className="text-sm font-semibold">Living Room Lights</span>
                </div>
                <NeuSwitch config={config} checked={livingLight} onChange={setLivingLight} />
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl">
                <div className="flex items-center gap-3">
                  <Tv className={`w-5 h-5 ${tvPower ? 'text-blue-500' : 'opacity-40'}`} />
                  <span className="text-sm font-semibold">Smart TV OLED</span>
                </div>
                <NeuSwitch config={config} checked={tvPower} onChange={setTvPower} />
              </div>
            </div>

            <NeuSlider
              config={config}
              label="Fan Airflow Speed"
              min={1}
              max={5}
              value={fanSpeed}
              onChange={setFanSpeed}
            />
          </NeuCard>

          {/* Card 3: System Status & Wi-Fi */}
          <NeuCard config={config} className="flex flex-col justify-between gap-5 p-6">
            <div className="flex items-center justify-between w-full">
              <span className="text-xs font-bold uppercase tracking-wider opacity-70">Home Network</span>
              <Wifi className="w-4 h-4 text-emerald-500" />
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span>Network Bandwidth</span>
                <span className="text-emerald-500 font-bold">120 Mbps</span>
              </div>
              <NeuProgress config={config} value={82} label="Storage Capacity" />
              <NeuProgress config={config} value={45} label="Solar Power Storage" />
            </div>

            <div className="pt-2 flex justify-end">
              <NeuButton config={config} size="sm" variant="accent">
                System Diagnostics
              </NeuButton>
            </div>
          </NeuCard>
        </div>
      )}

      {/* Tab 2: Neumorphic Music Player */}
      {activeTab === 'music' && (
        <div className="max-w-md mx-auto w-full">
          <NeuCard config={config} className="flex flex-col items-center gap-6 p-6">
            {/* Album Cover Frame */}
            <div
              className="w-48 h-48 rounded-2xl p-3 flex flex-col items-center justify-center relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${config.accentColor}30, ${config.bgColor})`,
                boxShadow: isDark
                  ? `inset 4px 4px 10px rgba(0,0,0,0.5), inset -4px -4px 10px rgba(255,255,255,0.05)`
                  : `inset 4px 4px 10px rgba(0,0,0,0.15), inset -4px -4px 10px rgba(255,255,255,0.8)`
              }}
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center animate-spin-slow"
                style={{
                  background: config.accentColor,
                  boxShadow: `0 0 20px ${config.accentColor}80`
                }}
              >
                <Music className="w-10 h-10 text-white" />
              </div>
            </div>

            {/* Track Info */}
            <div className="text-center">
              <h3 className="font-bold text-lg" style={{ color: isDark ? '#ffffff' : '#111827' }}>
                Tactile Echoes
              </h3>
              <p className="text-xs opacity-70 font-medium">Soft Horizon — Neumorphic Album</p>
            </div>

            {/* Track Progress Bar */}
            <div className="w-full">
              <NeuSlider
                config={config}
                min={0}
                max={100}
                value={trackProgress}
                onChange={setTrackProgress}
                label="02:14 / 04:30"
              />
            </div>

            {/* Transport Control Buttons */}
            <div className="flex items-center gap-4">
              <NeuButton config={config} size="md">
                <SkipBack className="w-4 h-4" />
              </NeuButton>

              <NeuButton
                config={config}
                size="lg"
                variant="accent"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white ml-0.5" />}
              </NeuButton>

              <NeuButton config={config} size="md">
                <SkipForward className="w-4 h-4" />
              </NeuButton>
            </div>

            {/* Volume Control */}
            <div className="w-full pt-2">
              <NeuSlider
                config={config}
                label="Master Volume"
                unit="%"
                value={volume}
                onChange={setVolume}
              />
            </div>
          </NeuCard>
        </div>
      )}

      {/* Tab 3: Neumorphic Push Calculator */}
      {activeTab === 'calculator' && (
        <div className="max-w-xs mx-auto w-full">
          <NeuCard config={config} className="flex flex-col gap-4 p-5">
            {/* Display Screen */}
            <div
              className="p-4 rounded-xl text-right font-mono font-bold text-2xl tracking-wider overflow-x-auto select-none"
              style={{
                background: config.bgColor,
                boxShadow: isDark
                  ? `inset 3px 3px 6px rgba(0,0,0,0.6), inset -3px -3px 6px rgba(255,255,255,0.05)`
                  : `inset 3px 3px 6px rgba(0,0,0,0.18), inset -3px -3px 6px rgba(255,255,255,0.9)`,
                color: isDark ? '#38bdf8' : '#0284c7'
              }}
            >
              {calcDisplay}
            </div>

            {/* Keypad Grid */}
            <div className="grid grid-cols-4 gap-2.5">
              <NeuButton config={config} size="sm" onClick={handleClear} className="font-bold text-red-500">
                AC
              </NeuButton>
              <NeuButton config={config} size="sm" onClick={() => setCalcDisplay(String(-parseFloat(calcDisplay)))}>
                ±
              </NeuButton>
              <NeuButton config={config} size="sm" onClick={() => setCalcDisplay(String(parseFloat(calcDisplay) / 100))}>
                %
              </NeuButton>
              <NeuButton config={config} size="sm" variant="accent" onClick={() => handleOp('÷')}>
                ÷
              </NeuButton>

              <NeuButton config={config} size="sm" onClick={() => handleNum('7')}>7</NeuButton>
              <NeuButton config={config} size="sm" onClick={() => handleNum('8')}>8</NeuButton>
              <NeuButton config={config} size="sm" onClick={() => handleNum('9')}>9</NeuButton>
              <NeuButton config={config} size="sm" variant="accent" onClick={() => handleOp('×')}>×</NeuButton>

              <NeuButton config={config} size="sm" onClick={() => handleNum('4')}>4</NeuButton>
              <NeuButton config={config} size="sm" onClick={() => handleNum('5')}>5</NeuButton>
              <NeuButton config={config} size="sm" onClick={() => handleNum('6')}>6</NeuButton>
              <NeuButton config={config} size="sm" variant="accent" onClick={() => handleOp('-')}>-</NeuButton>

              <NeuButton config={config} size="sm" onClick={() => handleNum('1')}>1</NeuButton>
              <NeuButton config={config} size="sm" onClick={() => handleNum('2')}>2</NeuButton>
              <NeuButton config={config} size="sm" onClick={() => handleNum('3')}>3</NeuButton>
              <NeuButton config={config} size="sm" variant="accent" onClick={() => handleOp('+')}>+</NeuButton>

              <NeuButton config={config} size="sm" onClick={() => handleNum('0')} className="col-span-2">0</NeuButton>
              <NeuButton config={config} size="sm" onClick={() => handleNum('.')}>.</NeuButton>
              <NeuButton config={config} size="sm" variant="glow" onClick={handleEquals} className="font-extrabold text-blue-500">
                =
              </NeuButton>
            </div>
          </NeuCard>
        </div>
      )}

      {/* Tab 4: Design System Tokens Table */}
      {activeTab === 'tokens' && (
        <div className="flex flex-col gap-4 overflow-x-auto">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider opacity-70">
              Generated System Tokens (Ready for Google Sheets Sync)
            </span>
          </div>

          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-opacity-20" style={{ borderColor: isDark ? 'white' : 'black' }}>
                <th className="p-2 font-bold uppercase opacity-60">Property</th>
                <th className="p-2 font-bold uppercase opacity-60">Value</th>
                <th className="p-2 font-bold uppercase opacity-60">Type</th>
                <th className="p-2 font-bold uppercase opacity-60">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-opacity-10" style={{ borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                <td className="p-2 font-mono font-semibold">surface-bg</td>
                <td className="p-2 font-mono">{config.bgColor}</td>
                <td className="p-2">Hex Color</td>
                <td className="p-2 text-emerald-500 font-bold">Active</td>
              </tr>
              <tr className="border-b border-opacity-10" style={{ borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                <td className="p-2 font-mono font-semibold">accent-tint</td>
                <td className="p-2 font-mono">{config.accentColor}</td>
                <td className="p-2">Hex Color</td>
                <td className="p-2 text-emerald-500 font-bold">Active</td>
              </tr>
              <tr className="border-b border-opacity-10" style={{ borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                <td className="p-2 font-mono font-semibold">elevation-distance</td>
                <td className="p-2 font-mono">{config.elevation}px</td>
                <td className="p-2">Dimension</td>
                <td className="p-2 text-emerald-500 font-bold">Active</td>
              </tr>
              <tr className="border-b border-opacity-10" style={{ borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                <td className="p-2 font-mono font-semibold">shadow-blur</td>
                <td className="p-2 font-mono">{config.blur}px</td>
                <td className="p-2">Dimension</td>
                <td className="p-2 text-emerald-500 font-bold">Active</td>
              </tr>
              <tr className="border-b border-opacity-10" style={{ borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                <td className="p-2 font-mono font-semibold">border-radius</td>
                <td className="p-2 font-mono">{config.radius}px</td>
                <td className="p-2">Dimension</td>
                <td className="p-2 text-emerald-500 font-bold">Active</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </NeuCard>
  );
};
