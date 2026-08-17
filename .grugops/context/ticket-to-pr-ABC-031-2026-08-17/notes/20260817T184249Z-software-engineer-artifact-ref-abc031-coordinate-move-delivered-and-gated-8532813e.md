---
id: 20260817T184249Z-software-engineer-artifact-ref-abc031-coordinate-move-delivered-and-gated-8532813e
kind: artifact-ref
by: software-engineer
at: 2026-08-17T18:42:49Z
verified_by:
confidence: high
refs:
  - src/coordinate-move.ts
  - src/coordinate-move.test.ts
  - src/cli.test.ts
  - plans/tickets/ABC-031-coordinate-move-input.md
  - memory-bank/50-decisions/ADR-0004-san-ownership.md
supersedes:
---

# `ABC-031` delivered on branch `grugops/ticket-to-pr-ABC-031-2026-08-17`, commit `c59e1e8`

**NOT merged. No board column moved. No QE hop performed** — `AGENTS.md` § "QE validation authority"
makes `qe-e2e` mandatory before this ticket may leave `In Review`, and this hop is not it and does not
self-certify in its place.

## What was built

`src/coordinate-move.ts`, one exported total function:

```ts
export function parseCoordinateMove(
  position: Position, text: string, legal?: readonly Move[],
): CoordinateParseResult;
```

`CoordinateParseResult` is declared **in the new module** — the arms are `ADR-0004`:188's exactly
(`move` / `ambiguous` N ≥ 2 / `rejected`), so `ABC-033` dispatches over one shape. `SanParseResult`
does not exist in `src/`; it lands with `ABC-032`. This is a second reading of the same ADR, not a
copy of code.

`CoordinateRejectReason` has exactly two members, `ADR-0004` (2a)'s floor and nothing beyond it
(coding rule 5): `"unreadable"` (not a coordinate this grammar can read) and `"no-such-move"`
(well-formed, names no legal move here).

Selection, never construction (`ADR-0004` (2b)): the result is `.filter`ed out of the supplied
`legal` array. With `legal` supplied the function makes **zero** `legalMoves` calls.

## Diff shape — `git diff --numstat c59e1e8~1 c59e1e8`

| added | removed | file |
|---:|---:|---|
| 103 | 0 | `src/coordinate-move.ts` |
| 193 | 0 | `src/coordinate-move.test.ts` |
| 3 | 1 | `src/cli.test.ts` |

`git diff --name-only c59e1e8~1 c59e1e8 | grep -v '\.test\.ts$' | grep '^src/'` returns
**`src/coordinate-move.ts` and nothing else** — `A7`'s production-line fence, measured from git.

**The `src/cli.test.ts` edit, named rather than buried.** `ABC-042` `A3` asserts a flat inventory of
`src/`'s production modules with a hard-coded length; a twenty-first module reds it. The count moved
`20 → 21` with a comment. It is a **test** file, so `A7` is untouched, and the row's subject
(flatness, entry point present) is unchanged — nothing was softened or skipped to reach green.

## Gate run — branch tip `c59e1e8`, real numbers

| gate | command | result |
|---|---|---|
| lint | `npm run lint` | **exit 0**, 56 files checked, no fixes applied |
| typecheck | `npm run typecheck` | **exit 0** |
| test | `npm test` | **895 passed / 895, 31 files, exit 0** (869 before this branch; +26 rows) |
| build | `npm run build` | **exit 0** (`tsc --noEmit`) |
| skip count | `AGENTS.md` § "Test integrity" | **0** |
| test integrity | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | **`No findings.`, exit 0** |
| deep perft | `PERFT_DEEP=1 npx vitest run src/perft.test.ts` | **32 passed / 32, exit 0**, 36.94 s |

No runtime dependency added: `package.json` still has **no `dependencies` key** (`grep -c
'"dependencies"' package.json` → `0`). `npm install` was not run; `node_modules` untouched.

Self-fix attempts used: **2 of 2** — one lint autofix (formatting only, `npx biome check --write` on
the two new files), one red `npm test` row repaired by the `src/cli.test.ts` inventory count above.

## Criteria

`A1`, `A3`, `A4`, `A5`, `A6`, `A7` **MET**. `A2` **MET in substance, NOT-MET as literally written** —
its printed FEN is defective and cannot carry it. That is a separate `observation` note in this same
folder and it is routed to BA/PM; it is the one thing a reviewer must read before accepting this.
