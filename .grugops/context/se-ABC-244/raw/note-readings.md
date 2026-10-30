# `ABC-244` readings: SE kill-set parity (A2), row names and counts (A3), diff shape (A4, A5), gates (A10). Base `d59e3194`, tip `25282ad4`

Counts and exit codes only. The one `npm test` wall per arm is informal, and it is not a reading.

## Kill-set parity (A2; A6 is QE's to re-confirm on QE's own frozen list)
- **Trees:** B = `git archive d59e3194` in scratch. T = a copy of B plus the tip's two test files, `cmp`-identical
  to `25282ad4`, with `diff -r` showing only the step lines. The first try, T1, had both units at 1 000.
- **Runner:** `probe/mut.mjs`. It makes one scratch copy per mutant, does one exact replacement (asserted unique),
  then runs `NODE_OPTIONS=--max-old-space-size=128 vitest run src/cli.test.ts src/uci-session.test.ts -t "<the four
  ABC-230/ABC-241 blocks>" --testTimeout=120000 --reporter=json`. That is 18 rows per run.
  - The heap flag is the `SUITE` row: `heap-guard` refuses 400 MiB on two files.
- **Controls:** green at B and at T (18 ran, 0 failed, 0 suite errors).
- **Mutants:** all 9 apply at both trees. `QM1`–`QM4` kill no row in these blocks at base or tip.

**Final tip (U1 at 1 000, U2 at 100): 0 of the 8 unit rows differ.**

| row | killed at base | killed at tip |
|---|---|---|
| `cli` ABC-230 A1 "plays the third occurrence, at 0" | F230, REP0 | F230, REP0 |
| `cli` ABC-230 "keyHistory is read once per engine move" | F230 | F230 |
| `cli` ABC-230 A3 "a game started from a FEN …" | none | none |
| `uci` ABC-230 A2 "bestmove is byte-equal to the CLI level seam's move …" | F230, UNTRIM, REP0 | F230, UNTRIM, REP0 |
| `cli` ABC-241 A4 "plays d8e8 at exactly 0; base does not" (U2, unchanged) | F230, REP0, S241M1 | the same |
| `cli` ABC-241 A4 "with a legal ep capture …" (U2, unchanged) | none | none |
| `cli` ABC-241 A7 "the move the search scores 0 …" (U2, unchanged) | F230, S241M1 | the same |
| `uci` ABC-241 A5 "the CLI level seam's injected list equals UCI's …" (U2, unchanged) | F230, UNTRIM, REP0, S241M1, S241M6 | the same |

- **The T1 try (U2 at 1 000) is what kept U2 at 100.**
  - CLI ABC-241 A4: {F230, REP0, S241M1} → {REP0, S241M1}.
  - CLI ABC-241 A7: {F230, S241M1} → {S241M1}.
  - The U1 rows and the UCI A5 row were SAME at T1 as well.
  - Raw: `probe/kill-tip1-both1000.jsonl` and `probe/parity-base-vs-tip1-both1000.out`.
- **The ten unchanged rows** have the same kill sets at base and tip (`probe/parity-base-vs-tip.out`).
- **Raw:** `probe/kill-base.jsonl`, `probe/kill-tip.jsonl`, `probe/run-*.log`.

## Row count and names (A3)
- `npm test` was run once at B (scratch) and once at the tip (the worktree). Each `last-run.json` reads:
  - `success` true;
  - **2 322 total, 2 322 passed**;
  - 0 failed, 0 pending, 0 todo;
  - 63 files.
- `src/cli.test.ts` has **108** rows at each, all passed. Its sorted full names are byte-identical, sha256 `b49a6b49…ec82`.
- `src/uci-session.test.ts` has **200** rows at each, all passed. Its sorted full names are byte-identical, sha256 `72a34cea…56c5`.
- Files: `probe/sorted-{base,tip}-*.txt`, made by `probe/names.mjs`.

## Diff shape (A4, A5)
- `git diff --name-only d59e3194 25282ad4` prints `src/cli.test.ts` and `src/uci-session.test.ts`, and nothing else.
- There are six hunks:
  - two step lines, `cli.test.ts:4555` and `uci-session.test.ts:1286`, `100` → `1_000`;
  - four added comment lines, above `cli.test.ts:4554` and `:4626`, and above `uci-session.test.ts:1285` and
    `:1413`. Each cites only `ABC-244` and `ADR-0046` § Addendum 2026-10-30.
- No `expect(`, `it(` or `describe(` line changed. No title, budget, depth or bound literal changed, and no helper.
- Census instrumentation stays in scratch. Only copies of the probe scripts sit under this task's `raw/`, and nothing
  under `src/` is touched.
- UAT measurement: `git diff --name-only 25282ad4~1 25282ad4 | grep -v '\.test\.ts$' | grep '^src/'` is empty.

## Gates at the tip (A10)
- `npm run lint`, `npm run typecheck` and `npm run build` each exit 0.
- `npm test`: 63 files, 2 322 / 2 322, exit 0.
- `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` prints "No findings." and exits 0.
  The count 0 is `numPendingTests` + `numTodoTests` from the tip's `last-run.json`.
- `ABC-230`'s and `ABC-241`'s rows in both files are green, with their titles and assertions unedited.

## Informal wall (not a reading; QE owns A8/A9)
- One run per arm, back to back, base then tip, with load1 going 1.43 → 1.91 → 2.00.
- Base: `real` 9.67 s, `user` 28.89 s, vitest Duration 9.35 s.
- Tip: `real` 9.17 s, `user` 27.75 s, vitest Duration 8.88 s.
- n = 1 per arm, and no wait-clear or Tctl gate was applied, so it is `UNKNOWN - verify` until A9.
