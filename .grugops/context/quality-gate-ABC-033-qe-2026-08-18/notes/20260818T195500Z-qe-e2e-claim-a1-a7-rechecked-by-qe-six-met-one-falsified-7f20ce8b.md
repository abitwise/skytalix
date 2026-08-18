---
id: 20260818T195500Z-qe-e2e-claim-a1-a7-rechecked-by-qe-six-met-one-falsified-7f20ce8b
kind: claim
by: qe-e2e
at: 2026-08-18T19:55:00Z
verified_by:
confidence: high
refs:
  - ABC-033
  - EPIC-003
  - src/move-input.ts
  - src/move-input.test.ts
supersedes:
---

# `A1`–`A7` re-checked by someone other than the author: **six met, one falsified**

The engineer's `claim` note said its own hop was where this would be *"checked by someone other than
its author"*. This is that check. Same table, my verdicts. A `claim`, not a `finding` — no `finding`
is admissible on this install and nothing here carries a stamp.

| criterion | engineer | **QE** | what changed and why |
|---|---|---|---|
| `A1` both formats, one prompt, no mode switch | met | **met** | Confirmed and stress-tested. Reference identity is real, not incidental: M8 (structural clone, passes `toEqual`) reds 3 tests. I additionally verified `E4`, `E2-E4`, `NF3`, `nf3` resolve — the no-mode-switch promise holds across the case space, with the one exception in `G2`. |
| `A2` ambiguity lists candidates in SAN, applies nothing | met | **met** | Confirmed, and the two-halves design is **vindicated**: M9 (list, then `playMove` the first candidate) reds **exactly one** test and it is the second `it` block. The content assertion stayed green, precisely as test note 1 predicted. Best-guarded criterion on the page. |
| `A3` the folded retry, both directions | met | **met** | Confirmed. M1 (fold-first) reds 7 including row 3, the discriminator. M13 (a third trim) reds the fence test. **But** the ticket's *"order of attempt, fixed and asserted"* is not asserted — `G5`, M12 survives. That does not falsify `A3`, whose three rows are about outcomes, not call order. |
| `A4` the candidate list fits the frame | met, bounded | **NOT MET — falsified** | **This is the one change.** Seven knights attacking `d4` produce 7 candidates and a region reading `(+2 more)`: hidden count **2**, not 0. `A4` demands 0 for *any* ambiguity this ticket can produce. The engineer's cap argument (*"exactly six squares attack any given square by knight move"*) is false for a central square — 8 attack `d4`. Full reproduction in the `G1` observation. |
| `A5` one derive per prompt | met | **met, with a named blind spot** | The criterion as stated holds: `deps.legalMoves` is called once, and M4 (a second call) reds 12 tests. **But** the guard cannot see derives that bypass `MoveInputDeps`: M11 triples the real prompt-position derive count and reds **0**. Measured baseline is also `1 + O(candidates)` in real terms for ambiguous outcomes (6 for the six-queen fixture), from `toSan`'s suffix on the after-position. `G3`. |
| `A6` rejection does not advance, does not re-evaluate | met | **met, half-asserted** | The behaviour is right. The *precedence* is guarded in one direction only: M7 (always `unreadable`) reds 1, M6 (always `no-such-move`) reds **0** — `unreadable` is pinned to no input anywhere. `G4`. The "does not advance" and "does not re-evaluate" halves are both genuinely asserted. |
| `A7` no production change outside this module | met, measured | **met, re-measured** | Independently re-run: `git diff --numstat a83b933~1 a83b933` = `src/move-input.test.ts 374/0`, `src/move-input.ts 182/0`, nothing else. Suite green, skip **0**, `PERFT_DEEP=1` **32/32**, and I added `SEARCH_DEEP=1` **41/41**. The only criterion I can mark unambiguously met with no qualifier. |

## The one-line summary for the board and the trace

**Six of seven met; `A4` falsified at seven candidates and routed to `EPIC-002`'s frame owner as the
ticket's own prose directs.** `A5` and `A6` are met in behaviour with guards that do not fully bite,
and those are test-side repairs for the engineer, not defects in delivered behaviour.

## What I want the record to be honest about

The engineer's notes were **unusually good** — the `A4` bound was self-reported before QE arrived,
the `e8=q` limit was self-reported, and the mutation evidence was volunteered. **Every one of my
three most valuable findings started from something the engineer wrote down rather than hid.** `G1`
falsifies a claim the engineer had already labelled as searched-for-and-not-found; `G2` widens a limit
the engineer named. That is the process working, and it is worth recording because the temptation
after a "PASS WITH FINDINGS" is to read the findings as sloppiness.

The residual honest exposure, stated plainly: **five criteria are guarded by suites I have now shown
have holes** (`G3`–`G6`), and a future regression in reason-code precedence, derive count outside the
seam, or attempt order would ship green today.
