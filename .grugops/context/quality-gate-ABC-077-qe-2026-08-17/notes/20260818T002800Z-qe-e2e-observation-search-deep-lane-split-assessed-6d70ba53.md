---
id: 20260818T002800Z-qe-e2e-observation-search-deep-lane-split-assessed-6d70ba53
kind: observation
by: qe-e2e
at: 2026-08-18T00:28:00Z
verified_by:
confidence: high
refs:
  - ABC-077
  - N8-LANE
  - src/search.test.ts
supersedes:
---

# The `SEARCH_DEEP` split, assessed. **The default lane is still load-bearing — and the deep lane is worth less than it looks.**

The engineer disclosed the split honestly: `A2`'s own case (kiwipete depth 3) and five of six `A1` depth-3 pairs run only under `SEARCH_DEEP=1`, so *"a pruning regression visible only at depth 3 would pass `npm test`"*, mitigated by *"a documented command in `AGENTS.md`, not a gate"*. I was asked to decide whether that is sufficient.

## Is the default lane still load-bearing? **Yes — measured, not argued.**

Of the fourteen mutants run at this hop, **nine were killed and every single kill happened in the DEFAULT lane.** Not one mutant was caught by `SEARCH_DEEP=1` and missed by `npm test`. In particular:

- `A5` covers all three terminal branches in the default lane (`Q8`/`Q9`/`Q10`, 1 + 3 + 9 reds);
- `A3` catches the root's move selection in the default lane (`Q11`);
- `A2` catches loss of pruning in the default lane (`Q12`, `Q13`);
- `A1`/`A7` catch interior make/unmake corruption in the default lane, **through the one `position-3` depth-3 pair that was deliberately kept there** (`Q14`).

The engineer's choice of which depth-3 pair to keep is the reason the last of those holds. Dropping it would have been the real loss, and he did not drop it.

## Is the deep lane adding what its disclosure implies? **Less than it implies.**

I went looking specifically for a **depth-3-only pruning regression** — the exact hazard the engineer named. I could not construct one that the deep lane catches:

| mutant | kiwipete d3 ratio | deep-lane `A2` (bar 40%) |
|---|---|---|
| unmutated | 9.0% | pass |
| cutoffs only at `ply < 2` | 16.6% | **pass** |
| cutoffs only at `depth < 2` (frontier only) | 12.4% | **pass** |
| `alpha >= beta` → `alpha > beta` | — | **pass** |

**The limiting factor is not the lane; it is `A2`'s 40% slack.** At the criterion's own position the true figure is 9.0%, so the bar sits at 4.4x the measured value and only a total loss of pruning breaches it. The default lane's guard — startpos depth 2 at 27.1% against the same 40% — is in **relative** terms the tighter of the two.

So the split trades away run time for a case that, as bounded, detects nothing the cheap case does not.

## Verdict on the split

**The split is sound as engineered, and the disclosure slightly over-states the risk it creates.** The criteria have **not** effectively moved out of the gate: every criterion `A1`-`A7` still fails in the default lane when the thing it owns breaks.

**But "a documented command, not a gate" is not, in general, a sufficient mitigation, and it should not become the pattern.** It happens to cost nothing here because `A2`'s bar is loose; on a criterion with a tight bar the same move would silently retire it. Two things follow, both for the Orchestrator and Architect/Design rather than for this ticket:

1. **The real weakness is `A2`'s bar, not `SEARCH_DEEP`** (gap `G3`). If anyone wants pruning-quality regression detection, the bar has to come down toward the measured figure; re-running the deep lane will not deliver it.
2. **`PERFT_DEEP` and `SEARCH_DEEP` are now two opt-in lanes** carrying criterion-level cases that nobody is forced to run. That is a second data point on a pattern, and it deserves a rule about what may go behind an opt-in flag — not another per-ticket judgement call.

Both lanes were run at this hop and both are green: `PERFT_DEEP=1` 32/32 in 36.25 s, `SEARCH_DEEP=1` 41/41 in 23.48 s (47/47 including the file added here).
