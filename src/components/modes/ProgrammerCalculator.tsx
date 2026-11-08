import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Copy, Check } from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { Language, getTranslation } from '../../utils/i18n';

type Base = 'HEX' | 'DEC' | 'OCT' | 'BIN';
type WordSize = 'QWORD' | 'DWORD' | 'WORD' | 'BYTE';

interface ProgrammerCalculatorProps {
  onAddHistory: (expr: string, res: string, mode: string) => void;
  initialValue?: string;
  language?: Language;
}

export const ProgrammerCalculator: React.FC<ProgrammerCalculatorProps> = ({
  onAddHistory,
  initialValue,
  language = 'en',
}) => {
  const t = getTranslation(language);
  const [activeBase, setActiveBase] = useState<Base>('DEC');
  const [wordSize, setWordSize] = useState<WordSize>('DWORD');
  const [currentVal, setCurrentVal] = useState<bigint>(BigInt(0));
  const [storedVal, setStoredVal] = useState<bigint | null>(null);
  const [pendingOp, setPendingOp] = useState<string | null>(null);
  const [copiedBase, setCopiedBase] = useState<string | null>(null);

  // Bit mask depending on word size
  const mask = useMemo(() => {
    switch (wordSize) {
      case 'BYTE': return BigInt('0xFF');
      case 'WORD': return BigInt('0xFFFF');
      case 'DWORD': return BigInt('0xFFFFFFFF');
      case 'QWORD':
      default:
        return (BigInt(1) << BigInt(64)) - BigInt(1);
    }
  }, [wordSize]);

  // Masked value
  const maskedVal = useMemo(() => {
    return currentVal & mask;
  }, [currentVal, mask]);

  // Sync initial value if provided
  useEffect(() => {
    if (initialValue) {
      try {
        const parsed = BigInt(Math.floor(parseFloat(initialValue) || 0));
        setCurrentVal(parsed);
      } catch {
        // ignore
      }
    }
  }, [initialValue]);

  // Representations
  const hexStr = useMemo(() => maskedVal.toString(16).toUpperCase(), [maskedVal]);
  const decStr = useMemo(() => maskedVal.toString(10), [maskedVal]);
  const octStr = useMemo(() => maskedVal.toString(8), [maskedVal]);
  const binStr = useMemo(() => {
    const raw = maskedVal.toString(2);
    const bitCount = wordSize === 'BYTE' ? 8 : wordSize === 'WORD' ? 16 : 32;
    const padded = raw.padStart(bitCount, '0');
    // Group by 4 bits
    return padded.match(/.{1,4}/g)?.join(' ') || padded;
  }, [maskedVal, wordSize]);

  const handleCopy = (text: string, base: string) => {
    soundManager.play('click');
    navigator.clipboard.writeText(text).then(() => {
      setCopiedBase(base);
      setTimeout(() => setCopiedBase(null), 1800);
    });
  };

  const handleDigit = useCallback(
    (char: string) => {
      soundManager.play('num');
      let radix = 10;
      if (activeBase === 'HEX') radix = 16;
      else if (activeBase === 'OCT') radix = 8;
      else if (activeBase === 'BIN') radix = 2;

      let currentStr = maskedVal.toString(radix);
      if (currentStr === '0') {
        currentStr = char;
      } else {
        currentStr += char;
      }

      try {
        const nextVal = BigInt(`${activeBase === 'HEX' ? '0x' : activeBase === 'OCT' ? '0o' : activeBase === 'BIN' ? '0b' : ''}${currentStr}`);
        setCurrentVal(nextVal & mask);
      } catch {
        // Overflow or invalid input
      }
    },
    [activeBase, maskedVal, mask]
  );

  const handleClear = () => {
    soundManager.play('clear');
    setCurrentVal(BigInt(0));
    setStoredVal(null);
    setPendingOp(null);
  };

  const handleBackspace = () => {
    soundManager.play('op');
    let radix = 10;
    if (activeBase === 'HEX') radix = 16;
    else if (activeBase === 'OCT') radix = 8;
    else if (activeBase === 'BIN') radix = 2;

    const currentStr = maskedVal.toString(radix);
    if (currentStr.length <= 1) {
      setCurrentVal(BigInt(0));
    } else {
      const sliced = currentStr.slice(0, -1);
      const nextVal = BigInt(`${activeBase === 'HEX' ? '0x' : activeBase === 'OCT' ? '0o' : activeBase === 'BIN' ? '0b' : ''}${sliced}`);
      setCurrentVal(nextVal & mask);
    }
  };

  const handleOp = (op: string) => {
    soundManager.play('op');
    if (op === 'NOT') {
      const inverted = (~maskedVal) & mask;
      onAddHistory(`NOT ${maskedVal}`, inverted.toString(), 'Programmer');
      setCurrentVal(inverted);
      return;
    }

    setStoredVal(maskedVal);
    setPendingOp(op);
    setCurrentVal(BigInt(0));
  };

  const handleEqual = () => {
    if (storedVal === null || pendingOp === null) return;
    soundManager.play('eval');

    let result = BigInt(0);
    const a = storedVal;
    const b = maskedVal;

    switch (pendingOp) {
      case 'AND': result = a & b; break;
      case 'OR': result = a | b; break;
      case 'XOR': result = a ^ b; break;
      case '<<': result = a << (b & BigInt(63)); break;
      case '>>': result = a >> (b & BigInt(63)); break;
      case '+': result = a + b; break;
      case '-': result = a - b; break;
      case '×': result = a * b; break;
      case '÷':
        if (b === BigInt(0)) {
          soundManager.play('error');
          return;
        }
        result = a / b;
        break;
      case 'MOD':
        if (b === BigInt(0)) {
          soundManager.play('error');
          return;
        }
        result = a % b;
        break;
      default:
        result = b;
    }

    const finalVal = result & mask;
    onAddHistory(`${a} ${pendingOp} ${b}`, finalVal.toString(), 'Programmer');
    setCurrentVal(finalVal);
    setStoredVal(null);
    setPendingOp(null);
  };

  // Toggle individual bit on bitboard
  const handleToggleBit = (bitIndex: number) => {
    soundManager.play('num');
    const bitMask = BigInt(1) << BigInt(bitIndex);
    const updated = maskedVal ^ bitMask;
    setCurrentVal(updated & mask);
  };

  const isCharAllowed = (char: string) => {
    if (activeBase === 'BIN') return ['0', '1'].includes(char);
    if (activeBase === 'OCT') return /[0-7]/.test(char);
    if (activeBase === 'DEC') return /[0-9]/.test(char);
    if (activeBase === 'HEX') return /[0-9A-F]/.test(char);
    return false;
  };

  const bitLength = wordSize === 'BYTE' ? 8 : wordSize === 'WORD' ? 16 : 32;

  return (
    <div className="w-full">
      {/* Programmer Radix Screen */}
      <div className="rounded-2xl bg-black/60 border border-violet-500/30 p-4 sm:p-5 shadow-[inset_0_2px_12px_rgba(0,0,0,0.8)] backdrop-blur-md mb-5">
        {/* Word Size Selector */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs font-mono">
          <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-900/90 border border-slate-800">
            {(['BYTE', 'WORD', 'DWORD', 'QWORD'] as WordSize[]).map((size) => (
              <button
                key={size}
                onClick={() => {
                  soundManager.play('mode');
                  setWordSize(size);
                }}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                  wordSize === size
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {size}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {pendingOp && storedVal !== null && (
              <span className="text-cyan-400 font-semibold">
                {storedVal.toString()} {pendingOp}
              </span>
            )}
            <button
              onClick={handleClear}
              className="px-2 py-0.5 rounded bg-rose-950/40 border border-rose-500/30 text-rose-300 hover:bg-rose-900/50 text-[11px] font-bold"
            >
              AC
            </button>
          </div>
        </div>

        {/* 4-Radix Rows */}
        <div className="space-y-2">
          {/* HEX */}
          <div
            onClick={() => {
              soundManager.play('click');
              setActiveBase('HEX');
            }}
            className={`flex items-center justify-between px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
              activeBase === 'HEX'
                ? 'bg-violet-950/50 border-cyan-400/80 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={`text-xs font-mono font-bold ${activeBase === 'HEX' ? 'text-cyan-300' : 'text-slate-500'}`}>
                HEX
              </span>
              <span className="font-mono text-sm sm:text-base text-slate-100 font-semibold tracking-wider">
                0x{hexStr}
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCopy(hexStr, 'HEX');
              }}
              className="text-slate-400 hover:text-cyan-300 p-1 text-xs"
              title="Copy HEX"
            >
              {copiedBase === 'HEX' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* DEC */}
          <div
            onClick={() => {
              soundManager.play('click');
              setActiveBase('DEC');
            }}
            className={`flex items-center justify-between px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
              activeBase === 'DEC'
                ? 'bg-violet-950/50 border-cyan-400/80 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={`text-xs font-mono font-bold ${activeBase === 'DEC' ? 'text-cyan-300' : 'text-slate-500'}`}>
                DEC
              </span>
              <span className="font-mono text-sm sm:text-base text-slate-100 font-semibold tracking-wider">
                {decStr}
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCopy(decStr, 'DEC');
              }}
              className="text-slate-400 hover:text-cyan-300 p-1 text-xs"
              title="Copy DEC"
            >
              {copiedBase === 'DEC' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* OCT */}
          <div
            onClick={() => {
              soundManager.play('click');
              setActiveBase('OCT');
            }}
            className={`flex items-center justify-between px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
              activeBase === 'OCT'
                ? 'bg-violet-950/50 border-cyan-400/80 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={`text-xs font-mono font-bold ${activeBase === 'OCT' ? 'text-cyan-300' : 'text-slate-500'}`}>
                OCT
              </span>
              <span className="font-mono text-sm sm:text-base text-slate-100 font-semibold tracking-wider">
                0o{octStr}
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCopy(octStr, 'OCT');
              }}
              className="text-slate-400 hover:text-cyan-300 p-1 text-xs"
              title="Copy OCT"
            >
              {copiedBase === 'OCT' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* BIN */}
          <div
            onClick={() => {
              soundManager.play('click');
              setActiveBase('BIN');
            }}
            className={`flex items-center justify-between px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
              activeBase === 'BIN'
                ? 'bg-violet-950/50 border-cyan-400/80 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <span className={`text-xs font-mono font-bold ${activeBase === 'BIN' ? 'text-cyan-300' : 'text-slate-500'}`}>
                BIN
              </span>
              <span className="font-mono text-xs sm:text-sm text-cyan-300 font-semibold tracking-widest truncate">
                {binStr}
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCopy(binStr.replace(/\s/g, ''), 'BIN');
              }}
              className="text-slate-400 hover:text-cyan-300 p-1 text-xs shrink-0"
              title="Copy BIN"
            >
              {copiedBase === 'BIN' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Interactive 32-bit Bitboard Visualizer */}
        <div className="mt-4 pt-3 border-t border-slate-800">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mb-1.5">
            <span>{t.bitMatrix}</span>
            <span className="text-slate-500">{t.msbLsb}</span>
          </div>
          <div className="grid grid-cols-8 gap-1 text-center font-mono">
            {Array.from({ length: bitLength }).map((_, i) => {
              const bitIndex = bitLength - 1 - i;
              const isHigh = Boolean((maskedVal >> BigInt(bitIndex)) & BigInt(1));
              return (
                <button
                  key={bitIndex}
                  onClick={() => handleToggleBit(bitIndex)}
                  title={`Bit ${bitIndex}: Click to toggle`}
                  className={`py-1 rounded text-xs transition-all cursor-pointer border ${
                    isHigh
                      ? 'bg-cyan-500/30 border-cyan-400 text-cyan-200 font-bold shadow-[0_0_6px_rgba(6,182,212,0.4)]'
                      : 'bg-slate-900 border-slate-800 text-slate-600 hover:border-slate-700 hover:text-slate-400'
                  }`}
                >
                  {isHigh ? '1' : '0'}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Programmer Keypad */}
      <div className="grid grid-cols-6 gap-2 text-xs sm:text-sm font-mono">
        {/* Bitwise and Shifts */}
        <button
          onClick={() => handleOp('AND')}
          className="p-2.5 rounded-xl cosmic-glass border border-violet-500/30 text-cyan-300 hover:border-cyan-400 transition-colors"
        >
          AND
        </button>
        <button
          onClick={() => handleOp('OR')}
          className="p-2.5 rounded-xl cosmic-glass border border-violet-500/30 text-cyan-300 hover:border-cyan-400 transition-colors"
        >
          OR
        </button>
        <button
          onClick={() => handleOp('XOR')}
          className="p-2.5 rounded-xl cosmic-glass border border-violet-500/30 text-cyan-300 hover:border-cyan-400 transition-colors"
        >
          XOR
        </button>
        <button
          onClick={() => handleOp('NOT')}
          className="p-2.5 rounded-xl cosmic-glass border border-violet-500/30 text-cyan-300 hover:border-cyan-400 transition-colors"
        >
          NOT
        </button>
        <button
          onClick={() => handleOp('<<')}
          className="p-2.5 rounded-xl cosmic-glass border border-violet-500/30 text-cyan-300 hover:border-cyan-400 transition-colors"
        >
          &lt;&lt;
        </button>
        <button
          onClick={() => handleOp('>>')}
          className="p-2.5 rounded-xl cosmic-glass border border-violet-500/30 text-cyan-300 hover:border-cyan-400 transition-colors"
        >
          &gt;&gt;
        </button>

        {/* Hex letters A, B & 7, 8, 9, ÷ */}
        <button
          disabled={!isCharAllowed('A')}
          onClick={() => handleDigit('A')}
          className="p-2.5 rounded-xl cosmic-glass border border-slate-800 text-violet-300 disabled:opacity-20 font-bold hover:border-violet-400 transition-all cursor-pointer"
        >
          A
        </button>
        <button
          disabled={!isCharAllowed('B')}
          onClick={() => handleDigit('B')}
          className="p-2.5 rounded-xl cosmic-glass border border-slate-800 text-violet-300 disabled:opacity-20 font-bold hover:border-violet-400 transition-all cursor-pointer"
        >
          B
        </button>
        <button
          disabled={!isCharAllowed('7')}
          onClick={() => handleDigit('7')}
          className="p-2.5 rounded-xl cosmic-glass border border-slate-800 text-white disabled:opacity-20 font-bold hover:border-cyan-400 transition-all cursor-pointer"
        >
          7
        </button>
        <button
          disabled={!isCharAllowed('8')}
          onClick={() => handleDigit('8')}
          className="p-2.5 rounded-xl cosmic-glass border border-slate-800 text-white disabled:opacity-20 font-bold hover:border-cyan-400 transition-all cursor-pointer"
        >
          8
        </button>
        <button
          disabled={!isCharAllowed('9')}
          onClick={() => handleDigit('9')}
          className="p-2.5 rounded-xl cosmic-glass border border-slate-800 text-white disabled:opacity-20 font-bold hover:border-cyan-400 transition-all cursor-pointer"
        >
          9
        </button>
        <button
          onClick={() => handleOp('÷')}
          className="p-2.5 rounded-xl bg-violet-900/40 border border-violet-500/40 text-violet-200 font-bold hover:border-violet-400 transition-all cursor-pointer"
        >
          ÷
        </button>

        {/* Hex letters C, D & 4, 5, 6, × */}
        <button
          disabled={!isCharAllowed('C')}
          onClick={() => handleDigit('C')}
          className="p-2.5 rounded-xl cosmic-glass border border-slate-800 text-violet-300 disabled:opacity-20 font-bold hover:border-violet-400 transition-all cursor-pointer"
        >
          C
        </button>
        <button
          disabled={!isCharAllowed('D')}
          onClick={() => handleDigit('D')}
          className="p-2.5 rounded-xl cosmic-glass border border-slate-800 text-violet-300 disabled:opacity-20 font-bold hover:border-violet-400 transition-all cursor-pointer"
        >
          D
        </button>
        <button
          disabled={!isCharAllowed('4')}
          onClick={() => handleDigit('4')}
          className="p-2.5 rounded-xl cosmic-glass border border-slate-800 text-white disabled:opacity-20 font-bold hover:border-cyan-400 transition-all cursor-pointer"
        >
          4
        </button>
        <button
          disabled={!isCharAllowed('5')}
          onClick={() => handleDigit('5')}
          className="p-2.5 rounded-xl cosmic-glass border border-slate-800 text-white disabled:opacity-20 font-bold hover:border-cyan-400 transition-all cursor-pointer"
        >
          5
        </button>
        <button
          disabled={!isCharAllowed('6')}
          onClick={() => handleDigit('6')}
          className="p-2.5 rounded-xl cosmic-glass border border-slate-800 text-white disabled:opacity-20 font-bold hover:border-cyan-400 transition-all cursor-pointer"
        >
          6
        </button>
        <button
          onClick={() => handleOp('×')}
          className="p-2.5 rounded-xl bg-violet-900/40 border border-violet-500/40 text-violet-200 font-bold hover:border-violet-400 transition-all cursor-pointer"
        >
          ×
        </button>

        {/* Hex letters E, F & 1, 2, 3, - */}
        <button
          disabled={!isCharAllowed('E')}
          onClick={() => handleDigit('E')}
          className="p-2.5 rounded-xl cosmic-glass border border-slate-800 text-violet-300 disabled:opacity-20 font-bold hover:border-violet-400 transition-all cursor-pointer"
        >
          E
        </button>
        <button
          disabled={!isCharAllowed('F')}
          onClick={() => handleDigit('F')}
          className="p-2.5 rounded-xl cosmic-glass border border-slate-800 text-violet-300 disabled:opacity-20 font-bold hover:border-violet-400 transition-all cursor-pointer"
        >
          F
        </button>
        <button
          disabled={!isCharAllowed('1')}
          onClick={() => handleDigit('1')}
          className="p-2.5 rounded-xl cosmic-glass border border-slate-800 text-white disabled:opacity-20 font-bold hover:border-cyan-400 transition-all cursor-pointer"
        >
          1
        </button>
        <button
          disabled={!isCharAllowed('2')}
          onClick={() => handleDigit('2')}
          className="p-2.5 rounded-xl cosmic-glass border border-slate-800 text-white disabled:opacity-20 font-bold hover:border-cyan-400 transition-all cursor-pointer"
        >
          2
        </button>
        <button
          disabled={!isCharAllowed('3')}
          onClick={() => handleDigit('3')}
          className="p-2.5 rounded-xl cosmic-glass border border-slate-800 text-white disabled:opacity-20 font-bold hover:border-cyan-400 transition-all cursor-pointer"
        >
          3
        </button>
        <button
          onClick={() => handleOp('-')}
          className="p-2.5 rounded-xl bg-violet-900/40 border border-violet-500/40 text-violet-200 font-bold hover:border-violet-400 transition-all cursor-pointer"
        >
          -
        </button>

        {/* Mod, 0, Backspace, +, = */}
        <button
          onClick={() => handleOp('MOD')}
          className="p-2.5 rounded-xl cosmic-glass border border-violet-500/30 text-cyan-300 hover:border-cyan-400 transition-colors"
        >
          MOD
        </button>
        <button
          onClick={handleBackspace}
          className="p-2.5 rounded-xl cosmic-glass border border-slate-800 text-rose-300 hover:border-rose-400 transition-colors"
        >
          DEL
        </button>
        <button
          disabled={!isCharAllowed('0')}
          onClick={() => handleDigit('0')}
          className="p-2.5 rounded-xl cosmic-glass border border-slate-800 text-white disabled:opacity-20 font-bold hover:border-cyan-400 transition-all cursor-pointer col-span-2 text-center"
        >
          0
        </button>
        <button
          onClick={() => handleOp('+')}
          className="p-2.5 rounded-xl bg-violet-900/40 border border-violet-500/40 text-violet-200 font-bold hover:border-violet-400 transition-all cursor-pointer"
        >
          +
        </button>
        <button
          onClick={handleEqual}
          className="p-2.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 border border-cyan-400/50 text-white font-bold shadow-[0_0_15px_rgba(124,58,237,0.5)] hover:scale-[1.02] transition-all cursor-pointer"
        >
          =
        </button>
      </div>
    </div>
  );
};
