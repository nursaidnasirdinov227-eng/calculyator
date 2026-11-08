import React from 'react';
import { X, Keyboard } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: '0 – 9', desc: 'Input digits' },
    { key: '.', desc: 'Decimal point' },
    { key: '+ - * /', desc: 'Basic arithmetic operators' },
    { key: 'Enter or =', desc: 'Compute / Evaluate result' },
    { key: 'Backspace', desc: 'Delete last character' },
    { key: 'Escape', desc: 'All Clear (AC)' },
    { key: '( and )', desc: 'Parentheses' },
    { key: '^', desc: 'Power function (xʸ)' },
    { key: '%', desc: 'Percentage' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div
        className="w-full max-w-md cosmic-glass border border-violet-500/40 rounded-2xl shadow-2xl p-6 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-violet-500/20 mb-4">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-cyan-400" />
            <h3
              className="text-base font-bold text-white tracking-wider"
              style={{ fontFamily: 'Orbitron, sans-serif' }}
            >
              KEYBOARD PROTOCOLS
            </h3>
          </div>
          <button
            onClick={() => {
              soundManager.play('click');
              onClose();
            }}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2.5">
          {shortcuts.map((s, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-black/40 border border-slate-800 text-xs font-mono"
            >
              <kbd className="px-2 py-0.5 rounded bg-violet-950/80 border border-violet-500/40 text-cyan-300 font-bold">
                {s.key}
              </kbd>
              <span className="text-slate-300">{s.desc}</span>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-3 border-t border-slate-800/80 text-center">
          <button
            onClick={() => {
              soundManager.play('click');
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium tracking-wide transition-colors"
          >
            Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
};
