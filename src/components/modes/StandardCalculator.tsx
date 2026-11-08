import React, { useState, useEffect, useCallback } from 'react';
import { CalculatorDisplay } from '../calculator/CalculatorDisplay';
import { MathEngine } from '../../utils/mathEngine';
import { soundManager } from '../../utils/audio';

import { Language } from '../../utils/i18n';

interface StandardCalculatorProps {
  onAddHistory: (expr: string, res: string, mode: string) => void;
  initialValue?: string;
  language?: Language;
}

export const StandardCalculator: React.FC<StandardCalculatorProps> = ({
  onAddHistory,
  initialValue,
  language = 'en',
}) => {
  const [expression, setExpression] = useState<string>(initialValue || '');
  const [resultPreview, setResultPreview] = useState<string>('');
  const [lastCalculated, setLastCalculated] = useState<boolean>(false);

  // Update when initialValue changes from history click
  useEffect(() => {
    if (initialValue) {
      setExpression(initialValue);
      setLastCalculated(false);
    }
  }, [initialValue]);

  // Compute live preview whenever expression changes
  useEffect(() => {
    if (!expression || expression.trim() === '') {
      setResultPreview('');
      return;
    }

    // Only attempt preview if last char isn't a trailing operator
    const lastChar = expression.slice(-1);
    if (!['+', '-', '×', '÷', '*', '/', '^', '('].includes(lastChar)) {
      const evalRes = MathEngine.evaluate(expression, 'DEG');
      if (evalRes.success && evalRes.formatted) {
        setResultPreview(evalRes.formatted);
      } else {
        setResultPreview('');
      }
    }
  }, [expression]);

  const handleAppend = useCallback(
    (char: string, type: 'num' | 'op') => {
      soundManager.play(type);

      if (lastCalculated && type === 'num') {
        // Start fresh on new number
        setExpression(char);
        setLastCalculated(false);
        return;
      }

      setLastCalculated(false);
      setExpression((prev) => {
        // Prevent duplicate decimals in same number token
        if (char === '.') {
          const parts = prev.split(/[\+\-\×\÷\*\/\^\(\)]/);
          const currentPart = parts[parts.length - 1];
          if (currentPart.includes('.')) return prev;
        }

        // Prevent invalid double operators like ++ or ×÷
        const operators = ['+', '-', '×', '÷'];
        if (operators.includes(char)) {
          const last = prev.slice(-1);
          if (operators.includes(last)) {
            return prev.slice(0, -1) + char;
          }
        }

        return prev + char;
      });
    },
    [lastCalculated]
  );

  const handleClear = useCallback(() => {
    soundManager.play('clear');
    setExpression('');
    setResultPreview('');
    setLastCalculated(false);
  }, []);

  const handleDelete = useCallback(() => {
    soundManager.play('op');
    setExpression((prev) => prev.slice(0, -1));
    setLastCalculated(false);
  }, []);

  const handleToggleSign = useCallback(() => {
    soundManager.play('op');
    setExpression((prev) => {
      if (!prev) return '-';
      if (prev.startsWith('-')) return prev.slice(1);
      return '-' + prev;
    });
  }, []);

  const handleCalculate = useCallback(() => {
    if (!expression) return;
    const res = MathEngine.evaluate(expression, 'DEG');
    if (res.success && res.formatted) {
      soundManager.play('eval');
      onAddHistory(expression, res.formatted, 'Standard');
      setExpression(res.formatted);
      setResultPreview('');
      setLastCalculated(true);
    } else {
      soundManager.play('error');
      setResultPreview(res.error || 'Error');
    }
  }, [expression, onAddHistory]);

  const handleSquare = useCallback(() => {
    soundManager.play('op');
    if (!expression) return;
    const res = MathEngine.evaluate(`(${expression})^2`, 'DEG');
    if (res.success && res.formatted) {
      onAddHistory(`(${expression})²`, res.formatted, 'Standard');
      setExpression(res.formatted);
      setResultPreview('');
      setLastCalculated(true);
    }
  }, [expression, onAddHistory]);

  const handleSqrt = useCallback(() => {
    soundManager.play('op');
    if (!expression) return;
    const res = MathEngine.evaluate(`sqrt(${expression})`, 'DEG');
    if (res.success && res.formatted) {
      onAddHistory(`√(${expression})`, res.formatted, 'Standard');
      setExpression(res.formatted);
      setResultPreview('');
      setLastCalculated(true);
    } else {
      soundManager.play('error');
      setResultPreview(res.error || 'Error');
    }
  }, [expression, onAddHistory]);

  const handleReciprocal = useCallback(() => {
    soundManager.play('op');
    if (!expression) return;
    const res = MathEngine.evaluate(`1/(${expression})`, 'DEG');
    if (res.success && res.formatted) {
      onAddHistory(`1/(${expression})`, res.formatted, 'Standard');
      setExpression(res.formatted);
      setResultPreview('');
      setLastCalculated(true);
    } else {
      soundManager.play('error');
      setResultPreview(res.error || 'Error');
    }
  }, [expression, onAddHistory]);

  // Global keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture if focus is in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      const key = e.key;

      if (/[0-9]/.test(key)) {
        e.preventDefault();
        handleAppend(key, 'num');
      } else if (key === '.') {
        e.preventDefault();
        handleAppend('.', 'num');
      } else if (key === '+') {
        e.preventDefault();
        handleAppend('+', 'op');
      } else if (key === '-') {
        e.preventDefault();
        handleAppend('-', 'op');
      } else if (key === '*' || key === 'x') {
        e.preventDefault();
        handleAppend('×', 'op');
      } else if (key === '/') {
        e.preventDefault();
        handleAppend('÷', 'op');
      } else if (key === '%') {
        e.preventDefault();
        handleAppend('%', 'op');
      } else if (key === '(' || key === ')') {
        e.preventDefault();
        handleAppend(key, 'op');
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        handleCalculate();
      } else if (key === 'Backspace') {
        e.preventDefault();
        handleDelete();
      } else if (key === 'Escape') {
        e.preventDefault();
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleAppend, handleCalculate, handleClear, handleDelete]);

  return (
    <div className="w-full">
      <CalculatorDisplay
        expression={expression}
        resultPreview={resultPreview}
        onClear={handleClear}
        onDelete={handleDelete}
        language={language}
      />

      {/* Button Keypad Grid */}
      <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
        {/* Row 1: Advanced immediate functions */}
        <button
          onClick={handleReciprocal}
          className="p-3 sm:p-3.5 rounded-xl cosmic-glass border border-violet-500/30 text-cyan-300 hover:border-cyan-400 font-mono text-sm hover:scale-[1.02] active:scale-[0.97] transition-all cursor-pointer"
        >
          1/x
        </button>
        <button
          onClick={handleSquare}
          className="p-3 sm:p-3.5 rounded-xl cosmic-glass border border-violet-500/30 text-cyan-300 hover:border-cyan-400 font-mono text-sm hover:scale-[1.02] active:scale-[0.97] transition-all cursor-pointer"
        >
          x²
        </button>
        <button
          onClick={handleSqrt}
          className="p-3 sm:p-3.5 rounded-xl cosmic-glass border border-violet-500/30 text-cyan-300 hover:border-cyan-400 font-mono text-sm hover:scale-[1.02] active:scale-[0.97] transition-all cursor-pointer"
        >
          √x
        </button>
        <button
          onClick={() => handleAppend('÷', 'op')}
          className="p-3 sm:p-3.5 rounded-xl bg-violet-900/40 border border-violet-500/40 text-violet-200 hover:border-violet-400 hover:bg-violet-800/50 font-mono text-lg font-bold hover:scale-[1.02] active:scale-[0.97] transition-all cursor-pointer"
        >
          ÷
        </button>

        {/* Row 2 */}
        <button
          onClick={() => handleAppend('7', 'num')}
          className="p-3 sm:p-4 rounded-xl cosmic-glass border border-slate-800 hover:border-cyan-500/40 text-white font-mono text-lg font-semibold hover:bg-slate-850 hover:scale-[1.02] active:scale-[0.97] transition-all cursor-pointer"
        >
          7
        </button>
        <button
          onClick={() => handleAppend('8', 'num')}
          className="p-3 sm:p-4 rounded-xl cosmic-glass border border-slate-800 hover:border-cyan-500/40 text-white font-mono text-lg font-semibold hover:bg-slate-850 hover:scale-[1.02] active:scale-[0.97] transition-all cursor-pointer"
        >
          8
        </button>
        <button
          onClick={() => handleAppend('9', 'num')}
          className="p-3 sm:p-4 rounded-xl cosmic-glass border border-slate-800 hover:border-cyan-500/40 text-white font-mono text-lg font-semibold hover:bg-slate-850 hover:scale-[1.02] active:scale-[0.97] transition-all cursor-pointer"
        >
          9
        </button>
        <button
          onClick={() => handleAppend('×', 'op')}
          className="p-3 sm:p-3.5 rounded-xl bg-violet-900/40 border border-violet-500/40 text-violet-200 hover:border-violet-400 hover:bg-violet-800/50 font-mono text-lg font-bold hover:scale-[1.02] active:scale-[0.97] transition-all cursor-pointer"
        >
          ×
        </button>

        {/* Row 3 */}
        <button
          onClick={() => handleAppend('4', 'num')}
          className="p-3 sm:p-4 rounded-xl cosmic-glass border border-slate-800 hover:border-cyan-500/40 text-white font-mono text-lg font-semibold hover:bg-slate-850 hover:scale-[1.02] active:scale-[0.97] transition-all cursor-pointer"
        >
          4
        </button>
        <button
          onClick={() => handleAppend('5', 'num')}
          className="p-3 sm:p-4 rounded-xl cosmic-glass border border-slate-800 hover:border-cyan-500/40 text-white font-mono text-lg font-semibold hover:bg-slate-850 hover:scale-[1.02] active:scale-[0.97] transition-all cursor-pointer"
        >
          5
        </button>
        <button
          onClick={() => handleAppend('6', 'num')}
          className="p-3 sm:p-4 rounded-xl cosmic-glass border border-slate-800 hover:border-cyan-500/40 text-white font-mono text-lg font-semibold hover:bg-slate-850 hover:scale-[1.02] active:scale-[0.97] transition-all cursor-pointer"
        >
          6
        </button>
        <button
          onClick={() => handleAppend('-', 'op')}
          className="p-3 sm:p-3.5 rounded-xl bg-violet-900/40 border border-violet-500/40 text-violet-200 hover:border-violet-400 hover:bg-violet-800/50 font-mono text-lg font-bold hover:scale-[1.02] active:scale-[0.97] transition-all cursor-pointer"
        >
          -
        </button>

        {/* Row 4 */}
        <button
          onClick={() => handleAppend('1', 'num')}
          className="p-3 sm:p-4 rounded-xl cosmic-glass border border-slate-800 hover:border-cyan-500/40 text-white font-mono text-lg font-semibold hover:bg-slate-850 hover:scale-[1.02] active:scale-[0.97] transition-all cursor-pointer"
        >
          1
        </button>
        <button
          onClick={() => handleAppend('2', 'num')}
          className="p-3 sm:p-4 rounded-xl cosmic-glass border border-slate-800 hover:border-cyan-500/40 text-white font-mono text-lg font-semibold hover:bg-slate-850 hover:scale-[1.02] active:scale-[0.97] transition-all cursor-pointer"
        >
          2
        </button>
        <button
          onClick={() => handleAppend('3', 'num')}
          className="p-3 sm:p-4 rounded-xl cosmic-glass border border-slate-800 hover:border-cyan-500/40 text-white font-mono text-lg font-semibold hover:bg-slate-850 hover:scale-[1.02] active:scale-[0.97] transition-all cursor-pointer"
        >
          3
        </button>
        <button
          onClick={() => handleAppend('+', 'op')}
          className="p-3 sm:p-3.5 rounded-xl bg-violet-900/40 border border-violet-500/40 text-violet-200 hover:border-violet-400 hover:bg-violet-800/50 font-mono text-lg font-bold hover:scale-[1.02] active:scale-[0.97] transition-all cursor-pointer"
        >
          +
        </button>

        {/* Row 5 */}
        <button
          onClick={handleToggleSign}
          className="p-3 sm:p-4 rounded-xl cosmic-glass border border-slate-800 hover:border-cyan-500/40 text-slate-300 font-mono text-base font-medium hover:scale-[1.02] active:scale-[0.97] transition-all cursor-pointer"
        >
          ±
        </button>
        <button
          onClick={() => handleAppend('0', 'num')}
          className="p-3 sm:p-4 rounded-xl cosmic-glass border border-slate-800 hover:border-cyan-500/40 text-white font-mono text-lg font-semibold hover:scale-[1.02] active:scale-[0.97] transition-all cursor-pointer"
        >
          0
        </button>
        <button
          onClick={() => handleAppend('.', 'num')}
          className="p-3 sm:p-4 rounded-xl cosmic-glass border border-slate-800 hover:border-cyan-500/40 text-white font-mono text-lg font-semibold hover:scale-[1.02] active:scale-[0.97] transition-all cursor-pointer"
        >
          .
        </button>
        <button
          onClick={handleCalculate}
          className="p-3 sm:p-4 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 border border-cyan-400/50 text-white font-mono text-xl font-bold shadow-[0_0_20px_rgba(124,58,237,0.5)] hover:shadow-[0_0_28px_rgba(6,182,212,0.6)] hover:scale-[1.02] active:scale-[0.97] transition-all cursor-pointer"
        >
          =
        </button>
      </div>

      {/* Quick Parentheses & Percentage Row */}
      <div className="grid grid-cols-3 gap-2.5 mt-2.5">
        <button
          onClick={() => handleAppend('(', 'op')}
          className="py-2 px-3 rounded-lg cosmic-glass border border-slate-800 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 text-xs font-mono transition-colors"
        >
          (
        </button>
        <button
          onClick={() => handleAppend(')', 'op')}
          className="py-2 px-3 rounded-lg cosmic-glass border border-slate-800 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 text-xs font-mono transition-colors"
        >
          )
        </button>
        <button
          onClick={() => handleAppend('%', 'op')}
          className="py-2 px-3 rounded-lg cosmic-glass border border-slate-800 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 text-xs font-mono transition-colors"
        >
          %
        </button>
      </div>
    </div>
  );
};
