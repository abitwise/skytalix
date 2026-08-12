---
id: 20260812T213000Z-qe-e2e-claim-verdict-ready-for-human-review-four-gaps-and-what-i-would-not-carry-8c33ad91
kind: claim
by: qe-e2e
at: 2026-08-12T21:30:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-028-A1
  - ABC-028-A2
  - ABC-028-A3
  - ABC-028-A4
  - ABC-028-A5
  - RISK-ABC017-01
  - RISK-ABC028-01
  - RISK-ABC028-02
  - RISK-ABC028-03
  - ABC-026
  - ABC-029
  - plans/tickets/ABC-028-history-pane-unreached-input-classes.md
  - plans/board.md
supersedes: 20260812T122500Z-qe-e2e-claim-verdict-pass-with-risks-and-what-i-would-not-carry-7e24473c
---

# VERDICT: `READY_FOR_HUMAN_REVIEW`. Five criteria MET, zero code defects, FOUR criterion gaps — and one sentence I would not carry

> **Hand-authored `claim`, deliberately NOT a `finding`.** `context.human_admission` is `off`, there
> is **no `§14-gate` verdict record under this task**, and no named human has granted a `human:<name>`
> stamp. **Workflow 05 step 5's `emitVerdict` carve-out cannot run here — `scripts/context-io.ts` does
> not exist in this repository** — so no green verdict note can be minted and therefore nothing on
> this hop, or downstream of it, can carry a `§14-gate#<id>`. The gate RESULT below is recorded as a
> measurement, never as a stamped verdict. **`confidence: high` refers to the measurements; it is not
> an admission status.**

**This supersedes my own earlier `PASS_WITH_RISKS` on this ticket.** That gate ran on `6b513bb`, two
commits stale, over four criteria. This one runs on `41d204c` over five.

## The verdict

**`READY_FOR_HUMAN_REVIEW`.** Every `mandatory_gate` passes on the branch tip — **lint 0, typecheck 0,
unit 752/752 on 26 files, build 0, skip 0** — production diff across `ABC-028`'s own four commits is
**zero bytes**, and **`A1`, `A2`, `A3`, `A4` and `A5` are each MET as written.** I re-broke every one
of them on this tip against its own named build rather than reading a verdict out of the ticket or out
of my own superseded notes.

**Not a clean `PASS` and not `FAIL`.** Nothing the Engineer built is wrong; no criterion as written is
unmet; no existing test was weakened, narrowed or deleted by anyone (measured: zero `expect(` removed
across all four commits, the one removed `it(` line being the left half of a rename that WIDENED an
`A9` title, `it(` count 13 → 25). The four gaps below are in what criteria ASK and in what the record
CLAIMS.

## The kill matrix — fifteen builds, every cell run on this tip

Each build is the delivered pane plus exactly one anchored edit, the anchor asserted unique, the
source md5 checked first, and **output-identity checked BEFORE the suite verdict was taken
seriously** — all render `e07f2046b9cafcfdf06ae5139430b411` with the caller's graph unmoved, the one
intended exception being `WLEAD-ODD`, which differs exactly at `A3`'s input class.

```
 #  build                    new?  full suite (752)   owned lane (26)   killed by
 1  WCACHE (naive)           tkt   6 failed / 752     4 failed / 26     A11x2 + A14 + A1 + A5r1 + A5r2
 2  WCACHE-LEN               tkt   5 failed / 752     3 failed / 26     A11x2 + A1 + A5r1 + A5r2
 3  WCACHE-LAST              tkt   4 failed / 752     2 failed / 26     A11x2 + A5r1 + A5r2
 4  WCACHE-LAST2             tkt   3 failed / 752     1 failed / 26     A11x2 + A5r2
 5  WCACHE-LAST3             tkt   2 failed / 752     26 PASSED         A11x2 ONLY — the ACCIDENT
 6  KEY-off2                 MINE  —                  2 failed / 26     A1 + A5r2
 7  KEY-off3                 MINE  —                  2 failed / 26     A1 + A5r1
 8  KEY-off1+3               MINE  —                  1 failed / 26     A5r1
 9  KEY-off2+3               MINE  —                  1 failed / 26     A1
10  VALUE-LAST               MINE  —                  2 failed / 26     A5r1 + A5r2
11  VALUE-LAST2              MINE  —                  1 failed / 26     A5r2
12  WLEAD-ODD                tkt   1 failed / 752     —                 ABC-028 A3
13  WPOSMID                  tkt   1 failed / 752     —                 ABC-028 A4
14  WBOARDBLIND              tkt   752 passed         —                 NOTHING — RISK-ABC028-01a
15  RESTORED-FALSE-SENTENCE  MINE  752 passed         —                 NOTHING — lint 0, tsc 0
```

