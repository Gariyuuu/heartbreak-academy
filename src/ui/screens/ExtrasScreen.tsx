import { useEffect, useRef, useState } from "react";
import { useGameStore } from "../../game/state/store";
import { useMenuEscape } from "../menu/useMenuEscape";
import { ENEMY_REGISTRY } from "../../data/enemies/registry";
import { ACHIEVEMENTS } from "../../data/achievements/registry";
import { ENDINGS } from "../../data/endings/registry";
import { musicManager, MUSIC_TRACK_LABELS } from "../../game/audio/MusicManager";
import "../menu/PauseMenu.css";
import "./ExtrasScreen.css";

type Tab = "bestiary" | "achievements" | "endings" | "music";

export function ExtrasScreen() {
  const menuOpen = useGameStore((s) => s.ui.menuOpen);
  const setMenu = useGameStore((s) => s.setMenu);
  const save = useGameStore((s) => s.save);
  const endingsReached = useGameStore((s) => s.timeline.endingsReached);
  const [tab, setTab] = useState<Tab>("bestiary");
  const [previewing, setPreviewing] = useState<string | null>(null);
  const previousTrackRef = useRef<string | null>(null);

  useMenuEscape(menuOpen === "extras", () => setMenu("none"));

  useEffect(() => {
    const activelyPreviewing = menuOpen === "extras" && tab === "music";
    if (activelyPreviewing) {
      if (previousTrackRef.current === null) {
        previousTrackRef.current = musicManager.getCurrentTrackId();
      }
    } else if (previousTrackRef.current !== null) {
      musicManager.play(previousTrackRef.current);
      previousTrackRef.current = null;
      setPreviewing(null);
    }
  }, [tab, menuOpen]);

  if (menuOpen !== "extras") return null;

  const unlockedAchievements = ACHIEVEMENTS.filter((a) => a.isUnlocked(save));

  return (
    <div className="menu-overlay">
      <div className="menu-panel hba-panel">
        <h2>Extras</h2>
        <div className="phone-tabs" style={{ marginBottom: 14 }}>
          <button className={tab === "bestiary" ? "active" : ""} onClick={() => setTab("bestiary")}>
            Bestiary
          </button>
          <button
            className={tab === "achievements" ? "active" : ""}
            onClick={() => setTab("achievements")}
          >
            Achievements ({unlockedAchievements.length}/{ACHIEVEMENTS.length})
          </button>
          <button className={tab === "endings" ? "active" : ""} onClick={() => setTab("endings")}>
            Endings ({endingsReached.length}/{ENDINGS.length})
          </button>
          <button className={tab === "music" ? "active" : ""} onClick={() => setTab("music")}>
            Music
          </button>
        </div>

        {tab === "bestiary" && (
          <ul className="extras-list">
            {Object.values(ENEMY_REGISTRY).map((enemy) => {
              const seen = Boolean(save.flags[`seen_enemy_${enemy.id}`]);
              return (
                <li key={enemy.id}>
                  <strong>{seen ? enemy.name : "???"}</strong>
                  {seen ? (
                    <>
                      <span className="extras-sub">{enemy.title}</span>
                      <p>ACT options: {enemy.acts.map((a) => a.label).join(", ")}</p>
                    </>
                  ) : (
                    <span className="extras-sub">Not yet encountered.</span>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        {tab === "achievements" && (
          <ul className="extras-list">
            {ACHIEVEMENTS.map((a) => {
              const unlocked = a.isUnlocked(save);
              return (
                <li key={a.id} className={unlocked ? "unlocked" : ""}>
                  <strong>{unlocked || !a.secret ? a.title : "???"}</strong>
                  <span className="extras-sub">
                    {unlocked ? a.description : a.secret ? "Secret achievement." : a.description}
                  </span>
                </li>
              );
            })}
          </ul>
        )}

        {tab === "endings" && (
          <ul className="extras-list">
            {ENDINGS.map((ending) => {
              const reached = endingsReached.includes(ending.id);
              return (
                <li key={ending.id} className={reached ? "unlocked" : ""}>
                  <strong>{reached ? ending.title : "???"}</strong>
                  <span className="extras-sub">
                    {reached ? ending.paragraphs[0] : "Not yet reached."}
                  </span>
                </li>
              );
            })}
          </ul>
        )}

        {tab === "music" && (
          <ul className="extras-list">
            {Object.entries(MUSIC_TRACK_LABELS).map(([id, label]) => (
              <li key={id} className={previewing === id ? "unlocked" : ""}>
                <strong>{label}</strong>
                <span className="extras-sub">{previewing === id ? "Now playing." : "Not currently playing."}</span>
                <div className="menu-close-row" style={{ marginTop: 6 }}>
                  <button
                    className="hba-btn"
                    onClick={() => {
                      musicManager.play(id);
                      setPreviewing(id);
                    }}
                  >
                    {previewing === id ? "Playing" : "Play"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="menu-close-row">
          <button className="hba-btn" onClick={() => setMenu("none")}>
            Back (X)
          </button>
        </div>
      </div>
    </div>
  );
}
