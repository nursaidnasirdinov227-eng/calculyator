import React from 'react';
import { Cpu, Radio, Sparkles, Orbit, Binary, Layers } from 'lucide-react';

export const FeaturesShowcase: React.FC = () => {
  const features = [
    {
      icon: Cpu,
      title: 'Precision Math Kernel',
      description:
        'Engineered with high-precision tokenization and Reverse Polish Notation (RPN), eliminating floating-point rounding quirks.',
      accent: 'text-cyan-400',
      border: 'hover:border-cyan-400/50',
    },
    {
      icon: Radio,
      title: 'Haptic Audio Synthesizer',
      description:
        'Subtle sine and harmonic oscillators synthesize tactile cosmic blips on every keystroke, fully toggleable.',
      accent: 'text-violet-400',
      border: 'hover:border-violet-400/50',
    },
    {
      icon: Binary,
      title: '64-Bit Bitboard & Radix',
      description:
        'Simultaneous HEX, DEC, OCT, and BIN readouts with a clickable 32-bit matrix and bitwise operators.',
      accent: 'text-indigo-400',
      border: 'hover:border-indigo-400/50',
    },
    {
      icon: Orbit,
      title: 'Astrophysical Conversions',
      description:
        'Convert seamlessly across standard laboratory units and cosmic scales, from nanometers to light-years and Astronomical Units.',
      accent: 'text-cyan-300',
      border: 'hover:border-cyan-300/50',
    },
    {
      icon: Layers,
      title: 'Persistent Chronicles',
      description:
        'Every calculation is logged to session storage with one-click insertion back into your active compute terminal.',
      accent: 'text-emerald-400',
      border: 'hover:border-emerald-400/50',
    },
    {
      icon: Sparkles,
      title: 'Cosmic Atmosphere & Themes',
      description:
        'Interactive particle starfield, parallax dust, shooting meteors, and 4 cosmic color profiles.',
      accent: 'text-pink-400',
      border: 'hover:border-pink-400/50',
    },
  ];

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/40 border border-violet-500/30 text-xs font-mono text-cyan-300 mb-3">
          <span>ARCHITECTURAL CAPABILITIES</span>
        </div>
        <h2
          className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight"
          style={{ fontFamily: 'Orbitron, sans-serif' }}
        >
          ENGINEERED FOR THE COSMOS
        </h2>
        <p className="mt-3 text-slate-400 text-base">
          A harmonious union of computational rigor, deep-space aesthetics, and tactile micro-interactions.
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
