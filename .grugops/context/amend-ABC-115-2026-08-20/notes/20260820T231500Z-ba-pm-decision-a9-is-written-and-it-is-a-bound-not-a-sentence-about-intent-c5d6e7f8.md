---
id: 20260820T231500Z-ba-pm-decision-a9-is-written-and-it-is-a-bound-not-a-sentence-about-intent-c5d6e7f8
kind: decision
by: ba-pm
at: 2026-08-20T23:15:00Z
verified_by:
confidence: high
refs:
  - ABC-115
  - A9
  - A5
  - A3
  - ADR-0016
supersedes:
---

# `A9` IS WRITTEN: THE SESSION MUST END, EXPRESSED AS A BOUND A TEST ASSERTS

## The decision

**A criterion was owed and it is on the page.** The measurement (sibling `observation`) shows a bare
swallow satisfying `A1` and `A2` completely, so the "write nothing" outcome the brief offered as
legitimate was **not** available: the hole is real.

`A9`'s Given holds stdin **open** past the reader's close, supplies one line the session answers
**without an engine search**, and asserts the child **has exited within `T_bound`**, with
`T_bound < T_open`. Status `0`, `signal === null`, empty stderr ride along.

## Why THIS shape, and the three shapes rejected

1. **Prose ("the session terminates") — rejected.** Unfalsifiable; a vague criterion is a defect the
   gate cannot catch and the engineer guesses at.
2. **A wall-clock comparison (8.02 s vs 3.07 s) — rejected as the criterion**, kept as evidence. It
   pins a number produced by `DEFAULT_BUDGET_MS` and an 8 s sleep, both of which move; a row asserting
   "under 5 s" would go stale the day the engine budget changes.
3. **"The child exits at all", with NO settle delay — rejected on measurement.** Without a delay the
   reader's close races the session's next write: **1 of 3 delivered-build runs hung** where the other
   2 crashed in 0.09 s. A row that flaky is worse than no row. With a settle of 0.2 s: **8/8
   deterministic on both builds.** `A9` requires >= 0.5 s and 5 consecutive identical runs.

**The chosen form has one property the others lack: it needs no stopwatch.** The detached FIFO writer
means `sh` waits only for the child, so `spawnSync`'s own `timeout:` IS the assertion instrument, and
the design hop's recorded dead end (timing the pipeline, which makes all four builds read 8 s) cannot
be walked into.

## THE HONEST PART: `A9` DOES NOT RED AGAINST `main` THE WAY THE OTHER ROWS DO

Measured: against the delivered `main` build the child **exits** — it crashes in 1.05 s. So `A9`'s
ENDING clause is **GREEN on `main`** and reds only on its status clause.

**The ending clause reds against a bare-swallow mutant and against nothing else.** `A5` says a row
that has never been seen red is not a guard, and taken naively `A5` would be satisfied here by a
`main` run that never exercised the thing `A9` exists for. So `A9` carries its own instruction: the
watched-RED round runs **twice** — once against `main` (status), once against the one-line mutant —
and both RED outputs go in the delivery note verbatim.

**`A5` itself was NOT edited.** One row needing a second red watch does not justify rewriting a
criterion that is correct for the other eight.

## What `A9` costs, and what it does not

- **Zero production lines.** `ADR-0016`'s ruled shape already ends the session; `A9` only asserts it.
  Measured: V1 and V2 both pass `A9` unchanged, so the row does not force a different fix.
- **One child**, in a file this ticket already opens, through the existing `childOf` helper, in a
  single `/bin/sh -c` string — **zero new `spawnSync` call sites**, so `src/cli.test.ts:1480-1485`
  stays green.
- **Size stays `S`, priority stays `P1`.** Said loudly on the page rather than absorbed silently.
  `SPLIT_REQUIRED` is not raised; nothing here is `XL`.

## What this decision does NOT do

Does not re-open the exit code (`ADR-0016` settled it; `A2`(i) untouched). Does not edit `A1`-`A8`
except `A1`'s byte base (sibling note). Does not touch `src/`, `ADR-0016`, `AGENTS.md`, or any other
ticket. Does not move `ABC-115` off `Ready for Dev`. Does not merge, deploy or self-sign.
