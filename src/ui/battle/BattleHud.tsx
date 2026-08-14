import { useEffect, useRef } from "react";
import { useBattleStore } from "../../game/state/battleStore";
import { useGameStore } from "../../game/state/store";
import { getEffectiveMaxHp } from "../../game/state/derived";
import { getEnemy } from "../../data/enemies/registry";
import { ActMenu } from "./ActMenu";
import { ItemMenu } from "./ItemMenu";
import { FightBar } from "./FightBar";
import { useKeyboardMenuNav } from "./useKeyboardMenuNav";
import "./BattleHud.css";

export function BattleHud() {
  const phase = useGameStore((s) => s.phase);
  const enemyId = useBattleStore((s) => s.enemyId);
  const enemyHp = useBattleStore((s) => s.enemyHp);
  const turnPhase = useBattleStore((s) => s.turnPhase);
  const spareAvailable = useBattleStore((s) => s.spareAvailable);
  const bossPhaseIndex = useBattleStore((s) => s.phaseIndex);
  const log = useBattleStore((s) => s.log);
  const openAct = useBattleStore((s) => s.openAct);
  const openItem = useBattleStore((s) => s.openItem);
  const chooseFight = useBattleStore((s) => s.chooseFight);
  const performGuard = useBattleStore((s) => s.performGuard);
  const performSpare = useBattleStore((s) => s.performSpare);
  const performFlee = useBattleStore((s) => s.performFlee);
  const beginMenu = useBattleStore((s) => s.beginMenu);
  const playerHp = useGameStore((s) => s.save.player.hp);
  const playerMaxHp = useGameStore((s) => getEffectiveMaxHp(s));

  const logRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [log]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (turnPhase !== "intro") return;
      if (e.key === "z" || e.key === "Z" || e.key === "Enter") beginMenu();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [turnPhase, beginMenu]);

  const enemy = phase === "battle" && enemyId ? getEnemy(enemyId) : null;
  const canFight = true;
  const menuItems =
    turnPhase === "menu" && enemy
      ? [
          { id: "fight", label: "FIGHT", disabled: !canFight, onClick: chooseFight, extraClass: "" },
          { id: "act", label: "ACT", disabled: false, onClick: openAct, extraClass: "" },
          { id: "item", label: "ITEM", disabled: false, onClick: openItem, extraClass: "" },
          { id: "guard", label: "GUARD", disabled: false, onClick: performGuard, extraClass: "" },
          {
            id: "spare",
            label: "SPARE",
            disabled: !spareAvailable,
            onClick: performSpare,
            extraClass: `spare-btn ${spareAvailable ? "available" : ""}`,
          },
          { id: "flee", label: "FLEE", disabled: !enemy.canFlee, onClick: performFlee, extraClass: "" },
        ]
      : [];
  const selectedMenuIndex = useKeyboardMenuNav(
    menuItems.length,
    (i) => {
      const item = menuItems[i];
      if (item && !item.disabled) item.onClick();
    },
    2,
  );

  if (phase !== "battle" || !enemyId || !enemy) return null;

  const enemyFraction = Math.max(0, enemyHp / enemy.maxHp);
  const playerFraction = Math.max(0, playerHp / playerMaxHp);

  const turnPhaseLabel: Record<typeof turnPhase, string> = {
    intro: "Encounter started",
    menu: "Choosing an action",
    act: "Choosing an ACT",
    item: "Choosing an item",
    fight: "Attacking",
    dodge: "Dodge phase — incoming attack",
    ended: "Turn resolved",
  };
  const bossPhaseLabel = enemy.phases.length > 1 ? ` ${enemy.name} is in phase ${bossPhaseIndex + 1} of ${enemy.phases.length}.` : "";
  const statusAnnouncement = `${enemy.name}: ${Math.max(0, enemyHp)}/${enemy.maxHp} HP. You: ${Math.max(0, playerHp)}/${playerMaxHp} HP. ${turnPhaseLabel[turnPhase] ?? turnPhase}.${bossPhaseLabel}${spareAvailable ? " Spare is available." : ""}`;

  return (
    <div className="battle-hud">
      <div className="sr-only" role="status" aria-live="polite">
        {statusAnnouncement}
      </div>
      <div className="battle-hp-row">
        <div className="battle-hp-block">
          <div className="battle-hp-name">
            {enemy.name} — {Math.max(0, enemyHp)}/{enemy.maxHp}
          </div>
          <div className="battle-hp-bar-track">
            <div className="battle-hp-bar-fill" style={{ width: `${enemyFraction * 100}%` }} />
          </div>
        </div>
        <div className="battle-hp-block">
          <div className="battle-hp-name">
            You — {Math.max(0, playerHp)}/{playerMaxHp}
          </div>
          <div className="battle-hp-bar-track">
            <div
              className="battle-hp-bar-fill player"
              style={{ width: `${playerFraction * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="battle-lower">
        <div className="battle-log" ref={logRef}>
          {log.map((entry) => (
            <div key={entry.id} className="log-line">
              {entry.text}
            </div>
          ))}
        </div>

        <div className="battle-menu-panel">
          {turnPhase === "intro" && (
            <button className="hba-btn" onClick={beginMenu}>
              ▼ Begin (Z)
            </button>
          )}

          {turnPhase === "menu" && (
            <div className="battle-menu-grid">
              {menuItems.map((item, i) => (
                <button
                  key={item.id}
                  className={`hba-btn ${item.extraClass} ${i === selectedMenuIndex ? "selected" : ""}`}
                  disabled={item.disabled}
                  onClick={item.onClick}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}

          {turnPhase === "act" && <ActMenu />}
          {turnPhase === "item" && <ItemMenu />}
          {turnPhase === "fight" && <FightBar />}
          {turnPhase === "dodge" && (
            <p style={{ color: "var(--hba-text-muted)", textAlign: "center", marginTop: 24 }}>
              Dodge! (WASD / Arrows)
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
