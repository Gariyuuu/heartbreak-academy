import { useEffect, useState } from "react";
import { useGameStore } from "../../game/state/store";
import "./LockerPuzzle.css";

const CODE = "417";

export function LockerPuzzle() {
  const puzzleId = useGameStore((s) => s.ui.puzzleId);
  const closePuzzle = useGameStore((s) => s.closePuzzle);
  const addItem = useGameStore((s) => s.addItem);
  const setFlag = useGameStore((s) => s.setFlag);
  const getFlag = useGameStore((s) => s.getFlag);
  const showToast = useGameStore((s) => s.showToast);
  const [entry, setEntry] = useState("");
  const [shake, setShake] = useState(false);

  const alreadySolved = Boolean(getFlag("locker_108_opened"));

  useEffect(() => {
    setEntry("");
    setShake(false);
  }, [puzzleId]);

  if (puzzleId !== "locker_108") return null;

  function press(digit: string) {
    if (alreadySolved) return;
    const next = (entry + digit).slice(0, 3);
    setEntry(next);
    if (next.length === 3) {
      if (next === CODE) {
        setFlag("locker_108_opened", true);
        addItem("lucky-hairclip", 1);
        showToast("Found: Lucky Hairclip");
      } else {
        setShake(true);
        window.setTimeout(() => {
          setShake(false);
          setEntry("");
        }, 380);
      }
    }
  }

  return (
    <div className="puzzle-overlay">
      <div className={`puzzle-panel hba-panel ${shake ? "shake" : ""}`}>
        <h3>Locker 108</h3>
        {alreadySolved ? (
          <p className="puzzle-flavor">
            Empty now, save for a faint impression of where something used to sit.
          </p>
        ) : (
          <>
            <p className="puzzle-flavor">A three-digit combination lock. Something about "4-1-7" nags at you.</p>
            <div className="puzzle-display">
              {[0, 1, 2].map((i) => (
                <span key={i} className="puzzle-digit">
                  {entry[i] ?? "_"}
                </span>
              ))}
            </div>
            <div className="puzzle-keypad">
              {"0123456789".split("").map((d) => (
                <button key={d} className="hba-btn" onClick={() => press(d)}>
                  {d}
                </button>
              ))}
              <button className="hba-btn" onClick={() => setEntry("")}>
                Clear
              </button>
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
