<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: arch-ABC-298-probe

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-11-08T20:25:00Z | decision | architect-design | high (pre-registration; nothing measured yet: the patch and a load-only smoke only) |  | # arch-ABC-298-probe PLAN: `ADR-0077` d9 step 3, the count probe, sealed before any measured run. G, H and C in `src/engine.ts` `negamax` on a scratch copy, `chooseMove` at `maxDepth` 9 with `now: () => 0` on kiwipete, position-6 and start, one run each. STOP if s = C ÷ G < 0.048 on at least two of the three boards, else GO |
