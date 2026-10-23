---
subtask: uat-EPIC-006-playtest
role: uat-planner
ticket: plans/epics/EPIC-006-game-session-and-packaging.md
ref: .grugops/context/uat-EPIC-006-playtest/
width: 1 (records only)
---

# Write the owner's play-test guide for EPIC-006's negotiable slice

## Do
- Write `plans/uat/EPIC-006-play-test-guide.md`: a short, practical guide the owner (a non-agent human) follows at a terminal to produce the evidence EPIC-006 § Negotiable slice asks for — do players abandon games mid-way, and would save/resume or PGN export have helped.
- Content:
  1. **Setup** — exact commands from a clean checkout as `main` has them today (`npm install` / `npm run chess`; verify against `package.json`, `src/cli.ts`, `src/cli-options.ts`, `src/startup-questions.ts`). Every flag/command you list must exist on `main` — read it from source, and run `npm run chess -- --help` (or equivalent) in your worktree to confirm; do not invent.
  2. **In-game cheat sheet** — the commands a player can type (moves, undo, new, help, resign/quit, etc.) and difficulty/colour choices, read from source.
  3. **The play-test protocol** — how many sessions/games (propose a small, realistic number, e.g. 5 games across ≥ 2 sittings; justify it), varied colour/difficulty, playing naturally; optionally one other person.
  4. **What to record** — a copy-paste log table per game: date, colour, difficulty, finished or abandoned, move number if abandoned, why (time, boredom, losing, bug…), "would I have saved and come back?", "would I want the game as PGN?", and any bug/annoyance. Keep it fillable in under a minute.
  5. **Decision rule** — how the log maps to the owner's call: build save/resume, build PGN export, both, or drop the slice (and close EPIC-006). State it as a recommendation; the call is the owner's.
  6. **How to hand back** — paste the filled table in the Orchestrator session (or save it under `plans/uat/`); the Orchestrator records it as the owner's word and routes BA/PM.
- Keep it to about 1–2 screens, plain language, no jargon or note ids in the owner-facing body (a short "sources" footer is fine).

## Fences
- Work on `grugops/uat-EPIC-006-playtest` (worktree `../wt-uat-EPIC-006-playtest` from `main`). Only the new guide and your notes. No `src/`, `package*.json`, `plans/board.md`, `plans/traceability.md`, epic or ticket pages. Running the CLI read-only to confirm commands is allowed; no test-lane runs needed. Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/uat006/`. Never push, force, amend or rebase; never merge into `main`.

## Publish
- Seal notes via the plugin writer (task `uat-EPIC-006-playtest`), `at` from `date -u`, with a `kind: artifact-ref` for the guide. Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.

## Result

**Guide written; the owner's play-test is owed** (UAT Planner, 2026-10-23, branch `grugops/uat-EPIC-006-playtest` @ `88d31925`, base `main` `8f619b80`. Records only: no lane run, no `src/` change.)

- **Guide:** `plans/uat/EPIC-006-play-test-guide.md` (105 lines, committed at `d78b0833`, sha256 `453eb239…`). It is plain language for the owner, with a sources footer only.
- **Protocol:** 5 games over at least 2 sittings, at least 2 as white and 2 as black, at least one level 1–2 and at least one level 4–5. Play naturally. Optionally one other person plays 2–3 games. The guide includes a 10-column log row that takes under a minute to fill.
- **Decision rule (a recommendation; the owner decides):**
  - **Save/resume:** at least 2 games abandoned with "saved and come back" = y. An abandon out of boredom or because you were losing does not count.
  - **PGN export:** at least 2 games with "want as PGN" = y, meaning a file. A finished game already prints its move list.
  - **Both:** both rules hit.
  - **Neither:** drop the slice, and BA/PM checks whether EPIC-006 can close.
- **Every command was confirmed** from source and by running the CLI read-only in the worktree, piped and under a pty with `script`:
  - the flags `--colour white|black|random`, `--difficulty 1-5` (default 5), and `--ascii | --unicode`;
  - **no `--help`** (it prints the usage line and exits 1);
  - the startup questions;
  - the in-game commands `help board quit(x2) claim resign new undo moves` and Ctrl-D;
  - SAN and coordinate moves.
- **Not confirmed:** whether Node 22.x releases older than 22.18 run `src/cli.ts` (`UNKNOWN - verify`). It was run only on Node 26.11.1. The guide says "Node 22 or newer, checked on Node 26".
- **artifact-ref refused:** `admitAndAppend` refused it for a missing `gate_run` (a docs-only hop has no §14 gate run). No id was invented. The pointer was recorded as an `observation`, and the refusal as a `failed-attempt`.
- **Notes** (`.grugops/context/uat-EPIC-006-playtest/notes/` on the branch, sealed by grugops 2.1.0 `admitAndAppend`, read back as 3, each validates with `[]`, index rendered):
  - `20261023T180345Z-uat-planner-observation-23b21e94` (the guide pointer and decision rule)
  - `20261023T180345Z-uat-planner-observation-92f1df87` (the command confirmations)
  - `20261023T180345Z-uat-planner-failed-attempt-80891d4c` (the artifact-ref refusal)
- **Process slip, disclosed:**
  - **What happened:** my first seal call used the writer's default context root. That root is the plugin's own folder, so 3 notes (`…0866298e`, `…7c48bd79`, `…820e1665`) landed in `~/.claude/plugins/cache/grugops/grugops/2.1.0/.grugops/context/uat-EPIC-006-playtest/`.
  - **Fix:** I removed that folder and re-sealed into the worktree with an explicit root. No ledger was written.
  - **Pre-existing, not touched:** a `ticket-to-pr-ABC-172` folder already sits in that plugin path from an earlier hop.
- **Not touched:** `src/`, `package*.json`, `plans/board.md`, `plans/traceability.md` (the row below is for the Orchestrator), and the epic and ticket pages. No board move. Nothing pushed or merged. No signoff captured: the owner's filled log is the acceptance input.

### Trace row (10 cells, header order)

| EPIC-006 (uat play-test guide) | Owner play-test guide for the negotiable slice (save/resume, PGN export): setup, cheat sheet, 5 games / ≥2 sittings protocol, per-game log, decision rule (≥2 would-save abandons → save/resume; ≥2 want-PGN → PGN; neither → drop slice) | EPIC-006 | § Negotiable slice | — | `grugops/uat-EPIC-006-playtest` @ `88d31925` (records only)<br>`plans/uat/EPIC-006-play-test-guide.md` (new)<br>`.grugops/context/uat-EPIC-006-playtest/notes/` (…23b21e94, …92f1df87, …80891d4c) | none (docs only); CLI commands confirmed read-only on `main` `8f619b80`, Node 26.11.1 | **Play-test owed: owner's log and call** | — | Guide ready; owner to play and hand back; merge is the Orchestrator's |
