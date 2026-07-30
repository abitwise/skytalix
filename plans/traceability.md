# Traceability Matrix
_Updated: 2026-07-30_

<!--
  FORMAT — read before you append. (clear voice; this is a technical file, not a role prompt.)

  This is the single requirement -> ticket -> code -> test -> UAT -> release matrix for grugops.
  It ships EMPTY: header + separator only, zero data rows. Roles append rows as work is done.

  One row per ticket. The header columns below are fixed — do not rename or reorder them.

  Example row shape (this is a comment, NOT a live table row — the generic `ABC-` prefix
  illustrates the format only):

    | ABC-012 | FX conversion | EPIC-003 | FEAT-007 | NFR-002 | #41 / src/fx/* | fx.spec.ts, e2e/fx | UAT-12 pass | REL-0007 | Done |

  Stable ID scheme (set the ticket prefix in config `id_prefix`, default `ABC`):

    EPIC-xxx     epic
    FEAT-xxx     feature
    <prefix>-xxx ticket (project prefix + number; prefix from config `id_prefix`, default `ABC`)
    ADR-000x     architecture decision
    NFR-xxx      non-functional requirement
    RISK-xxx     risk
    REL-xxxx     release
    INC-xxxx     incident

  Append rules:
    - BA/PM creates the row when a ticket is born.
    - Each role appends its link as it completes work (Architect adds ADR/NFR; Engineer adds
      PR/files; QE adds tests; UAT adds result; Release adds REL id).
    - Definition of Done (enterprise) is not met until the row is complete through the relevant stage.
    - The validator can check for tickets missing rows or rows missing tests.
-->

