import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeftRight, RefreshCw, Copy, Check, TrendingUp } from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { Language, getTranslation } from '../../utils/i18n';

interface CurrencyConverterProps {
  onAddHistory: (expr: string, res: string, mode: string) => void;
  language?: Language;
}

interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

const POPULAR_CURRENCIES: CurrencyInfo[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', flag: '🇨🇦' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'AU$', flag: '🇦🇺' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'AED', flag: '🇦🇪' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', flag: '🇰🇷' },
  { code: 'MXN', name: 'Mexican Peso', symbol: 'MX$', flag: '🇲🇽' },
];

// Fallback rates relative to USD if API request is blocked or offline
const FALLBACK_RATES: Record<string, number> = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 153.4,
  CAD: 1.39,
  AUD: 1.52,
  CHF: 0.88,
  CNY: 7.23,
  INR: 84.38,
  BRL: 5.76,
  SGD: 1.33,
  AED: 3.67,
  KRW: 1385.5,
  MXN: 20.15,
};

export const CurrencyConverter: React.FC<CurrencyConverterProps> = ({
  onAddHistory,
  language = 'en',
}) => {
  const t = getTranslation(language);
  const [amount, setAmount] = useState<string>('100');
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const [rates, setRates] = useState<Record<string, number>>(FALLBACK_RATES);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>(language === 'uz' ? 'Jonli zaxira bazasi' : 'Live fallback cache');
  const [isUsingLiveApi, setIsUsingLiveApi] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Fetch exchange rates from free open API
  const fetchRates = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('https://open.er-api.com/v6/latest/USD');
      if (res.ok) {
        const data = await res.json();
        if (data && data.rates) {
          setRates({ ...FALLBACK_RATES, ...data.rates });
          setIsUsingLiveApi(true);
          const time = new Date(data.time_last_update_utc || Date.now());
          setLastUpdated(time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' UTC');
        }
      }
    } catch {
      // Graceful offline fallback
      setIsUsingLiveApi(false);
      setLastUpdated('Cached reference rates');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const handleSwap = () => {
    soundManager.play('mode');
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const convertedValue = useMemo(() => {
    const val = parseFloat(amount);
    if (isNaN(val)) return 0;
    const fromRate = rates[fromCurrency] || 1;
    const toRate = rates[toCurrency] || 1;
    // Calculate via USD anchor
    const inUSD = val / fromRate;
    return inUSD * toRate;
  }, [amount, fromCurrency, toCurrency, rates]);

  const singleRate = useMemo(() => {
    const fromRate = rates[fromCurrency] || 1;
    const toRate = rates[toCurrency] || 1;
    return toRate / fromRate;
  }, [fromCurrency, toCurrency, rates]);

  const formattedResult = useMemo(() => {
    return convertedValue.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    });
  }, [convertedValue]);

  const handleCopy = () => {
    soundManager.play('click');
    const text = `${amount} ${fromCurrency} = ${formattedResult} ${toCurrency}`;
    navigator.clipboard.writeText(formattedResult).then(() => {
      setCopied(true);
      onAddHistory(`${amount} ${fromCurrency} → ${toCurrency}`, formattedResult, 'Currency');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="w-full space-y-5">
      {/* Rate Telemetry Header */}
      <div className="flex items-center justify-between text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-300">
            1 {fromCurrency} = {singleRate.toFixed(4)} {toCurrency}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-500">{isUsingLiveApi ? t.currLiveApi : t.currOfflineBase}</span>
          <button
            onClick={() => {
              soundManager.play('click');
              fetchRates();
            }}
            disabled={isLoading}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
            title={t.currRefresh}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Conversion Glass Container */}
      <div className="rounded-2xl cosmic-glass border border-violet-500/30 p-5 shadow-2xl space-y-4">
        {/* Amount Input */}
        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase tracking-wider">
            {t.currTransferAmount}
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-black/60 border border-slate-700 focus:border-cyan-400 text-white font-mono text-2xl font-bold outline-none tabular-nums"
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Currency Selectors & Swap Button */}
        <div className="grid grid-cols-1 sm:grid-cols-11 gap-3 items-center">
          {/* From Currency */}
          <div className="sm:col-span-5">
            <label className="block text-xs text-slate-400 mb-1">{t.currFrom}</label>
            <select
              value={fromCurrency}
              onChange={(e) => {
                soundManager.play('mode');
                setFromCurrency(e.target.value);
              }}
              className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-slate-700 text-white font-mono text-sm focus:border-cyan-400 outline-none cursor-pointer"
            >
              {POPULAR_CURRENCIES.map((c) => (
                <option key={c.code} value={c.code} className="bg-slate-900 text-white">
                  {c.flag} {c.code} — {c.name} ({c.symbol})
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="sm:col-span-1 flex justify-center pt-5 sm:pt-0">
            <button
              onClick={handleSwap}
              className="p-3 rounded-full cosmic-glass border border-violet-500/40 text-cyan-300 hover:text-white hover:border-cyan-400 hover:scale-110 active:scale-95 transition-all shadow-md cursor-pointer"
              title="Swap currencies"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>
          </div>

          {/* To Currency */}
          <div className="sm:col-span-5">
            <label className="block text-xs text-slate-400 mb-1">{t.currTo}</label>
            <select
              value={toCurrency}
              onChange={(e) => {
                soundManager.play('mode');
                setToCurrency(e.target.value);
              }}
              className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-slate-700 text-white font-mono text-sm focus:border-cyan-400 outline-none cursor-pointer"
            >
              {POPULAR_CURRENCIES.map((c) => (
                <option key={c.code} value={c.code} className="bg-slate-900 text-white">
                  {c.flag} {c.code} — {c.name} ({c.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Big Conversion Result Banner */}
        <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-mono mb-1">{t.currConverted}</div>
            <div
              className="text-2xl sm:text-4xl font-bold font-mono text-cyan-300 tabular-nums drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]"
              style={{ fontFamily: 'Orbitron, JetBrains Mono, monospace' }}
            >
              {formattedResult} <span className="text-lg sm:text-2xl text-slate-300">{toCurrency}</span>
            </div>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-violet-950/60 border border-violet-500/40 hover:border-cyan-400/60 text-slate-200 hover:text-cyan-300 transition-all cursor-pointer text-xs font-mono"
            title={t.copy}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 font-bold">{t.copied}</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>{t.copy}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Timestamp note */}
      <div className="text-[11px] text-slate-500 text-right font-mono">
        {t.currLastUpdate}: {lastUpdated}
      </div>
    </div>
  );
};
