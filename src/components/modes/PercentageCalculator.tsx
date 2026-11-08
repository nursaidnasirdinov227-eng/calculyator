import React, { useState } from 'react';
import { Copy, Check, ArrowRight, Percent } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface PercentageCalculatorProps {
  onAddHistory: (expr: string, res: string, mode: string) => void;
}

export const PercentageCalculator: React.FC<PercentageCalculatorProps> = ({ onAddHistory }) => {
  // Scenario 1: X% of Y
  const [s1Percent, setS1Percent] = useState<string>('15');
  const [s1Total, setS1Total] = useState<string>('240');

  // Scenario 2: X is what % of Y
  const [s2Part, setS2Part] = useState<string>('45');
  const [s2Total, setS2Total] = useState<string>('300');

  // Scenario 3: % Increase / Decrease from X to Y
  const [s3From, setS3From] = useState<string>('120');
  const [s3To, setS3To] = useState<string>('180');

  // Scenario 4: Markup & Margin
  const [s4Cost, setS4Cost] = useState<string>('50');
  const [s4Markup, setS4Markup] = useState<string>('40');

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string, expr: string) => {
    soundManager.play('click');
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      onAddHistory(expr, text, 'Percentage');
      setTimeout(() => setCopiedId(null), 1800);
    });
  };

  // Calculations
  const calc1Result = (() => {
    const p = parseFloat(s1Percent);
    const t = parseFloat(s1Total);
    if (isNaN(p) || isNaN(t)) return '—';
    return ((p / 100) * t).toLocaleString('en-US', { maximumFractionDigits: 6 });
  })();

  const calc2Result = (() => {
    const part = parseFloat(s2Part);
    const tot = parseFloat(s2Total);
    if (isNaN(part) || isNaN(tot) || tot === 0) return '—';
    const pct = (part / tot) * 100;
    return `${pct.toLocaleString('en-US', { maximumFractionDigits: 4 })}%`;
  })();

  const calc3Result = (() => {
    const from = parseFloat(s3From);
    const to = parseFloat(s3To);
    if (isNaN(from) || isNaN(to) || from === 0) return { text: '—', isIncrease: false };
    const diff = to - from;
    const pct = (diff / Math.abs(from)) * 100;
    const sign = pct >= 0 ? '+' : '';
    return {
      text: `${sign}${pct.toLocaleString('en-US', { maximumFractionDigits: 4 })}%`,
      isIncrease: pct >= 0,
      diff: diff.toLocaleString('en-US', { maximumFractionDigits: 4 }),
    };
  })();

  const calc4Result = (() => {
    const cost = parseFloat(s4Cost);
    const markup = parseFloat(s4Markup);
    if (isNaN(cost) || isNaN(markup)) return { price: '—', profit: '—', margin: '—' };
    const price = cost * (1 + markup / 100);
    const profit = price - cost;
    const margin = price !== 0 ? (profit / price) * 100 : 0;
    return {
      price: price.toLocaleString('en-US', { maximumFractionDigits: 2 }),
      profit: profit.toLocaleString('en-US', { maximumFractionDigits: 2 }),
      margin: `${margin.toFixed(2)}%`,
    };
  })();

  return (
    <div className="w-full space-y-4">
      {/* Card 1: What is X% of Y? */}
      <div className="rounded-2xl cosmic-glass border border-violet-500/30 p-4 sm:p-5 shadow-lg">
        <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-cyan-300">
          <Percent className="w-4 h-4 text-violet-400" />
          <span>What is X% of Y?</span>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="text-slate-400">What is</span>
          <div className="relative w-24">
            <input
              type="number"
              value={s1Percent}
              onChange={(e) => setS1Percent(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-black/60 border border-slate-700 focus:border-cyan-400 text-white font-mono text-center outline-none"
            />
            <span className="absolute right-2.5 top-2.5 text-xs text-slate-500">%</span>
          </div>
          <span className="text-slate-400">of</span>
          <div className="relative w-32">
            <input
              type="number"
              value={s1Total}
              onChange={(e) => setS1Total(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-black/60 border border-slate-700 focus:border-cyan-400 text-white font-mono text-center outline-none"
            />
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500 hidden sm:block" />
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xl font-bold font-mono text-white tabular-nums drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]">
              {calc1Result}
            </span>
            <button
              onClick={() => handleCopy(calc1Result, 'c1', `${s1Percent}% of ${s1Total}`)}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-cyan-300"
              title="Copy result"
            >
              {copiedId === 'c1' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Card 2: X is what % of Y? */}
      <div className="rounded-2xl cosmic-glass border border-violet-500/30 p-4 sm:p-5 shadow-lg">
        <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-cyan-300">
          <Percent className="w-4 h-4 text-violet-400" />
          <span>Part-to-Whole Ratio</span>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <div className="relative w-28">
            <input
              type="number"
              value={s2Part}
              onChange={(e) => setS2Part(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-black/60 border border-slate-700 focus:border-cyan-400 text-white font-mono text-center outline-none"
            />
          </div>
          <span className="text-slate-400">is what % of</span>
          <div className="relative w-28">
            <input
              type="number"
              value={s2Total}
              onChange={(e) => setS2Total(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-black/60 border border-slate-700 focus:border-cyan-400 text-white font-mono text-center outline-none"
            />
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500 hidden sm:block" />
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xl font-bold font-mono text-cyan-300 tabular-nums drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]">
              {calc2Result}
            </span>
            <button
              onClick={() => handleCopy(calc2Result, 'c2', `${s2Part} as % of ${s2Total}`)}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-cyan-300"
              title="Copy result"
            >
              {copiedId === 'c2' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Card 3: Percentage Increase / Decrease */}
      <div className="rounded-2xl cosmic-glass border border-violet-500/30 p-4 sm:p-5 shadow-lg">
        <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-cyan-300">
          <Percent className="w-4 h-4 text-violet-400" />
          <span>Percentage Change (Growth & Decay)</span>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="text-slate-400">From</span>
          <div className="relative w-28">
            <input
              type="number"
              value={s3From}
              onChange={(e) => setS3From(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-black/60 border border-slate-700 focus:border-cyan-400 text-white font-mono text-center outline-none"
            />
          </div>
          <span className="text-slate-400">To</span>
          <div className="relative w-28">
            <input
              type="number"
              value={s3To}
              onChange={(e) => setS3To(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-black/60 border border-slate-700 focus:border-cyan-400 text-white font-mono text-center outline-none"
            />
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500 hidden sm:block" />
          <div className="flex items-center gap-2 ml-auto">
            <span
              className={`text-xl font-bold font-mono tabular-nums ${
                calc3Result.isIncrease ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {calc3Result.text}
            </span>
            <button
              onClick={() => handleCopy(calc3Result.text, 'c3', `Change from ${s3From} to ${s3To}`)}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-cyan-300"
              title="Copy result"
            >
              {copiedId === 'c3' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Card 4: Markup & Profit Margin */}
      <div className="rounded-2xl cosmic-glass border border-violet-500/30 p-4 sm:p-5 shadow-lg">
        <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-cyan-300">
          <Percent className="w-4 h-4 text-violet-400" />
          <span>Commercial Margin & Markup</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Cost Price ($)</label>
            <input
              type="number"
              value={s4Cost}
              onChange={(e) => setS4Cost(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-black/60 border border-slate-700 focus:border-cyan-400 text-white font-mono outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Markup (%)</label>
            <input
              type="number"
              value={s4Markup}
              onChange={(e) => setS4Markup(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-black/60 border border-slate-700 focus:border-cyan-400 text-white font-mono outline-none"
            />
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex flex-col justify-center">
            <span className="text-[11px] text-slate-400">Selling Price</span>
            <span className="text-base font-bold font-mono text-cyan-300 tabular-nums">
              ${calc4Result.price}
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex flex-col justify-center">
            <span className="text-[11px] text-slate-400">Gross Margin</span>
            <span className="text-base font-bold font-mono text-emerald-400 tabular-nums">
              {calc4Result.margin}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
