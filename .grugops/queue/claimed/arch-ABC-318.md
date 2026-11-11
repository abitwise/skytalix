---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-11T07:38:37Z
subtask: arch-ABC-318
role: architect-design
ref: .grugops/context/arch-ABC-318/
branch: new grugops/arch-ABC-318 from main
width: memory-bank/50-decisions/ADR-0045, ADR-0044, ADR-0052 dated amendment lines only, plus your notes. No src/, README, catalog, board.
---
# ABC-318 C1: ADR amendment, level 6 to 10 s
Read the cut note `.grugops/context/orch-2026-10-30a/notes/20261111T073837Z-orchestrator-decision-f1dce7dd.md`, of which C1 is yours. Then read ADR-0045 whole (A1, OQ-212-1, and the "Level 6 plays almost like level 5" paragraph), and the lines in ADR-0044 and ADR-0052 that state the L6 ceiling (7 s).
Write dated amendments in each ADR's existing amendment style. Add lines; never rewrite old text. The amendment records the owner's 2026-11-11 word, the reason (the ABC-316/317 readings, and L5 v L6 at +16–24 projected), and the new numbers: 10 000 ms, and a 12 s ceiling (budget + 2 s). Check that the ordering row and every other clause still hold, and say which do. This is records only: no code, and no game.
Every test or build runs as `flock <scratch>/host-test.lock <cmd>` (the real path is in your dispatch prompt only), one at a time, with one vitest worker. Never kill foreign processes. Publish sealed typed notes (`at` from `date -u` run just before each). Add a `## Result` block to this brief. Run `node tools/grugops/records-path-check.js --base main` before committing. No push, force, amend, rebase or merge into main. Commit messages end with "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>".

## Result
by: architect-design (claude-opus-5-5), at: 2026-11-11T07:44:18Z.

Records only, at `main` `902680b7`: dated lines added to three ADRs, no old text changed (the diff has no deleted
lines). No code, no game, no test or build ran, and nothing was timed.

- **The amendment.** Level 6 thinks **10 000 ms** (was 5 000), and the rate stays 0. Its `NFR-004` ceiling is **12 s**
  (was 7 s), by the owner's accepted rule (budget + 2 s). It rests on the owner's word "go with 10 s for level 6"
  (`…f1dce7dd`) and answers OQ-212-1. The reason is the `ABC-316`/`ABC-317` readings with projection `…152bb16f`: L5 v L6
  at 5 s was +16–24 Elo, inside ± 48; at 10 s, L6 is ~2310–2410, +65–100. In force at `ABC-318`'s merge.
- **`ADR-0045`:** a § Status blockquote; A1 (a dated line under the table, and the resolution line for "Level 6 plays
  almost like level 5"); A3's margin; A4 (the D5-fold bullet and the cutechess line); § AMENDMENT 2026-10-24
  § Consequences (the `NFR-004` text and `AR-NFR004-A`); and a new § AMENDMENT 2026-11-11 at the end.
- **`ADR-0044`:** a § Status blockquote, and the D4.4 and D5 folds.
- **`ADR-0052`:** a § Status bullet; D6's level-ceiling line; A1 (a dated line under the table); and the § Consequences
  `NFR-004` quoted text.
- **These still hold, checked:**
  - the ordering row over 1..7;
  - A1's "time alone" for 5v6 and 6v7;
  - A2;
  - A3 (margin 2 000 at 6; largest level ceiling 32 000 ≤ clamp 60 000, so clause B's pins hold);
  - A4 (a bare `go` at 6 = 10 000; ~12 s latency < `IdleTimeout` 15 000, so no worker);
  - A5;
  - D3 and `ADR-0038` d1;
  - `ABC-101` A7;
  - `NFR-009`;
  - `ADR-0044` D4.1, D4.2 and D11;
  - `ADR-0052`'s modes and A1's ordering.
- **Routed to the Orchestrator** (observation `…1c4c6d88`):
  - `ADR-0052` D8 / `QE-221-b` fires on `ABC-318`: `src/levels.ts`'s three older stale header words get fixed, as
    comment-only lines, in C3's diff. The SE brief does not name this.
  - `NFR-008` and the levels deep lane's L6 wall: the SE's to check (`UNKNOWN - verify`).
  - `ADR-0053` d10's 1.25x step is history (outside this width).
- **Notes:** decision `20261111T074410Z-architect-design-decision-d82c4579`, observation
  `20261111T074415Z-architect-design-observation-1c4c6d88`.
