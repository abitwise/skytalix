---
id: ABC-230
title: "The game's earlier positions reach the search, from the CLI and from UCI, so it sees a repetition the game already holds; a bare FEN still has none"
status: backlog
column: Backlog
size: M
priority: P2
epic: EPIC-010
---

# ABC-230: game history into the search

> **Cut 2026-10-29 by BA/PM** (task `bapm-epic010-improvements`, records only, at `main` `f45aea95`). § B item 3,
> verified by the SA (`…306a4012` rows 3a–3c, 3e). **Waits in Backlog on:** `ABC-226`'s count (it sets this ticket's
> milestone), an ADR reading, and the owner's Q4. The en-passant key point is Q3, not this ticket.

> **AMENDED 2026-10-29 by BA/PM** (task `bapm-owner-words-b`, records only): the owner set Q4 = (e), extended
> (`orch-2026-10-29g` `…278e149b`). This ticket's reading is now the smoke pair before merge (`EPIC-010` § The
> merge rule), with a batched validation later. Q4 no longer holds it. **Next real wait:** the Architect's ADR reading (`ADR-0002` clause 3, `ABC-081` `A6`, `ADR-0044` D3). `ABC-226` is Done (SA `…cc53fc79`: 484 costed games, R 26), so this ticket stays in milestone 1. DoR 8/10 → 9/10.

> **FOLDED 2026-10-30 by BA/PM** (task `bapm-ABC-230-fold`, records only, at `main` `0c37165a`): `ADR-0054`
> (**PROPOSED**; Architect `arch-ABC-230-reading` `…90a3aa31`, `…e7e6b651`) folded into § Scope, § Acceptance and
> § Dependencies. Scope 3 and 5, the `A1` wording and the `A5` window changed. `A8` (probe H2) and `A9` (probe H4)
> were added. **Waits in Backlog on one thing: the owner's acceptance of `ADR-0054`.** DoR stays 9/10, and row 10 now
> names that acceptance. The ticket is build-ready once he accepts.

## Problem

- **User:** the owner in the CLI and a GUI over UCI.
- **Pain:** `repeatsInPath` scans the per-ply key array only (`src/search.ts:129-138`), seeded with the root's key
  alone (`src/engine.ts:549`). Both seams pass `history.position` only (`src/engine.ts:604`, `src/level-seam.ts:17`);
  the UCI parser replays the moves and keeps the final `Position` (`src/uci-session.ts:119-141`). So the search cannot
  see that a move repeats a position from earlier in the game: it can walk into a draw when winning or miss one when
  losing. `ABC-226` counted 484 games where this cost a result (R 26).
- **Value:** the search scores a move that repeats a game position the way the game will end it.

## Scope

The design is `ADR-0054` § Decision. It binds once the owner accepts it. This page states the outcomes.

1. **Prior keys in.** The search takes `priorKeys`, a read-only list of the Zobrist keys of the game's positions
   before the root: oldest first, root excluded, at most `min(root halfmove clock, 100)`. It is an optional
   `EngineOptions` field, and when it is absent or empty the search is base. One pure helper trims the list for both
   surfaces. The engine does not copy the list. `src/history.ts` is not imported into the search (`ABC-081` `A6`).
2. **Both surfaces build it.**
   - **CLI:** `cli.ts` injects `keyHistory` into the level seam. The licence set stays `["turn-loop.ts", "cli.ts"]`.
     On the blunder path (levels 1–4), each child search gets the prior keys plus the root's key.
   - **UCI:** `parsePosition` keeps the keys it replays through (the `ADR-0044` D2 amendment). `ucinewgame`, a refused
     `position` and `position fen <F>` with no moves set the list to empty.
3. **The repetition rule.** On the path it is unchanged: one earlier occurrence, root included, is a draw. **Before
   the root, a repetition needs two earlier occurrences.** One is not a draw. The draw score is exactly 0. The order is
   unchanged: repetition, then capacity, then the table.
4. **A bare FEN carries no history.** This stays explicit (a test row). A CLI game started from a FEN sees only the
   moves played after it.
5. **No `ADR-0026` d10 door** (`ADR-0054` decision 7): this is an exact input, not a heuristic, and an absent list is
   base. It is **value-changing**, so `EPIC-010` § The merge rule's 10 D + 10 R smoke pair applies (`A7`, S-1..S-4).
   Exact rows (`A1`–`A5`, `A8`, `A9`) replace a drift oracle.

## Out of scope

- The ep key (`ADR-0020` d2; owner Q3, open: default and recommendation (a) keep; remedy (c) is a separate S ticket
  on his word). The game-end threefold in `src/history.ts` / `gameStatus` (unchanged).
- The table (`ADR-0025`: no rule change, still cleared per search). Quiescence, `search()` and the test-only doors
  take no prior keys. Quiescence's blindness to prior positions stays as it is.
- Draw-score tuning (contempt).

## Acceptance criteria

