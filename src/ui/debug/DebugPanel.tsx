import { useEffect, useState } from "react";
import { debugApi } from "../../game/debug/debugApi";
import { useGameStore } from "../../game/state/store";
import "./DebugPanel.css";

/** Dev-only debug menu (design doc §42). Never rendered in production. */
export function DebugPanel() {
  const [open, setOpen] = useState(false);
  const phase = useGameStore((s) => s.phase);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "F1") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!open) return null;

  return (
    <div className="debug-panel">
      <div className="debug-panel-title">DEBUG (F1) — phase: {phase}</div>
      <div className="debug-panel-grid">
        <button onClick={() => debugApi.teleportToTile(18, 3)}>Teleport → Akari</button>
        <button onClick={() => debugApi.teleportToTile(21, 12)}>Teleport → Mika</button>
        <button onClick={() => debugApi.teleportToTile(12, 10)}>Teleport → Save Point</button>
        <button onClick={() => debugApi.teleportToTile(2, 8)}>Teleport → Locker</button>
        <button onClick={() => debugApi.teleportToMap("literatureWing", 19, 15)}>
          Teleport → Yuna
        </button>
        <button onClick={() => debugApi.teleportToMap("literatureWing", 12, 9)}>
          Teleport → Poem
        </button>
        <button onClick={() => debugApi.teleportToMap("courtyard", 12, 1)}>
          Teleport → Courtyard
        </button>
        <button onClick={() => debugApi.teleportToMap("scienceBuilding", 9, 10)}>
          Teleport → Sora
        </button>
        <button onClick={() => debugApi.teleportToMap("dormitory", 8, 8)}>
          Teleport → Nana
        </button>
        <button onClick={() => debugApi.teleportToMap("gamingClub", 6, 6)}>
          Teleport → Mika (Club)
        </button>
        <button onClick={() => debugApi.teleportToMap("theaterWing", 12, 3)}>
          Teleport → Reina
        </button>
        <button onClick={() => debugApi.teleportToMap("rooftopGardens", 9, 4)}>
          Teleport → Kaede
        </button>
        <button onClick={() => debugApi.teleportToMap("studentCouncilTower", 6, 3)}>
          Teleport → Akari (Tower)
        </button>
        <button onClick={() => debugApi.teleportToMap("undergroundMaintenance", 8, 1)}>
          Teleport → Maintenance
        </button>
        <button onClick={() => debugApi.teleportToMap("abandonedClassroomBlock", 10, 1)}>
          Teleport → Classrooms
        </button>
        <button onClick={() => debugApi.teleportToMap("mirrorHall", 9, 1)}>
          Teleport → Mirror Hall
        </button>
        <button onClick={() => debugApi.teleportToMap("nullWing", 6, 4)}>
          Teleport → Null Wing
        </button>
        <button onClick={() => debugApi.teleportToMap("festivalGrounds", 8, 3)}>
          Teleport → Festival Grounds
        </button>
        <button onClick={() => debugApi.teleportToMap("infiniteLibrary", 12, 14)}>
          Teleport → Infinite Library
        </button>
        <button onClick={() => debugApi.setHp(999)}>Full Heal</button>
        <button onClick={() => debugApi.giveItem("lucky-hairclip", 1)}>Give Hairclip</button>
        <button onClick={() => debugApi.setFlag("mika_challenge_unlocked", true)}>
          Unlock Mika Challenge
        </button>
        <button onClick={() => debugApi.setFlag("reina_stage_unlocked", true)}>
          Unlock Reina Stage
        </button>
        <button onClick={() => debugApi.setFlag("akari_confrontation_unlocked", true)}>
          Unlock Akari Confrontation
        </button>
        <button onClick={() => debugApi.triggerEncounter("stray_thought")}>
          Fight: Stray Thought
        </button>
        <button onClick={() => debugApi.triggerEncounter("mika_boss")}>Fight: Mika Boss</button>
        <button onClick={() => debugApi.triggerEncounter("runaway_metaphor")}>
          Fight: Runaway Metaphor
        </button>
        <button onClick={() => debugApi.triggerEncounter("stray_equation")}>
          Fight: Stray Equation
        </button>
        <button onClick={() => debugApi.triggerEncounter("glitch_sprite")}>
          Fight: Glitch Sprite
        </button>
        <button onClick={() => debugApi.triggerEncounter("reina_boss")}>Fight: Reina Boss</button>
        <button onClick={() => debugApi.triggerEncounter("akari_boss")}>Fight: Akari Boss</button>
        <button onClick={() => debugApi.triggerEncounter("flicker")}>Fight: Flicker</button>
        <button onClick={() => debugApi.triggerEncounter("reflection")}>Fight: Reflection</button>
        <button onClick={() => debugApi.resetSave()}>Reset Save (reload)</button>
      </div>
    </div>
  );
}
