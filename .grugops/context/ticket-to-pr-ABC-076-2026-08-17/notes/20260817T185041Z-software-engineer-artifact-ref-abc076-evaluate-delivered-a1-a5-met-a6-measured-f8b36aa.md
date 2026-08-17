---
id: 20260817T185041Z-software-engineer-artifact-ref-abc076-evaluate-delivered-a1-a5-met-a6-measured-f8b36aa
kind: artifact-ref
by: software-engineer
at: 2026-08-17T18:50:41Z
verified_by:
confidence: high
refs:
  - src/evaluate.ts
  - src/evaluate.test.ts
  - plans/tickets/ABC-076-evaluation-material-and-piece-square-tables.md
  - memory-bank/50-decisions/ADR-0003-legality-strategy.md
  - .grugops/context/refinement-abc076-a1-corpus-2026-08-17/notes/20260817T184032Z-ba-pm-decision-abc076-a1-corpus-widened-to-the-six-perft-positions-plus-their-one-ply-children-757221a2.md
supersedes:
---

# `ABC-076` delivered on `grugops/ticket-to-pr-ABC-076-2026-08-17` at `f8b36aa`. `A1`-`A5` MET, `A6` measured at 128.8 ns.

## What was built

`src/evaluate.ts` (164 lines) — one exported pure function, `evaluate(position): number`, centipawns,
negamax convention. Material constants in one place (`PIECE_VALUE`, king 0), one hand-written
piece-square table per piece type written from white's point of view and read rank-8-first; black
reads the same table with the rank flipped, which is what makes the mirror exact. No search, no
state, no cache, no terminal scoring, no tapering. `src/evaluate.test.ts` (256 lines) — the six
criteria. **Two files, nothing else: `git diff --numstat main HEAD` is `256/0 src/evaluate.test.ts`
and `164/0 src/evaluate.ts`.** No dependency added; `package.json` still has no `dependencies` key
and was not opened.

## The corpus expanded to exactly 178 children

The one-ply expansion (merged `legalMoves` + `makeMove`/`unmakeMove`) produced **20, 48, 14, 6, 44,
46 = 178**, per position, asserted per position rather than only in total — so a wrong expansion that
happened to sum right does not pass. `6 + 178 = 184` is asserted as the corpus length before the
symmetry property runs. The free correctness check BA/PM's decision note described held first time.

## `A1` earned its keep before it was finished: the `-0` defect

The property failed on its first run, at `startpos` with black to move: `evaluate` returned `-0`,
which `Object.is` — and therefore vitest's `toBe` — separates from `0`, so a mirrored pair was not
"**exactly** equal". Cause: `-score` on a balanced position. **Fixed in the evaluator (`0 - score`,
which is `+0`), never in the assertion.** This is the criterion doing exactly what its parenthetical
says, on the first position of a 184-position corpus.

## `A6` — measured, not asserted

Best-of-5 × 2,000,000 calls per position, after warm-up, on **Apple M3, macOS 26.5.2, Node
v24.12.0**, with the harness in the scratchpad (never in the diff — the security threshold forbids a
third file):

| position | ns/call |
|---|---:|
| startpos | 139.8 |
| **kiwipete** | **135.7** |
| position-3 | 92.9 |
| position-4 | 136.6 |
| position-5 | 129.6 |
| **position-6** | **138.5** |
| **mean of six** | **128.8** |

**Bar is ≤ 1,100 ns. MET with 8.5x headroom.** Kiwipete and position-6 are reported individually on
the Orchestrator's instruction, because `ADR-0003` clause (2a) names that pair as the standing
benchmark set — so this feeds the ADR's depth table without a re-run. Both land near the table's
`134 ns` "material" row, not its `1,097 ns` row: the depth arithmetic this epic rests on holds with
room, and the row that models depth 7 at 677 ms is pessimistic against this evaluator.

No wall-clock assertion was added to the suite. That follows this repo's standing rule, stated in
`src/zobrist.nfr.test.ts`: a timing assertion passes or fails on the machine that runs it, so
figures are reported with their machine.

## Gates, real numbers, run at `f8b36aa`

- `npm run lint` — **GREEN**, 56 files, no fixes applied.
- `npm run typecheck` — **GREEN**, exit 0.
- `npm run build` — **GREEN**, exit 0.
- `npm test` — **RED: 1 failed | 888 passed (889)**, 30 of 31 files green. The single failure is
  `src/cli.test.ts` `A3` and is NOT this evaluator's — see the companion `observation` note.
- Skip count — **0**. `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md
  --skip-count 0` → `No findings.`, exit 0.

`src/evaluate.test.ts` alone: **20 passed (20)**.

## Not done, deliberately

**Not merged, no board column moved, no QE self-certification.** The mandatory `qe-e2e` hop has not
happened and this note is not it.
