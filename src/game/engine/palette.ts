// Shared visual identity: colorful pastel "normal" academy palette, plus a
// desaturated/glitched palette reserved for distortion moments later. Keep
// all raw hex values here so tone stays consistent across scenes.

export const PALETTE = {
  floor: 0xf6e9d8,
  floorAccent: 0xefd9c0,
  wall: 0x7c6a92,
  wallShadow: 0x5f4f78,
  decorLocker: 0x8fb8de,
  decorArcade: 0xe58fb0,
  door: 0xf4c95d,
  savePoint: 0xfff2a8,
  savePointGlow: 0xffe066,

  playerBody: 0xe86a92,
  playerAccent: 0xfff2f6,

  akari: 0x5b6ee1,
  akariAccent: 0xe8ebff,
  mika: 0xff8f4d,
  mikaAccent: 0xfff1e6,
  sleepyUpperclassman: 0x9b8fae,
  sleepyAccent: 0xe4dcf0,
  yuna: 0x6fae8f,
  yunaAccent: 0xe4f2ea,
  strayThought: 0xc9b8f0,
  strayThoughtAccent: 0xf3ecff,
  runawayMetaphor: 0x4a6fa5,
  runawayMetaphorAccent: 0xdce8f5,
  sora: 0xe8a75c,
  soraAccent: 0xfff3e0,
  nana: 0xd88f9e,
  nanaAccent: 0xfbe8ec,
  strayEquation: 0x7fb0c9,
  strayEquationAccent: 0xe8f4fa,
  glitchSprite: 0x5b6ee1,
  glitchSpriteAccent: 0xffe066,
  reina: 0xc9a13b,
  reinaAccent: 0xfff3d6,
  kaede: 0x8a7fb0,
  kaedeAccent: 0xe8e4f5,
  flicker: 0x8fae6f,
  flickerAccent: 0xe4f5d8,
  reflection: 0xc9c9e8,
  reflectionAccent: 0xf5f5ff,
  theAccumulation: 0x6a4a8f,
  theAccumulationAccent: 0xd8b8ff,

  battleArena: 0x1a1024,
  battleArenaBorder: 0xffffff,
  heart: 0xff4d6d,

  uiPanelBg: "rgba(20, 14, 28, 0.92)",
  uiPanelBorder: "#ffe066",
  uiTextPrimary: "#fff6ea",
  uiTextMuted: "#c9bcd8",
} as const;

// Per-region tile theme. Each region gets its own palette so areas read as
// visually distinct places, not the same tiles recolored by accident — see
// spec section 5 ("unique visual identity" per region). New regions add an
// entry here and reference it via `MapDefinition.theme`.
export interface RegionTheme {
  floor: number;
  floorAccent: number;
  wall: number;
  wallShadow: number;
  decorPrimary: number; // 'L' tiles
  decorSecondary: number; // 'A' tiles
  door: number;
}

