---
subtask: qe-timing-ABC-197
role: qe-e2e
ticket: plans/tickets/ABC-197-one-step-100-uci-row-restores-the-dropped-token-budget-band-qe-177-b.md
ref: .grugops/context/qe-timing-ABC-197/
branch: H = grugops/qe-ABC-197 @ 1f2aa4b0 (QE merge of main 8804937e into tip 20e397c8); B = main 051d557a (src identical to main f3b7b2a3)
width: 1 (ALONE: the owner has paused his other sessions; no other hop runs)
---

# The owed quiet-host timing hop for ABC-197: A6 (N8-LANE, one-file set) and A7 (NFR-008)

## Preconditions (check before EVERY scored window, and record each reading)
- `pmset -g batt` reads `AC Power`. A battery reading is not admissible (owner `…bfdc97e5`).
- load1 ≤ 8.
- `pgrep -fl '[v]itest'` shows no foreign vitest; only your own runs may appear.
- Thermal: "kept and flagged" (as ABC-178). Keep the reading and flag thermal state if seen.
- If a precondition fails, wait and re-check; do not score that window. If the host never becomes admissible, report UNRESOLVED with the readings. Do not guess.

## Do
- Create your own worktree `../wt-qe-timing-ABC-197` on new branch `grugops/qe-timing-ABC-197` from `grugops/qe-ABC-197` (`1f2aa4b0`). No merge needed: main f3b7b2a3 adds records only over 8804937e (verify `git diff --stat 1f2aa4b0 main -- src package.json package-lock.json` shows only R2's reverse). Install with your own `npm ci --ignore-scripts`.
- Correctness check at H first: lint, typecheck, build; `npm test` + `last-run.json` success (expect 61 files / 2 019 tests); `UCI_DEEP`.
- **A6** exactly as the page states (ABC-177 A8 protocol, `lane174.mjs` byte copy, 9 rounds, round 0 discarded, rotated, GAP 0, k = 2, CPU from `/usr/bin/time -p`), ONE-FILE set `src/uci-session.test.ts`. B = `git archive 051d557a`, H = `git archive 1f2aa4b0`. Readout: `readout174a.py <dir> n8-lane 0.070 changed` (F = 0.070 s per Architect `…578a9290`; NOT `16pct`). Report the charge against ≤ 650 ms CPU, and H−B CPU and wall medians with intervals. Report the twin's R (it is the set's third reading).
- **A7** exactly as the page states (ABC-177 A9 protocol: `npm test` as spelled, B and H each with their own `npm ci`, `window.mjs` 180 s foreground, 0 foreign polls, load1 ≤ 8, AC on every scored run). Report H's R-1 median wall against ≤ 10 s, and B's.
- **If H reads > 10 s, the reading goes to the owner** (ADR-0035 D6; page fallback: drop R2, accept QE-177-b). Say so plainly and stop.
- Verdict for A6/A7: MET, NOT MET or UNRESOLVED, plus an overall ABC-197 QE verdict folding in your earlier A1–A5, A8 (`…479b5c68`).

## Fences
- Work only in `../wt-qe-timing-ABC-197` and `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/qe197t/`. Commit notes plus a dated addendum to the `## QE` section on the ABC-197 page in your worktree. No `src/` edits, no `package*.json`, `AGENTS.md`, `plans/board.md` or `plans/traceability.md`. `.grugops/test-skips.md` is read-only. Never push, force, amend or rebase; never merge into `main`.

## Publish
- Seal notes via the plugin writer (task `qe-timing-ABC-197`), `at` from `date -u`, with a `kind: decision`. Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.

## Result

**qe-e2e, 2026-10-23, done. A6 MET, A7 MET; ABC-197 overall PASS_WITH_GAPS (no blocking gap; QE-197-a to -e INFO).** Branch `grugops/qe-timing-ABC-197` from `1f2aa4b0` (no merge; the brief's diff check holds), commit `11b745e3` (notes, probe, `## QE` addendum). Not pushed, not merged into `main`.
- **Preconditions** (`…13c7935f`): AC on every check (26 gate polls, 32 host polls, 74 window power polls, 63 runs). load1 ≤ 8 on every scored run (max 5.15). 0 foreign vitest at every check, and both windows had 0 foreign polls on their first try. Thermal 0 throughout. No re-run was needed.
- **Correctness at H `1f2aa4b0`:** lint, typecheck and build exit 0. `npm test` ran 61 files / 2 019 tests, `success` true. `UCI_DEEP` passed 5/5.
- **A6** (`…c12590b6`, F = 0.070 s): charge H−B CPU **+0.125 s [+0.120, +0.160]** ≤ 650 ms. MET in 174a and in strict 174. H−B wall +0.130 s [+0.090, +0.140]. Twin R 0.040 s CPU / 0.070 s wall, admissible: the set's third reading (median of three 0.040 / 0.070 s; the F ruling is the Architect's).
- **A7** (`…fc6590fe`): **H 8.935 s [8.68, 9.11] ≤ 10 s**; **B 8.815 s [8.66, 8.92]**. H−B wall +0.090 s [+0.010, +0.200]. Both twins admissible; 0/8 warm. No owner route (`ADR-0035` D6 does not fire).
- **Verdict:** `…9dc058a9`. Recommended board move In Review → In Security/NFR (`NFR-008` state); the move is the Orchestrator's.

| Ticket | Title | Epic | Feature | NFRs | Code (PR/files) | Tests | UAT | Release | Status |
|---|---|---|---|---|---|---|---|---|---|
| ABC-197 (qe-timing-ABC-197) | QE quiet-host timing: A6 MET (H−B CPU +0.125 s [+0.120, +0.160] ≤ 650 ms, F 0.070 s); A7 MET (H 8.935 s ≤ 10 s; B 8.815 s); overall PASS_WITH_GAPS; verdict …9dc058a9 | EPIC-007 | — | NFR-008 MET (H 8.935 s, 0/8 warm), N8-LANE MET | src/uci-session.test.ts (R2, test-only) at 1f2aa4b0; commit 11b745e3 on grugops/qe-timing-ABC-197 | lane 61 / 2 019 pass at 1f2aa4b0; A6/A7 under .grugops/context/qe-timing-ABC-197/probe | waived (0 production lines) | — | In Review → In Security/NFR recommended |
