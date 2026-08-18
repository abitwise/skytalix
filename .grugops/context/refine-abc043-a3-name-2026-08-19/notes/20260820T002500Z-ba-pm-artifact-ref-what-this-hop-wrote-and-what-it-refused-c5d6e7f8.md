---
id: 20260820T002500Z-ba-pm-artifact-ref-what-this-hop-wrote-and-what-it-refused-c5d6e7f8
kind: artifact-ref
by: ba-pm
at: 2026-08-20T00:25:00Z
verified_by:
confidence: high
refs:
  - ABC-043
  - ADR-0015
supersedes:
---

# What this hop wrote, and what it refused to write

## Written

| artifact | what changed |
|---|---|
| `plans/tickets/ABC-043-the-live-session.md` | **one new section** — `## The (N) limit — one criterion, one constructed fault, at the seam its Given names` — plus **one AMENDED line** appended to the second of my three original limits. **The original words are kept**; the amendment sits under them and is scoped `for A3 ONLY`. No criterion text touched, no score touched, no NFR row touched |
| `.grugops/context/refine-abc043-a3-name-2026-08-19/notes/` | this note plus a `decision` (the answer), a `decision` (the new limit), an `observation` (measurements + one wrong name in the brief + adjacent items) and a `claim` (gate numbers) |
| `.grugops/queue/` | claim taken by bare `mkdir`, subtask moved `pending/` → `claimed/` → `done/` |

Branch `grugops/refine-abc043-a3-name` off `main` @ `8bb7669`. Commits are incremental. **Not
merged.**

## Refused

- **To write `A3`'s test.** Branch 1 names the **shape** — a `./line-input.ts` double whose
  `createLineInputSeam` returns an `InputSeam` that throws, driven through the real spawned entry
  point. **The implementation, and the removal of the `parserBug` child, are the engineer's. Not one
  line of either is here.**
- **To touch `ADR-0015`, `ADR-0011`, `ADR-0013` or `plans/nfr-catalog.md`.** (S) and (C) are
  Architect/Design's; I applied neither and amended none. My answer is clause (N) only.
- **To cut a ticket** for the layer that is now uncovered (`src/line-input.ts`'s body, `[D31]`'s
  parser-bug narrative), or for anything else adjacent. **Named in the observation note for the
  Orchestrator to route** — the brief reserved routing.
- **To re-score the DoR, move a board column, merge or deploy.** `ABC-043` is still `In Review` and
  still unaccepted.
- **To treat my three names as an exhaustive deny-list** — `ADR-0015`'s alternative A. It would have
  kept the shipped rig and closed the ticket fastest, and it is wrong for QE's reason: a fence walked
  around by going one import deeper is not a fence.
- **To let "it is already on `main`" enter the answer.** The check is in the decision note and it is
  mechanical, not an assurance: **my answer refuses the instrument that is on `main`.**
