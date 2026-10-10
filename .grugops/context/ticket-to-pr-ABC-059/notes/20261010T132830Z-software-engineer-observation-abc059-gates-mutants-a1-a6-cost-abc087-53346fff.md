---
id: 20261010T132830Z-software-engineer-observation-abc059-gates-mutants-a1-a6-cost-abc087-53346fff
kind: observation
by: software-engineer
at: 2026-10-10T13:28:30Z
verified_by:
confidence: high
refs:
  - ABC-059
  - ABC-042
  - ABC-065
  - ABC-087
  - Q13
  - N8-LANE
  - N8-SPAWN
  - ADR-0035
  - src/cli.test.ts
  - 20261010T132830Z-software-engineer-decision-abc059-span-rule-command-read-floors-not-counts-084a3e0b
supersedes:
---

# `ABC-059` readings: gate green; all five `AGENTS.md` mutants go GREEN → RED on the new row alone; `A1`–`A6` met; ABC-087's `AGENTS.md` stays green; `N8-LANE` inadmissible in both sets

Hand-authored and unsealed.
- Branch `grugops/ABC-059-runnability-guard`, from `0b6e1c25`. The code is `14c940ff`
  (`src/cli.test.ts` +76/−0).
- Not merged, not pushed.
- Machine: Apple M3, 8 cores, Darwin 25.5.0, Node v26.11.0.
- QE (`ABC-057`) and Security/NFR (catalog) lanes were running in parallel, so load1 is beside
  every reading.
- Raw files are in `../probe/` (`RUN.txt` indexes them). Absolute paths are rewritten to `<repo>` /
  `<scratchpad>`.

## Gate (at `14c940ff`, worktree)

| step | result | load1 |
|---|---|---|
| `npm run lint` | exit 0, 98 files | 15.10 |
| `npm run typecheck` / `npm run build` | exit 0 / exit 0 | 15.10 |
| `npm test` | exit 0, **51 files / 1584 passed**, 8.29 s (`raw-npm-test.txt`) | 15.10 |
| skip count | `0` (`jq '.numPendingTests + .numTodoTests'`) | 18.69 |
| `test-skip-integrity.js … --skip-count 0` | `No findings.`, exit 0 | 19.72 |
| `lane-inventory.js` | exit 0. "The lane collects 51 test files; git tracks 51. No findings." | 19.72 |

## Mutants: `AGENTS.md` in out-of-tree `git archive` copies, `npx vitest run src/cli.test.ts`

The harness is `probe/mutants.sh` + `probe/mutate.mjs`. Each mutant runs in a fresh tree, and each
anchor must be unique.

| mutant | before `0b6e1c25` | after `14c940ff` |
|---|---|---|
| control | 66/66 green (load1 2.48) | 67/67 green (2.19) |
| `q13-head`: the `Q13` sentence, with its line break, before line 1 | **GREEN 66/66** (2.44) | **RED 1/67**, the `ABC-059` row (2.34) |
| `q13-tail`: the same, appended | **GREEN 66/66** (2.40) | **RED 1/67** (6.27) |
| `q13-posture`: the same, first in § Deployment posture | **GREEN 66/66** (2.45) | **RED 1/67** (5.85) |
| `q13-oneline`: the same, on one line, appended | **GREEN 66/66** (2.50) | **RED 1/67** (10.34) |
| `prose-wrong-cmd`: § Deployment posture's `npm run chess` → `npm run perft` | **GREEN 66/66** (2.38) | **RED 1/67** (10.64) |

- Both `q13-posture` and `prose-wrong-cmd` red on the verdict assertion, "AGENTS.md spans that
  disagree with package.json" (`:2196`; `probe/mutants-after-reasons.out.txt`).
- `q13-posture` is 24,545 B, which is under `ABC-109`'s 24,576 B budget. The red is this row's
  alone.

## Criteria

- **`A1` MET.** Under the block's rule at the base: **3** occurrences; (i) **0/3** spans contain
  `UNKNOWN - verify`; (ii) **2/2** command spans name `npm run chess`, and the third is the
  receipts pointer `Dev / run".`. The `UNKNOWN - verify` count is 8 (`probe/spans.out.txt`).
