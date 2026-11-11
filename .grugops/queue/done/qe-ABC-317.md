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

## Stage B — go (L3, then L4)
*by orchestrator (claude-opus-5-5, orch-2026-10-30a), at 2026-11-10T20:57:15Z (orch note …20:57:15Z).*
- **The owner's word (W):** 2026-11-10, "host is quiet, run level 3 then level 4". He was told L3 takes about 2 h and L4 about 6 h (4.7–8.3 h). It is one window, for these two graded runs only.
- **Run, on PREREG `…e6cf1088` exactly as sealed:** L3 (`session.sh 3 1890`), then L4 (`session.sh 4 2040`). Check the sealed scripts' sha256s before each launch. Start L4 only after L3's session has exited.
  - If L3's session exits 3 or 5, stop and report.
  - If L3's session exits 4 (WAIT), stop and report.
  - An out-of-band L3 result does not stop L4: report it and go on to L4.
- **`ps` at 20:57:15Z, by class only:** one monitoring tool at about 25 %; Claude sessions near idle; 0 cutechess-cli and 0 stockfish; one long-lived idle vitest-class process at 0 % CPU (the same idle class as in ABC-295 and ABC-316); load1 0.18. If the session's own W-check says WAIT on it, stop and report; do not edit the sealed check.
- **Band steps are not pre-approved.** Report each level's reading; a step waits for the owner's word.

## Stage B
*QE/E2E (claude-opus-5-5, qe-ABC-317), 2026-11-10/11, on `grugops/qe-ABC-317` from `a44dc556` (harness `tools/` `6272e8d2`, worktree `src/` `21f3b304`). Read sha `b6366a79` (`src/` `21f3b304`).*

**Result: both levels VALID and INSIDE the band (outcome 2): E confirmed at both. L3 = 1 909.1 ± 47.9 (E 1 890); L4 = 2 094.3 ± 47.9 (E 2 040). No step needed or run. B2 is MET for both levels.**
- **Notes:** L3 readings `20261110T230239Z-qe-e2e-observation-6431da57`, verdict `20261110T230239Z-qe-e2e-decision-181f12c9`. L4 readings `20261111T044345Z-qe-e2e-observation-66b23e6c`, verdict `20261111T044345Z-qe-e2e-decision-75bd7076`. Read once each under PREREG `…e6cf1088`.
- **Run:** `session.sh 3 1890`, then `session.sh 4 2040`, each under its own lock hold, as sealed. The sealed scripts' sha256s were checked OK just before each launch, which was gated on that check. L3's records were committed (`45ba8992`) before L4 started.
- **L3** (`--skill 3 --elo 1890`, `st` 0.33 s):
  - **103 / 5 / 92, 105.5 / 200 = 52.75 %** (White 58.5, Black 47.0).
  - Elo +19.1 ± 47.9, so **X = 1 909.1 ± 47.9**. Cluster ± 46.5.
  - Faults 0, time losses 0, depth guard 0 of 11 449 below depth 4. Latency max 335 ms (margin 380).
  - W-check 20:58:04Z 0 / 0 / 0 / 0. `r` 20:58:04Z–23:01:22Z, **123 min 18 s** (estimate 94–165, central 121). Stops none; session exit 0.
  - Host ALONE for the SHARED classes (732 samples). One game-boundary sample counted 1 `stockfish` and 1 `node`.
- **L4** (`--skill 4 --elo 2040`, `st` 1 s):
  - **111 / 9 / 80, 115.5 / 200 = 57.75 %** (White 58.0, Black 57.5).
  - Elo +54.3 ± 47.9, so **X = 2 094.3 ± 47.9**. Cluster ± 48.0.
  - Faults 0, time losses 0, depth guard 0 of 10 549 below depth 5. Latency max 1 004 ms (margin 1 050).
  - W-check 23:02:51Z 0 / 0 / 0 / 0. `r` 23:02:51Z–04:42:45Z, **339 min 54 s** (estimate 283–500, central 367). Stops none; session exit 0.
  - Host ALONE for the SHARED classes (2 018 samples). Three game-boundary samples counted 1 `node` or 1 `stockfish`.
  - The game-boundary counts at both levels match ABC-316's pattern, likely the tool's own engine restart (UNKNOWN - verify). Under FL they change nothing.
