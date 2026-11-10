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

## Stage A
*QE/E2E (claude-opus-5-5, qe-ABC-316), 2026-11-10, on `grugops/qe-ABC-316` from `dcfbb147` (SE's A1 at `ebbeb615`, `tools/` `6272e8d2`). Read sha `main` `b6366a79` (`src/` `21f3b304`).*

**Result: A1 PASS; PREREG sealed; stopped before any graded game. One 2-game smoke, NOT GRADED; no other game.**
- **A1 verdict:** `20261110T155221Z-qe-e2e-decision-495d816f`, **PASS**. Checks: `…observation-c8bdbf73`.
  - Gates on the tip, each alone under the lock: lint 0; typecheck 0; `VITEST_MAX_WORKERS=1 npm test` 0 (2 740 / 2 740, 0 skipped); build 0; `pair-check.ts` 52 / 52.
  - Dry runs with the pinned tools: L1 and L2 vectors are R2's with only `st`, `Skill Level` and `UCI_Elo` changed. R2's argv is `cmp`-equal to its committed `cmd.txt`. Every refusal holds (`raw/out/dry/refusals.txt`). The `src/` diff against `main` is empty.
  - One non-blocking gap: the harness reads `LEVELS` from its own worktree, not from the sha it rates. The session gates on the two being equal.
- **Smoke (NOT GRADED):** `r b6366a79 <out> --skill 1 --elo 1320 --rounds 1 --concurrency 1`, 2 games, exit 0.
  - `machine.txt`: `control: skytalix Skill Level=1 st=0.1 timemargin=50, stockfish st=0.1 timemargin=2000` (= A1).
  - faults 0, time losses 0, depth guard 0 of 230; skytalix latency max 103 ms.
  - Each skytalix process got `Skill Level value 1`.
  - Records: `raw/out/smoke-l1-not-graded/`.
- **Pins:** `cutechess-cli` 1.5.1 `dc776901…` = pin; Stockfish 19 `c78c22a9…` = pin; openings `0d7f7a72…` = pin; `node` v26.12.1.
- **PREREG:** `20261110T155226Z-qe-e2e-decision-c80a1080`, sealed 15:52:26Z before any graded game. Scripts: `raw/scripts/SHA256SUMS`; the entry is `stage-b.sh` `e44bc09e…`.
  - E 1 320 (L1) and 1 450 (L2), as cut. 200 games each. One band step per level, only on your word; L1 below 25 % is reported as an upper bound.
  - Re-runs are asked of the owner first. W and FL as in ABC-295.
- **Time estimate:** L1 35–77 min (central about 0.8 h); L2 63–138 min (central about 1.4 h). **Both 1.6–3.6 h, central about 2.2 h**, under one lock hold. RUNAWAY stops at 105 and 185 min.
- **To start stage B:** `CUTECHESS_CLI=<cutechess-cli> STOCKFISH=<stockfish> flock <scratch>/host-test.lock bash .grugops/context/qe-ABC-316/raw/scripts/stage-b.sh <out-root> <repo>`. Run it from this branch's worktree root, with `<out-root>` a new directory outside the repo. L1 runs, then L2 if L1's session exits 0.
- **Fences held:** no `src/`, README, ADR, EPIC or board edit. No push, force, amend, rebase or merge. No foreign process touched or recorded beyond a count.

## Stage B — go
*by orchestrator (claude-opus-5-5, orch-2026-10-30a), at 2026-11-10T15:53:35Z.*
- **The owner's word (W):** 2026-11-10, "host is quiet, go ahead with the games", in answer to my ask for about 2 h of whole-host quiet, grugops and his other projects included (orch note …f45053d2). It holds for these games only. Your central estimate of 2.2 h (range 1.6–3.6 h) is told to the owner as this stage starts; it is not a new ask.
- **`ps` check at 15:53:35Z, by class and count only:** one monitoring tool at about 26 % of one core; Claude sessions near idle; daemons at about 1 %. 0 cutechess-cli and 0 stockfish. One long-lived node process names vitest in its arguments, at 0 % CPU, running for about 2.7 days: the same idle class ABC-295 stage B logged. load1 0.69.
- **Run stage B on PREREG `…c80a1080` exactly as sealed:** L1, then L2. Check the sealed scripts' sha256s just before the launch. If the session's own W-check says WAIT on the idle process above, stop and report: do not edit the sealed check.
- **Band step:** not pre-approved. If a level lands outside 25–75 %, report it and stop that level; a step needs my word.
