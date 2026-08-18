---
id: 20260818T154500Z-qe-e2e-decision-a1s-attribution-is-half-right-and-the-5-s-ceiling-does-break-c7d8e9f0
kind: decision
by: qe-e2e
at: 2026-08-18T15:45:00Z
verified_by:
confidence: high
refs:
  - ABC-078
  - NFR-004
  - EPIC-006
  - src/engine.ts
supersedes:
---

# `A1` tested as ATTRIBUTION, not as a number: the granularity story is CONFIRMED for the median and REFUTED for the tail — and the 5 s ceiling DOES break, but not where anyone was looking

The engineer's `claim` note (`20260818T131500Z-…-d4e5f6a7`) attributes the whole `A1` overshoot to
the 1 024-node clock-check granularity. I did not re-run its number; I varied the constant and
instrumented the check site. **Three results, and they do not all point the same way.**

## 1. CONFIRMED — the MEDIAN overshoot is the granularity, and it scales linearly

I generated variants of `src/engine.ts` differing only in `NODES_PER_CLOCK_CHECK`, instrumented
the check site to record the **wall gap between consecutive clock consultations** — which is
exactly the quantity the attribution names — and ran the six benchmark roots at the 3 s budget.

**Median inter-check gap, in ms:**

| position | NCC 256 | NCC 1024 | NCC 4096 | NCC 16384 |
|---|---|---|---|---|
| `startpos` | 1 | 3 | 14 | 53 |
| `kiwipete` | 2 | 7 | 28 | 106 |
| `position-3` | 1 | 3 | 11 | 44 |
| `position-4` | 1 | 5 | 19 | 74 |
| `position-5` | 1 | 5 | 20 | 80 |
| `position-6` | 1 | 6 | 22 | 91 |

**Every column is ~4x the one before it, for a 4x change in the constant.** That is linear
scaling in `NODES_PER_CLOCK_CHECK` across a 64x range, on all six positions. The mechanism the
engineer named is real and it is correctly identified.

**And the granularity BOUNDS the overshoot structurally:** in all 24 runs, `max(inter-check gap)
>= overshoot`. There is no overshoot the check interval fails to account for. **The diagnosis is
not wrong, and the "real cause" the brief asked me to look for behind it does not exist.**

Corroborating end-to-end sweep (30 positions = the six roots plus their first four legal
children), worst overshoot in ms:

| budget | NCC 128 | NCC 256 | NCC 1024 | NCC 4096 | NCC 16384 | NCC 65536 |
|---|---|---|---|---|---|---|
| 500 ms | 0 | 1 | 4 | 54 | 211 | 364 |
| 3 000 ms | — | 18 | 7 | 26 | — | — |

The 500 ms row is monotone in the constant. **The 3 000 ms row is NOT** — which is result 2.

## 2. REFUTED — the TAIL is NOT the granularity, and one of the engineer's three remedies does not work

The instrumented data separates median from maximum, and they behave differently:

| NCC | median gap (kiwipete) | **max gap seen** | ratio |
|---|---|---|---|
| 256 | 2 ms | **105 ms** (`position-5`) | ~100x |
| 1024 | 7 ms | **78 ms** (`position-3`) | ~11x |
| 4096 | 28 ms | 56 ms | ~2x |
| 16384 | 106 ms | 118 ms | ~1.1x |

At `NCC=256` one interval of 256 nodes — work that costs ~1 ms — **took 105 ms of wall clock**.
That stall is a GC pause or a scheduler preemption. **It is a floor of roughly 50–110 ms that does
not move when the constant moves**, and it is what dominates the worst case at small constants.
It is also why the 3 000 ms sweep row above is non-monotone: at `NCC=256` the worst overshoot
(18 ms) was LARGER than at `NCC=1024` (7 ms).

**The consequence is concrete and it lands on the engineer's own remedy (b).** That note says
*"`NODES_PER_CLOCK_CHECK` drops to 256, which cuts the overshoot ~4x"*. **It would cut the MEDIAN
~4x and would NOT cut the worst case ~4x**, because at 256 the worst case is a ~100 ms stall the
constant has no influence over. Anyone choosing remedy (b) to make `A1`'s sentence true would buy
a clock read every ~250 nodes and still see the occasional 3 0xx ms return.

**This does not make `A1` worse than reported** — the engineer's reported worst case is honest and
I reproduced its shape (below). It makes one of the three offered remedies ineffective for the
purpose it is offered for, and whoever adjudicates `NFR-004` should know that before picking it.

## 3. The number itself, reproduced — and the tail sampled properly

`ENGINE_DEEP=1` lane, my run: **worst case 3 030 ms on `position-5/b1c3`, 29/30 over 3 s, 0/30
over 5 s.** The engineer reported 3 027 ms on `position-4/f3d4`. **The worst-case POSITION moved
and the number did not**, which is itself evidence for a machine-wide granularity floor rather
than a pathological position.

450 further samples at the shipped constant (150 runs x 3 positions, 200 ms budget — the overshoot
is granularity-driven and so budget-independent):

