---
id: 20261102T173019Z-architect-design-decision-3c920b97
kind: decision
by: architect-design
at: 2026-11-02T17:30:19Z
verified_by: 
confidence: high: pre-registration, sealed before any corpus run
refs:
  - ABC-266
  - arch-ABC-266-repropose
  - grugops/arch-ABC-266-repropose
  - 6413f91f
  - 6e749801
  - ADR-0062
  - ADR-0058
  - ADR-0057
  - grugops/ABC-265-fix
  - 28ad3a8d
  - qe-ABC-266-d12/20261102T172016Z-qe-e2e-decision-6231db75
  - qe-ABC-266-d12/20261102T172256Z-qe-e2e-observation-cc1de664
  - qe-ABC-266-d12/20261102T172256Z-qe-e2e-decision-9f9aeb87
  - arch-ABC-266/20261102T161450Z-architect-design-observation-0c8cf7d0
  - EPIC-011
supersedes: 
seal: sha256:7c5cb24a2f0635f1512ac2d2074190d8a486ced3f7860b5d1fe45f37c8504b7b
---

# arch-ABC-266-repropose PRE-REGISTRATION (sealed before any corpus result is read): the candidates, the quality proxy, the selection rule, the load voids, the instrument

Architect/Design, task `arch-ABC-266-repropose`. Worktree `grugops/arch-ABC-266-repropose` from `main` `6413f91f`; claim `6e749801`. Input: D12 MISS (`qe-ABC-266-d12` `…6231db75` rule, `…cc1de664` results, `…9f9aeb87` verdict). Sealed BEFORE any corpus run. Runs so far: a T1 node-identity check (fixed depth 7, three boards, scratch tree with every knob off against pristine `28ad3a8d`: equal in move, score, depth and nodes, 3 of 3) and a smoke on the non-corpus warm-up board (17:28:35–17:28:49Z), read for structure only.

## Scope
A re-proposal probe for `ADR-0062` after D12's MISS. Scratch only; no worktree `src/` moves. Not a gate, not A7.

