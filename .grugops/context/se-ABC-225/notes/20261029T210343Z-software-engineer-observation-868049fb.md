---
id: 20261029T210343Z-software-engineer-observation-868049fb
kind: observation
by: software-engineer
at: 2026-10-29T21:03:43Z
verified_by: 
confidence: high: every check and gate run as stated at 83751dc0; stub tools only, no game
refs:
  - ABC-225
  - EPIC-010
  - EPIC-008
  - tools/rating/rating.ts
  - tools/rating/pair.ts
  - tools/rating/pair-check.ts
  - grugops/ABC-225
  - 83751dc0
  - arch-epic008-rd/20261029T195200Z-architect-design-decision-0c5d62f4
  - arch-epic008-rd/20261029T195200Z-architect-design-observation-9d172446
  - bapm-owner-words-b/20261029T204500Z-ba-pm-decision-2930f1bd
  - se-tools-rating-concurrency/20261029T081027Z-software-engineer-observation-58723347
  - ADR-0049
  - NFR-008
supersedes: 
seal: sha256:5b5a034afcd1334ef3018b0812b3b0b1034fe6d4e23736d4cdbc3b286010a32f
---

# SE observation, se-ABC-225: A1–A4 evidence, r/d byte-identity, gates (no game played)

At `grugops/ABC-225` `83751dc0`. No `cutechess-cli` and no Stockfish ran: stubs only, in session scratch. Paths below are placeholders.

## Offline checks: `node --test tools/rating/pair-check.ts` → 22 tests, 22 pass, 0 fail, 0 skipped (5 suites, ≈ 3.4 s)
- **A1 (same pins as `r`).** `rpair <HEAD~1> <HEAD> <out> --dry-run` against `r <sha> <out>/<build> --elo 1910 --dry-run`, for all 20 block-runs. Drop the one added token `start=S` (asserted to sit right after `order=sequential`). The argv then differs from `r`'s in exactly 4 positions: the two `stderr=` paths, `-rounds` 100 → 10 and the `-pgnout` path (`<out>/<build>/…` → `<out>/<build>/bNN/…`). The pins are asserted present: `option.UCI_Elo=1910`, `UCI_LimitStrength=true`, `st=3 timemargin=2000`, `st=0.5 timemargin=2000`, `-repeat -games 2`, `-concurrency 2`. The dry run writes nothing (out-dir absent after).
- **A2 (interleaving).** The schedule has 10 blocks of 10 openings, ordered base/candidate, candidate/base, … The union is openings 1–100 exactly once per build, and each run is `-repeat -games 2` (both colours). The dry-run print shows `block 01 openings 1-10: base, then candidate` … `block 10 openings 91-100: candidate, then base`, and the runs in ABBA order. Bad values exit 1 naming the argument, with no out-dir made: `HEAD`, `ABCDEF0`, `abc;true` (sha), `--rounds 15`, `--rounds 110`, `--concurrency 9`, `--elo 1000`, `--budget-ms`.
- **A3 (arithmetic, records `qe-epic008-close` r1/r2).** The pair from the two recorded `Elo difference` lines reads **−82.9 ± 73.8**. The pentanomial from the two PGNs reads **−82.9 ± 64.3** (100 openings). The formula reproduces 4 recorded cutechess lines to the digit. With r1 and r2 split into 10 blocks each and run through `readBuild` + `pairSummary`, the output is `188.5 +/- 54.8`, `pair … = -82.9 ± 73.8`, `pair state: LOSS`, `pentanomial … -82.9 ± 64.3 (95 %, 100 openings`. `stockfishNps` on r1/r2 gives 1 643 068 / 1 623 258, an3's values. r1's games pass the coverage check for openings 1–100.
- **A4 (faults).** Fixture blocks on disk run through the real `summarise`, then `readBuild` / `pairSummary`. A clean pair reads `rating E + X ± Y`. One block with an illegal move, a disconnect, a `connection stalls`, a loss on time, or a watchdog stop: that build is UNRESOLVED and `pair state: UNRESOLVED`. A block never played (halted) reads `blocks: 1 of 2 played`.

