---
subtask: qe-ABC-246
role: qe-e2e
ticket: ABC-246
ref: .grugops/context/qe-ABC-246/
branch: grugops/ABC-246 @ a1942ea0 (code 3c5e05fd); your worktree .claude/worktrees/qe-ABC-246 on new branch grugops/qe-ABC-246 from it
width: ALONE for every timing read (G8). Only a records-only BA/PM hop (no vitest) may be beside you. Record load1 and foreign processes with every timing. Leave no process running.
---
# QE ABC-246 (XS, P3, test-only, UAT waived): two uci-clock-mode rows + SE-221-g comment
## Read
- The ticket page (A1–A5); the SE hand-back .grugops/queue/done/se-ABC-246.md on the branch and its notes (decision …2f43204c; A3 …8de958b6; A4/A5 …851629b3; handoff …0d04bf8a, SE-246-a).
- qe-ABC-221 notes …8ad25906 and …c6f37a35 (plants HSCM, CLOCKWINSCM).
- ADR-0046 § Addendum and the tranche-2 ruling: W1 (a G8 head reading > 9.7 s is confirmed by a second window of 3 head runs; the median of all 6 decides; > 10 s → STOP).
## Do
- A3 re-read: each plant alone over the WHOLE default lane (not only the one file); A1 red under HSCM, A2 red under CLOCKWINSCM, nothing else red; never commit a plant.
- A4: comment-only diff on src/engine.test.ts; check its figures against HARD_CEILING_MS 60 000.
- A5: gates via `npm run …`; npm test 0 skips; net rows +2; skip-integrity, lane inventory; G8 head (and base main 832ff246) per ADR-0046, W1 applied.
- Verdict: PASS / PASS_WITH_GAPS / FAIL. The verdict closes the ticket (UAT waived).
## Fences
- No edits under src/, tools/, data/; no board edits. No push, force, amend, rebase, or merge into main. Never bare npx or npm exec. Waiting: `kill -0 <pid>` or poll a file; never `while pgrep -f`; never vitest on the same command line as a wait. Thermal stop: Tctl median > 85 °C.
- Scratch `qe-246/`.
## Publish
Sealed notes (task `qe-ABC-246`, contextRoot = worktree), commit, `## Result` + 10-cell trace row here, brief + claim to done/.
