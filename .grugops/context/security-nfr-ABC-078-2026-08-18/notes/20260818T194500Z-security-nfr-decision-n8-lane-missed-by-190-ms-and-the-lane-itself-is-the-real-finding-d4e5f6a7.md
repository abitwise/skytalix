---
id: 20260818T194500Z-security-nfr-decision-n8-lane-missed-by-190-ms-and-the-lane-itself-is-the-real-finding-d4e5f6a7
kind: decision
by: security-nfr
at: 2026-08-18T19:45:00Z
verified_by:
confidence: medium
refs:
  - ABC-078
  - N8-LANE
  - NFR-008
  - N8-SPAWN
  - ABC-025
  - ADR-0008
supersedes:
---

# `N8-LANE` — `ABC-078` charges **~840 ms net against 650 ms: NOT MET, over by ~190 ms (1.29x)**.
And the Orchestrator's instinct is right: **the interesting finding is not this ticket's overspend,
it is that the lane's own budget was spent before this ticket arrived. Those are two findings with
two different owners and I rule them separately**

**This is not a stamp.** Hand-authored `decision`; no `finding` is admissible on this install.
**Confidence is `medium`, not `high`, and the reason is stated in full below** — the paired deltas
are solid, the absolute totals carry load inflation I cannot size.

## The reading (protocol, conditions and full data in this task's `observation` note)

Three out-of-tree conditions — delivered tree (36 files), the same tree without
`src/engine.test.ts` (35 files), and a `diff -r`-verified identity twin as the null control — 9
rounds, order rotated, round 0 discarded, n = 8, every run asserting its own file and test counts.

```
identity null control          -0.66% CPU, sign 2/8 positive   ADMISSIBLE (bar allows <= 1.5% at chance)
src/engine.test.ts, gross      +1 000 ms CPU median, sign 8/8, spread 860-1 940 ms
  less the per-file floor         -160 ms  (one test file added; NFR-008's floor account, owner Architect/Design)
  less N8-SPAWN                      0 ms  (no child process; no criterion of ABC-078 forces one)
NET CHARGE                     ~840 ms against N8-LANE's 650 ms      = 1.29x,  6.5% of the 13 s CPU clause
lane median WITHOUT this ticket  13.400 s CPU / 2.805 s wall
lane median WITH it              14.635 s CPU / 2.935 s wall        (NFR-008: <= 13 s CPU, <= 3 s wall)
```

## FINDING 1 — about `ABC-078`: `N8-LANE` is **NOT MET**. Severity LOW, and it does not fail the ticket

**The engineer did not claim it met** — it reported ~700 ms net, named its own confound (six sibling
worktrees live on the machine) and refused to rule. **That refusal was correct and the confound was
real; it just was not flattering the number.** My cleaner conditions read the charge *higher*, not
lower: ~840 ms net where the engineer read ~700 ms. **Contamination was not what put this over the
bar.**

**Why LOW and why it does not fail the ticket:**

- The bar is missed by **190 ms on a 13 000 ms clause — 1.5% of the lane** — and the miss is
  reported rather than netted away, which is what the row asks a gate to do.
- **Precedent is directly on point and was set by the owner's own accounting:** `ABC-025` missed
  `N5` at **1.6x**, the breach was accepted as an owned risk, and the ticket merged. **1.29x is
  inside that precedent**, and I am applying it rather than inventing a threshold.
- The content is not waste. It is `A1`/`NFR-005` measurement plus the criteria's own guards; the
  expensive repetitions are already behind `ENGINE_DEEP=1`, and the default-lane cases already use
  millisecond budgets exactly as the ticket's `Test notes` required. **There is no cheap 190 ms
  sitting in that file** — and I looked for one rather than assuming.
- **I am not requiring a test-cost fix, and I want the reason recorded:** QE's `G1`, `G2` and `G4`
  say three criteria are guarded by tests that do not detect what they exist to detect. **A follow-up
  that makes those guards real will cost lane time, not save it.** Trimming this file to buy 190 ms
  while its guards are known-thin would be optimising the wrong quantity. **Cost is the cheaper thing
  to owe here than coverage.**

