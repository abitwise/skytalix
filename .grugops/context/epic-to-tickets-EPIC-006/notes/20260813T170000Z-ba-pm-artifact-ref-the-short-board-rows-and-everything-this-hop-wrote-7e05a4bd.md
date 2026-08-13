---
id: 20260813T170000Z-ba-pm-artifact-ref-the-short-board-rows-and-everything-this-hop-wrote-7e05a4bd
kind: artifact-ref
by: ba-pm
at: 2026-08-13T17:00:00Z
verified_by:
confidence: high
refs:
  - EPIC-006
  - ABC-041
  - ABC-042
  - ABC-043
  - ABC-044
  - ABC-045
  - ABC-046
  - plans/board.md
  - plans/traceability.md
  - plans/epics/EPIC-006-game-session-and-packaging.md
supersedes:
---

# The board rows I want placed — SHORT, one line each — and every file this hop wrote

> **Hand-authored, no stamp.** `plans/board.md` is the Orchestrator's and **I did not write it.** The
> rows below are one line each and are meant to be taken **verbatim**; the detail is on the tickets,
> which is that file's own rule. **The last hop's full-length rows were not taken and the reason is on
> the board; these are written to be taken.**

## Six rows for `## Backlog`, verbatim

```
- [ABC-041] Render-seam closure — four merged modules become one `RenderSeam`  (BA/PM, S, P0, epic: EPIC-006, since: 2026-08-13, **DoR 10/10 — the only pullable ticket in this epic**; takes render/status-panel/history-pane from 0 production importers to >= 1; 1 new test file)
- [ABC-042] The entry point — argv, the resolved colour, and the first frame  (BA/PM, M, P0, epic: EPIC-006, since: 2026-08-13, DoR 8/10 ⚠️x1 blocker — waits on ABC-041 only. **THE THIN SLICE: `npm run` prints a BOARD, not a GAME**; 1 new test file, the heaviest either epic adds)
- [ABC-043] The live session — runTurnLoop wired, and [D31]'s top-level handler  (BA/PM, M, P0, epic: EPIC-006, since: 2026-08-13, DoR 7/10 ⚠️x2 blockers — ABC-037 open and **no EngineSeam exists anywhere**; carries [D31]'s EPIC-006 half, RULED; 0 new test files)
- [ABC-044] The result screen — eight reasons, two faults, the full move list  (BA/PM, S, P1, epic: EPIC-006, since: 2026-08-13, DoR 8/10 ⚠️x1 blocker — waits on ABC-043; **the reason count is SETTLED at eight**; 1 new test file)
- [ABC-045] `resign` — the one session command merged contracts already express  (BA/PM, XS, P1, epic: EPIC-006, since: 2026-08-13, DoR 8/10 ⚠️x1 blocker — ordering only: ABC-035 + ABC-037 + ABC-043; 0 new test files)
- [ABC-046] `quit` + `new` — the two commands the merged loop has no arm for  (BA/PM, S, P2, epic: EPIC-006, since: 2026-08-13, DoR 7/10 ⚠️x2 blockers — **blocked by a RULING, owner Architect/Design**, not by an ordering; drop-first if this epic runs long; 0 new test files)
```

## One replacement row for the existing `[EPIC-006]` line

```
- [EPIC-006] Game session and packaging  (owner: BA/PM, **size: L — corrected from M, 13 points over six tickets**, priority: P1, since: 2026-07-22, **DECOMPOSED 2026-08-13 into ABC-041…ABC-046 — the RUNNABLE half only. Packaging, difficulty and `undo` NOT cut; distribution stays with a human. Largest ticket is M, no SPLIT_REQUIRED**)
```

## The one sequencing fact the Orchestrator needs and the rows cannot carry

**`ABC-041` is pullable today; `ABC-042` the moment it merges; nothing else in this epic is pullable
at all.** `ABC-043`, `ABC-044`, `ABC-045` and `ABC-046` all wait on `EPIC-003`'s `ABC-037` or on a
ruling. **Every WIP column is empty**, so there is room.

> **One stale figure on the board, flagged rather than propagated — that file is the Orchestrator's
> and its fix is not mine.** The `_Updated:` header says *"`Ready` is 2/8"*. The column itself reads
> `## Ready (WIP 0/8)` **with no rows under it**, checked this hop, and `Blocked` is empty. **The
> column is the WIP truth; the header line is stale.**

## Everything this hop wrote

**Created — `plans/tickets/`:**

- `ABC-041-render-seam-closure.md` (223 lines)
- `ABC-042-entry-point-argv-and-the-first-frame.md` (300)
- `ABC-043-the-live-session.md` (244)
- `ABC-044-the-result-screen.md` (216)
- `ABC-045-resign.md` (156)
- `ABC-046-quit-and-new.md` (209)

**Edited — four surgical changes, no rewrite:**

- `plans/epics/EPIC-006-game-session-and-packaging.md` — front-matter `size: M` → `L`; a
  `## DECOMPOSED 2026-08-13` section; the reason count settled inside the existing 2026-07-31
  amendment block; epic acceptance criterion #3 amended *"six"* → *"eight"* **as that amendment
  instructed**. **The `P2` → `P1` raise block above it is untouched.**
- `plans/traceability.md` — **six rows appended after `ABC-040`'s, one `_Updated:` header line
  prepended. `git diff --numstat` = 8 insertions, 0 deletions — purely additive.** The duplicate
  `ABC-028` / `ABC-029` pairs were **deliberately not touched**: they are `ABC-040`'s, and both still
  read 2 occurrences each, checked after the write.

**Created — `.grugops/context/epic-to-tickets-EPIC-006/notes/`:** this note plus five others —
the decomposition decision, the four check-me findings, `[D31]`'s second half and the exit-code rule,
the lane-budget arithmetic, and what was refused. **Six notes; no `finding`; no stamp; no derived
`index.md` / `index.jsonl`** — the tool that renders them does not exist and none was hand-faked.

**Queue — `.grugops/queue/`:** `pending/epic-to-tickets-EPIC-006.md` → `claimed/…/` → `done/…/`, per
Workflow 17, the claim made by a bare `mkdir` because `scripts/claim.js` does not exist.

## What this hop did NOT write, deliberately

`plans/board.md` (Orchestrator's) · `plans/metrics.md` (the Coach lane's) · `plans/nfr-catalog.md`
(no target moved, and the lane figures are **restated by arithmetic**, never re-measured) ·
`vitest.config.ts` · any ADR · any `Done` ticket · `AGENTS.md` (the concurrent Scribe lane's — its
`Dev / run` line is `ABC-042`'s to fill **at build time, having run the command**) · **any file under
`src/`: zero production lines and zero test lines.**

## Branch state at the end of the hop

`grugops/epic-to-tickets-EPIC-006`, branched from `main` at `6375fae`. **`main` advanced to `e1a44d2`
while this hop ran** — the AGENTS.md Scribe lane's § Process rules, one commit. **This branch is 1
behind and 0 ahead of `main` on that file; there is no conflict** (the Scribe wrote `AGENTS.md`, this
hop did not). **I did not rebase and did not merge** — the Orchestrator sequences that. **Rule 2 from
that commit is honoured by these six tickets: median 219.5 lines against a ≤ 300 bar.**
