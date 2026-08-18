---
task: cut-frame-overflow-2026-08-18
subtask: cut-frame-overflow
role: ba-pm
workflow: agent-factory/workflows/07-backlog-refinement.md
ticket: —
ref: .grugops/context/cut-frame-overflow-2026-08-18/
parent_ref: .grugops/context/quality-gate-ABC-033-qe-2026-08-18/
enqueued_by: orchestrator
enqueued_at: 2026-08-18T14:30:00Z
branch: grugops/cut-frame-overflow
base: main @ 84993d4
---

# Subtask: cut ONE ticket for the frame overflow, and correct two ticket pages your pen owns

Read `parent_ref:` (QE's six notes) and `.grugops/context/repair-ABC-033-2026-08-18/notes/` (my own
first-hand reproduction) before you write anything. **The measurements are taken; do not re-derive
them, and do not soften them.**

## 1. Cut the ticket — `EPIC-002`'s frame owner

`ABC-033` `A4` is **falsified**. The candidate list of an `ambiguous` move outcome can exceed the
2-row message region: **7 knights attacking `d4` → `(+2 more)`, 8 → `(+3 more)`**. Reproduced twice
independently, FENs round-trip byte-identically, and **6 knights is the last size that fits**.

`ABC-033`'s own `A4` prose pre-assigned this outcome, and it is the instruction to follow:

> *"If any reachable ambiguity cannot fit, that is a finding for `EPIC-002`'s frame owner and a new
> ticket — **not a silent truncation and not a widening of the frame**, which would break epic
> acceptance `4a`."*

**So the ticket you cut may not resolve it by truncating or by widening the frame.** What it may do
is open: a scrollable or paged message region, a "list continues" affordance, a different
disambiguation interaction, or an accepted-risk ruling that 7+ identical-piece ambiguities are out
of scope. **You cut the problem; you do not have to cut the solution** — if the shape is
Architect/Design's, say so and name them.

Two facts that belong on the page because they change its priority:

- **The 6-queen case already passes with ONE COLUMN of headroom.** The margin is not comfortable.
- **8 knights of one colour requires six promotions.** Legal, round-trips, and this project ships
  adversarial fixtures — but **it is not a position that arises in ordinary play**. Size and
  prioritise honestly against that, and do not let the HIGH severity of a *falsified criterion*
  become a HIGH priority for a *player-facing risk* if you do not believe it is one.

## 2. Correct `ABC-033`'s `A4` — your pen, not the engineer's

`A4` currently reads as an unconditional promise ("hidden count is exactly 0" for *any* ambiguous
outcome this ticket can produce). It is false as written. **Re-score it honestly.** The delivered
module is on the correct side of the line — it produced the full list and truncated nothing — so
this is a criterion whose **premise** was wrong, not an implementation defect. Say that in those
words, and re-score the DoR table row if it moves.

**Do not mark `A4` met. Do not delete it.** A criterion that was falsified and re-scoped is a
better record than one that quietly disappears.

## 3. Re-score `ABC-078`'s ⚠️(5) — `ADR-0012` discharged it

`ADR-0012` is `accepted` and merged (`3f73d7e`): the book is a **decorator** of `EngineSeam`, built
by `EPIC-005`, wired by `EPIC-006`'s composition root; the seam-widening shape was **rejected**;
`src/turn-loop.ts` is unmodified. Architect/Design recorded this on the `ABC-078` page and
explicitly left the re-score to **your pen**, along with the now-stale sentence *"Owner: whoever
decides the `EPIC-005`/`EPIC-004` composition point."*

Also re-score **`ABC-095`** if the same ruling discharges its blocker — Architect/Design touched its
`## Dependencies` but not its DoR.

## What you may NOT do

- **Do not re-score `ABC-078`'s `A1`.** It came back not-literally-met (3027 ms worst case, 29/30
  over the 3 s clause by ≤ 27 ms, 0/30 over the 5 s ceiling). That is an **NFR bar** and it belongs
  to Security/NFR at the gate after QE. Leave it alone; I have routed it.
- **Do not move a board column** — mine.
- **Do not cut more than the one ticket.** Coding rule 5. If you find a second problem, name it in
  a note and let me route it.
- **Do not touch anything under `src/`.**

## Gate

No `src/` change, so the suite cannot move. Run the contained lane
(`npx vitest run --exclude '**/node_modules/**' --exclude '.claude/**'`, `npx biome check src tools
spike vitest.config.ts`, typecheck, build) and record that the numbers are **unchanged from `main`**
— currently **999 tests / 35 files, skip 0**. The repo root `npm test` is contaminated by sibling
worktrees (`ABC-050`); do not chase it.

## Publish

Typed notes per Workflow 16 into `ref:`. **No `finding` is admissible on this install.** Claim by
hand: `mkdir -p .grugops/queue/claimed`, then a **bare** `mkdir` of
`.grugops/queue/claimed/cut-frame-overflow`.

Commit on `grugops/cut-frame-overflow`, never on `main`.
