---
task: ticket-to-pr-ABC-009
subtask: bapm-abc009-criteria-text
role: ba-pm
workflow: agent-factory/workflows/07-backlog-refinement.md
ref: .grugops/context/ticket-to-pr-ABC-009/
enqueued_by: orchestrator
enqueued_at: 2026-08-09T13:28:47Z
branch: grugops/ticket-to-pr-ABC-009
---

# Subtask: close the criteria-text gaps two roles routed to you

Read the shared verified context at `ref:` first (Workflow 16 step 1). **Nothing is inlined here.**
Twenty-eight notes are there. Ordering warning: `20260809T141500Z-orchestrator-decision-865b06ae`
carries **local time labelled `Z`** and is **superseded** by
`20260809T114649Z-orchestrator-decision-700d4a44` — read its §1. Take your own `at` from `date -u`,
never from a test runner's `Start at` line; this machine is UTC+3.

You corrected this ticket's acceptance once already (`bapm-abc009-acceptance`, seven defects). This is
the second hop, on gaps found **downstream of that correction by roles doing their own work** — which is
the system working, not a rework loop. `## Acceptance` is **byte-identical** since the engineer's
commit: both QE and Security/NFR deliberately left it alone and routed the text to you rather than
self-editing. **You are the only role that edits it.**

The ticket is in **`Ready for UAT`** (1/4) and the code is done, gated and hardened — suite 356/356 on
16 files, skip 0, deep lane 32/32 on three independent runs, `NFR-001` met with a count-based argument.
**You are not being asked to change any behaviour.** You are being asked to make the acceptance text
describe what the suite already verifies, because closing this ticket with criteria that do not is the
one ending it may not have: its whole subject is a documented invariant that was not an invariant.

## What is routed to you

- **`G-1` — the impostor's piece type.** `A5`/`A6` use a bishop and a knight, satisfying "at least two
  piece types" **literally** while the rule quantifies over every other byte. Reading either home
  square as *"the mover's KING/ROOK **or QUEEN**"* is green on the whole net. Verified independently by
  the Orchestrator on a mutant tree: `4k3/8/8/8/8/8/8/K3Q2R w K - 0 1` **loses its queen** to one
  `legalMoves` call, with a king written over it, while the delivered code stays byte-identical.
- **`G-2` — how many rights a side holds.** Every criterion FEN carries ≤1 right per side except the
  reproduction FEN where both castles are invalid, so nothing separates "this option was rejected" from
  "the option loop was abandoned". `continue → break` on the **rook** guard **deletes a legal castle**
  (16 moves/1 castle → 15/0); the same mutation on the **king** guard is genuinely equivalent because
  both options share `kingFrom`. One token, two opposite verdicts, one green net.
- **`A7` killed nothing across all 62 mutants.** It is the criterion the original ticket called *"the
  guard that would have caught the defect originally"*, and it is measured inert against every mutation
  of this fix; the four legal-castle control rows carry the load. **This is the item the Orchestrator
  wants carried loudest** — it is the second time this project has shipped a criterion whose protective
  value was assumed rather than measured (the 100%-coverage number on `src/legal.ts` was the first).
  Rule on it explicitly. Deleting it is one legitimate answer, keeping it with its real justification
  restated is another; leaving it unexamined is not.
- **The right-test lane**, and **guard ordering** — reshaped by Security/NFR from a hazard into a
  proven property (the five guards are a conjunction of side-effect-free predicates over an unmutated
  position, hence permutation-invariant; 99 comparisons over 33 FENs, zero divergence). Decide whether
  that deserves criteria text or belongs only in the notes.

QE closed `G-1` and `G-2` **in tests** — `src/moves.castling.hardening.test.ts`, 19 tests. So for
those two the question is narrow: what does the criteria text owe, given the coverage already exists?
Do not ask for tests that are already written.

## Boundaries

- **Do not touch `src/`.** Not one file. The code is correct and three roles have verified it.
- **Do not edit `ABC-022`, `ABC-010`, `ABC-011` or `plans/nfr-catalog.md`.** Flag what belongs to them.
- **`ABC-022` half (b) is live by design.** Not a miss.
- **Do not fix the `plans/traceability.md` rendering defect** in rows `ABC-011` / `ABC-015` (11 cells
  against the header's 10, from an unescaped `|` in a quoted shell pipeline). It is flagged and
  deliberately out of scope. **If you judge it worth a ticket, cutting one is squarely yours** — the
  durable fix is likely a note in `AGENTS.md`'s test-integrity entry rather than two row edits, since it
  recurs every time a role quotes that command into a table cell.
- **No board move is yours here** — the ticket stays in `Ready for UAT`. Do not take any column exit.
- Re-check size `S` and priority `P1` rather than assuming; say so either way.

Publish typed notes per Workflow 16. **`finding` is not admissible on this task** — no §14 gate to
issue a `§14-gate#<id>` stamp and `context.human_admission` is `off`. Nothing self-stamped, no
`index.*` hand-faked. The claim is by hand; `scripts/claim.js` does not exist in this install or the kit
(re-check rather than taking my word).

Update your own row in `plans/traceability.md`. Commit per `agent-factory/_commit-convention.md` on the
existing branch. Never merge, never deploy.
