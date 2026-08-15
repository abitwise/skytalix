---
task: g1-answered-2026-08-15
subtask: security-nfr-ABC-042-g1-regrade
role: security-nfr
workflow: agent-factory/workflows/15-security-audit.md
ref: .grugops/context/security-nfr-ABC-042-g1-regrade/
parent_ref: .grugops/context/g1-answered-2026-08-15/
ticket: plans/tickets/ABC-042-entry-point-argv-and-the-first-frame.md
enqueued_by: orchestrator
enqueued_at: 2026-08-15T08:55:00Z
branch: grugops/security-nfr-ABC-042-g1-regrade
base: grugops/abc042-merge-key @ TIP — branch by NAME, not by sha
---

# Subtask: re-grade `G1` against the bar the owner amended — and the result is NOT assumed

**Branch from `grugops/abc042-merge-key` by NAME, at its tip.** No sha is written here on purpose:
the tip is the commit that adds this file, and a `base:` sha in a file cannot name the commit that
creates it. The last hop found that defect the hard way and it is not repeated.

`main` is NOT an ancestor of that branch's `ABC-042` content — do not merge `main` in.

## What changed since you last ruled

**`G1` was escalated to the project owner and the project owner answered.** The answer, what it
authorizes, and what it explicitly does not, are in **`parent_ref:`** — read it first, verbatim, and
do not take my summary of it from this file.

`NFR-008` now carries a **spawn account**. **You recommended it and you refused to create it**, on
the grounds that a gate does not move an owner-ratified bar. **That refusal was correct and is not
overturned** — the authority changed, not the role that holds the pen. Architect/Design wrote it, in
the row it owns, modelled on the floor account it also owns. Its wording and the reasoning it
rejected are at `.grugops/context/design-nfr008-spawn-account/notes/` (four notes) and the account
itself is `plans/nfr-catalog.md` § `N8-SPAWN`.

**Read the account as written, not as recommended.** It is not your recommendation transcribed. It
carries a charging test, exclusions, and stops that did not exist in the recommendation.

## The one job

**Re-grade `G1` — `ABC-042` against `N8-LANE` as amended by `N8-SPAWN` — on the tree that will
merge.**

**The result is not assumed and no target is carried into this file.** Your own re-check predicted
what this ticket's real content would come to under an account that did not exist yet. That figure
is a prediction you made about wording you had not seen; **it is not a goal, and reproducing it is
not success.** The honest outcomes are all of: MET, NOT MET, or *the account as written does not
reach this ticket*. **If it is NOT MET, say so plainly** — the merge holds again, goes back to the
owner with your reason, and nobody is embarrassed by that.

Two things worth ruling explicitly rather than leaving implicit:

- **Does each child this ticket spawns actually pass the account's charging test?** The test is
  countable off criterion text. This ticket's forced children are the reason the account exists, so
  a charge that does not qualify is the finding that matters most.
- **Does the account's own stop fire here?** It has a cumulative wire and a disclosure wire. If this
  first charge trips either, that is a fact for the record and for the owner, not a reason to soften
  the charge.

## Scope of the security review itself — rule this, do not assume it

Your `PASS_WITH_RISKS` was re-checked against `d011df4`. Since then the tree gained three merges and
two commits. **My reading is that the delta is documentation, notes and queue state only — zero bytes
under `src/` — but that is my reading and you are the gate.** Verify it yourself
(`git diff --numstat d011df4..HEAD -- src/` is the check I used) and **rule whether your ASVS L1
result still stands on that basis or must be re-run.** If it must be re-run, re-run it.

## Your cell in `plans/traceability.md` — a mess I made deliberately and am handing you

The `ABC-042` row's `NFRs` cell currently carries **BOTH of your parallel writes** — the gate write
and the later re-check — separated by a marker in my voice explaining why. They arrived from branches
that never saw each other, containment failed in both directions, and **each is your own hand on your
own cell.** I would not pick one at a merge; that is the same act as accepting `G1` on the owner's
behalf, one size down.

**Reconciling them into one text is yours, at this hop, along with whatever the re-grade changes.**
Two mechanical constraints, because this row has broken before: **the row is 10 cells and must still
be 10 cells afterwards** (assert it, do not eyeball it), and **no `|` may appear inside any cell** —
a pipe in a cell broke this table once already on this ticket.

## Hard limits

- **You may not move a bar.** The owner moved one, once, in one direction. `N8-LANE`'s 5%,
  instrument, statistic, null control and floor clause are untouched and stay untouched; `N8-SPAWN`
  is Architect/Design's text and not yours to edit. A needed change is a recorded reason and an
  escalation, exactly as last time.
- **`plans/tickets/ABC-042-…md` is CLOSED.** BA/PM refused three edits to it after the gates passed,
  including one where you are right that the bar text is wrong. That refusal holds here. Your `S1`–`S6`
  and the bar-text defects are already cut as `ABC-057`–`ABC-060`; **add findings there or in your
  notes, never into the gated page.**
- **Zero bytes under `src/`.**
- **`ADR-0008` and `plans/nfr-catalog.md` are read-only to you.** Architect/Design flagged two stale
  censuses in them (both say the budget has two accounts; there are now three) and deliberately did
  not repair them. **Not yours either** — cite `N8-SPAWN` directly.
- **Do not merge, do not deploy, do not move the board.** The Orchestrator takes one consolidated
  board move after this hop; deploy is nobody's here.

## Definition of done

`G1` carries a re-grade against the amended bar with its method, its machine and its own honest
verdict; the `NFRs` cell is one reconciled text at 10 cells; your notes are published per Workflow 16
under `ref:` (hand-authored per `agent-factory/contracts/context-note.md` — **no `kind: finding`, no
invented stamp; none is emittable on this install**); the queue claim was taken by hand per
`AGENTS.md`; and every gate this change can red was run on your branch tip and recorded.
