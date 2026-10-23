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