Plus five configuration-(b) lanes (fixtures rebuilt per test: `0 / 3 / 2 / 1 / 0` failures for
CLEAN / LEN / LAST / LAST2 / LAST3), four candidate-row lanes, and two null controls at `752/752`.

**`A4`'s lane clause holds in SHAPE and is stale in FIGURE:** on `WPOSMID` the suite reports **exactly
one** failure, it is `A4`, and **zero pre-existing tests break** — measured. See `F2`.

**`RISK-ABC028-01a` is reproduced and still open** (`WBOARDBLIND`, `752 passed`). Its standing
obligation fires on any change to `A4`'s instrument; **no such change happened at this hop**, so it did
not fire — I re-ran the witness anyway, because the instrument had not been run on this tip.

## CRITERIA GAPS vs CODE DEFECTS — the split, and which way I lean

**CODE DEFECTS: ZERO.** `src/history-pane.ts` is `c4653c4c263c4c417ea34969164ccd86`, `ABC-028`'s own
net diff on it is EMPTY, and the delivered pane is CORRECT on every one of the fifteen inputs — the
redo path that breaks `WCACHE-LAST`, the odd black-anchored slid window, all ten `A4` lengths.

**I lean to CRITERIA, and this time with a sharper reason than the count.** It is now six roles
measuring zero code defects on this pane. But the four gaps below are not more sentences: **`F1` is the
first gap on this ticket that is in the ticket's own EXTENSION MECHANISM** — the thing built to stop
the per-witness defect — **and `F4` is that the ticket's central repair is unenforceable.** The
ticket's thesis (*"every finding here is a gap in what a criterion ASKS"*) holds for the seventeenth
time, and the two most useful gaps are now about the machinery rather than about the prose.

| # | gap | severity | owner | why it is a criterion gap |
|---|---|---|---|---|
| **F1** | **`A5`'s extension rule has an UNDOCUMENTED DOMAIN.** *"Closing a further member is a NEW ROW, never a new criterion"* is true only for `preservedTail ≤ 15`. At 16 the edit falls entirely outside the pane's 16-ply window, the two renders are byte-identical, and the row goes **RED ON THE DELIVERED PANE** | **MEDIUM** | BA/PM | measured: `preservedTail: 16` → `1 failed / 27` on correct code. A criterion that cannot PASS on the code it protects, arrived at by following the ticket's own instruction literally. One clause fixes it |
| **F2** | **`A4`'s LIVE lane figure is stale for the THIRD time.** It reads *"`1 failed, 749 passed` against `750 passed (750)`"*; measured on this tip it is **`1 failed, 751 passed` against `752 passed (752)`** | **LOW** | BA/PM | `A5`'s two rows landed after the second correction (`748` → `750`). The SHAPE assertion holds exactly; the number is a number, and `## Test notes` 4 makes it a claim |
| **F3** | **A published line count is wrong.** `ticket-to-pr-ABC-028-a5` recorded the `A5` test half as **`+125 / -0`**; four instruments (`numstat`, `diff --stat`, raw `+` lines, `wc -l` 972 → 1103) all say **`+131 / -0`**. The ticket's `S` re-derivation repeats *"+365 then +125"* | **LOW** | BA/PM (page), the authoring hop (note) | changes no conclusion — `S` does not turn on six lines — but this page's standing rule is that an inherited number is an asserted number |
| **F4** | **The forbidden-formulation rule is UNENFORCEABLE.** Restoring the banned sentences in the merged comment — comment text only — leaves lint 0, typecheck 0, **752/752, skip 0**, every criterion green. And the enforcement the ledger names (grep) fires **103 times** on a correct tree, because this page's method is to quote the banned sentence in order to strike it | **MEDIUM** | BA/PM | it is the ticket's central repair and nothing holds it true past the hop that wrote it. **No sixth occurrence exists today** — `src/` is clean and every occurrence on the page is a quotation, a strike, the rule itself, a negation, or a different subject |

**`WNOMAX` is deliberately not listed** — the provably-dead inner `Math.max` at `src/history-pane.ts:104`
is an EQUIVALENT mutant, flagged under `AGENTS.md` rule 12, and no test can or should kill it.

