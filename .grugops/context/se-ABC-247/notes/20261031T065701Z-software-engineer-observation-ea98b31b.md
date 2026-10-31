---
id: 20261031T065701Z-software-engineer-observation-ea98b31b
kind: observation
by: software-engineer
at: 2026-10-31T06:57:01Z
verified_by: 
confidence: high: every check and gate run as stated at 02f4f3d4; no engine, no game, no timed read
refs:
  - ABC-247
  - EPIC-010
  - ADR-0053
  - tools/rating/rating.ts
  - tools/rating/pair-check.ts
  - grugops/ABC-247
  - 02f4f3d4
  - 4cd261c1
  - orch-2026-10-30a/20261031T065500Z-orchestrator-decision-fb0c8978
  - qe-EPIC-010-m1-batch
  - QE-M1B-a
  - NFR-008
  - ADR-0049
supersedes: 
seal: sha256:679be84fe2103c414f052bad9a187e22fc5e77abebb0f6966c9f01075ccec95f
---

# SE observation, se-ABC-247: A1 and A4 checked at 02f4f3d4 (no game, no engine)

Raw prints under `se-ABC-247/raw/` (paths as `<scratch>`, `<repo>`). "main" below = `rating.ts` at `4cd261c1`, before the change.

## A1 — MET
- `node --test tools/rating/pair-check.ts`: **25 tests, 25 pass, 0 fail, 0 skipped** (was 22; +3 new) (`raw/pair-check.txt`).
- New tests: (1) `ABC-247 (a): every block of both builds gives skytalix Skill Level 6 once, Stockfish none` (20 argvs; token count 1, any `Skill Level` count 1, engine groups `[skytalix, stockfish]`, token in skytalix's); (2) `ABC-247 (a): the A5 shape (--rounds 10 --concurrency 1) carries it on both builds too`; (3) `ABC-247 (c): the r and d argvs send no Skill Level and are main's, token for token` (full literal argv for `r` default and `d --budget-ms 1500`). Existing A1 diff test restated: drops `start=S` and the token (asserted right after `restart=on`), then the 4 allowed diffs as before.
- **(b)** the existing A1 test: each rpair block = r's argv except openings start/count, output paths and that one token.
- **(c)** byte-equal dry-run prints, main vs head, same arguments: `r ca6e675c`, `r 4cd261c1 --elo 1910 --rounds 10 --concurrency 1`, `d 4cd261c1 ca6e675c`, `d … --budget-ms 1500 --rounds 50` — all 4 `cmp` equal (`raw/dry-*.main.txt` vs `.head.txt`). `rpair ca6e675c 4cd261c1` print: exactly 20 lines added, each `option.Skill Level=6`, 0 removed (`raw/dry-rpair.diff.txt`). The out dir did not exist after any dry run.
- **(d) mutations (never committed):** removing `skill: PAIR_SKILL_LEVEL` from rpair → 22 pass / **3 fail** (the A1 diff test and both new (a) tests) (`raw/pair-check-mut-remove.txt`). Leaking the token into every `sky()` group → 23 pass / **2 fail** (A1 diff, new (c)) (`raw/pair-check-mut-leak.txt`). Restored (`cmp` equal); green. Before the tests were updated the old A1 test already went red on the token (`raw/pair-check-old-tests-red.txt`).

## A4 — MET
- `npm run lint` 0 (131 files; one biome format-only fix to pair-check.ts applied with `npm run format` before the commit), `npm run typecheck` 0, `npm run build` 0.
- `npm test` **63 files / 2 364 passed**, 0 failed, 0 skipped, 0 todo (9.00 s; load1 0.39 before) (`raw/npm-test.txt`). Skip integrity `No findings.` (`raw/skips.txt`).
- `git diff --stat main -- src data` empty. No vitest file touched, so G8 not re-read (NFR-008).
- Not run (by the brief): A2 probe, any cutechess game. QE owes A2 ALONE.
- Committed files carry no host path (the new test builds paths from `homedir()`/`tmpdir()` at run time).
