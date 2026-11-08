import React from 'react';
import { Orbit } from 'lucide-react';
import { Language, getTranslation } from '../utils/i18n';

interface CosmicFooterProps {
  language?: Language;
}

export const CosmicFooter: React.FC<CosmicFooterProps> = ({ language = 'en' }) => {
  const t = getTranslation(language);

  return (
    <footer className="border-t border-violet-500/20 bg-black/80 backdrop-blur-lg relative z-10 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-violet-600 to-cyan-400 flex items-center justify-center">
            <Orbit className="w-3.5 h-3.5 text-white" />
          </div>
          <span
            className="text-sm font-bold text-white tracking-wider"
            style={{ fontFamily: 'Orbitron, sans-serif' }}
          >
            {t.appName}
          </span>
          <span className="text-slate-500 text-xs hidden sm:inline">·</span>
          <span className="text-xs text-slate-400 hidden sm:inline">
            {t.tagline}
          </span>
        </div>

        <div className="flex items-center gap-6 text-xs text-slate-400 font-medium">
          <a href="#hero" className="hover:text-cyan-300 transition-colors">
            {t.navHome}
          </a>
          <a href="#calculator" className="hover:text-cyan-300 transition-colors">
            {t.navCalculator}
          </a>
          <a href="#modes" className="hover:text-cyan-300 transition-colors">
            {t.navModes}
          </a>
          <a href="#features" className="hover:text-cyan-300 transition-colors">
            {t.navFeatures}
          </a>
          <a href="#about" className="hover:text-cyan-300 transition-colors">
            {t.navAbout}
          </a>
        </div>

        <div className="text-xs text-slate-500 font-mono">
          © {new Date().getFullYear()} {t.footerCopy}
        </div>
      </div>
    </footer>
  );
};
