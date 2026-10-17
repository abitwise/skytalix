---
id: 20261017T111000Z-qe-e2e-observation-abc024-mutants-and-criteria-6b1e4d27
kind: observation
by: qe-e2e
task: qe-ABC-024
at: 2026-10-17T11:10:00Z
verified_by:
confidence: high
refs:
  - ABC-024
  - plans/tickets/ABC-024-castling-default-lane-blind-spots.md
  - ABC-023
  - ABC-009
  - .grugops/context/qe-ABC-024/probe/
  - 20261017T110000Z-software-engineer-observation-remeasure-31f8734a
supersedes:
---

# `ABC-024` QE readings: mutants on base and head, A1–A5, gates

Hand-authored and unsealed (`AGENTS.md`: no `finding` is admissible on this install). **No timing was read.**

**Instrument (QE's own, written before `probe/harness.mjs` was opened):** `probe/qe-harness.mjs`. Two trees from
`git archive b84dc637` (base) and `git archive 290a9f86` (head) in the session scratchpad, outside every checkout, with
`node_modules` symlinked. The two trees differ only in `src/moves.castling.hardening.test.ts`. Each anchor is
asserted to occur exactly once and the bytes to change. Each state gets a fresh `tsc --noEmit` process and a fresh
`vitest run --reporter=json` process. Every `*_DEEP` variable is deleted from the env. `src/moves.ts` is restored
and re-hashed to `6335b452fc21ffe2d0f902ecab930840` after every state. **Result: 34 states on head and 31 + 3 on
base, 0 broken builds, 0 harness errors.** Raw: `probe/qe-mutants.{base,head,base-x}.jsonl`; table: `probe/qe-summary.tsv`.

## The seven named survivors (and the class controls)

| mutant | base 1792 | head 1810 | ABC-024 rows that fail at head | SE's reading |
|---|---|---|---|---|
| `BK` g8 dropped | **survived** | killed 1808 | A1 g8 (+ A3 corridor) | same |
| `BQ` b8 dropped | **survived** | killed 1808 | A1 b8 (+ A3) | same |
| `BQ` c8 dropped | **survived** | killed 1808 | A1 c8 (+ A3) | same |
| `BQ` d8 dropped | killed 1791, `tools/opening-book/book.test.ts` A2 only | killed 1807 | A1 d8 (+ A3) | same |
| R-half (right test skipped when `halfmoveClock !== 0`) | **survived** | killed 1808 | both A2 `clocks` rows | same |
| R-full (… `fullmoveNumber !== 1`) | killed 1791, `search.ordering.test.ts` 262-node row only | killed 1805 | all four A2 rows | same |
| R-ep (… ep square set) | **survived** | killed 1808 | both A2 `ep` rows | same |
| CTRL whole `empty` test removed | killed 1640/1737, 2 files fail at load | killed 1647/1755, 2 at load | all ten A1 rows | same |
| CTRL right test removed | killed 1789 | killed 1803 | all four A2 rows | same |

The six white/f8 drops: base 1764 / 1791 / 1789 / 1790 / 1788 / 1778, head 1780 / 1807 / 1805 / 1806 / 1804 / 1794.
**Every one of my 31 base and 31 head counts equals the SE's `mutants.base.out` / `mutants.rows.out`.**

**A1 discriminator:** each of the ten drops fails **exactly its own A1 row and no other A1 row** (f1→f1 … d8→d8),
`PERFT_DEEP` unset. The incidental non-A1 kills of each drop are byte-identical between base and head, so the rows
added no kill elsewhere.

## A5 second half: the fifteen controls

`EQ01`–`EQ15`, encoded by QE from `ABC-023` A5's prose list: **15 survive at base, 15 survive at head. 0 kills
added.** See the decision note for the control-list check against the SE's encodings.

## A3 discriminator (`probe/qe-a3.mjs`, the hardening file alone, fresh process each)

Deleting any one of the 10 A1 rows turns the A3 corridor quantifier red (10/10). Narrowing any one of the 4 A2 rows to
`- 0 1` turns the A3 scalar quantifier red (4/4). **14/14.** I also widened a **black** corridor in production
(`BK empty [117, 118]` → `[117, 118, 101]`, f7): the full default lane fails 5 tests, among them the A3 corridor
quantifier, so A3(i) reads production and not only the file's `CASTLE_SHAPE` copy. The SE widened a white corridor
instead.

## Witnesses (`probe/qe-witness.ts`, head tree)

All 16 row FENs (10 A1, 4 A2, 2 controls) parse under the **strict** `parseFen`, round-trip through `toFen`, and
give the row's castles and legal count: 30, 26, 22, 30, 39, 30, 26, 22, 30, 39; 24 ×4; `e1g1 e1c1` 26 ×2. The
hardening file itself imports `parseFenGrammarOnly`. The strict check shows the rows are not only grammatical.

## A4 and the fences

- `md5 -q src/moves.ts`: `6335b452fc21ffe2d0f902ecab930840` at base, at tip, in both scratch trees, and on `main` `f1667ef3`.
- `git diff --numstat b84dc637 a18da7f5`: `280 0 src/moves.castling.hardening.test.ts` and nothing else.
  `git diff -U0 b84dc637 290a9f86`: **0 removed lines in any file**. One hunk in `src/`: `@@ -1528,0 +1529,280 @@`, appended after the last `describe`.
- Test count: **58/1792 → 58/1810, +18** (10 A1 + 4 A2 + 2 controls + 2 A3).

## Gates on the tip `290a9f86` (worktree)

`npm run -s lint` exit 0 (113 files); `npm run -s typecheck` exit 0; `npm run -s build` exit 0; `npm test` exit 0,
58 files, 1810/1810; `.test-results/last-run.json` success `true`, pending 0, todo 0; skip count (jq) **0**;
`test-skip-integrity.js … --skip-count 0` → `No findings.`; `PERFT_DEEP=1 npx vitest run src/perft.test.ts` → **32/32**,
exit 0. `git merge-tree --write-tree main 290a9f86` exit 0. Since base, `main` moved only by `ABC-030`'s three
comment-only lines in `src/{gameend,san,status-panel}.nfr.test.ts`.

## Security threshold

The trigger is +525 lines or a second file. Measured: **+280, one file, not fired.** The added lines were read
anyway. They add no imports. A grep for spawn/exec/net/fetch/env/fs/eval/timers/secrets has one hit, the word
"executable" in a comment. All six loops are bounded: a fixed array, or `0..127`.

## UAT-waiver reading

`git diff --name-only b84dc637...290a9f86 | grep -v '\.test\.ts$' | grep '^src/'` is **empty** (exit 1). The
per-commit form `<c>~1 <c>` is empty for `a18da7f5`, `1fbb98e4` and `290a9f86`. The only `src/` path in the range is
`src/moves.castling.hardening.test.ts`. **The 2026-08-17 waiver applies. Waived is not signed.**
