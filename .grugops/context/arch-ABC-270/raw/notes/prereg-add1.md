# arch-ABC-270 PREREG addendum (sealed before it runs): the choice is read as pre-registered — QX and X are both NOT eligible on E3 (mate floor d5 against d5: QX 2 / 190, X 1 / 190 violations), so choice rule 3 holds: the structure only, value-identical, values owned by the tuner. One post-hoc diagnostic names the lost mates; it re-grades nothing

**What was read (batches A and B, as pre-registered; `…117475f9`).**
- I1 exact: BASE = MAIN on all 9 batch A rows (nodes, score, move), and both equal `ADR-0064` B0's recorded counts.
- QX: E1 0 / 214 mirror mismatches; E2 9 / 9 ≥ 20 cp (min 110); E3 d4 → d5 0 / 163, **d5 → d5 2 / 190**; E4 7 / 7;
  E5 54 / 58, none newly missed; E6 364 / 364 pairs.
- X: the same, except **E3 d5 → d5 1 / 190**.
- Not a probe artifact: `search()` clears its table on every call (`src/search.ts`, `clearTable` under
  `switches.table`), and killers and history are per search. X is a data change only (three endgame halves set to 0).
- **So neither form is eligible, and choice rule 3 holds.** No row is re-read, no form is re-tried, and no value is
  moved to pass.

**The diagnostic (post hoc; decides nothing).** For each violation under X and QX: the FEN, BASE's d5 score and move,
the form's d5 score and move, and the form's d6 and d7 scores (does the mate come back one or two plies deeper?). It is
`k3probe.ts` mode `matediag` (added to the committed driver), on the same scratch tree, under the lock, ≤ 5 min.

**Why it is worth reading.** `K2`'s d5-against-d5 row grades every value-changing evaluation ticket, `ABC-239`'s tuned set
included (`ADR-0067` B-T5, "`ADR-0064` B2's form"). If a small, rule-made exposure change loses a same-depth mate, any tuned
set may do the same. The ADR names that as a risk for `ABC-239`. It is not a reason to change any bar.

Batches C, E and D5 run as pre-registered (reports).
