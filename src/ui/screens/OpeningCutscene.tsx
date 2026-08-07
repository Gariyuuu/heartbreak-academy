import { useEffect, useMemo, useState } from "react";
import { useGameStore } from "../../game/state/store";
import { getOpeningCutsceneLines } from "../../data/cutscenes/opening";
import "./OpeningCutscene.css";

export function OpeningCutscene() {
  const setPhase = useGameStore((s) => s.setPhase);
  const newGamePlusCount = useGameStore((s) => s.timeline.newGamePlusCount);
  const lines = useMemo(() => getOpeningCutsceneLines(newGamePlusCount), [newGamePlusCount]);
  const [index, setIndex] = useState(0);

  function advance() {
    if (index >= lines.length - 1) {
      setPhase("overworld");
    } else {
      setIndex((i) => i + 1);
    }
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "z" || e.key === "Z" || e.key === "Enter") advance();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  return (
    <div className="cutscene-screen" onClick={advance}>
      <p key={index} className="cutscene-line">
        {lines[index]}
      </p>
      <div className="cutscene-continue">▼ click / Z to continue</div>
    </div>
  );
}
