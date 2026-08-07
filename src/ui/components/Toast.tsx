import { useGameStore } from "../../game/state/store";
import "./Toast.css";

export function Toast() {
  const toast = useGameStore((s) => s.ui.toast);
  if (!toast) return null;
  return (
    <div className="toast-wrap">
      <div className="toast-bubble">{toast}</div>
    </div>
  );
}
