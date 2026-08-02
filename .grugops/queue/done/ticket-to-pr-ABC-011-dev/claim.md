---
task: ticket-to-pr-ABC-011
subtask: engineer-abc011-implement
role: software-engineer
claimed_at: 2026-08-02T22:15:00Z
claimed_by: software-engineer
method: MANUAL-BY-HAND
---

Claimed BY HAND. This install has no `scripts/claim.js`, so Workflow 17 step 2's atomic
`mkdirSync` claim primitive could not be executed and nothing here provides exclusivity.
Queue width is 1 and no contention is possible, so the claim is degenerate. Recorded rather
than glossed, exactly as the queued subtask instructed and as both prior tasks recorded.

Workflow 16's sanctioned writer (`scripts/context-io.ts` / `mcp__grugops__propose_note`) is
likewise absent, so this role's context notes are hand-written into
`.grugops/context/ticket-to-pr-ABC-011/notes/` in the schema's exact shape. **No `finding` is
written — none is admissible without a §14 gate to issue a stamp — and nothing is
self-stamped.** The kinds used are `decision`, `observation`, `claim` and `artifact-ref`.

The `ref:` context folder was read BEFORE any code was written: the Orchestrator's pull
decision and the design hop's four notes (decision / observation / claim / artifact-ref),
plus the ticket's `### ANSWERED` block, which is the ratified contract this implementation
builds.

---
completed_at: 2026-08-03T00:25:00Z
outcome: IMPLEMENTED — the design hop's `### ANSWERED` block built exactly as ratified, all six
  rules held and neither trap walked into. `hasLegalEnPassant` is a new export in src/legal.ts;
  src/zobrist.ts changes ONE condition with the `epSquare !== NO_SQUARE` guard FIRST and gains ONE
  import. src/gameend.ts / src/apply.ts / src/moves.ts / src/position.ts / src/fen.ts byte-untouched;
  zobristKey's signature unchanged; no state added to Position. All seven acceptance criteria green,
  including "no existing test modified" — three widened import lines and nothing else, verified by
  line-level diff. Suite 184 passed / 0 skipped (was 174); lint, typecheck and build exit 0.
  NFR-005 MET and measured on Apple M3 / Node v24.12.0 / darwin-arm64 (`UNKNOWN - verify`
  elsewhere), merged-vs-ABC-011 in the same process: startpos 302.9-306.5 ns against a ~450 ns bar,
  kiwipete 309.1-315.6 ns against a 432-459 ns bar, worst case 1.357-1.383x, amortized
  0.9948-1.0218x. The no-ep sub-bar SPIED: zero predicate calls on 260,292 no-ep nodes. The design
  hop's divergence figures re-derived independently and reproduced to the number (518,474 / 81,397 /
  862 / 0). Board: In Development 1/3 -> 0/3, In Review 0/3 -> 1/3; no limit approached, no override
  taken. NO PR — this repo has no git remote; nothing merged, nothing deployed. ABC-009 and ABC-010
  carried, and the shipped predicate does NOT inherit ABC-009 (proved on its own trigger FEN).
  ADR-0005 still `proposed`; no agent marked it accepted. One gap FLAGGED not absorbed: rule 1's
  short-circuit is pinned by no test in the repo — left to the Security/NFR gate on the ABC-020
  precedent.
moved: pending/ -> claimed/ticket-to-pr-ABC-011-dev/ -> done/ticket-to-pr-ABC-011-dev/ — ALL BY HAND
  (no scripts/claim.js in this install).
