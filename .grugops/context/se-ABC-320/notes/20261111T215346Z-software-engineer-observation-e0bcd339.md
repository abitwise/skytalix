---
id: 20261111T215346Z-software-engineer-observation-e0bcd339
kind: observation
by: software-engineer
at: 2026-11-11T21:53:46Z
verified_by: 
confidence: high
refs:
  - ABC-320
  - tools/rating/rating.ts
  - tools/rating/pair-check.ts
supersedes: 
seal: sha256:f33bad24ddd518f428dfb869c803cc03ec4081dea428638b0eae2bc047897214
---

Admitted by the orchestrator from se-ABC-320's hand-back (the SE had no note tool in its session); content is the SE's.

Gates, each alone under `flock <scratch>/host-test.lock`: lint 0; typecheck 0 (first run failed on `ArgSpec.start`'s type, fixed and re-run); `VITEST_MAX_WORKERS=1 npm test` 0, 2740/2740, 0 skipped; build 0; `node --test --test-concurrency=1 tools/rating/pair-check.ts` 66/66; records-path-check clean before each commit. Dry runs `--skill 5 --elo 2280 --rounds 5 --start 1` and `--start 6` exit 0, differ only in `start=`.

Not checked: `machine.txt`'s `start:` line is written only on a real run (needs Stockfish), so no test covers it. `rsum` reads the raw `r.out`; it cannot read a QE-trimmed record (no `r.out`, or `.gz`). `rsum` needs `CUTECHESS_CLI` and `STOCKFISH` set to readable files although it runs no engine.

Design choices (decision): `rsum` takes segment dirs only, no flags, writes nothing; sha from `artifacts.txt`, level/E/st/start/rounds from `cmd.txt`, pins and openings sha from `machine.txt`; a segment without `start=` covers openings 1 to rounds; harness sha and concurrency are not compared; a first segment need not start at 1; `--start 1` prints `start=1`.
