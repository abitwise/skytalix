---
id: 20261029T210343Z-software-engineer-decision-e58c4d25
kind: decision
by: software-engineer
at: 2026-10-29T21:03:43Z
verified_by: 
confidence: high: the design as committed at 83751dc0; the formula reproduces 4 recorded cutechess lines
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
seal: sha256:4dc22de6bb23706d7828d5591ebaede472fd510eb78bb9fa0041da12dfeea3c5
---

# SE decision, se-ABC-225: `rating.ts rpair`, how it is built

Code at `grugops/ABC-225` `83751dc0` (from `main` `8eb8a4f9`). Files: `tools/rating/rating.ts` (mode, dry run), `tools/rating/pair.ts` (new, pure arithmetic and parsing), `tools/rating/pair-check.ts` (new, offline A1–A4 checks). No `src/`, `data/`, lane or config file touched.

## The command
`node tools/rating/rating.ts rpair <base-sha> <candidate-sha> <out-dir> [--elo E] [--rounds N] [--concurrency C] [--dry-run]`
- Each build is read with `r`'s exact argv: Stockfish 19 `UCI_LimitStrength`, skytalix `st=3`, `-repeat -games 2`, `-maxmoves 200`, `-debug all`. Only `-openings … start=S`, `-rounds 10` and the output paths differ (A1).
- **Defaults:** E = 1 910 (the frozen pin; `r` keeps its own default of 1 650 so its command line does not move), width 2 (R's), `--rounds 100`. `--rounds` takes 10–100 in tens. `--rounds 10` is one block per build, 40 games: the A5 smoke.
- The two shas are checked as `^[0-9a-f]{7,40}$` before any `git` call, and every call uses `execFileSync` with no shell. `--budget-ms` is refused.

## Interleaving
- 10 openings per block, so 20 games per build per block. Block 1 runs base then candidate, block 2 candidate then base, and so on (ABBA…).
- Each block of each build is one `cutechess-cli` run in `<out>/<build>/bNN/`. The build clone is at `<out>/<build>/clone-skytalix`, so a block's argv equals `r <sha> <out>/<build>`'s apart from start, count and the block's output files.

## The arithmetic
- **Per build, pooled:** 10 runs give 10 cutechess `Elo difference` lines, not one. The tool pools the blocks' W/L/D and applies **cutechess-cli 1.5.1's own formula** (`elo.cpp`: trinomial stdev, its Winitzki `erfInv`, its truncated pi). It reproduces 4 recorded lines to the digit: r1 188.5 ± 54.8, r2 105.6 ± 49.5, q4c D 52.5 ± 46.8, ABC-204 baseline 151.3 ± 50.3. Every block's own printed line is checked against the formula; a mismatch is a cause. Without that line, the header's "this file computes no Elo" would be broken silently. It is now stated in the header.
- **The pair:** X₂ − X₁ ± √(Y₁² + Y₂²) on the printed one-decimal values (a reader can recompute it from the two lines). State by `EPIC-008`'s D states on the pair: GAIN / LOSS / NEUTRAL. EPIC-010's batch rule is "not LOSS".
- **Opening-paired (pentanomial), information only:** exactly `arch-epic008-rd` `an1.py`'s method. Per opening, the mean of its 2 games; Elo of each build's mean; delta-method variance with the cross-build covariance; 1.96. Only openings with both games in both builds count.
- **Coverage (A2 on real runs):** per block, every round has 2 games from opening `start + r − 1` with skytalix once per colour. The position is compared as placement and side to move, because cutechess writes `-` for an en-passant square no pawn can take (r1 opening 4 has EPD `d6`, PGN `-`; the first version compared 4 fields and flagged 23 recorded openings falsely).

## Faults and halting
Any cause in a block (a fault text, a watchdog stop, fewer games, a missing raw file, a depth-guard miss, a coverage or formula miss) makes that build UNRESOLVED, so the pair is UNRESOLVED. **The run then halts:** the remaining blocks are not played, so a 9 h reading does not run on after it is already void, and the unplayed build reads `blocks: k of 10 played` (EPIC-008: fewer games than pinned). `summary.txt` says where it stopped.

## Host log
- `nps.log`: one line per block per build, Stockfish's median nps over moves ≥ 400 ms (the last `info … nps` before each `bestmove`; the upper-middle median as `an3.py` took it). It reproduces an3's r1 1 643 068 and r2 1 623 258.
- `thermal.log`: every 10 s, in-process, load1, Tctl (k10temp `temp1_input`), the busiest core's measured MHz (`cpuinfo_avg_freq`) and requested MHz (`scaling_cur_freq`). Missing sensors print `?`. `schedule.log` has each block's start and end so samples map to blocks. Each block dir also keeps `play()`'s `host.log` as `r` does.

## Records (ADR-0049 d4)
`machine.txt`, `cmd.txt` and `summary.txt` are written with placeholders (`<out>`, `<repo>`, `<node>`, `<cutechess-cli>`, `<stockfish>`, `<home>`; user and host name as whole words). A last pass rewrites any record file under `<out>` that still holds one, and the build clones (`clone-*`) are left alone. `SHA256SUMS` lists every record file recursively, after the pass.

## `--dry-run`, and r/d unchanged
- `--dry-run` works in every mode. It prints the argv (and, for `rpair`, the schedule), builds nothing, starts nothing and writes nothing. For `r` and `d` the flag is new and only adds this branch.
- `summarise` now returns `{ text, causes, wld, elo }`. `r`/`d` use `.text`. The argv builder, out-dir guard and machine lines moved into functions, unchanged.
- Byte-identity with `main`'s harness is shown in the observation note sealed with this one.
