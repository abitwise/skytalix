---
id: 20260820T171500Z-ba-pm-artifact-ref-what-this-hop-wrote-three-files-one-branch-and-a-trace-row-re-split-from-disk-2b06fa93
kind: artifact-ref
by: ba-pm
role: ba-pm
task: cut-false-sentences-2026-08-20
at: 2026-08-20T17:15:00Z
verified_by:
confidence: high
refs:
  - ABC-114
  - plans/board.md
  - plans/traceability.md
  - plans/tickets/ABC-114-four-false-sentences-in-epic-006s-own-instrument-comments.md
supersedes:
---

# Everything this hop wrote, and the two shape checks I ran afterwards

## Branch

`grugops/cut-false-sentences`, cut from `main` @ `b03658f`. **Nothing committed on `main`, nothing merged,
nothing deployed.** The merge is the Orchestrator's.

## Files written — three, all under `plans/`, none under `src/`

1. **`plans/tickets/ABC-114-four-false-sentences-in-epic-006s-own-instrument-comments.md`** — new.
   **227 lines**, against the project's median-≤-300 prose budget (`AGENTS.md` `## Process rules` 2).
   Measurements and narration are in this task's notes, not on the page.
2. **`plans/board.md`** — `+4 / -0`. One `_Updated:` header at the top (added to, not superseding) and
   one `ABC-114` row at the head of `## Backlog`. **No ticket moved, no WIP count touched, no ticket
   re-scored, nothing archived.**
3. **`plans/traceability.md`** — `+3 / -0`. One `_Updated:` header and **one appended `ABC-114` row**.
   **No row touched in place, no row removed.**

## Shape checks, run AFTER the write and re-read from disk

- **The `ABC-114` trace row: 12 raw pipe-fields, ends with a closing pipe, 10 cells.** Re-split from the
  file on disk after the write, not from the string I composed. A pre-write assertion also rejected any
  literal `|` inside a cell — that is the defect that split a row earlier today.
- **The nine genuinely off-shape rows are still exactly nine.** Counted with
  `awk -F'|' '/^\| ABC-/ && NF!=12'` after the write. **Not touched** — unowned, nine separate decisions,
  and not this ticket's.
- `git diff --numstat` on all three files shows **zero deletions**. Nothing was overwritten.

## Files deliberately NOT written

- Anything under `src/` — **zero**, verified by `git status --porcelain`.
- `plans/tickets/ABC-113-…md` — ruled in scope of `ABC-114` and left alone; see the `decision` note.
- `plans/tickets/ABC-043-the-live-session.md`, `ABC-044`'s page — not opened for writing.
- `.grugops/test-skips.md` — human-owned, absent, and no agent writes a row to it.
- `vitest.config.ts`, `biome.json`, and every lane configuration.

## The one command I ran that produced a number

`npx vitest run --dir src` on `main` @ `b03658f` → **40 test files passed, 1207 tests passed, 0 skipped**,
2.67 s. That is `ABC-114` `A6`'s recorded base, and `A6` orders it re-measured at pull time rather than
quoted from the page.
