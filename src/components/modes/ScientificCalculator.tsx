import React, { useState, useEffect, useCallback } from 'react';
import { CalculatorDisplay } from '../calculator/CalculatorDisplay';
import { MathEngine, AngleMode } from '../../utils/mathEngine';
import { soundManager } from '../../utils/audio';

interface ScientificCalculatorProps {
  onAddHistory: (expr: string, res: string, mode: string) => void;
  initialValue?: string;
}

export const ScientificCalculator: React.FC<ScientificCalculatorProps> = ({
  onAddHistory,
  initialValue,
}) => {
  const [expression, setExpression] = useState<string>(initialValue || '');
  const [resultPreview, setResultPreview] = useState<string>('');
  const [angleMode, setAngleMode] = useState<AngleMode>('DEG');
  const [is2nd, setIs2nd] = useState<boolean>(false);
  const [lastCalculated, setLastCalculated] = useState<boolean>(false);

  useEffect(() => {
    if (initialValue) {
      setExpression(initialValue);
      setLastCalculated(false);
    }
  }, [initialValue]);

  // Compute live preview
  useEffect(() => {
    if (!expression || expression.trim() === '') {
      setResultPreview('');
      return;
    }

    const lastChar = expression.slice(-1);
    if (!['+', '-', '×', '÷', '*', '/', '^', '('].includes(lastChar)) {
      const evalRes = MathEngine.evaluate(expression, angleMode);
      if (evalRes.success && evalRes.formatted) {
        setResultPreview(evalRes.formatted);
      } else {
        setResultPreview('');
      }
    }
  }, [expression, angleMode]);

  const handleAppend = useCallback(
    (char: string, type: 'num' | 'op') => {
      soundManager.play(type);

      if (lastCalculated && type === 'num') {
        setExpression(char);
        setLastCalculated(false);
        return;
      }

      setLastCalculated(false);
      setExpression((prev) => {
        if (char === '.') {
          const parts = prev.split(/[\+\-\×\÷\*\/\^\(\)]/);
          const currentPart = parts[parts.length - 1];
          if (currentPart.includes('.')) return prev;
        }

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

  const handleInsertFunction = useCallback((fnName: string) => {
    soundManager.play('op');
    setLastCalculated(false);
    setExpression((prev) => `${prev}${fnName}(`);
  }, []);

  const handleInsertConstant = useCallback((constStr: string) => {
    soundManager.play('num');
    setLastCalculated(false);
    setExpression((prev) => `${prev}${constStr}`);
  }, []);

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
    const res = MathEngine.evaluate(expression, angleMode);
    if (res.success && res.formatted) {
      soundManager.play('eval');
      onAddHistory(expression, res.formatted, 'Scientific');
      setExpression(res.formatted);
      setResultPreview('');
      setLastCalculated(true);
    } else {
      soundManager.play('error');
      setResultPreview(res.error || 'Error');
    }
  }, [expression, angleMode, onAddHistory]);

  const toggleAngleMode = () => {
    setAngleMode((prev) => (prev === 'DEG' ? 'RAD' : 'DEG'));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
      } else if (key === '^') {
        e.preventDefault();
        handleAppend('^', 'op');
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
        angleMode={angleMode}
        onToggleAngleMode={toggleAngleMode}
        onClear={handleClear}
        onDelete={handleDelete}
      />

      {/* Main Scientific Grid: 5 columns */}
      <div className="grid grid-cols-5 gap-2 sm:gap-2.5 text-xs sm:text-sm">
        {/* Row 1: Function toggles & Memory/Special */}
        <button
          onClick={() => {
            soundManager.play('click');
            setIs2nd(!is2nd);
          }}
          className={`p-2.5 sm:p-3 rounded-xl border font-mono font-semibold transition-all cursor-pointer ${
            is2nd
              ? 'bg-cyan-500/30 border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
              : 'cosmic-glass border-violet-500/30 text-slate-400 hover:text-white'
          }`}
        >
          2nd
        </button>
        <button
          onClick={() => handleInsertFunction(is2nd ? 'asin' : 'sin')}
          className="p-2.5 sm:p-3 rounded-xl cosmic-glass border border-violet-500/30 text-cyan-300 hover:border-cyan-400 font-mono transition-all cursor-pointer"
        >
          {is2nd ? 'sin⁻¹' : 'sin'}
        </button>
        <button
          onClick={() => handleInsertFunction(is2nd ? 'acos' : 'cos')}
          className="p-2.5 sm:p-3 rounded-xl cosmic-glass border border-violet-500/30 text-cyan-300 hover:border-cyan-400 font-mono transition-all cursor-pointer"
        >
          {is2nd ? 'cos⁻¹' : 'cos'}
        </button>
        <button
          onClick={() => handleInsertFunction(is2nd ? 'atan' : 'tan')}
          className="p-2.5 sm:p-3 rounded-xl cosmic-glass border border-violet-500/30 text-cyan-300 hover:border-cyan-400 font-mono transition-all cursor-pointer"
        >
          {is2nd ? 'tan⁻¹' : 'tan'}
        </button>
        <button
          onClick={() => handleAppend('÷', 'op')}
          className="p-2.5 sm:p-3 rounded-xl bg-violet-900/40 border border-violet-500/40 text-violet-200 hover:border-violet-400 font-mono text-base font-bold transition-all cursor-pointer"
        >
          ÷
        </button>

        {/* Row 2: Powers, Roots & Operators */}
        <button
          onClick={() => handleAppend('^', 'op')}
          className="p-2.5 sm:p-3 rounded-xl cosmic-glass border border-violet-500/30 text-cyan-300 hover:border-cyan-400 font-mono transition-all cursor-pointer"
        >
          xʸ
        </button>
        <button
          onClick={() => handleInsertFunction(is2nd ? 'cbrt' : 'sqrt')}
          className="p-2.5 sm:p-3 rounded-xl cosmic-glass border border-violet-500/30 text-cyan-300 hover:border-cyan-400 font-mono transition-all cursor-pointer"
        >
          {is2nd ? '∛x' : '√x'}
        </button>
        <button
          onClick={() => handleInsertFunction(is2nd ? '10^' : 'log')}
          className="p-2.5 sm:p-3 rounded-xl cosmic-glass border border-violet-500/30 text-cyan-300 hover:border-cyan-400 font-mono transition-all cursor-pointer"
        >
          {is2nd ? '10ˣ' : 'log'}
        </button>
        <button
          onClick={() => handleInsertFunction(is2nd ? 'e^' : 'ln')}
          className="p-2.5 sm:p-3 rounded-xl cosmic-glass border border-violet-500/30 text-cyan-300 hover:border-cyan-400 font-mono transition-all cursor-pointer"
        >
          {is2nd ? 'eˣ' : 'ln'}
        </button>
        <button
          onClick={() => handleAppend('×', 'op')}
          className="p-2.5 sm:p-3 rounded-xl bg-violet-900/40 border border-violet-500/40 text-violet-200 hover:border-violet-400 font-mono text-base font-bold transition-all cursor-pointer"
        >
          ×
        </button>

        {/* Row 3: Constants & 7 8 9 - */}
        <button
          onClick={() => handleInsertConstant('pi')}
          className="p-2.5 sm:p-3 rounded-xl cosmic-glass border border-violet-500/30 text-violet-300 hover:border-cyan-400 font-mono transition-all cursor-pointer"
        >
          π
        </button>
        <button
          onClick={() => handleAppend('7', 'num')}
          className="p-2.5 sm:p-3 rounded-xl cosmic-glass border border-slate-800 text-white font-mono text-base font-semibold hover:border-cyan-500/40 transition-all cursor-pointer"
        >
          7
        </button>
        <button
          onClick={() => handleAppend('8', 'num')}
          className="p-2.5 sm:p-3 rounded-xl cosmic-glass border border-slate-800 text-white font-mono text-base font-semibold hover:border-cyan-500/40 transition-all cursor-pointer"
        >
          8
        </button>
        <button
          onClick={() => handleAppend('9', 'num')}
          className="p-2.5 sm:p-3 rounded-xl cosmic-glass border border-slate-800 text-white font-mono text-base font-semibold hover:border-cyan-500/40 transition-all cursor-pointer"
        >
          9
        </button>
        <button
          onClick={() => handleAppend('-', 'op')}
          className="p-2.5 sm:p-3 rounded-xl bg-violet-900/40 border border-violet-500/40 text-violet-200 hover:border-violet-400 font-mono text-base font-bold transition-all cursor-pointer"
        >
          -
        </button>

        {/* Row 4: Euler e & 4 5 6 + */}
        <button
          onClick={() => handleInsertConstant('e')}
          className="p-2.5 sm:p-3 rounded-xl cosmic-glass border border-violet-500/30 text-violet-300 hover:border-cyan-400 font-mono transition-all cursor-pointer"
        >
          e
        </button>
        <button
          onClick={() => handleAppend('4', 'num')}
          className="p-2.5 sm:p-3 rounded-xl cosmic-glass border border-slate-800 text-white font-mono text-base font-semibold hover:border-cyan-500/40 transition-all cursor-pointer"
        >
          4
        </button>
        <button
          onClick={() => handleAppend('5', 'num')}
          className="p-2.5 sm:p-3 rounded-xl cosmic-glass border border-slate-800 text-white font-mono text-base font-semibold hover:border-cyan-500/40 transition-all cursor-pointer"
        >
          5
        </button>
        <button
          onClick={() => handleAppend('6', 'num')}
          className="p-2.5 sm:p-3 rounded-xl cosmic-glass border border-slate-800 text-white font-mono text-base font-semibold hover:border-cyan-500/40 transition-all cursor-pointer"
        >
          6
        </button>
        <button
          onClick={() => handleAppend('+', 'op')}
          className="p-2.5 sm:p-3 rounded-xl bg-violet-900/40 border border-violet-500/40 text-violet-200 hover:border-violet-400 font-mono text-base font-bold transition-all cursor-pointer"
        >
          +
        </button>

        {/* Row 5: Factorial & 1 2 3 = */}
        <button
          onClick={() => handleAppend('!', 'op')}
          className="p-2.5 sm:p-3 rounded-xl cosmic-glass border border-violet-500/30 text-cyan-300 hover:border-cyan-400 font-mono transition-all cursor-pointer"
        >
          n!
        </button>
        <button
          onClick={() => handleAppend('1', 'num')}
          className="p-2.5 sm:p-3 rounded-xl cosmic-glass border border-slate-800 text-white font-mono text-base font-semibold hover:border-cyan-500/40 transition-all cursor-pointer"
        >
          1
        </button>
        <button
          onClick={() => handleAppend('2', 'num')}
          className="p-2.5 sm:p-3 rounded-xl cosmic-glass border border-slate-800 text-white font-mono text-base font-semibold hover:border-cyan-500/40 transition-all cursor-pointer"
        >
          2
        </button>
        <button
          onClick={() => handleAppend('3', 'num')}
          className="p-2.5 sm:p-3 rounded-xl cosmic-glass border border-slate-800 text-white font-mono text-base font-semibold hover:border-cyan-500/40 transition-all cursor-pointer"
        >
          3
        </button>
        <button
          onClick={handleCalculate}
          className="p-2.5 sm:p-3 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 border border-cyan-400/50 text-white font-mono text-lg font-bold shadow-[0_0_20px_rgba(124,58,237,0.5)] hover:shadow-[0_0_28px_rgba(6,182,212,0.6)] transition-all cursor-pointer row-span-2 flex items-center justify-center"
        >
          =
        </button>

        {/* Row 6: Reciprocal, 0, ., ± */}
        <button
          onClick={() => handleInsertFunction('1/')}
          className="p-2.5 sm:p-3 rounded-xl cosmic-glass border border-violet-500/30 text-cyan-300 hover:border-cyan-400 font-mono transition-all cursor-pointer"
        >
          1/x
        </button>
        <button
          onClick={handleToggleSign}
          className="p-2.5 sm:p-3 rounded-xl cosmic-glass border border-slate-800 text-slate-300 font-mono font-medium hover:border-cyan-500/40 transition-all cursor-pointer"
        >
          ±
        </button>
        <button
          onClick={() => handleAppend('0', 'num')}
          className="p-2.5 sm:p-3 rounded-xl cosmic-glass border border-slate-800 text-white font-mono text-base font-semibold hover:border-cyan-500/40 transition-all cursor-pointer"
        >
          0
        </button>
        <button
          onClick={() => handleAppend('.', 'num')}
          className="p-2.5 sm:p-3 rounded-xl cosmic-glass border border-slate-800 text-white font-mono text-base font-semibold hover:border-cyan-500/40 transition-all cursor-pointer"
        >
          .
        </button>
      </div>

      {/* Auxiliary Parentheses & Absolute row */}
      <div className="grid grid-cols-4 gap-2 mt-2.5">
        <button
          onClick={() => handleAppend('(', 'op')}
          className="py-1.5 rounded-lg cosmic-glass border border-slate-800 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 text-xs font-mono transition-colors"
        >
          (
        </button>
        <button
          onClick={() => handleAppend(')', 'op')}
          className="py-1.5 rounded-lg cosmic-glass border border-slate-800 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 text-xs font-mono transition-colors"
        >
          )
        </button>
        <button
          onClick={() => handleInsertFunction('abs')}
          className="py-1.5 rounded-lg cosmic-glass border border-slate-800 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 text-xs font-mono transition-colors"
        >
          |x|
        </button>
        <button
          onClick={() => handleAppend('%', 'op')}
          className="py-1.5 rounded-lg cosmic-glass border border-slate-800 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 text-xs font-mono transition-colors"
        >
          %
        </button>
      </div>
    </div>
  );
};
