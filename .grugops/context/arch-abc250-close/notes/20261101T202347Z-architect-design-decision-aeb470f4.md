---
id: 20261101T202347Z-architect-design-decision-aeb470f4
kind: decision
by: architect-design
at: 2026-11-01T20:23:47Z
verified_by: 
confidence: high on the rulings as recorded and their forward-only scope; the 'heat does not void a search read' basis rests on two reads (7 boards)
refs:
  - arch-abc250-close
  - ADR-0055
  - ADR-0055-D3-V2
  - ABC-250
  - ABC-251
  - ABC-252
  - ABC-253
  - ABC-254
  - EPIC-010
  - QE-250-a
  - qe-ABC-250
  - grugops/arch-abc250-close
  - 032def2a
  - 767a2e3e
  - ADR-0056
  - EPIC-011
  - QE-250-b
  - QE-255-d
  - NFR-001
  - qe-ABC-255
  - qe-ABC-254-a4v2
  - grugops/ABC-250
  - orch-2026-10-30a/20261101T201645Z-orchestrator-decision-d2571be5
  - orch-2026-10-30a/20261101T201630Z-orchestrator-decision-1f5e3b27
  - qe-ABC-250/20261101T201444Z-qe-e2e-decision-4fe9c469
  - qe-ABC-250/20261101T201444Z-qe-e2e-observation-677d4d41
  - qe-ABC-250/20261101T201444Z-qe-e2e-observation-c320bc15
  - qe-ABC-250/20261101T201444Z-qe-e2e-observation-f2befa65
  - qe-ABC-254-a4v2/20261101T190238Z-qe-e2e-observation-7aaf058c
  - qe-ABC-255/20261101T184957Z-qe-e2e-observation-f41a5b6e
supersedes: 
seal: sha256:2169533af39abb4bb3333e3b64832eb728a52ff283676bae73b69818aae12076
---

# arch-abc250-close rulings: ADR-0055 gets a dated status line (ABC-250 closed not merged by routing, A4 not graded; rest of O1-b dropped; O1-d delivered 1.11–1.12×; remaining O1 re-estimated) and a second addendum ruling QE-250-a "not needed now" (D3-V2 unchanged; ABC-251/253 are search reads); ADR-0056 gets one dated line (S′ keeps E 1 650, owner-confirmed; raise under the re-pin rule)

Architect/Design, task `arch-abc250-close`. Records only, branch `grugops/arch-abc250-close` from `main` `767a2e3e`, ADR commit `032def2a`. Nothing run, built or timed.

## Scope
ADR-0055 and ADR-0056 status after `qe-ABC-250` (verdict `…4fe9c469`, A4 `…677d4d41`, host `…c320bc15`, gaps `…f2befa65`) and the Orchestrator's decisions `…d2571be5` (routing) and `…1f5e3b27` (owner E1650). Inputs read through the sanctioned reader and `git`; ticket pages ABC-251, ABC-253, ABC-254; `qe-ABC-254-a4v2` `…7aaf058c`; `se-ABC-250` `…ff7ffb6e`; `qe-ABC-255` `…f41a5b6e`.

## Decisions
1. **ADR-0055, dated status line.** O1-b part 1 (`ABC-250`) closed not merged by routing; its A4 **not graded** (kiwipete and start VOID, position-6 valid 1.111). Wording rule carried: "not graded, closed by routing", never "missed the bar". Branch `grugops/ABC-250` kept; revival needs a perft method ruled first. Rest of O1-b dropped (`ABC-252`; `ABC-251`'s full form); `ABC-251` narrows to O1-c alone. Delivered: O1-d (`ABC-254`) 1.11–1.12× at 4 s, below D1's 1.15–1.40× band (why: `UNKNOWN - verify`). Remaining: O1-c (`ABC-251` narrowed, ≥ 1.03×) and O1-a (`ABC-253`, ≥ 1.02×). Re-estimate in the companion observation.
2. **QE-250-a: not needed now; D3-V2 stands unchanged** (ADR-0055 § Addendum — 2026-11-01, second).
   - No open ticket owes a graded perft-scale read (`ABC-250` closed, `ABC-252` dropped). A rule for an unowed read is gold plate, chosen blind to a mechanism still `UNKNOWN - verify`.
   - Evidence: search reads at 4 000 ms graded valid on 7 of 7 boards across `qe-ABC-254-a4v2` and `qe-ABC-250` A5 (spread ≤ 3.9 %), in the same thermal band (Tctl medians 75–78 °C) where the perft read voided. Heat at that level does not void a search read.
   - **`ABC-251` A3 (narrowed) and `ABC-253` A5 are search reads** (`chooseMove` at 4 000 ms, fresh process per run) and use D3-V2 as written: no cool-down gate, no pinning. The agreement guard (item 4) reads each ticket's own bars: `ABC-251` 1.03 / 1.00, `ABC-253` 1.02 / 1.00. No perft run is graded; perft rates INFO (`NFR-001`).
   - If a perft-scale read is ever graded (revival of `grugops/ABC-250`, or a perft-throughput bar): the Architect rules the method before QE's PREREG — first an untimed base-against-base diagnosis (per-run nps with end CPU, its frequency, Tctl); then the least intrusive fix that answers it (cool-down gate, e.g. Tctl ≤ 65 °C, if heat; `taskset` CPUs 0–3 if placement, cost disclosed); more REPS alone is not a fix. No term loosens a bar or the 5 % spread. Forward-only; `qe-ABC-250` stays UNRESOLVED as graded, never pooled.
3. **ADR-0056, one dated line.** S′ keeps E = 1 650 (owner, verbatim in `…1f5e3b27`). Raising follows S′'s re-pin rule as written (pooled > 85 % over ≥ 30 games → one band-rule step up, E ≤ 2 600), no further owner ask. The downward side is untouched by his word and stays as written. First S′ on `main`: 9/10 at E 1 650 (`qe-ABC-255` `…f41a5b6e`, QE-255-d); 10 games, no re-pin yet. The line points V1/V2's O1 figures at ADR-0055's re-read.

## Owner
Not owed: no bar, NFR bound, requirement or scope moves; no ADR reversed. The ABC-250 routing was the Orchestrator's under delegation (`…d2571be5`); this hop records it.

## Risks
- QE-250-b (foreign vitest in the ALONE window) is unaddressed here; it can VOID-LOAD the ABC-251/253 reads. The start precondition and admission absorb it, as in `qe-ABC-250` A5.
- The ruling's "heat does not void a search read" rests on two reads (7 boards), not a study.
- Concurrent `bapm-abc250-close` edits the ABC-251/252 pages; the ADR wording here must match its "closed by routing" wording (both cite `…d2571be5`).
