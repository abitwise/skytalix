# arch-phase2-p1 probe (scratch, reproducible)

- Base: `git archive 4d1c0616 src` (grugops/ABC-264-fix) into a scratch directory outside the repository.
- `python3 patch.py <scratch>` adds the switchable reduction predicate (`PROBE.lmr` "flat" = today's rule, "log" =
  the table), plus ranking-only knobs (`fut` = P3 futility, `nmpDiv` = P5 depth-grown R). The `simple` flag (flat
  2/1 rule) was added by hand to `lmrProbe` for sweep7: `if ((PROBE as any).simple) r = pvNode ? 1 : 2;` after the
  PV subtraction.
- Copy `probe.ts` into the scratch root; run `node probe.ts <mode> '<head json>'` (modes: nodes, drift, mate, fire,
  reach, zug, zugd, g1). Door = the flat rule. Every run was wrapped in `flock` on the host lock.
- The chosen rule (ADR-0060) is `{"lmr":"log","base":1.0,"div":2.0,"killerLess":0,"maxR":2}` (sweep6).
- Outputs: sweep0 (door instrument check), sweep1 (depth-8 nodes, all variants incl. P3/P5), sweep2 (d5 drift),
  sweep3 (mate, reach, fire), sweep4 (G1, neighbours), sweep5 (uncapped rule), zug/zug2/zug3 (zugzwang rows, cap),
  sweep6 (the chosen rule), sweep7 (flat 2/1 rival).
