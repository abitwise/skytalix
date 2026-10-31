---
id: 20261031T073055Z-qe-e2e-observation-47dcfb73
kind: observation
by: qe-e2e
at: 2026-10-31T07:30:55Z
verified_by: 
confidence: high: every check and gate run by QE at cec9c252; mutations in a scratch clone, never committed
refs:
  - qe-ABC-247
  - ABC-247
  - EPIC-010
  - ADR-0053
  - ADR-0049
  - ADR-0052
  - NFR-008
  - ABC-225
  - ABC-228
  - ABC-245
  - QE-M1B-a
  - QE-247-a
  - QE-247-b
  - QE-247-c
  - QE-247-d
  - QE-247-e
  - qe-EPIC-010-m1-batch/20261031T063141Z-qe-e2e-observation-5967dfc1
  - se-ABC-247/20261031T065701Z-software-engineer-decision-09cbe15a
  - se-ABC-247/20261031T065701Z-software-engineer-observation-e9efa27d
  - se-ABC-247/20261031T065701Z-software-engineer-observation-ea98b31b
  - se-ABC-247/20261031T065709Z-software-engineer-observation-c062cb93
  - grugops/ABC-247
  - 02f4f3d4
  - cec9c252
  - ca6e675c
  - 72a65fb7
  - 4cd261c1
  - e08b7718
  - grugops/qe-ABC-247
  - 3050c636
  - tools/rating/rating.ts
  - tools/rating/pair-check.ts
  - src/uci-session.ts
  - src/levels.ts
supersedes: 
seal: sha256:f753da133d06c2f66b482b91e56e86447713abf6ba76d7bd6db67b5c3631685d
---

# qe-ABC-247 A1 and A4: the pin, the mutations, the r/d byte-equality and the gates, re-run by QE at `cec9c252`

Raw prints are under `qe-ABC-247/raw/a1/` and `raw/a4/`. Host paths are redacted (`<scratch>`, `<worktree>`, `<repo>`, `<node>`,
`<cutechess-cli>`, `<stockfish>`). "M" is `main` `e08b7718`: its `tools/` and package files equal `4cd261c1`, the SE's branch point.
"T" is the tip `cec9c252`. The mutations and dry runs ran in two scratch `git clone --shared` checkouts (M and T), so the
worktree's `tools/` was never touched. `git diff --quiet cec9c252 -- tools/rating/rating.ts` held before and after.

## A1 — MET
- **(a)** `node --test tools/rating/pair-check.ts` at T: **25 tests, 25 pass, 0 fail, 0 cancelled, 0 skipped, 0 todo.**
- **(d) mutations** (scratch clone T; each restored with `git checkout`; never committed):
  - **M1**: `skill: PAIR_SKILL_LEVEL,` removed from rpair's `argsOf`. Result: **22 pass / 3 fail**. Red: the A1 diff test and both `ABC-247 (a)` tests. **MET.**
  - **M2**: `PAIR_SKILL_LEVEL = 5`. Result: 22 / 3 fail, the same three tests.
  - **M3**: the token added to every `sky()` group (`spec.skill ?? 6`). Result: 23 / 2 fail: the A1 diff test and `ABC-247 (c)`.
  - These match the SE's own M1 and leak runs (`se-ABC-247` `…ea98b31b`).
- **(c)** Dry runs with the real `CUTECHESS_CLI` / `STOCKFISH`, M vs T, with the same arguments and the same out path (not created). Commands:
  - `r ca6e675c`
  - `r cec9c252 --elo 1910 --rounds 10 --concurrency 1`
  - `d cec9c252 ca6e675c`
  - `d cec9c252 ca6e675c --budget-ms 1500 --rounds 50`
  
  Result: **all 4 pairs `cmp` byte-equal**, and `Skill Level` appears 0 times in all 8 prints. **MET.**
- **(b)/(d)** `rpair ca6e675c cec9c252 <out> --elo 1910 --rounds 100 --concurrency 1` (the batch command), M vs T:
  - The diff is exactly **20 added lines `  option.Skill Level=6`, 0 removed**.
  - `argv-check.mjs` checked T's print: in **20/20** argvs the engine groups are `[skytalix, stockfish]`.
  - Each argv has `Skill Level` exactly once, as the element right after `restart=on` in the skytalix group. The stockfish group has 0. **MET.**

## A4 — MET
The worktree used one `node_modules` symlink to the main checkout's (lock files equal). The symlink and `dist/` were removed afterwards.
- `npm run lint` 0 (131 files, no fixes), `npm run typecheck` 0, `npm run build` 0.
- `npm test` ran once, after a wait-clear (load1 0.42, Tctl 38.1 °C). Result: **63 files / 2 364 passed, 0 failed, 0 skipped, 0 todo** (9.18 s).
- `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` printed `No findings.` (exit 0).
- `git diff --stat main -- src data` is **empty**. The branch's own diff (`main...cec9c252`, merge-base `4cd261c1`) touches `tools/rating/rating.ts`, `tools/rating/pair-check.ts` and `.grugops/` records only. (`main` has since moved by one records-only Orchestrator commit, `e08b7718`.)
- `72a65fb7` vs `cec9c252` over `src data package*.json tsconfig*.json`: only `src/levels.test.ts` differs (ABC-245, a test file). So the head QE built is the ticket's head engine.
- No vitest file is touched, so G8 was not re-read (`NFR-008`).
