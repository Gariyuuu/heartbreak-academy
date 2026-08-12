import { useMemo } from "react";
import { useGameStore } from "../../game/state/store";
import { saveManager } from "../../game/save/saveManager";
import "./TitleScreen.css";

const EMBER_COLORS = ["#ffe066", "#ff6ea6", "#fff6ea"];

function useEmbers(count: number) {
  return useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const duration = 9 + Math.random() * 9;
        return {
          id: i,
          left: Math.random() * 100,
          size: 2 + Math.random() * 3,
          duration,
          delay: -Math.random() * duration,
          drift: (Math.random() - 0.5) * 80,
          color: EMBER_COLORS[i % EMBER_COLORS.length],
        };
      }),
    [count],
  );
}

export function TitleScreen() {
  const setPhase = useGameStore((s) => s.setPhase);
  const setMenu = useGameStore((s) => s.setMenu);
  const loadAutosave = useGameStore((s) => s.loadAutosave);
  const loadSlot = useGameStore((s) => s.loadSlot);
  const newGamePlusCount = useGameStore((s) => s.timeline.newGamePlusCount);
  const embers = useEmbers(22);

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
      <div className="title-embers" aria-hidden="true">
        {embers.map((e) => (
          <span
            key={e.id}
            className="title-ember"
            style={
              {
                left: `${e.left}%`,
                width: `${e.size}px`,
                height: `${e.size}px`,
                background: e.color,
                color: e.color,
                animationDuration: `${e.duration}s`,
                animationDelay: `${e.delay}s`,
                "--drift": `${e.drift}px`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
      <div className="title-vignette" aria-hidden="true" />
      <div className="hba-scanlines" />

      <div className="title-content">
        <h1 className="title-logo">
          HEART<span className="title-slash">//</span>BREAK
          <br />
          ACADEMY
        </h1>

        <div className="title-divider" aria-hidden="true">
          <span className="title-divider-line" />
          <span className="title-divider-dot" />
          <span className="title-divider-line" />
        </div>

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
      <div className="title-footer">HEART//BREAK ACADEMY — v0.25.0</div>
    </div>
  );
}
