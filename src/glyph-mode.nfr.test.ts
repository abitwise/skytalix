/**
 * `NFR-007`'s zero-I/O bar for the glyph-mode selection, as a permanent guard.
 *
 * The bar in `ABC-015` is measurable and structural rather than timed: *"the selection performs
 * ZERO filesystem and ZERO process operations; it reads `process.stdout.isTTY` and `process.env`
 * only"*. It is not a wall-clock bar and the ticket says why — the function runs once per process,
 * so a µs target would be ceremony. This file asserts nothing about time; this project's standing
 * rule keeps microseconds in `plans/nfr-catalog.md` with the machine that measured them.
 *
 * IT LIVES IN ITS OWN FILE FOR THE REASON `gameend.nfr.test.ts` gives: a `vi.mock` factory is
 * hoisted to file scope, so putting these here-mocked core modules in `glyph-mode.test.ts` would
 * re-route the module graph for all of that file's acceptance tests to buy three assertions.
 *
 * A MEASUREMENT IS NOT A GUARD — the lesson `plans/nfr-catalog.md` records against `NFR-001` and
 * `NFR-005`, both times after behaviour-equivalent mutations left the whole suite green. The same
 * hole is open here: every acceptance test in `glyph-mode.test.ts` stays green if a future author
 * "improves" detection by shelling out to `locale`, stat-ing a font directory or reading
 * `/etc/locale.conf`, because none of that changes a returned value. These assertions are the only
 * ones that would notice.
 *
 * The bar is on the SELECTION, so both entry points are exercised: the pure rule and the session
 * accessor that reads the two ambient signals.
 */
import { describe, expect, it, vi } from "vitest";

vi.mock("node:fs", async (importOriginal) => {
  const actual = await importOriginal<typeof import("node:fs")>();
  return {
    ...actual,
    readFileSync: vi.fn(actual.readFileSync),
    existsSync: vi.fn(actual.existsSync),
    statSync: vi.fn(actual.statSync),
    readdirSync: vi.fn(actual.readdirSync),
  };
});

vi.mock("node:child_process", async (importOriginal) => {
  const actual = await importOriginal<typeof import("node:child_process")>();
  return {
    ...actual,
    execSync: vi.fn(actual.execSync),
    execFileSync: vi.fn(actual.execFileSync),
    spawnSync: vi.fn(actual.spawnSync),
    spawn: vi.fn(actual.spawn),
  };
});

const { readFileSync, existsSync, statSync, readdirSync } = await import("node:fs");
const { execSync, execFileSync, spawnSync, spawn } = await import("node:child_process");
const { beginGlyphModeSession, selectGlyphMode } = await import("./glyph-mode.ts");

const FILESYSTEM = [
  ["readFileSync", readFileSync],
  ["existsSync", existsSync],
  ["statSync", statSync],
  ["readdirSync", readdirSync],
] as const;

const PROCESS = [
  ["execSync", execSync],
  ["execFileSync", execFileSync],
  ["spawnSync", spawnSync],
  ["spawn", spawn],
] as const;

/** Every shape the selection can be reached in: the nine tuples collapse to these paths. */
function runEverySelectionPath(): void {
  selectGlyphMode({ ascii: true, unicode: false, isTTY: true, env: { LANG: "en_US.UTF-8" } });
  selectGlyphMode({ ascii: false, unicode: true, isTTY: false, env: { LANG: "C" } });
  selectGlyphMode({ ascii: true, unicode: true, isTTY: true, env: { LANG: "en_US.UTF-8" } });
  selectGlyphMode({ ascii: false, unicode: false, isTTY: false, env: {} });
  selectGlyphMode({ ascii: false, unicode: false, isTTY: true, env: { LC_ALL: "C" } });
  selectGlyphMode({ ascii: false, unicode: false, isTTY: true, env: { LC_CTYPE: "en_US.utf8" } });
  selectGlyphMode({ ascii: false, unicode: false, isTTY: true, env: {} });
  selectGlyphMode({ ascii: false, unicode: false, isTTY: true, env: { LANG: "en_US.ISO-8859-1" } });
  beginGlyphModeSession({ ascii: false, unicode: false })();
}

describe("NFR-007 — the glyph-mode selection reaches its answer with no I/O (spied)", () => {
  it("performs ZERO filesystem operations, on every selection path", () => {
    vi.clearAllMocks();

    runEverySelectionPath();

    for (const [name, fn] of FILESYSTEM) {
      expect(fn, name).toHaveBeenCalledTimes(0);
    }
  });

  it("performs ZERO process operations — there is no `locale` subprocess and no font probe", () => {
    vi.clearAllMocks();

    runEverySelectionPath();

    for (const [name, fn] of PROCESS) {
      expect(fn, name).toHaveBeenCalledTimes(0);
    }
  });

  it("still returns the right answers while both are spied, so the two above cannot pass vacuously", () => {
    // A `runEverySelectionPath` that had stopped calling anything would satisfy both assertions
    // above and prove nothing. This is the control.
    expect(selectGlyphMode({ ascii: false, unicode: false, isTTY: true, env: {} })).toBe("unicode");
    expect(selectGlyphMode({ ascii: false, unicode: false, isTTY: false, env: {} })).toBe("ascii");
  });
});
