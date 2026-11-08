import React from 'react';
import { X, Keyboard } from 'lucide-react';
import { soundManager } from '../utils/audio';
import { Language, getTranslation } from '../utils/i18n';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: Language;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
  language = 'en',
}) => {
  const t = getTranslation(language);

  if (!isOpen) return null;

  const shortcuts = [
    { key: '0 – 9', desc: t.shortDigits },
    { key: '.', desc: t.shortDecimal },
    { key: '+ - * /', desc: t.shortOps },
    { key: 'Enter / =', desc: t.shortEnter },
    { key: 'Backspace', desc: t.shortBackspace },
    { key: 'Escape', desc: t.shortEscape },
    { key: '( / )', desc: t.shortParens },
    { key: '^', desc: t.shortPower },
    { key: '%', desc: t.shortPercent },
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
              {t.shortTitle}
            </h3>
          </div>
          <button
            onClick={() => {
              soundManager.play('click');
              onClose();
            }}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
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
            className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium tracking-wide transition-colors cursor-pointer"
          >
            {t.shortAcknowledge}
          </button>
        </div>
      </div>
    </div>
  );
};
