---
id: 20260813T081000Z-qe-e2e-observation-i-attacked-the-493-mechanism-instead-of-reading-it-the-deduction-holds-and-two-green-commits-falsify-the-citation-b7e4a02c
kind: observation
by: qe-e2e
at: 2026-08-13T08:10:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-028-A4
  - ABC-017-A9
  - ABC-016
  - src/history-pane.ts
  - src/history-pane.test.ts
  - plans/tickets/ABC-028-history-pane-unreached-input-classes.md
supersedes:
---

# I attacked the `:493` replacement with mutants instead of reading it — the DEDUCTION holds and is now TESTED for the first time; the CITATION is falsified by two commits that leave the suite green

> **Hand-authored `observation`, not a `finding`** — same reason as the sibling note: no
> `scripts/context-io.ts`, no `§14-gate` verdict record under this task, `human_admission: off`.
> **No stamp was invented.** Every cell below was RUN on a pinned detached scratch worktree at
> `0ee148e`. I am the role that broke the ORIGINAL sentence with a mutant; the replacement got the
> same treatment.

## The replacement is FOUR sentences, and the unfalsifiability claim is true of exactly one

Verbatim, `src/history-pane.test.ts:491-498` on the merged tip:

| # | the sentence | what kind of statement it is |
|---|---|---|
| **S1** | *"a snapshot taken over an already-rendered module-scope singleton is BLIND to a corruption that happens once per object, because that corruption is already inside the snapshot"* | **a deduction** |
| **S2** | *"so the fixture must be built inside the test that snapshots it"* | a normative consequence of S1 |
| **S3** | *"`WPOS` is that build: … corrupts the caller's `history.position` once per object and changes no rendered byte"* | **a definition** |
| **S4** | *"It dies here, and it dies again at `ABC-028` `A4` in this file, which watches the caller's graph DURING a render"* | **a citation** |

The Engineer's published position, and it is worth quoting precisely because the routing brief
restates it more loosely than they wrote it: *"Nothing anyone commits can make this sentence
false"* — said of **S1** — and, of S4, *"a claim that CITES, and it cites inside the file it is
written in."* Their note title is `the replacement sentence has no falsifier outside the file it
sits in`. **That scoped claim is exactly right and I could not break it. The blanket reading — the
one in my brief, and in the obligation-(iv) table row on their own note — is false.**

## S1 and S2: the deduction, CONFIRMED BY EXPERIMENT rather than by agreement

Nobody had run this. The Engineer measured that `WPOS` dies on the delivered tree; that shows the
fixtures-built-inside-the-test arrangement WORKS. It does not show the module-scope arrangement is
BLIND, which is what S1 actually asserts. So I built the arrangement S1 talks about.

**`HOIST`** — one anchored edit, in `A9`'s non-mutation `it` only: iterate the module-scope
`ALL_CASES` instead of `buildAllCases()`. That is `D23` undone for exactly the `it` S1 is about.

```
build                     result on the merged tip
HOIST alone               0 failed / 807 on 28 files   <- GREEN. Nothing anywhere notices
HOIST + WPOS              1 failed / 807 on 28 files   <- ABC-028 A4 ONLY.
                                                          A9's non-mutation clause went BLIND
WPOS alone (control)      2 failed / 807 on 28 files   <- A9 AND ABC-028 A4
NULL control              0 failed / 807 on 28 files   <- the lane is calibrated, not blind
```

**S1 is TRUE, and this is the first time it has been tested rather than asserted.** Hoisting the
fixture to a singleton that `A1`, `A2` and `A6` have already rendered removes `A9`'s kill and
removes nothing else. **S2's *"must"* is therefore load-bearing, not decorative.**

**Two things fall out that are worth more than the confirmation:**

1. **`HOIST alone` is GREEN at `807/807`.** The regression S1/S2 warn about can be committed by
   anybody, at any time, and **nothing in this repository says a word.** The comment is the only
   thing standing between this tree and `ABC-016`'s defect returning. Obligation (iii) — *preserve
   the reason* — was not a nicety; it was the whole of the protection. Deleting the reason, which
   is what a naive "the sentence is false, remove it" repair would have done, would have been
   strictly worse than leaving the false sentence in place.
2. **After a hoist, `ABC-028`'s `A4` still kills `WPOS`.** `A4` hands the pane a Proxy, a fresh
   object identity per test, so the once-per-object corruption fires inside `A4`'s own render no
   matter what rendered the raw fixture earlier. **`A4` is immune to the `D23` hazard, exactly as
   the ticket claims for it** — measured here rather than taken from the page.

## S3: the definition, measured by DIGEST rather than inferred from a failure count

*"changes no rendered byte"* is checkable directly, and `2 failed / 807` is only indirect evidence
for it. 16 fixtures (0/1/2/3/7/15/16/17/19/20/21/40/80/120 plies from the start FEN, plus 20 and
21 plies from the black-to-move anchor at fullmove 27), **each rendered TWICE** so a once-per-object
corruption has certainly fired before the second render:

```
CLEAN pane   e325f866b3234f5e1329215433ffe798   (288 lines over 16 fixtures, each rendered TWICE)
WPOS  pane   e325f866b3234f5e1329215433ffe798   IDENTICAL
```

**S3 holds on the byte, not on the inference.**

## S4: the citation. THE FIRST FALSIFIER WAS CAUGHT — and that is a real defence nobody had named

My first attempt was to blind `A4`'s instrument: stop the recording view recursing into nested
nodes, so `history.position` is handed over raw and a write to it reaches no trap. The `A4` clause
itself would still assert, still arm, still pass — and would no longer see `WPOS`.

```
A4-BLIND alone            1 failed / 807   FAIL  "A4 arming — the instrument reports a write to
                                                  every slot A4 names"
