import type { GameStore } from "../../game/state/store";

export type ItemCategory =
  | "consumable"
  | "weapon"
  | "accessory"
  | "keyItem"
  | "gift"
  | "collectible";

export interface ItemDef {
  id: string;
  name: string;
  category: ItemCategory;
  description: string;
  /** consumables only */
  onUse?: (store: GameStore) => { consumed: boolean; message: string };
  /** weapons only: modifies the FIGHT timing minigame */
  weapon?: { windowMs: number; baseDamage: number; flavor: string };
  /** accessories only: passive effect description + numeric hooks */
  accessory?: { maxHpBonus?: number; timingWindowBonusMs?: number };
}

export const ITEMS: Record<string, ItemDef> = {
  "cafeteria-bun": {
    id: "cafeteria-bun",
    name: "Cafeteria Bun",
    category: "consumable",
    description: "Slightly stale. Restores 8 HP. Tastes like it's trying its best.",
    onUse: (store) => {
      store.healPlayer(8);
      return { consumed: true, message: "You eat the bun. It helps more than it should." };
    },
  },
  "sweet-tea": {
    id: "sweet-tea",
    name: "Vending Machine Sweet Tea",
    category: "consumable",
    description: "Restores 14 HP. The machine only takes exact change, somehow, always.",
    onUse: (store) => {
      store.healPlayer(14);
      return { consumed: true, message: "The tea is exactly as sweet as you needed it to be." };
    },
  },
  "mechanical-pencil": {
    id: "mechanical-pencil",
    name: "Mechanical Pencil",
    category: "weapon",
    description: "Standard issue. A forgiving timing window for a forgiving weapon.",
    weapon: { windowMs: 220, baseDamage: 4, flavor: "click" },
  },
  "fountain-pen": {
    id: "fountain-pen",
    name: "Fountain Pen",
    category: "weapon",
    description: "Elegant, precise, unforgiving. Narrow timing window, higher damage.",
    weapon: { windowMs: 140, baseDamage: 7, flavor: "scratch" },
  },
  "lucky-hairclip": {
    id: "lucky-hairclip",
    name: "Lucky Hairclip",
    category: "accessory",
    description:
      "Found in a forgotten locker. Whoever it belonged to isn't in any class roster anyone can find. +4 Max HP.",
    accessory: { maxHpBonus: 4 },
  },
  "student-badge": {
    id: "student-badge",
    name: "Student Badge",
    category: "accessory",
    description: "Proves you belong here, which is more reassuring than it should be. Widens FIGHT timing slightly.",
    accessory: { timingWindowBonusMs: 30 },
  },
  "still-glass-shard": {
    id: "still-glass-shard",
    name: "Still-Glass Shard",
    category: "accessory",
    description:
      "A piece of a mirror that stopped moving when everything else in it did. It's warm, somehow. +3 Max HP, widens FIGHT timing slightly.",
    accessory: { maxHpBonus: 3, timingWindowBonusMs: 20 },
  },
  "steady-bulb": {
    id: "steady-bulb",
    name: "Steady Bulb",
    category: "accessory",
    description:
      "Doesn't flicker. Doesn't need to, anymore. +4 Max HP.",
    accessory: { maxHpBonus: 4 },
  },
  "unfinished-bookmark": {
    id: "unfinished-bookmark",
    name: "Unfinished Bookmark",
    category: "accessory",
    description:
      "Marks a page that was never actually chosen. Widens FIGHT timing slightly.",
    accessory: { timingWindowBonusMs: 25 },
  },
  "quiet-static": {
    id: "quiet-static",
    name: "Quiet Static",
    category: "accessory",
    description: "The sound of a thought that finally finished. +5 Max HP.",
    accessory: { maxHpBonus: 5 },
  },
  "tenth-place-token": {
    id: "tenth-place-token",
    name: "Tenth-Place Token",
    category: "accessory",
    description:
      "It counts now. Widens FIGHT timing slightly, and +2 Max HP.",
    accessory: { timingWindowBonusMs: 20, maxHpBonus: 2 },
  },
  "unproven-lemma": {
    id: "unproven-lemma",
    name: "Unproven Lemma",
    category: "accessory",
    description: "Never finished being checked. Turns out that's fine. +3 Max HP.",
    accessory: { maxHpBonus: 3 },
  },
  "worn-coin": {
    id: "worn-coin",
    name: "Worn Coin",
    category: "accessory",
    description:
      "Spent more times than any one pocket should allow. +4 Max HP, widens FIGHT timing slightly.",
    accessory: { maxHpBonus: 4, timingWindowBonusMs: 15 },
  },
  "library-card": {
    id: "library-card",
    name: "Library Card",
    category: "accessory",
    description:
      "No name on it, no expiration date, no record of who it belonged to before you. +3 Max HP.",
    accessory: { maxHpBonus: 3 },
  },
};

export function getItem(id: string): ItemDef | undefined {
  return ITEMS[id];
}
