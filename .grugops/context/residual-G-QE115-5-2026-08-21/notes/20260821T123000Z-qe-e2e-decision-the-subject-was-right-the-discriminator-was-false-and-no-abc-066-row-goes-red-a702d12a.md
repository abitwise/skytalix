---
id: 20260821T123000Z-qe-e2e-decision-the-subject-was-right-the-discriminator-was-false-and-no-abc-066-row-goes-red-a702d12a
kind: decision
by: qe-e2e
at: 2026-08-21T12:30:00Z
verified_by:
confidence: high
refs:
  - G-QE115-5
  - ABC-066
  - ABC-115
  - ADR-0016
  - A1
  - A10
supersedes:
---

# RULING ON `G-QE115-5`: OPTION **3**. THE GUARD'S SUBJECT WAS RIGHT, ITS STATED DISCRIMINATOR WAS FALSE, AND THE RED IT WOULD HAVE THROWN BELONGS TO THE INSTRUMENT — NOT TO `ABC-066`

**The subtask offered three. I am taking (3), and it is not a dodge of (2): it is (1)'s subject with
(2)'s honesty, and it decomposes the guard into two things the brief treats as one.**

A derivation has a **subject** (which children it is about) and a **discriminator** (how it picks
them out). `ABC-066`'s row had **the right subject and a false discriminator**, and it was green
because a third thing — a wrapper — hid the disagreement between them.

## Why not (2): `ABC-066`'s criterion is NOT false about the product

`A1` reads: *"Given each refusal child … the usage line on its stderr contains `npm run chess -- `."*
**Measured on the delivered build: 6 of 6 refusal children carry it.** The criterion holds.

`unwritableStdout` is not a counter-example to it. Its command line is `--ascii`; **the resolver
accepted it and the session started**. It is a failed write, not a refused command line. Making the
row assert a usage line of it is asking `ABC-066` to guarantee something it never claimed — and the
measured red says so in as many words: **`expected 'Node.js v24.12.0' to contain 'npm run chess -- '`**,
i.e. this row demanding a usage line from Node's crash banner.

**So no `ABC-066` row goes red, and I did not narrow anything to keep it green.** I want that
distinction on the record because the subtask rightly warns about it: the test of "narrowed to dodge"
is not *did the row stay green*, it is *did it lose reach*. Five mutants say it lost none and gained
one (`…13d0dd9e`, `M5`: old GREEN, new RED).

## Why not (1) as written: the filter was **not** already principled

The row's comment claimed a discriminator: *"a refusal is a non-zero exit that is NOT marked an
internal error."* **That sentence was true when written and stopped being true on 2026-08-21.**
`ABC-115` gave the product a **third** non-zero shape — a re-thrown non-`EPIPE` stdout write, exit
`1`, unmarked, no usage line — so non-zero-and-not-internal-error no longer identifies a refusal.

**And the code was not even doing what the comment said.** It read `child.status`, the **wrapper's**,
so it never saw the product's `1` at all. It reached the right count **by accident of a trap its own
neighbour documents** (`unwritableStdout`: *"A ROW THAT FALLS IN IT IS GREEN ON EVERY BUILD"*).

**The row's comment defended derivation against listing:** *"a listed set would go stale the day a
further criterion refuses a command line this row cannot see."* **That day arrived, and it arrived to
the derivation the sentence was defending** — the row could not see a child at all, which is worse
than a stale list, because a stale list is visible in the source. Saying so plainly, as instructed.

## What I did instead — the subject stated in the criterion's own terms

`refused` is now **every child whose command line `resolveOptions` refuses**, read off a
`productArgv` recorded at each spawn site. The exit code is no longer how the set is *identified*; it
is something the row **asserts about** the set, through a new wrapper-transparent `productExitOf`.
Both of the old filter's clauses survive as assertions. A converse assertion is added: **no child
outside the set advertises the separator** — which is what actually ends the blindness, because a
refusal this derivation somehow could not see would now red from outside it.

`productArgv` is a **required positional** on `childOf`, never defaulted, so a future child cannot
join the capture with its command line unstated and drop silently out of the set. That is the same
"a guard must never pass by being unable to look" discipline the file already applies elsewhere.

## The pre-registered trigger: it did NOT fire, and it came one honest fix from firing

The accepted residual (`…8a4b2e69`) pre-registers: *"any hop, gate or script measured taking a wrong
routing decision off this path's `1`."*

**No delivered artefact takes one.** The shipped guard is blind, so it routes nothing off that `1`.
**But the naive honest fix — making the filter wrapper-transparent and stopping there — does exactly
that**, and I measured it doing it: it classifies a crash as a refused command line. I am recording
this as a **near-miss, not a firing**, because the trigger is written about a measurement on a real
artefact and I am not going to inflate my own probe into one. **The next hop that makes an exit-code
reader honest without also fixing its subject WILL fire it.**

## How to overturn this on the same evidence

Show that `ABC-066` `A1`'s *"refusal child"* was meant to mean *"any child the product refuses to
complete"* rather than *"any child whose command line the resolver refuses"*. On that reading the
seventh child belongs in the set, the row is genuinely red, and (2) is correct. **I rejected it on
`ABC-066`'s own page** — its Problem, Scope and all four criteria are about a mistyped command line
and the message that answers it, and `A2`'s expansion is expressly about what `resolveOptions`
accepts. **The ticket is about the resolver's refusal, not about every way a session can end badly.**
