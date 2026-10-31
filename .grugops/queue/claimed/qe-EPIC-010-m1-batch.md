---
subtask: qe-EPIC-010-m1-batch
role: qe-e2e
ticket: EPIC-010 milestone 1 batch (§ "Did things get worse?", layer 3)
ref: .grugops/context/qe-EPIC-010-m1-batch/
branch: new grugops/qe-EPIC-010-m1-batch from main at spawn (worktree .claude/worktrees/qe-EPIC-010-m1-batch)
width: STRICTLY ALONE for the whole run (≈ 18.5 h). Only records-only hops (no vitest, no engine) may run beside you.
owner: "18.5h pair run you can schedule now" (orch-2026-10-30a …c2752305, 2026-10-31)
---
# QE: EPIC-010 milestone-1 batch: 400-game interleaved R pair (200 + 200), width 1
## Read
- EPIC-010: § "Did things get worse?" (the batch: when / what / after / LOSS); § The smoke ledger; the ESTIMATE RESTATED and 2026-10-31 FOLDED blocks (width 1, ≈ 18.5 h, range 17.5–19.4 h).
- ABC-225's page and qe-ABC-225-w1's notes: the `rpair` command, its resume and halt behaviour, QE-225w1-a (the `budget` field is unread), and QE-225w1-d (report nps spread per block).
- ADR-0053 d10 (4 000 ms both sides); EPIC-008's merge rule (X + Y ≥ 0 is not LOSS); AGENTS.md's A11 lane and wait rules.
## Do
1. **PREREG first, before any game.** Commit:
   - Base SHA: main just before the epic's first value-changing merge, resolved from EPIC-010 and the ledger. Show the derivation. If it is ambiguous, STOP and hand back before any game.
   - Head SHA: main at spawn.
   - The exact `rpair` command line (R pins, E = 1 910, 4 000 ms both sides, 400 games, `--concurrency 1`).
   - The verdict rule, the thermal stop, and what you do on a crash or halt (resume per ABC-225).
2. Build both trees in scratch, keeping them small (hard-link node_modules). Run the pair-check first.
3. Run the batch in the background, writing to an output file. Wait by polling that file or `kill -0 <pid>`.
   - Check every ~30 min: progress, Tctl, and that no other vitest or engine is running. Log contamination; do not kill other people's processes.
4. Thermal stop: Tctl median > 85 °C → pause per the tool's halt and resume.
5. Report:
   - X, Y and the score with its half-width; the verdict (LOSS or not LOSS);
   - wall time; nps spread per block; time losses; crashes.
   - On not LOSS, head's R score becomes the trend reference (EPIC-010 § After a passing batch). Record the figure; BA/PM folds it.
   - On LOSS, list the suspects from the ledger, for information only. The options go to the owner via BA/PM.
## Fences
- No edits to src/, tools/, data/ or the board. No push, force, amend, rebase, or merge into main. Never bare npx or npm exec.
- Waiting: never `while pgrep -f …`; never put vitest or the batch on the same command line as a wait.
- Leave no process running at hand-back.
- Scratch `qe-batch/`.
## Publish
Sealed notes (task `qe-EPIC-010-m1-batch`, contextRoot = worktree), commit, `## Result` + trace row here, brief + claim to done/.
