---
subtask: qe-EPIC-010-m1-batch-2
role: qe-e2e
ticket: EPIC-010 milestone 1 batch (§ "Did things get worse?", layer 3), re-run after ABC-247
ref: .grugops/context/qe-EPIC-010-m1-batch-2/
branch: new grugops/qe-EPIC-010-m1-batch-2 from main at spawn (worktree .claude/worktrees/qe-EPIC-010-m1-batch-2)
width: STRICTLY ALONE for the whole run (≈ 21.7–24.1 h). Only records-only hops (no vitest, no engine) may run beside you.
owner: "18.5h pair run you can schedule now" (…c2752305); route (A) and the restated cost: Orchestrator ruling …fb0c8978
---
# QE: EPIC-010 milestone-1 batch, run 2: 400-game interleaved R pair at Skill Level 6 (4 000 ms both sides), width 1
## Read
- The first attempt's notes on main: .grugops/context/qe-EPIC-010-m1-batch/ (PREREG …93c1fb08 with the base derivation, evidence, STOP …21029f54).
- ABC-247's page (Test note 3: the PREREG re-checks levels 5/6 at both SHAs; read 4.0 s clocks on both builds after block 01, a miss is a STOP) and qe-ABC-247's notes (the probe method, QE-247-b: redact host paths in prints).
- EPIC-010 § "Did things get worse?" and the restated cost; ADR-0053 d10; EPIC-008's merge rule (X + Y ≥ 0 is not LOSS); AGENTS.md's A11 lane and wait rules.
## Do
1. **PREREG before any game:**
   - base ca6e675c (re-confirm the derivation; it was unambiguous in run 1);
   - head = main at spawn;
   - the exact `rpair` command (E = 1 910, 400 games, `--concurrency 1`; the tool now carries Skill Level 6);
   - the levels 5/6 re-check at both SHAs;
   - the verdict rule, the thermal stop, and crash/halt handling (resume per ABC-225).
2. Pair-check first. Run in the background to an output file.
   - After block 01, read the PGN clocks: both builds at 4.0 s, 0 at 3.0 s, else STOP.
   - Check about every 30 min: progress, Tctl, contamination (log it, do not kill others' processes).
   - Thermal stop: Tctl median > 85 °C → halt and resume.
3. Report:
   - X, Y and the score with its half-width; the verdict (LOSS / not LOSS);
   - wall time; nps spread per block; time losses; crashes; thermal readings; the contamination log.
   - On not LOSS, head's R score becomes the trend reference (EPIC-010 § After a passing batch); record it for BA/PM.
   - On LOSS, list the suspects from the ledger, for information only.
## Fences
- No edits to src/, tools/, data/ or the board. No push, force, amend, rebase, or merge into main. Never bare npx or npm exec.
- Waiting: never `while pgrep -f …`; never put vitest or the batch on the same command line as a wait.
- Redact host paths before committing prints. Keep scratch small; remove it at the end. Leave no process running. Scratch `qe-batch2/`.
## Publish
Sealed notes (task `qe-EPIC-010-m1-batch-2`, contextRoot = worktree), commit, `## Result` + trace row here, brief + claim to done/.
