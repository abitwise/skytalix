---
id: ABC-156
title: "plans/metrics.md's Rework-rate row says 13 backward moves; the source has 15 — ABC-017 and ABC-019 are each one short"
status: backlog
column: Backlog
size: XS
priority: P3
epic: —
feature: —
---

# ABC-156 — `plans/metrics.md:28` undercounts backward moves by two

> **Cut 2026-10-17 by BA/PM** (task `wave-2026-09-25`, subtask `bapm-amend-ABC-039`), as the follow-up to the
> `ABC-039` `A3` ruling (option (a)). **A record ticket: zero production lines.** Evidence:
> `.grugops/context/ticket-to-pr-ABC-039/notes/…observation-chronology-cdf60868.md` (SE) and
> `.grugops/context/bapm-amend-ABC-039/notes/` (BA/PM re-derivation).

## Problem

*User*: the Factory Coach and anyone who reads the retro numbers. Its role cites values from `plans/metrics.md`
and never re-derives them. *Pain*: the live Rework-rate row (`:28`, written by `3215004c`) says **13 backward
moves, 0.52 per ticket**. Every board move present at that commit gives **15**. The undercount is in two tickets:
`ABC-017` is listed as 1 but made 2 (`5d387e60` In Review → In Development, `e22ed720` In Security/NFR → In
Development), and `ABC-019` is listed as 2 but made 3 (`9e7d9ab7`, `8cc4d8c3`, `c6ea796d`). The same row also says
*"Every backward-move ordinal from `ABC-009` onward is off by one"*, and `ABC-039` `A4` refutes that: a uniform `+1`
gives `2, 3, 3, 4`. *Value*: the one live measurement of rework becomes true. The error is an undercount, so the
2026-08-12 retro's conclusion (rework concentrated late) is understated, not reversed. No ruling flips.

## Scope

**One row of `plans/metrics.md` (`:28`, re-resolve by `| Rework rate |`), plus one `_Updated:` header line.** Owner of
the file: the Factory Coach (Workflow 11). Use the same window as `ABC-039` `A3`: moves made by a commit at or before
`3215004c`.

## Out of scope

- Any other metrics row, the metric set, and the row's defect (2) (`EPIC-001` front matter). That is a separate claim
  and is not re-measured here.
- The `ABC-039` register itself, any history file, and any `Done` ticket page.
- Re-running or amending the 2026-08-12 retro or Process Rule 1. The control's threshold is the absolute value
  `< 0.5/ticket`, not this baseline.

## Acceptance (Given/When/Then)

**A1 — the total. Given** `plans/metrics.md` after the change, **then** `grep -c "13 backward moves in total"` → **0**,
and the row states **15 backward moves** and **0.60 per ticket** (15 / 25). `9 of 25` `Done` tickets is unchanged,
because both tickets were already counted.

**A2 — the per-ticket counts. Then** the row reads `ABC-017` **2** and `ABC-019` **3**, every other per-ticket count is
unchanged, and the per-ticket counts sum to **15**. That sum equals the row count of the chronology in
`plans/tickets/history/backward-move-ordinals.md` (`ABC-039`).

**A3 — the refuted remedy. Then** `grep -c "off by one" plans/metrics.md` → **0**, and the row names
`plans/tickets/history/backward-move-ordinals.md` as the corrected ordinals.

**A4 — the trend clause is re-derived, not patched.** The clause *"the last ten produced 7 bounced tickets and 11
moves"* is recomputed from the `ABC-039` chronology and the order tickets reached `Done` at `3215004c`, and the row
states the method in one clause. The new values are **`UNKNOWN - verify`**: they are 13 only if both `ABC-017` and
`ABC-019` fall in the last ten.

**A5 — nothing else moved.** Under `plans/`, `src/` and `memory-bank/`, `git diff --numstat` against the branch point
shows only `plans/metrics.md` (row `:28` changed, one `_Updated:` line added, **0 other lines**), this page, and
`plans/traceability.md` with **0 deletion lines**.

## Dependencies

- **Blocked by `ABC-039` merging.** `A2` and `A3` cite its register. `ABC-039` does not wait on this ticket.

## Security / NFR triggers

**NONE FIRE.** Threshold: any production line or any new file under `src/`. Measured zero: `git diff --numstat -- src/`
must be empty. `N8-LANE` delta is zero by construction (no test file touched).

