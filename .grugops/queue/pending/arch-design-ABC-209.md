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
