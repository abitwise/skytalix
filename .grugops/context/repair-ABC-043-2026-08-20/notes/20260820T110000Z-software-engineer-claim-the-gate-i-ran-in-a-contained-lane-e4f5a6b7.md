---
id: 20260820T110000Z-software-engineer-claim-the-gate-i-ran-in-a-contained-lane-e4f5a6b7
kind: claim
by: software-engineer
at: 2026-08-20T11:00:00Z
verified_by:
confidence: high
refs:
  - ABC-043
  - NFR-008
  - ADR-0014
supersedes:
---

# The gate, run in a CONTAINED LANE, at `grugops/abc043-repair`

The lane is a git worktree with its own `node_modules`, not the repo root — the root is contaminated
(`ABC-050`) and has cost the Orchestrator three bad measurements. Nothing below was run at the root.

## The numbers

| step | command | result |
|---|---|---|
| baseline, before any edit | `npm test` | **1189 passed / 39 files**, skip **0** — matches the brief exactly |
| unit | `npm test` | **1190 passed / 39 files**, 0 failed |
| skip count | `npx vitest run --reporter=json … jq` | **0** |
| test integrity | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | `No findings.`, exit **0** |
| lint | `npm run lint` | exit **0**, **0 warnings** |
| typecheck | `npm run typecheck` | exit **0** |
| build | `npm run build` | exit **0** |
| perft deep | `PERFT_DEEP=1 npx vitest run src/perft.test.ts` | **32 passed / 32**, 36.4 s |
| `src/cli.test.ts` alone | `npx vitest run src/cli.test.ts` | **51 passed** (was 50) |

**+1 test, +0 files.** The row added is `the instruments themselves are not blind`; `A3`'s row was
rebuilt in place, not duplicated.

## `NFR-008` — my cost, reported and NOT graded

`ADR-0014` rules the clause breached. I am reporting what this change costs and taking no view on
the verdict.

Three paired full-lane runs each, same lane, same machine:

| tree | wall (real) | CPU (user+sys) |
|---|---|---|
| `main` @ `586f3bd` (baseline) | 3.44 s | 15.88 s |
| this branch | 3.36 / 3.40 / 3.22 s | 15.26 / 15.57 / 15.42 s |

**This change costs nothing measurable on either clause.** It is within run-to-run noise in both
directions, and the mechanism agrees: the child count is unchanged (one child deleted, one added —
`N8-SPAWN`'s pin of **17** does not move, and the new `A3` child carries no stdin script), and the
one new row is in-process string work with no spawn.

## What is NOT claimed here

- **No UAT.** The delivered diff of this hop is **zero production lines** — `git diff --name-only`
  against `main` returns `src/cli.test.ts` and nothing else — so the 2026-08-17 waiver's criterion is
  met on the measurement. **Applying that waiver is not mine**; I record the measurement.
- **No QE verdict.** `ABC-043` still needs its `qe-e2e` hop; this is repair round 1 of 2.
- **No `finding`.** None is admissible on this install (`context.human_admission` is `off`); these
  are hand-authored `claim` / `decision` / `observation` / `artifact-ref` notes.
- **Nothing merged, nothing deployed, no board column moved, no DoR table edited.**
