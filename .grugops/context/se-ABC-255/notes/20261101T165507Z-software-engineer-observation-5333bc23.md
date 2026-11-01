---
id: 20261101T165507Z-software-engineer-observation-5333bc23
kind: observation
by: software-engineer
at: 2026-11-01T16:55:07Z
verified_by: 
confidence: high
refs:
  - ABC-255
  - EPIC-011
  - EPIC-010
  - ADR-0056
  - grugops/ABC-255
  - 78cd2415
  - 8f2fc9b5
  - tools/rating/rating.ts
  - tools/rating/pair-check.ts
  - C2′
  - C3″
  - S′
  - R-TC
  - A1
  - A2
  - A6
supersedes: 
seal: sha256:891867c2ddb27ed62018297ef571ef334f18bbc89cdab00650d0ccb3b47d5e56
---

# SE observation, se-ABC-255: the dry-run rows (A1, A2) and A6

Raw: `.grugops/context/se-ABC-255/raw/dry-compare.txt`, `dry-head-15/16/17.txt`, `refusals.txt`. Base = `tools/rating/rating.ts` at `8f2fc9b5` run beside head in the same checkout, same args, under the host lock.

- **A1 MET (dry run).** `d <c> <b> <out> --budget-ms 100 --rounds 50 --concurrency 1 --dry-run` prints `st=0.1` and `timemargin=50` on skytalix and base, `-games 2 -rounds 50 -concurrency 1`, `openings.epd` `format=epd order=sequential` and `-repeat`; with `--rounds 200` the same with `-rounds 200`. The default and each of 3 000 / 2 500 / 2 000 / 1 500 / 1 000 (and 1 000 at 50 rounds width 1) are byte-equal to base (rows 05–11).
- **A2 MET (dry run).** `r <c> <out> --budget-ms 500 --rounds 5 --concurrency 1 --dry-run` prints skytalix `st=0.5 timemargin=50`, no `option.` on skytalix; Stockfish `st=0.5 timemargin=2000 option.UCI_Elo=1650`; `-games 2 -rounds 5 -concurrency 1`. `r` without the flag (4 shapes) and `rpair` (3 shapes, incl. --rounds 10 --concurrency 1 and --elo 1650) are byte-equal to base (rows 01–04, 12–14), `option.Skill Level=6` intact. `r --budget-ms` 4000 / 100 / 1000 exit 1 with "r takes only 500"; `d --budget-ms 500` exits 1; `rpair --budget-ms 500` exits 1 (usage), as in base.
- **A6 MET.** `git diff --name-only 8f2fc9b5 78cd2415 -- src/ data/` is empty (numstat: tools/rating/pair-check.ts +186 −1, tools/rating/rating.ts +38 −11, plus the queue claim). In both A1 vectors and the A2 vector skytalix's engine group has the same keys as today's (only `st=`/`timemargin=` values differ) — asserted by pair-check's A6 row.
