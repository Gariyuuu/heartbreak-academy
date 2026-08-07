import { useEffect } from "react";
import { useGameStore } from "./game/state/store";
import { useBattleStore } from "./game/state/battleStore";
import { getEnemy } from "./data/enemies/registry";
import { musicManager } from "./game/audio/MusicManager";
import { PhaserGameContainer } from "./ui/components/PhaserGameContainer";
import { OverworldHud } from "./ui/components/OverworldHud";
import { Toast } from "./ui/components/Toast";
import { DialogueBox } from "./ui/dialogue/DialogueBox";
import { LockerPuzzle } from "./ui/puzzle/LockerPuzzle";
import { PoetryPuzzle } from "./ui/puzzle/PoetryPuzzle";
import { BattleHud } from "./ui/battle/BattleHud";
import { PauseMenu } from "./ui/menu/PauseMenu";
import { InventoryScreen } from "./ui/menu/InventoryScreen";
import { SaveScreen } from "./ui/menu/SaveScreen";
import { SettingsScreen } from "./ui/menu/SettingsScreen";
import { PhoneScreen } from "./ui/phone/PhoneScreen";
import { TitleScreen } from "./ui/screens/TitleScreen";
import { CharacterCreateScreen } from "./ui/screens/CharacterCreateScreen";
import { OpeningCutscene } from "./ui/screens/OpeningCutscene";
import { ExtrasScreen } from "./ui/screens/ExtrasScreen";
import { GameOverScreen } from "./ui/screens/GameOverScreen";
import { EndingScreen } from "./ui/screens/EndingScreen";
import { DebugPanel } from "./ui/debug/DebugPanel";
import "./ui/theme.css";

function App() {
  const phase = useGameStore((s) => s.phase);
  const setPhase = useGameStore((s) => s.setPhase);

  useEffect(() => {
    if (phase === "boot") setPhase("title");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const battleEnemyId = useBattleStore((s) => s.enemyId);

  useEffect(() => {
    if (phase === "title" || phase === "characterCreate" || phase === "cutscene" || phase === "ending") {
      musicManager.play("title");
    } else if (phase === "overworld") {
      musicManager.play("overworld");
    } else if (phase === "battle" && battleEnemyId) {
      musicManager.play(getEnemy(battleEnemyId).isBoss ? "boss" : "battle");
    } else if (phase === "gameOver") {
      musicManager.stop();
    }
  }, [phase, battleEnemyId]);

  const gameWorldActive = phase === "overworld" || phase === "battle";

  return (
    <div className="hba-root">
      {gameWorldActive && <PhaserGameContainer />}
      {phase === "title" && <TitleScreen />}
      {phase === "characterCreate" && <CharacterCreateScreen />}
      {phase === "cutscene" && <OpeningCutscene />}
      {phase === "ending" && <EndingScreen />}

      <OverworldHud />
      <BattleHud />
      <DialogueBox />
      <LockerPuzzle />
      <PoetryPuzzle />
      <PauseMenu />
      <InventoryScreen />
      <PhoneScreen />
      <SaveScreen />
      <SettingsScreen />
      <ExtrasScreen />
      <GameOverScreen />
      <Toast />
      {import.meta.env.DEV && <DebugPanel />}

      <div className="hba-scanlines" />
    </div>
  );
}

export default App;
