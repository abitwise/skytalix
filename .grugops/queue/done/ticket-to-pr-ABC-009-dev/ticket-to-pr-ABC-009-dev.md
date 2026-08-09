---
task: ticket-to-pr-ABC-009
subtask: engineer-abc009-implement
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ref: .grugops/context/ticket-to-pr-ABC-009/
enqueued_by: orchestrator
enqueued_at: 2026-08-09T14:15:00Z
branch: grugops/ticket-to-pr-ABC-009
---

# Subtask: implement `ABC-009` and take the `In Development → In Review` exit

Read the shared verified context at `ref:` first (Workflow 16 step 1). **Nothing is inlined here.**
Seven notes are there; the two Orchestrator `decision` notes carry the substrate ruling and the two
gate passes, and the three BA/PM notes carry the mutant campaign that produced every number you are
building against.

The Definition-of-Ready gate **failed** at the first pull and **passed** at the second, on a corrected
ticket. `plans/tickets/ABC-009-legalmoves-position-mutation.md` is 690 lines now, up from 222 — read
the correction block under `## Acceptance` **before you design anything**. Six criteria became ten;
the original six kept their order, so `A1`/`A2`/`A3`/`A7`/`A8`/`A9` are the 2026-07-29 originals and
`A4`/`A5`/`A6`/`A10` are new. Each ruling names the alternative it rejected — those rejections are
load-bearing, not commentary.

`In Development` is 1/3. The branch `grugops/ticket-to-pr-ABC-009` already exists and carries BA/PM's
correction at `ee026af`; work on it, do not branch again.

Three things you inherit as **open**. None blocks you; all three are yours to report on.

1. **Seven defects is not proven complete.** This board's history: pre-check named three → BA/PM found
   five → QE found **six** mutants past all twelve corrected criteria (`ABC-018`, 2026-08-09). Treat
   `A1`–`A10` as the current best net, not a proof. If it is insufficient, say so.
2. **Every post-fix count in `A1`–`A6` came from candidate fixes, not from your diff.** BA/PM derived
   them on seven builds; the Orchestrator re-derived all fifteen on an independently written fix and
   they agreed. That is strong, and it is still not the real change. **A discrepancy is to be RAISED,
   never silently adjusted to match your code** — and the ticket, not your implementation, is what
   gets corrected if the ticket turns out wrong.
3. **The fix site is not ruled on.** `addCastlingMoves` and `legalMoves` are observationally
   equivalent today because `generateMoves` has no non-test caller but `legalMoves`. `## Scope` is the
   requirement; the mechanism is yours. `CastleOption` carries no rook square today — whether it gains
   one is your call, and it is the kind of structural choice this board expects recorded with its
   rejected alternative.

`NFR-001` is triggered and its bar is machine-independent: perft **≥ 1M nps** and **ratio ≥ 0.98**
against the same measurement on the pre-fix tree in the **same process**. **No role on this ticket has
measured any throughput figure** — neither the Orchestrator nor BA/PM ran `npm run perft`, and the
6.04M–6.21M baseline is quoted from `plans/nfr-catalog.md`, which is the authority. Read that
catalog's standing benchmarking caution (null-control twin, own process, check a structurally-zero
cell first) **and** its denominator fence — 97.3% of the nodes perft counts are free leaves, so this
figure is never evidence for `NFR-005`. `NFR-005` is excluded structurally; do not re-run the key
benchmark to confirm it.

Run the deep lane (`PERFT_DEEP=1 npx vitest run src/perft.test.ts`, ~38 s) **before** review, not
after — you are editing the generator and 32/32 is the only exhaustive oracle that the change is
invisible to legal play. Nobody has run it on either tree for this ticket.

Suite baseline measured by the Orchestrator at the pull: **304 passed (304) on 14 files**. `A8`
requires skip count 0 and **no existing test modified, verified at line level, not by inspection**.

Publish typed notes per Workflow 16. **`finding` is not admissible on this task** — see the substrate
ruling in `20260809T103247Z-orchestrator-decision-f050eb4b`. Nothing self-stamped. Do not hand-fake
`index.md` / `index.jsonl`.

Take the `In Development → In Review` exit when green — that is the one board move you own. Do not
enqueue QE or Security/NFR; the Orchestrator does that. Never deploy.