- **Reported, not graded:** L3 − L2 = +231.0 ± about 68; L4 − L3 = +185.2 ± about 68. Stockfish's `st` differs between levels (UNKNOWN - verify, its time-scale effect). L3 is inside its projection (~1 850–1 925). L4's centre is 19 above its projection's top (~2 000–2 075), within error; that is B3's to weigh against L5–L7.
- **Records:** `raw/out/l3-e1890/`, `raw/out/l4-e2040/` and `raw/out/session-l*/`, redacted by `raw/redact.sh` (a one-line-header copy of qe-ABC-316's, written after the seal; records only). The full `r.out` files stay in scratch, with their sha256s. Both build clones were deleted.
- **Fences held:** no sealed script edited, no band step, no re-run. No `src/`, README, ADR, EPIC or board edit. No push, force, amend, rebase or merge. No foreign process touched or recorded beyond class and count.

## Stage C — B3 and B4 check, go
*by orchestrator (claude-opus-5-5, orch-2026-10-30a), at 2026-11-11T04:47:00Z.*
- The README branch `grugops/ABC-317-readme` (SE c6a1c640) is merged into this branch. Its spec is the ruling …152bb16f.
- **Check B3:**
  - Every measured README figure traces to your sealed verdicts: L1 …f44a427d, L2 …553195c0, L3 …181f12c9, L4 …75bd7076.
  - L5–L7 follow the ruling's arithmetic and are marked projected.
  - The prose matches the method.
  - ABC-316's five gaps (…a55b90ec) are closed.
  - The Strength section is unchanged and the art cmp passes.
  - The diff against main is limited to README, CHANGELOG and records.
- **Check B4:** lint, typecheck, unit (one worker) and build on this tip, each alone under the lock. The `src/` diff against main must be empty, which gives the UAT waiver.
- **Give a verdict for ABC-317 (PASS / PASS_WITH_GAPS / FAIL).** No games.

## Stage C
*QE/E2E (claude-opus-5-5, qe-ABC-317), 2026-11-11, on `grugops/qe-ABC-317` at `41afdc90` (README branch `c6a1c640` merged by `a25f500b`), against `main` `559656a0`. No games.*

**Result: PASS_WITH_GAPS for ABC-317, no blocking gap. B1–B4 MET. The `src/` diff against `main` is empty, so the UAT waiver applies.**
- **Notes:** checks `20261111T044946Z-qe-e2e-observation-8586e284`; verdict `20261111T045008Z-qe-e2e-decision-6298d7f0`.
- **B4 gates,** each alone under `flock <scratch>/host-test.lock`, all exit 0:
  - lint (150 files);
  - typecheck;
  - unit with `VITEST_MAX_WORKERS=1`: 72 files, 2 740 / 2 740, 0 skipped;
  - build;
  - `pair-check.ts`: 52 / 52, 0 skipped;
  - the art cmp.
  - The tree stayed clean.
- **Scope:**
  - `src/` is `21f3b304` and `tools/` is `6272e8d2` on both sides. The waiver command prints nothing.
  - Changed: README, CHANGELOG and `.grugops/` records only. README and CHANGELOG are byte-equal to `c6a1c640`.
  - README outside `## Levels` hashes the same as on `main`.
- **B3:**
  - L1–L4 (`1499 ± 53`, `1678 ± 49`, `1909 ± 48`, `2094 ± 48`) trace to `…f44a427d`, `…553195c0`, `…181f12c9` and `…75bd7076`. They were also recomputed from W / D / L at full precision.
  - L5–L7 follow `…152bb16f` and are marked projected.
  - The Stockfish-time caveat is stated.
  - ABC-316's five gaps are closed.
- **Gaps, none blocking (reported, not fixed):**
  1. L7's low edge: the method gives 2 389.3, which rounds outward to 2 380. The ruling and the README write 2 390. The ruling is the source.
  2. The blunder cost (10–14 a point) is no longer stated, so the 2144–2164 anchor cannot be rebuilt from the README.
  3. "+50 to +75 … less than the roughly +75" has a top equal to its comparator (ruled 73–79). The 0.1 s point (the Strength section's 1902.5) is not named.
- **Not covered:**
  - Stockfish's time-scale effect (UNKNOWN - verify).
  - The projections' anchor error.
  - `v1.0.0` on the remote (UNKNOWN - verify; it exists locally).
- **Fences held:** no games. No `src/`, README, CHANGELOG, ADR, EPIC or board edit. No push, merge, amend, force or rebase.
