---
subtask: qe-ABC-215
role: qe-e2e
ticket: plans/tickets/ABC-215-the-evaluation-values-are-our-own-and-the-cc-by-sa-carve-out-leaves-notice.md
ref: .grugops/context/qe-ABC-215/
branch: new grugops/qe-ABC-215 from grugops/ABC-215 (b778ab13), worktree ../wt-qe-ABC-215
width: 1 — ALONE (G6 depth-in-budget, D reading ~6–12 h). ABC-215's own single reading.
---

# QE gate + G6 + D for ABC-215 (rule-made evaluation values)

> **One run (`…4c3f7639`, scope reading in `ticket-to-pr-ABC-215/…1976d0e9`):** each reading runs once; the result is final; no repeat on NOT MET/UNRESOLVED; the page's own extension step is part of the run; pausing is not a re-run.
> **Battery allowed (`qe-ABC-205/…10e61802`):** log the power source; never stop a reading for it.

## Do
- Merge current `main` first (report sha; this branch has no revert trap). Own `npm ci --ignore-scripts`.
- QE gate at your merge: verify the page's criteria (A1–A8a) independently, re-run load-bearing plants, audit the 16 moved rows and the SE's three companion edits (`…cfb55b57`; Orchestrator `…1976d0e9`). Gates: lint, typecheck, build, `npm test` + `last-run.json`, skips, SEARCH_DEEP, ENGINE_DEEP, PUZZLE_DEEP.
- **Pre-check** (page test note): confirm the frozen-clock d7/d8 counts (base vs head) before any real-clock reading.
- **G6** exactly as the page's reading rule states ("≥ base" graded as written). A miss → STOP to Architect/Design; no D.
- **D** only if the gate and G6 pass: ABC-204 harness `d` mode, candidate = your merge vs base = its merge-base on main, ABC-204 pins, B = 1 500 ms (`qe-ABC-204/…f9d109ea`). PREREG first. Grade by the page's ship rule (incl. its one extension).
- Preconditions per reading start: load1 ≤ 8, no foreign vitest (wait up to ~60 min). Sample every ~10 s; overlaps mapped to games; report all-games and overlap-free; grade by the page.
- Verdict; UAT (production change → QE verdict signs under `…5aaf7cec` item 2).

## Fences
- Only your worktree and `<scratchpad>/qe215/`; raw outputs under your context folder per ABC-204 A7. No `src/`/`tools/` edits. Never push, force, amend or rebase; never merge into main; no board edits. Records: class and count only (ADR-0049 d4).

## Publish
- Seal notes (task `qe-ABC-215`), `at` from `date -u`, with a `kind: decision`. `## Result` + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.
