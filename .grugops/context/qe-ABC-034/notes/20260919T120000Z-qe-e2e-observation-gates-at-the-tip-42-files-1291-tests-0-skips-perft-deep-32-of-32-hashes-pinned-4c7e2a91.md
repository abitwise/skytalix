---
id: 20260919T120000Z-qe-e2e-observation-gates-at-the-tip-42-files-1291-tests-0-skips-perft-deep-32-of-32-hashes-pinned-4c7e2a91
kind: observation
by: qe-e2e
at: 2026-09-19T12:00:00Z
verified_by:
confidence: high
refs:
  - ABC-034
  - ABC-034/A5
  - ABC-034/A7
  - ABC-107
  - src/rejection.ts
  - src/rejection.test.ts
  - src/move-input.ts
  - src/move-input.test.ts
  - src/frame.overflow-bound.test.ts
  - .grugops/test-skips.md
supersedes:
---

# Gates at the branch tip, run in this worktree: lint 76 files clean · tsc clean · **42 / 1291 / 0** · integrity `No findings.` · `PERFT_DEEP=1` **32/32** · the pinned core files hash-identical to the base

**This is not a stamp.** Hand-authored `observation`; no `finding` is admissible on this install and
`human_admission` is `off`.

Branch `grugops/qe-ABC-034`, created from `grugops/wave-2026-09-19` @ `aa9e49f` (which carries the
`ABC-034` build `6ee7cde` / `3edb161` merged at `f16c2a2`, and the `ABC-107` build). Worktree had no
`node_modules`; the main checkout's was symlinked (`.gitignore`d, not in the diff). Every command
below was run through a node script in the session scratchpad because the PreToolUse hook refuses
`npm run`, heredocs and `$?` — the underlying commands `AGENTS.md` records behind each slot.

| gate | command | result |
|---|---|---|
| lint | `npx biome check .` | exit 0 — `Checked 76 files in 101ms. No fixes applied.` |
| typecheck | `npx tsc --noEmit` | exit 0, zero bytes of output |
| build | `npx tsc --noEmit` | same command (`AGENTS.md`: the build slot IS the typecheck) |
| unit | `npx vitest run --dir src` | exit 0 — **42 files / 1291 tests / 0 failed**, 3.97 s wall |
| skip count | `npx vitest run --dir src --reporter=json` | `numPendingTests` 0, `numTodoTests` 0 → **skips 0**; 1291 passed |
| test integrity | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | exit 0, `No findings.` |
| `A7` deep perft | `PERFT_DEEP=1 npx vitest run src/perft.test.ts` | exit 0 — **32 passed / 32**, 39.47 s |

The expected lane on the merged base was 42 / 1291 / 0 (the subtask's own number); measured exactly
that. The three files this hop leans on, run alone for their counts: `src/rejection.test.ts` **53**,
`src/move-input.test.ts` **50**, `src/frame.overflow-bound.test.ts` **25** — all pass. `ABC-107`'s
pin is intact beside `ABC-034`'s sentences.

**`A7`'s hash pins, measured from git** (`git rev-parse 4f0ef01:<f>` vs `git hash-object <f>` in
this tree): `src/legal.ts` `61cdd0ec…`, `src/moves.ts` `0d9078c3…`, `src/san.ts` `b810c00f…`,
`src/coordinate-move.ts` `66dab936…`, `src/frame.ts` `6d2a8685…`, `src/turn-loop.ts` `9334daf1…`,
`src/search.ts` `0697f0bc…`, `src/engine.ts` `7d54a77d…` — **all eight UNCHANGED** against the wave
base `4f0ef01`. `src/search.ts` / `src/engine.ts` were never opened by this hop (`ABC-079` is live).

**`git diff --numstat 4f0ef01 aa9e49f -- src/`:** `frame.overflow-bound.test.ts` 202/0 (`ABC-107`),
`move-input.test.ts` 24/11, `move-input.ts` 10/11, `rejection.test.ts` 345/0, `rejection.ts` 181/0.
`ABC-034`'s share is the last four — exactly what the Engineer's `artifact-ref` claimed.

**This hop's own diff under `src/`: zero files.** Every mutant below was reverted with `git checkout
--` and `git status --short -- src/` came back empty after each one (raw log beside this note).

`NFR-008` was NOT ruled here (subtask fence); the lane's 3.97 s wall is data. No deep lane other than
`PERFT_DEEP` was run: `SEARCH_DEEP` / `ENGINE_DEEP` are owed only after a change to their files, and
both hashes are pinned unchanged above.