## Test notes

1. The unit is the individual backward column move, as in `ABC-039` Test note 1, not the ticket that moved.
2. A likely cause, `UNKNOWN - verify`: the row's method de-duplicated "by ticket and date", which can fold two
   same-day moves of one ticket into one. Do not reuse that method. Count commits.
3. `ca6c4243` (`ABC-028`) has a record date of 08-13 and a git date of 2026-08-12. It is inside the window, which is
   why `ABC-028`'s 3 already matches.

## Size and priority rationale

**`XS` (1):** one table row with the derivation already done by `ABC-039`. **`P3`:** nothing computes on it, and the
error understates rework rather than flipping any conclusion. **Raise to `P2` if** any hop cites `:28`'s 13 or 0.52
as evidence in a ruling before this ticket merges.

## Definition of Ready

**10/10, 2026-10-17 (BA/PM):** 1 ✅ user/pain/value · 2 ✅ one row, exclusions named · 3 ✅ INVEST (depends only on a
merged `ABC-039`) · 4 ✅ five criteria, each a grep count, a sum or a numstat · 5 ✅ `ABC-039` · 6 ✅ none, threshold
measured · 7 ✅ · 8 ✅ `XS` · 9 ✅ `P3` with a raise trigger · 10 ✅ no owner word needed. **Placement requested:
`Backlog`** until `ABC-039` merges. The board is the Orchestrator's.

## Delivery — 2026-10-17 (Software Engineer, subtask `ticket-to-pr-ABC-156`)

Branch `grugops/ABC-156-metrics-rework-count`, cut from `ac7d9589`. One row of `plans/metrics.md` changed and one
`_Updated:` line added. No timing was read. Notes: `.grugops/context/ticket-to-pr-ABC-156/notes/`.

- **Re-derived first.** The register's chronology has 15 rows. All 15 commits pass
  `git merge-base --is-ancestor <c> 3215004c`. The five `ABC-017`/`ABC-019` commits were checked on the board
  (section before → after): `5d387e60` and `e22ed720` (`ABC-017`), `9e7d9ab7`, `8cc4d8c3` and `c6ea796d` (`ABC-019`),
  each → `In Development`.
- **`A1` MET.** `grep -c "13 backward moves in total"` → 0. The row says 15 backward moves and 0.60 per ticket
  (15 / 25). `9 of 25` is unchanged.
- **`A2` MET.** `ABC-017` **2**, `ABC-019` **3**, and the other seven are unchanged. The per-ticket counts sum to 15,
  which is the chronology row count. Per-ticket `uniq -c` over the chronology matches the row for all nine tickets.
- **`A3` MET.** `grep -c "off by one" plans/metrics.md` → 0. The row names
  `plans/tickets/history/backward-move-ordinals.md` as the corrected ordinals.
- **`A4` MET: 7 bounced tickets, 13 moves.** Done order is the commit at which each ticket first entered
  `plans/board.md`'s `## Done`, walked over every `plans/board.md` commit up to `3215004c`. The last ten are
  `ABC-022`, `-023`, `-013`, `-025`, `-016`, `-027`, `-017`, `-019`, `-028`, `-029`. `ABC-013`'s exit and re-entry
  (`47b5b935`) do not change its place. The 11th from the end is `ABC-009` (`e6440393`, before `ABC-022`'s
  `b2d3554a`), and the board's `Done` list order at `3215004c` agrees. Both `ABC-017` and `ABC-019` are in the
  last ten, so the value is 13. The first ten are still 1 ticket and 1 move (`ABC-011`).
- **`A5` MET.** See the `git diff --numstat` reading in the notes. `plans/metrics.md` is 2/1 (row `:28` replaced, header
  inserted at `:2`). There is this page and `plans/traceability.md` with 0 deletions, and nothing under `src/` or
  `memory-bank/`.
- **Flag.** The new `_Updated:` line sits directly above the old one with no blank line between them, because a
  blank line would be a second added line under `A5`. In rendered Markdown the two header lines run together.
- **Gates on the change.** Lint exit 0 (113 files), typecheck 0, build 0. `npm test` exit 0 on 58 files, 1810/1810.
  `last-run.json` has `success` true and 0 pending/todo. Skip-integrity `--skip-count 0` gives `No findings.`
