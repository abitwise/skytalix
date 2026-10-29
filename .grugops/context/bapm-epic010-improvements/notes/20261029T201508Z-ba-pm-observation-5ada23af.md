---
id: 20261029T201508Z-ba-pm-observation-5ada23af
kind: observation
by: ba-pm
at: 2026-10-29T20:15:08Z
verified_by: 
confidence: high on the options and costs from the records; D at width 2 UNKNOWN - verify
refs:
  - bapm-epic010-improvements
  - EPIC-010
  - EPIC-004
  - ADR-0020
  - ADR-0018
  - ADR-0049
  - orch-2026-10-29g/20261029T210500Z-orchestrator-decision-183a5bbc
  - arch-epic008-rd/20261029T195200Z-architect-design-decision-0c5d62f4
  - qe-epic008-q4c/20261029T192754Z-qe-e2e-observation-311eb14b
  - qe-epic008-close
  - ABC-225
  - ABC-226
supersedes: 
seal: sha256:56a1d95206cbc94f66bfade5598c05d55193b801c95184a92c03c87881da3846
---

# EPIC-010 owner questions Q1-Q5, with options and defaults (the Orchestrator also asks them in session)

- **Q1. Syzygy (§ B item 10) against `EPIC-004`'s permanent non-goal.** (a) keep out; (b) re-open as a later epic (a runtime dependency or own prober, tablebase files a git clone cannot carry, a distribution ruling under `ADR-0018`/`ADR-0049`; sizes `UNKNOWN - verify`). **Default: (a).** Nothing is cut either way now.
- **Q2. `EPIC-004`'s "Strength above ~1700" line.** (a) cite the owner's `EPIC-008` word (`…7feb0553`, `…e44d2903`) in `EPIC-010`, line unchanged; (b) BA/PM writes a dated amendment on `EPIC-004`. **Default: (a).** BA/PM's reading: (b) is cleaner. Q2 blocks no ticket.
- **Q3. Re-open `ADR-0020` d2 (ep repetition key)?** Today a draw is deferred one occurrence, never falsely declared (SA 3d). (a) keep; (b) re-open: Architect amends `ADR-0020` (its trigger (a): normalise `epSquare` in `src/apply.ts`), BA/PM cuts one S ticket from the pool. **Default: (a).** `ABC-226` `A6` reports how often it would matter.
- **Q4. The pre-merge outside-opponent rule** for value-changing tickets. (a) D only (`EPIC-008` S1), R at the close; (b) S1 on D, then an interleaved R pair before merge that must not be LOSS; (c) the R pair replaces D (merge if X > 0 and X + Y >= 0); (d) hold: no value-changing merge until he sets one. Costs on this host: R 200 games 4.3-4.5 h at width 2; R pair ~9 h + 1 h QE; D 400 games ~17 h at width 1 (23.3 games/h), width 2 ~9 h `UNKNOWN - verify`; R heat Tctl median 82-83 C, max 84-87 C. **Default: (d).** BA/PM's reading: (b); milestone 1 then costs ~60-80 h ALONE.
- **Q5. Accept `EPIC-010` and M1-M5** (M2: an interleaved R pair at close not LOSS; no Elo target). (a) as written; (b) other measures or a target. **Default: (a).**

Not questions for him: ADR forms, door shapes, `Q-SET`'s extra rows, game counts inside a rule he sets (delivery, `…5aaf7cec` item 1).
