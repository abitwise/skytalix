# Board
_Updated: 2026-08-01 by Security/NFR (task `ticket-to-pr-ABC-020`, Workflow 04 step 6): **ABC-020 PASSED the risk/NFR gate** and moved In Security/NFR → Ready for UAT. In Security/NFR 1/2 → 0/2, Ready for UAT 0/4 → 1/4; no limit approached, no override taken. The In Security/NFR exit is the one board move this role owns. Nothing was merged and nothing was deployed. **No production code was changed at this gate.** **All three of NFR-001's leaf-cheapness bars were re-measured independently — nothing was accepted from the Engineer's report:** `legalMoves` **exactly 1** across sixteen call shapes, `zobristKey` **≤ 1** (1 when the counts map is consulted, **0** bare and 0 when a cheaper branch decides), and `gameStatus(startpos, emptyMap)` **2.13–2.26 µs** = **0.56x–0.60x of the 3.78 µs bar**, 0.98x–1.01x of the pre-ABC-020 tree in the same process (Apple M3 / Node v24.12.0 / darwin-arm64; `UNKNOWN - verify` elsewhere). **One correction, and it is to the BAR, not the code: the 3.78 µs figure is a start-position number and the catalog did not say so** — kiwipete measures 5.3 µs on the merged tree as well, so read as an absolute ceiling the bar indicts the baseline. `plans/nfr-catalog.md` now carries the position; no target moved. **QE's ordering suspicion is CONFIRMED and it generalises — this is the substantive result of the gate.** Moving the 150-ply check below the fivefold check kills no test, exactly as QE said; it does **not** break the bar as written (≤ 1 still holds), it costs one 281–293 ns key read on a position reachable at most once per game, and it is a durability gap rather than a bar failure. But two further mutations show **all three bars were held by nothing in the repo**: a second `legalMoves()` call and two `zobristKey` reads instead of the shared local **each left all 45 tests green**, and the doubled generation doubles the cost of EPIC-004's hottest call with a green suite. **Closed: `src/gameend.nfr.test.ts`** — three spied assertions, one per bar, in its own file so the hoisted `vi.mock` factory re-routes the module graph for nothing else, which dissolves the Engineer's stated objection rather than overruling it. One mutant fails one assertion each. The five-occurrences-AND-clock-150 tie stays **deliberately unpinned** as QE intended — the zero-key assertion uses a one-occurrence map, so it kills the reorder purely on cost and says nothing about which automatic rule wins. **No security finding at any severity and nothing at or near `security.block_on: high`**: the ASVS L1 tier is not-applicable by absence of the surface it names, and the two rows worth naming rather than dismissing (input validation, hash choice) both point at ABC-010/ABC-009/ABC-011, all carried and ticketed. Gates re-run with the guard in place: **174 pass / 0 skipped**, lint, typecheck, build exit 0, `src/gameend.ts` still 100%. **UAT is recorded as DEFERRED to EPIC-006, not passed** — the ABC-004..007 precedent, for the same reason: this ticket renders nothing and prompts for nothing, so there is no surface a human can exercise. Previously 2026-08-01 by QE/E2E (Workflow 04 step 5): **ABC-020 PASSED review** and moved In Review → In Security/NFR. In Review 1/3 → 0/3, In Security/NFR 0/2 → 1/2; no limit approached, no override taken. The In Review exit is the one board move this role owns. Nothing was merged and nothing was deployed. **QE fixed no production code**; six tests were added, all green, skip count still 0, suite 165 → 171. The verdict was reached by independent re-derivation, not by re-running the author's suite: the G-1 line driven from its FEN and move list (Black makes the third occurrence, White holds the claim, `Re8#` still reachable, `{white-wins, checkmate}`), every clock and occurrence boundary swept in both directions and both colours, and **thirteen mutations run against the delivered suite** — the check the ABC-007 gate did not make. Nine were killed. **Four survived, every one an ordering above the clock, and the ticket asserts a guard for them that does not exist** (`## Out of scope` says "A6 pins it"; A6 pins checkmate against the CLOCK, a different pair). Each changes a reason and never a result, so product severity is LOW and gate severity is higher — QE closed all four with one added test. A9 was verified by name-set diff against `b1b96cd~1` plus a body diff, and holds exactly. **A5's epoch argument is ruled CORRECT**, with the arithmetic reproduced on both trees (117 / 167 / 150, and 150−133=17, 17+100=117); the wording that is wrong is QE's own G-3 sentence carried into A5's Given — the wall unfreezes after its first capture and resets the clock three times, so "within 150 plies" holds per irreversible-move epoch, which is what FIDE 9.6.2 bounds. A5's substance holds under all ten drives and is now pinned by two tests rather than by argument. ABC-009 and ABC-011 confirmed genuinely carried and confirmed load-bearing for no new test. Gates re-run by QE on this branch: 171 pass / 0 skipped / lint, typecheck, build all exit 0 / `src/gameend.ts` 100%. **A10's NFR bars were deliberately NOT re-measured** — Security/NFR owns them next. Three items could not be settled and are recorded as a `claim` with `confidence: UNKNOWN - verify`: FIDE 9.6.1's "consecutive" wording, `GameResult`'s dead-but-correctly-kept alias, and the reason chosen when two automatic rules coincide. Previously 2026-07-31 by the Software Engineer (task `ticket-to-pr-ABC-020`, Workflow 04): ABC-020 moved In Development → In Review, implemented on branch `grugops/ticket-to-pr-ABC-020`. In Development 1/3 → 0/3, In Review 0/3 → 1/3; no limit approached, no override taken. The diff is `src/gameend.ts` alone (+113/−66) plus its test file: the design hop's ratified two-arm union built exactly as written, `gameStatus`'s signature byte-identical, no new import, no new state on `Position`. A1–A10 green; **A9 held exactly — the four named tests whose expectations changed are the only tests whose names changed, the fifth gained the absence assertion the ticket asked for, and no sixth test moved.** A10 measured on Apple M3 / Node v24.12.0 / darwin-arm64 and spied rather than inferred: `legalMoves` 1 per call across ten call shapes, `zobristKey` ≤ 1 (0 when bare), cost 2.17–2.24 µs against a 3.78 µs bar; `UNKNOWN - verify` on other hardware. `ABC-009` and `ABC-011` carried not owned, the FIDE 5.2.2 gap declined as documentation only, the terminal-check order untouched. Human holds merge and deploy. Previously 2026-07-31 by Architect/Design: ABC-020 moved Ready → In Design → Ready for Dev across one design hop, the return-shape question its own `### Open design question` assigns being settled. Ready 6/8 → 5/8, In Design 0/2 → 1/2 → 0/2, Ready for Dev 0/6 → 1/6; no limit approached, no override taken. First entry to and first exit from In Design, and first occupant of Ready for Dev, in this project's history. The shape is a two-arm discriminated union on the `result` field GameStatus already has, with the claimable set optional and absent-when-empty on the in-progress arm; ADR-0002 clause 4 is ruled an EXTENSION and not an amendment, so no human ruling is owed, no ratified clause was touched and no ADR was written. In Development is deliberately NOT entered — that pull is the Orchestrator's. Previously 2026-07-31 by BA/PM (subtask `ba-pm-legality-resequence`, task `epic-to-tickets-EPIC-002`). The project owner's standing priority of 2026-07-31 — "chess moves must be legal according to game rules, everything else comes after that" — re-sequenced this board. TWO TICKETS CUT: ABC-020 (FIDE 9.2/9.3 draws become claimable and FIDE 9.6 backstops land with them, M, P0, straight to Ready) and ABC-021 (the draw-claim interaction, S, P1, Backlog behind ABC-019). ONE PRIORITY CHANGED: ABC-009 P2 → P1, promoted Backlog → Ready. Everything else was re-read and DELIBERATELY LEFT — see the re-sequencing comment under Ready. Ready 4/8 → 6/8; no limit approached, no override taken. EPIC-002 is now 9 tickets / 25 points (was 8 / 23 — ABC-021 adds 2); ABC-020 sits under EPIC-001 with ABC-009 and ABC-011, so EPIC-001 now has three open tickets against merged, Done code. Previously 2026-07-31 by Architect/Design (ADR-0004 ratified — clauses 1 + 3 as proposed, clause 2 as amended; ABC-013 moved Blocked → Ready, Ready 3/8 → 4/8, no limit approached, no override taken. Blocked is now empty after one day, no escalation. The ratification was made by the Orchestrator under a named, quoted delegation from Olger Oeselg — the first ADR here not ratified by a human directly, and explicitly not precedent). Previously 2026-07-30 by BA/PM (EPIC-002 decomposed into ABC-012..ABC-019, 23 points; ABC-012 + ABC-014 promoted to Ready, ABC-013 to Blocked on ADR-0004's ratification, the rest held in Backlog behind their predecessors; ABC-011 escalated P2→P1 and promoted to Ready, its own trigger having fired. Ready 3/8, no limit approached, no override taken. Earlier the same day: ABC-011 cut to Backlog from the architecture audit `architecture-audit-2026-07-29`, on ADR-0002's recommendation. Previously 2026-07-29: ABC-009 + ABC-010 cut to Backlog from the same audit)_

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

