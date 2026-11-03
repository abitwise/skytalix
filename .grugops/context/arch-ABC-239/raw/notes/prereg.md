# arch-ABC-239 PREREG: the E2 tuner prototype (logistic fit of game results against a two-half linear evaluation) on this project's own self-play games: data rule, model, identity gate, K fit, two configurations, the choice rule, the bars and the verdict rule, sealed and committed before any measured run

Architect/Design, task `arch-ABC-239`, on `grugops/arch-ABC-239` from `main` `af15cbc9`. Inputs: brief `.grugops/queue/claimed/arch-ABC-239.md` (Orchestrator, 2026-11-03T10:17:03Z); `plans/tickets/ABC-239-…md` (A1–A6); `ADR-0048`; `ADR-0064` (d4 the parameter table, d6 "the two-accumulator form is E2's"); `ADR-0056` (row E2, Q-3K-7, C2′, Q-3K-4 = (b)); `bapm-epic011-cut` `…08584853` / `…0fd882f7` (22 duplicated positions in the probe set); `grugops/ABC-269` at `b7a8fc3a` (E1 built, not merged; `src/` tree `4e23078f`). **No measured run has been made in this hop.**

This is a prototype under the width cap (each run ≤ 30 min, hop ≤ 2 h host). It shows whether the pipeline works and whether the loss moves. It grades nothing in play and moves no bar of `ABC-239` or `ADR-0056`. Its result feeds `ADR-0067`'s data and free-set decisions only.

## Instrument
- **Engine reference:** `git archive grugops/ABC-269 src package.json` into the hop scratch (outside the repository; deleted after). It is E1's tapered `evaluate` and its `src/evaluate-params.ts`, the table E2 rewrites. Scratch scripts import it read-only. Nothing is written to `src/` or `tools/`.
- **Data (A1: own games, allowed by default):** every game in the PGN files tracked at `main` `af15cbc9` (`git ls-files '*.pgn'`, 88 files) whose `White` and `Black` tags are both in {`skytalix`, `base`}, i.e. this engine against a build of itself. Excluded and counted: any game with `stockfish` or any other player (the owner's UAT game included), and any game with result `*`. The set hash is sha256 over the sorted lines `<path> <sha256 of file>` of the files that contribute.
- **Game de-duplication:** key = start FEN + the SAN move list. A repeated key is dropped (bapm found games n and n + 200 replaying each other).
- **Position rule:** a position is a candidate when the move played from it carries an engine comment (a book move carries none), the comment is not a mate score (`M` in it), and the side to move is not in check. **Quiet filter:** `quiesce(position, −∞, +∞, 0, 0, {evasions, quietPromotions, taper: true})` equals `evaluate(position)`. Label = the game's result from White's side (1, ½, 0).
- **Position de-duplication:** key = the FEN's first four fields. Repeats merge into one row whose label is the mean of their labels.
- **Split (A2: training and validation share no game):** by the game's start FEN (the opening). Opening goes to validation when fnv1a32("ABC-239/split/v1\n" + FEN) mod 5 = 0, else training. A position key that occurs in both sets is removed from validation. **Inner split** (for every choice below; the outer validation is read only for the reported numbers): a training opening goes to inner-validation when fnv1a32("ABC-239/inner/v1\n" + FEN) mod 4 = 0.

## Model (the E2 target form: every term a middlegame and an endgame half)
- eval_white(θ) = (w/24)·[c·θ_mg + clamp(W_mg·m, ±100)] + ((24 − w)/24)·[c·θ_eg + clamp(W_eg·m, ±100)], w = min(24, Σ N 1, B 1, R 2, Q 4).
- c = white-minus-black counts per term, traced by a scratch re-implementation of `src/evaluate.ts`'s walk: material (P N B R Q), the six PSTs by table index, passed pawns by own rank 1–6, doubled, isolated, missing shelter, half-open and open king files; m = net squares reached. `MOBILITY_CAP` (100) and `PHASE_WEIGHT` stay fixed (not free).
- **Gate G-P1, identity (pipeline correctness):** for every extracted position, |eval_white(θ_E1) − engine `evaluate` from White's side| < 1 cp, and exactly equal where w = 24. One miss is a pipeline defect: no fit is reported, the defect is fixed and the gate re-read.
- **Base sets:** θ_E1 = `grugops/ABC-269`'s `evaluate-params.ts`; θ_main = the same with every endgame half equal to its middlegame half (= `main`'s untapered evaluation, `ADR-0064` B1 (c)).

## Fit
- σ(e) = 1 / (1 + 10^(−K·e/400)). **K** minimises the primary loss of θ_E1 on the training set (golden section on [0.1, 5], 60 steps), then is fixed.
- **Primary loss: mean cross-entropy** of σ(eval_white) against the label. Reported beside it: mean squared error (Texel's).
- **Optimiser:** Newton steps on the full training set (gradient and Hessian exact for the linear part; the mobility clamp by its active set), a backtracking line search, start θ_E1, stop when the relative loss change < 1e-9 or 50 steps. No randomness, so no seed beyond the split strings.
- **Configuration C-S (46 free):** material mg/eg (10), passed by rank mg/eg (12), doubled and isolated mg/eg (4), the three king terms mg/eg (6), the mobility weight mg/eg (2), and one scale per PST per half (12) on E1's rule-made table shape. No regulariser.
- **Configuration C-F (402 free):** C-S's 34 scalars plus every PST cell per half, tied left-right (file a = h, b = g, c = f, d = e: 32 cells per table per half; the pawn's ranks 1 and 8 fixed at 0), with an L2 pull toward θ_E1 on the cells, λ from {1e-8, 1e-7, 1e-6} per cp² chosen on inner-validation.
- **Choice rule:** the configuration with the lower inner-validation loss (each refitted on the inner-training part); a difference under 0.1 % relative goes to C-S. The chosen one is refitted on the whole training set.
- **Integer emission:** round half away from zero. Every reported "fitted" figure is the rounded set's.

## Bars (prototype only; read on the outer validation)
- **G-P1** as above (hard; a defect, not a result).
- **G-P2, K sane:** 0.3 ≤ K ≤ 3.0. Outside it the fit is not reported; the data is examined.
- **G-P3, the loss moves (this prototype's premise):** the chosen configuration's rounded set has outer-validation cross-entropy ≤ **0.995 ×** θ_E1's on the same rows (≥ 0.5 % relative improvement).
- **Reported, not graded:** both configurations' outer-validation losses; θ_main's; training-loss improvement against validation improvement (the overfit gap); positions, games and openings kept and dropped at each step; the relation checks a tuned set must also pass later (passed bonus non-decreasing by rank per half; penalties ≥ 0; W ≥ 0; a minor > 3 pawns per half; 2 × doubled-file cost ≤ 50 cp as `ABC-082` A2 reads it); per-run host time.

## Verdict rule
- G-P1 and G-P2 hold and G-P3 holds: "the loss moves on own games"; `ADR-0067` keeps own games as an allowed first-pull source, and the free set is the chosen configuration's.
- G-P3 misses: "the loss does not move on own games at this size"; `ADR-0067` records that the build needs more or broader data before a fit (the owner's Q-3K-7), and the prototype's numbers stand as found. No bar is re-cut and no configuration is added after the data is seen.
- A loss figure is not an Elo figure. Only `ABC-239` A6 (C2′, S′, the Levels lane) reads play.
