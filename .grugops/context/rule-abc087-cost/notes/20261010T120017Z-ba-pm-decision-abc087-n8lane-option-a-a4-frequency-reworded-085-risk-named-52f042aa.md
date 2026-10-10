---
id: 20261010T120017Z-ba-pm-decision-abc087-n8lane-option-a-a4-frequency-reworded-085-risk-named-52f042aa
kind: decision
by: ba-pm
at: 2026-10-10T12:00:17Z
verified_by:
confidence: high
refs:
  - ABC-087
  - ABC-085
  - ABC-101
  - EPIC-004
  - EPIC-006
  - ADR-0032
  - ADR-0035
  - NFR-004
  - NFR-005
  - N8-LANE
  - plans/tickets/ABC-087-difficulty-levels-as-budget-plus-blunder-rate.md
  - plans/tickets/ABC-085-self-play-ladder.md
  - plans/traceability.md
  - src/levels.test.ts
  - .grugops/queue/claimed/rule-abc087-cost/rule-abc087-cost.md
  - .grugops/context/ticket-to-pr-ABC-087/notes/20261010T112902Z-software-engineer-decision-abc087-levels-module-shape-table-values-two-corpora-4e5f0323.md
  - .grugops/context/ticket-to-pr-ABC-087/notes/20261010T115230Z-software-engineer-observation-abc087-gates-a1-a10-readings-n8-lane-not-met-25962b19.md
  - .grugops/context/ticket-to-pr-ABC-087/notes/20261010T115230Z-software-engineer-claim-abc087-agents-md-line-nfr004-wording-a4-bias-53ebd6d1.md
  - .grugops/context/ticket-to-pr-ABC-087/probe/cost-readings.txt
supersedes:
---

# `ABC-087`: `N8-LANE` overrun ruled option (a), with `A4`'s ≥ 200-move run moved to `ENGINE_DEEP` unchanged; (b) refused; (c) only if the re-run misses. `A4`'s frequency re-worded to read p. Levels 3/4/5 risk named on `ABC-085`. DoR 10/10, unchanged

This note is hand-authored and unsealed: no `finding` is admissible on this install (`AGENTS.md`). It
was written on branch `grugops/ABC-087-difficulty-levels` on top of `ef297855`. Task
`wave-2026-09-25`, subtask `rule-abc087-cost`. The Engineer's readings are cited, not re-measured: I
ran no lane. The page carries the ruling and the change list (§ Delivery). This note carries the
reasons.

## 1. The overrun: option (a)

**Why (a) is not a weakening.**
- Every clause of `A4` keeps its number: ≥ 200 moves, ±5 pp, legal, never the worst, the strict
  second-best.
- The deep lane already proves all of them on the stronger corpus: perft + puzzles, 246 moves,
  39.4 %, 0 no-candidate. `A2`, `A3` and `A5` already live there.
- The page's "`A4` is fast, default lane" line was mine, written at the cut before `ADR-0032` ruled the
  construction. That construction made it false: N `chooseMove` per blunder. Placing a criterion in a
  lane is the cut's call (`N8-LANE`: "Owner: BA/PM at each cut"). The 650 ms bar does not move.

**Why I did not delete the moved row.** The `ENDGAMES` run is the only `A4` run that holds a
no-candidate move (1 in 204). Moving it costs the deep lane well under 1 s out of its ~199 s.

**What the default lane loses, and the guard that keeps it.** Without the guard, a regression in the
strict-second-best pick would pass `npm test`. Test note 2 calls that clause "the one that means
something". So test note 7 asserts the per-move clauses on the moves `A9` already plays. That is
5 × 30 positions, ~60 blunders at 0.40, no new search, inside the same `it`. It is a guard, not `A4`'s
evidence: 150 moves is under the ≥ 200, and the guard has no frequency clause.

**(b) refused.** A lower count is a weaker criterion, and no BA/PM hop lowers one to fit a meter.

**(c) is the owner's word, and it is not taken.** It is the fallback only if the re-run reads NOT MET
or UNRESOLVED. There is no pre-ruled contingency that moves `A9`, `A7` or `A10` to opt-in:
- they are the seed contract `ABC-085` runs on;
- with the guard, they are the default lane's only blunder-path coverage.

Moving them is a coverage price for the owner to weigh against accepting the overrun. It is not mine
to pay.

**The evidence is not yet in hand.**
- The variant read +0.540 s (0.47–0.57), R 0.040 s, 19 tests. Its twin read −1.92 % at sign 2/8, which
  is inadmissible, so it is indicative only.
- The shipped tree's own twin was admissible: +0.54 %, sign 4/8, R 0.060 s. If the re-run's twin is
  that clean, a median near 0.54 s is MET with ~110 ms to spare. That is `UNKNOWN - verify` until it
  is read.

