---
id: 20261104T024152Z-qe-e2e-observation-452bfc4a
kind: observation
by: qe-e2e
at: 2026-11-04T02:41:52Z
verified_by: 
confidence: high: git commands and gate runs as run, exit codes and reporter counts copied from raw/out
refs:
  - qe-ABC-280
  - grugops/ABC-280
  - ABC-280
  - ABC-239
  - EPIC-011
  - ADR-0067
  - B-T1
  - B-T3
  - NFR-008
  - se-ABC-280
  - 20261104T022726Z-software-engineer-decision-85c1bab5
  - 20261104T022726Z-software-engineer-observation-443095be
  - 20261104T022726Z-software-engineer-observation-bd5e26f5
  - 625b75fe
  - 5ce4f870
  - def26997
  - 8c03b713
  - ee4c4c84
  - 66798b22
  - f831c04d
  - edb9fddd
  - d3080707
  - 4e8ab57a
  - 26d06118
  - tools/tune/tune.ts
  - tools/tune/tracer.ts
  - tools/tune/pgn.ts
  - tools/tune/bounds.ts
  - tools/tune/tune.test.ts
  - tsconfig.json
  - biome.json
supersedes: 
seal: sha256:a4034464ad764b8ce939221c06a70157c31a0562adb734d843ab77fca85b9468
---

# qe-ABC-280 re-grades A1–A4 on the frozen code tip `edb9fddd`: 7 paths, `tools/tune` = `8c03b713`; `src/` diff empty (also on the simulated merge with `main` `4e8ab57a`); `npm test` 2 647 → 2 650 / 2 650, skips 0 = 0; lint, typecheck, build 0, `dist/` 24 files, none from `tools/`; `TUNE_DEEP` 17 / 17, 0 skipped

QE/E2E, task `qe-ABC-280`, ticket `ABC-280`. The ticket's acceptance criteria are the contract (the Engineer's notes `…85c1bab5`, `…443095be`, `…bd5e26f5` were read, not inherited). Every test, build and tool run was under the host lock (`flock <scratch>/host-test.lock`). Raw output: `.grugops/context/qe-ABC-280/raw/out/`; scripts: `raw/scripts/`.

**A1 (contents): MET.**
- `git diff --name-only main...HEAD`, outside `.grugops/`, `plans/` and `memory-bank/`, lists exactly 7 paths: `biome.json`, `tools/tune/{bounds,pgn,tracer,tune.test,tune}.ts`, `tsconfig.json`. The two-dot form against `main` `4e8ab57a` lists the same 7.
- `git diff 8c03b713 HEAD -- tools/tune` and `git diff 8c03b713 edb9fddd -- tools/tune` are empty.
- `tsconfig.json` and `biome.json` each gain one line, `"tools/tune/**/*.ts",`; `625b75fe`'s two added lines are the same text.
- Each of the four commits carries `cherry picked from commit` naming its source: `ee4c4c84` ← `625b75fe`, `66798b22` ← `5ce4f870`, `f831c04d` ← `def26997`, `edb9fddd` ← `8c03b713`.

**A2 (`src/` untouched): MET, so the UAT waiver applies.**
- `git diff --stat main HEAD -- src` is empty; `git -c core.quotePath=false diff --name-only main HEAD | grep '^src/'` prints nothing (exit 1). The worktree's `src` tree id is `8adb0a18`, the same as `main`'s.
- `main` moved after the branch's base: `dcc1bae0` → `4e8ab57a`, then during this hop → `df6a873f` (the `arch-ABC-271` merge) → `b2ae942b`. Every move was records only, and `main`'s `src` tree is still `8adb0a18`. The A1 and A2 diffs above were re-run against `b2ae942b`, with the same result. The prospective merge was simulated with `git merge-tree --write-tree main HEAD`: tree `80a235a7` at `4e8ab57a` with no conflict, and tree `40e83802` at `b2ae942b` with one records conflict, `plans/traceability.md` (QE-280-g). On both trees, the standing rule's reference form (`memory-bank/60-progress.md` 2026-08-17, with `core.quotePath=false`), `git -c core.quotePath=false diff --name-only main <tree> | grep -v '\.test\.ts$' | grep '^src/'`, prints nothing. It lists the same 7 non-record paths. The read on the DELIVERED merge commit cannot be taken before the merge exists. It is owed at merge (gap QE-280-c).

**A3 (default lane): MET.**
- N, read today at `main` `4e8ab57a` in a scratch clone (its `src` tree is `8adb0a18`, as at the tip): `npm test` exit 0, **68 files, 2 647 passed**, 9.77 s real.
- At the tip: `npm test` exit 0, **69 files, 2 650 passed, 0 failed** (N + 3). The added file is `tools/tune/tune.test.ts` with **3 tests** (the source pins, the quiet filter's record, the FEN source row), 4 ms.
- The skip-count capture (AGENTS.md § Test integrity, as spelled) returned **0 on `main` and 0 at the tip**. `test-skip-integrity.js .grugops/test-skips.md --skip-count 0` printed `No findings.`, exit 0.
- `npm run lint` exit 0 (146 files, no fixes); `npm run typecheck` exit 0; `npm run build` exit 0. `dist/` then held **24 files, all `dist/<module>.js` from `src/`; none under `dist/tools` and none named `tune`**. `dist/` was absent before the build and was removed after it.
- The deep rows are not registered without `TUNE_DEEP`: the default lane counts 3 from that file, and no skipped row appears.

**A4 (the tool's lane): MET.** `TUNE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run tools/tune --reporter=verbose` exit 0: **17 passed, 0 skipped, 0 failed** (3 source rows plus 14 deep rows), 9.28 s real. That fills the ticket's `UNKNOWN - verify` count: 17.
