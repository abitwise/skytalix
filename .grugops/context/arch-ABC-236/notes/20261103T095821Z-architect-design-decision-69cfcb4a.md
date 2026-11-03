---
id: 20261103T095821Z-architect-design-decision-69cfcb4a
kind: decision
by: architect-design
at: 2026-11-03T09:58:21Z
verified_by: 
confidence: high (a pre-registration: instrument, forms, gates, choice rule, bar-derivation rules, intent rule and verdict rule fixed before any measured run)
refs:
  - arch-ABC-236
  - grugops/arch-ABC-236
  - ABC-236
  - EPIC-011
  - S1
  - ADR-0066
  - ADR-0056
  - ADR-0026
  - ADR-0050
  - ADR-0061
  - ADR-0063
  - ADR-0065
  - ABC-269
  - 70db0e7f
  - arch-ABC-234/20261103T095012Z-architect-design-decision-a4ed96aa
supersedes: 
seal: sha256:3b3cb3f07725f2f6eeac49657ad85893e81c9d0790bba71df01180bad3911168
---

# arch-ABC-236 PREREG: S1 (root aspiration windows, `chooseMove` only) on `main`'s search (`src/` tree `58fa3eb4`, futility in force): instrument, four forms, two gates, the choice rule, the bar-derivation rules, the intent rule and the verdict rule, sealed and committed before any measured run

Architect/Design, task `arch-ABC-236`, on `grugops/arch-ABC-236` from `main` `70db0e7f` (its `src/` is tree `58fa3eb4`, the tree `ADR-0063` and `ADR-0065` measured). Inputs: brief `.grugops/queue/claimed/arch-ABC-236.md` (Orchestrator, 2026-11-03T09:51:44Z); `plans/tickets/ABC-236-…md` (scope 1-3, A1-A5); `ADR-0056` (row S1; C2′ GAIN 50.0 / NEUTRAL 43.0; "C yes"; the depth-gated rule, which names S1); `ADR-0026` d10 (the off-door pattern); `ADR-0061`, `ADR-0063`, `ADR-0065` (probe shape, reused from `.grugops/context/arch-ABC-234/raw/probe/`); `src/engine.ts` (`deepen`, `runIteration`, `searchMove`), `src/transposition.ts` (fail-soft `boundOf`, exact-depth `tableCutoff`, always-replace `storeEntry`). **No measured run has been made in this hop.** The patch was applied and the modules imported once (a load check; no search was run, no count was read).

## What the engine does today (read, not measured)
- `runIteration` searches the root with alpha = −∞, beta = +∞ every iteration. The first root move gets the full window; every later root move gets PVS's null window at alpha, then a full re-search with (alpha, +∞) if it lands inside. So the root is already PVS; aspiration can only narrow the FIRST move's subtree (the PV) and the later moves' full-window re-searches.
- `search()` is one fixed-depth pass with no previous score, so aspiration has nowhere to act there. **This probe reads `chooseMove` only** (the path the engine plays).

