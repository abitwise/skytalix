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

## Result (ba-pm, 2026-10-23T19:45Z): **`ABC-203` is cut: Ready, M, P1, DoR 10/10. EPIC-006 records PGN export as in scope on the owner's word. No STOP.**

Claimed at 19:36:11Z. This is records only, on `grugops/bapm-cut-pgn-export` in `../wt-bapm-cut-pgn-export`, cut from `main` `f4eec73d`. There is one commit, **`d6a47fd0`**. It is not merged and not pushed.

The notes are in `.grugops/context/bapm-cut-pgn-export/notes/`. They were sealed with grugops 2.1.0 `context-io.js` `admitAndAppend` (context root: the worktree's) and read back 2/2:
- `20261023T194353Z-ba-pm-observation-f400c835`: what was read, plus the npm cwd probe (`scratchpad/bapm-pgn/npm-cwd.txt`);
- `20261023T194353Z-ba-pm-decision-0c2867c1`: the rulings.

**The behaviour `ABC-203` specifies:**
- **When:** automatically, once, when the loop returns a non-null `reason`. That covers the 8 chess outcomes (resignation included) and the 2 engine faults. **Not** on a confirmed `quit`, end of input, a usage error or an internal error (70); those paths stay byte-identical to base. This also means no quit-vs-EOF split and no `turn-loop.ts` change.
- **Where and name:** `games/skytalix-YYYYMMDD-HHMMSS.pgn` under the process cwd. Under `npm run chess` that is the clone root (probed on npm 11.20.0). The name and `Date` come from one local-time reading taken at game start. `.gitignore` gains `games/`.
- **Overwrite:** never. The write is an exclusive create, with suffixes `-2`…`-99`. If all are taken, the failure path runs with `EEXIST`.
- **Tags:** 10, in this order: STR, then `Termination`, `Difficulty`, `HumanColour`. The human's side is `Human` and the engine's is `skytalix (difficulty N)`. `Site "?"`, `Round "-"`, no `SetUp`/`FEN`.
- **Results:** `1-0`, `0-1` and `1/2-1/2` take `Termination "normal"`. A fault gives `*` with `"unterminated"`.
- **Movetext:** `toSan` SAN, a closing `{headline}` comment, then the token. Lines are ≤ 79 characters, LF only, ASCII.
- **Oracle:** A7 matches the game-1 sample byte for byte; A6 round-trips through `parseSan` to an equal FEN.
- **Errors:** the screen is unchanged and stderr gets one line, `PGN not saved: <errno code>`. Exit `0`, no partial file. On success, one stdout line: `PGN saved: games/<name>`.

**Risk triggers:**
- A Security/NFR hop is owed: this is the CLI's first file write, and `ADR-0036` (b1) limb 1 and (b2) are expected to fire. The path takes 0 user-controlled bytes. Security/NFR rules on a `games` symlink.
- `NFR-008`: +1 test file and a target of 0 new spawns.
- `NFR-007` and `NFR-002`: untouched (`A12`).
- The write costs ≤ 50 ms at 300 plies.
- `ADR-0007` and `ADR-0018` are unaffected.

**Architect questions (In Design first):**
1. The module shape and how the headline is shared; `history.ts` stays a type-only import.
2. Keeping the tree clean under `npm test`: spawned children that reach an outcome run with cwd = tree root.
3. The clock seam.
4. Whether an ADR is needed. The owner STOP fires only if an accepted ADR is reversed; none is.

**Owner:** no blocking question. Two calls are flagged as cheap to reverse: (a) the file is written automatically into `games/`; (b) `quit` writes nothing.

**EPIC-006:** a dated box at the top, plus dated amendments in § Negotiable slice and under "What was NOT cut" item 4. Save/resume still waits on the play-test. Front matter and the card are unchanged.

Not touched: `src/`, `plans/board.md`, `plans/traceability.md`, the ADRs, and the Architect's worktree. In main's checkout, only this record and its claim moved, uncommitted.

**For the Orchestrator:**
- Add the card to Ready, append the trace row at merge, then pull to In Design (Architect/Design).
- Board card line:

`- [ABC-203] At game end, \`npm run chess\` writes the game as a standard PGN file under \`games/\`  (owner: software-engineer, after an Architect/Design ruling, size: M, priority: P1, epic: EPIC-006, since: 2026-10-23, DoR 10/10; cut in \`bapm-cut-pgn-export\` (\`…0c2867c1\`). Owner word \`…715b9cbf\`: PGN export in scope. Automatic, once, when the loop returns a reason (8 outcomes + 2 faults); none on quit/EOF/usage/internal error. \`games/skytalix-YYYYMMDD-HHMMSS.pgn\` under cwd, exclusive create -2..-99, 10 tags, toSan movetext, A7 byte match to game 1. Security/NFR hop owed (first file write, ADR-0036 b1/b2). Next free ABC-204)`

### Trace row (10 cells, header order)

| ABC-203 (bapm-cut-pgn-export) | At game end, `npm run chess` writes the game as a standard PGN file under `games/`: automatic, once, when the loop returns a reason (8 outcomes + 2 faults); none on quit/EOF/usage/internal error; `games/skytalix-YYYYMMDD-HHMMSS.pgn` under cwd, exclusive create -2..-99; 10 tags (STR + Termination, Difficulty, HumanColour); toSan movetext + headline comment, ≤ 79-char lines; failure = one stderr errno line, exit 0 | EPIC-006 | — | Security/NFR hop owed (first file write; ADR-0036 b1/b2 expected); NFR-008 +1 file, 0 new spawns; NFR-007/NFR-002 untouched (A12); write ≤ 50 ms at 300 plies; ADR-0007/0018 unaffected; notes …715b9cbf, …f400c835, …0c2867c1 | grugops/bapm-cut-pgn-export @ d6a47fd0 (records only)<br>plans/tickets/ABC-203-at-game-end-npm-run-chess-writes-the-game-as-a-standard-pgn-file-under-games.md; EPIC-006 page (dated box; § Negotiable slice and "What was NOT cut" item 4 amended) | — (records only; one npm cwd probe in the scratchpad) | QE verdict on A1–A14 signs UAT (…5aaf7cec item 2); A13 host reading with an independent PGN reader | — | cut → Ready (M, P1, DoR 10/10; In Design next: Architect/Design, 4 questions, STOP only on an accepted-ADR reversal); EPIC-006 PGN export in scope, save/resume still waits on the play-test; next free ABC-204 |
