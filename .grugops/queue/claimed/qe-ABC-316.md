---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-10T15:52:00Z
subtask: qe-ABC-316
role: qe-e2e
ref: .grugops/context/qe-ABC-316/
branch: new grugops/qe-ABC-316 from grugops/ABC-316
width: stage A only — check A1, seal the PREREG, dry checks. No graded games.
---
# ABC-316: QE stage A — A1 check and the PREREG for levels 1 and 2
Read the cut note `.grugops/context/orch-2026-10-30a/notes/20261110T153717Z-orchestrator-decision-20c41f8c.md` (A1–A5), SE's brief and Result in `.grugops/queue/done/se-ABC-316.md` with notes `…be0266ce` and `…58aabc47`, and ABC-295's stage A and B in `.grugops/queue/done/qe-ABC-295.md`. Reuse its session scripts as the model.
1. **Check A1 (verdict on the harness):** the gates on the branch tip; argv for `--skill 1` and `--skill 2` dry runs; the refusals; R2's argv byte-equal; `src/` diff against main empty. SE's open item: `machine.txt`'s control line is never written in a test — check it with a smoke of at most 2 games at `--skill 1 --rounds 1`, labelled not graded. Orchestrator ruling on SE's question: the 2600 cap stays tied to `--budget-ms 100`; it does not matter at E 1320 and 1450.
2. **Seal the PREREG before any graded game,** one per level or one for both. Cover:
   - pins (cutechess-cli, Stockfish 19, openings), and the sha and `src/`/harness trees to read;
   - E: 1320 for L1, 1450 for L2, fixed by the cut note;
   - commands: `r <sha> <out> --skill L --elo E --rounds 100 --concurrency 1`;
   - the band rule: one step per level, only on my word. L1 below 25 % at the floor is reported as an upper bound;
   - validity: faults, time losses, and skytalix latency against each level's `st`;
   - host gates FL and W as in ABC-295. Log foreign load by class and count only, never a foreign command line;
   - re-runs are asked of the owner first;
   - the time estimate for each level and the total. R2: 36 min at 100 ms.
3. **STOP and report.** Graded games run only on a later brief line from me citing the owner's held host.
Every run goes as `flock <scratch>/host-test.lock <cmd>` (the real path is in your dispatch prompt only), one core, one at a time, with one vitest worker. Records carry placeholders only. Never kill foreign processes. No src/, README, ADR, EPIC or board edit. Publish sealed typed notes (`at` from `date -u` run just before each). Add a `## Stage A` block to this brief. Commit on your branch and run `node tools/grugops/records-path-check.js --base main` first. No push, force, amend, rebase or merge into main. Commit messages end with "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>".
