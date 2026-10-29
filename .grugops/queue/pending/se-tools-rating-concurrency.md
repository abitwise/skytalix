---
subtask: se-tools-rating-concurrency
role: software-engineer
ticket: plans/tickets/ABC-204-a-rating-harness-plays-skytalix-against-stockfish-uci-limitstrength-and-against-its-base-in-cutechess-cli-outside-npm-test.md
ref: .grugops/context/se-tools-rating-concurrency/
branch: new grugops/se-tools-rating-concurrency from main, worktree ../wt-se-tools-rating-concurrency
width: 1 of 1 — gates only (lint, typecheck, unit, build); NO games, no timing
---

# ABC-204 harness: a --concurrency flag, frozen defaults unchanged

## Do
- Read Orchestrator `orch-2026-10-29d/…3081f6d4` and `orch-2026-10-29c/…d9513dc1`, and SE `se-tools-rating-host/…f55b4cdf` (the last change to this file).
- `tools/rating/rating.ts`: add `--concurrency N` to **both** modes (`r` and `d`). It is passed to cutechess-cli's `-concurrency` (now hard-coded at about line 399).
  - **No flag → today's values exactly: r = 2, d = 3.** Every past reading's command line must come out byte-identical when the flag is absent.
  - Validate: a positive integer from 1 to 8. Anything else throws before any work, naming the flag (same style as `--rounds`).
  - Write the concurrency in force into the run's records: the machine/preamble lines, `cmd.txt` (already via the args), and `summary`/`analyse` if it lists pins. Mark a non-default value plainly (for example `concurrency: 2 (default 3)`).
  - Update the usage text and the header comment.
- **ABC-204 page:** add a dated 2026-10-29 change line where the pins/`-concurrency` are recorded (§ Dependencies or the Design ruling). Say: flag added, defaults unchanged, no past reading affected, reason = owner `…3081f6d4` (heat on this host). Don't edit old lines.
- **Dry check, no games:** (1) bad values (`0`, `9`, `1.5`, `x`) exit 1 naming the flag; (2) with the flag absent, the built cutechess argument list equals today's for both modes. Prove it by a unit-level check or by printing the arg list without spawning, without starting cutechess. (3) `--concurrency 2` in `d` mode yields `-concurrency 2`. If you need the harness to get as far as building the args, stop it before cutechess starts, as the previous SE hop did. Record what you ran.

## Fences
- Work only in your worktree. No `src/` or `data/` edits. No games and no timing.
- Never push, force, amend or rebase. Never merge into main. No board edits.
- Records: class and count only (ADR-0049 d4). No host paths or usernames in any committed file.

## Publish
- Gates: lint, typecheck, build, `npm test` (63 files / 2 128 or more; say if the count changes). Skips 0.
- Commit on your branch. Seal notes (task `se-tools-rating-concurrency`) with `at` from `date -u`, including a `kind: decision`.
- Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.
