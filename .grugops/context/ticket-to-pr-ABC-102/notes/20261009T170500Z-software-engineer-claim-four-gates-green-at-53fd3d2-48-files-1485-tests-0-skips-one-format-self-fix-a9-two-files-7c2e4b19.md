---
id: 20261009T170500Z-software-engineer-claim-four-gates-green-at-53fd3d2-48-files-1485-tests-0-skips-one-format-self-fix-a9-two-files-7c2e4b19
kind: claim
by: software-engineer
at: 2026-10-09T17:05:00Z
verified_by:
confidence: high
refs:
  - ABC-102
  - src/command-input.ts
  - src/command-input.test.ts
  - .grugops/test-skips.md
supersedes:
---

# `ABC-102`: four gates green on the committed tree `53fd3d2` — 48 files / 1485 tests / 0 skips; `A9` is exactly two files

**NOT A STAMP — a `claim`.** No `finding` is admissible on this install. Run by the Software
Engineer in `.claude/worktrees/ABC-102-undo` (main checkout's `node_modules` symlinked). Load
2.75–2.85 (1-min) at the gate run.

| gate | command | result |
| --- | --- | --- |
| lint | `npm run lint` | first run exit 1 — ONE format diagnostic (a cast wrapped over 100 cols in the new `A2` row). Safe autofix `npx biome check --write` on the two files (self-fix **1 of 2**), rerun: exit 0, `Checked 92 files … No fixes applied.` |
| typecheck | `npm run typecheck` | exit 0 |
| build | `npm run build` | exit 0 (`tsc --noEmit`, the build slot's command) |
| unit | `npm test` | exit 0, **48 files passed (48), 1485 tests passed (1485)**, 5.82 s |
| skip count | `npx vitest run --reporter=json \| jq '.numPendingTests + .numTodoTests'` | **0** |
| test integrity | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | exit 0, `No findings.` |

- Base `4c5eddc` reads 48 / 1467 (measured, `raw-n8-lane-interleaved.txt`): **+0 files, +18 tests**,
  all in `src/command-input.test.ts` (133 → 151).
- **Red first (Workflow 04):** with only the test edits applied, the file read 15 failed / 135 passed
  (150) — every new `ABC-102` row but the `A6` no-derive guard (which holds trivially when `undo`
  falls through to a resolver), plus both superseded `+1` rows.
- **`A9`:** `git diff --name-only 4c5eddc -- src/` → `src/command-input.test.ts`, `src/command-input.ts`
  only. numstat: `src/command-input.ts` +40 / −19, `src/command-input.test.ts` +242 / −9.
- **Mutants (test note 6), each applied then reverted, file restored to 151/151:**

| mutant | result |
| --- | --- |
| M1 guard `>= 1` (unguarded two-ply take-back at ply 1) | **2 red** — both `A2` 1-ply rows (pure + loop) |
| M2 no guard (`true`) | **6 red** |
| M3 heading kept (`["commands:", …tokens]`) | **4 red** — incl. **`ABC-035` `A7` "hides nothing at the start position"**, `A8`, and both superseded rows |
| M4 `plies: 1` | **7 red** |

- `ABC-035` `A7` / `A8` at hidden count 0 holds on the real frame at both positions (green rows,
  and M3 proves the start-position row can see the defect).
