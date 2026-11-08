import React from 'react';
import { Compass, ShieldCheck, Zap } from 'lucide-react';

const NEBULA_BG_IMG = '/src/assets/images/cosmic_nebula_geometry_1794132443254.jpg';

export const AboutSection: React.FC = () => {
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
              <span>PHILOSOPHY OF COSMIC COMPUTATION</span>
            </div>

            <h2
              className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight"
              style={{ fontFamily: 'Orbitron, sans-serif' }}
            >
              MATHEMATICS ACROSS SPACE & TIME
            </h2>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              Traditional calculators were forged in the era of plastic handhelds and beige office spreadsheets.
              COSMIC CALCULATOR was architected under a different presumption: that mathematics is the universal language of stellar mechanics, orbital trajectories, and cosmic geometry.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-black/40 border border-slate-800">
                <div className="flex items-center gap-2.5 text-cyan-300 font-mono text-sm font-bold mb-1">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>Deterministic Precision</span>
                </div>
                <p className="text-xs text-slate-400 leading-normal">
                  Strict decimal normalization prevents standard IEEE 754 float drift in commercial and engineering evaluations.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-slate-800">
                <div className="flex items-center gap-2.5 text-violet-300 font-mono text-sm font-bold mb-1">
                  <Zap className="w-4 h-4 text-violet-400" />
                  <span>Zero Network Latency</span>
                </div>
                <p className="text-xs text-slate-400 leading-normal">
                  Local-first client evaluation executes computations instantly with zero telemetry overhead.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-center space-y-4">
            <div className="p-6 rounded-2xl bg-black/60 border border-violet-500/30 space-y-3">
              <div className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                Physical Constant Reference
              </div>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Speed of Light (c)</span>
                  <span className="text-cyan-300 font-bold">299,792,458 m/s</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Astronomical Unit (AU)</span>
                  <span className="text-cyan-300 font-bold">149,597,870,700 m</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Archimedes Constant (π)</span>
                  <span className="text-violet-300 font-bold">3.1415926535...</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Euler's Number (e)</span>
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
