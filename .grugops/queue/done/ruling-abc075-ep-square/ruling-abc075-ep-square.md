---
task: owner-rulings-2026-09-19
subtask: ruling-abc075-ep-square
role: architect-design
workflow: agent-factory/workflows/07-backlog-refinement.md (design ruling → superseding ADR; unblocks ABC-075)
ticket: plans/tickets/ABC-075-incremental-zobrist-key-seam.md
ref: .grugops/context/ruling-abc075-ep-square/
authority: .grugops/context/owner-rulings-2026-09-19/notes/20260919T100000Z-orchestrator-decision-six-owner-rulings-verbatim-3c9e1f42.md
enqueued_by: orchestrator
enqueued_at: 2026-09-19T10:05:00Z
branch: grugops/ruling-abc075-ep-square
base: grugops/owner-rulings-2026-09-19
adr_id: ADR-0020
---

# Subtask: rule the Zobrist en-passant component ("ep square set") and the threading decision — `ABC-075` leaves `Blocked`

Read the authority note, `ABC-075` in full, `ADR-0005` (esp. its ep clause and falsifier `F6`),
`ADR-0006` (castling rights vs availability), `ADR-0002` clause 3 (per-ply key array), the
2026-08-12 architecture audit note it cites, and `src/zobrist.ts`, `src/apply.ts`, `src/search.ts`.
The owner's word: *"relax to "ep swuare set""* (typo for *square*) — the ep component enters the key
**when `position.enPassant` is set**, not when a legal ep capture exists.

## Deliver
- `memory-bank/50-decisions/ADR-0020-<slug>.md`, `status: accepted`, superseding `ADR-0005`'s
  legal-ep clause only. Quote the owner verbatim. State the consequence honestly: two positions that
  differ only in an ep square nobody can capture on now hash differently (a TT miss, never a wrong
  answer) — say why that is the standard, safe direction and what `F6` becomes.
- **The threading decision — yours, not the owner's.** Rule per-ply key array vs. key carried on
  the mutable position (or both: incremental on `makeMove`/`unmakeMove` with the search reading it).
  Name the seam signature `ABC-075` will implement against, and how equivalence with the full-scan
  `zobristKey` oracle is asserted.
- Whether `src/apply.ts`'s ep-square setting rule (does it set `enPassant` on every double pawn
  push, or only when a capturer is adjacent?) matters to this ruling — read the code and say which
  it is, because it decides whether "ep square set" is also cheap to detect.
- Update `ABC-075`'s page: DoR items 5 and 10 re-scored against the ruling; state what is now
  pullable. Recommend to the Orchestrator: `Blocked` → `Backlog` (or `Ready`) with the DoR score.

## Fences
- Zero files under `src/`. This hop rules; `ABC-075` builds.
- `ADR-0006` (castling rights) is NOT re-opened.
- Do not touch `AGENTS.md`, `plans/board.md`. Do not merge, do not deploy. Own `git worktree`,
  commit on the branch above.

## Board / trace
Board moves are the Orchestrator's. Append your `plans/traceability.md` row.

## Publish
Typed notes per Workflow 16 into `ref:`, hand-authored per `agent-factory/contracts/context-note.md`
(no `finding` admissible; the ruling is a `decision`). Claim by hand per Workflow 17:
`mkdir .grugops/queue/claimed/ruling-abc075-ep-square`, move this file in, then out to `done/`.
