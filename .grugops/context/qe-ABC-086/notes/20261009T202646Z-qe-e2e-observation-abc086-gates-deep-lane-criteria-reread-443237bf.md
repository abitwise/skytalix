---
id: 20261009T202646Z-qe-e2e-observation-abc086-gates-deep-lane-criteria-reread-443237bf
kind: observation
by: qe-e2e
at: 2026-10-09T20:26:46Z
verified_by:
confidence: high
refs:
  - ABC-086
  - ADR-0027
  - NFR-004
  - src/virtual-clock.ts
  - src/engine.ts
  - src/engine.test.ts
  - src/cli.ts
  - .grugops/context/ticket-to-pr-ABC-086/notes/20261009T200941Z-software-engineer-observation-abc086-rehop-merged-tree-gates-deep-lane-n8lane-under-457ba6b8.md
supersedes:
---

# `ABC-086` at `82cccba`: the gate, `ENGINE_DEEP`, and each criterion re-read by QE

Hand-authored, no seal (degraded posture, `AGENTS.md`). Subtask `qe-ABC-086`, worktree
`.claude/worktrees/qe-ABC-086` on `grugops/qe-ABC-086` off `82cccba`. Diff under review
`1eae90c...82cccba`. Apple M3, Node v26.11.0. The host carried another project's vitest throughout
(load1 3.6–11.9). Raw files: `raw-out-engine-deep.txt`, `raw-out-a5-tsc-graph.txt` beside this note,
and `../probe/`.

## Gate (Workflow 05 order), 20:14Z

| step | result |
|---|---|
| host protection | exit 2, `UNKNOWN - verify` (no remote; `gh` gave no readable status). Never a pass |
| `npm run lint` | exit 0, 95 files, no fixes |
| `npm run typecheck` / `npm run build` | exit 0 / exit 0 |
| `npm test` | exit 0, **49 files, 1530 passed**, 6.4 s |
| skip count | `0`; `test-skip-integrity.js` `No findings.`, exit 0 |
| e2e / UAT spec integrity | not applicable (no UI, no `*.uat.spec.ts`) |

## `ENGINE_DEEP=1 npx vitest run src/engine.test.ts`, 20:14:51–20:19:43Z

**Exit 0, 45 passed, 291.9 s wall** (user 284.3 s), load1 6.8 → 8.1. `ABC-086` rows: depth-4 floor
11.0 s, `A1` 300/300 128.5 s, `A6` interleaved 0.5 s, `A2` 30.2 s. `ABC-078` `A1` worst case
`position-5/b1d2` 3 024 ms at d7.

## Criteria, re-read independently

| | QE's reading | result |
|---|---|---|
| `A1` | Deep 300/300 green. The depth-4 floor was re-measured by QE's own probe (`probe/xproc-out/b24-s1-*`): **24/30** at depth ≥ 4 (floor 15), same as the build. Default slice 30/30, 15/15 at depth 2. Every row imports `./virtual-clock.ts`; no `tickingClock` in an `ABC-086` row | **MET** |
| `A2` | kiwipete ×10 at `DEFAULT_BUDGET_MS` on the wall clock: `e2a6@d5` ×10, 3 002–3 028 ms, all legal. The row asserts legality, never identity; the reason is in the file | **MET** |
| `A4` | Ticket grep over the added lines of the delivered `src/` diff: **0 hits**. Whole-tree hits (non-test): `src/engine.ts:457` (the one `Date.now`, the ticket's `:452` + 5 comment lines), `src/cli-options.ts:103` (`--colour random`), and comment mentions only. The module row is green. Aliasing robustness is a separate observation (`…82f4e3ed`) | **MET as written** |
| `A5` | (i) `src/cli.ts:175` `createEngine({ budgetMs: DEFAULT_BUDGET_MS })`, `cli.ts` and `search.ts` untouched by the diff. (ii) Independent of the row's regex walk: `tsc --listFilesOnly` rooted at `src/cli.ts` resolves 29 `src/` modules (`cli.ts` included), **no `virtual-clock.ts`**; the row's walk reaches the same 29. Only importer in the tree: `src/engine.test.ts` (`src/engine.ts` names it in a comment). (iii) The `engine.ts` diff: 0 changed lines that are not comment lines; the `ABC-078` `A4` pin is green, unamended | **MET** |
| `A6` | Deep 10/10 per engine green; the default state row green. **But see the mutant observation (`…0df7078c`):** the interleaved row cannot see shared clock state, and a module-level step survives every row | **MET as written; G-QE-1** |
| `A7` | Re-run outside the suite (`probe/guard.out.txt`): `0`, `-0`, `-1`, `NaN`, `±Infinity` all throw `RangeError`; readings at 0.5 and 1 are exact. Beyond the five: `observation …82f4e3ed` | **MET; G-QE-2** |

`A3` lives in `ABC-087` as its `A9`; nothing to read here.

## Numstat (`1eae90c...82cccba`, `src/`)

`src/engine.test.ts` +227/−7, `src/engine.ts` +8/−3 (comment only), `src/virtual-clock.ts` +37/−0.
