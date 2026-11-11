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
