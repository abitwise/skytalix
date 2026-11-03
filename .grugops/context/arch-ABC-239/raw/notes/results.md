# arch-ABC-239 results: the E2 tuner prototype on own self-play games. G-P1, G-P2 and G-P3 hold, so the verdict is "the loss moves on own games" (0.9863 × E1's outer-validation cross-entropy). But the unconstrained fit is implausible: queen 2 593 / 137. The diagnostics put the cause in the data, not in the loss, and the bounded move left is 0.9960 × on the inner split. The king's tables come out about 3 × under-weighted in every fit

Architect/Design, task `arch-ABC-239`. Rules: PREREG `…9ed1db11`, addenda `…255e9bcf` and `…f8d36d73`, each sealed and
committed before its run. Engine reference: `grugops/ABC-269` `b7a8fc3a` (`src/` tree `4e23078f`), scratch copy. Data:
PGNs tracked at `main` `af15cbc9`. Scripts and outputs: `.grugops/context/arch-ABC-239/raw/proto/` (README). Host time
≈ 1 min in all, under the lock.

## Data (the PREREG's rule)
- **Games:** 5 438 read in 88 files. Dropped: 1 399 for a non-engine player and 608 duplicates. **3 431 kept, from 17
  files and 100 openings.** About half are draws: 49 % of the games, 51 % of the rows.
- **Positions:** 388 632 seen. Dropped: 6 509 book, 15 232 mate score, 28 181 in check, 84 225 noisy. **254 485 rows
  kept.**
- **After de-duplication by key:** 153 165 training and 39 568 validation, from 19 openings. 1 412 validation keys were
  removed because they also occur in training. Inner split: 108 646 / 44 519.
- **Manifest:** sha256 `6e8d0ab0…f040cf` over repository-relative paths (`out/data-files.txt`). The run printed
  `00dc0695…8ec30`, the same manifest over absolute scratch paths.
- 40.2 % of the rows come from openings 1–50 (C2′'s), and 23.9 % from start positions outside `openings.epd` (older
  harness reads).

## Gates and verdict
| gate | bar | read | |
|---|---|---|---|
| G-P1 identity | every row < 1 cp, exact at w = 24 | 0 misses / 254 485; worst 0.958 cp | holds |
| G-P2 K | 0.3–3.0 | 0.585 | holds |
| G-P3 loss moves | chosen rounded set ≤ 0.995 × E1, outer cross-entropy | C-S 0.58342 / E1 0.59153 = **0.9863** | holds |

**Verdict, by the rule: "the loss moves on own games".**

## Choice and the reported figures
- **Inner cross-entropy:** C-S 0.58667; C-F 0.58789 / **0.58748** / 0.58784 at λ 1e-8 / **1e-7** / 1e-6; E1 0.59206.
  **C-S is chosen** (lower, by more than 0.1 %).
- **Outer cross-entropy (MSE):**
  - E1 0.59153 (0.07757);
  - `main` untapered 0.59636 (0.07915), 1.0082 × E1;
  - C-S 0.58342 (0.07533), 0.9863 × (MSE 0.9711 ×);
  - C-F 0.58372 (0.07526), 0.9868 × (MSE 0.9703 ×).
- **Overfit gap:** C-S training 0.9880 × against validation 0.9863 ×; C-F 0.9864 × against 0.9868 ×. None.
- **Determinism:** a second fit run gave byte-identical output, timing fields aside.
- **Host time:** extract 8.5 s; fit 18 s; Newton steps 5–9 per fit.

## The fitted values are implausible (C-S, rounded, mg / eg)
- **Material:** P 103 / 114, N 572 / 246, B 610 / 231, R 905 / 360, **Q 2 593 / 137**. C-F: Q 2 591 / 189.
- **Passed bonus by rank, mg:** 9 12 −25 26 106 208; eg 46 68 87 118 175 229.
- **Other terms:** doubled 2 / 2, isolated 22 / 14, missing shelter 35 / −29, half-open 29 / −16, open file 18 / 36,
  mobility 4 / 11.
- **Relation checks (reported):**
  - C-S breaks: passed mg r3 < r2; shelter eg < 0; half-open eg < 0; minor ≤ 3 pawns in eg (both minors).
  - C-F breaks the same, plus passed mg r2 < r1.

## Diagnostics (inner split only; the outer validation not opened)
| run | loss, material | K | steps | inner CE / MSE against E1 | material (mg / eg) | sign breaks |
|---|---|---|---|---|---|---|
| D1 | squared error, free | 0.6546 | 15 | 0.9882 / 0.9790 | Q **3 470 / −237**, N 483 / 276, R 806 / 373 | passed mg r3, r4, r6; open mg; doubled eg; shelter eg; half eg; both minors eg |
| D2 | cross-entropy, frozen | 0.5912 | 4 | 0.9952 / 0.9941 | classical | passed mg r3; doubled mg / eg; open mg; shelter eg; half eg; mobility eg |
| D3 | squared error, frozen | 0.6546 | 5 | 0.9944 / 0.9879 | classical | passed mg r3, r6; open mg; doubled eg; shelter eg; half eg |
| D4 | cross-entropy, frozen, sign-bounded | 0.5912 | 4 | **0.9960 / 0.9955** | classical | passed mg r3 < r2 (not enforced) |

- **Addendum 1's hypothesis is falsified.** The loss does not cause the inflation (D1 is worse than C-S).
- **D4 values:**
  - passed mg 3 19 0 0 104 116, eg 45 81 84 115 157 241;
  - doubled 0 / 0, isolated 14 / 16, shelter 29 / 0, half-open 0 / 0, open 5 / 19, mobility 8 / 0;
  - PST scales at 0: pawn eg, rook, queen;
  - king tables about 3.6 × (mg) and 2.8 × (eg).

## Readings (Architect's; information)
1. **The cause is the data.** Short-control self-play converts a middlegame queen up almost always, and a pawn or two
   often not, so the fit learns this engine's conversion odds against itself. Those values would wreck trade decisions.
2. **Bounded, own games move the loss about 0.4 %.** Likely near C2′'s ± 48 Elo noise.
3. **The king's square tables are under-weighted against the rules in every fit:** about 3–3.6 × mg and 2.2–2.8 × eg.
   This is consistent with `ABC-270`'s premise.
4. **Loss is not Elo.** Nothing here reads play.
