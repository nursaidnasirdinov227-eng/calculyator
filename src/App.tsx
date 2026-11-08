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

export default function App() {
  const [theme, setTheme] = useState<string>('nebula');
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

  const handleSelectHistoryResult = (result: string) => {
    setReusedValue(result);
    // Smooth scroll to calculator
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
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={history.length}
      />

      <main className="relative z-10">
        {/* Hero Section */}
        <HeroSection onLaunchCalculator={handleLaunchCalculator} />

        {/* Main Calculator & Modes */}
        <CalculatorStage
          onAddHistory={handleAddHistory}
          onOpenHistory={() => setIsHistoryOpen(true)}
          historyCount={history.length}
          initialValue={reusedValue}
        />

        {/* Features Showcase */}
        <FeaturesShowcase />

        {/* About Section */}
        <AboutSection />
      </main>

      {/* Footer */}
      <CosmicFooter />

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectResult={handleSelectHistoryResult}
        onDeleteItem={handleDeleteHistoryItem}
        onClearAll={handleClearHistory}
      />

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
}
