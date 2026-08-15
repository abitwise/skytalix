---
id: 20260815T081900Z-orchestrator-decision-owner-answered-g1-spawn-account-and-merge-4c7e13a2
kind: decision
by: orchestrator
at: 2026-08-15T08:19:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - G1
  - N8-LANE
  - NFR-008
  - plans/nfr-catalog.md
  - .grugops/context/ticket-to-pr-ABC-042/notes/20260815T101500Z-orchestrator-decision-g1-escalation-carried-merge-held-9f02ad31.md
  - memory-bank/60-progress.md
supersedes: 
---

# Orchestrator Decision — the owner ANSWERED `G1`: create a spawn account, and merge

## The answer, verbatim

**Project owner Olger Oeselg, 2026-08-15, in session:**

> *"My decision: create a spawn account and merge"*

This answers the escalation carried at
`.grugops/context/ticket-to-pr-ABC-042/notes/20260815T101500Z-orchestrator-decision-g1-escalation-carried-merge-held-9f02ad31.md`,
which put **three** options to the owner and took none of them. **Option 2 is chosen** — the spawn
account parallel to `NFR-008`'s existing floor account, which is Security/NFR's recommendation and
which Security/NFR explicitly **did not create**, because a gate does not move an owner-ratified bar.

**The escalation stood unanswered for exactly one hop and the answer is the owner's own.** It was not
inferred, not defaulted to, and not read out of the `ABC-025` precedent that the previous hop
correctly refused to apply.

## What this answer authorizes — two distinct things, recorded separately

Two things were granted in one sentence, exactly as with the 2026-08-06 merge directive, and they are
separated here so a later reader can check the reading rather than inherit it.

1. **A new cost class in an owner-ratified document.** `plans/nfr-catalog.md`'s `NFR-008` gains a
   **spawn account** beside its floor account. **Only the owner could grant this.** The previous hop
   named the exact objection and it is now discharged by the only authority that could discharge it:
   *"a coordinator inventing one at a gate is the same loophole with a better justification."* The
   owner is not a coordinator, and this is not a gate.
2. **The merge of `ABC-042`, which the standing directive did not reach.** The 2026-08-06 directive
   authorizes merging work that **PASSED**; `PASS_WITH_RISKS` against an unanswered breach of an
   owner-ratified bar is not that, which is why the previous hop held. **The owner has now spoken on
   this specific merge**, so the hold is discharged by its own stated condition — not by re-reading
   the standing directive wider than it was written.

## What it does NOT authorize — stated because a grant not bounded in writing gets read wider

- **NOT deploy.** `production_requires_human_confirmation` stays `true`. The owner wrote *merge*.
  Nothing here is rounded up. There is also nothing to deploy and nowhere to deploy it (`ADR-0007`).
- **NOT a softened gate.** `quality.gate_enforcement` is `blocking`. The gates run on the branch tip
  before the merge and again on `main` after it, and both are recorded. A red gate is still a stop.
- **NOT option 3.** The 5% is **not** re-derived. `N8-LANE`'s figure, instrument, statistic, null
  control and floor clause are untouched. BA/PM's cut-hop re-derivation invitation stays open and
  unexercised.
- **NOT option (a).** No criterion of `ABC-042` is cut to fit the bar. Security/NFR refused this and
  the previous hop concurred: three of the five spawn-forcing criteria **are** the security
  instrument. **The ticket page stays closed** — BA/PM refused three edits to it after the gates
  passed and that refusal holds through this hop too. Both gates were run against that page; editing
  it now would mean they were run against a page that no longer exists.
- **NOT a licence to write the account myself.** See routing below.

## Routing — who writes the account, and why not me

**Architect/Design writes it.** `NFR-008` is Architect/Design's row (authored 2026-08-10, task
`refinement-ABC-026`), and **the floor account the spawn account is modelled on is already theirs,
owner Architect/Design, on identical reasoning**. Security/NFR recommended the account and declined
to create it; that decline was correct and is not overturned — what changed is the authority, not the
role that holds the pen.

**The Orchestrator does not author it.** The owner authorized the account's *existence*; its wording
— scope, what may be charged to it, what may not, who checks it, and what stops it becoming an
unbounded sink — is a design act with a named owner. Carrying an owner's yes into another role's file
in my own words is the relay this substrate exists to prevent.

## Sequence, and why this order

1. **Integration first (this hop, done).** Three unmerged tips carried `ABC-042`; the `G1` ruling's
   own six notes lived on exactly one of them. All three are now merged into
   `grugops/abc042-merge-key` with every gate green. **The spawn account must be written against the
   tree it is being spent on, and the re-grade must measure that same tree.**
2. **Architect/Design** — write the spawn account into `NFR-008`.
3. **Security/NFR** — re-grade `G1` against the amended bar on that tree. **The re-grade is not a
   formality**: it is the check that the account, as written, actually admits this ticket, and it may
   come back NOT MET. If it does, the merge holds again and the owner hears why.
4. **Orchestrator** — gates on the tip, merge to `main`, gates on `main`, board `Ready for UAT` →
   `Done`, traceability.

**Step 3 is not skippable and its result is not assumed.** Security/NFR's own figure — that the
account would leave this ticket's real content at 0.35× — is a *prediction it made about wording that
did not exist yet*. It is not carried into the subtask as a target.

## What stays the owner's after this

- **Deploy.** Unchanged, unasked, unmoved.
- **`B2`** — the ticket-size overflow, 28 lines over rule 2's budget, cause is criterion count not
  prose. Separate and smaller, still open.
- **The Coach's on-demand trigger** — the four-instance defect class is recorded and was deliberately
  not made a process rule. `mode` is lean.
- **UAT.** `memory-bank/60-progress.md` records that with the merge keystroke delegated there is **no
  human checkpoint between an agent's work and `main`**, and names the revisit trigger: *the first
  moment `EPIC-006` produces something a human can actually exercise*. **`ABC-042` is that moment** —
  after this merge, `npm run chess` puts a board on screen. The owner exercised judgement on this
  merge personally, which is why it proceeds; whether `ABC-042` also gets a UAT hop before `Done`
  closes is named at the end of this hop and not decided here.
