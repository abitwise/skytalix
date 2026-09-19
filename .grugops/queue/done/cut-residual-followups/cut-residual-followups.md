---
task: cut-residual-followups-2026-08-21
subtask: cut-residual-followups
role: ba-pm
workflow: agent-factory/workflows/07-backlog-refinement.md
ref: .grugops/context/cut-residual-followups-2026-08-21/
enqueued_by: orchestrator
enqueued_at: 2026-08-21T16:30:00Z
branch: grugops/cut-residual-followups
base: main @ fcf12c1
---

# Subtask: cut EXACTLY TWO tickets — the two that today's residual hops NAMED and deliberately did not cut

**The project owner authorised these two by name in session (2026-08-21): "cut those two tickets".
EXACTLY TWO. If you find a third thing, NAME IT AND LEAVE IT UNCUT** — that is the Orchestrator's
to route.

Both were named by the role that found them, with a size, a priority and an owner already proposed,
and both were left uncut **because cutting is your pen, not theirs**. You are not obliged to accept
their sizing or priority — re-derive both and say so if you differ. The highest existing id is
`ABC-115`; **derive the next ids yourself by listing `plans/tickets/`, do not trust that number.**

## Read first (re-derive; nothing in this brief is evidence)
- `.grugops/context/residual-G-QE115-3-2026-08-21/notes/` — the `decision` ruling and the
  `observation` carrying the mutant measurement. **All unstamped** (`human_admission` is `off`).
- `memory-bank/50-decisions/ADR-0017-spawn-budget-time-clauses-are-non-mechanical.md` — merged.
- `.grugops/context/residual-G-QE115-5-2026-08-21/notes/` — especially the `observation` note
  `…that-exit-one-is-not-usage-exit-code-it-is-an-unhandled-exception…`.
- `plans/nfr-catalog.md` — the `N8-SPAWN` account and the `T1`/`T2` triggers as `ADR-0017` left them.
- `src/cli.ts` around line 159 (the re-throw) and the `USAGE_EXIT_CODE` site.
- `plans/tickets/ABC-108-…md`, `plans/tickets/ABC-115-…md`, and `plans/board.md` § Backlog.
- `agent-factory/checklists/definition-of-ready.md` — score each ticket, name every ⚠️.

## Ticket 1 — the `T2` re-measure trigger has a ruling but no place a hop would ever see it
`ADR-0017` names a trigger nobody had: **a hop that changes what an EXISTING child does must
re-measure the `N8-SPAWN` CPU clause.** It was found by measurement — deleting one substitution hook
so an existing child runs the real engine cost **+2.68 s wall / +2.60 s CPU, 8.6x the per-child
clause, from a single child, with the whole suite still green and the count pin still armed.**

The ruling exists. The **carrier** does not: a hop that changes an existing child reads no checklist
and no cut template that would tell it `T2` fired. Architect proposed **XS / P2 / BA/PM**.

Cut the ticket for the CARRIER, and rule on the page — do not leave implicit — **where** it must
appear (the gate checklist, the `## Security / NFR triggers` block of future cuts, or both), and
**who checks it** at which hop. A residual with a ruling and no carrier is how this factory has lost
items before; say on the page what makes this one different.

## Ticket 2 — a fact of record is false, and it is teaching a future hop something that will not work
Both `ABC-115`'s standing residual note and the briefs written off it say the product exits `1` =
`USAGE_EXIT_CODE` on a failed non-`EPIPE` stdout write. **It does not.** QE reproduced it in 11
lines outside the product: that `1` is **Node's uncaught-exception status**, and the re-throw at
`src/cli.ts:159` fires on a **later tick**, so `main`'s `try`/`catch` **structurally cannot reach
it.**

This matters beyond bookkeeping: the standing note tells a future hop it may route non-`EPIPE` to
`70`. **It cannot do that with a `try`/`catch`** and would find out only after writing one. QE
proposed **XS / P3 / BA/PM** and called it a correction of record, not a re-opening.

Cut the ticket for the CORRECTION. **Notes are append-only — the fix is a new true statement that
supersedes, never a silent edit of the old one.** Rule on the page whether the correction is
documentation-only or whether anything in `src/` is owed; if you believe a product change is owed,
**say so and size it, but do not cut a second ticket for it.**

## Fences
- **EXACTLY TWO TICKETS. Backlog rows only.** Column moves are the Orchestrator's.
- **Zero files under `src/`.** No test touched. No production line.
- **Do not re-open** `ABC-115`, `ABC-066`, `ABC-108`, `ADR-0016`, `ADR-0017`, QE's PASS, the
  exit-code ruling, or the accepted stdout-write residual. Ticket 2 CORRECTS a record; it does not
  re-open the residual, and it must say so in its own words.
- **Do not move any target, bar, level, floor, account, instrument, statistic, null control or
  `UNKNOWN - verify` marker in `plans/nfr-catalog.md`.** The eight rows `NFR-001`–`NFR-008` must
  stay byte-identical at `sha256 63f66795…ca31` — **verify by hashing, do not promise.** If you
  believe ticket 1 implies an edit there, **name the edit owed and its owner; do not make it.**
- **Do not touch `AGENTS.md`** — `ABC-109` is live against it under a byte cap. `ADR-0017` already
  named one sentence owed there; if ticket 1 overlaps it, say so rather than duplicating it.
- **Do not sign, move or mention-as-accepted `ABC-115`.** It is `Ready for UAT`, **unsigned**, and
  no agent signs it.
- Do not merge, do not deploy. Own `git worktree`, commit on `grugops/cut-residual-followups`.

## Publish
Two ticket pages under `plans/tickets/`, two Backlog rows in `plans/board.md`, two
`plans/traceability.md` rows, and typed notes per Workflow 16 into `ref:` — hand-authored per
`agent-factory/contracts/context-note.md`; no `finding` is admissible. **State both new ids
explicitly in a `decision` note.** Each ticket gets testable acceptance criteria, a size, a priority
WITH its argument, and a DoR score with every ⚠️ named rather than smoothed. Where you differ from
the proposing role's size or priority, say what you differed on and why.
Claim by hand per Workflow 17: bare `mkdir .grugops/queue/claimed/cut-residual-followups`, move
this file in, then out to `done/`.
