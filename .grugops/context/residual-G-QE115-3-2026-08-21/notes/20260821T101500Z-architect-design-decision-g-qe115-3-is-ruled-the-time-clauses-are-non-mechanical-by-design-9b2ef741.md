---
id: 20260821T101500Z-architect-design-decision-g-qe115-3-is-ruled-the-time-clauses-are-non-mechanical-by-design-9b2ef741
kind: decision
by: architect-design
at: 2026-08-21T10:15:00Z
verified_by:
confidence: high
refs:
  - G-QE115-3
  - N8-SPAWN
  - NFR-008
  - ABC-115
  - ABC-108
  - ADR-0017
  - AR-N8SPAWN-DRIFT
supersedes:
---

# `G-QE115-3` IS RULED. **`N8-SPAWN`'s TIME CLAUSES ARE NON-MECHANICAL BY DESIGN — an account whose only mechanical pin is its COUNT is the CORRECT shape, and no lane, instrument or harness is owed.** But the residual does NOT close, because the hole that has teeth is a DIFFERENT one and it now has a name and an owner

I own `NFR-008`, its floor account and its spawn account. QE handed `G-QE115-3` to this role and to
`ABC-108` by name. **This is the ruling, and it is written so a later hop can overturn it on the same
evidence: the whole case rests on §1 below, and if §1 is wrong the ruling is wrong.**

## THE RULING, in four lines

1. **The `<= 2.0 s added wall` and `<= 0.30 s added CPU per added child` clauses SHOULD NOT be
   asserted by anything mechanical.** Not in the default lane, not in an opt-in lane, not by a proxy.
   **This is the intended shape, not a gap that was skipped.**
2. **What replaces the gate is NOT "nothing": it is a re-measure obligation on a NAMED TRIGGER, and
   the trigger is not the one anybody was watching.** It is written into the account and carried.
3. **A NEW accepted risk is opened — `AR-N8SPAWN-DRIFT`, owner Architect/Design** — for the live hole
   the count pin cannot see and the clauses as written do not even cover.
4. **An ADR IS owed and is written: `ADR-0017`.** Reasoning in §6.

`G-QE115-3` as QE framed it — *"two clauses are asserted by nothing mechanical"* — is **TRUE AS A
FACT AND WRONG AS A DEFECT.** It is dispositioned, not carried. What is carried is (3).

## §1 — WHY THEY CANNOT BE MECHANISED, and this is the load-bearing part

The count clause is mechanical and the other two are not, and **the difference is not effort or
taste. It is that they are different KINDS of quantity.**

**The count is a STATE property of the delivered tree.** How many children `src/cli.test.ts` spawns
is a fact about one tree, observable in-process, machine-independent, deterministic and free
(`spawned` is already incremented at the one `childOf` call site). That is exactly why it can be —
and is — pinned by `expect(spawned).toBe(17 + 7)`.

**The two time clauses are DELTA properties BETWEEN TWO COMMITS.** Read the clause in force
verbatim: *"`<= 2.0 s ADDED wall` AND `<= 0.30 s ADDED CPU (user+sys) PER ADDED CHILD` on
`npx vitest run --dir src`, measured as the MEDIAN OF >= 5 INTERLEAVED PAIRED RUNS AGAINST THE
IMMEDIATE BASE COMMIT, with the sign agreeing on >= 4 of 5."* **The referent of that sentence is not
the delivered tree. It is the difference between the delivered tree and a base commit.** A test
inside the tree has one tree. Three things follow and each alone is fatal:

- **(a) It is recursive and it costs more than the budget it guards.** To assert the delta, a test
  must check out the base commit, provide it `node_modules`, and run the ENTIRE default lane ten
  times (five interleaved pairs) — **from inside the default lane.** On my own readings (~4.6 s wall
  / ~16.6 s CPU per run) that is **~46 s wall and ~166 s CPU**, against `NFR-008`'s total of 3 s wall
  and 13 s CPU. **The guard would cost ~12.8x the entire budget it exists to protect, and it would
  spend it inside that budget.** A per-ticket bar of 650 ms cannot be policed by a 166 s assertion.
  This is not "expensive". It is arithmetically self-defeating.
- **(b) The instrument is the real machine clock and this project has ruled that out, everywhere,
  with no exception.** `plans/nfr-catalog.md`: *"No wall-clock assertion belongs in the suite: it
  would be a test that passes or fails on the machine that runs it."* I checked the tree rather than
  the prose — **the default lane contains ZERO real-clock assertions; every one in `src/` sits behind
  `ENGINE_DEEP=1`** (observation note §2). The escape hatch used everywhere else — `NFR-004` clause
  B's guard, the whole default engine lane — is an **INJECTED clock**, and it is unavailable here
  **by construction: the quantity these clauses name IS the real machine's real time.** There is
  nothing to inject.
- **(c) After the cut there is nothing left to protect.** These are **cut-time budget clauses**,
  adjudicated once, by a role, against one named base commit, and their answer is then history.
  `ABC-115`'s delta against `414ef75` is a settled fact; it cannot drift. A standing assertion
  guards a **live invariant**, and once the ticket merges these clauses no longer name one. **The
  live thing a later hop can break is the COUNT — and the count is pinned.** The account's design is
  therefore internally consistent: it pinned the one clause that survives the merge.