- **`A2` MET.** The `Q13` sentence with its original line break goes GREEN → RED at three on-disk
  positions. It also goes RED at three in-memory offsets inside the test.
- **`A3` MET.** The unmutated file is green with all 8 legitimate `UNKNOWN - verify` occurrences
  present.
- **`A4` MET.** The script is selected at run time as the one `package.json` key whose value runs
  `ENTRY_POINT`'s repo-relative path. No added line spells `chess` or `src/cli.ts`.
- **`A5` MET.**
  - The diff is one hunk, `@@ -2137,0 +2138,76 @@`: a pure insertion after `ABC-065`'s closing
    `});`.
  - `ABC-042`'s `A1` row (12 lines) and `ABC-065`'s `describe` (184 lines) hash identically before
    and after.
  - The new block is `describe("ABC-059 — …")`.
- **`A6` MET.**
  - `git diff --name-only 14c940ff~1 14c940ff` = `src/cli.test.ts`, one path.
  - The zero-production-lines grep is empty.
  - The production blob listing hashes identically.
  - The added lines contain 0 `child_process` / `spawn` / `exec` mentions.
  - 1 `it(` was added and 0 removed. The `N8_SPAWN` pin row is green.
  - The suite is green, skip 0.

## `ABC-087`'s `AGENTS.md` (branch `grugops/ABC-087-difficulty-levels`, `8330651d`, 24,162 B)

- Under the same rule it reads identically: 3 / 0-of-3 / 2-of-2 / 8.
- Head `14c940ff` with that file swapped in: `src/cli.test.ts` **67/67 green**, exit 0, load1
  10.10.
- `ABC-087` does not touch `src/cli.test.ts` (three-dot diff empty).
- `git merge-tree 14c940ff grugops/ABC-087-difficulty-levels` exits 1, on
  **`plans/traceability.md` only**. The wave tip `0b6e1c25` alone conflicts with that branch on the
  same file (exit 1). So the conflict is pre-existing and not this ticket's. This ticket's docs
  commit appends to the same file, so expect it at merge.

## Cost reading (`ADR-0035`, `proposed`): narrow set `src/cli.test.ts` alone

Harness `probe/timing.sh` is `ABC-058`'s, with the count assert changed to base 66 / head 67 / twin
66.
- Three `git archive` trees: base `0b6e1c25`, head `14c940ff`, and a twin of base.
- The twin is `diff -r -x node_modules` identical to base. Head differs in `src/cli.test.ts` only.
- 9 rounds with round 0 discarded (n = 8, k = 2), and arm order rotated.
- The score is `probe/score.mjs`, unchanged.

| set | load1 median (range) | base CPU | twin − base (admissibility) | twin R | head − base, interval | state |
|---|---|---|---|---|---|---|
| 1 | 19.71 (14.24–23.94) | 7.502 s | −0.440 s (**−5.87 %**), sign 2/8 | 1.126 s | −0.251 s, −0.777..+0.103 | **INADMISSIBLE** |
| 2 | 34.43 (22.78–50.91) | 8.120 s | +0.281 s (**+3.47 %**), sign 5/8 | 0.662 s | −0.172 s, −0.867..+0.734 | **INADMISSIBLE** |

- Neither set meets the 1.5 % twin rule, so no state (MET / NOT MET / UNRESOLVED) is written.
  They are reported unpooled, and **no `N8-LANE` line is claimed.**
- Load was 3–7x `ABC-058`'s sets (6.5 / 6.2). The parallel QE and Security/NFR hops were running,
  and load is logged, never gated.
- **Not `ADR-0035`'s instrument, reported beside it only:** the new `it`'s own vitest duration was
  2.04 / 3.38 / 2.16 ms in three JSON-reporter runs of the head file, at load1 18.45 / 17.54 / 16.45
  (`probe/block-duration.out.txt`).
- The count side of the account: 0 new files, 0 new children, `N8_SPAWN` unchanged at 27.

## Side observations (not this ticket's to fix)

- `<repo>/node_modules/node_modules` is a symlink to `<repo>/node_modules`, dated 2026-09-19. It
  predates this hop. A harness that links `node_modules` into a tree and runs plain `diff -r` prints
  "Directory loop detected" (still exit 0). `ABC-058`'s note used `-x node_modules`, and so does the
  re-check here. It was left in place.
