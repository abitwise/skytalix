---
id: 20261017T104500Z-qe-e2e-observation-abc039-criteria-cites-gates-e6c02587
kind: observation
by: qe-e2e
task: qe-ABC-039
at: 2026-10-17T10:45:00Z
verified_by:
confidence: high
refs:
  - ABC-039
  - ABC-156
  - A1
  - A2
  - A3
  - A4
  - A5
  - A6
  - A7
  - plans/tickets/history/backward-move-ordinals.md
  - 20261017T104000Z-qe-e2e-observation-abc039-chronology-derived-blind-b07d333a
supersedes:
---

# `A1`–`A7` read at the tip `7338ee3e` (base `e7d9d657`), every cite and label checked, gates run

This is a hand-authored, unsealed note. It was read in the worktree `wt-ABC-039`, on branch `grugops/ABC-039-ordinal-register`.

- **`A1`.** `grep -c "FIRST BACKWARD BOARD MOVE IN THIS PROJECT'S HISTORY" plans/board.md` reads 0, and
  `grep -c "^- \[ABC-009\]"` reads 1, at `:1001`. A word-diff against `e7d9d657` shows two changes on that one line:
  `**FIRST` → `**SECOND`, and `HISTORY**` → `HISTORY (the first was \`ABC-011\`, 2026-08-03; register:
  \`plans/tickets/history/backward-move-ordinals.md\`)**`. The words *"Ready for UAT -> In Review on 2026-08-09 when `A11`
  was found unmet"* follow unchanged. `git diff --numstat` gives `1 1 plans/board.md`.
- **`A2`.** 9 statement rows. `grep -nF "<label>" <file>` hits the cited line for #3 (`:17`), #4 (`:451`), #5 (`:786`),
  #6 (`ABC-025…:37`), #7 (`ABC-019…:24`), #8 (`ABC-016…:52`) and #9 (`traceability.md:438`). #2: `grep -nF "FIRST BACKWARD
  MOVE IN THIS"` hits `:814`, and `sed -n 815p` matches `^ *PROJECT'S HISTORY`. #1 was live at `e7d9d657:plans/board.md:1001`.
  `ABC-025`'s basis, *"(the first was `ABC-009`, 2026-08-09)"*, is quoted (test note 5) and found at `:37`.
- **`A3`.** 15 rows, git order, every commit an ancestor of `3215004c` (see `…b07d333a`). QE read all 15 `file:line` cites at
  the tip, and each one carries its move:
  - `ABC-011…:1338` *"SENT BACK 2026-08-03"*;
  - `ABC-009…:814`;
  - `ABC-025…:37`;
  - `ABC-019…:24`, `:63`, `:99`;
  - `ABC-016…:52`, `:76`, `:82`;
  - `ABC-017…:18`, `:24`;
  - `ABC-028…:35`, `:41`;
  - `board.md:992`, which holds `abc017-d23-2026-08-12` once, with *"`In Review` → `In Development` 2026-08-12"*;
  - `board.md:989`, which holds `quality-gate-ABC-028-final` once, with *"`In Review` → `In Development` BACKWARD"*.

  All 15 record dates equal the date in the cited text. Ordinal arithmetic: in the chronology, the first row for each
  move is `ABC-009` #2, `ABC-025` #3, `ABC-016` #4 and `ABC-019` #5. All 9 statement rows carry the ordinal of their move:
  #1–#5 and #9 → 2, #6 → 3, #7 → 4, #8 → 5.
- **`A4`.**
  - (a) is stated at `:9-10`.
  - (b) is stated at `:11-12`.
  - The `+1` refutation is at `:13-14`. FIRST, SECOND, SECOND, THIRD = 1, 2, 2, 3; plus one gives **2, 3, 3, 4**, and the
    collision survives. The correct series is 2, 3, 4, 5.
  - (c) is at `:15-18`. QE re-read `plans/metrics.md:28` at the tip: *"13 backward moves in total"*, `ABC-017` **1**,
    `ABC-019` **2**, and the other seven counts equal the source. Its last change is `30197d6f`, and this branch changes it by 0.

  The three defects are separate bullets, none folded into another.
- **`A5`.** `git diff --numstat e7d9d657 7338ee3e` under `plans/ src/ memory-bank/ AGENTS.md`:
  - `plans/board.md` 1/1;
  - the register +59/0;
  - the ABC-039 page +55/0;
  - the ABC-156 page +94/0, 0 lines after `e1a62a6b`;
  - `plans/traceability.md` +3/0, 0 deletion lines.

  `src/` is empty, `memory-bank/` and `AGENTS.md` are empty, and `plans/metrics.md` and every `ABC-*-board-history.md` are
  0. The seven other files are `.grugops/context/…` notes, which are free. The merge-base equals `e7d9d657`.
- **`A6`.** `wc -l` reads 59 (≤ 60).
- **`A7`.** For each of the 9 labels, `grep -rlF "<label>" plans/` lists `plans/tickets/history/backward-move-ordinals.md`,
  #2 included. The corrected board clause names the register. The residual is accepted: a reader who opens an archive file
  and does not grep is not intercepted.
- **Completeness break attempt.** QE grepped `plans/**/*.md` case-insensitively, joining each line to the next to catch
  wraps, for an ordinal word or `Nth` within 40 characters before `backward [board] move`, and for
  `backward move (the first|…`. It found the 9 inventoried statements, the corrected board clause and `plans/metrics.md:28`,
  which quotes label #2 as its own defect report (a meta-record, not a claim). `memory-bank/` and `AGENTS.md` have 0. The
  inventory is complete.
- **Gates at `7338ee3e`.** The worktree had no `node_modules`. QE symlinked the main checkout's (`package.json` and
  `package-lock.json` `cmp` 0) and removed the link afterwards. Results:
  - `npm run lint` 0 (113 files);
  - `npm run typecheck` 0;
  - `npm run build` 0;
  - `npm test` 0, **58 files, 1792/1792**;
  - skip count `npx vitest run --reporter=json | jq '.numPendingTests + .numTodoTests'` = **0**;
  - `test-skip-integrity.js .grugops/test-skips.md --skip-count 0` → `No findings.`, exit 0.

  No deep lane is triggered: 0 `src/` lines.
- **Merge probe (read-only, `git merge-tree --write-tree main HEAD`).** `main` is 12 commits past `e7d9d657`.
  `plans/board.md` auto-merges. **`plans/traceability.md` conflicts, append against append at the file's tail**: `main`
  adds 2 rows after `:1091`, and the branch adds 3. On `main`, the `ABC-009` board row is at `:1007` and #9 stays at `:438`.