## THE POSITIVE FINDING, which is the one the brief asked for first

**The ledger's boundary is drawn in the RIGHT PLACE, and that is now an enumeration rather than a
search that happened to stop.** The three owned edits change three pairwise-disjoint sets of move
positions, so no key watching fewer than three positions can survive — and **all eight subset keys of
reach ≤ 3 were built and run. Exactly one survives, and it is `WCACHE-LAST3`**, which is therefore not
only the deepest known live witness but the **shallowest and cheapest** one. **There is no shallower
key with no owned guard.** The ladder does not imply a guard that is missing.

## THE ONE I WOULD NOT CARRY, in words

**The ledger's closing sentence: *"the axis is infinite, so there is always a next class without one.
A ledger that runs out of rungs is a ledger that has stopped measuring."***

Not because it is wrong about keys — it is right about keys. **Because it is wrong about this
project, and it is wrong in the direction that keeps the accident load-bearing.** Measured here:
`A5`'s mechanism can express rows **0 through 15 and no further**; the project owns 0, 1 and 2;
**thirteen rungs are real wrong builds with no owned guard, and I closed one of them — the deepest
live witness, the one the ledger names — with a single row of pure data, no new `it`, no new fixture,
no production line.** The residual is not an infinite regress. It is **thirteen rows**, at a price this
ticket has paid three times and knows exactly.

*"There is always a next rung"* is the sentence a later hop will quote to explain why the next row is
not worth adding — and at rung 16 there is no next rung by this mechanism at all. **A finite, priced
residual can be scheduled, bought or accepted with a number attached; an infinite one can only be
shrugged at.** I am **not** disputing the refusal to add the row inside this ticket: that refusal is
scoped, priced and correct on its own terms, and I do not recommend re-opening a built, green ticket
for it. **I am disputing the sentence that makes the refusal look inevitable rather than chosen.**

**The counter-argument, recorded rather than buried:** every rung past `WCACHE-LAST` needs `EPIC-006`'s
redo to bite a real user, and the ticket's own acceptance reasoning — *"each step up the axis buys a
strictly less plausible build"* — has real force at depth three and more at depth ten. A reader who
weighs that heavily can call `F1` documentation and the thirteen rungs theoretical. **I do not take
that view, for this ticket's own reason: the hazard is not the cache, it is the sentence — and the
sentence now says the axis cannot be closed, when measurement says thirteen rows would close it.**

## Security/NFR — the threshold is MEASURED, not waived

The ticket's stated firing threshold is *"any production line at all, or any new file"*. **Measured
across `ABC-028`'s four commits: two files touched, both `.test.ts`; ZERO production files; ZERO
production lines; file count 42 `src/*.ts` and 26 `*.test.ts` before the ticket and at the tip;
`package.json` and `package-lock.json` byte-untouched.** **NEITHER half fires.** The review should
therefore be short — but it is owed, and I am not the role that waives it.

## Things I explicitly did NOT do

- **I did not amend a criterion.** Not one character of `plans/tickets/ABC-028-*.md` was written. All
  four gaps are reported and routed.
- **I did not weaken, narrow or delete any test.** `git diff -- src/` is EMPTY; every mutant, every
  candidate row and the restored false sentence lived out of tree only.
- **I did not re-report the `A5` naming collision.** The Orchestrator's own correction stands: the two
  `describe` blocks are ticket-qualified and a red says which criterion broke. Measured by BA/PM,
  confirmed by the Orchestrator, and I did not spend a run re-litigating it.
- **I did not settle `N8-LANE`'s total**, re-derive a bar, or open `plans/nfr-catalog.md`.
- **I did not take the board move.** `plans/board.md` was not opened for edit.
- **I did not merge, push, deploy, or `git checkout main`**, and I entered **no other worktree** — a
  BA/PM hop is live on `ABC-029`.

## Requested — the `In Review` exit is mine, the board is not

**`ABC-028`: `In Review` → `In Security/NFR`.** The threshold does not fire and that is measured, but
the ticket states it as falsifiable rather than pre-waived, so the look is owed.

**The four gaps route to BA/PM**, `F1` first, and none of them is build work: `F1` is one clause in
`A5`, `F2` and `F3` are numbers, `F4` is a decision about whether an unenforceable rule should stay
unenforceable. **Nothing is owed to the Engineer.**
