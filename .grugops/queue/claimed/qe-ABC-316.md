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

## Stage B
*QE/E2E (claude-opus-5-5, qe-ABC-316), 2026-11-10, on `grugops/qe-ABC-316` at `befef8d9` (harness `tools/` `6272e8d2`). Read sha `main` `b6366a79` (`src/` `21f3b304`).*

**Result: both levels VALID. L1 is inside the band: E 1 320 confirmed, figure X = 1 499.5 ± 53.4. L2 is ABOVE the band (82.25 %): X = 1 716.4 ± 64.3 is not the level's figure. A step to E′ 1 720 needs your word. QE stopped; no step was run.**
- **Notes:** readings `20261110T172335Z-qe-e2e-observation-659eb162`; verdict `20261110T172339Z-qe-e2e-decision-f44a427d`. Read once under PREREG `…c80a1080`. The four sealed scripts' sha256s were checked OK just before the launch.
- **Run:** `CUTECHESS_CLI=<cutechess-cli> STOCKFISH=<stockfish> flock <scratch>/host-test.lock bash .grugops/context/qe-ABC-316/raw/scripts/stage-b.sh <out-root> <repo>`, under one lock hold, 15:54:24Z–17:20:58Z (1.44 h, against 1.6–3.6 h estimated). Gates 1–4 passed at both levels (W-check 0 / 0 / 0 each time). Stops: none. `stage-b.sh` exited 0.
- **L1** (`--skill 1 --elo 1320`, `st` 0.1 s):
  - 142 / 11 / 47, 147.5 / 200 = 73.75 % (White 72.0, Black 75.5).
  - Elo +179.5 ± 53.4, so **X = 1 499.5 ± 53.4**. Cluster ± 53.9.
  - Outcome 2, E confirmed. One move-cap draw (round 48, Stockfish failed to mate with Q+B); without it P = 147.0, the same outcome.
  - Faults 0, time losses 0, depth guard 0 of 10 813. Latency max 105 ms.
  - `r` 36 min 37 s. Host ALONE (217 samples).
- **L2** (`--skill 2 --elo 1450`, `st` 0.18 s):
  - 164 / 1 / 35, 164.5 / 200 = 82.25 % (White 83.0, Black 81.5).
  - Elo +266.4 ± 64.3, so X = 1 716.4 ± 64.3, **outside the band; not the level's figure**. Cluster ± 69.0.
  - Outcome 3. Faults 0, time losses 0, depth guard 0 of 8 360. Latency max 184 ms.
  - `r` 49 min 56 s. Host ALONE for the SHARED classes (296 samples). Two single samples counted 1 `node` and 1 `stockfish`, at game boundaries; likely the tool's own engine restart (UNKNOWN - verify). Under FL this changes nothing.
- **For you:** one upward L2 step at **E′ 1 720**: a new 200-game run, the sealed command with `--elo 1720`, about 50 min (45–90). It needs your word and the owner's held host (W held "for these games only"). Alternatively your ruling otherwise.
- **Reported, not graded:** L2 − L1 = +216.9 ± about 84, provisional while L2 is outside the band. Both levels read stronger than the README's projections (L1 1 000–1 300, L2 1 300–1 550).
- **Acceptance:** A3 is MET for L1 and OPEN for L2 (no figure yet). A4 waits on L2.
- **Records:** `raw/out/l1-e1320/`, `raw/out/l2-e1450/` and `raw/out/session-*/`, redacted by `raw/redact.sh`. That script was written after the seal and handles records only. Each full `r.out` stays in scratch, with its sha256 in `SHA256SUMS.unredacted-originals`.
- **Fences held:** no sealed script edited, no band step. No `src/`, README, ADR, EPIC or board edit. No push, force, amend, rebase or merge. No foreign process touched or recorded beyond class and count.

## Stage B2 — L2 band step, go
*by orchestrator (claude-opus-5-5, orch-2026-10-30a), at 2026-11-10T17:54:51Z (orch note …f8be2b11).*
- **The owner's word (W):** 2026-11-10, "yes, re-run now to make it final", in answer to my ask for about 50 min of whole-host quiet. It holds for this run only.
- **The step:** L2 only, E′ = 1720. Seal a PREREG addendum (a sealed note naming E′, the command, and that this is PREREG …c80a1080's one allowed step) before the first game. Run the sealed scripts unchanged, with `--elo 1720` only. 200 games.
- **`ps` at 17:54:51Z, by class only:** one monitoring tool at about 25 %, Claude sessions near idle, 0 cutechess-cli, 0 stockfish, load1 0.09.
- **No second step.** If the score at E′ is outside 25–75 %, report it as a bound and stop.
