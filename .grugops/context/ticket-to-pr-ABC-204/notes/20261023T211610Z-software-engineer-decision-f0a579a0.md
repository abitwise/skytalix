---
id: 20261023T211610Z-software-engineer-decision-f0a579a0
kind: decision
by: software-engineer
at: 2026-10-23T21:16:10Z
verified_by: 
confidence: high
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
  - 20261023T211610Z-software-engineer-observation-74a2bc03
supersedes: 
seal: sha256:82a14168b45f7863c6fc3bcf8e5a794abd3b4e2e521a2c4ee8f4133e09f57a7e
---

# Software Engineer: ABC-204's rating harness is built to the design ruling; the SE's calls inside it

**Branch.** `grugops/ABC-204` (worktree `../wt-ABC-204`, from `main` `8ccba739`), commit `82afeda1`. Files: `tools/rating/rating.ts`, `tools/rating/openings.ts`, `tools/rating/openings.epd`, plus one `tools/rating/**/*.ts` line each in `tsconfig.json` `include` and `biome.json` `files.includes` (the `A3` clarification). No `src/`, `data/`, `package*.json`, `*.test.*`, board, trace or ADR change.

1. **Built as ruled, no deviation.** R and D carry the ruled flags verbatim (Q1–Q5 and § The R command shape): `skytalix` `st=<B/1000> timemargin=<5000−B> restart=on` with no `setoption`; Stockfish `st=0.5 timemargin=2000 restart=on Threads=1 Hash=16 UCI_LimitStrength=true UCI_Elo=E`; `-each proto=uci`; `-openings … format=epd order=sequential -repeat -games 2`; R `-concurrency 2`, D `-concurrency 3`; `-maxmoves 200` only; `-pgnout`, `-debug all`, `stderr=` per engine; no `-recover`, `-resign`, `-draw`, `-tb`. D names the engines `skytalix` (candidate, first, so `Elo difference` is the candidate's) and `base`.
2. **The command line.** `node tools/rating/rating.ts r <sha> <out> [--elo E] [--rounds N]` (defaults 1650, 100) and `node tools/rating/rating.ts d <cand> <base> <out> [--budget-ms B] [--rounds N]` (defaults 3000, 200). `--rounds` exists because `A5` is ruled at 50 rounds; `--elo` because `A4` may move E once; `--budget-ms` accepts only {3000, 2500, 2000, 1500, 1000} (Q4). `--elo` accepts only integers 1320–3190. Unknown flags print usage.
3. **Openings.** `openings.ts` reproduces `openings.epd` byte-for-byte: sha256 `0d7f7a72678cbf54c2c309dc5d664e7aac5de2c15bc54fe4247a437f51e82666`, equal to the Architect's probe. It checks the five TSVs against `compile.ts` `SOURCE_SHA256` first and refuses to write a file whose sha differs from the pin. The pin lives once, as `OPENINGS_SHA256` in `openings.ts`; `rating.ts` imports it and stops before the first game on a mismatch.
4. **Artifacts.** Each side is `git clone --no-checkout <this checkout>` into `<out>/clone-<name>`, `git checkout <sha>`, `npm ci`, `npm run build` (the `ABC-202` way, log in `build-<name>.log`). `artifacts.txt` records the full sha, `dist/uci.js` sha256 and the `id`/`option` lines from a `uci` handshake. D with candidate = base builds two clones; equal artifact hashes are then a free reproducibility check.
5. **Tools (A1).** `machine.txt` records chip, Darwin, the engine `node` path and version, `cutechess-cli --version`, Stockfish's `id name`, both sha256 values against the pins (a difference is written as `DIFFERS from pin`, not a stop), the openings sha and the harness's own HEAD.
6. **Out dir.** Resolved before anything is created; refused when it is inside this checkout or not empty. Everything the harness writes is under it.
7. **Host log and watchdog.** `host.log` uses the `ABC-202` line (load1, `thermalpressurelevel`, power source, `/vitest` process count) before, at start, every 60 s, after each `Finished game`, and at the end. The watchdog stops `cutechess-cli` after 600 s with no byte of output (`-debug all` writes every engine line, so 600 s of silence is a hang) and names the stop as a cause.
8. **States.** Read from `cutechess-cli`'s own last `Elo difference: X +/- Y` and `Score of` lines; `inf`, `-inf` and `nan` are read as such. D: GAIN when X − Y > 0, LOSS when X + Y < 0, else NEUTRAL (`EPIC-008`, literally). R: `E + X ± Y = (E+X) ± Y`. Either is replaced by UNRESOLVED, with each cause listed, when: a result text is FAIL-class by `ABC-202` § A3's allow-list; a result text is on neither list (an unclassified text is never counted as a pass); fewer finished or PGN games than 2 × rounds; a raw file is missing; `cutechess-cli` exits non-zero; the watchdog stopped it; or (R only) Q2's guard misses.
9. **Q2's depth guard (R).** Every Stockfish move's PGN comment `{score/depth time}` must show depth ≥ 1 + int(level(E)), with level the `search.h:261-262` cubic, clamped 0–19 (1650 → 3, 2000 → 5, 1320 → 1, 3190 → 19). A Stockfish move with no depth comment counts as a miss.
10. **Records.** `cmd.txt` holds the exact shell-quoted `cutechess-cli` line with `> <mode>.out 2>&1`, written before the first game. `summary.txt` is the printed block. `SHA256SUMS` lists every file at the top of the out dir (not the clones). The harness does not gzip the `.out`; the ruling leaves `A7`'s storage to QE and the Orchestrator.
11. **Not built (left to QE or flagged).** No book-move count, no `[FEN]` pair check, no go→bestmove gap statistics, no automatic E′ (`A4`'s E-step rule is applied by QE from the printed X). The harness exits 0 whenever it prints a state, including UNRESOLVED; it exits non-zero only when it stops itself (usage, out dir, openings pin, a failed clone or build).
