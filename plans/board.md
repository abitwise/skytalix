# Board

_Updated: 2026-08-10 by the Orchestrator (board tidy, no task): **THE PER-HOP NARRATIVE MOVED OUT TO `plans/tickets/history/`. NO TICKET MOVED, NO WIP NUMBER CHANGED, NO TICKET BODY EDITED, NOTHING SUMMARISED OR DROPPED.** The board had reached **549,833 characters**, of which **532,677 (97%)** was per-hop transition narrative in 61 HTML-comment blocks and an 11-deep stack of `_Updated:` headers — one single header line was **103,498 characters**. Every entry is now in `plans/tickets/history/<ID>-board-history.md`, **verbatim**, one file per ticket, linked from that ticket. Checked before moving: **98% of that text exists nowhere else** (120 sampled sentences against all 330 context notes — only 3 were duplicates), so this was a relocation and deleting it would have destroyed the audit trail. **ONE ENTRY WAS RESTORED, NOT MOVED:** BA/PM's `ABC-009` `A13` header was **destroyed by the Orchestrator on 2026-08-09**, which treated a newest-first append stack as a single replaceable field; recovered from `e644039` and filed in `ABC-009`'s history. The board now carries what its own FORMAT comment always said it should — columns, WIP counts, one-line ticket rows and the conventions._

**Per-hop detail lives with its ticket, not here:** `plans/tickets/history/<ID>-board-history.md`.

> **Rule, so this file does not regrow.** A board row is ONE LINE. Everything else a hop produces —
> what was measured, what was rejected, what a gate found — goes in that hop's context notes
> (`.grugops/context/<task>/notes/`, Workflow 16) and, if it is board state, in the ticket's
> `history/` file. Do not append a narrative `_Updated:` header; replace the one above.

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
- [ABC-016] Status panel  (size: M, P1, epic: EPIC-002, blocked-until: ABC-013, ABC-014, ABC-020)
- [ABC-017] Bounded move-history pane — two-column SAN  (size: S, P2, epic: EPIC-002, blocked-until: ABC-013, ABC-014)
- [ABC-019] Turn loop skeleton  (size: L, P0, epic: EPIC-002, blocked-until: ABC-012, ABC-014, ABC-018; merge-order: after ABC-020)
- [ABC-021] Draw-claim interaction — the player having the move claims  (size: S, P1, epic: EPIC-002, blocked-until: ABC-020, ABC-019, since: 2026-07-31)
- [ABC-023] Castling precondition net — destination square, joint occupant pair, one-axis doubling  (size: S, P2, epic: EPIC-001, blocked-until: ABC-009 merged; cut 2026-08-09 by BA/PM, HARDENING not a defect)

## Ready (WIP 1/8)

- [ABC-013] SAN rendering — src/san.ts with toSan only  (size: M, P1, epic: EPIC-002, deps: ABC-003 + ABC-005, both merged on main; unblocked 2026-07-31 when ADR-0004 was ratified)

## In Analysis (WIP 0/2)

## In Design (WIP 0/2)

## Ready for Dev (WIP 0/6)

## In Development (WIP 0/3)

## In Review (WIP 1/3)

- [ABC-022] generateMoves offers en-passant captures its own preconditions forbid  (size: S, P1, epic: EPIC-001, deps: none; entered 2026-08-09 by the Software Engineer, Workflow 04)

## In Security/NFR (WIP 0/2)

## Ready for UAT (WIP 0/4)

## In UAT (WIP 0/4)

## Ready to Release (WIP 0/4)

## Done (WIP unlimited)

