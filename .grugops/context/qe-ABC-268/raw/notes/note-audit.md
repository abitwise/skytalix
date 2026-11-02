# qe-ABC-268 A3 (d) cut audit, re-run independently: MET — 30 272 firing, 2 943 sampled (d1 1 918 / d2 966 / d3 59), 0 flips, 0 ≥ 100 cp, 0 ≥ 200 cp, door noise 0; the sample is byte-identical to the arch probe instrument's own

QE/E2E, task `qe-ABC-268`, PREREG `…fae528bd`. Build sampled: **`df984484`** (`src/` tree `98075412`), scratch copy outside the repository, deleted after. Under `flock host-test.lock`. Raw in `raw/audit/`.

## Instrument (QE-written, not SE's)
- `qe-audit-patch.py`: a sampling hook on the scratch copy's `src/search.ts` only (never in `src/` of the repo): a per-node skip counter in the move loop; after the loop and before the store, a node that skipped ≥ 1 move is one firing node (so a node that skipped and then cut off still counts); every 10th firing node's FEN, remaining depth and ENTRY window (`alphaIn`, `beta`) is logged; `qeNode()` searches a node fresh (cleared table, fresh killers, ply 1) with `search()`'s switches and `futility` on or off.
- `qe-audit.ts`: `probe3.ts` audit mode as written: `search()` d6 over the 190 (the six endgames included), the counter reset per corpus row as `probe3.ts`'s `setCfg` does; each sampled node searched three times: rule on at its null window (h), rule off at the same window (dnw), rule off at a full window (v). Flip = h and dnw on opposite sides of alpha; error = v − alpha (false fail-low) or beta − v (false fail-high). The |alpha| > 15 000 exclusion is kept and counted: 0 excluded.

## Readings
- **Firing (the A6 figure, named before the read):** head 14 311 902 / door 17 826 686 nodes = **0.8028×**; **30 272 firing nodes, 901 655 moves skipped**; the door fires 0.
- **Audit:** `{"firing":30272,"sampled":2943}`; all: n 2 943 (every one a null window), **flips 0**, ffl 0, ffh 0, e100 0, **e200 0**, e300 0, e500 0, unstable 0, door noise 0. By depth: **d1 1 918, d2 966, d3 59**, 0 flips each.
- **Bars: flips ≤ 0.5 % (0.000 %) and 0 flips ≥ 200 cp (0): MET.** Instrument counts reproduce the ticket's exactly; nothing to explain; the sample was not changed.

## Cross-check against the probe's own instrument
- `patch_p3.py` (arch-phase2-p3, unchanged) applied to a scratch copy of the BASE tree (`ca6e8506`), knob `{"fut":[0,150,350,550]}`, `probe3.ts`'s audit loop dumping its sample: nodes 14 311 902, fired 30 272, pruned 901 655, sampled 2 943.
- The two sample lists (FEN | depth | alpha | beta, 2 943 lines each) are **byte-identical** (`cmp` rc 0; sha256 prefix `cd47105e57539d6c` both). So the shipped build fires at exactly the nodes, with exactly the windows, the probe measured; the audit verdict is the probe's verdict on the shipped code.

## Scope (as the ADR says)
A guard against piece-sized tactical errors, not a strength predictor: reverse futility's audit was nearly clean and still lost.
