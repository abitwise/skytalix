# Artifacts of arch-phase2-p3: ADR-0061 (PROPOSED, P3 futility), dated lines in ADR-0056 D2 and ADR-0059 Status, raw probe; inputs for BA/PM and the Orchestrator

## Artifacts
- `memory-bank/50-decisions/ADR-0061-futility-pruning-skips-late-quiet-moves-at-null-window-nodes-of-remaining-depth-1-to-3-with-margins-of-150-350-and-550-cp-behind-a-test-only-off-door-pair.md` (new, PROPOSED).
- `memory-bank/50-decisions/ADR-0056-…` D2: one dated block (2026-11-02, arch-phase2-p3) for rows P3-P6 and the suggested order.
- `memory-bank/50-decisions/ADR-0059-…` Status: one dated block, item 4's judgement measured (not supported); ruling unchanged.
- `.grugops/context/arch-phase2-p3/raw/probe/` - patch_p3.py, probe3.ts (audit mode), sweep/batch scripts, all outputs, README.

## For BA/PM (not this hop's fence)
- Cut the P3 page (id BA/PM's): "Futility pruning at remaining depth 1-3 (150/350/550 cp)", size S, base main (src f2388e40), no dependency on P1 or P2.
- A1 export lists +3 / +1 (d4); A2 predicate and source rows (d7); A3 drift all within 25 cp, mate floor d5 0, zugzwang 7/7, cut audit <= 0.5 % / 0 >= 200 cp (d8); A4 (a) <= 0.88x, (b) >= +0.20 ply, (c) G6 (d9); A5 G1 >= 54/58; A6 C2' GAIN + S' + Levels deep lane; intent line "GAIN".
- EPIC-011 rows: P4 depends on O1h (ABC-233) rather than P1; P5 a NEUTRAL candidate; P6 parked until E1/E2.

## For the Orchestrator
- To the owner: "accept / decline ADR-0061". Reading (b): the build may start from main now.
- Order: P3 independent of the P1 re-open (owner's 27 cp cap answer pending); whichever merges second re-reads door counts.
- Board: no move by this hop.

## Open questions
- Owner: accept ADR-0061?
- Orchestrator: P3 ahead of the re-opened P1 (recommended: yes, it does not wait on the cap answer).
- Later, measured: depth-4 row (750 cp) as a dated amendment after this ticket's read; the cause of ABC-264's -42 stays unmeasured (noise or a cost outside cut verdicts).

## Scope
Records only. Scratch copy deleted after sealing.

## Risks
None beyond the decision note's.
