---
id: 20260815T143400Z-ba-pm-observation-dor-moved-up-and-the-prose-budget-accounted-line-by-line-6d90ff31
kind: observation
by: ba-pm
at: 2026-08-15T14:34:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - E1
  - Q4
  - G2
  - AGENTS.md
  - plans/tickets/ABC-042-entry-point-argv-and-the-first-frame.md
supersedes: 
---

# The DoR moved UP, 9/10 → 10/10 — and the prose budget, accounted line by line

## The Definition of Ready DID move, and the direction is up

**Score now: 10 of 10 — MET. Score at the start of this hop, corrected: 9 of 10.**

The page recorded **10/10** throughout. That recording was **stale from 2026-08-15 11:24**, when QE's
census measured item 4's stated justification — *"`A6`(i) is now structural … so that build is RED
deterministically"* — to be **false** for two mutant classes. An item whose justification has been
measured false is **⚠️**, whatever the page says.

**I am applying to myself exactly the rule this page already applied to me once**: it records that *"the
first 10/10 did not survive measurement: items 4 and 6 were ⚠️ from 2026-08-14 18:12 until this hop"*.
The same thing happened again to item 4, and pretending the score was 10/10 across an interval in which
its own instrument was known not to reach would be the comfortable reading rather than the true one.

| item | before this hop | after | why |
|---|---|---|---|
| **4** acceptance testable and measurable | **⚠️** (`E1`, `Q4`) | **✅** | the near-miss family is complete over position and measured (138 cases, 0 accepted by the delivered build, both survivors red); `A6`(ii)'s control counts draws and can now fail |
| **6** security/NFR triggers with measurable target | ✅ | ✅ | `G2` corrected the spawn count to the ten the criteria force. The **breach** of the bar is `G1` — a delivery matter with the project owner, **not** a DoR defect: DoR asks whether the trigger carries a measurable target, and ≤ 650 ms CPU is one |
| **8** size assigned | ✅ | ✅ | still `M` (3). This hop adds ~120 pure-function calls and one counter: zero production lines, zero new spawns |
| **10** no major unresolved blocker | ✅ | ✅ | unchanged, but the row now **names the hold**: `ABC-042` is HELD at the merge on `G1`. A delivery hold is not a malformed criterion, and `AGENTS.md` process rule 1 draws exactly that line |
| 1, 2, 3, 5, 7, 9 | ✅ | ✅ | untouched by this hop |

## The prose budget — 328 before, 328 after, and here is every line

**`AGENTS.md` process rule 2 binds this hop and I paid for every line I added.** Six criterion repairs
landed **line-neutral**:

| added (criteria, scope, risks — these belong on the page) | lines |
|---|---|
| `E1`'s near-miss family clause (`A6`(i)) | **+2** |
| `Q4`'s draw budget (`A6`(ii)) | **+1** |
| `G5`'s tail-and-no-frame-row-before-it (`A1`) | **+1** |
| `G8`'s "in this task's context notes" (`A11`) | **+1** |
| `G2`'s ten forced spawns (`N8-LANE` trigger) | **+2** |
| `G7` (`A12`), header, DoR preamble and rows | **0** (in place) |
| **total added** | **+7** |

| removed (measurements and gate narration — rule 2 puts these in notes) | lines |
|---|---|
| `A1`'s *"Keys **verified** at `src/frame.ts:106-110` … the composed seam was run"* — a measurement of a merged contract the `## Dependencies` section already cites | **−3** |
| *"Two citation pairs were recorded INVERTED at cut and are corrected here"* — repair narration; the corrected citations are on the page and that is what matters | **−1** |
| the review obligation's *"(Relabelled 2026-08-14 — it was called a firing threshold and could fire nothing …)"* — narration about a past repair | **−1** |
| the closing block's *"the `Backlog → Ready` board move this score earns is **owed and not taken**"* — **stale**: the ticket has been `In Development` for a day | **−2** |
| **total removed** | **−7** |

**Nothing removed was a criterion, a scope fence, a risk or a ruling.** Every removed line is recoverable
from git and from the hop notes that produced it.

## Why I did not take the page to ≤ 300, said plainly rather than left as a miss

**328 is still 28 over the target and I could not close that gap honestly.** Here is the page by section:

```
Acceptance (A1-A12)                116
Security / NFR triggers (4 bars)    56
Scope                               32
Definition of Ready                 22
Dependencies                        20
Test notes                          17
Out of scope                        14
Problem                             13
Size and priority                   11
"does NOT make runnable" fence       7
```

**Acceptance plus the security bars is 172 lines — 52% of the page — and rule 2 says those STAY.** The
remaining narration I could find and justify removing was the seven lines above. **This ticket is long
because it has twelve criteria and four ASVS bars, not because it narrates**, so the only lever that
reaches ≤ 300 is **fewer criteria on the page — i.e. the split**, whose line the page already names
(**(a)** resolver + `A4`/`A5`/`A6`; **(b)** entry point + `A1`–`A3`/`A7`–`A12`). That split is not
available now: the ticket is built, gated and held at the merge, and splitting a delivered ticket to hit a
prose target would be chasing the metric.

**This is a real data point for rule 2's own control**, which says *"shorter tickets bought with worse
gaps mean the budget cut rigour instead of prose — revert it"*. `ABC-042` will read **328** against a 300
median target, and the honest reason is criterion count. **Recorded for the owner's review of the rule,
not repaired by me**, and carried as a LOW gap in my gaps note.
