---
task: wave-2026-09-24
subtask: ticket-to-pr-ABC-079-rehop3
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md (repair hop after QE FAIL)
ticket: plans/tickets/ABC-079-quiescence-search-on-captures.md
ref: .grugops/context/ticket-to-pr-ABC-079/
ruling_ref: .grugops/context/ruling-abc079-g1g2/   (the decision note is the LICENCE)
qe_ref: .grugops/context/qe-ABC-079/
enqueued_by: orchestrator
enqueued_at: 2026-09-25T06:30:00Z
branch: grugops/ABC-079-quiescence-rehop3
base: grugops/int-ABC-079 @ b6dfee0
worktree: .claude/worktrees/ABC-079-rehop3
---

# Subtask: ONE repair hop on `ABC-079` — D1–D4 prose, G1 pins, G2 split

QE FAILED `ABC-079` on four false sentences in `src/search.ts` (D1–D4, `qe_ref:` §4).
Architect/Design ruled G1 and G2 closed inside this ticket and set the licence (`ruling_ref:`
`decision` note, and the ticket's `## Ruling (G1/G2)` section). Do exactly what that ruling
lists under "what the Engineer's hop must change", inside its file:line licence, and report
every re-run it names.

## Fences
- Only the files and line ranges in the licence. `src/search.ts` changes are COMMENT LINES
  ONLY — prove it in the report. Frozen: `src/quiescence.ts`, `src/engine.*`,
  `src/evaluate.ts`, `src/search.qe.test.ts`, every timeout value.
- A needed change outside the licence is a STOP: hand up, do not widen.
- Do not touch `AGENTS.md`, `plans/board.md`, or the NFR bars. Never merge; never push.
- Write commit messages to a uniquely named scratchpad file and use `git commit -F`; run
  probes as node scripts. Mutants R2b/R2c are applied, measured, and reverted
  (`git status --porcelain -- src` clean after each).

## Publish
`decision` + `observation` + `claim` notes under `ref:`, a trace row, a ticket
§ Delivery (re-hop 3). Move this file pending → claimed → done per Workflow 17. Report:
gates (files / passed / skipped), per-case timeout shares for both `SEARCH_DEEP` files and
each `A7` slice alone, R2b/R2c red rows, the comment-only proof, sha, numstat.
