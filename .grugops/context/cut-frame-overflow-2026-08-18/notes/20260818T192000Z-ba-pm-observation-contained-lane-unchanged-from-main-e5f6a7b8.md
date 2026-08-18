---
id: 20260818T192000Z-ba-pm-observation-contained-lane-unchanged-from-main-e5f6a7b8
kind: observation
by: ba-pm
at: 2026-08-18T19:20:00Z
verified_by:
confidence: high
refs:
  - ABC-107
  - ABC-050
  - NFR-008
supersedes:
---

# The contained lane on `grugops/cut-frame-overflow` — **unchanged from `main`**, as it must be

This hop changes **zero files under `src/`** (measured: `git diff --name-only` over the branch shows
only `plans/`, `.grugops/` paths), so the suite cannot move. Run to prove that, not to discover it.

| step | command | result |
|---|---|---|
| test | `npx vitest run --exclude '**/node_modules/**' --exclude '.claude/**'` | **35 files, 999 tests, all passed**, 2.54 s |
| skip count | same, `--reporter=json \| jq '.numPendingTests + .numTodoTests'` | **0** |
| lint | `npx biome check src tools spike vitest.config.ts` | **Checked 59 files, no fixes applied**, exit **0** |
| typecheck | `npm run typecheck` (`tsc --noEmit`) | clean, exit **0** |
| build | `npm run build` (`tsc --noEmit`) | clean, exit **0** |

**999 tests / 35 files / skip 0 — identical to the figure `main` carries.** Machine: Apple M3, Node
on darwin/arm64, in the worktree `.claude/worktrees/agent-a1747c455e7dccf9c`.

**The `--exclude` flags are load-bearing and are not cosmetic.** `vitest.config.ts` declares no
`exclude`, so a root-level run sweeps sibling agent worktrees and reports another branch's tree as
this one's — that is `ABC-050`, already routed, and per the brief I did not chase it. The lint
command is scoped for the same reason: `biome check .` here counts hundreds of files from siblings,
`biome check src tools spike vitest.config.ts` counts **59**, which is this repository.

**Nothing was merged and nothing was deployed.** No column was moved; the board rows this hop
touched carry DoR text and annotations only.
