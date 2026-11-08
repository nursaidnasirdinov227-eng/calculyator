import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Keyboard, Sparkles, Clock, Globe } from 'lucide-react';
import { soundManager } from '../utils/audio';
import { Language, getTranslation } from '../utils/i18n';

interface CosmicNavbarProps {
  currentTheme: string;
  onThemeChange: (theme: string) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenShortcuts: () => void;
  onOpenHistory: () => void;
  historyCount: number;
}

export const CosmicNavbar: React.FC<CosmicNavbarProps> = ({
  currentTheme,
  onThemeChange,
  language,
  onLanguageChange,
  onOpenShortcuts,
  onOpenHistory,
  historyCount,
}) => {
  const [isMuted, setIsMuted] = useState(soundManager.getIsMuted());
  const [currentTime, setCurrentTime] = useState<string>('');
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const t = getTranslation(language);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getUTCHours()).padStart(2, '0');
      const mins = String(now.getUTCMinutes()).padStart(2, '0');
      const secs = String(now.getUTCSeconds()).padStart(2, '0');
      setCurrentTime(`${hours}:${mins}:${secs} UTC`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  const handleToggleLang = () => {
    soundManager.play('mode');
    onLanguageChange(language === 'en' ? 'uz' : 'en');
  };

  const themes = [
    { id: 'nebula', name: language === 'uz' ? 'Binafsha Tumanlik' : 'Nebula Violet', dot: 'bg-violet-500' },
    { id: 'obsidian', name: language === 'uz' ? 'Qora Obsidiyan' : 'Deep Obsidian', dot: 'bg-sky-400' },
    { id: 'solar', name: language === 'uz' ? 'Quyosh Chaqnashi' : 'Solar Flare', dot: 'bg-amber-500' },
    { id: 'aurora', name: language === 'uz' ? 'Qutb Yog‘dusi' : 'Aurora Borealis', dot: 'bg-emerald-400' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full cosmic-glass border-b border-violet-500/20 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6 sm:gap-8">
        {/* Zone 1: Brand Wordmark */}
        <a
          href="#hero"
          className="flex items-center gap-3 text-base sm:text-xl font-bold tracking-wider text-white whitespace-nowrap shrink-0 group transition-transform hover:scale-[1.02]"
          style={{ fontFamily: 'Orbitron, sans-serif' }}
        >
          {/* Glowing Planetary Orbital Logo */}
          <div className="relative w-8 h-8 flex items-center justify-center">
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-violet-600 via-indigo-500 to-cyan-400 shadow-[0_0_12px_rgba(124,58,237,0.8)]" />
            <div className="absolute inset-0 rounded-full border border-cyan-400/80 -rotate-45 scale-y-50 group-hover:rotate-12 transition-transform duration-500" />
            <div className="absolute w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_6px_#fff] top-1 right-1" />
          </div>
          <span className="bg-gradient-to-r from-white via-indigo-200 to-cyan-300 bg-clip-text text-transparent">
            {t.appName}
          </span>
        </a>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <a
            href="#hero"
            className="hover:text-cyan-300 transition-colors whitespace-nowrap shrink-0 hover:underline decoration-cyan-400/50 underline-offset-4"
          >
            {t.navHome}
          </a>
          <a
            href="#calculator"
            className="hover:text-cyan-300 transition-colors whitespace-nowrap shrink-0 hover:underline decoration-cyan-400/50 underline-offset-4"
          >
            {t.navCalculator}
          </a>
          <a
            href="#modes"
            className="hover:text-cyan-300 transition-colors whitespace-nowrap shrink-0 hover:underline decoration-cyan-400/50 underline-offset-4"
          >
            {t.navModes}
          </a>
          <button
            onClick={() => {
              soundManager.play('click');
              onOpenHistory();
            }}
            className="hover:text-cyan-300 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <span>{t.navHistory}</span>
            {historyCount > 0 && (
              <span className="text-[11px] font-mono px-1.5 py-0.2 rounded bg-violet-900/60 text-violet-300 border border-violet-500/40">
                {historyCount}
              </span>
            )}
          </button>
          <a
            href="#features"
            className="hover:text-cyan-300 transition-colors whitespace-nowrap shrink-0 hover:underline decoration-cyan-400/50 underline-offset-4"
          >
            {t.navFeatures}
          </a>
          <a
            href="#about"
            className="hover:text-cyan-300 transition-colors whitespace-nowrap shrink-0 hover:underline decoration-cyan-400/50 underline-offset-4"
          >
            {t.navAbout}
          </a>
        </nav>

        {/* Zone 3: Primary Actions & Telemetry */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* UTC Clock */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900/80 border border-slate-800 text-xs font-mono text-cyan-400/90 tabular-nums">
            <Clock className="w-3.5 h-3.5 text-cyan-400/70" />
            <span>{currentTime || '00:00:00 UTC'}</span>
          </div>

          {/* Language Switcher Button (UZ / EN) */}
          <button
            onClick={handleToggleLang}
            title={language === 'en' ? "O'zbek tiliga o'tish" : 'Switch to English'}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-cyan-500/40 bg-slate-900/80 hover:border-cyan-400 text-xs font-mono font-bold text-cyan-300 hover:text-white transition-all cursor-pointer shadow-[0_0_10px_rgba(6,182,212,0.2)]"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>{language === 'en' ? 'UZ 🇺🇿' : 'EN 🇺🇸'}</span>
          </button>

          {/* Sound Synthesizer Toggle */}
          <button
            onClick={handleToggleSound}
            title={t.toggleAudio}
            aria-label="Toggle sound feedback"
            className={`p-2 rounded-lg border transition-all cursor-pointer ${
              isMuted
                ? 'bg-slate-900/60 border-slate-800 text-slate-500 hover:text-slate-300'
                : 'bg-violet-950/60 border-violet-500/40 text-cyan-300 hover:border-violet-400 shadow-[0_0_10px_rgba(124,58,237,0.3)]'
            }`}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Theme Switcher */}
          <div className="relative">
            <button
              onClick={() => {
                soundManager.play('click');
                setThemeDropdownOpen(!themeDropdownOpen);
              }}
              title={t.themes}
              aria-label="Change cosmic theme"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-violet-500/30 bg-slate-900/80 hover:border-cyan-400/50 text-xs text-slate-200 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline capitalize font-medium">{currentTheme}</span>
            </button>

            {themeDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-48 rounded-xl cosmic-glass border border-violet-500/40 p-1.5 shadow-2xl z-50"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
                  {t.themes}
                </div>
                {themes.map((tItem) => (
                  <button
                    key={tItem.id}
                    onClick={() => {
                      soundManager.play('mode');
                      onThemeChange(tItem.id);
                      setThemeDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors text-left cursor-pointer ${
                      currentTheme === tItem.id
                        ? 'bg-violet-600/30 text-cyan-300 border border-violet-500/40'
                        : 'text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${tItem.dot}`} />
                    <span>{tItem.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Keyboard Shortcuts Trigger */}
          <button
            onClick={() => {
              soundManager.play('click');
              onOpenShortcuts();
            }}
            title={t.shortcuts}
            aria-label="View keyboard shortcuts"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
          >
            <Keyboard className="w-3.5 h-3.5 text-slate-400" />
            <span>{t.shortcuts}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