**This is not special pleading for `N8-SPAWN`. It is how EVERY budget clause on this project already
works.** `N8-LANE`'s 650 ms is asserted by nothing mechanical. The 160 ms per-file floor is asserted
by nothing mechanical. `NFR-008`'s own 3 s / 13 s is asserted by nothing mechanical — it was
measured by a role at `ABC-026`, re-measured by Security/NFR at `ABC-078`, and ruled BREACHED by
this role at `ABC-108`, all by hand. **`N8-SPAWN` is not the one account that lost its guard. It is
the only one that ever had one, because one of its three clauses happened to be a state property.**
A reader who sees the count pinned and infers the other two ought to be is generalising from the
exception.

## §2 — THE SHAPE QE NAMED, PRICED AND REJECTED

QE: *"the only arguable shape is an opt-in lane with an instrument and an interleaved-paired-run
protocol that does not exist today."* Correct that it is the only arguable one. **Rejected**, and
priced rather than waved off:

- **What would have to be built:** a base-commit checkout mechanism (worktree or clone) inside a
  test; `node_modules` provisioning for it; a paired interleaved runner; a `/usr/bin/time`-class
  CPU instrument portable enough to assert on; a median-of-5 with a >= 4/5 sign agreement statistic;
  and an identity null control, because without one the harness measures load. **Roughly the harness
  the `ABC-108` ruling built and DELIBERATELY DID NOT COMMIT** (*"the measurement harness ran
  entirely outside the repository and is not committed"*).
- **What it costs:** ~46 s wall / ~166 s CPU per invocation, plus a second checkout of the tree, plus
  standing maintenance of a statistical harness whose failures are load, not code.
- **Who owns it:** nobody. Architect/Design would own the bar; Security/NFR the gate check; the
  engineer the maintenance. **An opt-in lane runs at no gate**, so it would catch drift only when a
  human chose to run it — **which is precisely the state we are in today, at the price of building
  and maintaining all of the above.** The residual would be closed on paper and unchanged in fact.
- **And it would answer nothing in the default lane.** Every opt-in lane on this project
  (`PERFT_DEEP`, `SEARCH_DEEP`, `ENGINE_DEEP`, `INPUT_DEEP`) holds **repetitions and breadth of
  criteria that are ALSO answered in the default lane** — `AGENTS.md` says so for each of the four.
  **There is no precedent here for a clause answered ONLY in an opt-in lane**, and this would be the
  first.
- **And — the finding that decides it — IT WOULD NOT CATCH THE REAL DRIFT.** Measured, not argued
  (observation note §4): deleting one hook makes an EXISTING child run the real engine, costs
  **+2.68 s wall and +2.60 s CPU — 8.6x the per-child clause from a single child — and leaves all
  40 files / 1213 tests green**, count pin included. **The clauses are written on ADDED children.
  That mutant adds none.** So the harness above, faithfully implementing the clauses, would report
  compliance. **Building a 166 s guard that is green on the one mutant that matters is worse than
  building nothing: it converts an honest known gap into a false assurance.** This project has a
  rule for exactly this, learned at `ABC-037` and written into `AGENTS.md`: **never ship a guard you
  have not watched go RED.**

**Therefore: no ticket is owed for a mechanism, and I name none for one.** See §7 for the one ticket
I would have cut and did not, which is for something else.

## §3 — THE CHEAP PROXY IS ALSO REFUSED, and named so nobody re-discovers it

A source-level pin — grep `src/cli.test.ts` for `sleep`/settle budgets or for un-hooked `play()`
calls, and assert a ceiling — is cheap, machine-independent and default-lane-legal. **Refused.** It
asserts a **proxy for time, not time**, and this project has been burned by exactly that twice:
(i) `ABC-115`'s own `<= 0.5 s CPU` clause, derived by carrying `ABC-043`'s **64-72 ms of WALL** into
a **CPU** budget — impossible from the day it was written, *"it failed everything and therefore
nothing"*; (ii) `ABC-037`'s `heapUsed` memory guard, green on both builds, watched not to fail and
**deleted rather than shipped** (`AGENTS.md`, at length). **A third proxy-for-time guard is the same
mistake in a new costume.** If a future hop wants this, the bar is: watch it go red on the §4 mutant
first.

## §4 — WHAT REPLACES THE GATE. A re-measure obligation on TWO named triggers, with a carrier

Not nothing. The account already names carriers — *"Owner: BA/PM at each cut. Checked by
Security/NFR at each gate"* — and **neither owner, checker nor hop is changed here.** What was
missing was the TRIGGER, and one of the two was invisible:

- **`T1` — a hop that CHANGES THE NUMBER OF CHILDREN re-measures both time clauses under the
  account's protocol.** Already effectively enforced: the count pin **forces** such a hop to edit
  `N8_SPAWN` and write its reason, and it did so twice on `ABC-115` (+5→+6, +6→+7), with the time
  clauses re-measured at the repair hop. **`T1` is working and this ruling only writes it down.**
- **`T2` — a hop that changes WHAT AN EXISTING CHILD DOES — its argv, its stdin script, its
  substitution hook, its settle — re-measures the CPU clause, whether or not the count moves.**
  **This trigger was nowhere: not on the ticket, not in the account, not in the test file, not in
  QE's residual.** It is the one the §4 mutant walks straight through. **Writing it down is the
  substantive thing this hop does.** It is the account's own rule read honestly — *"a child no
  criterion names is a finding against the ticket"* extended to *a child that stopped being the
  child its criterion priced*.

**Carried by:** Security/NFR at the gate, per the account's existing wording. **No new role, no new
hop, no new gate command, no config change.**

## §5 — `AR-N8SPAWN-DRIFT` — the accepted risk, because a residual with no carrier is how this factory loses things

> **`AR-N8SPAWN-DRIFT`.** An existing criterion-forced child can be made arbitrarily more expensive
> without any mechanical signal. **Measured: one deleted hook = +2.68 s wall / +2.60 s CPU, 8.6x the
> per-child clause, 1213/1213 green.** The count pin cannot see it, the clauses as written do not
> cover it, and no affordable mechanical guard exists (§1, §2). **ACCEPTED, with `T2` as its only
> control. Owner: Architect/Design**, who owns `NFR-008` and this account.
> **Discharge: at `ABC-108`'s remedy**, where the lane's total is being ruled anyway and where a
> child that grew is one input among many — not as a separate question, and on the same pattern
> `AR-N8LANE-078` was discharged.
> **It is REPORTED into `ABC-108`, not charged to it, and `N8-SPAWN`'s balance stays 0 ms.**

**Stated plainly so it is not read as closure: this risk is REAL, it is LIVE TODAY, and accepting it
is a choice, not a proof of safety.** `NFR-008` is already breached by 1.480 s; a 2.6 s hook
deletion would nearly double that breach in one line, silently. **I am accepting it because the
cheapest honest guard costs 12x the budget and is green on the mutant anyway — not because it is
small.**

## §6 — THE ADR IS OWED, and I nearly ruled the other way

The brief's test is *"does the ruling change what the project guarantees about its own budgets"*. My
first answer was no — it states rather than changes. **I overturned that on precedent and on
recurrence.** `ABC-108`'s `OQ-1` ruling was of this exact class and it wrote **`ADR-0014` beside its
catalog section**; the house form for a budget ruling here is both. And this shape has now been
raised **twice** by two different roles — Security/NFR named it at `ABC-042`'s gate, QE named it as
`G-QE115-3` — which is the "a future maintainer will curse you if the *why* is missing" test met by
observation rather than by prediction. **A catalog subsection at line ~1240 of a 1491-line file does
not stop the third re-derivation. `ADR-0017` is written.**

## §7 — THE TICKET I WOULD HAVE CUT, NAMED AND NOT CUT (cutting is BA/PM's pen)

**Not** for a mechanism — §2 rules that out. For the one thing this ruling cannot reach:

> **`Record the T2 re-measure trigger where a gate will actually meet it`** — Architect/Design owns
> `plans/nfr-catalog.md` and has written `T2` there, but Security/NFR's gate checklist and the
> `## Security / NFR triggers` block of every future cut are **BA/PM's and the checklist's**, not
> mine. **Size `XS`, priority `P2`, owner BA/PM.** Its whole content is: when a cut writes an
> `N8-SPAWN` row, it also writes `T2`. **Cutting it and giving it an id are BA/PM's at a cut, and
> inventing an id here would be fabricating a board state.** I name the requirement and stop —
> the same stop `ABC-108`'s `A5` recorded.

**I would NOT cut it as `P0` or `P1`**, and I would accept a BA/PM decision that it is not worth a
page at all: `T2` is now written in the account that every `N8-SPAWN` row points at.

## §8 — HOW TO OVERTURN THIS

Overturn it by breaking §1. Concretely: **show a mechanical assertion, runnable in the default lane
in under ~50 ms, machine-independent, that goes RED on the §4 mutant and GREEN on the base copy.**
If that exists, I am wrong, the clauses should be mechanised, and `AR-N8SPAWN-DRIFT` closes. I
looked for one and found only proxies (§3). **Do not overturn it by arguing the gap is bad — I agree
the gap is bad. Overturn it by producing the guard.**

## WHAT I DID NOT DO

I did not touch `src/` (zero files, verified by `git status --porcelain -- src/`). I moved no target,
bar, level, floor, account, instrument, statistic, null control or `UNKNOWN - verify` marker. I did
not grade `NFR-008` and I claim no `N8-LANE` line. I did not re-open `G-QE115-1`, `G-QE115-2`, the
exit-code ruling, `ADR-0016`, `ABC-115`'s size/priority or QE's PASS. **I did not move `ABC-115`** —
it stays `Ready for UAT`, **unsigned**, and I did not sign it. I cut no ticket and moved no board
column. Nothing merged, nothing deployed.
