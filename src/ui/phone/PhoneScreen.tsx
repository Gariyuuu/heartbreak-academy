import { useState } from "react";
import { useGameStore } from "../../game/state/store";
import { useMenuEscape } from "../menu/useMenuEscape";
import { CONTACTS, MESSAGES } from "../../data/phone/messages";
import { CHARACTERS } from "../../data/characters/registry";
import { QUESTS } from "../../data/quests/registry";
import "./PhoneScreen.css";

type Tab = "contacts" | "quests" | "profiles";

export function PhoneScreen() {
  const menuOpen = useGameStore((s) => s.ui.menuOpen);
  const setMenu = useGameStore((s) => s.setMenu);
  const store = useGameStore();
  const [tab, setTab] = useState<Tab>("contacts");
  const [activeContact, setActiveContact] = useState<string | null>(null);

  useMenuEscape(menuOpen === "phone", () => setMenu("pause"));

  if (menuOpen !== "phone") return null;

  const visibleContacts = CONTACTS.filter((c) => c.condition(store));
  const threadMessages = activeContact
    ? MESSAGES.filter((m) => m.contactId === activeContact && m.condition(store))
    : [];

  return (
    <div className="menu-overlay">
      <div className="phone-shell">
        <div className="phone-notch" />
        <div className="phone-tabs">
          <button className={tab === "contacts" ? "active" : ""} onClick={() => setTab("contacts")}>
            Messages
          </button>
          <button className={tab === "quests" ? "active" : ""} onClick={() => setTab("quests")}>
            Quests
          </button>
          <button className={tab === "profiles" ? "active" : ""} onClick={() => setTab("profiles")}>
            Profiles
          </button>
        </div>

        <div className="phone-body">
          {tab === "contacts" && !activeContact && (
            <ul className="phone-contact-list">
              {visibleContacts.length === 0 && <p className="phone-empty">No messages yet.</p>}
              {visibleContacts.map((c) => (
                <li key={c.id} onClick={() => setActiveContact(c.id)}>
                  <strong>{c.name}</strong>
                  <span>{c.subtitle}</span>
                </li>
              ))}
            </ul>
          )}

          {tab === "contacts" && activeContact && (
            <div className="phone-thread">
              <button className="phone-back" onClick={() => setActiveContact(null)}>
                ‹ Back
              </button>
              {threadMessages.map((m) => (
                <div key={m.id} className="phone-bubble">
                  <div className="phone-bubble-from">{m.from}</div>
                  {m.text}
                </div>
              ))}
              {threadMessages.length === 0 && <p className="phone-empty">Nothing yet.</p>}
            </div>
          )}

          {tab === "quests" && (
            <ul className="phone-quest-list">
              {QUESTS.filter((q) => q.isActive(store.save.flags)).map((q) => {
                const complete = q.isComplete(store.save.flags);
                return (
                  <li key={q.id} className={complete ? "complete" : ""}>
                    <strong>
                      {complete ? "✓ " : ""}
                      {q.title}
                    </strong>
                    <p>{q.description}</p>
                  </li>
                );
              })}
            </ul>
          )}

          {tab === "profiles" && (
            <ul className="phone-profile-list">
              {Object.values(CHARACTERS)
                .filter((c) => {
                  if (c.id === "akari") return Boolean(store.save.flags["met_akari"]);
                  if (c.id === "mika") return Boolean(store.save.flags["met_mika"]);
                  if (c.id === "sleepy_upperclassman") return Boolean(store.save.flags["met_towa"]);
                  if (c.id === "yuna") return Boolean(store.save.flags["met_yuna"]);
                  if (c.id === "sora") return Boolean(store.save.flags["met_sora"]);
                  if (c.id === "nana") return Boolean(store.save.flags["met_nana"]);
                  if (c.id === "reina") return Boolean(store.save.flags["met_reina"]);
                  return false;
                })
                .map((c) => (
                  <li key={c.id}>
                    <strong style={{ color: c.colorway.body }}>{c.name}</strong>
                    <span className="phone-profile-title">{c.title}</span>
                    <p>{c.bio}</p>
                  </li>
                ))}
            </ul>
          )}
        </div>

        <button className="hba-btn phone-close" onClick={() => setMenu("pause")}>
          Close (X)
        </button>
      </div>
    </div>
  );
}
