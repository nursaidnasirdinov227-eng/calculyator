import React from 'react';
import { Compass, ShieldCheck, Zap } from 'lucide-react';
import { Language, getTranslation } from '../utils/i18n';

const NEBULA_BG_IMG = '/src/assets/images/cosmic_nebula_geometry_1794132443254.jpg';

interface AboutSectionProps {
  language?: Language;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ language = 'en' }) => {
  const t = getTranslation(language);

  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
      <div className="relative rounded-3xl cosmic-glass border border-violet-500/30 overflow-hidden shadow-2xl">
        {/* Ambient image banner backdrop */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <img
            src={NEBULA_BG_IMG}
            alt="Cosmic nebula geometry"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050510] via-[#050510]/90 to-transparent" />
        </div>

        <div className="relative z-10 p-8 sm:p-12 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-xs font-mono text-cyan-300">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t.aboutKicker}</span>
            </div>

            <h2
              className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight"
              style={{ fontFamily: 'Orbitron, sans-serif' }}
            >
              {t.aboutTitle}
            </h2>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              {t.aboutDesc}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-black/40 border border-slate-800">
                <div className="flex items-center gap-2.5 text-cyan-300 font-mono text-sm font-bold mb-1">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>{t.aboutCard1Title}</span>
                </div>
                <p className="text-xs text-slate-400 leading-normal">
                  {t.aboutCard1Desc}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-slate-800">
                <div className="flex items-center gap-2.5 text-violet-300 font-mono text-sm font-bold mb-1">
                  <Zap className="w-4 h-4 text-violet-400" />
                  <span>{t.aboutCard2Title}</span>
                </div>
                <p className="text-xs text-slate-400 leading-normal">
                  {t.aboutCard2Desc}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-center space-y-4">
            <div className="p-6 rounded-2xl bg-black/60 border border-violet-500/30 space-y-3">
              <div className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                {t.aboutConstTitle}
              </div>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">{t.aboutLightSpeed}</span>
                  <span className="text-cyan-300 font-bold">299,792,458 m/s</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">{t.aboutAU}</span>
                  <span className="text-cyan-300 font-bold">149,597,870,700 m</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">{t.aboutPi}</span>
                  <span className="text-violet-300 font-bold">3.1415926535...</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">{t.aboutEuler}</span>
                  <span className="text-violet-300 font-bold">2.7182818284...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
