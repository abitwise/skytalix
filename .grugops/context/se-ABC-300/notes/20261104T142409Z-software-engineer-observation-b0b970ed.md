---
id: 20261104T142409Z-software-engineer-observation-b0b970ed
kind: observation
by: software-engineer
at: 2026-11-04T14:24:09Z
verified_by: 
confidence: high: every result is from a run under the host lock at 9835859d; the lane wall is one ungraded run
refs:
  - se-ABC-300
  - ABC-300
  - ABC-282
  - EPIC-011
  - ADR-0071
  - ADR-0056
  - NFR-008
  - R-281-a
  - ABC-276
  - tools/rating/rating.ts
  - tools/rating/pair-check.ts
  - grugops/ABC-300
  - 6af55341
  - 9835859d
supersedes: 
seal: sha256:818885b446db484d35652184cefe80de6ccbdf28d2ad8b2cbba2da9f2ac5b4a7
---

# se-ABC-300 observation: acceptance results and gates at 9835859d

All under the host lock, in the worktree, at commit `9835859d` (the type fix included).

- **A1 MET (offline):** `pair-check` A1 row passes. The printed `d <sha> <sha> <out> --tc 40/8 --rounds 50 --concurrency 1 --dry-run` exits 0, writes nothing, and both engine blocks read `tc=40/8`, `timemargin=0`, `restart=on`, `option.TimeMode=uci-clock-mode` in place; the rest of the vector equals the 100 ms one.
- **A2 MET (offline):** `--tc 40/15`, `40/8+0.1`, `10+0.1`, `x` exit 1 with `--tc <value>: d takes only 40/8`, no argv; `--tc 40/8` with `--budget-ms 100` / `3000`, either order, exit 1 naming both flags; `r` and `rpair` with `--tc 40/8` exit 1 with the usage text and empty stdout.
- **A3 MET:** 12 dry-run prints captured before the change (on `main` `6af55341`; `tools/rating/` is unchanged from the cut `19581ca1`, `git diff --stat` empty) and after: `r` default / 500 / 100, `d` default / 3000 / 2500 / 2000 / 1500 / 1000 / 100, `d` 100 at 50 rounds width 1, `rpair` default. `diff` shows only the usage text (raw/prints-diff.txt: one changed line, one added line). The ABC-225/247/255/275/276 rows pass unedited, but for ABC-276 A5's usage text (A4).
- **A4 MET:** usage diff as above; ABC-276 A5 updated and passing on both of its cases.
- **A5 MET:** `git diff --name-only main 9835859d -- src/ data/ vitest.config.ts` prints 0 lines; the diff touches `tools/rating/rating.ts` and `tools/rating/pair-check.ts` only.
- **A6:** `UNKNOWN - verify` at `ABC-282` A6 (needs a real run; none played here, per the ticket).
- **A7 MET:** `npm run lint` exit 0 (146 files); `npm run typecheck` exit 0; `npm run build` exit 0; `npm test` exit 0, 69 files, 2 650 / 2 650 passed, 0 skipped (0 new lane rows); `node --test tools/rating/pair-check.ts` 45 / 45 passed, 0 failed, 0 skipped.
- **Default lane time (NFR-008):** one run, `npm test` wall 9.27 s by `date`, vitest Duration 9.01 s. Ungraded, n = 1, other agents' work may have shared the host between lock sessions.
- **Mutants (scratch, restored, `cmp` checked):** M1 drop `option.TimeMode` (2 rows fail), M2 keep `timemargin=` at 5 000 − budget under `--tc` (1 fails), M3 accept any `40/` value (1 fails). Each killed by the ABC-300 describe.
- **R-281-a:** the diff touches no lane input (no non-test `src/`, no `package*.json`, `vitest.config.ts` or `tsconfig.json`, none of the four test files), so its rule runs none of the four `-t` lines.
- **First gate attempt, environment:** the worktree had no `node_modules`, and typecheck flagged `exactOptionalPropertyTypes` (fixed before the commit). `cli.test.ts` ABC-192 A2 reads `node_modules/vitest/package.json`, so the worktree borrows the main checkout's `node_modules` by a symlink (ignored, QE-274-d). Those failing runs are not the result above.
