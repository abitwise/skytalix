---
id: 20260803T002000Z-software-engineer-artifact-ref-d5e71a30
kind: artifact-ref
by: software-engineer
at: 2026-08-03T00:20:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-011
  - ABC-011
  - EPIC-001
  - NFR-005
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

# What this dev hop produced, where each piece lives, and how each criterion was proved

Everything is on branch `grugops/ticket-to-pr-ABC-011`. **No PR exists — this repo has NO git
remote** (`git remote` is empty), so there is nowhere to push and no pull request to open. No
link was invented. The work is committed locally on the branch, the same posture `ABC-020` and
the `ABC-004..007` stack recorded. **A human holds merge and deploy; nothing was merged and
nothing was deployed.**

## The code

- `src/legal.ts` (**+55/−2**) — one new export, `hasLegalEnPassant`, plus the module-local
  `EP_CAPTURE_SIDES` table it steps over. `legalMoves`, `isInCheck` and `kingSquareOf` are
  unchanged.
- `src/zobrist.ts` (**+13/−1**) — one changed condition, one new import, and the header
  correction the ticket names (availability is decided by `src/legal.ts`; the function
  transiently mutates).

Byte-untouched: `src/gameend.ts`, `src/apply.ts`, `src/moves.ts`, `src/position.ts`,
`src/fen.ts`, `src/perft.ts`, `src/perft-bench.ts`, `package.json`, the lockfile. No dependency
was added; this project still has zero runtime dependencies.

## The tests

- `src/zobrist.test.ts` (**+125/−3**) — three new assertions inside the existing
  `describe("zobristKey")` block, plus the double-push property test in its own block with a
  local copy of the six perft FENs.
- `src/legal.test.ts` (**+72/−3**) — `describe("hasLegalEnPassant — ABC-011")`, six cases
  including the purity assertion.

**No existing test was modified.** The only changed pre-existing lines in either file are three
`import` lines widened to reach the new symbols; every other original line in both files is
byte-identical, verified by diffing each original line against the new file rather than by
inspection. `src/zobrist.test.ts:33-37` — the fixture the ticket names by line number — is
untouched and still passes.

## The docs

- `memory-bank/30-architecture.md` — both edits the ticket owes. The layering line is now
  `position ← {fen, moves} ← apply ← legal ← {zobrist, perft} ← {gameend, perft-bench}`, with
  the correction and the rejected `moves.ts` home named; the transient-mutation bullet now names
  `zobristKey` and states what it forecloses.
- `plans/board.md` — `ABC-011` moved `In Development` → `In Review`. In Development 1/3 → 0/3,
  In Review 0/3 → 1/3; no limit approached, no override taken. Header updated, exit comment
  under `## In Development`, entry comment under `## In Review`, live ticket row moved.
- `plans/tickets/ABC-011-…md` — front matter `status: in-review` / `column: In Review`; the move
  recorded in `## Definition of Ready` beside the design hop's.
- `plans/traceability.md` — `ABC-011`'s row updated **in place** (NFRs / Code / Tests / Status),
  prior text kept behind a `Previously:` marker. No row appended: one row per ticket is this
  file's own format rule.
- `AGENTS.md` — **deliberately unchanged.** No command changed, no command was added, and no
  `UNKNOWN - verify` slot became knowable. Editing it to look busy would be the fabrication the
  file's own header warns about.

## How each acceptance criterion was proved

| # | criterion | how | result |
|---|---|---|---|
| 1 | repro pair hashes **equal** | `src/zobrist.test.ts` "ignores an ep square no capture can use" | **green** (was red) |
| 2 | real-capture control stays **different** | `src/zobrist.test.ts` "still separates the pair where the ep capture is real" | **green**, green before and after |
| 3 | `src/zobrist.test.ts:33-37` stays different **and is not modified** | the test is byte-identical; verified by line-level diff against `HEAD` | **green**, untouched |
| 4 | double-push property over the perft table, oracle `legalMoves(...)` | `src/zobrist.test.ts` property block, 2 plies from all six roots, both halves asserted non-vacuous. Independently, an exhaustive walk at the suite's `fast` depths: 518,474 nodes / 81,397 ep-set / **0** violations for the shipped reading, 862 for board-only, 77,872 for merged | **green** |
| 5 | determinism + make/unmake round trip unchanged | the two pre-existing tests, untouched | **green** |
| 6 | suite green, skip count **0**, **no existing test modified** | `npm test` 184 passed / 8 files; skip count `0`; three widened import lines and nothing else | **green** |
| 7 | the `NFR-005` cost bar holds on the baseline's machine class | benchmarked merged-vs-ABC-011 in the same process, 300k iterations, interleaved, two samples, Apple M3 / Node v24.12.0 / darwin-arm64: startpos **302.9–306.5 ns** (bar ~450), kiwipete **309.1–315.6 ns** (bar 432–459); no-ep path **spied at 0 predicate calls over 260,292 no-ep nodes** | **MET** |

## Gate results, exactly as they ran

```
npm test           184 passed (8 files), 0 failed          [baseline on this branch: 174]
skip count         0
npm run lint       exit 0   (2 pre-existing biome config-schema infos)
npm run typecheck  exit 0
npm run build      exit 0
coverage           src/legal.ts 100%, src/zobrist.ts 100% stmt/branch/func/line
```

## The reasoning and the measurements

- `…/20260803T000500Z-software-engineer-decision-26794591.md` — the six ratified rules with how
  each was satisfied, the decisions that were mine (TDD, the walk depth, the local table, the
  non-vacuity assertions), and the five things I deliberately did not do.
- `…/20260803T001000Z-software-engineer-observation-4842932e.md` — the raw measurements: gates,
  the `NFR-005` table with its bar column, the amortized pool and its frequencies, the spy
  counts, the divergence sweep re-derived, purity, the rebuilt module graph, and the pooling
  error I made first and corrected.
- `…/20260803T001500Z-software-engineer-claim-99681208.md` — the five items this hop could not
  settle and everything carried rather than fixed, at `confidence: UNKNOWN - verify`.

## The harness — NOT in the repository, deliberately

Five throwaway scripts in the session scratchpad: `bench.ts` / `percall.ts`, `amortized.ts`,
`spy.ts`, `sweep.ts`, plus a pre-change copy of `src/` taken before the first edit. They import
the repo by absolute path and never write to it. **Not committed** — the same posture every
prior measurement on this project has taken; every number is transcribed into the observation
note with its machine, so nothing depends on them surviving.

## Substrate

Recorded rather than glossed, as every prior task here has: this install has no
`scripts/claim.js` and no `scripts/context-io.ts` / `mcp__grugops__propose_note`. The queue file
was moved `pending/` → `claimed/ticket-to-pr-ABC-011-dev/` → `done/ticket-to-pr-ABC-011-dev/`
**by hand**, and these four notes were **hand-written** into `notes/` in the schema's exact
shape. **No `finding` was written — none is admissible without a §14 gate — and nothing was
self-stamped.** There is no `index.md` / `index.jsonl` render because the renderer does not
exist here.
