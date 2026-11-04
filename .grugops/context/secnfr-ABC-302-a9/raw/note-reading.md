# Security/NFR observation, secnfr-ABC-302-a9: QE's graded A8 against `R-N8H-1`'s marks. H's median **9.505 s** is on the upper side of 9.5 s by 0.005 s; headroom is 0.495 s on the median and 0.45 s at the interval top, both inside the 0.3–0.5 s spread. The reading holds for `main` as merged. Below it, the arithmetic for the lane budgets

Records only. Nothing was run or timed. Every timing is QE's (`qe-ABC-302`) or an earlier sealed reading, cited. Reads made here, none a test run: `git diff`, `find` and `grep`, and the census file `secnfr-nfr008-1104/raw/out/census-H.txt`.

## Inputs
- **QE A8, graded** (`…09d75ba8`, PREREG `…82650a68`, verdict `…051a910d`). n 8, k 2, B / H / H2, one lock hold, ALONE.
  - H (`a5651cbf`): **9.505 s** [9.39, 9.55], max 9.62 s. H2: 9.48 s [9.41, 9.59], max 9.63 s.
  - B (`bff22046`): 9.87 s [9.83, 9.93].
  - H − B: −0.38 s wall [−0.47, −0.32], 0 of 8 positive. Twin admissible (+0.17 % CPU; wall median +0.025 s, R 0.13 s).
- **Does it hold for `main`?** Yes. `git diff --name-only a5651cbf main -- src tools package.json package-lock.json vitest.config.ts tsconfig.json AGENTS.md` is empty at `main` `6d9ce1d7`.
- **Security surface.** `git diff bff22046 ec4edd92` has 0 production `src/` lines, and 8 `*.test.ts` files under `src/`. A `grep` of its added lines for spawn, exec, file, fetch, eval and environment reads finds one line: `ENGINE_DEEP` read as a test gate in `src/engine.capacity.test.ts`, the same form as every deep lane.

## Against the marks
| mark | H 9.505 s | margin |
| --- | --- | --- |
| closes at ≤ 9.0 s | not reached | +0.505 s |
| LOW needs < 9.5 s | **not met** | +0.005 s |
| `Q-N8H-1` line, ≥ 9.6 s | not reached | −0.095 s |
| `NFR-008` W, 10 s | MET | −0.495 s |

- The 0.005 s is half of the timer's 0.01 s step, and the interval contains 9.5 s. So the reading cannot separate H from 9.5 s (QE's INFO). It also cannot put H under it. H2 read 9.48 s, but a twin grades nothing (`ADR-0035` D1).
- **Headroom:** 0.495 s on the median and 0.45 s at the interval top. The 2026-11-04 condition for LOW was headroom above the 0.3–0.5 s spread (`secnfr-ABC-281-a9` `…2e3b747f`). The median is 0.005 s short of the top of that spread, and the interval top is 0.05 s short.

## The window was not slow
`git diff --name-only fd6b595f bff22046` over the lane inputs is empty, so one tree has now been read four times today: 9.84 s (`…4e87dae2`), 9.82 s (probe H, `…e2c442d3`), 9.87 s (QE's B) and 9.90 s (the SE's ungraded base). That is 0.08 s end to end. `…1184fec4` said its 9.84 s window ran about 0.15 s slow and that `main` would read about 9.7 s on QE's window. QE's window read that tree at 9.87 s, so no slow-window credit is due, either to that estimate or to this reading.

## Rate of return, measured
- ABC-302 moved 848 ms of in-thread time net (948 − 100; `arch-ABC-302` `…8c8cfeed`) and returned −0.38 s of wall. That is **0.45 s of wall per in-thread second**, across a mix of rows.
- The probe read about 0.41 off the critical path and about 1.0 for the two P2 rows (`…e2c442d3`).
- **The forecast realised 76 %** (−0.38 of −0.50 s).

