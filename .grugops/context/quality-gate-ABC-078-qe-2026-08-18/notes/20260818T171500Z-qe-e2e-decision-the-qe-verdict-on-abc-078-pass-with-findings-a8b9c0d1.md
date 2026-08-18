---
id: 20260818T171500Z-qe-e2e-decision-the-qe-verdict-on-abc-078-pass-with-findings-a8b9c0d1
kind: decision
by: qe-e2e
at: 2026-08-18T17:15:00Z
verified_by:
confidence: high
refs:
  - ABC-078
  - RISK-002
  - NFR-004
  - NFR-005
  - N8-LANE
  - ABC-077
  - src/engine.ts
  - src/engine.test.ts
supersedes:
---

# QE verdict on `ABC-078`: **PASS WITH FINDINGS**. Seven gaps — 2 HIGH, 2 MEDIUM, 3 LOW. Every one is in TEST code; **no production defect was found**

**This is not a stamp.** `context.human_admission` is `off` and no `finding` is admissible on this
install, so this is a hand-authored `decision` per `agent-factory/contracts/context-note.md`. It
carries no `§14-gate#<id>`.

## The verdict, and why it is not FAIL

**PASS WITH FINDINGS.** Every one of `A1`–`A7` is met on its own terms; the blocking gate is green
by its **recorded** commands; the delivered production module survived nine mutants, a 409-position
`A7` attack, a granularity sweep across a 64x range and a 604-comparison differential against
`src/search.ts` **without a single production defect being found**. What I did find is that
**three of the seven criteria are guarded by tests that do not detect the defect they were written
to detect.** That is a real and serious gap — a suite that is green for the wrong reason trains the
next hop to trust it — but it is a gap in the *net*, not in the *thing*, and the correct remedy is
test code that touches no production line and no merged contract.

**It is not FAIL** because nothing shipped is broken, `A6` is byte-identical, and the engineer's
own reporting was honest to the point of self-cost: it declared `A1` NOT literally met and refused
to add a margin to make the sentence true. **That refusal was correct and I want it recorded as
correct** — I checked the attribution behind it and the mechanism is real (see the `A1` note).

**It is not clean PASS** because `G1` and `G2` are HIGH, and `G2` in particular means a future hop
can silently violate `RISK-002` — this epic's non-negotiable inherited constraint — with 1 016 tests
and the opt-in deep lane green.

## Criterion by criterion, with the evidence that decided it

