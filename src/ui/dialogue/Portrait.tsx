import { CHARACTERS } from "../../data/characters/registry";
import type { Expression } from "../../game/dialogue/types";

interface Props {
  characterId: string | null;
  expression: Expression;
  size?: number;
}

// Placeholder portrait pipeline: SVG geometry keyed by characterId (palette
// + silhouette) and expression (eyes/mouth path). Swappable 1:1 for real
// art later without touching dialogue logic — see DEVELOPMENT_PLAN.md.
const EYES: Record<Expression, string> = {
  neutral: "M -10 -2 h 6 M 4 -2 h 6",
  happy: "M -12 -2 q 6 -6 12 0 M 2 -2 q 6 -6 12 0",
  laughing: "M -12 -2 q 6 -6 12 0 M 2 -2 q 6 -6 12 0",
  angry: "M -10 -5 l 6 4 M 4 -1 l 6 -4",
  sad: "M -10 0 q 6 -6 12 -1 M 2 -1 q 6 -5 12 1",
  embarrassed: "M -10 -2 h 6 M 4 -2 h 6",
  shocked: "M -7 -2 a 3 3 0 1 0 0.1 0 M 7 -2 a 3 3 0 1 0 0.1 0",
  afraid: "M -7 -2 a 2.4 2.4 0 1 0 0.1 0 M 7 -2 a 2.4 2.4 0 1 0 0.1 0",
  determined: "M -10 -4 l 6 3 M 4 -1 l 6 -3",
  glitch: "M -10 2 h 6 M 4 -6 h 6",
};

const MOUTHS: Record<Expression, string> = {
  neutral: "M -6 10 h 12",
  happy: "M -8 8 q 8 8 16 0",
  laughing: "M -9 7 q 9 10 18 0 z",
  angry: "M -7 12 q 7 -6 14 0",
  sad: "M -8 12 q 8 -6 16 0",
  embarrassed: "M -5 10 q 5 4 10 0",
  shocked: "M -3 9 a 3 4 0 1 0 6 0 a 3 4 0 1 0 -6 0",
  afraid: "M -5 11 q 5 -2 10 0",
  determined: "M -7 10 h 14",
  glitch: "M -8 11 h 7 M 1 8 h 7",
};

export function Portrait({ characterId, expression, size = 96 }: Props) {
  if (!characterId) return null;
  const def = CHARACTERS[characterId];
  const body = def?.colorway.body ?? "#8888aa";
  const accent = def?.colorway.accent ?? "#eeeeee";

  return (
    <svg
      width={size}
      height={size}
      viewBox="-40 -40 80 80"
      role="img"
      aria-label={def?.name ?? characterId}
      style={{ display: "block", filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.35))" }}
    >
      <circle cx={0} cy={0} r={34} fill={body} />
      <circle cx={0} cy={0} r={34} fill="none" stroke={accent} strokeWidth={3} opacity={0.6} />
      <g stroke={accent} strokeWidth={2.5} fill="none" strokeLinecap="round">
        <path d={EYES[expression]} />
        <path d={MOUTHS[expression]} fill={expression === "laughing" ? accent : "none"} />
      </g>
    </svg>
  );
}
