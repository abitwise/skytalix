---
subtask: arch-design-ABC-209
role: architect-design
ticket: plans/tickets/ABC-209-the-transposition-table-is-kept-across-the-moves-of-one-game.md
ref: .grugops/context/arch-design-ABC-209/
branch: new grugops/arch-design-ABC-209 from main, worktree ../wt-arch-design-ABC-209
width: 1 of 3 — no real-clock timing (probes on scratch clones only; frozen-clock counts allowed)
---

# ABC-209 design: a per-game transposition table (ADR-0025 D4 change PROPOSED → owner)

## Do
- Read Orchestrator `orch-2026-10-26t/…e496fc70` and BA/PM `bapm-ready-ABC-209/…955d0031`, `…0d64cbc5`.
- Use the ABC-208 design hop (`arch-design-ABC-208/…012b1053`) as the model.
- **ADR:** write the change to ADR-0025 decision 4 ("does not persist across moves") as **PROPOSED**. Pick the form, an amendment or a new ADR that supersedes D4, and say why.
  - Acceptance is the owner's. No agent marks it accepted.
  - State the reading (b) gate: the build may proceed, and the ALONE reading and the merge wait on his acceptance.
- **Rule on:**
  - the clear points (new game, `ucinewgame`, and any others);
  - the 4 MiB size staying unchanged;
  - generation/ageing or replacement, if any;
  - how A1 "fresh game node-equal" is held;
  - the NFR-009 growth check: ≤ 1 MiB over 40 moves, and going over is a STOP. Name the probe QE runs.
  - Re-cite the clear lines (`src/engine.ts:550`, `src/search.ts:605`) at main's tip.
- **Probes**, on scratch clones of main only and never in `src/`:
  - Which pins and rows move. Name each one; no value pin or bound moves without a STOP to me.
  - The frozen-clock d7/d8 counts for base vs a prototype. They are expected to be equal by A1.
  - A rough look at the second-move node savings in one game. Record it only; it is not a reading.
- **Size check:** S as cut, or a split.
- Write the `## Design ruling` into the ticket page. Page amendments that BA/PM must make go in your Result as lines.

## Fences
- Work only in your worktree and `<scratchpad>/arch209/`. No `src/` commits.
- No real-clock search, no G2/G5/G6, and no D.
- Never push, force, amend or rebase. Never merge into main. No board edits.
- Records: class and count only (ADR-0049 d4).

## Publish
- Commit on your branch. Seal notes (task `arch-design-ABC-209`) with `at` taken from `date -u`.
- Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.

## Result

Architect/Design, 2026-10-26. Branch `grugops/arch-design-ABC-209` @ `4c6bdf52` (= `main` `d0b1fff8` + records; not
pushed, not merged). `main` is still at `d0b1fff8`. The probes ran on scratch clones in `<scratchpad>/arch209/`:
`base`, and `hd`, the design hardcoded. No `src/` edit was committed. No real-clock timing was run; real-clock deep rows
were filtered by name. No `G2`, `G5` or `G6`, and no D.

- **ADR: an amendment to `ADR-0025` decision 4, PROPOSED**, at the end of that file, with a dated Status pointer at
  the top.
  - **Why an amendment and not a new ADR:** one clause changes, and the ADR itself priced the change (§ Alternatives
    "now, not forever"; § Rollback). The "Decision 4" cites stay live. `ADR-0026` and `ADR-0023` set the precedent.
  - **Acceptance is the owner's. Reading (b):** the build may proceed, and the ALONE reading and the merge wait on his
    acceptance. If D is not a GAIN, a dated line records "accepted, not in force".
- **Ruling:**
  - **The lifetime is one game, held by an opaque token.** `EngineOptions.game?: object`.
    `prepareTable(options.game)` replaces `clearTable()` at `src/engine.ts:550`: it clears unless the token is the
    table's holder.
  - **No token means cleared at entry, as today.** That is the Scope 2 clear door, and it adds no new export.
  - **`search()` keeps its clear** (`src/search.ts:605`, unchanged), which also releases the holder.
  - **One rule:** `createGameTracker()` in `src/transposition.ts` keeps the same token iff the start is the same and
    the previous search's moves are a **strict prefix** of this one's.
  - **Owners:** the CLI level seam and the UCI session (a new tracker at `ucinewgame`). The CLI's in-game `new`
    (`ABC-046`) reuses the seam and the level instance, so a per-instance token would carry game A into game B.
  - **Clear points:**
    - a call with no token;
    - `search()`;
    - CLI: the process starts, `new`, and `undo`;
    - UCI: `ucinewgame`, a non-continuing `position`, and the same position searched again.
    - Book moves keep the table.
  - **The blunder path does not share** (test note 2): its children carry no token. The ladder passes none, so it is
    unchanged.
  - **4 MiB, unchanged.** **Always replace, unchanged; no generation or ageing:** no free bits, and a stale entry is
    never wrong. `T5` is added; `T1` is re-read as D.
  - **`A1` is held by construction.** Frozen-clock d7/d8 are 8 of 8 equal (kiwipete 590 489 / 1 259 463; position-6
    180 941 / 355 565). The UCI `ucinewgame`, non-continuing, re-ask and CLI `new` paths each equal a fresh process.
  - **The `NFR-009` probe QE runs:** the `A4` row, under `--expose-gc`, 40 engine searches through one token, with
    `heapUsed` and `arrayBuffers` read after `gc()` at search 1 and search 40. **≤ 1 MiB each; over is a STOP.**
    Design record: Δ 41 024 B / 0 B; table 4 194 304 B.
  - The `ADR-0026` d7 sentence and the `ADR-0006` errata stay true; no edit.
