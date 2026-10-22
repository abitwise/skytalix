---
subtask: merge-prep-ABC-168
role: software-engineer
tickets: [ABC-168]
branch: grugops/ABC-168 in the existing worktree ../wt-ABC-168 (@ b71f8902)
ref: .grugops/context/merge-prep-ABC-168/
width: 3 (beside arch-build-ABC-196 and bapm-rerule-ABC-178; disjoint files)
---

# Software Engineer: ABC-168 merge prep. The owner accepted UAT A8–A10 on 2026-10-22 (`.grugops/context/uat-ABC-168/notes/20261022T133720Z-orchestrator-decision-0b63d92f.md`). Bring `grugops/ABC-168` level with `main`, discharge what is owed at its merge, and leave a green tip for the Orchestrator to merge

## Read first
- The ticket page `plans/tickets/ABC-168-skytalix-the-uci-entry-point-and-its-built-dist-artifact.md` (Scope, A1–A12, Test notes) and its card in `plans/board.md` (In UAT).
- The handoff `.grugops/context/orchestrator-handoff-2026-10-21/notes/20261021T210613Z-orchestrator-observation-3d4ab371.md` § "Owed at its merge".
- QE-187-a: `.grugops/context/qe-ABC-187/notes/20261021T143852Z-qe-e2e-decision-5689584d.md` and ABC-187's page (A5's closer-count script).
- Your own `ticket-to-pr-ABC-168` / `-168b` notes, QE `qe-ABC-168`, Security/NFR `security-nfr-ABC-168`, Scribe `scribe-ABC-168` notes.
- `AGENTS.md`, `memory-bank/45-standing-rulings.md`.

