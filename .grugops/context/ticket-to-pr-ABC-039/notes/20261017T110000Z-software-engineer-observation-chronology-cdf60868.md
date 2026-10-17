---
id: 20261017T110000Z-software-engineer-observation-chronology-cdf60868
kind: observation
by: software-engineer
at: 2026-10-17T11:00:00Z
verified_by:
confidence: high
refs:
  - ticket-to-pr-ABC-039
  - ABC-039
  - plans/metrics.md
  - plans/board.md
supersedes:
---

# The backward-move chronology, derived from source, is 15 moves; metrics.md says 13

Base `e7d9d657`. Two independent methods agree.

**Method 1 (structural):** walk every commit touching `plans/board.md` up to `3215004c` (the
commit that wrote `plans/metrics.md:28`), parse ticket -> column section, flag any ticket whose
section moves earlier. 16 hits; one (`47b5b935`, ABC-013 Done -> Ready for UAT) is the correction of
a false merge record, not a move. 15 remain.

**Method 2 (prose):** each hit matched to its dated record (file:line at `e7d9d657`):

| # | ticket | date (record) | from -> to | file:line | commit |
|---|---|---|---|---|---|
| 1 | ABC-011 | 08-03 | Ready for UAT -> In Design | ABC-011-board-history.md:1338 | b44b679c |
| 2 | ABC-009 | 08-09 | Ready for UAT -> In Review | ABC-009-board-history.md:814 | c71c9ba9 |
| 3 | ABC-025 | 08-10 | Ready for UAT -> In Development | ABC-025-board-history.md:37 | 22549f6f |
| 4 | ABC-016 | 08-11 | In Review -> In Development | ABC-019-board-history.md:24 | 0b6e1fd7 |
| 5 | ABC-019 | 08-11 | In Review -> In Development | ABC-016-board-history.md:52 | 9e7d9ab7 |
| 6 | ABC-016 | 08-11 | In Review -> In Development | ABC-016-board-history.md:76 | 3fa06f8e |
| 7 | ABC-019 | 08-11 | In Review -> In Development | ABC-016-board-history.md:82 | 8cc4d8c3 |
| 8 | ABC-027 | 08-12 | In Security/NFR -> In Development | ABC-017-board-history.md:18 | 9fb55db3 |
| 9 | ABC-017 | 08-12 | In Review -> In Development | plans/board.md:992 (task abc017-d23) | 5d387e60 |
| 10 | ABC-017 | 08-12 | In Security/NFR -> In Development | ABC-017-board-history.md:24 | e22ed720 |
| 11 | ABC-019 | 08-11 (task abc019-rebase-2026-08-12) | In Review -> In Development | ABC-019-board-history.md:63 | c6ea796d |
| 12 | ABC-028 | 08-12 | In Review -> In Development | ABC-028-board-history.md:35 | e9027480 |
| 13 | ABC-029 | 08-12 | In Review -> In Design | ABC-028-board-history.md:41 | 1adbb8c4 |
| 14 | ABC-028 | 08-12 | In Review -> In Development | plans/board.md:989 (quality-gate-ABC-028-final) | 1e70dc2f |
| 15 | ABC-028 | 08-13 | In Review -> In Development | ABC-019-board-history.md:99 | ca6c4243 |

Order is git commit order (record dates and git dates disagree by about a day on 08-11/08-12).

Per ticket, source vs `plans/metrics.md:28`: ABC-017 **2 vs 1**, ABC-019 **3 vs 2**, ABC-028 3 vs 3
(only if the 08-13 move counts); all others equal. In the window through 2026-08-12 the source count
is **14**; counting everything present at the metrics commit it is **15**. Neither is 13.

The corrected ordinals do not depend on this: all disputed moves fall after position 5. ABC-009 = 2,
ABC-025 = 3, ABC-016 (08-11, first) = 4, ABC-019 (08-11, first) = 5.
