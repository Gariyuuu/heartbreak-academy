import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TextSpeed = "slow" | "normal" | "fast" | "instant";

interface SettingsState {
  masterVolume: number; // 0..1
  musicVolume: number;
  sfxVolume: number;
  textSpeed: TextSpeed;
  screenShake: boolean;
  flashEffects: boolean;
  largeHeart: boolean;
  bulletSpeedAssist: boolean; // slows bullets when true
  setMasterVolume: (v: number) => void;
  setMusicVolume: (v: number) => void;
  setSfxVolume: (v: number) => void;
  setTextSpeed: (v: TextSpeed) => void;
  toggleScreenShake: () => void;
  toggleFlashEffects: () => void;
  toggleLargeHeart: () => void;
  toggleBulletSpeedAssist: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      masterVolume: 0.7,
      musicVolume: 0.7,
      sfxVolume: 0.8,
      textSpeed: "normal",
      screenShake: true,
      flashEffects: true,
      largeHeart: false,
      bulletSpeedAssist: false,
      setMasterVolume: (v) => set({ masterVolume: v }),
      setMusicVolume: (v) => set({ musicVolume: v }),
      setSfxVolume: (v) => set({ sfxVolume: v }),
      setTextSpeed: (v) => set({ textSpeed: v }),
      toggleScreenShake: () => set((s) => ({ screenShake: !s.screenShake })),
      toggleFlashEffects: () => set((s) => ({ flashEffects: !s.flashEffects })),
      toggleLargeHeart: () => set((s) => ({ largeHeart: !s.largeHeart })),
      toggleBulletSpeedAssist: () => set((s) => ({ bulletSpeedAssist: !s.bulletSpeedAssist })),
    }),
    { name: "hba:settings" },
  ),
);

export const TEXT_SPEED_MS: Record<TextSpeed, number> = {
  slow: 18,
  normal: 6,
  fast: 2,
  instant: 0,
};
