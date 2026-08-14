import { useEffect, useRef, useState } from "react";
import { useGameStore } from "../../game/state/store";
import { useSettingsStore, TEXT_SPEED_MS } from "../../game/state/settingsStore";
import { dialogueEngine } from "../../game/dialogue/DialogueEngine";
import { Portrait } from "./Portrait";
import "./DialogueBox.css";

export function DialogueBox() {
  const dialogueOpen = useGameStore((s) => s.ui.dialogueOpen);
  const currentLine = useGameStore((s) => s.ui.currentLine);
  const selectedChoiceIndex = useGameStore((s) => s.ui.selectedChoiceIndex);
  const textSpeed = useSettingsStore((s) => s.textSpeed);
  const revealMs = TEXT_SPEED_MS[textSpeed];
  const [revealedCount, setRevealedCount] = useState(0);
  const text = currentLine?.text ?? "";

  useEffect(() => {
    setRevealedCount(revealMs === 0 ? text.length : 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, currentLine?.speakerName]);

  useEffect(() => {
    if (!currentLine || revealedCount >= text.length || revealMs === 0) return;
    const id = window.setTimeout(() => setRevealedCount((c) => c + 1), revealMs);
    return () => window.clearTimeout(id);
  }, [revealedCount, currentLine, text.length, revealMs]);

  const setSelectedChoiceIndex = useGameStore((s) => s.setSelectedChoiceIndex);

  const revealedRef = useRef({ revealedCount, text, selectedChoiceIndex, currentLine });
  revealedRef.current = { revealedCount, text, selectedChoiceIndex, currentLine };

  const advance = () => {
    const { revealedCount, text, selectedChoiceIndex, currentLine } = revealedRef.current;
    if (!currentLine) return;
    if (revealedCount < text.length) {
      setRevealedCount(text.length);
      return;
    }
    if (currentLine.choices && currentLine.choices.length > 0) {
      dialogueEngine.advance(selectedChoiceIndex);
    } else {
      dialogueEngine.advance();
    }
  };

  // Dialogue is its own input island (same pattern as FightBar/LockerPuzzle)
  // rather than relayed through Phaser's per-frame polled key state — a
  // DOM keydown listener is event-driven and doesn't depend on the active
  // Phaser scene's update loop still being the one forwarding presses.
  useEffect(() => {
    if (!dialogueOpen) return;
    function onKey(e: KeyboardEvent) {
      const { currentLine } = revealedRef.current;
      if (e.key === "z" || e.key === "Z" || e.key === "Enter") {
        e.preventDefault();
        advance();
        return;
      }
      if (currentLine?.choices && currentLine.choices.length > 0) {
        const count = currentLine.choices.length;
        if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
          e.preventDefault();
          setSelectedChoiceIndex((selectedChoiceIndex - 1 + count) % count);
        } else if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
          e.preventDefault();
          setSelectedChoiceIndex((selectedChoiceIndex + 1) % count);
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogueOpen, selectedChoiceIndex]);

  if (!dialogueOpen || !currentLine) return null;

  const shown = text.slice(0, revealedCount);
  const doneTyping = revealedCount >= text.length;
  // Announce the full line once per line (not per typewriter character) so
  // reduced-motion/screen-reader users get the dialogue without a burst of
  // per-keystroke interruptions while the text is still revealing.
  const liveAnnouncement = currentLine.speakerName ? `${currentLine.speakerName}: ${text}` : text;

  return (
    <div className="dialogue-overlay">
      <div className="dialogue-box">
        {currentLine.speakerId && (
          <div className="dialogue-portrait">
            <Portrait characterId={currentLine.speakerId} expression={currentLine.expression} />
          </div>
        )}
        <div className="dialogue-content">
          {currentLine.speakerName && (
            <div className="dialogue-name">{currentLine.speakerName}</div>
          )}
          <div className="dialogue-text">
            {shown}
            {!doneTyping && <span className="dialogue-caret" aria-hidden="true">▌</span>}
          </div>
          <div className="sr-only" aria-live="polite">
            {doneTyping ? liveAnnouncement : ""}
          </div>
          {doneTyping && currentLine.choices && (
            <ul className="dialogue-choices" role="list">
              {currentLine.choices.map((choice, i) => (
                <li key={choice.text}>
                  <button
                    type="button"
                    className={`dialogue-choice-btn ${i === selectedChoiceIndex ? "selected" : ""}`}
                    aria-current={i === selectedChoiceIndex}
                    onClick={() => dialogueEngine.advance(i)}
                  >
                    <span className="choice-marker" aria-hidden="true">
                      {i === selectedChoiceIndex ? "▸" : ""}
                    </span>
                    {choice.text}
                  </button>
                </li>
              ))}
            </ul>
          )}
          {doneTyping && !currentLine.choices && (
            <button
              type="button"
              className="dialogue-continue"
              onClick={() => dialogueEngine.advance()}
              aria-label="Continue"
            >
              ▼
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
