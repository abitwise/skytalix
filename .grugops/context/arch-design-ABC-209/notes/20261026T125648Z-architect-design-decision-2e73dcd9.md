---
id: 20261026T125648Z-architect-design-decision-2e73dcd9
kind: decision
by: architect-design
at: 2026-10-26T12:56:48Z
verified_by: 
confidence: high for the shape, the clear points, the moved set (0) and the counts (deterministic, probed at d0b1fff8); the ADR-0025 amendment is PROPOSED and the owner's to accept; the D effect is UNKNOWN - verify
refs:
  - ABC-209
  - EPIC-008
  - ADR-0025
  - ADR-0026
  - ADR-0006
  - ADR-0002
  - ADR-0027
  - ADR-0032
  - ADR-0038
  - ADR-0050
  - NFR-009
  - NFR-005
  - A1
  - A2
  - A3
  - A4
  - A6
  - G1
  - G6
  - S1
  - T1
  - T5
  - QE-087-a
  - plans/tickets/ABC-209-the-transposition-table-is-kept-across-the-moves-of-one-game.md
  - memory-bank/50-decisions/ADR-0025-the-transposition-table-is-its-own-fixed-structure-cleared-per-search.md
  - orch-2026-10-26t/20261026T123731Z-orchestrator-decision-e496fc70
  - bapm-ready-ABC-209/20261026T123609Z-ba-pm-decision-955d0031
  - bapm-ready-ABC-209/20261026T123609Z-ba-pm-observation-0d64cbc5
  - arch-design-ABC-208/20261026T023232Z-architect-design-decision-012b1053
  - orch-2026-10-26c/20261026T010824Z-orchestrator-decision-d25ab770
  - owner-delegation-2026-10-22/20261022T140148Z-orchestrator-decision-5aaf7cec
  - owner-word-2026-10-23/20261023T203000Z-orchestrator-decision-7feb0553
  - grugops/arch-design-ABC-209
  - d0b1fff8
supersedes: 
seal: sha256:df7c6c771d9bb3b1d4382f0aa87d5f2c4b6d56ddfa16782adefc2a7d11dc91f7
---

# Architect/Design: ABC-209 designed. The ADR-0025 decision 4 amendment is PROPOSED (the owner's to accept; reading b). The table lives one game, held by an opaque game token; no token means cleared as today, which is the clear door. One strict-prefix tracker in src/transposition.ts, held by the CLI level seam and the UCI session. 4 MiB, always-replace, no ageing. 0 pins move. S holds, no split

Task `arch-design-ABC-209`, records plus probes, at `main` `d0b1fff8`, branch `grugops/arch-design-ABC-209`. Full text:
`memory-bank/50-decisions/ADR-0025-…md` § "Proposed amendment 2026-10-26 (`ABC-209`)" and `plans/tickets/ABC-209-…md`
§ Design ruling. The probes are in this task's observation note. Inputs: the page, BA/PM `…955d0031` / `…0d64cbc5`, and
Orchestrator `…e496fc70` (reading b). The model hop is `arch-design-ABC-208` `…012b1053`.

## The ADR
- **Form: an amendment to `ADR-0025` decision 4, PROPOSED.**
  - Only one clause changes, and the ADR itself priced it (§ Alternatives "now, not forever"; § Rollback).
  - The cites to "Decision 4" stay live.
  - The repo's precedent is the same form (`ADR-0026` 2026-10-24, `ADR-0023` 2026-10-26).
- **Acceptance is the owner's** (`…5aaf7cec` item 3). **Reading (b):** the build may proceed, and the ALONE reading
  and the merge wait on his acceptance. If D is not a GAIN, a dated line records "accepted, not in force".

## The ruling
1. **Lifetime: one game, held by a token.** `EngineOptions.game?: object`. `deepen` calls `prepareTable(options.game)`,
   which clears unless `game` is the table's holder. Without a token, every call clears at entry as today.
2. **The clear door (Scope 2):** `chooseMove` and its three doors called without `game`. They are the pre-ticket
   engine node for node. No new export; `clearTable` stays exported.
3. **`search()` keeps its per-call clear**, which also releases the holder.
4. **The continuation rule:** `createGameTracker()` in `src/transposition.ts` returns the same token iff the start is
   the same and the previous search's moves are a **strict prefix** of this search's moves. It errs towards
   clearing.
   - Owners: the CLI level seam (`src/level-seam.ts`, keyed on `history.initialFen` and `history.moves`) and the UCI
     session (replaced at `ucinewgame`; it keys on the accepted `position` line).
   - The **CLI `new` command** (`ABC-046`) reuses the same seam and level instance, so the token cannot be
     per-instance.
5. **Clear points:**
   - a call with no token;
   - `search()`;
   - CLI: the process starts, `new`, and `undo`;
   - UCI: `ucinewgame`, a `position` that does not extend the previous search's line, and the same position
     searched again.
   - Book moves keep the table.
6. **`createLevel`** spreads `game` into `chooseMove` only when it is present, and only on the engine path. **The
   blunder path does not share** (test note 2): its children carry no token. The ladder passes none, so it is
   unchanged.
7. **Size 4 MiB, unchanged.** **Always replace, unchanged; no generation or ageing.** There are no free bits (17 + 2
   + 13 = 32), and a stale entry is never wrong (exact depth, verified key). New falsifier `T5`; `T1` is re-read as
   D.
8. **`A1` is held by construction:** a cleared table equals a fresh process's. Frozen-clock 8 of 8 are equal.
9. **The `NFR-009` growth probe QE runs:** the `A4` row, under `--expose-gc`, 40 engine searches through one token,
   with `heapUsed` and `arrayBuffers` read after `gc()` at search 1 and search 40. **≤ 1 MiB each; over is a STOP.**
10. **Texts that rely on per-search clearing stay true:** `ADR-0026` d7's 2026-09-26 sentence and `ADR-0006`'s two
    errata. No edit is owed.
11. **The clear lines at `d0b1fff8`:** `src/engine.ts:550` `clearTable();` becomes `prepareTable(options.game);`.
    `src/search.ts:605` is unchanged.

## Moved pins and size
- **0 red rows, 0 re-points.** No value pin, relation, level or NFR bound moves. No STOP.
- **`S` holds; no split.** About 45–65 production lines in five files, plus comment rewrites and the `A1`–`A4` rows.

## Owed by others
- **Owner:** accept or decline the amendment. The Orchestrator reports it (`…7feb0553` item 2).
- **BA/PM page lines (no criterion change):**
  - Scope 1 adds the CLI's in-game `new` as an entry path;
  - Scope 2's "test-only clear door" reads as `chooseMove` without a token, with no new export;
  - Scope 3 names the amendment's form;
  - test note 2 is answered: no sharing;
  - `A4` names the 40-move row's shape.
- **QE (at build):** the `A1`–`A4` rows; the 8-count pre-check (base = head).
- `plans/board.md`, `plans/traceability.md`, `plans/nfr-catalog.md`, `EPIC-008`, `src/`: not touched.
