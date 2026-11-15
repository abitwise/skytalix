# arch-ABC-324 decision: levels 6 and 7 re-projected from measured level 5. **Level 6 (10 s) ~2470–2580, level 7 (30 s) ~2540–2740, projected.** Level 6 is projected above level 5, its whole range above level 5's 95 % upper end (2464.0). This replaces the model of `…152bb16f` / `…d82c4579` for levels 6 and 7

Architect/Design, task `arch-ABC-324`, branch `grugops/arch-ABC-324` from `main` `2366bc1d`, 2026-11-15. Records only: no game, no engine start, no code, no README or CHANGELOG edit. Every figure below is arithmetic on readings already sealed by QE; none is a new measurement. Levels 6 and 7 stay `UNKNOWN - verify` until each is read.

## Inputs (sealed readings, not re-derived here)
- Strength section: level 5 at 0.1 s, X = 1 902.5 ± 49.1 (E 1810), taken as a no-blunder figure as `…152bb16f` took it.
- Level 4, 1 s, rate 5 %: 2 094.3 ± 47.9 (E 2040). Its no-blunder figure, per `…152bb16f`: 2 144–2 164 (blunder cost 10–14 per point, 50–70 at 5 %).
- Level 5, 4 s, rate 0: **2 412.9 ± 51.1** (E 2280; QE `…f1531600`).
- Every ± is `cutechess-cli`'s 95 % interval. Stockfish 19 had the level's own time per move each time.
- Level 6 thinks 10 s and level 7 30 s (`ADR-0045` § AMENDMENT 2026-11-11). From level 5's 4 s that is log2(2.5) = 1.32 doublings to level 6, and log2(3) = 1.58 more to level 7.

## 1. The gain per doubling the readings imply
| Span | Doublings | Elo per doubling (point) | 95 % ± |
|---|---:|---:|---:|
| 0.1 s → 1 s (1 902.5 → L4 no-blunder 2 144–2 164) | 3.32 | +73 to +79 | ± 21 |
| **1 s → 4 s (L4 no-blunder → L5 2 412.9)** | 2.00 | **+125 to +135** | **± 35** |
| 1 s → 4 s, raw (L4 2 094.3 with its blunders → L5) | 2.00 | +159 | ± 35 |
| 0.1 s → 4 s (1 902.5 → 2 412.9; both rate 0, no blunder add-back) | 5.32 | +96 | ± 13 |