- **A1 (CLI, third occurrence).** **Given** a game in the CLI where position P has stood twice in the reversible
  window and a legal move returns to it, **when** the engine searches, **then** that move scores exactly 0 at the
  root, and base (no prior keys) scores it otherwise (probe H1: Ke8 0 against base's Kc8 −1006). ≥ 4 fixture games,
  both colours. On a blunder level (1–4), each child search is handed the prior keys plus the root's key, read on
  an injected seam.
- **A2 (UCI).** **Given** `position startpos moves …` reaching the same fixtures, **then** the root scores are the
  same as in A1, and `bestmove` is byte-equal to the CLI's on each.
- **A3 (bare FEN).** **Given** `position fen <F>` with no moves, **then** the search's prior-key list is empty, and
  the result equals base node for node (probe H5). The same holds for a `ucinewgame` and a refused `position`.
- **A4 (identity elsewhere).** **Given** the `ABC-078` `A3` corpus (positions without game history), **then** the
  search is node-equal to base.
- **A5 (bounds).** **Given** a UCI move list of 600 plies, **then** the keys handed in are only those since the
  halfmove clock last reset (a castling-rights change is not a cut), root excluded, never more than 100. A prior key
  older than the root clock is never matched (a row). `NFR-009` growth ≤ 1 MiB between 1 s and 3 s searches holds.
- **A6 (gates).** `G1`, `G5`, `G6` "≥ base" (floor 6), `G7`, `G8`, `G9`. These rows also stay green **unchanged**: the
  `ABC-081` `A6` import and one-array rows, the `ADR-0011` licence equality, and every bare-FEN node pin. A red in any
  of them is a build fault, not a re-pin.
- **A7 (the reading).** The smoke pair of `EPIC-010` § The merge rule (owner Q4 = (e), extended, 2026-10-29), on the candidate head rebased on `main`, before the merge: S-1 0 faults, S-2 0 losses on time, S-3 D ≥ 3.0 of 10 (else ≥ 7.0 of 20), S-4 R ≥ 3.0 of 10 (else ≥ 7.0 of 20). Reported: each smoke's W/L/D and score, the ledger's pooled R score since the last batch, and the count of smoke games that end by repetition, candidate against base.
- **A8 (second occurrence, the two-match rule).** **Given** a position P that stood **once** before the root, and a
  legal move that returns to it (a second occurrence), **when** the engine searches, **then** that move keeps base's
  score, and the root's move and score equal base's (probe H2: Kc8 −1006, where a one-match rule plays Ke8 at 0).
- **A9 (root clock 0).** **Given** prior keys handed in untrimmed with the root's halfmove clock at 0, **then** the
  search is node-equal to base (probe H4).

## NFR triggers

- **`NFR-009`:** A5 (≤ 100 keys read; no copy, so one key array per search). **`NFR-005`:** `G6` (the benchmarks
  carry no prior keys, so it cannot move). **`NFR-008`:** fixed-depth, virtual-clock rows only.
- **Cost:** a node scans before the root only when its clock exceeds its ply, at most 50 more comparisons. The time
  is `UNKNOWN - verify` on this host and is read by S-2.
- **Security (ASVS L1):** the UCI move list now feeds the search. Bounded by A5; no new parsing. Security/NFR reads it
  at the gate (`RISK-EPIC010-06`).

## Test notes

1. Fixture games built from a short shuffle (for example Nf3 Nf6 Ng1 Ng8 twice), the probe H fixtures
   (`.grugops/context/arch-ABC-230-reading/raw/history.mts`), and one R game from `sa-ABC-226`'s `A3` list if one
   replays to a fixture.
2. Each row from `A1`, `A8` and `A9` is pinned against base in the same run. If `A8` turns red, the two-match count
   has slipped to one (`ADR-0054` § Rollback).
3. UAT is owed (production lines on both surfaces). The QE verdict signs it.

## Size and priority

- **Size: M.** Two surfaces and one search input; no new heuristic. Files: `ADR-0054` § Consequences.
- **Priority: P2,** milestone 1 (`ABC-226` `A5`: 484 ≥ 1).

## Dependencies

- **`ABC-226`** Done.
- **`ADR-0054` PROPOSED; the owner accepts it** (`…5aaf7cec` item 3: it adds to `ADR-0002` clause 3 and amends
  `ADR-0044` D2/D6, both owner-accepted). This ticket is pulled only after he accepts. The Architect's note allows a
  build against the proposed text, with the smokes and the merge waiting. This page waits for the whole ticket, per
  the fold's brief, and the Orchestrator may choose otherwise. On acceptance, an Architect/Design hop adds dated lines
  to `ADR-0002` and `ADR-0044`.
- **Owner:** Q4 answered 2026-10-29: (e), extended (`orch-2026-10-29g` `…278e149b`). Q3 is open, with default and
  recommendation (a) keep. It blocks nothing here, and its remedy (c) would be a separate ticket.
- Shares `src/uci-session.ts` with `EPIC-009`'s `ABC-220`/`ABC-221`; whichever merges second rebases.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ SA 3a–3c; `ABC-226` 484 games |
| 2 | scope and out-of-scope | ✅ 5 items per `ADR-0054`; ep, table, quiescence out |
| 3 | INVEST | ✅ independent of 228/229; M |
| 4 | testable, measurable acceptance | ✅ A1–A9 exact (0, base-equal, node-equal, ≤ 100); A7 the smoke pair |
| 5 | dependencies known | ✅ `ABC-226` (Done); `ADR-0054` (PROPOSED) |
| 6 | NFR triggers with targets | ✅ ≤ 100 keys; ≤ 1 MiB growth; `G6` floor |
| 7 | test notes | ✅ 3 |
| 8 | size | ✅ M |
| 9 | priority | ✅ P2, milestone 1 |
| 10 | no major unresolved blocker | ❌ the owner's acceptance of `ADR-0054` |

**DoR 9/10 (re-scored 2026-10-30, `bapm-ABC-230-fold`). Backlog until the owner accepts `ADR-0054`, then 10/10 →
Ready.**
