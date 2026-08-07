import { useState } from "react";
import { useGameStore } from "../../game/state/store";
import "./LockerPuzzle.css"; // shared .puzzle-overlay / .puzzle-flavor / .puzzle-close / .shake
import "./PoetryPuzzle.css";

const CORRECT = "wall";
const CANDIDATES = ["wall", "window", "guess", "stranger"];

export function PoetryPuzzle() {
  const puzzleId = useGameStore((s) => s.ui.puzzleId);
  const closePuzzle = useGameStore((s) => s.closePuzzle);
  const addItem = useGameStore((s) => s.addItem);
  const setFlag = useGameStore((s) => s.setFlag);
  const getFlag = useGameStore((s) => s.getFlag);
  const showToast = useGameStore((s) => s.showToast);
  const [wrongPick, setWrongPick] = useState<string | null>(null);

  const alreadySolved = Boolean(getFlag("poetry_blank_solved"));

  if (puzzleId !== "poetry_blank") return null;

  function pick(word: string) {
    if (alreadySolved) return;
    if (word === CORRECT) {
      setFlag("poetry_blank_solved", true);
      addItem("library-card", 1);
      showToast("Found: Library Card");
      setWrongPick(null);
    } else {
      setWrongPick(word);
      window.setTimeout(() => setWrongPick(null), 500);
    }
  }

  return (
    <div className="puzzle-overlay">
      <div className="poetry-panel hba-panel">
        <h3>An Open Book</h3>
        {alreadySolved ? (
          <p className="puzzle-flavor">
            The page has been read enough times that it's started to close on its own.
          </p>
        ) : (
          <>
            <p className="poetry-verse">
              The hallway holds its breath and waits,
              <br />
              for footsteps it hasn't heard yet.
              <br />
              Every door was once a{" "}
              <span className="poetry-blank">____</span>,
              <br />
              before someone believed it open.
            </p>
            <div className="poetry-choices">
              {CANDIDATES.map((word) => (
                <button
                  key={word}
                  className={`hba-btn ${wrongPick === word ? "shake" : ""}`}
                  onClick={() => pick(word)}
                >
                  {word}
                </button>
              ))}
            </div>
          </>
        )}
        <button className="hba-btn puzzle-close" onClick={closePuzzle}>
          Close
        </button>
      </div>
    </div>
  );
}
