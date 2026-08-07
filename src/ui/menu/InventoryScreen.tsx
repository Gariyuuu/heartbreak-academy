import { useState } from "react";
import { useGameStore } from "../../game/state/store";
import { getItem, type ItemCategory } from "../../data/items/registry";
import { useMenuEscape } from "./useMenuEscape";
import "./PauseMenu.css";

const CATEGORY_LABEL: Record<ItemCategory, string> = {
  consumable: "Consumables",
  weapon: "Weapons",
  accessory: "Accessories",
  keyItem: "Key Items",
  gift: "Gifts",
  collectible: "Collectibles",
};

export function InventoryScreen() {
  const menuOpen = useGameStore((s) => s.ui.menuOpen);
  const setMenu = useGameStore((s) => s.setMenu);
  const items = useGameStore((s) => s.save.inventory.items);
  const weaponId = useGameStore((s) => s.save.inventory.weaponId);
  const accessoryId = useGameStore((s) => s.save.inventory.accessoryId);
  const equipWeapon = useGameStore((s) => s.equipWeapon);
  const equipAccessory = useGameStore((s) => s.equipAccessory);
  const removeItem = useGameStore((s) => s.removeItem);
  const showToast = useGameStore((s) => s.showToast);
  const store = useGameStore();
  const [selected, setSelected] = useState<string | null>(null);

  useMenuEscape(menuOpen === "inventory", () => setMenu("pause"));

  if (menuOpen !== "inventory") return null;

  const grouped = Object.entries(items).reduce<Record<string, string[]>>((acc, [id]) => {
    const def = getItem(id);
    if (!def) return acc;
    (acc[def.category] ??= []).push(id);
    return acc;
  }, {});

  const selectedDef = selected ? getItem(selected) : null;

  function handleUse(id: string) {
    const def = getItem(id);
    if (!def?.onUse) return;
    const had = removeItem(id, 1);
    if (!had) return;
    const result = def.onUse(store);
    showToast(result.message);
    setSelected(null);
  }

  return (
    <div className="menu-overlay">
      <div className="menu-panel hba-panel">
        <h2>Inventory</h2>

        <div className="menu-section-title">Equipped</div>
        <div className="menu-row">
          <span>Weapon: {weaponId ? getItem(weaponId)?.name : "None"}</span>
        </div>
        <div className="menu-row">
          <span>Accessory: {accessoryId ? getItem(accessoryId)?.name : "None"}</span>
        </div>

        {(Object.keys(CATEGORY_LABEL) as ItemCategory[]).map((cat) => {
          const ids = grouped[cat];
          if (!ids || ids.length === 0) return null;
          return (
            <div key={cat}>
              <div className="menu-section-title">{CATEGORY_LABEL[cat]}</div>
              {ids.map((id) => {
                const def = getItem(id)!;
                const qty = items[id];
                return (
                  <div key={id} className="menu-row">
                    <span
                      style={{ cursor: "pointer" }}
                      onClick={() => setSelected(id === selected ? null : id)}
                    >
                      {def.name} {qty > 1 ? `×${qty}` : ""}
                    </span>
                    <span style={{ display: "flex", gap: 6 }}>
                      {def.category === "consumable" && (
                        <button className="hba-btn" onClick={() => handleUse(id)}>
                          Use
                        </button>
                      )}
                      {def.category === "weapon" && (
                        <button
                          className="hba-btn"
                          disabled={weaponId === id}
                          onClick={() => equipWeapon(id)}
                        >
                          {weaponId === id ? "Equipped" : "Equip"}
                        </button>
                      )}
                      {def.category === "accessory" && (
                        <button
                          className="hba-btn"
                          disabled={accessoryId === id}
                          onClick={() => equipAccessory(id)}
                        >
                          {accessoryId === id ? "Equipped" : "Equip"}
                        </button>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          );
        })}

        {selectedDef && (
          <p style={{ color: "var(--hba-text-muted)", marginTop: 10, fontSize: "0.88rem" }}>
            {selectedDef.description}
          </p>
        )}
        {Object.keys(items).length === 0 && (
          <p style={{ color: "var(--hba-text-muted)" }}>Nothing here yet.</p>
        )}

        <div className="menu-close-row">
          <button className="hba-btn" onClick={() => setMenu("pause")}>
            Back (X)
          </button>
        </div>
      </div>
    </div>
  );
}