## Instrument
- Base: `git archive HEAD src package.json` into a scratch directory outside the repository (deleted after).
- `patch_236.py` (scratch, `src/engine.ts` only):
  - `runIteration(…, alpha0 = −∞, beta0 = +∞)`: root alpha starts at alpha0; every root `searchMove` gets beta0; once best ≥ beta0 the root loop stops (a fail high), the root stores `BOUND_LOWER` with that move and reports fail = +1; best ≤ alpha0 after every move is a fail low (fail = −1), with **no root store** (the previous iteration's root entry, and so its hash move, stays). Otherwise the root stores `BOUND_EXACT`, as today.
  - `aspirate(…, prev)` from iteration `from` (5): if |prev| ≥ `MATE_FLOOR` (20 000) the iteration takes the full window (mate guard). Else the window is (prev − δ, prev + δ). On a fail: δ ← δ × 2 and only the failed side moves, to the fail-soft score ∓ δ; a side whose δ exceeds `cap` (400), or whose new bound reaches ±`MATE_FLOOR`, becomes ±∞. A fail on the other side after a fail (fail high then fail low, or the reverse) is counted (`flip`) and handled by the same rule; termination: δ doubles on every fail, so after at most ⌈log2(cap/δ0)⌉ + 2 fails both sides are infinite, and a full window cannot fail.
  - One-step variant (`oneStep`): on a fail the failed side goes straight to ±∞.
  - An abort (clock or `maxNodes`) inside any pass aborts the iteration; `best` and `reached` stay the previous completed iteration's (`ABC-078` `A3` unchanged).
  - Counters: windowed iterations, mate-guard iterations, passes, fail low / high, flips, iterations with ≥ 1 re-search, nodes in all / in iterations ≥ 5 / inside aspiration passes / inside failed passes, max passes; a per-iteration log (depth, score, move, fails, nodes).
  - With `on: 0` the scratch `chooseMove` is `main`'s, node for node (with alpha0 = −∞ and beta0 = +∞ neither new branch can fire).
- Driver `probe.ts` (`arch-ABC-234`'s corpus, zugzwang rows, `G1` and reach modes; SEE removed): modes `nodes`, `rates`, `drift` (+ A2), `mate`, `zug`, `reach`, `g1`. Every comparison is head against the door (`on: 0`) in `chooseMove`.
- Every batch under `flock <host-test.lock> timeout 3000`, every job `timeout 600`, **one job at a time** (one core). Deterministic counts only (`chooseMove` with `maxDepth` or `maxNodes` on a frozen clock; `G1` on its virtual clock). No timing is read.

## Instrument checks (not bars; a miss is fixed in the instrument and explained before any gate is read)
- The door reproduces `ADR-0061` d9's / `ADR-0065`'s counts to the node: `chooseMove` d8 1 306 981 / 391 451 (kiwipete / position-6); reach 5.837 at 47 000 on the 190 (+6); zugzwang nodes 905 900 (`.004`) and 1 310 019 (`.005`); `G1` 54 / 58.
- The head's per-iteration log shows windows only from depth 5 (a head row whose depths 1-4 differ from the door's is an instrument defect).

## Candidate forms (all from iteration 5, the ticket's; mate guard as above; nothing else differs)
- **A25:** δ0 = 25, doubling, cap 400.
- **A50:** δ0 = 50, doubling, cap 400.
- **A100:** δ0 = 100, doubling, cap 400.
- **A50F:** δ0 = 50, one step (the failed side goes to ±∞ at once).

## Reported for every form (the premise numbers the brief asks for)
- `chooseMove` d8 nodes on all six standard roots (startpos, kiwipete, position-3 … position-6) and pooled.
- Fail-low / fail-high / flip / re-search rates per windowed iteration, wasted nodes (inside failed passes) as a share, at maxDepth 7 over the 190 (+6). Per iteration ≥ 5: head score and move equal to the door's at the same depth, overall and on iterations with ≥ 1 re-search ("the value and the root move survive a re-search"); mate iterations equal.
- Door iteration-to-iteration score swings |s_d − s_{d−1}| for d = 5, 6, 7 (non-mate), p50 / p75 / p90 / p95 and counts > 25 / 50 / 100 cp: the basis for δ.
- Reach (mean completed depth) at 47 000 nodes on the 190 (+6); the **firing figure at 100 ms**: the head's share of all nodes spent inside aspiration passes at 47 000, and rows that started a windowed iteration.
- Reports (not bars): d7 and d9 on kiwipete / position-6; reach at 20 000.
- **Stated expectation (not a gate):** the root is already PVS, so only the PV subtree and the root's re-searches narrow; I expect d8 ratios in roughly 0.90-1.00 (estimate, `UNKNOWN - verify`), so the 0.95× gate is not assured. The verdict comes from the gates only.

## Gates (each form)
- **Pay (`A3`, the ticket's, unchanged):** `chooseMove` total nodes over iterations 1-8 (maxDepth 8) on kiwipete and position-6: **≤ 0.95×** the door's on **both**.
- **Safety:**
  - `ADR-0050` d9's seven zugzwang rows at recorded depths in `chooseMove`: **7 / 7 (hard)**.
  - `G1` ≥ 54 / 58 with no NEWLY-MISSED line.
  - Mate floor, `chooseMove` same depth, door d5 → head d5 and door d6 → head d6 on the 287: **0 violations** (a door mate the head does not score as a same-sign mate).
  - Drift, `chooseMove` at maxDepth 5 and 6 over the 190 (+6): ≥ 95 % of non-mate scores within 25 cp, max ≤ 75 cp, 0 mate sign changes (mate/non-mate flips reported).
  - **A2 (re-search correct):** the first 6 rows, scanning the corpus, then `G1`'s positions, then the mate corpus, in order, whose door `chooseMove` score moves ≥ 200 cp from iteration 5 to iteration 6 with no mate score at either. Gate: on every one, the head's depth-6 score equals the door's exactly, **or** it is within 25 cp **and** the root move is the same. `A2`-exact (the ticket's words) is reported beside it; if exact misses on any row, the ADR re-words `A2` to the bounded form (an owed ticket line), declared here before any data. Fewer than 6 found: the gate reads the rows found and the shortfall is reported.

## Choice rule
Among forms passing both gates: the largest reach gain at 47 000; within 0.02 ply of the best, the lower of the two d8 ratios' maximum; then the order A50, A25, A100, A50F.

## Bars the ADR writes for the chosen form (derived by these rules, fixed now)
- **`A3`:** d8, kiwipete and position-6, `chooseMove`: ≤ min(0.95, ⌈100 · (max of the two + 0.05)⌉ / 100).
- **Drift:** ≥ 95 % within 25 cp; none beyond max(25, min(75, ⌊1.5 × the larger measured maximum of d5 / d6⌋)) cp; 0 sign changes.
- **Mate floor:** same depth, d5 and d6, 0 violations. **Zugzwang** 7 / 7. **`G1`** ≥ 54 / 58, no NEWLY-MISSED. **`A2`** as gated (exact if it read exact on all rows found, else bounded).
- **Intent:**
  - The mechanism **fires at 100 ms** if the head's share of nodes inside aspiration passes at 47 000 is **≥ 10 %**. Then the intent is **GAIN** (C2′ ≥ 50.0 of 100): NEUTRAL "invisible at 100 ms" is not open. If its reach gain is ≥ +0.10 ply the ADR adds a reach bar ≥ door + max(0.10, ⌊20 · 0.7 · gain⌋ / 20); otherwise reach is a report.
  - Below 10 %: **"NEUTRAL (invisible at 100 ms)"** (C2′ ≥ 43.0 with `A3` as the ticket's own measured bar), with the firing figure stated.
- **`G5` / `NFR-004`:** a build's gate (the abort is at the node; a re-search adds no clock read). Not read here.

## Verdict rule
- **A form passes both gates:** `ADR-0066` is written PROPOSED for it, with the bars above and the intent as derived, a test-only off-door pair, file list, test rows, falsifiers and effort.
- **No form passes:** `ADR-0066` is written PROPOSED with "premise not met on `main`" (the `ADR-0063` / `ADR-0065` pattern), the failed gate(s) named; no form is tuned after the read in this hop; the recommendation is park.
- Anything run after the gates are read is labelled DIAGNOSTIC and cannot change the verdict.

## E1 (`ABC-269`, in flight; not depended on)
Read only as reasoning in this hop: the window width is set by the iteration-to-iteration score swings measured above, and E1's taper changes the evaluation (endgame halves for king square and passed pawns), so it can move those swings, most in endgames. The ADR states whether δ must be re-read after E1; this probe does not run E1.