- [EPIC-002] Terminal board and game loop  (owner: BA/PM, size: XL, priority: P0, since: 2026-07-22, decomposed: ABC-012..ABC-019 + ABC-021)
- [EPIC-003] Move input and controls  (owner: BA/PM, size: M, priority: P0, since: 2026-07-22)
- [EPIC-004] Engine and AI opponent  (owner: BA/PM, size: L, priority: P0, since: 2026-07-22)
- [EPIC-005] Opening book  (owner: BA/PM, size: S, priority: P1, since: 2026-07-22)
- [EPIC-006] Game session and packaging  (owner: BA/PM, size: M, priority: P2, since: 2026-07-22)
- [ABC-010] FEN semantic validation  (owner: BA/PM, size: M, priority: P1, epic: EPIC-003, since: 2026-07-29)
- [ABC-015] Glyph mode selection — precedence, signal set, --unicode override  (size: S, P1, epic: EPIC-002, blocked-until: ABC-014)
- [ABC-016] Status panel  (size: M, P1, epic: EPIC-002, blocked-until: ABC-013, ABC-014, ABC-020)
- [ABC-017] Bounded move-history pane — two-column SAN  (size: S, P2, epic: EPIC-002, blocked-until: ABC-013, ABC-014)
- [ABC-018] Frame output and redraw  (size: S, P0, epic: EPIC-002, blocked-until: ABC-014)
- [ABC-019] Turn loop skeleton  (size: L, P0, epic: EPIC-002, blocked-until: ABC-012, ABC-014, ABC-018; merge-order: after ABC-020)
- [ABC-021] Draw-claim interaction — the player having the move claims  (size: S, P1, epic: EPIC-002, blocked-until: ABC-020, ABC-019, since: 2026-07-31)

<!--
  AMENDED 2026-07-31: a NINTH EPIC-002 ticket, ABC-021 (draw-claim interaction, S, 2 points), was cut
  under the owner's legality-first directive, taking this epic to 9 tickets / 25 points. The largest
  is still L, so there is still no SPLIT_REQUIRED and the epic's XL size is unchanged. ABC-020 was
  cut in the same step but belongs to EPIC-001, not here — it changes src/gameend.ts, which is the
  rules core. See the re-sequencing comment under Ready.

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

## Ready (WIP 5/8)

- [ABC-009] legalMoves mutates the position it documents as unchanged  (size: S, P1, epic: EPIC-001, deps: none; escalated P2→P1 and promoted 2026-07-31)
- [ABC-011] Zobrist key hashes en passant when no capture is available  (size: S, P1, epic: EPIC-001, deps: none)
- [ABC-012] Game history module — the move list is the authoritative state  (size: M, P0, epic: EPIC-002, deps: none)
- [ABC-013] SAN rendering — src/san.ts with toSan only  (size: M, P1, epic: EPIC-002, deps: ABC-003 + ABC-005, both merged on main; unblocked 2026-07-31 when ADR-0004 was ratified)
- [ABC-014] Board frame renderer — grid, labels, shading, orientation, both glyph modes  (size: M, P0, epic: EPIC-002, deps: none)

