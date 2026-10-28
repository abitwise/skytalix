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

## Result

**Done, on `grugops/se-tools-rating-host` (worktree `../wt-se-tools-rating-host`, from main `54bcf923`): code `2bc28539`, notes `f155420c`. Not merged; nothing pushed.**

- `tools/rating/rating.ts` reads `CUTECHESS_CLI` and `STOCKFISH` from the environment. The previous-host defaults are gone and no host path is in the source. An unset or empty variable stops the run at module load, before any work, with `<NAME> is not set: give the tool's path`. An unreadable one stops it with `<NAME> is not a readable file`.
- Pins, checked against `cutechess-cli 1.5.1` and `id name Stockfish 19` first: cutechess-cli `fb4fc2aa…6e1c` → `dc776901…f40a`; Stockfish `dc2f18c3…251f` → `c78c22a9…52d2`. The pin check and the openings throw are unchanged.
- ABC-204 § Dependencies has a dated 2026-10-28 change line. The Q2 pin and the R command shape name `$STOCKFISH` / `$CUTECHESS_CLI`. The old pin lines and the 2026-10-23 readings are untouched, and EPIC-008 is untouched. `70-runbook.md` and `src/` never named the paths, so they have no edit.
- **Beyond the brief's letter (flag; decision `…f55b4cdf`):** two macOS-only calls broke on Linux, and I fixed both.
  1. The preamble's `sysctl machdep.cpu.brand_string` exits 1 here, and it threw before any pin line printed. It now uses `node:os` `cpus()`/`platform()`, which gives the same text on macOS.
  2. `host.log`'s `foreign_vitest_procs` shared a `try` with `notifyutil`, so it would always read 0 on Linux. That is a false "alone" for option B. It now has its own `try`.
- Gates at `2bc28539`: lint, typecheck and build exit 0. `npm test` **63 files / 2 128 passed**, unchanged. Skips 0, `No findings.`
- Dry check (no games): unset, empty and unreadable variables each exit 1 and name the variable. With the env set, both lines print `= pin`. The run was SIGTERMed as a process group right after the `openings:` line, during the clone/build step: no `cmd.txt`, no `r.out`, cutechess-cli never spawned. Observation `…bf9e7c30`.
- Notes, sealed and read back 2/2: `../wt-se-tools-rating-host/.grugops/context/se-tools-rating-host/notes/` — decision `20261028T211542Z-software-engineer-decision-f55b4cdf`, observation `20261028T211542Z-software-engineer-observation-bf9e7c30`.
- STOP: none. For the Orchestrator: ABC-204's line 131 still reads "chip, Darwin" in prose, a dated record I did not edit. ABC-202 and the game-1 analysis keep previous-host paths, as history.

### Trace row (10 cells, header order)

| ABC-204 (se-tools-rating-host) | rating harness on the new host: tool paths from env (`CUTECHESS_CLI`, `STOCKFISH`, no defaults), sha256 re-pinned (cutechess `fb4fc2aa…6e1c` → `dc776901…f40a`, Stockfish `dc2f18c3…251f` → `c78c22a9…52d2`), Linux preamble/host-log fixes | EPIC-008 | — | none moved; ADR-0049 d4 (no host paths in records) | grugops/se-tools-rating-host @ 2bc28539 (+ notes f155420c): tools/rating/rating.ts, ABC-204 § Dependencies + Q2 + R command shape | no new test (harness outside npm test by design); npm test 63 files / 2 128 pass, skips 0; dry check: missing/empty/unreadable var exit 1 by name, both pins `= pin`, killed before game 1 | waived (0 src/ lines) | — | In Review (branch, not merged) |
