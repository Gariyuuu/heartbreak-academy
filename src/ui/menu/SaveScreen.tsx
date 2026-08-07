import { useGameStore } from "../../game/state/store";
import { saveManager, SAVE_SLOT_COUNT } from "../../game/save/saveManager";
import { getMap } from "../../game/maps/registry";
import { useMenuEscape } from "./useMenuEscape";
import "./PauseMenu.css";

function formatPlaytime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const h = Math.floor(m / 60);
  return h > 0 ? `${h}h ${m % 60}m` : `${m}m`;
}

export function SaveScreen() {
  const menuOpen = useGameStore((s) => s.ui.menuOpen);
  const setMenu = useGameStore((s) => s.setMenu);
  const saveToSlot = useGameStore((s) => s.saveToSlot);
  const loadSlot = useGameStore((s) => s.loadSlot);
  const showToast = useGameStore((s) => s.showToast);

  useMenuEscape(menuOpen === "save", () => setMenu("pause"));

  if (menuOpen !== "save") return null;

  const slots = saveManager.listSlots();

  return (
    <div className="menu-overlay">
      <div className="menu-panel hba-panel">
        <h2>Save / Load</h2>
        {slots.map(({ slot, save }) => (
          <div key={slot} className="menu-row">
            <span>
              Slot {slot + 1} —{" "}
              {save ? (
                <>
                  {getMap(save.player.mapId).name}, Lv.{save.player.level} · {formatPlaytime(save.playtimeSeconds)}
                </>
              ) : (
                "Empty"
              )}
            </span>
            <span style={{ display: "flex", gap: 6 }}>
              <button
                className="hba-btn"
                onClick={() => {
                  saveToSlot(slot);
                  showToast(`Saved to slot ${slot + 1}.`);
                }}
              >
                Save
              </button>
              <button
                className="hba-btn"
                disabled={!save}
                onClick={() => {
                  if (loadSlot(slot)) {
                    setMenu("none");
                    showToast(`Loaded slot ${slot + 1}.`);
                  }
                }}
              >
                Load
              </button>
            </span>
          </div>
        ))}
        <p style={{ color: "var(--hba-text-muted)", fontSize: "0.78rem", marginTop: 8 }}>
          {SAVE_SLOT_COUNT} manual slots, plus an autosave that updates at every Memory Star and
          area transition.
        </p>
        <div className="menu-close-row">
          <button className="hba-btn" onClick={() => setMenu("pause")}>
            Back (X)
          </button>
        </div>
      </div>
    </div>
  );
}
