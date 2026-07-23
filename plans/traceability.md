# Traceability Matrix
_Updated: 2026-07-23_

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
| ABC-003 | Apply and undo a move with full state restoration | EPIC-001 | — | NFR-001 | src/apply.ts (branch grugops/ticket-to-pr-ABC-003) | src/apply.test.ts — 15 pass (5 acceptance, 5 unit, 5 QE), suite 64 pass; src/apply.ts 100% stmt/branch/func/line | | | In Review |
| ABC-004 | Special moves — castling, en passant, promotion | EPIC-001 | — | NFR-001 | | | | | Backlog |
| ABC-005 | Legal move filtering and attack detection | EPIC-001 | — | NFR-001 | | | | | Backlog |
| ABC-006 | Perft verification harness | EPIC-001 | — | NFR-001 | | | | | Backlog |
| ABC-007 | Game-end detection | EPIC-001 | — | NFR-001 | | | | | Backlog |
| ABC-008 | SPIKE — Node search throughput | EPIC-004 | — | NFR-001, NFR-005 | spike/perft-bench.ts, package.json, tsconfig.json, biome.json | n/a — spike (see note) | | | Done |
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
-->

