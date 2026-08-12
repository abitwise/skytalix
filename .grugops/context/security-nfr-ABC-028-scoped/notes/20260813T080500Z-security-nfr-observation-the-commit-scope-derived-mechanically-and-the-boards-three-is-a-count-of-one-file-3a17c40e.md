---
id: 20260813T080500Z-security-nfr-observation-the-commit-scope-derived-mechanically-and-the-boards-three-is-a-count-of-one-file-3a17c40e
kind: observation
by: security-nfr
at: 2026-08-13T08:05:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-029
  - ABC-019
  - plans/board.md
  - src/history-pane.test.ts
  - src/history-pane.nfr.test.ts
  - src/turn-loop.ts
supersedes:
---

# `ABC-028`'s own commits are **FOUR**, derived mechanically from what each commit itself committed — and the board's **"three"** is a count of one FILE's commits, not the ticket's

> **`kind: observation`, not `finding`.** There is no `§14-gate` verdict record under this task and
> `context.human_admission` is **`off`**, so no note on this hop is a `finding` and **no stamp was
> invented**. `confidence: high` refers to the measurements: every number below was RUN on this tree
> at this hop, and none is transcribed from the brief or from the board.

**Tree: the main working tree, `HEAD` `0ee148e`, branch `grugops/abc028-owed-2026-08-12`, which is
byte-identical to `main` (`git branch -vv` shows both at `0ee148e`). Nothing was built here and
nothing under `src/` was written — a QE re-gate is live in a second worktree.**

## The range, first, because a scope argument that starts from the wrong range is decoration

```
95086ae..a92d0fa    71 commits, MERGE COMMITS 0     (the fast-forward the board records)
95086ae..0ee148e    72 commits                       (a92d0fa + the post-merge board commit)
95086ae is an ancestor of HEAD                       git merge-base --is-ancestor -> yes
of those 72, commits touching src/:  11
```

**The board's `71 commits, no merge commit` is EXACT.** I re-derived it rather than quoting it,
because the whole point of this hop is that a scope sentence has to be measured.

## The attribution method — the commits attribute THEMSELVES, so I did not have to read prose

Every hop on this project commits its own queue record and its own context notes **in the same
commit** as its `src/` edit. So the `.grugops/queue/**` and `.grugops/context/**` paths inside a
commit **name the subtask that made it**. That is a mechanical signal: it does not depend on my
reading of a commit message, and it cannot be fooled by a commit that merely *mentions* another
ticket.

| commit | task id it committed | `src/` files it touched | owner |
|---|---|---|---|
| `8de988d` | `ticket-to-pr-ABC-028-dev` | `history-pane.test.ts`, `history-pane.nfr.test.ts` | **`ABC-028`** |
| `26e452f` | `ticket-to-pr-ABC-028-a5` | `history-pane.test.ts` | **`ABC-028`** |
| `593ba70` | `ticket-to-pr-ABC-028-a5-comment` | `history-pane.nfr.test.ts` | **`ABC-028`** |
| `1ae7b8f` | `ticket-to-pr-ABC-028-t493` | `history-pane.test.ts` | **`ABC-028`** |
| `b7e1226` | `ticket-to-pr-ABC-029-dev` | `history-pane.nfr.test.ts`, **`history-pane.ts`** | `ABC-029` |
| `f31e2e7` | `ticket-to-pr-ABC-029-containment` | `history-pane.nfr.test.ts` | `ABC-029` |
| `7084c5e` | `ticket-to-pr-ABC-029-witnesses` | `history-pane.nfr.test.ts` | `ABC-029` |
| `d83a7e4` | **none** | `turn-loop.ts`, `turn-loop.test.ts`, `turn-loop.nfr.test.ts` | `ABC-019` |
| `097df8f` | `ticket-to-pr-ABC-019-a9b` | `turn-loop.ts`, `turn-loop.test.ts` | `ABC-019` |
| `57e11c2` | `ticket-to-pr-ABC-019-a10b` | `turn-loop.ts`, `turn-loop.test.ts` | `ABC-019` |
| `c121569` | `ticket-to-pr-ABC-019-a20-cl9f` | `turn-loop.test.ts` | `ABC-019` |

**4 + 3 + 4 = 11. The partition is exhaustive and disjoint: not one `src/`-touching commit in the
range is unattributed, and not one is claimed twice.** `d83a7e4` is the single commit carrying no
queue record; it is attributed by its files (`turn-loop*` only, the module `ABC-019` created) and by
its position in the `ABC-019` chain, and **nothing about it is `ABC-028`'s under any reading**.

**So `ABC-028`'s own scope is exactly:**

```
8de988d  26e452f  593ba70  1ae7b8f
```

## The board says THREE. It is wrong, and I can name where the three came from

**Measured:** exactly **three** commits in the range touch `src/history-pane.test.ts` —
`8de988d`, `26e452f`, `1ae7b8f`. The fourth, **`593ba70`**, is `A5`'s **COMMENT half** and touches
only `src/history-pane.nfr.test.ts`.

**So "its own three commits" is a count of ONE FILE'S commits wearing a ticket's name.** It is off by
one commit, and the missing commit is a real hop with its own queue record, its own five published
notes, and its own `+17/−14` in the lane.

**It does not move the verdict** — the threshold does not fire under three commits or four (next
note). **It would have put a wrong sentence in the permanent record**, and *"a figure that is true of
a file being cited as if it were true of the ticket"* is the exact defect class this ticket exists to
kill; its own `## Test notes` 11 is a whole note about it. **Reported plainly, as the brief asked.
`plans/board.md` was NOT opened for edit — it is the Orchestrator's.**

## The obvious wrong method, recorded so nobody re-derives it

`git log --grep='ABC-028' 95086ae..HEAD` returns **31** commits, of which **5** touch `src/`. The
fifth is **`f31e2e7`** — `ABC-029`'s containment build, which merely **cites** `ABC-028` in its
message. **Attribution by mention is over-broad and it pulls another ticket's build into this
ticket's security record**, which is the branch-scope mistake in miniature.

**One thing worth having: the non-trigger is ROBUST to the attribution rule.** Even under the
over-broad 5-commit set, production lines added are **zero** — `f31e2e7` is `nfr.test.ts` only. So a
reviewer who used the wrong method would still have reached the right verdict here, by luck. **Luck
is not a method, and it does not hold for the branch scope, where the same wrong method attributes
314 production lines and three new `src/` files to this ticket.**
