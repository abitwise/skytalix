---
id: 20261017T120500Z-qe-e2e-observation-abc156-independent-rederivation-bb48de4c
kind: observation
by: qe-e2e
task: qe-ABC-156
at: 2026-10-17T12:05:00Z
verified_by:
confidence: high
refs:
  - ABC-156
  - plans/tickets/ABC-156-metrics-rework-rate-undercounts-backward-moves.md
  - ABC-039
  - plans/tickets/history/backward-move-ordinals.md
supersedes:
---

# Independent re-derivation from `plans/board.md` history, taken before reading the SE's notes

Hand-authored and unsealed (`AGENTS.md`: no `finding` is admissible on this install). No timing was read.

**Instrument.** A node walk (scratch, not committed) over every commit that touches `plans/board.md` at or before
`3215004c`: `git rev-list --reverse 3215004c -- plans/board.md` gives **173** commits. `--full-history` also gives 173,
and `git rev-list --merges 3215004c` is **0**, so history simplification hides nothing. For each commit it maps every
`- [ABC-nnn]` row to its `## <column>` section. A backward move is a ticket whose column index falls between two
consecutive board commits, in the order Backlog < Ready < In Analysis < In Design < Ready for Dev < In Development <
In Review < In Security/NFR < Ready for UAT < In UAT < Ready to Release < Done. Moves into or out of `Blocked` are not
ordered and were set aside: all `ABC-019` Blocked events return to `In Development`, and `ABC-013` first appears on the
board in `Blocked` at `03b0a659` with no earlier column. A completeness scan found **0** list rows in any column section,
in any of the 173 commits, that the row pattern did not parse.

**Result: 16 raw backward moves, and they are the register's 15 plus `47b5b935`** (`ABC-013` Done → Ready for UAT). The
register excludes that one as a correction of a false merge record. They are the same commits in the same order. The
only difference is `b44b679c` (`ABC-011`): the board shows `Ready for Dev`, and the register explains that. All 15
commits pass `git merge-base --is-ancestor <c> 3215004c`.

| ticket | moves | commits |
|---|---|---|
| ABC-009 | 1 | `c71c9ba9` |
| ABC-011 | 1 | `b44b679c` |
| ABC-016 | 2 | `0b6e1fd7`, `3fa06f8e` |
| ABC-017 | **2** | `5d387e60` (In Review → In Development), `e22ed720` (In Security/NFR → In Development) |
| ABC-019 | **3** | `9e7d9ab7`, `8cc4d8c3`, `c6ea796d` (each In Review → In Development) |
| ABC-025 | 1 | `22549f6f` |
| ABC-027 | 1 | `9fb55db3` |
| ABC-028 | 3 | `e9027480`, `1e70dc2f`, `ca6c4243` |
| ABC-029 | 1 | `1adbb8c4` |

That is **15 moves over 9 tickets**. At `3215004c` the Done set is **25** `ABC-` rows plus `EPIC-001`, which is not
counted. The rate is 15 / 25 = **0.60**, and 9 / 25 is 36 %.

**Done order (A4).** This is the first commit at which each ticket appears under `## Done`:
1–3 `ABC-008`/`001`/`002` (`0956fe7c`), 4 `003`, 5–8 `004`–`007` (`d53ce31d`), 9 `020`, 10 `011`, 11 `012`, 12 `014`,
13 `015`, 14 `018`, 15 `009` (`e6440393`), 16 `022` (`b2d3554a`), 17 `023`, 18 `013` (`83548598`), 19 `025`,
20 `016`, 21 `027`, 22 `017`, then 23–25 `028`/`029`/`019` together at `0ee148ef`.
- **The last ten are `022`, `023`, `013`, `025`, `016`, `027`, `017`, `028`, `029`, `019`.** They hold 7 bounced
  tickets and 1+2+1+2+3+1+3 = **13 moves**. Both `ABC-017` and `ABC-019` are inside, so the ticket's conditional 13
  holds.
- **The first ten** are `008`, `001`, `002`, `003`, `004`–`007`, `020`, `011`: **1 ticket, 1 move.** The middle five
  are 1 ticket, 1 move (`009`). 13 + 1 + 1 = 15.
- **The boundary holds under every reading.** The 11th from the end is `ABC-009` at `e6440393`, a different commit
  from `ABC-022`'s `b2d3554a`. The three-way tie at `0ee148ef` sits wholly inside the ten. `ABC-013` leaves at
  `47b5b935` and returns at `995d398d`, which is an ancestor of `ABC-025`'s `169e3520`. So taking its re-entry instead
  of its first entry keeps it at position 18. The top ten rows of the `## Done` list at `3215004c` are the same ten.
  That makes three readings, and all three give one set.

These equal the SE's figures on every count (`ticket-to-pr-ABC-156/…-a1560001`), which I read only after this walk.
