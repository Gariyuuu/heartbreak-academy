import { useGameStore } from "../../game/state/store";
import { useBattleStore } from "../../game/state/battleStore";
import { getItem } from "../../data/items/registry";
import { useKeyboardMenuNav } from "./useKeyboardMenuNav";

export function ItemMenu() {
  const items = useGameStore((s) => s.save.inventory.items);
  const performItem = useBattleStore((s) => s.performItem);
  const closeSubmenu = useBattleStore((s) => s.closeSubmenu);

  const consumables = Object.entries(items)
    .map(([id, qty]) => ({ def: getItem(id), qty }))
    .filter((e) => e.def && e.def.category === "consumable" && e.qty > 0);

  // "Back" is the last navigable item, index === consumables.length
  const selected = useKeyboardMenuNav(consumables.length + 1, (i) => {
    if (i === consumables.length) closeSubmenu();
    else performItem(consumables[i].def!.id);
  });

  return (
    <div className="battle-submenu-list">
      {consumables.length === 0 && (
        <p style={{ color: "var(--hba-text-muted)", fontSize: "0.9rem" }}>No usable items.</p>
      )}
      {consumables.map(({ def, qty }, i) => (
        <button
          key={def!.id}
          className={`hba-btn ${i === selected ? "selected" : ""}`}
          onClick={() => performItem(def!.id)}
        >
          {def!.name} ×{qty}
        </button>
      ))}
      <button
        className={`hba-btn battle-back-btn ${selected === consumables.length ? "selected" : ""}`}
        onClick={closeSubmenu}
      >
        Back
      </button>
    </div>
  );
}
