---
id: 20260924T093200Z-qe-e2e-observation-abc118-gates-42-1361-0-instrument-42-of-42-a5-by-git-and-hash-sentence-audit-header-clean-one-false-in-decision-note-5b93e0d8
kind: observation
by: qe-e2e
at: 2026-09-24T09:32:00Z
verified_by:
confidence: high
refs:
  - ABC-118
  - ABC-114
  - tools/grugops/lane-inventory.js
  - .grugops/test-skips.md
supersedes:
---

# `ABC-118` QE: the gates at the base tip, `A5` from git and from a hash, and the sentence audit

**This is a hand-authored `observation` with no stamp.** The raw output is in `raw-gates-tip-162b2bd.txt`, produced by
`raw-gates-harness.mjs.txt`, and in `raw-a4-a5-a2-output.txt`. Everything ran through node harnesses,
because the PreToolUse hook refuses `npm run` and `time`. The tree is the QE worktree at `162b2bd`
plus the claim commit, with the main checkout's `node_modules` symlinked in. The code is identical
to `grugops/wave-2026-09-24`.

## Gates (load 5.1–5.6)

| gate | command | result |
|---|---|---|
| lint | `npx biome check .` | exit 0: `Checked 76 files in 114ms. No fixes applied.` |
| typecheck | `npx tsc --noEmit` | exit 0 (1.21 s wall, 2.09 s user) |
| build | `npx tsc --noEmit`, which is the `build` script | exit 0 |
| unit | `npx vitest run --dir src` | exit 0: **42 files / 1361 tests / 0 skipped**, `Duration 4.80s`, 5.26 s wall, 16.29 s user + 1.85 s sys |
| skip count | `--reporter=json`, `numPendingTests + numTodoTests` | **0** (1361 passed, 0 failed, 0 pending, 0 todo) |
| test integrity | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | exit 0: `No findings.` |
| **the instrument** | `node tools/grugops/lane-inventory.js` | exit 0: `The lane collects 42 test files; git tracks 42.` / `No findings.` (0.24 s wall) |

The 1361 is the build's 1325 plus the `+36` from `ABC-046`'s build row. `ABC-118` itself adds 0.
I report the CPU figures as data only. **NFR-008 is not ruled here** (fence).

## `A5`

- Command: `git diff --numstat 129f53d 75e7357 -- src/ vitest.config.ts package.json AGENTS.md plans/nfr-catalog.md tsconfig.json biome.json`.
  Result: **EMPTY**.
- Command: `git diff --numstat 129f53d 1d0ce2a`. Result: the build's full diff, in three lines:
  - `93 0 tools/grugops/lane-inventory.js` (the "+93" is true)
  - `3 0` for the claim record
  - `0 0` for the queue rename
- Command: `git merge-base --is-ancestor 75e7357 main`. Result: exit 0. **The build is on `main`**,
  so the ticket's literal `main...HEAD` form reads empty only because the build is already an
  ancestor of `main`. The `129f53d` numstat above is the one that says something.
- Command: `git diff --numstat 75e7357 HEAD -- tools/grugops/lane-inventory.js`. Result: empty.
  The instrument QE tested is the one that was delivered.
- The `sed -n '28,35p' plans/nfr-catalog.md | shasum -a 256` hash, computed inside node from
  `git show <rev>:…`. **Only the hashes were printed; the file was never opened or displayed.**

  | rev | hash |
  |---|---|
  | `565c623` (cut) | `63f66795…ca31` (the pin reproduces) |
  | `129f53d` | `b848732b…719f` |
  | `75e7357` | `b848732b…719f` |
  | tip | `b848732b…719f` |

  All four are 8 rows. **The rows did not change across the build, and the pin is stale.** The
  pin refresh belongs to BA/PM.
- `AGENTS.md`: `git grep -c lane-inventory -- AGENTS.md` returns no match (exit 1), and
  `git grep -c test-skip-integrity -- AGENTS.md` returns 1. **Only these counts were read.** The
  file was not opened, per the fence.

## Sentence audit (`ABC-114` standard: a sentence stating as fact something measured false)

**Header of `tools/grugops/lane-inventory.js`, lines 1–32: NO FALSE SENTENCE.**

- ll. 5–8, "40 -> 39 … 40 -> 80 … This script is the one thing that sees either": historical, cut
  figures. The two mutants were reproduced at 42→41 and 42→84.
- ll. 11–12, "the `npm test` form, which is the one that can inflate": true. `E-M2` reads 84 at
  the root and 42 under `--dir src`.
- ll. 13–16, "A merge … brings it into both sets at once … an UNTRACKED test file … goes RED until
  it is `git add`ed": true for `*.test.ts` (`E-M3`). **Imprecision:** a merged `.spec.ts` or
  `.test.mjs` reads RED as "not tracked" (G4).
- ll. 20–21, "A `.js` under `tools/` is not collected by vitest, so no `test.exclude` entry can
  reach it": true (`E-M4`, `A4-X`).
- ll. 21–23, "a FIFTH step, like `test-skip-integrity.js`, not one of
  `quality.mandatory_gates`": true on the axis it names. **Imprecision:** the kit's gate runner
  (`workflows/05-pr-quality-gate.md` step 3) calls `test-skip-integrity.js` by name, and
  `AGENTS.md` counts 1 hit for it. Nothing calls this one. The words "like" and "only when it is
  run" undersell that difference.
- ll. 27–30, the exit contract: true. The exit 0, 1 and 2 cases were all observed, with exit 2 in
  `Q6`.

**Runtime diagnostic text (lines 75 and 82): three cases are FALSE in named situations.** Each
fails in the safe direction (a RED):

- "a `test.exclude` glob … is dropping it" is false when the file moved on disk (`Q3b`).
- The same sentence is false when a glob deliberately excludes a tracked docs file (`Q2` setup).
- "NOT tracked by git" is false for a tracked `.spec.ts` or `.test.mjs` (`Q3c`, `Q2c`).

**Ticket § Delivery: NO FALSE SENTENCE.** I checked each claim against git or a re-run:

- the +93 and the empty `src/` numstat
- no `package.json` change
- the three fenced files byte-identical
- the M1 to M5 figures and messages
- 0/0/0 on lint, typecheck and build
- "Live checkouts … ARE present": 27 at this hop
- the hash values

The same "like `test-skip-integrity.js`" imprecision appears there.

- **Ground (2), "a new lane file's ~370 ms floor cannot fit `A6`'s 0.30 s CPU bound": `UNKNOWN - verify`.**
  `vitest.config.ts` records an in-lane per-file CPU slope of 138.9 ms/file under `threads`. The
  ~370 ms figure matches a single file run standalone (QE `ABC-045` read 362 ms). If a trivial
  in-lane file costs about the slope, ground (2) does not exclude the in-lane placement. I did not
  measure it. The ruling does not depend on it, because ground (1) alone excludes in-lane.

**Outside the two places I was asked to audit, but found while reading, one sentence is FALSE.**
It is in the Engineer's `decision` note, `## The limit`: "That is exactly `test-skip-integrity.js`'s
position: the gate runner has to call it." The gate runner calls `test-skip-integrity.js` by name,
and it calls nothing for `lane-inventory.js`. Their positions differ on exactly the point the
sentence asserts. **I name it and do not correct it** (`ABC-114`'s pen/verdict rule).
