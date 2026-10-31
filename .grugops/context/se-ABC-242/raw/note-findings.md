# `ABC-242` SE findings and QE handoff (all INFO or LOW; none blocks)

- **SE-242-a (INFO): QE's probe now reads a different base.** QE's `blunder-probe.mjs`, run out of tree as written
  (rate 1, 2 000 ms, `virtualClock(1)`, seed 1):
  - base `4387d4e8`: `[d8e8 −1020, d8c8 −1030, d8d7 −1030, d8e7 −1015, d8c7 −1031]`, the same with and without the
    keys; plays `d8e8`. The ADR and the ticket record `d8e8 −1013` and `[… −1030 −1020 −1010 −1031]`, read at
    `ABC-230`'s tree. The engine changed since (`ABC-229` at least); which commit moved it is `UNKNOWN - verify`.
  - head: `[d8e8 0, d8c8 −1041, d8d7 −1030, d8e7 −1015, d8c7 −1031]`; plays `d8e7`, kind `blunder`. Entry 1 moved
    (it inherits `d8e8`'s slice); entries 2–4 equal base's on this set-up.
- **SE-242-b (LOW, design note for QE / Architect): on a plain 2-cycle, base already scores the winner's third
  occurrence 0.** Read: KQ v K, White to complete the third occurrence (`a2a1`), base `a2a1: 0` at steps 1, 10, 100
  and 1 000, keys handed. Inside the child search the loser's shuttle reply is itself a position that stood twice
  before the child's root, so the engine scores it a draw at ply 1. So the change bites the loser's repeat (both
  measured classes of `ADR-0054` d4 are still covered), and a winner's repeat only where the loser's replies are not
  themselves repeats. The A1 winning fixtures use an asymmetric shuttle for that reason (decision note).
- **SE-242-c (INFO): M7 and M8 survive every row at every step; both are equivalent mutants.**
  - M8 (raw `zobristKey`): where the walk reads anything the child's clock is ≥ 4, so it has no ep square and its raw
    key is its repetition key (`ADR-0054` amendment A2 says so). The helper is kept for `ADR-0020` C1's "every
    comparison".
  - M7 (walk from −2): `K[−2]` is the position two plies before the child. One move by each side cannot restore it,
    so it never equals the child.
  - The 100-key cap is not pinned either. Every caller hands at most 100 trimmed keys plus the root key, and with 101
    the walk's last even offset is −100, so the cap changes nothing. It would matter only for a caller that hands
    more than 100 untrimmed keys with a clock above 100. `UNKNOWN - verify` whether QE wants a row for it.
- **SE-242-d (INFO): the `QE-244-a` carry does not trigger.** No `ABC-230` / `ABC-241` row, their `STEP_MS`,
  `LEVELS[5].budgetMs` or `NODES_PER_CLOCK_CHECK` was touched. The new rows are separate `describe` blocks.
- **SE-242-e (INFO): the test-local base oracle.** A1–A3 and A6 compare against `base()` in `src/levels.test.ts`, a
  line-for-line copy of `main`'s `blunder` loop. Its agreement with the real level is asserted in the same run
  wherever the check cannot fire (whole list, depth and nodes in A2/A3; also elapsedMs in A6). QE may still want to run
  A1–A3 against the base tree itself.
- **SE-242-f (INFO): the `src/levels.test.ts` header still says "DEFAULT (`npm test`, 19 tests)".** That count was
  already stale before this ticket. It was not edited (smallest diff).
- **UAT is owed** (production lines in `src/levels.ts`). The QE verdict signs it (test note 3).
- **For QE:** the parity scripts and outputs are in `raw/probe/` (`plant.mjs`, `mutants.txt`, `plants-run1.out`,
  `plants.out`), and so are the base/head value probes (`values.mjs`, `values.out`) and QE's probe re-run
  (`qe-probe.out`). `G8` is QE's to read.
