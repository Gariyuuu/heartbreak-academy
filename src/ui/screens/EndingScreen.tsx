import { useEffect, useState } from "react";
import { useGameStore } from "../../game/state/store";
import { resolveEnding, type EndingDef } from "../../data/endings/registry";
import "./EndingScreen.css";

export function EndingScreen() {
  const phase = useGameStore((s) => s.phase);
  const recordEnding = useGameStore((s) => s.recordEnding);
  const setPhase = useGameStore((s) => s.setPhase);
  const startNewGamePlus = useGameStore((s) => s.startNewGamePlus);
  const route = useGameStore((s) => s.save.route);
  const [ending, setEnding] = useState<EndingDef | null>(null);

  useEffect(() => {
    if (phase !== "ending") {
      setEnding(null);
      return;
    }
    const resolved = resolveEnding(useGameStore.getState());
    setEnding(resolved);
    recordEnding(resolved.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  if (phase !== "ending" || !ending) return null;

  return (
    <div className={`ending-overlay ending-mood-${ending.mood}`}>
      <div className="ending-panel hba-panel">
        <p className="ending-eyebrow">THE AFTERCLASS REMEMBERS</p>
        <h1>{ending.title}</h1>
        {ending.paragraphs.map((p, i) => (
          <p key={i} className="ending-paragraph">
            {p}
          </p>
        ))}
        <div className="ending-stats">
          <span>Spared {route.sparedCount}</span>
          <span>Defeated {route.defeatedCount}</span>
          <span>Deaths {route.deaths}</span>
        </div>
        <div className="ending-actions">
          <button className="hba-btn" onClick={() => setPhase("title")}>
            RETURN TO TITLE
          </button>
          <button className="hba-btn" onClick={startNewGamePlus}>
            NEW GAME+
          </button>
        </div>
      </div>
    </div>
  );
}
