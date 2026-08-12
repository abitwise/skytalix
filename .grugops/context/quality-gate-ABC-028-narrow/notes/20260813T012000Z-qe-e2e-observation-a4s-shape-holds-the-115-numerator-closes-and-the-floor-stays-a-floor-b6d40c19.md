---
id: 20260813T012000Z-qe-e2e-observation-a4s-shape-holds-the-115-numerator-closes-and-the-floor-stays-a-floor-b6d40c19
kind: observation
by: qe-e2e
at: 2026-08-13T01:20:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-028-A4
  - ABC-028-A5
  - ABC-029
  - N8-LANE
  - NFR-008
  - ADR-0008
  - ABC-026
  - src/history-pane.nfr.test.ts
  - src/history-pane.test.ts
supersedes:
---

# `F2`'s repair WORKS — the shape survives the commits that made the absolute stale; `:115`'s numerator is CLOSED; and `N8-LANE` stays a floor, with the machine's load recorded

> **Hand-authored, no stamp.** Every lane below was built out of tree from `ABC-028`'s own
> definitions, pinned by md5 to THIS tip — **the rig now pins `src/history-pane.nfr.test.ts` at
> `16bf2f50…` and THROWS on the previous gate's `1d33bea6…`**, so a stale replica cannot be measured
> by accident. `git diff -- src/` is EMPTY.

## `A4`'s restated lane clause — the SHAPE, re-gated on the tip whose growth broke the absolute

The clause now reads *"exactly one failure, it is this criterion, and ZERO pre-existing tests break"*,
with the three dated absolutes kept as struck witnesses. `WPOSMID` — a pane that writes to the
caller's graph **during** the render and restores before returning, visible to `A4`'s watcher and
invisible to `A9`'s before/after comparison — was rebuilt and run:

```
WPOSMID on this tip:  1 failed / 755 on 26 files
  FAIL  A4 — no write reaches the caller's graph during a render, at all ten lengths

exactly one failure?      true
it is this criterion?     true
pre-existing broken?      0
```

**All three clauses of the shape hold, on the tip whose `+3` tests are exactly what made the old
absolute stale.** That is the repair tested rather than admired: **the sentence `F2` struck would have
been wrong here for the fourth time; the sentence that replaced it is right and cannot go stale by a
neighbour's commit.**

## `src/history-pane.nfr.test.ts:115` — the numerator BA/PM could not measure, measured

BA/PM found the three `752` denominators stale and left the numerator *"fails exactly 2"* as
`UNKNOWN - verify` because it built no mutant. **I built it.**

```
lane                       full suite            owned lane      what the comment claims
WCACHE-LAST3               2 failed / 755        26 / 26         "fails exactly 2"      HOLDS
  FAIL  calls toSan exactly once per RENDERED ply, and never more than 2 x HISTORY_ROWS
  FAIL  hands toSan no legal move list — the optional parameter is a contract, not a tuning dial
WCACHE-LAST3 + per-test    0 failed / 755        26 / 26         "752/752 GREEN"        stale total,
  fixtures rebuilt                                                                      claim HOLDS
NULL CONTROL (no mutant)   0 failed / 755        26 / 26         (calibration)
```

**Every load-bearing clause in that comment is TRUE on this tip and only the three totals are
stale** — `752` against a suite of `755`. **`26/26` is exact.** The per-test rebuild does take the
whole suite green. **The two failures are both `toSan` spy assertions in this file**, as claimed;
the second one's TITLE is about the argument list and it fails on its `expect(toSan).toHaveBeenCalled()`
clause (a cache HIT calls `toSan` zero times), so *"both of them the `toSan` call-count assertions"*
is accurate about the mechanism while a reader hunting by title will find only one. **Noted as
navigational, NOT reported as an instance** — it claims nothing wider than it measured.

