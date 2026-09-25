---
task: wave-2026-09-24
subtask: secnfr-ABC-081
role: security-nfr
workflow: agent-factory/workflows/15-security-audit.md (In Security/NFR gate)
ticket: plans/tickets/ABC-081-transposition-table-and-in-tree-repetition.md
ref: .grugops/context/secnfr-ABC-081/
build_ref: .grugops/context/ticket-to-pr-ABC-081/
qe_ref: .grugops/context/qe-ABC-081/
prior_gate_ref: .grugops/context/secnfr-ABC-080/   (harnesses to re-point; the owner's AR-N8LANE-079 acceptance via secnfr-ABC-079)
adr_refs: ADR-0025 (accepted), ADR-0006, ADR-0020
enqueued_by: orchestrator
enqueued_at: 2026-09-25T18:00:00Z
branch: grugops/secnfr-ABC-081
base: grugops/ABC-081-transposition-table @ c9d65a0 (504f046 + the owner's merge of main; src byte-identical to 504f046)
diff_under_review: 6033d05..504f046 -- src
---

# Subtask: Security/NFR gate for `ABC-081` (transposition table + in-tree repetition)

QE PASSED WITH FINDINGS (`qe_ref:`). QE reported, and did not rule, `NFR-005`, `NFR-009` and
`N8-LANE`; `N8-LANE` was not independently re-run.

## Rule
1. **`NFR-005` (binds plain node, owner's word; floor 6):** depth completed in 3 s (`chooseMove`
   at the default budget) on kiwipete and position-6, this build vs `6033d05`, same process,
   ≥ 3 rounds, plain node (the binding reading) and under vitest (reported). Record the load
   average. Rule MET / NOT MET.
2. **`NFR-009` (16 MiB; owner licensed up to 128 MiB only on a measured need):** table size
   and growth across a `chooseMove` call and across repeated calls. Rule it. If you measure a
   need for more, hand it up — do not re-level.
3. **`NFR-004`:** the 3 s wall and 5 s ceiling still hold with the table in the abortable
   recursion (including clear-per-search cost).
4. **`NFR-008` / `N8-LANE`:** re-measure the charge with the `ABC-079`/`ABC-080` harness (null
   control, paired rounds). The build read +220 ms gross / +60 ms net at medium confidence.
   Confirm or correct it against the owner's accepted line (`AR-N8LANE-079`).
5. **`NFR-005` catalogue wording:** state the exact wording change the catalogue owes now that
   the owner ruled plain node binds. Propose it in your decision note; do not edit the catalogue.
6. **Security (ASVS L1, block on high):** table index bounds (hash → slot masking), full-key
   verification on hit (no collision-driven wrong move), key-array capacity guard (QE K3/K4:
   the hang class and the missing OS-level test timeout — rate its severity), allocation per
   node, unbounded growth, and any stored move replayed without legality.

## Fences
Zero lines under `src/`. No `plans/board.md`, `AGENTS.md`, `plans/nfr-catalog.md`, ADRs. Never
merge; never push. Work in your own `git worktree` under `.claude/worktrees/` (symlink
`node_modules` from the main checkout). Commit messages via a scratchpad file and
`git commit -F`; probes as node scripts.

## Publish
`decision` (PASS / PASS-WITH-ACCEPTED-RISK / FAIL, required fixes, accepted risks) plus
`observation` notes under `ref:`, a trace row, a ticket § Security/NFR section. Queue pending →
claimed → done per Workflow 17. Report: the result in one line, each NFR reading, each risk with
its severity, anything the owner must decide, sha, numstat.