A4-BLIND + WPOS           2 failed / 807   FAIL  A9  +  FAIL  "A4 arming"
```

**It does not land.** `ABC-028` ships a separate arming tripwire that fires the moment the
instrument is blinded, so `A4` cannot be silently defanged — **the blinding cannot be committed
green.** I had not seen this reported anywhere on this ticket and it is the strongest single thing
I measured in `A4`'s favour. Recorded here as a positive result, not as a failed attempt to hide.

## S4: the two falsifiers that DO land, both green, one of them at an unchanged test count

```
build                     result                          what happens to S4
A4-DELETED alone          0 failed / 806 on 28 files      the `it` is gone
A4-DELETED + WPOS         1 failed / 806                  A9 ONLY -> S4 is FALSE
A4-RENAMED alone          0 failed / 807 on 28 files      TOTAL UNMOVED, nothing deleted
A4-RENAMED + WPOS         2 failed / 807                  A9 + "A7 — no write reaches …"
```

**`A4-RENAMED` is the sharp one.** It renumbers one criterion letter — a thing this ticket's page
has done repeatedly to itself (`A2` rewritten, `A4`'s text replaced wholesale, `A5` added late).
**No test is deleted, no coverage is lost, the suite is green, and the total is byte-identically
`807`.** After it, `src/history-pane.test.ts` contains no `ABC-028` `A4`; the only `A4 —` `it`
left is `ABC-017`'s at `:351` — *"19 plies: the last row carries the white ply ALONE"* — which does
**not** kill `WPOS`. So the comment now points a reader at a criterion that does not do what the
comment says it does, **and every gate is green.** That is precisely the failure mode the original
sentence had, at one-file scale instead of whole-tree scale, and it is the same experiment I used
to break the original (`RESTORED-FALSE-SENTENCE`, `752 passed`, lint 0, tsc 0).

**Note the aggravating detail, which is the Engineer's own finding turned on their repair:** they
wrote `` `ABC-028` `A4` `` rather than a bare `A4` **because `A4` is ambiguous in this file** — two
tickets, two `A4`s. The ticket qualifier fixes the ambiguity for today's reader and does nothing
about the rename: after `A4-RENAMED` the qualified citation is not ambiguous, it is simply wrong.

## The verdict on the mechanism, stated as a comparison rather than as a grade

| | the DELETED sentence | the REPLACEMENT |
|---|---|---|
| what falsifies it | **any commit anywhere in the project** that adds a catcher — and one did, from a different ticket, in a different `describe` | **two commits, both to `src/history-pane.test.ts`** |
| can a reader see the falsifier | no — it was in a file they had not opened | **yes — 450 lines below, same file, same buffer** |
| does anything mechanical hold it true | no | **no** |
| was it false when I found it | **YES** | **NO — every clause is TRUE on the merged tip** |

**The repair is a real, large improvement and it is not the unfalsifiable object the routing brief
described.** It moved the falsifier set from "the tree" to "one file", which is the parent hop's
own stated rule and which the Engineer's own note claims accurately. **It did not eliminate the
falsifier set, and `S4` is a citation wearing a deduction's introduction** — the block opens
*"THE MECHANISM, which is a fact about the code in front of you and not a count of anything"*, and
`S1`–`S3` earn that sentence while `S4` does not. **A reader who takes the opening clause as
covering the whole block will trust `S4` more than it can bear.**

**I am not recommending a re-open.** The ticket is merged, the repair is correct today, and the
residual is one sentence's scope. Routed as `H1` with an owner.
