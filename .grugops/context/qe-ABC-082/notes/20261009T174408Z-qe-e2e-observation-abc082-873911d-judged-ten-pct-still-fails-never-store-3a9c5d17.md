---
id: 20261009T174408Z-qe-e2e-observation-abc082-873911d-judged-ten-pct-still-fails-never-store-3a9c5d17
kind: observation
by: qe-e2e
at: 2026-10-09T17:44:08Z
verified_by:
confidence: high
refs:
  - ABC-082
  - ABC-081
  - ADR-0028
  - ADR-0024
  - src/transposition.test.ts
  - src/search.ts
  - src/transposition.ts
  - .grugops/context/qe-ABC-082/probe/mutants-f.mjs
  - 20261009T164755Z-architect-design-decision-ruling2-row17-legitimate-tree-move-a2-relevelled-to-10pct-owner-word-8c0fee21
supersedes:
---

# `873911d` judged on its own: the ≥ 10% bar still fails a table that never stores (0.00% on all three rows). What it gives up, measured: the DEFAULT-lane guard no longer reds a table that stores half its nodes (10.62%); the deep rows and two exact node pins still do

Hand-authored, no `seal`. `873911d` is `PENDING OWNER WORD` (`ADR-0028` proposed). This note
judges the commit; it does not accept it. Trees: `git archive` copies of `5ebe1d8`, `720b92d`
(re-hop without the tip) and `873911d`. Run 2026-10-09T17:07–17:11Z, load1 3.0–4.9. Raw:
`probe/mutants-f.part2.jsonl` (T1–T5 at 10%), `mutants-f.part3.jsonl` (W4), `mutants-f.part4.jsonl` (R0/R4 default-guard readings on all three trees; T3/T4 at 15% on `720b92d`).

## The reading without the tip (reproduced)

`SEARCH_DEEP=1 npx vitest run src/transposition.test.ts -t A2` on `720b92d`: **exit 1**, position-6
`expected 0.144617… to be ≥ 0.15`; kiwipete 15.63%. On the tip the full lane is **40 / 40**
(lanes note `…e81c6a95`). The literal is the only difference: the readings are identical.

## Does ≥ 10% still fail a table that never stores? **Yes.**

| mutant (QE's edit, scratch copy of `873911d`) | position-3 d4 (default) | kiwipete d5 (deep) | position-6 d5 (deep) | at 10% |
|---|---:|---:|---:|---|
| clean | 16.22% | 15.63% | 14.46% | green |
| T1 `search.ts` interior never stores (the Architect's) | **0.00%** | **0.00%** | **0.00%** | **red ×3** |
| T2 `storeEntry` a no-op for every caller | **0.00%** | **0.00%** | **0.00%** | **red ×3** |
| T5 stores only `BOUND_EXACT` | 1.18% | 0.09% | 0.34% | **red ×3** |
| T3 stores only at depth ≥ 2 | 0.00% | 5.63% | 4.85% | **red ×3** |
| T4 stores every other node | **10.62%** | 8.22% | 7.79% | **default GREEN**, deep red ×2 |

At 15% (the `720b92d` tree) T4 is red on all three rows, the default guard included (10.62% < 15%).

## What the re-level gives up, measured, not argued

- `ADR-0028`'s Consequences say "a table that silently loses about a third of its fixed-depth
  hits now passes A2". On the **default lane** that is now literal: T4 drops position-3 from
  16.22% to 10.62% (−35%) and the guard stays green by 0.62 pp.
- **It is still caught on the default lane, by other rows** (W4, the whole
  `transposition.test.ts`): `A1`'s exact pin (1 375 vs 1 319) and `A5`'s exact pin (7 297 vs
  7 251) both red. Those pins are class P and move at every evaluator change, so they are an
  incidental net, not a bar.
- **It is caught on the deep lane by A2 itself** (8.22% / 7.79% < 10%). `ABC-081` `A3`
  (≤ 70% nodes, the bar `ADR-0028` names as the one that "sees a table that stops paying") does
  **not** red T4 (whole file, `SEARCH_DEEP`: only A1, A5 and the two A2 deep rows red).
- The default guard's margin after the tip: 6.22 pp over 10% (16.22%). Before it: 1.22 pp over 15%.

## QE judgement on `873911d`

- **Mechanically sound.** Two literals, the describe text and two comments, one hunk, one revert.
  No other file. The bar's stated mutant (a table that never stores) is red at 10% on every row
  and both lanes.
- **The cost is real but bounded:** a half-storing table passes the default A2 guard but not the
  suite. Named so `ABC-083` sees it; no row is asked for here (the page fences new bars out).
- **Not QE's to accept.** It merges only on the owner's acceptance of `ADR-0028`; refusal is
  `git revert 873911d`, after which `ABC-082` is Blocked on row 17 again (reproduced above).
