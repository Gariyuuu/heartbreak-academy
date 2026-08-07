import { useSettingsStore } from "../state/settingsStore";

// Real background music, same honesty policy as AudioManager's SFX: no
// recorded tracks exist, so this is a small step-sequencer that plays
// actual synthesized loops via WebAudio rather than leaving `musicVolume`
// (wired in settings since the vertical slice) controlling silence. Swap
// in real audio files later by replacing `play()`'s internals — the
// public API (play/stop) doesn't need to change.

interface Note {
  /** Hz, or null for a rest */
  freq: number | null;
  /** length in beats */
  beats: number;
  gain?: number;
}

interface Layer {
  waveform: OscillatorType;
  steps: Note[];
  /** loudness multiplier for this layer relative to the track's baseGain */
  gainScale: number;
}

interface Track {
  bpm: number;
  /** overall loudness multiplier relative to other tracks */
  baseGain: number;
  /** most tracks are one melodic layer; boss adds a second, lower layer
   * underneath for weight */
  layers: Layer[];
}

interface LayerRuntime {
  noteIndex: number;
  nextTime: number;
}

// A small set of note frequencies, enough for simple pentatonic/minor
// loops without needing a full note-name parser.
const A2 = 110.0;
const G2 = 98.0;
const F3 = 174.61;
const G3 = 196.0;
const A3 = 220.0;
const C4 = 261.63;
const D4 = 293.66;
const E4 = 329.63;
const G4 = 392.0;
const A4 = 440.0;

const TRACKS: Record<string, Track> = {
  title: {
    bpm: 68,
    baseGain: 1,
    layers: [
      {
        waveform: "sine",
        gainScale: 1,
        steps: [
          { freq: A3, beats: 1.5 },
          { freq: C4, beats: 0.5 },
          { freq: E4, beats: 1 },
          { freq: A4, beats: 1 },
          { freq: G4, beats: 1.5 },
          { freq: E4, beats: 0.5 },
          { freq: C4, beats: 1 },
          { freq: null, beats: 1 },
        ],
      },
    ],
  },
  overworld: {
    bpm: 98,
    baseGain: 0.85,
    layers: [
      {
        waveform: "triangle",
        gainScale: 1,
        steps: [
          { freq: C4, beats: 1 },
          { freq: E4, beats: 1 },
          { freq: G4, beats: 1 },
          { freq: A4, beats: 1 },
          { freq: G4, beats: 1 },
          { freq: E4, beats: 1 },
          { freq: D4, beats: 1 },
          { freq: null, beats: 1 },
        ],
      },
    ],
  },
  battle: {
    bpm: 132,
    baseGain: 0.6,
    layers: [
      {
        waveform: "square",
        gainScale: 1,
        steps: [
          { freq: E4, beats: 0.5 },
          { freq: E4, beats: 0.5 },
          { freq: G4, beats: 0.5 },
          { freq: E4, beats: 0.5 },
          { freq: D4, beats: 0.5 },
          { freq: D4, beats: 0.5 },
          { freq: C4, beats: 0.5 },
          { freq: D4, beats: 0.5 },
        ],
      },
    ],
  },
  boss: {
    bpm: 142,
    baseGain: 0.55,
    layers: [
      // melody — the same line the track had before the bass layer existed
      {
        waveform: "sawtooth",
        gainScale: 1,
        steps: [
          { freq: A3, beats: 0.5 },
          { freq: A3, beats: 0.25 },
          { freq: C4, beats: 0.25 },
          { freq: A3, beats: 0.5 },
          { freq: G3, beats: 0.5 },
          { freq: G3, beats: 0.25 },
          { freq: F3, beats: 0.25 },
          { freq: G3, beats: 0.5 },
        ],
      },
      // driving bass pulse an octave-plus below the melody's root notes —
      // straight quarter notes, the part that makes it read as "boss"
      // rather than just "faster battle theme"
      {
        waveform: "square",
        gainScale: 0.85,
        steps: [
          { freq: A2, beats: 0.5 },
          { freq: A2, beats: 0.5 },
          { freq: A2, beats: 0.5 },
          { freq: A2, beats: 0.5 },
          { freq: G2, beats: 0.5 },
          { freq: G2, beats: 0.5 },
          { freq: G2, beats: 0.5 },
          { freq: G2, beats: 0.5 },
        ],
      },
    ],
  },
};

export const MUSIC_TRACK_LABELS: Record<string, string> = {
  title: "Title Theme",
  overworld: "Overworld",
  battle: "Battle",
  boss: "Boss Battle",
};

const LOOKAHEAD_MS = 100;
const SCHEDULE_AHEAD_SEC = 0.3;

class MusicManagerImpl {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private currentTrackId: string | null = null;
  private timer: number | null = null;
  private layerRuntimes: LayerRuntime[] = [];
  private unlockAttached = false;

  private getCtx(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const Ctor =
        window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      this.ctx = new Ctor();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0;
      this.masterGain.connect(this.ctx.destination);
    }
    this.attachUnlockListener();
    return this.ctx;
  }

  /** Browsers start AudioContext suspended until a user gesture; resume
   * on the first click/keydown so music actually starts once the player
   * has interacted with the page at all, not just on an audio-specific
   * button. */
  private attachUnlockListener() {
    if (this.unlockAttached || typeof window === "undefined") return;
    this.unlockAttached = true;
    const resume = () => {
      this.ctx?.resume().catch(() => {});
    };
    window.addEventListener("click", resume, { once: true });
    window.addEventListener("keydown", resume, { once: true });
  }

  play(trackId: string) {
    if (this.currentTrackId === trackId) return;
    const audio = this.getCtx();
    const track = TRACKS[trackId];
    if (!audio || !track) return;
    this.stopScheduler();
    this.currentTrackId = trackId;
    this.layerRuntimes = track.layers.map(() => ({ noteIndex: 0, nextTime: audio.currentTime + 0.05 }));
    this.scheduleAhead();
  }

  stop() {
    this.currentTrackId = null;
    this.stopScheduler();
  }

  getCurrentTrackId(): string | null {
    return this.currentTrackId;
  }

  private stopScheduler() {
    if (this.timer !== null) {
      window.clearTimeout(this.timer);
      this.timer = null;
    }
  }

  private scheduleAhead = () => {
    const audio = this.ctx;
    const trackId = this.currentTrackId;
    if (!audio || !trackId) return;
    const track = TRACKS[trackId];

    const { masterVolume, musicVolume } = useSettingsStore.getState();
    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(masterVolume * musicVolume, audio.currentTime, 0.05);
    }

    track.layers.forEach((layer, layerIndex) => {
      const runtime = this.layerRuntimes[layerIndex];
      if (!runtime) return;
      while (runtime.nextTime < audio.currentTime + SCHEDULE_AHEAD_SEC) {
        const step = layer.steps[runtime.noteIndex % layer.steps.length];
        const durationSec = step.beats * (60 / track.bpm);
        this.playNote(step, runtime.nextTime, durationSec, track, layer);
        runtime.nextTime += durationSec;
        runtime.noteIndex++;
      }
    });

    this.timer = window.setTimeout(this.scheduleAhead, LOOKAHEAD_MS);
  };

  private playNote(step: Note, time: number, durationSec: number, track: Track, layer: Layer) {
    if (step.freq === null || !this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = layer.waveform;
    osc.frequency.value = step.freq;
    const peak = 0.16 * track.baseGain * layer.gainScale * (step.gain ?? 1);
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(peak, time + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + durationSec * 0.92);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + durationSec);
  }
}

export const musicManager = new MusicManagerImpl();
