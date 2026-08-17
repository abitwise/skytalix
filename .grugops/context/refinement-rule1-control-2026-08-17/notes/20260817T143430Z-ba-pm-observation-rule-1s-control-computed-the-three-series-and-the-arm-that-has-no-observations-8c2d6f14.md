---
id: 20260817T143430Z-ba-pm-observation-rule-1s-control-computed-the-three-series-and-the-arm-that-has-no-observations-8c2d6f14
kind: observation
by: ba-pm
at: 2026-08-17T14:34:30Z
verified_by:
confidence: high
refs:
  - AGENTS.md
  - plans/metrics.md
  - 20260817T143212Z-ba-pm-decision-the-three-counting-rules-i-adopted-before-counting-anything-4a1c9e70
  - .grugops/context/ticket-to-pr-ABC-041/notes/20260813T210800Z-orchestrator-observation-criteria-review-at-the-in-development-entry-f060ca1f.md
  - .grugops/context/readyfordev-ABC-042/notes/20260814T183541Z-orchestrator-decision-b8554195.md
  - .grugops/context/pull-abc065-066-2026-08-16/notes/20260815T221745Z-orchestrator-decision-ready-for-dev-exit-re-read-for-abc065-and-abc066-7c41ae90.md
  - .grugops/context/ticket-to-pr-ABC-068-2026-08-16/notes/20260816T160000Z-orchestrator-observation-criteria-review-at-ready-for-dev-exit-7c31a0d9.md
  - .grugops/context/ticket-to-pr-ABC-061-2026-08-17/notes/20260817T100000Z-orchestrator-observation-criteria-review-at-ready-for-dev-exit-9d4c07f1.md
  - .grugops/context/ticket-to-pr-ABC-062-2026-08-17/notes/20260817T133000Z-orchestrator-observation-criteria-review-at-ready-for-dev-exit-4b1e77a2.md
  - .grugops/context/sweep-ABC-063-064-2026-08-17/notes/20260817T155000Z-orchestrator-observation-criteria-review-at-ready-for-dev-exit-abc063-abc064-7c31d9e2.md
  - .grugops/context/quality-gate-ABC-041/notes/20260813T215008Z-qe-e2e-claim-89a31e1f.md
  - .grugops/context/quality-gate-ABC-042/notes/20260815T113200Z-qe-e2e-observation-gaps-with-severity-and-owner-4a86f0c2.md
  - .grugops/context/quality-gate-ABC-065-qe/notes/20260816T031900Z-qe-e2e-observation-gaps-found-at-qe-for-abc065-5e1c8b26.md
  - .grugops/context/quality-gate-ABC-066-qe/notes/20260816T001800Z-qe-e2e-observation-gaps-found-at-qe-for-abc066-d73cfa8f.md
supersedes:
---

# Rule 1's control, computed for the first time. **VERDICT: INDETERMINATE — and one of its three arms has had NO OBSERVATIONS FOR FIVE CONSECUTIVE TICKETS.**

Definitions in the sibling `decision` note; they were fixed before anything was counted. Every cell
below was read out of the notes and the board archives named in `refs`, not out of any summary.

---

## Series 1 — gaps recorded at the `Ready for Dev` exit. Ordered by exit-review date.

| # | ticket | exit | **E-class** | **E-item** |
|---|---|---|---|---|
| 1 | `ABC-041` | 08-13 | **2** | **2** |
| 2 | `ABC-042` | 08-14 | **4** ⚠ | **14** ⚠ |
| 3 | `ABC-066` | 08-16 | **3** ‡ | **3** ‡ |
| 4 | `ABC-065` | 08-16 | **3** ‡ | **3** ‡ |
| 5 | `ABC-068` | 08-16 | **5** | **6** |
| 6 | `ABC-061` | 08-17 | **6** | **10** |
| 7 | `ABC-062` | 08-17 | **5** | **8** |
| 8 | `ABC-063` | 08-17 | **2** | **5** |
| 9 | `ABC-064` | 08-17 | **1** | **4** |

