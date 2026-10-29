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

## Result

**Done, on `grugops/se-tools-rating-concurrency` (worktree `../wt-se-tools-rating-concurrency`, from main `bb089d3d`): code `b95961d4`, notes `7b2a4be5`. Not merged; nothing pushed. No game was played.**

- `tools/rating/rating.ts` takes `--concurrency C` in both modes and passes it to `cutechess-cli`'s `-concurrency` as `String(concurrency)`. Without the flag it uses R 2 and D 3, the values the literal had.
- The check is on the raw text, `^[1-8]$`, next to the other flag checks and before any out-dir, probe or build. Anything else throws `--concurrency <v>: not an integer from 1 to 8` and exits 1.
- `machine.txt`, which is also printed, gains `concurrency: 3 (default)` or `concurrency: 2 (default 3)`. `cmd.txt` carries the value in the args. `summary.txt` lists no pins and is unchanged, and there is no analyse step. The usage text and header comment are updated.
- ABC-204 § Dependencies has a dated 2026-10-29 change line: flag added, defaults unchanged, no past reading affected, reason heat on this host, owner `…3081f6d4`. The old lines and Q4's ruling are not edited.
- Gates at `b95961d4`: lint, typecheck and build exit 0. `npm test` **63 files / 2 128 passed**, unchanged. Skips 0, `No findings.`
- Dry check, no games (observation `…58723347`):
  - The bad values `0`, `9`, `1.5`, `x`, plus `2.0`, `0x2` and empty, each in r and d mode, give 14 runs, each exit 1 naming the flag, with no out-dir made.
  - With `CUTECHESS_CLI` pointed at a scratch stub that records its argv and exits 1, so cutechess-cli was never started, main's harness and the new one produced byte-identical `cmd.txt` and argv in r (`-concurrency 2`) and d (`-concurrency 3`).
  - `d --concurrency 2` changes only that one argv value, and `machine.txt` reads `concurrency: 2 (default 3)`.
- Choices beyond the letter (decision `…f999dea4`): `2.0` and `0x2` are refused even though `Number` would read them. The default width is also written to `machine.txt`, so new readings' `machine.txt` has one more line than past ones. The command line is unchanged.
- Notes, sealed and read back 2/2: `../wt-se-tools-rating-concurrency/.grugops/context/se-tools-rating-concurrency/notes/`.
- STOP: none. Per the Orchestrator's `…3081f6d4`, `qe-epic008-q4c` stays held for the owner's width and "counts" or "info only" choice.

### Trace row (10 cells, header order)

| ABC-204 (se-tools-rating-concurrency) | rating harness `--concurrency C` (1–8, text-checked) in r and d; no flag = frozen Q4 widths R 2 / D 3, cmd line byte-identical; width recorded in `machine.txt` | EPIC-008 | — | none moved; ADR-0049 d4 (no host paths in records) | grugops/se-tools-rating-concurrency @ b95961d4 (+ notes 7b2a4be5): tools/rating/rating.ts, ABC-204 § Dependencies | no new test (harness outside npm test by design); npm test 63 files / 2 128 pass, skips 0; dry check: 14 bad-value runs exit 1 by flag name; stub argv/cmd.txt byte-identical to main's harness in r and d; d --concurrency 2 → `-concurrency 2`; no game | waived (0 src/ lines) | — | In Review (branch, not merged) |
