---
id: 20261105T215450Z-security-nfr-decision-6c111277
kind: decision
by: security-nfr
at: 2026-11-05T21:54:50Z
verified_by: 
confidence: high on the marks, sealed before the read; medium on R-CEN-1's level, a judgement on one day's count
refs:
  - secnfr-ABC-307-a10
  - ABC-307
  - EPIC-011
  - NFR-008
  - R-N8H-1
  - R-N8H-2
  - R-N8H-3
  - R-CEN-1
  - T-QEHOP-GROWTH
  - ADR-0035
  - ADR-0046
  - QE-282-k
  - qe-ABC-307/20261105T214701Z-qe-e2e-observation-78d1f873
  - qe-ABC-307/20261105T214717Z-qe-e2e-decision-bec57958
  - qe-ABC-307/20261105T150324Z-qe-e2e-observation-d356030c
  - qe-ABC-307/20261105T150324Z-qe-e2e-observation-19f6c80a
  - qe-ABC-307/20261105T152140Z-qe-e2e-observation-46d3b23c
  - qe-ABC-307/20261105T152735Z-qe-e2e-observation-43927eb6
  - qe-ABC-307/20261105T195441Z-qe-e2e-observation-4a8dd8dc
  - qe-ABC-307/20261105T200227Z-qe-e2e-observation-d5cd6d19
  - secnfr-census-1105/20261105T115526Z-security-nfr-decision-b9038a14
  - secnfr-census-1105/20261105T122931Z-security-nfr-decision-19cea480
  - orch-2026-10-30a/20261105T123040Z-orchestrator-decision-f40ce634
  - orch-2026-10-30a/20261105T124120Z-orchestrator-decision-9e878ba6
  - orch-2026-10-30a/20261105T152827Z-orchestrator-decision-b17275dd
  - orch-2026-10-30a/20261105T200316Z-orchestrator-decision-f5dc2987
  - se-ABC-305/20261105T124015Z-software-engineer-observation-2adad06f
  - 572edf13
  - 797bb1a5
  - e01d39b1
  - bce24018
  - 014b8fa2
supersedes: 
seal: sha256:d02737dbdff4ed947cae8ebf5460dabdd9274a70bdd8a537aa84409cb6fa686a
---

# Security/NFR decision, secnfr-ABC-307-a10 (`ABC-307` A10): **PASS_WITH_RISKS.** `R-N8H-1` **goes to LOW, not closed.** `R-N8H-2` closed from `bce24018`. `T-QEHOP-GROWTH` retires, not MET. `R-CEN-1` **stays MEDIUM** with five voided reads today

Ruled on this task's observation, which rests on `qe-ABC-307` `…78d1f873` and `…bec57958`. Nothing was run. No §14 stamp exists on this install, so nothing here is a `finding`. No NFR level, bar, F or W moved.

## `R-N8H-1`: **MEDIUM to LOW**
- **The marks,** `…b9038a14`, unchanged from `…1184fec4`: m ≤ 9.0 s closed; 9.0 < m < 9.5 s LOW; 9.5 ≤ m ≤ 10 s and MET MEDIUM; NOT MET HIGH.
- **m = 9.085 s, MET, twin admissible.** It is below 9.5 s by 0.415 s and above 9.0 s by 0.085 s, so the mark reads LOW.
- **The interval agrees on both sides.** 9.02 to 9.17 s holds neither 9.5 s nor 9.0 s. So this is not `…0089724b`'s case, where the interval held the mark. H2's median, 9.165 s, sits in the same band.
- **Not closed.** 9.085 s is not ≤ 9.0 s, and nothing here rounds it down.
- **The substance agrees.** Headroom to 10 s is 0.915 s, and 0.83 s at the interval top, both clear of the 0.3–0.5 s spread. Three budgets of ≤ +0.10 s land 9.385 s, still under 9.5 s. That sum is arithmetic, not a reading.
- **What it rests on:** one window of 251 s on a host held by hand, on arms whose lane inputs equal `main`. QE says the same (`…bec57958`, gaps). It is not re-played.
- **Marks stand:** back to MEDIUM at a graded median ≥ 9.5 s, closed at ≤ 9.0 s, HIGH on a graded NOT MET, which is the owner's (`ADR-0035` D6). **Owner:** the Orchestrator. **Remedy owner:** Architect/Design.
- **This is a risk rating, not an NFR level.** `NFR-008` stays at 10 s. The brief's "no level moves" holds, and item 1 asks for this rating by the marks.
- **Routing, as a figure:** G-GO on `…b9038a14`'s rule (9.185 s < 9.6 s). The routing is the Orchestrator's.

## `R-N8H-2`: **CLOSED from `bce24018`**
The Architect reads it closed from the merge, since its cost ends with the default lane's whole-tree read (`ADR-0035` C6; page A10). I record that reading. The condition holds: the trio moved, and the observation reads it by QE's sentinel and by source. What still grows is one top-level listing per read. The whole-tree reads now run only under `ENGINE_DEEP=1`. Owner of the record: Architect/Design.

## `T-QEHOP-GROWTH`: **RETIRED at `bce24018`. Not MET, and nothing is read**
The trio moved, so C6's branch applies. The 650 ms bound stands, and the set's last reading stays 4 272 notes at `37a93b76`. The count was 5 467 at the merge, so neither 5,500 nor 5,900 fired. It re-arms if a default-lane row reads the record whole again, and Architect/Design then sets a mark by C2's rule.

## `R-CEN-1`: **MEDIUM, carried, owner the Orchestrator**
- **Today's count: five voided graded lane reads of seven,** four naming a foreign vitest and one on CPU from an unknown source. Table in the observation.
- **A read needed a host held by hand.** A9 stood only in a window the owner held, after the slot gate failed twice, 6 h 29 min after its first hold began.
- **Why not LOW.** `…f40ce634` 4 took LOW before most of today's count existed. Five of seven is not a nuisance: it was the critical path's main delay. The only control that worked was a person holding the host. No mechanical control covers a hold once it has started.
- **Why not HIGH.** No figure was wrongly read, no bar moved, and no void reached a verdict. The sealed rule caught all five, including read 2, which only the CPU rule could see.
- **So the level is `…b17275dd`'s MEDIUM, read again on the full day's count.** It drops when the host stops costing reads, not on one quiet window.
- **Still live:** `ABC-305`'s re-read, QE's seal on `ABC-303` and K4 (`…69ee96e7`) each need a window.
- **Acceptance.** `…f40ce634` 4 accepted LOW. `…b17275dd` moved the level and stated no acceptance at MEDIUM. So this is carried, not accepted, until the Orchestrator says so.
- **Its wording widens** from one other project to any foreign load: a second project was seen, and read 2's source is unknown.
- **No new control is required here.** Named windows are the Orchestrator's standing answer (`…9e878ba6`), and that brief should name the whole host (`…f5dc2987`).

## Other
- **INFO, owner Architect/Design: `T-QEHOP-GROWTH`'s re-arm has no standing check.** A5R is not in the tree, so nothing in `npm test` fails if a row reads the record whole again. Nothing is required: lane growth would show at the next graded read. For the Architect to know, since C6 leans on it.
- **`R-N8H-3`:** INFO, unchanged.
- **Security:** test-only, 0 production lines, no L1 requirement applies, nothing HIGH.

## Records
`plans/nfr-catalog.md`, after this note: one dated insertion in the `NFR-008` row, one dated paragraph under `T-QEHOP-GROWTH`, and the file's `_Updated` line. `R-CEN-1` has no catalog entry and gets none: it is recorded here.
