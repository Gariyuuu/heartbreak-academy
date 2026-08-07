import { useGameStore } from "../../game/state/store";
import { useSettingsStore, type TextSpeed } from "../../game/state/settingsStore";
import { useMenuEscape } from "./useMenuEscape";
import "./PauseMenu.css";

export function SettingsScreen() {
  const menuOpen = useGameStore((s) => s.ui.menuOpen);
  const setMenu = useGameStore((s) => s.setMenu);
  const settings = useSettingsStore();

  useMenuEscape(menuOpen === "settings", () => setMenu("pause"));

  if (menuOpen !== "settings") return null;

  return (
    <div className="menu-overlay">
      <div className="menu-panel hba-panel">
        <h2>Settings</h2>

        <div className="menu-section-title">Audio</div>
        <div className="menu-slider-row">
          <label>Master Volume: {Math.round(settings.masterVolume * 100)}%</label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={settings.masterVolume}
            onChange={(e) => settings.setMasterVolume(Number(e.target.value))}
          />
        </div>
        <div className="menu-slider-row">
          <label>Music Volume: {Math.round(settings.musicVolume * 100)}%</label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={settings.musicVolume}
            onChange={(e) => settings.setMusicVolume(Number(e.target.value))}
          />
        </div>
        <div className="menu-slider-row">
          <label>SFX Volume: {Math.round(settings.sfxVolume * 100)}%</label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={settings.sfxVolume}
            onChange={(e) => settings.setSfxVolume(Number(e.target.value))}
          />
        </div>

        <div className="menu-section-title">Text</div>
        <div className="menu-toggle-row">
          <span>Text Speed</span>
          <select
            value={settings.textSpeed}
            onChange={(e) => settings.setTextSpeed(e.target.value as TextSpeed)}
          >
            <option value="slow">Slow</option>
            <option value="normal">Normal</option>
            <option value="fast">Fast</option>
            <option value="instant">Instant</option>
          </select>
        </div>

        <div className="menu-section-title">Accessibility</div>
        <div className="menu-toggle-row">
          <span>Screen Shake</span>
          <button className="hba-btn" onClick={settings.toggleScreenShake}>
            {settings.screenShake ? "On" : "Off"}
          </button>
        </div>
        <div className="menu-toggle-row">
          <span>Flashing Effects</span>
          <button className="hba-btn" onClick={settings.toggleFlashEffects}>
            {settings.flashEffects ? "On" : "Off"}
          </button>
        </div>
        <div className="menu-toggle-row">
          <span>Larger Battle Heart</span>
          <button className="hba-btn" onClick={settings.toggleLargeHeart}>
            {settings.largeHeart ? "On" : "Off"}
          </button>
        </div>
        <div className="menu-toggle-row">
          <span>Bullet Speed Assist</span>
          <button className="hba-btn" onClick={settings.toggleBulletSpeedAssist}>
            {settings.bulletSpeedAssist ? "On" : "Off"}
          </button>
        </div>

        <div className="menu-close-row">
          <button className="hba-btn" onClick={() => setMenu("pause")}>
            Back (X)
          </button>
        </div>
      </div>
    </div>
  );
}
