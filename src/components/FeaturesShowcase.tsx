import React from 'react';
import { Cpu, Radio, Sparkles, Orbit, Binary, Layers } from 'lucide-react';
import { Language, getTranslation } from '../utils/i18n';

interface FeaturesShowcaseProps {
  language?: Language;
}

export const FeaturesShowcase: React.FC<FeaturesShowcaseProps> = ({ language = 'en' }) => {
  const t = getTranslation(language);

  const features = [
    {
      icon: Cpu,
      title: t.feat1Title,
      description: t.feat1Desc,
      accent: 'text-cyan-400',
      border: 'hover:border-cyan-400/50',
    },
    {
      icon: Radio,
      title: t.feat2Title,
      description: t.feat2Desc,
      accent: 'text-violet-400',
      border: 'hover:border-violet-400/50',
    },
    {
      icon: Binary,
      title: t.feat3Title,
      description: t.feat3Desc,
      accent: 'text-indigo-400',
      border: 'hover:border-indigo-400/50',
    },
    {
      icon: Orbit,
      title: t.feat4Title,
      description: t.feat4Desc,
      accent: 'text-cyan-300',
      border: 'hover:border-cyan-300/50',
    },
    {
      icon: Layers,
      title: t.feat5Title,
      description: t.feat5Desc,
      accent: 'text-emerald-400',
      border: 'hover:border-emerald-400/50',
    },
    {
      icon: Sparkles,
      title: t.feat6Title,
      description: t.feat6Desc,
      accent: 'text-pink-400',
      border: 'hover:border-pink-400/50',
    },
  ];

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/40 border border-violet-500/30 text-xs font-mono text-cyan-300 mb-3">
          <span>{t.featKicker}</span>
        </div>
        <h2
          className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight"
          style={{ fontFamily: 'Orbitron, sans-serif' }}
        >
          {t.featTitle}
        </h2>
        <p className="mt-3 text-slate-400 text-base">
          {t.featSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <div
              key={i}
              className={`p-6 rounded-2xl cosmic-glass border border-slate-800/80 ${f.border} transition-all duration-300 hover:shadow-[0_0_25px_rgba(124,58,237,0.15)] group`}
            >
              <div className="w-12 h-12 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Icon className={`w-6 h-6 ${f.accent}`} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 tracking-wide font-mono">
                {f.title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {f.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
