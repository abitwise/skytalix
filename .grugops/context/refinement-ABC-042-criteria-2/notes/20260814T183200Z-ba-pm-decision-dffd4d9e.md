---
id: 20260814T183200Z-ba-pm-decision-dffd4d9e
kind: decision
by: ba-pm
at: 2026-08-14T18:32:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - ABC-041
  - RF-7
  - RF-9
  - agent-factory/checklists/definition-of-ready.md
  - plans/tickets/ABC-042-entry-point-argv-and-the-first-frame.md
  - plans/board.md
supersedes: 20260814T175900Z-ba-pm-decision-c3715e61
---

# `ABC-042`'s DoR, re-checked after `RF-7`…`RF-10`: **10/10 MET** — and the previous 10/10 was wrong for one hop

**This supersedes `…decision-c3715e61` because one sentence in it is measured false and two rows of its
score did not survive that measurement.** Everything else in it is carried forward below, so folding the
old note out loses nothing. Superseding my own note here is routine correction, not retraction under
pressure: the Orchestrator did the same on its own note this hop, and Security did it on `RULING 2`.

## THE CORRECTION — the sentence that was false

`…decision-c3715e61` scored item 4 ✅ partly on this:

> *"the undocumented fifth argument fails `A6`(ii)"*

**That is false.** Security ran it: a resolver recognising exactly `--debug` ships **green in 10/10
seeds** against `A6`(ii)'s 1000 generated tokens — `P(a generated token is exactly "--debug")` ≈ 1.4e-12,
≈ **1.4e-9** over the corpus (`…observation-93c48ef8` §3). It fails **`A6`(i)** — *"no other token
does"* — which as worded then had **no stated instrument at all**. That is `RF-7`, and it is why `RF-7`
exists.

**What I actually got wrong, named precisely.** I asserted a *property over an infinite complement* had
been made *mechanically checkable* by pointing at a **sample**. The repair I shipped was real — before it,
no criterion said anything about the complement, and (ii) kills four whole classes of wrong build — but I
credited the sample with the one build a sample structurally cannot catch: the targeted literal. **I did
not run it.** Security's discharge test (*"a repair discharges only if the previously passing-but-wrong
build now FAILS a named criterion"*) is the right test, and on `--debug` my own answer to it was wrong.

## The re-check of item 4, which is what I was asked to do

**Item 4 — acceptance testable and measurable.** The kit line is *"testable and measurable — a number, a
state, or an observable outcome, never 'works'/'looks right'"*.

- **At the moment Security measured (2026-08-14 18:12), item 4 was ⚠️, not ✅.** An instrument that
  catches its target with probability 1.4e-9 is not an instrument; `A6`(i)'s *"no other token does"* was a
  criterion with **no** way to decide it, and the build it exists to catch — **the original HIGH's own
  scenario** — was shipping green. That is precisely what item 4 forbids. **The 10/10 did not survive
  contact with a measurement, and I am not defending it because it is mine.**
- **After `RF-7`, item 4 is ✅ and the ✅ is stronger than the first one was.** `A6`(i) is now structural:
  the accepted set is exported **data**, asserted **element for element against `## Scope`'s table, both
  ways, no extras**; membership is exact string equality; **rejection is the default branch**; the
  enumeration is the only argv literal in the resolver; and 18 near-miss tokens derived from the table
  itself must be rejected in their legal argv position. The `--debug` build is now **RED
  deterministically** — not with probability 1.4e-9 — and so are prefix-matching and case-folding, which
  escaped *both* instruments before. Checked before shipping: those 18 derived tokens collide with the
  accepted set **0** times, so the clause cannot red a legal build.

**Item 6 dipped too, and for a harder reason — I am recording it unprompted.** `RF-9` means `BAR 1b`
permitted `execFileSync` in one sentence and forbade *"occurrences of `exec`"* in the next, over a file
that **must** contain `process.execPath`. A bar that is guaranteed to red the correct build is not a
measurable target; it is a broken one. **Item 6 was ⚠️ in the same interval**, and is ✅ now that the bar
asserts call sites (with both regexes on the page) and bar 4's grammar covers `node:http2`.

