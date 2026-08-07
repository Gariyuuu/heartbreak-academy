import { useEffect, useRef } from "react";
import Phaser from "phaser";
import { createPhaserGame } from "../../game/engine/PhaserGame";
import "./PhaserGameContainer.css";

export function PhaserGameContainer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;
    gameRef.current = createPhaserGame(containerRef.current);
    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return <div ref={containerRef} className="phaser-container" />;
}
