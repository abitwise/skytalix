---
id: 20261017T120000Z-ba-pm-observation-abc039-rederived-15-at-3215004c-1055cfc1
kind: observation
by: ba-pm
task: bapm-amend-ABC-039
at: 2026-10-17T12:00:00Z
verified_by:
confidence: high
refs:
  - ABC-039
  - A3
  - plans/metrics.md
  - 20261017T110000Z-software-engineer-observation-chronology-cdf60868
supersedes:
---

# BA/PM re-check of the SE's chronology: it holds at source

Branch `grugops/ABC-039-ordinal-register` tip `6c1257dd`.

- `plans/metrics.md:28` still reads **13 backward moves** and **0.52 per ticket**, with `ABC-017` **1** and `ABC-019` **2**.
  The file's md5 is `1b083e8d…`, and `git log -S"13 backward moves in total"` shows the text was introduced by `3215004c`
  (author date 2026-08-12 23:50, commit date 2026-08-13).
- All 15 of the SE's move commits pass `git merge-base --is-ancestor <c> 3215004c`, and every one has a git commit date
  of 2026-08-12 or earlier. `ca6c4243` (`ABC-028`) has record date 08-13 but git date 2026-08-12 15:51. That is why
  "14 through 08-12" (by record date) and "15 at `3215004c`" both appear. Only the commit window has no judgment call
  in it, and only that window makes `ABC-028` match metrics.md's 3.
- Board diffs checked: `5d387e60` moves `ABC-017` In Review → In Development, and `e22ed720` moves it In Security/NFR →
  In Development, so ABC-017 has **2** moves. `9e7d9ab7`, `8cc4d8c3` and `c6ea796d` each move `ABC-019` In Review →
  In Development, so ABC-019 has **3**.
- `47b5b935` (`ABC-013` Done → Ready for UAT) is the commit "grug wrote merge close before merge ran, that was false,
  grug fix". It corrects a false record and is not a move, so it is excluded.
- Stale cites, re-resolved by quoted text: #1 `plans/board.md:1001`; #9 `plans/traceability.md:438`; #2
  `ABC-009-board-history.md:814` and `815` (wrapped); #3–#8 at `:17`, `:451`, `:786`, `ABC-025-…:37`,
  `ABC-019-…:24`, `ABC-016-…:52`. `grep -c "^- \[ABC-009\]" plans/board.md` → 1.
- The 13 and "last ten: 11 moves" figures were cited as evidence in the 2026-08-12 retro
  (`audit-delivery/notes/…10352950`). Because the error is an undercount, it understates rework and does not reverse
  that retro's conclusion.
