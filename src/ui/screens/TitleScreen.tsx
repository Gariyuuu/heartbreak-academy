import { useMemo } from "react";
import { useGameStore } from "../../game/state/store";
import { saveManager } from "../../game/save/saveManager";
import "./TitleScreen.css";

export function TitleScreen() {
  const setPhase = useGameStore((s) => s.setPhase);
  const setMenu = useGameStore((s) => s.setMenu);
  const loadAutosave = useGameStore((s) => s.loadAutosave);
  const loadSlot = useGameStore((s) => s.loadSlot);
  const newGamePlusCount = useGameStore((s) => s.timeline.newGamePlusCount);

  const hasProgress = useMemo(() => {
    if (saveManager.readAutosave()) return true;
    return saveManager.listSlots().some((s) => s.save !== null);
  }, []);

  function handleContinue() {
    if (loadAutosave()) return;
    const slots = saveManager.listSlots().filter((s) => s.save !== null);
    if (slots.length === 0) return;
    slots.sort((a, b) => (b.save?.savedAt ?? 0) - (a.save?.savedAt ?? 0));
    loadSlot(slots[0].slot);
  }

  return (
    <div className="title-screen">
      <div className="title-bg" />
      <div className="title-content">
        <h1 className="title-logo">
          HEART<span className="title-slash">//</span>BREAK
          <br />
          ACADEMY
        </h1>
        <p className="title-subtitle">the halls remember more than you do</p>
        {newGamePlusCount > 0 && (
          <p className="title-ngplus">cycle {newGamePlusCount + 1}</p>
        )}

        <div className="title-menu">
          <button className="hba-btn title-btn" disabled={!hasProgress} onClick={handleContinue}>
            CONTINUE
          </button>
          <button className="hba-btn title-btn" onClick={() => setPhase("characterCreate")}>
            NEW GAME
          </button>
          <button className="hba-btn title-btn" onClick={() => setMenu("howToPlay")}>
            HOW TO PLAY
          </button>
          <button className="hba-btn title-btn" onClick={() => setMenu("extras")}>
            EXTRAS
          </button>
          <button className="hba-btn title-btn" onClick={() => setMenu("settings")}>
            SETTINGS
          </button>
        </div>
      </div>
      <div className="title-footer">HEART//BREAK ACADEMY — v0.23.0</div>
    </div>
  );
}
