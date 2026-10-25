---
subtask: se-integrate-ABC-205
role: software-engineer
ticket: plans/tickets/ABC-205-king-safety-bites-while-queens-are-on-and-the-king-table-is-tapered.md
ref: .grugops/context/se-integrate-ABC-205/
branch: new grugops/ABC-205-final from main, worktree ../wt-ABC-205-final
width: 3 of 3 (beside qe-ABC-216, qe-ABC-217; no real-clock timing, no engine games)
---

# Integrate ABC-205 onto current main (re-apply the restore, then the owner-word edits)

## Why
ABC-205's original code reached main early through a records merge (a20ae77f) and was taken back off by `7c9cd9b9` (Orchestrator `…c3d204a5`). Its code commits are therefore already ancestors of main, so **merging main into `grugops/ABC-205` would delete its code — do not do that.** Main has since gained ABC-206 (search speed, identical answers), ABC-212 (levels 6–7) and ABC-204 (rating harness).

## Do
- From current `main`: `git revert --no-edit 7c9cd9b9` (re-applies ABC-205's code; message names ABC-205), then `git merge --no-ff grugops/ABC-205` (`f3e14a00`: the owner-word edits 18a0570e — S1 maxDepth 10, drift bar 118 cp, quiescence cell 16x). Resolve conflicts against ABC-206/212 in favour of both changes' stated intent; any conflict you can't resolve by intent → STOP and name it.
- Verify: `git diff 4f650a45 grugops/ABC-205 -- src` equals the ABC-205 part of your diff vs main (show it); `src/evaluate.ts` equals `grugops/ABC-205`'s byte for byte unless ABC-206 touched it.
- Re-check ABC-205's own pins at the new base (node counts, drift max, mate-floor 0/180, quiescence ratio) — ABC-206 kept answers identical, so node pins should hold; report any that move with the reason. Pin moves outside the page's licensed list → STOP.
- Gates: lint, typecheck, build, `npm test` + `last-run.json` (Duration), skips, `SEARCH_DEEP`, `ENGINE_DEEP`. No real-clock timing reading, no G6, no harness games (those are QE's alone run).

## Fences
- Only your worktree and `<scratchpad>/se205int/`. Never push, force, amend or rebase; never merge into main; no board edits. Records: class and count only (ADR-0049 d4).

## Publish
- Commit on your branch. Seal notes (task se-integrate-ABC-205). `## Result` + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.

## Result

- **Done, on `grugops/ABC-205-final`** (from `main` `d5690c5c`; the brief's `a5cafba3` had since gained ABC-217, which touches none of ABC-205's files):
  - revert `1fdd4748` (of `7c9cd9b9`);
  - merge `f00013da` (`--no-ff` of `grugops/ABC-205` `f3e14a00`);
  - notes `b5d5cea5`, which is the tip.
  - Not pushed, not merged into main. `main` was never merged into `grugops/ABC-205`.
- **Conflicts: 1.** In the revert, the `src/evaluate.ts` header, against **ABC-214** `a5dfb0dc` (carve-out lines) and ABC-205's "The king endgame table is this project's own."
  - Both kept. ABC-205's sentence goes on its own line after the carve-out, so "These values" names only the Michniewski values. NOTICE's list of seven tables does not include `KING_ENDGAME_TABLE`.
  - Comment only. The merge itself was clean; `engine.test.ts` auto-merged against ABC-212 in disjoint hunks.
- **Equivalence** (`-U0`, `@@`/`index` lines stripped):
  - `diff(1fdd4748, f00013da) -- src` is **byte-identical** to `diff(4f650a45, grugops/ABC-205) -- src` (3 files, +26/−25).
  - `diff(main, tip) -- src` equals `diff(f47b3429, f3e14a00) -- src` except for that one header hunk (7 files, +351/−75 against +351/−76).
  - Main's own changes carry over identically except for the same hunk.
  - `src/evaluate.ts` code body is byte-identical to the branch. ABC-206 touched none of ABC-205's files.
- **Pins: all held, none moved.**
  - Default-lane re-pins are green and unedited.
  - Drift max 79 cp in both recursions (96.79 / 97.33 %, 0 mate flips) under 118. Mate floor 0 of 180.
  - Quiescence position-6 d1 10.96x (level 16x); the other five cells unchanged.
  - transposition A4 frozen-clock row passes.
- **Gates:** lint, typecheck and build 0.
  - `npm test`: 62 files, 2091/2091; `last-run.json` success, 0 pending, 0 todo; **Duration 10.26 s**.
  - Skips 0, `No findings.`
  - SEARCH_DEEP: search 57/57, ordering 38/38, transposition 40/40, quiescence 37/37, pvs-lmr 29/29.
  - ENGINE_DEEP: engine 60/60, levels 41/41 (includes ABC-212 A4 real-clock rows: pass/fail only, no reading), transposition 26/26, pvs-lmr 21/21, legal 37/37, gameend 47/47.
  - Not run: no G6, no PUZZLE_DEEP, no harness games.
- **Owed:** the QE hop, G6 and D, then the Orchestrator's merge of `grugops/ABC-205-final` into main.
- **Notes:** decision `se-integrate-ABC-205/…c685972c`, observation `se-integrate-ABC-205/…e709eff1`.

**Trace row** (for the Orchestrator):

| ABC-205 (se-integrate-ABC-205) | ABC-205 build plus owner-word edits re-applied onto main: revert of the restore 7c9cd9b9, then merge of grugops/ABC-205 | EPIC-008 | src/evaluate.ts plus 6 test files (= branch; header line merged with ABC-214's carve-out) | NFR-005/NFR-008: 62 files = base; pins held at the new base | grugops/ABC-205-final @ b5d5cea5 (revert 1fdd4748, merge f00013da)<br>.grugops/context/se-integrate-ABC-205/notes/ (2) | lint/typecheck/build 0; npm test 62/2091 success, 10.26 s; skips 0 No findings.; SEARCH_DEEP 5/5 files green, ENGINE_DEEP 6/6 green; drift 79/79 ≤ 118; mate floor 0/180; Q 10.96x ≤ 16x | not waived by this hop (production evaluate.ts change) | QE hop, G6, D; Orchestrator merge | In Development → QE |
