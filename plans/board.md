# Board

_Updated: 2026-08-10 by QE/E2E (task `ticket-to-pr-ABC-013`, subtask `ticket-to-pr-ABC-013-qe`, Workflow 05): **`ABC-013` MOVED `In Review` → `In Security/NFR`. In Review 1/3 → 0/3, In Security/NFR 0/2 → 1/2. QE VERDICT: PASS — ZERO defects in the code, FIVE gaps in the CRITERIA, counted separately and not conflated.** **THE 52-ROW TABLE HAS AN EXTERNAL ORACLE FOR THE FIRST TIME AND IT DISPUTES NOTHING.** Every hop before this recorded that the expected strings were hand-derived with no external instrument available; one was available — `chess.js@1.4.0`, installed into a scratchpad OUTSIDE the repository, `package.json` and `package-lock.json` byte-unchanged and **no repo dependency added**. It disputes **none** of the table's expected strings, and `src/san.ts` matched it on **649,556 SAN strings over 8,435 positions in BOTH call forms with ZERO mismatches**. A second oracle built to a deliberately different shape (minimal-unique-qualifier search, capture read from the BOARD, castle side from the king's travel direction) agrees over **323,694 renders — 0 divergences, 0 purity failures**, and an out-of-tree matcher resolves every emitted string back to **exactly one legal move and the right `Move` object** — `ADR-0004` clause 2b's round trip, run one epic early and entirely outside `src/`. **`A7`'s `Ne4` IS UPHELD** — disambiguation over LEGAL rather than pseudo-legal moves is what the external implementation does too, so the one row where a reader could disagree with the RULE has been settled by something other than a grugops reading. **40 MUTANTS: 31 KILLED, 9 SURVIVED — 4 provably equivalent controls, and FIVE GENUINELY WRONG BUILDS THAT PASS ALL 22 CRITERIA AND ALL 652 TESTS.** All five are one class — **OVER-QUALIFIED (non-minimal) disambiguation**: rooks (`Ra1b1` for `Rab1`), bishops (`Bc4d5` for `B4d5`), qualified captures (`Nb6xd5` for `Nbxd5`), every black move, and black on the rank rung (`Nc3e4` for `N3e4`) — each confirmed wrong by the external oracle as well. **Root cause in one sentence: minimality is asserted ONLY by the acceptance table, and the table exercises it only on WHITE knights and WHITE queens** — the two table-free properties cannot see it, because an over-qualified string is still distinct and still of the SAN grammar. **THESE ARE GAPS IN THE CRITERIA, NOT DEFECTS IN THE CODE**, and the distinction is the whole verdict. **FOUR FURTHER MUTANTS PASS EVERY ONE OF `A1`–`A21` AND DIE ONLY ON THE ENGINEER'S INJECTIVITY PROPERTY** (black castle side by absolute square, disambiguator skipped on captures, `x` dropped for black, rooks under-qualified) — that property is far more load-bearing than the note introducing it claimed, and must not be weakened. The Engineer's two table-invisible mutants were reproduced independently and a third of the same shape found; `src/san.nfr.test.ts` earns its place. **ONE COUNTING DEFECT, NO CODE IMPACT: the table holds 68 expected strings (63 distinct), not 52** — 48 rows plus `A1`'s 20-string set, transcribed exactly by `src/san.test.ts` and all 68 present in the ticket, checked mechanically. `52` travelled from BA/PM's out-of-tree harness into the ticket, four notes, this board and the trace, and is re-derivable from nothing. Gate re-run by QE on the branch tip: lint/typecheck/build exit **0**, **652/652 on 20 files**, skip count **0**; `src/san.ts` coverage **100% lines / 95% branches** (both uncovered branches are `noUncheckedIndexedAccess` fallbacks). **Test-integrity checker exit 2** — `.grugops/test-skips.md` does not exist, so it could not run; recorded as an error and never as a pass, pre-existing and not introduced here, with the skip count independently measured at 0. **`src/san.ts` md5 `cbcc3be37c21414d16e8e6b4d0c68959` BYTE-IDENTICAL before the first mutation and after the last** — no gate repaired the thing it measures. **NO TEST WAS ADDED OR CHANGED BY THIS HOP**: the `src/` diff is still three new files, +628/−0, so the five criteria gaps are REPORTED AND NOT CLOSED — closing them is one property test or five rows and it is BA/PM's ticket, not hidden scope. `ADR-0004` not re-opened, `plans/nfr-catalog.md` not edited, no criterion or expected string edited, `parseSan` not written. NOTHING MERGED, NOTHING DEPLOYED. Per-ticket detail is in `plans/tickets/history/`, not here._



