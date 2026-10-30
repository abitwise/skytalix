# `ABC-244` SE findings and what QE needs (A6–A9). Branch `grugops/ABC-244`, code `25282ad4`

## Findings (SE-severity; none blocks)
- **SE-244-a (LOW). U2's `F230` kill depends on depth.**
  - The CLI `ABC-241` A4 and A7 rows kill `F230` (the seam ignores the injected list) only because base's search,
    at 40 reads on the hash list, plays a move other than d8e8. At 4 reads it plays d8e8 too.
  - So any change that makes these rows shallower can silently drop the kill. That includes a step move, or a
    `LEVELS[5]` re-cut downward.
  - The UCI A5 row also kills `F230` at both steps, so U2 is not left uncovered.
  - Ticket test note 3 already names this case ("a failed step, not a bound to edit"). It is recorded so that R4
    tickets and tranche 2 know these rows are depth-sensitive.
- **SE-244-b (INFO). Two unit rows kill none of the 9 SE mutants**, at base or tip:
  - `cli` ABC-230 A3 "a game started from a FEN …";
  - `cli` ABC-241 A4 "with a legal ep capture available …".
  - They hold parity trivially on this list. QE's larger list may discriminate them. `qe-ABC-230` already recorded
    the R fixtures through the seam as non-discriminating.
- **SE-244-c (INFO). The expected saving is smaller than the ticket's high end.** Only U1 moved: 4 of the 8 unit
  rows, about 0.71 s of `cli` `ABC-230` plus 0.27 s of the UCI A2 row in `arch-g8-headroom`'s run-6 shape. U2's
  ≈ 0.42 s stays. The ticket's estimate already allows for this ("the low end if half the rows keep step 100"). A9
  reads it.
- **SE-244-d (INFO). The informal wall is not a reading.** One `npm test` per arm: base 9.67 s, tip 9.17 s, at load1
  ≤ 2.0, with no wait-clear or Tctl gate. `UNKNOWN - verify` until A9.
- **SE-244-e (INFO). Two of the SE mutants are reconstructions.** `S241M1` and `S241M6` were rebuilt from
  `se-ABC-241` `…887921ba`'s one-line descriptions (M1 "helper returns `key`", M6 "UCI replay raw"). No script was
  kept for them. QE may adopt them or re-derive them.

## What QE needs
- **A6: freeze QE's list before any head run.** It must hold at least the SE's nine, at the texts in
  `probe/mutants.mjs` (frozen `probe/frozen-mutants.json`, sha256 `a624b9f5…1c45`):
  - `F230` (`qe-ABC-230` § 3);
  - `QM1`–`QM4` (byte copies of `qe-ABC-241` `mutate.mjs`);
  - `UNTRIM` (uci-session hands the replayed keys untrimmed);
  - `REP0` (the search's repetition branch returns 1, not 0);
  - `S241M1` and `S241M6`.
  - Add any SE-241 M2/M4/M5/M8 QE names.
  - Re-confirm on the **4 changed rows**: `cli` ABC-230 A1, "keyHistory is read once", A3, and `uci` ABC-230 A2.
    The U2 rows are unchanged by construction.
  - The SE's base kill sets are in `probe/kill-base.jsonl`, with the per-row table in the readings observation.
- **A7: node census** on the 4 changed rows at base and tip. Expect strictly fewer nodes (40 → 4 reads per search
  of 4 000 ms). List the 4 U2 rows as unchanged at 100.
- **A8: `N8-LANE`** on the two-file set `src/cli.test.ts` + `src/uci-session.test.ts`, ALONE. The SUITE heap row
  applies to two files: `NODE_OPTIONS=--max-old-space-size=128` (`heap-guard` refuses 400 there).
- **A9: `G8`** interleaved b h h b b h after a wait-clear. Base `d59e3194`, head `25282ad4`. Design target ≤ 9.4 s.
- **Security/NFR:** the `NFR-008` state on H.
