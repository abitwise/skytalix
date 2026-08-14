---
id: 20260815T101500Z-orchestrator-decision-g1-escalation-carried-merge-held-9f02ad31
kind: decision
by: orchestrator
at: 2026-08-15T10:15:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - G1
  - N8-LANE
  - NFR-008
  - memory-bank/60-progress.md
supersedes: 
---

# Orchestrator Decision — `G1`'s escalation is CARRIED to the owner, and the merge is HELD until it is answered

## What came back
Security/NFR returned **`PASS_WITH_RISKS`, NOT BLOCKED** — zero `high` findings, so nothing blocks on
`security.block_on: high`. Four bars MET against the real artifact. Its own `V2.2.1` HIGH probed with
six out-of-tree mutants rather than re-read, four killed, **including one that refuted its own stated
prediction and is recorded against its name**. Three new low findings (`S1`–`S3`), owner Software
Engineer, none blocking.

**`G1` is NOT MET at 2.00×**, re-measured admissibly — with the identity null control (−0.19%, sign
3/7) whose absence the build hop had flagged in its own figure. And the number that matters most is
one neither the ticket nor I asked for: **the floor for ANY conforming build is ~810 ms net, 1.25× —
so no build that satisfies these criteria can meet this bar, even in principle.**

## The decision this hop actually makes: the merge is HELD

**The owner's standing merge directive (2026-08-06) authorizes merging work that PASSED a gate. It
does not cover this.** `PASS_WITH_RISKS` with an owner-escalated breach of an owner-ratified bar is
not "passed", and reading the standing directive as covering it would be me quietly making the
decision Security/NFR just refused to make quietly. The directive's own limits are explicit — it is
approval to merge work that passed, never to skip or soften a gate.

**So: `ABC-042` does not merge until Olger Oeselg answers.** Not because the security gate blocks it
— it does not — but because the Orchestrator cannot record this ticket as clean on `N8-LANE`, and
merging while a stated bar is breached at 2.00× would make the bar decorative.

## Why I am not "resolving" this myself, in the three ways I could have

1. **I could accept the breach on the owner's behalf**, citing the `ABC-025` precedent where a bar was
   NOT MET at 1.6× and the breach was accepted as an owned risk. **I am not.** Security/NFR named the
   one difference that matters: `N5` was BA/PM's own bar, so its author could accept it. `N8-LANE`
   runs back to a clause the owner ratified in person. The precedent is exact in *form* and wrong in
   *authority*.
2. **I could adopt the spawn account** Security recommends. It is a good recommendation — the catalog
   already carved out a floor account on identical reasoning, and a criteria-forced child really is
   the operating system's price of proving a command runs. **It is still a new cost class in an
   owner-ratified document, and a coordinator inventing one at a gate is the same loophole with a
   better justification.**
3. **I could re-derive the 5%.** The catalog invites re-derivation — but addresses that invitation to
   the cut, not the gate, and pairs it with *"a gate does not move this bar"*. It is BA/PM's at a cut
   hop, under the owner's ratification. Named, not done.

## What the owner is being asked — carried verbatim in substance, three options
Recorded here so the question is not reshaped by being relayed:
1. **Accept the breach as an owned risk and merge** (the `ABC-025` shape — no coverage cut, catalog
   untouched).
2. **Create a spawn account** parallel to the existing floor account — Security/NFR's recommendation,
   which would leave this ticket's real content at **0.35×** the bar. It did not create it.
3. **Re-derive the 5%** at a BA/PM cut hop under the owner's ratification.

**Option (a) — cutting criteria to fit — was refused by Security/NFR and I concur.** Three of the five
spawn-forcing criteria *are* the security instrument, including the end-to-end half of the `V2.2.1`
repair that discharged its own HIGH block. Deleting them would be cutting the instrument to make the
measurement pass. **This is the distinction the routing note drew and it survived contact: `A10` and
bar 1 were deleted because their WORDING was defective; these criteria are not defective, they are
expensive.**

## Sequencing, and a mess of my own making that I should name
Security/NFR reports the `In Security/NFR → Ready for UAT` board move as **owed and untaken** because
its subtask forbade it the file. **That move is not owed yet** — the ticket is in `In Review`, QE/E2E
owns that exit, and QE is still running. Security reviewed concurrently by my scheduling choice, so
its verdict is recorded ahead of the column it nominally exits.

**That is the second time this ticket a role has reported a board move as owed because I forbade it
the file.** The first (`G3`/`G4`) I already recorded as my defect. This one is different in kind —
the move genuinely is not due yet — but the pattern is the same and it is mine: **concurrent
scheduling plus a blanket board-write ban produces roles that finish holding an exit they cannot
take.** Worth fixing in how I write subtasks, not in how the roles behaved.

**No board move is made by this hop.** One consolidated move follows QE's return.

## A merge hazard, recorded before it bites
Security/NFR's branch edited `plans/traceability.md` (its own NFRs cell, permitted, row re-split and
verified at 10 columns) off `8b07d9f`. `main` has since moved to `8dbc3db`, which **also** edited that
file. **These two will conflict on `plans/traceability.md` when the branch is integrated.** Recorded
now so the conflict is expected and resolved deliberately — both edits are wanted, they touch
different cells of the same row, and neither may be dropped to make the merge easy.

## Stop conditions honored
- **I did not merge**, and I stated why the standing directive does not reach this case.
- **I did not accept, waive, re-grade or re-derive `G1`** — all three are the owner's or BA/PM's.
- **I did not move the board** on a concurrent role's report of an exit that is not yet due.
- **I did not touch `plans/nfr-catalog.md` or `ADR-0008`.**
- **No gate is claimed by this hop.** Zero bytes under `src/`.

## Next action
**The owner's answer on `G1` is the blocking input.** Independently, QE/E2E is still running; on its
return, one consolidated board and traceability update, then BA/PM's batched wording hop (`G2`, `G5`,
`G7`, `G8`, plus `S1`–`S3` to the Software Engineer). The merge decision waits on the owner
regardless of what QE returns.