export const MAP_THEMES: Record<string, RegionTheme> = {
  academy: {
    floor: PALETTE.floor,
    floorAccent: PALETTE.floorAccent,
    wall: PALETTE.wall,
    wallShadow: PALETTE.wallShadow,
    decorPrimary: PALETTE.decorLocker,
    decorSecondary: PALETTE.decorArcade,
    door: PALETTE.door,
  },
  library: {
    floor: 0xe4ddc6,
    floorAccent: 0xd8cead,
    wall: 0x3f5b52,
    wallShadow: 0x2c4038,
    decorPrimary: 0x8a6b45,
    decorSecondary: 0xb99a5b,
    door: 0xc98f4a,
  },
  courtyard: {
    floor: 0xa8d08d,
    floorAccent: 0x9bc77f,
    wall: 0x5c7a4f,
    wallShadow: 0x415938,
    decorPrimary: 0x3f6b8a,
    decorSecondary: 0x6b8f5a,
    door: 0xc98f4a,
  },
  lab: {
    floor: 0xd8e4ec,
    floorAccent: 0xc9d9e4,
    wall: 0x5b7086,
    wallShadow: 0x3f4f5e,
    decorPrimary: 0x7fb0c9,
    decorSecondary: 0xe8a75c,
    door: 0x7fb0c9,
  },
  dorm: {
    floor: 0xf0d9c4,
    floorAccent: 0xe6c9ac,
    wall: 0xa8735c,
    wallShadow: 0x7a5241,
    decorPrimary: 0xd88f9e,
    decorSecondary: 0xc9a875,
    door: 0xd88f9e,
  },
  arcade: {
    floor: 0x2a2038,
    floorAccent: 0x241c30,
    wall: 0xe86a92,
    wallShadow: 0xa8496b,
    decorPrimary: 0x5b6ee1,
    decorSecondary: 0xffe066,
    door: 0xffe066,
  },
  theater: {
    floor: 0x3a1f2b,
    floorAccent: 0x321a25,
    wall: 0x7a2436,
    wallShadow: 0x531826,
    decorPrimary: 0xc9a13b,
    decorSecondary: 0x8a1f36,
    door: 0xc9a13b,
  },
  rooftop: {
    floor: 0xb8c9e8,
    floorAccent: 0xaabde0,
    wall: 0x5c6b96,
    wallShadow: 0x3f4a6b,
    decorPrimary: 0x7c8fc9,
    decorSecondary: 0xe8a75c,
    door: 0xe8a75c,
  },
  council: {
    floor: 0xe6e2f0,
    floorAccent: 0xdad3ea,
    wall: 0x2a2f5c,
    wallShadow: 0x1c2040,
    decorPrimary: 0x5b6ee1,
    decorSecondary: 0xc9a13b,
    door: 0xc9a13b,
  },
  maintenance: {
    floor: 0x3a3f3a,
    floorAccent: 0x323732,
    wall: 0x21251f,
    wallShadow: 0x151815,
    decorPrimary: 0x5c7a5c,
    decorSecondary: 0x8fae6f,
    door: 0x8fae6f,
  },
  null_wing: {
    floor: 0x14101c,
    floorAccent: 0x181320,
    wall: 0x0c0910,
    wallShadow: 0x060409,
    decorPrimary: 0x2a2038,
    decorSecondary: 0x8a7fb0,
    door: 0x8a7fb0,
  },
  festival: {
    floor: 0xf5cf8a,
    floorAccent: 0xecc079,
    wall: 0xd8636b,
    wallShadow: 0xa8434b,
    decorPrimary: 0xe8a75c,
    decorSecondary: 0x6fae8f,
    door: 0xe8a75c,
  },
};

export const FACE_PALETTES: Record<string, { body: number; accent: number }> = {
  player: { body: PALETTE.playerBody, accent: PALETTE.playerAccent },
  akari: { body: PALETTE.akari, accent: PALETTE.akariAccent },
  mika: { body: PALETTE.mika, accent: PALETTE.mikaAccent },
  sleepy_upperclassman: {
    body: PALETTE.sleepyUpperclassman,
    accent: PALETTE.sleepyAccent,
  },
  yuna: { body: PALETTE.yuna, accent: PALETTE.yunaAccent },
  stray_thought: {
    body: PALETTE.strayThought,
    accent: PALETTE.strayThoughtAccent,
  },
  runaway_metaphor: {
    body: PALETTE.runawayMetaphor,
    accent: PALETTE.runawayMetaphorAccent,
  },
  sora: { body: PALETTE.sora, accent: PALETTE.soraAccent },
  nana: { body: PALETTE.nana, accent: PALETTE.nanaAccent },
  stray_equation: {
    body: PALETTE.strayEquation,
    accent: PALETTE.strayEquationAccent,
  },
  glitch_sprite: {
    body: PALETTE.glitchSprite,
    accent: PALETTE.glitchSpriteAccent,
  },
  reina: { body: PALETTE.reina, accent: PALETTE.reinaAccent },
  kaede: { body: PALETTE.kaede, accent: PALETTE.kaedeAccent },
  flicker: { body: PALETTE.flicker, accent: PALETTE.flickerAccent },
  reflection: { body: PALETTE.reflection, accent: PALETTE.reflectionAccent },
  the_accumulation: { body: PALETTE.theAccumulation, accent: PALETTE.theAccumulationAccent },
};
