---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-11T21:44:52Z
subtask: se-ABC-320
role: software-engineer
ref: .grugops/context/se-ABC-320/
branch: new grugops/ABC-320 from main
width: tools/rating/ (harness and its tests) plus your notes and a Result block here. No src/, README, CHANGELOG, ADR, EPIC or board.
---
# ABC-320 C1: `r --skill 1–7`, `r --start S`, and a combine mode
Read the cut note `.grugops/context/orch-2026-10-30a/notes/20261111T214452Z-orchestrator-decision-972c91df.md` whole; C1 is your scope. Read `tools/rating/rating.ts` (header, `cutechessArgs`, `r`'s flag parsing, `rpair`'s block runs and pooling), `tools/rating/pair.ts`, `tools/rating/pair-check.ts` and `src/levels.ts`. ABC-316's brief `.grugops/queue/done/se-ABC-316.md` is the model.
1. `--skill L` accepts 1–7. `--skill 1`–`4` argv stays byte-equal to today's (pin it).
2. `r --start S`: `-openings … start=S` exactly as `rpair` builds it; refuse S < 1 or S + rounds − 1 > 100. Without `--start`, argv byte-equal to today's (R2's `cmd.txt` pin stays green). Record S in `machine.txt`.
3. A combine mode (name it; `rsum` is a suggestion) that takes segment out-dirs and prints one pooled reading by cutechess-cli 1.5.1's formula, reusing `pair.ts`'s pooling. Refuse segments that differ in sha, level, E, `st`, pins or openings sha, and opening ranges that overlap or leave a gap. Print the openings covered and the games per segment.
4. Tests: L5–L7 argv (st 4, 10, 30), `--start`, every refusal, and pooling on a hand-checked two-segment case. Keep the header comment style (a short `ABC-320` paragraph).
5. Gates: lint, typecheck, `VITEST_MAX_WORKERS=1 npm test`, build, and `node --test --test-concurrency=1 tools/rating/pair-check.ts`, each alone under the host lock. Paste dry-run argv for `r HEAD <empty-out> --skill 5 --elo 2280 --rounds 5 --start 1 --concurrency 1 --dry-run` and `--start 6` (paths as placeholders). **No games. No engine run beyond dry-run and the unit tests.**
Every run goes as `flock <scratch>/host-test.lock <cmd>`, one core, one at a time, with one vitest worker. Committed files carry `<scratch>`, never the real path. Never kill foreign processes. Publish typed notes (`at` from `date -u` run just before each). Add a `## Result` block to this brief. Commit on `grugops/ABC-320` and run `node tools/grugops/records-path-check.js --base main` first. No push, force, amend, rebase or merge into main. Commit messages end with "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>".

## Result
Done, C1 only, on `grugops/ABC-320`; code at 35d7ca45 (parent 9f8513f9, the claim; base main 6f79f5ca). Diff: `tools/rating/rating.ts` and `tools/rating/pair-check.ts`; `src/` diff empty. No game was played and no engine was started.
- `r --skill L` takes 1–7. L5–L7 give both sides `st` 4, 10 and 30 (`LEVELS[L].budgetMs`), skytalix `timemargin=50`, Stockfish `timemargin=2000`. L1–L4 argv is unchanged: L3 and L4 are byte-equal to `qe-ABC-317`'s committed `cmd.txt`, and L1–L7 are pinned as R2's vector plus `st` and `Skill Level`. The refusal now reads `r takes only 1 to 7`, and ABC-316's refusal test now refuses 0 and 8.
- `r --start S` adds `start=S` after `order=sequential`, as `rpair`'s blocks do. It refuses S outside 1–100 (checked as text) and S + rounds − 1 > 100. `machine.txt` gets `start: S (openings S–T)` only when the flag is given. Without the flag, R2's `cmd.txt` pin stays green. `d` and `rpair` refuse `--start` with the usage text.
- `rsum <r-out-dir>…` (usage line `node tools/rating/rating.ts rsum <r-out-dir>…`) reads each segment's `artifacts.txt`, `machine.txt` and `cmd.txt`. It refuses any difference in sha, level, E, `st`, pins (cutechess-cli and Stockfish sha256) or openings sha256. It also refuses opening ranges that overlap or leave a gap. It judges each segment with `summarise` and pools them with `readBuild` (cutechess-cli 1.5.1's formula, each segment's own line checked). It prints each segment's openings, games and W/L/D, the openings covered and the pooled reading. It writes nothing and takes no flag.
- Gates, each run alone under `flock <scratch>/host-test.lock`:
  - lint: 0.
  - typecheck: 0.
  - `VITEST_MAX_WORKERS=1 npm test`: 0, 2740/2740 tests, 0 skipped.
  - build: 0.
  - `node --test --test-concurrency=1 tools/rating/pair-check.ts`: 66/66, 0 skipped.
  - records-path-check: clean.
- Dry run `r HEAD <out> --skill 5 --elo 2280 --rounds 5 --start 1 --concurrency 1 --dry-run` (tool paths are stand-ins): `<cutechess-cli> -engine name=skytalix cmd=<node> arg=<out>/clone-skytalix/dist/uci.js dir=<out>/clone-skytalix st=4 timemargin=50 restart=on option.Skill Level=5 stderr=<out>/skytalix.stderr -engine name=stockfish cmd=<stockfish> st=4 timemargin=2000 restart=on option.Threads=1 option.Hash=16 option.UCI_LimitStrength=true option.UCI_Elo=2280 stderr=<out>/stockfish.stderr -each proto=uci -openings file=<repo>/tools/rating/openings.epd format=epd order=sequential start=1 -repeat -games 2 -rounds 5 -concurrency 1 -maxmoves 200 -pgnout <out>/r.pgn -debug all`. With `--start 6` the output is the same except `start=6`.
- Notes: not published. `tools/grugops/note.js` is absent from this repo and `propose_note` is not available to this spawned role (Workflow 16 step 3: stop). The note bodies (decision, artifact-ref, observation) are in the hand-back for the Orchestrator to admit.
- Not checked: `machine.txt`'s `start:` line is only written on a real run (it needs Stockfish's `uci`), so no test covers it. `rsum` reads the raw `r.out` that `r` writes; a QE-trimmed record (no `r.out`, or a `.gz`) is not read.
