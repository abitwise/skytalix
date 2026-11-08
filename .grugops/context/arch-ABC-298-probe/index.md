<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: arch-ABC-298-probe

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-11-08T20:25:00Z | decision | architect-design | high (pre-registration; nothing measured yet: the patch and a load-only smoke only) |  | # arch-ABC-298-probe PLAN: `ADR-0077` d9 step 3, the count probe, sealed before any measured run. G, H and C in `src/engine.ts` `negamax` on a scratch copy, `chooseMove` at `maxDepth` 9 with `now: () => 0` on kiwipete, position-6 and start, one run each. STOP if s = C ÷ G < 0.048 on at least two of the three boards, else GO |
| 2026-11-08T20:26:37Z | decision | architect-design | high on the counts and the identity (exact, one run, checked against main's unpatched copy); the rule is d9's as sealed; d9's 0.6 bound is judgement and enters nothing |  | # arch-ABC-298-probe RESULT: GO by the sealed rule. s = C ÷ G is 0.0754 on kiwipete, 0.0579 on position-6 and 0.0320 on start, below 0.048 on one board of three. Identity held on every board. One run, no re-run, no defect |
