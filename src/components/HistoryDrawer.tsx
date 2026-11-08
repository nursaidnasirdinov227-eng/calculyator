import React, { useState } from 'react';
import { X, Trash2, Download, Copy, Check, CornerDownLeft, Sparkles } from 'lucide-react';
import { HistoryItem } from '../utils/history';
import { soundManager } from '../utils/audio';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelectResult: (result: string) => void;
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectResult,
  onDeleteItem,
  onClearAll,
}) => {
  const [copiedAll, setCopiedAll] = useState(false);

  if (!isOpen) return null;

  const handleCopyAll = () => {
    soundManager.play('click');
    const text = history
      .map(
        (h) =>
          `[${new Date(h.timestamp).toLocaleTimeString()}] (${h.mode}) ${h.expression} = ${h.result}`
      )
      .join('\n');
    navigator.clipboard.writeText(text).then(() => {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    });
  };

  const handleDownload = () => {
    soundManager.play('click');
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `cosmic_history_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity">
      <div
        className="relative w-full max-w-md h-full cosmic-glass border-l border-violet-500/30 flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-violet-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h2
              className="text-base font-bold text-white tracking-wider"
              style={{ fontFamily: 'Orbitron, sans-serif' }}
            >
              CHRONICLES
            </h2>
            <span className="text-xs font-mono text-slate-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
              {history.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <>
                <button
                  onClick={handleCopyAll}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-cyan-300 transition-colors"
                  title="Copy all history"
                >
                  {copiedAll ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  onClick={handleDownload}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-cyan-300 transition-colors"
                  title="Export history JSON"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    soundManager.play('clear');
                    onClearAll();
                  }}
                  className="p-1.5 rounded-lg hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 transition-colors"
                  title="Clear all history"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}

            <button
              onClick={() => {
                soundManager.play('click');
                onClose();
              }}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
              <Sparkles className="w-8 h-8 text-violet-400/50 mb-3" />
              <p className="text-sm font-medium text-slate-400">No calculations recorded</p>
              <p className="text-xs text-slate-600 mt-1">
                Computations performed in any mode will automatically stream here.
              </p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="group relative p-3.5 rounded-xl bg-black/40 border border-slate-800/80 hover:border-cyan-400/50 transition-all hover:shadow-[0_0_15px_rgba(6,182,212,0.15)]"
              >
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                  <span className="text-cyan-400 font-semibold uppercase">{item.mode}</span>
                  <div className="flex items-center gap-2">
                    <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
                    <button
                      onClick={() => {
                        soundManager.play('op');
                        onDeleteItem(item.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 hover:text-rose-400 transition-opacity"
                      title="Delete item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-xs font-mono text-slate-400 truncate mb-1">
                  {item.expression}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span
                    className="text-base font-bold font-mono text-white tracking-wide truncate tabular-nums drop-shadow-[0_0_8px_rgba(124,58,237,0.3)]"
                    style={{ fontFamily: 'Orbitron, JetBrains Mono, monospace' }}
                  >
                    = {item.result}
                  </span>

                  <button
                    onClick={() => {
                      soundManager.play('eval');
                      onSelectResult(item.result);
                      onClose();
                    }}
                    className="flex items-center gap-1 px-2 py-1 rounded bg-violet-950/60 border border-violet-500/30 text-cyan-300 hover:border-cyan-400 text-xs font-mono transition-colors"
                    title="Insert result into calculator"
                  >
                    <CornerDownLeft className="w-3 h-3" />
                    <span>Insert</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
