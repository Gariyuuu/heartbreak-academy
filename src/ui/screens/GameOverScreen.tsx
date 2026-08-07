import { useMemo } from "react";
import { useBattleStore } from "../../game/state/battleStore";
import { useGameStore } from "../../game/state/store";
import { getEnemy } from "../../data/enemies/registry";
import { saveManager } from "../../game/save/saveManager";
import "./GameOverScreen.css";

function pickMessage(deaths: number, enemyName: string, routeLeaning: string): string {
  if (deaths === 1) {
    return `The world doesn't end. It just... stops, briefly. ${enemyName} is still out there. You'll have to try again.`;
  }
  if (routeLeaning === "severance") {
    return "It's starting to feel less like a setback and more like a pattern. Something in the halls has noticed.";
  }
  if (deaths >= 4) {
    return "Even the walls seem tired of watching this happen. You get the distinct sense you've been here before — several times, actually.";
  }
  return "Everything fades to a soft, patient dark. It doesn't feel like punishment. It feels like waiting.";
}

export function GameOverScreen() {
  const result = useBattleStore((s) => s.result);
  const enemyId = useBattleStore((s) => s.enemyId);
  const deaths = useGameStore((s) => s.save.route.deaths);
  const routeLeaning = useGameStore((s) => s.routeLeaning());
  const setPhase = useGameStore((s) => s.setPhase);
  const loadAutosave = useGameStore((s) => s.loadAutosave);
  const healPlayer = useGameStore((s) => s.healPlayer);

  const message = useMemo(() => {
    if (result !== "defeat") return "";
    return pickMessage(deaths, getEnemy(enemyId).name, routeLeaning);
  }, [result, deaths, enemyId, routeLeaning]);

  if (result !== "defeat") return null;

  function handleContinue() {
    const hasAutosave = Boolean(saveManager.readAutosave());
    if (hasAutosave) {
      loadAutosave();
    } else {
      healPlayer(9999);
    }
    setPhase("overworld");
    // BattleScene is still the active Phaser scene; hand control back.
    window.dispatchEvent(new CustomEvent("hba:continue-after-defeat"));
  }

  function handleTitle() {
    setPhase("title");
  }

  return (
    <div className="gameover-overlay">
      <div className="gameover-panel">
        <h2>The HEART fractures.</h2>
        <p>{message}</p>
        <div className="gameover-actions">
          <button className="hba-btn" onClick={handleContinue}>
            CONTINUE
          </button>
          <button className="hba-btn" onClick={handleTitle}>
            RETURN TO TITLE
          </button>
        </div>
      </div>
    </div>
  );
}
