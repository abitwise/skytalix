---
id: 20261020T185816Z-software-engineer-observation-abc177-parity-census-gates-03c6e9de
kind: observation
by: software-engineer
at: 2026-10-20T18:58:16Z
verified_by:
confidence: high (every figure was run; counts only, no timing)
sealed: false
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-177
refs: [ABC-177, ADR-0046, NFR-008, ABC-167, ABC-171, ABC-174]
supersedes:
---

# `ABC-177` readings: kill-set parity, node census, row names, gates. Base `ff1e375f`, tip `f81bf03c`

Hand-authored and unsealed.

## Kill-set parity (A2; A6 is QE's to re-confirm)
- **How it ran:**
  - `probe/mut.mjs` ran one mutant at a time on scratch trees: B (`git archive ff1e375f`) and C (B plus the tip's test
    file, `cmp`-identical to `f81bf03c`).
  - Each run was `NODE_OPTIONS=--max-old-space-size=400 vitest run src/uci-session.test.ts -t <the 15 changed rows>`,
    with `--testTimeout=120000` and the JSON reporter.
  - After every mutant the source was restored and compared.
- **Controls:** green at both trees, with 15 rows run every time and no suite errors.
- **Result:** 145 mutants at each tree, with the same id set. 35 are killed by at least one changed row.
  **All 15 rows: the same killed ids at base and tip.** Raw: `probe/kill-base.jsonl`, `probe/kill-c1.jsonl` (c1 is
  the tip tree). Table: `probe/parity-base-vs-tip.out`.
- **Kill sets per row (base = tip):**
  - **U1 stop:** 167-M13, M16, H1, H2.
  - **U1 ponderhit:** the same, plus 167-M14.
  - **U2:** 167-M13, M15, M16, M46, M45b; 171-S28; 174-M09, M10, M11, M17; H1, H2.
  - **U3:** 167-M16; 171-N01, N09, N17, S28; H1.
  - **U4:** 167-M16, M37; 171-N03, S28; H1.
  - **U5:** 167-M16; 171-N10, N11b, N12, S15; H1.
  - **U6 i5:** 167-M16, M24, M46, M45b; 171-N04, N05, N13, S28; 174-M09, M10, M11, M17; H1.
  - **U6 i6:** 167-M16, M22, M23, M46, M45b; 171-N13, S28; 174-M09, M10, M11, M17; H1.
  - **U7, all six rows:** 167-M24, M46, M45b; 171-S28; 174-M09, M10, M11, M17.
    - Plus 167-M19 on `depth 0` and `mate 0`.
    - Plus 167-M20 on `depth 2.5`.
  - **U8:** 167-M46, M45a; 171-S01, S04, S37, S40.

## Node census (A7)
- **Method:** `deepen`'s return was instrumented in a scratch copy (`probe/census.mjs`: a global sum plus per-test
  hooks). The whole file ran at each tree, 126/126 green.
- **Results:**

| unit | rows | nodes per row, base → tip |
|---|---|---|
| U1 | stop, ponderhit | 76 863 → 655 each |
| U2 | A6-e1 | 25 642 → 676 |
| U3–U7 | the 11 other rows | 25 621 → 655 each |
| U8 | "two sessions" | 75 207 → 34 247 |

- **All 15 rows are strictly fewer.** Summed: **536 406 → 43 438, delta −492 968 nodes.**
- **The 111 other rows are unchanged**, node for node. Table: `probe/census-base-vs-tip.out`.

## Row names and count (A3)
- `npm test` ran at base (scratch B) and at the tip (the worktree). Each:
  - `last-run.json` `success` true;
  - 1 987 total, 1 987 passed;
  - 0 pending, 0 todo.
- `src/uci-session.test.ts`: 126 at each, all passed.
- The sorted full names (describe path plus title) are byte-identical. sha256 `a9875b13…` at both
  (`probe/sorted-*.txt`).

## Diff shape (A4, A5)
- `git diff --name-only ff1e375f f81bf03c` lists exactly `src/uci-session.test.ts`.
- The hunks, at base lines:
  - 266–269 and 271–273: U1;
  - 294 (U2), 325 (U3), 333 (U4), 349 (U5), 409 (U7), 506 (U6), 831 (U8). Each is checked to differ only in the step
    literal.
- No `it(` or `describe(` line is touched, and no `expect(` line outside U1.

## Gates at the tip (A12)
- **Green:**
  - `npm run lint` exit 0;
  - `npm run typecheck` 0;
  - `npm run build` 0;
  - `npm test` 1 987/1 987, `last-run.json` success.
- **Skip-integrity:** `test-skip-integrity.js .grugops/test-skips.md --skip-count 0` reports "No findings.", exit 0.
  The count of 0 is `numPendingTests + numTodoTests` from the tip's `last-run.json`. The separate vitest capture
  command was not run again.
- **Deep lanes:**
  - `CLI_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/cli.real-engine.test.ts`: 11/11;
  - `PERFT_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/perft.test.ts`: 32/32.
- **The M4 sweep:**
  - the row is green at the tip;
  - a scratch plant (`write("done")` after `write(answer)`) reds it ("expected 'done' to match …");
  - the source was restored and `cmp`-checked against base.
- **UAT measurement:** `git diff --name-only f81bf03c~1 f81bf03c | grep -v '\.test\.ts$' | grep '^src/'` is empty.
