// Loads every map data file directly (Node's native TS type-stripping —
// requires Node 22.6+ or a modern LTS with --experimental-strip-types
// enabled by default; no bundler needed since map files are plain data
// plus one type-only import) and checks for structural bugs that
// typecheck/build/lint can't catch: row-length mismatches, exits whose
// trigger tile is itself a blocking tile (unreachable by walking), exits
// pointing at an unregistered map id, and exits whose destination spawn
// point is itself blocking.
//
// This exists because of a real, repeated bug class in this project: a
// "door" character placed one row/col inside a wall instead of replacing
// it, silently making an exit permanently unreachable. Playwright testing
// only catches transitions someone remembered to test; this checks all of
// them, every time. Run with: npm run validate:maps
import { readdirSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MAPS_DIR = path.join(__dirname, "..", "src", "data", "maps");
const BLOCKING = new Set(["#", "L", "A"]);

const files = readdirSync(MAPS_DIR).filter((f) => f.endsWith(".ts"));
const maps = {};

for (const file of files) {
  const mod = await import(pathToFileURL(path.join(MAPS_DIR, file)).href);
  for (const val of Object.values(mod)) {
    if (val && typeof val === "object" && val.grid) {
      maps[val.id] = val;
    }
  }
}

console.log("Loaded maps:", Object.keys(maps).join(", "));

let problems = 0;

function isBlocked(map, col, row) {
  const rows = map.grid;
  if (row < 0 || row >= rows.length || col < 0 || col >= rows[0].length) return true;
  return BLOCKING.has(rows[row][col]);
}

for (const [id, map] of Object.entries(maps)) {
  const rows = map.grid;
  const width = rows[0].length;
  rows.forEach((r, i) => {
    if (r.length !== width) {
      console.log(`[${id}] row ${i} length ${r.length} != expected ${width}`);
      problems++;
    }
  });

  if (map.spawn && isBlocked(map, map.spawn.col, map.spawn.row)) {
    console.log(`[${id}] spawn (${map.spawn.col},${map.spawn.row}) is on a BLOCKING tile`);
    problems++;
  }

  for (const npc of map.npcs || []) {
    if (isBlocked(map, npc.col, npc.row)) {
      console.log(`[${id}] npc "${npc.id}" (${npc.col},${npc.row}) is on a BLOCKING tile`);
      problems++;
    }
    for (const p of npc.patrol || []) {
      if (isBlocked(map, p.col, p.row)) {
        console.log(`[${id}] npc "${npc.id}" patrol point (${p.col},${p.row}) is on a BLOCKING tile`);
        problems++;
      }
    }
  }

  for (const it of map.interactables || []) {
    if (isBlocked(map, it.col, it.row)) {
      // Not always a bug — signs are sometimes deliberately placed on the
      // decor tile they describe (e.g. a "gadget shelf" sign on the shelf
      // itself) and are still reachable from an adjacent floor tile. Shown
      // as a note, not counted as a failure.
      console.log(`[${id}] NOTE: interactable "${it.id}" (${it.col},${it.row}) sits on a blocking tile — verify it's reachable from an adjacent tile`);
    }
  }

  for (const exit of map.exits || []) {
    if (isBlocked(map, exit.col, exit.row)) {
      console.log(`[${id}] exit "${exit.id}" trigger point (${exit.col},${exit.row}) is on a BLOCKING tile — UNREACHABLE`);
      problems++;
    }
    if (!Object.prototype.hasOwnProperty.call(maps, exit.targetMapId)) {
      console.log(`[${id}] exit "${exit.id}" points to unknown/unregistered map "${exit.targetMapId}"`);
      problems++;
    } else {
      const target = maps[exit.targetMapId];
      if (isBlocked(target, exit.targetSpawn.col, exit.targetSpawn.row)) {
        console.log(
          `[${id}] exit "${exit.id}" -> "${exit.targetMapId}" targetSpawn (${exit.targetSpawn.col},${exit.targetSpawn.row}) is on a BLOCKING tile in the destination map`,
        );
        problems++;
      }
    }
  }
}

console.log(`\nChecked ${Object.keys(maps).length} maps. ${problems} problem(s) found.`);
process.exit(problems > 0 ? 1 : 0);
