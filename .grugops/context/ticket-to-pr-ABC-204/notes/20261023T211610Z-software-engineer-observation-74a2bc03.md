---
id: 20261023T211610Z-software-engineer-observation-74a2bc03
kind: observation
by: software-engineer
at: 2026-10-23T21:16:10Z
verified_by: 
confidence: high (each command run by the SE on 2026-10-23 in the worktree and scratchpad; outputs read; host not quiet, so no smoke figure is a reading)
refs:
  - ABC-204
  - EPIC-008
  - ABC-202
  - NFR-004
  - NFR-008
  - ADR-0023
  - ADR-0037
  - plans/tickets/ABC-204-a-rating-harness-plays-skytalix-against-stockfish-uci-limitstrength-and-against-its-base-in-cutechess-cli-outside-npm-test.md
  - 20261023T205749Z-architect-design-decision-13faedbc
  - 20261023T205749Z-architect-design-observation-3e30889d
  - grugops/ABC-204
  - 82afeda1
  - tools/rating/rating.ts
  - tools/rating/openings.ts
  - tools/rating/openings.epd
supersedes: 
seal: sha256:8f18059eed4d8eb43d72733aace67957c0f6b225aba8bfb986a27321cf801e58
---

# Software Engineer: ABC-204's harness, the openings sha check, two smoke runs and the gates, as they ran

Branch `grugops/ABC-204`, commit `82afeda1`, base `main` `8ccba739`. Scratch: `scratchpad/se204/`. **The smoke runs are smoke runs, not readings.** The host was not quiet throughout (battery power, thermal 1–2, load1 6.2–9.2 in the smoke host logs, foreign `vitest` processes at times, two other agent hops running). The baseline R (`A4`), the A/A D (`A5`) and the wall times (`A6`) are QE's.

1. **Openings (Q5).** `node tools/rating/openings.ts <design204/tsv>`: rc 0 in 0.74 s. The five TSVs passed the `SOURCE_SHA256` check. `tools/rating/openings.epd` is 100 lines, 100 distinct, sha256 `0d7f7a72678cbf54c2c309dc5d664e7aac5de2c15bc54fe4247a437f51e82666`, equal to the Architect's probe pin. A mutated copy (one byte appended) made `rating.ts` stop before any build or game with `openings sha256 … is not the pin …`. The file was restored, and its sha re-read equal to the pin.
2. **Guards that ran.** Usage on a missing argument and on a flag of the other mode. `--elo 1000` and `--budget-ms 1234` were refused. An unknown sha was refused by `git rev-parse` ("Needed a single revision"). An out dir inside the checkout (`./inside`, `tools/inside`) was refused before anything was created (a first version created `./inside` before refusing; it was removed and the check moved before `mkdir`). A non-empty out dir was refused.
3. **Tools (A1), as recorded by the harness.** Apple M3, Darwin 25.6.0, `node` v26.11.1 (`/opt/homebrew/Cellar/node/26.11.1/bin/node`), `cutechess-cli 1.5.1` sha256 `fb4fc2aa…6e1c` = pin, `id name Stockfish 19` sha256 `dc2f18c3…251f` = pin.
4. **R smoke.** `rating.ts r 8ccba739 se204/smoke-r --rounds 1` (E 1650, `-concurrency 2`), 21:07:04–21:12:43Z, rc 0.
   - Artifact `8ccba739…` `dist/uci.js` sha256 `877e9595746aead5019a2e604da2ef0021e2d688168b275d809e572fe8a9b98d` (equal to `ABC-202`'s and the design probe's). Options: `OwnBook` check default true; `Skill Level` spin default 5 min 1 max 5.
   - First `go` raw: `289 >skytalix(0): go movetime 3000` and `294 >stockfish(2): go movetime 500`. 10 `setoption` lines, all to Stockfish; 0 to `skytalix`.
   - Game 1 (`skytalix` White): `1-0 {White mates}`, 77 plies, 2:12. Game 2 (`skytalix` Black): `1/2-1/2 {Draw by 3-fold repetition}`, 191 plies, 5:33. Both `[FEN]` equal `openings.epd` line 1, colours swapped.
   - Printed: `Elo difference: 190.8 +/- nan, LOS: 84.1 %, DrawRatio: 50.0 %`; W/L/D 1/0/1, score 0.750, 2 of 2 games; 0 faults, 0 unclassified, 0 move-cap draws; both `stderr` 0 bytes; depth guard 0 of 134 Stockfish moves below depth 3; `state: rating E + X ± Y = 1650 + 190.8 ± nan = 1840.8 ± nan`.
   - The guard is not vacuous: on the same PGN, a floor of 11 gives 16 misses, 14 gives 60, 99 gives 133, and deleting one Stockfish comment gives 1 miss. `pickDepth` gives 1650 → 3, 2000 → 5, 1320 → 1, 3190 → 19.
   - `host.log`: 9 lines (before, start, 5 periodic, after-game-1, end). `SHA256SUMS` lists 10 files.
5. **D smoke (A/A).** `rating.ts d 8ccba739 8ccba739 se204/smoke-d --rounds 1 --budget-ms 1000` (`-concurrency 3`), 21:13:11–21:14:47Z, rc 0. The 1 000 ms budget kept it short; it exercised `st=1 timemargin=4000` on both engines. The 3 000 ms path is the same code that R ran for `skytalix`.
   - Both clones built `dist/uci.js` sha256 `877e9595…b98d`: identical.
   - First `go` raw: `110 >skytalix(0): go movetime 1000` and `111 >base(2): go movetime 1000`. 0 `setoption` lines.
   - Game 1 (`skytalix` White): `1/2-1/2 {Draw by 3-fold repetition}`, 91 plies, 1:27. Game 2 (`base` White): `1-0 {White mates}`, 55 plies, 0:51. Same `[FEN]`, colours swapped.
   - Printed: `Elo difference: -190.8 +/- nan, LOS: 15.9 %, DrawRatio: 50.0 %`; W/L/D 0/1/1, score 0.250, 2 of 2; 0 faults; both `stderr` 0 bytes; `state: NEUTRAL`.
6. **Gates (worktree, after the change).** `npm run lint` rc 0 (124 files; `--verbose` lists both harness files). `npm run typecheck` rc 0 (`--listFilesOnly` lists both). `npm run build` rc 0; `dist/` holds 22 files, 0 under `tools/`. `npm test` rc 0: 61 files, 2019 tests, all passed, 0 skipped, 0 todo — identical to base (61 / 2019, same file list in `last-run.json`). `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`: "No findings.", rc 0. `git diff --stat 8ccba739..HEAD`: `biome.json` +1, `tsconfig.json` +1, `tools/rating/openings.epd` +100, `openings.ts` +96, `rating.ts` +398. 0 `*.test.*` files added.
7. **For QE's long readings.**
   - With 2 games cutechess prints `+/- nan`. D's states then follow `EPIC-008` literally: X − Y and X + Y are NaN, so the state is NEUTRAL. At 100 or 400 games Y is finite, so this matters only for a smoke run. A 100 % or 0 % score prints `inf`/`-inf` and is read as ±Infinity. R's E′ rule for infinite X is QE's.
   - The harness exits 0 when it prints any state, UNRESOLVED included. QE should read the `state:` line, not the exit code.
   - Not built, left to QE as the ruling assigns: book-move counts, the `[FEN]` pair check, the go→bestmove gap statistics, gzip of the `.out`, the `A4` score band and E′.
   - The engine `cmd=` is `process.execPath` (the Cellar path behind `/opt/homebrew/bin/node`), recorded in `machine.txt` and `cmd.txt`.
