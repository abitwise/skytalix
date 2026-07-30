# Board
_Updated: 2026-07-30 by BA/PM (EPIC-002 decomposed into ABC-012..ABC-019, 23 points; ABC-012 + ABC-014 promoted to Ready, ABC-013 to Blocked on ADR-0004's ratification, the rest held in Backlog behind their predecessors; ABC-011 escalated P2→P1 and promoted to Ready, its own trigger having fired. Ready 3/8, no limit approached, no override taken. Earlier the same day: ABC-011 cut to Backlog from the architecture audit `architecture-audit-2026-07-29`, on ADR-0002's recommendation. Previously 2026-07-29: ABC-009 + ABC-010 cut to Backlog from the same audit)_

<!--
  FORMAT — read before you move a ticket. (clear voice; this is a technical file, not a role prompt.)

  plans/board.md is grugops's SINGLE SOURCE OF WIP TRUTH. Every ticket sits in exactly one
  column. Each column has a definition (ENTRY MEANS), an EXIT OWNER (the role that signs off
  to move the ticket out), and a WIP limit (max tickets allowed in that column at once). The
  Orchestrator refuses to pull new work past a WIP limit without a written reason.

  WIP NUMBERS COME FROM CONFIG. The per-column limits shown in each heading are the lean
  DEFAULTS, sourced from `agent-factory/config/factory.config.json#wip_limits`. Edit the dial,
  not this file, to change a limit — then update the heading to match. The two must agree.
  In lean mode the In Security/NFR and Ready to Release columns may be skipped unless a
  trigger fires (the columns still exist; they just stay empty).

  HEADING FORMAT (spec §6.1): each column is an H2 heading carrying its live/limit WIP count,
  e.g. `## In Development (WIP 1/3)` — the left number is how many tickets are in the column
  now, the right number is the limit from config. Unlimited columns read `(WIP unlimited)`;
  Blocked is visible and time-tracked (no WIP limit) and reads `(visible, time-tracked)`.

  TICKET ROWS: this board ships EMPTY — column structure only, ZERO live ticket rows. It is a
  clean append target. Roles append a one-line ticket row under the matching column as work
  moves, e.g. (this is a comment, NOT a live row — the generic `ABC-` prefix shows format only):

    ## In Development (WIP 1/3)
    - [ABC-014] Asset allocation chart  (owner: Software Engineer, since: 2026-06-01)

    ## In Review (WIP 1/3)
    - [ABC-012] Portfolio FX conversion  (PR: #41, QE: running)

  BOARD <-> TICKET CONTRACT: each ticket file (`plans/tickets/<prefix>-xxx.md`) carries a
  status line in its front matter so the board column and the ticket never disagree (spec §6.1).
  The shape (example only, NOT a live ticket):

    status: in-development
    column: In Development
    size: M
    priority: P2
    epic: EPIC-003
    feature: FEAT-007

  A ticket's `column:` value MUST equal the board column it sits under, and `status:` is the
  kebab-case form of that column. The validator can check the two for drift.

  CADENCE: this board ships the Kanban columns (the default cadence, `cadence=kanban`). The
  scrum overlay (sprint goal / committed backlog / burndown) lives in `plans/sprints/SPRINT-xx.md`
  and is NOT pre-rendered here. The sizing, priority, and Blocked conventions below are shared
  by BOTH cadences.
-->

## Columns (spec §6.1)

The 13 columns in flow order, each with what entry means, who owns the exit, and the WIP
limit (default from `factory.config.json#wip_limits`):

| Column | Entry means | Exit owner | WIP (default) |
|--------|-------------|-----------|---------------|
| Backlog | idea captured | BA/PM | unlimited |
| Ready | Definition of Ready met | BA/PM | 8 |
| In Analysis | behavior being mapped | System Analyst | 2 |
| In Design | structure/ADR being decided | Architect/Design | 2 |
| Ready for Dev | handoffs complete, ticket sized | Orchestrator | 6 |
| In Development | code being written | Software Engineer | 3 (== max parallel tickets) |
| In Review | PR + QE running | QE/E2E | 3 |
| In Security/NFR | risk/compliance gate | Security/NFR | 2 |
| Ready for UAT | gates passed | UAT Planner | 4 |
| In UAT | business acceptance | UAT Planner | 4 |
| Ready to Release | UAT signed off | Release Manager | 4 |
| Done | merged + released (or merged, lean) | Orchestrator | unlimited |
| Blocked | waiting on a dependency/decision | (raiser) | visible, time-tracked |

WIP limits come from config (`wip_limits`); the numbers above are the lean defaults.

## Backlog (WIP unlimited)

- [EPIC-002] Terminal board and game loop  (owner: BA/PM, size: XL, priority: P0, since: 2026-07-22, decomposed: ABC-012..ABC-019)
- [EPIC-003] Move input and controls  (owner: BA/PM, size: M, priority: P0, since: 2026-07-22)
- [EPIC-004] Engine and AI opponent  (owner: BA/PM, size: L, priority: P0, since: 2026-07-22)
- [EPIC-005] Opening book  (owner: BA/PM, size: S, priority: P1, since: 2026-07-22)
- [EPIC-006] Game session and packaging  (owner: BA/PM, size: M, priority: P2, since: 2026-07-22)
- [ABC-010] FEN semantic validation  (owner: BA/PM, size: M, priority: P1, epic: EPIC-003, since: 2026-07-29)
- [ABC-009] legalMoves mutates the position it documents as unchanged  (owner: BA/PM, size: S, priority: P2, epic: EPIC-001, since: 2026-07-29)
- [ABC-015] Glyph mode selection — precedence, signal set, --unicode override  (size: S, P1, epic: EPIC-002, blocked-until: ABC-014)
- [ABC-016] Status panel  (size: M, P1, epic: EPIC-002, blocked-until: ABC-013, ABC-014)
- [ABC-017] Bounded move-history pane — two-column SAN  (size: S, P2, epic: EPIC-002, blocked-until: ABC-013, ABC-014)
- [ABC-018] Frame output and redraw  (size: S, P0, epic: EPIC-002, blocked-until: ABC-014)
- [ABC-019] Turn loop skeleton  (size: L, P0, epic: EPIC-002, blocked-until: ABC-012, ABC-014, ABC-018)

<!--
  EPIC-002 DECOMPOSED 2026-07-30 by BA/PM (task `epic-to-tickets-EPIC-002`, Workflow 03) into
  ABC-012..ABC-019 — 8 tickets, 23 points. Epic size corrected M -> XL in-file with the reason,
  exactly as EPIC-001 recorded its own L -> XL correction; the no-XL rule binds TICKETS, and the
  largest here is L, so there is NO SPLIT_REQUIRED. The epic ROW STAYS IN BACKLOG carrying a
  `decomposed:` annotation — that is precisely what EPIC-001 did on 2026-07-22, and it left Backlog
  only on 2026-07-24 when all seven of its tickets were merged. An epic row is a container; it exits
  Backlog for Done when its tickets are Done. The Backlog exit BA/PM actually owns and has taken
  today is the TICKET-level one: Backlog -> Ready for ABC-012, ABC-014 and ABC-011.

  ABC-015..ABC-019 meet the Definition of Ready in full. They are held in Backlog because each has
  an unbuilt PREDECESSOR TICKET, not because anything about them is unresolved — they are NOT
  Blocked-column blocked, and BA/PM promotes each as its `blocked-until` list clears. Same pattern
  ABC-004..007 used.

  Two of this epic's four acceptance criteria were AMENDED before these tickets were cut, because
  wave 1 established they could not be met as written and an untestable criterion fails the
  Definition of Ready for every ticket beneath it. Both amendments are recorded in place in
  plans/epics/EPIC-002-terminal-board-and-game-loop.md with what changed and whether a promise was
  reduced (it was, twice, and both are marked REDUCED rather than softened quietly).
-->
<!--
  ABC-011 cut 2026-07-30 by BA/PM from the same architecture audit, on the recommendation in
  ADR-0002's `Out of scope … en-passant hashing defect` section — a third correctness defect in
  merged, Done, 100%-covered code (`src/zobrist.ts:71` hashes the en-passant file whenever
  `epSquare` is set, not only when an ep capture is available, so FIDE-identical positions hash
  differently and threefold repetition under-detects). ADR-0002 recommended it and did not cut it;
  ticketing is BA/PM's. `S` / `P2` is BA/PM's own call, agreeing with the ADR: latent (no consumer
  of the key list exists yet — `gameStatus`'s `positionCounts` has no supplier anywhere in `src/`)
  and the error direction is safe (a legitimate draw is missed, never a false draw declared).
  Ratification of ADR-0002 clause 2 widened its blast radius to four epics without moving its
  severity or reachability, so it carries a sequencing escalation trigger rather than a higher
  priority. INDEPENDENT of ABC-009 and ABC-010 — different module, and unlike those two nothing
  makes this one unreachable. Not promoted to Ready; that gate is a separate step.

  ABC-009 and ABC-010 cut 2026-07-29 by BA/PM from the architecture audit
  (task `architecture-audit-2026-07-29`) — two correctness defects found in merged, Done,
  100%-covered code. Both are LATENT today (`parseFen` has no user-facing caller) and go live
  when EPIC-003 accepts a FEN from a user, which is why ABC-010 (the boundary) is P1 and
  ABC-009 (the invariant behind it) is P2 with a stated escalation trigger. They are
  independent of each other by design; neither is promoted to Ready — the Definition of Ready
  gate is a separate step.

  EPIC-001 left Backlog 2026-07-24 — decomposed into ABC-001..ABC-007 (+ the ABC-008 spike),
  all merged and Done; it now sits in the Done column below. EPIC-002..006 remain
  decomposed-later epics above: each still needs `epic-to-tickets` (Workflow 03) before any
  ticket can be pulled. Nothing is Ready right now — that is the next planning step, not an
  oversight.
-->

## Ready (WIP 3/8)

- [ABC-011] Zobrist key hashes en passant when no capture is available  (size: S, P1, epic: EPIC-001, deps: none)
- [ABC-012] Game history module — the move list is the authoritative state  (size: M, P0, epic: EPIC-002, deps: none)
- [ABC-014] Board frame renderer — grid, labels, shading, orientation, both glyph modes  (size: M, P0, epic: EPIC-002, deps: none)

<!--
  Ready holds 3 of a permitted 8, and 3 is the honest number rather than a conservative one:
  ABC-012 and ABC-014 are the ONLY two EPIC-002 tickets with no unbuilt dependency at all — both
  stand on merged src/ alone. ABC-013 would have been the third and is in Blocked instead, on a
  decision only a human can make. The limit is a ceiling, not a target; Ready is a buffer feeding
  In Development (WIP 3), and flooding it would move the queue rather than shorten it. Same
  reasoning recorded when EPIC-001 put 3 of its 7 into Ready.

  ABC-011 joins them because its OWN escalation trigger fired: it rises to P1 and must be Ready
  "before whichever consumer of the key list lands first", and ABC-012 is that consumer. Both are
  in Ready together; the pull order is the Orchestrator's. ABC-011's size is unchanged at S.

  Emptied 2026-07-23: ABC-003 was pulled into In Development for ticket-to-pr. Its deps
  (ABC-001, ABC-002) are satisfied on main, so it was pulled straight from Ready — no
  analysis or design hop was needed (it arrived meeting the Definition of Ready in full).
-->


## In Analysis (WIP 0/2)

## In Design (WIP 0/2)

## Ready for Dev (WIP 0/6)

## In Development (WIP 0/3)

<!--
  Emptied 2026-07-23: ABC-003 moved to In Review once implemented with tests and a green
  mandatory gate. In lean mode a ticket needing neither analysis nor design flows
  Ready → In Development → In Review with no intermediate hop.
-->


## In Review (WIP 0/3)

<!--
  Cleared 2026-07-24: the ABC-004..007 stacked review unit passed the EPIC-001 review gate
  (QE/E2E independent PR-review-checklist pass + Security/NFR gate) and advanced to Ready for
  UAT. The 4/3 WIP override recorded here at batch start is now RESOLVED — the column is back
  to 0/3. The stacked branches are unchanged (main → 004 → 005 → 006 → 007); the single human
  merge of that stack is still outstanding and still human-held (autonomy=pr).
-->


## In Security/NFR (WIP 0/2)

## Ready for UAT (WIP 0/4)

<!--
  Cleared 2026-07-24: the ABC-004..007 stack was merged to main and moved to Done. UAT
  execution for the EPIC-001 rules core is DEFERRED, not skipped — it is a pure library with
  no surface a human can exercise until EPIC-006 packaging ships a runnable game. The
  traceability UAT cells read "UAT deferred — EPIC-006" so the gap stays visible rather than
  being quietly marked passed.
-->

## In UAT (WIP 0/4)

## Ready to Release (WIP 0/4)

## Done (WIP unlimited)

- [EPIC-001] Chess rules core  (complete: 2026-07-24, decomposed ABC-001..ABC-007 + ABC-008 spike, all merged; rule-complete and perft-proven)
- [ABC-008] SPIKE — Node search throughput  (merged: 2026-07-23, outcome: GO WITH CONSTRAINT, RISK-002 answered)
- [ABC-001] Position state and FEN round-trip  (merged: 2026-07-23, 27 tests, ADR-0001)
- [ABC-002] Pseudo-legal move generation for all piece types  (merged: 2026-07-23, 22 tests, QE PASS no defects)
- [ABC-003] Apply and undo a move with full state restoration  (merged: 2026-07-23, 15 tests, QE PASS no defects, src/apply.ts 100% coverage)
- [ABC-004] Special moves — castling, en passant, promotion  (merged: 2026-07-24, review gate PASS, QE PASS, sec/NFR PASS; UAT deferred → EPIC-006)
- [ABC-005] Legal move filtering and attack detection  (merged: 2026-07-24, review gate PASS, QE PASS, sec/NFR PASS; UAT deferred → EPIC-006)
- [ABC-006] Perft verification harness  (merged: 2026-07-24, deep perft 32/32 exact, RISK-001 retired, NFR-001 ~6.2M nps; UAT deferred → EPIC-006)
- [ABC-007] Game-end detection  (merged: 2026-07-24, review gate PASS, QE PASS, sec/NFR PASS, EPIC-001 rule-complete; UAT deferred → EPIC-006)

<!--
  ABC-004..007 merged 2026-07-24 as one fast-forward of the stacked unit
  (main f80a15a → cd9caae, no conflicts), suite re-verified 143/143 green ON main after the
  merge. EPIC-001 (Chess rules core) is now COMPLETE: all 8 tickets closed.

  The merge was performed by an agent on EXPLICIT human instruction — the same one path that
  crosses the "humans hold merge" line without breaking it: the human holds the DECISION, the
  agent supplies the keystroke. This is NOT standing authorization; the standing rule is
  unchanged and no future merge happens without the same explicit instruction. Identical to
  the rule already recorded for ABC-001/002/003/008.
-->


<!--
  Done means MERGED, and as of 2026-07-23 these three are: `main` was created at 8d0a8f7,
  the tip that contained all three stacked branches. In lean mode Done is the terminal
  column — there is no release stage, so `mode=lean` closes the ticket at merge.

  The merge was performed by an agent on explicit human instruction, which is the one path
  that crosses the "humans hold merge" line without breaking it: the human holds the
  decision, not the keystroke. The standing rule is unchanged — no future merge happens
  without the same explicit instruction.
-->

## Blocked (visible, time-tracked)

- [ABC-013] SAN rendering — src/san.ts with toSan only  (size: M, P1, epic: EPIC-002, blocked-by: ADR-0004 is `proposed`, not ratified — needs a named human, since **no agent may mark an ADR accepted**; raised by BA/PM, since: 2026-07-30)

<!--
  ABC-013 is the FIRST ticket this project has put in Blocked, and it is here rather than in Ready
  on purpose. It meets every other Definition-of-Ready check; what it fails is "no major unresolved
  blocker". ADR-0004 (SAN ownership) says of itself that it does NOT block cutting tickets but DOES
  block "the merge of the first line of src/san.ts", because that is the point at which the decision
  becomes expensive to reverse. A ticket in Ready is pullable, and pulling this one would produce
  code that cannot land — so it sits in Blocked, visible and time-tracked against
  `blocked_escalation_days: 2`, rather than buried in a dependency line where the human ruling it
  needs would be invisible.

  Ratification alone clears it. ADR-0002 and ADR-0003 were each ratified in session by a named
  human on 2026-07-30; this is the same ruling on the same kind of artifact.

  ABC-016 and ABC-017 depend on ABC-013 and therefore inherit the wait. They are in BACKLOG, not
  Blocked: their blocker is a ticket, not a decision, and duplicating one decision across three
  Blocked rows would make the column lie about how many human rulings are outstanding. There is
  exactly one.
-->

## Conventions

These sizing, priority, and Blocked conventions are defined ONCE here and apply to BOTH
cadences (kanban and scrum) — BOARD-04. The Phase-4 scrum cadence references this same block;
it is not redefined per cadence.

### Sizing (spec §6.3)

T-shirt size maps to points: `XS=1, S=2, M=3, L=5, XL=8`. **XL must be split** — the
Orchestrator enforces "no XL into dev". BA/PM sizes (and prioritizes) at refinement. The
sizing scheme is set in config (`sizing`, default `tshirt`).

### Priority (spec §6.3)

`P0` (drop everything) `..` `P3` (someday). Use WSJF instead if config says so
(`priority_scheme`, default `P0-P3`).

### Blocked policy (spec §6.4)

- Any agent can move a ticket to Blocked with a `blocked-by` reason and a date.
- The daily sweep counts blocked time and escalates anything blocked past the config
  threshold `blocked_escalation_days` (default 2).
- A blocker is a decision, a dependency, or a missing input. Name it. Assign a human if needed.
