---
task: wave-2026-09-19
subtask: qe-ABC-075
role: qe-e2e
workflow: agent-factory/workflows/05-pr-quality-gate.md
ticket: plans/tickets/ABC-075-incremental-zobrist-key-seam.md
ref: .grugops/context/qe-ABC-075/
build_ref: .grugops/context/ticket-to-pr-ABC-075/
ruling_ref: .grugops/context/ruling-abc075-ep-square/
enqueued_by: orchestrator
enqueued_at: 2026-09-20T02:00:00Z
branch: grugops/qe-ABC-075
base: grugops/wave-2026-09-19 (build 40b77ac / ba4f8ba merged at e8b1fe6; lane 42 / 1305 / 0)
---

# Subtask: QE `ABC-075` — break the incremental Zobrist key, and rule the flagged re-point

The build: `src/zobrist.ts` +71/−15 (`zobristKeyAfterMove`; ep clause = `epSquare !== NO_SQUARE`;
`hasLegalEnPassant` import removed), `src/zobrist.test.ts` +250/−64, `src/zobrist.nfr.test.ts`
+19/−30, `memory-bank/30-architecture.md` (the two edits `ADR-0020` named). Read the Engineer's
notes in `build_ref:` (the `decision` § 7 "enumeration gap" and the flagged interpretation FIRST),
`ADR-0020` Decision 1 verbatim, Architect/Design's `observation` note in `ruling_ref:` (which rows
it said go red and which "stay green, stay"), the ticket's `A1`–`A6` and § Ruling applied.

## Rule this first — the flagged interpretation
Ten `it.each` rows at `src/zobrist.test.ts:276` (`CONTRADICTORY_EP`) and `:308`
(`EP_CONTRADICTED_BY_THE_WRONG_PIECE`) went RED and the Engineer re-pointed `toBe` → `not.toBe`
("omits" → "carries"), arguing `ADR-0020` Decision 1 verbatim makes a contradicted-but-present ep
square hash differently. Architect/Design's note had listed them as "stay green". Decide: (a) the
Engineer is right and the Architect's list was incomplete, (b) the Architect meant them to stay
green and the build should have normalised — which would contradict Decision 1 — or (c) something
else. Cite the sentence. If (b), FAIL with the row named. The subtask told the Engineer "any other
red is a stop"; say whether proceeding was right.

## Then break it
- Re-run the four gates; expect 42 / 1305 / 0. `ZOBRIST_DEEP=1 npx vitest run src/zobrist.test.ts`
  to completion (Engineer: 33 passed, 11,024,485 nodes, 0 mismatches, ~40 s) — reproduce.
- Mutants, at minimum: (a) ep component XORed on the ep square being set only when a capturer is
  adjacent; (b) castling-rights delta uses the rights BEFORE the move for both halves; (c) the
  captured piece not XORed out on an ep capture (the captured pawn is not on `move.to`);
  (d) promotion XORs the pawn in on `to` instead of the promoted piece; (e) side-to-move toggle
  dropped; (f) `keyBefore` ignored (recomputed from scratch — a correct-but-slow mutant: does `A5`'s
  ≥ 5x bar catch it? if the bar is not asserted in the lane, that is a gap); (g) castling rook
  move not XORed. Each: rows RED or NONE. Revert via `git checkout --`; confirm clean.
- `A5` ratio: reproduce roughly (Engineer 9.19x, bench in `raw-a5-bench.ts.txt`); note load.
- The two stale comments the Engineer flagged and left (`withEpComponent`, NO_SQUARE-guard block):
  false sentences under `ABC-114`'s standard, or fine? Name them for the pen that holds them.
- `hasLegalEnPassant` now has no production caller — confirm by grep; a residual for BA/PM.
- `test-skip-integrity` → `No findings.`; skip 0.

## Do not
- Do not "fix" the build. Do not touch `src/search.*`, `src/quiescence.*`, `src/engine.*`
  (`ABC-079` re-hop live), `src/command-input.*` (`ABC-045` live). Do not open `plans/board.md`,
  `AGENTS.md` (the `ZOBRIST_DEEP` line is owed by the Scribe, not you), `plans/nfr-catalog.md`.
- Do not rule NFR-008 (19.7 → 20.5 s at load 5–13, non-conforming).
- No merge, no deploy. Own `git worktree`; commit messages via a UNIQUELY-NAMED scratchpad file
  and `git commit -F`; gates/mutants via node scripts (hook refuses `$?`, `npm run`).

## Publish
PASS or FAIL as a `decision` note, mutants as `observation` with raw output, trace row, ticket §
QE. Claim by hand per Workflow 17: `mkdir .grugops/queue/claimed/qe-ABC-075`, move this file in,
then out to `done/`. Report: verdict, the re-point ruling, mutant table, deep-lane numbers, sha,
numstat.
