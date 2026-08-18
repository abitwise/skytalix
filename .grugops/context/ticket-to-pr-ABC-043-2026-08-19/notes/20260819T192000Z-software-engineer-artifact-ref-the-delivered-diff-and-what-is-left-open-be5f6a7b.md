---
id: 20260819T192000Z-software-engineer-artifact-ref-the-delivered-diff-and-what-is-left-open-be5f6a7b
kind: artifact-ref
by: software-engineer
at: 2026-08-19T19:20:00Z
verified_by:
confidence: high
refs:
  - ABC-043
  - src/cli.ts
  - src/cli.test.ts
  - AGENTS.md
  - plans/traceability.md
supersedes:
---

# The delivered diff, the commits, and what is left open

## Branch and commits

`grugops/abc043-the-live-session`, branched off `main` @ **`54cbb23`** — the brief names `fe09bad`,
and `54cbb23` is its board-and-queue-only descendant, as the brief itself states. Tip `39deb99`.

| commit | what |
|---|---|
| `57db29a` | `chore(queue)` — the claim taken by hand (bare `mkdir`), subtask moved `pending` → `claimed` |
| `c2c5da1` | `feat(cli)` — the wiring and its criteria |
| `eb43572` | `test(cli)` — the hung-child bound and the blind template blanker, both repaired after mutation found them |
| `39deb99` | `docs(agents)` — the `Dev / run` slot |

## The diff, measured rather than described

```
git diff --numstat 54cbb23 39deb99 -- src
704  54  src/cli.test.ts
 91  17  src/cli.ts
```

Nothing else under `src/`. `git diff --exit-code 54cbb23 39deb99` on `src/turn-loop.ts`,
`src/frame.ts`, `src/render-seam.ts`, `src/line-input.ts`, `src/engine.ts`, `src/move-input.ts`,
`src/command-input.ts` — **all seven byte-identical**.

Outside `src/`: `AGENTS.md` (+10/−2, the `Dev / run` slot), `plans/traceability.md` (one row touched
in place, four cells, one header paragraph), and this task's queue records and notes.

**`plans/board.md` NOT opened. The ticket page NOT edited. No ADR opened. No `package.json` change —
`--import` is child-only and never enters `npm run chess`. No dependency added. Not merged, not
deployed.**

## `AGENTS.md`'s `Dev / run` slot — what changed and what was RUN first

The slot said *"It PRINTS A BOARD; it does not play a game — no move can be typed until ABC-043."*
That sentence is now false. The replacement records the game, the `> ` prompt, the up-to-3-seconds
engine move, the exit codes (0 / 1 / 70), and two runs made before they were written:

```
node src/cli.ts               < /dev/null   real 0.077 s   exit 0   one board, prompt, `input ended`
node src/cli.ts --colour black < /dev/null   real 3.075 s   exit 0   two boards (one engine ply)
```

The separator example, the option list and the npm-eats-the-flag warning are left exactly as they
were — `ABC-065`, `ABC-067` and `ABC-071` all assert over that window and all stay green.

## What is left open, and for whom

1. **`A3`'s substitution of `./command-input.ts` is an EXTENSION of BA/PM's ruling** — the licence
   names the engine seam. Reasoning and the alternatives in the decision note. **For QE and
   Architect/Design.**
2. **The real engine never runs end to end**, on any criterion, in any lane. BA/PM named the gap;
   this hop measured what it would cost (3.09 s of wall per ply) and did not close it. **No ticket is
   cut.**
3. **`N8-LANE` is not graded.** `src/cli.test.ts` medians 3.09 s CPU against a 650 ms bar, and the
   base file already read 2.12 s. **For `ABC-108`'s `OQ-1`.**
4. **The board is where the Orchestrator left it.** The `In Development` → `In Review` transition
   this role normally owns was NOT made, because the brief forbids moving a column.
5. **The crash path prints no detail.** Deliberate — see the decision note — and the shape a later
   ticket would need if detail is wanted is named there.

## How to re-run what I ran

```
npx vitest run                                              # 1189 / 39 files
npx vitest run src/cli.test.ts                              # 50
npx vitest run --reporter=json | jq '.numPendingTests + .numTodoTests'   # 0
node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0
PERFT_DEEP=1 npx vitest run src/perft.test.ts               # 32
npm run lint && npm run typecheck && npm run build
```

Run them in a contained worktree. The repo root is contaminated and has already cost three bad
measurements this session.
