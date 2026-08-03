---
id: 20260803T151500Z-software-engineer-artifact-ref-a2d84f30
kind: artifact-ref
by: software-engineer
at: 2026-08-03T15:15:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-011
  - ABC-011
  - EPIC-001
  - NFR-005
  - ADR-0005
  - src/legal.ts
  - src/zobrist.ts
  - src/legal.test.ts
  - src/zobrist.test.ts
  - memory-bank/30-architecture.md
  - plans/board.md
  - plans/traceability.md
  - plans/tickets/ABC-011-zobrist-en-passant-hashing.md
supersedes: 
---

# What this second dev pass produced, where each piece lives, and how each thing owed was proved

Everything is on branch `grugops/ticket-to-pr-ABC-011`, on top of the QE, Security/NFR and second
design hop work. **No branch was created.** **No PR exists — this repo has NO git remote**
(`git remote` is empty), so there is nowhere to push and no link to record; **no link was invented**.
The work is committed locally on the branch, the same posture every prior hop here recorded.
**Nothing was merged and nothing was deployed; a human holds both.**

## The code

- `src/legal.ts` (**+32/−6**) — the two precondition guards and one hoisted `const captured` above
  the `EP_CAPTURE_SIDES` loop, plus the doc-comment correction item 9 owes. **Only four of the added
  lines are executable**; the rest is the comment that says which guard buys which property and why
  neither folds into the other. `legalMoves`, `isInCheck` and `kingSquareOf` are unchanged.
- `src/zobrist.ts` (**+5/−1**) — **doc comment only.** The header now bounds the transient mutation
  by the predicate's precondition and states that the position comes back byte-identical on every
  input, invalid FENs included. `zobristKey`'s body, its condition and its signature are
  byte-unchanged.

Byte-untouched: `src/apply.ts`, `src/moves.ts`, `src/gameend.ts`, `src/position.ts`, `src/fen.ts`,
`src/perft.ts`, `src/perft-bench.ts`, `package.json`, the lockfile. No dependency added; this project
still has zero runtime dependencies.

## The tests

- `src/legal.test.ts` (**+95/−0**) — `describe("hasLegalEnPassant — ABC-011 the probe's
  precondition")`: six probe FENs each asserting `false` **and** the full position state unchanged,
  plus one test sweeping **every** ep-square value (all 128 0x88 indices, the 64 off-board ones
  included, plus five values outside the array) across five boards — 665 inputs, which subsumes the
  design hop's `a1` boundary probe rather than shipping it as coverage.
- `src/zobrist.test.ts` (**+35/−0**) — `describe("ABC-011 — zobristKey where the board contradicts
  the ep square")`: the same six FENs at the key level, asserting the ep component is omitted (the
  position hashes exactly as it would with no ep square) and the position comes back intact.

**Purity is compared over the FULL position state** — all 128 board bytes plus `blackToMove`,
`castling`, `epSquare`, `halfmoveClock`, `fullmoveNumber` — **never through `toFen`**, which sees
neither an off-board write nor the counters.

**NO EXISTING TEST WAS MODIFIED, and this pass is stricter than the last:** `git diff` reports
**zero** removed-or-changed pre-existing lines in either file. Both blocks are pure appends and **no
import was widened** — the first pass widened three. `src/zobrist.test.ts:33-37`, the fixture the
ticket names by line number, is untouched and green.

## The docs

- `memory-bank/30-architecture.md` — the **`Hashing` row** of the module table, the one-cell content
  correction QE, Security/NFR and Architect/Design each named and none took. It now says `zobrist.ts`
  asks `legal.ts` whether an en-passant capture is real, so the row no longer reads as a
  self-contained leaf. **The table was NOT reordered** and the layering line and transient-mutation
  bullet were not re-edited — the first pass already corrected those and they are still true.
- `AGENTS.md` — **deliberately unchanged.** No command changed, none was added, and no
  `UNKNOWN - verify` slot became knowable.

## The delivery state

- `plans/board.md` — `ABC-011` moved **`In Development` → `In Review`**. In Development 1/3 → 0/3,
  In Review 0/3 → 1/3; no limit approached, no override taken, no written reason owed. Header
  updated, exit comment under `## In Development` carrying the mutant table, entry comment under
  `## In Review` telling the next gate what is a delta and what is not, live ticket row moved.
