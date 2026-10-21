/**
 * Procedural Web Audio Sound Synthesizer
 * Produces joyful, kid-friendly sound effects without any external audio files.
 */

class SoundManager {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;
  private bgmOscs: OscillatorNode[] = [];
  private bgmGain: GainNode | null = null;
  public isBgmPlaying: boolean = false;
  private bgmTimer: number | null = null;

  constructor() {
    // Load mute preference
    const savedMute = localStorage.getItem('math_quest_muted');
    if (savedMute !== null) {
      this.isMuted = savedMute === 'true';
    }
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    localStorage.setItem('math_quest_muted', String(this.isMuted));
    if (this.isMuted) {
      this.stopBgm();
    }
    return this.isMuted;
  }

  /**
   * Cheerful click / tap bubble pop
   */
  public playClick() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch {
      // AudioContext autoplay protection fallback
    }
  }

  /**
   * Joyful sparkling arpeggio for correct answer (C5, E5, G5, C6)
   */
  public playCorrect() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const noteStart = now + idx * 0.07;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, noteStart);

        gain.gain.setValueAtTime(0, noteStart);
        gain.gain.linearRampToValueAtTime(0.25, noteStart + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.28);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteStart);
        osc.stop(noteStart + 0.3);
      });
    } catch {
      // AudioContext catch
    }
  }

  /**
   * Friendly, cartoon wobble for wrong answer (never harsh or punishing)
   */
  public playWrong() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.25);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch {
      // AudioContext catch
    }
  }

  /**
   * Star chime when a star is awarded on victory screen
   */
  public playStar(starIndex: number) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // Higher pitches for each subsequent star
      const baseFreq = 587.33 * Math.pow(1.25, starIndex); // D5 base

      const osc = this.ctx.createOscillator();
      const oscHarmonic = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      oscHarmonic.type = 'triangle';
      osc.frequency.setValueAtTime(baseFreq, now);
      oscHarmonic.frequency.setValueAtTime(baseFreq * 2, now);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.connect(gain);
      oscHarmonic.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      oscHarmonic.start(now);
      osc.stop(now + 0.55);
      oscHarmonic.stop(now + 0.55);
    } catch {
      // Catch
    }
  }

  /**
   * Combo streak sound (rises with combo count)
   */
  public playCombo(combo: number) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const pitchMultiplier = Math.min(2.0, 1 + combo * 0.12);
      const notes = [440 * pitchMultiplier, 554.37 * pitchMultiplier, 659.25 * pitchMultiplier];

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const noteStart = now + idx * 0.05;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteStart);

        gain.gain.setValueAtTime(0.18, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteStart);
        osc.stop(noteStart + 0.22);
      });
    } catch {
      // Catch
    }
  }

  /**
   * Triumphant victory fanfare when completing a level
   */
  public playVictory() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // G4 -> C5 -> E5 -> G5 -> C6 held
      const melody = [
        { f: 392.00, t: 0.0, d: 0.12 },
        { f: 523.25, t: 0.12, d: 0.12 },
        { f: 659.25, t: 0.24, d: 0.12 },
        { f: 783.99, t: 0.36, d: 0.2 },
        { f: 1046.50, t: 0.58, d: 0.6 },
      ];

      melody.forEach(({ f, t, d }) => {
        if (!this.ctx) return;
        const start = now + t;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, start);

        gain.gain.setValueAtTime(0.24, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + d);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start);
        osc.stop(start + d + 0.05);
      });
    } catch {
      // Catch
    }
  }

  /**
   * Gentle, cheerful procedural background melody loop (music box style)
   */
  public startBgm() {
    if (this.isMuted || this.isBgmPlaying) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      this.isBgmPlaying = true;

      // Soft Pentatonic joyful melody sequence: C, D, E, G, A, G, E, D
      const notes = [523.25, 587.33, 659.25, 783.99, 880.0, 783.99, 659.25, 587.33];
      let step = 0;

      const scheduleNote = () => {
        if (!this.isBgmPlaying || this.isMuted || !this.ctx) return;
        try {
          const now = this.ctx.currentTime;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(notes[step % notes.length], now);

          // Very quiet, gentle background ambiance
          gain.gain.setValueAtTime(0.035, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(now);
          osc.stop(now + 0.38);

          step++;
          this.bgmTimer = window.setTimeout(scheduleNote, 420);
        } catch {
          // Ignore
        }
      };

      scheduleNote();
    } catch {
      this.isBgmPlaying = false;
    }
  }

  public stopBgm() {
    this.isBgmPlaying = false;
    if (this.bgmTimer !== null) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }
}

export const sounds = new SoundManager();
