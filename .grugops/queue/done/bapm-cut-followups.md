---
result: DONE
branch: grugops/bapm-cut-followups
tip: eeecb11c
base: 1671f24f
worktree: /Users/olgeroeselg/Projects/hacks/grugops-examples/wt-bapm-followups
---

BA/PM bapm-cut-followups: 15 follow-ups re-measured at 1671f24f (scratch copies outside the repo, no timing read).
9 tickets cut, ABC-146 amended (item 13 folded into it), the rest closed with reasons. One commit, eeecb11c:
9 new pages, the ABC-146 amendment (+88 lines), 9 trace rows (each 10 cells by the GFM rule), 2 notes in
`.grugops/context/bapm-cut-followups/notes/` (readings `…85e8dfdd`, dispositions `…834e04b8`). Lint 0 (113 files).
`git merge-tree --write-tree main` (4fcfd519) is clean. Not touched: plans/board.md, AGENTS.md, src/, the ABC-096 page.

New tickets (front matter Backlog; DoR 10/10 each; recommended column Ready, which read 0/8 at 1671f24f):

| id | title | size | prio | DoR | column | pull order |
|---|---|---|---|---|---|---|
| ABC-157 | The castling right test can be weakened to read ANY right; a build that castles on the other wing's or the opponent's right passes the default lane | XS | P2 | 10/10 | Backlog -> Ready | any |
| ABC-158 | AR-1's recorded checks miss four import forms, and pin neither "no loader flag" nor "no non-dev dependency" | XS | P3 | 10/10 | Backlog -> Ready | any (Release Manager) |
| ABC-159 | Four *.nfr.test.ts headers carry a running tally of the catalog in words, and the tallies disagree | XS | P3 | 10/10 | Backlog -> Ready | after ABC-096 merges |
| ABC-160 | The book sha256 test never offers a hash that differs only in its FIRST character | XS | P3 | 10/10 | Backlog -> Ready | any |
| ABC-161 | Three src/cli.test.ts rows a wrong difficulty build passes (level per move, /m regex, slot drops a value) | XS | P3 | 10/10 | Backlog -> Ready | after ABC-096 merges |
| ABC-162 | ABC-095 A7's real-engine child runs from the tree root, so a cwd-relative book read passes CLI_DEEP | XS | P3 | 10/10 | Backlog -> Ready | any |
| ABC-163 | The clause (b) instrument fires nothing when a limb-1 holder changes what it reads: fold ADR-0036 Ruling 2 | S | P3 | 10/10 | Backlog -> Ready | any (Architect/Design) |
| ABC-164 | AGENTS.md sits at exactly 24,576 B with two stale test receipts | XS | P3 | 10/10 | Backlog -> Ready | after ABC-096 merges (Scribe) |
| ABC-165 | Ten trace rows do not split into ten columns, the malformation paragraph is stale, a metrics header runs on | S | P3 | 10/10 | Backlog -> Ready | any; run at the tip |

ABC-146: amended (A0 paired factor reading, route V when 10 h x F_hi <= 13 h, else route N; A7 ADR-0038 headings).
Re-scored 8/10 -> 10/10, XS/P1 unchanged, recommended Backlog -> Ready.

Closed: QE2-101-a, QE2-101-b, AR-095-READ, QE-095-b/c/d/e/i/k/l, the ADR-0043 units note. Reasons in `…834e04b8`.

Owner questions (neither blocks): (1) ABC-146 "fits the band": worst of five pairs (on the page) or median?
(2) optional: should a regenerated src/__snapshots__/*.snap alone keep the zero-production-lines UAT waiver?
