---
id: 20260729T140735Z-architect-design-decision-968fec0b
kind: decision
by: architect-design
at: 2026-07-29T14:07:35Z
verified_by: 
confidence: high
refs:
  - NFR-001
  - NFR-002
  - NFR-003
  - NFR-004
  - NFR-005
  - NFR-006
  - NFR-007
  - RISK-002
  - EPIC-001
  - EPIC-004
  - plans/nfr-catalog.md
supersedes: 
---

Seeded `plans/nfr-catalog.md` with all seven NFR rows. This closes the accepted risk the
Security/NFR gate raised on the EPIC-001 review (catalog was still the empty shipped
template while NFR-001 was cited on every live traceability row).

**Seeded all seven, not just the flagged NFR-001.** Each of the six epics states its own
`NFR triggers` block and each ends with an explicit instruction — "Architect seeds the row in
`plans/nfr-catalog.md`". So all seven were already specified and assigned; seeding one and
leaving six known-but-unrecorded would rebuild the same gap for the next epic. No number was
invented: every target is transcribed from its epic.

**Honest verification status over invented confidence.** Five of seven rows read
`UNKNOWN - verify` because their epics are not built — there is nothing to measure yet, and a
tick with no evidence is the failure mode this catalog exists to prevent. Only NFR-001 (~6.2M
nps generation, ABC-006) and NFR-005 (2.64M nps search-shaped, ABC-008) carry real
measurements.

**Recorded the perft inflation trap on the row itself, not just in the spike note.** Classic
perft's leaf nodes return without generating or evaluating (~96% of counted nodes), so the
naive rate reads ~43M nodes/sec — ~16x inflated. NFR-001's ~6.2M is a valid *generation*
measurement and is NOT a promise about search throughput. Keeping that distinction on the
catalog row is the point: the catalog is what a future reader checks, and an unqualified "MET"
there would re-import the exact over-confidence ABC-008 caught.

**NFR-005 recorded as a constraint, not a clean pass.** The ~5x headroom is Apple-M3 numbers.
Compounding ~3x for real legality filtering and ~3x for slower hardware lands a worst-case
machine near ~300k nodes/sec — below the 500k target. Design consequence, inherited by
EPIC-004 as non-negotiable: the per-move budget must be **time-based (iterative deepening
against a wall clock), not depth-based**, because a fixed depth blows NFR-004's 3s ceiling on
precisely the machines least able to absorb it.

**Scope held — no ADR written.** These are transcribed budgets with their evidence, not a new
structural choice; an ADR here would be ceremony over a table. The one real design constraint
(time-based budget) is recorded on the NFR-005 row and belongs in EPIC-004's design when that
epic is actually designed. No production code touched.
