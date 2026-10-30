# Security/NFR observation, secnfr-catalog-rebase: the hostname spelling, NFR-008's load gate on 24 CPUs, and the rows with no reading on the reference

Records only, at the catalog commit `b81bdd26`. No §14 gate ran on this branch, so none of these is a `finding`. The severities are this role's.

## `SEC-REBASE-a` (INFO). Owner: the Orchestrator, at the next owner touch
- **The two spellings.** The owner's label is `oeselg-devl`. `hostname` on this machine reads `oeselg-dev`, read at this hop.
- **It is the same machine.** Its CPU (AMD Ryzen AI 9 HX 370 w/ Radeon 890M) and kernel (Linux 7.0.0-42-generic) match every QE machine record since 2026-10-28.
- **What the catalog does.** It uses his label. Nothing waits on the spelling, and nothing is edited for it.

## `SEC-REBASE-b` (LOW, a protocol question; not an ASVS row). Owner: Architect/Design, for `ADR-0035`'s protocol, routed by the Orchestrator
- **The question.** `NFR-008`'s row says its wall clause is a function of core count. The reference went from 8 to 24 logical CPUs, and `ADR-0035`'s load gate (load1 ≤ 8) was set on the 8-CPU machine. Whether load1 ≤ 8 still means what it meant there is unruled.
- **What stays.** The 10 s level is the owner's, and it did not move.
- **The readings already taken.** Those since 2026-10-28 (`ABC-228` `G8`, `ABC-220` `A12` and `G8`) were taken under the current protocol, and this hop does not re-grade them.

## `SEC-REBASE-c` (INFO). Owner: Security/NFR, at each row's next gate. The Orchestrator may schedule a sweep
- **The rows.** Seven rows have no reading on the reference: `NFR-001`, `NFR-002`, `NFR-003`, `NFR-007`, `NFR-010` (its figures), `NFR-011` and `NFR-012`.
- **Their status.** On the reference they are `UNKNOWN - verify`, and their M3 verdicts stand as history.
- **What is owed.** This re-base owes no reading, and nothing fails because of it.
- **`NFR-011`'s re-read** takes load through `os.loadavg()` (`SEC-220-c`, placed in the cell).

## Not edited, for the Orchestrator to route
- These lines name the M3 or "the reference machine" as their own record:
  - `ADR-0035` ("the reference machine is fixed");
  - `ADR-0008` ("named reference machine");
  - the ticket pages `ABC-083`, `ABC-094`, `ABC-095`, `ABC-118` and `ABC-144`;
  - `plans/traceability.md` and `plans/board.md`.
- Each is history of its date, and none binds the reference forward. `AGENTS.md` names no reference machine.

## Read, not re-derived
- **Host facts** come from `qe-ABC-220` `raw/alone/A14b.txt` and `qe-ABC-228-ii` `raw/a6/r/machine.txt`. Read at this hop: `hostname`, `nproc` and the processor count (24), `uname`, and the OS release file.
- **Figures** are copied from the catalog's own records and those QE notes. No value was re-measured.
