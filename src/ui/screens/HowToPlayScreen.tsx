import { useGameStore } from "../../game/state/store";
import { useMenuEscape } from "../menu/useMenuEscape";
import "../menu/PauseMenu.css";
import "./HowToPlayScreen.css";

export function HowToPlayScreen() {
  const menuOpen = useGameStore((s) => s.ui.menuOpen);
  const setMenu = useGameStore((s) => s.setMenu);

  useMenuEscape(menuOpen === "howToPlay", () => setMenu("none"));

  if (menuOpen !== "howToPlay") return null;

  return (
    <div className="menu-overlay">
      <div className="menu-panel hba-panel howtoplay-panel">
        <h2>How to Play</h2>

        <section className="howtoplay-section">
          <h3>Getting Around</h3>
          <p>
            <strong>WASD / Arrow Keys</strong> move. Hold <strong>Shift</strong> to run.
            Walk up to a person or object until a hint appears, then press{" "}
            <strong>Z / Enter</strong> to interact or advance dialogue. <strong>X / Escape</strong>{" "}
            opens the pause menu (from the overworld <em>or</em> mid-battle).
          </p>
          <p>
            Glowing star-shaped tiles are <strong>Memory Stars</strong> — step on one to fully heal
            and save your game. There's no penalty for using one often.
          </p>
        </section>

        <section className="howtoplay-section">
          <h3>If You're Not Sure Where to Go</h3>
          <p>
            Open the pause menu → <strong>📱 Phone</strong> → the <strong>Quests</strong> tab. It
            lists everything currently active, in plain language, and updates as you find things.
            When in doubt, walk through a door you haven't been through yet — every region connects
            to at least one more.
          </p>
        </section>

        <section className="howtoplay-section">
          <h3>Battles</h3>
          <p>
            An encounter opens on a menu with six options. None of them are "wrong" — FIGHT and
            SPARE are both real, valid ways to end a fight, they just lead to different outcomes.
          </p>
          <ul className="howtoplay-list">
            <li>
              <strong>FIGHT</strong> — a marker slides across a bar; press{" "}
              <strong>Z / Space</strong> when it's near the center for damage. Closer to center =
              more damage.
            </li>
            <li>
              <strong>ACT</strong> — talk instead of attack. Each option shifts the enemy's mood
              (trust, fear, confidence...). This is the only way to unlock SPARE — it doesn't
              happen automatically or from waiting.
            </li>
            <li>
              <strong>ITEM</strong> — use a consumable from your inventory (mid-battle only).
            </li>
            <li>
              <strong>GUARD</strong> — brace for the enemy's next attack and take less damage.
              Useful if you need a turn to think without ACT options ready yet.
            </li>
            <li>
              <strong>SPARE</strong> — ends the fight peacefully. Grayed out until the enemy's mood
              (from ACT choices) crosses whatever threshold that specific enemy needs — check the
              Bestiary in Extras for ones you've already met.
            </li>
            <li>
              <strong>FLEE</strong> — escape the fight entirely. Not every enemy can be fled from.
            </li>
          </ul>
          <p>
            After a menu choice, most turns move into a <strong>dodge phase</strong>: move the
            HEART with WASD / arrow keys to avoid incoming shapes. Getting hit costs HP and a brief
            invulnerability window, not an instant loss — a few hits early on is normal, not a sign
            you're doing something wrong.
          </p>
          <p>
            If a fight is going badly, GUARD or FLEE cost nothing to try, and a Memory Star fully
            heals for free — there's rarely a reason to push through a fight at low HP instead of
            backtracking to save first.
          </p>
        </section>

        <section className="howtoplay-section">
          <h3>The Bigger Picture</h3>
          <p>
            The game quietly tracks how often you spare versus defeat enemies, and that shapes how
            people talk to you and how the story ends — there's no single "correct" route. Settings
            (pause menu → ⚙️ Settings) has real accessibility options if bullet-dodging isn't
            comfortable: a slower bullet speed, a larger HEART hitbox, and adjustable text speed are
            all genuinely wired, not decorative.
          </p>
        </section>

        <div className="menu-close-row">
          <button className="hba-btn" onClick={() => setMenu("none")}>
            Back (X)
          </button>
        </div>
      </div>
    </div>
  );
}
