# Artifacts of `bapm-qe-gaps-1101b`: one new ticket page (`ABC-262`), two `EPIC-011` rows, dated test notes on `ABC-250`, `ABC-251` and `ABC-252`, and two trace rows; nothing else touched

Records commit `f4621970` on `grugops/bapm-qe-gaps-1101b` (from `main` `aaccbbf8`; claim commit `770a5046`).

- **`plans/tickets/ABC-262-…`** (new): XS, P3, `EPIC-011`, Backlog, DoR 10/10, Ready recommended. A1–A8, with a stop
  rule (base count ≠ 1 on B2, or a mirror board failing A2).
- **`plans/epics/EPIC-011-…`**: § Tickets row 14 (`ABC-262`) added after the struck row 13. A phase-0 row is added to
  § Phases after `ABC-256`'s. No other line changed.
- **`ABC-250`**: § Test notes item 6 (QE-261-c). **`ABC-252`**: § Test notes item 5 (QE-261-c). **`ABC-251`**: § Test
  notes item 7 (QE-260-a, with one QE-260-b clause). Scope, acceptance and DoR unchanged on all three.
- **`plans/traceability.md`**: two 10-cell rows appended (`ABC-262`, `bapm-qe-gaps-1101b`).
- **Facts read for the page** (git show and file reads at `aaccbbf8`, no test run). `ABC-261`'s rows are at
  `src/gameend.nfr.test.ts` (B0 `4k3/8/8/8/8/8/PPP5/4K3 w`, bar ≤ 2) and `src/legal.test.ts` (P1/P2, white only,
  `from >> 4` is 6). QE's probe JSON gives B2: production 1, QX1 2, PL3a 9, QX2 10, king moves 8. QB's diff is
  `(inCheck && !moverIsBlack)`. `ABC-262` was an unused id: no hit in `plans/`, `memory-bank/`, the queue or branches.
- **Not touched:** the board, `memory-bank/`, `src/`, `tools/`, `data/`, `EPIC-010`, `AGENTS.md`, and the pages of
  `ABC-255`, `ABC-260` and `ABC-261`.
