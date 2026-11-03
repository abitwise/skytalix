# arch-ABC-270 PREREG: the E3a premise probe (king exposure by phase, and the queen scale, on E1's packed table): forms, instrument checks, the eligibility and choice rules, and the reports, sealed and committed before any measured run; plus D5, a tuner diagnostic that decides nothing

**Base.** `main` `dc7dc15d` (`src/` tree `4cb84035`: E1 `ABC-269` with cut C1, and E2-pre `ABC-274`'s packed blend).
`git archive` of `src/` into `<scratch>/k3/base` (patched) and `<scratch>/k3/main` (unpatched), outside the repository.
Every run is `flock <scratch>/host-test.lock timeout ≤ 1500 …`, one at a time (one core). Deterministic counts only;
no timing is read. Files: `raw/probe/patch_k3.py`, `raw/probe/k3probe.ts` (from `arch-E1`'s `e1probe.ts`).

**Scope 3 (the `ADR-0031` addendum's shelter gate, A3) is OUT by reading, before any run.** A3 pays "a positive
middlegame king-table value" only while no shelter file is missing. `main`'s `KING_MG` (`ABC-215`'s rule
`max(−50, −10 d − 10 (R − 1))`) has no positive cell: b1 / g1 are 0, every other cell is negative. `ABC-205` gated
Michniewski's +20 / +30 castled cells (`grugops/ABC-205-final` `b5d5cea5`), which `ABC-215` replaced. So A3 gates
nothing on `main`. No probe result below can bring it in.

## Forms (`patch_k3.py`, selected by `setK3Form(egZero, queen)`; every path, the doors included, reads the form)

- **BASE:** `main`. The walk's `type === KING` test becomes `type >= QUEEN`, then KING / QUEEN inside (the queen
  flags; one compare per non-pawn piece, as before). No value moves.
- **X (scope 1):** `KING_SHELTER_MISSING`, `KING_FILE_HALF_OPEN`, `KING_FILE_OPEN` get endgame halves **0** (rule "0").
  Middlegame halves unchanged (15 / 10 / 20).
- **Q (scope 2 alone, a decomposition report):** while the enemy has a queen, each king's exposure adds a queen-on
  pair equal to **2 ×** the base pair in force, so the exposure is exactly 3 × in each half (`ADR-0031` A1).
- **QX (the candidate = scope 1 + scope 2):** both. Queen-on pairs (30, 0) / (20, 0) / (40, 0).

## Batches (serial)

- **A, counts:** `chooseMove` (frozen clock, `maxDepth`) nodes to complete d7–9 on kiwipete, d7–10 on position-6;
  `search()` d8 on both. Forms MAIN (unpatched), BASE, X, Q, QX.
- **B, play premise** (QX and X): mate floor (BASE d4 mates → form d5 same-sign; BASE d5 → form d5 same-sign, the 287);
  `ADR-0050` d9's seven zugzwang rows at their depths; `G1` (58, `puzzle-suite.baseline.json`'s budget and clock);
  static (all four forms).
- **C, reports:** reach at 47 000 nodes on the 190 (BASE, QX); drift at d5 `chooseMove` QX vs BASE; `ADR-0061` d8
  futility drift on QX's scale (BASE the control); game 1 (`plans/uat/EPIC-006-game-1.pgn`, positions before White's
  moves 4, 8, 10, 13, 17; `chooseMove` d7 and d8; BASE, QX).
- **E, migration upper bound (report):** the default test lane (`NODE_OPTIONS=--max-old-space-size=128`) on a patched
  copy with QX hard-wired at load, against the patched copy at BASE. Reds in the QX copy only = the rows the form moves
  when every path, the doors included, reads it.

## Instrument checks

- **I1:** BASE equals MAIN on every batch A row: nodes, score and move. Reported beside `ADR-0064` B0's recorded counts
  (expected equal, since `ABC-274` is node-identical). A miss is a patch defect: fixed, batch A re-run, nothing else read
  before it.
- **I2 (D5):** D4r reproduces `arch-ABC-239`'s D4 (`…f8d36d73`): the same inner cross-entropy ratio 0.99601 to 5 places
  and the same rounded parameters. A miss: D5 is not read.

## Eligibility of a form F ∈ {QX, X} (every row must hold)

- **E1** mirror, `Object.is`: 0 mismatches over `G3`'s corpus plus `ABC-269`'s `TAPER_MIRROR_POSITIONS`.
- **E2** `K1 (b)`: the 9 frozen endings (`TAPER_KP_SHELTER_STRESS` S1–S3 + `TAPER_KP_ENDINGS` D1–D6), centre minus corner
  from the walking king's side, **≥ 20 cp on all 9**.
- **E3** mate floor: 0 violations in both rows.
- **E4** zugzwang **7 / 7**.
- **E5** `G1` **≥ 54 / 58**, no NEWLY-MISSED line.
- **E6** (QX only) the queen pairs: every frozen position with a queen, that colour's queens removed. The king whose
  enemy lost its queens reads exposure halves with = 3 × without; the other king's exposure is unchanged. All pairs.

## Choice rule (fixed now)

1. **QX eligible →** the ADR proposes scope 1 + scope 2 on rule values, with QX's batch A counts as `K0`.
2. **Else X eligible →** the ADR proposes scope 1 on its rule, and the queen-on pairs as structure at 0 (tuner-owned).
3. **Else →** the rule values' premise is not met. The ADR proposes the structure only, value-identical to `main`,
   with values owned by the tuner.

No report enters the choice. **The order against `ABC-239`** is argued from structure (what the tuner can fit, and which
reads each order costs). It reads no probe figure, except through the choice above (which variant, if any, goes first
on rule values).

## Reports (decide nothing)

The tree shape **S** = the largest QX / BASE ratio over `chooseMove` kiwipete d8–9 and position-6 d8–10. `G6` is graded
on `NFR-005`'s floor alone (`Q-3K-4` = (b)), so S forecasts nothing about a FAIL by itself. Also: X and Q against BASE
(which part grows the tree), `search()` d8, reach, drift, futility drift, game 1's moves, full-material QX − BASE,
batch E's reds, and D5.

## D5, a tuner diagnostic (inner split only; decides nothing)

`raw/probe/tune/patch_tune.py` derives `extract.ts` / `diag5.ts` from `arch-ABC-239`'s prototype (logic unchanged). It
adds three queen-on features (the king's shelter / half-open / open counts while the enemy has a queen), at base value
0, so the identity gate holds unchanged. Data: `arch-ABC-239`'s, exactly: E1 `src/` at `b7a8fc3a`, the 88 PGNs at
`af15cbc9` (the 17 contributing files checked against its `data-files.txt` sha256). Runs:

- **D4r:** D4 (cross-entropy, material frozen, sign-bounded C-S) with the queen terms frozen at 0. This is I2.
- **D5:** the same with the three queen-on pairs free and bounded ≥ 0.
- **Reported:** D5's fitted queen-on pairs, the exposure halves, the king-table scales, and the inner cross-entropy
  against D4r. Own self-play only (no Lichess file is fetched here). The reading is "where a bounded fit puts these
  terms on today's data", not a value to ship.

**Host forecast:** A ≈ 4 min, B ≈ 3 min, C ≈ 4 min, E ≈ 1 min, D5 ≈ 1 min. Every run is ≤ 25 min (the timeout), and
the total is ≤ 30 min, inside the hop's 2 h.
