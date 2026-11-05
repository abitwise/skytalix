---
id: 20261105T004221Z-architect-design-decision-e5a5ac0c
kind: decision
by: architect-design
at: 2026-11-05T00:42:21Z
verified_by: 
confidence: medium: the rule readings are the Architect's judgement on the ADR text, the forms table and the recommendation are judgement, the costs are recorded figures of the first pull and this pull; the answer is the owner's
refs:
  - arch-ABC-301-miss
  - ABC-301
  - ABC-239
  - EPIC-011
  - ADR-0067
  - ADR-0070
  - ADR-0056
  - F4
  - F6
  - zugzwang.001
  - dd88560f
  - 26d06118
  - orch-2026-10-30a/20261105T001333Z-orchestrator-decision-aa971f0b
  - arch-ABC-239-f3f4/20261104T020015Z-architect-design-decision-69f22167
  - qe-ABC-301-miss/20261105T003042Z-qe-e2e-observation-066fadea
supersedes: 
seal: sha256:43412254a92f8f19a611ab77764c3b601f309ceee410c82ac14b2bc6683037b1
---

# arch-ABC-301-miss item 2: the options for tuning. Recommended: **wait**. No third fit now. Stopping a third fit now is right; stopping tuning for good is not shown by the records

Architect/Design, task `arch-ABC-301-miss`, records only, from `main` `701ef5bd`. Nothing was run. Every option keeps `zugzwang.001` as it stands: e1f1 at depth 9, no moved depth, no re-pin. The answer is the owner's (`…aa971f0b`: a third pull is a new call for him).

## Where it stands, in plain words
- Tuning means a program sets the evaluation's weights from game results. Both pulls produced a table that predicts results better than today's rule-made table: 0.9905 × and 0.9872 × loss.
- Both tables then play a losing move in the same safety position. Four fitted tables out of four do: `da3f8599`, the box-only set, `26d06118` and `dd88560f`.
- **No fitted table has ever played a graded game.** So whether tuning pays is unknown. `ADR-0056`'s +100–250 is an estimate.
- At depth 9 the row turns on a small preference, not on seeing the win: 29 cp at its last read. Neither table scored White's win through depth 16 on the first pull's reads. The first pull found that any fit moving the endgame halves of the pawn, passer or king terms is likely to flip it. Why this pull's table flips it is unread.
- So a retry has poor odds, and a pass on a retry would prove little. A row that a small change can flip passes sooner or later if it is tried often enough.

## The options

