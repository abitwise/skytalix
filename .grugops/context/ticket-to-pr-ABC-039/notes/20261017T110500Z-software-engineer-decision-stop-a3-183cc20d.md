---
id: 20261017T110500Z-software-engineer-decision-stop-a3-183cc20d
kind: decision
by: software-engineer
at: 2026-10-17T11:05:00Z
verified_by:
confidence: high
refs:
  - ticket-to-pr-ABC-039
  - ABC-039
  - 20261017T110000Z-software-engineer-observation-chronology-cdf60868
supersedes:
---

# Stopped at A3. The register was not written.

A3 (as amended 2026-10-12) needs a chronology derived from source, every row with file:line,
whose row count **equals** the `plans/metrics.md` Rework-rate total. Re-measured it says **13**. The
source has **14** (through 08-12) or **15** (everything at the metrics commit). Matching 13 means
dropping two real moves without a reason; fixing metrics.md is fenced off by A5. The brief says
stop if a criterion cannot be met as written, so I stopped.

Choices for BA/PM / Orchestrator (not mine to make):
(a) Amend A3 so the chronology is the source count (14 or 15, with the window fixed), and the
register names metrics.md's 13 as a third undercount defect (ABC-017 and ABC-019 each one short).
(b) Cut a ticket to repair `plans/metrics.md:28` first, then run ABC-039 against the new total.
Under either one the corrected ordinals (2, 3, 4, 5) stay the same.
