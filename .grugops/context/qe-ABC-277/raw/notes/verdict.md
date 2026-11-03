# QE verdict on ABC-277 (records path check + placeholder ruling): PASS_WITH_GAPS. A1–A6 MET on independent re-run; A7 not done (owner pending, not a gap). QE's verdict signs acceptance (Test note 4: no UAT)

Read at branch `grugops/ABC-277` (code `861de9c5`, main `b21f8685` merged in at `0f188473`). Every test and build ran under the host lock (`flock <scratch>/host-test.lock`). Authority: the ticket's `## Acceptance criteria` and `## What happens on a miss`, and Security/NFR `…72b4070b` (b). The SE notes `…95af648e`, `…0bad1e32` and `…f71efacd` were read, not trusted: every row below was re-run with QE's own fixtures.

## Rows as re-run
- **A1 MET.** QE's own scratch repo (built at run time from the real `os.homedir()`, uid and user name; the CLI was spawned with **no seam**):
  - exit 1, 17 findings: 5 classes × 3 paths, the `.gz` line, and a slug-named folder reported as `(file path)` with `<home-slug>` in place of the value;
  - **0 planted values** in stdout + stderr. All 10 strings were checked (the 5 planted lines, plus the bare home, the slug, the scratch root and the project name), in every one of the 52 runs.
- **A2 MET.** All 5 cases exit 0: `same`, `legacy-touch`, `rename` (text and `.gz`), `outside` (`tools/` + `src/`), and `placeholders` (the placeholders, `$HOME/x`, a count before a relative path).
- **A3 MET.**
  - The real branch exits 0 (`--base main`).
  - `--head main` exits 0.
  - These each exit 2 with a one-line reason: an orphan branch, a non-repo directory (`GIT_CEILING_DIRECTORIES`), and a missing ref.
  - These each exit 2 with a reason plus a usage line: a bad argument, `--base=main`, and `--head` with no value.
- **A4 MET.** `70-runbook.md` § Before a merge into main and `40-contributing.md` § Conventions (the paragraph sits under that heading) each name:
  - the command (and the `--head grugops/<task>` form);
  - exit 0/1/2;
  - that the Orchestrator runs it before each merge into `main`;
  - that a finding blocks until a placeholder replaces the value.
- **A5 MET.** `45-standing-rulings.md` gains exactly one dated entry under a new `## Dated entries (2026-11-03)` heading (diff: additions only, no other entry touched). It holds:
  - the five classes and the eight placeholders;
  - `$HOME`/env vars in scripts;
  - a count and a class for foreign processes (`SEC-177-1`);
  - the hostname exemption, in words;
  - its sources: `ADR-0049` D4 and `…72b4070b`.
- **A6 MET.**
  - `npm run lint` clean (138 files); `typecheck` and `build` exit 0.
  - `npm test` 66 files, 2566/2566, 0 skipped.
  - `lane-inventory.js`: 66 = 66, no findings.
  - `git diff --name-only main...HEAD -- src/ data/ vitest.config.ts`: 0 lines.
  - Proof `node --test tools/grugops/records-path-check.proof.js`: 18/18, 0 skipped.
- **A7 NOT DONE.** The owner has not answered SEC-HP-2. That is the ticket's own skip path, so it is not a gap.
- **NFRs MET.**
  - Speed: 61 ms at 200 changed record files (QE fixture), 98 ms at 63 and 169 ms at 287 on real history, against the ≤ 10 s bar.
  - `NFR-008`: 0 lane rows (the `.proof.js` is not collected).
  - Security: the check reads local git only and never printed a value in any run.
- **`.gitignore` (QE-274-d) MET.** The worktree's `node_modules` symlink is not listed by `git status`.

## Verdict: PASS_WITH_GAPS
No row is NOT MET and no "What happens on a miss" condition fired. The gaps, in the gaps note of this task, are QE-277-a MEDIUM, QE-277-b to -e LOW, and QE-277-f/-g INFO. **None blocks this merge.** QE-277-a is a fail-open path that needs a precondition absent from the repo today (no `.gitattributes`).
