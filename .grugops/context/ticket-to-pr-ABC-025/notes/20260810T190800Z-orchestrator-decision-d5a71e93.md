---
id: 20260810T190800Z-orchestrator-decision-d5a71e93
kind: decision
by: orchestrator
at: 2026-08-10T19:08:00Z
verified_by: 
confidence: high
refs:
  - ABC-025
  - ABC-026
  - N5
  - src/san.qualifier.hardening.test.ts
  - plans/board.md
supersedes: 20260810T174800Z-orchestrator-decision-a91f3c56
---

# Ruling: `N5`'s breach is ACCEPTED, the corpus is kept, and `ABC-025` goes forward. My candidate is dead on both counts

The owner asked for the issue fixed. It cannot be fixed in the sense of *made to meet the bar*, and
the reason is now measured rather than argued. This note rules and moves the ticket.

## My candidate is dead, and it failed for the more embarrassing of the two possible reasons

I proposed dropping `A1`'s unassisted call form and inferred **net ~1.6%** from two roles' numbers.
The Engineer checked the arithmetic before checking the idea:

> `gross +7.4% − floor +5.8%` subtracts a **two-file floor from a one-file gross**. Security/NFR's
> variant was one file; BA/PM's floor was two.

**At matching file counts the candidate reads gross +9.9%, net +5.2% — over the bar.** It never bought
the number. I made exactly the error this ticket has been prosecuting for six hops — combining two
measurements taken under different conditions — and I made it in my own favour, which is the direction
that should have made me slowest.

It also fails on coverage. The Engineer **built the mutant I asked him to try to build**: a wrong build
whose two call forms diverge on **350** derived positions and **zero** of `A5`'s 23 and **zero** of
`ABC-013`'s 18. On the delivered net exactly one test kills it — `A1`'s both-call-forms row — and with
that half dropped it **survives 676/676**. He then argued *against his own finding*, noting the mutant
keys on move counters and that "constructible" proves too much, and refused to shelter in the
"no current mutant sees it" argument that QE refuted and Security/NFR upheld. The refusal stands on
the arithmetic regardless.

## The decision space, complete and measured

| option | `N5` | cost |
|---|---|---|
| **as delivered** | **+7.3% / +8.2% net** (Engineer, two admissible runs; reproduces BA/PM's +7.8% on a harness sharing no code) | ~+180 ms on a ~1.7 s lane |
| assisted-only (mine) | **+5.2% net — OVER** | loses a constructible wrong build |
| corpus narrowing to 23 (BA/PM's) | **~3.8% net — MEETS** | deletes 184 positions from the property |

**The middle path is gone.** What remains is: accept a measured, bounded cost, or cut the corpus.

## The ruling, and why it is not close

**Accept the breach. Keep the corpus.**

`ABC-025` exists **because `ABC-013`'s net was too thin** — six wrong builds passed 652/652. Trading
corpus coverage back to satisfy a ratio the ticket invented for itself would be undoing the ticket's
purpose to make its own bookkeeping tidy. The cost of not doing that is one measured number: about
180 ms, once, on a lane that runs in under two seconds.

Everything the config treats as blocking is green: `mandatory_gates` (lint, typecheck, unit, build)
all exit 0, `security.block_on: high` with nothing high or medium, both gate roles PASS_WITH_RISKS
with **no required fix**. `N5` is a self-imposed NFR bar that its own author has already dispositioned
as an accepted, owned risk with a named trigger.

**The real problem is not this ticket's and never was.** A per-ticket ratio structurally cannot see an
accumulating total — the lane's health is a cumulative budget question, and that is `ABC-026`, cut into
`Backlog` for exactly this. `N5` was the wrong instrument, applied honestly, and it produced more
knowledge about this project's measurement discipline than a passing bar would have.

## Why I am ruling this now, having declined to two turns ago

I declined because a compliant alternative sat on the table and the trade between "slower inner loop"
and "broader corpus" was the owner's to take. **That trade no longer exists**: the middle option is
over the bar *and* loses a real wrong build, so the choice collapsed to "accept a bounded measured
cost" or "undo the ticket". The owner has asked for it resolved. Recording the collapse and ruling is
the responsive act; bouncing an unchanged question back a second time would not be.

## Board and gate status — no re-gate is owed, and that is verified rather than assumed

This hop wrote **zero lines under `src/`** — the first on this ticket in either direction. The tree is
**byte-identical to the one QE and Security/NFR gated**:

```
src/san.qualifier.hardening.test.ts   856ebab15128d8b5945c3038401eeda5   (QE's recorded hash)
src/san.suffix.hardening.test.ts      c8beb69c1c4169bde319196c3e138eac
src/san.ts                            cbcc3be37c21414d16e8e6b4d0c68959   (unchanged, six hops)
src/ diff vs main                     +823 / −0, two files, both *.test.ts
lint / typecheck / build              exit 0
npm test                              676 / 676 on 22 files, skip 0
```

Their verdicts therefore transfer without an inference. `In Development` → `Ready for UAT`.

**UAT deferred → `EPIC-006`, explicitly NOT passed** — zero non-test runtime importers, no `bin`, no
`main`. Same ruling every ticket since `ABC-004`, same measured reason.

## What is owed after this

- **`ABC-026`** — the cumulative default-lane budget. `Backlog`, DoR explicitly not met. This is where
  the lane's health actually lives.
- **Two false parentheticals in `ABC-025`'s own criteria** — `A5`'s "no mutant turns it red" (false;
  three roles have now measured it red for call-form mutants) and `A1`'s "6.3–16.8 ms" (a
  single-call-form plain-node figure for a criterion that makes 11,048 renders). BA/PM's to fix; not
  created by any hop after the cut. **Neither is normative** — no criterion's requirement disagrees
  with the code.
- The Engineer's coverage-preserving restructure, built and **deliberately not shipped**: its sign
  flips between admissible runs, it costs +38 lines, and it would send a gated file back through two
  gates for a benefit indistinguishable from zero. Correct call. It is in his note if anyone wants it.
