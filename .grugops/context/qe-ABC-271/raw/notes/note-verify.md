# qe-ABC-271 independent re-checks: K0 7 / 7 exact on the build and on `main`'s copy (nodes, score, move), plus 112 frozen positions at `search()` depth 7 identical; K1 (a)–(e) MET on QE's frozen rows and on 134 186 positions by a re-implementation of `ADR-0070`'s text (0 failures in about 4.8 M checks, including the hot path through `evaluateAtPhase` at every phase); K2 exactly the two memo-size re-pins; `pawnStructureForTest` is test-only and reached from one test file; `npm test` green in 9.34 / 9.41 s

QE/E2E, task `qe-ABC-271`, on the build `10f29a82` (`src/` `08e56302`, = the branch tip's) against `main` `d2f01e7c` (`src/` `4fb3da04`). Every run went under `flock <scratch>/host-test.lock`. Raw: `raw/out/k0.out`, `k1.out`, `npm-test-*.out`, `post.log`. Scripts: `raw/scripts/k0.ts`, `k1.ts`, `post.sh`. QE wrote both checkers from `ADR-0070`'s text: `k1.ts`'s rule is the freeze's `verify.mjs` rule, given a value set and a phase as parameters. Neither reads the build's `passerTerms`.

## K0, node identity: MET, 7 / 7 (`raw/out/k0.out`)
| row | frozen | build H | `main` copy B |
|---|---:|---|---|
| `chooseMove` kiwipete d8 / d9 | 766 275 / 1 725 150 | 766 275 / −89 / d5e6; 1 725 150 / −114 / e2a6 | identical |
| `chooseMove` position-6 d8 / d9 / d10 | 87 475 / 253 724 / 533 916 | 87 475 / 71; 253 724 / 78; 533 916 / 79; all c3d5 | identical |
| `search()` d8 kiwipete / position-6 | 605 117 / 406 787 | 605 117 / −89 / d5e6; 406 787 / 74 / c3d5 | identical |
- **Break attempt where the loop runs:** `search()` at depth 7 on QE's 44 seam fixtures and 12 K1 (a) positions, each with its mirror (112 positions, 2 226 344 nodes on H). Nodes, score and move are **identical H against B on all 112**. The K3 sessions add the six endgame FENs at `chooseMove` depth 9, identical in both sessions.
- **"Every existing door reads its pre-ticket counts":** the deep lanes (deep-lanes note) pass with unchanged expectations.
- `main`'s non-test `src/` has not moved since the probe (`git diff 3a08d244 d2f01e7c -- src` is empty), so one set stands.

## K1 (units): MET (`raw/out/k1.out`, `K1 OK`, fail 0)
- **Part 1, the frozen rows** (`fixtures.json` sha256 `bf3c205b…887a`; `src/evaluate.passer-fixtures.json` is byte-identical by `cmp`):
  - `passerTermsForTest` at `ADR-0070` d1's probed values returns the frozen `{ kd, free, un }` **per side on all 44 rows**;
  - every one of the 19 pairs' A − B per side per part equals the frozen difference;
  - every part is 0 at the shipped values.
  - So **(c) MET**: kd moves by exactly KE[R] / KO[R] per capped step and by 0 past the cap (KD3, KD5); free is non-zero only on an empty path (FP1–FP5, the FP6 control); U = 400 exactly on the frozen U rows at phase 0 and 0 elsewhere, `U7-both` 400 / 400, never netted (`QE-271-a`).
- **Part 2, a broad corpus:**
  - Sources: G3's 184, every taper-corpus FEN, the mate corpus, the 56 frozen rows, 300 seeded random walks of legal moves (46 479 FENs; no engine chooses a move, so these are not games), and 20 000 seeded random endgame placements (two kings, 1–4 pawns a side, 0–2 pieces, the side not to move not in check).
  - That is 67 093 FENs, each with its mirror: **134 186 positions**. 97 668 have a passer, 14 730 are at phase 0, and on 12 430 U fires at the probed values.
  - Two value sets: the probed VP, and V2 (distinct primes by rank, U = 97), so that no coincidence of values can pass a wrong part.
  - **Seam = rule**, per side and part, at VP and V2, and 0 at the shipped values: 805 116 rows, 0 misses.
  - **The hot path:**
    - Checked through `evaluateAtPhase` itself, not the seam. Let mg = `evaluateWithoutTaper` and D0 = `evaluateAtPhase(p, 0)` − mg at the shipped values. Then for k ∈ {0, 1, 6, 12, 23, 24} the white-POV score at V equals **mg + trunc((D0 + e_k) × (24 − k) / 24)**, where e_k is the rule's white minus black (kd + free, plus U only at k = 0). `evaluateWithoutTaper` does not move. 1 610 232 rows, 0 misses.
    - This reads the walk's king squares, the memo's words, the guard (skipped at k = 24) and the phase argument for U.
  - **(a) mirror, `Object.is`:** `evaluate` at the shipped values, at VP and at V2, and `evaluateAtPhase(p, 0)` at VP and V2: 0 mismatches on all 134 186 positions. This covers G3 + `TAPER_MIRROR_POSITIONS` + the 12 frozen K1 (a) rows and much more. **MET.**
  - **(b) value identity, `Object.is` against `main`'s copy (B)** at the shipped values: `evaluate`, `evaluateWithoutTaper`, `evaluateWithoutPawnCache`, `evaluateWithoutMobility` and `evaluateAtPhase` at k = 0, 1, 6, 12, 23, 24. 1 341 860 rows, 0 differ. This covers the ticket's corpora (G3, `TAPER_DOOR_CORPUS` with its KP rows, the 56 frozen rows with mirrors), but against `main` live rather than pinned literals. `ABC-270`'s 28 queen pairs are read by the build's own K1 (b) row, green in `npm test`. **MET.**
  - **(e) the memo:** `pawnStructureForTest(p, false)`, then `(p, true)` twice (a miss, then a hit), give the same packed sum, and both words equal the rule's frontmost passer of each file, on every position (402 558 memo rows with the V-level checks). The collision walk then puts every position through the memo at V2 twice in order, so slots collide and overwrite. `evaluate` (memo) is `Object.is` `evaluateWithoutPawnCache` (fresh) on all 134 186 positions. **MET.**
- **(d) the range row:** `evaluate.taper.test.ts`'s A9 `bound` now adds 2 × (8 × (5·max|KE| + 5·max|KO| + max|F|) + |U|) per half. At the shipped values that term is 0, so the old A9 expectations stand unchanged. The new row turns red with a 2 000 cp rank-6 half or U = 30 000. It is green in `npm test` and in the taper deep lane. The bound over-counts, since the E4a terms enter Δ outside the packed sum, which is safe. **MET.**
- **The source row:** `whiteMinusBlack`'s body (read by QE) holds the walk's two loops only. `passerTerms` receives the walk's `whiteKing` / `blackKing` and does no piece scan. The guard is `w < PHASE_SPAN && (whitePassers | blackPassers) !== 0`, with no value test. **MET.**

## K2, two re-pins and no others: MET
- `git diff -U0 main...10f29a82` over every `*.test.ts`, `*.snap` and `tools/` file: the removed lines are exactly `evaluate.pawns.test.ts`'s memo row (its title and both `expect` lines, 2^14 × (8+8+4+4+4) and 448 × 1024 → 2^14 × (8+8+4+4+4+4+4) and 576 × 1024) and `transposition.test.ts` A7's `pawnCacheByteLength()` line (448 → 576 × 1024).
- The A9 edit replaces a `return` with the same sum plus a term that is 0 at the shipped values. No expected value moves. No `.snap` and no `tools/` file changed. No other lane needed a re-pin (deep-lanes note).

## The extra export `pawnStructureForTest` (brief item 3): test-only, reached from test files only
- `git grep` outside the records: defined in `src/evaluate.ts:922` and called only in `src/evaluate.passer.test.ts` (four calls, K1 (e)). No non-test `src/` file, no `tools/` file and no script calls it. Its JSDoc says TEST-ONLY.
- With `memo` true it writes a memo slot, which is the same write a production miss makes. With `memo` false it touches nothing but the module-level parts, which every `whiteMinusBlack` call resets before reading. Either way a later `evaluate` cannot read a stale word. The memo and identity checks above ran with it interleaved and found 0 differences.
- **Gap, LOW (`QE-271-g`):** `ADR-0070` d4 names one seam and the build adds a second. Unlike `passerTermsForTest`, it has no "called from test files only" source row. It ships in `dist/` like every `…ForTest` export (the `kingExposureForTest` precedent). Whether the ADR wants it is the Architect's call (the Engineer's reading 4, `UNKNOWN - verify` there).

## Default lane and gates (brief item 5)
- `npm test` on the branch: **exit 0, 70 files, 2 672 / 2 672, Duration 9.34 s**, and on a second run 9.41 s. That is **≤ 10 s**, but with 0.6 s headroom.
- `main` (a detached scratch worktree of `d2f01e7c`): 69 files, 2 650 / 2 650, 9.17 s. The build adds 22 tests (21 in the new file and the A9 row) and about 0.2 s. This is the `N8-LANE` before / after, a report.
- `npm run typecheck` exit 0; `npm run lint` exit 0 (147 files); `npm run build` exit 0.
- Skip count (`--reporter=json | jq`) **0**; `test-skip-integrity.js … --skip-count 0`: `No findings.`, exit 0.
