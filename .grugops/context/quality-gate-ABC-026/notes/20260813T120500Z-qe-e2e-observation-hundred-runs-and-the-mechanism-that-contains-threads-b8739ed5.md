---
id: 20260813T120500Z-qe-e2e-observation-hundred-runs-and-the-mechanism-that-contains-threads-b8739ed5
kind: observation
by: qe-e2e
at: 2026-08-13T12:05:00Z
verified_by:
confidence: high
refs:
  - ABC-026
  - ABC-026-A4
  - quality-gate-ABC-026
  - vitest.config.ts
  - ADR-0008
  - NFR-008
  - src/glyph-mode.test.ts
supersedes:
---

# `pool: "threads"` attacked with **100 independent runs across 5 conditions — 0 red** — and, more usefully, the containment shown to be **STRUCTURAL rather than scheduling luck**

An `observation`. The run count is the weaker half of this note. **The mechanism is the half that
should decide the question, and it is stronger than the delivered file claims.**

## The campaign

Interleaved, condition order rotated every round, one fresh OS process per run, `PERFT_DEEP` **deleted
from the child environment** rather than merely absent. **Every run asserts its own counts and a run
whose counts are not what its label claims is a harness error, never a datum. 100 runs, 0 harness
errors.**

```
condition            green/n    median wall     what it attacks
threads-default       20/20       1660 ms       the delivered config exactly
threads-1worker       20/20       4361 ms       maxThreads=minThreads=1 — maximum file-sharing exposure
threads-shuffle       20/20       1773 ms       --sequence.shuffle, a fresh seed every run — order dependence
threads-1w-shuffle    20/20       4371 ms       both at once, the harshest combination available
forks-control         20/20       1894 ms       is any red I find threads-specific, or the suite's?
                     ------
                     100/100 green, 0 red, 807/807 tests on 28 files in EVERY run
loadavg before run    min 5.47   median 7.58   max 9.23   (8 cores); 33 of 100 runs started above core count
```

**What the run count actually bounds, stated by the same rule of three the prior hop used against
itself.** 0 failures in n runs bounds the per-run failure rate at roughly 3/n:

```
prior hop's 24 runs, delivered config                  ~12.5%   (its own honest statement)
my 20 runs, delivered config exactly                   ~15%
delivered config, both hops, 44 runs, two sessions      ~6.8%
ANY threads condition incl. the two harsher ones, 80    ~3.75%
```

**80 threads runs do not prove a zero flake rate and I do not claim one.** They move the bound from
~12.5% to ~3.75% and they add the two variables the prior screen did not vary — worker count and file
order. **That is worth having and it is not what settles this.**

## **The mechanism, and it is a stronger containment than `vitest.config.ts` states**

The delivered file rests its safety on one mechanism: tinypool does not pass `SHARE_ENV`, so each
worker gets its own `process.env` copy. **I verified that two ways and then found a SECOND, independent
containment the file does not mention.**

**1. `SHARE_ENV` — confirmed, twice.** `grep -c SHARE_ENV node_modules/tinypool/dist/index.js` returns
**`0`** (tinypool 1.1.1). And empirically, outside vitest entirely, with `node:worker_threads` and no
`env` option: a worker mutating `process.env.QE_CANARY` leaves the parent's value untouched.
**Cross-worker `process.env` leakage is structurally impossible, not merely unobserved.**

**2. THE ONE NOBODY RECORDED: under `isolate: true`, a test file NEVER SHARES A WORKER WITH ANOTHER
TEST FILE.** Each file gets a **fresh worker thread**. Measured directly by having probe files report
`threadId` from `node:worker_threads`:

```
delivered config (isolate true), maxThreads=minThreads=1, 4 files   ->  threadId 1, 2, 3, 4
--no-isolate,                    maxThreads=minThreads=1, 4 files   ->  threadId 1, 1, 1, 1
full 36-file probe run, isolate true                                ->  threadIds distinct, up to 13
```

**Forcing the pool down to ONE worker does not force two files into one thread — it forces them into
one thread AT A TIME, each a new thread.** So the same-worker residue path is not merely restored-from
by `afterEach`; **under the delivered configuration it does not exist.**

**The containment is therefore three-deep, not one-deep:** env is copied per worker (no cross-worker
leak) **and** no worker is reused across files (no residue) **and** `glyph-mode.test.ts` restores in
`afterEach` anyway (belt on top of both braces). **The one lever that would collapse all three at once
is `isolate: false` — which is precisely the lever the delivered file's long warning exists to
prevent.** The warning and the adoption are load-bearing on each other, and that is the correct shape.

## Two corrections to the record, neither of which changes the decision

**1. `vitest.config.ts` line 52 overstates the armed control.** The shipped comment reads *"the
identical assertion goes RED when the mutation and the read share a worker."* The prior hop's own
`decision` note says something different and correct: *"the mutation and the read in the SAME
module."* **Those are not the same claim, and under `isolate: true` the first one cannot happen at
all** — two test files never share a worker. As written, the sentence invites a future engineer to
believe worker-sharing between files is the live failure mode and to "fix" it by pinning worker counts,
which would do nothing. **The accurate word is `module` (or `file`), not `worker`.** Low severity,
Architect/Design's to correct; **I did not edit the file** — it is the deliverable and a needed change
is a finding with a reason, not an edit.

**2. The mutation census is CORRECT and I checked it properly.** My first grep flagged
`src/perft.test.ts` as a second mutator; **that was my false positive** — `process.env.PERFT_DEEP ===
"1"` matched a pattern for `=`. Recorded because a census I broke and repaired is worth more than one I
assert. On a strict pattern: **`src/glyph-mode.test.ts` is the only file in the suite that mutates a
process global** — `process.stdout.isTTY`, the three locale keys, and `process.platform`. The prior
hop's *"five test files read `process.*`"* also holds: `frame.test.ts` and `glyph-mode.nfr.test.ts`
match only in **comments**, `history-pane.nfr.test.ts` reads `process.argv`/`process.execPath` to spawn
a real child, and `perft.test.ts` reads `PERFT_DEEP`.

## The load disclosure, because it is a variable in every timing above

**One other agent was gating `ABC-021` on this machine throughout, and my own campaign is itself load.**
The pass/fail column is load-insensitive and is the result I rely on. **The wall medians above are
not a lane reading and must not be quoted as one** — they are contaminated by design. `NFR-008`'s
reading lives in the prior hop's `A1` note and in `plans/nfr-catalog.md`, measured under its own
protocol.
