---
id: 20261017T104000Z-qe-e2e-observation-abc039-chronology-derived-blind-b07d333a
kind: observation
by: qe-e2e
task: qe-ABC-039
at: 2026-10-17T10:40:00Z
verified_by:
confidence: high
refs:
  - ABC-039
  - A3
  - plans/tickets/history/backward-move-ordinals.md
supersedes:
---

# QE re-derived the chronology from git before reading the register: 15 moves, the same 15 commits

This is a hand-authored, unsealed note (`AGENTS.md`: no `finding` is admissible on this install).

**Order of work.** QE read the ticket at `e7d9d657` and the `e1a62a6b` amendment, which gives the basis, the window and
the exclusion. QE then walked git and only after that opened `plans/tickets/history/backward-move-ordinals.md`, the SE notes
and the `bapm-amend-ABC-039` notes. The amendment names five of the commits (`ABC-017`, `ABC-019`), so the derivation is
blind to the register but not to that page.

**Method.** A scratch script ran `git rev-list --reverse 3215004c -- plans/board.md` (173 commits, 0 merges). For each
commit it parsed the twelve ordered column sections (`## <Column> (…)`; `Blocked` and the rest are ignored) and the
rows `^- \*{0,2}\[(ABC|EPIC)-\d+\]`. It flagged a ticket whose minimum column index at `C` was below its maximum at
`C^`. Controls: every heading parsed in all 173 commits. Zero row-shaped lines in a column section failed the row
regex. No ticket held two rows in one commit. A second pass that compares against the last-seen column, so it also
catches rows that disappear and come back, gives the same 16 hits.

**Result: 16 hits; without `47b5b935` (`ABC-013` `Done` → `Ready for UAT`, *"grug wrote merge close before merge ran"*), 15.**

| # | ticket | git date | from → to (board) | commit |
|---|---|---|---|---|
| 1 | ABC-011 | 08-03 | Ready for UAT → **Ready for Dev** | `b44b679c` |
| 2 | ABC-009 | 08-09 | Ready for UAT → In Review | `c71c9ba9` |
| 3 | ABC-025 | 08-10 | Ready for UAT → In Development | `22549f6f` |
| 4 | ABC-016 | 08-11 | In Review → In Development | `0b6e1fd7` |
| 5 | ABC-019 | 08-11 | In Review → In Development | `9e7d9ab7` |
| 6 | ABC-016 | 08-11 | In Review → In Development | `3fa06f8e` |
| 7 | ABC-019 | 08-11 | In Review → In Development | `8cc4d8c3` |
| 8 | ABC-027 | 08-11 | In Security/NFR → In Development | `9fb55db3` |
| 9 | ABC-017 | 08-11 | In Review → In Development | `5d387e60` |
| 10 | ABC-017 | 08-11 | In Security/NFR → In Development | `e22ed720` |
| 11 | ABC-019 | 08-11 | In Review → In Development | `c6ea796d` |
| 12 | ABC-028 | 08-12 | In Review → In Development | `e9027480` |
| 13 | ABC-029 | 08-12 | In Review → In Design | `1adbb8c4` |
| 14 | ABC-028 | 08-12 | In Review → In Development | `1e70dc2f` |
| 15 | ABC-028 | 08-12 | In Review → In Development | `ca6c4243` |

Per ticket: 9 tickets. `ABC-009`, `ABC-011`, `ABC-025`, `ABC-027` and `ABC-029` have 1 move each, `ABC-016` and `ABC-017`
have 2 each, and `ABC-019` and `ABC-028` have 3 each. The ordinals are `ABC-009` = 2, `ABC-025` = 3, the first `ABC-016` = 4
and the first `ABC-019` = 5.

**Comparison with the register (opened afterwards).** The 15 commits match in the same order, and so do ticket and from-column on
all 15 rows. To-column matches on 14. On row 1 the register writes *"In Design (board shows Ready for Dev; design ruled in
the same commit)"*, which records both readings (`QE-039-c`). `git merge-base --is-ancestor <c> 3215004c` exits 0 for all
15. Their positions in `git log --reverse 3215004c -- plans/board.md` (32, 65, 101, 115, 116, 122, 124, 129, 134, 139, 144,
152, 153, 164, 167) are strictly increasing, so the register is in git commit order. The SE's structural walk
(`…5b7e21a4`) reported the same 16 hits, so two walks agree. BA/PM (`…1055cfc1`) re-checked the SE's 15 commits at source
but did not run its own walk.