> **ACCEPTED RISK `AR-N8LANE-078`.** `ABC-078` charges ~840 ms CPU net against `N8-LANE`'s 650 ms
> (1.29x; 6.5% of the 13 s clause). Accepted, reported into the merge decision rather than netted
> out. **Owner: Architect/Design**, who owns `NFR-008`, its floor account and its spawn account.
> **Discharge:** at the lane re-measurement in Finding 2 — where this ticket's 840 ms is one of the
> inputs, not a separate question.

## FINDING 2 — about **THE LANE**, not about `ABC-078`, and this is the one that matters

**Condition B — the lane exactly as it stood BEFORE this ticket — medians 13.400 s CPU against
`NFR-008`'s 13 s clause.** The engineer measured the same thing from a different machine state and
got **12.2–13.1 s**. **Two independent readings, two very different machine conditions, and both
land at or over the clause.**

**This is a finding about the lane and it would exist if `ABC-078` had never been cut.** Charging it
to this ticket would be a category error: `ABC-078` did not spend the lane's budget, it arrived
after the budget was spent and asked for a slice that was no longer there.

**And it is exactly what `NFR-008`'s own arithmetic predicted, out loud, on 2026-08-13.** That
reading measured 9.545 s CPU at 28 files post-`threads` and published the consequence: *"USE ~7 AS
THE PLANNING NUMBER AND ~16 AS THE CEILING"* at ~341 ms all-in per file, calling the position
*"tight, not comfortable"*. **The lane now carries 35–36 files. Seven to eight files have been
added since — the whole planning number, exactly as forecast.** The row did not fail to see this
coming; **nobody re-read it at a cut.**

**What is owed, and by whom.** A ticket for **Architect/Design**, who owns `NFR-008`:

1. **Re-measure the lane total under the row's own protocol on a quiet machine** — mine is not that,
   see below — and restate the reading anchored to a commit.
2. **Rule on the clause.** Either the lane is genuinely over 13 s CPU and something gives, or the
   number is inflated and the restated figure says so. **Both answers are useful; not asking is
   not.**
3. **If it is over: the options are Architect/Design's and the owner's, not a gate's.** They exist
   and are worth naming so the ticket is not written from scratch: the lane's own
   `ADR-0008` records that `isolate: false` would save 30–36% **and is unavailable** (it disarms
   three `*.nfr.test.ts` guards — do not rediscover that lever); moving the slowest content behind
   an existing opt-in lane is available; re-deriving the 5% against today's plan is the row's own
   standing invitation and is **still unexercised**; and moving the 13 s level is the owner's alone.
   **I recommend none of them. I am recording that the question is now due.**
4. **Until it is ruled, `N8-LANE` cannot honestly be granted to any ticket** — a 5% slice of a total
   that is already spent is not a slice of anything. **That is the sentence I most want the next
   gate to inherit.**

## What this reading does NOT establish — the honesty clause, and it is why confidence is `medium`

**My absolute totals are inflated by an amount I cannot separate from content.** All-in cost is
13.400/35 = **383 ms per file**, against the ratified 2026-08-13 post-`threads` figure of **341 ms**.
Deflating my base by that 12% puts it near 11.9 s — **under the clause**. So:

- **The paired deltas are the robust part and the bar is written on them.** The +1 000 ms charge and
  the −0.66% null control stand as measured.
- **The absolute totals are indicative, not a discharge of anything.** I am **not** recording
  "`NFR-008` BREACHED" as a verdict — that verdict is Architect/Design's, under the row's protocol,
  on a quiet machine. **I am recording that two independent readings from two different machine
  states both land at or over the clause, and that this is now due.**
- **Not a figure for any other machine:** Apple M3 (Mac15,13) / 8 logical cores / Darwin 25.5.0
  arm64 / Node v24.12.0 / vitest 3.2.7; `UNKNOWN - verify` elsewhere. `node_modules` symlinked into
  each out-of-tree condition — the same disclosed deviation every prior lane reading on this project
  carries.
- **No target, level or account was moved by this gate.** `N8-LANE`'s instrument, statistic, null
  control, floor and spawn clauses are untouched; `NFR-008`'s 3 s / 13 s level is Olger Oeselg's and
  a gate does not move it. **Nothing was charged to `N8-SPAWN`**, whose opening balance stays 0 ms.
