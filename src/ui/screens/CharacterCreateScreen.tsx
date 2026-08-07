import { useState } from "react";
import { useGameStore } from "../../game/state/store";
import type { Pronouns } from "../../game/save/schema";
import "./CharacterCreateScreen.css";

const HAIRSTYLES = ["Short", "Long", "Twin-tails", "Undercut"];
const UNIFORMS = ["Standard", "Casual Cardigan", "Altered Blazer"];
const COLORWAYS: { id: string; label: string; hex: string }[] = [
  { id: "crimson", label: "Crimson", hex: "#e86a92" },
  { id: "azure", label: "Azure", hex: "#5b8fe8" },
  { id: "verdant", label: "Verdant", hex: "#6fae8f" },
  { id: "violet", label: "Violet", hex: "#a878e0" },
];
const PRONOUN_OPTIONS: { id: Pronouns; label: string }[] = [
  { id: "she/her", label: "She / Her" },
  { id: "he/him", label: "He / Him" },
  { id: "they/them", label: "They / Them" },
];

export function CharacterCreateScreen() {
  const startNewGame = useGameStore((s) => s.startNewGame);
  const setPhase = useGameStore((s) => s.setPhase);
  const [name, setName] = useState("");
  const [pronouns, setPronouns] = useState<Pronouns>("they/them");
  const [hairstyle, setHairstyle] = useState(HAIRSTYLES[0]);
  const [uniformVariant, setUniformVariant] = useState(UNIFORMS[0]);
  const [colorway, setColorway] = useState(COLORWAYS[0].id);

  function confirm() {
    startNewGame({
      name: name.trim() || "Student",
      pronouns,
      appearance: { hairstyle, uniformVariant, colorway },
    });
  }

  return (
    <div className="charcreate-screen">
      <div className="charcreate-panel hba-panel">
        <h2>Who are you, before all this?</h2>

        <label className="charcreate-label">Name</label>
        <input
          className="charcreate-input"
          value={name}
          maxLength={16}
          placeholder="Type a name..."
          onChange={(e) => setName(e.target.value)}
        />

        <label className="charcreate-label">Pronouns</label>
        <div className="charcreate-chip-row">
          {PRONOUN_OPTIONS.map((p) => (
            <button
              key={p.id}
              className={`hba-btn ${pronouns === p.id ? "selected" : ""}`}
              onClick={() => setPronouns(p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>

        <label className="charcreate-label">Hairstyle</label>
        <div className="charcreate-chip-row">
          {HAIRSTYLES.map((h) => (
            <button
              key={h}
              className={`hba-btn ${hairstyle === h ? "selected" : ""}`}
              onClick={() => setHairstyle(h)}
            >
              {h}
            </button>
          ))}
        </div>

        <label className="charcreate-label">Uniform</label>
        <div className="charcreate-chip-row">
          {UNIFORMS.map((u) => (
            <button
              key={u}
              className={`hba-btn ${uniformVariant === u ? "selected" : ""}`}
              onClick={() => setUniformVariant(u)}
            >
              {u}
            </button>
          ))}
        </div>

        <label className="charcreate-label">Colorway</label>
        <div className="charcreate-chip-row">
          {COLORWAYS.map((c) => (
            <button
              key={c.id}
              className={`charcreate-swatch ${colorway === c.id ? "selected" : ""}`}
              style={{ background: c.hex }}
              title={c.label}
              onClick={() => setColorway(c.id)}
            />
          ))}
        </div>

        <div className="charcreate-actions">
          <button className="hba-btn" onClick={() => setPhase("title")}>
            Back
          </button>
          <button className="hba-btn charcreate-confirm" onClick={confirm}>
            Begin
          </button>
        </div>
      </div>
    </div>
  );
}
