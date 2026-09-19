---
id: 20260920T013000Z-software-engineer-observation-eight-mutants-red-control-green-m5-caught-by-a4-and-the-first-resign-row-not-by-a5s-loop-row-9c4e1a63
kind: observation
by: software-engineer
at: 2026-09-20T01:30:00Z
verified_by:
confidence: high
refs:
  - ABC-045
  - src/command-input.ts
  - src/command-input.test.ts
  - src/cli.test.ts
supersedes:
---

# `ABC-045` — eight mutants watched RED, control green, the file restored byte-identical each time

Harness: `raw-mutants-harness.mjs.txt`; per-mutant summary: `raw-mutants-summary.json.txt`. Each
mutant was written INTO `src/command-input.ts` in the worktree, the named test file(s) run, the
original restored, and the restore asserted by sha256 (`restoredByteIdentical: true` on all nine
rounds; `git status -- src` after the round shows only this ticket's three modified files). Run
BEFORE the code commit, at the tree that became `b8afa30`.

| mutant | what | `command-input.test.ts` | `cli.test.ts` |
| --- | --- | --- | --- |
| M1 | `result: "black-wins"` hardcoded (ternary dropped) | **2 failed** / 96 — `A1` pure, `A1` loop-as-black | not run |
| M2 | ternary swapped (`blackToMove ? "black-wins" : "white-wins"`) | **6 failed** / 92 — `A1` ×3, `A2`, `A3`, `A5` | not run |
| M3 | row flipped to `outcome: "command"` (resign inert) | **7 failed** / 91 — `A1` ×3, `A2`, `A3`, `A5` ×2 | **1 failed** / 61 — `A4` |
| M4 | `reason: "checkmate"` | **6 failed** / 92 — `A1` ×3, `A2`, `A3`, `A5` | **1 failed** / 61 — `A4` |
| M5 | a module-level `armed` flag: first `resign` → `{ kind: "command", messages: ["confirm"] }`, second → `game-over` | **1 failed** / 97 — `ABC-035 A1` "classifies `resign` as resign" | **1 failed** / 61 — `A4` |
| M6 | `legalMoves(history.position)` called inside the resign branch (direct import) | **1 failed** / 97 — `A3` (module-boundary spy delta) | not run |
| M7 | `gameStatusOf(history)` called inside the resign branch | **4 failed** / 94 — `ABC-035 A6` ×3 (`resign` / `RESIGN` / `  Resign  `), `A3` | not run |
| M8 | the row deleted from the table | **13 failed** / 84 (of 97) — `ABC-035 A1` ×3, `ABC-035 A2` ×3, `A1` ×3, `A2`, `A3`, `A5` ×2 | **1 failed** / 61 — `A4` |
| CONTROL | unmutated | 98 / 98 | 62 / 62 |

## Two things worth saying plainly

- **`M5` is the confirmation mutant, and `A5`'s LOOP row did not red on it.** The mutant's flag
  is module-level, so the first `resign` in the module instance (an `ABC-035 A1` spelling row, which
  runs earlier in the file) armed it and every later row — including `A5`'s — saw the second-call
  behaviour. The red came from that first row and from `A4`'s child (`src/cli.test.ts`), where
  the product really does read one `resign` and then a `d4` it must not consume. So the criterion
  is guarded, but by the entry-point child and by row order rather than by `A5`'s own assertion. A
  per-session flag (the shape `ADR-0021` clause 6 predicts for a future confirmation) would be
  caught by `A5` directly. Recorded so QE does not over-read `A5`'s green.
- **`M6` is the mutant the ticket's rows would have let live.** `A2` counts calls AFTER the
  outcome; a derive INSIDE the resign path happens before it. `A3`'s module-boundary delta was
  added for exactly this and is the only row that reds on `M6`.

Zero mutants survived. Zero lines under `src/` are left mutated.