| word | what happens | cost | what it keeps |
|---|---|---|---|
| **stop** | E2 closes for good. `main` keeps E1's rule-made table. The tools stay off `main`. E3b, E4b, E5 and E6 can only be hand values judged on their own games. A later ticket may remove E4a's terms (`ADR-0070` § Consequences) | 0 host. It gives up E2's estimated +100–250, never read. By `ADR-0056`'s own estimate 3 000 "needs … a tuned evaluation", so `EPIC-011` G1 falls further out of reach (low confidence, its words). BA/PM rewrites about five pages | Nothing is spent on this again |
| **wait** (recommended) | No third fit now, and no date. The next evaluation terms go ahead on their own reads with hand values. A third pull may be asked for only when a term named before this miss has merged on its own read. At most one more attempt: a third miss on this row closes E2 | One small landing hop for the tools (item 3). E2's gain stays unclaimed, maybe for a long time. E4a's 1.12 × per-call endgame cost stays paid for no value. Hand values have a poor record (`ABC-207` lost, `ABC-205` died on cost, `ADR-0068` failed the mate floor, `ADR-0070`'s row missed), so this may end in **stop** anyway | The one form of third attempt I can defend |
| **third** | One more fit now, on something changed today: another data month, or R1 added as a bound | About 1–2 h of engineer time and about 20 min of host to the row. A new data pin needs his word. If the row is green: scope 4's re-pins (115 reds on this table), B-T7 about 0.7 h, and B-T8 about 5 h, which he would have to approve again | Fast. I read it as a refit by another name, below. Forecast: a fifth e1e5 |

## The recommendation: wait
- **Why not third.** Nothing new exists to fit on. Every change available today would be picked because the row missed. `ADR-0067` F6 and ruling (c) exist to stop that.
- **Why not stop.** The four misses are all on today's feature set. E3b to E6 have never been in a fit, and no fitted table has played. The records show that tuning fails this row on these features. They do not show that tuning cannot work. Waiting costs one landing hop, and stopping can still be chosen later at no loss.
- **What would make stop the better answer:** if he does not mean to fund hand-valued terms, or would not spend B-T7 and B-T8 on a third pull even after one lands. Then **wait** only delays **stop**, and he should say **stop** now.

## A third attempt: what it would have to do
**The "one fit, no refit" rule does not itself bar a third pull.** `ADR-0067` d6's amendment applies "for the second pull and every later pull", and it counts fits within a pull. A third attempt must keep it unchanged. Anything looser, such as a second fit or several candidates, is a refit by name.

**So what must differ is the input, and why it was chosen.** A chain of pulls that each change one thing after the row misses is one long refit, carried out across tickets. The words "a new data set or free set" are also weaker than they look. They sit in F6 and in `ABC-301`'s B-T7 bullet, not in F4 or the B-T5 bullet. The second pull took them by ruling. So after an F4 miss a new ruling is genuinely needed, not only a courtesy.

**The ruling I would offer, four tests. A form must pass all four:**
1. **Named before the miss:** the change is on a record dated before `dd88560f`.
2. **Stands without the row:** it has its own reason and its own read, and it would be done if `zugzwang.001` did not exist.
3. **Blind:** no value, bound, data slice, λ or configuration is chosen with the row or its attribution in hand.
4. **Capped:** one fit, sealed, and a miss closes E2. No fourth attempt.

| form | reading |
|---|---|
| A second fit on the same data and free set, another λ, forcing C-S, another margin | **A refit by name.** F6 |
| The row or its tree as a bound | **Barred.** Ruling (c), d6: not a relation |
| Freezing the eg halves the row names, or shipping only the mg halves | **Barred.** The first pull's path (ii): a fit chosen on the row |
| Several candidates, keeping one that passes | **A refit with a filter.** Fails 3 and 4 |
| Re-reading `dd88560f` once a search change moves `main` | **A re-played miss, not a fit.** My reading of F6's "not re-played" and the owner's never-re-played rule; F4 does not say it in those words |
| Another Lichess month, another own-games share, another filter | **F6's letter allows it. A refit by another name.** B-T2 was met, so no record gives a reason but the row. It fails 2 |
| R1, the king's rank symmetry, as a bound | **A refit by another name.** A sourced relation, but found from the row's own diagnosis, and forecast insufficient alone (`UNKNOWN - verify`). Fails 3 |
| A new term aimed at the row, such as a passer frozen by the enemy king's reach | **A refit by another name** unless it passes all four. It is on no list dated before the miss |
| U (the unstoppable passer) on its own read, then a pull | **Lawful but not blind.** `ADR-0070` d7 names this route before the miss. A hand value on `main` needs its own PREREG and a restated E3 (c). But its effect on the row is already on record (+85 cp on `main`'s table at 400), so choosing it now is choosing with that in hand. It passes 1, 2 and 4, and 3 only with that disclosed |
| E3b, E4b, E5 or E6 merged on its own read, then one fit whose free set includes it | **The one clean form.** They are on `ADR-0056` D2's list, each has its own read, and none has been read on the row under a fit. **It does not exist today:** no such term is on `main` |

So a form that is not a refit by another name exists on paper, but not today. Even that form yields only a weak pass: the row stays a small preference. That is why the cap belongs in the ruling.

## Attribution of e1e5
**May it run: yes.** The pull is closed, and what the records bar is attribution *feeding a fit* (`…04dc7cd4`, `…aa971f0b`). Reading a closed candidate is not a fit. The form is `arch-ABC-239-f3f4`'s: a PREREG sealed first, family swaps, under the host lock. That took about 4 min of host against a 1.5 h cap, so no owner word is needed for the time. It is the Orchestrator's to send.

**It may feed:** the record of why; ADR lines; `ADR-0070`'s forecast that these features carry the distinction; and the owner's choice between **stop** and **wait**.

**It may not feed:** any value, bound, relation row, free set, data choice, λ or configuration of a later fit; which term is built next; a case about depth or a re-read.

**The limit of that fence, stated plainly.** The first pull's attribution did feed the second pull: it named E4a, and E4a went first. E4a was already on the list, but the row set the order, and that route has now missed. A result cannot be un-read. Whatever a new attribution names fails test 3 from then on.

**Recommended: do not run it now.** His answer does not need it, and each result I can foresee points at an action the rules bar (a term to freeze, a relation to add). It costs little, so if he wants to know why, run it after his answer, as a record.

## `UNKNOWN - verify`
- Why e1e5 stays ahead on `dd88560f`, and whether holding U at 0 is part of it.
- Whether any fit on any feature set holds the row.
- Whether a fitted table would gain on play.
- Whether hand-valued E3b to E6 would pay.
