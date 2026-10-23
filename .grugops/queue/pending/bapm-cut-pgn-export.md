---
subtask: bapm-cut-pgn-export
role: ba-pm
ticket: plans/epics/EPIC-006-game-session-and-packaging.md
ref: .grugops/context/bapm-cut-pgn-export/
width: 2 (records only; disjoint files from arch-analyse-game-1)
---

# Cut the PGN export ticket (owner put it in scope, …715b9cbf)

## Do
- Record on EPIC-006's page (dated) that PGN export moved from negotiable to in scope by the owner's word; save/resume still waits on the play-test.
- Cut one ticket (next free ABC id): at game end (and on `resign` / a `quit` that leaves mid-game — rule which), the CLI writes the game as a standard PGN file the owner can open in an analysis tool. Settle with testable criteria: when it is written (automatic vs a command, e.g. `pgn`/`save`), where and with what file name, the tag set (Seven Tag Roster + Result/Termination; Difficulty and colour), SAN movetext from the existing `src/san.ts`, result token, an abandoned game's `*`, overwrite rules, and what happens when the file can't be written. Use `plans/uat/EPIC-006-game-1.pgn` as the shape reference.
- Name the risk surfaces (first file write by the CLI → Security/NFR trigger, path handling; ADR-0007/0018 local posture unaffected) and any design question for the Architect. If a choice needs a new ADR, say so — that STOPs to the owner only if it reverses an accepted ADR.
- DoR, size, priority.

## Fences
- Work on `grugops/bapm-cut-pgn-export` (worktree `../wt-bapm-cut-pgn-export` from `main`). Only the EPIC-006 page, the new ticket page and your notes. No `src/`, `plans/board.md`, `plans/traceability.md`, ADRs. Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/bapm-pgn/`. Seal notes with an explicit context root in your worktree. Never push, force, amend or rebase; never merge into `main`.

## Publish
- Seal notes via the plugin writer (task `bapm-cut-pgn-export`), `at` from `date -u`, with a `kind: decision`. Write `## Result` (with the board card line) plus a 10-cell trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.
