---
id: 20260920T044000Z-software-engineer-observation-nine-mutants-red-control-green-m9-the-reader-bypassing-the-wrapper-is-caught-by-the-entry-point-child-only-3f7c1e58
kind: observation
by: software-engineer
at: 2026-09-20T04:40:00Z
verified_by:
confidence: high
refs:
  - ABC-046
  - ABC-037
  - src/command-input.ts
  - src/line-input.ts
  - src/command-input.test.ts
  - src/cli.test.ts
  - src/line-input.test.ts
supersedes:
---

# `ABC-046` — nine mutants watched RED, control green, both production files restored byte-identical each time

Harness: `raw-mutants-harness.mjs.txt`; per-mutant summary: `raw-mutants-summary.json.txt`. Each
mutant was written INTO the named production file in the worktree, the named test file(s) run, the
original restored, and the restore asserted by sha256 (`restoredByteIdentical: true` on all ten
rounds; `git status -- src` after the round shows only this ticket's four modified files, and the
tree was committed as `6cdde15` after it). Run on the tree that became `6cdde15`.

| mutant | file | what | `command-input.test.ts` (131) | `cli.test.ts` (65) |
| --- | --- | --- | --- | --- |
| M1 | `command-input.ts` | flag never clears (`quitArmed = quitArmed \|\| …`) — `A1`'s "latched forever" build | **6 failed** — quit/other/quit, quit/move/quit, quit/rejected/quit, loop quit/board/quit, loop quit/e4/quit, quit/new/quit | 0 |
| M2 | `command-input.ts` | first `quit` exits, no confirmation (`if (quitArmed)`) | **11 failed** — every `A1` row, `A7`, quit/new/quit | **3 failed** — `A2/A3`, `A6`, `A1` quit/EOF |
| M3 | `command-input.ts` | module-level flag (`ABC-045`'s `M5` shape) | **10 failed** — incl. "the flag is PER SESSION" | 0 |
| M4 | `command-input.ts` | `new` → `plies: 2` | **2 failed** — `A4` pure, `A4` loop | 0 |
| M5 | `command-input.ts` | `new` row flipped to `command` (inert) | **6 failed** — `A4` ×2, `A5` ×2, `A7`, quit/new/quit | **1 failed** — `A6` |
| M6 | `command-input.ts` | confirmation item 36 columns | **2 failed** — `A1` (`≤ 17`), region-fit row | **2 failed** — `A2/A3`, `A1` quit/EOF (the item is no longer in the frame whole) |
| M7 | `command-input.ts` | only COMMANDS clear the flag (a move / rejected line leaves it armed) | **3 failed** — quit/move/quit, quit/rejected/quit, loop quit/e4/quit | 0 |
| M8 | `command-input.ts` | first `quit` carries NO message (the `QUIT_CONFIRMATION_MESSAGES` return removed) | **11 failed** — the superseded `ABC-035` fence row + every `A1` row, `A7`, quit/new/quit | **2 failed** — `A2/A3`, `A1` quit/EOF |
| M9 | `line-input.ts` | the reader calls bare `resolvePromptLine` (never the wrapper) | `line-input.test.ts`: **0 failed / 29** | **1 failed** — `A2/A3` (`quits`: `d4` is read, the opponent runs out of script, `"did not finish"`) |
| CONTROL | — | unmutated | 131 / 131 | 65 / 65 |

## Named for QE

- **`M9` is caught by ONE row, and it is a spawned child.** `src/line-input.test.ts` has no
  confirmation row (it is outside `A8`'s file list and this hop did not add one), and the unit
  rows in `src/command-input.test.ts` exercise the wrapper directly, so a reader that forgets to
  bind it is invisible to both. `CHILDREN.quits` in `src/cli.test.ts` is the whole guard on that
  wiring. If QE wants a unit-level guard, one row in `src/line-input.test.ts` (`quit` twice
  through `createLineInputSeam` → `{ kind: "quit" }`) would be it; not added here because that
  file is not in the ticket's list.
- **M1 / M3 / M4 / M7 are invisible to the entry-point children** — expected, since the two
  children script `quit`/`quit` and `new`-then-one-`quit` only; the unit rows are where those
  distinctions live.
- **The over-cap-line gap** (sibling `decision` § 3) has no mutant because there is no build to
  mutate: the delivered build and the "correct" build differ on a line the wrapper never sees.
