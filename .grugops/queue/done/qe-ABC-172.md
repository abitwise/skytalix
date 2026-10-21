---
subtask: qe-ABC-172
role: qe-e2e
ticket: plans/tickets/ABC-172-rename-the-package-and-every-in-repo-name-to-skytalix.md
ref: .grugops/context/qe-ABC-172/
branch: grugops/ABC-172 (tip 2eaf1a1c; code 0bddbb43; base 3e617b26); SE worktree ../wt-ABC-172 (read only)
width: 3 (beside qe-ABC-187 and arch-ABC-168-D8)
---

# QE gate for ABC-172 (package name → `skytalix`; 0 production lines)

## Do
- **Merge the current `main` into your QE branch first** (a merge, not a rebase); run every criterion at that merge and report the merge sha and any conflict (`package.json`/`package-lock.json` are shared with ABC-168, which is blocked, and ABC-187 may land).
- Verify `A1`–`A5` against the page with your own runs, before opening the SE's notes.
- **Rule on the lock deviation.** The page says regenerate `package-lock.json` with `npm install --package-lock-only`, not hand-edit; `A2` allows exactly two changed lines. Regeneration also adds `packages[""].license: "UNLICENSED"` (ABC-169 added `license` to `package.json` without regenerating the lock). The SE removed that third line by hand to meet `A2`, checked no resolved version moved, and ran `npm ci` (rc 0) on a scratch copy. Say which reading of the page is right (A2 literal vs the regenerate rule), and whether the license line should land here, separately, or not at all.
- **No name left behind:** search the repo (outside `node_modules`, `.grugops/`, `plans/` history and dated records) for `cli-chess` as a package name and judge each hit against the page's Scope and Out of scope (Q14: `npm run chess` keeps its name; directory and remote are the owner's).
- **Gates** on the code tip: lint, typecheck, build; `npm test` + `last-run.json` success (59 / 1987); skip-integrity `--skip-count 0`; `CLI_DEEP` (11/11, 6 children with `--reporter=verbose`) and `PERFT_DEEP`. Heap 400 one-file, 128 multi-file. No timing. UAT waiver in AGENTS.md's form.
- **Verdict:** PASS / PASS_WITH_GAPS / FAIL with a gap register.

## Fences
- Work in your own worktree `../wt-qe-ABC-172` on a branch from the tip. Lock experiments only in scratch copies.
- Commit typed notes, written inside your worktree, and a `## QE` section on the ABC-172 page there.
- No edits to `package.json`, `package-lock.json`, `src/`, `AGENTS.md`, `plans/board.md`, `plans/traceability.md` or other ticket pages.
- Never push, `--force`, `--amend` or rebase; never merge into `main`.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `qe-ABC-172`). **Pass your worktree as the context root explicitly.** Take every `at` from `date -u`.
- Write `.grugops/queue/done/qe-ABC-172.md` (brief + `## Result`) and `.claim.md`, uncommitted on main.
- **Trace row: exactly 10 cells, in header order**; do NOT append it yourself:
  `| ABC-172 (QE) | {what this hop did, one line} | {EPIC-nnn or —} | {F-nnn or —} | {NFR, ADR, AR and finding ids, or —} | {branch @ sha<br>files touched, or —} | {gates and test counts, or —} | {UAT verdict or waiver, or —} | {release tag, or —} | {column move or verdict} |`

## Result

**QE, 2026-10-21T14:00:13Z. Verdict: PASS_WITH_GAPS (QE-172-a LOW; QE-172-b, QE-172-c INFO; 0 blocking). UAT WAIVED. Recommend In Review → In Security/NFR (the ABC-041 (a) short hop). Column moves are the Orchestrator's.**

- Branch `grugops/qe-ABC-172` in `../wt-qe-ABC-172`, from SE tip `2eaf1a1c`. **Merge of main `41f5b366` → `a0dc4135`**, ort, no conflict, and no manifest or `src/` path came in (ABC-187 and ABC-168 had not landed). QE tip (notes + `## QE` page section): `8af64abc`.
- A1–A5 MET at `a0dc4135`, run before the SE's notes were opened: name `"skytalix"`; the lock diff is 2/2 `name` lines; `npm ci` rc 0 in a real install; the A3 grep is empty; A5 holds at code `0bddbb43`; `npm run chess` starts, rc 0.
- Gates at `a0dc4135`: lint, typecheck and build 0. `npm test` 59 files, 1987/1987, `last-run.json` success true, equal to base (re-run at `3e617b26`). Skip count 0, integrity `No findings.`. `CLI_DEEP` 11/11, 6 children (verbose). `PERFT_DEEP` 32/32. Heap 400 one-file, 128 multi-file. No timing.
- **Lock ruling:** A2 literal governs. Regenerating the BASE lock (old name) already adds `packages[""].license: "UNLICENSED"`, so that line is ABC-169's drift (`b3fecb1b`), not this rename. The delivered lock equals the regenerated lock minus that line; no version or integrity moved. The SE's removal is a correct, recorded deviation from Scope 2's method, not from its contract. The license line should land **separately** (with ABC-168's lock change, named in its criteria, or as a one-line chore), not here and not never.
- **No name left behind:** every remaining `cli-chess` hit is an ADR record (ADR-0018 :128/:131, ADR-0044 :773), dated planning history, or the directory `cli-chess-example` (`.grugops/install.json:6`, owner's step). `npm run chess` was kept (Q14). Nothing reads the name at runtime.
- **Gaps:** QE-172-a (LOW) lock license drift, re-added by the next `npm install`. QE-172-b (INFO) A5 read literally at the notes tip also lists the SE's 3 context notes; it holds at the code commit. QE-172-c (INFO) ADR-0018's table has no dated rename line, though the page says each record gets one (the Architect's, outside A5).
- UAT waiver (AGENTS.md form): `git diff --name-only 0bddbb43~1 0bddbb43 | grep -v '\.test\.ts$' | grep '^src/'` is empty → 0 production lines, **UAT WAIVED**.
- Notes (sealed, committed on the branch), `.grugops/context/qe-ABC-172/notes/`: `…decision-933d8f15` (lock ruling), `…observation-c9c6ba15` (A1–A5), `…observation-c5682d4f` (gates), `…observation-a86ec95f` (verdict + gap register), `…observation-34bd56d3` (artifacts). An `artifact-ref` was refused by admission (it needs sha/gate_run/content_hash, and no §14 gate_run exists). It was re-recorded honestly as an observation, not faked.
- **Disclosure:** the throwaway base worktree (detached at `3e617b26`, in the session scratchpad, made for the base count) was removed with `git worktree remove --force` because of its untracked `.test-results/`. It touched no branch or ref, but it is a literal `--force` against this brief's fences.

Trace row (10 cells, not appended):

| ABC-172 (QE) | QE re-ran A1–A5 and gates at the merge of main; ruled the lock deviation (A2 governs; license line is ABC-169 drift, lands separately) | EPIC-007 | — | QE-172-a (LOW), QE-172-b, QE-172-c (INFO); decision 933d8f15; ABC-041 (a) short hop owed | grugops/qe-ABC-172 @ 8af64abc (merge of main 41f5b366 at a0dc4135)<br>.grugops/context/qe-ABC-172/notes/ (5), ABC-172 page § QE | lint 0, typecheck 0, build 0; npm test 59 files 1987/1987 = base, last-run success; skip-count 0, integrity No findings; CLI_DEEP 11/11 (6 children); PERFT_DEEP 32/32; npm ci 0 | UAT WAIVED (0 production lines, AGENTS.md form empty at 0bddbb43) | — | PASS_WITH_GAPS; In Review → In Security/NFR |
