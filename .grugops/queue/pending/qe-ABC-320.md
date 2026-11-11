---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-11T21:53:46Z
subtask: qe-ABC-320
role: qe-e2e
ref: .grugops/context/qe-ABC-320/
branch: new grugops/qe-ABC-320 from grugops/ABC-320 (5a8fbd8c), with main merged in
width: C1 check, then stage A only — pins, a smoke of at most 2 ungraded games, and the sealed PREREG with its session script. No graded games.
---
# ABC-320: QE — C1 check and stage A for level 5, night 1
Read the cut note `.grugops/context/orch-2026-10-30a/notes/20261111T214452Z-orchestrator-decision-972c91df.md` (C1–C4), the SE's Result in `.grugops/queue/done/se-ABC-320.md` on `grugops/ABC-320` and its notes under `.grugops/context/se-ABC-320/notes/`, and ABC-317's whole QE record `.grugops/queue/done/qe-ABC-317.md` with its scripts under `.grugops/context/qe-ABC-317/raw/scripts/`. Reuse them as the model.
1. **C1 check.** Read the diff `main...grugops/ABC-320` against C1. Re-run `node --test --test-concurrency=1 tools/rating/pair-check.ts` and lint under the lock. Confirm: L1–L4 and no-`--start` argv unchanged; `--start` and `rsum` refusals; the pooled formula. Report gaps by severity. A blocking gap stops stage A.
2. **Subject.** Read the build at tag `v1.1.0` (`cddd4df9`), the shipped release. State its `src/` tree and the `src/` diff from ABC-317's subject `b6366a79` (expected: L6 budget, version, comments only — so L5's engine is unchanged).
3. **Pins:** cutechess-cli, Stockfish 19, the openings, node, as ABC-317.
4. **Smoke (at most 2 games, ungraded):** `r cddd4df9 <out> --skill 5 --elo 2280 --rounds 1 --concurrency 1`. Check the control line, that Skill Level 5 and UCI_Elo 2280 reach both engines, `go movetime 4000`, and skytalix latency against 4 s (margin 50 ms). Also check `machine.txt`'s `start:` line with a `--start 1` run if the smoke uses it (the SE could not test it).
5. **Seal the PREREG before any graded game.** It covers:
   - E 2280 (cut note); level 5; both sides at st 4; the full reading is 200 games over openings 1–100, in nightly segments;
   - a night-1 session script: chunks of `--rounds 5` with `--start` 1, 6, 11, …; before each chunk it checks that the chunk cannot end past **8 h** from the session start at worst-case plies (state the figure and its source), else it stops; a hard runaway stop at 8 h; it deletes each chunk's build clones after the chunk; it writes the next start for night 2; E and the start are script arguments;
   - the pooled reading via `rsum` over the night's chunks, reported as an **interim** reading and a band probe (score clearly outside 25–75 % → report; a step needs the owner's word);
   - validity: faults, time losses, the depth guard, the record check, latency at 4 s;
   - FL and W as ABC-317, foreign load logged by class and count only;
   - a time estimate per chunk and for the night.
6. **STOP and report** with the exact launch line (placeholders). Graded games run only on a later brief line from me citing the owner's held host.
Every run goes as `flock <scratch>/host-test.lock <cmd>` (the real path is in your dispatch prompt only), one core, one at a time. Records carry placeholders only. Never kill foreign processes. No src/, README, CHANGELOG, ADR, EPIC or board edit. Publish sealed typed notes (`at` from `date -u` run just before each). Add a `## C1 check` and a `## Stage A` block to this brief. Run `node tools/grugops/records-path-check.js --base main` before each commit. No push, force, amend, rebase or merge into main. Commit messages end with "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>".
