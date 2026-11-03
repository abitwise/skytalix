---
id: 20261103T150331Z-software-engineer-observation-4e2084bf
kind: observation
by: software-engineer
at: 2026-11-03T15:03:31Z
verified_by: 
confidence: high
refs:
  - ABC-276
  - EPIC-011
  - ADR-0049
  - QE-275-a
  - QE-273-b
  - SEC-HP-1
  - sec-host-paths/20261103T144802Z-security-nfr-decision-72b4070b
  - sec-host-paths/20261103T144802Z-security-nfr-observation-45ef018a
  - grugops/ABC-276
  - tools/rating/rating.ts
  - tools/rating/pair-check.ts
supersedes: 
seal: sha256:285a8e23b9b3d98fd8491bc234f532cd6c4e48c179e4a7238afdef78ac700d6d
---

# SE observation, se-ABC-276: acceptance as run (offline only; no engine, no game, no build of a clone)

Every run wrapped in `flock` on the host lock. Base for the diff: `b62e8049` (tools/rating unchanged since the cut `5222a9b4`).

- **A1 MET (offline, A4 row).** A temp out dir with `machine.txt`, `cmd.txt`, `r.out`, `r.pgn` and `summary.txt`, each planted with `homedir()`, the repo realpath, the out path given and realpath, `CUTECHESS_CLI` and `STOCKFISH` given and realpath, `process.execPath`, the user name and the host name. After `sealRecords(out, topFiles)` there are 0 occurrences of each (paths as substrings, names as whole words). Each became `<home>` `<repo>` `<out>` `<out>` `<cutechess-cli>` ×2 `<stockfish>` ×2 `<node>` `<user>` `<host>`, line for line. A `clone-skytalix/` file is left as written. Mutation: with the redaction disabled, A4 fails, so the row is not vacuous.
- **A2 MET (offline).** `SHA256SUMS` lists exactly the 5 top-level files (sorted), and `sha256sum -c SHA256SUMS` in the out dir exits 0 with 0 `FAILED`. A real run's records are QE's to check at the next r / d reading (test note 4): UNKNOWN - verify there.
- **A3 MET.** (a) `cutechessArgs` and `play(out, args, outFile)` are not in the diff. (b) `node --test tools/rating/pair-check.ts` 40/40: the 38 existing rows pass unedited, plus 2 new. 22 dry-run and refusal prints (r at 4000/500/100 × E default/2000, d at none/3000/2500/2000/1500/1000/100/500, rpair --rounds 20, r 100 --elo 2601) were diffed before and after: every argv print is byte-equal. The only diff lines are Node stack-trace line numbers in 2 refusals (`d --budget-ms 500`, `r --budget-ms 100 --elo 2601`); the messages are equal.
- **A4 MET.** As above: no engine, no `cutechess-cli`, no build.
- **A5 MET.** The row checks that `rating.ts` with no mode and `rpair <sha> <sha> <out> --budget-ms 100 --dry-run` each exit 1 with stderr exactly the 7-line usage text (the 2 new strings, the other 5 lines byte-equal to the cut) and empty stdout.
- **A6 MET.** `git diff --name-only 5222a9b4 f4c52d62 -- src/ data/ vitest.config.ts` gives 0 lines. Code paths changed: `tools/rating/` only.
- **A7 MET.** `npm run lint` passes (136 files), `typecheck` and `build` are clean, `npm test` passes 66 files, 2566/2566 (same as before; 0 new lane rows, NFR-008). `pair-check.ts` 40/40.
