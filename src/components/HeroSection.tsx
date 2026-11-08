import React from 'react';
import { ChevronDown, Sparkles, Orbit, Compass } from 'lucide-react';
import { soundManager } from '../utils/audio';

// Generated celestial sphere asset
const CELESTIAL_SPHERE_IMG = '/src/assets/images/cosmic_celestial_sphere_1794132441655.jpg';

interface HeroSectionProps {
  onLaunchCalculator: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onLaunchCalculator }) => {
  return (
    <section
      id="hero"
      className="relative min-h-[85vh] flex items-center justify-center overflow-hidden py-16 px-4 sm:px-6 lg:px-8"
    >
      {/* Background ambient cosmic glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        {/* Left Column: Headlines & Call to Actions */}
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
          {/* Subtle cosmic breadcrumb / kicker */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-950/40 border border-violet-500/30 text-xs font-medium text-cyan-300 shadow-[0_0_15px_rgba(124,58,237,0.2)]">
            <Orbit className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '12s' }} />
            <span>Next-Generation Computational Environment</span>
          </div>

          {/* Main Title */}
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]"
            style={{ fontFamily: 'Orbitron, sans-serif' }}
          >
            COSMIC{' '}
            <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
              CALCULATOR
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl font-medium text-cyan-200/90 tracking-wide">
            Beyond Numbers. Beyond Limits.
          </p>

          {/* Description */}
          <p className="text-base sm:text-lg text-slate-300/80 max-w-xl leading-relaxed">
            Explore the universe of mathematics with a calculator designed for the future.
            Seamlessly navigate standard, scientific, programmer, currency, and astronomical unit systems in a luxury glassmorphism cockpit.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
            <button
              onClick={() => {
                soundManager.play('eval');
                onLaunchCalculator();
              }}
              className="px-6 py-3.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white shadow-[0_0_25px_rgba(124,58,237,0.5)] hover:shadow-[0_0_35px_rgba(6,182,212,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 group cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-cyan-200 group-hover:rotate-12 transition-transform" />
              <span>Launch Calculator</span>
            </button>

            <a
              href="#features"
              onClick={() => soundManager.play('click')}
              className="px-6 py-3.5 text-sm font-semibold rounded-xl cosmic-glass text-slate-200 hover:text-white hover:border-violet-400/60 shadow-lg hover:shadow-[0_0_20px_rgba(124,58,237,0.25)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>Explore Features</span>
            </a>
          </div>

          {/* Quick Stats or Highlights */}
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-800/80 w-full max-w-md">
            <div>
              <div className="text-2xl font-bold font-mono text-cyan-300 tabular-nums">6</div>
              <div className="text-xs text-slate-400">Compute Modes</div>
            </div>
            <div>
              <div className="text-2xl font-bold font-mono text-violet-300 tabular-nums">64-bit</div>
              <div className="text-xs text-slate-400">Programmer Logic</div>
            </div>
            <div>
              <div className="text-2xl font-bold font-mono text-indigo-300 tabular-nums">0.00ms</div>
              <div className="text-xs text-slate-400">Instant Synthesizer</div>
            </div>
          </div>
        </div>

        {/* Right Column: 3D-inspired Celestial Sphere */}
        <div className="lg:col-span-5 flex items-center justify-center relative">
          <div className="relative w-[320px] sm:w-[380px] lg:w-[420px] aspect-square group">
            {/* Outer glowing orbital ring 1 */}
            <div
              className="absolute inset-0 rounded-full border border-cyan-400/40 animate-spin -rotate-12 scale-110 pointer-events-none"
              style={{ animationDuration: '24s' }}
            />
            {/* Outer glowing orbital ring 2 */}
            <div
              className="absolute inset-0 rounded-full border border-violet-500/50 animate-spin rotate-45 scale-125 pointer-events-none"
              style={{ animationDuration: '32s', animationDirection: 'reverse' }}
            />

            {/* Glowing Backdrop Aura */}
            <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-violet-600/30 to-cyan-500/20 blur-2xl group-hover:blur-3xl transition-all duration-700" />

            {/* Celestial sphere graphic */}
            <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-cyan-400/40 shadow-[0_0_50px_rgba(124,58,237,0.5)] transform group-hover:scale-105 transition-transform duration-700">
              <img
                src={CELESTIAL_SPHERE_IMG}
                alt="Cosmic celestial sphere with mathematical orbits"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              {/* Glass sheen overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-cyan-300/10 pointer-events-none" />
            </div>

            {/* Floating orbital coordinate pill */}
            <div className="absolute -bottom-3 right-4 cosmic-glass px-3.5 py-1.5 rounded-lg border border-cyan-400/30 text-xs font-mono text-cyan-300 shadow-xl flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
              <span>ORBITAL SYMMETRY ACTIVE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Down arrow scroll indicator */}
      <button
        onClick={onLaunchCalculator}
        aria-label="Scroll to calculator"
        className="absolute bottom-4 left-1/2 -translate-x-1/2 p-2 rounded-full text-slate-400 hover:text-cyan-300 transition-colors animate-bounce cursor-pointer"
      >
        <ChevronDown className="w-5 h-5" />
      </button>
    </section>
  );
};