<!--
  RE-SEQUENCED 2026-07-31 by BA/PM (subtask `ba-pm-legality-resequence`) against the project owner's
  standing priority, quoted verbatim from Olger Oeselg on 2026-07-31:

    "The most important thing is that chess moves are legal according to game rules, everything else
     comes after that. Game has to be played according to it's rules."

  This is a priority directive, not a feature request, and it outranks the sequencing set on
  2026-07-30. The input is QE's four notes of 2026-07-31 under task `epic-to-tickets-EPIC-002`
  (ranked gaps G-1..G-6, six refutations, the test artifact-ref, and five unsettled items).

  WHAT MOVED — three things, and only three.

  1. ABC-020 CUT and promoted straight to Ready (M, P0, EPIC-001). QE's G-1: the code applies FIDE
     9.2 (threefold) and 9.3 (fifty-move) automatically where the Laws make both a claim by the
     player HAVING THE MOVE. Reproduced with a FEN — 6k1/5ppp/8/b7/8/8/5PPP/4R1K1 — where this code
     declares 1/2-1/2 and FIDE says White mates with Re8. The deviation runs systematically against
     the human, because the engine is the side that repeats when it is losing. It REVERSES rulings
     made twice (ABC-007 and ABC-019 `## Out of scope`, the latter reading "Settled ... not open");
     both predate the directive and both `## Out of scope` blocks were amended in place the same day,
     so no two documents disagree. THE FIDE 9.6 BACKSTOPS (fivefold, 75-move) ARE IN THE SAME TICKET
     AND MUST NOT BE SPLIT OUT: the automatic fifty-move rule is currently the only thing that ends
     a locked position — QE drove one for 117 plies to prove it — so claims without 9.6 ship a game
     that never terminates. Acceptance A5 is the criterion that fails if anyone separates them.
  2. ABC-021 CUT (S, P1, EPIC-002, Backlog behind ABC-020 + ABC-019). The claim interaction: the
     human claims by command, the engine does NOT claim (it has no evaluation until EPIC-004, and
     "always claim" is strictly worse chess), no offer prompt (it would break epic acceptance 4a's
     constant row count), and the status panel states availability attributed to the side to move.
  3. ABC-009 ESCALATED P2 -> P1 and promoted Backlog -> Ready. `legalMoves` offers a FLAG_CASTLE move
     that is not a legal chess move and corrupts the board taking it back — the query that DEFINES
     legality returning an illegal move is exactly the class the directive names. Note carefully:
     the ticket's OWN escalation trigger has NOT fired and is recorded as unspent. This is a
     directive escalation. Not P0 — it still needs a semantically-invalid position, and no path in
     the product produces one today.

  WHAT WAS RE-READ AND DELIBERATELY NOT MOVED. A re-prioritisation that moves everything is a reflex,
  not a judgment, so each of these carries its reason:

  - ABC-010 (M, P1) stays P1. Already ranked as a legality defect on 2026-07-29 and its reachability
    is unchanged by the directive — it goes live when EPIC-003 accepts a user FEN, which is still
    unbuilt. Raising it to P0 would put an EPIC-003 ticket ahead of the tickets that make the game
    exist at all.
  - ABC-011 (S, P1) stays P1. ABC-020 gives it a second and now AUTOMATIC consumer (fivefold, FIDE
    9.6.1). That does not raise it, because a repetition loop can contain no capture and no pawn
    move, so the clock climbs and the CLOCK-BASED 75-move backstop terminates every game regardless
    of what the key does. Under-detection costs a late draw, never a hung game.
  - ABC-012 (M, P0), ABC-014 (M, P0), ABC-018 (S, P0), ABC-019 (L, P0) all stay P0. The directive
    re-ranks CORRECTNESS AGAINST FEATURES, not feature against feature. These four are not renderer
    polish — they are whether the product exists. Demoting them would model the directive as "stop
    building the game", which it does not say. What the directive DOES set is the pull order INSIDE
    P0: ABC-020 first.
  - ABC-013 (M, P1) stays P1. Renderer work, already below every P0.
  - ABC-015 (S, P1) stays P1. Its priority is a SEQUENCING constraint — RISK-005 requires it to merge
    with or before ABC-014 — not a claim about user value. Lowering it would rank it behind the
    ticket it must precede.
  - ABC-016 (M, P1) stays P1. The directive argues both ways and they cancel: its new item 7 is a
    rules affordance (without it no player learns a claim exists), items 1-6 are renderer work.
  - ABC-017 (S, P2) stays P2. Already the drop-first tier; P3 is "someday" and this is in the epic's
    scope line.
  - Every EPIC priority is unchanged (EPIC-002/003/004 P0, EPIC-005 P1, EPIC-006 P2). The directive
    lands on tickets, and the two epics that own rule conformance are already P0.

  WIP AND THE LIMIT. Ready 4/8 -> 6/8 against a configured limit of 8 (`.grugops/factory.config.json`
  `wip_limits.Ready`). NO LIMIT APPROACHED AND NO OVERRIDE TAKEN; no written reason is owed. Both
  promotions qualify on this board's own Ready test rather than on their priority — ABC-020 and
  ABC-009 each have NO unbuilt dependency, standing on merged src/ alone, which is the exact
  criterion that keeps ABC-015..ABC-019 and ABC-021 in Backlog. Six is still under the ceiling and
  Ready remains a buffer feeding In Development (WIP 3), not a target.

  SUGGESTED PULL ORDER (guidance; the pull is the Orchestrator's). ABC-020 first — P0 correctness,
  and it is a merge-order dependency for ABC-019 and ABC-016, whose acceptance criteria were amended
  today to match it. Then ABC-012 and ABC-014, the P0 tickets the product's existence rests on. Then
  ABC-009 and ABC-011, the P1 rules-core defects. Then ABC-013, the P1 renderer ticket. Within a
  single priority the directive ranks rules-core work ahead of renderer work; that ordering is stated
  here rather than encoded by inflating the P0-P3 scheme.

  As written 2026-07-31 by Architect/Design, before this re-sequencing:
  ABC-013 joined Ready 2026-07-31, moved out of Blocked by Architect/Design when ADR-0004 was
  ratified. Ready 3/8 -> 4/8, well under the limit; no override needed and none taken. Ready is the
  right column and not a conservative Backlog hold: ABC-013's only remaining dependencies are
  ABC-003 and ABC-005, both merged on main, so it has NO unbuilt predecessor — the one thing that
  keeps ABC-015..ABC-019 in Backlog. It does not depend on ABC-012 or ABC-014, and the two tickets
  that depend on IT (ABC-016, ABC-017) stay in Backlog behind it, unchanged.

  Read ADR-0004's Status section before citing this move: that ADR was ratified by the ORCHESTRATOR
  under a named, quoted delegation from Olger Oeselg dated 2026-07-31 — NOT by a human directly. It
  is the first ADR in this project ratified that way and it is explicitly NOT precedent; the standing
  rule that no agent may mark an ADR accepted is unchanged for every other ADR. The sentence in the
  Blocked comment below that reads "this is the same ruling on the same kind of artifact" was written
  on 2026-07-30 and is CORRECTED by this paragraph: it was the same kind of artifact, and it was not
  the same kind of ruling.

  As written 2026-07-30, before that ruling: Ready holds 3 of a permitted 8, and 3 is the honest
  number rather than a conservative one:
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

<!--
  ENTERED AND EXITED 2026-07-31 by Architect/Design (task `ticket-to-pr-ABC-020`, Workflow 04).
  ABC-020 is the FIRST ticket this project has put in In Design, and it was pulled here because the
  ticket itself says so: `### Open design question — hand to Architect/Design at the design hop, do
  not decide in dev`. No engineer starts until the return shape is settled, because an engineer who
  guesses the shape writes code against a contract that gets rejected.

  Ready 6/8 -> 5/8, In Design 0/2 -> 1/2 -> 0/2, Ready for Dev 0/6 -> 1/6. Every column under its
  limit; no override needed and none taken. In Design is empty again in the same session, so no
  design-hop WIP was left standing.

  WHAT WAS SETTLED (the design hop is NOT a re-opening of the ticket — acceptance A1-A10 are written
  on observable behaviour and none was edited):

  1. THE SHAPE. GameStatus becomes a two-arm discriminated union on the `result` field it ALREADY
     has, with `claimable?: DrawClaims` present only on the in-progress arm and ABSENT — not null,
     not [] — when nothing is claimable. `DrawClaims.by` is REQUIRED, so an unattributed claim is
     unrepresentable, which is what acceptance A7 is protecting. `EndReason` gains fivefold-repetition
     and seventy-five-move and loses threefold-repetition and fifty-move, which become the whole of a
     new, disjoint `ClaimableDraw`. State (b) reported as `result: "draw"` is now a COMPILE error
     rather than a test failure. The signature `gameStatus(position, positionCounts?)` is
     byte-identical to the merged one.
  2. ADR-0002 CLAUSE 4 EXTENDS AROUND — it is NOT amended, so no human ruling is owed and none was
     taken, and no ADR was written. Both of the clause's propositions have `positionCounts` as their
     subject and both are untouched. The falsifier that would overturn that reading is recorded in
     the note, one sentence long. Note which option the clause actually discriminates against: the
     SECOND EXPORTED QUERY, which is rejected here on four other grounds as well.
  3. A9 IS A SHAPE CONSTRAINT, contrary to the ticket's "resolves identically under all three
     options". 18 whole-object toEqual assertions sit outside A9's named five, and measured on this
     repo's vitest an extra property survives toEqual only when absent. The criterion is CORRECT as
     written and was NOT edited — it is what selected the shape, and the correction is recorded
     beside it.

  Full reasoning, rejected options and constraint check:
  .grugops/context/ticket-to-pr-ABC-020/notes/20260731T181000Z-architect-design-decision-f95614ca.md
-->

## Ready for Dev (WIP 0/6)

<!--
  ENTERED AND EXITED 2026-07-31. Architect/Design put ABC-020 here on the In Design exit (first
  occupant of this column in the project's history); the Orchestrator pulled it to In Development
  the same day, which is the move this role owns.

  DEFINITION OF READY re-checked at the pull, not assumed from the earlier promotion: problem,
  scope/out-of-scope, INVEST, measurable acceptance (exact FENs, exact move lists, thresholds at
  149/150 and four/five occurrences, exact call counts), dependencies, NFR triggers with numbers,
  test notes naming the five existing tests that may change, size M, priority P0, no blocker. The
  one open item at cut time -- the return shape -- was closed by the design hop, so the pull is
  clean rather than conditional.

  Ready for Dev 1/6 -> 0/6, In Development 0/3 -> 1/3. Both under limit, no override taken.

  THE NEXT MOVE IS NOT MINE. Ready for Dev -> In Development is the ORCHESTRATOR's pull, and it is
  deliberately not taken here: In Development is 0/3 and the pull order the board's own re-sequencing
  comment suggests puts ABC-020 first, but a design role taking a dev pull would move work past the
  one role that holds WIP truth for the whole board.

  What the engineer gets, and it is on the ticket rather than only in a note: the exact TypeScript
  the contract requires, in a dated `### ANSWERED` block under the ticket's own open design question,
  plus an expected-value table in `## Test notes` for the five existing tests A9 permits changing —
  each value driven read-only against merged src/, not inferred. The one to read twice is the
  fifty-move test at line 69, where the claimant is BLACK, because White made the move that ticked
  the clock to 100.

  MERGE ORDER IS UNCHANGED AND STILL LOAD-BEARING: ABC-020 merges before ABC-019 and before ABC-016,
  whose acceptance criteria were amended on 2026-07-31 to match it.
-->


## In Development (WIP 0/3)

<!--
  EMPTIED 2026-07-31 by the Software Engineer: ABC-020 implemented with tests and a green
  mandatory gate, moved to In Review. WIP 1/3 -> 0/3. The In Development -> In Review exit is
  the one board move this role owns.

  PULLED 2026-07-31 by the Orchestrator from Ready for Dev -- the one board move this role owns on
  the way in. WIP 0/3 -> 1/3; the column takes ONE ticket, not three, because ABC-020 must merge
  before ABC-019 and ABC-016 and pulling a second ticket now would invite a merge order the board
  has twice recorded as load-bearing.

  Why this ticket first among the P0s: ABC-012/014/018/019 are P0 because the product does not
  exist without them. ABC-020 is P0 because the product plays chess by the wrong rules -- a
  different P0, and the owner's 2026-07-31 directive orders the two.

  Emptied 2026-07-23: ABC-003 moved to In Review once implemented with tests and a green
  mandatory gate. In lean mode a ticket needing neither analysis nor design flows
  Ready → In Development → In Review with no intermediate hop.
-->


## In Review (WIP 0/3)

<!--
  EMPTIED 2026-08-01 by QE/E2E: ABC-020 reviewed and PASSED, moved In Review -> In Security/NFR.
  WIP 1/3 -> 0/3. The In Review exit is the one board move this role owns.

  VERDICT: PASS. ABC-020 meets the lean Definition of Done and the PR review checklist. No defect
  blocks the exit. QE fixed NO production code; six tests were added, all green, skip count 0.

  RE-DERIVED INDEPENDENTLY, not read off the Engineer's report. The G-1 line driven from the FEN
  and the move list: Black's move makes the third occurrence, the status is `in-progress` with
  `{by:"white", draws:["threefold-repetition"]}`, Re8 is still legal for the side to move, and Re8
  gives `{white-wins, checkmate}`. FIDE 1-0 where merged main returns 1/2-1/2. The result is
  `in-progress` and not a fourth value -- at runtime AND at compile time. Boundaries swept in both
  directions and both colours: clock 98/99 no claim, 100/149 claimable, 150/151/999 automatic;
  occurrences 0-2 no claim, 3-4 claimable, 5+ automatic; the full 4x4 cross-product correct,
  including both draws reported together with threefold first.

  THIRTEEN MUTATIONS RUN against the delivered suite in a throwaway worktree -- the check the
  ABC-007 gate did not make. NINE were killed, including `by: "white"` unconditionally (the exact
  G-1 defect, 2 tests), both thresholds in both directions, and `claimable` always present (12
  tests, of which 8 are among the 18 whole-object toEqual assertions A9 forbids touching -- so
  those 18 are demonstrably NOT inert and now also assert that nothing is claimable).

  FOUR MUTANTS SURVIVED, every one an ordering above the clock, and the ticket claims a guard that
  does not exist: `## Out of scope` says the zero-legal-moves-first ordering is load-bearing and
  that "A6 pins it". A6 pins checkmate against the CLOCK -- a different pair. Moving
  isInsufficientMaterial below the 150-ply check, below the fivefold check, or moving the
  zero-legal-moves branch below isInsufficientMaterial each changed a REASON and never a RESULT, so
  no whole-object assertion noticed. Product severity LOW (a reason string, read only by EPIC-006's
  result screen; isInsufficientMaterial is correct per R-1, so no mutant can turn a win into a
  draw). GATE severity higher -- a document asserting a guard that is not there is how ABC-007
  passed. CLOSED by a QE test; all four now fail.

  A9 VERIFIED BY NAME-SET DIFF against b1b96cd~1 (not against main, which would have counted the
  architecture-audit tests as ABC-020 edits): 28 names before, 4 removed, 15 added, 24 unchanged.
  A name diff is not sufficient, so the bodies were diffed too: the only pre-existing tests touched
  are the five named on the ticket, and line 142 is byte-identical. No sixth test moved.

  A5's EPOCH ARGUMENT RULED CORRECT, and the wording that is wrong is QE's own. Ten drives, five
  policies x two trees: pre-ABC-020 first-legal 117 plies (reproducing QE's published G-3 figure to
  the ply), this branch first-legal 167, quiet-only and last-legal 150 exactly. 150-133=17,
  17+100=117, 17+150=167 -- all exact. The wall resets the clock THREE times (plies 8, 14, 17), and
  ply 14 is a PAWN MOVE: the wall unfreezes after the first capture. So A5's Given -- "no capture
  and no pawn move available to either side", carried verbatim from QE's own G-3 note -- is false
  beyond ply 7, and "within 150 plies" holds only per irreversible-move epoch, which is what FIDE
  9.6.2 actually bounds. The Engineer disclosed both narrowings rather than quietly satisfying the
  criterion. A5's SUBSTANCE -- the game terminates automatically with no claim -- holds under every
  one of the ten drives, and is now pinned by two QE tests instead of by argument. RECOMMENDATION
  FOR BA/PM: correct A5's and A8's Given; the criteria themselves need no change and the code needs
  none.

  CARRIED DEFECTS CONFIRMED GENUINELY CARRIED. ABC-009 still mutates its argument (the phantom
  second white king on 4k3/8/8/8/8/8/8/K7 w KQ - 0 1), and NO new test depends on it -- all eleven
  FENs the new tests use round-trip through toFen unchanged across a gameStatus call, kiwipete
  included. ABC-011 cannot decide anything here: epSquare measured -1 at every ply of the G-1
  shuffle, QE's colour-mirror line, knightCycles(4), and the 150-ply wall drive.

  GATES RE-RUN BY QE ON THIS BRANCH after the six added tests: npm test 171 passed / 7 files, skip
  count 0, lint exit 0 (2 pre-existing biome config infos, present before this ticket), typecheck
  exit 0, build exit 0, src/gameend.ts 100% stmt/branch/func/line. Every figure matches the
  Engineer's independently.

  NOT VERIFIED HERE, DELIBERATELY: A10's NFR-001 cost bars. Security/NFR reviews those next and two
  roles measuring the same thing is waste. One thing flagged for them: moving the 150-ply check
  below the fivefold check kills no test and would break the measured "zobristKey = 0 when the
  clock decides" bar.

  THREE ITEMS COULD NOT BE SETTLED and are recorded as a `claim` with confidence UNKNOWN - verify,
  none of them blocking: (1) FIDE 9.6.1's "five CONSECUTIVE alternate moves" versus the plain
  five-count the ticket specifies -- a BA/PM reading, and unfixable from a counts map anyway since
  it carries no ordering; (2) GameResult is dead, keeping it was RIGHT (the ratified block spells it
  out), and the trap is one line to close via `GameResult = GameStatus["result"]` -- for whoever
  owns the ADR-0002 seam; (3) five occurrences AND clock >= 150 always reports seventy-five-move --
  left deliberately unpinned, because pinning an arbitrary choice between two rules that both apply
  is how a later correction becomes a "regression". EPIC-006's result screen decides.

  ENTERED 2026-07-31 by the Software Engineer, branch `grugops/ticket-to-pr-ABC-020`. WIP 0/3 ->
  1/3; no limit approached, no override taken.

  NO PR EXISTS, AND THIS IS NOT A GAP IN THE WORK. This repo has NO git remote -- `git remote` is
  empty -- so there is nowhere to push and no pull request to open. `gh` IS installed and
  authenticated (account `abitwise`), so the blocker is the missing remote, not the tool, and no PR
  link was invented. The two commits sit on the local branch. This is the posture the ABC-004..007
  stack has been in since 2026-07-24, where the same comment records a human merge still
  outstanding. A human holds merge and deploy; nothing was merged and nothing was deployed.

  WHAT LANDED. src/gameend.ts only, +113/-66 lines, no new module, no new import, no new state on
  Position -- the import list is byte-for-byte the merged one, and the gameStatus signature is
  byte-identical (positionCounts stays second and stays optional). The design hop's ratified shape
  was built exactly as written: GameStatus is a two-arm discriminated union on the `result` field
  it already had, `claimable` is ABSENT (not null, not []) when nothing is claimable, and
  DrawClaims.by is required. EndReason gained fivefold-repetition + seventy-five-move and lost
  threefold-repetition + fifty-move, which are now the whole of the disjoint ClaimableDraw.

  ACCEPTANCE. A1-A10 all green -- see the artifact-ref note for how each was proved. A9 held
  exactly: the FOUR named tests that had to change are the only ones whose names changed, the
  fifth (99 plies) gained the absence assertion the ticket asked for, and NO sixth test moved.
  Measured, not asserted: the first run after the implementation landed showed 4 failures, all
  four named. Line 142 ("prefers checkmate over the fifty-move rule") is untouched, as instructed.

  A10 MEASURED on Apple M3 / Node v24.12.0 / darwin-arm64, spied (not inferred) with an
  instrumented copy of legal.ts + zobrist.ts outside the repo, gameend.ts byte-identical:
  legalMoves calls per gameStatus = 1 across all ten call shapes (bar: exactly 1); zobristKey
  calls <= 1, and 0 whenever the caller is bare or an earlier branch decides (bar: at most 1);
  cost 2.17-2.24 us/call against the published 2.52 us baseline, i.e. 0.86-0.89x where the bar is
  1.5x (<= 3.78 us). UNKNOWN - verify on any other hardware.

  CARRIED, NOT FIXED, exactly as the ticket directs: ABC-009 (legalMoves mutating its argument)
  and ABC-011 (en-passant hashing). Every repeated line in the new tests is an en-passant-free
  knight or king shuffle for ABC-011's reason. The FIDE 5.2.2 dead-position gap is NOT fixed --
  the module header now says honestly that insufficient-material is a SUBSET of 5.2.2, which was
  QE's G-3 recommendation, and the terminal-check ORDER is unchanged (R-4's load-bearing
  ordering, pinned by A6 at clock 150 as well as 100).

  ONE THING FOR THE REVIEWER. `GameResult` is now referenced by nothing, here or anywhere in
  src/. It was already exported before this ticket and the design hop's ratified shape spells it
  out verbatim, so it was kept rather than deleted -- flagged, not removed, per coding rule 12,
  and the call to keep or drop it belongs with whoever owns the ADR-0002 seam.

  Cleared 2026-07-24: the ABC-004..007 stacked review unit passed the EPIC-001 review gate
  (QE/E2E independent PR-review-checklist pass + Security/NFR gate) and advanced to Ready for
  UAT. The 4/3 WIP override recorded here at batch start is now RESOLVED — the column is back
  to 0/3. The stacked branches are unchanged (main → 004 → 005 → 006 → 007); the single human
  merge of that stack is still outstanding and still human-held (autonomy=pr).
-->


## In Security/NFR (WIP 0/2)

<!--
  EXITED 2026-08-01 by Security/NFR on a PASS verdict: ABC-020 -> Ready for UAT. WIP 1/2 -> 0/2;
  no limit approached, no override taken. The column is empty again.

  WHAT THIS COLUMN ADJUDICATED, and the result. A10's three bars, all re-measured independently --
  nothing was accepted from the Engineer's report and nothing was quoted from it:

    legalMoves calls per gameStatus   EXACTLY 1, across sixteen call shapes         PASS
    zobristKey calls per gameStatus   <= 1: exactly 1 when the counts map is
                                      consulted, 0 bare, 0 when a cheaper branch
                                      decides                                       PASS
    gameStatus(startpos, emptyMap)    2.13-2.26 us over three fresh processes
                                      = 0.56x-0.60x of the 3.78 us bar, and
                                      0.98x-1.01x of the pre-ABC-020 tree measured
                                      in the SAME process                           PASS

  Apple M3 (Mac15,13) / Node v24.12.0 / darwin-arm64. `UNKNOWN - verify` on any other hardware.
  Call counts were SPIED with instrumented throwaway copies of legal.ts + zobrist.ts outside the
  repo, gameend.ts cmp-verified byte-identical; timings load both trees in ONE process and measure
  them interleaved A,B,B,A so drift hits both equally. Primitives cross-check to three earlier
  agents' published figures (zobristKey 281-293 ns vs 288-306; legalMoves 2.02-2.16 us vs 1.83-2.22).

  ONE CORRECTION, AND IT IS TO THE BAR RATHER THAN THE CODE. The 3.78 us figure is a START-POSITION
  number and plans/nfr-catalog.md did not say so. gameStatus is dominated by its one legalMoves
  call, which costs 2.1 us at startpos and 3.2 us in a middlegame, so gameStatus(kiwipete, emptyMap)
  measures 5.30-5.47 us on this branch and 5.29-5.85 us on MERGED code -- 1.4x the "bar" on both
  trees. Read as an absolute ceiling it indicts the baseline, not this change. The catalog row now
  carries its position and names the machine-independent quantity (the ratio to the same position on
  the baseline tree: 0.94-1.01). Third time this file has learned the same lesson, after NFR-005's
  "in a middlegame position" and NFR-002's ply count.

  QE'S ORDERING SUSPICION: CHASED, CONFIRMED, AND IT GENERALISES. This is the substantive result.
  Moving the 150-ply clock check below the fivefold check leaves gameend.test.ts 45/45 green, and
  spied, it takes a counts-map caller at clock >= 150 from 0 to 1 zobristKey calls. Two precisions,
  because they decide the severity: the bar AS WRITTEN (at most 1) is NOT broken -- the mutant still
  measures max 1 -- so this is a durability gap and not a bar failure; and the cost is one key read,
  281-293 ns, on a terminal position reachable at most once per game (the wall-clock delta measured
  129 ns, inside this harness's +-340 ns noise floor). On its own it would not have been worth a
  ticket.

  What made it worth acting on is that two FURTHER mutations show all three bars were held by
  NOTHING in this repository:

    a second legalMoves() call                       all 45 tests green
    two zobristKey reads instead of the shared local all 45 tests green
    the 150-ply check below the fivefold check       all 45 tests green   (QE's)

  The doubled generation is the serious one: it doubles the cost of the single hottest call in
  EPIC-004's search and every value assertion in the suite stays green. plans/nfr-catalog.md had
  already warned that these bars "must be spied, not inferred" -- the warning had no teeth.

  CLOSED, AND THIS COLUMN OWNED THE CALL. Both prior roles handed the decision here in writing: the
  Engineer's decision note recorded keeping the spy out of the suite as "reversible in one small
  commit if Security/NFR wants the guard permanent", QE declined because "a call-count spy is this
  column's instrument, not QE's", and this block previously read "that is the call to make here".
  Made: src/gameend.nfr.test.ts, three spied assertions, one per bar. NO production code changed and
  no existing test touched. The Engineer's objection -- a vi.mock factory is hoisted to file scope,
  so it would re-route the module graph for all 45 tests in gameend.test.ts to buy three assertions
  -- was correct, and a SEPARATE FILE dissolves it rather than overruling it; that option was not on
  the table when the judgment was made. Verified one mutant per assertion:

    second legalMoves call  -> "bare, in progress: expected legalMoves 1 times, got 2"
    two zobristKey reads    -> "expected zobristKey 1 times, got 2"
    the reorder             -> "expected zobristKey +0 times, got 1"

  LEFT UNPINNED ON PURPOSE, and QE's reasoning survives intact. Five occurrences AND clock >= 150
  both apply and the code reports seventy-five-move; pinning an arbitrary choice between two rules
  that both hold is how a later correction becomes a "regression". The zero-key assertion therefore
  uses a counts map holding ONE occurrence, where no repetition rule is in play at all -- it kills
  the reorder purely on COST and says nothing about which rule names the tie. EPIC-006's result
  screen still decides that.

  ALLOCATION. State (c) -- in progress, nothing claimable, the common case at every search leaf --
  measures 1.33 B/call on this branch and 1.33 B/call on the pre-ABC-020 tree over 1,000,000-call
  windows with zero GC events inside them: indistinguishable, so the branch adds none. Worth stating
  precisely: state (c) is not literally allocation-free and never was (merged code already allocates
  the returned literal), and src/gameend.ts:161 allocates `const draws = []` unconditionally, on the
  state-(c) path too -- it costs nothing because TurboFan sinks it into the branch where it escapes,
  which is the path a hot search leaf runs. State (b) allocates the DrawClaims the ratified shape
  asks for (~+2.3 B/call measured, a lower bound), and state (b) means a claim genuinely exists.

  STRUCTURAL. No new dependency edge (the import list is byte-identical to 65cb789's), no new state
  on Position (src/position.ts unchanged), and no dependency change at all -- package.json and the
  lockfile are untouched and the project has zero runtime dependencies.

  THE SECURITY HALF IS EMPTY, AND IT WAS RE-CHECKED RATHER THAN ACCEPTED. gameStatus is a pure
  function of an in-memory Position and an optional Map: no interpreter, no parser, no file, no
  socket, no process boundary, no credential, no persistence, no user data. Working the L1 tier of
  the ASVS checklist (70 requirements at security.asvs_level L1), every applicable row is
  not-applicable by ABSENCE of the surface it names. Two are worth naming rather than dismissing:
  V2.2.1 (gameStatus validates nothing and is right not to -- its contract is a well-formed
  Position; FEN semantics are ABC-010's and the integrity defect on this path is ABC-009, carried
  and ticketed) and V11.4.1 (zobristKey is a repetition hash, not a security control -- nothing
  authenticates or authorizes on it, and its collision behaviour is ABC-011's correctness question).
  NO FINDING AT ANY SEVERITY, and nothing at or near security.block_on: high. The consequence of a
  defect here is a wrong chess result, which is what the whole ticket is about -- not inflated, not
  deflated.

  ACCEPTED RISKS, EACH WITH AN OWNER. (1) The us figure is a single-machine number, UNKNOWN - verify
  elsewhere; the new guard is the machine-independent half, and no wall-clock assertion was added to
  the suite because it would pass or fail on the machine that runs it -- owner EPIC-004's non-M3
  spike, which already carries the same obligation for NFR-005. (2) The un-optimized (cold) cost of
  the state-(c) empty-array literal is UNKNOWN - verify: measured and inconclusive, and irrelevant at
  a hot leaf -- owner EPIC-004. (3) ABC-009 and ABC-011 remain carried, not owned -- owners their
  own tickets.

  NOT RE-LITIGATED HERE. QE's four LOW defects and three unsettled items stand as recorded: A5/A8's
  Given wording and FIDE 9.6.1's "consecutive" are BA/PM's, and the dead GameResult alias is
  Architect/Design's. This column adding an opinion to them would be noise.

  GATES, re-run on this branch with the guard in place: npm test 174 passed / 8 files (was 171),
  skip count 0, npm run lint exit 0 (the same 2 pre-existing biome config infos), npm run typecheck
  exit 0, npm run build exit 0, src/gameend.ts still 100% stmt/branch/func/line.

  Still NO git remote, so still no PR to open; the work sits on the local branch
  grugops/ticket-to-pr-ABC-020. A HUMAN HOLDS MERGE AND DEPLOY. Merge order is still load-bearing:
  this merges BEFORE ABC-019 and ABC-016.

  ---
  ENTERED 2026-08-01 by QE/E2E on a PASS verdict. WIP 0/2 -> 1/2; no limit approached, no override
  taken. FIRST OCCUPANT of this column since it was cleared -- the ABC-004..007 stack passed
  through it on 2026-07-24.

  WHAT IS OWED HERE, and it is a short list because QE deliberately did not touch it. ABC-020's
  acceptance criterion A10 is "the cost bar in `Security / NFR triggers` holds when measured", and
  that is the whole of what this column has to adjudicate:

    - legalMoves calls per gameStatus stays EXACTLY 1;
    - zobristKey calls per gameStatus stays AT MOST 1 (fivefold and threefold share one key read);
    - gameStatus stays within 1.5x of its measured 2.52 us per call (bar: <= 3.78 us).

  The Engineer reports these SPIED, not inferred, on Apple M3 / Node v24.12.0 / darwin-arm64:
  legalMoves = 1 across ten call shapes, zobristKey <= 1 and 0 when the caller is bare or an earlier
  branch decides, cost 2.17-2.24 us. `UNKNOWN - verify` on any other hardware. QE did NOT re-measure
  any of it -- two roles measuring the same thing is waste, and nothing about it looked suspicious.

  ONE THING QE FOUND THAT BEARS ON THIS COLUMN. Mutation testing showed that moving the 150-ply
  clock check BELOW the fivefold check kills no test in the suite. That mutation would break the
  bar-2 property the Engineer measured -- "zobristKey = 0 when the clock decides", since the key
  read would then happen before the clock short-circuits -- and nothing would notice. QE did not add
  that guard: a call-count spy is this column's instrument, not QE's, and the Engineer's decision
  note records deliberately keeping the spy out of the permanent suite as reversible in one small
  commit if this column wants it. That is the call to make here.

  The ticket also records "No security trigger": no injection sink, no trust boundary, no privilege,
  no data exposure. The consequence of a defect in this module is a wrong chess result -- which is
  what the whole ticket is about, and neither to be inflated nor deflated.
-->

## Ready for UAT (WIP 1/4)

- [ABC-020] FIDE 9.2/9.3 draws become claimable, FIDE 9.6 backstops land with them  (size: M, P0, epic: EPIC-001, since: 2026-08-01, UAT: deferred → EPIC-006)

<!--
  ENTERED 2026-08-01 by Security/NFR on a PASS verdict. WIP 0/4 -> 1/4; no limit approached, no
  override taken. First occupant of this column since it was cleared on 2026-07-24.

  UAT IS DEFERRED TO EPIC-006, AND IT IS RECORDED AS DEFERRED RATHER THAN PASSED. ABC-020 is
  rules-core-only work: it renders nothing and prompts for nothing (its own `## Out of scope` sends
  the interaction to ABC-021, the panel row to ABC-016, the prompt verb to EPIC-003 and the result
  screen to EPIC-006). There is no surface a human can exercise until a runnable game ships, so
  there is no UAT to run and marking one passed would be a fabrication. This is exactly the posture
  ABC-004..007 were given on 2026-07-24 and the reason is unchanged. The traceability UAT cell reads
  "UAT deferred — EPIC-006" so the gap stays visible.

  What a human WILL be able to exercise once EPIC-006 ships, and what UAT should then cover: that a
  threefold repetition or a 100-ply clock offers a claim instead of ending the game, that declining
  it and playing on is possible (the G-1 line's Re8# is the acceptance case), that the claim is
  offered to the side to move and to nobody else, and that a game with no claim ever made still
  ends -- on fivefold for a caller with history, on the 75-move backstop for one without.

  ---
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

_Empty. The column's one and only occupant, ABC-013, was unblocked 2026-07-31._

<!--
  CLEARED 2026-07-31 by Architect/Design (subtask `architect-adr0004-ratify`): ADR-0004 is
  `accepted`, so ABC-013's single blocker is gone and it moved to Ready (see the Ready comment for
  why Ready and not Backlog). Blocked time: 2026-07-30 -> 2026-07-31, ONE day against
  `blocked_escalation_days: 2` — it never escalated. First entry to and first exit from this column
  in the project's history; the Blocked convention worked exactly as written, which is worth one
  line in plans/metrics.md when the next sweep runs.

  HOW it was ratified matters and is not what the paragraph below anticipated. ADR-0004 was ruled on
  by the ORCHESTRATOR under an explicit, quoted delegation from the project owner Olger Oeselg dated
  2026-07-31 ("I will give ADR-0004 ownership to you, you can decide if changes are needed or it can
  be scrapped") — NOT by a human directly. It is the FIRST ADR in this project ratified that way, it
  is explicitly NOT precedent, and the delegation was specific to ADR-0004 by name. The standing rule
  that no agent may mark an ADR accepted is unchanged for every other ADR. The last line of the
  paragraph below — "this is the same ruling on the same kind of artifact" — is therefore CORRECTED
  rather than fulfilled: same kind of artifact, different kind of ruling.

  The ruling accepted clauses 1 and 3 as proposed and AMENDED clause 2. The amendment lands on
  EPIC-003's `parseSan` (a discriminated result that keeps `ambiguous` and `rejected` distinct, plus
  the move-identity invariant), not on ABC-013's `toSan` — so ABC-013's scope, size, priority,
  acceptance criteria and NFR bars are all unchanged by it.

  As written 2026-07-30, when the ticket entered this column:
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
