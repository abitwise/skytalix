---
subtask: qe-ABC-247
role: qe-e2e
ticket: ABC-247
ref: .grugops/context/qe-ABC-247/
branch: new grugops/qe-ABC-247 from grugops/ABC-247 cec9c252 (worktree .claude/worktrees/qe-ABC-247); code 02f4f3d4
width: ALONE for the probe games; only a records-only Architect hop beside you
---
# QE ABC-247 (XS, P1, tools only): rpair passes Skill Level 6; the A2 probe
## Read
The ticket page (A1–A4, Test notes 1–3); qe-EPIC-010-m1-batch's notes and raw/probe/ (the 3 000 ms evidence and the method); se-ABC-247's notes; ABC-225's page (rpair).
## Do
- PREREG first.
- A1: re-check pair-check (25/25) and mutate the token out to confirm red; check the `r`/`d` argvs byte-equal to main.
- A2, ALONE: block 01's dry-run argv through cutechess-cli at `-rounds 1`.
  - Run it once at base ca6e675c and once at head (built from the branch tip; src equals main), 2 games each.
  - The log must show `setoption name Skill Level value 6` and only `go movetime 4000`.
  - Skytalix must read 0 moves at 3.0 s and ≥ 20 at 4.0 s, with 0 faults and 0 time losses.
  - Control without the token at base: 3.0 s.
- A3: spot-check the SE's file:line readings. A4: gates, `npm test` with 0 skips, empty src/data diff.
- Verdict PASS / PASS_WITH_GAPS / FAIL (no UAT, tools only).
## Fences
- No edits to src/, tools/, data/ or the board. No push, force, amend, rebase, or merge into main. Never bare npx or npm exec.
- Waiting: poll an output file or `kill -0 <pid>`; never `while pgrep -f …`.
- Thermal stop: Tctl median > 85 °C. Scratch `qe-247/`, kept small and removed at the end. Leave no process running.
## Publish
Sealed notes (task `qe-ABC-247`, contextRoot = worktree), commit, `## Result` + 10-cell trace row here, brief + claim to done/.
