---
id: 20260924T200500Z-software-engineer-claim-rehop-four-gates-green-at-85b66c6-42-files-1364-tests-0-skips-first-run-no-self-fix-b440d384
kind: claim
by: software-engineer
at: 2026-09-24T20:05:00Z
verified_by:
confidence: high
refs:
  - ABC-046
  - ABC-037
  - ADR-0021
  - src/command-input.ts
  - src/line-input.ts
  - src/command-input.test.ts
  - src/line-input.test.ts
  - .grugops/test-skips.md
  - .grugops/context/ruling-abc046-clause6/notes/20260924T195500Z-architect-design-decision-clause-6-stands-as-written-license-the-disarm-a8-amended-to-five-named-edits-no-new-adr-8d2f4b61.md
supersedes:
---

# `ABC-046` re-hop: the four gates at `85b66c6` are green on the first run, 42 / 1364 / 0, and integrity says `No findings.`

**NOT A STAMP. This is a `claim`.** No `finding` is admissible on this install (`AGENTS.md`). This is
the Software Engineer's own gate run on `grugops/ABC-046-rehop` @ `85b66c6`, which is off
`grugops/wave-2026-09-24` @ `5d0fdb0`. It ran in an isolated worktree with the main checkout's
`node_modules` symlinked in (the symlink is gitignored). Every command was RUN from a node script
(`raw-rehop-gates-harness.mjs.txt`); the raw output is `raw-rehop-gates-summary.json.txt`. The tree
measured is the tree that was then committed unchanged. Load average before the run: 23.46 / 12.65 / 8.48.

| gate | command | result |
| --- | --- | --- |
| lint | `npx biome check .` | exit 0, `Checked 76 files in 139ms. No fixes applied.` |
| typecheck | `npx tsc --noEmit` | exit 0, no output |
| build | `npx tsc --noEmit` (the build slot's command) | exit 0, no output |
| unit | `npx vitest run --dir src` | exit 0, **42 files passed (42), 1364 tests passed (1364)**, duration 10.18 s |
| skip count | `npx vitest run --dir src --reporter=json`, then `numPendingTests + numTodoTests` | **0** (pending 0, todo 0, failed 0, 269 suites) |
| test integrity | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | exit 0, `No findings.` |

- **Against the expectation:** the subtask expected 42 / 1364 / 0. It measured **42 / 1364 / 0**.
  The base at `5d0fdb0` reads 42 / 1361 (measured three times in the paired lane sample, sibling
  `observation`), so the change is +0 files and **+3 tests**, which are the three rows the ruling
  named.
- **`self_fix_attempts` spent: 0 of 2.** All four gates were green on the first run.
- **The files on their own**, with the rows appended: `src/command-input.test.ts` **133 / 133**
  (was 131), `src/line-input.test.ts` **30 / 30** (was 29), `src/cli.test.ts` **65 / 65**
  (byte-identical). Source: the control row of the mutant run, 228 / 228.
