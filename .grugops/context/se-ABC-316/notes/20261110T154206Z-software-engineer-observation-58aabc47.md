---
id: 20261110T154206Z-software-engineer-observation-58aabc47
kind: observation
by: software-engineer
at: 2026-11-10T15:42:06Z
verified_by: 
confidence: high: every check was run by SE after the last code edit
refs:
  - se-ABC-316
  - ABC-316
  - grugops/ABC-316
  - ebbeb615
  - tools/rating/rating.ts
  - tools/rating/pair-check.ts
  - src/levels.ts
  - orch-2026-10-30a/20261110T153717Z-orchestrator-decision-20c41f8c
supersedes: 
seal: sha256:644a7e5381e25ae9e7e3d002f5e19c930e05948dac4876c73832ab1856174dae
---

ABC-316 A1, `r --skill L`, delivered on branch `grugops/ABC-316` at commit ebbeb615 (parent b6366a79, main). Diff: `tools/rating/rating.ts`, `tools/rating/pair-check.ts`. The `src/` diff is empty.

- `rating.ts`: `r` takes `--skill L`, where L is 1 to 4 and is checked as text (`/^[1-4]$/`). Budget = `LEVELS[L].budgetMs`, imported from `src/levels.ts`. Skytalix gets `option.Skill Level=L` after `restart=on`, `st` = budget in seconds and `timemargin=50`. Stockfish gets the same `st` and `timemargin=2000`; its other pins are unchanged. These are refused before any git, build or process: `--skill` together with `--budget-ms` (in either order), and an L outside 1 to 4. `machine.txt` gets `control: skytalix Skill Level=L st=S timemargin=50, stockfish st=S timemargin=2000`. With `--skill`, the old 100 ms control line is not written. New optional `ArgSpec.level`. Usage text and header carry `--skill` and a short `ABC-316` paragraph.
- Without `--skill`, the argv-building code path is unchanged.
- `pair-check.ts` (offline `node --test`, not in the vitest lane, as ABC-275 and ABC-300) adds the `ABC-316` suite with 7 tests:
  - R2's dry-run argv joined with placeholders is byte-equal to the committed `.grugops/context/qe-ABC-295/raw/out/r2/cmd.txt`.
  - L1 (E 1320) and L2 (E 1450) whole vectors equal R2's vector with both `st` set to `LEVELS[L]` (0.1 and 0.18) and the Skill token added.
  - L3 and L4 take their budgets from `LEVELS`.
  - `--elo` 2601 and 3190 print under `--skill`, and 1319 is refused.
  - `--skill` with `--budget-ms` is refused.
  - L values 0, 5, 7, 1.0, 01 and x are refused.
  - `d` and `rpair` refuse `--skill` with the usage text.
- The A5 usage-text test was updated for the new r line and the `--skill` row.

Dry-run L1 (`r HEAD <empty-out> --skill 1 --elo 1320 --rounds 100 --concurrency 1 --dry-run`), skytalix group: `st=0.1 timemargin=50 restart=on option.Skill Level=1`, Stockfish group: `st=0.1 timemargin=2000 ... option.UCI_Elo=1320`. L2: `st=0.18`, `timemargin=50`, `option.Skill Level=2` against Stockfish `st=0.18 timemargin=2000 option.UCI_Elo=1450`. In both runs, every other token equals R2's.

Recorded as an `observation`, not an `artifact-ref`: the writer refuses an artifact-ref without `sha`, `gate_run` and `content_hash`, and this install has no §14 gate run to name.

Gates, run on ebbeb615's tree after the last code edit. Each ran alone under `flock <scratch>/host-test.lock`, on one core.
- `npm run lint`: exit 0, 150 files, no fixes.
- `npm run typecheck`: exit 0.
- `VITEST_MAX_WORKERS=1 npm test`: exit 0, 72 files, 2740 tests passed, 0 skipped.
- `npm run build`: exit 0.
- `node --test --test-concurrency=1 tools/rating/pair-check.ts`: exit 0, 52 tests and 10 suites passed, 0 skipped.
- `node tools/grugops/records-path-check.js --base main`: clean.
- Dry runs for L1 and L2: exit 0, nothing written to the out dir. The tool paths were stand-ins (`CUTECHESS_CLI` and `STOCKFISH` set to `tools/rating/rating.ts`, as pair-check does). Under the stand-ins, Stockfish's `cmd=` printed as `<cutechess-cli>`.

No game was played and no engine was started.

Not checked: the `machine.txt` `control:` line under `--skill`. It is written only on a real run, and no test reads it, as with ABC-255/300's control lines. Stage A should read it on the first run. No `src/` change, so the zero-production-lines waiver applies.
