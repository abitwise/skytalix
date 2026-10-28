---
subtask: se-tools-rating-host
role: software-engineer
ticket: plans/tickets/ABC-204-a-rating-harness-plays-skytalix-against-stockfish-uci-limitstrength-and-against-its-base-in-cutechess-cli-outside-npm-test.md
ref: .grugops/context/se-tools-rating-host/
branch: new grugops/se-tools-rating-host from main, worktree ../wt-se-tools-rating-host
width: 1 of 2 — gates only (lint, typecheck, unit, build); NO real-clock reading, no games
---

# ABC-204 harness on the new host: tool paths from the environment, sha256 re-pinned

## Do
- Read Orchestrator `orch-2026-10-28a/…5dbd717b` and `orch-2026-10-27o/…e018297c`.
- `tools/rating/rating.ts`: take the `cutechess-cli` and Stockfish paths from the environment (`CUTECHESS_CLI`, `STOCKFISH`). **Remove the previous-host defaults.** A missing or unreadable variable stops the run before game 1 and names the variable. Do not put a host path in the source.
- The paths for this host are in the env file named in your spawn prompt. Use them only to run the tools, and keep them out of every record.
- Re-pin `CUTECHESS_SHA256` and `STOCKFISH_SHA256` to this host's binaries. Confirm `cutechess-cli --version` = 1.5.1 and `id name` = Stockfish 19 before you pin.
- The pin check stays as it is: `= pin` / `DIFFERS`, and the openings pin throws.
- Anything else that names the tool paths (docs, `70-runbook.md`, tests): update the paths to the variable names.
- **ABC-204 § Dependencies:** add a dated change line for 2026-10-28. Give the old and new sha256 values (short form `xxxxxxxx…xxxx`, the page's convention), the new tool sources (Stockfish 19 build; cutechess-cli 1.5.1 built from cutechess commit 5e84232b), "env paths, no defaults", and the reason (host move, owner `…5dbd717b`). Don't silently edit the old pin lines; the 2026-10-23 readings stand as previous-host records. EPIC-008 § Dependencies is BA/PM's line (`bapm-epic008-hostB`), so don't edit it.
- Run a dry check that needs no games: the preamble/hash lines print `= pin` for both tools with the env set, and the missing-variable path fails clearly. If the script has no such mode, run the smallest step that prints the pin lines and kill it before game 1. Record what you ran.

## Fences
- Work only in your worktree. No `src/` or `data/` edits. No games and no timing.
- Never push, force, amend or rebase. Never merge into main. No board edits.
- Records: class and count only (ADR-0049 d4). No host paths or usernames in any committed file.

## Publish
- Gates: lint, typecheck, build, `npm test` (expect 63 files / 2 128 or more; say if the count changes). Skips 0.
- Commit on your branch. Seal notes (task `se-tools-rating-host`) with `at` from `date -u`, including a `kind: decision`.
- Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.
