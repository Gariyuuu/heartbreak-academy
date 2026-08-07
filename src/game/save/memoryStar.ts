import { useGameStore } from "../state/store";
import { dialogueEngine } from "../dialogue/DialogueEngine";
import type { DialogueTreeDef } from "../dialogue/types";

const REFLECTIONS = [
  "The distant sound of the gaming club arguing over a high score fills you with resolve.",
  "You remember, for no particular reason, the exact smell of your old classroom. It's already fading.",
  "Somewhere above you, chalk squeaks against a board no one is standing in front of.",
  "For a moment the hallway holds still, like it's listening to see if you noticed.",
  "You feel steadier. Not safe, necessarily. Just steadier.",
];

function pickReflection(deaths: number): string {
  if (deaths > 2) {
    return "The star flickers before it settles, like it's double-checking you're the same person who left last time.";
  }
  return REFLECTIONS[Math.floor(Math.random() * REFLECTIONS.length)];
}

export function activateMemoryStar(mapName: string) {
  const store = useGameStore.getState();
  const reflection = pickReflection(store.save.route.deaths);

  const tree: DialogueTreeDef = {
    id: "memory_star",
    pickStart: () => "line",
    nodes: {
      line: {
        id: "line",
        speakerId: null,
        expression: "neutral",
        text: `[ MEMORY STAR — ${mapName} ]\n${reflection}`,
        next: null,
        onEnter: (s) => {
          s.healPlayer(9999); // healPlayer clamps to effective max HP (base + accessory bonus)
          s.saveToSlot(s.activeSlot);
          s.showToast("Game saved.");
        },
      },
    },
  };

  dialogueEngine.start(tree);
}
