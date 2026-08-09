---
id: 20260809T083236Z-ba-pm-observation-f8026fb2
kind: observation
by: ba-pm
at: 2026-08-09T08:32:36Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-018
  - ABC-018
  - ABC-014
  - ABC-015
  - ABC-016
  - ABC-017
  - ABC-019
  - ABC-021
  - EPIC-002
  - EPIC-003
  - RISK-005
  - NFR-002
  - src/render.ts
  - plans/epics/EPIC-002-terminal-board-and-game-loop.md
  - plans/tickets/ABC-018-frame-output-and-redraw.md
  - plans/nfr-catalog.md
  - plans/traceability.md
supersedes: 
---

# What merged `main` and the plan files actually contain — checked at the source, before any ruling

Neutral facts only. Every one was read or run rather than inherited from the Orchestrator's note or
from any ticket's prose. The rulings built on them are in the decision note; nothing here is a
verdict.

## The substrate, re-checked rather than taken on trust

`ls scripts` → `No such file or directory` in the repo, and `ls
/Users/olgeroeselg/.grugops/agent-factory/scripts` → the same in the kit. So `scripts/claim.js`
(Workflow 17 step 2) and `scripts/context-io.ts` (Workflow 16's sanctioned writer) are both absent.
The claim was taken with a plain `mkdir` and this note is hand-written in the schema's exact shape.
**No `finding` is admissible on this task** — there is no §14 gate here to issue a `§14-gate#<id>`
stamp and `context.human_admission` is `off`, so no `human:<name>` stamp exists either. Nothing is
self-stamped and no `index.md` / `index.jsonl` is hand-faked.

## There is no width anywhere in this system

`git grep -n -E "columns|COLUMNS|\bwidth\b" main -- 'src/*.ts' ':(exclude)src/*.test.ts'` returns
**nothing**. `git grep -n "process\.stdout" main -- 'src/*.ts'` returns hits only in
`src/glyph-mode.ts` (`isTTY` and `process.env`) and in test files. `process.stdout.columns` is read
nowhere, is mentioned in no ticket in `EPIC-002`, and **does not exist at all in append mode** —
which is the mode `EPIC-006`'s end-to-end test runs in. This is the Orchestrator's item 1 confirmed
independently.

## The board frame that IS merged

`git show main:src/render.ts` is a 150-line module exporting `renderBoard(position, mode,
orientation): string[]`. Its own header states the geometry: **"always 9 rows of 18 characters"**,
and it records that the layout is the module's choice under `4a`'s *"the exact split is the
engineer's"*. So a panel width exists in exactly one place — 18 characters, in the board — and it is
a comment about one panel, not a frame-level constant.

## `23` has a source, and the ticket's own scope did not sum to it

`EPIC-002` acceptance `4a` carries the reference layout verbatim: *"8 board rows + 1 file-label row
+ 3 status rows + 8 history rows + 2 message rows + **1 prompt row** = 23 rows, which fits a 24-row
terminal."* `ABC-018`'s `## Scope` (as it stood) composed **four** of those five regions — board,
status, history, 2-row message — which is **22**. The ticket's criteria are written against a
23-row frame.

## No ticket owned the prompt row

Grepped for `prompt` across `plans/tickets/ABC-014`, `ABC-016`, `ABC-017`, `ABC-019`, `ABC-021` and
`plans/epics/EPIC-003`. `ABC-014` and `ABC-017`: zero hits. `ABC-016`: two hits, neither a frame
region, and it records that **`ABC-018` owns "all writing"**. `ABC-019` and `ABC-021`: the prompt as
a *loop outcome* and a place a player types a verb, never a frame row. `EPIC-003`: the input surface
(re-prompt, tab-completion). **No ticket claims the row, and the ticket that owns all writing did
not list it.**

## The sibling panels' heights are constants, and their widths are not stated

`ABC-016` — *"a panel renderer that returns a fixed number of rows (three, in the reference
layout)"*. `ABC-017` — *"a pane renderer returning a constant number of rows (8 in the reference
layout)"*, blank-padded, with an acceptance criterion asserting *"identical in count **and width** to
the 0-ply case"* — a self-consistency requirement with no number in it. So the frame's height is
derivable at startup from constants; its **width is not stated anywhere by anyone**.

## `NFR-002` says the bar is the sum, in two places outside the ticket

`plans/nfr-catalog.md`'s `NFR-002` section names the two halves (compute, terminal write), the three
ply counts (40 / 120 / 300) and records the write half as `UNKNOWN - verify`. `plans/traceability.md`'s
`ABC-018` row reads *"frame compute + write < 16 ms at 40/120/300 plies against a non-TTY sink"*.
`ABC-018`'s own `## Security / NFR triggers` reads *"full frame compute + write < 16 ms"*. Its
acceptance criterion read *"each total is < 16 ms"*.

## This repo has no in-repo wall-clock bars, by convention

`src/zobrist.nfr.test.ts:112` states the reason in place: *"a wall-clock assertion would pass or fail
on the machine that runs it"*. `src/glyph-mode.nfr.test.ts` is an I/O-count bar, not a timing one. So
NFR figures here are re-derived out-of-tree at the Security/NFR gate, with the machine recorded —
which is why no median/p95 statistic was added to `ABC-018`'s criterion.

## Both of the board row's constraints are discharged

`ABC-014` is in `Done` and its module is on merged `main` (above). `ABC-015` merged `f1743a3 →
f4d5d31` and is in `Done`. `RISK-005`'s constraint reads *"`ABC-015` merges with or before
`ABC-018`"* — `ABC-015` merged while `ABC-018` was unstarted in `Backlog`, so the constraint is
satisfied **before** this ticket starts and cannot be violated by it. The `Blocked` column is empty.
What survives the constraint is the **build** obligation already written into `ABC-018`'s
`## Dependencies`: the writer takes the glyph mode as an argument from `ABC-015`'s selection
function and must not default it, hardcode it, or re-derive it.