| position | median over | p95 | p99 | **max** | over budget |
|---|---|---|---|---|---|
| `kiwipete` | 3 | 5 | 5 | 5 | 147/150 |
| `position-6` | 2 | 4 | 4 | 4 | 117/150 |
| `position-4` | 2 | 6 | 32 | **46** | 113/150 |

**Median overshoot 2–3 ms; worst in 450 samples, 46 ms.**

## 4. THE UNABORTABLE FIRST ITERATION IS NOT THE HOLE — measured, and the design is vindicated

The brief named iteration 1 (`nextCheck` starts at `Infinity`) as the place a 5 s breach would
come from. **It is not, and the reason is a bound chess supplies for free.** Depth 1 is one
`legalMoves` at the root plus one `leafScore` per root move, so its cost is O(branching factor) —
and the branching factor of a legal chess position is bounded at **218**.

Measured, at a budget that is already spent (a clock reading 0 once and then `1e9`):

| position | legal moves | elapsed | depth | nodes |
|---|---|---|---|---|
| `max-mobility-218` (`R6R/3Q4/1Q4Q1/4Q3/2Q4Q/Q4Q2/pp1Q4/kBNN1KB1 w - - 0 1`) | **218** | **2 ms** | 1 | 218 |
| `queens-216` | 218 | **0–1 ms** | 1 | 218 |
| `kiwipete` | 48 | 1 ms | 1 | 48 |
| `position-3` | 14 | 0 ms | 1 | 14 |

**The worst first iteration this game can construct costs 2 ms.** It is not an unbounded worst
case and it cannot produce a 5 s breach. I went looking for the hole the design deliberately
traded for and there is nothing there — **record this as a design decision that survived being
attacked**, not as an untested risk.

## 5. WHERE THE 5 s CEILING ACTUALLY BREAKS — `chooseMove` does not clamp the budget

It breaks trivially, and it has nothing to do with granularity or with iteration 1. Measured on
`kiwipete` with the shipped module, real clock:

| `budgetMs` | elapsed | depth | over the 5 s ceiling? |
|---|---|---|---|
| 3 000 (`DEFAULT_BUDGET_MS`) | 3 004 ms | 4 | no |
| **4 999** | **5 003 ms** | 4 | **YES** |
| **5 000** | **5 005 ms** | 4 | **YES** |
| **6 000** | 6 000 ms | 4 | **YES** |
| **10 000** | 10 000 ms | 5 | **YES** |

`NFR-004`'s ceiling is *"hard ceiling 5 s **at any difficulty**"* and `A1` says *"no call ever
exceeds 5 s"*. **Any `budgetMs >= 4999` breaches it, by construction, on this module, today.**

The engineer named this and routed it: *"No budget clamp. `NFR-004`'s 5 s ceiling is a promise
about the budget a caller CHOOSES, and choosing is `EPIC-006`'s."* That reading is defensible and
the ticket supports half of it — `## Out of scope` does put choosing in `EPIC-006`. But the same
sentence says this ticket **"owns the mechanism"**, and a ceiling is a mechanism property. What is
missing is not a clamp; it is that **nothing anywhere records the constraint `EPIC-006` would have
to honour.** There is no test, no type, no comment and no ticket line that says a budget above
~4.9 s breaks a merged NFR. `EPIC-006` will choose budgets with nothing to warn it.

**Live exposure today is nil**, and that is why this is not a FAIL: `src/turn-loop.ts` is
byte-identical, so nothing in the shipped tree constructs an engine, and `DEFAULT_BUDGET_MS` is
3 000. **This is a latent gap, not a live defect.**

**I do NOT rule `NFR-004`.** The brief fences it to Security/NFR and the fence is right. The
measurement above is mine and it is handed over; the adjudication is not.

## 6. One more unbounded case, found while hunting the ceiling

`chooseMove(position, { budgetMs: Number.POSITIVE_INFINITY })` **never returns.** `deadline` is
`Infinity`, so `now() >= deadline` is never true and `now() < deadline` is always true: the
deepening loop has no other exit. A 2 s watchdog on the injected clock fired.

The neighbouring degenerate budgets are all SAFE and fail shallow rather than badly — `0`, `-1`,
`-1e9` and `NaN` each return a legal move at depth 1 in ~1 ms, never `null` and never a throw
(`NaN` works because both comparisons are false, which exits the loop rather than entering it).
So `Infinity` is the single unguarded value.

Severity is low on its own — it is an obviously invalid input, coding rule 8 says do not handle
impossible scenarios, and there is no caller. It is recorded because it is the **only genuinely
unbounded path in the module**, and because it and item 5 are the same missing thing: **the module
accepts any `number` as a budget and documents no valid range.**

## Verdict on `A1`

**The engineer's report is honest, its number reproduces, its refusal to add a safety margin was
correct, and its attribution is right about the median and wrong about the tail.** The 3 s clause
is not literally met and the engineer said so; the 5 s clause holds at the default budget with
about 43x of headroom over the worst overshoot I could sample, and breaks at `budgetMs >= 4999`
because the module does not clamp and nothing records that it must not be given such a budget.
