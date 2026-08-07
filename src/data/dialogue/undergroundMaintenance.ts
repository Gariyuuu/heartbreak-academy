import type { DialogueTreeDef } from "../../game/dialogue/types";

export const breakerPanelFlavor: DialogueTreeDef = {
  id: "breaker_panel_flavor",
  pickStart: () => "read",
  nodes: {
    read: {
      id: "read",
      speakerId: null,
      expression: "neutral",
      text: (store) =>
        store.save.flags["flicker_faced"]
          ? "A breaker panel with hand-labeled switches: LIBRARY, GYM, DORMS, and one unlabeled switch near the bottom. It doesn't look worn anymore — it looks like it's been decided on. You could flip it."
          : "A breaker panel with hand-labeled switches: LIBRARY, GYM, DORMS, and one unlabeled switch near the bottom, worn smooth from a lot of hands not quite deciding to flip it.",
      next: null,
    },
  },
};
