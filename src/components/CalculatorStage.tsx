import React, { useState } from 'react';
import {
  Calculator as CalcIcon,
  Atom,
  Binary,
  Percent,
  Coins,
  Scale,
  History,
} from 'lucide-react';
import { StandardCalculator } from './modes/StandardCalculator';
import { ScientificCalculator } from './modes/ScientificCalculator';
import { ProgrammerCalculator } from './modes/ProgrammerCalculator';
import { PercentageCalculator } from './modes/PercentageCalculator';
import { CurrencyConverter } from './modes/CurrencyConverter';
import { UnitConverter } from './modes/UnitConverter';
import { soundManager } from '../utils/audio';
import { Language, getTranslation } from '../utils/i18n';

export type CalculatorMode =
  | 'standard'
  | 'scientific'
  | 'programmer'
  | 'percentage'
  | 'currency'
  | 'unit';

interface CalculatorStageProps {
  onAddHistory: (expr: string, res: string, mode: string) => void;
  onOpenHistory: () => void;
  historyCount: number;
  initialValue?: string;
  language?: Language;
}

export const CalculatorStage: React.FC<CalculatorStageProps> = ({
  onAddHistory,
  onOpenHistory,
  historyCount,
  initialValue,
  language = 'en',
}) => {
  const [activeMode, setActiveMode] = useState<CalculatorMode>('standard');
  const t = getTranslation(language);

  const modes = [
    { id: 'standard', label: t.modeStandard, icon: CalcIcon, desc: t.modeDescStandard },
    { id: 'scientific', label: t.modeScientific, icon: Atom, desc: t.modeDescScientific },
    { id: 'programmer', label: t.modeProgrammer, icon: Binary, desc: t.modeDescProgrammer },
    { id: 'percentage', label: t.modePercentage, icon: Percent, desc: t.modeDescPercentage },
    { id: 'currency', label: t.modeCurrency, icon: Coins, desc: t.modeDescCurrency },
    { id: 'unit', label: t.modeUnit, icon: Scale, desc: t.modeDescUnit },
  ];

  const handleModeChange = (mode: CalculatorMode) => {
    soundManager.play('mode');
    setActiveMode(mode);
  };

  return (
    <section id="calculator" className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto relative z-10">
      {/* Mode Selector Tabs (Section: Calculator Modes) */}
      <div id="modes" className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2
              className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide"
              style={{ fontFamily: 'Orbitron, sans-serif' }}
            >
              {t.cockpitTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {t.cockpitSubtitle}
            </p>
          </div>

          <button
            onClick={() => {
              soundManager.play('click');
              onOpenHistory();
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl cosmic-glass border border-violet-500/30 hover:border-cyan-400 text-xs font-mono text-cyan-300 transition-all cursor-pointer shadow-md hover:scale-105"
          >
            <History className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">{t.chronicles}</span>
            {historyCount > 0 && (
              <span className="px-1.5 py-0.2 rounded bg-violet-900 text-violet-200 text-[11px] font-bold">
                {historyCount}
              </span>
            )}
          </button>
        </div>

        {/* Tab Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 p-1.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 backdrop-blur-md">
          {modes.map((m) => {
            const Icon = m.icon;
            const isActive = activeMode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => handleModeChange(m.id as CalculatorMode)}
                className={`flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl transition-all cursor-pointer text-center group ${
                  isActive
                    ? 'bg-gradient-to-b from-violet-600/40 to-indigo-700/40 border border-cyan-400/80 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                }`}
              >
                <Icon
                  className={`w-5 h-5 mb-1.5 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-cyan-300' : 'text-slate-400 group-hover:text-cyan-400'
                  }`}
                />
                <span className="text-xs font-semibold whitespace-nowrap">{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Glassmorphic Calculator Housing */}
      <div className="relative rounded-3xl cosmic-glass border-2 border-violet-500/40 shadow-[0_0_50px_rgba(124,58,237,0.25)] p-5 sm:p-8 backdrop-blur-2xl transition-all duration-300 hover:border-violet-400/60">
        {/* Subtle decorative corner optical marks */}
        <div className="absolute top-3 left-3 w-2 h-2 border-t-2 border-l-2 border-cyan-400/60 rounded-tl" />
        <div className="absolute top-3 right-3 w-2 h-2 border-t-2 border-r-2 border-cyan-400/60 rounded-tr" />
        <div className="absolute bottom-3 left-3 w-2 h-2 border-b-2 border-l-2 border-cyan-400/60 rounded-bl" />
        <div className="absolute bottom-3 right-3 w-2 h-2 border-b-2 border-r-2 border-cyan-400/60 rounded-br" />

        {/* Dynamic Mode Content */}
        {activeMode === 'standard' && (
          <StandardCalculator
            onAddHistory={onAddHistory}
            initialValue={initialValue}
            language={language}
          />
        )}

        {activeMode === 'scientific' && (
          <ScientificCalculator
            onAddHistory={onAddHistory}
            initialValue={initialValue}
            language={language}
          />
        )}

        {activeMode === 'programmer' && (
          <ProgrammerCalculator
            onAddHistory={onAddHistory}
            initialValue={initialValue}
            language={language}
          />
        )}

        {activeMode === 'percentage' && (
          <PercentageCalculator
            onAddHistory={onAddHistory}
            language={language}
          />
        )}

        {activeMode === 'currency' && (
          <CurrencyConverter
            onAddHistory={onAddHistory}
            language={language}
          />
        )}

        {activeMode === 'unit' && (
          <UnitConverter
            onAddHistory={onAddHistory}
            language={language}
          />
        )}
      </div>
    </section>
  );
};
