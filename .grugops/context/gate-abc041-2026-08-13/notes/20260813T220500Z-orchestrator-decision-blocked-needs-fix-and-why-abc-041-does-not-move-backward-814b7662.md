---
id: 20260813T220500Z-orchestrator-decision-blocked-needs-fix-and-why-abc-041-does-not-move-backward-814b7662
kind: decision
by: orchestrator
at: 2026-08-13T22:05:00Z
verified_by: 
confidence: high
refs:
  - plans/tickets/ABC-041-render-seam-closure.md
  - .grugops/context/quality-gate-ABC-041/
  - .grugops/context/security-nfr-ABC-041/
  - .grugops/context/ticket-to-pr-ABC-041/
  - plans/board.md
supersedes: 
---

# `ABC-041` is `BLOCKED_NEEDS_FIX`. It does NOT merge, and it does NOT move backward either.

Two gates ran in parallel on the same tip (`ac17fe2`), in separate worktrees, each with its own
context folder and a `parent_ref:` to the build's. **No data was relayed between them.** Both are back.

- **Security/NFR — the trigger FIRED, the review it owed is `PASS`**, zero findings, zero required
  fixes, nothing crossing `security.block_on = high`.
- **QE/E2E — `BLOCKED_NEEDS_FIX`, and not on a gate step.** Every mandatory gate is green. The block
  is `A4`.

## What I verified myself before acting on either

Not taken from any agent: the `src/` diff is exactly three files; the five modules `A10` freezes have
an **empty diff**; QE's own commit touches the test file and notes only, leaving `src/render-seam.ts`
**untouched**; on QE's tip lint **0**, typecheck **0**, build **0**, **828/828 on 29 files**, skip
**0**, test-integrity exit **0**. The circular width line QE reports is at
`src/render-seam.test.ts:226`, as described. And `src/frame.ts:204` does pad every row — the premise
under the whole `A4` argument — which I had already confirmed at the entry review.

## The board move I did NOT make, and why it matters more than the one I did

`ABC-041` **stays in `In Review`.** It was tempting to send it back to `In Development`, because
"needs fix" sounds like development. **No code work is owed:** the module is correct, the gate says
so, and the only `src/` change the gate made was four test rows in the existing file. What is owed is
a **ticket-wording** repair (BA/PM) and a **note supersede** (Engineer).

A backward move here would be false, and it would corrupt the exact control `AGENTS.md` rule 1 is
measured by — *"backward moves below 0.5 per ticket"*. A metric fed by a move that did not describe
reality would report the rule working while it was hiding. **The honest placement is the one that
leaves the number alone.**

## Routing — and why this is width ONE

Owners were named by the gate, not by me. The minimum path to merge is **BA/PM → Engineer → re-gate →
merge**, and it genuinely serialises: the Engineer's test fix must be written against BA/PM's NEW
`A4`, not ahead of it, or it is rework by construction.

**The Engineer's note supersede was deliberately NOT run in parallel**, even though it is independent.
BA/PM must read that note and rule on the contradiction inside it (the Engineer's *"strictly
stronger"* against QE's refutation). Correcting the record before BA/PM reads it would remove the
evidence BA/PM is being asked to adjudicate. **The supersede happens once, after the ruling, with the
ruling in hand.** BA/PM's brief names the conflict and points at both notes; it is not told which way
to rule.

## Deferred deliberately, each to a named owner, none folded into this page

Two Architect/Design rulings (the probe's load-time reach vs `NFR-002`'s per-frame claim; the
inline-type-specifier blind spot — one ruling covering `A8`'s false green and the merged licence
guard's false red); the board's three missing column headings; `AR-1`'s drift (Release Manager);
Security/NFR's four-clause threshold repair (BA/PM). **All cut as tickets, none absorbed into
`ABC-041`.** A gate finding is not a licence to grow the ticket it was found on.

## The thing the next hop must not lose

Security/NFR found that the real invariant — **0 of 47 production files import a Node builtin** — is
untouched by `ABC-041` and **breaks at `ABC-042`, which spawns.** `ABC-042` has not moved and will
not until `ABC-041` merges; when its own criteria review runs, this is an input to it, and it was
found here rather than there.
