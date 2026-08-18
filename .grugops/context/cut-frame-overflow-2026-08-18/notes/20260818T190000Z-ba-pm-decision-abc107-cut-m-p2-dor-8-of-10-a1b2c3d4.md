---
id: 20260818T190000Z-ba-pm-decision-abc107-cut-m-p2-dor-8-of-10-a1b2c3d4
kind: decision
by: ba-pm
at: 2026-08-18T19:00:00Z
verified_by:
confidence: high
refs:
  - ABC-107
  - ABC-033
  - EPIC-002
  - EPIC-003
  - src/frame.ts
supersedes:
---

# `ABC-107` cut — `M`, `P2`, DoR **8/10 ⚠️x2**. One ticket, and the shape is not mine to pick

`plans/tickets/ABC-107-the-message-region-cannot-show-a-seven-candidate-ambiguity.md`.

**The problem, not the solution.** The message region is 2 rows (`MESSAGE_ROWS`, `src/frame.ts:45`)
and the packer appends `(+N more)` for what it drops (`markerFor`/`withMarker`, `:134-142`, anchors
re-checked at HEAD by me — `ABC-033`'s page cited `:182-188`, which had drifted, and I corrected it
there). Seven candidates do not fit. **I did not choose the remedy.** Four options are named on the
page — a paged region, a second disambiguation prompt, a narrower SAN rendering, or an accepted-risk
ruling — **and the decision is Architect/Design's at `In Design`**, by the same route `ADR-0012`
took. Choosing between them on a ticket page would be product deciding the frame's interaction.

**Two shapes are ruled out before design starts**, and not by me either — by `ABC-033` `A4` and
`EPIC-002` `4a`: **silent truncation, and widening the frame**.

## Priority `P2`, and this is the number to argue with if any

QE scored the falsification **HIGH**. I did not carry that across, and I want the reasoning in the
record rather than in a row:

- **HIGH is about a criterion being false. Priority is about a player.** Eight knights of one colour
  requires **six promotions**; seven requires five. Legal, round-tripping, and **not a position that
  arises in ordinary play**. Nobody is being misled today, and I will not manufacture a `P0` out of
  a severity label.
- **Not `P3`, and this is the measured half.** The accepted six-queen fixture passes with **ONE
  COLUMN of headroom** (20 and 19 of 21). Six same-piece attackers is not exotic — a central square
  has exactly eight knight-attackers — so the distance between "shows everything" and "hides
  candidates silently" is **one item**, and nothing guards it. A wider figurine, a longer
  disambiguator or one more status column moves it, and no test would notice. `A5` on the new page
  exists for exactly that.
- **Not `P1`**: nothing is blocked behind it and no epic acceptance is held open by it.

## Size `M`, conditional, with the trigger written down

One decision to consume, one change inside the frame's packing, a frame state that does not exist
today, and a fixture set across two modules' tests. **Not `S`** — under the paging and second-prompt
options the region stops being a pure function of its items. **Drops to `XS` if Architect/Design
rules accepted-risk** (a documented bound plus `A5`'s guard). **Re-score, do not absorb.**

## DoR 8/10 ⚠️x2 — items 3 and 10, and they are one fact

⚠️(3) not estimable with confidence while the size spans `XS`–`M`; ⚠️(10) the shape is an unmade
design decision straddling `EPIC-002` and `EPIC-003`. **Both are "the shape is unruled", stated
twice because the checklist asks twice.** Items 4, 5, 6 and 8 are ✅: five measurable criteria
(unreachable count **0**, identical row count, hidden **0** at six candidates, **0** changed lines in
`src/move-input.ts`, three pinned fixtures), the dependency named **with an owner**, `NFR-002` /
`ADR-0009` / `N8-LANE` with numbers, and a size with a re-size trigger.

**This ticket is NOT ready to pull, and the score says so.**

## The fence that matters most on the new page

`A4` on `ABC-107` pins **`src/move-input.ts` at 0 changed lines**. The cheap fix — truncate at the
source — is the exact thing `ABC-033` `A4` forbids, it would look like a fix, and it would make the
frame's promise true by making the dispatcher lie.
