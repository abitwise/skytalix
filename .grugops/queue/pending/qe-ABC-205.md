---
subtask: qe-ABC-205
role: qe-e2e
ticket: plans/tickets/ABC-205-king-safety-bites-while-queens-are-on-and-the-king-table-is-tapered.md
ref: .grugops/context/qe-ABC-205/
branch: new grugops/qe-ABC-205 from grugops/ABC-205-final (b5d5cea5), worktree ../wt-qe-ABC-205
width: 1 — ALONE (G6 depth-in-budget, D reading ~6–12 h). The last timing run under the owner's one-run rule.
---

# QE gate + G6 + D for ABC-205 (king safety)

> **Owner rule 2026-10-24 (`…4c3f7639`): ONE run.** Run once; the result is final. No repeat on NOT MET or UNRESOLVED; the page's own steps (S1's one pooled 400-game extension) are part of the one run. Pausing for a precondition is not a re-run.
> **Owner word on power (`qe-ABC-205/…10e61802`):** battery is allowed; log the power source, never stop a reading for it.

## Do
- **Do NOT merge main into this branch** (it would re-apply `7c9cd9b9` and delete ABC-205's code). The branch already sits on main `d5690c5c`; if main has moved, report the diff `d5690c5c..main -- src` and proceed on `b5d5cea5` if it is empty.
- QE gate: verify the page's criteria independently at `b5d5cea5` (re-run load-bearing plants; the SE's integration proof `se-integrate-ABC-205/…c685972c`). Gates: lint, typecheck, build, `npm test` + `last-run.json`, skips, SEARCH_DEEP, ENGINE_DEEP, PUZZLE_DEEP if the page names G1.
- **G6** exactly as the page's reading rule states (NFR-005: depth ≥ 6 and ≥ base). A miss is a STOP to Architect/Design per the page — report it, no re-level.
- **D** only if G6 and the gate pass: the ABC-204 harness `d` mode, candidate `b5d5cea5` vs base = its merge-base on main, under ABC-204's pins and B = 1 500 ms (`qe-ABC-204/…f9d109ea`). Write the procedure down before the first game (PREREG). Ship rule S1: GAIN is MET; NEUTRAL gets the one pooled 400-game extension; then grade.
- Preconditions per reading start: load1 ≤ 8, no foreign vitest (`pgrep -fl 'node.*vitest'`; another session runs vitest in bursts — wait up to ~60 min). Sample every ~10 s; map overlaps to games; report the statistic over all games AND over overlap-free games; grade by the page's rule.
- Verdict; UAT (production change in `src/evaluate.ts` → QE verdict signs under `…5aaf7cec` item 2).

## Fences
- Only your worktree and `<scratchpad>/qe205/`; raw outputs under your context folder per ABC-204 A7 (.out.gz + PGN, SHA256SUMS). No `src/`/`tools/` edits. Never push, force, amend or rebase; never merge into main; no board edits. Records: class and count only (ADR-0049 d4).

## Publish
- Seal notes (task `qe-ABC-205`), `at` from `date -u`, with a `kind: decision`. `## Result` + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.
