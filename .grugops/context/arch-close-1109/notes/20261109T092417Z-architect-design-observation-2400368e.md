---
id: 20261109T092417Z-architect-design-observation-2400368e
kind: observation
by: architect-design
at: 2026-11-09T09:24:17Z
verified_by: 
confidence: high: read from each ADR's status and each ticket page at e069b49a
refs:
  - arch-close-1109
  - ADR-0057
  - ADR-0051
  - ADR-0050
  - ADR-0026
  - ADR-0074
  - ADR-0075
  - ADR-0076
  - ABC-272
  - ABC-285
  - ABC-287
  - ABC-290
  - ABC-293
  - ABC-294
  - ABC-296
  - ABC-297
  - ABC-308
  - arch-close-1109/20261109T092412Z-architect-design-decision-0851e222
supersedes: 
seal: sha256:31e7b7fba39fa69493e5668ed3b0fedc4df8c656f63bf147b4cab8ec4ce0e8b8
---

# arch-close-1109: the sweep for PROPOSED or accepted-not-in-force ADRs on the closed tickets

Every ADR in `memory-bank/50-decisions/` at `main` `e069b49a` was read for its § Status and searched for the 16 closed tickets (`ABC-237`, `257`, `258`, `266`, `272`, `284`, `285`, `287`, `290`, `293`, `294`, `296`, `297`, `298`, `299`, `308`).

**Given a line** (this task's decision note): `ADR-0077`, `ADR-0060`, `ADR-0062`, `ADR-0058`, `ADR-0025`'s two amendments, and `ADR-0056`.

**Looked at and not touched:**
- `ABC-272`, `ABC-285`, `ABC-287`, `ABC-290`, `ABC-293`, `ABC-294`, `ABC-296`, `ABC-297`, `ABC-308`: each page names its ADR as owed, and none was written. There is no ADR to date.
- `ABC-299`: its page names `ADR-0056` D5/D6 and no new ADR. The `ADR-0056` line covers it.
- `ADR-0057` (threads before devices): ACCEPTED, and in force in part (TH-1 through `ABC-265`). Its "threads parked" line names `ABC-266`, now closed; the `ADR-0062` line carries that. Not touched, because it is in force.
- `ADR-0051` (horizon check extension): accepted, not in force, but it belongs to `ABC-210`, closed earlier, and its status already says so. `ABC-296` only named it as a possible revival.
- `ADR-0050` (null move, in force): `ABC-285`'s amendment was owed and never written.
- `ADR-0026` (in force) still says "`ADR-0060` (PROPOSED) would amend this decision" (line 158 of its file). It is still true as history. Not touched, because it is in force and the `ADR-0060` line answers it.
- `ADR-0074`, `ADR-0075`, `ADR-0076`: accepted, not in force, on tickets closed before today (`ABC-289`, `ABC-291`, `ABC-292`). Each already carries its closing line.
- `ADR-0046`'s PROPOSED addenda and `ADR-0023`'s not-taken amendment: on no closed ticket.

**Left for the Orchestrator:** this task's brief stays in `.grugops/queue/pending/`. The brief asked for no queue move, Result or trace row, so none was made.