**This closes BA/PM's `UNKNOWN - verify` and it closes it in BA/PM's favour.** The instruction it
routed forward — *replace the totals with the SHAPE rather than refreshing them* — is unchanged and
still owed to whoever next opens that block.

## `N8-LANE` — this hop's own delta is ZERO, and the floor stays a floor

**`ADR-0008` decision 4's protocol was NOT run, and the reason is arithmetic rather than reluctance:
this hop adds no test, no file and no line to the repository, so its own delta is zero by
construction.** There is nothing for a paired-CPU protocol to resolve.

**The two ratified clauses were read on the tip, three consecutive runs:**

```
run   vitest Duration   process real   user + sys (CPU)
1     1.43 s           1.82 s         8.86 s
2     1.33 s           1.66 s         8.81 s
3     1.40 s           1.75 s         8.81 s

clause  <= 3 s wall    HOLDS   1.33-1.43 s, 44-48% of the bar
clause  <= 13 s CPU    HOLDS   8.81-8.86 s, spread 0.05 s across three runs
```

**I am NOT turning the floor into a number.** The `±390 ms CPU at n = 8` figure in my brief is
**inherited and was NOT re-measured here** — this page's own standing rule is that an inherited number
is an asserted number, so it is carried as **`UNKNOWN - verify` at this hop**. `A5`'s landed delta
stays `UNKNOWN - verify` and my previous gate's reading of it as **a floor rather than a number**
stands untouched. **A negative median is not a saving, and five hops reporting a floor is five hops
agreeing, not five hops failing.**

## THE MACHINE WAS NOT QUIET, and I can put a number on it — which may matter to the floor itself

```
uptime during this hop:  load averages  2.84 (1 min)  4.70 (5 min)  4.79 (15 min)   on 8 cores
concurrent agent work:   a Security/NFR hop on `ABC-019` is LIVE — its scratchpad root
                         `secnfr-abc019-1786537080-17582/` appeared at 15:20, four minutes AFTER
                         my claim, in the shared scratchpad
```

**So every `N8-LANE` measurement on this stack has been taken on a machine carrying other agents'
suites.** `ADR-0008`'s own consequence section already predicts the direction — *"ratios replicate;
absolutes do not"* — and the reported floor has moved `±130 → ±200 → ±390 ms` across hops.

**I am NOT claiming that concurrent load explains the drift.** I did not run a controlled comparison
and I will not assert one from a load average. **What I AM recording, because it is cheap and nobody
has recorded it:** the floor has been treated as a property of the machine, and this factory runs
several agent worktrees on one machine, so it is at least as likely to be a property of the
machine's *concurrent load* — which is not constant, not controlled, and not currently recorded
alongside any of the five floor figures. **If a sixth hop is ever asked to settle the floor, the
first thing it needs is an exclusive machine, and the second is `uptime` in the record.** Owner: the
Orchestrator, as a factory concern rather than an `ABC-028` one. **Recorded as a suggestion, not a
result.**

## Security/NFR — re-measured at `755`, and the threshold still does NOT fire

The ticket's stated firing threshold is *"any production line at all, or any new file"*. Measured
across `ABC-028`'s own three `src/`-touching commits (`8de988d`, `26e452f`, `593ba70`), not across a
range that would sweep in the neighbour's:

```
files touched under src/          2, BOTH *.test.ts
production files touched          0
production lines                  0
new files                         0
src/*.ts count      before 8de988d: 42     at HEAD: 42
*.test.ts count     before 8de988d: 26     at HEAD: 26
package.json / package-lock.json  byte-untouched across the WHOLE branch (0 lines of numstat)
src/history-pane.ts               c4653c4c… — unmoved by ABC-028; the one line that moved it
                                  from main's 54fd4346… is ABC-029's b7e1226, a doc-comment line
```

**NEITHER HALF FIRES, at 755 as at 752. That is a measurement, it is re-taken rather than inherited,
it is NOT a waiver, and it is not mine to waive.** The review is still owed and the look should be
short.
