# arch-phase2-rebase probe (scratch, reproducible)

Two scratch trees, both outside the repository, both deleted after the readings. Every run was wrapped in
`flock <host-test.lock> timeout 300`; deterministic counts only (fixed depth, or `chooseMove` with `maxDepth` /
`maxNodes` on a frozen clock); no timing.

## 1. ADR-0060 on main (m1-m6, d1)
- Base: `git archive <main 5ffbae25> src package.json` (`src/` equal to `0b73f51d`, no reverse futility), plus
  `arch-phase2-p1/raw/probe/probe.ts` unchanged.
- `python3 patch_main.py <root>`: `arch-phase2-p1`'s `patch.py` with the P3 futility and P5 null-move knobs removed
  (they gated on reverse futility, which main lacks). The P1 predicate and both call sites are unchanged.
- For m6 the `simple` flag (flat 2/1 rival) was added by hand after the PV subtraction in `lmrProbe`, as in
  `arch-phase2-p1`: `if ((PROBE as any).simple) r = pvNode ? 1 : 2;`.
- Door = main's flat ABC-121 rule. Instrument check: door reproduces 1 116 785 / 1 602 457 (`search()` d8) and
  1 575 537 / 476 244 (`chooseMove` to 8), ADR-0059's door counts.
- Batches: `runs.sh` (m1-m5), `vsweep.sh` (m6), d1 (the PV -2 diagnostic). Outputs `m*.out`, `d1-*.out`.

## 2. Reverse futility reach (r1), for the ABC-264 retry ruling
- Base: `git archive 4d1c0616 src package.json` (grugops/ABC-264-fix), unpatched (`rf120`), and the same with
  `REVERSE_FUTILITY_MARGIN = 150` (`rf150`, F1's fallback).
- `node rf.ts <maxNodes>` from each root: `chooseMove` against `chooseMoveWithoutReverseFutility` on ABC-121's 190,
  frozen clock, `maxNodes` 47 000 and 20 000. Output `r1-rf-reach.out`.
