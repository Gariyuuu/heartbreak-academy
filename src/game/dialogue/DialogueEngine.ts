import { useGameStore, type ActiveDialogueLine } from "../state/store";
import type { DialogueTreeDef } from "./types";
import { getCharacterName } from "../../data/characters/registry";

class DialogueEngine {
  private tree: DialogueTreeDef | null = null;
  private currentNodeId: string | null = null;

  isActive(): boolean {
    return this.tree !== null;
  }

  start(tree: DialogueTreeDef) {
    this.tree = tree;
    const store = useGameStore.getState();
    this.currentNodeId = tree.pickStart(store);
    this.renderCurrentNode();
  }

  /** Advance past a plain line, or select a choice by index. */
  advance(choiceIndex?: number) {
    if (!this.tree || !this.currentNodeId) return;
    const store = useGameStore.getState();
    const node = this.tree.nodes[this.currentNodeId];
    if (!node) {
      this.end();
      return;
    }

    let nextId: string | null | undefined;
    if (node.choices && node.choices.length > 0) {
      const visible = node.choices.filter((c) => !c.condition || c.condition(store));
      const chosen = visible[choiceIndex ?? 0];
      if (!chosen) {
        this.end();
        return;
      }
      chosen.onSelect?.(store);
      nextId = chosen.next;
    } else {
      nextId = node.next ?? null;
    }

    if (!nextId) {
      this.end();
      return;
    }
    this.currentNodeId = nextId;
    this.renderCurrentNode();
  }

  private renderCurrentNode() {
    if (!this.tree || !this.currentNodeId) return;
    const store = useGameStore.getState();
    let node = this.tree.nodes[this.currentNodeId];
    if (!node) {
      this.end();
      return;
    }

    if (node.condition && !node.condition(store)) {
      if (node.fallback) {
        this.currentNodeId = node.fallback;
        node = this.tree.nodes[this.currentNodeId];
      } else {
        this.end();
        return;
      }
    }

    node.onEnter?.(store);

    const text = typeof node.text === "function" ? node.text(store) : node.text;
    const speakerName = node.speakerNameOverride ?? getCharacterName(node.speakerId);
    const visibleChoices = node.choices
      ?.filter((c) => !c.condition || c.condition(useGameStore.getState()))
      .map((c) => ({ text: c.text, next: c.next })) ?? null;

    const line: ActiveDialogueLine = {
      speakerId: node.speakerId,
      speakerName,
      expression: node.expression,
      text,
      choices: visibleChoices && visibleChoices.length > 0 ? visibleChoices : null,
    };
    useGameStore.getState().openDialogue(line);
  }

  private end() {
    this.tree = null;
    this.currentNodeId = null;
    useGameStore.getState().closeDialogue();
  }
}

export const dialogueEngine = new DialogueEngine();