## The verdict

> **`ABC-042` DoR: 10 of 10, MET — after `RF-7`…`RF-10`.**
> **In the interval 2026-08-14 18:12 → 18:30 the honest score was 8/10**, items 4 and 6 ⚠️.
> The 10/10 stands **because the instruments were repaired**, not because the earlier score was defended.

Both dips have the same shape and it is worth naming: **every one was a criterion that could not decide
the build it was written for.** That is the failure mode this project's rule 1 exists to catch at the
`Ready for Dev` exit, and it was caught there — by measurement, one role removed from the author. The
process worked; my first score was the thing that did not.

## Carried forward from `…decision-c3715e61`, unchanged

Re-scored against `agent-factory/checklists/definition-of-ready.md` (ten lines), by BA/PM. **DoR scoring
is this role's; no other role scores it.** Was **8/10 with 2 ⚠️** at the cut, 2026-08-13.

**The two ⚠️ that moved, and why.** Both were the same fact: **`ABC-041` was open.** It is not.
`plans/board.md:181` records it **MERGED to `main` and `Done` 2026-08-13**, gate
`READY_FOR_HUMAN_REVIEW` after two blocks, 827/827 on 29 files.

- **Item 3 (INVEST) ⚠️ → ✅.** The ticket was *"not independent: `ABC-041` must land first"*; that
  dependency is closed, so all six letters hold. **Small is unchanged at `M`** — both repair hops add
  assertions to one new test file and one array element to a merged one: **zero production lines, zero new
  spawns.**
- **Item 10 (no major unresolved blocker) ⚠️ → ✅.** The one open ordering dependency is closed and every
  question the page held open is **ruled on the page**: the bars' file scope (`RF-5`), the
  `process.stderr` uniqueness rule, `A7`/`A8`'s *"emitted stream"* = stdout, the licence edit (`A12`), and
  the `ADR-0011` clause-1 trigger check.
- **Item 6's other half stands.** Every bar is decidable **as worded** over a **stated file scope**: bar 1
  by `grep`, `BAR 1b` by `grep` over the test file, bar 2 by a byte assertion over a captured stream with
  a non-vacuity control first, bar 4 by a specifier **grammar** plus three global tokens. Security's
  original table marked all three bars *"measurable as worded? No"*; that is what the repairs moved. The
  firing threshold was **relabelled a review obligation** — it could fire nothing, the security half being
  declared fired unconditionally three lines above it.
- **`A11` remains a recorded reading rather than a suite assertion BY DESIGN** — a wall clock in a shared
  lane is a flake generator. It carries a number, a protocol and an owner, so it is measurable without
  being automated, and the page says so rather than glossing it.
- **Nothing was scored ✅ to reach a round number** — restated, and now with a case that proves it costs
  something: the first 10/10 is corrected above rather than defended.

## What 10/10 does NOT mean — the three separations, one of which has moved

1. **DoR met ≠ the BLOCK discharged.** **The block IS now discharged** — by **Security/NFR**, on
   measurement, 2026-08-14, `RF-1`…`RF-5` verified by running them. **Not by this score, and not by me.**
   The security half stays **triggered and NOT waived**, `RF-7`…`RF-10` were required fixes at
   medium/low, and the ASVS review of the delivered **code** is a separate reading at the gate.
2. **DoR met ≠ the `Ready for Dev` exit passed.** That exit is the Orchestrator's, under project rule 1.
   Unchanged.
3. **DoR met ≠ the board moved.** BA/PM owns `Backlog → Ready`, but `plans/board.md` was off-limits on
   both repair hops (`RF-6` is the Orchestrator's, this hop). **The move is owed and untaken**, and the
   ticket's frontmatter is deliberately still `status: backlog` / `column: Backlog` so the ticket and the
   board do not disagree. This board has a recorded history of stale row text surviving multiple hops.
