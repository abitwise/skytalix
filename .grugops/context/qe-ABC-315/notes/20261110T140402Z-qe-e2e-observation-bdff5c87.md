---
id: 20261110T140402Z-qe-e2e-observation-bdff5c87
kind: observation
by: qe-e2e
at: 2026-11-10T14:04:02Z
verified_by: 
confidence: high: every reading run by QE on f67eca64 after the merge, one run each
refs:
  - qe-ABC-315
  - ABC-315
  - grugops/qe-ABC-315
  - grugops/ABC-315
  - f67eca64
  - 0053eed0
  - 2abb1744
  - R1
  - G1
  - G2
  - src/cli.ts
  - src/uci.ts
  - src/version-file.ts
  - src/version.test.ts
  - memory-bank/90-agents-md-command-log.md
  - AGENTS.md
  - qe-ABC-315/20261110T135825Z-qe-e2e-decision-eda9d104
  - sec-ABC-315/20261110T135731Z-security-nfr-decision-0088bc3b
  - se-ABC-315-fix/20261110T140059Z-software-engineer-observation-39f127ea
supersedes: 
seal: sha256:e0925307c19bf85e7e04fb9799fe1c151bc76503d678cbfcaf14b3b260426a24
---

# qe-ABC-315 observation: re-check of the R1, G1, G2 fix on grugops/ABC-315 at 0053eed0 (fix commit 2abb1744)

Checked on grugops/qe-ABC-315 after merging grugops/ABC-315 with --no-ff (merge f67eca64, parents 0a392feb and 0053eed0). Baselines: qe-ABC-315/20261110T135825Z-qe-e2e-decision-eda9d104 (G1, G2) and sec-ABC-315/20261110T135731Z-security-nfr-decision-0088bc3b (R1). QE re-ran everything and reused none of the SE's output (se-ABC-315-fix/20261110T140059Z-software-engineer-observation-39f127ea).

## The fix as written (2abb1744, read against Security's exact text)
- src/cli.ts: the `if (parsed.version)` arm and its comment now sit inside the existing `try`, as its first statement. The existing `catch` writes `INTERNAL_ERROR` and sets 70. The `sink.on("error", …)` EPIPE arm is still before the `try`. This matches 0088bc3b's text.
- src/uci.ts: inside `if (versionOnly)`, the EPIPE arm comes first. Then `try { sink.write(`${readVersionLine()}\n`); } catch { process.stderr.write(`${INTERNAL_ERROR}\n`); process.exitCode = INTERNAL_ERROR_EXIT_CODE; }`, then `return`. It uses uci.ts's existing constants: "internal error: a bug ended this session" and 70. This matches 0088bc3b's text.
- src/version-file.ts: no change since the feature commit 278a536c. `git log main..HEAD -- src/version-file.ts` lists only 278a536c.
- The fix commit touches src/cli.ts, src/uci.ts, src/version.test.ts and memory-bank/90-agents-md-command-log.md, nothing else. README.md has not changed since 32edaf91.

## R1 reproduced (also Security's R1 closure check)
On a scratch copy outside the repository, holding src/, dist/ (built from this head) and bin/, every ancestor directory was checked: there is no package.json up the tree.
- `node src/cli.ts --version`: exit 70. stdout is 0 B. stderr is one line, `internal error: a bug ended this session, and it is not a chess outcome`.
- `node src/uci.ts --version`: exit 70. stdout is 0 B. stderr is one line, `internal error: a bug ended this session`.
- `node dist/uci.js --version` and `bin/skytalix-uci --version` gave the same as uci.ts: exit 70, the one line.
- In all four runs, stderr and stdout contain no stack frame (`at `), no ENOENT and no absolute path (0 matches each).
- With package.json copied into the same scratch copy, all four print `skytalix 1.0.0` and exit 0, with 0 B of stderr.

## G1
memory-bank/90-agents-md-command-log.md: the ABC-315 paragraph ends with the sentence from eda9d104, word for word ("Without the `--` separator npm takes `--version` as its own flag: … does not hold for `--version`."). AGENTS.md is not in the fix commit. Its only change on the branch is the feature commit 278a536c (1 line).

## G2 red-green (src/version.test.ts, run alone under the host lock with the one-file heap prefix)
- The three-line `sink.on("error", …)` arm was removed from uci.ts's versionOnly block. The G2 row fails with `expected -1 to be greater than or equal to 0`: 1 failed, 4 passed, exit 1.
- Restored with `git checkout -- src/uci.ts`: 5 passed out of 5, exit 0. `git status --porcelain` is empty.
- An extra mutation, the re-throw changed to `return`: the G2 row fails on its re-throw match, 1 failed, 4 passed. Restored the same way. The tree is clean again (`git diff HEAD --quiet` is true).

## Gates, each run alone under the host lock, on f67eca64
- `npm run typecheck`: exit 0.
- `npm run lint` (biome check .): exit 0, 150 files, no fixes.
- `npm run build`: exit 0.
- `npm test`: exit 0. 72 files, 2740 passed, 0 failed, 0 skipped (2739 at baseline plus the G2 row). Duration 9.01 s, one run.
- The first single-file vitest run without the heap prefix was refused by the heap guard (heap above the one-file row). No test ran in it. It was re-run with the prefix and is not counted above.

## Behaviour against main
- Main's baseline: an export of main at c57c17bb into a scratch directory, built there with the same compiler. Main was not touched.
- `printf 'uci\nisready\nquit\n' | bin/skytalix-uci` on this head against main's build: both exit 0. stdout (251 B) and stderr (0 B) are cmp-identical.
- `node src/cli.ts --version` and `bin/skytalix-uci --version`: `skytalix 1.0.0`, exit 0.
- `bin/skytalix-uci --version | true`: exit 0 in 20 of 20 runs, 0 B of stderr. `node src/cli.ts --version | true`: exit 0.
- README art (the block between the first fence pair) cmp assets/readme-art.txt: exit 0.
- `node tools/grugops/records-path-check.js --base main --head grugops/qe-ABC-315`: clean, exit 0.

## Not run
- No spawn row pins the missing-package.json case. Security welcomed one but did not require it, and QE does not ask for one: the hand reproduction above covers it.
- The Windows .cmd launcher and GitHub's render: UNKNOWN - verify, unchanged from eda9d104.
