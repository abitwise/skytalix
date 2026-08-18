---
id: 20260819T160500Z-ba-pm-decision-abc-109-cut-and-the-guard-ruled-owed-3f9a21c4
kind: decision
by: ba-pm
at: 2026-08-19T16:05:00Z
verified_by:
confidence: high
refs:
  - ABC-109
  - ABC-108
  - ABC-037
  - AGENTS.md
supersedes:
---

# ONE ticket cut — `ABC-109`, `M`/`P1`, DoR 9/10 ⚠️x1 — and the guard question is RULED on the page

`plans/tickets/ABC-109-agents-md-is-near-a-cap-that-truncates-silently.md`. Owner named on the
page: **the `AGENTS.md` Scribe**. **The remedy's SHAPE — compaction, extraction, restructure — is
fenced OUT of the page and is the Scribe's**, and amending what any directive SAYS is fenced out
too, with a re-size trigger that **stops the hop** rather than growing it if the budget cannot be
met without one.

## What I did not do, deliberately

**I did not edit `AGENTS.md` and I did not cut any content out of it.** I cut a ticket. Nothing
under `src/`, no column moved, no merge, no deploy. **One ticket only** — everything else I found is
recorded in the observation note and routed to the Orchestrator rather than absorbed here.

## The page refuses to read as a trim, because the measurement refuses to

The Scribe reported that every remaining paragraph is a pointer to an owner directive or a
kit-override precedence note. **I measured where the bytes actually are before writing a word of the
page, and the measurement agrees with the Scribe rather than softening it: six sections hold 58.0%
of the file and every one of them is exactly that kind of section.** So the page states in its own
heading that this is **not** a trim-the-fat exercise: something load-bearing moves somewhere it is
still read, or the file is restructured. **There is no slack pile and the page does not pretend one
exists.**

The one piece of raw material I gave the Scribe without prescribing anything: **16 HTML comment
blocks hold 4,657 bytes, 16.8% of the file**, four of them 555–771 bytes each. What that means for
the remedy is the owner's call, and the page says so.

## The acceptance criterion that carries the whole ticket

**`A2` — a NINE-ROW MINIMUM before/after table, every "after" cell verified by OPENING the
destination and finding the text.** A path that looks right is not a pointer that resolves. The
enumerated minimum is: the 2026-08-15 merge/test/UAT/deploy grant; the 2026-08-16 signature ruling
*and its explicit "NOT a kit override"*; the 2026-08-17 zero-production-lines UAT waiver *and its
"this IS the third override"*; the 2026-08-17 QE-dispatch directive *and its "NOT an override"*; the
branching model override; the deployment posture override; `ADR-0007`; `ADR-0008`; the kit-vs-state
precedence rule. **The override count reads THREE before and THREE after**, and the sentence telling
a reader who counts four that they are wrong must survive somewhere a reader of `AGENTS.md` reaches.

**The failure mode this exists to catch is named on the page in those words: a diff that shrinks the
file and drops a directive.**

`A1` carries the measured byte count with headroom stated **twice** — as bytes against 32,768 and as
**edits at the measured +1,159 B/edit**, because a percentage does not tell a reader how many hops
they have left. **`A1` is measured on the INTEGRATED content (29,749), not on `main`**: a shrink
measured against a tree that will not exist by merge time is not a measurement.

## The guard: OWED. A new test file: NOT owed. Both halves ruled, neither reflexive

`ABC-108` says the default lane's budget is spent, so I weighed the cost instead of adding a guard
by habit:

- **What `ABC-108` makes unaffordable is a test FILE** — its own reading prices the lane at
  **341–383 ms all-in per file**.
- **What this guard needs is not a file.** `src/cli.test.ts` already reads `AGENTS.md` from the
  repository root in **four** places. A byte-length comparison against a named constant is one more
  read of a ~28 KB file — no spawn, no fixture, no collection cost. `A6` requires that cost be
  **measured and stated**, not assumed.
- **So the guard is owed and the file is not.** Placement in `src/cli.test.ts` is offered as the
  cheapest site I could identify; the final placement is the implementer's, on one condition — **the
  file must already exist and already read `AGENTS.md`**.
- **It must be a byte count, never a hash or a line count.** `ABC-059` is on this backlog because a
  guard pinned a spelling instead of a fact.
- **And it must be watched RED before it ships** (`A5`), which is the standing rule the Scribe landed
  in `AGENTS.md` itself on this very hop. The guard obeys the rule written in the file it guards.

**Without it, `A1` is a number that was true the day it was written** — and this repo has recorded
that failure twice already.

## Size `M`, priority `P1`, and the arguments are on the page not in this note

`M` because 58% of the mass is load-bearing and the **preservation proof is most of the work**; not
`S` (there is no slack to trim), not `L` (no code, destinations already exist). `P1`: **not `P0`** —
nothing is truncated today and using priority to express alarm is what the first paragraph is for;
**not `P2`** — the margin is 2.6 edits, the failure is silent and tail-first, and every hop before
the ruling spends headroom nobody measures. **Promotion trigger stated in advance: `P0` at > 31,000
bytes on any branch, or on the first report of a read missing `## When uncertain`.**

## DoR 9/10, and the ⚠️ is not smoothed

**Item 5, and it is ORDERING rather than an unanswered question:** two unmerged branches carry
**+2,059 bytes** of this same file and **both touch `### Test`** — a restructure of that section
beside a live amendment of a comment inside it is a conflict in the densest region of the file.
**Not marked ✅**: the integration is the Orchestrator's and has not happened, so the tree this
ticket restructures is not the tree on `main`. Item 10 IS ✅ — the owner is named, the guard question
is ruled here rather than deferred, and no environmental precondition is needed.
