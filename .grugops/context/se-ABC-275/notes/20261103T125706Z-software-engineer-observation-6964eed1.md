---
id: 20261103T125706Z-software-engineer-observation-6964eed1
kind: observation
by: software-engineer
at: 2026-11-03T12:57:06Z
verified_by: 
confidence: high
refs:
  - ABC-275
  - ABC-273
  - ABC-255
  - ABC-225
  - ABC-247
  - NFR-008
  - ADR-0056
  - grugops/ABC-275
  - b3436c3a
  - 9c098064
  - 30d15584
  - tools/rating/pair-check.ts
supersedes: 
seal: sha256:3e47c2c4a61c09efe7fe675c857c7dc1b0d114cbbee6458549f979e5b11f5edf
---

# SE observation, se-ABC-275: acceptance rows as run (offline; no engine, no cutechess-cli, no game)

Every run below went under the shared host lock, on branch `grugops/ABC-275`, code commit `b3436c3a`. Base for the comparison: `main` `9c098064`. `git diff --stat 30d15584 9c098064 -- tools/rating` is empty, so this is the same as the cut.
- **A1:** `r <sha> <out> --elo 1810 --budget-ms 100 --rounds 100 --concurrency 1 --dry-run` exits 0 and writes no `<out>`. Its argv is skytalix `st=0.1 timemargin=50 restart=on` with no `option.`, then Stockfish `st=0.1 timemargin=2000 restart=on option.Threads=1 option.Hash=16 option.UCI_LimitStrength=true option.UCI_Elo=1810`, then the tail `-openings file=<repo>/tools/rating/openings.epd format=epd order=sequential -repeat -games 2 -rounds 100 -concurrency 1 -maxmoves 200 -pgnout <out>/r.pgn -debug all`. pair-check asserts the whole vector with `deepEqual`, plus a second vector at the 100-ms defaults (E 1650, 100 rounds, width 2). MET.
- **A2:** 16 prints were captured before and after the change with the same script (`<scratchpad>/a2prints.sh`). They are `r` (no flag; `--elo 1810 --rounds 5 --concurrency 1`), `r --budget-ms 500` (with and without `--elo 1810`), `d` at its default and at 3000/2500/2000/1500/1000/100, `rpair` at its default, `r --elo 2601`, `r --elo 3190 --budget-ms 500`, `d --budget-ms 500` and `rpair --budget-ms 100`. `diff`: 1 line, the Node stack-trace line number in `d --budget-ms 500`'s refusal (`rating.ts:829` → `:839`). The message text is identical, and every dry-run print is byte-equal. The `ABC-225` / `ABC-247` / `ABC-255` rows pass unedited, except the one A3 row. MET.
- **A3:** `r --budget-ms 4000 / 1000 / 50 / x` exit 1 with "`--budget-ms V: r takes only 500 or 100`". `r --budget-ms 100 --elo 2601 / 3190` exit 1 with "`--elo E: above 2600 at --budget-ms 100; C3′'s probe runs first`" and print no argv. `d --budget-ms 500` still gives "not one of"; `rpair --budget-ms 100` and `500` still give usage. The `ABC-255` row is renamed "r refuses any --budget-ms but 500 and 100". Its `100` case was replaced by `50`, and its regexes were updated. MET.
- **A4:** at 100, `--elo 2600` and `1320` print the full vector (exit 0). At 500 and with no flag, `--elo 2601` and `3190` print `option.UCI_Elo=` that value with Stockfish `st=0.5` (exit 0). MET.
- **A5:** `git diff --name-only 9c098064 b3436c3a -- src/ data/ vitest.config.ts` gives 0 lines. Only `tools/rating/rating.ts` and `tools/rating/pair-check.ts` changed. At 100, skytalix's option keys equal those at 4 000, with no `option.` token. MET.
- **A6:** not run offline (the ticket rules it to R1, `ABC-273` R1-A2). The code path writes `control: skytalix st=0.1 timemargin=50, stockfish st=0.1 timemargin=2000` at `r` 100. This was read, not run (UNKNOWN - verify at R1).
- **A7:** `node --test tools/rating/pair-check.ts` gives 38/38 pass, 0 fail, 0 skipped (32 before, plus 6 new). `npm run lint` passes (136 files, no fixes). `typecheck` and `build` exit clean. `npm test` gives 66 files and 2566/2566, with `last-run.json` success, 0 pending and 0 todo. The lane count is unchanged at 2566 (the `se-ABC-269-cut` row reads 2 566), so 0 new lane rows. MET.
- **Stale line, not changed:** the usage text still says "`--budget-ms: R 500 only`". A3 item 3 pins `rpair`'s refusal to today's usage text, so it stays. The thrown refusal names 500 and 100. Fixing it is a one-line follow-up if the Orchestrator wants it.
