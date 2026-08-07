import { useSettingsStore } from "../state/settingsStore";

// Minimal procedural SFX so the audio pipeline is real, not just
// architecture: short synthesized tones via WebAudio, gated by the
// settings sliders. Real tracks/SFX drop into assets/audio later and this
// module is where they'd be wired in (see DEVELOPMENT_PLAN.md).
let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  return ctx;
}

function beep(freq: number, durationMs: number, type: OscillatorType = "sine", gainScale = 1) {
  const audio = getCtx();
  if (!audio) return;
  const { masterVolume, sfxVolume } = useSettingsStore.getState();
  const volume = masterVolume * sfxVolume * gainScale;
  if (volume <= 0) return;

  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(volume * 0.2, audio.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + durationMs / 1000);
  osc.connect(gain);
  gain.connect(audio.destination);
  osc.start();
  osc.stop(audio.currentTime + durationMs / 1000);
}

export const audioManager = {
  menuMove: () => beep(420, 40, "square", 0.5),
  menuConfirm: () => beep(660, 70, "square", 0.7),
  damage: () => beep(140, 120, "sawtooth", 0.8),
  heal: () => beep(880, 160, "sine", 0.6),
  save: () => beep(990, 220, "triangle", 0.7),
  spare: () => beep(1200, 260, "sine", 0.8),
};