- **Moved-pin set: 0 red rows and 0 re-points.** No value pin, relation, level or NFR bound moves. **No STOP.**
  - Default lane: base 2 128 and `hd` 2 128, both 2 128 / 2 128.
  - Deep lanes (`PUZZLE_DEEP`; `SEARCH_DEEP` ×6; `ENGINE_DEEP` ×6): identical file by file, with 12 real-clock rows
    filtered.
- **Second-move savings (record only):** one-sided at d7 frozen, the second move costs 0.95× / 1.00× / 1.48× and
  moves 2–8 cost 0.94× / 0.96× / 0.97× (kiwipete / position-6 / start). Root hits are 19/21. The expected D effect is
  small (`UNKNOWN - verify`).
- **Size: `S` holds; no split.** About 45–65 production lines in five files (`src/transposition.ts`,
  `src/engine.ts`, `src/levels.ts`, `src/level-seam.ts`, `src/uci-session.ts`), plus comment rewrites and the `A1`–`A4`
  rows.
- **Owner:** accept or decline the `ADR-0025` amendment. Nothing else.
- **BA/PM page lines (no criterion change):**
  - Scope 1: add the CLI's in-game `new` (`src/command-input.ts:123`, a take-back to the start) as a third clear path.
    `A2`'s "CLI new-game path" covers `new`, not only the process start.
  - Scope 2: the "test-only clear door" is `chooseMove` (and its three doors) called without a `game` token, with no
    new export. `clearTable` stays exported.
  - Scope 3 and the front-matter `adr`: "a PROPOSED amendment to `ADR-0025` decision 4 (§ Proposed amendment
    2026-10-26)".
  - Test note 2 is answered: the blunder path does not share the table.
  - `A4`'s 40-move clause: name the row's shape (40 engine searches through one token, read after `gc()` at search 1
    and search 40).
  - `A3`: QE picks a pair whose reply is the stored hash move. 19 of 21 roots were found in the probe.
- **Notes** (`.grugops/context/arch-design-ABC-209/notes/`): decision `…2e73dcd9`, observation `…b7d4b710`.

**Trace row** (for the Orchestrator):

| ABC-209 (arch-design-ABC-209) | design ruled: table lives one game behind an opaque game token (EngineOptions.game); no token = cleared as today (the clear door, no new export); strict-prefix tracker in src/transposition.ts held by the CLI level seam (sees `new`) and the UCI session (ucinewgame, non-continuing position); search() keeps its clear; blunder path does not share; 4 MiB, always-replace, no ageing; 0 pins move; S, no split | EPIC-008 | small expected gain (one-sided d7 moves 2–8 0.94–0.97× nodes); graph-history interaction now spans a game (accepted) | NFR-009: size unchanged, 40-search growth Δ 41 024 B heap / 0 B arrayBuffers (≤ 1 MiB, over = STOP); NFR-005/G6 blind (fresh process); frozen-clock 8/8 equal | grugops/arch-design-ABC-209 @ 4c6bdf52 (d0b1fff8 + records)<br>ADR-0025 § Proposed amendment 2026-10-26 (PROPOSED)<br>.grugops/context/arch-design-ABC-209/notes/ (2) | default + deterministic deep lanes on scratch clones; frozen-clock d7/d8; UCI/CLI A2 paths node-equal to fresh; 40-search heap under --expose-gc; no timing | UAT owed at build (QE verdict signs) | owner accepts/declines the ADR-0025 amendment; BA/PM page lines; Orchestrator merges records, then In Design → Ready for Dev | In Design → Ready for Dev (build may start; merge and ALONE reading wait on the amendment) |
