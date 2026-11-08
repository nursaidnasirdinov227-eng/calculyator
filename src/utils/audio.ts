/**
 * Cosmic Audio Synthesizer
 * Uses Web Audio API to create soft, futuristic tactile audio feedback
 * without any external audio file dependencies.
 */

class CosmicAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Check localStorage for muted state
    try {
      const stored = localStorage.getItem('cosmic_calc_muted');
      if (stored !== null) {
        this.isMuted = stored === 'true';
      }
    } catch {
      this.isMuted = false;
    }
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    try {
      localStorage.setItem('cosmic_calc_muted', String(this.isMuted));
    } catch {
      // ignore
    }
    if (!this.isMuted) {
      this.play('mode');
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public play(type: 'num' | 'op' | 'eval' | 'clear' | 'mode' | 'error' | 'click') {
    if (this.isMuted) return;

    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      switch (type) {
        case 'num':
          // Subtle soft sine blip (440Hz -> 520Hz)
          osc.type = 'sine';
          osc.frequency.setValueAtTime(520, now);
          osc.frequency.exponentialRampToValueAtTime(580, now + 0.04);
          gain.gain.setValueAtTime(0.04, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
          osc.start(now);
          osc.stop(now + 0.05);
          break;

        case 'op':
          // Crisp harmonic triangle blip
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(680, now);
          osc.frequency.exponentialRampToValueAtTime(760, now + 0.05);
          gain.gain.setValueAtTime(0.05, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
          osc.start(now);
          osc.stop(now + 0.06);
          break;

        case 'eval':
          // Ascending dual-tone futuristic chord
          osc.type = 'sine';
          osc.frequency.setValueAtTime(523.25, now); // C5
          osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.08); // G5
          gain.gain.setValueAtTime(0.07, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
          osc.start(now);
          osc.stop(now + 0.12);
          break;

        case 'clear':
          // Descending sweep
          osc.type = 'sine';
          osc.frequency.setValueAtTime(440, now);
          osc.frequency.exponentialRampToValueAtTime(220, now + 0.07);
          gain.gain.setValueAtTime(0.06, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
          osc.start(now);
          osc.stop(now + 0.08);
          break;

        case 'mode':
          // Shimmer chime
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(600, now);
          osc.frequency.exponentialRampToValueAtTime(900, now + 0.06);
          gain.gain.setValueAtTime(0.05, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);
          osc.start(now);
          osc.stop(now + 0.09);
          break;

        case 'error':
          // Low resonant warning tone
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(180, now);
          osc.frequency.exponentialRampToValueAtTime(140, now + 0.12);
          gain.gain.setValueAtTime(0.05, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);
          osc.start(now);
          osc.stop(now + 0.14);
          break;

        case 'click':
        default:
          osc.type = 'sine';
          osc.frequency.setValueAtTime(400, now);
          gain.gain.setValueAtTime(0.03, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);
          osc.start(now);
          osc.stop(now + 0.03);
          break;
      }
    } catch {
      // AudioContext policy or unsupported
    }
  }
}

export const soundManager = new CosmicAudioEngine();
