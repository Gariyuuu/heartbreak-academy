import { useGameStore } from "../../game/state/store";
import { useMenuEscape } from "./useMenuEscape";
import "./PauseMenu.css";

export function PauseMenu() {
  const menuOpen = useGameStore((s) => s.ui.menuOpen);
  const setMenu = useGameStore((s) => s.setMenu);
  const setPhase = useGameStore((s) => s.setPhase);
  const player = useGameStore((s) => s.save.player);

  useMenuEscape(menuOpen === "pause", () => setMenu("none"));

  if (menuOpen !== "pause") return null;

  return (
    <div className="menu-overlay">
      <div className="menu-panel hba-panel">
        <h2>
          {player.name} — Lv.{player.level}
        </h2>
        <div className="menu-hub-grid">
          <button className="hba-btn" onClick={() => setMenu("inventory")}>
            🎒 Inventory
          </button>
          <button className="hba-btn" onClick={() => setMenu("phone")}>
            📱 Phone
          </button>
          <button className="hba-btn" onClick={() => setMenu("save")}>
            💾 Save / Load
          </button>
          <button className="hba-btn" onClick={() => setMenu("settings")}>
            ⚙️ Settings
          </button>
          <button className="hba-btn" onClick={() => setMenu("howToPlay")}>
            ❓ How to Play
          </button>
        </div>
        <div className="menu-close-row">
          <button
            className="hba-btn"
            onClick={() => {
              setMenu("none");
              setPhase("title");
            }}
          >
            Return to Title
          </button>
          <button className="hba-btn" onClick={() => setMenu("none")}>
            Resume (X)
          </button>
        </div>
      </div>
    </div>
  );
}
