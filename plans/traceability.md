# Traceability Matrix
_Updated: 2026-07-22_

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
| pending | Chess rules core | EPIC-001 | pending | NFR-001 | | | | | Backlog |
| pending | Terminal board and game loop | EPIC-002 | pending | NFR-002 | | | | | Backlog |
| pending | Move input and controls | EPIC-003 | pending | NFR-003 | | | | | Backlog |
| pending | Engine and AI opponent | EPIC-004 | pending | NFR-004, NFR-005 | | | | | Backlog |
| pending | Opening book | EPIC-005 | pending | NFR-006 | | | | | Backlog |
| pending | Game session and packaging | EPIC-006 | pending | NFR-007 | | | | | Backlog |

<!--
  Ticket and Feature cells read `pending` because no tickets exist yet: Workflow 02 lands
  epics in Backlog only. `/grugops:plan` epic-to-tickets (Workflow 03) cuts the tickets and
  replaces each `pending` with the real ABC-xxx / FEAT-xxx id. Every NFR id above is a BA/PM
  trigger with a measurable target stated in its epic; Architect/Design seeds the matching
  rows in plans/nfr-catalog.md at design time.
-->

