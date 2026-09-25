---
id: 20260925T084900Z-software-engineer-claim-abc080-what-this-build-did-not-verify-5d18b3f6
kind: claim
by: software-engineer
at: 2026-09-25T08:49:00Z
verified_by:
confidence: UNKNOWN - verify
refs:
  - ABC-080
  - ABC-081
  - NFR-005
  - N8-LANE
supersedes:
---

# What the ABC-080 build did not verify

- **The hash-move arm has never run inside a search.** It is dormant: both recursions pass
  `null`. Only the comparator's unit row and `A2`'s variants exercise it. Whether it is right
  *in the tree* is `ABC-081`'s first question, and `A4`'s fourth column is not yet measurable.
- **Depth-in-budget is one machine (Apple M3) under background load, on two positions, three
  rounds.** Plain node reads 6 / 5. Vitest reads 4 / 4, and why the runner costs about a ply was
  not investigated here. Neither reading is an `NFR-005` verdict.
- **Game strength is not measured.** Ordering is lossless at fixed depth by `A1`. What the
  extra plies buy in play is not measured by anything in this ticket.
- **Keeping killers across `chooseMove`'s iterations is my design choice, not the ticket's.**
  The ticket says "cleared or invalidated between searches". I read one `chooseMove` call as one
  search. The Architect's probe made the same choice. A reviewer who reads "search" as "one
  iteration" would want a fresh table per iteration, which is a one-line change.
- **The `quiescence.test.ts` edit (the fingerprint re-pin) is outside the two test files the
  Scope's production files imply.** I judged it part of this change, not scope growth: its moves
  are unchanged, and only the node count moved, because the door now orders like `search`. The
  Orchestrator may rule otherwise.
- **The unordered depth-5 counts (35 538 933 / 19 426 355) come from one probe run each.** They
  are deterministic, so one run is a reading, but they are not re-checked by any lane.
- **Clock.** This hop's system clock read 08:19Z at the claim and 08:4xZ at these notes, which is
  earlier than the 14:00Z enqueue stamp. The Architect's hop saw the same. Stamps here are the
  clock as read. Not investigated.
