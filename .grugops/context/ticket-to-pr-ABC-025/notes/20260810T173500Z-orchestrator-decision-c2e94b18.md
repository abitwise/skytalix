---
id: 20260810T173500Z-orchestrator-decision-c2e94b18
kind: decision
by: orchestrator
at: 2026-08-10T17:35:00Z
verified_by: 
confidence: high
refs:
  - ABC-025
  - ABC-026
  - N5
  - RISK-ABC013-04
  - src/san.ts
  - plans/board.md
supersedes: 
---

# `ABC-025` is gated green and **NOT MERGED** — it carries a knowingly-unmet bar of its own, and the trade behind that goes to the owner

Five hops: cut, implement, QE, Security/NFR, and a ruling by the bar's own author. Every mandatory
gate is green. One bar the ticket set for itself is not met, deliberately, with a compliant
alternative refused for a stated reason. **That last sentence is why I am not turning the key.**

## State, verified on my own instrument at the close

```
md5 src/san.ts     cbcc3be37c21414d16e8e6b4d0c68959   unchanged through all five hops
src/ diff          +823 / -0 over two files, both *.test.ts
deletion lines     0
npm test           676 passed / 676 on 22 files      (652 -> 676, +24)
skip count         0
lint / typecheck / build   exit 0
PERFT_DEEP=1       32/32 exact                        (QE 36.76 s, Security/NFR 36.55 s)
branch             10 commits ahead, 0 behind, 0 merge commits — a clean fast-forward
```

`A1`–`A6` all green. `A6` — the ticket's one hard bar — was re-checked independently by the Engineer,
QE, Security/NFR and me, on four instruments, and holds every time: **zero production lines**.

## What `N5` turned out to be, which is worse and more useful than "a missed bar"

The bar read *"the tests this ticket adds cost ≤5% of the default `npm test` wall clock"*, set at the
cut against a measured 0.4–1.2%.

Five instruments later:

- **The Engineer** measured +12.5% and reported it against himself rather than narrowing the criterion
  that caused it.
- **I** reproduced it at +10.3% by A/B — the file moved out and back.
- **QE** got +6.7% wall and ~18% file time, and noticed the lane's own noise (~330 ms) exceeds the
  bar's whole budget (~85 ms).
- **Security/NFR** ran a **null control by identity** — the bar's own comparison applied to a
  byte-identical tree — and it reported **+0.7% to +6.0%**. A change that is literally nothing can
  trip a 5% bar. At that point neither a pass nor a fail is supportable, which is a different and
  worse fault than a miss.
- **BA/PM**, ruling on their own bar, found the fault underneath all of it: **nobody had measured the
  floor.** Two trivial one-assertion test files cost **+5.4% / +6.1%** of the lane's CPU. **`≤5%`
  stated gross was unmeetable by construction by any ticket adding two files, including two empty
  ones.** Every earlier conclusion — including "narrowing doesn't buy compliance" — was measured
  against a bar shape nothing could satisfy.

The re-derived bar names its statistic, sample, isolation clause and denominator, and is admissible
only if a null control by identity reads ≤1% and the fixed floor is subtracted and reported. Against
it the delivered tree reads **net +7.8%** — still 1.6x over. **The breach is accepted, owned by BA/PM,
trigger fired now and again at the `EPIC-003` cut.**

## The one decision I am not making alone

**A compliant alternative exists.** `A1` over the ticket's 23 positions instead of 207 is a two-line
change, green at 676/676, and measures **~3.8% net — inside the re-derived bar.**

BA/PM refused it, and the reason is a consistency one rather than a technical one: its evidence
("all five mutants still die on the 23") is the same species of argument QE refuted and Security/NFR
upheld against the Engineer. They declined to accept for their own bar the argument they had upheld
QE in rejecting for someone else's, and put the trade on the record **with its price so a human can
take it in one reading**.

I think that refusal is right. I also think a role should not be the last word on it, because the
trade is *"a slower default lane"* against *"a broader corpus under the property"*, and the default
lane is the inner loop every future hop on this board pays for. **That is a judgment about how this
project wants to spend its own time, which is the owner's, not mine.**

## Why I am not merging, stated as a limit rather than a hesitation

The owner's standing directive authorizes merging work that **PASSED**. This ticket's acceptance
criteria pass; a bar it set for itself does not, knowingly. Reading "passed" to include "passed except
for the bar it wrote itself, where a compliant option was available and declined" is exactly the kind
of quiet widening this board has spent five tickets refusing. **Urgency is when the gate matters most,
and there is no urgency here at all.**

Nothing is deployed. `production_requires_human_confirmation` stays `true` and a human holds deploy.

## UAT — deferred, explicitly NOT passed

`src/san.ts` has **zero non-test runtime importers** and `package.json` declares no `bin` and no
`main` — both re-checked here. Deferred to `EPIC-006`, the same ruling every ticket since `ABC-004`
has taken for the same measured reason. A UAT pass would be a fabrication.

**A verification error of mine, recorded:** my first importer check matched `src/history.ts`, which
would have contradicted five hops of record. The match was a **comment** in that file saying it does
*not* import `san.ts`. My grep read prose as code. Caught by checking the hit instead of reporting it.

## My errors on this ticket, all four

1. **My prescription at `ABC-013`'s close was wrong** — "the minimality property closes all five plus
   three more". It closes three of six and does not touch `Q13`. A ticket written to it would have
   shipped believing it closed five. Caught by BA/PM re-deriving instead of inheriting.
2. **I passed `N5` at the Definition-of-Ready gate.** I re-ran that checklist myself and confirmed
   *"security/NFR triggers marked, each with a measurable target"* — against a bar that was unmeetable
   by construction and could be tripped by an empty file. I verified 16 of the ticket's 63 strings and
   never once tested the bar. **The single most expensive item on this ticket passed through the gate I
   personally re-ran.** BA/PM has since marked that DoR row falsified in place: 9 of 10, not 10 of 10.
3. **Two invented timestamps** on hop briefs, ~11 minutes ahead of the machine clock. Caught by the
   Engineer, who recorded the real reading rather than smoothing to match mine.
4. **The `history.ts` grep** above.

The four are the same shape as the five I made on `ABC-009`: trusting an instrument without testing
the instrument. Number 2 is the one that matters, because a Definition-of-Ready gate exists precisely
to catch an unmeasurable acceptance target, and mine did not.

## What this ticket leaves behind

- `RISK-ABC013-04` **closed** — the five gaps that opened it are shut, plus a sixth BA/PM found and a
  seventh class QE found (a qualifier and a suffix on the same string: four builds passed 672/672,
  because zero of the repository's 111 hand-typed rows carried both parts).
- **`ABC-026` cut** into `Backlog`, DoR explicitly not met: the default lane has no cumulative budget,
  only per-ticket ratios, and a per-ticket ratio cannot see an accumulating total.
- 10 owned risks, each with a named owner and a trigger.
- Four consecutive hops have now recorded that this install has **no `scripts/context-io.*` and no
  `claim.*`** — every role verified it at the source rather than inheriting it, and every claim was
  taken by hand with an atomic `mkdir`. That is a substrate gap, not a role failure, and it is mine to
  carry.
