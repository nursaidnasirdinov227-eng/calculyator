import React, { useState } from 'react';
import { Copy, Check, Delete } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface CalculatorDisplayProps {
  expression: string;
  resultPreview?: string;
  angleMode?: 'DEG' | 'RAD';
  onToggleAngleMode?: () => void;
  onClear: () => void;
  onDelete: () => void;
}

export const CalculatorDisplay: React.FC<CalculatorDisplayProps> = ({
  expression,
  resultPreview,
  angleMode,
  onToggleAngleMode,
  onClear,
  onDelete,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    soundManager.play('click');
    const textToCopy = resultPreview || expression || '0';
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="relative w-full rounded-2xl bg-black/60 border border-violet-500/30 p-4 sm:p-5 shadow-[inset_0_2px_12px_rgba(0,0,0,0.8)] backdrop-blur-md mb-5 overflow-hidden">
      {/* Top telemetry bar */}
      <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
        <div className="flex items-center gap-2">
          {angleMode && onToggleAngleMode && (
            <button
              onClick={() => {
                soundManager.play('mode');
                onToggleAngleMode();
              }}
              className="px-2 py-0.5 rounded bg-violet-950/80 border border-violet-500/40 text-cyan-300 hover:border-cyan-400 font-semibold transition-colors"
            >
              {angleMode}
            </button>
          )}
          <span className="text-[11px] text-slate-500">PRECISION 64-BIT</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900/80 border border-slate-700/60 hover:border-cyan-400/50 text-slate-300 hover:text-cyan-300 transition-colors text-[11px]"
            title="Copy current expression or result"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              soundManager.play('op');
              onDelete();
            }}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
            title="Delete last character (Backspace)"
          >
            <Delete className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              soundManager.play('clear');
              onClear();
            }}
            className="px-2 py-0.5 rounded bg-rose-950/40 border border-rose-500/30 text-rose-300 hover:bg-rose-900/50 hover:border-rose-400 text-[11px] font-bold transition-colors"
            title="All Clear (AC)"
          >
            AC
          </button>
        </div>
      </div>

      {/* Main Display Expression Area */}
      <div className="min-h-[52px] flex flex-col justify-end items-end text-right">
        {/* Secondary history/preview line */}
        <div className="w-full text-sm sm:text-base font-mono text-slate-400 tracking-wider truncate mb-1">
          {expression ? expression : '0'}
        </div>

        {/* Primary result preview */}
        <div
          className="w-full text-2xl sm:text-4xl font-bold font-mono tracking-tight text-white tabular-nums truncate drop-shadow-[0_0_12px_rgba(6,182,212,0.4)]"
          style={{ fontFamily: 'Orbitron, JetBrains Mono, monospace' }}
        >
          {resultPreview ? `= ${resultPreview}` : expression || '0'}
        </div>
      </div>
    </div>
  );
};
