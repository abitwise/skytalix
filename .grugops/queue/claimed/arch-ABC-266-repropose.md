---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-02T17:24:16Z
subtask: arch-ABC-266-repropose
role: architect-design
ref: .grugops/context/arch-ABC-266-repropose/
branch: new grugops/arch-ABC-266-repropose from main (at dispatch) — worktree .claude/worktrees/arch-ABC-266-repropose. Prototypes on a scratch archive of grugops/ABC-265-fix (28ad3a8d) under the session scratchpad; reuse qe-ABC-266-d12 raw/probe (driver/worker/analyse).
width: every run wrapped in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <cmd>`. Timing probes: ≤ 5 min each, ≤ 20 min total, record foreign load per the D12 rule (VOID-LOAD, not a miss). Only a BA/PM records hop runs beside you.
---
# Re-propose ADR-0062 after the D12 MISS
## Read
qe-ABC-266-d12 notes (…6231db75 rule, …cc1de664 results, …9f9aeb87 verdict): median depth 7/7/7 at 100 ms (T1/T4/T12), workers finish the same depth in lockstep (19/20), per-worker rate 0.69× at T12 vs 0.98× at T4. ADR-0062, ADR-0057 (D2 estimate now unsupported), ADR-0058 (accepted, not in force), arch-ABC-266 probe (…0c8cf7d0).
## Do
- Pre-register candidates + selection rule before reading results. Candidates at least: (1) helper diversity — staggered start depths / skip-depth schedule (odd/even, Stockfish-style skip blocks), (2) ADR-0058 deeper-entry cutoffs on at Threads ≥ 2, (3) move-order perturbation in helpers, (4) Threads cap at the 4 fast cores (CPUs 0–3) vs 12 — and combinations as you judge. Metric: played depth at movetime 100 and 1000 (same 20 positions, rotation, warm-up), plus a quality proxy that is not depth alone (e.g. best-move agreement with a long Threads 1 search) since Lazy SMP gains often show as a better move at equal depth.
- Verdict: a form whose T-N median depth (or the quality proxy, pre-registered) beats T1 at 100 ms → amend ADR-0062 (PROPOSED) with it and the ABC-266 changes BA/PM needs. If none: say so plainly; recommend parking ABC-266 (threads stay at 1) or a different read (e.g. 1 s, an owner ask) — your recommendation, no bar loosened.
## Fences
memory-bank/50-decisions and your records only; no src/tests/plans/board; don't touch ADR-0025/0060/0061. No push, force, amend, rebase, merge into main. Delete scratch; leave nothing running.
## Publish
Sealed notes (task arch-ABC-266-repropose, contextRoot = worktree's .grugops/context); queue moves inside your worktree; commit; ## Result + trace row; brief + claim to done/.
