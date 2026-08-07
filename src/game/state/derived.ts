import type { GameStore } from "./store";
import { getItem } from "../../data/items/registry";

/** Base max HP plus whatever the equipped accessory adds. Read this
 * anywhere player max HP is displayed or clamped against — never
 * `save.player.maxHp` directly, or equipment stops mattering. */
export function getEffectiveMaxHp(store: Pick<GameStore, "save">): number {
  const accessoryId = store.save.inventory.accessoryId;
  const bonus = (accessoryId ? getItem(accessoryId)?.accessory?.maxHpBonus : 0) ?? 0;
  return store.save.player.maxHp + bonus;
}

/** Weapon's FIGHT timing window plus whatever the equipped accessory adds. */
export function getEffectiveTimingWindowMs(store: Pick<GameStore, "save">): number {
  const weaponId = store.save.inventory.weaponId;
  const accessoryId = store.save.inventory.accessoryId;
  const base = (weaponId ? getItem(weaponId)?.weapon?.windowMs : undefined) ?? 200;
  const bonus = (accessoryId ? getItem(accessoryId)?.accessory?.timingWindowBonusMs : 0) ?? 0;
  return base + bonus;
}