## Do
- In `../wt-ABC-168`: `git merge main` (a merge commit; no rebase). The branch's merge-base is `c98509b3`; `main` is 89 commits ahead and touched `AGENTS.md` (+8/−8) and `src/cli.test.ts` (+273). Resolve conflicts keeping BOTH sides' intent: main's newer rows, waiver form and byte guard, and ABC-168's Scope 5 lines and Scope 6's four pin edits. Record each conflict hunk and how you resolved it.
- **QE-187-a:** re-run ABC-187 A5's closer-count script on the merged tree. Set the `src/cli.test.ts` comment (around `:2242`; find it, the line may have moved) to the measured number (expected 9), or drop the number. Name the measured value.
- The `AGENTS.md` byte guard must hold on the merged file. Report its size in bytes.
- Re-check A7 (`dist/` contents, `grep -l 'import(' dist/*.js` prints nothing) and A11 (the D2 "no edit" list unchanged from base; only Scope 6's four edits in `src/cli*.test.ts`) on the merged tip.
- Gates on the merged tip: lint, typecheck, build; `npm test` + `last-run.json` success (name the counts); skip-count capture as spelled → `test-skip-integrity.js`; `CLI_DEEP` and `UCI_DEEP` (ABC-168's lane, as `AGENTS.md` spells it) and `PERFT_DEEP`. Heap 128 multi-file, 400 one-file. No timing claims.
- Record the owner's waiver form over `main..tip` (`git -c core.quotePath=false diff --name-only main grugops/ABC-168 | grep -v '\.test\.ts$' | grep '^src/'`). It is expected NON-empty (production lines), so the waiver does NOT apply. UAT is owner-signed instead. Do not claim a waiver.

## Fences
- Only `../wt-ABC-168` on `grugops/ABC-168`, and only the conflict resolution plus the QE-187-a comment fix. No new features, no other edits. Your notes go under `../wt-ABC-168/.grugops/context/merge-prep-ABC-168/`, which is the context root to pass.
- Never merge into `main`; the Orchestrator does that. Never push or `--force`. Never set git config. Do not touch `../wt-qe-ABC-168`.
- **Stop and report** if a conflict can't be resolved without changing either side's intent, or if any gate goes red after one self-fix attempt.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`). **Pass the context root explicitly** (named under Fences), never the plugin dir. Take every `at` from `date -u` (UTC). Include a `kind: decision`. Notes are append-only; a wrong note gets a superseding note. Record artifacts as `observation` (no §14 gate run, no `finding`).
- Trace row (forward 10-cell rule): `| {ticket} ({hop}) | {what} | {EPIC or —} | {F or —} | {NFR/ADR/AR/finding ids or —} | {branch @ sha<br>files or —} | {gates/test counts or —} | {UAT verdict/waiver or —} | {release tag or —} | {column move or verdict} |`, exactly 10 cells, as a plain table line. Put it in your done record: append `## Result` to this file and write `.grugops/queue/done/<subtask>.md` + `.claim.md` in main's tree, uncommitted. The Orchestrator appends the trace row and commits records.

## Result

Done at 2026-10-22T13:43:22Z. `grugops/ABC-168` in `../wt-ABC-168` is at **`3948a4dd`**. Its commits on top of `b71f8902`:
- `a2c5f673`, the merge of `main` `a7857e0b`;
- `243c2fdf`, the QE-187-a comment;
- `3948a4dd`, the notes (records only).

Nothing was pushed or merged into `main`, and no git config was changed. `../wt-qe-ABC-168` was not touched. No stop.

- **Conflicts.** There was one hunk, in `memory-bank/90-agents-md-command-log.md` (~:987). Both sides appended a dated Scribe pass entry: HEAD's is `scribe-ABC-168`, main's are `scribe-ABC-176` and `scribe-waiver-quotepath`. I kept all three verbatim, `scribe-ABC-168` first and then main's two. `AGENTS.md` and `src/cli.test.ts` auto-merged. I checked each against `main`: `AGENTS.md` differs only by Scope 5's three lines, and `src/cli.test.ts` only by Scope 6's four edits. Main's rows, its waiver form and `AGENTS_MD_BUDGET_BYTES = 18_432` are intact.
- **QE-187-a.** ABC-187 A5's script on the merged `AGENTS.md` prints **9** (main alone prints 8). `src/cli.test.ts:2244` (was :2242) now says 9.
- **`AGENTS.md`:** **16,305 B**, at or under 18,432.
- **Gates on `243c2fdf`:**
  - lint 0, typecheck 0, build 0;
  - `npm test` 0, with **60 files / 1995 tests**; `last-run.json` reads success true;
  - skip-count capture **0** → "No findings.";
  - CLI_DEEP 11/11, UCI_DEEP 5/5, PERFT_DEEP 32/32;
  - no timing claims.
- **A7.** No `*.test.js`, `cli.js` or `line-input.js` in `dist/`. `grep -l 'import('` prints nothing. The smoke run and the away-from-clone run exit 0. `npm link` was not re-run: UNKNOWN - verify.
- **A11.** The D2 list of 13 files is unchanged across `c98509b3`/`main`/tip. On `src/cli*.test.ts`, only `src/cli.test.ts` differs from main: 5/3, which is Scope 6's 4/2 plus the QE-187-a 1/1. The pin is armed: with `bin` removed, the only red is ABC-042 A10 (1 failed / 94 passed); `package.json` was restored.
- **Waiver form (main..tip):** it prints `src/uci.ts`, so it is **NON-empty** and the waiver does not apply. UAT is owner-signed (`…0b63d92f`).
- **Notes.** Sealed under `../wt-ABC-168/.grugops/context/merge-prep-ABC-168/notes/`:
  - `…decision-b7b1e60f`;
  - observations `…53d08e23` (QE-187-a), `…e7d9b560` (gates), `…7d37c9e0` (waiver) and `…2f44085e` (branch tip).
  - The `artifact-ref` was refused for want of a `sha` gate-provenance field, so the tip is recorded as an observation, per the brief.

### Trace row (10 cells, header order)

| ABC-168 (merge-prep-ABC-168) | merged main a7857e0b into grugops/ABC-168 (1 conflict, 90-agents-md-command-log.md pass entries, both kept); QE-187-a closer count 8 -> 9 (measured 9) | EPIC-007 | — | QE-187-a; ADR-0044 D2/D8; AR-168-BINPIN (open, ABC-189); notes …b7b1e60f, …53d08e23, …e7d9b560, …7d37c9e0, …2f44085e | grugops/ABC-168 @ 3948a4dd (merge a2c5f673, fix 243c2fdf)<br>memory-bank/90-agents-md-command-log.md (conflict), src/cli.test.ts (:2244 comment) | lint/typecheck/build 0; npm test 60/1995, last-run success; skip 0, No findings; CLI_DEEP 11/11, UCI_DEEP 5/5, PERFT_DEEP 32/32; AGENTS.md 16,305 B | owner-signed A8-A10 2026-10-22 (…0b63d92f); waiver form non-empty (src/uci.ts), no waiver | — | ready for the Orchestrator's merge (In UAT, owner-accepted) |
