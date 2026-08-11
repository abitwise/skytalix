---
id: 20260812T010200Z-software-engineer-decision-5a70c3be
kind: decision
by: software-engineer
at: 2026-08-12T01:02:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-017-dev
  - ABC-017
  - ABC-016
  - ABC-018
  - ADR-0009
  - src/frame.test.ts
  - src/history-pane.ts
supersedes: 
---

# `A13` is MET IN PART, and the missing term is the one `ABC-016` has not shipped

> Hand-authored; `scripts/context-io.ts` is absent. Not a `finding`.

**`src/status-panel.ts` does not exist on `main`.** `ABC-016` is in `In Review`, not merged. This
was checked at source, not inferred from the board.

**Re-checked at the END of the hop, because `main` moved while this was being built.** The branch
was cut at `523eb30`; `main` is now `9fb55db`, two commits ahead. Both are `docs(board)` and
`git diff --stat 523eb30..main -- src/` is **empty — zero `src/` bytes**. So neither `ABC-016` nor
`ABC-027` has landed: `src/status-panel.ts` still does not exist and `src/frame.ts` still has no
per-row erase. **Nothing below changed as a result, and this branch's `src/` baseline is still
current with `main`'s.**

`A13` requires all three terms of `frameHeight` to read delivered geometry. Two of them can, and
now do. The third cannot be made live on this branch, and the reason is the exact cost `ADR-0009`'s
`## Context` measured and refused to pay: `tsconfig.json` includes `src/**/*.ts`, `npm run
typecheck` is project-wide `tsc --noEmit`, and `typecheck` is in `quality.mandatory_gates` under
`gate_enforcement: blocking`. An `import { STATUS_ROWS } from "./status-panel.ts"` here is `TS2307`
and turns **the whole project's blocking typecheck gate** red.

## What was done

| term | before | after |
|---|---|---|
| `board` | local shadow `const BOARD_ROWS = 9` | `renderBoard(parseFen(START_FEN), "unicode", "white-bottom").length` |
| `history` | local shadow `const HISTORY_ROWS = 8` | `import { HISTORY_ROWS } from "./history-pane.ts"` — the export, re-declared nowhere in the file |
| `status` | local shadow `const STATUS_ROWS = 3` | **unchanged, and flagged in a docblock at its own site** |

The `<= 24` requirement clause was added. **No third copy of `= 23` was added** — `## Test notes`
forbids it and it is right: `:288`'s `expect(HEIGHT).toBe(23)` and the composition test's first
assertion both go live the moment the shadows do, and `:288`'s comment calling itself *"near-vacuous
under fixed-height stubs"* was corrected because it is no longer true.

## The one thing I got wrong first, and it was caught by running a mutant

I first put the `<= 24` clause **beside** the `= 23` tripwire in the same `it`. Re-measured on M2
(history 9) and M3 (history 10): the tripwire asserts first, a failing assertion ends the test, and
**the requirement is never evaluated on any mutant that moves `H`.** So the failure output cannot
distinguish *"H is 24, `4b` is fine, ratify the change"* from *"H is 25, `4b` is unreachable"* —
which is precisely the distinction the ticket says keeping both clauses exists to draw
(*"a future row-count change can be ratified by moving one number without anyone having to
rediscover which of the two mattered"*).

The `<= 24` clause is now its own `it`, so both verdicts are always reported. Re-measured after the
split, and this table was RUN, not transcribed:

| mutant | `A1` (own clause) | `A13` `= 23` tripwire | `A13` `<= 24` requirement |
|---|---|---|---|
| delivered 9/3/8 | PASS | PASS | PASS |
| M2 history ships 9 | FAIL | **FAIL** | PASS |
| M3 history ships 10 | FAIL | **FAIL** | **FAIL** |
| M4 `renderBoard` ships 10 | **PASS** | **FAIL** | PASS |
| M5 board 10 + history 9 | FAIL | **FAIL** | **FAIL** |
| M7' history ships 7 | FAIL | **FAIL** | PASS |

Three things this confirms on delivered code rather than on ticket text. **M4 is caught by `A13`
and by nothing else** — `A1` passes it, which is why `ADR-0009` cl. 6's derived board term is not a
stylistic preference. **The `<= 24` clause is not a weaker `= 23`**: it separates M2/M4 (ratify)
from M3/M5 (`4b` dead). And **M1, M6 and the real M7 are not evaluable here at all**, because their
mutation is in a module that does not exist — simulating them by editing the shadow would be
measuring the assertion against itself.

## What is owed at the rebase onto merged `ABC-016`, and it is TWO edits

Recorded in a docblock at the constant's own site in `src/frame.test.ts` so a rebase hop cannot miss
it, and repeated here:

1. `const STATUS_ROWS = 3` becomes `import { STATUS_ROWS } from "./status-panel.ts"`.
2. **`statusStub` returns a HARDCODED three-element array while `historyStub` sizes itself from
   `HISTORY_ROWS`.** Once `STATUS_ROWS` is live the two can disagree and the failure surfaces at
   `expect([...counts]).toEqual([HEIGHT])` pointing at the wrong thing. Size the stub from the
   constant or use the real panel. `## Test notes` calls leaving it "the trap" and it is.

Until then M1 (status 4) and M6 (status 5) are caught by `ABC-016`'s own `A11` and by nothing in
`src/frame.test.ts`; M2, M3, M4 and M5 — **including both mutants that make epic `4b` unreachable** —
are caught by the two live terms. The suite is strictly stronger than it was, and it is not yet
what `A13` asks for.
