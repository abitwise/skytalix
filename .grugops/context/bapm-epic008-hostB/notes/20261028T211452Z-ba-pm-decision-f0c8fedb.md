---
id: 20261028T211452Z-ba-pm-decision-f0c8fedb
kind: decision
by: ba-pm
at: 2026-10-28T21:14:52Z
verified_by: 
confidence: high on the records placed; the off-band reading of the page is BA/PM's; Q3 (off-band input, degenerate reading) is UNKNOWN - verify, the owner's
refs:
  - EPIC-008
  - ABC-204
  - M1
  - M3
  - M4
  - Q1
  - Q3
  - A1
  - A4
  - A6
  - G6
  - 3497aad2
  - b5c67ab7
  - 54bcf923
  - orch-2026-10-28a/20261028T210902Z-orchestrator-decision-5dbd717b
  - orch-2026-10-27o/20261027T210610Z-orchestrator-decision-e018297c
  - bapm-s1-ABC-210/20261027T194008Z-ba-pm-decision-ff16a93d
  - owner-word-2026-10-23/…e44d2903
  - owner-word-2026-10-24/…4c3f7639
  - se-tools-rating-host
  - qe-epic008-close
  - plans/epics/EPIC-008-skytalix-plays-measurably-stronger-at-the-same-levels-and-time-budgets.md
  - grugops/bapm-epic008-hostB
  - ADR-0049
supersedes: 
seal: sha256:e97eddc39101472cbf35b56f7fa94f5b9f00d60bc38677119de4563c7e865269
---

# BA/PM: EPIC-008 M1 moves to option B on the new host; close-path step 3 re-worded (3′); E band read; Q3 routed to the owner

Task `bapm-epic008-hostB`, records only, from `main` `54bcf923`. Inputs: the owner's word `…5dbd717b`, the
host-move impact `…e018297c`, and the close path `…ff16a93d`. The EPIC-008 page is authoritative; this note points at it.

## Placed on EPIC-008 (dated 2026-10-28; old lines kept, superseded by date)
- **M1 row:** a dated pointer. Both R readings are on the new host, and the start is `3497aad2`.
- **§ Success measures, dated M1 block:** option B. R(baseline) at `3497aad2` and R(close) at one `main` sha whose
  `src/`/`data/` equal `b5c67ab7`. Both use ABC-204 A4's protocol, E = 1 910 frozen, 200 games, ALONE, one run.
  **M1 = R(close) − R(baseline), half-width √(Y₁² + Y₂²).** The +100 and "above 0" (Q1) are unchanged. 2 061.3 ± 50.3
  stands as the previous host's record and is no longer the comparison. Earlier "baseline stands" lines read "stood,
  on the previous host". The 2026-10-27 "+71" forecast is superseded.
- **The E band:** there is no E step. Each score is reported against 25–75 %. BA/PM's reading of the page: off-band is
  not UNRESOLVED (no state names the band), and it meets M1's "E, openings and pins unchanged". So M1 is graded on X
  and Y by its two clauses, unchanged. Its cost is a wider Y (ABC-204: 70.5 % read ± 50.3, 82.0 % read ± 61.8; at
  Y₁ = Y₂ = 61.8 the half-width is about 87.4, against 71.1; arithmetic). +100 does not move.
- **Close path:** old step 3 is marked superseded, and **3′** is added. PREREG first, then `3497aad2`, then the
  close sha, one run each and final. E is frozen, with no E step. ALONE, about 9 h at the previous host's A6 rate,
  with this host's rate UNKNOWN - verify. M3 runs after both readings, and G6 "≥ base" reads against `3497aad2` on
  this host. QE reports the M1 inputs and does not grade. **Step 4's M1 bullet now grades by the new rule.** The old
  bullet is kept, marked superseded.
- **§ Dependencies:** a dated line says the host moved, the tools come from the environment, and the tools are
  re-pinned in **ABC-204 § Dependencies 2026-10-28 (`se-tools-rating-host`)**, the pins A1 and both M1 readings
  check. No hashes are copied. The old paths and hashes are the previous host's history.
- **Q3 (new owner question):** is an off-band reading still an M1 input, and how is a degenerate reading (score
  near 0 %/100 %, X or Y not finite) recorded? The page is silent on both: `UNKNOWN - verify`. No default is set.
  Nothing waits on Q3. It is asked at step 4 only if a reading lands off the band.

## Not this role's / not edited
- Board and trace: the Orchestrator's (card lines and the trace row are in the brief's Result).
- ABC-204's page and `tools/`: `se-tools-rating-host`'s.
- LOW, not edited, outside the brief: EPIC-008 § Out of scope says "The harness runs only on the owner's Mac", and
  Q2 says "your Mac". Both are stale after the move. § Host says "Every reading runs on AC power", while the
  `qe-epic008-close` brief says "log the power source; never stop a reading because of it". The Orchestrator should
  reconcile the two (the page rule was not changed here).