⚠ **`ABC-042` is on a different denominator and is not comparable.** Its `14` is summed across four
role hops; every other row is one Orchestrator reading pass. Its Orchestrator-only contribution is
`4`. Reported both ways, normalised neither way.
‡ **`ABC-065` and `ABC-066` share ONE review and ONE note** (`G1`–`G3`). The three gaps are not
separable per ticket. Entering `3` on both rows double-counts; entering `1.5` invents a number.
Both rows carry the joint figure and this footnote.

**Shape: rises `2 → 6` over rows 1–6, then FALLS on rows 8–9.** The fall is real under both
readings, and it is **n=2** — the two tickets whose pages had drifted anchors and nothing else. It
is not yet a trend and must not be read as one.

## Series 2 — gaps found at QE. **This is where the control breaks.**

| # | ticket | gate date | **Q** | severity | verdict |
|---|---|---|---|---|---|
| 1 | `ABC-041` | 08-13 | **9** | block on `A4` | `BLOCKED_NEEDS_FIX` |
| 2 | `ABC-042` | 08-15 | **10** (`Q1`–`Q10`) | **2 HIGH, blocking** | `BLOCKED_NEEDS_FIX` |
| 3 | `ABC-066` | 08-16 | **6** (`Q1`–`Q6`) | 0 HIGH, 2 MED, 4 LOW | GREEN |
| 4 | `ABC-065` | 08-16 | **4** (`Q7`–`Q10`) | 0 HIGH, 1 MED, 3 LOW | GREEN |
| 5 | `ABC-068` | 08-16 | **`UNKNOWN - verify`** | — | **no `qe-e2e` hop ran** |
| 6 | `ABC-061` | 08-17 | **`UNKNOWN - verify`** | — | **no `qe-e2e` hop ran** |
| 7 | `ABC-062` | 08-17 | **`UNKNOWN - verify`** | — | **no `qe-e2e` hop ran** |
| 8 | `ABC-063` | 08-17 | **`UNKNOWN - verify`** | — | **no `qe-e2e` hop ran** |
| 9 | `ABC-064` | 08-17 | **`UNKNOWN - verify`** | — | **no `qe-e2e` hop ran** |

**Measured, not inferred:** the newest `qe-e2e`-authored note anywhere in
`.grugops/context/*/notes/` is `20260816T032000Z-qe-e2e-decision-qe-verdict-on-abc065-all-six-criteria-met`.
**Nothing by that role has been published since 2026-08-16T03:20Z.** The five tickets that have run
since were gated by the Orchestrator and the Software Engineer at their own hands — competently,
with every gate re-run and every witness reproduced — but **that is not the instrument this control
names, and no note anywhere records a decision to stop dispatching QE.** It simply stopped.

**Two consequences, and the second one is the finding:**

1. **On the four tickets where QE ran, `Q` was 9, 10, 6, 4 — falling, and never once below 3.**
   Rule 1's threshold has **never been met on a single ticket**, let alone five consecutive.
2. **If the five blanks are read as zeros, the control reports itself PASSED** — five consecutive
   tickets at 0, comfortably below 3 — **and simultaneously fires its own "hiding" clause**, because
   exit gaps fell on rows 8–9 too. **A control that returns both PASS and HIDING from the same data
   is not returning a reading.** The blanks are `UNKNOWN - verify` for exactly this reason.

## Series 3 — backward moves. The one arm with a real baseline, and a real caveat.

Definition and de-duplication taken from `plans/metrics.md`'s `Rework rate` row, unchanged.

| period | n | tickets bounced | moves | **per ticket** |
|---|---|---|---|---|
| **before rule 1** (`ABC-001`…`ABC-030` `Done`, measured 2026-08-12) | 25 | 9 (36%) | 13 | **0.52** |
| **after rule 1** (`ABC-041`,`042`,`061`–`066`,`068`) | 9 | **0** | **0** | **0.00** |

