import { useEffect, useRef, useState } from "react";
import { useBattleStore } from "../../game/state/battleStore";
import { useGameStore } from "../../game/state/store";
import { getEffectiveTimingWindowMs } from "../../game/state/derived";
import { getItem } from "../../data/items/registry";
import { getEnemy } from "../../data/enemies/registry";
import "./FightBar.css";

const BAR_WIDTH = 320;

export function FightBar() {
  const enemyId = useBattleStore((s) => s.enemyId);
  const performFightDamage = useBattleStore((s) => s.performFightDamage);
  const weaponId = useGameStore((s) => s.save.inventory.weaponId);
  const windowMs = useGameStore((s) => getEffectiveTimingWindowMs(s));
  const [markerX, setMarkerX] = useState(0);
  const lockedRef = useRef(false);
  const startRef = useRef(performance.now());

  const baseDamage = (weaponId ? getItem(weaponId)?.weapon?.baseDamage : undefined) ?? 4;
  const zoneWidth = Math.max(28, Math.min(140, (windowMs / 300) * 140));

  useEffect(() => {
    lockedRef.current = false;
    startRef.current = performance.now();
    let raf = 0;
    const period = 900;
    const loop = () => {
      if (lockedRef.current) return;
      const t = performance.now() - startRef.current;
      const phase = (t % period) / period;
      const triangle = phase < 0.5 ? phase * 2 : 2 - phase * 2;
      setMarkerX(triangle * BAR_WIDTH);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  function lockIn() {
    if (lockedRef.current) return;
    lockedRef.current = true;
    const center = BAR_WIDTH / 2;
    const dist = Math.abs(markerX - center);
    const halfZone = zoneWidth / 2;
    const accuracy = Math.max(0, 1 - dist / halfZone);
    const enemy = getEnemy(enemyId);
    const raw = Math.round(baseDamage * accuracy);
    const dmg = accuracy > 0 ? Math.max(1, raw - enemy.defense) : 0;
    performFightDamage(dmg);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.code === "Space" || e.key === "z" || e.key === "Z" || e.key === "Enter") {
        e.preventDefault();
        lockIn();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markerX, zoneWidth]);

  return (
    <div className="fight-bar-wrap">
      <p className="fight-bar-hint">SPACE / Z — swing when the marker crosses the bright zone</p>
      <div className="fight-bar-track" style={{ width: BAR_WIDTH }}>
        <div
          className="fight-bar-zone"
          style={{ width: zoneWidth, left: BAR_WIDTH / 2 - zoneWidth / 2 }}
        />
        <div className="fight-bar-marker" style={{ left: markerX }} />
      </div>
      <button className="hba-btn fight-bar-swing" onClick={lockIn}>
        Swing
      </button>
    </div>
  );
}
