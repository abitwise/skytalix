---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-10T20:34:58Z
subtask: qe-ABC-317
role: qe-e2e
ref: .grugops/context/qe-ABC-317/
branch: new grugops/qe-ABC-317 from main
width: stage A only — pins, a smoke of at most 2 ungraded games, and the sealed PREREG. No graded games.
---
# ABC-317: QE stage A — the PREREG for levels 3 and 4
Read the cut note `.grugops/context/orch-2026-10-30a/notes/20261110T203458Z-orchestrator-decision-7ffdb8a5.md` (B1–B4) and ABC-316's whole QE record in `.grugops/queue/done/qe-ABC-316.md` (stages A, B, B2 and C), with its scripts under `.grugops/context/qe-ABC-316/raw/`. Reuse them as the model.
1. **Pins and trees:** cutechess-cli, Stockfish 19, the openings, node; the main sha to read; `src/` and the harness trees.
2. **Smoke (at most 2 games, ungraded):** `--skill 4 --elo 2040 --rounds 1`. Check:
   - the control line;
   - that Skill Level and UCI_Elo reach both engines;
   - `go movetime 1000`;
   - skytalix latency against 1 s.
3. **Seal the PREREG before any graded game.** It covers:
   - E fixed by the cut note: L3 1890, L4 2040;
   - 200 games per level;
   - the command;
   - the band rule: one step per level, only on my word. Take E as a script argument this time, so a step needs no script copy;
   - validity: faults, time losses, the depth guard at each E's pick depth, the record check, latency;
   - FL and W, with foreign load logged by class and count only;
   - re-runs asked of the owner first;
   - **a time estimate per level, with runaway stops.** Use ABC-316's walls (L1 36.6 min at 0.1 s; L2 49.9 min and 63.6 min at 0.18 s), and the ply counts.
   - L3 and L4 may run in separate windows, so make each level startable on its own.
4. **STOP and report.** Graded games run only on a later brief line from me citing the owner's held host.
Every run goes as `flock <scratch>/host-test.lock <cmd>` (the real path is in your dispatch prompt only), one core, one at a time. Records carry placeholders only. Never kill foreign processes. No src/, README, ADR, EPIC or board edit. Publish sealed typed notes (`at` from `date -u` run just before each). Add a `## Stage A` block to this brief. Run `node tools/grugops/records-path-check.js --base main` before each commit. No push, force, amend, rebase or merge into main. Commit messages end with "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>".
