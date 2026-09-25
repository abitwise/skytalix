---
task: wave-2026-09-25
subtask: secnfr-ABC-122
role: security-nfr
workflow: agent-factory/workflows/15-security-audit.md (In Security/NFR gate)
ticket: plans/tickets/ABC-122-gate-hardening-bounded-timeout-and-capacity-guard-test.md
ref: .grugops/context/secnfr-ABC-122/
build_ref: .grugops/context/ticket-to-pr-ABC-122/
qe_ref: .grugops/context/qe-ABC-122/
prior_gate_ref: .grugops/context/secnfr-ABC-081/   (N8-LANE harness; K4 rating)
enqueued_by: orchestrator
enqueued_at: 2026-09-25T23:10:00Z
branch: grugops/secnfr-ABC-122
base: grugops/ABC-122-gate-hardening (tip after this enqueue)
diff_under_review: 0bc31e1...ca9f42d -- tools package.json src
---

# Subtask: Security/NFR gate for `ABC-122`

QE PASS WITH FINDINGS (`qe_ref:`), 12/12 reproduced, six hostile wrapper cases passed. QE deferred
to you, unruled:
1. **`N8-LANE`:** re-measure with your `ABC-081` harness (null control, paired rounds). Build read
   ≈ +155 ms net (sign 5/8, medium confidence). Note the lane now runs through the wrapper — say
   whether the wrapper's own spawn cost belongs in the charge.
2. **Process-kill surface (ASVS L1, block on high):** the wrapper spawns a detached process group
   and SIGKILLs it — any path where it kills processes that are not its own (pid reuse, group
   mis-targeting); argument handling (no shell interpolation); signal forwarding; exit-code
   mapping (124 / 130 / pass-through). Behaviour when `N` is malformed.
3. **Close `ABC-081`'s K3 and K4 LOW risks** if this delivery discharges them; say so explicitly.
4. **Rate QE's gap 1** (`run-bounded.js` header comment still says "NOT YET WIRED IN") — required
   fix or accepted note.

## Fences
Zero lines under `src/`, `tools/`, `package.json`. No `plans/board.md`, `AGENTS.md`,
`plans/nfr-catalog.md`, ADRs. Never merge; never push. Own `git worktree` under
`.claude/worktrees/` (symlink `node_modules`); commit messages via a scratchpad file and
`git commit -F`. Every kill/hang probe under your own outer hard bound; no orphans at the end.

## Publish
`decision` (PASS / PASS-WITH-ACCEPTED-RISK / FAIL, required fixes, accepted risks) + `observation`
notes under `ref:`, a trace row, a ticket § Security/NFR section. Queue pending → claimed → done per
Workflow 17. Report: result in one line, N8-LANE reading, each risk with severity, required fixes,
anything the owner must decide, sha, numstat.