**This rests on `ADR-0035`, which is `proposed`.** Its narrow set is the only instrument that resolves
650 ms here; the full-lane CPU floor is F = 1.72 s. If the owner declines `ADR-0035`, the
catalog's standing full-lane instrument cannot resolve this bar either way. That is the owner's ADR
question, not this ticket's.

## 2. `A4`'s frequency: re-worded on `ABC-087`, not routed to `ABC-085`

**The fault is in the formula, not in the corpus.**
- The construction learns "no candidate" only after the draw fires. So the old denominator drops
  only the drawn no-candidate moves.
- It reads p(1 − q)/(1 − pq), with a bias of p·q(1 − p)/(1 − pq). At p = 0.40, q = 0.10 that is
  2.5 pp, half the tolerance.

**Routing it to `ABC-085` would route it to nowhere.** `ABC-085` has no frequency criterion. The
biased formula lives in `A4`, which is BA/PM's.

**New wording: (blunder + no-candidate) ÷ moves.** That is every move whose draw fired, and it reads
p for any q.
- **Blunders ÷ moves is reported beside it,** along with the no-candidate count.
- **Every no-candidate move's own list has fewer than three distinct scores.** This is what answers
  the Engineer's "measures the draw, not the play".
- **Each fired draw's outcome is still asserted:**
  - a candidate position must play the strict second-best;
  - a "no-candidate" label must be true by the move's own list;
  - a draw silently turned into `engine` lowers the frequency, and ±5 pp catches it.
- `assertA4` already asserts `between` is empty on no-candidate moves, which is the same as fewer than
  three distinct scores. **Only the frequency line changes.**

**Verdicts do not move.** Deep: (97 + 0)/246 = 39.4 %. `ENDGAMES`: (80 + 1)/204 = 39.7 %.

**`ADR-0032`'s Consequences bullet is not edited (fenced).** It handed the old denominator to BA/PM
to fold.
- The re-word keeps its intent: no-candidate moves do not count as missed blunders.
- It fixes the arithmetic. It does not touch decisions 1–3: draw first, one draw per move, strict
  second-best, worst class.
- **For Architect/Design and the owner to know:** the page and that bullet now read differently. If
  the owner wants the literal folded wording back, reverting is one sub-bullet. Under that wording,
  `A4` reads low on any endgame-heavy corpus.

## 3. Levels 3/4/5: named on `ABC-085`'s page

- **It is a risk to `ABC-085` `A2`, not a fault in `ABC-087`.** `A1` asks for ≥ 3 named levels with
  budgets and rates, and the table meets it. `ABC-085` exists to prove the ordering.
- **The arithmetic is why it is likely.**
  - `NFR-004`'s 5 s ceiling caps any budget-only level above the 3 s default at 1.67x.
  - The table uses 1.33x and 1.125x.
  - `ADR-0032`'s `kiwipete` row shows about 3x per ply (depth 5 at 1 000 ms, depth 6 at 3 000 ms).
- **It is pre-registered on `ABC-085`.** If `A2` fails on those pairs, the failure comes back to BA/PM
  as `ABC-087`'s finding.
- **The fixes I can see are all product calls, and none is taken:**
  - **fewer levels above the default** changes `ABC-101`'s 1–5 vocabulary, which `EPIC-006` reads.
    That is BA/PM plus the Orchestrator, cross-epic.
  - **a default blunder rate** changes today's play and `NFR-005`'s referent. The Engineer rejected
    it, and I agree.
  - **scoping `A2` to pairs at or below the default** is a weakening, so it is the owner's.
- **`n` as a level datum (`ADR-0032` Alternatives) does not help here.** It only shapes levels that
  blunder, and 3/4/5 do not.
- **No tuning now** (`ABC-087` test note 4; `ABC-085` out of scope).
- **`ABC-085` test note 5** runs those two pairs first, so the answer comes early and cheap.
- **`ABC-085` DoR not re-scored; still 7/10.** Item 3 stays ⚠️ because `ABC-087` is not `Done`.

## 4. Owed elsewhere (routing only; nothing written in a fenced file)

- **The Engineer** re-works `src/levels.test.ts` per the page's § Delivery ruling, then re-runs the
  gate and the narrow-set `N8-LANE` harness.
- **The Scribe.** The `AGENTS.md` lane line drafted in `…53ebd6d1` is now load-bearing, because `A4`'s
  evidence is opt-in. Its comment should read "19 default" after the re-run. It is owed before merge.
- **Security/NFR:** `NFR-004`'s level-layer wording (unchanged from the build hop).
- **The owner:** `ADR-0035`'s acceptance, which the narrow-set verdict rests on. Option (c), only if
  the re-run misses.
