---
id: 20260813T230500Z-qe-e2e-observation-the-four-questions-answered-by-rebuilt-mutant-7217726a
kind: observation
by: qe-e2e
at: 2026-08-13T23:05:00Z
verified_by: 
confidence: high
refs:
  - ABC-041
  - src/render-seam.test.ts
  - src/render-seam.ts
  - plans/tickets/ABC-041-render-seam-closure.md
  - 20260813T223012Z-software-engineer-observation-the-x2-mutant-rebuilt-and-the-fix-watched-red-da3c6d05
supersedes: 
---

# The four questions, answered by mutant. B and C reproduce; `A4` bites alone; `A11` is a rename that kept its teeth.

Every run below was performed in an out-of-tree copy of this branch's worktree, so **the gate branch's
`src/render-seam.ts` was never opened for writing at all** — stronger than "mutated and reverted".
The copy was verified faithful before any mutant: `src/render-seam.ts` md5 **`bc18d0830b84adaff123affce66561c5`**
and `src/render-seam.test.ts` md5 **`f47e6df7916bf38cf33334175b338f26`**, the Engineer's own pinned
values, and the copy ran **12 passed** before the first edit and after every revert.

## 1. The A/B/C matrix, rebuilt rather than read

| run | module | `A4`'s width | whole-frame equality | result |
|---|---|---|---|---|
| **A** | `X2` applied | panel-derived | present | **2 failed / 10 passed (12)** — `A4` RED at `:241` (the width line, before the whole-frame check) and the standalone `A4 (width)` RED at `:368` |
| **B** | `X2` applied | panel-derived | **removed** | **`A4` RED at `:241`** — 1 failed / 11 skipped (12), filtered to `A4` |
| **C** | `X2` applied | **`(frame[0] as string).length`** | **removed** | **`A4` GREEN** — 1 passed / 11 skipped (12) |

**B against C is the measurement and it holds.** Same mutant, same file, same missing "plus" — the
only difference is where the width comes from. The Engineer's report reproduces digit for digit,
including the failure line number. **The circularity is closed on evidence.**

`X2` is nine blanks appended to every board row, **digit-free** so `A3`'s no-digit clause cannot claim
the kill.

## 2. The repaired `A4` was not softened to fit the build

| mutant | run against | result |
|---|---|---|
| `X1` — orientation hardcoded to `"white-bottom"` | full instruments | **1 failed (12)** — `A4` RED at `:241` |
| `X1` | whole-frame equality **removed** | **`A4` still RED at `:241`** |
| `X2` — the self-padding seam | whole-frame equality **removed** | **`A4` RED** (run B) |

Both mutants the repaired `A4` claims to catch die on **`A4`'s own region comparison**, not on the
adjacent whole-frame equality and not merely on the arming half at `:262`. What `A4` claims, `A4`
does. What it says it does **not** catch — a second board implementation — it indeed does not, and
the ticket now says so in words.

## 3. `A11` — the rename is a rename, and the property survived the move

The row body was extracted at `8dbe2b4` (as `A4 (purpose)`) and at `78a3db8` (as `A11`), comments
stripped, and diffed: **the only differing line is the `it(...)` title.** All four `vi.spyOn` lines,
the seam call and all four `toHaveBeenCalledTimes(1)` assertions are byte-identical. Nothing was
weakened in the move.

**`X3b` rebuilt** — `renderBoard`'s algorithm copied into its own `src/board-two.ts` (the glyph table,
both shading constants, the file letters and the loop), the seam calling the copy, `render.ts` left
holding only type-erased specifiers:

```
npx vitest run src/render-seam.test.ts  ->  1 failed | 11 passed (12)
   x A11 — renderBoard: expected "renderBoard" to be called 1 times, but got 0 times
npm test                                ->  1 failed | 827 passed (828)
npx tsc --noEmit                        ->  exit 0
```

**`A11` is the only red.** `A4` (both halves), the standalone width row and `A8` are all **green** —
which is the proof that the property genuinely moved: byte-equality cannot see a byte-identical copy,
a call count can, and the call count is where BA/PM put it. Re-run against the final 11-row artifact
after the disposal: **still `A11` only, 1 failed / 10 passed (11).**

`A8` staying green under `X3b` is the import-statement blind spot, unchanged and correctly homed to
`ABC-054`.

## 4. The gates, the scope and the lane, re-measured at my own hand

| check | command | result |
|---|---|---|
| lint | `npm run lint` | **exit 0**, 51 files, **2 infos** (the pre-existing `biome.json` notices) |
| typecheck | `npm run typecheck` | **exit 0** |
| build | `npm run build` | **exit 0** |
| unit (at `78a3db8`) | `npm test` | **828 passed / 828, 29 files** |
| unit (at my tip) | `npm test` | **827 passed / 827, 29 files** |
| skips | `npx vitest run --reporter=json \| jq '.numPendingTests + .numTodoTests'` | **0** |
| test-integrity | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | **`No findings.`, exit 0** |

```
git diff --numstat main -- src/
 1    0   src/history-pane.nfr.test.ts     <- the probe-root line A9 requires
 396  0   src/render-seam.test.ts
 62   0   src/render-seam.ts               <- byte-identical to the day it was written
```

- **`A10` holds**: `git diff --numstat main -- src/frame.ts src/render.ts src/status-panel.ts
  src/history-pane.ts src/turn-loop.ts` is **empty**.
- **The lane allotment did not move.** `src/` holds 47 files on `main` and **49** here: one production
  module and **one** test file. The allotment of 1 test file is still spent exactly once, and the
  disposal removed a test **row**, never a file.
- **`src/render-seam.ts` is untouched by every hop since delivery** — git blob `51e50a38…` at
  `ac17fe2`, `8dbe2b4`, `78a3db8` and at my tip. The Orchestrator's check reproduces and reaches
  further back than it claimed.
