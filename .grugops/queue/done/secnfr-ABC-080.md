---
task: wave-2026-09-24
subtask: secnfr-ABC-080
role: security-nfr
workflow: agent-factory/workflows/15-security-audit.md (In Security/NFR gate)
ticket: plans/tickets/ABC-080-move-ordering-mvv-lva-killers-hash-move.md
ref: .grugops/context/secnfr-ABC-080/
build_ref: .grugops/context/ticket-to-pr-ABC-080/
qe_ref: .grugops/context/qe-ABC-080/
prior_gate_ref: .grugops/context/secnfr-ABC-079/   (harnesses to re-point; the owner's AR-N8LANE-079 acceptance)
enqueued_by: orchestrator
enqueued_at: 2026-09-25T16:30:00Z
branch: grugops/secnfr-ABC-080
base: grugops/wave-2026-09-24 (tip after this enqueue)
diff_under_review: 4f74acc..cb8ca55 -- src
---

# Subtask: Security/NFR gate for `ABC-080` (move ordering)

QE PASSED WITH FINDINGS (`qe_ref:`). QE reported, and did not rule, `NFR-005` and `N8-LANE`, and
left `A7` at `UNKNOWN - verify`.

## Rule
1. **`A7` + `NFR-005`:** depth completed in 3 s (`chooseMove` at the default budget) on
   kiwipete and position-6, this build vs `4f74acc`, same process, ≥ 3 rounds, plain node AND
   under vitest. Record the load average. The floor stays 6 (owner's word). Report the
   reading; the depth-6 verdict waits for `ABC-081`.
2. **`NFR-004`:** the 3 s wall and 5 s ceiling still hold with ordering and killers in the
   abortable recursion.
3. **`NFR-008` / `N8-LANE`:** re-measure the charge with your `ABC-079` harness (null control,
   paired rounds). The Engineer read +10 ms net inside the null's spread. Confirm or correct it.
4. **Security (ASVS L1, block on high):** killer-table bounds (ply index vs `MAX_PLY`), any
   allocation per node, any unbounded growth across a `chooseMove` call.

## Fences
Zero lines under `src/`. No `plans/board.md`, `AGENTS.md`, `plans/nfr-catalog.md`, ADRs. Never
merge; never push. Own `git worktree` (symlink `node_modules`); commit messages via a scratchpad
file and `git commit -F`; probes as node scripts.

## Publish
`decision` (PASS / PASS-WITH-ACCEPTED-RISK / FAIL, required fixes, accepted risks) plus
`observation` notes under `ref:`, a trace row, a ticket § Security/NFR section. Queue pending →
claimed → done per Workflow 17. Report: the result in one line, each NFR reading, `A7` MET or
not, each risk with its severity, anything the owner must decide, sha, numstat.
