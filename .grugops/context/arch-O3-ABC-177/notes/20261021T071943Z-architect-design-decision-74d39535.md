---
id: 20261021T071943Z-architect-design-decision-74d39535
kind: decision
by: architect-design
at: 2026-10-21T07:19:43Z
verified_by: 
confidence: high (recommendation; BA/PM rules; the thermal question is the owner's)
refs:
  - ABC-177
  - NFR-008
  - R-174-1
  - ADR-0046
  - A10
  - A11
  - O3
  - 20261021T071304Z-qe-e2e-observation-bc49c2fe
  - 20261021T071305Z-qe-e2e-observation-84059cad
  - 20261021T071306Z-qe-e2e-decision-e808274d
  - 20261021T065500Z-orchestrator-decision-31ab7d2d
  - .grugops/queue/pending/arch-O3-ABC-177.md
  - 20261021T071940Z-architect-design-observation-e8b4d26d
  - 20261021T071942Z-architect-design-decision-ee7527cc
  - ABC-178
  - QE-177-a
  - QE-177-b
  - B8
  - 20261020T220000Z-ba-pm-decision-qe177-a-b-cut-abc178-c-accepted-7c41e9a2
  - ba-pm
  - plans/tickets/ABC-178-two-additive-uci-rows-restore-the-kills-abc-177-dropped-qe-177-a-b.md
supersedes: 
seal: sha256:93b4fd88de06285c06e3bff4dd301d8d2fefb3bd9d5ad46aa59fa5af6040129e
---

# O3 decision 2 for `ABC-178`'s gate: **recommend option 3, a clean owner-quiet re-read first.** Keep the 9.2 s threshold unchanged, and keep QE-177-b's drop as the fallback only

Records only. BA/PM rules; this is the Architect's recommendation. The gate is on `ABC-178`'s page: A10 ≤ 9.2 s lets
`ABC-178` be pulled; over 9.2 s it waits for tranche 2, and BA/PM re-rules R2 against tranche 2's measured headroom.

## Recommended: require a clean, owner-quiet re-read first
- It is the same re-read that decision 1 (`20261021T071942Z-architect-design-decision-ee7527cc`) asks for. One reading serves both decisions.
- It reads the 9.2 s threshold as written, on a stage that is not 9 % slow at the base.
- **H ≤ 9.2 s:** `ABC-178` meets its gate as written. DoR item 10 then waits only on `ABC-177`'s merge.
- **H > 9.2 s:** the page's own route applies. Tranche 2 opens, and BA/PM re-rules R2. Dropping R2 is a live option then.

## The other three options, and why not
- **Keep the gate as written, on this reading.** `ABC-178` then waits for tranche 2. Decision 1 recommends not cutting
  tranche 2, so R2 would wait with no path to a pull.
- **Restate the gate.** No new reading supports a new number. This stage's own twin Rs give 9.16–9.25 s, and 9.395 s
  misses both. Moving a gate to fit a reading is the habit the 9.2 s target exists to stop.
- **Drop QE-177-b now.** It gives up a kill our own lane change removed, to save about 0.08 s (estimate). The reading
  that would justify it is not shown to be real. The drop stays on record as the fallback: if B8 reads over 10 s, and if
  the clean re-read opens tranche 2.

## Not held by headroom
R1 costs about 4 ms (estimate). The page already lets R1 go alone if R2 waits. Splitting the ticket is BA/PM's call.
Headroom gives no reason to hold R1.

## Open question for the owner, one ask with the session pause
- B8 inherits A9's protocol and the registered thermal rule. `…31ab7d2d`'s thermal exception is ABC-177 only.
- Four of four strict-rule full stages VOIDed on thermal. t3-r1 VOIDed with 0 foreign vitest on every run.
- So the clean re-read and B8 may not read at all on this host under the strict rule.
- **Question:** for the clean re-read and for `ABC-178` B8, does "thermal kept and flagged" apply, or is a cooled-state
  protocol wanted?
- **Recommended answer:** extend "thermal kept and flagged" to those two readings only, owner-quiet. They stay comparable
  with t3-r1. A cooled-state protocol (`lane174.mjs` `GAP=90`) costs about 1 h per stage and is not comparable with
  `QE-174-b`'s GAP 0. If the owner wants it, Architect/Design re-registers it before any reading.
