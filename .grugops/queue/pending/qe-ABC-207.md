---
subtask: qe-ABC-207
role: qe-e2e
ticket: plans/tickets/ABC-207-mobility-is-weighted-per-piece-and-an-early-queen-trip-costs.md
ref: .grugops/context/qe-ABC-207/
branch: new grugops/qe-ABC-207 from grugops/ABC-207 (5477df21), worktree ../wt-qe-ABC-207
width: 1 — ALONE (G6 depth-in-budget, D reading ~6–12 h). ABC-207's own single reading.
---

# QE gate + G6 + D for ABC-207 (per-piece mobility weights + early-queen term)

> **One run (`…4c3f7639`; scope reading in `orch-2026-10-25ab`):** each reading runs once; the result is final; no repeat on NOT MET/UNRESOLVED; the ship rule's own extension step is part of the run; pausing is not a re-run.
> **Battery allowed (`qe-ABC-205/…10e61802`):** log the power source; never stop a reading for it.

## Do
- Merge current `main` first (report sha). Own `npm ci --ignore-scripts`.
- QE gate at your merge: verify the page's criteria (A1–A5) independently against the `## Design ruling` (Architect `…a21b7cc9`) and the build (SE `…71735f56`, `…84f82342`, `…723cbf60`). Re-run load-bearing plants. Audit the 12 moved rows: cross-run each tree's code against the other's tests, and confirm the pvs-lmr A4 re-find under ADR-0028 d2 and the oracle rows. Gates: lint, typecheck, build, `npm test` + `last-run.json`, skips, SEARCH_DEEP, ENGINE_DEEP, PUZZLE_DEEP (G1 ≥ 54/58). G2 ≤ 1 100 ns with the base in the same session. G5, G8, G9, G10, G11 as the page states.
- **Pre-check** (page Test note 4): confirm the frozen-clock d7/d8 counts (base vs head) before any real-clock reading. If a miss is predicted → STOP to Architect/Design.
- **G6** under EPIC-008's G6 row reading rule (n = 5 per board per build, interleaved, median; any run < 6 FAILs; "≥ base" graded). A miss → STOP to Architect/Design; no D.
- **D** only if the gate and G6 pass: ABC-204 harness `d` mode, candidate = your merge vs base = its merge-base on main, ABC-204 pins, B = 1 500 ms. PREREG first. Grade by EPIC-008 ship rule **S1**: GAIN → MET; NEUTRAL → the one extension (400 more games, same pins, pooled; pooling reported), GAIN after → MET; anything else → NOT MET (a `failed-attempt` note; no merge).
- Preconditions per reading start: load1 ≤ 8, no foreign vitest (wait up to ~60 min). Sample every ~10 s; map overlaps to games; report all-games and overlap-free; grade by the page.
- Verdict; UAT (production change → the QE verdict signs under `…5aaf7cec` item 2).

## Fences
- Only your worktree and `<scratchpad>/qe207/`; raw outputs under your context folder per ABC-204 A7. No `src/`/`tools/` edits. Never push, force, amend or rebase; never merge into main; no board edits. Records: class and count only (ADR-0049 d4).

## Publish
- Seal notes (task `qe-ABC-207`), `at` from `date -u`, with a `kind: decision`. `## Result` + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.
