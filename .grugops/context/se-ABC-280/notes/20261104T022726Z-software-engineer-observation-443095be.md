---
id: 20261104T022726Z-software-engineer-observation-443095be
kind: observation
by: software-engineer
at: 2026-11-04T02:27:26Z
verified_by: 
confidence: high (every figure read from the runs' logs, extract.json and reporter output named in raw/out)
refs:
  - se-ABC-280
  - grugops/ABC-280
  - ABC-280
  - ABC-239
  - EPIC-011
  - ADR-0067
  - B-T1
  - B-T3
  - NFR-008
  - 625b75fe
  - 5ce4f870
  - def26997
  - 8c03b713
  - ee4c4c84
  - 66798b22
  - f831c04d
  - edb9fddd
  - 26d06118
  - dcc1bae0
  - tools/tune/tune.ts
  - tools/tune/tracer.ts
  - tools/tune/pgn.ts
  - tools/tune/bounds.ts
  - tools/tune/tune.test.ts
  - tsconfig.json
  - biome.json
supersedes: 
seal: sha256:a7055f94846b0bff56e94fe58767855e48fb5ba3059a4c7aca3334057a3bb042
---

# se-ABC-280 observation: A3–A6 on `main`'s table. N 2 647 → 2 650; TUNE_DEEP 17/17; B-T1 0 misses over 1 488 071 keys; B-T3 two byte-identical emissions; no data-stage stop fired

Software Engineer, task `se-ABC-280`. Every run below ran under the host lock (`flock <scratch>/host-test.lock`). Raw outputs are in `.grugops/context/se-ABC-280/raw/out/`.

**A3.** At the pre-ticket head (`main` `dcc1bae0` plus the claim, `src/` identical), `npm test` ran 68 files, **N = 2 647 passed**, in 9.76 s real. At the tip `edb9fddd` it ran 69 files, **2 650 passed, 0 failed** (N + 3), in 9.83 s real. The added file is `tools/tune/tune.test.ts` with 3 tests in 3 ms; its wall time is reported for NFR-008, not graded. The skip-count capture gave **0 on `main` and 0 at the tip**. `test-skip-integrity.js --skip-count 0` printed `No findings.`. `npm run lint` checked 146 files with no fixes. `npm run typecheck` and `npm run build` both exited 0. After the build, `dist/` holds 24 `.js` files, all from `src/`, and **none from `tools/`**.

**A4.** `TUNE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run tools/tune` exited 0: **17 passed, 0 skipped** (3 source rows plus 14 deep rows). `se-ABC-239b`'s count was the same.

**Data pin.** `sha256sum -c` on `<scratch>/lichess/lichess_db_standard_rated_2017-03.pgn.zst` against `b319297e…4320` returned OK.

**A5 (B-T1).** `extract` ran at `main`'s `src/evaluate-params.ts`, sha256 `e2db4f4b…3f55`, unchanged. It ran with `timeout 1800` and `--max-old-space-size=3000`. Result: **0 misses over 1 488 071 gated keys; worst |model − evaluate| 0.9583 cp**. The tool's gate throws on the first miss, and none was thrown. Key count and worst equal `se-ABC-239b`'s. Rows: own training 167 014 (inner validation 48 280), own outer validation 45 158, Lichess 1 000 000. Own games: 5 858 read, 3 680 kept.

**Data-stage stops 1–4.** None fired:
- Stop 1: Lichess rows 1 000 000, against the 250 000 floor.
- Stop 2: reader drops `li.g7.replay` = 0 of 289 145 games reaching replay.
- Stop 3: each run took about 5 min 0 s (extract 3:26.0 / 3:25.8, fit 1:31.8 / 1:33.2, emit 0.08 s).
- Stop 4: peak RSS for extract 1.52 / 1.52 GB, for fit 0.45 GB, inside the 3 000 MB flag.

**A6 (B-T3).** Two full `extract | fit | emit` runs from `main`'s table, with the tool as landed (the one bound row included). Each emitted to its own scratch path. **The two emitted files are byte-identical, sha256 `329452a32af1097794a40289f012deaf3f26c03a74887a6b370540ecf2b35b14`.** `rows.jsonl` and `fit.json` are also byte-identical across the two runs. **Data manifest sha256 `c9d777ef56d395f453e50066cbc8ac3ef058d9f90039e1d6920c81738eb15934`**, equal to `se-ABC-239b`'s.

Reported, not graded: the emitted sha256 **does not equal** `10581fb5…95af`. The only difference is the header's tool-commit line (`edb9fddd…` against `8c03b713…`). The values sha256 `0a0284ca…f38a` is the same in both files. A comparison emission with the commit string `8c03b713…` is byte-equal to `26d06118`'s file (`raw/out/compare-26d06118.txt`). So the landed tool reproduces the closed pull's candidate exactly, apart from its own commit id. `src/evaluate-params.ts` at the tip is byte-equal to `main` (A2), and no emission was committed.
