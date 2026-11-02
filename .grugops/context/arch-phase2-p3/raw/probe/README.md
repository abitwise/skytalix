# arch-phase2-p3 probe (scratch, reproducible)

- Base: `git archive <branch head> src package.json`. The branch's `src/` is tree `f2388e40`, the same as `main`'s at
  dispatch (`cfff6993`) and at the end of this hop. It was unpacked into a scratch directory outside the repository and
  deleted afterwards.
- `python3 patch_p3.py <root>` adds the probe knobs to BOTH recursions. With every knob at 0 the search is `main`,
  node for node.
  - `fut[d]` is P3, futility. At a null-window node, not the root and not in check, with alpha and beta outside the
    mate band and `evaluate + fut[d] <= alpha`, it skips every quiet, non-checking move after the first. The index
    still advances.
  - `lmp`, `lmpBase`, `lmpMul` and `lmpDiv` are P4, move-count pruning. Under the same guards, at depth ≤ `lmp`, it
    skips quiet, non-checking moves once floor((base + mul·d²)/div) quiet moves have been searched.
  - `nmpDiv`, `nmpEval` and `nmpEvalCap` are P5: R = 3 + ⌊d / div⌋ (+ an eval term).
  - `raz[d]` is P6, razoring. At a null-window node, not the root and not in check, with `evaluate + raz[d] <= alpha`,
    it takes the quiescence score `q` and returns it at depth 1, or when `q <= alpha`.
  - `rf` / `rfDepth` is `ADR-0059`'s reverse futility, rebuilt here for calibration only. `{"rf":120}` reproduces
    `4d1c0616`'s head counts to the node (`c0-instrument.out`).
  - The **audit**: fire nodes sampled from `search()` (each `audit`-th fire) as FEN, depth and window.
- Driver: `probe3.ts`, the `arch-phase2-p1` `probe.ts` plus an `audit` mode, copied into the scratch root. Run it as
  `node probe3.ts <mode> '<head json>'`, with modes nodes, drift, mate, zug, fire, reach, g1 and audit. Every node run
  went through `sweep.sh`, which wraps it in `flock <host-test.lock> timeout 300`. Readings are deterministic counts
  only, with no timing.
- **Audit mode (the tactical check):** `search()` runs at depth `D` over the 190 rows plus 6 endgames, and every
  `AUD`-th firing of the head's rule is recorded. Each sampled node is then searched fresh (cleared table, ply 1, so
  not a root) three times:
  1. the head at the node's null window (h);
  2. the door at the same window (dnw);
  3. the door at a full window (v, the reference value).

  A **flip** is h and dnw falling on opposite sides of alpha. Its error is v − alpha for a false fail-low, or
  beta − v for a false fail-high. The audit counts flips, and flips of 100, 200, 300 and 500 cp or more.
- Outputs:
  - `c0` instrument check;
  - `n1`–`n4` depth-8 nodes for P3, P4, P5 and P6;
  - `r1`/`r1b` reach at 47 000 nodes;
  - `b2` drift, mate, zugzwang and firing for the shortlist;
  - `a0`–`a2` audits, including the RF calibration and its sensitivity;
  - `b4` P3 margin tuning, reach at 20 000 nodes, and G1;
  - `b5` the depth-4 P3 rival and the door's zugzwang counts.
- `r1-reach.out` holds the first reach run and the start of the batch. That batch finished in `r1b-reach.out`.
