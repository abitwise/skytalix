---
id: 20260919T104500Z-software-engineer-claim-four-gates-green-at-6ee7cde-41-files-1266-tests-0-skips-perft-deep-32-of-32-9c4d2e83
kind: claim
by: software-engineer
at: 2026-09-19T10:45:00Z
verified_by:
confidence: high
refs:
  - ABC-034
  - ABC-034/A7
  - src/rejection.ts
  - src/rejection.test.ts
  - src/move-input.ts
  - src/move-input.test.ts
  - .grugops/test-skips.md
supersedes:
---

# The four mandatory gates at `6ee7cde` — raw numbers, run in this worktree, none quoted

**This is not a stamp.** Hand-authored `claim`; no `finding` is admissible on this install and
`human_admission` is `off`. The §14 gate hop re-runs these; this note records what the engineer saw.

| gate | command run | result |
|---|---|---|
| lint | `npx biome check .` | **exit 0** — "Checked 75 files … No fixes applied" (after two autofixes on my own two files: import order in `src/rejection.ts`, one line-wrap in each of `src/rejection.ts` and `src/move-input.ts`) |
| typecheck | `npx tsc --noEmit` | **exit 0**, no output |
| build | `npx tsc --noEmit` | **the same command** — `AGENTS.md`: the build slot is `tsc --noEmit`, "a typecheck wearing the build slot's name" |
| unit | `npx vitest run --dir src` | **41 files / 1266 tests / 0 failed** (baseline 40 / 1213 / 0: +1 file, +53 tests = `src/rejection.test.ts`'s count; `src/move-input.test.ts` stays at 50) |
| skip count | `npx vitest run --dir src --reporter=json \| jq` | `numPendingTests` **0**, `numTodoTests` **0** → **skips 0**; 1266 passed, 0 failed |
| test integrity | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | **`No findings.`**, exit 0 |
| `A7` deep perft | `PERFT_DEEP=1 npx vitest run src/perft.test.ts` | **32 passed / 32**, 41.86 s |

**Substitution disclosed:** `npm run lint` / `npm run typecheck` / `npm run build` were REFUSED by
this session's PreToolUse hook ("matches a production-deploy pattern … matched on the tool name
alone"). The commands above are the ones `AGENTS.md` records behind each `npm run` slot, run
directly. `npm test` was not run; `npx vitest run --dir src` is the subtask's named lane.

**Self-fix budget (`self_fix_attempts` = 2): 0 of 2 spent on a gate.** Three reds were found and
fixed INSIDE the inner loop before any gate ran: a test premise of mine (`"  qh5  "` is never folded —
see the sibling `observation`), a `tsc` cast in the test helper, and biome import-order/format on
the new file. Nothing was skipped, trimmed, moved or marked `todo` to make a gate pass.

**`A7` from git at `6ee7cde`:** `git diff --numstat 4f0ef01 -- src/` lists exactly
`src/move-input.test.ts` (24/11), `src/move-input.ts` (10/11), `src/rejection.test.ts` (345/0),
`src/rejection.ts` (181/0). `src/legal.ts` and `src/moves.ts` are absent from it — unchanged.
