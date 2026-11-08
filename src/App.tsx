import React, { useState, useEffect } from 'react';
import { CosmicStarfield } from './components/CosmicStarfield';
import { CosmicNavbar } from './components/CosmicNavbar';
import { HeroSection } from './components/HeroSection';
import { CalculatorStage } from './components/CalculatorStage';
import { FeaturesShowcase } from './components/FeaturesShowcase';
import { AboutSection } from './components/AboutSection';
import { CosmicFooter } from './components/CosmicFooter';
import { HistoryDrawer } from './components/HistoryDrawer';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { HistoryManager, HistoryItem } from './utils/history';
import { Language } from './utils/i18n';

export default function App() {
  const [theme, setTheme] = useState<string>('nebula');
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('cosmic_calc_lang');
      if (saved === 'uz' || saved === 'en') return saved;
    } catch {
      // ignore
    }
    return 'uz'; // Default to Uzbek as requested by user
  });

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);
  const [reusedValue, setReusedValue] = useState<string | undefined>(undefined);

  // Load history from storage on mount
  useEffect(() => {
    setHistory(HistoryManager.getHistory());
  }, []);

  // Sync theme attribute on root element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Persist language
  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    try {
      localStorage.setItem('cosmic_calc_lang', lang);
    } catch {
      // ignore
    }
  };

  const handleAddHistory = (expr: string, res: string, mode: string) => {
    const newItem = HistoryManager.addEntry(expr, res, mode);
    setHistory((prev) => [newItem, ...prev].slice(0, 100));
  };

  const handleDeleteHistoryItem = (id: string) => {
    const updated = HistoryManager.removeEntry(id);
    setHistory(updated);
  };

  const handleClearHistory = () => {
    HistoryManager.clearHistory();
    setHistory([]);
  };

  const handleSelectResult = (result: string) => {
    setReusedValue(result);
    const calcEl = document.getElementById('calculator');
    if (calcEl) {
      calcEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLaunchCalculator = () => {
    const calcEl = document.getElementById('calculator');
    if (calcEl) {
      calcEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen text-slate-100 relative selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Dynamic Starfield & Nebula Canvas */}
      <CosmicStarfield />

      {/* Main Top Navigation */}
      <CosmicNavbar
        currentTheme={theme}
        onThemeChange={setTheme}
        language={language}
        onLanguageChange={handleLanguageChange}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={history.length}
      />

      <main className="relative z-10">
        {/* Hero Section */}
        <HeroSection
          language={language}
          onLaunchCalculator={handleLaunchCalculator}
        />

        {/* Main Calculator & Modes */}
        <CalculatorStage
          language={language}
          onAddHistory={handleAddHistory}
          onOpenHistory={() => setIsHistoryOpen(true)}
          historyCount={history.length}
          initialValue={reusedValue}
        />

        {/* Features Showcase */}
        <FeaturesShowcase language={language} />

        {/* About Section */}
        <AboutSection language={language} />
      </main>

      {/* Footer */}
      <CosmicFooter language={language} />

      {/* History Drawer */}
      <HistoryDrawer
        language={language}
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectResult={handleSelectResult}
        onDeleteItem={handleDeleteHistoryItem}
        onClearAll={handleClearHistory}
      />

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        language={language}
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
}
