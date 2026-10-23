---
subtask: security-nfr-ABC-197
role: security-nfr
ticket: plans/tickets/ABC-197-one-step-100-uci-row-restores-the-dropped-token-budget-band-qe-177-b.md
ref: .grugops/context/security-nfr-ABC-197/
branch: grugops/qe-timing-ABC-197 (11b745e3; H = 1f2aa4b0, B = 051d557a)
width: 1 (records only; no runs)
---

# Rule the NFR-008 state after ABC-197's A6/A7 readings (plus two deferred catalog items)

## Do
- Read QE's timing notes on `grugops/qe-timing-ABC-197` (`…13c7935f` preconditions, `…c12590b6` A6, `…fc6590fe` A7, `…b4a96d77` artifacts, `…9dc058a9` verdict) and the probe folder `.grugops/context/qe-timing-ABC-197/probe/` there.
- Rule the `NFR-008` state and the `N8-LANE` charge for ABC-197, as the page asks. QE's readings:
  - A7: H at 8.935 s [8.68, 9.11]; B (`051d557a`) at 8.815 s; four arms, 0/8 warm, thermal 0, AC on all runs.
  - A6: H−B CPU +0.125 s [+0.120, +0.160] against 650 ms, F = 0.070 s (Architect `…578a9290`); twin R 0.040 s CPU / 0.070 s wall (the set's third reading).
- Confirm the lane-input diff from `1f2aa4b0` to current `main` is empty (so the reading carries to the merged tree).
- Record the new published headroom (10 s minus H; and to `ADR-0046` D4's 9.2 s).
- **Deferred catalog items, same hop** (one dated insertion each in `plans/nfr-catalog.md`, no bar moved): close `R-178-1` (met by Architect `…578a9290`); handle `QE-201-b` by citing the `c0585331` reading.
- The set's F after three readings (median-of-three) is the Architect's to rule, not yours; just name it as a follow-up if you see a need.
- **Records only. No runs.** Result: PASS, PASS_WITH_RISKS or FAIL.

## Fences
- Work on `grugops/security-nfr-ABC-197` (worktree `../wt-security-nfr-ABC-197` from `main`). No `src/`, `tools/`, `package*.json`, `AGENTS.md`, `plans/board.md` or `plans/traceability.md`. Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/sec197/`. Never push, force, amend or rebase; never merge into `main`.

## Publish
- Seal notes via the plugin writer (task `security-nfr-ABC-197`), `at` from `date -u`, with a `kind: decision`. Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.
