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
