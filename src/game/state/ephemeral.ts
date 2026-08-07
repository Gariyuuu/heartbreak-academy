import { create } from "zustand";

// Non-persisted, cross-scene runtime state. Kept separate from the save
// store so nothing here is ever accidentally written to disk.
interface EphemeralStore {
  pendingEncounterId: string | null;
  setPendingEncounter: (id: string | null) => void;
}

export const useEphemeralStore = create<EphemeralStore>((set) => ({
  pendingEncounterId: null,
  setPendingEncounter: (id) => set({ pendingEncounterId: id }),
}));
