import { useGameStore } from "../../game/state/store";
import { getEffectiveMaxHp } from "../../game/state/derived";
import { getMap } from "../../game/maps/registry";
import "./OverworldHud.css";

export function OverworldHud() {
  const phase = useGameStore((s) => s.phase);
  const player = useGameStore((s) => s.save.player);
  const maxHp = useGameStore((s) => getEffectiveMaxHp(s));
  const dialogueOpen = useGameStore((s) => s.ui.dialogueOpen);
  const menuOpen = useGameStore((s) => s.ui.menuOpen);
  const puzzleId = useGameStore((s) => s.ui.puzzleId);

  if (phase !== "overworld") return null;
  const fraction = Math.max(0, player.hp / maxHp);

  return (
    <div className={`overworld-hud ${dialogueOpen || menuOpen !== "none" || puzzleId ? "dim" : ""}`}>
      <div className="overworld-hud-block">
        <div className="overworld-hud-name">{player.name}</div>
        <div className="overworld-hud-hpbar">
          <div className="overworld-hud-hpfill" style={{ width: `${fraction * 100}%` }} />
        </div>
        <div className="overworld-hud-hp">
          HP {player.hp}/{maxHp}
        </div>
      </div>
      <div className="overworld-hud-area">{getMap(player.mapId).name}</div>
    </div>
  );
}
