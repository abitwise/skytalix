---
id: 20260816T080000Z-orchestrator-decision-three-epics-cut-two-corrections-to-me-and-the-g9-ruling-7e2a4d19
kind: decision
by: orchestrator
at: 2026-08-16T08:00:00Z
verified_by: 
confidence: high
refs:
  - .grugops/context/epic-to-tickets-EPIC-004/notes/
  - .grugops/context/epic-to-tickets-EPIC-005/notes/
  - .grugops/context/epic-to-tickets-EPIC-006-packaging/notes/
  - plans/board.md
  - plans/traceability.md
supersedes: 
---

# Three epics cut, two corrections to me, and the `G9` ruling

## What landed

22 tickets — `ABC-074`…`ABC-087` (14), `ABC-092`…`ABC-096` (5), `ABC-100`…`ABC-102` (3). Every
range respected, `ABC-088`–`091`, `ABC-097`–`099` and `ABC-103`–`115` unspent. No `SPLIT_REQUIRED`
fired; largest ticket anywhere is `M`. Board now 98 rows = 92 tickets + 6 epics, reconciled against
`plans/tickets/`. **Nothing on this board remains undecomposed.**

## The two corrections I was handed, and why they matter more than the tickets

I sent three claims to the `EPIC-004` hop marked **verify, do not trust**. Two came back corrected,
**pointing opposite ways, and both trace to the same owner ratification** (`ADR-0003`, 2026-07-30):

1. **I believed `ABC-008` discharged `RISK-002`'s spike. Wrong.** Amendment (2c) **re-pointed** the
   mitigation from nodes/sec to *deepest ply completed in 3 s, on target hardware*. `ABC-008`
   measured a throwaway benchmark with **no legality filtering at all**, on an M3. A second spike is
   genuinely owed. **The board row I was ready to "fix" was correct as written, and I did not touch
   it.**
2. **I passed on a 163k–351k "shortfall" against `NFR-005`'s 500k.** Figures right; **the target was
   retired by the owner the same day** and the block now reads *"node rate is a diagnostic, not the
   target."* Against the live target there is no shortfall — depth 6 clears its FAIL floor with ~4x
   margin, and depth 7 is marginal **by design**, chosen precisely because it detects a regression.

**The lesson is the pattern, not either fact:** one ratification created an obligation I thought was
discharged and retired one I thought was live. **Applying only one correction gets the epic wrong in
either direction.** This is exactly why the three claims went out as *verify*, and it is the
strongest evidence yet for this project's process rule 1.

Cost of being wrong, had I "corrected" the board myself: a P0 epic decomposed with no spike, against
a deleted performance number.

## Ruling — `G9`, the difficulty vocabulary

**My boundary rule assigned OWNERSHIP and did not create the shared NAMES both owners need.** That
is the gap, and the agent stated it more precisely than I had: ownership flows one way, **data flows
`EPIC-004` → `EPIC-006`**.

- **`ABC-087` PUBLISHES** the level table: the count, each level's time budget, and the default
  level's budget (**3 s**, because `NFR-004`/`NFR-005` say *"at default difficulty"* and need a
  referent).
- **`ABC-101` CONSUMES** it: the flag surface, the human-facing names, persistence, messaging. **It
  defines no second default.**
- So *"at default difficulty"* has **exactly one referent** in this repo.

**The ruling costs no rework**: both hops independently derived "the middle level / 3 s" from the
same `NFR-004` sentence, without being able to read each other. That agreement is the evidence the
ruling is right, not a coincidence to paper over.

## Overlaps my boundary rules did NOT catch — the count matters

I named four boundaries. **Agents found two more, and one of them runs the opposite way to my
ruling** (`G9`, data flowing engine→CLI). The other is `G4`/`G3`: **a single seeded-RNG seam wanted
by two epics** — `EPIC-005`'s book picker and `EPIC-004`'s blunder rate — with no production RNG in
`src/`. **Unruled, two RNGs ship.** Architect/Design's, recorded on both sides, resolved by neither.

Three hops in a row have now found a subject-level overlap I did not pre-name. The honest reading:
**pre-naming boundaries helps and does not suffice**, and the thing that actually catches them is
agents reading past their own edges and being told to record rather than resolve.

## `W1` again — I fixed instances and missed the category

All six epic pages read `status: backlog`; `EPIC-001` and `EPIC-002` sit in `Done`. My `W1` repair
an hour ago covered **tickets** and never asked whether epics had the same contract. Both corrected.
**Twice now I have repaired a drift class one layer at a time** — worth a validator ticket rather
than a third manual pass.

## The Blocked-column rule, stated because two hops disagreed

`EPIC-005`'s hop argued `Blocked` reads as *"started and stuck"*; `EPIC-004`'s asked for two tickets
in `Blocked` from the moment they were cut. The board's own policy settles it — any agent may move a
ticket to `Blocked` with a reason and a date, and the sweep escalates at `blocked_escalation_days`.
**Rule: blocked on an EXTERNAL input (a human, hardware, an unmade ruling) → `Blocked`. Blocked only
on ORDERING within the plan → `Backlog`.**

- `ABC-074` → `Blocked`: needs a **non-M3 machine**. Only the owner can supply it.
- `ABC-075` → `Blocked`: needs the **en-passant XOR ruling**. Architect/Design's.
- `ABC-095`, and all packaging work behind `ABC-100`, stay in `Backlog` — ordering, not external.

Both blocked items now escalate in 2 days, which is the point.

## What I am escalating rather than deciding

- **`G1` — the distribution channel.** The owner's, and `ABC-100` is shaped to receive his exact
  words rather than a paraphrase.
- **`G1`(004) — a non-M3 machine.** The owner's; `ABC-074` cannot run without it, and `ABC-078`'s
  `NFR-004` result reads `UNKNOWN - verify` off this machine.
- **`G3` — the loop arm for state-changing, non-advancing commands.** Architect/Design's, and it
  should be ruled **once** for `ABC-102` and `ABC-046` together.
- **`G4`(004) — `NFR-008` at 79.9% of its CPU clause at 28 files, with `src/` at 30.** The audit
  called the budget unable to comfortably admit both epics *when this one was thought to be `L`*. It
  is `XL`. Architect/Design + Security/NFR.
- **`G5` — `ABC-084`'s gate has no trigger and `ABC-085` has no home.** Mine, with the owner.
- **`EPIC-006` should probably be two epics.** Recommended by its cutter, not taken by me; it is the
  owner's call and it is recorded on the board row.

## Sizing — five for five

`EPIC-004` `L`→`XL`, `EPIC-006` `L`→`XL`, `EPIC-005` `S`→`M`, after `EPIC-003` M→XL and
`EPIC-006` M→L. **Every epic this board has ever decomposed was undersized beforehand.** The
`EPIC-005` hop is the one to imitate: handed that precedent, it **refused to ride it**, calling two
data points a pattern rather than evidence and stopping at `M`.

## The disclosure, twice now

A second agent disclosed a single read-only `git status --porcelain` against its hard limit,
unprompted, having reached for it where `ls` would do. Accepted and recorded. **Two hops, two
agents, same trip — that makes the limit's wording my defect, not their discipline problem.** The
next subtask template says "use `ls`, not `git status`" rather than "no git commands".
