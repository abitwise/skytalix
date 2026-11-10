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

## Stage A
*QE/E2E (claude-opus-5-5, qe-ABC-317), 2026-11-10, on `grugops/qe-ABC-317` from `559656a0` (= `main`; `src/` `21f3b304`, `tools/` `6272e8d2`). Read sha `b6366a79` (`src/` `21f3b304`), the sha L1 and L2 were read on.*

**Result: pins = pin; one 2-game smoke at `--skill 4 --elo 2040`, NOT GRADED, clean; PREREG sealed; stopped before any graded game.**
- **Notes:** checks and smoke `20261110T204444Z-qe-e2e-observation-aeaf90e3`; PREREG `20261110T204444Z-qe-e2e-decision-e6cf1088`, sealed before any graded game.
- **Pins:** `cutechess-cli` 1.5.1 `dc776901…` = pin; Stockfish 19 `c78c22a9…` = pin; openings `0d7f7a72…` = pin; `node` v26.12.1.
- **Trees:** `main` `559656a0` has `b6366a79`'s `src/` tree. `b6366a79..main` changes only README, CHANGELOG and `tools/rating/` outside the records, so the engine built is the same. Reading `b6366a79` keeps all four levels on one subject.
- **Smoke (NOT GRADED):** `r b6366a79 <out> --skill 4 --elo 2040 --rounds 1 --concurrency 1`, 2 games, exit 0, 3 min 48 s.
  - Control line: `control: skytalix Skill Level=4 st=1 timemargin=50, stockfish st=1 timemargin=2000`.
  - `Skill Level value 4` reached both skytalix processes, and `UCI_Elo value 2040` both Stockfish processes. Every `go` was `go movetime 1000` (115 / 115 each side).
  - skytalix latency median 1 001 ms, max 1 003 ms; 0 over 1 010 ms, 0 at the 1 050 ms margin.
  - Faults 0, time losses 0, depth guard 0 of 115 below depth 5.
  - 71 and 159 plies, about 0.97 s a ply. The build clone (792 MB) was deleted.
  - Records: `raw/out/smoke-l4-not-graded/`.
- **PREREG:** E 1 890 (L3) and 2 040 (L4), as cut. 200 games each, with both sides at 0.33 s and 1 s. Pick depths are 4 and 5.
  - Band rule: one step per level, only on your word. E is `session.sh`'s argument, so a step runs the same sealed bytes after a sealed addendum.
  - Re-runs are asked of the owner first. W and FL are as in ABC-316, with W asked for each level.
- **Time estimate:** L3 94–165 min (central about 2.0 h), RUNAWAY 225 min. **L4 283–500 min (central about 6.1 h), RUNAWAY 672 min (11.2 h).** These are 200 × plies × `st`, with 85–150 plies a game (central 110).
- **To start stage B, one level per window,** from this branch's worktree root, with `<out-root>` a new empty directory under `<scratch>`:
  - L3: `CUTECHESS_CLI=<cutechess-cli> STOCKFISH=<stockfish> flock <scratch>/host-test.lock bash .grugops/context/qe-ABC-317/raw/scripts/session.sh 3 1890 <out-root>/l3-e1890 <repo>`
  - L4: `CUTECHESS_CLI=<cutechess-cli> STOCKFISH=<stockfish> flock <scratch>/host-test.lock bash .grugops/context/qe-ABC-317/raw/scripts/session.sh 4 2040 <out-root>/l4-e2040 <repo>`
  - QE sha-checks `raw/scripts/SHA256SUMS` just before each launch.
- **Fences held:** no `src/`, README, ADR, EPIC or board edit. No push, force, amend, rebase or merge. No foreign process touched or recorded beyond class and count.