| # | verdict | how I decided it |
|---|---|---|
| **`A1`** | **MET on the 5 s ceiling at the default budget; the ≤ 3 s clause is NOT literally met and the engineer said so** | Re-ran the lane (worst 3 030 ms, 29/30 over 3 s, **0/30 over 5 s**); tested the ATTRIBUTION by varying `NODES_PER_CLOCK_CHECK` over 64x and instrumenting the check site. Median inter-check gap scales **linearly** with the constant on all six positions; `max(gap) >= overshoot` in 24/24 runs. **Attribution confirmed for the median, refuted for the tail** (`G5`). The ceiling breaks at `budgetMs >= 4999` (`G3`). |
| **`A2`** | **MET as written; its test does NOT do the job the ticket assigns it** (`G1`) | Built the between-iterations engine and ran `A2`'s exact fixture against it: **identical** depth, node count, elapsed and clock-consultation count as the delivered build. `A2` passes on both. |
| **`A3`** | **MET, and its discard property is genuinely guarded** | The keep-the-partial-iteration mutant (M2) reds `A3`. The fixture choice (`position-6`, best move changes between depth 2 and 3) is correct and load-bearing. **But `A3`'s OTHER job — coupling the two negamax copies — is far too thin** (`G4`). |
| **`A4`** | **MET on the delivered code; the guard is bypassable** (`G2`) | Three depth-cap mutants: a default parameter and a named header constant both die; **a two-line anonymous cap in the loop body survives the full suite AND `ENGINE_DEEP`.** |
| **`A5`** | **MET** | The pinned-depth-1 mutant (M6) reds `A5`'s *"actually goes deeper"* assertion. Monotonicity is asserted, no absolute depth is (ticket test note 4 honoured). |
| **`A6`** | **MET** | Four identical blob hashes for `src/turn-loop.ts` (working tree, branch base, `main`, and the brief's `16e9269`). Delivered `src/` diff is exactly two ADDED files, 0 modifications. `runTurnLoop`'s own membership test reds the illegal-move mutant. |
| **`A7`** | **MET, and it survived a harder attack than the suite runs** | 409 positions (vs the delivered 209) including promotion, en passant, castling, near-mate, near-stalemate, 218-move max mobility and the fifty-move edge, at budgets 1 / 0 / −1 / 0.5 / ε: **2 045 real-clock calls, 0 null, 0 throws, 0 illegal, 0 mutated positions.** |

## The seven gaps

### `G1` — HIGH — `A2` is insensitive to the defect it exists to catch, and its comment states a false measurement

The ticket calls `A2` *"the criterion that proves the clock is checked inside the recursion"*.
On `A2`'s fixture the delivered build and the between-iterations build produce **identical**
observable behaviour (depth 2, 360 nodes, `elapsedMs` 75, 4 clock consultations) — the in-recursion
check is **never reached**, because iteration 2 on `kiwipete` costs 360 nodes and `nextCheck` is
1 072. `A3` is what actually reds M1 (depth 2 / 3 118 nodes vs depth 5 / 5 559 616). Two false
statements sit in `src/engine.test.ts:206-212`: the mutant does **not** run depths 3–5, and `A2`'s
fixture measures **360** nodes, not the quoted 3 120 (which is `A3`'s number, 3 118).
**Impact:** the ticket's headline defect is guarded only as an undeclared side effect of another
test, so retuning `A3`'s fixture would silently remove the coverage. **Remedy:** point `A2`'s
(good) node bound at a fixture where the in-recursion check actually fires. Full detail and
measurements in the mutation note.

### `G2` — HIGH — a fixed depth ceiling slips past `A4`, past the full suite, and past `ENGINE_DEEP`

Two lines — `if (iteration > 4) break;` inside the deepening loop, leaving the loop header
untouched — produce an engine with a hard depth-4 cap that passes **`tsc`, `biome`, 1 016/1 016
default tests and 23/23 `ENGINE_DEEP` tests.** `A4`'s four checks are all textual (source regexes,
`Object.keys`, `Function.length`); **not one of them runs a search**, and `A5`'s observed depths
(1/2/3, and 1/3/4 in the deep lane) never exceed a cap at 4.
**Why HIGH:** this is `RISK-002`, the epic's non-negotiable inherited constraint, and the capped
build's `A1` numbers are **better** than the delivered build's — worst case 3 024 ms and **5/30**
over 3 s instead of 29/30, in a 36 s lane instead of 98 s. **The single change that destroys the
constraint is also the change that makes the criterion the engineer honestly reported as unmet
look close to met.** **Remedy:** one behavioural assertion — that completed depth keeps rising past
any plausible hard-coded cap, on a cheap sparse endgame — beside the textual ones. No fixed depth
need be asserted.

### `G3` — MEDIUM — the 5 s ceiling breaks at `budgetMs >= 4999`, and nothing records that it must not be given such a budget

Measured on `kiwipete`: 4 999 ms → **5 003 ms**; 5 000 → 5 005; 10 000 → 10 000 (depth 5).
`chooseMove` does not clamp, which the engineer decided deliberately and routed to `EPIC-006`.
The decision is defensible; **the absence of any record of the resulting constraint is the gap.**
No test, type, comment or ticket line tells `EPIC-006` that a budget above ~4.9 s breaks a merged
NFR. Live exposure is **nil** today (nothing constructs an engine; `src/turn-loop.ts` is
byte-identical; the default is 3 000). **I do not rule `NFR-004` — that is Security/NFR's, and this
is handed to them as a measurement.**

### `G4` — MEDIUM — `A3`'s coupling of the two negamax copies is one position, one depth, move-only, and two realistic drift mutants survive it

`src/engine.ts`'s copy mutated three ways, `src/search.ts` untouched: **stalemate scored as a loss
survives 1 016 tests AND `ENGINE_DEEP`**; **mate-distance-lost survives 1 016 tests**; only the
gross leaf-sign flip dies. Stalemate-as-loss is precisely the bug `src/search.ts`'s own comment says
*"this project's `A5` exists to catch"* — **and that criterion guards only the copy a game does not
use.** Differential over 260 positions: the delivered build matches `search()` **604/604 in both
move and score** (a positive result), while mate-distance-lost produces **39 score mismatches and 0
move mismatches at depth 2**. A score assertion at `A3`'s *current* fixture catches neither mutant
(all three builds agree at `position-6`): **breadth including mate/stalemate-adjacent endgames is
what does the work.** **The duplication itself is the RIGHT call** — I verified `ABC-077`'s merged
`A6` forbids every alternative, and I am not asking for it to be weakened. Full analysis, lane
costs and the remedy in the duplication note.

### `G5` — LOW — the `A1` attribution is right about the median and wrong about the tail, which makes one offered remedy ineffective

At `NCC=256` a 256-node interval (~1 ms of work) was measured taking **105 ms** — a GC/scheduler
stall that does **not** scale with the constant. The engineer's remedy (b), *"`NODES_PER_CLOCK_CHECK`
drops to 256, which cuts the overshoot ~4x"*, would cut the **median** ~4x and not the worst case.
Recorded so whoever adjudicates `NFR-004` does not pick it expecting the tail to move.

### `G6` — LOW — `chooseMove` does not terminate on `budgetMs: Infinity`, or on a clock that never reaches the deadline

The deepening loop's only exit is the clock. `Infinity` budget, a constant clock above `0`, a
backwards clock and a jittering clock all hang (watchdog at 40 reads). `0`, `−1`, `−1e9` and `NaN`
budgets are all **safe** — depth 1, ~1 ms, a legal move, never null, never a throw. **No guard is
requested** (coding rule 8; `Date.now` satisfies the precondition; there is no caller). What is
requested is **two comment lines** on `Clock` and `budgetMs` stating what the module requires — the
seam exists so that something other than `Date.now` can be injected later.

### `G7` — LOW — the delivered notes transpose `A2`'s and `A3`'s node figures

The engineer's criterion-verdicts note cites **3 120 nodes** as `A2`'s evidence. `A2`'s fixture
measures **360**; **3 118** is `A3`'s fixture. A bookkeeping error in a note, not in code — but it
is the number a reader would use to convince themselves `A2` is doing its job, so it is recorded
rather than let stand.

## What I did NOT rule, deliberately

**`NFR-004`, `NFR-005` and `N8-LANE` are Security/NFR's and I do not adjudicate them.** I ran the
lanes and my measurements are in the `artifact-ref` note for them to use: `NFR-005` reproduces
below its depth-6 FAIL floor (kiwipete depth 4, `position-6` depth 3 at 3 s), and `G3` above is a
`NFR-004` measurement handed over, not a verdict. I did not re-measure `N8-LANE`'s paired protocol —
the engineer's own note explains why it could not be taken under its protocol at that hop, and my
isolated worktree is a *different* machine condition, not a better one, so a number from it would
be a third incomparable figure rather than a resolution.

**I did not weaken `ABC-077`'s merged `A6`.** I read it, confirmed it forces the duplication, and
left it exactly as merged.

## Fences honoured

No production file was changed: `src/engine.ts` is `04d8eb114ddfb021fcf21f9b3a196d29d465d3dd` and
`src/turn-loop.ts` is `9334daf1d2c2242e2071830c491e3b7f86a16a79` at the end of this hop, the same as
at the start. Every mutation was applied in place and reverted with `git checkout --`, and the blob
hash was re-verified after each. All probe modules were scratch files under `src/*.probe.ts`,
deleted before the final gate; **none was committed**, and the gate was re-run on the restored tree
(1 016 passed, biome 64 files clean, `tsc` exit 0) to prove nothing was left behind. **No fix was
made — this hop reports.** Nothing merged, nothing deployed, `plans/board.md` not opened.

## Recommended routing

`ABC-078` proceeds to **Security/NFR** with `NFR-004` (including `G3`'s measurement), `NFR-005` and
`N8-LANE` open for their ruling. **`G1`, `G2` and `G4` want a follow-up test-only ticket** — all
three are `src/engine.test.ts` changes, none touches a production line, none touches a merged
contract, and `G2` is the one that should not wait, because it is `RISK-002`'s only guard and it is
bypassable today. Cutting that ticket is BA/PM's and the Orchestrator's, not mine.
