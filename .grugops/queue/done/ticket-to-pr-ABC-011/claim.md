---
task: ticket-to-pr-ABC-011
subtask: architect-abc011-ep-availability
role: architect-design
claimed_at: 2026-08-02T21:42:00Z
claimed_by: architect-design
method: MANUAL-BY-HAND
---

Claimed BY HAND. This install has no `scripts/claim.js`, so Workflow 17 step 2's atomic
`mkdirSync` claim primitive could not be executed. Queue width is 1 and no contention is
possible, so the claim is degenerate: nothing is being relied on for exclusivity. Recorded
rather than glossed, as the queued subtask instructed and as the prior task recorded.

Workflow 16's sanctioned writer (`scripts/context-io.ts` / `mcp__grugops__propose_note`) is
likewise absent, so the four context notes were hand-written into
`.grugops/context/ticket-to-pr-ABC-011/notes/` in the schema's exact shape. **No `finding` was
written — none is admissible without a §14 gate — and nothing was self-stamped.** The kinds used
are `decision`, `observation`, `claim` and `artifact-ref`.

---
completed_at: 2026-08-02T21:50:00Z
outcome: RULED — "an en-passant capture is available to the side to move" means a LEGAL one exists
  (strict FIDE 9.2.3), and the predicate is homed in `src/legal.ts` with `src/zobrist.ts` importing
  it. NOT `legalMoves(...).some(...)` (1.979x per node AND it inherits ABC-009, corrupting the
  position it hashes), NOT inline in zobrist.ts, NOT in moves.ts (would create this project's first
  dependency cycle). The graph stays acyclic and exactly as deep; zobrist moves level 2 -> 5.
  ADR-0002 EXTENDED AROUND, not amended — no human ruling owed, none taken. ADR-0005 written and
  left `proposed`; no agent marked it accepted and ABC-011 is not blocked on it. Ticket re-sized
  S -> M and not split, on its own named condition. Board: Ready 5/8 -> 4/8, In Design 0/2 -> 1/2 ->
  0/2, Ready for Dev 0/6 -> 1/6; no limit approached, no override taken. NO PRODUCTION CODE CHANGED.
  Ready for Dev -> In Development is the Orchestrator's pull and was deliberately NOT taken.
moved: pending/ -> claimed/ticket-to-pr-ABC-011/ -> done/ticket-to-pr-ABC-011/ — ALL BY HAND
  (no scripts/claim.js in this install).