## What the budget instrument can read
| quantity | value | source |
| --- | --- | --- |
| H − B interval width, k = 2 | 0.15 s, twice | `…09d75ba8` [−0.47, −0.32]; `…4e87dae2` [+0.22, +0.37] |
| twin wall median, identical trees | +0.025 s, −0.035 s | `…09d75ba8`, `…4e87dae2` |
| twin wall R | 0.13 s, 0.19 s | same |
| one tree, four reads | 0.08 s end to end | above |

## Budget arithmetic, from 9.505 s
Room under the line: **0.095 s**, for both tickets together.

| ABC-282 + ABC-301 | lands | against 9.6 s |
| --- | --- | --- |
| +0.10 alone, the first merge at full budget | 9.605 s | on the ≥ side, by 0.005 s |
| +0.10 + +0.10 (today's budgets) | 9.705 s | over by 0.105 s |
| +0.05 + +0.05 | 9.605 s | still on the ≥ side |
| +0.04 + +0.04 | 9.585 s | under by 0.015 s |

| adding bundle 1 (ABC-286 + ABC-288) to 9.705 s | lands |
| --- | --- |
| +0.10 s for the bundle | 9.805 s |
| +0.14 s, ABC-283's measured cost, also a bundle | 9.845 s |
| +0.30 s, two tickets at about +0.15 s each | 10.005 s |

**Forecast cost of the two tickets, on the record** (`…1184fec4`): ABC-282 +0.05–0.15 s; ABC-301 about +0.15 s, ABC-271-shaped. ABC-271's cost included a new test file, at about 0.1 s of start-up (`R-N8H-3`), and ABC-301 may not add one, so its figure may run lower. That is an inference, not a reading.

**What ABC-286 and ABC-288 carry today:** only "`NFR-008` ≤ 10 s", units in the default lane (§ NFR triggers on each page). Neither has a budget.

## What rows are left
From the pre-ABC-302 census, with the nine moved rows removed. There is no census of `main` after ABC-302.
- **Under the probe's candidate rule (`…39f73707`): none.** Every other row ≥ 60 ms is a bar row, a fine-step time row, a default slice, or in a file the rule excludes.
- **Outside that rule, leads only.** Each needs a gate in its own file, as R9 got (`…bcadd41d` option (ii): no `AGENTS.md` line), and the Architect's kill parity:

| rows | in-thread | return | forecast | at 76 % |
| --- | ---: | ---: | ---: | ---: |
| `src/cli.test.ts`: ABC-101 A8′ 109, ABC-241 A4 legal-ep 62, A7 56 | 227 ms | about 1.0 | −0.20 s | −0.15 s |
| `tools/grugops/qe-hop-integrity.test.ts`: 176, 89, 66 | 331 ms | about 0.41 | −0.12 s | −0.09 s |
| `src/history-pane.nfr.test.ts` A11 | 94 ms | about 0.41 | −0.03 s | −0.03 s |
| **all** | 652 ms | | **−0.35 s** | **−0.27 s** |

Forecasts are in-thread × return × ABC-302's 89 %. `UNKNOWN - verify`: whether `src/cli.test.ts`'s worker is still the critical path after R8 left it, whether these rows can move at parity at all, and what remnants they need. `src/cli.test.ts`'s spawned children are not in this list (`…1184fec4` keeps them).

## The other entries
- **`R-N8H-2`:** 5 254 note files at `main` `6d9ce1d7` (`find .grugops/context -path '*/notes/*.md' | wc -l`), 246 short of `T-QEHOP-GROWTH`'s 5 500. It was 5 210 at `fd6b595f`. `qe-hop-integrity.test.ts` reads the real notes, so this lane cost grows with the record.
- **`R-N8H-3`:** applied at ABC-302: 71 files at base and tip (QE A3).
- **`R-302-a`:** closed by Architect/Design at row 10.
- **`Q-N8H-1`:** answered by the owner, `orch-2026-10-30a` `…3b15b361` item 1.
