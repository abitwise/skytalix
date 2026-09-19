---
task: wave-2026-09-19
subtask: ticket-to-pr-ABC-075
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-075-incremental-zobrist-key-seam.md
ref: .grugops/context/ticket-to-pr-ABC-075/
enqueued_by: orchestrator
enqueued_at: 2026-09-19T23:00:00Z
branch: grugops/ABC-075-incremental-zobrist
base: grugops/wave-2026-09-19
---

# Subtask: implement `ABC-075` — the incremental Zobrist key seam (EPIC-004, M, P0, DoR 10/10)

Pulled `Ready` → `In Development` by the Orchestrator 2026-09-19. Read the ticket page in full —
its § "Ruling applied — 2026-09-19" section supersedes five earlier sentences (Out-of-scope 1,
`A3`, `A6` among them; read that section BEFORE the criteria). Then `ADR-0020` in full (the
seam signature, the per-ply-array threading, the six falsifiers), Architect/Design's two notes at
`.grugops/context/ruling-abc075-ep-square/notes/` (which assertions go RED on purpose and why),
`ADR-0005`, `AGENTS.md`'s 12 rules and lanes, `src/zobrist.ts`, `src/zobrist.test.ts`,
`src/zobrist.nfr.test.ts`, `src/apply.ts` (`UndoRecord`, ep-square rule), `src/position.ts`.

## Shape (from ADR-0020 — not yours to re-decide)
- `zobristKey`'s ep clause becomes the bare `epSquare !== NO_SQUARE` test; the `hasLegalEnPassant`
  import LEAVES `src/zobrist.ts` (the hash is a pure read of the board again).
- New export beside it:
  `zobristKeyAfterMove(keyBefore: bigint, position: Position /* after makeMove */, move: Move,
  undo: UndoRecord): bigint` — invariant
  `zobristKeyAfterMove(zobristKey(before), after, move, undo) === zobristKey(after)`.
  Type-only imports of `Move`/`UndoRecord`; graph stays acyclic (verify).
- `Position` gains NO field; `makeMove`/`unmakeMove`/`src/search.ts` UNTOUCHED — the per-ply
  array, its seeding and consumers are `ABC-081`'s.
- Oracle equivalence: depth-4 walk over `src/perft.test.ts`'s positions asserting
  `k === zobristKey(position)` after every make (0 mismatches) and no drift after every unmake,
  against the POST-ruling oracle. Put the walk behind the lane the ticket names if it is heavy;
  the default-lane row is the criteria's.
- The assertions Architect/Design named as legitimately going RED (`zobrist.test.ts:49`, `:73`,
  `:158`'s oracle; `zobrist.nfr.test.ts:54`/`:69` spies on `hasLegalEnPassant`) are UPDATED to
  the ruling, with the docblock sentence that explains each — not deleted, not skipped. Any OTHER
  red is a defect: stop and report.

## Gates and budget
- Four gates green at the tip: `npx biome check .`, `npx tsc --noEmit` (build is the same),
  `npx vitest run --dir src` — base is **42 / 1297 / 0** at the wave branch. `test-skip-integrity`
  → `No findings.`
- `N8-LANE` ≤ 650 ms measured-then-clause-state; whole-lane CPU before/after (`/usr/bin/time
  -p`, ≥ 3 runs, load noted) — a > 15 s reading under load is REPORTED non-conforming, nothing
  trimmed or moved. `NFR-005`'s per-node cost: the new function's ns/call vs `zobristKey`'s
  ~300 ns full scan — measure and report (it should be far under).
- `self_fix_attempts` = 2, then stop.

## Fences
- Do not touch `plans/board.md`, `AGENTS.md`, `plans/nfr-catalog.md`, `src/search.ts`,
  `src/engine.ts`, `src/quiescence.ts` (`ABC-079` blocked, its branch unmerged), `src/turn-loop.*`
  (`ABC-120` in review), `src/apply.ts`, `src/position.ts`.
- Do not merge, do not deploy. Own `git worktree`; commit messages via a UNIQUELY-NAMED scratchpad
  file and `git commit -F`; gates through a node script (hook refuses `$?`, `npm run`, heredocs).

## Publish
Typed notes per Workflow 16 into `ref:` (`claim` for gates with raw numbers; no `finding`), trace
row, ticket § Delivery. Claim by hand per Workflow 17:
`mkdir .grugops/queue/claimed/ticket-to-pr-ABC-075`, move this file in, then out to `done/`.
Report: branch, sha, `git diff --numstat`, gate numbers, which assertions were updated and why,
ns/call, N8-LANE ms, lane CPU before/after.
