---
id: 20260819T221000Z-qe-e2e-claim-the-gate-i-ran-and-the-game-i-played-e3f4a5b6
kind: claim
by: qe-e2e
at: 2026-08-19T22:10:00Z
verified_by:
confidence: high
refs:
  - ABC-043
  - NFR-008
  - N8-LANE
  - ADR-0014
  - ABC-108
supersedes:
---

# The blocking gate, run by me, in a contained lane — and the game, played by me

No `finding` is admissible on this install, so this is a `claim`: these are my measurements at my own
hand, not a stamped verdict.

**Lane.** Isolated agent worktree at `46457b8` (`grugops/quality-gate-ABC-043-qe-2026-08-19`),
`npm install` run fresh in it. Node **v24.12.0**. The repo root was not used for any measurement — the
brief records three bad readings taken there.

## The gate

| step | command | my result | engineer's figure |
|---|---|---|---|
| suite | `npx vitest run` | **1189 passed / 39 files**, exit 0, wall 3.70 s | 1189 / 39 ✅ |
| skips | `npx vitest run --reporter=json \| jq '.numPendingTests + .numTodoTests'` | **0** | 0 ✅ |
| integrity | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | `No findings.`, exit **0** | same ✅ |
| deep perft | `PERFT_DEEP=1 npx vitest run src/perft.test.ts` | **32 passed**, 36.49 s | 32, 36.19 s ✅ |
| lint | `npm run lint` | 70 files, no fixes applied, exit 0 | same ✅ |
| typecheck | `npm run typecheck` | clean, exit 0 | same ✅ |
| build | `npm run build` | clean, exit 0 (it is `tsc --noEmit`) | same ✅ |

**Every figure the engineer published reproduces.** Nothing was taken on report.

**Re-run after mutation, to prove the tree I am reporting on is the delivered tree:**
`git status --short` empty, `npx vitest run` **1189 passed / 39 files**, `user 13.86 s`.

## The lane cost — REPORTED, NOT GRADED

`ADR-0014` rules `NFR-008` BREACHED and the brief forbids me to grade an NFR bar. These are readings.

| reading | mine | engineer's |
|---|---|---|
| default lane, CPU (`user`) | **13.86 s**, n=2 (14.42 s under load, 13.86 s quiet) | median **13.87 s** |
| default lane, wall | 3.70 s / 3.19 s | median 3.14 s |

**13.86 s reproduces the engineer's 13.87 s to the hundredth on a second tree.** `NFR-008`'s CPU
clause is 13 s; `ADR-0014` reads 14.480 s. The lane is over the clause before and after this ticket,
and this ticket's measured **+0.86 s** is neither the cause nor the fix. **`N8-LANE` is a rate limit,
not a grant, and I claim nothing against it.** `ABC-108`'s `OQ-1` is Architect/Design's.

## The game, played by hand — the whole point of the brief

```
$ printf 'e2e4\n' | npm run chess --silent -- --colour white
```

Exit **0**. Three frames: the start position; the position after `e4` with `thinking...` and
`1. e4` in the history pane; and the position after the engine's reply with `1. e4      Nc6` and
`White to move  2.`. Then `> input ended`.

**A human typed `e2e4`, White played `e4`, the real engine searched against a real wall clock and
answered `Nc6`, and EOF ended it cleanly.** I reproduced the Orchestrator's run independently, in a
different tree, and got the same move. It plays chess.

## The other things I ran at the shell, not through the suite

| what | result |
|---|---|
| `A3`'s child, by hand (the `--import` hook, `printf 'e4\n'`) | one frame, the prompt, then `internal error: a bug ended this session, and it is not a chess outcome` on stderr — **exit 70**, no chess word on either channel |
| the delivered reader's totality — **71 pathological lines**, one session | **exit 0**, `internal error` count **0**, 37,526 bytes. No human input reaches `A3` |
| `node src/cli.ts --colour purple < /dev/null` | exit **1**, usage line on stderr, no frame |
| the `G6` orphaning shape on a live stdin (FIFO held open) | **HUNG** — 1,483 bytes, no exit, killed after 10 s |
| the same shape on `< /dev/null` | exit 0 at 501 bytes — reproduces the engineer's caveat exactly |
| `spawnSync("npm", …)` at a 2 s bound | `Error: spawnSync npm ETIMEDOUT`, and **no orphaned grandchild** 1.5 s later |

## One thing I could not verify and will not pretend to

**`ENGINE_DEEP` / `SEARCH_DEEP` / `INPUT_DEEP` were not run at this hop.** The brief named the
blocking gate and `PERFT_DEEP`; those three are opt-in lanes for modules this ticket did not touch
(all seven merged modules are byte-identical, measured). Their state at this tip is
**`UNKNOWN - verify`**, and nothing in this note rests on them.
