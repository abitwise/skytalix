---
id: 20261010T103438Z-qe-e2e-artifact-ref-abc119-gates-commands-probe-bc7d8341
kind: artifact-ref
by: qe-e2e
at: 2026-10-10T10:34:38Z
verified_by:
confidence: high
refs:
  - ABC-119
  - A1
  - A2
  - A5
  - src/cli.real-engine.test.ts
  - .grugops/context/qe-ABC-119/probe/
supersedes:
---

# `ABC-119` QE: gates on the tip, the commands run, and where the raw files are

Hand-authored, no seal. `sha`, `gate_run` and `content_hash` are absent because no `§14` gate runs on this install.

- **Reviewed tip:** `a6453bc` on `grugops/ABC-119-r2`. `<wave>` = `grugops/wave-2026-09-25` (tip `b62d1b6`), and `<base>` = merge-base `242b624`.
  The worktree was clean before and after the gates (`git status --porcelain`: 0 lines).
- **Gates on `a6453bc`** (`probe/gates-tip.txt`), run with `CLI_DEEP` unset:
  - `npm run lint`: exit 0, 98 files (load1 16.2);
  - `npm run typecheck`: exit 0;
  - `npm run build`: exit 0 (load1 15.3);
  - `npm test`: exit 0, **51 files / 1541 tests**, 11.07 s, with 0 `[CLI_DEEP]` lines;
  - skip count `0`;
  - `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`: `No findings.`, exit 0.
- **Deep lane** (`probe/deep-lane-runs.txt`): `CLI_DEEP=1 npx vitest run src/cli.real-engine.test.ts` was run 3 times, each exit 0 and 7/7, at
  6.25–6.46 s and load1 15.2–17.5. Child walls were 3116–3147 ms. P1 added a fourth run under a parent `NODE_OPTIONS`, also exit 0 and 7/7.
- **`A5`**, run on the worktree:
  - `git diff --numstat <wave>...HEAD -- 'src/' ':!src/*.test.ts'`: empty;
  - `-- src/cli.test.ts AGENTS.md plans/nfr-catalog.md vitest.config.ts`: empty;
  - `-- src/`: `244 0 src/cli.real-engine.test.ts`;
  - `-- tools/ memory-bank/50-decisions plans/board.md`: empty.
- **Raw files**, under `.grugops/context/qe-ABC-119/probe/`. They are all `*.txt`, so none can join `lane-inventory`'s findings:
  - `env.txt`;
  - the gates: `gates-tip.txt`;
  - the inventory: `a2i-inventory.txt`;
  - the paired harness: `a2ii-preregistration.txt`, `a2ii-set{A,B}-runs.txt`, `a2ii-set{A,B}-analysis.txt` and `a2ii-dispersion.txt`, plus the
    harness scripts `harness-paired3.sh.txt` and `harness-analyse.js.txt`;
  - the mutants: `mutants.txt`, with the scripts `mutate.js.txt` and `run-mutant.sh.txt`;
  - `deep-lane-runs.txt`;
  - the probes: `probe-p1-node-options.txt` and `probe-p2-space-in-path.txt`.

  Scratch paths are written as `<scratch>`. The per-run vitest outputs stayed in the session scratchpad and are not committed.
- **Not touched by QE:** `src/`, `tools/`, `plans/board.md`, the ADRs, `AGENTS.md`, `plans/nfr-catalog.md`, `vitest.config.ts`,
  `.grugops/test-skips.md`, and the files of `ABC-127` and `ABC-130`. **The `AGENTS.md` lane line stays owed to the Scribe** (draft `…2409b286`).
  The RUN receipt for it is the deep-lane runs above.
