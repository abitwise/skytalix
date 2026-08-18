---
id: 20260818T233500Z-software-engineer-artifact-ref-the-repair2-branch-its-commits-and-every-file-it-touched-9b0f2ad7
kind: artifact-ref
by: software-engineer
at: 2026-08-18T23:35:00Z
verified_by:
confidence: high
refs:
  - ABC-033
  - src/move-input.ts
  - src/move-input.test.ts
  - repair2-ABC-033-2026-08-18
supersedes:
---

# Branch, commits, files — repair round 2 of 2 on `ABC-033`

**Branch** `grugops/abc033-repair2`, cut from `grugops/quality-gate-ABC-033-delta` @ `723c65b`.
**Not merged.** No remote exists in this repo, so nothing was pushed and no PR was opened.

## Commits

| commit | what |
|---|---|
| `8639667` | `fix(ABC-033)` — the false sentence in `attemptsOn`'s doc comment corrected, its two copies (the step-1 inline comment and the test file's precedence doc comment) corrected with it, and the stub-free `B2b4` precedence case added |
| `30f26fe` | `docs(ABC-033)` — the two correcting notes: the `G5` `confidence: high` retraction, and the `G2` rejection reason-code class |
| (this commit) | `docs(ABC-033)` — the decision, gate and artifact-ref notes, and the queue sweep |

## Production files changed — two, both `move-input`

- `src/move-input.ts` — **comments only.** No statement, no signature, no export, no control flow
  changed. `git diff 723c65b..HEAD -- src/move-input.ts` touches only comment lines.
- `src/move-input.test.ts` — one new fixture constant, one round-trip row, one new test case, and
  two corrected doc comments.

`src/san.ts`, `src/coordinate-move.ts` and `src/frame.ts` were **not** touched; `A7` holds from git.

## Tests

- Added: `coordinate outranks SAN on a real line both readers claim — `B2b4` is the pawn, not the
  bishop` (in the `ABC-033 A3` describe, beside the stub precedence case).
- Added: one `toFen` round-trip row for `SHIFT_SLIP_FEN` = `4k3/8/8/8/8/8/1P1B4/4K3 w - - 0 1`.
- Suite: **1049 / 36 files / 0 skipped**, from a **1047 / 36 / 0** baseline.

## Commands run

```
npx vitest run src/move-input.test.ts
npx vitest run --exclude '**/node_modules/**' --exclude '.claude/**'
npx vitest run --exclude '**/node_modules/**' --exclude '.claude/**' --reporter=json | jq '.numPendingTests + .numTodoTests'
node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0
npx biome check --write src/move-input.ts src/move-input.test.ts
npx biome check src tools spike vitest.config.ts
npx tsc --noEmit
git diff --stat 8c84265..HEAD -- src/
```

Results are in the gate observation note alongside this one; none is restated here.

## Queue

Claimed by hand per Workflow 17 — `mkdir -p .grugops/queue/claimed` then a bare
`mkdir .grugops/queue/claimed/abc033-repair2` (the atomic act). Subtask file moved
`.grugops/queue/pending/abc033-repair2.md` → `.grugops/queue/done/abc033-repair2.md` in the final
commit.

## Not done, deliberately

No merge, no deploy, no board column moved, no trace row written — this is a repair hop inside
`ABC-033`'s review cycle and the ticket's column is the Orchestrator's to move. `plans/board.md` and
`plans/traceability.md` were not edited.