**Per-hop detail lives with its ticket, not here:** `plans/tickets/history/<ID>-board-history.md`.

> **Rule, so this file does not regrow.** A board row is ONE LINE. Everything else a hop produces —
> what was measured, what was rejected, what a gate found — goes in that hop's context notes
> (`.grugops/context/<task>/notes/`, Workflow 16) and, if it is board state, in the ticket's
> `history/` file. Do not append a narrative `_Updated:` header; replace the one above — and when
> you replace it, **append the outgoing line verbatim to that ticket's `history/` file first.**
> Those lines carry content that exists nowhere else (measured: 98%), so replacing without
> archiving destroys it. The Orchestrator did exactly that twice on 2026-08-09 before noticing.

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

    ## In Review (WIP 0/3)
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
- [ABC-024] Castling guards protected only by the opt-in deep lane — the `empty` corridor on black, and the right test off its default scalars  (owner: BA/PM, size: S, P2, epic: EPIC-001, since: 2026-08-10, cut from ABC-023's QE hop by BA/PM, HARDENING not a defect; **DoR NOT fully met — 8 of 10 clean, 2 recorded ⚠️**, blocked-until: ABC-023 merges (ordering dependency over one shared file, not content); **7 wrong builds pass the DEFAULT `npm test` at 625/625 and die ONLY in the opt-in `PERFT_DEEP=1` lane** — 4 of the 5 BLACK `empty` corridor squares (all 5 white ones die in the default lane) plus all 3 scalar-conditional forms of the castling right test; 6 of the 7 hang on EXACTLY ONE deep assertion; QE reported 2, BA/PM re-derived and measured 7 — 14 mutants, 0 broken builds, 0 harness errors, 26 witnesses, `src/moves.ts` md5 6335b452… never written; **ruling recorded in the ticket: a guard whose ONLY protection is the deep lane is owed a default-lane row, and the deep lane is NOT promoted into the gate**; ABC-009 not reopened, ABC-023 not edited)

## Ready (WIP 0/8)


## In Analysis (WIP 0/2)

## In Design (WIP 0/2)

## Ready for Dev (WIP 0/6)

## In Development (WIP 0/3)


## In Review (WIP 1/3)


## In Security/NFR (WIP 1/2)

- [ABC-013] SAN rendering — src/san.ts with toSan only  (owner: Security/NFR, since: 2026-08-10, size: M, P1, epic: EPIC-002, branch: grugops/ticket-to-pr-ABC-013; **QE/E2E PASS — 0 defects in the code, 5 gaps in the CRITERIA**; the expected strings have an EXTERNAL oracle for the first time (`chess.js@1.4.0`, scratchpad only, no repo dependency added, `package.json` byte-unchanged) and it **disputes none of them**, with **649,556 SAN strings matched over 8,435 positions in both call forms, ZERO mismatches**; a second differently-shaped oracle agrees over 323,694 renders and an out-of-tree matcher round-trips every string to the right `Move`; **`A7`'s `Ne4` upheld** — the legal-vs-pseudo-legal rule is settled by something other than a grugops reading; **40 mutants, 31 killed, 9 survived — 4 equivalent controls and FIVE genuinely wrong builds that pass all 22 criteria AND all 652 tests**, every one the same class: over-qualified disambiguation for rooks, bishops, qualified captures and black, because **minimality is asserted only by the table and the table exercises it on white knights and white queens alone**; four further mutants pass `A1`–`A21` and die only on the Engineer's injectivity property; **the table holds 68 expected strings, not 52**; gate re-run lint/typecheck/build exit 0, 652/652, skip 0, test-integrity checker exit 2 (registry absent, pre-existing); `src/san.ts` md5 `cbcc3be3…` byte-identical before and after every mutation and **no test added or changed** — full record: `plans/tickets/history/ABC-013-board-history.md`)


## Ready for UAT (WIP 0/4)


## In UAT (WIP 0/4)

## Ready to Release (WIP 0/4)

## Done (WIP unlimited)

- [ABC-023] Castling precondition net — destination square, joint occupant pair, one-axis doubling  (merged: 2026-08-10 by fast-forward b2d3554 → f739a30, 13 commits, no merge commit — `git rev-list --count HEAD..main` was 0 and `git log --merges main..branch` empty, both checked BEFORE the merge; gates run on the branch tip and AGAIN on `main`: lint/typecheck/build exit **0** both sides, **625/625 on 18 files**, skip count **0**, `PERFT_DEEP=1` **32/32 exact** both sides; **`src/moves.ts` md5 `6335b452…` BYTE-IDENTICAL to its pre-ticket state on `main` through all five hops** — no gate ever repaired the module to make its own verdict green, and the whole delivered diff is `src/moves.castling.hardening.test.ts` **+749/−0, additions only**, no other file under `src/` touched and no existing test row modified; **THIS IS A HARDENING TICKET AND IT DELIVERED ZERO PRODUCTION LINES, exactly as `A4` required** — the criterion that says so arrived UNSATISFIABLE, pinning a hash `ABC-022` had already invalidated, and was repaired at the promotion hop; pulled only after BA/PM found **SIX** acceptance defects, **THREE named by no pre-check** and two unsatisfiable by construction, and re-measured all 16 inherited mutant verdicts against the 559-test suite they had never been scored against (34 mutants, 0 mismatches); the Engineer wrote 17 rows/19 tests — the exact estimate — each **red on its own mutant**, and reported one row as already-dead pre-rows rather than claiming nine of nine; **QE ran 67 MUTANTS OVER THREE TREE STATES AND FOUND FOURTEEN BUILDS THAT PASSED EVERY CRITERION, THE WHOLE 578-TEST SUITE AND DEEP PERFT 32/32** — all fourteen closed with **44 added rows and NO CRITERION AMENDED**, and its independent harness is what actually asserts `A5`, which until that hop was asserted only by the instrument of the role that wrote the rows; Security/NFR **PASS_WITH_RISKS**, no required fix, nothing high or medium, **the gate SPLIT — NFR half untriggered on byte-identity but its load-bearing premise re-derived across all seven catalog rows, security half run because 749 new lines had been read for one question only**, one accepted risk `RISK-ABC023-01` (LOW, owner QE/E2E) with a named trigger; **UAT DEFERRED → `EPIC-006`, EXPLICITLY NOT PASSED** — zero production lines and a test file has no runtime importer, so no human can exercise this and a UAT pass would be a fabrication; **`ABC-024` cut** for the leftovers, where BA/PM measured **SEVEN** default-lane blind spots to QE's two and left it in `Backlog` with its **DoR NOT met**; **NOTHING DEPLOYED** — a human holds deploy; full record: `plans/tickets/history/ABC-023-board-history.md`)
- [ABC-022] generateMoves offers en-passant captures its own preconditions forbid  (merged: 2026-08-09 by fast-forward cb6515f → 52c6443, 18 commits, no merge commit; 559/559 on 18 files + skip 0 + deep perft 32/32 re-verified ON main; three gates PASS — QE PASS, Security/NFR PASS_WITH_RISKS with 13 owned risks and no required fix; UAT deferred → EPIC-006, explicitly NOT passed; full record: `plans/tickets/history/ABC-022-board-history.md`)
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
