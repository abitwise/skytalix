---
id: 20260811T213500Z-software-engineer-artifact-ref-2c23079a
kind: artifact-ref
by: software-engineer
at: 2026-08-11T21:35:00Z
verified_by:
confidence: high
refs:
  - ABC-019
  - src/turn-loop.ts
  - src/turn-loop.test.ts
  - plans/traceability.md
  - .grugops/queue/claimed/ticket-to-pr-ABC-019-a10b/
supersedes:
---

# The artifact: two source files, +6 tests, ELEVEN mutants all killed, and the gate re-run

> **Hand-authored** — see this hop's `decision` note for why. **Nothing here is a `finding`**, and no
> §14 gate verdict is self-attested: that machinery does not exist in this repo.

## Baseline, re-run by me at the start rather than taken from the brief

| check | result |
|---|---|
| branch | `grugops/ABC-019-turn-loop-skeleton` |
| `git rev-list --count HEAD..main` | **0 behind**, 6 ahead |
| `md5 src/turn-loop.ts` | **`c92a1776e34b94cb3d9087dc3510e507`** — matches the recorded value |
| `npm test` | **717/717 on 24 files** |
| lint / typecheck | **0 / 0** (2 pre-existing `biome migrate` infos on `biome.json`) |
| skips | **0** (`vitest --reporter=json`, counted `pending` + `skipped` + `todo`) |

## Files changed — TWO, and no others

| file | change |
|---|---|
| `src/turn-loop.ts` | **the `A10b` guard.** `wasGenerated` extracted from the engine branch; applied to the input seam's `{kind:"move"}`; a false throws. +39 / −10 lines, most of it the comment carrying the four declined options |
| `src/turn-loop.test.ts` | rows 15/16/17, `A5b`, `A8b`, `A10b`; `A3b`, `A6`, `A9b`(iv), `A11` extended in place; one `onRender` hook on the harness. +~270 lines |
| `plans/traceability.md` | `ABC-019`'s row only — `Code (PR/files)`, `Tests`, `Status` appended to; header replaced |

**`plans/board.md` was NOT opened for edit. `plans/tickets/` read only. `memory-bank/` read only —
`ADR-0009` and `ADR-0010` were not re-opened. `src/status-panel.*` and `src/frame.*` were NOT
touched** (`git diff --name-only` carries neither), and no queue item or note belonging to the live
`ABC-016` or `ABC-027` hops was read or written.

## One harness addition, and it is the only thing I added that no criterion named

`RunOptions.onRender` — a callback fired on every render-seam call. `RunResult.frames` already counts
renders, but **a run that RETHROWS never produces a `RunResult`**, and `A9b`(iv) and `A10b`(v) both
bound the render calls made between a throw and the rethrow. Without it those two clauses could only
be asserted against what reached the *writer*, which is weaker than what they say. It is two lines
and it is recorded here because it is harness scope, not criterion scope.

## The gate, re-run after every edit

| gate | before | after |
|---|---|---|
| `npm test` | 717/717 on 24 files | **723/723 on 24 files** |
| test FILES | 24 | **24 — ZERO added, so `N8-LANE` does not move** |
| skips | 0 | **0** |
| `npm run lint` | exit 0 | **exit 0** |
| `npm run typecheck` | exit 0 | **exit 0** |
| `npm run build` | exit 0 | **exit 0** |
| `git rev-list --count HEAD..main` | 0 | **0** |

**+6 tests: rows 15, 16, 17 and criteria `A5b`, `A8b`, `A10b`.** The four extensions (`A3b`, `A6`,
`A9b`(iv), `A11`) are assertions added to existing tests and add no test count.

## ELEVEN mutants, ALL KILLED — the part that makes the six new tests evidence rather than decoration

Written into `src/turn-loop.ts` by an out-of-tree harness (exact-string, anchor-uniqueness-checked),
then `tsc --noEmit` and `vitest run` on both loop suites, then restored and **md5-asserted
`bd793612476c9d0eac28b75e1e3297cc` after every single one**. The harness lives outside the repository
and is not named `*.test.ts`, so nothing entered the lane — 24 files before and after.

| # | wrong build | tsc | verdict — killed by |
|---|---|---|---|
| `M1` | the input-seam guard REMOVED — **the delivered pre-`A10b` build** | 0 | **KILLED** — row 17, `A10b` |
| `M1b` | the guard reuses **`engine-failure`** instead of throwing | 0 | **KILLED** — row 17, `A10b` |
| `M1c` | the guard stops quietly — byte-identical to `A8`'s end-of-input | 0 | **KILLED** — row 17, `A10b` |
| `M2` | QE's **`Q2`** — `thinking` loses its `in-progress` guard | 0 | **KILLED** — `A11` |
| `M3` | QE's **`Q3`** — `messages = []` deleted | 0 | **KILLED** — `A5b` |
| `M4` | QE's **`Q8`** — the `command` outcome's items dropped | 0 | **KILLED** — `A5b`, `A6` |
| `M5` | QE's **`Q4`** — the MID-MUTATION position rendered and written, then repaired | 0 | **KILLED** — `A9b` |
| `M5b` | QE's **`Q4b`** — repair, write `A8`'s notice, then rethrow | 0 | **KILLED** — `A9b` |
| `M6` | QE's **`Q5`** — the seam's `reason` discarded, `"resignation"` substituted | 0 | **KILLED** — `A8b` |
| `M6b` | QE's **`Q5b`** — the prompt `game-over` reported as end-of-input | 0 | **KILLED** — row 15, `A8b` |
| `M7` | QE's **`Q11`** — the exit test does not run on the first pass | 0 | **KILLED** — row 16, `A3b` |

**11 run · 11 killed · 0 survivors.** Eight of the eleven are QE's own surviving mutants from the
previous hop, converted from survivors into kills; `Q7` (the check applied to the input side) is no
longer a mutant because it is now the build. **`Q12`/`G-9` is NOT in this table and is not claimed
closed** — it is the declared limit `A19` records, it needs a variable-height stub, and `[D45]` ruled
it deliberately not bought.

## Queue

Claimed per Workflow 17 **by hand** — `scripts/claim.js` does not exist here. Atomic
`mkdir .grugops/queue/claimed/ticket-to-pr-ABC-019-a10b/` returned success (**not `EEXIST`**), a
`claim.md` registry record was written (`by` / `at` / `task`), and the subtask file was moved
`pending/` → `claimed/`. It moves to `done/` as the final act of this hop.

## `plans/traceability.md` — ONE row, THREE cells, mechanically verified

Verification asserted at the write and re-read from disk afterwards: **line count unchanged at 253,
251 lines md5-IDENTICAL** (only the `ABC-019` row and the `_Updated:` header differ), table lines 37
before and after, the edited row's naive pipe count **unchanged at 12** (that row carries a
deliberately escaped pipe inside `EndReason \| "resignation"`, as four previous hops recorded), and
all three appended strings asserted **pipe-free and newline-free before writing**. `UAT` and
`Release` left empty — nothing is UAT'd and nothing is released.

## What was NOT done

- **No merge, no push, no deploy, no `git checkout main`, no rebase, no dependency change.**
- **No test weakened, skipped or deleted.** Skip count 0 before and after.
- **`src/frame.ts` not opened** — `A20` is `ABC-027`'s to unblock.
- **`plans/board.md` not opened for edit** — the move is requested in this hop's `observation` note.
