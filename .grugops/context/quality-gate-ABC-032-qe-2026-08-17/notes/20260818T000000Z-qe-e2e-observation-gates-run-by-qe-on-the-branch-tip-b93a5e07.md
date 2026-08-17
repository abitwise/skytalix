---
id: 20260818T000000Z-qe-e2e-observation-gates-run-by-qe-on-the-branch-tip-b93a5e07
kind: observation
by: qe-e2e
at: 2026-08-18T00:00:00Z
verified_by:
confidence: high
refs:
  - ABC-032
  - A6
  - .grugops/test-skips.md
supersedes:
---

# The gate, run twice by QE and transcribed: at the delivered tip, and again after my rows

Run in an isolated worktree of this repository. **Nothing was merged, `main` was not touched, and
`.grugops/test-skips.md` was READ ONLY** — it is human-owned, the skip count was 0, and no
justification was needed or authored.

## Run 1 — the delivered tip, `da69986`, working tree clean

| gate | command | result |
|---|---|---|
| lint | `npm run lint` | `Checked 59 files in 97ms. No fixes applied.` — exit 0 |
| typecheck | `npm run typecheck` | exit 0, no output |
| build | `npm run build` | exit 0, no output |
| test | `npm test` | `Test Files 33 passed (33)` / `Tests 957 passed (957)`, 3.29s |
| skip count | `npx vitest run --reporter=json 2>/dev/null \| jq '.numPendingTests + .numTodoTests'` | `0` |
| test integrity | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | `No findings.` — exit 0 |
| perft deep | `PERFT_DEEP=1 npx vitest run src/perft.test.ts` | `Tests 32 passed (32)`, 37.04s |

Every figure matches the engineer's transcription. His run was at `c98b1e2` (the code commit); mine
is at `da69986` (that commit plus his notes), and the two differ by documentation only.

## Run 2 — after my 8 QE rows, `9490b62`

| gate | result |
|---|---|
| lint | `Checked 59 files in 93ms. No fixes applied.` — exit 0 |
| typecheck | exit 0, no output |
| build | exit 0, no output |
| test | `Test Files 33 passed (33)` / `Tests 965 passed (965)`, 2.17s |
| skip count | `0` |
| test integrity | `No findings.` — exit 0 |
| perft deep | `Tests 32 passed (32)`, 41.02s |

**`A6` still holds after my hop, by construction:** 33 files, not 34 — my rows went into
`src/san.parse.test.ts`, this ticket's own new file. The three fenced files are untouched by me as
well as by him, `src/san.ts` is byte-identical to `da69986` (`git diff HEAD -- src/san.ts` empty
after the mutation harness restored it), and skip stays 0.

## Two things about the environment, recorded because they cost time

- **The delivery branch could not be checked out.** `grugops/abc032-parse-san` is held by another
  live agent worktree, so `git checkout` refuses with `fatal: … already used by worktree at …`. My
  work therefore sits on `qe-abc032-work`, branched from that exact tip. It is a fast-forward of the
  delivery branch and nothing else; the Orchestrator can move the ref or cherry-pick the one commit.
- **`PERFT_DEEP=1` takes ~40 s and is not part of `npm test`.** Both my runs include it, because
  `A6` names it explicitly.