Method: every `X` → `Y` column transition in the nine `plans/tickets/history/*-board-history.md`
archives was extracted and ordered against the board's column sequence. **Every transition on the
record is forward.** `0.00` clears rule 1's `< 0.5` bar and clears the pre-rule-1 baseline.

**And here is why that number is softer than it looks.** Rework did not go to zero:

- **`ABC-041` was `BLOCKED_NEEDS_FIX` at QE and took six hops and two blocks to close.**
- **`ABC-042` was blocked twice over, on two axes, and took ten hops.**

Both were repaired by subtask hops dispatched **while the ticket sat in `In Review`**. Neither ever
moved backwards, so **Definition B scores both as clean**. The metric fell partly because rework
stopped being *expressed* as a column move. Under a builder-returned reading — a gate sending the
branch back to a hand — the post-rule-1 count is **at least 2 of 9, not 0 of 9**.

**I am not restating the series with that reading**, because `plans/metrics.md`'s pre-rule-1 13 was
counted the column way and re-counting only one side would be the worse error. **It is recorded so
that `0.00` is never quoted as "rework stopped".**

---

## The verdict the control itself defines

Rule 1 offers three: **working** (exit gaps rise, QE gaps fall), **hiding** (both fall), or neither.

**Neither. INDETERMINATE — and specifically, not computable as written.**

| arm | reading |
|---|---|
| backward moves `< 0.5` | **MET at 0.00**, against a 0.52 baseline — with the caveat above |
| QE gaps `< 3` for five consecutive tickets | **NOT MET, and NOT MEASURABLE.** Never below 3 when observed (min 4); unobserved on the last five |
| exit gaps RISE | **rose `2 → 6`, then fell to `2` and `1`** on n=2 — direction not established |

**The "hiding" test cannot fire, and neither can "working", because both require the two gap arms to
be observed over the SAME window and they have not been observed together since 2026-08-16.**

## The finding I did not expect, and it is about the control's design rather than its execution

**The two gap populations are disjoint. Rule 1 cannot move the number it promises to move.**

I classified every item in both series by what found it:

- **Every gap in series 1 is page drift, found by READING**: stale line anchors (the plurality —
  roughly 20 of the ~24 E-item entries), stale prose, stale baselines, stale dependency lists, and
  criteria a merged ticket already satisfied.
- **Every gap in series 2 is instrument weakness, found by MUTATING**: mutants that survive the
  delivered suite (`X3b`, `X11`, `X12`, `M7`, `M11`, `M14`, `M15`, `M19`, `N3a`, `N4`), regexes that
  count occurrences instead of call sites, a `toHaveLength(250)` control that is a tautology, a
  positional helper with an undocumented coupling.

**There is not one item in series 2 that a criteria re-read against the tree could have found**, and
not one item in series 1 that a mutant census would have surfaced. The control's arithmetic assumes
a conserved quantity flowing upstream from QE to the exit — find it earlier, find less of it later.
**The record says these are two different populations found by two different methods, and rule 1
only performs one of them.**

**So the control is mis-specified, not merely un-run.** Raising exit gaps to drive QE gaps down is
asking a reading gate to reduce the yield of a mutation gate. Even with a perfect QE series restored,
the two arms would be expected to move independently — and a reader would then be entitled to call
that "hiding" on the rule's own words, wrongly.

## What the rule HAS demonstrably done, and it is not nothing

Every exit review found something, every time: **2, 4, 3, 5, 6, 5, 2, 1** — the run of eight has no
zeros. `ABC-061`'s `G-B` is the sharpest single item on the record: a *protective* criterion pointed
at a line that had moved 91 lines, which obeyed literally would have guarded an unrelated line, left
the instrument it fences ungoverned, **and still reported MET**. It was caught at the exit and cost
nothing. That is rule 1 working, on the thing rule 1 is actually for. It just is not the thing the
control measures.
