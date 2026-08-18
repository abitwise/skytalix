---
id: 20260818T191500Z-ba-pm-observation-five-things-found-and-deliberately-not-cut-d4e5f6a7
kind: observation
by: ba-pm
at: 2026-08-18T19:15:00Z
verified_by:
confidence: high
refs:
  - ABC-033
  - ABC-032
  - ABC-107
  - EPIC-003
supersedes:
---

# Found and **deliberately not cut** — coding rule 5, one ticket, and here is everything I left

## 1. `G2` — SAN promotion is unreachable by case folding **in both directions**. NOT CUT

QE measured `E8=Q` (caps lock) **and** `e8=q` both coming back `rejected`/`unreadable` while
`e8=Q` is a `move`. The engineer self-reported only the lowercase half. It is a **real, narrow
defect** with a live user path — caps lock is not adversarial, it is Tuesday — and QE's own
disposition is *"new ticket or `ABC-032`"*.

**I did not cut it, and it is the one I most wanted to.** The brief limits this hop to one ticket
and names naming-it-in-a-note as the alternative. **This is that name. It needs routing.** My read
for whoever routes it: it is `ABC-032`'s grammar, not `ABC-033`'s dispatcher, and it is smaller than
`ABC-107` — likely `XS`/`S`, `P2`, and it belongs to `EPIC-003`.

## 2. `G3`–`G6` — four guards that do not bite. NOT CUT, and I do not think they are mine

- `G3` `A5`'s spy watches `deps.legalMoves`; `toSan` imports `legalMoves` directly, so a mutant that
  triples the real derive count reds **0** tests.
- `G4` `unreadable` is pinned to no input anywhere; a mutant returning `no-such-move` for every
  rejection passes all 40.
- `G5` the "fixed and asserted" order of attempt is not asserted; swapping coordinate and SAN reds 0.
- `G6` the whole fold-ambiguity path rests on one fixture.

**QE routed all four to the engineer as test-side repairs on delivered behaviour that is correct
today.** They are not criteria failures and not product decisions. Cutting tickets for another
role's already-routed repair list would be bloat, and `G5` additionally contains a *ticket-prose*
inaccuracy (`ABC-033` `## Scope` says "order of attempt, fixed and asserted" when `attemptsOn` calls
both resolvers eagerly and the order is a preference over two computed results) — **that half IS my
pen, and I left it alone because the brief scoped my `ABC-033` edit to `A4`.** Named here so it is
not lost.

## 3. `ABC-033`'s front matter still reads `status: backlog` / `column: Backlog`

The ticket is `In Development` on the board and delivered. **Stale, and I did not touch it** —
column state is the Orchestrator's and I was told not to move one. Flagging, not fixing.

## 4. The threshold is a **frame** property, and `ABC-107` is not the only thing that can move it

`A5` on `ABC-107` pins the 6/7/8 boundary with fixtures precisely because the boundary is a function
of panel width, SAN rendering length and `MESSAGE_ROWS` — **three things owned by three different
tickets**. I did not cut anything for the other two. If Architect/Design rules option 4
(accepted-risk), `A5` becomes the *only* protection the boundary has, and it should not be dropped
along with the rest of the page.

## 5. Two process facts about this hop, recorded because they cost the next reader time

- **The brief's base `main` @ `84993d4` is one commit stale.** `main` is at **`6d0f3e2`**, which is
  the commit that *enqueued this subtask*. Branching at `84993d4` would have deleted the queue file
  I am required to move to `done/`. **I branched `grugops/cut-frame-overflow` at `6d0f3e2`** and say
  so rather than silently obeying an instruction that contradicts itself. This is the same
  enqueue-after-branch ordering the Orchestrator already recorded as error (1) of the previous wave.
- **QE's six notes are NOT on `main`.** `.grugops/context/quality-gate-ABC-033-qe-2026-08-18/notes/`
  exists and is **empty** in the working tree; the notes live at `8c84265` on the unmerged branches
  `grugops/abc033-repair` and `grugops/quality-gate-ABC-033-qe-2026-08-18`. **I read all six out of
  git** (`git show 8c84265:<path>`) rather than reporting them missing. **The shared verified context
  is the memory, and a note that only exists on an unmerged branch is not shared** — if those
  branches are ever discarded, this hop's entire evidence base disappears while every page citing it
  survives.
