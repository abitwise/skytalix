---
subtask: se-ABC-225-main
role: software-engineer
ticket: ABC-225
ref: .grugops/context/se-ABC-225-main/
branch: grugops/ABC-225 @ 9988a778 (worktree /home/olger/projects/public/wt-ABC-225); bring main 14c8aafa in by MERGE (no rebase)
width: shared, no timed reads
---
# SE ABC-225: take main into the branch; rpair budget 3 000 → 4 000
## Read
ABC-225 ticket (dated lines from bapm-ABC-228-merge-fold and bapm-ABC-242-225-owner), ADR-0053 d10, tools/rating/rating.ts on main (R literal 4000), qe-ABC-225 records on grugops/qe-ABC-225 (3da78303).
## Do
- `git merge <main sha>` into grugops/ABC-225; resolve tools/rating/rating.ts so rpair's own budget reads 4 000 and A1 ("same pins as r") holds against main's R mode.
- Gates via `npm run …`; npm test count. A1–A4 re-checked (non-timed). A5/A6 are QE's, ALONE at --concurrency 1.
## Fences
tools/rating/ and its tests only. Never push, force, amend, rebase, merge into main. No board edits. Never bare npx/npm exec. No games. No host paths. Never `while pgrep -f` loops.
## Publish
Sealed notes (task `se-ABC-225-main`, contextRoot = worktree), commit, `## Result` + trace row here, brief + claim to done/.

## Result

**2026-10-30, Software Engineer. Done. Branch `grugops/ABC-225` (worktree `../wt-ABC-225`): merge `3dca0e67` (main `14c8aafa` in, by merge, no rebase), notes `1e889a8a`, index render `933d9f35`. Not merged to main; nothing pushed. No game, no engine, no timed read.**

- **Merge:** one conflict, `tools/rating/rating.ts` in `main()`. Main's inline R argv went `3000 → 4000` (ABC-228, ADR-0053 d10); this branch had moved that builder into `cutechessArgs()`. Kept the `cutechessArgs()` call and carried `4000` into its `r` literal (`:410`). The builder now equals main's token for token except the `...start` hook (empty for `r`/`d`). Everything else auto-merged (ticket page keeps both sides' dated lines).
- **rpair budget:** `budget: 3000 → 4000` (`:660`). `pair-check.ts` A1 pin `st=3 timemargin=2000 → st=4 timemargin=1000`. A mutation back to 3000 turns it red (21/22); restored green. Note: the `r` path reads the literal, not `spec.budget`; both now read 4 000 (low finding, decision `…0813b232`).
- **A1–A4 MET offline:** `node --test tools/rating/pair-check.ts` 22/22. A1 also checked at the A5 shape (`--rounds 10 --concurrency 1 --dry-run`): only 2 `stderr=` paths, `-rounds 100→10`, `-pgnout` differ (observation `…a9f5834c`).
- **Gates at `3dca0e67`:** lint 0 (131 files), typecheck 0, build 0 (`dist/` 22 files, 0 from tools), `npm test` **63 files / 2 322 passed**, 0 failed, 0 skipped; skip integrity `No findings.`; NFR-008 0 lane files.
- **QE owes A5/A6** (observation `…2f0a5298`): `rpair <base> <cand> <out> --rounds 10 --concurrency 1` (pass the flag; default is 2), ALONE, on AC, Tctl median stop 85 °C, new PREREG. Both builds play `st=4`. A6 at width 1 from `schedule.log`.
- **Publishing:** `propose_note` not surfaced; admitted through its handler (`handleProposeNote` → `admitAndAppend`), trusted root = worktree. 3/3 admitted. Raw prints in `../wt-ABC-225/.grugops/context/se-ABC-225-main/raw/`.
- STOP: none.

### Trace row (10 cells, header order)

| ABC-225 | One command reads an interleaved R pair: base and candidate against the same Stockfish, alternating blocks, opening-paired error, host log | EPIC-010 | — | NFR-008 (0 lane files); ASVS L1 input check; ADR-0049 d4; R budget 4 000 ms per ADR-0053 d10 (no other pin moved) | grugops/ABC-225 @ 3dca0e67 (merge of main 14c8aafa; notes 1e889a8a, index 933d9f35): tools/rating/rating.ts (r literal + rpair budget 4000), tools/rating/pair-check.ts (A1 pin st=4) | pair-check.ts 22/22 (A1–A4 offline; mutation red at 3000); A1 at --rounds 10 --concurrency 1 dry run; npm test 63 files / 2 322 pass, skips 0; no game | — (tools only, no UAT); A5/A6 QE's real 40-game smoke at --concurrency 1 | — | In Review (branch, not merged; A5/A6 pending QE) |