- `plans/tickets/ABC-011-…md` — front matter `status: in-review` / `column: In Review`; the move
  recorded in `## Definition of Ready` beside the two design hops' and the first dev pass's, with the
  guard code, the mutant table, the diff shape, the gates and the re-derived `NFR-005` figures.
  **No acceptance criterion, reproduction FEN, `NFR-005` bar or `## Out of scope` line was edited,
  and neither `### ANSWERED` block was touched.**
- `plans/traceability.md` — `ABC-011`'s row updated **in place** (NFRs / Code / Tests / Status),
  prior text behind `Previously` markers. **No row appended:** one row per ticket is this file's own
  format rule. The **UAT** cell is untouched and still reads `deferred — EPIC-006`.

## How each thing this pass owed was proved

| owed | how | result |
|---|---|---|
| the MEDIUM purity defect is fixed | two guards above the loop; six reproductions re-derived independently first, then closed | **closed**, all six |
| each guard is load-bearing | each **deleted** from `src/` in turn and the full suite run | (a) → **4** fail, (b) → **7** fail, **disjoint**; both → 13 |
| purity for EVERY input, not reachable ones | full-position-state sweep over 133 ep-square values × 5 boards | **665 inputs, 0 impure** |
| purity asserted by state, not inspection | 128 board bytes + 5 scalars, never `toFen` | in both test blocks |
| nothing reachable changes | exhaustive walk of the perft table at `fast` depths, both trees in one process | **518,474 / 81,397 / 0 / 0 / 0 / 0** |
| no existing test modified | line-level `git diff` on both test files | **0** changed pre-existing lines |
| the mandatory gates | `npm test`, `npm run lint`, `npm run typecheck`, `npm run build` | **206 passed / skip 0**, all **exit 0** |
| the cost consequence | pre-fix vs guarded in one process, 9 alternating rounds, medians, null control | **≤ +0.41 ns/node amortized**, `NFR-005` **MET** |

## The reasoning and the measurements

- `…/20260803T150000Z-software-engineer-decision-3b7c1f42.md` — the change, why the two guards stayed
  two and how that was proved, the decisions that were mine (TDD, the state comparison, the sweep,
  zero widened imports, taking the architecture cell), and what I deliberately did not do.
- `…/20260803T150500Z-software-engineer-observation-8c4d2a17.md` — the raw record: the reproduction
  table, the three mutants with every failing test named, the measured red, the exhaustive walk, both
  cost tables **including the first protocol that was wrong and why its null control exposed it**,
  and the gates.
- `…/20260803T151000Z-software-engineer-claim-5e91d0b6.md` — the five things this pass could not
  settle at `confidence: UNKNOWN - verify`, including the one that will matter later: guard (a) is a
  defence against a `generateMoves` defect owned by BA/PM, so it is a workaround with a named owner
  rather than a permanent design fact.

## The harness — NOT in the repository, deliberately

Four throwaway scripts in the session scratchpad plus a guard-stripped copy of `src/`: `repro2.ts`,
`sweep2.ts`, `bench2.ts` (the wrong protocol, kept because its null-control failure is why the next
one exists) and `bench2b.ts`. They import the repo by absolute path and never write to it. **Not
committed** — the same posture every prior measurement here has taken; every number is transcribed
into the observation note with its machine, so nothing depends on them surviving.

**One caution for whoever rebuilds them**, added to the design hop's: benchmark the two `NFR-005`
anchor positions as a **null control** before believing any ep-set number. Their delta is
structurally zero, so whatever spread they show is the instrument's floor — mine showed ratios up to
1.26 on a first protocol that looked perfectly reasonable.

## Substrate

Recorded rather than glossed, as every prior task here has: this install has **no `scripts/`
directory at all** — no `scripts/claim.js` and no `scripts/context-io.ts` /
`mcp__grugops__propose_note`. The queue file was moved
`pending/` → `claimed/ticket-to-pr-ABC-011-dev2/` → `done/ticket-to-pr-ABC-011-dev2/` **by hand**,
with a `claim.md` registry record written by hand alongside it, and these four notes were
**hand-written** into `notes/` in the schema's exact shape. **No `finding` was written — none is
admissible without a §14 gate to issue a `§14-gate#<id>` stamp, and `context.human_admission` is
`off` so no `human:<name>` stamp is available either. Nothing was self-stamped.** There is no
`index.md` / `index.jsonl` render because the renderer does not exist here.
