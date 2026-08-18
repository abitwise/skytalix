---
id: 20260819T200000Z-ba-pm-claim-the-wall-clause-wants-its-own-ticket-and-five-things-i-found-and-did-not-cut-d9e4f1a3
kind: claim
by: ba-pm
at: 2026-08-19T20:00:00Z
verified_by:
confidence: high
refs:
  - ABC-110
  - ABC-108
  - ABC-109
  - ABC-086
  - ABC-078
  - ADR-0014
  - NFR-008
  - N8-LANE
  - AR-N8LANE-078
supersedes:
---

# The WALL clause **wants its own ticket** — I say so and I did not cut it. Plus `AR-N8LANE-078` corrected on the one live page that still read as pending, and **five things I found and deliberately did NOT cut**

**This is not a stamp.** Hand-authored `claim`; no `finding` is admissible on this install.

## 1. The wall clause — **MY CALL: its own ticket, routed FIRST or in parallel with `ABC-110`**

**One ticket was authorised and I cut the one `ADR-0014` says is owed. This is the recommendation,
not a second cut.**

**The facts, copied from Architect/Design:** `NFR-008`'s wall clause (`≤ 3 s`) is **UNRULED**.
Two samples straddle it — **2.805 s** (protocol, n = 8, warm interleaved rounds, 93.5%) and
**3.120 s** (cooled, n = 6, below the row's own `n`, **104.0%**). **That 3.120 s is the first sample
this lane has ever produced over the wall clause.** Architect/Design refused to rule it and refused
to pick the flattering sample, which was right: *a clause whose verdict flips with the filesystem
cache has not been measured well enough to rule.* The candidate explanation — a cold FS/JIT cache
after each 90 s idle gap — is labelled a **candidate, not a cause**, and was not separately
established.

**Why its own ticket rather than a clause on `ABC-110` — three reasons, and the third is the one
that decides it:**

1. **It is a different KIND of work.** `ABC-110` is a remedy blocked on a human decision.
   This is a measurement question — *which sample state is the lane's true wall cost, warm or
   cold?* — that is **fully pullable today with nobody's permission**. Folding it in would park a
   pullable measurement behind an owner escalation.
2. **It would make `ABC-110` unable to finish for a reason unrelated to its own deficit.** A ticket
   that cannot close because a second, unruled clause is open is two tickets hiding.
3. **THE DECIDER: it is an INPUT to `ABC-110`, not a part of it.** `ABC-110` `A6` must report the
   closing reading against **both** clauses. **If the warm/cold protocol question is still open at
   that point, `A6`'s wall figure is unreadable in exactly the way this one was** — and the remedy
   could be declared successful on CPU while leaving a breached wall clause undetected. **Settling
   the protocol first makes `ABC-110`'s own closing measurement admissible.** It is written into
   `ABC-110` `## Dependencies` and `## Out of scope` in those terms.

**The counter-argument, stated because it is real:** `ABC-110` will change the lane, so a wall
figure measured now describes a lane that is about to change. **It does not survive**, because what
the wall ticket must settle is the **protocol** (warm vs cold, and what `n` and what idle gap the
row's reading takes), and a protocol outlives the lane it is applied to. The absolute figure is the
lesser half of that ticket.

**Sketch, so routing it is cheap and so nobody re-derives this — NOT a cut, no id assigned:**
scope = settle warm/cold for `NFR-008`'s wall clause and rule it, at `n = 8` with an identity null
control, at a named commit with its file and test counts; **out of scope = the 3 s level (the
owner's) and the CPU deficit (`ABC-110`'s)**; size **`M`** (one measurement, one protocol amendment,
one ruling — the `ABC-108` shape, and the protocol already exists); priority **`P1`** — *not* `P0`,
because the clause is unruled rather than breached and one sample of six under `n` is not a breach;
*not* `P2`, because it gates `ABC-110` `A6`'s admissibility and the lane has never been over on wall
before. **Owner: Architect/Design, as `NFR-008`'s owner.** **The `P0` promotion trigger writes
itself: a protocol-conformant reading at `n = 8` whose median exceeds 3 s.**

## 2. `AR-N8LANE-078` — DISCHARGED, not charged. One live page corrected

**The arithmetic, and it is `NFR-008`'s own:** `9.545 + 11 × 0.341 = 13.30 s` — **already over the
13 s clause on 2026-08-13's published numbers, before `ABC-078` existed.** `ABC-078`'s 190 ms
overspend is **13% of the 1.480 s deficit**; **removing it entirely would not clear the clause.**

**I read every live page that mentions it.** `plans/nfr-catalog.md` (§ `AR-N8LANE-078` — DISCHARGED,
line 1466) and `ADR-0014` already carry it correctly **and I did not open either for writing**.
Context notes are append-only and were not touched. **One live page still read as pending:**

- **`plans/tickets/ABC-078-…md`** — its `N8-LANE` bullet said *"Its discharge is `ABC-108`'s
  re-measurement, where this 840 ms is one input"*, which reads as an open charge. **Annotated with
  the discharge, the arithmetic, and the sentence that its file is NOT a privileged candidate for
  `ABC-110`.** **Nothing was relaxed: `N8-LANE` is still NOT MET at ~840 ms against 650 ms (1.29x)
  and the accepted risk stays on the record as written.**
- **`ABC-108`'s page** — its title already says the lane sat at or over the clause *before* `ABC-078`
  arrived, and its `## Out of scope` framing was correct. **Confirmed rather than amended**, and the
  discharge is recorded in the new `## Criterion re-score` section.

## 3. Five things I found and deliberately did NOT cut

1. **The wall-clause ticket** — section 1. Recommended, sketched, **not cut**. The Orchestrator
   routes it.
2. **Re-deriving `N8-LANE`'s 5% against today's plan** — `NFR-008`'s own standing invitation, still
   unexercised after two rulings. **It is an `XS`/`S` on its own merits and it is NOT a remedy**: it
   changes what a *ticket* may spend, not what the *lane* already costs. **Not cut, because cutting
   it in the same wave as `ABC-110` invites exactly the misreading `ADR-0014` warned about — that
   re-deriving the fraction creates headroom. It creates none.** It is on `ABC-110` `## Out of
   scope` with that sentence attached.
3. **THE PROCESS FAILURE, and it is the highest-value thing on this list.** `NFR-008` item 6 wrote
   the restatement rule — *when files land, restate by arithmetic, do not re-measure* — **and
   published its own forecast in 2026-08-13's own words: "USE ~7 AS THE PLANNING NUMBER AND ~16 AS
   THE CEILING", "tight, not comfortable". ELEVEN files landed against a planning number of SEVEN
   and nobody ran the one line of arithmetic at any cut.** The 2026-08-19 measurement **confirmed a
   published forecast; it discovered nothing.** **No role re-runs that restatement when a test file
   lands, and nothing observes that it was not run** — the same shape as `ABC-105` (nothing observes
   the QE hop). **Not cut: it is a detector/process ticket, it is not the remedy `ADR-0014` owes, and
   cutting a second ticket was not mine to do today.** **Recommended as a real candidate**, and I
   would size it `S` and price it against `ABC-105`'s design rather than from scratch.
4. **`ABC-109` and `ABC-110` collide in `AGENTS.md`, in both directions.** `ABC-110` `A9` requires an
   `AGENTS.md` `### Test` entry per new opt-in lane, in the `*_DEEP` shape — **and those four
   entries are among the largest blocks in that section**, while `ABC-109` exists because
   `AGENTS.md` is **29,749 bytes against a 32,768-byte cap that truncates SILENTLY from the tail**,
   ~2.6 edits of headroom at the measured mean of +1,159. **Neither blocks the other; whichever runs
   second re-measures.** **Recorded as a dependency on `ABC-110`'s page rather than cut as a third
   ticket** — it is a sequencing fact, not a defect. **Flagged so it is not discovered at a gate.**
5. **`ABC-086`'s trace row carries a now-stale lane figure and I left it standing.** It reads
   *"`G4`: `NFR-008` is at **79.9% of its CPU clause** at 28 files and `src/` has 30 — the default
   lane may not absorb this epic."* The clause is now at **111.4%**. **I did not edit it: its
   DIRECTION was right and has been vindicated — the warning was correct and the number merely
   understates it now — and re-cutting other tickets' lane lines is explicitly not this hop's.**
   **Recorded here so the next reader knows the 79.9% is a 2026-08-13 figure, not today's.**

**And one thing I was explicitly forbidden and did not do, recorded so the absence is legible:
`plans/nfr-catalog.md` and `ADR-0014` were NOT opened for writing, and no ticket's `N8-LANE ≤ 650 ms`
line was re-cut.** `ADR-0014` decision 4 left them standing on purpose — **`N8-LANE` is now a rate
limit rather than a grant, which is strictly HARDER to read as a pass** — and re-cutting them would
have been churn that weakens a deliberately harder reading.