- The ± is the two readings' 95 % ± in quadrature, divided by the doublings.
- The 1 → 4 s rate is about +54 a doubling above the rate below 1 s, about 2.6 SE. Engines usually gain *less* per doubling at longer times, so the rise is unusual. It has four candidate causes, and these games cannot separate them:
  1. noise (each rate's 95 % range is wide);
  2. level 4's blunder cost being larger than 50–70 (that would lower the 1 → 4 s rate and raise the 0.1 → 1 s rate, both toward ~96);
  3. a Stockfish time-scale effect (section 2);
  4. the `UCI_Elo` labels' spacing between 2040 and 2280 not matching true Elo against skytalix (a label-scale effect, not a time one; `UNKNOWN - verify`).
- The 0.1 → 4 s rate, +96 ± 13, rests on two rate-0 readings and no blunder add-back. It is the most robust single figure. It still spans the Strength section's older build, which `…152bb16f` already treated as comparable.

## 2. How the Stockfish time-scale effect enters
- **The bias, in symbols.** A reading at time t is R(t) = S(t) − D(t). S is skytalix's strength against a fixed opponent. D is how far Stockfish at the given `UCI_Elo` and time t plays above its label. The measured 1 → 4 s slope is ΔS − ΔD.
  - If D does not change with time, or keeps changing at the same rate, the measured slope is the right one to carry forward to a level 6 reading.
  - If D *fell* between 1 s and 4 s (Stockfish weaker against its label at 4 s) and stops falling, the measured slope over-states what carries on. That is the "it may inflate the slope" reading (cut note `…2bfa1b06`).
  - If D *rose* between 1 s and 4 s and stops rising, the measured slope under-states it.
- **What Stockfish's code says (a code reading, not a measurement).** In Stockfish's `sf_19` tag (`src/search.h`, `src/search.cpp`, read 2026-11-15):
  - `UCI_Elo` maps to `level = clamp(((37.2473 e − 40.8525) e + 22.2943) e − 0.311438, 0, 19)`, with e = (Elo − 1320) / 1870. That gives level 4.34 at E 2040 and 5.41 at E 2280.
  - `time_to_pick(depth)` is `depth == 1 + int(level)`. So Stockfish picks its handicapped move once, among MultiPV 4, at root depth 5 (against level 4) or 6 (against level 5). The end of the search plays that pick (`skill.best`). The rest of the time is spent searching, but it does not change the move played.
  - Depth 5–6 is reached far inside 0.1 s. So on this reading, Stockfish's handicapped play is about the same at 0.1, 1, 4, 10 and 30 s, and D barely moves with time.
  - This favours the "all skytalix" reading of the 1 → 4 s step. It is `UNKNOWN - verify` for the binary the harness ran: no record here shows the depth Stockfish reached or its build tag.
- **The ranges still cover the "part Stockfish" reading,** as the cut note asks. In that extreme, the excess over the sub-1 s rate (about +50–60 a doubling) is Stockfish's, and skytalix's own 1 → 4 s rate is about +73–79. With diminishing returns past 4 s, that becomes about +50 to +75. The bottom ends below use that.
- Cause 4 (the label scale) does not repeat in the same way. Level 6 would read at a new E, not at 2280. It is one reason the top end is not raised above the measured rate.

## 3. The model
- **Anchor:** level 5's measured point, 2 412.9 at 4 s. Its own ± 51.1 is not added, as `…152bb16f` added no padding beyond the anchor's range. Each end could move by up to ± 51 with the anchor.
- **4 s → 10 s (level 6): +50 to +125 a doubling.**
  - Top, the "all skytalix" reading: the lower end of the measured +125 to +135, held flat. It is not raised, as the diminishing-returns hedge, the same rule `…152bb16f` used (+75 against a measured +73–79).
  - Bottom, the "part Stockfish" reading: +50, the old model's floor, below the sub-1 s +73–79.
  - The robust +96 sits inside the range.
- **10 s → 30 s (level 7): +40 to +100 a doubling.** That is both ends of the level 6 step cut by one fifth, for diminishing returns at long times.
  - A rough check: `ADR-0045` § Context's Heinz figures fall 9–20 % a ply (+115, +92, +84). At skytalix's 2.67x per ply, the middle of 10 → 30 s (17 s) sits about 1 ply past the middle of 4 → 10 s (6.3 s), which gives a cut of about 10–20 %. One fifth is at the cautious end. The cut is an assumption (`UNKNOWN - verify`).
- **Rounded outward to tens, with no other padding:**
  - **Level 6:** 2 412.9 + 1.322 × (50 … 125) = 2 479.0 … 2 578.1, so **~2470–2580**. That is +66 to +165 over level 5.
  - **Level 7:** level 6's ends + 1.585 × (40 … 100) = 2 542.4 … 2 736.6, so **~2540–2740**. That is +63 to +159 over level 6, and +130 to +324 over level 5.
  - Without the one-fifth cut, level 7 would read 2 558–2 776. The cut moves it by 16–40.
- **Against the old projections:** level 6 was ~2310–2410 (`ADR-0045`) or ~2310–2420 (README). Level 7 was ~2380–2540. Both rested on the model that put level 5 93–173 too low. The new level 6 range starts about 50–60 above where the old one ended.

## 4. Is level 6 above level 5?
- **Yes, the whole projected range.** Its bottom (2 479) is above level 5's figure (2 412.9) and above its 95 % upper end (2 464.0).
- **That level 6 is stronger than level 5: high confidence.** It is the same engine at the same rate 0, with 2.5x the time. Per the code reading in section 2, Stockfish's handicap does not get stronger with time either. Every measured step so far (0.1 → 1 → 4 s) gained.
- **The size: medium confidence.** If the true gain is only +66 (the bottom), a 200-game level 6 reading would still fall below level 5's reading only about 4 % of the time. The difference of two readings has an SE of about 37, so +66 is about 1.8 SE. Above a true gain of about +80 it falls under 2 %.
- **Level 7 above level 6:** projected +63 to +159 by time alone. Confidence: medium-low (two assumed steps and a 30 s extrapolation).

## 5. For the SE (`se-ABC-324`): exact README cells and text
- **Levels table, Strength row:**
  - level 5: `2413 ± 51, measured` (QE `…f1531600`);
  - level 6: `~2470–2580, projected`;
  - level 7: `~2540–2740, projected`.
- **Intro line:** "… a strength, measured for levels 1 to 5 and projected for 6 and 7:".
- **This paragraph replaces the whole "Levels 5 to 7 do not blunder, …" paragraph,** in three sentences:

  > Levels 6 and 7 do not blunder, and their figures are projections, not measurements. They start from level 5's measured 2413 at 4 s a move, without its ± 51, and add about +50 to +125 Elo for each doubling of time up to 10 s, then about +40 to +100 a doubling up to 30 s, because the gain is expected to fall at longer times. The top follows the step from level 4 to level 5, about +125 to +135 a doubling once level 4's blunder cost is added back; the bottom is below the +73 to +79 a doubling measured under 1 s, in case part of that step was Stockfish's (see below).

- **Unchanged:** the measured-levels paragraph and the Stockfish-time paragraph take QE `…f1531600`'s recommended wording as written. The "see below" points at its Stockfish paragraph, which must stay directly after.
- **Optional, the SE's and QE's call:** one sentence after QE's Stockfish paragraph:

  > In Stockfish's code, its limited-strength move is chosen at a fixed shallow search depth, so its extra time should change little.

  It is a code reading, not a measurement. Leave it out if the docs hop prefers measured statements only.
- **CHANGELOG `[Unreleased]`, one line beside QE's level 5 line:**

  > Levels 6 and 7's projected strength is re-derived from level 5's measured figure: about 2470–2580 and 2540–2740 (was about 2310–2420 and 2380–2540). Both are projections, not measurements.

## 6. Records
- **`ADR-0045` is amended,** because it records projection figures:
  - A1's 2026-11-11 resolution line (level 6 "~2310–2410, about +65–100 over level 5");
  - § AMENDMENT 2026-11-11 § Why (the projection, "+16–24", "~2310–2410, about +65–100", "Every level 5–7 figure is projected").
  - Dated lines go under each, with a § Status blockquote and a new § AMENDMENT 2026-11-15 at the end. Additions only; no old text changed. No decision moves: no budget, rate, ceiling, default or ordering.
- **`ADR-0044` and `ADR-0052`:** a grep finds no projected-Elo figure in them. Not amended.
- **Routed to the Orchestrator, not edited:**
  - `memory-bank/60-progress.md` still quotes the old projections: line 954, "L5 ~2240–2320, L6 ~2260–2340, L7 ~2390–2540"; and the § Next action, "~2 310–2 420" and "~2 380–2 540".
  - The parked L5–L7 plan (line 967) says "projected 70–120 gaps between L5, L6 and L7". They are now +66 to +165 (L5 → L6) and +63 to +159 (L6 → L7). Its rejection of 100-game runs (± 70) still holds.
  - If level 6 is ever read, the new range's middle (about 2530) is the natural first E, under the band rule. It is the PREREG's to fix.

## Open (`UNKNOWN - verify`)
- Stockfish's real depth and build in the harness, and whether D moves with time.
- The `UCI_Elo` label spacing against skytalix.
- Level 4's true blunder cost.
- The diminishing-returns cut at 10 → 30 s.
- Levels 6 and 7 themselves.
