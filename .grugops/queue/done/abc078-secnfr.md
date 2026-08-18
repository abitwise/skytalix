---
task: security-nfr-ABC-078-2026-08-18
subtask: abc078-secnfr
role: security-nfr
workflow: agent-factory/workflows/15-security-audit.md
ticket: plans/tickets/ABC-078-iterative-deepening-and-the-engine-seam.md
ref: .grugops/context/security-nfr-ABC-078-2026-08-18/
parent_ref: .grugops/context/quality-gate-ABC-078-qe-2026-08-18/
enqueued_by: orchestrator
enqueued_at: 2026-08-18T18:00:00Z
branch: grugops/security-nfr-ABC-078
base: grugops/quality-gate-ABC-078-qe-2026-08-18 @ d36668b
---

# Subtask: the NFR gate on `ABC-078`. Three bars, and one of them is BREACHED

Branch off `grugops/quality-gate-ABC-078-qe-2026-08-18` @ `d36668b`. Read `parent_ref:` (QE's six
notes) and `.grugops/context/ticket-to-pr-ABC-078-2026-08-18/notes/` (the engineer's five) first.

**Both QE and the engineer measured and explicitly REFUSED to rule these bars, because they are
yours.** Nobody has adjudicated them. That is this hop.

## Bar 1 — `NFR-004`, and it has TWO clauses with DIFFERENT verdicts

**Clause A, the ≤ 3 s promise: NOT literally met.** Worst case **3027 ms** (engineer, on
`position-4/f3d4`) and **3030 ms** (QE, on `position-5/b1c3`) — **29/30 over the 3 s clause by
≤ 30 ms**, ~0.9%. QE varied `NODES_PER_CLOCK_CHECK` over 64x and confirmed the engineer's
attribution: median inter-check gap scales linearly, `max(gap) ≥ overshoot` in 24/24 runs. **There
is no hidden cause.** But QE also found the **tail does not scale** — at NCC=256 one 256-node
interval still took **105 ms** — so the obvious remedy cuts the median and not the worst case.

**Clause B, the ≤ 5 s hard ceiling: BREACHED, and this is the one that matters.** QE measured
`budgetMs = 4999` in → **5003 ms** out. `chooseMove` does not clamp, and nothing in the delivered
code records the constraint `EPIC-006` would have to honour.

**What I need from you, and it is a ruling, not a measurement:**
- Is clause A's ~0.9% overshoot **acceptable as an accepted risk**, or does it require a fix? If
  acceptable, say so in `plans/nfr-catalog.md` with the reasoning and the machine, so the next
  reader inherits a decision instead of a number.
- **Is the clamp owed HERE or by `EPIC-006`?** The ticket's `## Out of scope` says difficulty
  selection is `EPIC-006`'s and *"this ticket takes a budget as a parameter"* — which is an argument
  the clamp is the caller's. Against that: `NFR-004` says *hard ceiling 5 s at ANY difficulty*, and
  a bar nobody enforces is not a bar. **Rule it.** If you rule it belongs here, say exactly what the
  fix is and I will route one repair hop that does it.

## Bar 2 — `NFR-005`, depth-in-budget. Report, do not promote

Measured **below its FAIL floor**: kiwipete depth **4**, position-6 depth **3** at 3 s, against a
FAIL floor of depth 6 and a PROVISIONAL WARN level of 7. **This is expected** — `ABC-079`
(quiescence), `ABC-080` (move ordering) and `ABC-081` (transposition table) are all unbuilt, and
they are the tickets that buy depth. **Do not fail the ticket on this**, and do not quietly relax
the floor either. Record where the number actually sits today, against a bar written for a finished
engine, and say what has to land before the floor is meaningful. The depth-7 level stays
**PROVISIONAL** until `ABC-074`, which is `Blocked` for want of a non-M3 machine.

## Bar 3 — `N8-LANE` ≤ 650 ms CPU

Engineer measured **~700 ms net** (paired interleaved delta median 860 ms, n=7, sign 7/7, minus the
160 ms floor) — **~50 ms over** — and named its own confound: the machine was running six sibling
worktrees. It did **not** claim the bar met. Also relevant: the whole lane was already at or over
`NFR-008`'s 13 s CPU clause **before** this ticket (12.2–13.1 s base).

Re-measure if you can do it cleanly, or rule on the evidence. **The interesting question is not
this ticket's 50 ms — it is that the lane's own budget was already spent before it arrived.** Say
whether that is a finding about `ABC-078` or a finding about the lane.

## Security

**The ticket says "Security — not triggered. No input surface; the budget is a number from a
caller."** Check that claim rather than inherit it: the delivered module takes a number and a clock
from a caller, spawns nothing, reads no file, opens no socket, adds no dependency. **Confirm or
break it**, and note that `budgetMs: Infinity` and a never-advancing clock are the two inputs QE
found that do not terminate — decide whether non-termination on a caller-supplied number is a
security concern here or a documentation one.

## Fences

- **You do not fix and you do not write tests.** You measure, you rule, you record.
- **Do not weaken a bar to make it pass.** If a bar is wrong, say the bar is wrong and why.
- **Do not rule `ABC-077`'s merged guards** or re-open the negamax duplication — QE ruled the
  duplication is the right call under merged constraints and I accept that.
- Do not merge, do not deploy, do not move a board column.

## Publish

Typed notes per Workflow 16 into `ref:`, and record bar rulings in `plans/nfr-catalog.md`. **No
`finding` is admissible on this install** — use `decision` / `claim` / `observation`. Claim by hand:
`mkdir -p .grugops/queue/claimed`, then a **bare** `mkdir` of
`.grugops/queue/claimed/abc078-secnfr`. Commit incrementally.

Commit on `grugops/security-nfr-ABC-078`, never on `main`.
