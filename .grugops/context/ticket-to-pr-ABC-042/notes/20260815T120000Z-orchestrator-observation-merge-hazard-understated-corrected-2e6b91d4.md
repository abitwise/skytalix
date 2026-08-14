---
id: 20260815T120000Z-orchestrator-observation-merge-hazard-understated-corrected-2e6b91d4
kind: observation
by: orchestrator
at: 2026-08-15T12:00:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - plans/traceability.md
supersedes: 20260815T101500Z-orchestrator-decision-g1-escalation-carried-merge-held-9f02ad31
---

# CORRECTION — I understated the merge hazard. It is not a conflict; integrating those branches AT ALL would merge the held ticket.

## What I wrote, and why it was not wrong enough

In `…-g1-escalation-carried-merge-held-9f02ad31` I recorded:

> *"Security/NFR's branch edited `plans/traceability.md` … These two will conflict on
> `plans/traceability.md` when the branch is integrated."*

**The conflict is real. The framing was wrong, and wrong in the dangerous direction** — it described
integrating that branch as a routine act needing careful conflict resolution. It is not routine.

## What I measured afterwards

```
git merge-base --is-ancestor 8b07d9f grugops/quality-gate-ABC-042        -> true
git merge-base --is-ancestor 8b07d9f grugops/security-nfr-ABC-042-gate   -> true
git log --oneline main..grugops/quality-gate-ABC-042 | wc -l             -> 5
```

**Both review branches were cut from the Software Engineer's tip, so both carry the ticket's
production commits as ancestors.** Merging either one into `main` — for its notes, for one
traceability cell, for any reason — **merges `ABC-042` itself**: `src/cli.ts`, `src/cli-options.ts`,
the `package.json` script and the licence edit, all of it. That is the ticket I have held pending the
owner's `G1` answer and which QE has since blocked on two HIGH instrument defects.

**I would have merged a held, blocked ticket while believing I was landing a documentation fix.**

## The rule this establishes, written down so it is not re-derived

**Review-hop branches cut from a ticket branch cannot be integrated into `main` independently of the
ticket.** Their notes and their trace edits ride with the ticket and land when it lands. Only the
Orchestrator's own board/trace commits — cut from `main`, touching no ticket branch — go to `main`
while a ticket is in flight. This is what `ABC-041` did; I now understand why rather than by pattern.

**Consequence, stated plainly:** Security/NFR's NFRs-cell repair and QE's nine notes are **not on
`main` and will not be until `ABC-042` merges.** They are not lost — they are in the shared context on
their branches, and every hop I schedule is pointed at them by branch. But `main`'s
`plans/traceability.md` still carries the stale NFRs cell, and anyone reading `main` alone will not
see the gate results. **That is a real cost of holding the ticket, and it is the correct cost to pay.**

## What survives from the superseded note
Everything else: the merge is held pending the owner's `G1` answer; the three options are the owner's;
the reasons I declined to accept, re-grade or re-derive `G1` myself. **Only the merge-hazard paragraph
is corrected.** The original note is neither edited nor deleted.
