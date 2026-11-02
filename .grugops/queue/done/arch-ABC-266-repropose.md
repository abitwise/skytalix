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

## Result (architect-design, arch-ABC-266-repropose, closed 2026-11-02T17:43:13Z)
- **Verdict: NO winning form.** `ADR-0062` is not amended with a new form. It stays PROPOSED, with dated lines in § Status and under D12. `ADR-0057` gets a dated line: D2.5's 100 ms Elo estimate is unsupported. `ADR-0058`, `0025`, `0060` and `0061` are untouched.
- **Recommendation: park `ABC-266`.** `Threads` stays at 1, and the build does not start. No 1 s read on this evidence.
- **Pre-registration** (`…decision-3c920b97`, commit `7f110a31`), sealed before any corpus run:
  - Candidates:
    - S, skip blocks (Stockfish pre-2018);
    - D, `ADR-0058` deeper entry at T ≥ 2;
    - P, root permutation in helpers;
    - the cap, T4 pinned to CPUs 0–3;
    - combinations: T12S, T12D, T12P, T12SD, T12SDP, T4SD, T4, T4SD, T4SDP.
  - Proxy Q: agreement with a 5 s T1 move.
  - Rule:
    - DEPTH-PASS = median depth above T1's and ΔQ > −2;
    - QUALITY-PASS = ΔQ ≥ 2;
    - the winner must be confirmed in an unloaded fresh run.
- **Results at 100 ms:**
  - Plain T4 and T12 replicate D12 (D 7 = 7, lockstep).
  - Only S+D+P adds a ply (D 8). Every read lost 1.7–2 Q of 20.
  - T4SDP: PASS (SHARED) in R2, and PASS (SHARED) in the confirmation, but the confirmation was LOADED by block test (c), so it is not a WIN.
  - Every other candidate: MISS, including in the unloaded R2b.
  - D alone inflates the reported depth at T1 (+0.5 ply at 100 ms, +1.7 ply at 1 s, Q −1).
  - 1 s (info): only T12SDP reads Q above T1, 18 against 17, one position.
- **Load and host:**
  - Phase foreign cores 0.43–0.64 in every run. Criterion (c) tracks block length (jiffy quantization), recorded as an instrument note, not a re-grade.
  - About 9 min of host time in all, each run ≤ 5 min (longest 190 s), all under `flock`.
  - Tctl peaked at 96.5 °C in R4 (info run).
- **Notes** (sealed via `admitAndAppend`, contextRoot = this worktree's `.grugops/context`, 4 of 4 read back):
  - decision `…3c920b97` (prereg);
  - observation `20261102T174241Z-architect-design-observation-8ece4173` (results);
  - decision `20261102T174241Z-architect-design-decision-b6305641` (verdict);
  - observation `…ac6714ff` (artifacts).
- **Commits:** claim `6e749801`, prereg `7f110a31`, notes, raw and ADR lines `97cd0144`, then this close. Not pushed, not merged. No process was killed. Scratch deleted, nothing left running.
- **Open:**
  - Owner: park `ABC-266`? Or ask for one more probe (S+D+P at T12, with a repaired load test, ≥ 60 positions, an unceilinged proxy, ≈ 30 min)? Any D form switches `ADR-0058` on at T ≥ 2 ahead of `ABC-257`, which is his call.
  - BA/PM: mark `ABC-266` (with `ABC-267` folded in) parked or blocked, not Ready for Dev.
  - Board: no move by this hop.

### Trace row (10 cells, header order)

| arch-ABC-266-repropose | Re-proposal after the ADR-0062 D12 MISS. Pre-registered candidates: skip blocks, ADR-0058 deeper entry at T≥2, helper root perturbation, T4 on CPUs 0–3, and combos. Quality proxy: agreement with a 5 s T1 move. Result at 100 ms: plain pools in lockstep (D 7 = T1); only S+D+P gains a ply (D 8) and every read loses 1.7–2 Q of 20; confirmation LOADED, so NO WIN | EPIC-011 | ADR-0062 (PROPOSED; dated: no winning form, park ABC-266 recommended); ADR-0057 (dated: D2.5 100 ms estimate unsupported) | — | `grugops/arch-ABC-266-repropose` (claim `6e749801`, prereg `7f110a31`, notes `97cd0144`) | scratch probe only (deleted; raw kept) | — (probe, not a gate) | — | NO WIN; ABC-266 recommended parked (Threads 1); owner asked |
