---
id: 20260811T154000Z-software-engineer-artifact-ref-8b26cf05
kind: artifact-ref
by: software-engineer
at: 2026-08-11T15:40:00Z
verified_by:
confidence: high
refs:
  - ABC-019
  - src/turn-loop.ts
  - src/turn-loop.test.ts
  - plans/traceability.md
supersedes:
---

# What changed on disk, what the gates said, and the five wrong builds that were run against it

> **Hand-authored** — `scripts/context-io.ts` absent, `mcp__grugops__propose_note` unavailable.
> **Nothing here is a `finding`:** no verification stamp is issuable to me, so these gate results are
> a recorded observation of commands I ran, not a verified verdict.

**Branch `grugops/ABC-019-turn-loop-skeleton`, worktree `../cli-chess-ABC-019`. Not merged, not
pushed, not rebased. No `git checkout main`, no merge, no deploy.**

## Files written — THREE, and the whole diff is 125 insertions / 23 deletions

| File | Change |
|---|---|
| `src/turn-loop.ts` | **+33 / −9.** One `try`/`catch` over `await input(history)` calling `takeBack(history, 0)` then `throw error` (`A9b`); one docstring correction to `A2`'s amended cadence formula, comment only |
| `src/turn-loop.test.ts` | **+89 / −13.** Scripted row **14**; the `A9b` criterion test; `midBracketThrowingInput` + `PARSER_EXPLODED`; `EVERY_TERMINAL_REASON` hoisted so `A14` and `A9b` (iii) share one copy; `RunOptions` gains optional `history` and `input`; three "thirteen" → "fourteen" counts |
| `plans/traceability.md` | The `ABC-019` row only, **three cells** (`Code`, `Tests`, `Status`) |

**No other file was written.** Specifically not: `src/turn-loop.nfr.test.ts`, `src/status-panel.*`,
`src/frame.test.ts`, `src/gameend.ts`, any other merged module, `plans/board.md`,
`plans/tickets/*.md`, `memory-bank/`, or any traceability row other than `ABC-019`'s.

### The trace edit was verified MECHANICALLY at the write, not eyeballed

`251 → 251` lines; **36 → 36** table lines; the `ABC-019` row's naive pipe count **12 → 12** and its
one escaped pipe still **1**, so its cell count is **12 → 12**; every appended string asserted
pipe-free and newline-free **before** writing; and **line 104 is the only line in the file whose md5
changed**, checked line by line across all 251.

## Gates — all four blocking gates, on the branch tip, after the edits

| Gate | Command | Baseline (verified by me at start) | After |
|---|---|---|---|
| lint | `npm run lint` | exit **0** (2 pre-existing `biome migrate` infos) | exit **0**, same 2 infos |
| typecheck | `npm run typecheck` | exit **0** | exit **0** |
| build | `npm run build` | exit **0** | exit **0** |
| unit | `npm test` | **715/715 on 24 files** | **717/717 on 24 files** |
| skip count | `npx vitest run --reporter=json \| jq '.numPendingTests + .numTodoTests'` | **0** | **0** |
| sync | `git rev-list --left-right --count main...HEAD` | **0 behind**, 3 ahead | **2 behind**, 3 ahead — see below |

**The baseline was re-run by me in this worktree rather than taken from the brief**, exactly as the
brief asked. `+2` tests, **`+0` test files**.

**The 2-behind is `main` moving during the hop, not a regression:** `0234aac` (`ADR-0010`) and
`660aef2` (board routing). `git diff --stat HEAD...main -- src/` is **empty**, so no gate result above
is affected. I did not rebase — sequencing is the Orchestrator's.

`self_fix_attempts` was **not** spent: no gate ran red on the tip at any point.

## The five wrong builds — the ticket's own method, applied to `A9b`

Each mutant was written into `src/turn-loop.ts`, `tsc --noEmit` was run, the suite was RUN, the
failing tests recorded, and the file restored. **All five typecheck clean — none of them is caught by
a compiler — and none is green.** `src/turn-loop.ts` was verified byte-identical to its pristine copy
after every restore (md5 `c92a1776e34b94cb3d9087dc3510e507`).

| # | Wrong build | `tsc` | RED at |
|---|---|---|---|
| M1 | **no handler at all — the PREVIOUSLY DELIVERED build** | 0 | `A9b` (i) |
| M2 | repairs, then **swallows**: returns `{ result: null, reason: null, exitCode: 0 }` | 0 | row 14 **and** `A9b` |
| M3 | repairs, then returns a **named reason** | 0 | row 14 **and** `A9b` |
| M4 | **rethrows without repairing** | 0 | `A9b` (i) |
| M5 | repairs, then throws an exception **of the loop's own making** | 0 | row 14 **and** `A9b` |

**M1–M4 are BA/PM's own four (`refinement-ABC-019-seam`, the `artifact-ref` note for QE); M5 is not
on that list and is the one my identity assertion adds.** M1 and M4 are RED only at `A9b`, never at
row 14 — correctly: row 14 asserts the propagation promise and `A9b` (i) asserts the repair, and an
unhandled throw propagates on its own.

**A sixth mutant, on `A14` rather than on the loop, because I moved the annotated array:** narrowing
`TerminalReason` to `EndReason | "resignation"` — the type `[D13]` proved satisfies `A14`'s old
wording word for word — makes `tsc --noEmit` exit **2** with five `TS2322`s at
`src/turn-loop.test.ts:137-141`. `A14`'s type-level assertion still binds from its new location.

## Test counts

`src/turn-loop.test.ts` **35 → 37 tests**: 13 table rows + row 14 = **14 scripted rows**, and 21 → 22
`it`s in the acceptance block (`A19` runs twice, once per stub shape).
`src/turn-loop.nfr.test.ts` unchanged at 4 tests and green at 40 / 120 / 300 plies.

## Requested board move, and what I did not do

**`In Development` → `In Review` for `ABC-019` — REQUESTED, not taken.** `plans/board.md` is the
Orchestrator's alone and was not opened for edit. The ticket file's front matter is **already**
`status: in-development` / `column: In Development` (BA/PM left it at `in-review` and the Orchestrator
moved it), and I left it alone deliberately on the same precedent: the board is the authority, and
moving the ticket first would put the two out of step.

**Also carried forward and still owed, restated rather than left to decay:**

- the **rebase** of this branch onto merged `ABC-016` and `ABC-017`, and `ADR-0009` clause 9f's
  **REAL-PANEL** re-gate. Under clause 9 the loop's code is swap-invariant, so what that re-gate tests
  is the **seam wiring** — only a real-panel run tests it. Orchestrator's and QE's.
- the board row's `blocked-until: ABC-012, ABC-014, ABC-018` and `merge-order: after ABC-020`, **stale
  on all four** — flagged by BA/PM at two hops now, still not mine to edit.
- the `ADR-0009` transcription follow-up (cl. 9b and evidence (vii) still write the seam with three
  arguments). Architect/Design's, already queued by the Orchestrator.

Not done, at all: no merge, no push, no deploy, no `git checkout main`, no rebase, no dependency
change, no unrelated refactor, no edit to any merged module, no `src/status-panel.*`, no
`src/frame.test.ts`, no `plans/board.md`, no ticket amendment, and no traceability row other than
`ABC-019`'s.
