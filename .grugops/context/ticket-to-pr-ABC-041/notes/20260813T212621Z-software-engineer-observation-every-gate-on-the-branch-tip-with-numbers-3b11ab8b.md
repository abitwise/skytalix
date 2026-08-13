---
id: 20260813T212621Z-software-engineer-observation-every-gate-on-the-branch-tip-with-numbers-3b11ab8b
kind: observation
by: software-engineer
at: 2026-08-13T21:26:21Z
verified_by: 
confidence: high
refs:
  - ABC-041
  - src/render-seam.ts
  - src/render-seam.test.ts
  - src/history-pane.nfr.test.ts
  - AGENTS.md
supersedes: 
---

# Every mandatory gate plus the test-integrity step, run on the branch tip. Numbers, not adjectives.

`quality.mandatory_gates` is `["lint","typecheck","unit","build"]`. All four ran on
`grugops/ticket-to-pr-ABC-041`, plus the test-integrity step. **`self_fix_attempts` is 2; one was
used** (a formatter fix, below). No `finding` is recorded and no `§14-gate#<id>` stamp is emitted —
`AGENTS.md` § Role / workflow files says none is admissible on this install.

| gate | command | result |
|---|---|---|
| lint | `npm run lint` | **exit 0**, 51 files checked, 0 errors, **2 infos** |
| typecheck | `npm run typecheck` | **exit 0** (`tsc --noEmit`) |
| unit | `npm test` | **824 passed / 824, 29 files**, 1.32 s |
| build | `npm run build` | **exit 0** (`tsc --noEmit` — the honest naming `AGENTS.md` records) |
| test-integrity | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | **`No findings.`, exit 0** |

Skip count captured with the recorded command, `npx vitest run --reporter=json \| jq
'.numPendingTests + .numTodoTests'` → **0**. `A10`'s "suite green, skip **0**" is met.

**The baseline was MEASURED, not inferred.** With the three changed files stashed: **816 passed /
816, 28 files**. So this branch is **+8 tests, +1 file, 0 regressions** — every one of the 816
pre-existing tests still passes, including all seven `*.nfr.test.ts` files.

**The two lint infos are pre-existing and are not mine.** Both are `biome.json` deserialize notices —
a `$schema` pinned at `2.3.0` against CLI `2.5.5`, and the deprecated `linter.rules.recommended`
field. `biome.json` is not in this diff. Flagged, not fixed (the 12 rules, #9 and #12); it is a
config-migration change that deserves its own ticket and its own gate.

**The one self-fix.** The first `npm run lint` reported one error: two lines over the 100-column
limit in `src/render-seam.test.ts`. Fixed with `npx biome check --write src/render-seam.test.ts`
(`quality.lint.autofix` is `true`), which touched that file only. Re-run: clean. **1 of 2 attempts
used.**

## The suite's greens were checked for ARMING, because a green that cannot go red proves nothing

This project's own standard (`src/history-pane.nfr.test.ts` says it in three places). Five mutants
were built against the delivered module, each run, each reverted; the module was confirmed
**byte-restored** (`cmp -s`) before the gates above were run.

| mutant | what it breaks | caught by |
|---|---|---|
| M1 re-derives an equal `GameStatus` via `gameStatusOf` | `A2` pass-through | **`A2`** (`gameStatus` 3 ≠ 0) and `A6`/`A7` |
| M2 hardcodes `"white-bottom"`, ignoring the bound value | `A4` orientation | **`A4`** (board regions differ) |
| M3 passes `"unicode"` to `assembleFrame` regardless of mode | `A5` sanitizer reach | **`A5`** (code point 9822 > 127) |
| M4 adds `const HEIGHT = 23;` | `A3` no row-count literal | **`A3`** (digit in stripped code) |
| M5 makes the `history.ts` import RUNTIME | `A7` premise | **the merged probe, BOTH guards** |

Each mutant is killed by the criterion it targets and, apart from M1, by that criterion alone — so
the assertions discriminate rather than blanket-fail.

## The probe was run BOTH ways, which is `## Test notes` row 4

- **Rooted at the new module** — closure is `apply, fen, frame, history-pane, legal, moves, position,
  render-seam, render, san, status-panel`. **`history.ts` absent. `turn-loop.ts` absent** — the
  type-only seam import is erased by Node's type stripping, measured rather than assumed. `A7` green,
  and `A9`'s "reports a closure that includes this module" holds.
- **Rooted at `src/turn-loop.ts`** — **still reports `history.ts`**. The probe **remains armed**;
  `A9`'s second clause is met.

**M5 is the evidence behind gap 1 and is worth the ink.** With a runtime `history.ts` import in the
new module, the licence guard reads `['render-seam.ts','turn-loop.ts']` against a declared
`['turn-loop.ts']` **and** the frame-path probe reports `history.ts` in the closure. Adding the
module to `LICENSED_DRIVERS` would have silenced the first red and left the second one standing — so
the wrong move is not merely wrong, it does not even work. The correct repair is the import.