| Ticket | Title | Epic | Feature | NFRs | Code (PR/files) | Tests | UAT | Release | Status |
|--------|-------|------|---------|------|-----------------|-------|-----|---------|--------|
| ABC-001 | Position state and FEN round-trip | EPIC-001 | — | NFR-001, ADR-0001 | src/position.ts, src/fen.ts (merged to main) | src/fen.test.ts — 27 pass, coverage 100% stmt / 98.73% branch | | | Done |
| ABC-002 | Pseudo-legal move generation for all piece types | EPIC-001 | — | NFR-001 | src/moves.ts, src/position.ts (merged to main) | src/moves.test.ts — 22 pass, suite 49 pass, src coverage 100% stmt / 99.15% branch | | | Done |
| ABC-003 | Apply and undo a move with full state restoration | EPIC-001 | — | NFR-001 | src/apply.ts (merged to main) | src/apply.test.ts — 15 pass (5 acceptance, 5 unit, 5 QE), suite 64 pass; src/apply.ts 100% stmt/branch/func/line | | | Done |
| ABC-004 | Special moves — castling, en passant, promotion | EPIC-001 | — | NFR-001 (sec/NFR PASS) | src/moves.ts, src/apply.ts (merged to main) | src/moves.test.ts + src/apply.test.ts — suite 84 pass, src 100% stmt/branch/func/line; EPIC-001 review gate PASS 2026-07-24 | UAT deferred — EPIC-006 | | Done |
| ABC-005 | Legal move filtering and attack detection | EPIC-001 | — | NFR-001 (sec/NFR PASS) | src/legal.ts (merged to main) | src/legal.test.ts — 12 tests, suite 96 pass, src 100% coverage; EPIC-001 review gate PASS 2026-07-24 | UAT deferred — EPIC-006 | | Done |
| ABC-006 | Perft verification harness | EPIC-001 | — | NFR-001 (~6.2M nps ≥ 1M MET; sec/NFR PASS_WITH_RISKS — nfr-catalog empty, owner Architect/Design), RISK-001 retired | src/perft.ts, src/perft-bench.ts, package.json (merged to main) | src/perft.test.ts — 24 fast + 8 deep (PERFT_DEEP), all 6 positions match published perft; suite 120 pass; EPIC-001 review gate deep perft 32/32 exact 2026-07-24 | UAT deferred — EPIC-006 | | Done |
| ABC-007 | Game-end detection | EPIC-001 | — | NFR-001 (sec/NFR PASS) | src/gameend.ts, src/zobrist.ts (merged to main) | src/gameend.test.ts + src/zobrist.test.ts — 23 tests, suite 143 pass, library 100% coverage; EPIC-001 review gate PASS 2026-07-24 (7/7 acceptance + precedence probes, skip-count 0) | UAT deferred — EPIC-006 | | Done |
| ABC-008 | SPIKE — Node search throughput | EPIC-004 | — | NFR-001, NFR-005 | spike/perft-bench.ts, package.json, tsconfig.json, biome.json | n/a — spike (see note) | | | Done |
| ABC-009 | legalMoves mutates the position it documents as unchanged | EPIC-001 | — | NFR-001 (no regression: perft ≥ 1M nps, deep perft 32/32) | not started — defect in merged src/legal.ts, src/moves.ts | not started — repro is the acceptance test | | | Backlog |
| ABC-010 | FEN semantic validation | EPIC-003 | — | NFR-003 (parse+validate < 1 ms/call) | not started — defect in merged src/fen.ts | not started — repro table is the acceptance test | | | Backlog |
| ADR-0002 | Game history ownership | EPIC-002, EPIC-004, EPIC-005, EPIC-006 | — | NFR-005 (per-node cost argued against a ~5,000 ns search node; catalog row NOT changed by this ADR), NFR-003 (replay 41 µs = 0.089% of the 50 ms keystroke budget), ADR-0003 (stated dependency, answered by measurement), ADR-0001 (mutable never-copied Position inherited) | no src/** change — decision only; memory-bank/50-decisions/ADR-0002-game-history-ownership.md | no test owed — no code change. The ADR states plainly that **no existing test would catch getting this wrong**: the history module's own tests and EPIC-006's "undo rewinds repetition history too" test are the only safety net, and both are owed at EPIC-002 decomposition | | | Accepted — ratified by Olger Oeselg 2026-07-30, **all four clauses as proposed** (two factual refreshes on ratification, no clause amended) |
| ADR-0003 | Legality strategy — make / test / unmake | EPIC-004 | — | NFR-005 (target re-derived to depth-in-budget; catalog row rewritten 2026-07-30, old ≥ 500,000 nodes/sec RETIRED; depth-7 level PROVISIONAL), NFR-004 (the requirement underneath), NFR-003 (legalMoves ~19,000x under the 100 ms `moves` budget), RISK-002 (GO WITH CONSTRAINT unchanged) | no src/** change — clause 1 is precisely that src/legal.ts is not changed; memory-bank/50-decisions/ADR-0003-legality-strategy.md, plans/nfr-catalog.md (NFR-005 row) | no test owed — suite 143/143 green and deep perft 32/32 exact, both unchanged. EPIC-004's timeboxed spike (RISK-002's mitigation) owns the depth-in-budget measurement on non-M3 hardware that lifts the PROVISIONAL marker | | | Accepted — ratified by Olger Oeselg 2026-07-30, clauses 1 + 3 as proposed, **clause 2 as amended** |
| pending | Terminal board and game loop | EPIC-002 | pending | NFR-002 | | | | | Backlog |
| pending | Move input and controls | EPIC-003 | pending | NFR-003 | | | | | Backlog |
| pending | Engine and AI opponent | EPIC-004 | pending | NFR-004, NFR-005 | | | | | Backlog |
| pending | Opening book | EPIC-005 | pending | NFR-006 | | | | | Backlog |
| pending | Game session and packaging | EPIC-006 | pending | NFR-007 | | | | | Backlog |

<!--
  EPIC-001 is decomposed: its seven ABC-xxx ticket rows are live. EPIC-002..EPIC-006 still
  read `pending` — Workflow 02 landed them as epics only, and `/grugops:plan` epic-to-tickets
  (Workflow 03) replaces each `pending` with real ticket ids as each epic is decomposed.

  The Feature cell reads `—` for the EPIC-001 tickets, not `pending`: that epic maps directly
  to tickets with no intermediate feature. A single FEAT-xxx wrapping all seven would be a
  one-use grouping that adds a hop to the trace and explains nothing (AGENTS.md coding rule 6).
  Later epics may genuinely need features; this one does not.

  Every NFR id above is a BA/PM trigger with a measurable target stated in its epic;
  Architect/Design seeds the matching rows in plans/nfr-catalog.md at design time.

  ABC-009 and ABC-010 are DEFECT rows, cut 2026-07-29 from the architecture audit
  (task `architecture-audit-2026-07-29`), and they trace backwards rather than forwards: the
  code they name is already merged and Done, and the Code/Tests cells read "not started"
  because the FIX has not been written. They are deliberately not left blank — a blank cell
  reads as "no evidence yet gathered", whereas these carry a known defective file that a
  later ticket-to-pr run must change. UAT and Release stay empty (Backlog, nothing gated).
  ABC-009 sits under EPIC-001 (the rules core whose documented contract it breaks); ABC-010
  under EPIC-003 (the input epic that makes it live).

  ADR-0002 and ADR-0003 are DECISION rows, appended 2026-07-30 by Architect/Design after a human
  ratified both (task `architecture-audit-2026-07-29`). They are rows rather than only NFR-column
  references — the way ADR-0001 appears on ABC-001 — because neither ADR hangs off a single ticket:
  ADR-0002 constrains four epics at once and ADR-0003 was ratified with no ticket owed by it at all,
  so a ticket row would have had nowhere to sit. Both trace FORWARD to the epics they constrain, not
  back to a ticket, and the Epic cell carries every epic bound by the decision.

  Code cells say "no src/** change" because that is the decision in both cases (ADR-0003's clause 1
  is literally "src/legal.ts is not changed"), and they name the decision record plus, for ADR-0003,
  the plans/nfr-catalog.md row its ratification rewrote. Tests cells name who owes the verification
  rather than inventing evidence: EPIC-002's decomposition for ADR-0002, EPIC-004's spike for
  ADR-0003's provisional depth-7 level. UAT and Release stay empty — a decision is not released, and
  nothing here is gated.
-->