- [ABC-009] legalMoves mutates the position it documents as unchanged  (merged: 2026-08-09 by fast-forward aad6d48 → 5ee84e8, 19 commits, no merge commit — `git rev-list --count HEAD..main` was 0 and `git log --merges main..branch` empty, both checked BEFORE the merge; **the merge keystroke was DENIED by the host classifier and RETURNED TO THE OWNER rather than worked around — the owner merged and deleted the branch**, the third such denial in this project and the third returned; 381/381 on 16 files + skip 0 + lint/typecheck/build exit 0 re-verified ON main by the Orchestrator after the merge, and `PERFT_DEEP=1` **32/32 exact in 40.15 s run on main** — the Orchestrator's first and only measurement of that lane on this ticket; `src/moves.ts` md5 `0e247853…` **IDENTICAL to the Engineer's first commit across all six hops**, so no gate ever repaired the module to make its own verdict green — QE and BA/PM changed tests and ticket text only, and **every hop after the first added ZERO production lines**; THE FIX IS TWO GUARD CONDITIONS, +30/-8 in `addCastlingMoves`, with `rookFrom` added to the precomputed `CastleOption` table and a module cycle via `apply.ts` rejected as the alternative; **pulled only after BA/PM found and fixed SEVEN acceptance defects at the pull — four the Orchestrator flagged, THREE named by no pre-check — the blocking one measured on a mutant: a fix implementing the rook precondition ALONE passed all six original criteria, the suite 304/304 and deep perft 32/32 while still writing a phantom king**; six criteria became THIRTEEN (`A1`-`A13`), all thirteen green; **FIRST BACKWARD BOARD MOVE IN THIS PROJECT'S HISTORY** — Ready for UAT -> In Review on 2026-08-09 when `A11` was found unmet, because a ticket with an unmet criterion cannot honestly sit in Ready for UAT; QE PASS after 62 then 24 mutants (86 total, plus BA/PM's 10 + 17 + 24 and the Orchestrator's 12) of which **five passed all twelve criteria at the first QE hop and three passed the entire net after it** — every one a gap in the CRITERIA, never a defect in the code; Security/NFR PASS_WITH_RISKS, no required fix, 10 accepted risks each owned, **NFR-001 met on both clauses and moved OFF THE CLOCK ONTO A COUNT** (the two added lines run 198,175 times each over 11,377,922 nodes and reject nothing; +1.30/+1.73 ns against a ±0.22 ns null floor → true ratio ≈ 0.9999, so the 0.9930 clock reading was ~35x the real deviation); **A7 KILLED NOTHING across 62 mutants** and its stated justification was retired as false — the Engineer's own red-before-green record showed those rows green on the UNFIXED tree; guard ordering discharged as a PROVEN PROPERTY (permutation-invariant, 99 comparisons over 33 FENs) so no reorder can silently break it; **UAT deferred → EPIC-006, explicitly NOT passed** — no CLI entry point; **ABC-023 cut** for the three measured leftovers, the sharpest being that THE CASTLE'S DESTINATION SQUARE IS PINNED BY NOTHING — verified by the Orchestrator: dropping the landing square from `kingPath` passes all 381 tests AND the deep 32/32 lane while offering a castle into an attacked square, and it is **the only class across six hops whose position is LEGALLY REACHABLE**; the Orchestrator made FIVE verification errors on this ticket, every one caught by the role it was checking and every one the same shape — believing an instrument without checking the instrument)
- [ABC-018] Frame output and redraw — in-place on a TTY, append otherwise, constant height  (merged: 2026-08-09 by fast-forward 7e0923c → 364928b, 5 commits, no merge commit — `git rev-list --count branch..main` was 0 and `git log --merges main..branch` empty, both checked BEFORE the merge; 304/304 on 14 files + skip 0 re-verified ON main by the Orchestrator, lint/typecheck/build exit 0 both sides; `src/frame.ts` md5 `bb827f52…` IDENTICAL to the Engineer's first commit — QE changed only its own test file (+148/-0) and Security/NFR changed no source, so neither gate repaired the module to make its own verdict green; **promoted only after BA/PM found and fixed FIVE acceptance defects at the `Backlog → Ready` exit — three the Orchestrator flagged, two named by no pre-check — including a frame row (the prompt row) that EPIC-002's own reference layout contained and NO ticket owned**; QE PASS after 56 distinct mutants over 75 cycles, of which **6 passed all twelve criteria and all 297 delivered tests** — every one a gap in the CRITERIA rather than a defect in the code, all pinned; Security/NFR PASS_WITH_RISKS, no required fix, 5 accepted risks each with a named owner, **NFR-002's write half measured for the first time in this project** at 0.0087–0.0088 ms against 16 ms; **UAT deferred → EPIC-006, explicitly NOT passed** — zero runtime importers, no CLI entry point; first merge in three not preceded by a host permission denial; `RISK-005` fully discharged — merge-order half satisfied before the ticket started, build half checked mechanically at the merge)
- [ABC-015] Glyph mode selection — precedence, signal set, --unicode override  (merged: 2026-08-08 by fast-forward f1743a3 → f4d5d31, 12 commits, no merge commit — `git log --merges` empty and `git rev-list --count branch..main` was 0 before the merge, both verified not assumed; 277/277 on 13 files + skip 0 re-verified ON main by the Orchestrator, lint/typecheck/build exit 0 both sides; `src/glyph-mode.ts` md5 `9c1f4f4e…` IDENTICAL to the Engineer's first commit — QE and Security/NFR each changed tests or docs only and neither repaired the module to make its own verdict green; QE PASS after 29 mutants of which 3 passed every criterion AND all 271 delivered tests; Security/NFR PASS_WITH_RISKS, no required fix, 4 accepted risks each with a named owner, NFR-007's zero-I/O bar re-derived on that gate's own instruments and MET; **acceptance criteria AMENDED TWICE mid-flight by BA/PM, 9 criteria → 15, every amendment ratifying what was already built**; **UAT deferred → EPIC-006, explicitly not passed** — zero runtime importers, no CLI entry point; second merge in two days preceded by a host permission denial that was returned to the owner rather than worked around; RISK-005's merge-order constraint DISCHARGED — this merged before ABC-018, which is still unstarted)
- [ABC-014] Board frame renderer — grid, labels, shading, orientation, both glyph modes  (merged: 2026-08-08 by fast-forward ed42d26 → c1d694f, 6 commits, no merge commit; 253/253 green + skip 0 re-verified ON main by the Orchestrator, lint/typecheck/build exit 0 both sides; QE PASS after 34 mutate-and-restore cycles with `src/render.ts` md5 unchanged; Security/NFR PASS_WITH_RISKS — NFR-002 board-frame bar re-measured 2.092 µs against ≤ 500 µs, ~240x headroom, Apple M3 / Node v24.12.0 / darwin-arm64; 4 accepted risks each with a named owner; **UAT deferred → EPIC-006, explicitly not passed** — zero importers, no CLI entry point; first merge in this project preceded by a host permission denial that was returned to the owner rather than worked around)
- [ABC-012] Game history module — the move list is the authoritative state  (merged: 2026-08-06 by fast-forward 39e260d → 7355b51, 8 commits, no merge commit; 226/226 green + skip 0 re-verified ON main; **THE FIRST MERGE UNDER THE OWNER'S STANDING MERGE APPROVAL, not a per-instance instruction**; three gates PASS — QE killed 21 mutants of which 3 survived the delivered suite, Security/NFR re-measured all six NFR bars independently and MET every one at 0.09x–0.67x; five accepted risks each with a named owner, no required fix; UAT deferred → EPIC-006)
- [ABC-011] Zobrist key hashes en passant when no capture is available  (merged: 2026-08-04 by fast-forward 4a73cf3 → d3efba6, 16 commits, no merge commit; 214/214 green + 0 skips re-verified ON main; two design hops, two dev passes, two QE reviews and two sec/NFR gates; the MEDIUM purity defect the owner declined to merge is CLOSED; ADR-0005 accepted-with-amendment and ADR-0006 accepted; UAT deferred → EPIC-006)
- [ABC-020] FIDE 9.2/9.3 draws become claimable, FIDE 9.6 backstops land with them  (merged: 2026-08-02 by fast-forward d53ce31 → cb62c9f; 174/174 green re-verified ON main; QE PASS after 13 mutations, sec/NFR PASS on all three bars re-measured; UAT deferred → EPIC-006; its one open question — FIDE 9.6.1 "consecutive" — CLOSED 2026-08-02 as conformant, no code change owed)
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
