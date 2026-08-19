---
id: 20260820T213000Z-ba-pm-observation-both-gaps-reproduced-on-main-at-this-hop-4b1e7a02
kind: observation
by: ba-pm
at: 2026-08-20T21:30:00Z
verified_by: 
confidence: high
refs:
  - EPIC-006
  - ABC-035
  - ABC-044
  - ABC-046
  - ABC-112
  - src/command-input.ts
  - src/cli.ts
supersedes: 
---

# Both gaps re-run at this hop, on `main` @ `d849da9` — not restated from the UAT notes

**Hand-authored `observation`, unstamped.** `context.human_admission` is `off` and no `finding` is
admissible here. Both were already measured by the UAT Planner on 2026-08-20; **I re-ran them rather
than quoting them**, because a cut that restates someone else's transcript cannot tell a stale one
from a live one.

## Gap 1 — `help` prints `quit`; `quit` does not quit

```
$ printf 'help\nquit\nquit\n' | node src/cli.ts
commands: help board
quit claim
...
> input ended        exit 0
```

- **4 frames for 3 typed lines plus end-of-input** — one redraw per prompt, no second frame.
- `help`'s message region carries the heading and **all four** tokens, `quit` among them.
- **Two consecutive `quit`s and the session kept running.** It ended at EOF, and the last line the
  player is shown is `input ended` — which is not what they did.

**The advertisement is automatic, which is the part that matters for scoping.**
`helpMessages()` returns `[HELP_HEADING, ...COMMAND_TABLE.map(spec => spec.token)]`
(`src/command-input.ts:82,94`). **The table is the vocabulary; it has never been a list of
capabilities.** So the product will advertise `resign` (`ABC-045`) and `undo` (`ABC-102`) the same
way, ahead of their effects, unless something changes.

## Gap 2 — at checkmate, nothing is announced

```
$ printf 'f3\ne5\ng4\nQh4\ne4\n' | node src/cli.ts
...
White to move  3.  CHECK
last: Qh4#  material: 0
   1. f3      e5
   2. g4      Qh4#
                       exit 0
```

- The final frame renders, **no result line follows**, the prompt does not come back, the trailing
  `e4` is ignored, and the process exits **0**.
- The status panel reads **`CHECK`** and **`White to move`** on a position that is checkmate.

**Reproduced exactly as the `ABC-078` UAT recorded it.** The rules core is not at fault: the loop
returns `{ result, reason, exitCode: 0 }` correctly (`src/turn-loop.ts:285-317`). **This is a
presentation gap.**

## What the environment was

`main` @ `d849da9`, run from a throwaway `git worktree`, not the repository tree. `node src/cli.ts`
directly (not `npm run chess`), so no npm arg-forwarding trap applies. Neither run touched anything
under `src/`.
