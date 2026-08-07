import {
  SAVE_VERSION,
  createDefaultTimeline,
  type GameSaveState,
  type TimelineState,
} from "./schema";

const SLOT_KEY = (slot: number) => `hba:save:${slot}`;
const AUTOSAVE_KEY = "hba:save:auto";
const TIMELINE_KEY = "hba:timeline";

export const SAVE_SLOT_COUNT = 3;

function migrate(raw: unknown): GameSaveState | null {
  if (!raw || typeof raw !== "object") return null;
  const data = raw as GameSaveState;
  if (typeof data.version !== "number") return null;
  // No migrations needed yet — SAVE_VERSION is still 1. When the schema
  // changes, branch on data.version here and upgrade forward step by step
  // rather than discarding the save.
  if (data.version > SAVE_VERSION) {
    console.warn("Save was written by a newer version; loading anyway.");
  }
  return data;
}

function safeParse(json: string | null): GameSaveState | null {
  if (!json) return null;
  try {
    const parsed = JSON.parse(json);
    return migrate(parsed);
  } catch (err) {
    console.error("Save corrupted, ignoring:", err);
    return null;
  }
}

export const saveManager = {
  write(slot: number, state: GameSaveState) {
    const payload: GameSaveState = { ...state, slot, savedAt: Date.now() };
    try {
      localStorage.setItem(SLOT_KEY(slot), JSON.stringify(payload));
    } catch (err) {
      console.error("Failed to write save slot", slot, err);
    }
  },

  read(slot: number): GameSaveState | null {
    return safeParse(localStorage.getItem(SLOT_KEY(slot)));
  },

  delete(slot: number) {
    localStorage.removeItem(SLOT_KEY(slot));
  },

  listSlots(): Array<{ slot: number; save: GameSaveState | null }> {
    return Array.from({ length: SAVE_SLOT_COUNT }, (_, i) => ({
      slot: i,
      save: this.read(i),
    }));
  },

  writeAutosave(state: GameSaveState) {
    try {
      localStorage.setItem(
        AUTOSAVE_KEY,
        JSON.stringify({ ...state, savedAt: Date.now() }),
      );
    } catch (err) {
      console.error("Failed to write autosave", err);
    }
  },

  readAutosave(): GameSaveState | null {
    return safeParse(localStorage.getItem(AUTOSAVE_KEY));
  },

  writeTimeline(timeline: TimelineState) {
    try {
      localStorage.setItem(TIMELINE_KEY, JSON.stringify(timeline));
    } catch (err) {
      console.error("Failed to write timeline", err);
    }
  },

  readTimeline(): TimelineState {
    try {
      const raw = localStorage.getItem(TIMELINE_KEY);
      if (!raw) return createDefaultTimeline();
      return { ...createDefaultTimeline(), ...JSON.parse(raw) };
    } catch (err) {
      console.error("Timeline corrupted, resetting:", err);
      return createDefaultTimeline();
    }
  },
};
