import { useEffect, useState } from "react";

// The battle menus (top-level grid, ACT list, ITEM list) were mouse-only —
// buttons with onClick and nothing else, unlike DialogueBox's deliberate
// arrow-key + Z/Enter input island. Native Tab-focus technically reached
// them, but nothing matched the convention the rest of combat (movement,
// dodging, FIGHT timing) already uses. Same pattern as DialogueBox: W/S
// (or arrow keys) cycle, Z/Enter confirms whatever's currently selected.
// `columns` > 1 enables 2D grid navigation (A/D or left/right move by one,
// W/S or up/down move by a full row) for the top-level 2-column menu.
export function useKeyboardMenuNav(itemCount: number, onConfirm: (index: number) => void, columns = 1) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    setSelectedIndex((i) => Math.min(i, Math.max(0, itemCount - 1)));
  }, [itemCount]);

  useEffect(() => {
    if (itemCount === 0) return;
    function onKey(e: KeyboardEvent) {
      const isUp = e.key === "ArrowUp" || e.key === "w" || e.key === "W";
      const isDown = e.key === "ArrowDown" || e.key === "s" || e.key === "S";
      const isLeft = e.key === "ArrowLeft" || e.key === "a" || e.key === "A";
      const isRight = e.key === "ArrowRight" || e.key === "d" || e.key === "D";
      const isConfirm = e.key === "z" || e.key === "Z" || e.key === "Enter";

      if (isConfirm) {
        e.preventDefault();
        onConfirm(selectedIndex);
        return;
      }
      if (columns > 1) {
        if (isUp) {
          e.preventDefault();
          setSelectedIndex((i) => (i - columns + itemCount) % itemCount);
        } else if (isDown) {
          e.preventDefault();
          setSelectedIndex((i) => (i + columns) % itemCount);
        } else if (isLeft) {
          e.preventDefault();
          setSelectedIndex((i) => (i - 1 + itemCount) % itemCount);
        } else if (isRight) {
          e.preventDefault();
          setSelectedIndex((i) => (i + 1) % itemCount);
        }
      } else if (isUp) {
        e.preventDefault();
        setSelectedIndex((i) => (i - 1 + itemCount) % itemCount);
      } else if (isDown) {
        e.preventDefault();
        setSelectedIndex((i) => (i + 1) % itemCount);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [itemCount, selectedIndex, onConfirm, columns]);

  return selectedIndex;
}