## End to end through the real harness, stub tools (no game)
The stub `cutechess-cli` records its argv and replays r1 (base) / r2 (candidate) sliced to the block's openings, with a cutechess-format `Elo difference` line from an independent Python copy of the formula. The stub Stockfish answers `uci` only. The harness really cloned and built both shas (`npm ci`, `npm run build`).
- `rpair 8eb8a4f9 efbb4fc7` exit 0, ≈ 6 s. 20 stub calls in ABBA order, starts 1, 11, …, 91. `summary.txt`: base `188.5 +/- 54.8`, candidate `105.6 +/- 49.5`, `pair … = -82.9 ± 73.8`, `pair state: LOSS`, pentanomial `-82.9 ± 64.3 (95 %, 100 openings, r = 0.205)` (an1: corr 0.205). `nps.log` 20 lines. `thermal.log` 2 samples (run shorter than 10 s). Block 10 base prints `301.3 +/- nan` (μ + 1.96σ > 1), and the formula check agrees (`nan`).
- A first stub run crashed in block 10 on that `nan` case (Python `log10` of a negative). The harness reported it correctly as `cutechess-cli exited 1`, UNRESOLVED and halted. The stub was fixed to C++'s NaN behaviour and re-run.
- **Fault injection** (candidate block 2, game 3 `White loses on time`): exit 0. It halted after `block 02 candidate`: 3 runs, not 20. Candidate UNRESOLVED (`fault in game 3`, `blocks: 2 of 10 played`), base UNRESOLVED (`blocks: 1 of 10 played`), `pair state: UNRESOLVED`.
- **Dry run = real argv:** for all 20 block-runs, the dry-run argv (placeholders mapped back) equals the argv the stub received, byte for byte. Same for `r` (39 args).
- **Host paths:** 153 record files under `<out>`, clones excluded, contain none of `/home/`, `/tmp/`, `/usr/`, `.nvm`, the login name or the host name (case-sensitive). `SHA256SUMS` verifies (152 files, 0 under `clone-*`). The one case-insensitive hit of the login name is `artifacts.txt`'s engine line `id author Olger Oeselg`, which `r` writes too (see the QE note).

## `r` and `d` defaults: byte-identical to `main`
`main`'s `rating.ts` (`8eb8a4f9`) ran as an untracked temporary copy beside the new file (same repo and openings paths), then the new file. Both ran into the same out path with the stub `cutechess-cli`, which replays r1's or q4c D's raw files, so `summary.txt` is compared on real data.
- `r 8eb8a4f9`: `cmd.txt` (`0159e555…`), stub argv (`37e82a06…`), `summary.txt` (`dfceb922…`), `machine.txt`, `artifacts.txt` and stdout identical (`cmp` exit 0). `-concurrency 2`, `-rounds 100`.
- `d 8eb8a4f9 efbb4fc7`: `cmd.txt` (`9906e038…`), stub argv (`9d8231e2…`), `summary.txt` (`de96b5d0…`), `machine.txt`, `artifacts.txt` and stdout identical. `-concurrency 3`, `-rounds 200`.
- The temporary copy was removed before the commit.

## Gates at `83751dc0` (own `npm ci --ignore-scripts`)
- `npm run lint` exit 0 (131 files). `npm run typecheck` exit 0. `npm run build` exit 0: `dist/` has 22 files, 0 from `tools/`.
- `npm test` exit 0: **63 files / 2 128 tests passed**, unchanged from `main`. Failed 0, pending 0, todo 0. `test-skip-integrity.js … --skip-count 0` → `No findings.`
- `NFR-008`: 0 lane files. `pair-check.ts` is not `*.test.*`, and nothing in the lane imports `tools/rating/`.
