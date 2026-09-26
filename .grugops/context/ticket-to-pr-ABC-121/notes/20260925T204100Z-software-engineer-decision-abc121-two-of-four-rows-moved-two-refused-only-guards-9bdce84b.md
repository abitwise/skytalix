---
id: 20260925T204100Z-software-engineer-decision-abc121-two-of-four-rows-moved-two-refused-only-guards-9bdce84b
kind: decision
by: software-engineer
at: 2026-09-25T20:41:00Z
verified_by:
confidence: high
refs:
  - ABC-121
  - N8-LANE
  - ADR-0026
  - src/search.pvs-lmr.test.ts
  - .grugops/context/ticket-to-pr-ABC-121/notes/20260925T204200Z-software-engineer-observation-abc121-default-lane-ledger-23-of-23-placement-20-of-23-proposal-17a0830d.md
  - .grugops/context/ticket-to-pr-ABC-121/probe/rehop-pvs-subset.ts
  - .grugops/context/ticket-to-pr-ABC-121/probe/rehop-pvs-subset.txt
supersedes:
---

# Placement: two of the four proposed rows moved, two refused because each is the only default-lane row that reds its variant

Hand-authored. Commit `6c1e895` on `grugops/ABC-121-lane`: `src/search.pvs-lmr.test.ts` only,
+25/−11, test-only. No bar moved, and **the G6 row was not touched**.

| proposed row (`…24e3648a`) | done | why |
|---|---|---|
| mate-floor seven-seed guard | **MOVED** behind `SEARCH_DEEP=1` | It reddened only `no-unmake-in-predicate`, which 7 other default rows red. It never reddened `r2`; the deep 287 does. |
| PVS identity, six endgames + position-3 | **NARROWED to kp-vs-k**; the other six run in the deep 190 row | kp-vs-k is the one position where a *reducing* `searchWithoutReductions` scores apart: 130 against 110. The other six read equal, so they cannot red `door-withoutReductions-reduces`. |
| `A4`'s `chooseMove` row | **KEPT default** | It is the only default row that reds `noLmrResearch-engine-only` and `noResearch-engine-only`, and the only row in any lane that reds the former. |
| engine-doors bite | **KEPT default** | It is the only row in any lane that reds `engine-door-withoutReductions-reduces`. |

- **The ledger proof is `…17a0830d`.** With all four moved, those three variants survive the
  default lane.
- **The file header's lane paragraph is updated to match.**

**Not done, recorded only.** `A4`'s `chooseMove` row could drop its reference deepening, since its
literal pin `[95, "h5e5"]` already states the reference's answer. That changes a guard's assertion,
not its placement, so it is outside this re-hop. It is QE's or the owner's call.
