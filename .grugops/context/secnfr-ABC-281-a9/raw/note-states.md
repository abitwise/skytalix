# Security/NFR observation, secnfr-ABC-281-a9: the risk states on QE's graded A8. Headroom on `NFR-008` is now 0.58 s on H's median (0.49 s at the interval top), against a 0.3–0.5 s window spread. The reading holds for `main` as merged, because no lane input changed after `ea08d7b6`

Records only. Nothing was run or timed at this hop. Every figure is QE's (`qe-ABC-281`) or an earlier Security/NFR reading, cited. Two reads were made here, both with no test run: a `git diff` and a file count.

## Inputs
- **QE A8, graded** (`qe-ABC-281` `…c7e298cd`, PREREG `…b3d88219`). n 8, k 2, B / H / H2 twin, one lock hold, ALONE, load1 1.29–3.42.
  - H (`ea08d7b6`): **9.42 s** median wall, interval [9.33, 9.51], max 9.63 s.
  - B (`748d4fa3`): 9.90 s. H2: 9.47 s, max 9.62 s.
  - H − B: −0.37 s wall (0 of 8 positive) and −0.78 s CPU. The twin is admissible (+0.51 % CPU, wall R 0.07 s).
- **The risk as raised** (`secnfr-nfr008-headroom` `…8a4fb936`, readings `…f925027f`). Headroom was 0.10–0.23 s on `main`'s median, smaller than the 0.3–0.5 s spread between windows. The lane was 9.25 s at `ABC-244` (2026-10-30) and about 9.79 s at `main` `08843504` (2026-11-04), so it grew about 0.5 s across windows in five days.
- **Does the reading hold for merged `main`?** Read here: `git diff --name-only ea08d7b6 main -- src tools package.json package-lock.json vitest.config.ts tsconfig.json` is **empty** at `main` `ebd1263f` (merge `983d16c3`). So the graded figure is `main`'s figure until the next merge that changes a lane input.
- **Note store:** 5 087 note files under `.grugops/context/*/notes/` at `ebd1263f`, counted here. It was 5 064 at `…f925027f`.

## Headroom against the spread
| quantity | value |
| --- | --- |
| headroom on H's median (10.00 − 9.42) | **0.58 s** |
| headroom at the interval top (10.00 − 9.51) | 0.49 s |
| window-to-window spread (`…f925027f`) | 0.3–0.5 s |
| margin of median headroom over the spread | 0.08–0.28 s |
| lane growth 2026-10-30 → 2026-11-04, across windows | ≈ +0.5 s |
| single runs at or above 9.6 s in A8 | 2 (H 9.63 s, H2 9.62 s, both in round 8) |

## What each risk reads now
- **`R-N8H-1`.** The condition it was raised on, "headroom smaller than the window spread", **no longer holds on the median**. At the interval's upper end it is level with the top of the spread. One merge that adds lane cost on the scale of the last five days would bring that condition back.
- **`R-N8H-2`.** Unchanged. `ABC-281` did not touch `tools/grugops/qe-hop-integrity.test.ts`. There are 5 087 note files, 413 short of `T-QEHOP-GROWTH`'s 5 500 re-arm point.
- **`R-N8H-3`.** Unchanged. `ABC-281` applied it: no new test file (QE A1).
- **`R-281-a`.** As QE carried it (`…960d38ff`). The breadth now runs only under a `*_DEEP` flag:
  - R1: readings 4–24 other than 8 and 10, plus the shipped `chooseMove` sweep (`SEARCH_DEEP`);
  - R2: 33 of the 36 positions (`ENGINE_DEEP`);
  - R3: four more seeds and 20 more moves (`ENGINE_DEEP`).

  No frozen mutant has its only killer in that breadth (A6, 5 of 5). **How often `SEARCH_DEEP` or `ENGINE_DEEP` lanes are run is `UNKNOWN - verify`.** No `npm run` script runs one (`AGENTS.md`). `grep` finds no rule for deep-lane run frequency in `AGENTS.md`, `memory-bank/45-standing-rulings.md` or `memory-bank/40-contributing.md`.
- **`Q-N8H-1`.** Its trigger is a median ≥ 9.6 s. That is **not met** at 9.42 s.
