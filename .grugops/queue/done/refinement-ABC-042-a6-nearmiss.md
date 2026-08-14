---
task: abc042-refine-2026-08-15
subtask: refinement-ABC-042-a6-nearmiss
role: ba-pm
workflow: agent-factory/workflows/07-backlog-refinement.md
ref: .grugops/context/refinement-ABC-042-a6-nearmiss/
parent_ref: .grugops/context/ticket-to-pr-ABC-042-q1q2fix/
ticket: plans/tickets/ABC-042-entry-point-argv-and-the-first-frame.md
enqueued_by: orchestrator
enqueued_at: 2026-08-15T14:10:00Z
branch: grugops/refinement-ABC-042-a6-nearmiss
base: grugops/ticket-to-pr-ABC-042-q1q2fix @ 73d3b36
---

# Subtask: rule `E1` — `A6`(i)'s near-miss set has a fourth class — and clear five queued wording items

**Branch from `grugops/ticket-to-pr-ABC-042-q1q2fix` @ `73d3b36`, NOT from `main`.** That tip carries
the build, QE's nine notes, and the fix hop's eight — all the evidence you need to rule. **`main` is
NOT an ancestor and must not be merged in.** This subtask file is tracked on `main` and so will not
exist in your tree; read it before you branch, and its queue transition is the Orchestrator's.

**Read `parent_ref:` FIRST — eight notes**, especially the 14-mutant census, then
`.grugops/context/quality-gate-ABC-042/notes/` (QE's 20-mutant census) and
`.grugops/context/ticket-to-pr-ABC-042/notes/` (including the Orchestrator's `E1` verification).
Nothing from them is restated here.

## `E1` — the blocking item, and it is yours alone

**HIGH, and it blocks.** `A6`(i) enumerates exactly three near-miss derivations — *"each spelling's
upper-case form, `+"x"` extension and one-character truncation"* — which is why the instrument derives
6×3 = 18. **The fix hop found a fourth class the enumeration does not reach:** `token.endsWith(...)`
and `token.trim()` weakenings ship the whole suite green against the armed row.

**Verified by the Orchestrator before this was routed, and you should not have to re-establish it:
the DELIVERED build rejects `x--colour black` correctly — exit 1, zero stdout, the offending token
named. This is a gap in coverage, not a defect in the product.** The note
`…-e1-is-an-instrument-gap-not-a-live-hole-5a7d3c92` has the measurements.

**Why this is yours and not the engineer's:** adding a fourth derivation changes **which builds `A6`
reds**, which is a criterion decision. The fix hop stopped rather than make it — correctly, and in
line with what this ticket has already established twice: *an implementer reading a criterion down to
its rationale is making a reading that is not the implementer's to make.*

**What is wanted is one clause, not a rewrite.** The engineer has said it can write the row
immediately once you rule. Consider — and price — at least: whether the near-miss set should be an
enumeration at all, or a stated **property** (a token that is not exactly an accepted form is
rejected) which no finite list can under-cover; and what each choice costs in instrument complexity
and in `N8-LANE`, **which is already breached at 2.00× and escalated to the project owner, so a
ruling that adds a spawn makes a live escalation worse.**

## The five queued wording items — batched here deliberately

They waited for this hop so you would do **one** pass over the full set rather than three:

| id | item | from |
|---|---|---|
| `G2` | spawn count is 10 against the ticket's *"single digits"* — and the ten are criteria-forced | build hop |
| `G5` | `npm` writes a two-line banner on the child's stdout before the frame; `A1` was satisfied as a byte-exact tail plus "zero frame rows before it" — decide whether `A1`'s wording should say so | build hop |
| `G7` | `A12` says the citation is a **line**; the supplied citation is a five-line paragraph, so the numstat is +7/−1 | build hop |
| `G8` | `A11` says *"recorded in this ticket"* while `A12` forbids touching the page — the reading lives in the notes instead | build hop |
| `Q4` | `A6`(ii)'s *"250 per shape, asserted first"* control is **TAUTOLOGICAL** — rejection sampling can only exit at 250, so an over-dropping filter **hangs** (180 s) rather than redding | QE |

`Q4` is the one with teeth: a control that cannot fail is not a control, and it is the same species
of defect as `E1`.

## Hard limits on this hop

- **ZERO code.** You write criteria; you do not write instruments. `src/` is not yours on this hop.
- **Do not write `plans/board.md` or `plans/traceability.md`** — the Orchestrator's. *(Third time I
  have said this on this ticket; the resulting board move is mine to take, not a gap you must report.)*
- **Do not touch `plans/nfr-catalog.md` or `ADR-0008`** — owner-ratified. `G1` is escalated to the
  project owner and is **not yours to resolve**; if your ruling bears on it, say so and stop there.
- **`ADR-0011` clause 3's wording and the licence comparator (`Q3`, `G6`, `E2`) are
  Architect/Design's, queued separately.** Do not rule on them.
- **Re-score the Definition of Ready only if your changes move it**, and say so either way rather
  than leaving the 10/10 to be assumed.
- **Ticket prose budget (`AGENTS.md` § Process rules rule 2): the page is 328 lines against a ≤ 300
  target.** Measurements, rejected alternatives and narration go to your notes, not the page. **If
  your repair grows the page, say what you took out.**

## Stop conditions

- A criterion is unsatisfiable as literally worded → **delete it, do not re-word it.** That is this
  ticket's established precedent (`A10` and bar 1) and `ABC-041`'s before it. Re-home any surviving
  property to a new criterion and say which.
- Ruling `E1` requires changing what the product does → **stop.** The product is correct; only the
  instrument's reach is in question.
- Your ruling would add a child spawn → **stop and say so.**

## Recording

Typed notes into `ref:` per Workflow 16, **hand-authored**. **No `kind: finding`** — no
`§14-gate#<id>` stamp is emittable on this install; do not invent one. Claim per Workflow 17 by hand:
`mkdir -p .grugops/queue/claimed`, then a **bare** `mkdir` of the task directory. Commit on your
branch.

Report: your `E1` ruling and the exact clause the engineer should implement; each of `G2`, `G5`,
`G7`, `G8`, `Q4` resolved or explicitly deferred with a reason; whether the DoR score moved; the
page's line count before and after; and every new gap with severity and owner.
