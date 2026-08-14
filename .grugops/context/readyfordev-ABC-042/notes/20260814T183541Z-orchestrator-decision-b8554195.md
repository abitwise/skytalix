---
id: 20260814T183541Z-orchestrator-decision-b8554195
kind: decision
by: orchestrator
at: 2026-08-14T18:35:41Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - ABC-055
  - plans/board.md
  - plans/traceability.md
supersedes: 
---

# Orchestrator Decision — `ABC-042` passes the `Ready for Dev` exit and moves `Backlog` → `Ready`

## Request type
`refinement` → the `Ready for Dev` exit of `AGENTS.md` § Process rules rule 1. **Not** `ticket-to-pr`:
the request was "go forward with `ABC-042`", and forward from `Backlog` is the exit, not the build.

## Mode / Cadence / Autonomy
`lean` / `kanban` / `pr` (no remote, so `pr` means branch + gate here). `gate_enforcement: blocking`,
`security.block_on: high`, `queue.wip_limit: 3`.

## Activated agents
Security/NFR (×2 — rule, then discharge), Architect/Design, BA/PM (×2 — repair, then repair).
**Width 2 then 1, 1, 1 — never above the cap of 3.** Five subtasks, all drained.

## Why
`ABC-041` merged 2026-08-13 and was `ABC-042`'s only open dependency, so the two DoR ⚠️ were
discharged by fact. But the ticket was **cut against a tree that did not contain `ABC-041`'s seam**,
and rule 1 requires the criteria be re-read against the **built** tree. Two rulings on the page were
explicitly assigned to other roles (`A6`'s channel → Architect/Design; the security half → not
waived), and `ABC-041` established that **an implementer reading a trigger down to its rationale is
making a reading that is not the implementer's to make.** Both were settled before an engineer could
settle them silently.

## Board moves
`ABC-042`: **`Backlog` → `Ready`** (`Ready` 0/8 → 1/8). Ticket frontmatter moved with it, so board
and ticket do not disagree. **No ticket entered `In Development`; `In Development` stays 0/3.**

## The exit's result — 14 gaps, none of them code
| owner | item |
|---|---|
| Security/NFR | **HIGH, ASVS L1 `V2.2.1`** — `A6` was a denylist of four literals; raised, repaired, **discharged on measurement** |
| Security/NFR | `RF-2`…`RF-5`, then `RF-7`…`RF-10` — three of the last four were defects in its **own verbatim text**, including a `BAR 1b` guaranteed to false-RED a legal build |
| Architect/Design | the `stderr` rule; `ADR-0011` clause 1's trigger does **not** fire; the census found the correct build **reds a merged licence guard** |
| BA/PM | fourteen criteria repaired across two hops; DoR **8/10 → 10/10**, with an interim dip to 8/10 **disclosed unprompted** |
| Orchestrator | two inverted citations, a missing `makeRenderSeam` citation, and `RF-6` — a false sentence in this board's own header, now corrected |

**Two of the fourteen were `ABC-041`'s exact defect class** — a criterion whose literal reading
rejects the delivered build. `A10` was the worse one: **the ticket as cut was unbuildable**, because
every build meeting its file list failed its own *"suite green"*. Both were **deleted, not
re-worded**, and the surviving property re-homed to `A12` — `ABC-041`'s precedent, applied twice.

## What I got wrong, recorded because the trail is the point
My entry `claim` said 2 test files import a Node builtin. **It is 4.** Security/NFR measured it and I
reproduced theirs before accepting it; my note is superseded, carrying the surviving substance
forward. The same false figure was in this board's header (`RF-6`) and is fixed in the same hop.

## Stop conditions honored
- **I did not discharge Security's block.** It was raised by Security/NFR and lifted by Security/NFR
  on its own evidence. A DoR of 10/10 is not a discharged block, and BA/PM said so itself.
- **I did not re-score another role's DoR.**
- **I did not fold `ABC-055` in** to give myself the column rule 1 names — see
  `20260814T182000Z-orchestrator-observation-173087ef`.
- **I did not pass the exit when Security first discharged.** Four items were open, one of them the
  missing instrument for the very HIGH that started it (`RF-7`: caught at P ≈ 1.4e-9). They were
  cheap text fixes with specified replacements; shipping them to an engineer would have been
  shipping a ticket whose own HIGH had no working instrument.
- **No gate is claimed.** Zero files under `src/` changed, so none is owed and none was faked.

## Next action
**Pull `ABC-042` into `In Development`** — one subtask, `ticket-to-pr-ABC-042`, to the Software
Engineer. It is `P0`, `M` (3), `Ready` at 10/10, and `In Development` is empty (0/3). The engineer
must be told three things the page now carries and the notes explain: **`A12` licenses exactly one
edit to one merged file** (`LICENSED_DRIVERS`, one element plus its citation, zero production
lines); **the red that edit answers is EXPECTED, not a defect to diagnose under pressure**; and
**`A3`'s flat placement is load-bearing** — `src/cli/main.ts` makes the guard go green by making the
module invisible to it, which is the wrong green.
