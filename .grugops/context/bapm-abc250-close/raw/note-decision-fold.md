# ABC-251: the Architect's design input (`arch-abc250-close` `…a07418ac`, merged `eed51a35` during this hop) is folded; profile first, and stop before any ALONE read if nothing is left to cut (BA/PM's stop also covers "only the Budget half left"); DoR 10/10, Ready recommended

BA/PM, task `bapm-abc250-close`, records only. This supersedes this hop's earlier decision on one point only: `ABC-251`'s
DoR, which was 9/10 with row 10 waiting on `arch-abc250-close`. Read on `main` (`eed51a35`):
- `…a07418ac` (design input);
- `…aeb470f4` (rulings: QE-250-a not needed now; D3-V2 as written for search reads);
- `…f5f41888` (re-estimate: O1-c 1.00–1.04×, what remains of O1 ≈ 3–6 Elo informal).

The page's rule says a design input that changes scope is folded by BA/PM first. This one changes scope, so it is
folded on the page (commit `4e66c113`):
- **2a, profile first.** The Software Engineer takes one informal CPU profile under the lock (`chooseMove` at 4 s,
  kiwipete and position-6, base `main`). If the helper frames do not show, the helpers are not inlined.
- **BA/PM's stop rule (delivery).** The build stops before any ALONE read if neither half shows a measurable frame. It
  also stops if only the `Budget` half is left, because the Architect expects it under 1 % and the bar is 1.03×. The
  Orchestrator then closes the ticket as dropped, "nothing to cut". That is not graded, so no `failed-attempt` note.
- **2b.** Inline only at the profiled hot sites. The exports stay. `evaluate.ts` is touched only if profiled, and that
  owes G2/G3.
- **2c.** `Budget`'s six heuristic fields are written out in `Heuristics`' order in place of `...heuristics`.
- **2d.** The fence: no other shape change, no packed moves, no `countNode` restructuring, no key work.
- **A3:** D3-V2 as written, with agreement-guard bars 1.03 / 1.00. No perft run is graded.
- **Order against `ABC-253`:** `ABC-251` first stands, and the Orchestrator may swap them.

**DoR 10/10, `Backlog → Ready` recommended.** `EPIC-010` row 26, the milestone-1b block and the `ABC-251` trace row
were updated to match.
