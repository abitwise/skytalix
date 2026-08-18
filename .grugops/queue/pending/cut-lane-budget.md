---
task: cut-lane-budget-2026-08-18
subtask: cut-lane-budget
role: ba-pm
workflow: agent-factory/workflows/07-backlog-refinement.md
ticket: —
ref: .grugops/context/cut-lane-budget-2026-08-18/
parent_ref: .grugops/context/security-nfr-ABC-078-2026-08-18/
enqueued_by: orchestrator
enqueued_at: 2026-08-18T21:00:00Z
branch: grugops/cut-lane-budget
base: main @ 387c9b2
---

# Subtask: cut ONE ticket for `OQ-1` — the lane's own budget is spent — and re-score two DoR pages

Read `parent_ref:` (Security/NFR's five notes) and `plans/nfr-catalog.md`'s three appended sections
first. **The measurements are taken under a stated protocol; do not re-derive them and do not
soften them.**

## 1. Cut the ticket — `OQ-1`, and it is bigger than the ticket that surfaced it

Security/NFR re-measured `N8-LANE` cleanly for `ABC-078` — three out-of-tree conditions, 9 rounds
rotated, n=8, **null control −0.66% CPU at 2/8 sign, admissible**. The finding about `ABC-078` is
minor and already accepted (`AR-N8LANE-078`, LOW, ~840 ms vs 650 ms).

**The finding about the LANE is not minor.** The lane measured **WITHOUT** `ABC-078` medians
**13.400 s CPU** against `NFR-008`'s **13 s** clause. This is `NFR-008`'s own 2026-08-13 forecast —
*"~7 files of planning headroom"* — and **7–8 files have landed since. It arrived on schedule with
nobody watching.**

The consequence Security/NFR drew, and it is the reason this cannot wait: **until this is ruled,
`N8-LANE` cannot honestly be granted to any ticket — a 5% slice of a spent total is not a slice.**
Every ticket now in flight or in `Backlog` carries an `N8-LANE ≤ 650 ms` line that is arithmetic
over a budget that no longer exists.

**Owner: Architect/Design** (Security/NFR named them). Cut the problem; the remedy is theirs. What
the page needs: re-measure under the ratified protocol **on a quiet machine**, then rule — raise the
clause, split the lane, move cost behind opt-in flags, or accept and re-baseline.

**One honesty clause you must carry onto the page rather than drop:** Security/NFR's all-in per-file
cost read **383 ms against the ratified 341 ms**, so part of its absolute numbers is load inflation
it could not size. That is exactly why it filed an open question and **not** an "`NFR-008`
BREACHED" verdict, and the ticket must not be written as though the breach were established.

## 2. Re-score `ABC-035`'s DoR — it is yours and it is overdue

Both recorded ⚠️ (items 3 and 10) were the **same** fact: the ordering dependency on `ABC-033`.
**Discharged by measurement**: `ABC-033` merged at `0d0f635`, `resolveMoveInput` exported on `main`,
suite 1049/36 skip 0 at the time of the pull. **I pulled `ABC-035` on the measured fact with the
unre-scored page recorded on the board rather than smoothed** — that is the state to correct now.
`ABC-035` has since been built and is in `In Review` at `e01033f`.

## 3. Re-score `ABC-078`'s page against the gate results

Its DoR was re-scored to 10/10 by you earlier. Now the gates have run:
- **`A1` is NOT met** — clause A of `NFR-004`, accepted as `AR-NFR004-A` by Security/NFR. Record
  that on the page as an accepted risk with its owner and its discharge test (pass ~2 900 ms at
  `EPIC-006`'s difficulty hop, or re-accept **in writing, never by editing the row**).
- **`A2`, `A4` and `A5` have guards QE proved bypassable** (`G1`, `G2`) — a repair hop is in flight.
- **Clause B is breached and `RF-1` is specified** — also in that repair hop.
**Do not mark any criterion met that is not.** Record state, do not resolve it.

## What you may NOT do

- **Do not rule `OQ-1`.** You cut it; Architect/Design rules it.
- **Do not edit `plans/nfr-catalog.md`.** Security/NFR owns those rows and its 121-line append moved
  no bar — the eight table rows hash identically before and after. Leave it.
- **Do not relax any bar, floor or level anywhere.**
- Do not cut more than the one ticket. If you find a second problem, note it and I will route it.
- Do not touch anything under `src/`. Do not move a board column. Do not merge.

## Gate

No `src/` change. Run the contained lane and record the numbers are unchanged from `main`
(**1049 tests / 36 files, skip 0** at `387c9b2`). An isolated worktree has no `.claude/worktrees/`,
so the recorded commands work inside one.

## Publish

Typed notes per Workflow 16 into `ref:`. No `finding` is admissible on this install. Claim by hand:
`mkdir -p .grugops/queue/claimed`, then a **bare** `mkdir` of
`.grugops/queue/claimed/cut-lane-budget`. **Commit incrementally.**

Commit on `grugops/cut-lane-budget`, never on `main`.
