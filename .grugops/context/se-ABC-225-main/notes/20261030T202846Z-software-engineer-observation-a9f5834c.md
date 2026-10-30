---
id: 20261030T202846Z-software-engineer-observation-a9f5834c
kind: observation
by: software-engineer
at: 2026-10-30T20:28:46Z
verified_by: 
confidence: high: every check and gate run as stated at 3dca0e67; no engine, no game, no timed read
refs:
  - ABC-225
  - EPIC-010
  - ADR-0053
  - ADR-0049
  - NFR-008
  - tools/rating/rating.ts
  - tools/rating/pair-check.ts
  - grugops/ABC-225
  - 3dca0e67
  - 14c8aafa
  - 9988a778
  - se-ABC-225/20261029T210343Z-software-engineer-decision-e58c4d25
  - se-ABC-225/20261029T210343Z-software-engineer-observation-14fdbedc
  - bapm-ABC-242-225-owner/20261030T202446Z-ba-pm-decision-e2a5929b
  - qe-ABC-225/20261030T003823Z-qe-e2e-decision-3a53bdfc
supersedes: 
seal: sha256:bb40ef4e4e1bb94667768362055c29c28bc39bb29b5b4a2039f56e1895fc6b24
---

# SE observation, se-ABC-225-main: A1–A4 re-checked and gates at 3dca0e67 (no game, no timed read)

Raw prints under `se-ABC-225-main/raw/` (paths shown as `<repo>`, `<scratch>`, `<tmp>`). No `cutechess-cli`, no Stockfish, no engine started.

## Offline checks: `node --test tools/rating/pair-check.ts` → 22 tests, 22 pass, 0 fail, 0 skipped (5 suites, ≈ 3.8 s) (`raw/pair-check.txt`)
- **A1** (same pins as `r`): MET. The test compares `rpair --dry-run` with `r --elo 1910 --dry-run` for all 20 block-runs; with `start=S` dropped they differ only in the two `stderr=` paths, `-rounds 100 → 10` and the `-pgnout` path. The pin list now asserts `st=4 timemargin=1000`.
- **Mutation check:** with `cutechessArgs()`'s `r` literal set back to 3000, the suite reads 21 pass, 1 fail (the pin test) (`raw/pair-check-red.txt`). Restored; green again.
- **A1 at the A5 shape:** `rpair 9988a778 14c8aafa <out> --rounds 10 --concurrency 1 --dry-run` against `r 9988a778 <out>/base --elo 1910 --concurrency 1 --dry-run`: block 01 base has 41 tokens, 40 after `start=1` is dropped, same as `r`'s 40; the differences are exactly the 4 above. Both print `st=4`, `-concurrency 1`. The out dir does not exist after (`raw/dry-rpair.txt`, `raw/dry-r.txt`).
- **A2** (interleaving): MET by the A2 suite (10 blocks, ABBA order, openings 1–100 once per build, `-repeat -games 2`). The `--rounds 10` print shows 1 block, `base, then candidate`.
- **A3** (arithmetic): MET: pair −82.9 ± 73.8 and pentanomial −82.9 ± 64.3 from the `qe-epic008-close` r1/r2 records (unchanged; they are 3 000 ms records).
- **A4** (faults): MET: one faulted block (illegal move, disconnect, stall, time loss, watchdog) → that build UNRESOLVED, pair UNRESOLVED.

## `r` and `d` against `main`
- The argv builder body in `cutechessArgs()` was diffed against `main` `14c8aafa`'s inline builder (with `out` read as `files`). The only differences are `const start = …` / `return [` for `const args = [`, and `...start` in `-openings` (empty for `r`/`d`). So `r` and `d` print the same argv as `main`. The stub-replay byte-identity run from `se-ABC-225` was not repeated.

## Gates at 3dca0e67 (worktree node_modules; `package.json`/lockfile unchanged between `8eb8a4f9` and `14c8aafa`)
- `npm run lint` exit 0 (131 files). `npm run typecheck` exit 0. `npm run build` exit 0: `dist/` 22 files, 0 from `tools/`.
- `npm test` exit 0: **63 files / 2 322 tests passed**, 0 failed, 0 skipped, 0 todo. No lane file differs from `main`, so the count is `main`'s.
- `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` → `No findings.`
- `NFR-008`: 0 lane files; `pair-check.ts` is not `*.test.*`.
