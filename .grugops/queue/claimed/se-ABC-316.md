---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-10T15:37:17Z
subtask: se-ABC-316
role: software-engineer
ref: .grugops/context/se-ABC-316/
branch: new grugops/ABC-316 from main
width: tools/rating/ (harness and its tests) plus your notes and a Result block here. No src/, README, ADR, EPIC or board.
---
# ABC-316 A1: `r --skill L` in the rating harness
Read the cut note `.grugops/context/orch-2026-10-30a/notes/20261110T153717Z-orchestrator-decision-20c41f8c.md` whole; A1 is your scope. Read `tools/rating/rating.ts` (header, `cutechessArgs`, `stockfishSt`, `timemarginMs`, `r`'s flag parsing) and `src/levels.ts`.
1. Add `--skill L` (L in 1–4) to `r` only, exactly as A1 says. Budget comes from `LEVELS[L].budgetMs` (import it, do not copy it). skytalix: `option.Skill Level=L`, `st` = budget s, `timemargin` 50. Stockfish: `st` = the same budget s, `timemargin` 2000, other pins unchanged. Refuse `--skill` together with `--budget-ms`; refuse L outside 1–4. Record the level and both `st` in `machine.txt`.
2. Without `--skill`, `r`'s argv must be byte-equal to today's (pin R2's argv in a test: `r --budget-ms 100 --elo 1810 --rounds 100 --concurrency 1`, or whatever R2's committed `cmd.txt` under `.grugops/context/qe-ABC-295/raw/out/` shows). `rpair` and `d` are unchanged.
3. Tests: dry-run argv for L1 and L2 and the refusals. Keep the header comment in this file's style (a short `ABC-316` paragraph).
4. Gates: lint, typecheck, unit and build, each alone under the host lock. Also run `node tools/rating/rating.ts r HEAD <empty-out> --skill 1 --elo 1320 --rounds 100 --concurrency 1 --dry-run` and `--skill 2 --elo 1450`, and paste both argv outputs (paths as placeholders) in your Result. **No games. No engine run beyond dry-run and the unit tests.**
Every run goes as `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/4e4ca115-6685-4bae-8766-58344ce52820/scratchpad/host-test.lock <cmd>`, one core, one at a time, with one vitest worker. Committed files carry `<scratch>`, never the real path. Never kill foreign processes. Publish typed notes (`at` from `date -u` run just before each). Add a `## Result` block to this brief. Commit on `grugops/ABC-316` and run `node tools/grugops/records-path-check.js --base main` first. No push, force, amend, rebase or merge into main. Commit messages end with "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>".

## Result
Done, A1 only, on `grugops/ABC-316` at ebbeb615 (parent b6366a79). Diff: `tools/rating/rating.ts` and `tools/rating/pair-check.ts`; `src/` diff empty. No game was played and no engine was started.
- `r --skill L` (1–4): skytalix `option.Skill Level=L`, `st` = `LEVELS[L].budgetMs` (imported from `src/levels.ts`) and `timemargin=50`. Stockfish gets the same `st` and `timemargin=2000`, other pins unchanged. Refused: `--skill` with `--budget-ms`, and L outside 1–4. `machine.txt` records the level and both `st`. `--elo` keeps 1320–3190 under `--skill` (R1's 2600 cap stays on `--budget-ms 100` only; see the decision note).
- Without `--skill`, R2's dry-run argv is byte-equal to `.grugops/context/qe-ABC-295/raw/out/r2/cmd.txt` (pinned in `pair-check.ts`). `rpair` and `d` are unchanged.
- Gates, each run alone under `flock <scratch>/host-test.lock`:
  - lint: 0.
  - typecheck: 0.
  - `VITEST_MAX_WORKERS=1 npm test`: 0, 2740/2740 tests, 0 skipped.
  - build: 0.
  - `node --test --test-concurrency=1 tools/rating/pair-check.ts`: 52/52.
  - records-path-check: clean.
- Dry runs (`<out>` = an empty scratch dir; tool paths are stand-ins):
  - L1 `--skill 1 --elo 1320`: skytalix `st=0.1 timemargin=50 restart=on option.Skill Level=1`, Stockfish `st=0.1 timemargin=2000 … option.UCI_Elo=1320`.
  - L2 `--skill 2 --elo 1450`: `st=0.18` on both sides, `option.Skill Level=2`, `option.UCI_Elo=1450`.
  - In both, the rest equals R2's vector.
- Notes: `20261110T154157Z-software-engineer-decision-be0266ce`, `20261110T154206Z-software-engineer-observation-58aabc47`.
