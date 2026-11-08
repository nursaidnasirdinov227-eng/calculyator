import React, { useState, useMemo } from 'react';
import { ArrowLeftRight, Copy, Check, Scale, Ruler, Thermometer, Clock, Gauge, HardDrive, Compass, Layers } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface UnitConverterProps {
  onAddHistory: (expr: string, res: string, mode: string) => void;
}

type UnitCategory = 'length' | 'weight' | 'temp' | 'area' | 'volume' | 'time' | 'speed' | 'data';

interface UnitDefinition {
  id: string;
  name: string;
  toBase: (v: number) => number;
  fromBase: (v: number) => number;
}

const CATEGORIES: Record<
  UnitCategory,
  { label: string; icon: React.FC<{ className?: string }>; units: UnitDefinition[] }
> = {
  length: {
    label: 'Length',
    icon: Ruler,
    units: [
      { id: 'm', name: 'Meters (m)', toBase: (v) => v, fromBase: (v) => v },
      { id: 'km', name: 'Kilometers (km)', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      { id: 'cm', name: 'Centimeters (cm)', toBase: (v) => v / 100, fromBase: (v) => v * 100 },
      { id: 'mm', name: 'Millimeters (mm)', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { id: 'mi', name: 'Miles (mi)', toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
      { id: 'yd', name: 'Yards (yd)', toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
      { id: 'ft', name: 'Feet (ft)', toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
      { id: 'in', name: 'Inches (in)', toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
      { id: 'au', name: 'Astronomical Unit (AU)', toBase: (v) => v * 149597870700, fromBase: (v) => v / 149597870700 },
      { id: 'ly', name: 'Light-Year (ly)', toBase: (v) => v * 9.4607e15, fromBase: (v) => v / 9.4607e15 },
    ],
  },
  weight: {
    label: 'Weight',
    icon: Scale,
    units: [
      { id: 'kg', name: 'Kilograms (kg)', toBase: (v) => v, fromBase: (v) => v },
      { id: 'g', name: 'Grams (g)', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { id: 'mg', name: 'Milligrams (mg)', toBase: (v) => v / 1000000, fromBase: (v) => v * 1000000 },
      { id: 'lb', name: 'Pounds (lb)', toBase: (v) => v * 0.45359237, fromBase: (v) => v / 0.45359237 },
      { id: 'oz', name: 'Ounces (oz)', toBase: (v) => v * 0.02834952, fromBase: (v) => v / 0.02834952 },
      { id: 'ton', name: 'Metric Ton (t)', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    ],
  },
  temp: {
    label: 'Temperature',
    icon: Thermometer,
    units: [
      { id: 'c', name: 'Celsius (°C)', toBase: (v) => v, fromBase: (v) => v },
      { id: 'f', name: 'Fahrenheit (°F)', toBase: (v) => ((v - 32) * 5) / 9, fromBase: (v) => (v * 9) / 5 + 32 },
      { id: 'k', name: 'Kelvin (K)', toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
    ],
  },
  area: {
    label: 'Area',
    icon: Layers,
    units: [
      { id: 'sq_m', name: 'Square Meters (m²)', toBase: (v) => v, fromBase: (v) => v },
      { id: 'sq_km', name: 'Square Kilometers (km²)', toBase: (v) => v * 1e6, fromBase: (v) => v / 1e6 },
      { id: 'sq_ft', name: 'Square Feet (ft²)', toBase: (v) => v * 0.092903, fromBase: (v) => v / 0.092903 },
      { id: 'acre', name: 'Acres (ac)', toBase: (v) => v * 4046.86, fromBase: (v) => v / 4046.86 },
      { id: 'ha', name: 'Hectares (ha)', toBase: (v) => v * 10000, fromBase: (v) => v / 10000 },
    ],
  },
  volume: {
    label: 'Volume',
    icon: Compass,
    units: [
      { id: 'l', name: 'Liters (L)', toBase: (v) => v, fromBase: (v) => v },
      { id: 'ml', name: 'Milliliters (mL)', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { id: 'm3', name: 'Cubic Meters (m³)', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      { id: 'gal', name: 'Gallons (US gal)', toBase: (v) => v * 3.78541, fromBase: (v) => v / 3.78541 },
      { id: 'floz', name: 'Fluid Ounces (fl oz)', toBase: (v) => v * 0.0295735, fromBase: (v) => v / 0.0295735 },
    ],
  },
  time: {
    label: 'Time',
    icon: Clock,
    units: [
      { id: 's', name: 'Seconds (s)', toBase: (v) => v, fromBase: (v) => v },
      { id: 'min', name: 'Minutes (min)', toBase: (v) => v * 60, fromBase: (v) => v / 60 },
      { id: 'h', name: 'Hours (h)', toBase: (v) => v * 3600, fromBase: (v) => v / 3600 },
      { id: 'd', name: 'Days (d)', toBase: (v) => v * 86400, fromBase: (v) => v / 86400 },
      { id: 'w', name: 'Weeks (wk)', toBase: (v) => v * 604800, fromBase: (v) => v / 604800 },
      { id: 'yr', name: 'Years (yr)', toBase: (v) => v * 31557600, fromBase: (v) => v / 31557600 },
      { id: 'ls', name: 'Light-Seconds (ls)', toBase: (v) => v * 1, fromBase: (v) => v },
    ],
  },
  speed: {
    label: 'Speed',
    icon: Gauge,
    units: [
      { id: 'ms', name: 'Meters/second (m/s)', toBase: (v) => v, fromBase: (v) => v },
      { id: 'kmh', name: 'Kilometers/hour (km/h)', toBase: (v) => v / 3.6, fromBase: (v) => v * 3.6 },
      { id: 'mph', name: 'Miles/hour (mph)', toBase: (v) => v * 0.44704, fromBase: (v) => v / 0.44704 },
      { id: 'knot', name: 'Knots (kn)', toBase: (v) => v * 0.514444, fromBase: (v) => v / 0.514444 },
      { id: 'mach', name: 'Mach (at sea level)', toBase: (v) => v * 340.29, fromBase: (v) => v / 340.29 },
      { id: 'c', name: 'Speed of Light (c)', toBase: (v) => v * 299792458, fromBase: (v) => v / 299792458 },
    ],
  },
  data: {
    label: 'Data Storage',
    icon: HardDrive,
    units: [
      { id: 'b', name: 'Bytes (B)', toBase: (v) => v, fromBase: (v) => v },
      { id: 'kb', name: 'Kilobytes (KB)', toBase: (v) => v * 1024, fromBase: (v) => v / 1024 },
      { id: 'mb', name: 'Megabytes (MB)', toBase: (v) => v * 1048576, fromBase: (v) => v / 1048576 },
      { id: 'gb', name: 'Gigabytes (GB)', toBase: (v) => v * 1073741824, fromBase: (v) => v / 1073741824 },
      { id: 'tb', name: 'Terabytes (TB)', toBase: (v) => v * 1.0995e12, fromBase: (v) => v / 1.0995e12 },
      { id: 'pb', name: 'Petabytes (PB)', toBase: (v) => v * 1.1259e15, fromBase: (v) => v / 1.1259e15 },
    ],
  },
};

export const UnitConverter: React.FC<UnitConverterProps> = ({ onAddHistory }) => {
  const [category, setCategory] = useState<UnitCategory>('length');
  const [amount, setAmount] = useState<string>('1');
  const [fromUnitId, setFromUnitId] = useState<string>('m');
  const [toUnitId, setToUnitId] = useState<string>('km');
  const [copied, setCopied] = useState<boolean>(false);

  const activeCategory = CATEGORIES[category];

  // Auto-switch unit IDs when changing categories
  const handleCategoryChange = (newCat: UnitCategory) => {
    soundManager.play('mode');
    setCategory(newCat);
    const units = CATEGORIES[newCat].units;
    setFromUnitId(units[0].id);
    setToUnitId(units[1] ? units[1].id : units[0].id);
  };

  const handleSwap = () => {
    soundManager.play('mode');
    setFromUnitId(toUnitId);
    setToUnitId(fromUnitId);
  };

  const convertedValue = useMemo(() => {
    const val = parseFloat(amount);
    if (isNaN(val)) return 0;
    const fromDef = activeCategory.units.find((u) => u.id === fromUnitId);
    const toDef = activeCategory.units.find((u) => u.id === toUnitId);
    if (!fromDef || !toDef) return 0;

    const baseVal = fromDef.toBase(val);
    return toDef.fromBase(baseVal);
  }, [amount, fromUnitId, toUnitId, activeCategory]);

  const formattedResult = useMemo(() => {
    if (isNaN(convertedValue)) return '0';
    const abs = Math.abs(convertedValue);
    if (abs >= 1e12 || (abs > 0 && abs < 1e-6)) {
      return convertedValue.toExponential(6).replace(/\.?0+e/, 'e');
    }
    return convertedValue.toLocaleString('en-US', {
      maximumFractionDigits: 8,
    });
  }, [convertedValue]);

  const handleCopy = () => {
    soundManager.play('click');
    const fromDef = activeCategory.units.find((u) => u.id === fromUnitId)?.name || fromUnitId;
    const toDef = activeCategory.units.find((u) => u.id === toUnitId)?.name || toUnitId;
    navigator.clipboard.writeText(formattedResult).then(() => {
      setCopied(true);
      onAddHistory(`${amount} ${fromDef} → ${toDef}`, formattedResult, 'Unit');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="w-full space-y-4">
      {/* Category selector pill strip */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-slate-900/90 border border-slate-800 overflow-x-auto scrollbar-none">
        {(Object.keys(CATEGORIES) as UnitCategory[]).map((catKey) => {
          const item = CATEGORIES[catKey];
          const Icon = item.icon;
          const isActive = category === catKey;
          return (
            <button
              key={catKey}
              onClick={() => handleCategoryChange(catKey)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Converter Card */}
      <div className="rounded-2xl cosmic-glass border border-violet-500/30 p-5 shadow-2xl space-y-4">
        {/* Input Value */}
        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase tracking-wider">
            Magnitude Value
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-black/60 border border-slate-700 focus:border-cyan-400 text-white font-mono text-2xl font-bold outline-none tabular-nums"
          />
        </div>

        {/* Unit Selectors & Swap Button */}
        <div className="grid grid-cols-1 sm:grid-cols-11 gap-3 items-center">
          <div className="sm:col-span-5">
            <label className="block text-xs text-slate-400 mb-1">From Unit</label>
            <select
              value={fromUnitId}
              onChange={(e) => {
                soundManager.play('mode');
                setFromUnitId(e.target.value);
              }}
              className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-slate-700 text-white font-mono text-sm focus:border-cyan-400 outline-none cursor-pointer"
            >
              {activeCategory.units.map((u) => (
                <option key={u.id} value={u.id} className="bg-slate-900 text-white">
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-1 flex justify-center pt-5 sm:pt-0">
            <button
              onClick={handleSwap}
              className="p-3 rounded-full cosmic-glass border border-violet-500/40 text-cyan-300 hover:text-white hover:border-cyan-400 hover:scale-110 active:scale-95 transition-all shadow-md cursor-pointer"
              title="Swap units"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>
          </div>

          <div className="sm:col-span-5">
            <label className="block text-xs text-slate-400 mb-1">To Unit</label>
            <select
              value={toUnitId}
              onChange={(e) => {
                soundManager.play('mode');
                setToUnitId(e.target.value);
              }}
              className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-slate-700 text-white font-mono text-sm focus:border-cyan-400 outline-none cursor-pointer"
            >
              {activeCategory.units.map((u) => (
                <option key={u.id} value={u.id} className="bg-slate-900 text-white">
                  {u.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Result Area */}
        <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-mono mb-1">Normalized Result</div>
            <div
              className="text-2xl sm:text-4xl font-bold font-mono text-cyan-300 tabular-nums drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]"
              style={{ fontFamily: 'Orbitron, JetBrains Mono, monospace' }}
            >
              {formattedResult}
            </div>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-violet-950/60 border border-violet-500/40 hover:border-cyan-400/60 text-slate-200 hover:text-cyan-300 transition-all cursor-pointer text-xs font-mono"
            title="Copy unit result"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 font-bold">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
