import { useBattleStore } from "../../game/state/battleStore";
import { getEnemy } from "../../data/enemies/registry";
import { useKeyboardMenuNav } from "./useKeyboardMenuNav";

export function ActMenu() {
  const enemyId = useBattleStore((s) => s.enemyId);
  const actsUsed = useBattleStore((s) => s.actsUsed);
  const emotional = useBattleStore((s) => s.emotional);
  const performAct = useBattleStore((s) => s.performAct);
  const closeSubmenu = useBattleStore((s) => s.closeSubmenu);

  const enemy = getEnemy(enemyId);
  const usedSet = new Set(actsUsed);
  const available = enemy.acts.filter((act) => {
    if (act.oncePerBattle && usedSet.has(act.id)) return false;
    if (act.requiresPriorActs && !act.requiresPriorActs.every((id) => usedSet.has(id))) return false;
    if (act.requiresState) {
      for (const key of Object.keys(act.requiresState) as (keyof typeof emotional)[]) {
        const min = act.requiresState[key] ?? 0;
        if ((emotional[key] ?? 0) < min) return false;
      }
    }
    return true;
  });

  // "Back" is the last navigable item, index === available.length
  const selected = useKeyboardMenuNav(available.length + 1, (i) => {
    if (i === available.length) closeSubmenu();
    else performAct(available[i].id);
  });

  return (
    <div className="battle-submenu-list">
      {available.map((act, i) => (
        <button
          key={act.id}
          className={`hba-btn ${i === selected ? "selected" : ""}`}
          onClick={() => performAct(act.id)}
        >
          {act.label}
        </button>
      ))}
      <button
        className={`hba-btn battle-back-btn ${selected === available.length ? "selected" : ""}`}
        onClick={closeSubmenu}
      >
        Back
      </button>
    </div>
  );
}
