---
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-094
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-094-book-probe-lookup-weighted-choice-and-safe-failure.md
ref: .grugops/context/ticket-to-pr-ABC-094/
source_refs: memory-bank/50-decisions/ADR-0037* (D1 format, D2 injected `random`), ADR-0012*, ADR-0036* (clause (b); instrument .grugops/context/design-F-072-1/probe/clause-b.mjs), ADR-0035*; .grugops/context/bapm-rescore-abc094-2026-10-10/notes/ (…fe340299); data/opening-book/book.json
enqueued_by: orchestrator
enqueued_at: 2026-10-10T19:08:27Z
branch: grugops/ABC-094-book-probe
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: build `ABC-094` — the book probe: lookup, weighted choice, safe failure

M, P1, DoR 10/10. The ticket page is the contract (A1–A6 and test notes 6–7: no pinning literal picks from the
shipped book; stay off the `PUZZLE_DEEP` trigger list). ADR-0037 is the structure: Zobrist key as 16 hex digits,
integer weights, injected `random: () => number` (D2; `seededRandom` stays in `src/levels.ts`). Re-verify the
premise at the current tip first; if stale, STOP and report.

## Stop conditions and gates
- New production `src/` module → the owner's UAT word is needed; expected.
- ADR-0036 clause (b): say exactly which capability lines your diff adds (a `node:fs`/`node:path`/`node:url`
  import, `process.*`), run the instrument, and report the result. Injecting the reader and the warning sink
  (moving the capability to ABC-095's composition root) is your call — say which you chose and why. Either way
  this chain passes In Security/NFR once.
- ABC-083 is being built in parallel (`src/evaluate*`, search/TT tests) — no overlap expected; if you find one,
  STOP and report. Both append to `plans/traceability.md` (fine).
- Cost per ADR-0035 (accepted; NFR-008 R-1): measure each new test file by path.
- Do not touch `WEIGHT_POLICY` or the book; the owner's weights veto is open.

## Fences
Never merge; never push. No `plans/board.md`, ADRs, `AGENTS.md`. Own worktree; link `node_modules` into YOUR
worktree only (`diff -r -x node_modules`). Commit-message file in a PRIVATE scratchpad subdirectory. Real UTC
stamps. Trailer `Co-Authored-By:` naming the model you actually are. Quoted heredocs only (`<<'EOF'`). Committed
`.grugops/context/*/probe/` scripts may be run with node/bash/python3; if refused, say so and use your own
harness. On any red `npm test`, keep the JSON log and name the failing test (QE-141-a).

## Publish
Notes per Workflow 16, trace row at the END of `plans/traceability.md`, ticket § Delivery. Queue
pending → claimed → done (by hand, main checkout, uncommitted). Report: gates, per-criterion evidence, clause (b)
result, cost, `src/` numstat (production vs test), branch + sha.
