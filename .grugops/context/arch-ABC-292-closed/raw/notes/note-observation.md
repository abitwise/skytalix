# arch-ABC-292-closed readings: nothing of `ABC-292` is on `main`; the cut is read value-identical to `main` on 28 400 positions and its cost is unread; the records' figures behind the options read, each with its source

Architect/Design, task `arch-ABC-292-closed`, records only, on `grugops/arch-ABC-292-closed` from `main` `6b8dd230`. **Nothing was run:** no test, build, engine, probe or game. Every line below is read from git, from a sealed note, from a raw file under a task's `raw/`, or from an ADR or page on `main`.

## What reached `main`
- `main` `6b8dd230` has `src/` tree `bba42fb7`, the probe's own tree (`…d277788e`). No path under `src/`, `tools/` or `package.json` differs between `3cbf5374` and `6b8dd230`.
- No `pieceTerms` and no `BISHOP_PAIR` under `src/` or `tools/`. No build branch for `ABC-292` exists.
- `ADR-0071` holds no line naming `ABC-292`, so no pin line lapses there.
- QE's freeze (`e88e91f9`) is records only, under `qe-ABC-292-freeze`'s `raw/`. No row in `src/` moved.

## d6's cut, from the probe's own files
- `raw/scripts/pr4c.ts` of `arch-ABC-292-probe` compares, per position: (c) `main`'s `evaluate` against `cand`'s off evaluation at its phase (`offBad`); (d) `cut` against `cand` on six entries, among them the off evaluation (`cutBad`).
- `raw/out/B-PR4-cross.out`: `offBad` 0 and `cutBad` 0 on `G3` 184, the taper mirror 30, the taper door 176, the frozen 114 and the games' 27 896. **So the cut's off evaluation equals `main`'s `evaluate` on 28 400 positions, by two exact reads.** That is the cut beside the term's walk, not a patch made on `main` alone, which no one has read.
- PR8, the cut's cost, did not run (`…22e36b63`). d6's −5 to −10 % a call and 1 to 3 Elo stay estimates. The method that made them read low by about four on `ABC-291` (`ADR-0076` d6).

## The figures the options read uses
| what | figure | source |
|---|---|---|
| Last outside reading of `main`, 100 ms | R1: 99.0 of 200 against Stockfish 19 at E 1 810, X ≈ 1 806 ± 47 | board, `ABC-273` Done line |
| Value-changing merges since R1 | `ABC-279` Q1 54.0; `ABC-283` 66.0 (+115.2 ± 67.0); `ABC-303` bundle 1 55.5; `ABC-282` W1 (clock mode only) | board Done lines |
| S′ pool at 0.5 s | 27.5 of 40 at E 1 810, X = +137.0 | `ADR-0056` D5's dated line of `arch-records-1106` |
| Search-side C2′ reads in `EPIC-011` | P3 58.0, Q1 54.0, `ABC-283` 66.0, bundle 1 55.5 passed; P2 44.0 missed. 4 of 5 | board; `ADR-0056` D2 |
| Evaluation-side reads | E1 57.0 passed. E3a and E4a rule values missed rows, landed at 0. E4b 46.0. E5 missed at probe. Two tuning pulls missed on `zugzwang.001`, four fitted tables of four | `ADR-0056` D2; `ADR-0067`; `…e5a5ac0c` |
| What a C2′ pass means | true +20 passes 79 %, 0 passes 50 %, −20 passes 21 % | `ADR-0076` d12 |
| P1 (`ABC-284`) | two probes, 13 forms, none met every bar. Every joint form lost `zugzwang.004` at d11 and drifted 69 cp against the 27 cp cap. No probe on today's `main`, which since has E1, history, SEE ordering, aspiration, M3, the countermove and Q1. Estimate +40–100, the capped form nearer the low end | `ADR-0060` § Status; `ABC-284` |
| P5 (`ABC-285`) | ≈ 0 at 100 ms (0.88–0.95 ×, +0.06 ply); needs a deep-depth bar | `ABC-285` |
| P6 (`ABC-287`) | held until a tuned table is on `main`; that may never come | `ABC-287` |
| T1 + T3 (`ABC-257`) | paused; premise 0.904 × over searches 2–9 at depth 8, on a 2026-11-02 base; bar ≤ 0.93 × | `EPIC-011` Phase 1 rows |
| X1, X2, V3 (`ABC-296`–`ABC-298`) | unprobed. +10–30, +20–50 (high risk), +10–30, estimates | `ADR-0056` D2 |
| Threads (`ABC-266`) | parked by him. At 100 ms plain pools ran in lockstep, depth 7 = 7; the one form that added a ply lost 1.7–2 of 20 on quality. Re-open: a ~30 min re-probe he funds | `ABC-266` |
| A third tuning pull | no form passes the four tests today; about 20 min of host to the row, then B-T7 about 0.7 h and B-T8 about 5 h; a miss closes tuning | `…e5a5ac0c`; `ADR-0067` |
| E4a's structure at 0 | 1.12 × per-call cost in endgames, paid for no value while tuning waits | `ADR-0067`'s wait block |
| A term's host time end to end | probe under 30 min (this one under 1 min); timing 14–27 min and games 41–48 min, each hold under 1 h | `ADR-0076` § Consequences, d13 |
| R2 (`ABC-295`) | 200 games at 100 ms against Stockfish, about 0.4–0.9 h | `ADR-0056` D6's R1 shape |
| The 3 000 case | "needs essentially all of D2, a tuned evaluation … and very likely a speed step beyond O1"; landing 2 550–2 800 on R's scale, now lower by an unread amount | `ADR-0056` D3; D2's dated line of 2026-11-05 |

## What these readings do not say
- Whether the cut is faster. Whether any held search ticket would pay. Where `main` stands today at any control: no outside reading since R1.
- Any estimate above is not a reading. Gains do not add (`ADR-0056` D2).
