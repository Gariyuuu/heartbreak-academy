import type { GameStore } from "../../game/state/store";

export interface PhoneMessageDef {
  id: string;
  contactId: string;
  from: string;
  text: string;
  condition: (store: GameStore) => boolean;
}

export interface ContactDef {
  id: string;
  name: string;
  subtitle: string;
  condition: (store: GameStore) => boolean;
}

export const CONTACTS: ContactDef[] = [
  {
    id: "akari",
    name: "Akari Hoshino",
    subtitle: "Student Council President",
    condition: (s) => Boolean(s.save.flags["met_akari"]),
  },
  {
    id: "mika",
    name: "Mika Amemiya",
    subtitle: "Gaming Club",
    condition: (s) => Boolean(s.save.flags["met_mika"]),
  },
  {
    id: "yuna",
    name: "Yuna Kurosawa",
    subtitle: "Literature Club",
    condition: (s) => Boolean(s.save.flags["met_yuna"]),
  },
  {
    id: "sora",
    name: "Sora Minase",
    subtitle: "Science Club",
    condition: (s) => Boolean(s.save.flags["met_sora"]),
  },
  {
    id: "nana",
    name: "Nana Fujimori",
    subtitle: "Art Student",
    condition: (s) => Boolean(s.save.flags["met_nana"]),
  },
  {
    id: "reina",
    name: "Reina Tsukishiro",
    subtitle: "Drama Club",
    condition: (s) => Boolean(s.save.flags["met_reina"]),
  },
  {
    id: "unknown",
    name: "???",
    subtitle: "Unknown Number",
    condition: (s) => s.save.route.deaths > 0,
  },
];

export const MESSAGES: PhoneMessageDef[] = [
  {
    id: "akari_welcome",
    contactId: "akari",
    from: "Akari Hoshino",
    text: "This is my number in case anything happens. Try not to need it.",
    condition: (s) => Boolean(s.save.flags["met_akari"]),
  },
  {
    id: "mika_hype",
    contactId: "mika",
    from: "Mika Amemiya",
    text: "yo!! cabinet's free whenever. don't chicken out on me lol",
    condition: (s) => Boolean(s.save.flags["mika_challenge_unlocked"]) && !s.save.flags["mika_challenge_resolved"],
  },
  {
    id: "mika_post_spare",
    contactId: "mika",
    from: "Mika Amemiya",
    text: "ok that was genuinely one of the best matches i've had. rematch someday? no pressure",
    condition: (s) =>
      Boolean(s.save.flags["mika_challenge_resolved"]) && s.save.route.sparedCount > 0,
  },
  {
    id: "mika_post_fight",
    contactId: "mika",
    from: "Mika Amemiya",
    text: "still can't believe you beat GALAXY RIVAL. I'm putting your initials on the cabinet, don't argue.",
    condition: (s) =>
      Boolean(s.save.flags["mika_challenge_resolved"]) && s.save.route.defeatedCount > 0,
  },
  {
    id: "yuna_welcome",
    contactId: "yuna",
    from: "Yuna Kurosawa",
    text: "i don't usually give this number out. mostly because i already know if someone's going to text me or not. you will, eventually.",
    condition: (s) => Boolean(s.save.flags["met_yuna"]),
  },
  {
    id: "yuna_poetry",
    contactId: "yuna",
    from: "Yuna Kurosawa",
    text: "found the right word yet? no rush. it's been waiting longer than you have.",
    condition: (s) => Boolean(s.save.flags["met_yuna"]) && !s.save.flags["poetry_blank_solved"],
  },
  {
    id: "yuna_poetry_solved",
    contactId: "yuna",
    from: "Yuna Kurosawa",
    text: "wall. i knew you'd get there. i'm a little unsettled by how sure I was.",
    condition: (s) => Boolean(s.save.flags["poetry_blank_solved"]),
  },
  {
    id: "sora_welcome",
    contactId: "sora",
    from: "Sora Minase",
    text: "hi!! I got your number off the roster, hope that's ok. anyway if your gear ever glitches out come find me. purely for science.",
    condition: (s) => Boolean(s.save.flags["met_sora"]),
  },
  {
    id: "nana_welcome",
    contactId: "nana",
    from: "Nana Fujimori",
    text: "thank you for asking about the paintings instead of just looking. that doesn't happen a lot.",
    condition: (s) => Boolean(s.save.flags["met_nana"]),
  },
  {
    id: "reina_welcome",
    contactId: "reina",
    from: "Reina Tsukishiro",
    text: "darling! I do hope you'll come back for another performance. the house is always dreadfully empty without a scene partner.",
    condition: (s) => Boolean(s.save.flags["met_reina"]),
  },
  {
    id: "reina_post_resolve",
    contactId: "reina",
    from: "Reina Tsukishiro",
    text: "still thinking about act two. don't tell anyone I said that. actually — do. I've decided I don't mind.",
    condition: (s) => Boolean(s.save.flags["reina_boss_resolved"]),
  },
  {
    id: "unknown_first",
    contactId: "unknown",
    from: "???",
    text: "you don't remember this conversation. that's fine. neither do i, most of the time.",
    condition: (s) => s.save.route.deaths > 0,
  },
  {
    id: "unknown_second",
    contactId: "unknown",
    from: "???",
    text: "for what it's worth: it gets easier to come back. it doesn't get easier to notice that you did.",
    condition: (s) => s.save.route.deaths >= 2,
  },
];
