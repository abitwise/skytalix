---
id: 20260812T122500Z-qe-e2e-claim-verdict-pass-with-risks-and-what-i-would-not-carry-7e24473c
kind: claim
by: qe-e2e
at: 2026-08-12T12:25:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-028-A1
  - ABC-028-A2
  - ABC-028-A3
  - ABC-028-A4
  - RISK-ABC017-01
  - RISK-ABC028-01
  - RISK-ABC028-02
  - ABC-026
  - ABC-029
  - plans/tickets/ABC-028-history-pane-unreached-input-classes.md
  - plans/board.md
supersedes:
---

# VERDICT: `PASS_WITH_RISKS`. Zero code defects, four criteria MET, six criterion gaps — and one I would not carry

> **Hand-authored `claim`, deliberately NOT a `finding`.** `context.human_admission` is `off`, there
> is **no `§14-gate` verdict record under this task** to issue a `§14-gate#<id>` stamp, and no named
> human has granted a `human:<name>` stamp. **`confidence: high` refers to the measurements, which
> are reproducible from the method stated in the sibling notes; it is not an admission status.** The
> gate results are recorded as measurements, never as a stamped verdict.

## The verdict

**`PASS_WITH_RISKS`.** In Workflow 05's terms: **`READY_FOR_HUMAN_REVIEW`**, with the risks below
recorded and routed. Every `mandatory_gate` passes on the branch tip (lint 0, typecheck 0, unit
750/750 on 26 files, build 0, skip 0), production diff is **zero bytes**, and **`A1`, `A2`, `A3` and
`A4` are each MET as written** — I re-ran the discriminating build behind each rather than reading
the verdict out of the ticket.

**Not `FAIL`.** Nothing the Engineer built is wrong, no criterion as written is unmet, and no
existing test was weakened, narrowed or deleted by anyone. **Not a clean `PASS`,** because the tree
now carries statements that measurement falsifies.

## CRITERIA GAPS vs CODE DEFECTS — the split the brief asked for, and which way I lean

**CODE DEFECTS: ZERO.** `src/history-pane.ts` md5 `54fd4346dcc1a0060c4e66ae0149265d`, unchanged, and
correct on all fourteen inputs I constructed — including the redo path that breaks `WCACHE-LAST`.
**I lean, with no hesitation, to CRITERIA.** That is now five roles measuring zero code defects on
this pane, and it is the fifth consecutive hop on this board where the finding is in what a criterion
asks rather than in what the code does.

**CRITERION GAPS: six.** All owner **BA/PM**, none the Engineer's, none requiring a production line.

| # | gap | severity | why it is a criterion gap |
|---|---|---|---|
| **G1** | **`WCACHE-LAST`: the incidental fixture sharing is still the ONLY guard** for the next cache in the family, and the comment `A2` wrote, `A2`'s ruling and the `P1` re-derivation all now state the opposite | **HIGH** | `A1` closes a witness; three sites assert the class is closed. Measured: 24/24 and 750/750 clean in `A2`'s own two configurations |
| **G2** | **`A4` clause 1's stated property is FALSE.** The descriptor escape defeats the write trap for every non-board slot, with no revert needed | **MEDIUM** | `WPOSRAW` and `WPOSMID` are the same badness; one dies, one passes 750/750 |
| **G3** | **`RISK-ABC028-01`'s widened class is still narrower than the real class** — `subarray()` and a cached bound mutator are equally silent and neither is buffer-level | **MEDIUM** | the standing re-run obligation fired and reported; two more witnesses of one class |
| **G4** | **`RISK-ABC028-02`'s exposure is understated** — bounded for `WCACHE-LEN`, not for the class | **MEDIUM** | consequence of G1 |
| **G5** | **`A2`'s added "every surviving kill … none in the nfr file" clause cannot fail** in either configuration it is asserted over | **LOW** | (a) does not load the file; (b) is defined as the rebuild that disables it |
| **G6** | stale `744/744` count in the `:102-120` comment (tree runs 750); ticket's live pointer says `:102-120` where source is `:103-120` | **LOW** | cosmetic, but this page made line-map accuracy a rule |

**`WNOMAX` is listed nowhere above deliberately** — it is an *equivalent* mutant (provably dead code
at `src/history-pane.ts:104`), flagged under `AGENTS.md` rule 12 and **not** a gap: no test can kill
it and none should be written.

## THE ONE I WOULD NOT CARRY, in words

**`G1`. I would not carry the sentence that the fixture sharing is no longer load-bearing.**

Not because it is imprecise — because it is **the same sentence, in the same file, doing the same
job, as the one this whole ticket was cut to remove.** `RISK-ABC017-01` exists because
`src/history-pane.nfr.test.ts` carried a signed, measured-sounding statement that the sharing was
free to delete, and it was false. `ABC-028` replaced it with a signed, measured-sounding statement
that the sharing is free to delete — and **for `WCACHE-LAST` that is false too, by the same
mechanism, caught by the same call count, invisible to the same freshness tests.**

The ticket's `P1` re-derivation says *"The hazard this ticket's `P1` priced is GONE — because this
ticket removed it."* **I measured it and it is not gone.** It is narrower by one build. The next
engineer to open that file reads a comment that has now been *twice* certified, and the second
certification is the one this project produced on purpose.

**What I would want before this reaches `Done`:** the comment and `A2`'s ruling reworded to the
witness they actually establish (*"a cache keyed on `moves.length` dies in
`src/history-pane.test.ts`"*), **not** to the class (*"the cache dies either way"*). That is a BA/PM
edit of one sentence and it costs nothing. Whether `WCACHE-LAST` earns a criterion of its own is a
separate and much larger question — it would be a fifth criterion on a ticket that is built and
green, and I do **not** recommend re-opening the build for it.

**The counter-argument, recorded rather than buried:** `WCACHE-LAST`'s wrongness needs `EPIC-006`'s
redo, which does not exist yet, and no consumer observes any of this today. A reader who weighs that
heavily can reasonably call G1 `LOW` and take it as a documentation fix. **I do not take that view,
because the hazard is not the cache — it is the sentence, and a sentence outlives a brief.** That is
this ticket's own argument for its `P1`, applied to what the ticket left behind.

## Things I explicitly did NOT do

- **I did not amend a criterion.** Not one character of `plans/tickets/ABC-028-*.md` was written.
  Every gap above is reported and routed to BA/PM.
- **I did not weaken, narrow or delete any existing test.** `git diff -- src/` is **empty**.
- **I did not settle `N8-LANE`'s total.** It is `ABC-026`'s. **My own delta is zero** — this hop adds
  no test, no file and no line to the repository — so `ADR-0008`'s protocol was not run and no bar
  moved.
- **I did not take the board move.** `plans/board.md` was not opened for edit.
- **I did not merge, push, deploy, or `git checkout main`**, and I entered none of
  `../cli-chess-ABC-019`, `../cli-chess-ABC-028`, `../cli-chess-ABC-029`,
  `../cli-chess-ABC-029-build`, `../cli-chess-abc028-a2`.

## Requested — the `In Review` exit is mine, the board is not

**`ABC-028`: `In Review` → `In Security/NFR`.** Security/NFR's own firing threshold in the ticket is
*"any production line at all, or any new file"* — **neither fired**: zero production lines, zero new
files, file count 26, `package.json` byte-unchanged. So the review should be short, but it is owed:
the threshold is stated as falsifiable rather than pre-waived, and I am not the role that waives it.

**The six gaps route to BA/PM**, ideally before `ABC-029`'s build hop opens that file, since `G1`'s
subject is the comment `ABC-029`'s engineer will read ~120 lines above their own edit.
