---
id: 20261011T083621Z-architect-design-decision-n8lane-5pct-is-of-the-13s-level-650ms-is-fixed-5ad29a76
kind: decision
by: architect-design
at: 2026-10-11T08:36:21Z
verified_by:
confidence: high
refs:
  - N8-LANE
  - NFR-008
  - ADR-0035
  - ADR-0014
  - ADR-0019
  - 20261010T201446Z-orchestrator-observation-handoff-5-e41d7a20
  - 20261010T183612Z-security-nfr-decision-catalog-r1-provisional-retired-node26-risk003-measured-ar133-recorded-d1e00b44
  - 20261010T190811Z-ba-pm-decision-backlog-rescored-r1-two-drop-four-ready-one-held-abc142-cut-d8990fbb
  - 20261010T192920Z-orchestrator-decision-owner-word-six-answers-b7c41e09
supersedes:
---

# Item 4: `N8-LANE`'s 5 % is read at the 13 s CPU level. Under R-1, 650 ms is a fixed number, and no load level applies

This note is hand-authored and unsealed. Nothing was run or timed.

## The question
`N8-LANE` reads *"at most 5 % of `NFR-008`'s TOTAL — ≤ 650 ms CPU while the CPU clause is 13 s"*. Under R-1
the CPU total is reported and not levelled, so there is no level for 650 ms to be 5 % of (`…d1e00b44`,
`…d8990fbb` item 3).

The subtask asks "which load level". This note answers two readings of that, because both are live.

## Ruling
- **The 5 % is read at the 13 s CPU level** the owner ratified on 2026-08-11. `ADR-0014` decision 4 fixed
  650 ms there.
  - **Not at 15 s.** The catalog's 2026-09-19 section refused to run 750 ms into the bar.
  - **Not at W.** W is wall time, and the row measured a per-ticket wall delta as unmeasurable by
    construction (−15 to +3 ms per added file).
- **Under R-1 the bar is the number.** It is ≤ 650 ms CPU on the narrow set, a rate limit (`ADR-0014`
  decision 4). The "5 %" is provenance and no longer arithmetic over a live level. This is what `ADR-0035`'s
  Scope fence and Consequences imply, now written down.
- **The load level: none.** A reading is taken at whatever load1 the harness logs (`ADR-0035` decision 2:
  logged, never gated). Load enters only through R. A reading resolves 650 ms only when the twin's R is
  ≤ 650 ms (decision 1).
  - On today's per-set floors, `src/cli.test.ts` (`F` 1.097 s) cannot resolve it. Its pin is the count.
- **Re-derivation trigger.** If a CPU total is levelled again, re-derive `N8-LANE` at that hop by the row's
  own rule (*"Where 5 % comes from"*). The owner's lane-CPU goal (`…b7c41e09` item 1, handoff #5 item 3) may
  end in such a level. Until then 650 ms stands.

## Recorded
`ADR-0035` `§ Pointers 2026-10-11` P3.

## Follow-ups
- **Security/NFR, at the next catalog hop.** Replace *"≤ 650 ms CPU while the CPU clause is 13 s"* with:
  *"≤ 650 ms CPU, fixed at 5 % of the 13 s level ratified 2026-08-11. Under R-1 no CPU level exists, and
  650 ms stands as a number (`ADR-0035` § Pointers 2026-10-11 P3)"*. Then retire the paragraph *"Recorded,
  not ruled: what `N8-LANE`'s 5 % means under R-1"*.
- **BA/PM, on the lane-CPU P1 ticket now being cut:** if that ticket proposes a CPU level, name the
  `N8-LANE` re-derivation as one of its outputs.
