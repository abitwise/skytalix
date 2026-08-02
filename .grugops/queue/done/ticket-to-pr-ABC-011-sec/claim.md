---
task: ticket-to-pr-ABC-011
subtask: security-nfr-abc011-gate
role: security-nfr
claimed_at: 2026-08-03T11:00:00Z
claimed_by: security-nfr
method: MANUAL-BY-HAND
---

Claimed BY HAND. This install has no `scripts/` directory at all — no `scripts/claim.js`, so
Workflow 17 step 2's atomic `mkdirSync` claim primitive could not be executed and nothing here
provides exclusivity. Queue width is 1 and no contention is possible, so the claim is degenerate.
Recorded rather than glossed, exactly as the queued subtask instructed and as all three prior
subtasks recorded.

Workflow 16's sanctioned writer (`scripts/context-io.ts` / `mcp__grugops__propose_note`) is
likewise absent, so this role's context notes are hand-written into
`.grugops/context/ticket-to-pr-ABC-011/notes/` in the schema's exact shape. **No `finding` is
written — none is admissible without a §14 gate to issue a `§14-gate#<id>` stamp, and
`context.human_admission` is `off` so no `human:<name>` stamp is available either. Nothing is
self-stamped.** The kinds used are `decision`, `observation`, `claim` and `artifact-ref`.

Consequence recorded honestly and not hidden: this role's `Output (file + format)` in
`agent-factory/roles/security-nfr.md` says required fixes and accepted risks publish as
`finding`/`observation`. Half of that is unavailable on this substrate. Every security/NFR result
below that would have carried a `finding` kind is published as an `observation` (an as-observed
record) or a `claim` (carrying `confidence: UNKNOWN - verify`) instead. The severities and the
verdict are stated in full in the note bodies — the degraded kind changes the note's admission
class, NOT the severity, the ownership, or the blocking decision.

The `ref:` context folder was read BEFORE any gating was done: the Orchestrator's pull decision,
the design hop's four notes, the Engineer's four notes and QE's four notes — thirteen notes — plus
the ticket's `### ANSWERED` block and `## Out of scope`. Two items were handed forward to this
column in writing by both prior roles and both are adjudicated here.

---
completed_at: 2026-08-03T12:55:00Z
outcome: PASS (`PASS_WITH_RISKS` in the role's own vocabulary — result PASS, with three accepted
  risks each carrying a named owner, and NO required fixes). Gate run against `security.asvs_level:
  L1` and `security.block_on: high`; **no security finding at any severity and nothing at or near
  `high`, so nothing blocks.** NFR-005 — acceptance criterion 7 — re-measured INDEPENDENTLY with own
  scripts and an own `git archive` baseline of 4c6ed7d, nothing accepted from the Engineer's or QE's
  figures: startpos 297.2-306.5 -> **297.2-298.4 ns against a ~450 ns bar** and kiwipete
  **323.5-330.9 ns against a 432-459 ns bar**, BOTH MET with room; worst-case per-call shape
  **1.385-1.400x**, which lands BETWEEN the dev hop's 1.357-1.383x and the design hop's 1.45-1.48x
  and so resolves the spread this column was asked to adjudicate. Apple M3 (Mac15,13) / Node
  v24.12.0 / darwin-arm64, `UNKNOWN - verify` elsewhere. The no-ep sub-bar HOLDS structurally and
  wall clock is the wrong instrument for it (own timings 1.003-1.007x, inside noise both ways);
  re-spied at **ZERO predicate calls over 260,292 no-ep nodes**, identical to the Engineer's counts
  to the node. **The gap both prior roles handed forward is PINNED, not waived** —
  `src/zobrist.nfr.test.ts`, own file on the ABC-020 precedent, four assertions, EACH PROVEN TO FAIL
  by applying the mutant: kills Z1, Z4 and L11, the three that survived a 189-test suite. A second
  L11 probe FEN was built by this gate (`4K3/8/8/8/8/k7/p7/R7 b - - 0 1`) where the predicate still
  returns the CORRECT false and still dirties the board, so the byte-identity assertion is
  load-bearing rather than redundant. **The off-board write is ruled a CORRECTNESS defect, NOT a
  memory-safety one, measured rather than asserted**: index 15 is INSIDE the Uint8Array(128), and
  this runtime discards out-of-allocation typed-array writes outright (probed). It still earned a
  guard because it breaks the invariant `kingSquareOf`'s whole-array `indexOf` scan leans on.
  **QE's new defect ruled MEDIUM, does NOT block** — reproduced on all three FENs, clean on the
  baseline, reachability traced to every `epSquare` write site; owners BA/PM and Architect/Design.
  ASVS L1 is 70 requirements, most not-applicable by absence of the surface they name; four named
  rather than dismissed, with V15.1.1/V15.2.1's severity OVERRIDDEN from the L1 default `high` to
  `low` with the reason stated. Suite **189 -> 193 passed / 0 skipped**; lint, typecheck, build all
  exit 0. Board: In Security/NFR 1/2 -> 0/2, Ready for UAT 0/4 -> 1/4; UAT recorded as DEFERRED to
  EPIC-006, not passed. `plans/nfr-catalog.md` corrected: the sub-bar is a CALL-COUNT bar, not a
  timing bar, and NO target moved. `ADR-0005` still `proposed`; no agent may mark it `accepted` and
  this gate did not. **NO PR — this repo has no git remote. NOTHING MERGED, NOTHING DEPLOYED — a
  human holds both.**
moved: pending/ -> claimed/ticket-to-pr-ABC-011-sec/ -> done/ticket-to-pr-ABC-011-sec/ — ALL BY HAND
  (no scripts/claim.js in this install).
