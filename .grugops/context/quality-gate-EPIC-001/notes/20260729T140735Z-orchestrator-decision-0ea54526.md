---
id: 20260729T140735Z-orchestrator-decision-0ea54526
kind: decision
by: orchestrator
at: 2026-07-29T14:07:35Z
verified_by: 
confidence: high
refs:
  - EPIC-001
  - ABC-004
  - ABC-005
  - ABC-006
  - ABC-007
  - NFR-001
  - plans/board.md
  - plans/traceability.md
  - plans/nfr-catalog.md
supersedes: 
---

EPIC-001 close-out. The ABC-004..007 stack was merged to `main` and all four tickets moved
Ready for UAT → Done. EPIC-001 (Chess rules core) is COMPLETE: 7 tickets + the ABC-008 spike,
all merged.

**The merge, recorded precisely.** Fast-forward `f80a15a → cd9caae`, no conflicts, performed
by an agent on EXPLICIT human instruction ("merge for me and continue"). This is the one path
that crosses the "humans hold merge" line without breaking it: **the human holds the decision,
the agent supplies the keystroke.** It is NOT standing authorization — the standing rule is
unchanged and no future merge happens without the same explicit instruction. Identical to the
rule already recorded for ABC-001/002/003/008. A prior one-word "proceed" was deliberately
REFUSED as too ambiguous to authorize a protected-branch merge; the explicit restatement is
what authorized it.

**Post-merge verification, not assumption.** The suite was re-run ON `main` after the merge:
143/143 pass across 7 files. The close-out was not recorded until that was green.

**Board.** ABC-004..007 → Done. EPIC-001 itself left Backlog → Done (all its tickets closed).
In Review 0/3, Ready for UAT 0/4 — every WIP override from the batch is now resolved; no
column is over its limit. Ticket front matter and traceability rows synced to `done` / `Done`.

**The one accepted risk from the review gate is CLOSED.** Architect/Design seeded all seven
rows of `plans/nfr-catalog.md` (see the architect `decision` note in this task). Five read
`UNKNOWN - verify` honestly — their epics are not built. EPIC-004 inherits a real design
constraint: time-based (not depth-based) per-move search budget.

**UAT remains genuinely deferred, not passed.** The traceability UAT cells read
"UAT deferred — EPIC-006" rather than a tick. EPIC-001 is a pure rules library with no surface
a human can exercise until EPIC-006 ships a runnable game. Marking it passed would be a lie
the next gate inherits; leaving it visible is the honest state.

**Board is now empty of pullable work.** EPIC-002..006 sit in Backlog as epics only — none is
decomposed. Nothing is in Ready, so no ticket can be pulled: the next step is `epic-to-tickets`
(Workflow 03) on the next epic, which is a planning decision (which epic, in what order) that
belongs to a human, not an autonomous pull. EPIC-002 (Terminal board and game loop, P0) is the
dependency-ordered candidate — it makes the rules core visible.
