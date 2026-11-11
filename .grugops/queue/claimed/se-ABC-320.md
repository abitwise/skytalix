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
