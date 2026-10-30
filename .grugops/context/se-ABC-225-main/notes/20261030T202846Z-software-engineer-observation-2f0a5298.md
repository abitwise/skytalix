---
id: 20261030T202846Z-software-engineer-observation-2f0a5298
kind: observation
by: software-engineer
at: 2026-10-30T20:28:46Z
verified_by: 
confidence: medium: A5/A6 are UNKNOWN - verify until QE reads them ALONE at --concurrency 1
refs:
  - ABC-225
  - EPIC-010
  - ADR-0053
  - ADR-0049
  - NFR-008
  - tools/rating/rating.ts
  - tools/rating/pair-check.ts
  - grugops/ABC-225
  - 3dca0e67
  - 14c8aafa
  - 9988a778
  - se-ABC-225/20261029T210343Z-software-engineer-decision-e58c4d25
  - se-ABC-225/20261029T210343Z-software-engineer-observation-14fdbedc
  - bapm-ABC-242-225-owner/20261030T202446Z-ba-pm-decision-e2a5929b
  - qe-ABC-225/20261030T003823Z-qe-e2e-decision-3a53bdfc
supersedes: 
seal: sha256:92e607be0b7e260ec1ba8090d63b45503d4582c952376752b22b1231a023a129
---

# SE observation, se-ABC-225-main: what QE needs for A5 and A6 at --concurrency 1; findings

The SE hop played no game. **A5 and A6 are QE's, ALONE, on AC, at `--concurrency 1`** (owner 2026-10-30).

## A5: the 2-block smoke (40 games)
- Command: `node tools/rating/rating.ts rpair <base-sha> <candidate-sha> <out> --rounds 10 --concurrency 1`, with `CUTECHESS_CLI` and `STOCKFISH` set. E 1 910 is the default. `--concurrency 1` must be passed: the default is 2.
- Both builds now play **skytalix `st=4 timemargin=1000`** against Stockfish `st=0.5`, the same as `main`'s `r`. A dry run first (`--dry-run`, same arguments) shows the argv and writes nothing.
- The shas must be literal hex (7–40); `HEAD` is refused before any `git` call.
- Read: `nps.log` 2 lines; `thermal.log` ≥ 1 sample per 10 s over `schedule.log`'s span; `summary.txt` with both builds, the pair and the pentanomial. Stop at a Tctl median over 85 °C. A new PREREG goes with the run (QE asked for one).
- The id-author question was settled by QE in `qe-ABC-225` (ACCEPTABLE).
- Still UNKNOWN - verify in a real run, unchanged from `se-ABC-225`: cutechess honours `start=S`; real `-debug all` gives an nps value per block; k10temp Tctl reads; a real block's Elo line matches the pooled formula.

## A6: the cost at width 1
Wall from `schedule.log` (first start to last end), start and end times, games per hour; project 400 games at width 1. The ticket estimates 2.2–2.4 h for the smoke and 22–24 h for the pair. These are estimates; nothing here measured them.

## Findings
- **Low (maintainability):** in `cutechessArgs()` the `r` budget is a literal (`mode === "r" ? 4000 : budget`) and `rpair` passes `budget: 4000` that the `r` path does not read. Today they agree. If someone later moves only one of them, `rpair` follows the literal, so A1 still holds; but the `budget` field would mislead. A named constant shared by both would remove it. I did not do it here: smallest diff, and `r`'s line stays identical to `main`'s.
- **Info:** the `rpair` scope line "skytalix at 3 000 ms" on the ticket reads 4 000 ms from this merge (as BA/PM's dated line says). The header comment in `rating.ts` names no R budget, so it did not need a change.
- No board, ticket or `src/` edit in this hop.
