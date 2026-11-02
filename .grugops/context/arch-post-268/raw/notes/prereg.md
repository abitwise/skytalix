# arch-post-268 PREREG: ADR-0060 decision 1, UNCHANGED, re-measured on `main` `e72487e1` (futility in force), under its pre-registered bars; sealed and committed before any probe run

Architect/Design, task `arch-post-268`, on `grugops/arch-post-268` from `main` `56b3782d` (its `src/` is `e72487e1`'s, tree `58fa3eb4`: `ABC-265` and `ABC-268` both in). ADR-0060's 2026-11-02 status names this step: "re-measure decision 1 unchanged, under the same bars, on the `main` that `ABC-268` merges into". `ABC-268` merged (Orchestrator `…77a82ec1`). No probe has been run in this hop.

## Instrument
- Base: `git archive e72487e1 src package.json` into a scratch directory outside the repository; deleted after.
- `patch_post268.py`: `arch-ADR-0060-reopen`'s `patch_reopen.py`, re-anchored because each `lateMoveReduction` call site now sits after the futility skip; predicate and knobs unchanged. Plus an audit sampling hook (information only, below). With defaults the scratch search is `main`, node for node.
- Driver: `arch-ADR-0060-reopen`'s `probe.ts`, unchanged, plus `arch-phase2-p3`'s `audit` mode.
- **Head = decision 1 exactly**, the reopen's R0: `{"lmr":"log","base":1.0,"div":2.0,"killerLess":0,"maxR":2}` (PV one ply less, cap 2, r <= d - 2, eligibility the flat rule's). **Door = today's `main`** (flat `ABC-121` LMR, futility on).
- Runs: three batches, each `flock <host-test.lock> timeout 300 bash batchN.sh`, every job `timeout 300`. Deterministic node counts only, fixed depth or `maxNodes` on a frozen clock (`G1` on its virtual clock). No timing is read.

## Instrument check (not a bar)
The door must reproduce `ADR-0061` d9's head counts, `main`'s shipped search since the merge: `search()` d8 888 786 / 1 262 046, `chooseMove` to 8 1 306 981 / 391 451 (kiwipete / position-6), reach 5.837 at 47 000. A door count that differs is explained before any bar is read (`ABC-265` is node-equal at `Threads 1` by its own reading).

## The bars, quoted from ADR-0060 d8 / d9 unchanged
- **A4 (a):** nodes at depth 8 on kiwipete and position-6, `search()` and `chooseMove`: <= 0.85x the door's on each of the four readings.
- **A4 (b):** mean completed depth at 47 000 nodes on the 190 (`chooseMove`, `maxNodes`): >= the door's + 0.25 ply. Deeper / shallower / moves-differ reported.
- **A4 (c):** `G6` "≥ base" is timing, a build's gate: **not read** here (as in every earlier probe of this ADR).
- **A3 drift:** depth 5 on the 190, both recursions: >= 95 % of non-mate scores within 25 cp, **none beyond 27 cp**, 0 mate sign changes. Mate-status flips reported.
- **Mate floor:** every position of the 287 the door scores as a mate at depth 4, `search()` head at depth 5 scores a same-sign mate: 0 violations. Same-depth (d5) count reported.
- **Zugzwang:** `ADR-0050` d9's seven rows, `chooseMove` at recorded depths: 7 / 7 (door's counts reported).
- **G1:** >= 54 / 58, no NEWLY-MISSED line against `src/puzzle-suite.baseline.json` (door's G1 reported).
- **Reports, not bars:** depth-8 ratios on position-4 / position-5 / startpos; reach at 20 000; firing at depth 6.

## ADR-0061's cut audit, as information (not a bar of ADR-0060)
`search()` at depth 6 over the 190 + 6 endgames; a node is marked when it is null-window and, on a searched move, decision 1's reduction differs from the flat rule's; every 10th marked node (AUD=10) is re-searched fresh three times (head at the node's null window, door at the same window, door full window = v). Flips and errors >= 100 / 200 / 300 / 500 cp are reported, split "more" (decision 1 reduces deeper) and "less" (it reduces less, e.g. PV node or d3 move 4-6), and by depth. ADR-0061's own bars (<= 0.5 % flips, 0 flips >= 200 cp) are quoted beside it for scale only. If the job times out at 300 s, it is re-run once with AUD=50 and that is reported as the sample.

## Verdict rule (fixed now)
- **Meets every bar** (A4 (a) on all four, A4 (b), A3 both recursions, mate floor, zugzwang 7 / 7, G1): ADR-0060 decision 1 is **ready to be put to the owner for acceptance**, with A4 (c) G6 left to the build, and these counts become decision 9's instrument-check counts on `main`.
- **Misses any bar:** P1 **stays parked**, with the missed bar(s) named; no bar moves, no form is tuned in this hop (a new form is a new pre-registered probe).
- The audit cannot change the verdict.
