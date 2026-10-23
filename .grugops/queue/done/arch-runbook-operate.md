---
subtask: arch-runbook-operate
role: architect-design
ticket: memory-bank/70-runbook.md
ref: .grugops/context/arch-runbook-operate/
width: 1 (records only)
---

# Bring memory-bank/70-runbook.md § Operate up to date (records only)

## Do
- § Operate is stale (`…5ffd0ca7` follow-up). Rewrite it with a dated correction, old wording kept visible as dated history, to what `main` does today: how to run the game (`npm run chess`, flags, startup questions), the UCI engine (`npm run uci`, `npm run build` → `dist/uci.js` / `skytalix`), the test lanes as AGENTS.md spells them (cite, don't restate at length). Verify every command on `main` (read `package.json`, run read-only where cheap). Short and exact.
- Sweep the rest of the runbook for the same staleness and fix only plain factual drift the same way; anything that would change a decision → STOP and report.

## Fences
- Work on `grugops/arch-runbook-operate` (worktree `../wt-arch-runbook-operate` from `main`). Only `memory-bank/70-runbook.md` and your notes. No `src/`, `package*.json`, `plans/`, ADRs, `AGENTS.md`, config. Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/runbook/`. Seal notes with an explicit context root in your worktree. Never push, force, amend or rebase; never merge into `main`.

## Publish
- Seal notes via the plugin writer (task `arch-runbook-operate`), `at` from `date -u`, with a `kind: decision`. Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.

## Result

**DONE: § Operate was rewritten and § Roll back's pointer corrected. The STOP fired on one item, the deploy-key wording, which was NOT edited** (Architect/Design, 2026-10-23). Branch `grugops/arch-runbook-operate` @ `67ae839d`: two commits on `main` `4ddae2c8` (`b4f2d26d` the runbook, `67ae839d` the notes). Records only.

- **Header:** a dated `_Updated: 2026-10-23 …_` line was added under the 2026-08-06 one.
- **§ Operate:**
  - Old: "The game cannot be run … no `bin` and no `start` script".
  - New: a `[REWRITTEN 2026-10-23 …]` bracket and text for two local programs.
    - `npm run chess`: flags, the `--` separator (cited to AGENTS.md), the ABC-200 startup questions, `help`, exits 0/1/70.
    - `npm run uci` (`skytalix`): no arguments, exits 0/1/70; `npm run build` produces `dist/uci.js` as the `bin` target, git-ignored and not published.
  - Dev and verify commands are cited to `AGENTS.md` § Commands and the 90 receipts file.
  - The 2026-08-06 paragraphs stay verbatim under a "Dated history … not current" marker. The monitoring paragraph is marked still current.
- **§ Roll back:**
  - Old: "per `AGENTS.md` § Branching model".
  - New: a `[CORRECTED 2026-10-23 …]` bracket. The section moved to `memory-bank/45-standing-rulings.md` § Branching model in `e82a3798` (ABC-164).
- **Diff:** +45/−0 on `memory-bank/70-runbook.md`.
- **Verified on `main` `4ddae2c8`:**
  - `package.json` was read.
  - `npm run chess -- --bogus` exits 1 with the usage line.
  - `npm run chess </dev/null` exits 0 and asks no questions.
  - Under a pty (`script -q`), it asks `colour (white|black|random) [white]: ` (a wrong answer is re-asked), then `difficulty (1|2|3|4|5) [5]: `, and exits 0.
  - `npm run uci` with uci/isready/quit gives `uciok` and `readyok`, exit 0. `npm run uci -- x` exits 1.
  - `tsc -p tsconfig.build.json --outDir <scratchpad>` exits 0, and the emitted `uci.js` answers `uciok`.
  - The § Deploy facts were re-measured (0 YAML, 0 remotes, `.gitkeep` only, config values) and hold.
- **STOP, one item:** § Deploy's "a human holds deploy" and § On-call's "owner … holds deploy" are older than the owner's 2026-08-15 "deploy is ALLOWED and NOT NEEDED". `45-standing-rulings.md` reads that directive as the deploy key changing hands. Rewording it is a governance call, so it is left for the Orchestrator. `production_requires_human_confirmation` is still `true`.
- **INFO:**
  - Scribe: AGENTS.md and the 90 file's "Dev / run" do not mention the ABC-200 startup questions.
  - Scribe: AGENTS.md's "without `--` npm silently drops the flag and runs with defaults" holds only for a flag with no value. `--colour black` and `--difficulty 3` without `--` exit 1.
  - Orchestrator: `45-standing-rulings.md` § Deployment posture still says "no `bin`/`main`/`exports`/`files`".
- **Notes** (in `.grugops/context/arch-runbook-operate/notes/` on the branch, sealed by grugops 2.1.0 `admitAndAppend`, read back as 2 notes with seals ok, index rendered):
  - `20261023T190206Z-architect-design-observation-7b42b3f4`;
  - `20261023T190206Z-architect-design-decision-b9dc8455`.
- **Not touched:** `src/`, `package*.json`, `plans/`, ADRs, `AGENTS.md`, config. No column moved. Nothing was pushed or merged.

### Trace row (10 cells, header order)

| 70-runbook.md (arch housekeeping) | Architect/Design: runbook § Operate rewritten with a dated bracket (old text kept as history) to what main runs: npm run chess (flags, `--`, ABC-200 startup questions, exits 0/1/70) and npm run uci / npm run build → dist/uci.js (skytalix); § Roll back pointer AGENTS.md § Branching model → 45-standing-rulings.md (e82a3798); deploy-key wording STOPped for the Orchestrator | EPIC-006 | ABC-042, ABC-168, ABC-200 | ADR-0018, ADR-0044, ADR-0045 | `grugops/arch-runbook-operate` @ `67ae839d` (records only)<br>`.grugops/context/arch-runbook-operate/notes/` (…7b42b3f4, …b9dc8455) | records only; read-only runs on main 4ddae2c8 (chess refusal/non-TTY/pty questions, uci handshake/refusal, tsc build to scratchpad) | — | — | DONE (STOP on one item, not edited); merge is the Orchestrator's |