## Instrument
- **Tree:** `git archive 28ad3a8d` (`grugops/ABC-265-fix`) `src package.json tsconfig.json` in the session scratchpad, with D12's `adoptTable` edit (`qe-ABC-266-d12` `raw/probe/scratch-edit.diff`) and three scratch knobs (`raw/probe/edit.py`), each **off by default**, so the main thread's T1 path is today's (identity row above):
  - **D (deeper entry):** `tableCutoff` cuts when the stored depth is ≥ the requested depth (`ADR-0058` decision 1's hit test; the bound rules unchanged; the root never cuts). Per thread.
  - **S (skip blocks):** Stockfish's pre-2018 helper schedule. Helper index h ≥ 1 skips iteration d when `floor((d + SkipPhase[(h−1)%20]) / SkipSize[(h−1)%20])` is odd, with SkipSize = 1,1,2,2,2,2,3,3,3,3,3,3,4×8 and SkipPhase = 0,1,0,1,2,3,0,1,2,3,4,5,0..7. Iteration 1 always runs. Worker 0 never skips.
  - **P (perturbation):** in helpers h ≥ 1, the root move list after `orderMoves` keeps its first move (the hash move) and permutes the rest with a seeded LCG (seed h, re-seeded per iteration). Worker 0 is never perturbed.
- **Pool:** D12's driver form (`raw/probe/driver.mjs`, `worker.mjs`): ADR-0062 D3–D6, main thread clears, resets the slot, posts; first result sets the slot; played = deepest completed iteration, tie lowest index (D6). T1 = today's `chooseMove` on the main thread.
- **Positions:** D12's 20 (ABC-078 A3 corpus, 276, indices `i % 14 == 0`). Warm-up: one `go` 300 ms per cell on the non-corpus board, discarded.
- **Rotation:** per block (position i, pass p) the cells run in order `set[(i + p + j) % n]`, j = 0..n−1.
- **Cells.** Process **P12** (OS-placed): T1, T1D (T1 with D, info only), T12 (ADR-0062 as written, D12 control replicate, not eligible), T12S, T12D, T12P, T12SD, T12SDP, T4SD. Process **P4** (`taskset -c 0-3`, the four Zen 5 cores; candidate 4, the cap): T1, T4, T4SD, T4SDP.
- **Runs** (every one `flock host-test.lock timeout 300 …`; host ≤ 20 min total):
  - **R0 reference:** T1 on the main thread, budget 5 000 ms, each of the 20 positions once (≈ 100 s). Its move is the position's reference move.
  - **R1:** P12 at 100 ms, 3 passes (60 gos a cell). **R2:** P4 at 100 ms, 3 passes.
  - **R3:** P12 at 1 000 ms, 1 pass. **R4:** P4 at 1 000 ms, 1 pass. Information only.
  - **R5 confirmation:** a fresh process with cells [T1, candidate] at 100 ms, 3 passes (pinned to 0-3 if the candidate is a P4 cell).

## The statistics (per cell, per run; baseline = T1 of the same run)
- **D** = median of the played depth over all the cell's gos (mean of the two middle values when even).
- **Q (the quality proxy, not depth)** = Σ over the 20 positions of the fraction of the cell's passes whose played move equals R0's reference move. Range 0–20; one position = 1.0.

## The rule (pre-registered; 100 ms only)
- **Eligible:** T12S, T12D, T12P, T12SD, T12SDP, T4SD (P12), T4, T4SD, T4SDP (P4). T1D and T12 are not eligible.
- **DEPTH-PASS:** D(c) > D(T1), strictly, AND Q(c) − Q(T1) > −2 (no quality loss of two positions or more).
- **QUALITY-PASS:** Q(c) − Q(T1) ≥ 2.
- **PASS-A** = DEPTH-PASS or QUALITY-PASS in R1 or R2.
- **Selection:** PASS-A candidates ranked by DEPTH-PASS first, then D(c) − D(T1), then Q(c) − Q(T1), then fewer threads, then fewer knobs. The top one goes to R5; if it fails, the next one (at most two confirmations).
- **WIN** = the candidate passes again in R5 by a criterion it passed in R1/R2, against R5's own T1. No re-run on a result.
- **LOADED** (per run): (a) a foreign vitest or `cutechess-cli` at any block check; or (b) run foreign cores > 0.8 (host busy jiffies − own CPU, ÷ wall; D3-V2's threshold); or (c) more than 20 % of the run's blocks above 0.8 (D12's 4 of 20). LOADED and no pass → **VOID-LOAD** for that cell, not a miss (one re-run of that run allowed within budget, disclosed). LOADED and pass → PASS (SHARED), disclosed, and R5 must be unloaded to count as a WIN.
- **Verdict:** a WIN → `ADR-0062` is amended (still PROPOSED) with that form. No WIN → said plainly, with the Architect's recommendation. No bar is loosened, and nothing is graded by hand (`raw/probe/analyse.mjs`).

## Information, not in the rule
- R3/R4 at 1 000 ms: D and Q per cell (a basis for a "different read" recommendation, never a WIN).
- **Attribution:** T1D − T1 (D and Q). If a winner contains D and T1D shows the same gain, the gain belongs to `ADR-0058`'s rule, not to threads; the amendment and the owner question must then say so.
- Per-worker node rate, gos where every worker completed the same depth (lockstep), played above worker 0, worker 0's own D and Q.

## Risks
- **20 positions.** Q moves in steps of 1/3 a position per pass; two positions is about one standard deviation of a null difference (estimate). R5 exists for that. Same positions in R5, so a position-specific fluke can repeat.
- **The reference is a T1 search.** Q favours moves a long single-thread search of this engine picks; a pool that finds a different good move scores as a disagreement.
- **Prototype, not the build;** the OS places workers in P12; P4's pinning is not something production can do from Node (only the count is).
