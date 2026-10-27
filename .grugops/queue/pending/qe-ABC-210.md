---
subtask: qe-ABC-210
role: qe-e2e
ticket: plans/tickets/ABC-210-checks-at-the-horizon-a-check-extension-or-checks-in-quiescence.md
ref: .grugops/context/qe-ABC-210/
branch: new grugops/qe-ABC-210 from grugops/ABC-210 (a96f36b0), worktree ../wt-qe-ABC-210
width: 1 — ALONE for timing (G2, G5, G6, G8, real-clock rows, D; ~6–12 h). Records-only hops may run beside it (no npm/vitest/build). ABC-210's own single reading.
---

# QE gate + readings for ABC-210 (check extension at the horizon; ADR-0051 ACCEPTED)

> **One run (`…4c3f7639`):** each reading runs once, and its result is final. No repeat after NOT MET or UNRESOLVED. The ship rule's own extension step is part of the run. Pausing is not a re-run.
> **Power:** host was on AC at routing (80 %). Log the power source; never stop a reading because of it.

## Do
- Read Orchestrator `orch-2026-10-27j/…334b383d` and `owner-word-2026-10-27/…047d411f`.
- Merge current `main` first and report the sha. Run your own `npm ci --ignore-scripts`.
- **QE gate at your merge.** Verify the page's criteria independently against the `## Design ruling`, ADR-0051 (Architect `arch-design-ABC-210/…c5d0e464`; accepted `arch-accept-adr0051/…e83d5703`) and the build (SE `ticket-to-pr-ABC-210/…8c4e8b4b`, `…548912ef`).
  - **A1 out of tree:** the doors node-equal to base (nodes, score, move) across the ruling's cells.
  - **A2:** the five horizon rows, the line-length instrument and the cap row. Re-run the load-bearing plants; name the blind spots.
  - **A3:** d6 nodes ≤ 1.5× the door; drift d5 on the 190 both recursions ≥ 90 % within 25 cp, none beyond 174 cp; same-depth mate floor on the 287.
  - **P1:** re-plant the fixture bug and show the depth-2 (−502) row still bites.
  - **Audit the moved rows** against the ruled set: P1, P2 (`zugzwang.005` d13 and the table-sanity range "8 to 13", ruled part of P2 in …334b383d), 2 export lists, 2 QE-208-c door maps, 5 re-points. Anything else moved → STOP to Architect/Design.
  - **The LOW in …334b383d:** an extended node does not itself test dead-position / 75-move draws. Say whether any row exercises it and whether you see a value effect.
- **Gates:** lint, typecheck, build, `npm test` + `last-run.json`, skips (`test-skip-integrity.js --skip-count 0`), SEARCH_DEEP (incl. null-move and check-extension lanes), ENGINE_DEEP, PUZZLE_DEEP (G1 ≥ 54/58).
- **Real-clock readings:** G2 ≤ 1 100 ns with base in the same session; G5, G8, G9, G10, G11 as the page states; the real-clock rows the build filtered out.
- **Pre-check:** the frozen-clock d7/d8 counts, base vs head, must equal the ruling's table. Any difference → STOP to Architect/Design, and no G6 or D.
- **G6** under EPIC-008's G6 rule, "≥ base" graded (rule A, `…2ae5fc12`): n = 5 per board per build, interleaved; graded by median; any run below 6 FAILs. A miss → STOP to Architect/Design, and no D.
- **D** only if the gate and G6 pass:
  - ABC-204 harness `d` mode: candidate = your merge, base = its merge-base on main. ABC-204 pins, B = 1 500 ms. PREREG first.
  - Grade by EPIC-008 ship rule **S1**. GAIN → MET. NEUTRAL → the one extension (400 more games, same pins, pooled; report the pooling); GAIN after it → MET. Anything else → NOT MET: a `failed-attempt` note, and no merge.
- **Before each reading:** load1 ≤ 8, and no foreign vitest (wait up to ~60 min). Sample every ~10 s and map overlaps to games. Report all-games and overlap-free results; grade by the page.
- **Verdict and UAT:** this is a production change, so the QE verdict signs UAT under `…5aaf7cec` item 2.

## Fences
- Work only in your worktree and `<scratchpad>/qe210/`. Raw outputs go under your context folder, per ABC-204 A7. Make driver scripts executable before the first start.
- No `src/` or `tools/` edits.
- Never push, force, amend or rebase. Never merge into main. No board edits.
- Records: class and count only (ADR-0049 d4).

## Publish
- Seal notes (task `qe-ABC-210`) with `at` taken from `date -u`, including a `kind: decision`. Commit on your branch.
- Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.
