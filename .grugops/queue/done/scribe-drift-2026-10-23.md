---
subtask: scribe-drift-2026-10-23
role: agents-md-scribe
ticket: AGENTS.md
ref: .grugops/context/scribe-drift-2026-10-23/
width: 2 (records only; disjoint files from arch-runbook-deploy-holder)
---

# Fix three factual drifts in AGENTS.md / the command log / standing rulings (records only)

## Do
1. **Startup questions (ABC-200):** AGENTS.md "Dev / run" and `memory-bank/90-agents-md-command-log.md` § "Dev / run" don't mention that `npm run chess` asks colour and difficulty on a terminal (skipped by flags or non-TTY stdin). Add it, verified against `src/startup-questions.ts` and `src/cli.ts`.
2. **The `--` separator wording:** AGENTS.md says that without `--` npm "silently drops the flag and runs with defaults". On npm 11.20.0 that holds only for value-less flags (`--ascii` exits 0); for value flags npm eats the flag name and the CLI refuses the value (`npm run chess --colour black` exits 1). Re-verify yourself (`npm --version`, run both, read-only) and correct the wording.
3. **`45-standing-rulings.md` § Deployment posture** still says "no `bin`/`main`/`exports`/`files`" — wrong since ABC-168. Add a dated correction pointing to the owner-approved notes on ADR-0007 (`…0f003634`) and ADR-0018 (`…5ffd0ca7`); the baseline tuple is `[true,{"skytalix":"dist/uci.js"},false,false,false]`. Keep the old text visible. No ruling changes.
- Follow your role's rules for AGENTS.md edits (command-log entry etc.).

## Fences
- Work on `grugops/scribe-drift-2026-10-23` (worktree `../wt-scribe-drift-2026-10-23` from `main`). Only `AGENTS.md`, `memory-bank/90-agents-md-command-log.md`, `memory-bank/45-standing-rulings.md` and your notes. Not `memory-bank/70-runbook.md` (parallel hop). No `src/`, `package*.json`, `plans/`, ADRs, config. Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/scribe1023/`. Seal notes with an explicit context root in your worktree. Never push, force, amend or rebase; never merge into `main`.

## Publish
- Seal notes via the plugin writer (task `scribe-drift-2026-10-23`), `at` from `date -u`, with a `kind: decision`. Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.

## Result
- Branch `grugops/scribe-drift-2026-10-23`, commit `0cd3be28`, worktree `../wt-scribe-drift-2026-10-23`, from `main` `ad9655fc`. Not merged, not pushed. 3 files: +42 / -2 lines, plus the notes. `memory-bank/70-runbook.md`, `src/`, `plans/`, `package*.json`, ADRs and config untouched.
- `AGENTS.md` `Dev / run` slot comment (16,669 -> 17,010 B of 18,432): "without it npm silently drops the flag and runs with defaults" -> npm eats the flag name (npm 11.20.0): value-less `--ascii` dropped, defaults, exit 0; value flag leaves its value as a stray argument and the CLI refuses it, exit 1. Adds: on a terminal colour then difficulty are asked for when their flag is absent (Enter keeps the default; ABC-200), a flag skips its question, non-terminal stdin skips both.
- `memory-bank/90-agents-md-command-log.md` § Dev / run: 2026-08-15 `--` receipt kept; added a dated CORRECTED paragraph (the three runs) and a STARTUP QUESTIONS paragraph (pty runs); new `scribe-drift-2026-10-23` pass section at the end.
- `memory-bank/45-standing-rulings.md` § Deployment posture: "no `bin`/`main`/`exports`/`files`" kept; dated "Correction 2026-10-23" added: `bin` since ABC-168 (`513c0211`), tuple `[true,{"skytalix":"dist/uci.js"},false,false,false]` (re-read with `jq` on main), authority `…0f003634` (ADR-0007) and `…5ffd0ca7` (ADR-0018). No ruling changes.
- Verified: `npm --version` 11.20.0; `npm run chess --ascii </dev/null` exit 0; `npm run chess --colour black </dev/null` exit 1 (`unrecognised argument: black`); `npm run chess -- --colour black </dev/null` exit 0; pty runs of the questions (both, none with both flags, difficulty only, Ctrl-D exit 0; non-TTY none). In the worktree: `npx vitest run src/cli.test.ts` 95 passed; `npm test` exit 0 (61 files, 2019 tests); `npm run lint` exit 0.
- Notes (decision): `20261023T190829Z-agents-md-scribe-decision-1ae3b551`, `20261023T190829Z-agents-md-scribe-decision-7274b204`, sealed by `admitAndAppend` with the worktree as context root, in `.grugops/context/scribe-drift-2026-10-23/notes/` on the branch.
- Claim: bare `mkdir` of `claimed/scribe-drift-2026-10-23/`, 2026-10-23T19:04:46Z.

### Trace row (10 cells, header order)

| AGENTS.md / 90-agents-md-command-log.md / 45-standing-rulings.md (scribe drift fixes) | AGENTS.md Scribe: `Dev / run` gains the ABC-200 startup questions; the `--` wording corrected to npm 11.20.0 behaviour (value-less flag dropped, exit 0; value flag refused by the CLI, exit 1); § Deployment posture gets a dated `bin` correction (old text kept, no ruling changes) | EPIC-006 | ABC-042, ABC-168, ABC-200 | ADR-0007, ADR-0018 | `grugops/scribe-drift-2026-10-23` @ `0cd3be28` (records only)<br>`.grugops/context/scribe-drift-2026-10-23/notes/` (…1ae3b551, …7274b204) | `npx vitest run src/cli.test.ts` 95 passed; `npm test` 61 files / 2019 tests exit 0; `npm run lint` exit 0 | — | — | DONE; merge is the Orchestrator's |
