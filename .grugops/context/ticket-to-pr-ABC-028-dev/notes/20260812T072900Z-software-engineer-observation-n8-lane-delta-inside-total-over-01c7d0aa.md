---
id: 20260812T072900Z-software-engineer-observation-n8-lane-delta-inside-total-over-01c7d0aa
kind: observation
by: software-engineer
at: 2026-08-12T07:29:00Z
verified_by:
confidence: medium
refs:
  - ABC-028
  - ABC-026
  - NFR-008
  - N8-LANE
  - ADR-0008
  - plans/nfr-catalog.md
supersedes:
---

# `N8-LANE`: the DELTA is inside the bar, and the TOTAL is over it — and it was over before this ticket

> **Hand-authored, no stamp.** `confidence: medium`, deliberately lower than the sibling notes:
> the delta and the `ADR-0008` clauses are measured to `N8-LANE`'s own protocol and I stand behind
> them, but **the TOTAL cannot be reconciled with the ~575 ms the ticket carries** and I could not
> determine how that number was derived. The irreconcilable part is marked `UNKNOWN - verify` rather
> than resolved in my own favour.

**Machine:** Apple M3 (`Mac15,13`), 8 cores, macOS 26.5.2, node `v24.12.0`, vitest `3.2.7`.
**Method:** exactly `plans/nfr-catalog.md`'s standing bar — CPU (user + sys) from `wait4` rusage of a
fresh OS process tree per run, runner invoked DIRECTLY (`node node_modules/vitest/vitest.mjs run`),
`PERFT_DEEP` unset, round 0 discarded as warm-up, condition order rotated every round, median of
paired per-round deltas with the sign test beside it, identity null control as its own condition in
the same interleaved harness.

## 1. This ticket's delta — n = 13, and the session IS admissible

```
laneA (delivered suite, 26 files)  median CPU 9.065 s
laneD - laneA  ABC-028, the WHOLE ticket   median  +131.4 ms  (+1.45%)  sign 11/13
laneN - laneA  IDENTITY NULL CONTROL       median   +27.1 ms  (+0.30%)  sign  8/13
```

`laneN` is a `cmp`-verified byte-identical copy of `laneA`. The null reads **+0.30%** against the
`<= 1.5%` admission clause and its sign is **8/13 — at chance**, so this session is admissible.

**A FIRST SESSION WAS DISCARDED AND IS REPORTED RATHER THAN DROPPED.** An earlier 4-condition, n = 8
run put this ticket at +58.4 ms but its **null control's sign was 7/8**, which is not "at chance" and
fails `N8-LANE`'s own admission clause. It is not quoted as a result. The admissible session is the
one above, and it reads **higher**, not lower.

**Against the standing per-ticket bar — `<= 650 ms` CPU, net of 160 ms per test file ADDED. This
ticket adds ZERO test files, so nothing is subtracted. `+131.4 ms` = 20% of the per-ticket
allowance. MET, with room.**

Where it goes, profiled in-process (median of 7): `A4`'s ten watched renders **10.81 ms** of the
block's **13.2 ms**, and **6.52 ms of that is the 2,000-ply case alone** (18,677 sampling points x
128 bytes). `A1` 0.26 ms, `A3` 0.13 ms, the eight arming controls 0.84 ms (0.80 ms of it the eight
`lineTo(20)` builds), positive control 0.10 ms, tripwire 0.52 ms. The vitest lane amplifies
in-process cost ~5-10x, which this project's `ABC-025` record already documents.

**QE's `A4`-alone figure was `-21.9 ms` at sign 3/8. Mine is `+131.4 ms` at 11/13 for `A1` + `A3` +
`A4` together.** These are not in conflict: QE measured one criterion, I measured three, and QE's own
limit (1) said so in advance.

## 2. `ADR-0008`'s ratified clauses — both hold, with room

`npm test`, `PERFT_DEEP` unset, three runs each:

```
        wall (real)                 CPU (user + sys)
laneA   1.91 / 1.65 / 1.69 s        8.78 / 8.79 / 8.87 s
laneD   1.63 / 1.63 / 1.74 s        8.82 / 8.85 / 8.83 s
bar     <= 3 s                      <= 13 s
```

**File count stays 26 in the lane and TWO for this pane**, so the ~320 ms floor allowance does not
move and the per-file subtraction does not apply.

## 3. THE TOTAL, re-measured from scratch as the brief required — and it does NOT reconcile

The ticket asks the second ticket to land to *"re-measure the TOTAL, not its own delta alone"*, with
the total stated as **~575 ms of the 650 ms content allowance (~88%)**. I measured the pane's content
total directly: the lane **with** both pane test files minus the lane **without** them (`laneP`,
24 files), same protocol, n = 8, in the earlier session.

```
laneD - laneP   the pane's content total, WITH ABC-028      +1169.9 ms gross  sign 8/8
laneA - laneP   the pane's content total, BEFORE ABC-028    +1078.3 ms gross  sign 8/8
net of the stated 160 ms/file floor x 2 files:
                WITH ABC-028      ~ +850 ms      against a <= 650 ms allowance
                BEFORE ABC-028    ~ +758 ms      against a <= 650 ms allowance
```

**Read literally, the pane's content total was ALREADY over the 650 ms allowance before this ticket
was written, and this ticket does not cause the breach.** Both readings have sign 8/8, so the effect
is not a noise artefact even though that session's null control was poor.

**THREE READINGS, and I am not picking one silently.**

1. **`N8-LANE`'s own standing bar is PER-TICKET** — *"the tests a ticket adds may cost at most 5% of
   `NFR-008`'s TOTAL — that is `<= 650 ms` CPU"*. On that reading `ABC-028` costs **+131.4 ms** and
   **MEETS** it with room. This is the bar `plans/nfr-catalog.md` actually states.
2. **The ticket states a TIGHTER version** — *"must leave the total `<= 650 ms`"* with the running
   total at ~575 ms. `575 + 131 = ~706 ms` -> **NOT MET**. A ticket may state a tighter bar and this
   one did, so this reading is legitimate.
3. **The total measured from scratch by file removal** reads ~850 ms net now and ~758 ms net before
   -> **NOT MET, and not met before this hop either.**

**Why 1078 ms and ~575 ms disagree is `UNKNOWN - verify` and I did not invent a reconciliation.** The
plausible cause is that ~575 ms is a SUM OF PER-HOP DELTAS, each charged only the increment its own
hop added, while a file-removal measurement charges the entire historical content of both files —
including all of `ABC-017`'s fixtures, the 2,000-ply shuffles, `buildAllCases()` being rebuilt inside
three separate `it`s, and the `RF-1` child process. Those two quantities are not the same and there
is no reason they should agree. **I could not verify that, so it is offered as a hypothesis, not a
finding.**

**Owner: `ABC-026` owns the lane total and is the named escalation route if it breaks.** I did not
open `plans/nfr-catalog.md` and moved no bar, target or level. **No criterion was narrowed to fit any
of these numbers** — see the sibling `decision` note, section 5.
