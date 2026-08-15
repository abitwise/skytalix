---
task: g1-answered-2026-08-15
subtask: design-nfr008-spawn-account
role: architect-design
workflow: agent-factory/workflows/07-backlog-refinement.md
ref: .grugops/context/design-nfr008-spawn-account/
parent_ref: .grugops/context/g1-answered-2026-08-15/
ticket: plans/tickets/ABC-042-entry-point-argv-and-the-first-frame.md
enqueued_by: orchestrator
enqueued_at: 2026-08-15T08:30:00Z
branch: grugops/design-nfr008-spawn-account
base: grugops/abc042-merge-key @ 6f05887
---

# Subtask: write `NFR-008`'s SPAWN ACCOUNT — the project owner has authorized it

**Branch from `grugops/abc042-merge-key` @ `6f05887`, NOT from `main`.** That branch is `main` plus
the three unmerged `ABC-042` tips; every note this subtask points at exists there and some of them
exist **nowhere else**. This subtask file is tracked on `main` and will not exist in your tree — read
it before you branch. Its queue transition is the Orchestrator's.

## Read first — pointers, not summaries

- **`parent_ref:`** — two notes. The owner's answer verbatim, what it authorizes and what it does
  not, and the limit on your own pen.
- `.grugops/context/security-nfr-ABC-042-gate/notes/` — six notes, **including the `G1` ruling and
  the escalation**. These reached the repository for the first time in `6f05887`.
- `.grugops/context/security-nfr-ABC-042-recheck2/notes/` — the re-check against the merging tree,
  and **the recommendation you are being asked to write**. Security/NFR recommended this account and
  deliberately did not create it.
- `.grugops/context/ticket-to-pr-ABC-042/notes/` — the engineer's own lane measurement and the eight
  build notes.
- `plans/nfr-catalog.md` § `NFR-008` — **your own row**, authored at `refinement-ABC-026`, including
  the **floor account** whose owner is Architect/Design and which the new account is modelled on.

**Re-derive nothing that is written in those notes and re-measure nothing that is recorded with its
method and machine.** No figure is restated in this file on purpose.

## The authority, stated exactly

**Project owner Olger Oeselg, 2026-08-15, in session, verbatim:** *"My decision: create a spawn
account and merge"* — choosing option 2 of the three the Orchestrator carried.

`plans/nfr-catalog.md` is **owner-ratified**, and until this sentence a needed change to a bar was *a
recorded reason, never an edit*. **That is what changed, and only that.** You are not exercising your
own judgement about whether the bar should move; you are writing the account the owner ordered, in
the file you own. **If you conclude the owner's instruction cannot be written honestly, stop and say
so** — that is a stop condition, not a failure.

## What to write

A **spawn account** on `NFR-008`, **parallel in form to the existing floor account** — the catalog
already carved out one cost class on materially identical reasoning, and that symmetry is the whole
argument for this one. It is yours to word, but it will be read by roles under pressure, so:

- **Say what may be charged to it and what may not.** The floor account has a crisp rule (the
  runner's cost, not the ticket's). This one needs an equally crisp one, or it becomes the drawer
  every expensive ticket empties itself into.
- **Say who checks it, and when.** `N8-LANE`'s existing wording already names its owner at the cut
  and its checker at the gate. Say whether the account changes either.
- **Say what STOPS it.** A cost class with no ceiling converts a bounded arithmetic budget back into
  the unbounded geometric one `ABC-026` exists to have killed. **`NFR-008`'s own 13 s CPU clause and
  its total are not in scope of the owner's answer** — the owner authorized an account, not a larger
  budget. If your account would let the total be exceeded, say so in the note rather than in the
  catalog.
- **Attribute it.** The floor account records who proposed it and on what reasoning; this one is
  Security/NFR's recommendation, adopted by the owner, written by you.

**Record what the account does NOT do**, in your note if not in the catalog. In particular it does
not re-derive the 5% (the owner did not choose that option and BA/PM's cut-hop invitation stays
open), and it does not touch `N8-LANE`'s instrument, statistic, null-control clause or floor clause.

## Hard limits on this subtask

- **`plans/tickets/ABC-042-…md` is CLOSED.** BA/PM refused three edits to that page after both gates
  passed, including one where the bar is genuinely wrong. **That refusal holds through this hop.** Do
  not open it — not to add a criterion, not to fix a word.
- **Do not re-grade `G1`.** You are writing the bar's amendment; **measuring `ABC-042` against it is
  Security/NFR's next hop and its result is not assumed here.** Do not write a verdict, a predicted
  ratio, or a "this means the ticket now passes" sentence into the catalog.
- **Zero bytes under `src/`.** This is a documentation change. If you believe production code must
  move, that is a finding for a ticket, not an edit here.
- **`ADR-0008` is owner-ratified too.** Touch it only if the account is unwritable without it, and if
  so say why in your note first.
- **Do not merge and do not deploy.** The Orchestrator holds this ticket's merge under the owner's
  answer; deploy is nobody's here.

## Definition of done for this subtask

`NFR-008` carries a spawn account that a role under time pressure can apply without asking a second
question; your notes are published per Workflow 16 under `ref:` (hand-authored per
`agent-factory/contracts/context-note.md` — **no `kind: finding` and no invented stamp; none is
emittable on this install**); the queue claim was taken by hand per `AGENTS.md`; every gate that this
change can red (`lint`, `typecheck`, `build`, `npm test`) was run on your branch tip and recorded;
and `plans/traceability.md`'s `ABC-042` row is **left alone** — its `NFRs` cell currently carries two
parallel Security/NFR writes and reconciling them is Security/NFR's at the next hop, not yours.
